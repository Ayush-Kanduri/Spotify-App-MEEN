const mongoose = require("mongoose");

const existingPlaylistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
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
	},
	{ timestamps: true }
);

const ExistingPlaylist = mongoose.model(
	"ExistingPlaylist",
	existingPlaylistSchema
);
module.exports = ExistingPlaylist;
