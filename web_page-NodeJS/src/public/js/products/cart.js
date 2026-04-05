document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".add-to-cart-form");

    if (!form) return;

    function getGuestId() {
        let guestId = localStorage.getItem("guestId");
        if (!guestId) {
            guestId = crypto.randomUUID();
            localStorage.setItem("guestId", guestId);
        }
        return guestId;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const pid = form.dataset.productId;
        const stock = parseInt(form.dataset.stock, 10);
        const quantityInput = form.querySelector("#quantity");
        const quantity = parseInt(quantityInput.value, 10);

        const userData = JSON.parse(localStorage.getItem("user"));
        let cid = userData?.cart;
        let isGuest = false;

        if (!cid) {
            cid = getGuestId();
            isGuest = true;
        }

        if (quantity < 1 || quantity > stock) {
            Toastify({
                text: "Cantidad inválida. Máximo disponible: " + stock,
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    color: "var(--cl--5--)",
                    background: "var(--bg--2--)",
                    border: "1px solid var(--cl--4--)",
                    fontWeight: "600",
                    borderRadius: "8px",
                    padding: "10px 25px",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                }
            }).showToast();
            return;
        }

        const url = isGuest
            ? `/api/v1/cart/guest/${cid}/products/${pid}`
            : `/api/v1/cart/${cid}/products/${pid}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity })
            });

            if (res.ok || res.redirected) {
                Toastify({
                    text: isGuest ? "Producto agregado al carrito invitado" : "Producto agregado al carrito",
                    duration: 2000,
                    gravity: "top",
                    position: "right",
                    style: {
                        color: "var(--cl--5--)",
                        background: "var(--bg--2--)",
                        border: "1px solid var(--cl--4--)",
                        fontWeight: "600",
                        borderRadius: "8px",
                        padding: "10px 25px",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                    },
                    callback: () => {
                        window.location.href = `/cart/${cid}`;
                    }
                }).showToast();
            } else {
                const err = await res.json();
                Toastify({
                    text: "Error al agregar producto: " + err.message,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        color: "var(--cl--5--)",
                        background: "var(--bg--2--)",
                        border: "1px solid var(--cl--4--)",
                        fontWeight: "600",
                        borderRadius: "8px",
                        padding: "10px 25px",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                    }
                }).showToast();
            }
        } catch (error) {
            console.error("Error de red:", error);
            Toastify({
                text: "Error de conexión al servidor",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    color: "var(--cl--5--)",
                    background: "var(--bg--2--)",
                    border: "1px solid var(--cl--4--)",
                    fontWeight: "600",
                    borderRadius: "8px",
                    padding: "10px 25px",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                }
            }).showToast();
        }
    });
});
