const mongoose = require("mongoose");

const PlaylistTrackRelationSchema = new mongoose.Schema(
	{
		playlist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Playlist",
		},
		track: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Track",
		},
	},
	{ timestamps: true }
);

const PlaylistTrackRelation = mongoose.model(
	"PlaylistTrackRelation",
	PlaylistTrackRelationSchema
);

module.exports = PlaylistTrackRelation;
