const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
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
		playlistTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PlaylistTrackRelation",
			},
		],
	},
	{ timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
