const ExistingPlaylist = require("../models/existingPlaylist");
const Playlist = require("../models/playlist");
const PlaylistTrackRelation = require("../models/playlistTrackRelation");
const Track = require("../models/track");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.show = async (req, res) => {
	try {
		let query = [
			{
				path: "album",
			},
			{
				path: "artist",
			},
			{
				path: "likes",
				populate: {
					path: "user",
				},
			},
		];
		let ePlaylist = await ExistingPlaylist.findById(req.params.id)
			.populate({
				path: "existingPlaylistTrackRelations",
				populate: {
					path: "track",
					populate: query,
				},
			})
			.populate({
				path: "likes",
				populate: {
					path: "user",
				},
			});

		let playlistLikes = ePlaylist.likes.filter(
			(like) => like.user._id.toString() === req.user._id.toString()
		);

		return res.render("user_playlist", {
			title: "Playlist",
			playlist: ePlaylist,
			playlistLikes: playlistLikes,
			ePlaylist: true,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};

module.exports.add = async (req, res) => {
	try {
		let tracks = await Track.find({}).populate("album artist");
		return res.render("create_playlist", {
			title: "Create Playlist",
			tracks: tracks,
			BG: "images/custom-playlist.jpg",
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};

module.exports.create = async (req, res) => {
	try {
		let file = "";
		let data = {};

		let playlists = await Playlist.find({});
		let arr = [];

		try {
			if (playlists.length === 0) {
				const files = await fs.promises.readdir(
					path.join(__dirname, "..", Playlist.playlistPath)
				);
				for (let file of files) {
					fs.unlinkSync(
						path.join(__dirname, "..", Playlist.playlistPath, file)
					);
				}
			}
		} catch (error) {
			console.log(error);
		}

		Playlist.uploadedPlaylist(req, res, async (err) => {
			if (err) {
				console.log("Error in Multer: ", err);
				return res.status(500).send({
					message: "Internal Server Error",
					error: err,
				});
			}

			data = JSON.parse(JSON.stringify(req.body));

			if (req.file) {
				file = Playlist.playlistPath + "/" + req.file.filename;
			} else {
				file = data.custom_link;
			}

			let playlist = await Playlist.create({
				name: data.name,
				thumbnail: file,
				description: data.name,
			});

			for (let trackID of data.songs) {
				let track = await Track.findById(trackID);
				let playlistTrackRelation = await PlaylistTrackRelation.create({
					playlist: playlist._id,
					track: track._id,
				});
				await playlist.playlistTrackRelations.push(
					playlistTrackRelation._id
				);
				await playlist.save();
				await track.playlistTrackRelations.push(playlistTrackRelation._id);
				await track.save();
			}

			let user = await User.findById(req.user._id);
			await user.playlists.push(playlist._id);
			await user.save();

			req.flash("success", "Playlist Created Successfully !!!");
			return res.status(200).json({
				message: "Playlist Created Successfully !!!",
				playlist: playlist,
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			message: "Internal Server Error",
			error: error,
		});
	}
};

module.exports.custom = async (req, res) => {
	try {
		let query = [
			{
				path: "album",
			},
			{
				path: "artist",
			},
			{
				path: "likes",
				populate: {
					path: "user",
				},
			},
		];
		let playlist = await Playlist.findById(req.params.id)
			.populate({
				path: "playlistTrackRelations",
				populate: {
					path: "track",
					populate: query,
				},
			})
			.populate({
				path: "likes",
				populate: {
					path: "user",
				},
			});

		let playlistLikes = playlist.likes.filter(
			(like) => like.user._id.toString() === req.user._id.toString()
		);

		return res.render("user_playlist", {
			title: "Custom Playlist",
			playlist: playlist,
			playlistLikes: playlistLikes,
			ePlaylist: false,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};
