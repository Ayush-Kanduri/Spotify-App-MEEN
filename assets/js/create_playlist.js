class CreatePlaylist {
	constructor() {
		this.form = document.getElementById("create_playlist");
		this.thumbnail = document.getElementsByClassName("playlistPoster")[0];
		this.info = document.getElementsByClassName("body__infoText")[0];
		this.poster = document.getElementsByClassName("playlistPoster")[0];
		this.songs = document.getElementsByClassName("songRow");

		this.createPlaylist();
	}
	createPlaylist() {
		let self = this;
		self.form.addEventListener("submit", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			let formSelf = e.target; //or formSelf = this;
			let formData = new FormData(formSelf);

			// --------------STUDY REFERENCE--------------
			// const name = formData.get("name"); //test
			// console.log({name}); //{name: "test"}
			// console.log(name); //test
			// let Data = Object.fromEntries(formData.entries()); //json object {name: "test"}
			// Data.songs = formData.getAll("songs"); //checkboxes {name: "test", songs: ["1", "2"]}
			// console.log(data); //{name: "test", songs: ["1", "2"]}
			// --------------STUDY REFERENCE--------------

			// --------------STUDY REFERENCE--------------
			// const thumbnail = formData.get("thumbnail");
			// if (
			// 	thumbnail.type !== "image/jpeg" ||
			// 	thumbnail.type !== "image/png" ||
			// 	thumbnail.type !== "image/jpg" ||
			// 	thumbnail.type !== "image/gif"
			// ) {
			// 	new Noty({
			// 		theme: "metroui",
			// 		text: "Please upload a valid image",
			// 		type: "error",
			// 		layout: "topRight",
			// 		timeout: 3000,
			// 	}).show();
			// 	return;
			// }
			// --------------STUDY REFERENCE--------------

			const name = formData.get("name");
			if (
				name === "" ||
				name === null ||
				name === undefined ||
				name === " "
			) {
				new Noty({
					theme: "metroui",
					text: "Please enter a name for the playlist",
					type: "error",
					layout: "topRight",
					timeout: 3000,
				}).show();
				return;
			}

			const songs = formData.getAll("songs");
			if (songs.length <= 1) {
				new Noty({
					theme: "metroui",
					text: "Please select at least 2 songs",
					type: "error",
					layout: "topRight",
					timeout: 3000,
				}).show();
				return;
			}

			try {
				const url = `/playlists/create-playlist`;
				const response = await fetch(url, {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				console.log(data);
				let id = data.playlist._id.toString();
				window.location.href = `/playlists/custom/${id}`;
			} catch (error) {
				console.log(error);
				new Noty({
					theme: "metroui",
					text: error.message,
					type: "error",
					layout: "topRight",
					timeout: 3000,
				}).show();
				return;
			}
		});
	}
}

{
	try {
		let createPlaylist = new CreatePlaylist();
	} catch (error) {
		console.log(error);
	}
}
