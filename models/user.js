const mongoose = require("mongoose");
const validator = require("validator");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid Email");
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (value.length < 6) {
					throw new Error("Password must be at least 6 characters");
				}
			},
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: [3, "Name must be at least 3 characters long"],
		},
		avatar: {
			type: String,
		},
		playlists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Playlist",
			},
		],
		genreUserRelations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "GenreUserRelation",
			},
		],
		friendships: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Friendship",
			},
		],
		emailVerified: {
			type: Boolean,
			default: false,
		},
		queue: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Queue",
		},
	},
	{
		timestamps: true,
	}
);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
	"avatar"
);

userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model("User", userSchema);
module.exports = User;
