document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-action='view']").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            try {
                const res = await fetch(`/api/v1/disabled-persons/person/${id}`);
                if (!res.ok) throw new Error("No se pudo obtener la persona");
                const data = await res.json();
                const person = data.person;
                if (!person) throw new Error("Persona no encontrada");
                Swal.fire({
                    title: `Detalles de ${person.name}`,
                    html: `
                        <p><strong>CC:</strong> ${person.CC || "N/A"}</p>
                        <p><strong>Edad:</strong> ${person.age || "N/A"}</p>
                        <p><strong>Sexo:</strong> ${person.sex || "N/A"}</p>
                        <p><strong>Tipo discapacidad:</strong> ${person.disabilityType || "N/A"}</p>
                        <p><strong>Descripción:</strong> ${person.disabilityDescription || "N/A"}</p>
                        <p><strong>Contacto Emergencia:</strong> ${person.emergencyContactName || "N/A"}</p>
                        <p><strong>Teléfono Emergencia:</strong> ${person.emergencyContactPhone || "N/A"}</p>
                    `,
                    confirmButtonText: "Cerrar"
                });
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        });
    });

    document.querySelectorAll("[data-action='edit']").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            try {
                const res = await fetch(`/api/v1/disabled-persons/person/${id}`);
                if (!res.ok) throw new Error("No se pudo obtener la persona");

                const data = await res.json();
                const person = data.person;

                const { value: formValues } = await Swal.fire({
                    title: "Editar Persona Discapacitada",
                    html: `
                        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${person.name || ''}">
                        <input id="swal-cc" class="swal2-input" placeholder="CC" value="${person.CC || ''}">
                        <input id="swal-age" type="number" class="swal2-input" placeholder="Edad" value="${person.age || ''}">
                        <select id="swal-sex" class="swal2-input">
                            <option value="">Seleccionar sexo</option>
                            <option value="masculino" ${person.sex === "masculino" ? "selected" : ""}>Masculino</option>
                            <option value="femenino" ${person.sex === "femenino" ? "selected" : ""}>Femenino</option>
                            <option value="Otro" ${person.sex === "Otro" ? "selected" : ""}>Otro</option>
                        </select>
                        <input id="swal-disabilityType" class="swal2-input" placeholder="Tipo discapacidad" value="${person.disabilityType || ''}">
                        <input id="swal-emergencyContactName" class="swal2-input" placeholder="Contacto emergencia" value="${person.emergencyContactName || ''}">
                        <input id="swal-emergencyContactPhone" class="swal2-input" placeholder="Teléfono emergencia" value="${person.emergencyContactPhone || ''}">
                        <input id="swal-photo" type="file" class="swal2-file" accept="image/*">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    preConfirm: () => {
                        return {
                            name: document.getElementById("swal-name").value,
                            CC: document.getElementById("swal-cc").value,
                            age: document.getElementById("swal-age").value,
                            sex: document.getElementById("swal-sex").value,
                            disabilityType: document.getElementById("swal-disabilityType").value,
                            emergencyContactName: document.getElementById("swal-emergencyContactName").value,
                            emergencyContactPhone: document.getElementById("swal-emergencyContactPhone").value,
                            photo: document.getElementById("swal-photo").files[0]
                        };
                    }
                });
                if (!formValues) return;
                const formData = new FormData();
                Object.keys(formValues).forEach(key => {
                    if (key === "photo") {
                        if (formValues.photo)
                            formData.append("photo", formValues.photo);
                    } else {
                        formData.append(key, formValues[key]);
                    }
                });
                const response = await fetch(`/api/v1/disabled-persons/update/${id}`, {
                    method: "PUT",
                    body: formData
                });
                if (!response.ok) throw new Error("Error al actualizar");
                const result = await response.json();
                Swal.fire({
                    icon: "success",
                    title: "Actualizado",
                    text: "Persona actualizada correctamente",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        });
    });

    document.querySelectorAll("[data-action='delete']").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const result = await Swal.fire({
                title: "¿Eliminar persona?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                confirmButtonText: "Eliminar"
            });
            if (!result.isConfirmed) return;

            try {
                const res = await fetch(`/api/v1/disabled-persons/delete/${id}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error("No se pudo eliminar");
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "La persona fue eliminada",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        });
    });
});