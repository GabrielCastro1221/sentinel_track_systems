document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.querySelector(".checkout-btn");
    const registerGuestBtn = document.querySelector(".register-guest-btn");
    const shopNowBtn = document.querySelector(".shop-now-btn");

    const userData = JSON.parse(localStorage.getItem("user"));
    const guestId = localStorage.getItem("guestId");

    checkoutBtn?.classList.add("hidden");
    registerGuestBtn?.classList.add("hidden");
    shopNowBtn?.classList.add("hidden");

    if (userData?.cart) {
        shopNowBtn?.classList.remove("hidden");
    } else if (guestId) {
        registerGuestBtn?.classList.remove("hidden");
    }
});
