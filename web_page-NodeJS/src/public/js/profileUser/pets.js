document.addEventListener("DOMContentLoaded", () => {
    const viewPetsBtn = document.getElementById("view-pets");

    if (viewPetsBtn) {
        viewPetsBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?._id) {
                console.error("No se encontró el ID del usuario en localStorage");
                return;
            }

            try {
                const response = await fetch(`/api/v1/user/${user._id}/pets`, {
                    method: "GET",
                    credentials: "include"
                });

                const result = await response.json();

                if (response.ok && result.pets) {
                    let petsHtml = "";
                    if (result.pets.length > 0) {
                        petsHtml = result.pets.map(pet => {
                            const petName = pet.petName || "Sin nombre";
                            const species = pet.species || "Desconocida";
                            const breed = pet.breed || "Sin raza";
                            const age = (pet.age !== undefined && pet.age !== null) ? pet.age : "N/A";
                            const sex = pet.sex || "N/A";
                            const gps = pet.gps || "N/A";

                            const gpsButtons = gps !== "N/A"
                                ? `
                                <a href="/gps/${pet.gps}" class="page-btn-green bt"
                                        onclick="trackGPS('${pet._id}')"
                                        aria-label="Rastrear GPS de ${petName}"
                                        title="Rastrear GPS">
                                    Rastrear GPS
                                </a>
                                `
                                : `
                                <button class="page-btn-green bt"
                                        onclick="assignGPS('${pet._id}')"
                                        aria-label="Asignar GPS a ${petName}"
                                        title="Asignar GPS">
                                    Asignar GPS
                                </button>
                                `;

                            return `
                            <article class="pet-card-item" itemscope itemtype="https://schema.org/Pet">
                                <figure class="pet-photo">
                                    ${pet.photo
                                    ? `<img src="${pet.photo}" alt="Foto de ${petName}" itemprop="image">`
                                    : `<div class="no-photo" aria-label="Sin foto disponible">🐾</div>`}
                                </figure>

                                <section class="pet-info">
                                    <h2 itemprop="name">${petName}</h2>
                                    <p><strong>Especie:</strong> <span itemprop="species">${species}</span></p>
                                    <p><strong>Raza:</strong> <span itemprop="breed">${breed}</span></p>
                                    <p><strong>GPS-ID:</strong> <span itemprop="gps">${gps}</span></p>
                                    <p><strong>Edad:</strong> <span itemprop="age">${age}</span> |
                                    <strong>Sexo:</strong> <span itemprop="gender">${sex}</span></p>
                                </section>

                                <footer class="pet-actions" role="group" aria-label="Acciones para la mascota">
                                    ${gpsButtons}

                                    <button class="page-btn-green bt"
                                            onclick="editPet(this)"
                                            data-id="${pet._id}"
                                            data-name="${pet.petName || ''}"
                                            data-species="${pet.species || ''}"
                                            data-breed="${pet.breed || ''}"
                                            data-age="${pet.age || ''}"
                                            data-sex="${pet.sex || ''}"
                                            data-photo="${pet.photo || ''}"
                                            aria-label="Editar información de ${petName}"
                                            title="Editar mascota">
                                        Editar
                                    </button>

                                    <button class="page-btn-red bt btn--danger"
                                            onclick="deletePet('${pet._id}')"
                                            aria-label="Eliminar registro de ${petName}"
                                            title="Eliminar mascota">
                                        Eliminar
                                    </button>
                                </footer>
                            </article>
                        `;
                        }).join("");
                    } else {
                        petsHtml = "<p>No tienes mascotas registradas.</p>";
                    }

                    Swal.fire({
                        title: "Mis Mascotas Registradas",
                        html: `<div class="pets-list">${petsHtml}</div>`,
                        width: 800,
                        confirmButtonText: "Cerrar",
                        customClass: {
                            popup: "swal-popup",
                            title: "swal-dark-title",
                            confirmButton: "swal-confirm-btn",
                            cancelButton: "swal-cancel-btn",
                            htmlContainer: "swal-form"
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: result.message || "No se pudieron obtener las mascotas",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            } catch (error) {
                console.error("Error al obtener mascotas:", error);
                Swal.fire({
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }
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
            popup: "swal-dark-modal",
            title: "swal-dark-title",
            confirmButton: "swal-dark-confirm",
            cancelButton: "swal-dark-cancel"
        }
    });

    if (confirm.isConfirmed) {
        try {
            const response = await fetch(`/api/v1/pets/delete/${petId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Eliminada", "La mascota fue eliminada correctamente", "success");
                setTimeout(() => {
                    document.getElementById("view-pets").click();
                }, 1000);
            } else {
                Swal.fire("Error", result.message || "No se pudo eliminar la mascota", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
}

window.editPet = async function (btn) {
    const petId = btn.getAttribute("data-id");
    const petName = btn.getAttribute("data-name");
    const species = btn.getAttribute("data-species");
    const breed = btn.getAttribute("data-breed");
    const age = btn.getAttribute("data-age");
    const sex = btn.getAttribute("data-sex");
    const photo = btn.getAttribute("data-photo");

    const formHtml = `
        <form id="edit-pet-form" class="swal-form"
            role="form"
            aria-label="Formulario de edición de mascota"
            itemscope itemtype="https://schema.org/Pet">

            <label for="petName">Nombre:</label>
            <input type="text" id="petName" name="petName"
                    value="${petName}"
                    class="swal-input"
                    itemprop="name"
                    aria-required="true" />

            <label for="species">Especie:</label>
            <input type="text" id="species" name="species"
                    value="${species}"
                    class="swal-input"
                    itemprop="species" />

            <label for="breed">Raza:</label>
            <input type="text" id="breed" name="breed"
                    value="${breed}"
                    class="swal-input"
                    itemprop="breed" />

            <label for="age">Edad:</label>
            <input type="number" id="age" name="age"
                    value="${age}"
                    class="swal-input"
                    itemprop="age" />

            <label for="sex">Sexo:</label>
            <select id="sex" name="sex"
                    class="swal-input"
                    itemprop="gender">
                <option value="M" ${sex === "M" ? "selected" : ""}>Macho</option>
                <option value="F" ${sex === "F" ? "selected" : ""}>Hembra</option>
            </select>

            <div>
                ${photo
            ? `<img src="${photo}" alt="Foto actual de ${petName}" class="hidden img-pet" itemprop="image" />`
            : `<span class="hidden no-photo" aria-label="Sin foto disponible">🐾</span>`}
            </div>

            <label for="photo">Actualizar foto:</label>
            <input type="file" id="photo" name="photo"
                    class="swal-input"
                    accept="image/*"
                    aria-label="Subir nueva foto de la mascota" />
            </form>
        `;

    const { value: formValues } = await Swal.fire({
        title: "Editar Mascota",
        html: formHtml,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        width: 900,
        customClass: {
            popup: "swal-popup",
            title: "swal-dark-title",
            confirmButton: "swal-confirm-btn",
            cancelButton: "swal-cancel-btn",
            htmlContainer: "swal-form"
        },
        preConfirm: () => {
            return {
                petName: document.getElementById("petName").value,
                species: document.getElementById("species").value,
                breed: document.getElementById("breed").value,
                age: document.getElementById("age").value,
                sex: document.getElementById("sex").value,
                photoFile: document.getElementById("photo").files[0]
            };
        }
    });

    if (formValues) {
        try {
            const formData = new FormData();
            formData.append("petName", formValues.petName);
            formData.append("species", formValues.species);
            formData.append("breed", formValues.breed);
            formData.append("age", formValues.age);
            formData.append("sex", formValues.sex);
            if (formValues.photoFile) {
                formData.append("photo", formValues.photoFile);
            }

            const response = await fetch(`/api/v1/pets/update/${petId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Actualizada", "La mascota fue actualizada correctamente", "success");
                setTimeout(() => {
                    document.getElementById("view-pets").click();
                }, 800);
            } else {
                Swal.fire("Error", result.message || "No se pudo actualizar la mascota", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};

window.assignGPS = async function (petId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        Swal.fire("Error", "No se encontró el usuario en sesión", "error");
        return;
    }

    const generatedDeviceId = `SentinelTrack Systems GPS ${Date.now()}`;

    const formHtml = `
        <form id="assign-gps-form"
            class="swal-form"
            role="form"
            aria-label="Formulario de asignación de GPS"
            itemscope itemtype="https://schema.org/FormAction"
            style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;max-width:100%;overflow-x:hidden;">

        <div style="text-align:center;width:100%;">
            <label for="deviceId"
                style="font-weight:600;display:block;margin-bottom:0.3rem;"
                itemprop="instrument">
            ID del dispositivo GPS:
            </label>
            <input type="text"
                id="deviceId"
                name="deviceId"
                class="swal2-input"
                value="${generatedDeviceId}"
                readonly
                itemprop="identifier"
                aria-readonly="true"
                style="width:90%;max-width:400px;text-align:center;" />
        </div>

        <div style="text-align:center;width:100%;">
            <label for="gpsName"
                style="font-weight:600;display:block;margin-bottom:0.3rem;"
                itemprop="name">
            Alias del GPS:
            </label>
            <input type="text"
                id="gpsName"
                name="gpsName"
                class="swal2-input"
                placeholder="Ej: GPS de Firulais"
                itemprop="alternateName"
                aria-required="true"
                style="width:90%;max-width:400px;text-align:center;" />
        </div>
        </form>
    `;

    const { value: formValues } = await Swal.fire({
        title: "Registrar y Asignar GPS a Mascota",
        html: formHtml,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        width: 600,
        customClass: {
            popup: "swal-popup",
            title: "swal-dark-title",
            confirmButton: "swal-confirm-btn",
            cancelButton: "swal-cancel-btn",
            htmlContainer: "swal-form"
        },
        preConfirm: () => {
            return {
                deviceId: document.getElementById("deviceId").value,
                gpsName: document.getElementById("gpsName").value
            };
        }
    });

    if (formValues) {
        try {
            const response = await fetch(`/api/v1/gps-device/create-pet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    deviceId: formValues.deviceId,
                    name: formValues.gpsName,
                    assignedToUser: user._id,
                    pet: petId
                })
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Asignado", "El GPS fue creado y asignado correctamente", "success");
            } else {
                Swal.fire("Error", result.message || "No se pudo crear/asignar el GPS", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};


