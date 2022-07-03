const Track = require("../../../models/track");

module.exports.getAllTracks = async (req, res) => {
	try {
		let tracks = await Track.find({})
			.sort("-createdAt")
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "artist",
				select: "-likes -tracks -albums -createdAt -updatedAt",
			})
			.populate({
				path: "album",
				select: "-likes -tracks -artist -createdAt -updatedAt",
			})
			.populate({
				path: "existingPlaylistTrackRelations",
				select: "existingPlaylist",
				populate: {
					path: "existingPlaylist",
					select: "name description thumbnail",
				},
			})
			.populate({
				path: "playlistTrackRelations",
				select: "playlist",
				populate: {
					path: "playlist",
					select: "name description thumbnail",
				},
			})
			.populate({
				path: "genreTrackRelations",
				select: "genre",
				populate: {
					path: "genre",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "likes",
				select: "user",
				populate: {
					path: "user",
					select: "name",
				},
			})
			.populate("playlist genre");

		return res.status(200).json({
			message: "List of all the Tracks",
			data: {
				tracks,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				tracks: [],
			},
		});
	}
};

module.exports.getTrack = async (req, res) => {
	try {
		let track = await Track.findById(req.params.id)
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "artist",
				select: "-likes -tracks -albums -createdAt -updatedAt",
			})
			.populate({
				path: "album",
				select: "-likes -tracks -artist -createdAt -updatedAt",
			})
			.populate({
				path: "existingPlaylistTrackRelations",
				select: "existingPlaylist",
				populate: {
					path: "existingPlaylist",
					select: "name description thumbnail",
				},
			})
			.populate({
				path: "playlistTrackRelations",
				select: "playlist",
				populate: {
					path: "playlist",
					select: "name description thumbnail",
				},
			})
			.populate({
				path: "genreTrackRelations",
				select: "genre",
				populate: {
					path: "genre",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "likes",
				select: "user",
				populate: {
					path: "user",
					select: "name",
				},
			})
			.populate("playlist genre");

		return res.status(200).json({
			message: "Track Details",
			data: {
				track,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				track: null,
			},
		});
	}
};
