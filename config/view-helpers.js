const env = require("./environment");
const fs = require("fs");
const path = require("path");

module.exports = (app) => {
	app.locals.assetPath = (filePath) => {
		if (env.name === "development") return "/" + filePath;
		const manifestPath = path.join(
			__dirname,
			`../public/assets/rev-manifest.json`
		);
		return "/" + JSON.parse(fs.readFileSync(manifestPath))[filePath];
	};
};
