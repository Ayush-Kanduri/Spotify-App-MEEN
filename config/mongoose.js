const mongoose = require("mongoose");
const env = require("./environment");
mongoose.connect(`${env.db}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Connected to MongoDB Successfully");
});

module.exports = db;
