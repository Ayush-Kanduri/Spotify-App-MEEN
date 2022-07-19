const { validationResult } = require("express-validator");
const User = require("../models/user");
const Genre = require("../models/genre");
const GenreUserRelation = require("../models/genreUserRelation");
const Friendship = require("../models/friendship");
const Like = require("../models/like");
const Playlist = require("../models/playlist");
const fs = require("fs");
const path = require("path");
const queue = require("../config/kue");
const userEmailWorker = require("../workers/user_email_worker");
const usersMailer = require("../mailers/users_mailer");
const bcrypt = require("bcrypt");
const Queue = require("../models/queue");

module.exports.share = (req, res) => {};

module.exports.verifyEmail = async (req, res) => {
	try {
		const accessToken = req.query.accessToken;
		if (!accessToken) return res.redirect("/");
		if (accessToken === null) return res.redirect("/");
		if (accessToken === undefined) return res.redirect("/");
		const users = await User.find({});
		for (let user of users) {
			const id = user._id.toString();
			const result = await bcrypt.compare(id, accessToken);
			if (result) {
				if (user.emailVerified) {
					req.flash("error", "Email Already Verified !!!");
					return res.redirect("/");
				}
				user.emailVerified = true;
				await user.save();
				req.flash("success", "Email verified successfully !!!");
				return res.render("verify_email", {
					title: "Account Verification",
				});
			}
		}
		return res.redirect("/");
	} catch (error) {
		return res.redirect("/");
	}
};

module.exports.library = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("playlists");
		const likedAlbums = await Like.find({
			user: req.user.id,
			onModel: "Album",
		}).populate("likeable");
		const likedArtists = await Like.find({
			user: req.user.id,
			onModel: "Artist",
		}).populate("likeable");
		const likedTracks = await Like.find({
			user: req.user.id,
			onModel: "Track",
		}).populate({
			path: "likeable",
			populate: [
				{
					path: "artist",
				},
				{
					path: "album",
				},
			],
		});
		let likedPlaylists = await Like.find({
			user: req.user.id,
			onModel: "ExistingPlaylist",
		}).populate("likeable");

		let createdPlaylists = user.playlists;

		likedPlaylists = likedPlaylists.filter((like) => like.likeable !== null);
		likedPlaylists = likedPlaylists.map((like) => like.likeable);
		createdPlaylists = createdPlaylists.filter(
			(playlist) => playlist !== null
		);
		const tracks = likedTracks.map((like) => {
			return like.likeable;
		});
		const artists = likedArtists.map((like) => {
			return like.likeable;
		});
		const albums = likedAlbums.map((like) => {
			return like.likeable;
		});

		return res.render("user_library", {
			title: "Your Library",
			ePlaylists: likedPlaylists,
			playlists: createdPlaylists,
			tracks: tracks,
			artists: artists,
			albums: albums,
		});
	} catch (error) {
		console.log(error);
		req.flash("error", "Error in fetching the library songs !!!");
		return res.redirect("back");
	}
};

module.exports.likedSongs = async (req, res) => {
	try {
		const likedTracks = await Like.find({
			user: req.user.id,
			onModel: "Track",
		}).populate({
			path: "likeable",
			populate: {
				path: "artist",
			},
		});

		return res.render("liked_songs", {
			title: "Liked Songs",
			likedTracks: likedTracks,
		});
	} catch (error) {
		console.log("Error in fetching the liked songs !!!");
		req.flash("error", "Error in fetching the liked songs !!!");
		return res.redirect("back");
	}
};

module.exports.profile = async (req, res) => {
	try {
		const id = req.params.id;
		let iAmFollowing = false;

		const user = await User.findById(id);

		const followersList = await Friendship.find({
			to_user: req.user.id,
		}).populate({
			path: "from_user",
			select: "-password -__v",
		});

		let followers = followersList.map((friendship) => {
			return friendship.from_user;
		});

		const followingList = await Friendship.find({
			from_user: req.user.id,
		}).populate({
			path: "to_user",
			select: "-password -__v",
		});

		let following = followingList.map((friendship) => {
			return friendship.to_user;
		});

		const friendship = await Friendship.findOne({
			from_user: req.user._id,
			to_user: user._id,
		});

		if (friendship) iAmFollowing = true;

		return res.render("user_profile", {
			title: "Profile",
			profile_user: user,
			followers: followers,
			following: following,
			iAmFollowing: iAmFollowing,
		});
	} catch (error) {
		console.log(error);
		req.flash("error", "Error in fetching the user profile !!!");
		return res.redirect("back");
	}
};

