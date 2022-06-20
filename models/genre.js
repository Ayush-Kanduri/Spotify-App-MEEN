const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		genreTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "GenreTrackRelation",
			},
		],
		genreUserRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "GenreUserRelation",
			},
		],
		thumbnail: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
