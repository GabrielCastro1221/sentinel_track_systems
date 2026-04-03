document.addEventListener("DOMContentLoaded", () => {
    const viewDisabledBtn = document.getElementById("view-disabled-persons");

    if (!viewDisabledBtn) return;

    viewDisabledBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
            Swal.fire("Error", "Usuario no autenticado", "error");
            return;
        }

        try {
            const response = await fetch(`/api/v1/user/${user._id}/disabled-person`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();
            const disabledPersons = Array.isArray(result.disabledPerson) ? result.disabledPerson : [];

            let personsHtml = "";

            if (disabledPersons.length === 0) {
                personsHtml = "<p>No tienes personas con discapacidad registradas.</p>";
            } else {
                personsHtml = disabledPersons.map(person => {
                    const gps = person?.gps ?? "N/A";

                    const gpsButtons = gps !== "N/A"
                        ? `
                        <a href="/gps/${person.gps}" class="page-btn-green bt"
                                onclick="trackGPSDisabled('${person._id}')"
                                aria-label="Rastrear GPS de ${person.name}"
                                title="Rastrear GPS">
                            Rastrear GPS
                        </a>
                        `
                        : `
                        <button class="page-btn-green bt"
                                onclick="assignGPSDisabled('${person._id}')"
                                aria-label="Asignar GPS a ${person.name}"
                                title="Asignar GPS">
                            Asignar GPS
                        </button>
                        `;

                    return `
                <div class="disabled-card-item">
                    <div class="disabled-photo">
                        ${person.photo
                            ? `<img src="${person.photo}" alt="Persona discapacitada">`
                            : `<div class="no-photo">♿</div>`}
                    </div>

                    <div class="disabled-info">
                        <h4>${person.name}</h4>
                        <p><strong>Edad:</strong> ${person.age ?? "N/A"}</p>
                        <p><strong>Sexo:</strong> ${person.sex ?? "N/A"}</p>
                        <p><strong>GPS-ID:</strong> ${gps}</p>
                        <p><strong>Discapacidad:</strong> ${person.disabilityType ?? "N/A"}</p>
                        <p><strong>Descripción:</strong> ${person.disabilityDescription ?? "N/A"}</p>
                    </div>

                    <div class="disabled-actions">
                        ${gpsButtons}
                        <button class="page-btn-green bt"
                            onclick="editDisabledPerson(this)"
                            data-id="${person._id}"
                            data-name="${person.name || ''}"
                            data-cc="${person.CC || ''}"
                            data-age="${person.age || ''}"
                            data-dob="${person.dateOfBirth || ''}"
                            data-sex="${person.sex || ''}"
                            data-disability="${person.disabilityType || ''}"
                            data-description="${person.disabilityDescription || ''}"
                            data-history="${person.medicalHistory || ''}"
                            data-allergies="${person.allergies ? person.allergies.join(', ') : ''}"
                            data-medications="${person.medications ? person.medications.join(', ') : ''}"
                            data-blood="${person.bloodType || ''}"
                            data-emergency-name="${person.emergencyContactName || ''}"
                            data-emergency-phone="${person.emergencyContactPhone || ''}"
                            data-emergency-relation="${person.emergencyContactRelation || ''}"
                            data-photo="${person.photo || ''}">
                            Editar
                        </button>
                        <button class="page-btn-red bt" onclick="deleteDisabledPerson('${person._id}')">
                            Eliminar
                        </button>
                    </div>
                </div>
                `;
                }).join("");
            }

            Swal.fire({
                title: "Personas con Discapacidad Registradas",
                html: `<div class="disabled-list">${personsHtml}</div>`,
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

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudieron obtener las personas con discapacidad",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    title: "swal-dark-title",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn",
                    htmlContainer: "swal-form"
                }
            });
        }
    });

    window.deleteDisabledPerson = async function (personId) {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar registro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                popup: "swal-popup",
                title: "swal-dark-title",
                confirmButton: "swal-confirm-btn",
                cancelButton: "swal-cancel-btn",
                htmlContainer: "swal-form"
            }
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/disabled-persons/delete/${personId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Eliminado", "Registro eliminado correctamente", "success");

                setTimeout(() => {
                    document.getElementById("view-disabled-persons").click();
                }, 700);
            } else {
                Swal.fire("Error", result.message || "No se pudo eliminar", "error");
            }
        } catch {
            Swal.fire("Error", "Error de conexión", "error");
        }
    };
});

