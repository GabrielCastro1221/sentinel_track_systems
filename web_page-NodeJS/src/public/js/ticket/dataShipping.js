document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData) {
        console.warn("No se encontró información de usuario");
        return;
    }

    const nameEl = document.getElementById("user-name");
    const emailEl = document.getElementById("user-email");
    const cityEl = document.getElementById("user-city");
    const addressEl = document.getElementById("user-address");
    const phoneEl = document.getElementById("user-phone");

    if (nameEl) nameEl.textContent = userData.name || "---";
    if (emailEl) emailEl.textContent = userData.email || "---";
    if (cityEl) cityEl.textContent = userData.city || "No especificada";
    if (addressEl) addressEl.textContent = userData.address || "No especificada";
    if (phoneEl) phoneEl.textContent = userData.phone || "No especificado";
});
