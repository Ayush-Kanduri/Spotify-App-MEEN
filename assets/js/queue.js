{
	try {
		let Tracks;
		let currentTrack;
		let playbarVisible;
		let volume;
		let isPlaying;
		let loop;

		let footer = document.querySelector(".footer");
		let songs = document.querySelectorAll(".playable-tracks");
		let play_pause = footer.querySelector(".play-pause");
		let audio = document.querySelector("audio");
		let volumeControl = footer.querySelector(".song_volume");
		let clearQueue = footer.querySelector(".clearQueue");
		let forward = footer.querySelector(".forward");
		let backward = footer.querySelector(".backward");
		let repeat = footer.querySelector(".repeat");
		let shuffle = footer.querySelector(".shuffle");

		const fetchAPI = async (url, options = {}) => {
			try {
				const response = await fetch(url, options);
				const data = await response.json();
				return data;
			} catch (error) {
				console.log(error);
			}
		};

		const onPageRefresh = () => {
			window.addEventListener("beforeunload", async function (e) {
				e.preventDefault();
				const data = await fetchAPI("/queue");
				const Queue = data.data;

				({ Tracks, currentTrack, playbarVisible, volume, isPlaying, loop } =
					Queue);

				if (isPlaying && Tracks[currentTrack].isPlaying) {
					Tracks[currentTrack].currentTime = audio.currentTime;
					Tracks[currentTrack].isPlaying = true;
					Tracks[currentTrack].duration = audio.duration;

					await fetchAPI("/queue/update", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							Track: Tracks[currentTrack],
							currentTrack,
							playbarVisible,
							volume,
							isPlaying: true,
							loop,
						}),
					});
				}
				return;
			});
		};

		const getQueueData = async () => {
			try {
				const data = await fetchAPI("/queue");
				const Queue = data.data;

				({ Tracks, currentTrack, playbarVisible, volume, isPlaying, loop } =
					Queue);

				togglePlayBar(Tracks[currentTrack]);

				audio.src = Tracks[currentTrack].url;
				audio.volume = volume;
				audio.currentTime = Tracks[currentTrack].currentTime;
				volumeControl.value = volume * 100;
				Tracks[currentTrack].duration = audio.duration;

				if (playbarVisible && isPlaying) {
					await pause(Tracks[currentTrack]);
					play_pause.classList.remove("fa-circle-pause");
					play_pause.classList.add("fa-circle-play");
				} else if (playbarVisible && !isPlaying) {
					footer.click();
					await play(Tracks[currentTrack]);
					play_pause.classList.remove("fa-circle-play");
					play_pause.classList.add("fa-circle-pause");
				}
				footer.click();
				await play(Tracks[currentTrack]);
				play_pause.classList.remove("fa-circle-play");
				play_pause.classList.add("fa-circle-pause");
				console.log("Tracks: ", Tracks);
				console.log("currentTrack: ", currentTrack);
				console.log("playbarVisible: ", playbarVisible);
				console.log("volume: ", volume);
				console.log("isPlaying: ", isPlaying);
			} catch (error) {}
		};

		const playbar = async () => {
			if (songs && songs.length > 0) {
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

						let arr = Tracks.filter(
							(track) =>
								track.name.trim().toLowerCase() ===
								Track.name.trim().toLowerCase()
						);
						if (arr.length > 0) {
							currentTrack = Tracks.findIndex((track) => {
								return (
									track.name.trim().toLowerCase() ===
									Track.name.trim().toLowerCase()
								);
							});
							if (currentTrack === -1) return;
							audio.src = Tracks[currentTrack].url;
							audio.volume = volume;
							await play(Tracks[currentTrack]);
							await togglePlayBar(Tracks[currentTrack]);
							if (Tracks[currentTrack].isPlaying) {
								play_pause.classList.remove("fa-circle-play");
								play_pause.classList.add("fa-circle-pause");
							}
							return;
						}

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
								loop: loop,
							}),
						});
						const Queue = data.data;
						({
							Tracks,
							currentTrack,
							playbarVisible,
							volume,
							isPlaying,
							loop,
						} = Queue);

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
			repeat.addEventListener("click", async (e) => {
				await toggleLoop(e);
			});
			shuffle.addEventListener("click", async (e) => {
				await playlistShuffle();
			});
			audio.addEventListener("ended", async (e) => {
				await stop();
				if (currentTrack === Tracks.length - 1) {
					if (!loop) {
						await pause(Tracks[currentTrack]);
						play_pause.classList.remove("fa-circle-pause");
						play_pause.classList.add("fa-circle-play");
					}
				}
				await next();
			});
		};

		const playlistShuffle = async () => {
			const FisherYatesAlgorithm = (Tracks) => {
				let PointerIndex = Tracks.length;
				let RandomIndex;
				// While the Array Length or the PointerIndex is greater than 0
				while (PointerIndex !== 0) {
					// Pick a RandomIndex between 0 and PointerIndex - 1
					RandomIndex = Math.floor(Math.random() * PointerIndex);
					PointerIndex -= 1;

					// Do nothing for the Current Track.
					if (RandomIndex === currentTrack) continue;
					if (PointerIndex === currentTrack) continue;

					// Swap the PointerIndex & RandomIndex Elements.
					[Tracks[PointerIndex], Tracks[RandomIndex]] = [
						Tracks[RandomIndex],
						Tracks[PointerIndex],
					];
				}
				return Tracks;
			};
			FisherYatesAlgorithm(Tracks);
			new Noty({
				theme: "metroui",
				text: "Playlist Shuffled",
				type: "success",
				layout: "topRight",
				timeout: 3000,
			}).show();
			await fetchAPI("/queue/shuffle", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ Tracks, currentTrack }),
			});
		};

		const toggleLoop = async (e) => {
			loop = !loop;
			if (loop) e.target.classList.add("footer__green");
			if (!loop) e.target.classList.remove("footer__green");
			new Noty({
				theme: "metroui",
				text: "Loop is now " + (loop ? "ON" : "OFF"),
				type: "success",
				layout: "topRight",
				timeout: 3000,
			}).show();
			const data = await fetchAPI("/queue/repeat", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ loop }),
			});
			loop = data.data.loop;
		};

		const play = async (Track) => {
			await audio.play();
			isPlaying = true;
			playbarVisible = true;
			Track.duration = audio.duration;
			Track.currentTime = audio.currentTime;
			Track.isPlaying = !audio.paused;
			Track.ended = audio.ended;
			await fetchAPI("/queue/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					Track,
					currentTrack,
					playbarVisible,
					volume,
					isPlaying,
					loop,
				}),
			});
		};

		const pause = async (Track) => {
			await audio.pause();
			isPlaying = false;
			playbarVisible = true;
			Track.duration = audio.duration;
			Track.currentTime = audio.currentTime;
			Track.isPlaying = !audio.paused;
			Track.ended = audio.ended;
			await fetchAPI("/queue/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					Track,
					currentTrack,
					playbarVisible,
					volume,
					isPlaying,
					loop,
				}),
			});
		};

		const stop = async () => {
			if (!audio.src) return;
			await audio.pause();
			audio.currentTime = 0;
		};

		const next = async () => {
			if (currentTrack === Tracks.length - 1 && !loop) return;
			await stop();
			if (currentTrack === Tracks.length - 1 && loop) currentTrack = 0;
			else if (currentTrack !== Tracks.length - 1 && loop) currentTrack++;
			else if (currentTrack !== Tracks.length - 1 && !loop) currentTrack++;
			audio.src = Tracks[currentTrack].url;
			audio.volume = volume;
			play_pause.classList.remove("fa-circle-play");
			play_pause.classList.add("fa-circle-pause");
			await togglePlayBar(Tracks[currentTrack]);
			await play(Tracks[currentTrack]);
		};

		const previous = async () => {
			if (currentTrack === 0 && !loop) return;
			await stop();
			if (currentTrack === 0 && loop) currentTrack = Tracks.length - 1;
			else if (currentTrack !== 0 && loop) currentTrack--;
			else if (currentTrack !== 0 && !loop) currentTrack--;
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
			loop = false;
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
			volumeControl.value = volume * 100;
			await fetchAPI("/queue/volume", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					volume: volume,
				}),
			});
			e.preventDefault();
		};

		const volumeChange = async (e) => {
			audio.volume = e.target.value / 100;
			volume = audio.volume;
			volumeControl.value = volume * 100;
			await fetchAPI("/queue/volume", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					volume: volume,
				}),
			});
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
				if (loop) repeat.classList.add("footer__green");
				if (!loop) repeat.classList.remove("footer__green");
			} else {
				footer.style.display = "none";
			}
		};

		onPageRefresh();
		getQueueData();
		playbar();
	} catch (error) {
		console.log(error);
	}
}
