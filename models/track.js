const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		artist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
			required: true,
		},
		album: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			required: true,
		},
		genre: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Genre",
			required: true,
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
	},
	{ timestamps: true }
);
