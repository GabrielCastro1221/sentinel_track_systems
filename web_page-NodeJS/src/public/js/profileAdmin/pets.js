document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const editButtons = document.querySelectorAll(".action .page-btn[data-action='edit']");
    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            socket.emit("pet:getById", { id });
            socket.once("pet:getById:response", async (pet) => {
                const { value: formValues } = await Swal.fire({
                    title: "Editar Mascota",
                    html: `
                        <input id="swal-petName" class="swal2-input" name="petName" placeholder="Nombre" value="${pet.petName || ''}">
                        <input id="swal-age" class="swal2-input" name="age" placeholder="Edad" value="${pet.age || ''}">
                        <input id="swal-breed" class="swal2-input" name="breed" placeholder="Raza" value="${pet.breed || ''}">
                        <input id="swal-species" class="swal2-input" name="species" placeholder="Especie" value="${pet.species || ''}">
                        <select id="swal-sex" class="swal2-input" name="sex">
                            <option value="">Seleccionar sexo</option>
                            <option value="macho" ${pet.sex === "macho" ? "selected" : ""}>Macho</option>
                            <option value="hembra" ${pet.sex === "hembra" ? "selected" : ""}>Hembra</option>
                        </select>
                        <label for="swal-photo" class="file-label">Foto nueva (opcional)</label>
                        <input id="swal-photo" type="file" class="swal2-file" name="photo" accept="image/*">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Actualizar",
                    cancelButtonText: "Cancelar",
                    preConfirm: () => {
                        return {
                            petName: document.getElementById("swal-petName").value,
                            age: document.getElementById("swal-age").value,
                            breed: document.getElementById("swal-breed").value,
                            species: document.getElementById("swal-species").value,
                            sex: document.getElementById("swal-sex").value,
                            photo: document.getElementById("swal-photo").files[0]
                        };
                    }
                });
                if (!formValues) return;
                const updateData = new FormData();
                updateData.append("petName", formValues.petName);
                updateData.append("age", formValues.age);
                updateData.append("breed", formValues.breed);
                updateData.append("species", formValues.species);
                updateData.append("sex", formValues.sex);
                if (formValues.photo) {
                    updateData.append("photo", formValues.photo);
                }
                try {
                    const response = await fetch(`/api/v1/pets/update/${id}`, {
                        method: "PUT",
                        body: updateData
                    });
                    if (!response.ok) throw new Error("Error al actualizar mascota");
                    const data = await response.json();
                    Swal.fire({
                        title: "Actualizada",
                        text: `La mascota "${data.pet.petName}" fue actualizada correctamente.`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: error.message || "No se pudo actualizar la mascota",
                        icon: "error"
                    });
                }
            });
        });
    });

    const deleteButtons = document.querySelectorAll(".action .page-btn[data-action='delete']");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const result = await Swal.fire({
                title: "¿Eliminar mascota?",
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
                const response = await fetch(`/api/v1/pets/delete/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar mascota");
                const data = await response.json();
                Swal.fire({
                    title: "Eliminada",
                    text: `La mascota "${data.pet.petName}" fue eliminada correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error.message || "No se pudo eliminar la mascota",
                    icon: "error"
                });
            }
        });
    });
});
