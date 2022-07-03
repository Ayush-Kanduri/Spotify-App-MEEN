const Playlist = require("../../../models/existingPlaylist");

module.exports.getAllPlaylists = async (req, res) => {
	try {
		let playlists = await Playlist.find({})
			.sort("-createdAt")
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "existingPlaylistTrackRelations",
				select: "track",
				populate: {
					path: "track",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "likes",
				select: "user",
				populate: {
					path: "user",
					select: "name -_id",
				},
			});

		return res.status(200).json({
			message: "List of all the Playlists",
			data: {
				playlists,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				playlists: [],
			},
		});
	}
};

module.exports.getPlaylist = async (req, res) => {
	try {
		let playlist = await Playlist.findById(req.params.id)
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "existingPlaylistTrackRelations",
				select: "track",
				populate: {
					path: "track",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "likes",
				select: "user",
				populate: {
					path: "user",
					select: "name -_id",
				},
			});

		return res.status(200).json({
			message: "Playlist Details",
			data: {
				playlist,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				playlists: null,
			},
		});
	}
};
