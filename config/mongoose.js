const mongoose = require("mongoose");
const env = require("./environment");
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Connected to MongoDB Successfully");
});

module.exports = db;
