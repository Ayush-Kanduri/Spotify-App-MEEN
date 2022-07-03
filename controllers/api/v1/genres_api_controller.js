const Genre = require("../../../models/genre");

module.exports.getAllGenres = async (req, res) => {
	try {
		let genres = await Genre.find({})
			.sort("-createdAt")
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "genreTrackRelations",
				select: "track",
				populate: {
					path: "track",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "genreUserRelations",
				select: "user",
				populate: {
					path: "user",
					select: "name",
				},
			});

		return res.status(200).json({
			message: "List of all the Genres",
			data: {
				genres,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				genres: [],
			},
		});
	}
};

module.exports.getGenre = async (req, res) => {
	try {
		let genre = await Genre.findById(req.params.id)
			.select("-__v -updatedAt -createdAt")
			.populate({
				path: "genreTrackRelations",
				select: "track",
				populate: {
					path: "track",
					select: "name thumbnail",
				},
			})
			.populate({
				path: "genreUserRelations",
				select: "user",
				populate: {
					path: "user",
					select: "name",
				},
			});

		return res.status(200).json({
			message: "Genre Details",
			data: {
				genre,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				genre: null,
			},
		});
	}
};
