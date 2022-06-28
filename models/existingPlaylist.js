const mongoose = require("mongoose");

const existingPlaylistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		description: {
			type: String,
		},
		thumbnail: {
			type: String,
		},
		existingPlaylistTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ExistingPlaylistTrackRelation",
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
	},
	{ timestamps: true }
);

const ExistingPlaylist = mongoose.model(
	"ExistingPlaylist",
	existingPlaylistSchema
);
module.exports = ExistingPlaylist;
