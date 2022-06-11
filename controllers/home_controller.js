module.exports.home = (req, res) => {
	if (req.isAuthenticated()) {
		// const playLists = req.session.playlists;
		// req.session.playlists = null;
		return res.render("home", {
			title: "Home",
			// playlists: playLists ? playLists : null,
		});
	}
	return res.render("home", {
		title: "Home",
	});
};
