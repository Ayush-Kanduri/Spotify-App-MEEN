const mongoose = require("mongoose");

const existingPlaylistTrackRelationSchema = new mongoose.Schema(
	{
		existingPlaylist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ExistingPlaylist",
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

const ExistingPlaylistTrackRelation = mongoose.model(
	"ExistingPlaylistTrackRelation",
	existingPlaylistTrackRelationSchema
);

module.exports = ExistingPlaylistTrackRelation;
