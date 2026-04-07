document.addEventListener("DOMContentLoaded", () => {
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const totalEl = document.getElementById("total");
    const citySelect = document.getElementById("city");
    const emptyCartBtn = document.querySelector(".empty-cart");

    const parseCurrency = (value) => {
        return parseFloat(
            value.replace(/[^0-9,.-]/g, "").replace(",", ".")
        ) || 0;
    };

    const subtotal = parseCurrency(subtotalEl.textContent);

    if (citySelect) {
        citySelect.addEventListener("change", (e) => {
            const shippingCost = parseFloat(e.target.value) || 0;

            shippingEl.textContent = `$${shippingCost.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

            const total = subtotal + shippingCost;
            totalEl.textContent = `$${total.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
        });
    }

    const cartId = window.location.pathname.split("/").pop();

    const userData = JSON.parse(localStorage.getItem("user"));
    let isGuest = !userData?.cart;

    const swalConfig = {
        background: "var(--bg--2--)",
        color: "var(--cl--5--)",
        customClass: {
            popup: "swal-custom-popup",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        }
    };

    async function removeProduct(productId) {
        const url = isGuest
            ? `/api/v1/cart/guest/${cartId}/products/${productId}`
            : `/api/v1/cart/${cartId}/products/${productId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto eliminado:", data);

                Swal.fire({
                    ...swalConfig,
                    icon: "success",
                    title: "Producto eliminado",
                    text: "El producto fue eliminado del carrito.",
                    confirmButtonText: "OK"
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar el producto."
                });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire({
                ...swalConfig,
                icon: "error",
                title: "Error de conexión",
                text: "Hubo un problema al intentar eliminar el producto."
            });
        }
    }

    async function emptyCart() {
        const url = isGuest
            ? `/api/v1/cart/guest/${cartId}`
            : `/api/v1/cart/${cartId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Carrito vaciado:", data);

                Swal.fire({
                    ...swalConfig,
                    icon: "success",
                    title: "Carrito vaciado",
                    text: "Todos los productos fueron eliminados.",
                    confirmButtonText: "OK"
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: "error",
                    title: "Error",
                    text: "No se pudo vaciar el carrito."
                });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire({
                ...swalConfig,
                icon: "error",
                title: "Error de conexión",
                text: "Hubo un problema al intentar vaciar el carrito."
            });
        }
    }

    if (emptyCartBtn) {
        emptyCartBtn.addEventListener("click", () => {
            Swal.fire({
                ...swalConfig,
                title: "¿Estás seguro?",
                text: "Esto eliminará todos los productos del carrito.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, vaciar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    emptyCart();
                }
            });
        });
    }

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = e.currentTarget.dataset.id;
            Swal.fire({
                ...swalConfig,
                title: "¿Eliminar producto?",
                text: "Este producto será eliminado del carrito.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    removeProduct(productId);
                }
            });
        });
    });
});
