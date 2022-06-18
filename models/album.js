const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
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
		tracks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Track",
				required: true,
			},
		],
		thumbnail: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
