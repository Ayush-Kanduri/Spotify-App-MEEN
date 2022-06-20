const mongoose = require("mongoose");

const existingPlaylistTrackRelationSchema = new mongoose.Schema(
	{
		existingPlaylist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ExistingPlaylist",
		},
		track: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Track",
		},
	},
	{ timestamps: true }
);

const ExistingPlaylistTrackRelation = mongoose.model(
	"ExistingPlaylistTrackRelation",
	existingPlaylistTrackRelationSchema
);

module.exports = ExistingPlaylistTrackRelation;
