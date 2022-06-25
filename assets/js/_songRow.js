{
	try {
		const playbar = () => {
			let footer = document.querySelector(".footer");
			let songs = document.querySelectorAll(".songRow");
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

			play_pause.addEventListener("click", (e) => {
				if (e.target.classList.contains("fa-circle-play")) {
					e.target.classList.remove("fa-circle-play");
					e.target.classList.add("fa-circle-pause");
					audio.play();
				} else {
					e.target.classList.remove("fa-circle-pause");
					e.target.classList.add("fa-circle-play");
					audio.pause();
				}
			});
		};
		playbar();
	} catch (error) {
		console.log(error);
	}
}