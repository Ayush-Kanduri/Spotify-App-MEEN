const mongoose = require("mongoose");
const env = require("./environment");

let db;

const Development = async () => {
	try {
		mongoose.connect(`${env.db}`);
		db = mongoose.connection;
		db.on("error", console.error.bind(console, "Connection Error"));
		db.once("open", () => {
			console.log("Connected to MongoDB Successfully");
		});
	} catch (error) {
		console.log(error);
	}
};

const Production = async () => {
	try {
		const options = { useNewUrlParser: true, useUnifiedTopology: true };
		await mongoose.connect(`${env.db}`, options);
		db = mongoose.connection;
		console.log("Connected to MongoDB Successfully");
	} catch (error) {
		console.log(error);
	}
};

const EstablishConnection = async () => {
	try {
		if (env.name === "development" && env.deployment === "local") {
			await Development();
		} else if (env.name === "production" && env.deployment === "AWS") {
			await Development();
		} else if (env.name === "production" && env.deployment === "Heroku") {
			await Production();
		}
		if (!db) console.log("Connection Error");
	} catch (error) {
		console.log(error);
	}
};

EstablishConnection();

module.exports = db;
