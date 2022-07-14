const Queue = require("../models/queue");
const User = require("../models/user");
const env = require("../config/environment");
const jwt = require("jsonwebtoken");

module.exports.share = async (req, res) => {
	try {
		const userID = jwt.verify(req.params.id, env.jwt_share_token);
		if (!userID) return res.redirect("/");

		const user = await User.findById(userID.id);
		if (!user) return res.redirect("/");

		const queue = await Queue.findOne({ user: user._id });
		const songs = queue.songs;
		const currentTrack = queue.currentTrack;

		if (queue && songs.length > 0 && currentTrack !== -1) {
			return res.render("share", {
				title: "Share",
				username: user.name,
				song: queue.songs[queue.currentTrack],
				link: env.website_link,
			});
		}
		return res.redirect("/");
	} catch (error) {
		let message = "";
		if (error.name === "JsonWebTokenError") message = "Invalid Link";
		if (error.name === "TokenExpiredError") message = "Link Expired";
		if (error.name === "NotFoundError") message = "Page Not Found";
		if (error.name === "CastError") message = "Invalid Link";
		if (error.name === "Error") message = "Invalid Link";
		req.flash("error", message);
		return res.redirect("/");
	}
};

module.exports.createShareLink = async (req, res) => {
	try {
		const queue = await Queue.findOne({ user: req.user._id });
		if (!queue || queue.songs.length === 0) {
			return res.status(422).json({
				message: "Unprocessable Entity",
				response: "failure",
			});
		}

		const token = jwt.sign({ id: req.user._id }, env.jwt_share_token, {
			expiresIn: "2m",
		});

		const facebook = `https://www.facebook.com/sharer/sharer.php?u=${env.website_link}/share/${token}`;
		const twitter = `https://twitter.com/intent/tweet?text=Hey guys, check out what I'm listening to right now%0a%0a${env.website_link}/share/${token}`;
		const whatsapp = `whatsapp://send?text=Hey guys, check out what I'm listening to right now%0a%0a${env.website_link}/share/${token}`;

		return res.status(200).json({
			message: "Share Link Created Successfully",
			response: "success",
			data: {
				facebook,
				twitter,
				whatsapp,
			},
		});
	} catch (error) {
		req.flash("error", "Error in Creating Share Link!");
		return res.status(500).json({
			message: "Error in Creating Share Link!",
			response: "error",
			error: error.message,
		});
	}
};
