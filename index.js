const express = require("express");
const app = express();
const viewHelpers = require("./config/view-helpers")(app);
const dotenv = require("dotenv").config();
const env = require("./config/environment");
const port = process.env.PORT || env.express_server_port;
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");
const session = require("express-session");
const sassMiddleware = require("node-sass-middleware");
const db = require("./config/mongoose");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const passportJWT = require("passport-jwt");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportSpotify = require("./config/passport-spotify-strategy");
const MongoStore = require("connect-mongo");
const route = require("./routes/index");

app.use(cors());
if (env.name == "development") {
	app.use(
		sassMiddleware({
			src: path.join(__dirname, env.asset_path, "scss"),
			dest: path.join(__dirname, env.asset_path, "css"),
			debug: false,
			outputStyle: "extended",
			prefix: "/css",
		})
	);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/storage", express.static(__dirname + "/storage"));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
	session({
		name: "spotifyclone",
		secret: env.session_cookie_key,
		//Don't save the uninitialized session
		saveUninitialized: false,
		//Don't re-save the session if it is not modified
		resave: false,
		//Cookie Options
		cookie: {
			//Cookie Expiry Time - 100 Minutes
			maxAge: 1000 * 60 * 100,
		},
		//MongoStore is used to store the Session Cookies in the MongoDB
		store: MongoStore.create(
			{
				//DB Connection URL
				mongoUrl: `${env.db}`,
				//Interacts with the mongoose to connect to the MongoDB
				mongooseConnection: db,
				//To auto remove the store
				autoRemove: "disabled",
			},
			(err) => {
				//If there is an error
				if (err) {
					console.log(err || "connect-mongodb setup ok");
				}
			}
		),
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setFlash);
app.use(customMiddleware.addMusic);
app.use(customMiddleware.createUploads);
app.use("/", route);

app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is Up & Running Successfully on Port: ${port}`);
});
