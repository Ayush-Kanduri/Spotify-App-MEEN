const Artist = require("../models/artist");

module.exports.show = async (req, res) => {
	try {
		let artist = await Artist.findById(req.params.id)
			.populate("albums")
			.populate({
				path: "tracks",
				populate: {
					path: "album",
					populate: {
						path: "artist",
					},
				},
			});

		let name = artist.name;
		let artists = await Artist.find({ name }).populate({
			path: "tracks",
			populate: {
				path: "album",
				populate: {
					path: "artist",
				},
			},
		});

		if (artists.length > 1) {
			artist = artist.toObject();
			artist.tracks = [];
			artists.forEach((item) => {
				item.tracks.forEach((track) => {
					artist.tracks.push(track);
				});
			});
		}

		return res.render("artist_page", {
			title: "Artist",
			artist: artist,
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};
