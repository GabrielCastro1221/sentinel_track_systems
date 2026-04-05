document.addEventListener("DOMContentLoaded", () => {
    const viewPetsBtn = document.getElementById("view-pets");

    if (!viewPetsBtn) return;

    viewPetsBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?._id) {
            Swal.fire({
                title: "Error",
                text: "Usuario no autenticado",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
            return;
        }

        try {
            const response = await fetch(`/api/v1/user/${user._id}/pets`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok && result.pets) {

                let petsHtml = result.pets.length
                    ? result.pets.map(pet => {
                        const gps = pet.gps || "N/A";

                        const gpsBtn = gps !== "N/A"
                            ? `<a href="/gps/${pet.gps}" class="page-btn-green bt">Rastrear GPS</a>`
                            : `<button class="page-btn-green bt" onclick="assignGPS('${pet._id}')">Asignar GPS</button>`;

                        return `
                        <div class="pet-card-item">
                            <div class="pet-photo">
                                ${pet.photo
                                ? `<img src="${pet.photo}">`
                                : `<div class="no-photo">🐾</div>`}
                            </div>

                            <div class="pet-info">
                                <h3>${pet.petName}</h3>
                                <p><strong>Especie:</strong> ${pet.species}</p>
                                <p><strong>Raza:</strong> ${pet.breed}</p>
                                <p><strong>Edad:</strong> ${pet.age ?? "N/A"}</p>
                                <p><strong>Sexo:</strong> ${pet.sex ?? "N/A"}</p>
                                <p><strong>GPS:</strong> ${gps}</p>
                            </div>

                            <div class="pet-actions">
                                ${gpsBtn}
                                <button class="page-btn-green bt"
                                    onclick="editPet(this)"
                                    data-id="${pet._id}"
                                    data-name="${pet.petName || ''}"
                                    data-species="${pet.species || ''}"
                                    data-breed="${pet.breed || ''}"
                                    data-age="${pet.age || ''}"
                                    data-sex="${pet.sex || ''}"
                                    data-color="${pet.color || ''}"
                                    data-weight="${pet.weight || ''}"
                                    data-size="${pet.size || ''}"
                                    data-vaccines="${pet.vaccines ? pet.vaccines.join(',') : ''}"
                                    data-conditions="${pet.conditions || ''}"
                                    data-photo="${pet.photo || ''}">
                                    Editar
                                </button>

                                <button class="page-btn-red bt"
                                    onclick="deletePet('${pet._id}')">
                                    Eliminar
                                </button>
                            </div>
                        </div>`;
                    }).join("")
                    : "<p>No tienes mascotas registradas.</p>";

                Swal.fire({
                    title: "Mis mascotas",
                    html: `<div class="pets-list">${petsHtml}</div>`,
                    width: 800,
                    confirmButtonText: "Cerrar",
                    customClass: {
                        confirmButton: "swal-custom-confirm"
                    },
                    buttonsStyling: false
                });

            } else {
                throw new Error(result.message);
            }

        } catch {
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar las mascotas",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        }
    });
});

async function deletePet(petId) {
    const confirm = await Swal.fire({
        title: "¿Eliminar mascota?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        },
        buttonsStyling: false
    });

    if (!confirm.isConfirmed) return;

    try {
        const response = await fetch(`/api/v1/pets/delete/${petId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            Swal.fire({
                title: "Eliminada",
                text: "Mascota eliminada",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });

            setTimeout(() => document.getElementById("view-pets").click(), 800);
        } else throw new Error();

    } catch {
        Swal.fire({
            title: "Error",
            text: "No se pudo eliminar",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: "swal-custom-confirm" },
            buttonsStyling: false
        });
    }
}

window.editPet = async function (btn) {
    const petId = btn.getAttribute("data-id");

    const formHtml = `
        <form class="swal-form">
            <label>Nombre:</label>
            <input type="text" id="petName" class="swal-input" value="${btn.dataset.name || ""}">

            <label>Especie:</label>
            <input type="text" id="species" class="swal-input" value="${btn.dataset.species || ""}">

            <label>Raza:</label>
            <input type="text" id="breed" class="swal-input" value="${btn.dataset.breed || ""}">

            <label>Edad:</label>
            <input type="number" id="age" class="swal-input" value="${btn.dataset.age || ""}">

            <label>Sexo:</label>
            <select id="sex" class="swal-input">
                <option value="M" ${btn.dataset.sex === "M" ? "selected" : ""}>Macho</option>
                <option value="F" ${btn.dataset.sex === "F" ? "selected" : ""}>Hembra</option>
            </select>

            <div style="text-align:center;">
                ${btn.dataset.photo
            ? `<img src="${btn.dataset.photo}" class="hidden" style="max-width:100px;border-radius:8px;">`
            : "Sin foto"}
            </div>

            <label>Actualizar foto:</label>
            <input type="file" id="photo" class="swal-input">
        </form>
    `;

    const { value } = await Swal.fire({
        title: "Editar Mascota",
        html: formHtml,
        width: 900,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        },
        buttonsStyling: false,
        preConfirm: () => ({
            petName: document.getElementById("petName").value,
            species: document.getElementById("species").value,
            breed: document.getElementById("breed").value,
            age: document.getElementById("age").value,
            sex: document.getElementById("sex").value,
            photoFile: document.getElementById("photo").files[0]
        })
    });

    if (!value) return;

    try {
        const formData = new FormData();
        formData.append("petName", value.petName);
        formData.append("species", value.species);
        formData.append("breed", value.breed);
        formData.append("age", value.age);
        formData.append("sex", value.sex);

        if (value.photoFile) {
            formData.append("photo", value.photoFile);
        }

        const response = await fetch(`/api/v1/pets/update/${petId}`, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            Swal.fire({
                title: "Actualizada",
                text: "La mascota fue actualizada correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });

            setTimeout(() => {
                document.getElementById("view-pets").click();
            }, 800);
        } else {
            throw new Error();
        }

    } catch {
        Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la mascota",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: "swal-custom-confirm" },
            buttonsStyling: false
        });
    }
};

window.assignGPS = async function (petId) {
    const user = JSON.parse(localStorage.getItem("user"));

    const deviceId = `GPS-${Date.now()}`;

    const formHtml = `
        <form class="swal-form">
            <input id="deviceId" class="swal-input" value="${deviceId}" readonly>
            <input id="name" class="swal-input" placeholder="Nombre del GPS">
            <input id="description" class="swal-input" placeholder="Descripción">
            
            <select id="status" class="swal-input">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
        </form>
    `;

    const { value } = await Swal.fire({
        title: "Asignar GPS",
        html: formHtml,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        },
        buttonsStyling: false,
        preConfirm: () => ({
            deviceId: document.getElementById("deviceId").value,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value
        })
    });

    if (!value) return;

    try {
        const response = await fetch(`/api/v1/gps-device/create-pet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...value,
                assignedToUser: user._id,
                pet: petId
            })
        });

        if (response.ok) {
            Swal.fire({
                title: "Asignado",
                text: "GPS creado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        } else throw new Error();

    } catch {
        Swal.fire({
            title: "Error",
            text: "No se pudo asignar",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: "swal-custom-confirm" },
            buttonsStyling: false
        });
    }
};