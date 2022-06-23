const ExistingPlaylist = require("../models/existingPlaylist");
const Playlist = require("../models/playlist");

module.exports.show = async (req, res) => {
	try {
		let query = [
			{
				path: "album",
			},
			{
				path: "artist",
			},
		];
		let ePlaylist = await ExistingPlaylist.findById(req.params.id).populate({
			path: "existingPlaylistTrackRelations",
			populate: {
				path: "track",
				populate: query,
			},
		});
		return res.render("user_playlist", {
			title: "Playlist",
			playlist: ePlaylist,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};

module.exports.add = (req, res) => {
	return res.render("create_playlist", {
		title: "Create Playlist",
	});
};
