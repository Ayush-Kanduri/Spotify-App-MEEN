{
	try {
		const shareLink = () => {
			const socials = document.getElementsByClassName("social");
			for (let social of socials) {
				social.addEventListener("click", async (e) => {
					e.stopPropagation();
					e.preventDefault();
					let url = "";
					const data = await fetchCall();
					if (data.response === "failure") return;
					if (data.response === "error") return;

					if (e.target.dataset.action === "share/facebook/share") {
						url = data.data.facebook;
					}
					if (e.target.dataset.action === "share/twitter/share") {
						url = data.data.twitter;
					}
					if (e.target.dataset.action === "share/whatsapp/share") {
						url = data.data.whatsapp;
					}
					if (url === "") return;

					const width = 600;
					const height = 600;
					const left = (window.innerWidth - width) / 2;
					const top = (window.innerHeight - height) / 2;
					window.open(
						url,
						"",
						`width=${width},height=${height},left=${left},top=${top}`
					);
				});
			}
		};
		const fetchCall = async () => {
			try {
				const response = await fetch("/share");
				const data = await response.json();
				return data;
			} catch (error) {
				console.log(error);
			}
		};
		shareLink();
	} catch (error) {
		console.log(error);
	}
}
