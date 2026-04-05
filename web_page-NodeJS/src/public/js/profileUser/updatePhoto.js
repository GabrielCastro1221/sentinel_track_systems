document.addEventListener("DOMContentLoaded", () => {
    const updatePhotoBtn = document.getElementById("update-photo");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "foto";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!token || !userId) return;

    updatePhotoBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("foto", file);

        try {
            const response = await fetch(`/api/v1/user/update/${userId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.user?.foto) {
                document.getElementById("user-photo").src = result.user.foto;

                Swal.fire({
                    title: "Actualizado",
                    text: "Foto actualizada correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "swal-popup",
                        title: "swal-dark-title",
                        confirmButton: "swal-confirm-btn"
                    }
                });

            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message || "Error al actualizar la foto",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "swal-popup",
                        title: "swal-dark-title",
                        confirmButton: "swal-confirm-btn"
                    }
                });
            }

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error de conexión con el servidor",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    title: "swal-dark-title",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    });
});