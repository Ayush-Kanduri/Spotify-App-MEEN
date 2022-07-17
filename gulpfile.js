const gulp = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const del = require("del");

const assets = "./assets";
const public = "./public/assets";

gulp.task("css", (done) => {
	console.log("🔸 Converting SASS -> CSS & Minifying CSS...");
	gulp
		.src(`${assets}/sass/**/*.scss`)
		.pipe(sass())
		.pipe(cssnano())
		.pipe(gulp.dest(`${assets}/css`));
	console.log("DONE ✔");
	console.log("🔸 Renaming CSS & Creating Manifest...");
	gulp
		.src(`${assets}/**/*.css`)
		.pipe(rev())
		.pipe(gulp.dest(`${public}`))
		.pipe(rev.manifest({ cwd: "public", merge: true }))
		.pipe(gulp.dest(`${public}`));
	console.log("DONE ✔");
	done();
});

gulp.task("js", (done) => {
	console.log("🔸 Minifying & Renaming Javascript, & Creating Manifest...");
	gulp
		.src(`${assets}/**/*.js`)
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(`${public}`))
		.pipe(rev.manifest({ cwd: "public", merge: true }))
		.pipe(gulp.dest(`${public}`));
	console.log("DONE ✔");
	done();
});

gulp.task("images", (done) => {
	console.log("🔸 Compressing & Renaming Images, & Creating Manifest...");
	gulp
		.src(`${assets}/**/*.+(png|jpg|jpeg|gif|svg)`)
		.pipe(imagemin())
		.pipe(rev())
		.pipe(gulp.dest(`${public}`))
		.pipe(rev.manifest({ cwd: "public", merge: true }))
		.pipe(gulp.dest(`${public}`));
	console.log("DONE ✔");
	done();
});

gulp.task("clean:assets", (done) => {
	console.log("🔸 Clearing the Previous Builds...");
	del.sync([`${public}`], { force: true });
	console.log("DONE ✔");
	done();
});

gulp.task(
	"build",
	gulp.series("clean:assets", "css", "js", "images"),
	(done) => {
		console.log("🔸 Building Assets...");
		console.log("DONE ✔");
		done();
	}
);
