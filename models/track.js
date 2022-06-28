const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		artist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
		},
		album: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
		},
		duration: {
			type: String,
		},
		url: {
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
		playlistTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PlaylistTrackRelation",
			},
		],
		genreTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "GenreTrackRelation",
			},
		],
		playlist: [
			{
				type: String,
			},
		],
		genre: [
			{
				type: String,
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

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
