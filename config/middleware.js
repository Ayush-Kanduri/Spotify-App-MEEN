const { body } = require("express-validator");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const Track = require("../models/track");
const Album = require("../models/album");
const Artist = require("../models/artist");
const ExistingPlaylist = require("../models/existingPlaylist");
const Genre = require("../models/genre");
const ExistingPlaylistTrackRelation = require("../models/existingPlaylistTrackRelation");
const GenreTrackRelation = require("../models/genreTrackRelation");
const jwt = require("jsonwebtoken");
const env = require("./environment");
const Redis = require("ioredis");

//Create Uploads Folder if it doesn't exist
module.exports.createUploads = async (req, res, next) => {
	try {
		let directory = path.join(__dirname, "..", "/uploads");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users/avatars");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users/playlists");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
	} catch (error) {
		console.log(error);
	}
	next();
};

//Sets the Flash Message into the Response Session
module.exports.setFlash = (req, res, next) => {
	res.locals.flash = {
		success: req.flash("success"),
		error: req.flash("error"),
	};
	next();
};

//Adds Default Tracks, Albums, Artists, Playlists, Genres to the Database
module.exports.addMusic = async (req, res, next) => {
	const tracks = await Track.find({});
	if (tracks.length === 0) {
		for (let i = 1; i <= 20; i++) {
			let playlist;
			let genre;
			const trackFile = path.join(
				__dirname,
				`../storage/json/tracks/track_${i}.json`
			);
			const albumFile = path.join(
				__dirname,
				`../storage/json/albums/album_${i}.json`
			);
			const artistFile = path.join(
				__dirname,
				`../storage/json/artists/artist_${i}.json`
			);
			if (i % 2 === 0) {
				let j = i / 2;
				const genreFile = path.join(
					__dirname,
					`../storage/json/genres/genre_${j}.json`
				);
				try {
					genre = await fs.promises.readFile(genreFile, "utf8");
					genre = JSON.parse(genre);
					genre = await Genre.create(genre);
				} catch (error) {
					console.log(error);
					return;
				}
			}
			if (i % 4 === 0) {
				let j = i / 4;
				const playlistFile = path.join(
					__dirname,
					`../storage/json/playlists/playlist_${j}.json`
				);
				try {
					playlist = await fs.promises.readFile(playlistFile, "utf8");
					playlist = JSON.parse(playlist);
					playlist = await ExistingPlaylist.create(playlist);
				} catch (error) {
					console.log(error);
					return;
				}
			}
			try {
				let track = await fs.promises.readFile(trackFile, "utf8");
				let album = await fs.promises.readFile(albumFile, "utf8");
				let artist = await fs.promises.readFile(artistFile, "utf8");

				track = JSON.parse(track);
				album = JSON.parse(album);
				artist = JSON.parse(artist);

				track = await Track.create(track);
				album = await Album.create(album);
				artist = await Artist.create(artist);

				album.artist = artist._id;
				await album.tracks.push(track._id);
				await album.save();

				await artist.albums.push(album._id);
				await artist.tracks.push(track._id);
				await artist.save();

				track.album = album._id;
				track.artist = artist._id;
				await track.save();
			} catch (error) {
				console.log(error);
				return;
			}
		}
		await setGenre();
		await setPlaylist();
	}
	next();
};

//Validates the Sign Up Form Data at the router level before sending it to the Database
module.exports.validate = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Invalid Email").exists().isEmail(),
				body("password", "Password should be at least 6 Characters Long")
					.exists()
					.isLength({ min: 6 }),
				body("name", "Name must be at least 2 Characters Long")
					.exists()
					.isLength({ min: 2 }),
				body("avatar").optional(),
			];
		}
	}
};

