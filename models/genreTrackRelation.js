const mongoose = require("mongoose");

const genreTrackRelationSchema = new mongoose.Schema(
	{
		genre: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Genre",
		},
		track: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Track",
		},
	},
	{ timestamps: true }
);

const GenreTrackRelation = mongoose.model(
	"GenreTrackRelation",
	genreTrackRelationSchema
);

module.exports = GenreTrackRelation;
