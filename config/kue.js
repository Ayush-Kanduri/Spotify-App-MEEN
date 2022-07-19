const kue = require("kue");
const env = require("./environment");
let queue = "";

if (env.name == "development") {
	//queue = kue.createQueue({redis: {port: 6379,host: "localhost",auth: ""}});
	queue = kue.createQueue();
} else {
	queue = kue.createQueue({
		prefix: "q",
		redis: {
			port: env.redis_port,
			host: env.redis_host,
			auth: env.redis_auth,
		},
	});
}

module.exports = queue;
