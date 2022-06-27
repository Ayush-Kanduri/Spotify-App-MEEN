const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.toggleFriendship = async (req, res) => {
	try {
		if (!req.isAuthenticated()) return res.redirect("/users/login");

		const userId = req.params.id;
		let unfriended = false;
		let message = "";

		let from_user = req.user;
		let to_user = await User.findById(userId);

		let friendship = await Friendship.findOne({
			from_user: from_user._id,
			to_user: to_user._id,
		});

		if (!friendship) {
			friendship = await Friendship.create({
				from_user: from_user._id,
				to_user: to_user._id,
			});
			from_user.friendships.push(friendship._id);
			to_user.friendships.push(friendship._id);
			await from_user.save();
			await to_user.save();
			unfriended = false;
			message = `You are now Following ${to_user.name} 🎉`;
		} else {
			let friend = to_user.name;
			let friendshipID = friendship._id;
			to_user = friendship.to_user;
			from_user = friendship.from_user;
			await friendship.remove();
			await User.findByIdAndUpdate(from_user._id, {
				$pull: { friendships: friendshipID },
			});
			await User.findByIdAndUpdate(to_user._id, {
				$pull: { friendships: friendshipID },
			});
			unfriended = true;
			message = `You have Unfollowed ${friend} 😢`;
		}

		return res.status(200).json({
			response: "success",
			message: message,
			data: { unfriended },
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
