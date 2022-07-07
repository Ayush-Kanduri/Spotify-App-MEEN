const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const env = require("./environment");

const options = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: env.jwt_access_token,
	passReqToCallback: true,
};

passport.use(
	new JWTStrategy(options, async (req, jwtPayload, done) => {
		try {
			let user = await User.findById(jwtPayload._id);
			if (user) return done(null, user);
			return done(null, false);
		} catch (error) {
			return done(error, false);
		}
	})
);

module.exports = passport;
