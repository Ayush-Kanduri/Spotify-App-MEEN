const Album = require("../models/album");
const Like = require("../models/like");

module.exports.show = async (req, res) => {
	try {
		// let like = await Like.findOne({
		// 	user: req.user._id,
		// 	onModel: "Album",
		// 	likeable: req.params.id,
		// });
		// let liked = false;
		// if (like) liked = true;

		let album = await Album.findById(req.params.id)
			.populate({
				path: "tracks",
				populate: {
					path: "album",
					populate: {
						path: "artist",
					},
				},
				populate: {
					path: "likes",
					populate: {
						path: "user",
					},
				},
			})
			.populate({
				path: "likes",
				populate: {
					path: "user",
				},
			})
			.populate("artist");

		let name = album.name;
		let albums = await Album.find({ name })
			.populate({
				path: "tracks",
				populate: {
					path: "album",
					populate: {
						path: "artist",
					},
				},
				populate: {
					path: "likes",
					populate: {
						path: "user",
					},
				},
			})
			.populate({
				path: "likes",
				populate: {
					path: "user",
				},
			})
			.populate("artist");

		if (albums.length > 1) {
			album = album.toObject();
			album.tracks = [];
			albums.forEach((item) => {
				item.tracks.forEach((track) => {
					album.tracks.push(track);
				});
			});
		}

		let albumLikes = album.likes.filter(
			(like) => like.user._id.toString() === req.user._id.toString()
		);

		return res.render("album_page", {
			title: "Album",
			album: album,
			albumLikes: albumLikes,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};
