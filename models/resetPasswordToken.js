const mongoose = require("mongoose");

const resetPasswordTokenSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		access_token: {
			type: String,
		},
		isValid: {
			type: Boolean,
			default: true,
		},
		expire_at: {
			type: Date,
			default: Date.now(),
			expires: 7200,
		},
	},
	{ timestamps: true }
);

resetPasswordTokenSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

const ResetPasswordToken = mongoose.model(
	"ResetPasswordToken",
	resetPasswordTokenSchema
);
module.exports = ResetPasswordToken;
