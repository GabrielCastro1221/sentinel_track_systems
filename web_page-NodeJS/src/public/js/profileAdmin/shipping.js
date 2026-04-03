document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addShippingForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form).entries());
            try {
                const response = await fetch("/api/v1/shipping/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) throw new Error("Error al crear registro de shipping");
                Swal.fire({
                    title: "Registro creado",
                    text: "El registro de shipping fue agregado correctamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear el registro de shipping",
                    icon: "error"
                });
            }
        });
    }

    const deleteButtons = document.querySelectorAll(".action .page-btn[data-action='delete']");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const result = await Swal.fire({
                title: "¿Eliminar registro?",
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
                const response = await fetch(`/api/v1/shipping/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar registro");
                Swal.fire({
                    title: "Eliminado",
                    text: "El registro de shipping fue eliminado correctamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar el registro de shipping",
                    icon: "error"
                });
            }
        });
    });

    const editButtons = document.querySelectorAll(".action .page-btn[data-action='edit']");
    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const { value: formValues } = await Swal.fire({
                title: "Editar Shipping",
                html: `
                        <input id="swal-city" class="swal2-input" placeholder="Ciudad destino">
                        <input id="swal-amount" class="swal2-input" placeholder="Costo del envío">
                    `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Actualizar",
                cancelButtonText: "Cancelar",
                preConfirm: () => {
                    return {
                        city_ship: document.getElementById("swal-city").value,
                        amount: document.getElementById("swal-amount").value
                    };
                }
            });
            if (!formValues) return;
            try {
                const response = await fetch(`/api/v1/shipping/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formValues)
                });
                if (!response.ok) throw new Error("Error al actualizar registro");
                const data = await response.json();
                Swal.fire({
                    title: "Actualizado",
                    text: `El registro de shipping fue actualizado correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar el registro de shipping",
                    icon: "error"
                });
            }
        });
    });
});