//Re-Generates Access Token using Refresh Token
module.exports.renewAccessToken = async (req, res, next) => {
	//Get the Tokens: Access Token & Refresh Token, from the Cookies
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	//Get the Redis Client
	let redis = new Redis();
	//Get the Redis List of Refresh Tokens
	let refreshTokens = await redis.lrange("refreshTokens", 0, -1);
	//Disconnect from Redis
	redis.disconnect();

	try {
		//Verify the Access Token
		let user = jwt.verify(accessToken, env.jwt_access_token);
		//If User is found in the Access Token, then Go Further to the Passport Authentication
		if (user) {
			req.headers.authorization = `Bearer ${accessToken}`;
			return next();
		}
	} catch (error) {
		//If the Access Token has expired, then Generate a New Access Token
		if (
			error.message == "jwt expired" ||
			error.message == "jwt must be provided"
		) {
			await generateAccessToken(refreshToken, refreshTokens, req, res, next);
		}
		//If the User is not found in the Access Token & the Access Token is Invalid
		else {
			return res.status(401).json({
				message: "Invalid Access Token",
				error: error.message,
			});
		}
	}
};

//FUNCTION :: Generates a New Access Token using the Refresh Token
const generateAccessToken = async (
	refreshToken,
	refreshTokens,
	req,
	res,
	next
) => {
	try {
		//Check if the Refresh Token Exists or it Exists in the Redis List
		if (!refreshToken || !refreshTokens.includes(refreshToken)) {
			return res.status(403).json({
				message: "Invalid Refresh Token. Please Login Again!",
			});
		}

		//Check if the Refresh Token is Valid
		let innerUser = jwt.verify(refreshToken, env.jwt_refresh_token);
		//Check if the User from the Refresh Token Exists
		let sameUser = await User.findById(innerUser._id);
		//Create a New Access Token
		const accessToken = jwt.sign(sameUser.toJSON(), env.jwt_access_token, {
			expiresIn: "10s",
		});

		//Store the New Access Token in the Cookie
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			expires: new Date(Date.now() + 10000),
			sameSite: "strict",
		});
		//Set the New Access Token in the Request Headers
		req.headers.authorization = `Bearer ${accessToken}`;
		//Go Further to the Passport Authentication
		return next();
	} catch (error) {
		//If the Refresh Token is not Valid
		return res.status(403).json({
			message: "Invalid Token. Please Login Again!",
			error: error.message,
		});
	}
};

const fileHound = () => {
	// const fileHound = FileHound.create();
	// fileHound
	// 	.path(path.join(__dirname, "../storage/json/tracks"))
	// 	.ext([".json"])
	// 	.find()
	// 	.each(async (file) => {
	// 		try {
	// 			let data = await fs.promises.readFile(file, "utf8");
	// 			// await Track.create(JSON.parse(data));
	// 		} catch (error) {
	// 			console.log(error);
	// 			return;
	// 		}
	// 	});
	// fileHound
	// 	.path(path.join(__dirname, "../default_storage"))
	// 	.depth(10)
	// 	.find()
	// 	.each(console.log);
	// fileHound
	// 	.path(path.join(__dirname, "../default_storage"))
	// 	.directory()
	// 	.find()
	// 	.each(console.log);
};

const setGenre = async () => {
	try {
		const arr = [
			"Happy",
			"Sad",
			"Bollywood",
			"Calm",
			"Chill",
			"Dance",
			"Jazz",
			"Long Drive",
			"Rock",
			"Workout",
		];
		for (let item of arr) {
			let tracks = await Track.find({ genre: item });
			let genre = await Genre.findOne({ name: item });
			for (let track of tracks) {
				let genreTrackRelation = await GenreTrackRelation.create({
					genre: genre._id,
					track: track._id,
				});
				await track.genreTrackRelations.push(genreTrackRelation._id);
				await genre.genreTrackRelations.push(genreTrackRelation._id);
				await track.save();
				await genre.save();
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
};

const setPlaylist = async () => {
	try {
		const arr = [
			"Bollywood Butter 🧡",
			"Chill Station ✨",
			"Daily Lift 🚀",
			"Daily Mix 1 🍉",
			"New Releases",
		];
		for (let item of arr) {
			let tracks = await Track.find({ playlist: item });
			let playlist = await ExistingPlaylist.findOne({ name: item });
			for (let track of tracks) {
				let existingPlaylistTrackRelation =
					await ExistingPlaylistTrackRelation.create({
						existingPlaylist: playlist._id,
						track: track._id,
					});
				await track.existingPlaylistTrackRelations.push(
					existingPlaylistTrackRelation._id
				);
				await playlist.existingPlaylistTrackRelations.push(
					existingPlaylistTrackRelation._id
				);
				await track.save();
				await playlist.save();
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
};
