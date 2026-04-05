document.addEventListener("DOMContentLoaded", () => {
    const viewVehiclesBtn = document.getElementById("view-vehicles");
    if (!viewVehiclesBtn) return;

    viewVehiclesBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        try {
            const response = await fetch(`/api/v1/user/${user._id}/vehicle`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();
            const vehicles = Array.isArray(result.vehicle) ? result.vehicle : [];

            let vehiclesHtml = vehicles.length === 0
                ? "<p>No tienes vehículos registrados.</p>"
                : vehicles.map(vehicle => {
                    const gps = vehicle?.gps ?? "N/A";

                    const gpsButtons = gps !== "N/A"
                        ? `<a href="/gps/${vehicle.gps}" class="page-btn-green bt">Rastrear GPS</a>`
                        : `<button class="page-btn-green bt" onclick="assignGPSVehicle('${vehicle._id}')">Asignar GPS</button>`;

                    return `
                        <div class="vehicle-card-item">
                            <div class="vehicle-photo">
                                ${vehicle.photo
                            ? `<img src="${vehicle.photo}">`
                            : `<div class="no-photo">🚗</div>`}
                            </div>

                            <div class="vehicle-info">
                                <h4>${vehicle.licensePlate || "Sin placa"}</h4>
                                <p><strong>Tipo:</strong> ${vehicle.type || "N/A"}</p>
                                <p><strong>Marca:</strong> ${vehicle.brand || "N/A"}</p>
                                <p><strong>Modelo:</strong> ${vehicle.model || "N/A"}</p>
                                <p><strong>Color:</strong> ${vehicle.color || "N/A"}</p>
                                <p><strong>GPS-ID:</strong> ${gps}</p>
                            </div>

                            <div class="vehicle-actions">
                                ${gpsButtons}

                                <button class="page-btn-green bt"
                                    onclick="editVehicle(this)"
                                    data-id="${vehicle._id}"
                                    data-license="${vehicle.licensePlate || ''}"
                                    data-type="${vehicle.type || ''}"
                                    data-brand="${vehicle.brand || ''}"
                                    data-model="${vehicle.model || ''}"
                                    data-color="${vehicle.color || ''}"
                                    data-photo="${vehicle.photo || ''}">
                                    Editar
                                </button>

                                <button class="page-btn-red bt"
                                    onclick="deleteVehicle('${vehicle._id}')">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                }).join("");

            Swal.fire({
                title: "Mis Vehículos",
                html: `<div class="vehicles-list">${vehiclesHtml}</div>`,
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
                text: "No se pudieron obtener los vehículos",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        }
    });

    window.deleteVehicle = async function (vehicleId) {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar vehículo?",
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

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/vehicles/delete/${vehicleId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                Swal.fire({
                    title: "Eliminado",
                    text: "Vehículo eliminado correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: { confirmButton: "swal-custom-confirm" },
                    buttonsStyling: false
                });

                setTimeout(() => {
                    document.getElementById("view-vehicles").click();
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

window.editVehicle = async function (btn) {
    const vehicleId = btn.dataset.id;

    const formHtml = `
        <form class="swal-form">
            <label>Placa:</label>
            <input id="licensePlate" class="swal-input" value="${btn.dataset.license}">

            <label>Tipo:</label>
            <input id="type" class="swal-input" value="${btn.dataset.type}">

            <label>Marca:</label>
            <input id="brand" class="swal-input" value="${btn.dataset.brand}">

            <label>Modelo:</label>
            <input id="model" class="swal-input" value="${btn.dataset.model}">

            <label>Color:</label>
            <input id="color" class="swal-input" value="${btn.dataset.color}">

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
        title: "Editar Vehículo",
        html: formHtml,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        width: 900,
        customClass: {
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel"
        },
        buttonsStyling: false,
        preConfirm: () => ({
            licensePlate: document.getElementById("licensePlate").value,
            type: document.getElementById("type").value,
            brand: document.getElementById("brand").value,
            model: document.getElementById("model").value,
            color: document.getElementById("color").value,
            photoFile: document.getElementById("photo").files[0]
        })
    });

    if (!value) return;

    try {
        const formData = new FormData();
        Object.entries(value).forEach(([k, v]) => {
            if (k !== "photoFile") formData.append(k, v);
        });

        if (value.photoFile) formData.append("photo", value.photoFile);

        const response = await fetch(`/api/v1/vehicles/update/${vehicleId}`, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            Swal.fire({
                title: "Actualizado",
                text: "Vehículo actualizado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });

            setTimeout(() => {
                document.getElementById("view-vehicles").click();
            }, 800);
        } else {
            throw new Error();
        }

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

window.assignGPSVehicle = async function (vehicleId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    const generatedDeviceId = `SentinelTrack Systems GPS ${Date.now()}`;

    const { value } = await Swal.fire({
        title: "Asignar GPS",
        html: `
            <form class="swal-form">
                <input id="deviceId" class="swal-input" value="${generatedDeviceId}" readonly>
                <input id="gpsName" class="swal-input" placeholder="Alias del GPS">
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
            deviceId: document.getElementById("deviceId").value,
            gpsName: document.getElementById("gpsName").value
        })
    });

    if (!value) return;

    try {
        const response = await fetch(`/api/v1/gps-device/create-vehicle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deviceId: value.deviceId,
                name: value.gpsName,
                assignedToUser: user._id,
                vehicle: vehicleId
            })
        });

        if (response.ok) {
            Swal.fire({
                title: "Asignado",
                text: "GPS asignado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: { confirmButton: "swal-custom-confirm" },
                buttonsStyling: false
            });
        } else {
            throw new Error();
        }

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