const bars = document.querySelector("#mobile-bars");
const dropdown = document.querySelector(".navbar-dropdown");
bars.addEventListener("click", () => {
    dropdown.classList.toggle("active");
    bars.classList.toggle("active");
    navbar.classList.toggle("active");
});