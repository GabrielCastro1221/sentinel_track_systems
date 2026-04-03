const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const navbg = document.querySelector(".nav-bg");
const navLinks = document.querySelectorAll(".navbar a");
const btnLogin = document.querySelector("#btn-login");
const btnProfile = document.querySelector("#btn-profile");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
    navbg.classList.toggle("active");
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        menuIcon.classList.remove("bx-x");
        navbar.classList.remove("active");
        navbg.classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    if (user) {
        btnLogin.classList.add("hidden");
        btnProfile.classList.remove("hidden");
    } else {
        btnLogin.classList.remove("hidden");
        btnProfile.classList.add("hidden");
    }
});