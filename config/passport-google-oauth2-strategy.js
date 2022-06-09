const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");

passport.use(
	new googleStrategy(
		{
			clientID: env.google_client_id,
			clientSecret: env.google_client_secret,
			callbackURL: env.google_callback_url,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await User.findOne({ email: profile.emails[0].value });
				if (user) {
					return done(null, user);
				}
				user = await User.create({
					name: profile.displayName,
					email: profile.emails[0].value,
					password: crypto.randomBytes(20).toString("hex"),
				});
				return done(null, user);
			} catch (error) {
				req.flash("error", "Error in finding/creating the User !!!");
				return done(error);
			}
		}
	)
);

module.exports = passport;
