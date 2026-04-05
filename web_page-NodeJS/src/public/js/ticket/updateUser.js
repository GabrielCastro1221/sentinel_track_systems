document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
        document.getElementById("name-user-ticket").value = userData.name || "";
        document.getElementById("email-user-ticket").value = userData.email || "";
        document.getElementById("ciudad-user-ticket").value = userData.city || "";
        document.getElementById("direccion-user-ticket").value = userData.address || "";
        document.getElementById("telefono-user-ticket").value = userData.phone || "";
    }

    const form = document.querySelector(".update-form");

    // Configuración base para Swal con tus estilos
    const swalConfig = {
        background: "var(--bg--2--)",
        color: "var(--cl--5--)",
        customClass: {
            popup: "swal-custom-popup",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        }
    };

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!userData?._id) {
            Swal.fire({
                ...swalConfig,
                icon: "warning",
                title: "Usuario no encontrado",
                text: "Debes iniciar sesión para actualizar tus datos",
                confirmButtonText: "Entendido"
            });
            return;
        }

        const payload = {
            name: document.getElementById("name-user-ticket").value.trim(),
            email: document.getElementById("email-user-ticket").value.trim(),
            city: document.getElementById("ciudad-user-ticket").value.trim(),
            address: document.getElementById("direccion-user-ticket").value.trim(),
            phone: document.getElementById("telefono-user-ticket").value.trim(),
        };

        try {
            const response = await fetch(`/api/v1/user/update/${userData._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("user", JSON.stringify({ ...userData, ...payload }));

                Swal.fire({
                    ...swalConfig,
                    icon: "success",
                    title: "Datos actualizados",
                    text: "Tu información se ha guardado correctamente",
                    confirmButtonText: "OK"
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: "error",
                    title: "Error",
                    text: data.error || "No se pudo actualizar la información",
                    confirmButtonText: "Entendido"
                });
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            Swal.fire({
                ...swalConfig,
                icon: "error",
                title: "Problema",
                text: "Hubo un problema al procesar la actualización",
                confirmButtonText: "Entendido"
            });
        }
    });
});
