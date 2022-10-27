const bars = document.querySelector("#mobile-bars");
const dropdown = document.querySelector(".navbar-dropdown");
bars.addEventListener("click", () => {
    dropdown.classList.toggle("active");
    bars.classList.toggle("active");
    navbar.classList.toggle("active");
});

const navbar = document.querySelector(".navbar");
window.onscroll = () => {
    if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
};