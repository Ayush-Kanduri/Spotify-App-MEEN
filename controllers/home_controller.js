const User = require("../models/user");
const ExistingPlaylist = require("../models/existingPlaylist");
const Track = require("../models/track");
const Artist = require("../models/artist");
const Album = require("../models/album");

module.exports.home = async (req, res) => {
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
		let tracksWithMaxLikes = await Track.find({})
			.populate("artist album likes")
			.populate({
				path: "existingPlaylistTrackRelations",
				populate: {
					path: "existingPlaylist",
				},
			});
		let topFiveLikes = tracksWithMaxLikes
			.sort((a, b) => {
				return b.likes.length - a.likes.length;
			})
			.slice(0, 5);

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

		for (let i = 0; i < albums.length; i++) {
			let item = albums[i];
			for (let j = i + 1; j < albums.length; j++) {
				let item2 = albums[j];
				if (item.name === item2.name) {
					albums.splice(j, 1);
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
				trendingTracks: topFiveLikes,
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