module.exports.update = async (req, res) => {
	try {
		let users = await User.find({});
		if (users.length === 0) {
			const files = await fs.promises.readdir(
				path.join(__dirname, "..", User.avatarPath)
			);
			for (let file of files) {
				fs.unlinkSync(path.join(__dirname, "..", User.avatarPath, file));
			}
		}
	} catch (error) {
		console.log(error);
	}
	if (req.params.id == req.user.id) {
		try {
			let user = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, (err) => {
				if (err) {
					console.log("Error in Multer: ", err);
					return res.redirect("back");
				}

				user.name = req.body.name;
				user.email = req.body.email;
				user.password = req.body.password;

				if (req.file) {
					if (user.avatar) {
						if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
							fs.unlinkSync(path.join(__dirname, "..", user.avatar));
						}
					}
					user.avatar = User.avatarPath + "/" + req.file.filename;
				}

				user.save();
				req.flash("success", "Profile Updated !!!");
				return res.redirect("back");
			});
		} catch (error) {
			req.flash("error", "Error in updating the Profile!");
			return res.redirect("back");
		}
	} else {
		req.flash("error", "Unauthorized Access!");
		return res.redirect("back");
	}
};

module.exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	return res.render("user_sign_in", {
		title: "Login",
	});
};

module.exports.signup = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	return res.render("user_sign_up", {
		title: "Sign Up",
	});
};

module.exports.recommendations = async (req, res) => {
	try {
		let user = await User.findById(req.user.id);
		for (let key in req.query) {
			let genre = await Genre.findById(req.query[key]);
			let genreUserRelation = await GenreUserRelation.create({
				genre: genre._id,
				user: user._id,
			});
			await user.genreUserRelations.push(genreUserRelation);
			await genre.genreUserRelations.push(genreUserRelation);
			await user.save();
			await genre.save();
		}
		let newUser = user.toObject();
		const saltRounds = 10;
		newUser.accessToken = newUser._id.toString();
		newUser.accessToken = await bcrypt.hash(newUser.accessToken, saltRounds);
		newUser.url = `${req.protocol}://${req.get(
			"host"
		)}/users/verify_email/?accessToken=${newUser.accessToken}`;
		delete newUser._id;
		delete newUser.password;
		let job = queue
			.create("accountVerificationEmails", newUser)
			.save((err) => {
				if (err) {
					console.log("Error in adding the Job to the Queue: ", err);
					return;
				}
			});
		req.flash("success", "Logged In Successfully !!!");
		return res.redirect("/");
	} catch (error) {
		console.log("Error in creating the user: ", error);
		req.flash("error", "Error in Logging in !!!");
		return res.redirect("/users/logout");
	}
};

module.exports.createSession = async (req, res) => {
	// req.session.playlists = req.body.playlists;
	// req.body = {};
	try {
		let genres = await Genre.find({});
		if (
			req.user.genreUserRelations.length === 0 ||
			req.user.genreUserRelations === undefined
		) {
			return res.render("recommendations", {
				title: "Music Preferences",
				all_genres: genres,
				BG: "images/gradient1.jpg",
			});
		}
		req.flash("success", "Logged In Successfully !!!");
		return res.redirect("/");
	} catch (error) {
		console.log(error);
		req.flash("error", "Error in creating the session !!!");
		return res.redirect("back");
	}
};

module.exports.destroySession = (req, res) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged Out Successfully !!!");
		return res.redirect("/");
	});
};

module.exports.createUser = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = errors.array();
			console.log(error[0].msg);
			return res.redirect("back");
		}

		if (req.body.password !== req.body.confirm_password) {
			console.log("Password didn't match !!!");
			// req.flash("error", "Password didn't match !!!");
			return res.redirect("back");
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			console.log("Email already exists !!!");
			// req.flash("error", "Email already exists !!!");
			return res.redirect("back");
		}

		let newUser = await User.create(req.body);
		newUser.avatar =
			"https://raw.githubusercontent.com/Ayush-Kanduri/Social-Book_Social_Media_Website/master/assets/images/empty-avatar.png";
		console.log("Signed Up Successfully !!!");
		// req.flash("success", "Signed Up Successfully !!!");
		return res.redirect("/users/login");
	} catch (error) {
		console.log("Error in creating the user !!!");
		// req.flash("error", "Error in creating the user !!!");
		return res.redirect("back");
	}
};
