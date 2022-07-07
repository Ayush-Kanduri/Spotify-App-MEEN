// -----------------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------------
const passport = require("passport");
const passportJWT = require("../../../config/passport-jwt-strategy");
const middleware = require("../../../config/middleware");

//******************************//
//Renew Access Token Middleware
//*****************************//
//If the Access Token Expires, then Create a New Access Token, then Go Further to the Passport Authentication
//If the Access Token Exists Already, then Go Further to the Passport Authentication

//******************************//
//Passport Middleware
//******************************//
//Authenticates the User using the Access Token & Sets the User in the Request

//******************************//
// If the Access Token Exists, then it is Passed into every Request Headers towards the Next Route
//******************************//

router.post("/create-session", usersAPIController.createSession);
router.get("/verify", usersAPIController.verify);
router.get(
	"/logout",
	middleware.renewAccessToken,
	passport.authenticate("jwt", { session: false }),
	usersAPIController.logout
);
router.get(
	"/update/:id",
	middleware.renewAccessToken,
	passport.authenticate("jwt", { session: false }),
	usersAPIController.update
);

// -----------------------------------------------------------------------------------
// Custom Middlewares
// -----------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
const env = require("./environment");
const Redis = require("ioredis");
const User = require("../models/user");

//Re-Generates Access Token using Refresh Token
module.exports.renewAccessToken = async (req, res, next) => {
	//Get the Tokens: Access Token & Refresh Token, from the Cookies
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	//Get the Redis Client
	let redis = new Redis();
	//Get the Redis List of Refresh Tokens
	let refreshTokens = await redis.lrange("refreshTokens", 0, -1);
	//Disconnect from Redis
	redis.disconnect();

	try {
		//Verify the Access Token
		let user = jwt.verify(accessToken, env.jwt_access_token);
		//If User is found in the Access Token, then Go Further to the Passport Authentication
		if (user) {
			req.headers.authorization = `Bearer ${accessToken}`;
			return next();
		}
	} catch (error) {
		//If the Access Token has expired, then Generate a New Access Token
		if (
			error.message == "jwt expired" ||
			error.message == "jwt must be provided"
		) {
			await generateAccessToken(refreshToken, refreshTokens, req, res, next);
		}
		//If the User is not found in the Access Token & the Access Token is Invalid
		else {
			return res.status(401).json({
				message: "Invalid Access Token",
				error: error.message,
			});
		}
	}
};

//FUNCTION :: Generates a New Access Token using the Refresh Token
const generateAccessToken = async (
	refreshToken,
	refreshTokens,
	req,
	res,
	next
) => {
	try {
		//Check if the Refresh Token Exists or it Exists in the Redis List
		if (!refreshToken || !refreshTokens.includes(refreshToken)) {
			return res.status(403).json({
				message: "Invalid Refresh Token. Please Login Again!",
			});
		}

		//Check if the Refresh Token is Valid
		let innerUser = jwt.verify(refreshToken, env.jwt_refresh_token);
		//Check if the User from the Refresh Token Exists
		let sameUser = await User.findById(innerUser._id);
		//Create a New Access Token
		const accessToken = jwt.sign(sameUser.toJSON(), env.jwt_access_token, {
			expiresIn: "10s",
		});

		//Store the New Access Token in the Cookie
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			expires: new Date(Date.now() + 10000),
			sameSite: "strict",
		});
		//Set the New Access Token in the Request Headers
		req.headers.authorization = `Bearer ${accessToken}`;
		//Go Further to the Passport Authentication
		return next();
	} catch (error) {
		//If the Refresh Token is not Valid
		return res.status(403).json({
			message: "Invalid Token. Please Login Again!",
			error: error.message,
		});
	}
};

