const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("../config/environment");

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
	let mailHTML;
	ejs.renderFile(
		path.join(__dirname, "../views/mailers", relativePath),
		data,
		(err, template) => {
			if (err) {
				console.log("Error rendering the template: ", err);
				return;
			}
			mailHTML = template;
		}
	);
	return mailHTML;
};

module.exports = {
	transporter: transporter,
	renderTemplate: renderTemplate,
};
