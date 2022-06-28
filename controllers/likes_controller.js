const Album = require("../models/album");
const Track = require("../models/track");
const Artist = require("../models/artist");
const Playlist = require("../models/playlist");
const EPlaylist = require("../models/existingPlaylist");
const Like = require("../models/like");

module.exports.toggleLike = async (req, res) => {
	try {
		let id = req.query.id;
		let type = req.query.type;
		let likeable = null;
		let liked = false;
		let message = "";

		if (type === "Album") likeable = await Album.findById(id);
		if (type === "Track") likeable = await Track.findById(id);
		if (type === "Artist") likeable = await Artist.findById(id);
		if (type === "Playlist") likeable = await Playlist.findById(id);
		if (type === "ExistingPlaylist") likeable = await EPlaylist.findById(id);

		let existingLike = await Like.findOne({
			user: req.user._id,
			onModel: type,
			likeable: id,
		});

		if (existingLike) {
			likeable.likes.pull(existingLike._id);
			await likeable.save();
			await existingLike.remove();
			message = "You have Unliked this!";
			liked = false;
		} else {
			const like = await Like.create({
				user: req.user._id,
				onModel: type,
				likeable: id,
			});
			likeable.likes.push(like._id);
			await likeable.save();
			message = "You have Liked this!";
			liked = true;
		}

		return res.status(200).json({
			response: "success",
			message: message,
			data: { liked },
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error,
		});
	}
};
