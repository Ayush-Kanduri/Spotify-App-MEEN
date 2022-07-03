const Artist = require("../../../models/artist");

module.exports.getAllArtists = async function (req, res) {
	try {
		let artists = await Artist.find({})
			.sort("-createdAt")
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "albums",
				select: "name thumbnail",
			})
			.populate({
				path: "tracks",
				select: "name thumbnail",
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
			message: "List of all the Artists",
			data: {
				artists,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				artists: [],
			},
		});
	}
};

module.exports.getArtist = async (req, res) => {
	try {
		let artist = await Artist.findById(req.params.id)
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "albums",
				select: "name thumbnail",
			})
			.populate({
				path: "tracks",
				select: "name thumbnail",
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
			message: "Artist Details",
			data: {
				artist,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				artist: null,
			},
		});
	}
};