window.editDisabledPerson = async function (btn) {
    const personId = btn.getAttribute("data-id");

    const formHtml = `
        <form id="edit-disabled-form" class="edit-disabled-form">
            <label>Nombre:</label>
            <input type="text" id="name" value="${btn.dataset.name}" class="swal2-input" />

            <label>Cédula:</label>
            <input type="text" id="CC" value="${btn.dataset.cc}" class="swal2-input" />

            <label>Edad:</label>
            <input type="number" id="age" value="${btn.dataset.age}" class="swal2-input" />

            <label>Fecha de nacimiento:</label>
            <input type="date" id="dateOfBirth" value="${btn.dataset.dob ? btn.dataset.dob.split('T')[0] : ''}" class="swal2-input" />

            <label>Sexo:</label>
            <select id="sex" class="swal2-select">
                <option value="masculino" ${btn.dataset.sex === "masculino" ? "selected" : ""}>Masculino</option>
                <option value="femenino" ${btn.dataset.sex === "femenino" ? "selected" : ""}>Femenino</option>
                <option value="Otro" ${btn.dataset.sex === "Otro" ? "selected" : ""}>Otro</option>
            </select>

            <label>Tipo de discapacidad:</label>
            <input type="text" id="disabilityType" value="${btn.dataset.disability}" class="swal2-input" />

            <label>Descripción de la discapacidad:</label>
            <textarea id="disabilityDescription" class="swal2-input">${btn.dataset.description}</textarea>

            <label>Historial médico:</label>
            <textarea id="medicalHistory" class="swal2-input">${btn.dataset.history}</textarea>

            <label>Alergias:</label>
            <input type="text" id="allergies" value="${btn.dataset.allergies}" class="swal2-input" />

            <label>Medicamentos:</label>
            <input type="text" id="medications" value="${btn.dataset.medications}" class="swal2-input" />

            <label>Tipo de sangre:</label>
            <select id="bloodType" class="swal2-select">
                <option value="">Seleccione</option>
                ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt =>
        `<option value="${bt}" ${btn.dataset.blood === bt ? "selected" : ""}>${bt}</option>`
    ).join("")}
            </select>

            <label>Contacto emergencia - Nombre:</label>
            <input type="text" id="emergencyContactName" value="${btn.dataset.emergencyName}" class="swal2-input" />

            <label>Contacto emergencia - Teléfono:</label>
            <input type="text" id="emergencyContactPhone" value="${btn.dataset.emergencyPhone}" class="swal2-input" />

            <label>Contacto emergencia - Relación:</label>
            <input type="text" id="emergencyContactRelation" value="${btn.dataset.emergencyRelation}" class="swal2-input" />

            <div>
                ${btn.dataset.photo ? `<img src="${btn.dataset.photo}" alt="Foto actual" class="hidden img-disabled" />` : "Sin foto"}
            </div>
            <label>Actualizar foto:</label>
            <input type="file" id="photo" name="photo" class="swal2-file" />
        </form>
    `;

    const { value: formValues } = await Swal.fire({
        title: "Editar Persona con Discapacidad",
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
                name: document.getElementById("name").value,
                CC: document.getElementById("CC").value,
                age: document.getElementById("age").value,
                dateOfBirth: document.getElementById("dateOfBirth").value,
                sex: document.getElementById("sex").value,
                disabilityType: document.getElementById("disabilityType").value,
                disabilityDescription: document.getElementById("disabilityDescription").value,
                medicalHistory: document.getElementById("medicalHistory").value,
                allergies: document.getElementById("allergies").value.split(",").map(a => a.trim()).filter(a => a),
                medications: document.getElementById("medications").value.split(",").map(m => m.trim()).filter(m => m),
                bloodType: document.getElementById("bloodType").value,
                emergencyContactName: document.getElementById("emergencyContactName").value,
                emergencyContactPhone: document.getElementById("emergencyContactPhone").value,
                emergencyContactRelation: document.getElementById("emergencyContactRelation").value,
                photoFile: document.getElementById("photo").files[0]
            };
        }
    });

    if (formValues) {
        try {
            const formData = new FormData();
            formData.append("name", formValues.name);
            formData.append("CC", formValues.CC);
            formData.append("age", formValues.age);
            formData.append("dateOfBirth", formValues.dateOfBirth);
            formData.append("sex", formValues.sex);
            formData.append("disabilityType", formValues.disabilityType);
            formData.append("disabilityDescription", formValues.disabilityDescription);
            formData.append("medicalHistory", formValues.medicalHistory);
            formData.append("allergies", JSON.stringify(formValues.allergies));
            formData.append("medications", JSON.stringify(formValues.medications));
            formData.append("bloodType", formValues.bloodType);
            formData.append("emergencyContactName", formValues.emergencyContactName);
            formData.append("emergencyContactPhone", formValues.emergencyContactPhone);
            formData.append("emergencyContactRelation", formValues.emergencyContactRelation);

            if (formValues.photoFile) {
                formData.append("photo", formValues.photoFile);
            }

            const response = await fetch(`/api/v1/disabled-persons/update/${personId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Actualizado", "La persona fue actualizada correctamente", "success");
                setTimeout(() => {
                    document.getElementById("view-disabled-persons").click();
                }, 800);
            } else {
                Swal.fire("Error", result.message || "No se pudo actualizar la persona", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};


window.assignGPSDisabled = async function (personId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        Swal.fire("Error", "No se encontró el usuario en sesión", "error");
        return;
    }

    const generatedDeviceId = `SentinelTrack Systems GPS ${Date.now()}`;

    const formHtml = `
        <form id="assign-gps-form"
            style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;max-width:100%;overflow-x:hidden;">
            
            <div style="text-align:center;width:100%;">
                <label style="font-weight:600;display:block;margin-bottom:0.3rem;">ID del dispositivo GPS:</label>
                <input type="text" id="deviceId"
                    class="swal2-input"
                    value="${generatedDeviceId}"
                    readonly
                    style="width:90%;max-width:400px;text-align:center;" />
            </div>

            <div style="text-align:center;width:100%;">
                <label style="font-weight:600;display:block;margin-bottom:0.3rem;">Alias del GPS:</label>
                <input type="text" id="gpsName"
                    class="swal2-input"
                    placeholder="Ej: GPS de Juan Pérez"
                    style="width:90%;max-width:400px;text-align:center;" />
            </div>
        </form>
    `;

    const { value: formValues } = await Swal.fire({
        title: "Registrar y Asignar GPS a Persona con Discapacidad",
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
                gpsName: document.getElementById("gpsName").value,
                deviceId: document.getElementById("deviceId").value
            };
        }
    });

    if (formValues) {
        try {
            const response = await fetch(`/api/v1/gps-device/create-disabled-person`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    deviceId: formValues.deviceId,
                    name: formValues.gpsName,
                    assignedToUser: user._id,
                    disabled_person: personId
                })
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Asignado", "El GPS fue creado y asignado correctamente a la persona con discapacidad", "success");
            } else {
                Swal.fire("Error", result.message || "No se pudo crear/asignar el GPS", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};
