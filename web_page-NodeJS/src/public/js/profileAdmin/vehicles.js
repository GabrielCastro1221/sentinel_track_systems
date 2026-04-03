document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".action .page-btn[data-action='edit']");
    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");

            try {
                const res = await fetch(`/api/v1/vehicles/vehicle/${id}`);
                if (!res.ok) throw new Error("No se pudo obtener el vehículo");
                const data = await res.json();
                const vehicle = data.vehicle;

                const { value: formValues } = await Swal.fire({
                    title: "Editar Vehículo",
                    html: `
                        <input id="swal-licensePlate" class="swal2-input" placeholder="Placa" value="${vehicle.licensePlate || ''}">
                        <select id="swal-type" class="swal2-input">
                            <option value="">Seleccionar tipo</option>
                            <option value="car" ${vehicle.type === "car" ? "selected" : ""}>Carro</option>
                            <option value="motorcycle" ${vehicle.type === "motorcycle" ? "selected" : ""}>Moto</option>
                            <option value="truck" ${vehicle.type === "truck" ? "selected" : ""}>Camión</option>
                            <option value="bicycle" ${vehicle.type === "bicycle" ? "selected" : ""}>Bicicleta</option>
                        </select>
                        <input id="swal-brand" class="swal2-input" placeholder="Marca" value="${vehicle.brand || ''}">
                        <input id="swal-model" class="swal2-input" placeholder="Modelo" value="${vehicle.model || ''}">
                        <input id="swal-color" class="swal2-input" placeholder="Color" value="${vehicle.color || ''}">
                        <label for="swal-photo" class="file-label">Foto nueva (opcional)</label>
                        <input id="swal-photo" type="file" class="swal2-file" accept="image/*">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Actualizar",
                    cancelButtonText: "Cancelar",
                    preConfirm: () => {
                        return {
                            licensePlate: document.getElementById("swal-licensePlate").value,
                            type: document.getElementById("swal-type").value,
                            brand: document.getElementById("swal-brand").value,
                            model: document.getElementById("swal-model").value,
                            color: document.getElementById("swal-color").value,
                            photo: document.getElementById("swal-photo").files[0]
                        };
                    }
                });

                if (!formValues) return;

                const updateData = new FormData();
                updateData.append("licensePlate", formValues.licensePlate);
                updateData.append("type", formValues.type);
                updateData.append("brand", formValues.brand);
                updateData.append("model", formValues.model);
                updateData.append("color", formValues.color);
                if (formValues.photo) updateData.append("photo", formValues.photo);

                const response = await fetch(`/api/v1/vehicles/update/${id}`, {
                    method: "PUT",
                    body: updateData
                });
                if (!response.ok) throw new Error("Error al actualizar vehículo");
                const updated = await response.json();

                Swal.fire({
                    title: "Actualizado",
                    text: `El vehículo con placa "${updated.vehicle.licensePlate}" fue actualizado correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);

            } catch (error) {
                Swal.fire("Error", error.message || "No se pudo editar el vehículo", "error");
            }
        });
    });

    const deleteButtons = document.querySelectorAll(".action .page-btn[data-action='delete']");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const result = await Swal.fire({
                title: "¿Eliminar vehículo?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            });
            if (!result.isConfirmed) return;

            try {
                const response = await fetch(`/api/v1/vehicles/delete/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar vehículo");
                const data = await response.json();

                Swal.fire({
                    title: "Eliminado",
                    text: `El vehículo con placa "${data.vehicle.licensePlate}" fue eliminado correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);

            } catch (error) {
                Swal.fire("Error", error.message || "No se pudo eliminar el vehículo", "error");
            }
        });
    });
});
