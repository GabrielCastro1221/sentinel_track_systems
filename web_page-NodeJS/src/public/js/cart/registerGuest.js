document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-guest-form");

    const swalConfig = {
        background: "var(--bg--2--)",
        color: "var(--cl--5--)",
        customClass: {
            popup: "swal-custom-popup",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        }
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const guestId = localStorage.getItem("guestId");
        const userData = {
            name: document.getElementById("nombre").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            phone: document.getElementById("telefono").value.trim(),
            address: document.getElementById("direccion").value.trim(),
            city: document.getElementById("ciudad").value.trim(),
            age: document.getElementById("edad").value.trim(),
            gender: document.getElementById("genero").value.trim(),
            guestId
        };

        try {
            const response = await fetch("/api/v1/user/register-guest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("user", JSON.stringify({
                    ...data.user,
                    cart: data.cart._id,
                    token: data.token
                }));

                localStorage.removeItem("guestId");

                Swal.fire({
                    ...swalConfig,
                    icon: "success",
                    title: "Registro exitoso",
                    text: "Tu cuenta de invitado fue registrada correctamente",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = `/cart/${data.cart._id}`;
                });
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: "error",
                    title: "Error",
                    text: data.message || "Error al registrar invitado",
                    confirmButtonText: "Entendido"
                });
            }
        } catch (error) {
            Swal.fire({
                ...swalConfig,
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo registrar el invitado",
                confirmButtonText: "Entendido"
            });
        }
    });
});
