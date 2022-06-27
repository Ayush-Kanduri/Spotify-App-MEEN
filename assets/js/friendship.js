class Friendship {
	constructor(element) {
		this.toggler = element;
		this.toggleFriendship(this.toggler);
	}
	toggleFriendship(toggler) {
		const self = this;
		toggler.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const innerSelf = e.target;
			const url = innerSelf.getAttribute("data-url");
			const data = await self.fetchData(url, "POST");
			self.notify(data.message, data.response);
			if (data.response === "error") return;
			if (data.data.unfriended) innerSelf.textContent = "Follow";
			if (!data.data.unfriended) innerSelf.textContent = "Unfollow";
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
}

try {
	for (let btn of document.getElementsByClassName("follow_btn")) {
		const friendship = new Friendship(btn);
	}
} catch (error) {
	console.log(error);
}
