{
	try {
		const recommend = () => {
			history.replaceState(
				"Data",
				"Recommendations",
				"/music-preference"
			);
            
			const genres = document.querySelectorAll(".genres .genre");

			genres.forEach((genre) => {
				genre.addEventListener("click", (e) => {
					if (genre.classList.contains("active")) {
						genre.children[0].style.display = "none";
						genre.children[1].style.display = "initial";
						genre.classList.remove("active");
					} else {
						genre.children[0].style.display = "initial";
						genre.children[1].style.display = "none";
						genre.classList.add("active");
					}
				});
			});
		};
		recommend();
	} catch (error) {
		console.log(error);
	}
}
