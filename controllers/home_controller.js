const User = require("../models/user");
const Playlist = require("../models/playlist");
const ExistingPlaylist = require("../models/existingPlaylist");
const Track = require("../models/track");

module.exports.home = async (req, res) => {
	let users = await User.find({});
	let tracks = await Track.find({});
	// let count1 = await Track.countDocuments();
	// let count2 = await Track.count({});
	// const count3 = await Track.estimatedDocumentCount();


	if (req.isAuthenticated()) {
		// const playLists = req.session.playlists;
		// req.session.playlists = null;
		return res.render("home", {
			title: "Home",
			all_users: users,
			all_tracks: tracks,
			// playlists: playLists ? playLists : null,
		});
	}
	return res.render("home", {
		title: "Home",
	});
};
