const searchBar = () => {
	const searchBar = document.querySelector(".header__left input");
	searchBar.addEventListener("input", (e) => {
		e.stopPropagation();
		const value = e.target.value;
		if (value.length === 0) return;
		if (value === " ") return;
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
	try {
		const response = await fetch(`/search/${value}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

const search = debounce(async (value) => {
	try {
		let data = await fetchItems(value);
		if (data.response === "error") return;
		renderDOM(data);
	} catch (error) {
		console.log(error);
		return;
	}
}, 150);
