document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".page-btn[data-action='edit']").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            try {
                const res = await fetch(`/api/v1/configPage/${id}`);
                if (!res.ok) throw new Error("Error al obtener configuración");
                const config = await res.json();
                const formHtml = `
                                <form id="configForm" class="config-form">
                                    <label>Encabezado Principal</label>
                                    <input type="text" name="hero_title" value="${config.hero_title || ""}" />
                                    <label>Texto Principal</label>
                                    <input type="text" name="hero_subtitle" value="${config.hero_subtitle || ""}" />
                                    <label>Servicio 1</label>
                                    <input type="text" name="service_1" value="${config.service_1 || ""}" />
                                    <textarea name="service_1_desc">${config.service_1_desc || ""}</textarea>
                                    <label>Servicio 2</label>
                                    <input type="text" name="service_2" value="${config.service_2 || ""}" />
                                    <textarea name="service_2_desc">${config.service_2_desc || ""}</textarea>
                                    <label>Servicio 3</label>
                                    <input type="text" name="service_3" value="${config.service_3 || ""}" />
                                    <textarea name="service_3_desc">${config.service_3_desc || ""}</textarea>
                                    <label>Servicio 4</label>
                                    <input type="text" name="service_4" value="${config.service_4 || ""}" />
                                    <textarea name="service_4_desc">${config.service_4_desc || ""}</textarea>
                                    <label>Texto Servicios</label>
                                    <textarea name="service_text">${config.service_text || ""}</textarea>
                                    <label>Sobre Nosotros - Título</label>
                                    <input type="text" name="about_us_title" value="${config.about_us_title || ""}" />
                                    <label>Sobre Nosotros - Texto 1</label>
                                    <textarea name="about_us_text">${config.about_us_text || ""}</textarea>
                                    <label>Sobre Nosotros - Texto 2</label>
                                    <textarea name="about_us_text_2">${config.about_us_text_2 || ""}</textarea>
                                    <button type="submit" class="page-btn success">Guardar cambios</button>
                                </form>
                                `;
                Swal.fire({
                    title: "Editar Configuración",
                    html: formHtml,
                    width: 700,
                    showConfirmButton: false,
                });

                document.getElementById("configForm").addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    try {
                        const updateRes = await fetch(`/api/v1/configPage/update/${id}`, {
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
