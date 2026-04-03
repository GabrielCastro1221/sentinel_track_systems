document.addEventListener("DOMContentLoaded", () => {
    const viewVehiclesBtn = document.getElementById("view-vehicles");

    if (!viewVehiclesBtn) return;

    viewVehiclesBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user._id) {
            console.error("Usuario no encontrado en localStorage");
            return;
        }

        try {
            const response = await fetch(`/api/v1/user/${user._id}/vehicle`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();
            console.log("Vehículos recibidos:", result);

            const vehicles = Array.isArray(result.vehicle) ? result.vehicle : [];

            let vehiclesHtml = "";

            if (vehicles.length === 0) {
                vehiclesHtml = "<p>No tienes vehículos registrados.</p>";
            } else {
                vehiclesHtml = vehicles.map(vehicle => {
                    const gps = vehicle?.gps ?? "N/A";

                    const gpsButtons = gps !== "N/A"
                        ? `
                        <a href="/gps/${vehicle.gps}" class="page-btn-green bt"
                                onclick="trackGPSVehicle('${vehicle._id}')"
                                aria-label="Rastrear GPS del vehículo"
                                title="Rastrear GPS">
                            Rastrear GPS
                        </a>
                        `
                        : `
                        <button class="page-btn-green bt"
                                onclick="assignGPSVehicle('${vehicle._id}')"
                                aria-label="Asignar GPS al vehículo"
                                title="Asignar GPS">
                            Asignar GPS
                        </button>
                        `;

                    return `
                    <div class="vehicle-card-item">
                        <div class="vehicle-photo">
                            ${vehicle?.photo
                            ? `<img src="${vehicle.photo}" alt="Vehículo">`
                            : `<div class="no-photo">🚗</div>`}
                        </div>
                        <div class="vehicle-info">
                            <h4>${vehicle?.licensePlate ?? "Sin placa"}</h4>
                            <p><strong>Tipo:</strong> ${vehicle?.type ?? "N/A"}</p>
                            <p><strong>Marca:</strong> ${vehicle?.brand ?? "N/A"}</p>
                            <p><strong>Modelo:</strong> ${vehicle?.model ?? "N/A"}</p>
                            <p><strong>Color:</strong> ${vehicle?.color ?? "N/A"}</p>
                            <p><strong>GPS-ID:</strong> ${gps}</p>
                        </div>
                        <div class="vehicle-actions">
                            ${gpsButtons}
                            <button
                                class="page-btn-green bt"
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
                            <button class="page-btn-red bt" onclick="deleteVehicle('${vehicle._id}')">
                                Eliminar
                            </button>
                        </div>
                    </div>
                `;
                }).join("");
            }

            Swal.fire({
                title: "Mis Vehículos Registrados",
                html: `<div class="vehicles-list">${vehiclesHtml}</div>`,
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
            console.error("Error al obtener vehículos:", error);

            Swal.fire({
                title: "Error",
                text: "No se pudieron obtener los vehículos",
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

    window.deleteVehicle = async function (vehicleId) {
        const confirmDelete = await Swal.fire({
            title: "¿Eliminar vehículo?",
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
            const response = await fetch(`/api/v1/vehicles/delete/${vehicleId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Eliminado", "Vehículo eliminado correctamente", "success");

                setTimeout(() => {
                    document.getElementById("view-vehicles").click();
                }, 700);
            } else {
                Swal.fire("Error", result.message || "No se pudo eliminar", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Error de conexión", "error");
        }
    };
});

window.editVehicle = async function (btn) {
    const vehicleId = btn.getAttribute("data-id");
    const licensePlate = btn.getAttribute("data-license");
    const type = btn.getAttribute("data-type");
    const brand = btn.getAttribute("data-brand");
    const model = btn.getAttribute("data-model");
    const color = btn.getAttribute("data-color");
    const photo = btn.getAttribute("data-photo");

    const formHtml = `
        <form id="edit-vehicle-form" class="edit-vehicle-form">
            <label>Placa:</label>
            <input type="text" id="licensePlate" value="${licensePlate}" class="swal2-input" />

            <label>Tipo:</label>
            <input type="text" id="type" value="${type}" class="swal2-input" />

            <label>Marca:</label>
            <input type="text" id="brand" value="${brand}" class="swal2-input" />

            <label>Modelo:</label>
            <input type="text" id="model" value="${model}" class="swal2-input" />

            <label>Color:</label>
            <input type="text" id="color" value="${color}" class="swal2-input" />

            <div>
                ${photo ? `<img src="${photo}" alt="Foto actual" class="hidden img-vehicle" />` : "Sin foto"}
            </div>
            <label>Actualizar foto:</label>
            <input type="file" id="photo" name="photo" class="swal2-file" />
        </form>
    `;

    const { value: formValues } = await Swal.fire({
        title: "Editar Vehículo",
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
                licensePlate: document.getElementById("licensePlate").value,
                type: document.getElementById("type").value,
                brand: document.getElementById("brand").value,
                model: document.getElementById("model").value,
                color: document.getElementById("color").value,
                photoFile: document.getElementById("photo").files[0]
            };
        }
    });

    if (formValues) {
        try {
            const formData = new FormData();
            formData.append("licensePlate", formValues.licensePlate);
            formData.append("type", formValues.type);
            formData.append("brand", formValues.brand);
            formData.append("model", formValues.model);
            formData.append("color", formValues.color);
            if (formValues.photoFile) {
                formData.append("photo", formValues.photoFile);
            }

            const response = await fetch(`/api/v1/vehicles/update/${vehicleId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Actualizado", "El vehículo fue actualizado correctamente", "success");
                setTimeout(() => {
                    document.getElementById("view-vehicles").click();
                }, 800);
            } else {
                Swal.fire("Error", result.message || "No se pudo actualizar el vehículo", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};

window.assignGPSVehicle = async function (vehicleId) {
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
                    placeholder="Ej: GPS del carro familiar"
                    style="width:90%;max-width:400px;text-align:center;" />
            </div>
        </form>
    `;

    const { value: formValues } = await Swal.fire({
        title: "Registrar y Asignar GPS a Vehículo",
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
            const response = await fetch(`/api/v1/gps-device/create-vehicle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    deviceId: formValues.deviceId,
                    name: formValues.gpsName,
                    assignedToUser: user._id,
                    vehicle: vehicleId
                })
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Asignado", "El GPS fue creado y asignado correctamente al vehículo", "success");
            } else {
                Swal.fire("Error", result.message || "No se pudo crear/asignar el GPS", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error de conexión con el servidor", "error");
        }
    }
};
