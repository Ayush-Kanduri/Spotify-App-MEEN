const env = require("./environment");
const fs = require("fs");
const path = require("path");

module.exports = (app) => {
	app.locals.assetPath = (filePath) => {
		if (env.name === "development") return "/" + filePath;
		const manifest = path.join(`/public/rev-manifest.json`);
		const manifestPath = path.join(__dirname + ".." + manifest);
		// fs.readFileSync(manifestPath);
		// return;
		return "/" + JSON.parse(fs.readFileSync(manifestPath))[filePath];
	};
};
