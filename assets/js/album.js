{
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
}
