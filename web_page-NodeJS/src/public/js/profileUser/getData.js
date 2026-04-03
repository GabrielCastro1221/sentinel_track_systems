async function getUserProfile() {
    try {
        const response = await fetch("/api/v1/user/profile/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error del servidor:", result.error || result);
            return;
        }

        const user = result.data;

        localStorage.setItem("user", JSON.stringify(user));

        renderUserProfile(user);

    } catch (error) {
        console.error("Error al obtener perfil:", error);
    }
}

function renderUserProfile(user) {
    const userPhoto = document.getElementById("user-photo");
    if (user.photo) {
        userPhoto.src = user.photo;
    }

    document.getElementById("user-name").textContent = user.name || "";
    document.getElementById("user-email").textContent = user.email || "";
    document.getElementById("user-rol").textContent = user.role || "";
    document.getElementById("user-telefono").textContent = user.phone || "";
    document.getElementById("user-direccion").textContent = user.address || "";
    document.getElementById("user-ciudad").textContent = user.city || "";
    document.getElementById("user-genero").textContent = user.gender || "";
    document.getElementById("user-edad").textContent = user.age || "";
}

async function updateUserPhoto(file) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        console.error("No se encontró el ID del usuario en localStorage");
        return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
        const response = await fetch(`/api/v1/user/update/${user._id}`, {
            method: "PUT",
            credentials: "include",
            headers: {},
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.user?.photo) {
            document.getElementById("user-photo").src = result.user.photo;

            localStorage.setItem("user", JSON.stringify(result.user));

            Toastify({
                text: "Foto actualizada correctamente",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, var(--cl--3--), var(--cl--4--))",
                style: { fontWeight: "600", borderRadius: "8px" }
            }).showToast();
        } else {
            Toastify({
                text: result.message || "Error al actualizar la foto",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff4d4d, #ff9999)",
                style: { fontWeight: "600", borderRadius: "8px" }
            }).showToast();
        }
    } catch (error) {
        console.error("Error al actualizar foto:", error);
        Toastify({
            text: "Error de conexión con el servidor",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff4d4d, #ff9999)",
            style: { fontWeight: "600", borderRadius: "8px" }
        }).showToast();
    }
}

async function updateUserData(updatedData) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        console.error("No se encontró el ID del usuario en localStorage");
        return;
    }

    try {
        const response = await fetch(`/api/v1/user/update/${user._id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok && result.user) {
            localStorage.setItem("user", JSON.stringify(result.user));
            renderUserProfile(result.user);

            Swal.fire({
                title: "Datos actualizados",
                text: "Tu información se actualizó correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message || "No se pudieron actualizar los datos",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    } catch (error) {
        console.error("Error al actualizar datos:", error);
        Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-confirm-btn"
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getUserProfile();

    const updateAccountBtn = document.getElementById("update-account-btn");
    if (updateAccountBtn) {
        updateAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem("user")) || {};

            Swal.fire({
                title: "Edita Tus Datos",
                html: `
                    <form id="update-user-form" class="swal-form">
                        <input id="swal-name" class="swal-input" placeholder="Nombre" value="${user.name || ""}">
                        <input id="swal-email" class="swal-input" placeholder="Email" value="${user.email || ""}" disabled>
                        <input id="swal-phone" class="swal-input" placeholder="Teléfono" value="${user.phone || ""}">
                        <input id="swal-address" class="swal-input" placeholder="Dirección" value="${user.address || ""}">
                        <input id="swal-city" class="swal-input" placeholder="Ciudad" value="${user.city || ""}">
                        <select id="swal-gender" class="swal-input">
                            <option value="">Seleccionar género</option>
                            <option value="masculino" ${user.gender === "masculino" ? "selected" : ""}>Masculino</option>
                            <option value="femenino" ${user.gender === "femenino" ? "selected" : ""}>Femenino</option>
                            <option value="otro" ${user.gender === "otro" ? "selected" : ""}>Otro</option>
                        </select>
                        <input id="swal-age" type="number" class="swal-input" placeholder="Edad" value="${user.age || ""}">
                    </form>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn"
                },
                preConfirm: () => {
                    return {
                        name: document.getElementById("swal-name").value,
                        phone: document.getElementById("swal-phone").value,
                        address: document.getElementById("swal-address").value,
                        city: document.getElementById("swal-city").value,
                        gender: document.getElementById("swal-gender").value,
                        age: parseInt(document.getElementById("swal-age").value) || null
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    updateUserData(result.value);
                }
            });
        });
    }
});

async function deleteUserAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        console.error("No se encontró el ID del usuario en localStorage");
        return;
    }

    try {
        const response = await fetch(`/api/v1/user/delete/${user._id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            Swal.fire({
                title: "Cuenta eliminada",
                text: "Tu cuenta ha sido eliminada correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            }).then(() => {
                window.location.href = "/login";
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message || "No se pudo eliminar la cuenta",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-confirm-btn"
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getUserProfile();

    const updatePhotoBtn = document.getElementById("update-photo");
    const fileInput = document.getElementById("file-input");

    updatePhotoBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            updateUserPhoto(file);
        }
    });

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Tu sesión actual se cerrará y deberás volver a iniciar sesión.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn"
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    Swal.fire({
                        title: "Sesión cerrada",
                        text: "Has salido correctamente",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        customClass: {
                            popup: "swal-popup",
                            confirmButton: "swal-confirm-btn"
                        }
                    }).then(() => {
                        window.location.href = "/login";
                    });
                }
            });
        });
    }

    const deleteAccountBtn = document.getElementById("delete-account-btn");
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "¿Eliminar cuenta?",
                text: "Esta acción es irreversible. ¿Deseas continuar?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn"
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteUserAccount();
                }
            });
        });
    }
});
