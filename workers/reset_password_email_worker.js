const queue = require("../config/kue");
const passwordsResetMailer = require("../mailers/password_reset_mailer");

queue.process("passwordResetEmails", (job, done) => {
	passwordsResetMailer.passwordReset(job.data);
	done();
});
