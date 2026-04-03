document.addEventListener("DOMContentLoaded", () => {
    const mainImage = document.querySelector(".detail-image img");
    const thumbnails = document.querySelectorAll(".thumbnail");
    const termsBtn = document.querySelector(".terms-btn");
    const modal = document.getElementById("modal-terms");
    const closeBtn = document.querySelector(".close-terms");

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.src;
        });
    });

    termsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
