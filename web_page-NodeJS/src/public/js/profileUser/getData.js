document.addEventListener("DOMContentLoaded", () => {
    getUserProfile();

    const updateAccountBtn = document.getElementById("update-account-btn");
    const updatePhotoBtn = document.getElementById("update-photo");
    const fileInput = document.getElementById("file-input");
    const logoutBtn = document.getElementById("logout");
    const deleteAccountBtn = document.getElementById("delete-account-btn");

    if (updateAccountBtn) {
        updateAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem("user")) || {};

            Swal.fire({
                title: "Edita Tus Datos",
                html: `
                    <form class="swal-form">
                        <input id="swal-name" class="swal-input" placeholder="Nombre" value="${user.name || ""}">
                        <input id="swal-email" class="swal-input" value="${user.email || ""}" disabled>
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
                showCancelButton: true,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                customClass: {
                    confirmButton: "swal-custom-confirm",
                    cancelButton: "swal-custom-cancel"
                },
                buttonsStyling: false,
                preConfirm: () => ({
                    name: document.getElementById("swal-name").value,
                    phone: document.getElementById("swal-phone").value,
                    address: document.getElementById("swal-address").value,
                    city: document.getElementById("swal-city").value,
                    gender: document.getElementById("swal-gender").value,
                    age: parseInt(document.getElementById("swal-age").value) || null
                })
            }).then((result) => {
                if (result.isConfirmed) {
                    updateUserData(result.value);
                }
            });
        });
    }

    if (updatePhotoBtn && fileInput) {
        updatePhotoBtn.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file) updateUserPhoto(file);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Tu sesión se cerrará",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
                customClass: {
                    confirmButton: "swal-custom-confirm",
                    cancelButton: "swal-custom-cancel"
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();

                    Swal.fire({
                        title: "Sesión cerrada",
                        text: "Has salido correctamente",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        customClass: {
                            confirmButton: "swal-custom-confirm"
                        },
                        buttonsStyling: false
                    }).then(() => {
                        window.location.href = "/login";
                    });
                }
            });
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "¿Eliminar cuenta?",
                text: "Esta acción es irreversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
                customClass: {
                    confirmButton: "swal-custom-confirm",
                    cancelButton: "swal-custom-cancel"
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteUserAccount();
                }
            });
        });
    }
});

async function getUserProfile() {
    try {
        const response = await fetch("/api/v1/user/profile/me", {
            method: "GET",
            credentials: "include"
        });

        const result = await response.json();

        if (!response.ok) return;

        localStorage.setItem("user", JSON.stringify(result.data));
        renderUserProfile(result.data);

    } catch (error) {
        console.error(error);
    }
}

function renderUserProfile(user) {
    if (user.photo) document.getElementById("user-photo").src = user.photo;

    document.getElementById("user-name").textContent = user.name || "";
    document.getElementById("user-email").textContent = user.email || "";
    document.getElementById("user-rol").textContent = user.role || "";
    document.getElementById("user-telefono").textContent = user.phone || "";
    document.getElementById("user-direccion").textContent = user.address || "";
    document.getElementById("user-ciudad").textContent = user.city || "";
    document.getElementById("user-genero").textContent = user.gender || "";
    document.getElementById("user-edad").textContent = user.age || "";
}

async function updateUserData(data) {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const response = await fetch(`/api/v1/user/update/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(result.user));
            renderUserProfile(result.user);

            Swal.fire({
                title: "Actualizado",
                text: "Datos guardados correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                },
                buttonsStyling: false
            });

        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message || "No se pudo actualizar",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                confirmButton: "swal-custom-confirm"
            },
            buttonsStyling: false
        });
    }
}

async function updateUserPhoto(file) {
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("photo", file);

    try {
        const response = await fetch(`/api/v1/user/update/${user._id}`, {
            method: "PUT",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("user-photo").src = result.user.photo;
            localStorage.setItem("user", JSON.stringify(result.user));

            Toastify({
                text: "Foto actualizada",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    color: "var(--cl--5--)",
                    background: "var(--bg--2--)",
                    border: "1px solid var(--cl--4--)",
                    fontWeight: "600",
                    borderRadius: "8px",
                    padding: "10px 25px"
                }
            }).showToast();

        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        Toastify({
            text: "Error al actualizar",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#ff4d4d",
                borderRadius: "8px"
            }
        }).showToast();
    }
}

async function deleteUserAccount() {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const response = await fetch(`/api/v1/user/delete/${user._id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            localStorage.clear();

            Swal.fire({
                title: "Cuenta eliminada",
                text: "Se eliminó correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                },
                buttonsStyling: false
            }).then(() => {
                window.location.href = "/login";
            });

        } else {
            throw new Error();
        }

    } catch {
        Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la cuenta",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                confirmButton: "swal-custom-confirm"
            },
            buttonsStyling: false
        });
    }
}