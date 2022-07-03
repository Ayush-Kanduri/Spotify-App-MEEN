const Album = require("../../../models/album");

module.exports.getAllAlbums = async function (req, res) {
	try {
		let albums = await Album.find({})
			.sort("-createdAt")
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "artist",
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
			message: "List of all the Albums",
			data: {
				albums,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				albums: [],
			},
		});
	}
};

module.exports.getAlbum = async (req, res) => {
	try {
		let album = await Album.findById(req.params.id)
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "artist",
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
			message: "Album Details",
			data: {
				album,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				album: null,
			},
		});
	}
};
