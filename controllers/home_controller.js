const User = require("../models/user");
const Playlist = require("../models/playlist");
const ExistingPlaylist = require("../models/existingPlaylist");
const Track = require("../models/track");
const Artist = require("../models/artist");
const Album = require("../models/album");

module.exports.home = async (req, res) => {
	// let count1 = await Track.countDocuments();
	// let count2 = await Track.count({});
	// const count3 = await Track.estimatedDocumentCount();
	try {
		let users = await User.find({})
			.select("-password -__v")
			.populate({
				path: "genreUserRelations",
				populate: {
					path: "genre",
				},
			});
		let tracks = await Track.find({})
			.populate("artist album")
			.populate({
				path: "existingPlaylistTrackRelations",
				populate: {
					path: "existingPlaylist",
				},
			});
		let artists = await Artist.find({});
		let albums = await Album.find({});
		let existingPlaylists = await ExistingPlaylist.find({});
		let user = await User.findById(req.user._id)
			.select("-password -__v")
			.populate({
				path: "genreUserRelations",
				populate: {
					path: "genre",
				},
			});

		for (let i = 0; i < artists.length; i++) {
			let item = artists[i];
			for (let j = i + 1; j < artists.length; j++) {
				let item2 = artists[j];
				if (item.name === item2.name) {
					artists.splice(j, 1);
					j--;
				}
			}
		}

		let newReleases = [];
		for (let track of tracks) {
			let arr = track.existingPlaylistTrackRelations;
			for (let item of arr) {
				if (item.existingPlaylist.name === "New Releases") {
					newReleases.push(track);
				}
			}
		}

		if (req.isAuthenticated()) {
			// const playLists = req.session.playlists;
			// req.session.playlists = null;
			return res.render("home", {
				title: "Home",
				all_users: users,
				all_tracks: tracks,
				all_artists: artists,
				all_existing_playlists: existingPlaylists,
				all_albums: albums,
				current_user: user,
				new_releases: newReleases,
				// playlists: playLists ? playLists : null,
			});
		}
		return res.render("home", {
			title: "Home",
		});
	} catch (error) {
		// console.log(error);
		return res.render("home", {
			title: "Home",
		});
	}
};
