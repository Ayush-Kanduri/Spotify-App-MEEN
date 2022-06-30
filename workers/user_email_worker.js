const queue = require("../config/kue");
const usersMailer = require("../mailers/users_mailer");

queue.process("accountVerificationEmails", (job, done) => {
	usersMailer.newUser(job.data);
	done();
});
