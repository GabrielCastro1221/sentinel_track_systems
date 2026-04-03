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

    if (!token || !userId) {
        return;
    }
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
                Toastify({
                    text: "Foto actualizada correctamente",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, var(--cl--3--), var(--cl--4--))",
                    style: {
                        fontWeight: "600",
                        borderRadius: "8px"
                    }
                }).showToast();
            } else {
                Toastify({
                    text: result.message || "Error al actualizar la foto",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #ff4d4d, #ff9999)",
                    style: {
                        fontWeight: "600",
                        borderRadius: "8px"
                    }
                }).showToast();
            }
        } catch (error) {
            Toastify({
                text: "Error de conexión con el servidor",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff4d4d, #ff9999)",
                style: {
                    fontWeight: "600",
                    borderRadius: "8px"
                }
            }).showToast();
        }
    });
});
