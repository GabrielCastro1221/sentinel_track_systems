async function registerVehicleFormData(vehicleData) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        console.error("No se encontró el ID del usuario en localStorage");
        return;
    }

    const formData = new FormData();
    formData.append("licensePlate", vehicleData.licensePlate);
    formData.append("type", vehicleData.type);
    formData.append("brand", vehicleData.brand);
    formData.append("model", vehicleData.model);
    formData.append("color", vehicleData.color);
    formData.append("ownerUser", user._id);
    if (vehicleData.photo) {
        formData.append("photo", vehicleData.photo);
    }

    try {
        const response = await fetch(`/api/v1/vehicles/create`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.vehicle) {
            Swal.fire({
                title: "Vehículo registrado",
                text: `Se registró correctamente la placa ${result.vehicle.licensePlate}`,
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
                text: result.message || "No se pudo registrar el vehículo",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    } catch (error) {
        console.error("Error al registrar vehículo:", error);
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
    const registerVehicleBtn = document.getElementById("register-vehicle");
    if (registerVehicleBtn) {
        registerVehicleBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Registrar Vehículo",
                html: `
                    <form id="register-vehicle-form" class="swal-form">
                        <input id="swal-licensePlate" class="swal-input elegant-input" placeholder="Placa">
                        <select id="swal-type" class="swal-input elegant-input">
                            <option value="">Seleccionar tipo</option>
                            <option value="car">Carro</option>
                            <option value="motorcycle">Moto</option>
                            <option value="truck">Camión</option>
                            <option value="bicycle">Bicicleta</option>
                        </select>
                        <input id="swal-brand" class="swal-input elegant-input" placeholder="Marca">
                        <input id="swal-model" class="swal-input elegant-input" placeholder="Modelo">
                        <input id="swal-color" class="swal-input elegant-input" placeholder="Color">
                        <input id="swal-photo" type="file" class="swal-input elegant-input" accept="image/*">
                    </form>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Registrar",
                cancelButtonText: "Cancelar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn"
                },
                preConfirm: () => {
                    const fileInput = document.getElementById("swal-photo");
                    return {
                        licensePlate: document.getElementById("swal-licensePlate").value,
                        type: document.getElementById("swal-type").value,
                        brand: document.getElementById("swal-brand").value,
                        model: document.getElementById("swal-model").value,
                        color: document.getElementById("swal-color").value,
                        photo: fileInput.files[0] || null
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    registerVehicleFormData(result.value);
                }
            });
        });
    }
});
