module.exports.search = (req, res) => {
	try {
		return res.render("search", {
			title: "Search",
		});
	} catch (error) {
		console.log(error);
		return res.redirect("back");
	}
};
