const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		albums: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Album",
			},
		],
		tracks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Track",
			},
		],
		thumbnail: {
			type: String,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
	},
	{ timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
