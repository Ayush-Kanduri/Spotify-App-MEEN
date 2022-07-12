{
	try {
		let Tracks;
		let currentTrack;
		let playbarVisible;
		let volume;
		let isPlaying;

		let footer = document.querySelector(".footer");
		let songs = document.querySelectorAll(".songRow");
		let play_pause = footer.querySelector(".play-pause");
		let audio = document.querySelector("audio");
		let volumeControl = footer.querySelector(".song_volume");
		let clearQueue = footer.querySelector(".clearQueue");
		let forward = footer.querySelector(".forward");
		let backward = footer.querySelector(".backward");

		const fetchAPI = async (url, options = {}) => {
			try {
				const response = await fetch(url, options);
				const data = await response.json();
				return data;
			} catch (error) {
				console.log(error);
			}
		};

		const getQueueData = async () => {
			try {
				const data = await fetchAPI("/queue");
				const Queue = data.data;
				({ Tracks, currentTrack, playbarVisible, volume, isPlaying } =
					Queue);
				console.log(
					Tracks,
					currentTrack,
					playbarVisible,
					volume,
					isPlaying
				);
			} catch (error) {
				console.log(error);
			}
		};

		getQueueData();

		const playbar = async () => {
			for (let song of songs) {
				song.addEventListener("click", async (e) => {
					e.stopPropagation();
					e.preventDefault();
					const name = song.getAttribute("data-song-name");
					const artist = song.getAttribute("data-song-artist");
					const url = song.getAttribute("data-song-url");
					const thumbnail = song.getAttribute("data-song-thumbnail");
					const name1 = name.trim().toLowerCase();
					const name2 = Tracks[currentTrack]?.name.trim().toLowerCase();
					const duration = 0;
					const currentTime = 0;
					const ended = false;

					if (name1 === name2) {
						if (isPlaying) {
							await pause(Tracks[currentTrack]);
							play_pause.classList.remove("fa-circle-pause");
							play_pause.classList.add("fa-circle-play");
							return;
						} else {
							await play(Tracks[currentTrack]);
							play_pause.classList.remove("fa-circle-play");
							play_pause.classList.add("fa-circle-pause");
							return;
						}
					}

					const Track = {
						name,
						artist,
						url,
						thumbnail,
						duration,
						currentTime,
						ended,
						isPlaying: true,
					};

					const data = await fetchAPI("/queue/add", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							Track: Track,
							currentTrack: currentTrack,
							playbarVisible: playbarVisible,
							volume: volume,
							isPlaying: isPlaying,
						}),
					});
					const Queue = data.data;
					({ Tracks, currentTrack, playbarVisible, volume, isPlaying } =
						Queue);
					console.log(
						Tracks,
						currentTrack,
						playbarVisible,
						volume,
						isPlaying
					);

					audio.src = Tracks[currentTrack].url;
					audio.volume = volume;
					await play(Tracks[currentTrack]);
					await togglePlayBar(Tracks[currentTrack]);

					if (Tracks[currentTrack].isPlaying) {
						play_pause.classList.remove("fa-circle-play");
						play_pause.classList.add("fa-circle-pause");
					}
				});
			}
			volumeControl.addEventListener("input", async (e) => {
				await volumeChange(e);
			});
			volumeControl.addEventListener("wheel", async (e) => {
				await volumeScroll(e);
			});
			play_pause.addEventListener("click", async (e) => {
				await playToggle(Tracks[currentTrack], e);
			});
			forward.addEventListener("click", async (e) => {
				await next();
			});
			backward.addEventListener("click", async (e) => {
				await previous();
			});
			clearQueue.addEventListener("click", async (e) => {
				await deleteQueue();
			});
			audio.addEventListener("ended", async (e) => {
				await stop();
				if (currentTrack === Tracks.length - 1) {
					await pause(Tracks[currentTrack]);
					play_pause.classList.remove("fa-circle-pause");
					play_pause.classList.add("fa-circle-play");
				}
				await next();
			});
		};

		const play = async (Track) => {
			await audio.play();
			isPlaying = true;
			playbarVisible = true;
			Track.duration = audio.duration;
			Track.currentTime = audio.currentTime;
			Track.isPlaying = !audio.paused;
			Track.ended = audio.ended;
		};

		const pause = async (Track) => {
			await audio.pause();
			isPlaying = false;
			playbarVisible = true;
			Track.duration = audio.duration;
			Track.currentTime = audio.currentTime;
			Track.isPlaying = !audio.paused;
			Track.ended = audio.ended;
		};

		const stop = async () => {
			await audio.pause();
			audio.currentTime = 0;
		};

		const next = async () => {
			if (currentTrack === Tracks.length - 1) return;
			await stop();
			currentTrack++;
			audio.src = Tracks[currentTrack].url;
			audio.volume = volume;
			play_pause.classList.remove("fa-circle-play");
			play_pause.classList.add("fa-circle-pause");
			await togglePlayBar(Tracks[currentTrack]);
			await play(Tracks[currentTrack]);
		};

		const previous = async () => {
			if (currentTrack === 0) return;
			await stop();
			currentTrack--;
			audio.src = Tracks[currentTrack].url;
			audio.volume = volume;
			play_pause.classList.remove("fa-circle-play");
			play_pause.classList.add("fa-circle-pause");
			await togglePlayBar(Tracks[currentTrack]);
			await play(Tracks[currentTrack]);
		};

		const deleteQueue = async () => {
			await stop();
			Tracks = [];
			currentTrack = -1;
			playbarVisible = false;
			volume = 0.1;
			isPlaying = false;
			await fetchAPI("/queue/clear", { method: "DELETE" });
			await togglePlayBar();
		};

		const volumeScroll = async (e) => {
			e.stopPropagation();
			if (e.deltaY < 0) {
				e.target.valueAsNumber += 1;
				audio.volume = e.target.value / 100;
			} else {
				e.target.value -= 1;
				audio.volume = e.target.value / 100;
			}
			volume = audio.volume;
			e.preventDefault();
		};

		const volumeChange = async (e) => {
			audio.volume = e.target.value / 100;
			volume = audio.volume;
		};

		const playToggle = async (Track, e) => {
			if (Track.isPlaying) {
				await pause(Track);
				e.target.classList.remove("fa-circle-pause");
				e.target.classList.add("fa-circle-play");
			} else {
				await play(Track);
				e.target.classList.remove("fa-circle-play");
				e.target.classList.add("fa-circle-pause");
			}
		};

		const togglePlayBar = async (Track = []) => {
			if (playbarVisible) {
				footer.style.display = "flex";
				const album = footer.querySelector(".footer__albumLogo");
				const name = footer.querySelector(".footer__songInfo h4");
				const artist = footer.querySelector(".footer__songInfo p");
				album.src = Track.thumbnail;
				name.textContent = Track.name;
				artist.textContent = Track.artist;
			} else {
				footer.style.display = "none";
			}
		};

		playbar();
	} catch (error) {
		console.log(error);
	}
}
