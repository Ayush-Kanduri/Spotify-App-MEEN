const mongoose = require("mongoose");

const PlaylistTrackRelationSchema = new mongoose.Schema(
	{
		playlist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Playlist",
			required: true,
		},
		track: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Track",
			required: true,
		},
	},
	{ timestamps: true }
);

const PlaylistTrackRelation = mongoose.model(
	"PlaylistTrackRelation",
	PlaylistTrackRelationSchema
);

module.exports = PlaylistTrackRelation;
