const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passReqToCallback: true },
		async (req, email, password, done) => {
			try {
				let user = await User.findOne({ email: email });
				if (!user || user.password !== password) {
					req.flash("error", "User not Found !!!");
					return done(null, false);
				}
				return done(null, user);
			} catch (error) {
				req.flash("error", "Error in finding the User !!!");
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		let user = await User.findById(id).populate(
			"playlists genreUserRelations friendships queue"
		);
		return done(null, user);
	} catch (error) {
		req.flash("error", "Error in finding the User !!!");
		return done(error);
	}
});

//--------------------//
//Creating Middlewares//
//--------------------//

passport.checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/users/login");
};

passport.setAuthenticatedUser = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
	}
	next();
};

module.exports = passport;
