const User = require("../../../models/user");

module.exports.getAllUsers = async (req, res) => {
	try {
		let users = await User.find({})
			.sort("-createdAt")
			.select("-password -__v -_id -friendships -updatedAt -createdAt")
			.populate({
				path: "playlists",
				select: "name -_id",
			})
			.populate({
				path: "genreUserRelations",
				select: "genre -_id",
				populate: {
					path: "genre",
					options: { sort: { name: 1 } },
					select: "name -_id",
				},
			});
		return res.status(200).json({
			message: "List of all the Users",
			data: {
				users,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				users: [],
			},
		});
	}
};

module.exports.getUser = async (req, res) => {
	try {
		let user = await User.findById(req.params.id)
			.select("-password -__v -_id -friendships -updatedAt -createdAt")
			.populate({
				path: "playlists",
				select: "name -_id",
			})
			.populate({
				path: "genreUserRelations",
				select: "genre -_id",
				populate: {
					path: "genre",
					options: { sort: { name: 1 } },
					select: "name -_id",
				},
			});
		return res.status(200).json({
			message: "User Details",
			data: {
				user,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				users: null,
			},
		});
	}
};

module.exports.createSession = (req, res) => {};
