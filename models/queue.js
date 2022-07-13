const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		songs: [
			{
				type: Object,
				required: true,
			},
		],
		currentTrack: {
			type: Number,
			required: true,
			default: -1,
		},
		loop: {
			type: Boolean,
			required: true,
			default: false,
		},
		playbarVisible: {
			type: Boolean,
			required: true,
			default: false,
		},
		volume: {
			type: Number,
			required: true,
			default: 0.1,
		},
		isPlaying: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;
