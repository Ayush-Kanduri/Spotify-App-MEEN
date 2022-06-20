{
	try {
		const recommend = () => {
			history.replaceState("Data", "Recommendations", "/music-preference");

			const arr = [];

			const genres = document.querySelectorAll(".genres .genre");
			const btn = document.querySelector(".recommendations button");

			genres.forEach((genre) => {
				genre.addEventListener("click", (e) => {
					if (genre.classList.contains("active")) {
						genre.children[0].style.display = "none";
						genre.children[1].style.display = "initial";
						arr.push(genre.getAttribute("data-genre-id"));
						genre.classList.remove("active");
					} else {
						genre.children[0].style.display = "initial";
						genre.children[1].style.display = "none";
						arr.splice(
							arr.indexOf(genre.getAttribute("data-genre-id")),
							1
						);
						genre.classList.add("active");
					}
				});
			});

			btn.addEventListener("click", (e) => {
				e.preventDefault();
				if (arr.length > 0) {
					let url = `/users/recommendations/?`;
					let item = ``;

					for (let i = 0; i < arr.length; i++) {
						if (i === arr.length - 1) {
							item += `${i}=${arr[i]}`;
						} else {
							item += `${i}=${arr[i]}&`;
						}
					}
					window.location.href = url + item;
				} else {
					new Noty({
						theme: "metroui",
						text: "Please select at least one genre!!",
						type: "error",
						layout: "topRight",
						timeout: 3000,
					}).show();
				}
			});
		};
		recommend();
	} catch (error) {
		console.log(error);
	}
}
