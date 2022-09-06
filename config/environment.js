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
	name: process.env.SC_DEVELOPMENT_ENVIRONMENT,
	asset_path: process.env.SC_DEVELOPMENT_ASSET_PATH,
	session_cookie_key: process.env.SC_DEVELOPMENT_SESSION_COOKIE_KEY,
	db: process.env.SC_DEVELOPMENT_DB,
	db_name: process.env.SC_DEVELOPMENT_DB_NAME,
	deployment: process.env.DEPLOYMENT,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.SC_DEVELOPMENT_USER_EMAIL,
			pass: process.env.SC_DEVELOPMENT_USER_PASS,
		},
	},
	google_client_id: process.env.SC_DEVELOPMENT_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.SC_DEVELOPMENT_GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.SC_DEVELOPMENT_GOOGLE_CALLBACK_URL,
	spotify_client_id: process.env.SC_DEVELOPMENT_SPOTIFY_CLIENT_ID,
	spotify_client_secret: process.env.SC_DEVELOPMENT_SPOTIFY_CLIENT_SECRET,
	spotify_callback_url: process.env.SC_DEVELOPMENT_SPOTIFY_CALLBACK_URL,
	jwt_access_token: process.env.SC_DEVELOPMENT_JWT_ACCESS_TOKEN,
	jwt_refresh_token: process.env.SC_DEVELOPMENT_JWT_REFRESH_TOKEN,
	express_server_port: process.env.SC_DEVELOPMENT_EXPRESS_SERVER_PORT,
	email_sender: process.env.SC_DEVELOPMENT_FROM_EMAIL,
	website_link: process.env.SC_DEVELOPMENT_WEBSITE_LINK,
	jwt_share_token: process.env.SC_DEVELOPMENT_JWT_SHARE_TOKEN,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

const production = {
	name: process.env.SC_ENVIRONMENT,
	asset_path: process.env.ASSET_PATH,
	session_cookie_key: process.env.SC_SESSION_COOKIE_KEY,
	db: process.env.SC_DB,
	db_name: process.env.SC_DB_NAME,
	deployment: process.env.DEPLOYMENT,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.SC_USER_EMAIL,
			pass: process.env.SC_USER_PASS,
		},
	},
	google_client_id: process.env.SC_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.SC_GOOGLE_CLIENT_SECRET,
	google_callback_url: `${process.env.SC_WEBSITE_LINK}${process.env.SC_GOOGLE_CALLBACK_URL}`,
	spotify_client_id: process.env.SC_SPOTIFY_CLIENT_ID,
	spotify_client_secret: process.env.SC_SPOTIFY_CLIENT_SECRET,
	spotify_callback_url: `${process.env.SC_WEBSITE_LINK}${process.env.SC_SPOTIFY_CALLBACK_URL}`,
	jwt_access_token: process.env.SC_JWT_ACCESS_TOKEN,
	jwt_refresh_token: process.env.SC_JWT_REFRESH_TOKEN,
	express_server_port: process.env.SC_EXPRESS_SERVER_PORT,
	email_sender: process.env.SC_FROM_EMAIL,
	website_link: process.env.SC_WEBSITE_LINK,
	jwt_share_token: process.env.SC_JWT_SHARE_TOKEN,
	redis_host: process.env.SC_REDIS_HOST,
	redis_port: process.env.SC_REDIS_PORT,
	redis_auth: process.env.SC_REDIS_AUTH,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

// module.exports = development;

module.exports =
	eval(process.env.ENVIRONMENT) == undefined
		? development
		: eval(process.env.ENVIRONMENT);

// module.exports =
// 	eval(process.env.NODE_ENV) == undefined
// 		? development
// 		: eval(process.env.NODE_ENV);
