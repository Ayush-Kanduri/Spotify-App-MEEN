const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const PLAYLIST_PATH = path.join("/uploads/users/playlists");

const playlistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		description: {
			type: String,
		},
		thumbnail: {
			type: String,
		},
		playlistTrackRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PlaylistTrackRelation",
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

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", PLAYLIST_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

playlistSchema.statics.uploadedPlaylist = multer({ storage: storage }).single(
	"thumbnail"
);

playlistSchema.statics.playlistPath = PLAYLIST_PATH;

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
