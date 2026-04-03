document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".page-btn[data-action='edit']").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            try {
                const res = await fetch(`${window.location.origin}/api/v1/company-config/${id}`);
                if (!res.ok) throw new Error("Error al obtener configuración");
                const config = await res.json();
                const formHtml = `
                                <form id="Form" class="config-form">
                                    <label>Nombre Empresa</label>
                                    <input type="text" name="company_name" value="${config.company_name || ""}" />

                                    <label>Teléfono</label>
                                    <input type="text" name="phone" value="${config.phone || ""}" />

                                    <label>Dirección</label>
                                    <input type="text" name="address" value="${config.address || ""}" />

                                    <label>Email</label>
                                    <input type="email" name="email" value="${config.email || ""}" />

                                    <label>Instagram</label>
                                    <input type="text" name="instagram_link" value="${config.instagram_link || ""}" />

                                    <label>Facebook</label>
                                    <input type="text" name="facebook_link" value="${config.facebook_link || ""}" />

                                    <button type="submit" class="page-btn success">Guardar cambios</button>
                                </form>
                    `;
                Swal.fire({
                    title: "Editar Configuración de sentinel track systems",
                    html: formHtml,
                    width: 600,
                    showConfirmButton: false,
                });
                document.getElementById("Form").addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    try {
                        const updateRes = await fetch(`${window.location.origin}/api/v1/company-config/update/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                        });
                        if (!updateRes.ok) throw new Error("Error al actualizar configuración");
                        const updated = await updateRes.json();
                        Swal.fire("Actualizado", "La configuración fue actualizada correctamente.", "success")
                            .then(() => location.reload());
                    } catch (err) {
                        Swal.fire("Error", err.message, "error");
                    }
                });
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        });
    });
});
