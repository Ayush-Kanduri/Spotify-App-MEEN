const { body } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Track = require("../models/track");
const Album = require("../models/album");
const Artist = require("../models/artist");
const ExistingPlaylist = require("../models/existingPlaylist");
const Genre = require("../models/genre");
const ExistingPlaylistTrackRelation = require("../models/existingPlaylistTrackRelation");
const GenreTrackRelation = require("../models/genreTrackRelation");

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
