const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const Redis = require("ioredis");

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
