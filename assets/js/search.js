{
	//Search Bar
	try {
		const searchBar = () => {
			const header = document.querySelector(".header");
			const searchBar = document.querySelector(".header__left");
			searchBar.style.display = "flex";
			header.style.justifyContent = "space-between";
		};
		searchBar();
	} catch (error) {
		console.log(error);
	}
	//Search Functionality
	try {
		const searchBar = () => {
			const searchBar = document.querySelector(".header__left input");
			searchBar.addEventListener("input", (e) => {
				e.stopPropagation();
				const value = e.target.value;
				if (value === "") {
					removeChildren(document.querySelector(".songs"));
					removeChildren(document.querySelector(".albums"));
					removeChildren(document.querySelector(".playlists"));
					removeChildren(document.querySelector(".artists"));
					removeChildren(document.querySelector(".users"));
					noResults(document.querySelector(".songs"));
					noResults(document.querySelector(".albums"));
					noResults(document.querySelector(".playlists"));
					noResults(document.querySelector(".artists"));
					noResults(document.querySelector(".users"));
					return;
				}
				search(value);
			});
		};

		const debounce = (callback, delay) => {
			let timeoutID;
			return (...value) => {
				clearTimeout(timeoutID);
				timeoutID = setTimeout(() => {
					callback(...value);
				}, delay);
			};
		};

		const fetchItems = async (value) => {
			if (value.length === 0) return;
			if (value === " ") return;
			try {
				const response = await fetch(`/search/${value}`);
				const data = await response.json();
				return data;
			} catch (error) {
				return error;
			}
		};

		const search = debounce(async (value) => {
			try {
				if (value.length === 0) return;
				if (value === " ") return;
				let data = await fetchItems(value);
				if (data.response === "error") {
					console.log("Message: ", data.message);
					console.log("Error: ", data.error);
					return;
				}
				createTracks(data.data.tracks);
				try {
					playbar();
				} catch (error) {}
				createAlbums(data.data.albums);
				createPlaylists(data.data.playlists, data.data.existingPlaylists);
				createArtists(data.data.artists);
				createUsers(data.data.users);
			} catch (error) {
				return;
			}
		}, 150);

		const createTracks = (tracks) => {
			removeChildren(document.querySelector(".songs"));

			if (tracks.length === 0) {
				noResults(document.querySelector(".songs"));
				return;
			}

			for (let track of tracks) {
				let songResults = document
					.querySelectorAll("template")[1]
					.content.cloneNode(true).children[0];

				songResults.setAttribute("data-song-url", track.url);
				songResults.setAttribute("data-song-artist", track.artist.name);
				songResults.setAttribute("data-song-name", track.name);
				songResults.setAttribute("data-song-thumbnail", track.thumbnail);

				let album = songResults.querySelector(".album");
				let h4 = songResults.querySelector("h4");
				let p = songResults.querySelector("p");

				if (track.thumbnail.includes("images")) {
					album.style.backgroundImage = `url(..${track.thumbnail})`;
				} else {
					album.style.backgroundImage = `url(../..${track.thumbnail})`;
				}
				h4.textContent = track.name;
				p.textContent = track.artist.name;
				document.querySelector(".songs").appendChild(songResults);
			}
		};

		const createAlbums = (albums) => {
			removeChildren(document.querySelector(".albums"));

			if (albums.length === 0) {
				noResults(document.querySelector(".albums"));
				return;
			}

			for (let item of albums) {
				let albumResults = document
					.querySelectorAll("template")[2]
					.content.cloneNode(true).children[0];

				albumResults.onclick = () => {
					window.location.href = `/albums/${item._id}`;
				};

				let album = albumResults.querySelector(".album");
				let h4 = albumResults.querySelector("h4");

				if (item.thumbnail.includes("images")) {
					album.style.backgroundImage = `url(..${item.thumbnail})`;
				} else {
					album.style.backgroundImage = `url(../..${item.thumbnail})`;
				}
				h4.textContent = item.name;
				document.querySelector(".albums").appendChild(albumResults);
			}
		};

		const createPlaylists = (playlists, existingPlaylists) => {
			removeChildren(document.querySelector(".playlists"));

			if (playlists.length + existingPlaylists.length === 0) {
				noResults(document.querySelector(".playlists"));
				return;
			}

			for (let item of playlists) {
				let playlistResults = document
					.querySelectorAll("template")[3]
					.content.cloneNode(true).children[0];
				playlistResults.onclick = () => {
					window.location.href = `/playlists/custom/${item._id}`;
				};
				let album = playlistResults.querySelector(".album img");
				let h4 = playlistResults.querySelector("h4");
				album.src = `${item.thumbnail}`;
				album.alt = item.name;
				h4.textContent = item.name;
				document.querySelector(".playlists").appendChild(playlistResults);
			}

			for (let item of existingPlaylists) {
				let playlistResults = document
					.querySelectorAll("template")[3]
					.content.cloneNode(true).children[0];
				playlistResults.onclick = () => {
					window.location.href = `/playlists/${item._id}`;
				};
				let album = playlistResults.querySelector(".album img");
				let h4 = playlistResults.querySelector("h4");
				album.src = `${item.thumbnail}`;
				album.alt = item.name;
				h4.textContent = item.name;
				document.querySelector(".playlists").appendChild(playlistResults);
			}
		};

		const createArtists = (artists) => {
			removeChildren(document.querySelector(".artists"));

			if (artists.length === 0) {
				noResults(document.querySelector(".artists"));
				return;
			}

			for (let item of artists) {
				let artistResults = document
					.querySelectorAll("template")[4]
					.content.cloneNode(true).children[0];

				artistResults.onclick = () => {
					window.location.href = `/artists/${item._id}`;
				};

				let album = artistResults.querySelector(".artistImage");
				let h4 = artistResults.querySelector("h4");

				if (item.thumbnail.includes("images")) {
					album.style.backgroundImage = `url(..${item.thumbnail})`;
				} else {
					album.style.backgroundImage = `url(../..${item.thumbnail})`;
				}
				h4.textContent = item.name;
				document.querySelector(".artists").appendChild(artistResults);
			}
		};

		const createUsers = (users) => {
			removeChildren(document.querySelector(".users"));

			if (users.length === 0) {
				noResults(document.querySelector(".users"));
				return;
			}
			for (let item of users) {
				let userResults = document
					.querySelectorAll("template")[5]
					.content.cloneNode(true).children[0];

				userResults.onclick = () => {
					window.location.href = `/users/profile/${item._id}`;
				};

				let album = userResults.querySelector(".artistImage img");
				let h4 = userResults.querySelector("h4");
				album.src = `${item.avatar}`;
				album.alt = item.name;
				h4.textContent = item.name;
				document.querySelector(".users").appendChild(userResults);
			}
		};

		const removeChildren = (parent) => {
			while (parent.firstChild) {
				parent.removeChild(parent.firstChild);
			}
		};

		const noResults = (element) => {
			let noResults = document
				.querySelectorAll("template")[0]
				.content.cloneNode(true).children[0];
			element.appendChild(noResults);
		};

		const playbar = () => {
			let footer = document.querySelector(".footer");
			let songs = document.querySelectorAll(".playable-tracks");
			let play_pause = footer.querySelector(".play-pause");
			let audio = document.querySelector("audio");

			for (let song of songs) {
				song.addEventListener("click", (e) => {
					footer.classList.toggle("active");
					let songUrl = song.getAttribute("data-song-url");
					audio.src = songUrl;

					if (footer.classList.contains("active")) {
						play_pause.classList.remove("fa-circle-play");
						play_pause.classList.add("fa-circle-pause");
						audio.addEventListener("canplaythrough", (event) => {
							audio.play();
						});
					} else {
						play_pause.classList.remove("fa-circle-pause");
						play_pause.classList.add("fa-circle-play");
						audio.addEventListener("canplaythrough", (event) => {
							audio.pause();
						});
					}

					let songName = song.getAttribute("data-song-name");
					let songThumbnail = song.getAttribute("data-song-thumbnail");
					let songArtist = song.getAttribute("data-song-artist");

					footer.querySelector(".footer__albumLogo").src = songThumbnail;
					footer.querySelector(".footer__songInfo h4").textContent =
						songName;
					footer.querySelector(".footer__songInfo p").textContent =
						songArtist;
				});
			}

			footer.querySelector(".song_volume").addEventListener("input", (e) => {
				audio.volume = e.target.value / 100;
			});

			footer.querySelector(".song_volume").addEventListener("wheel", (e) => {
				if (e.deltaY < 0) {
					e.target.valueAsNumber += 1;
					audio.volume = e.target.value / 100;
				} else {
					e.target.value -= 1;
					audio.volume = e.target.value / 100;
				}
				e.preventDefault();
				e.stopPropagation();
			});
		};

		searchBar();
	} catch (error) {
		console.log(error);
	}
}
