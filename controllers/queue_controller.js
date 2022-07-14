const _ = require("lodash");
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
					loop: false,
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
				loop: queue.loop,
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

module.exports.addPlaylistQueue = async (req, res) => {
	try {
		let user = await User.findById(req.user._id);
		let queue = await Queue.findOne({ user: req.user._id });

		let { currentTrack, isPlaying, playbarVisible, volume, loop } = req.body;
		let songs = req.body.Tracks;

		if (!queue) {
			queue = await Queue.create({
				user: req.user._id,
				currentTrack: 0,
				isPlaying,
				playbarVisible,
				volume: parseFloat(volume),
				loop,
			});
		} else {
			queue.currentTrack = 0;
			queue.isPlaying = isPlaying;
			queue.playbarVisible = playbarVisible;
			queue.volume = parseFloat(volume);
			queue.loop = loop;
		}
		queue.songs = songs;
		await queue.save();
		user.queue = queue;
		await user.save();
		return res.status(200).json({
			message: "Playlist Queue Data Added Successfully",
			data: {
				Tracks: queue.songs,
				currentTrack: queue.currentTrack,
				isPlaying: queue.isPlaying,
				playbarVisible: queue.playbarVisible,
				volume: queue.volume,
				loop: queue.loop,
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

		let { currentTrack, isPlaying, playbarVisible, volume, loop } = req.body;
		let song = req.body.Track;

		if (!queue) {
			queue = await Queue.create({
				user: req.user._id,
				currentTrack: parseInt(currentTrack) + 1,
				isPlaying,
				playbarVisible,
				volume: parseFloat(volume),
				loop,
			});
		} else {
			if (
				parseInt(currentTrack) === -1 ||
				parseInt(currentTrack) === queue.songs.length - 1
			) {
				currentTrack = parseInt(currentTrack) + 1;
			}

			if (
				parseInt(currentTrack) !== queue.songs.length - 1 &&
				parseInt(currentTrack) !== -1
			) {
				currentTrack = queue.songs.length;
			}

			queue.currentTrack = currentTrack;
			queue.isPlaying = isPlaying;
			queue.playbarVisible = playbarVisible;
			queue.volume = parseFloat(volume);
			queue.loop = loop;
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
				loop: queue.loop,
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

module.exports.update = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		let { currentTrack, isPlaying, playbarVisible, volume, loop } = req.body;
		queue.currentTrack = parseInt(currentTrack);
		queue.isPlaying = isPlaying;
		queue.playbarVisible = playbarVisible;
		queue.volume = parseFloat(volume);
		queue.loop = loop;
		queue.songs[parseInt(currentTrack)] = req.body.Track;
		await queue.save();
		return res.status(200).json({
			message: "Queue Data Updated Successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports.loop = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		let { loop } = req.body;
		queue.loop = loop;
		await queue.save();
		return res.status(200).json({
			message: "Queue Loop Changed Successfully",
			data: {
				loop: queue.loop,
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

module.exports.shuffle = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		let { Tracks, currentTrack } = req.body;
		for (let i = 0; i < Tracks.length; i++) {
			if (_.isEqual(Tracks[i], Tracks[parseInt(currentTrack)])) continue;
			queue.songs[i] = Tracks[i];
		}
		await queue.save();
		return res.status(200).json({
			message: "Queue Shuffled Successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports.volume = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		queue.volume = parseFloat(req.body.volume);
		await queue.save();
		return res.status(200).json({
			message: "Volume Changed Successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

module.exports.clear = async (req, res) => {
	try {
		let queue = await Queue.findOne({ user: req.user._id });
		if (!queue) {
			return res.status(200).json({
				message: "Queue is Empty",
			});
		}
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
