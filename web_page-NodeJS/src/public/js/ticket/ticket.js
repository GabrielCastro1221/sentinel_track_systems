document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.querySelector(".checkout-btn");
    const shopNowBtn = document.querySelector(".shop-now-btn");
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const totalEl = document.getElementById("total");
    const citySelect = document.getElementById("city");

    const cartId = window.location.pathname.split("/").pop();

    const swalConfig = {
        background: "var(--bg--2--)",
        color: "var(--cl--5--)",
        customClass: {
            popup: "swal-custom-popup",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        }
    };

    async function finishPurchase() {
        const subtotal = parseFloat(subtotalEl.textContent.replace(/[^0-9]/g, "")) || 0;
        const shipping = parseFloat(shippingEl.textContent.replace(/[^0-9]/g, "")) || 0;
        const amount = parseFloat(totalEl.textContent.replace(/[^0-9]/g, "")) || 0;

        try {
            const response = await fetch(`/api/v1/tickets/cart/${cartId}/finish-purchase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subtotal, shipping, amount })
            });

            if (response.ok) {
                const data = await response.json();
                Swal.fire({
                    ...swalConfig,
                    icon: "success",
                    title: "Compra realizada",
                    text: data.message || "El ticket de compra se ha generado con éxito",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = `/ticket/${data._id}`;
                });
            } else {
                const err = await response.json();
                Swal.fire({
                    ...swalConfig,
                    icon: "error",
                    title: "Error",
                    text: err.message || "No se pudo finalizar la compra",
                    confirmButtonText: "Entendido"
                });
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire({
                ...swalConfig,
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor",
                confirmButtonText: "Entendido"
            });
        }
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            finishPurchase();
        });
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener("click", (e) => {
            e.preventDefault();
            finishPurchase();
        });
    }
});
