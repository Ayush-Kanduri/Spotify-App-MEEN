const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector("#open-modal");
const openModalBtn2 = document.querySelector("#open-modal2");
const closeModalBtn = document.querySelector("#close-modal");

openModalBtn.addEventListener("click", function () {
	modal.style.display = "block";
});

openModalBtn2.addEventListener("click", function () {
	modal.style.display = "block";
});

closeModalBtn.addEventListener("click", function () {
	modal.style.display = "none";
});
