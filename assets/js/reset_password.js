{
	try {
		function togglePassword() {
			const icon1 = document.getElementsByTagName("button")[0];
			const icon2 = document.getElementsByTagName("button")[1];
			const password = document.querySelectorAll(
				"input[type='password']"
			)[0];
			const confirm_password = document.querySelectorAll(
				"input[type='password']"
			)[1];

			icon1.addEventListener("click", function (e) {
				e.preventDefault();
				const type =
					password.getAttribute("type") === "password"
						? "text"
						: "password";
				password.setAttribute("type", type);
				if (icon1.children[0].classList.contains("fa-eye")) {
					icon1.children[0].classList.remove("fa-eye");
					icon1.children[0].classList.add("fa-eye-slash");
				} else {
					icon1.children[0].classList.remove("fa-eye-slash");
					icon1.children[0].classList.add("fa-eye");
				}
			});
			icon2.addEventListener("click", function (e) {
				e.preventDefault();
				const type =
					confirm_password.getAttribute("type") === "password"
						? "text"
						: "password";
				confirm_password.setAttribute("type", type);
				if (icon2.children[0].classList.contains("fa-eye")) {
					icon2.children[0].classList.remove("fa-eye");
					icon2.children[0].classList.add("fa-eye-slash");
				} else {
					icon2.children[0].classList.remove("fa-eye-slash");
					icon2.children[0].classList.add("fa-eye");
				}
			});
		}
		function matchPassword() {
			const password = document.querySelectorAll(
				"input[type='password']"
			)[0];
			const confirm_password = document.querySelectorAll(
				"input[type='password']"
			)[1];
			const match = document.getElementById("match");

			document.getElementById("submit").disabled = true;
			document.getElementById("submit").style.backgroundColor = "grey";
			document.getElementById("submit").style.cursor = "not-allowed";

			if (confirm_password.value === "") {
				match.textContent = "";
			}

			document
				.getElementsByTagName("form")[0]
				.addEventListener("submit", function (e) {
					if (password.value.length < 6) {
						e.preventDefault();
						new Noty({
							text: "Password must be at least 6 Characters long!",
							type: "error",
							theme: "metroui",
							timeout: 3000,
							layout: "topRight",
							closeWith: ["click", "button"],
						}).show();
					}
				});

			confirm_password.addEventListener("input", function (e) {
				if (password.value !== confirm_password.value) {
					match.textContent = "Password didn't match";
					match.style.color = "red";
					document.getElementById("submit").disabled = true;
					document.getElementById("submit").style.backgroundColor = "grey";
					document.getElementById("submit").style.cursor = "not-allowed";
				} else {
					match.textContent = "Password matched";
					match.style.color = "#1ed15e";
					document.getElementById("submit").disabled = false;
					document.getElementById("submit").style.backgroundColor =
						"#1ed15e";
					document.getElementById("submit").style.cursor = "pointer";
				}

				if (confirm_password.value === "") {
					match.textContent = "";
				}
			});
		}
		togglePassword();
		matchPassword();
	} catch (e) {
		console.log(e);
	}
}