// -----------------------------------------------------------------------------------
// Passport Middlewares
// -----------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------
// Controllers
// -----------------------------------------------------------------------------------
const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const Redis = require("ioredis");
//Creates a First Login Session for the User which Generates an Access Token & a Refresh Token
module.exports.createSession = async (req, res) => {
	try {
		//Find the User by Email in the Database
		let user = await User.findOne({ email: req.body.email });

		//If the User doesn't Exist
		if (!user) {
			return res.status(422).json({
				message: "User not found!",
			});
		}

		//If the Password is Incorrect
		if (user.password !== req.body.password) {
			return res.status(422).json({
				message: "Invalid Credentials!",
			});
		}

		//Create JWT Tokens: Access Token and Refresh Token
		let accessToken = jwt.sign(user.toJSON(), env.jwt_access_token, {
			expiresIn: "10s",
		});
		let refreshToken = jwt.sign(user.toJSON(), env.jwt_refresh_token, {
			expiresIn: "1d",
		});

		//Get the Redis Client
		let redis = new Redis();
		//Get the 'refreshTokens' List from Redis
		const refreshTokens = await redis.lrange("refreshTokens", 0, -1);

		// new Redis(8000, "192.168.1.1");
		// new Redis("/tmp/redis.sock");

		//If the Refresh Token is not in the Redis Database
		if (!refreshTokens.includes(refreshToken)) {
			//Add the Refresh Token to the Redis Database
			await redis.rpush("refreshTokens", refreshToken);
			//Set the Refresh Token Expiration to 5 Hours
			await redis.expire("refreshTokens", 18000);
		}
		//Disconnect the Redis Client
		redis.disconnect();

		//Return the Access Token and Refresh Token & Set the Cookies with the Access Token and Refresh Token
		return res
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				expires: new Date(Date.now() + 10000),
				sameSite: "strict",
			})
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				expires: new Date(Date.now() + 86400000),
				sameSite: "strict",
			})
			.status(200)
			.json({
				message: "User Logged In Successfully!",
				data: {
					accessToken,
					refreshToken,
					message: "Here are your Tokens. Please Keep it Safe !!!",
				},
			});
	} catch (error) {
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

//If the Header has Correct Access Token & the 'req.user' is the Logged in User, then run the function
module.exports.update = async (req, res) => {
	try {
		//If the Logged In User is the Same as the Profile User
		if (req.user.id == req.params.id) {
			return res.status(200).json({
				response: "success",
				message: "User Profile Updated Successfully!",
			});
		}
		//Unauthorized Access
		return res.status(401).json({
			response: "failure",
			message: "Unauthorized Access",
		});
	} catch (error) {
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

//If the Header has Correct Access Token, then run the function
module.exports.verify = async (req, res) => {
	try {
		//Get the Access Token from the Header
		let accessToken = req.headers["authorization"];
		accessToken = accessToken.split(" ")[1];

		//Verify the Access Token
		let user = jwt.verify(accessToken, env.jwt_access_token);

		return res.status(200).json({
			response: "success",
			message: "Access Token Available!",
		});
	} catch (error) {
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

//If the Header has Correct Access Token & the 'req.user' is the Logged in User, then run the function
module.exports.logout = async (req, res) => {
	try {
		//Get the Refresh Token from the Cookies
		let refreshToken = req.cookies.refreshToken;

		//Get the Redis Client
		let redis = new Redis();
		//Get the 'refreshTokens' List from Redis
		let refreshTokens = await redis.lrange("refreshTokens", 0, -1);

		console.log(await redis.lrange("refreshTokens", 0, -1));

		//Remove the Refresh Token from the Redis Database
		refreshTokens = refreshTokens.filter((token) => token != refreshToken);
		await redis.del("refreshTokens");
		for (let token of refreshTokens) {
			await redis.rpush("refreshTokens", token);
		}

		//** To Delete All the Refresh Tokens from the Redis Server **//
		// await redis.del("refreshTokens");

		console.log(await redis.lrange("refreshTokens", 0, -1));

		//Disconnect the Redis Client
		redis.disconnect();

		//Delete the Access Token Cookie & Refresh Token Cookie to Log the User Out
		return res
			.clearCookie("accessToken")
			.clearCookie("refreshToken")
			.status(200)
			.json({
				response: "success",
				message: "User Logged Out Successfully!",
			});
	} catch (error) {
		return res.status(500).json({
			response: "error",
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
