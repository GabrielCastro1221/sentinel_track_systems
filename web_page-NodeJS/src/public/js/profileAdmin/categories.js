document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addCategoryForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const category = form.category.value;
            try {
                const response = await fetch("/api/v1/categories/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ category })
                });
                if (!response.ok) throw new Error("Error al crear categoría");
                Swal.fire({
                    title: "Categoría creada",
                    text: `La categoría "${category}" fue registrada correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear la categoría",
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
                title: "¿Eliminar categoría?",
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
                const response = await fetch(`/api/v1/categories/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error al eliminar categoría");
                Swal.fire({
                    title: "Eliminada",
                    text: "La categoría fue eliminada correctamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar la categoría",
                    icon: "error"
                });
            }
        });
    });

    const editButtons = document.querySelectorAll(".action .page-btn[data-action='edit']");
    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const { value: newCategory } = await Swal.fire({
                title: "Editar categoría",
                input: "text",
                inputLabel: "Nuevo nombre de la categoría",
                inputPlaceholder: "Escribe el nuevo nombre",
                showCancelButton: true,
                confirmButtonText: "Actualizar",
                cancelButtonText: "Cancelar",
                inputValidator: (value) => {
                    if (!value) {
                        return "Debes ingresar un nombre";
                    }
                }
            });
            if (!newCategory) return;
            try {
                const response = await fetch(`/api/v1/categories/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ category: newCategory })
                });
                if (!response.ok) throw new Error("Error al actualizar categoría");
                const data = await response.json();
                Swal.fire({
                    title: "Actualizada",
                    text: `La categoría fue actualizada a "${data.category.category}" correctamente.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo actualizar la categoría",
                    icon: "error"
                });
            }
        });
    });
});
