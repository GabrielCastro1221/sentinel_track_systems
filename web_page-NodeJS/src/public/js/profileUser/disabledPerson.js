document.addEventListener("DOMContentLoaded", () => {
    const viewDisabledBtn = document.getElementById("view-disabled-persons");

    if (!viewDisabledBtn) return;

    viewDisabledBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
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
            const response = await fetch(`/api/v1/user/${user._id}/disabled-person`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();
            const disabledPersons = Array.isArray(result.disabledPerson) ? result.disabledPerson : [];

            let personsHtml = "";

            if (disabledPersons.length === 0) {
                personsHtml = "<p>No tienes personas registradas.</p>";
            } else {
                personsHtml = disabledPersons.map(person => {
                    const gps = person?.gps ?? "N/A";

                    const gpsButtons = gps !== "N/A"
                        ? `<a href="/gps/${person.gps}" class="page-btn-green bt">Rastrear GPS</a>`
                        : `<button class="page-btn-green bt" onclick="assignGPSDisabled('${person._id}')">Asignar GPS</button>`;

                    return `
                        <div class="disabled-card-item">
                            <div class="disabled-photo">
                                ${person.photo
                            ? `<img src="${person.photo}">`
                            : `<div class="no-photo">♿</div>`}
                            </div>

                            <div class="disabled-info">
                                <h4>${person.name}</h4>
                                <p><strong>Edad:</strong> ${person.age ?? "N/A"}</p>
                                <p><strong>Sexo:</strong> ${person.sex ?? "N/A"}</p>
                                <p><strong>GPS:</strong> ${gps}</p>
                            </div>

                            <div class="disabled-actions">
                                ${gpsButtons}
                                <button class="page-btn-green bt" onclick="editDisabledPerson(this)"
                                    data-id="${person._id}"
                                    data-name="${person.name || ''}">
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
                title: "Personas registradas",
                html: `<div class="disabled-list">${personsHtml}</div>`,
                width: 800,
                confirmButtonText: "Cerrar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                },
                buttonsStyling: false
            });

        } catch {
            Swal.fire({
                title: "Error",
                text: "No se pudieron obtener los datos",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        }
    });

    window.deleteDisabledPerson = async function (personId) {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar registro?",
            text: "No se puede deshacer",
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

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/disabled-persons/delete/${personId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                Swal.fire({
                    title: "Eliminado",
                    text: "Registro eliminado",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: { confirmButton: "swal-custom-confirm" },
                    buttonsStyling: false
                });

                setTimeout(() => {
                    document.getElementById("view-disabled-persons").click();
                }, 700);
            } else {
                throw new Error();
            }
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
    };
});

window.editDisabledPerson = async function (btn) {
    const personId = btn.dataset.id;

    const formHtml = `
        <form class="swal-form">
            <input id="name" class="swal-input" placeholder="Nombre" value="${btn.dataset.name || ""}">
            <input id="CC" class="swal-input" placeholder="Cédula" value="${btn.dataset.cc || ""}">
            <input id="age" type="number" class="swal-input" placeholder="Edad" value="${btn.dataset.age || ""}">
            
            <input id="dateOfBirth" type="date" class="swal-input"
                value="${btn.dataset.dob ? btn.dataset.dob.split('T')[0] : ''}">

            <select id="sex" class="swal-input">
                <option value="">Sexo</option>
                <option value="masculino" ${btn.dataset.sex === "masculino" ? "selected" : ""}>Masculino</option>
                <option value="femenino" ${btn.dataset.sex === "femenino" ? "selected" : ""}>Femenino</option>
                <option value="otro" ${btn.dataset.sex === "otro" ? "selected" : ""}>Otro</option>
            </select>

            <input id="disabilityType" class="swal-input" placeholder="Tipo de discapacidad"
                value="${btn.dataset.disability || ""}">

            <textarea id="disabilityDescription" class="swal-input" placeholder="Descripción de la discapacidad">
                ${btn.dataset.description || ""}
            </textarea>

            <textarea id="medicalHistory" class="swal-input" placeholder="Historial médico">
                ${btn.dataset.history || ""}
            </textarea>

            <input id="allergies" class="swal-input" placeholder="Alergias (separadas por coma)"
                value="${btn.dataset.allergies || ""}">

            <input id="medications" class="swal-input" placeholder="Medicamentos (separados por coma)"
                value="${btn.dataset.medications || ""}">

            <select id="bloodType" class="swal-input">
                <option value="">Tipo de sangre</option>
                ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt =>
        `<option value="${bt}" ${btn.dataset.blood === bt ? "selected" : ""}>${bt}</option>`
    ).join("")}
            </select>

            <input id="emergencyContactName" class="swal-input" placeholder="Contacto emergencia - Nombre"
                value="${btn.dataset.emergencyName || ""}">

            <input id="emergencyContactPhone" class="swal-input" placeholder="Teléfono emergencia"
                value="${btn.dataset.emergencyPhone || ""}">

            <input id="emergencyContactRelation" class="swal-input" placeholder="Relación"
                value="${btn.dataset.emergencyRelation || ""}">

            <div style="text-align:center;">
                ${btn.dataset.photo
            ? `<img src="${btn.dataset.photo}" style="max-width:100px;border-radius:8px;">`
            : "Sin foto"}
            </div>

            <input type="file" id="photo" class="swal-input">
        </form>
    `;

    const { value } = await Swal.fire({
        title: "Editar persona",
        html: formHtml,
        width: 900,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        },
        buttonsStyling: false,
        preConfirm: () => ({
            name: document.getElementById("name").value,
            CC: document.getElementById("CC").value,
            age: document.getElementById("age").value,
            dateOfBirth: document.getElementById("dateOfBirth").value,
            sex: document.getElementById("sex").value,
            disabilityType: document.getElementById("disabilityType").value,
            disabilityDescription: document.getElementById("disabilityDescription").value,
            medicalHistory: document.getElementById("medicalHistory").value,
            allergies: document.getElementById("allergies").value.split(",").map(a => a.trim()).filter(Boolean),
            medications: document.getElementById("medications").value.split(",").map(m => m.trim()).filter(Boolean),
            bloodType: document.getElementById("bloodType").value,
            emergencyContactName: document.getElementById("emergencyContactName").value,
            emergencyContactPhone: document.getElementById("emergencyContactPhone").value,
            emergencyContactRelation: document.getElementById("emergencyContactRelation").value,
            photoFile: document.getElementById("photo").files[0]
        })
    });

    if (!value) return;

    try {
        const formData = new FormData();

        Object.entries(value).forEach(([key, val]) => {
            if (key === "photoFile" && val) {
                formData.append("photo", val);
            } else if (Array.isArray(val)) {
                formData.append(key, JSON.stringify(val));
            } else {
                formData.append(key, val);
            }
        });

        const response = await fetch(`/api/v1/disabled-persons/update/${personId}`, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            Swal.fire({
                title: "Actualizado",
                text: "Datos guardados",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        } else throw new Error();

    } catch {
        Swal.fire({
            title: "Error",
            text: "No se pudo actualizar",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: "swal-custom-confirm" },
            buttonsStyling: false
        });
    }
};

window.assignGPSDisabled = async function (personId) {
    const user = JSON.parse(localStorage.getItem("user"));

    const generatedDeviceId = `GPS-${Date.now()}`;

    const formHtml = `
        <form class="swal-form">
            <input id="deviceId" class="swal-input" value="${generatedDeviceId}" readonly>

            <input id="gpsName" class="swal-input" placeholder="Nombre del GPS (Ej: GPS de Juan)">
            
            <input id="description" class="swal-input" placeholder="Descripción del dispositivo">

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
            name: document.getElementById("gpsName").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value
        })
    });

    if (!value) return;

    try {
        const response = await fetch(`/api/v1/gps-device/create-disabled-person`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...value,
                assignedToUser: user._id,
                disabled_person: personId
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
            text: "No se pudo asignar el GPS",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: { confirmButton: "swal-custom-confirm" },
            buttonsStyling: false
        });
    }
};