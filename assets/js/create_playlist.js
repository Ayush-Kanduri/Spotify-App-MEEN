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
	//New Playlist Creation
	try {
		let createPlaylist = new CreatePlaylist();
	} catch (error) {
		console.log(error);
	}
	//Playlist Screen Name & Poster Update
	try {
		const playlist = () => {
			const playlistPoster = document.querySelector(".playlistPoster");
			const playlistNameInput = document.querySelector(
				".playlist_nameInput"
			);
			const playlistName = document.querySelector(".playlist_name");

			playlistName.onclick = (e) => {
				e.target.classList.toggle("active");
				playlistNameInput.classList.toggle("active");
				playlistNameInput.focus();
				//To place the cursor at the end of the input
				const length = playlistNameInput.value.length;
				playlistNameInput.setSelectionRange(length, length);
			};

			playlistNameInput.onkeypress = (e) => {
				if (e.key === "Enter") {
					e.target.classList.toggle("active");
					playlistName.classList.toggle("active");
					playlistName.textContent = "";
					playlistName.textContent = e.target.value;
				}
			};

			playlistNameInput.onchange = (e) => {
				e.target.classList.toggle("active");
				playlistName.classList.toggle("active");
				playlistName.textContent = "";
				playlistName.textContent = e.target.value;
				// console.log(e.target.value);
				e.target.blur();
			};

			playlistPoster.onchange = (e) => {
				// console.log(e.target.files[0]);
			};
		};
		playlist();
	} catch (error) {
		// console.log(error);
	}
	//Dropdown Menu
	try {
		const header = () => {
			const dropdown = document.querySelector(".header__right");
			const dropdownMenu = document.querySelector(".dropdown_menu");
			dropdown.onclick = () => {
				dropdownMenu.classList.toggle("active");
			};
		};
		header();
	} catch (error) {
		console.log(error);
	}
	//Sidebar Responsiveness
	try {
		const jsMediaQuery = (width) => {
			const sidebar = document.querySelector(".sidebar");
			if (width.matches) {
				sidebar.style.display = "none";
			} else {
				sidebar.style.display = "initial";
			}
		};
		const sidebar = () => {
			const width = window.matchMedia("(max-width: 700px)");
			jsMediaQuery(width);
			width.addEventListener("change", jsMediaQuery);
		};
		sidebar();
	} catch (error) {
		console.log(error);
	}
}
