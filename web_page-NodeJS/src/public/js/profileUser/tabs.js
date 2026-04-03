document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".cards.selectable .card");
    const partials = document.querySelectorAll(".partial-content");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");

            partials.forEach(p => p.classList.remove("active"));

            const selectedValue = card.getAttribute("data-value");
            const targetPartial = document.getElementById(`partial-${selectedValue}`);
            if (targetPartial) {
                targetPartial.classList.add("active");
            }
        });
    });
});
