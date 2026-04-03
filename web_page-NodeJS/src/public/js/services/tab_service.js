document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const details = document.querySelectorAll(".service-detail");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            details.forEach(detail => detail.classList.remove("active"));
            const targetId = card.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active");
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});