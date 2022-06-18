const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		albums: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Album",
				required: true,
			},
		],
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

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
