const User = require("../models/user");
const Queue = require("../models/queue");

module.exports.getQueueData = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		if (!queue || queue.songs.length === 0) {
			return res.status(200).json({
				message: "Queue is Empty",
				data: {
					Tracks: [],
					currentTrack: -1,
					isPlaying: false,
					playbarVisible: false,
					volume: 0.1,
				},
			});
		}
		return res.status(200).json({
			message: "Queue Data Received Successfully",
			data: {
				Tracks: queue.songs,
				currentTrack: queue.currentTrack,
				isPlaying: queue.isPlaying,
				playbarVisible: queue.playbarVisible,
				volume: queue.volume,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports.addQueueData = async (req, res) => {
	try {
		let user = await User.findById(req.user._id);
		let queue = await Queue.findOne({ user: req.user._id });

		let { currentTrack, isPlaying, playbarVisible, volume } = req.body;
		let song = req.body.Track;

		if (!queue) {
			queue = await Queue.create({
				user: req.user._id,
				currentTrack: parseInt(currentTrack) + 1,
				isPlaying,
				playbarVisible,
				volume: parseFloat(volume),
			});
		} else {
			queue.currentTrack = parseInt(currentTrack) + 1;
			queue.isPlaying = isPlaying;
			queue.playbarVisible = playbarVisible;
			queue.volume = parseFloat(volume);
		}
		queue.songs.push(song);
		await queue.save();
		user.queue = queue;
		await user.save();
		return res.status(200).json({
			message: "Queue Data Added Successfully",
			data: {
				Tracks: queue.songs,
				currentTrack: queue.currentTrack,
				isPlaying: queue.isPlaying,
				playbarVisible: queue.playbarVisible,
				volume: queue.volume,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports.pause = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports.next = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports.previous = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports.volume = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports.clear = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		await User.updateOne({ _id: req.user._id }, { $unset: { queue: "" } });
		await queue.remove();
		return res.status(200).json({
			message: "Queue Cleared Successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
