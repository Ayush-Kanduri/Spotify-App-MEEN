const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likeable: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: "onModel",
		},
		onModel: {
			type: String,
			required: true,
			enum: ["Album", "Artist", "Track", "Playlist", "ExistingPlaylist"],
		},
	},
	{ timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
