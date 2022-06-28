class Like {
	constructor(element) {
		this.toggler = element;
		this.toggleLike(this.toggler);
	}
	toggleLike(toggler) {
		const self = this;
		toggler.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const innerSelf = e.target;
			let likesCount = innerSelf.getAttribute("data-likes");
			const url = innerSelf.getAttribute("data-url");
			const data = await self.fetchData(url, "POST");
			if (data.response === "error") return;
			self.notify(data.message, data.response);
			self.configureLike(data.data.liked, likesCount, innerSelf);
		});
	}
	async fetchData(url, method, body = {}) {
		const response = await fetch(url, {
			method: method,
			body: body,
		});
		const data = await response.json();
		return data;
	}
	notify(message, type) {
		new Noty({
			theme: "metroui",
			text: message,
			type: type,
			layout: "topRight",
			timeout: 3000,
		}).show();
	}
	configureLike(liked, likesCount, innerSelf) {
		if (innerSelf.getAttribute("data-liked")) {
			innerSelf.parentElement.remove();
			return;
		}
		if (liked) innerSelf.style.color = "#1ed15e";
		if (liked) likesCount++;
		if (!liked) innerSelf.style.color = "#fff";
		if (!liked) likesCount--;
		innerSelf.setAttribute("data-likes", likesCount);
	}
}

{
	try {
		for (let btn of document.getElementsByClassName("toggle-like-button")) {
			const like = new Like(btn);
		}
	} catch (error) {
		console.log(error);
	}
}
