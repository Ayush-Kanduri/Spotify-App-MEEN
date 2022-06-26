const Artist = require("../models/artist");
const Album = require("../models/album");
const Track = require("../models/track");
const Playlist = require("../models/playlist");
const ExistingPlaylist = require("../models/existingPlaylist");
const User = require("../models/user");
const Genre = require("../models/genre");

module.exports.search = (req, res) => {
	try {
		return res.render("search", {
			title: "Search",
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};

module.exports.searchAPI = async (req, res) => {
	try {
		const value = req.params.value;

		let artists = await Artist.find({
			$or: [{ name: { $regex: value, $options: "i" } }],
		});

		let albums = await Album.find({
			$or: [{ name: { $regex: value, $options: "i" } }],
		});

		let tracks = await Track.find({
			$or: [{ name: { $regex: value, $options: "i" } }],
		}).populate("artist");

		let existingPlaylists = await ExistingPlaylist.find({
			$or: [{ name: { $regex: value, $options: "i" } }],
		});

		let users = await User.find({
			$or: [{ name: { $regex: value, $options: "i" } }],
		}).select("-password -__v");

		let playlists = await User.findById(req.user._id).populate({
			path: "playlists",
			match: { name: { $regex: value, $options: "i" } },
		});
		playlists = playlists.playlists;

		const filter = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					if (arr[i].name === arr[j].name) {
						arr.splice(j, 1);
						j--;
					}
				}
			}
		};

		filter(artists);
		filter(albums);

		const data = {
			artists: artists,
			albums: albums,
			tracks: tracks,
			playlists: playlists,
			existingPlaylists: existingPlaylists,
			users: users,
		};

		return res.status(200).json({
			response: "success",
			message: "Search Results",
			data,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error,
		});
	}
};
