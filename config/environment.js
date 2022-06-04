const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
});

const development = {
	name: "development",
	asset_path: process.env.SC_DEVELOPMENT_ASSET_PATH,
	session_cookie_key: process.env.SC_DEVELOPMENT_SESSION_COOKIE_KEY,
	db: process.env.SC_DEVELOPMENT_DB,
	// smtp: {
	// 	service: "gmail",
	// 	host: "smtp.gmail.com",
	// 	port: 587,
	// 	secure: false,
	// 	auth: {
	// 		user: process.env.SC_DEVELOPMENT_USER_EMAIL,
	// 		pass: process.env.SC_DEVELOPMENT_USER_PASS,
	// 	},
	// },
	// google_client_id: process.env.SC_DEVELOPMENT_GOOGLE_CLIENT_ID,
	// google_client_secret: process.env.SC_DEVELOPMENT_GOOGLE_CLIENT_SECRET,
	// google_callback_url: process.env.SC_DEVELOPMENT_GOOGLE_CALLBACK_URL,
	// jwt_secret: process.env.SC_DEVELOPMENT_JWT_SECRET,
	express_server_port: process.env.SC_DEVELOPMENT_EXPRESS_SERVER_PORT,
	// email_sender: process.env.SC_DEVELOPMENT_FROM_EMAIL,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

// const production = {
// 	name: "production",
// 	asset_path: process.env.SC_ASSET_PATH,
// 	session_cookie_key: process.env.SC_SESSION_COOKIE_KEY,
// 	db: process.env.SC_DB,
// 	smtp: {
// 		service: "gmail",
// 		host: "smtp.gmail.com",
// 		port: 587,
// 		secure: false,
// 		auth: {
// 			user: process.env.SC_USER_EMAIL,
// 			pass: process.env.SC_USER_PASS,
// 		},
// 	},
// 	google_client_id: process.env.SC_GOOGLE_CLIENT_ID,
// 	google_client_secret: process.env.SC_GOOGLE_CLIENT_SECRET,
// 	google_callback_url: process.env.SC_GOOGLE_CALLBACK_URL,
// 	jwt_secret: process.env.SC_JWT_SECRET,
// 	express_server_port: process.env.SC_EXPRESS_SERVER_PORT,
// 	email_sender: process.env.SC_FROM_EMAIL,
// 	morgan: {
// 		mode: "combined",
// 		options: {
// 			stream: accessLogStream,
// 		},
// 	},
// };

module.exports = development;

// module.exports =
// 	eval(process.env.TSB_ENVIRONMENT) == undefined
// 		? development
// 		: eval(process.env.TSB_ENVIRONMENT);
