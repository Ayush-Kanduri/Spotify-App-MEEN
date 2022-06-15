module.exports.show=(req, res)=>{
    return res.render("user_playlist", {
        title: "Playlist",
    });
}

module.exports.add = (req, res) => {
	return res.render("create_playlist", {
		title: "Create Playlist",
	});
};