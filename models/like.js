const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		likeable: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "onModel",
		},
		onModel: {
			type: String,
			enum: ["Album", "Artist", "Track", "Playlist", "ExistingPlaylist"],
		},
	},
	{ timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
