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
}