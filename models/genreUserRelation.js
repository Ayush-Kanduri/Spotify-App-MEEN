const mongoose = require("mongoose");

const genreUserRelationSchema = new mongoose.Schema(
	{
		genre: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Genre",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const GenreUserRelation = mongoose.model(
	"GenreUserRelation",
	genreUserRelationSchema
);
module.exports = GenreUserRelation;
