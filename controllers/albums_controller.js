const Album = require("../models/album");

module.exports.show = async (req, res) => {
	try {
		let album = await Album.findById(req.params.id)
			.populate({
				path: "tracks",
				populate: {
					path: "album",
					populate: {
						path: "artist",
					},
				},
			})
			.populate("artist");

		let name = album.name;
		let albums = await Album.find({ name }).populate({
			path: "tracks",
			populate: {
				path: "album",
				populate: {
					path: "artist",
				},
			},
		});

		if (albums.length > 1) {
			album = album.toObject();
			album.tracks = [];
			albums.forEach((item) => {
				item.tracks.forEach((track) => {
					album.tracks.push(track);
				});
			});
		}

		return res.render("album_page", {
			title: "Album",
			album: album,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};
