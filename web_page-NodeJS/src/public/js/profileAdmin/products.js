document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const form = document.getElementById("addProductForm");
    const thumbnailsContainer = document.getElementById("thumbnailsContainer");
    const addThumbnailBtn = document.getElementById("addThumbnailBtn");

    if (addThumbnailBtn) {
        addThumbnailBtn.addEventListener("click", () => {
            const currentInputs = thumbnailsContainer.querySelectorAll("input[type='file']").length;

            if (currentInputs < 4) {
                const input = document.createElement("input");
                input.type = "file";
                input.name = "thumbnails";
                input.accept = "image/*";
                input.classList.add("thumb-input");
                thumbnailsContainer.appendChild(input);
            } else {
                Swal.fire({
                    title: "Límite alcanzado",
                    text: "Solo puedes subir hasta 4 miniaturas.",
                    icon: "warning"
                });
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            try {
                const response = await fetch("/api/v1/products/create", {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || "Error al crear producto");
                }

                const data = await response.json();

                Swal.fire({
                    title: "Producto creado",
                    text: `El producto "${data.data.product.title}" fue registrado con éxito.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                socket.emit("getPaginatedProducts", { page: 1, limit: 6, sort: "asc" });
                form.reset();
                thumbnailsContainer.innerHTML = "";
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error.message || "No se pudo crear el producto",
                    icon: "error"
                });
            }
        });
    }

    socket.on("products", ({ productos, categorias, pagination }) => {
        const container = document.getElementById("productsContainer");
        const paginationDiv = document.getElementById("productsPagination");

        if (!productos || productos.length === 0) {
            container.innerHTML = "<p class='no-data'>No hay productos registrados en la plataforma en el momento.</p>";
            paginationDiv.innerHTML = "";
            return;
        }
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
            <tbody>
        `;

        productos.forEach(prod => {
            html += `
                <tr>
                    <td>
                        ${prod.image
                    ? `<img src="${prod.image}" alt="${prod.title}" class="product-thumb" />`
                    : `<div class="product-thumb placeholder">${prod.title[0]}</div>`}
                    </td>
                    <td>${prod.title}</td>
                    <td>$${prod.price}</td>
                    <td>${prod.category}</td>
                    <td>${prod.stock}</td>
                    <td>${prod.type_product || "-"}</td>
                    <td class="action">
                        <button class="page-btn-green view" data-id="${prod.id}" data-action="view">Ver</button>
                        <button class="page-btn page-btn-green" data-id="${prod.id}" data-action="edit">Editar</button>
                        <button class="page-btn page-btn-red" data-id="${prod.id}" data-action="delete">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        container.innerHTML = html;
        let pagHtml = "";

        if (pagination.hasPrevPage) {
            pagHtml += `<button class="page-btn admin" data-page="${pagination.prevPage}">Anterior</button>`;
        }

        pagHtml += `<span>Página ${pagination.currentPage} de ${pagination.totalPages}</span>`;
        if (pagination.hasNextPage) {
            pagHtml += `<button class="page-btn admin" data-page="${pagination.nextPage}">Siguiente</button>`;
        }

        paginationDiv.innerHTML = pagHtml;

        document.querySelectorAll(".action .page-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const action = btn.getAttribute("data-action");

                if (action === "delete") {
                    Swal.fire({
                        title: "¿Eliminar producto?",
                        text: "Esta acción no se puede deshacer",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar"
                    }).then(result => {
                        if (result.isConfirmed) {
                            socket.emit("deleteProd", id);
                        }
                    });
                }
                else if (action === "feature") {
                    Swal.fire({
                        title: "¿Cambiar estado a Destacado?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Sí, cambiar",
                        cancelButtonText: "Cancelar"
                    }).then(result => {
                        if (result.isConfirmed) {
                            socket.emit("featureProd", id);
                        }
                    });
                } else if (action === "new") {
                    Swal.fire({
                        title: "¿Marcar como Nuevo Arribo?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Sí, cambiar",
                        cancelButtonText: "Cancelar"
                    }).then(result => {
                        if (result.isConfirmed) {
                            socket.emit("newArrive", id);
                        }
                    });
                } else if (action === "seller") {
                    Swal.fire({
                        title: "¿Marcar como Más Vendido?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Sí, cambiar",
                        cancelButtonText: "Cancelar"
                    }).then(result => {
                        if (result.isConfirmed) {
                            socket.emit("bestSeller", id);
                        }
                    });
                } else if (action === "edit") {
                    socket.emit("getProductById", id);
                }
            });
        });

        document.querySelectorAll(".action .page-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const action = btn.getAttribute("data-action");

                if (action === "delete") {
                    socket.emit("deleteProd", id);
                } else if (action === "edit") {
                    socket.emit("getProductById", id);
                } else if (action === "feature") {
                    fetch(`/api/v1/products/featured/${id}`, { method: "PUT" })
                        .then(res => res.json())
                        .then(data => {
                            Swal.fire("Actualizado", `El producto "${data.title}" fue marcado como Destacado.`, "success");
                            socket.emit("getPaginatedProducts", { page: 1, limit: 6, sort: "asc" });
                        })
                        .catch(err => Swal.fire("Error", err.message, "error"));
                } else if (action === "new") {
                    fetch(`/api/v1/products/new-arrive/${id}`, { method: "PUT" })
                        .then(res => res.json())
                        .then(data => {
                            Swal.fire("Actualizado", `El producto "${data.title}" fue marcado como Nuevo Arribo.`, "success");
                            socket.emit("getPaginatedProducts", { page: 1, limit: 6, sort: "asc" });
                        })
                        .catch(err => Swal.fire("Error", err.message, "error"));
                } else if (action === "seller") {
                    fetch(`/api/v1/products/best-seller/${id}`, { method: "PUT" })
                        .then(res => res.json())
                        .then(data => {
                            Swal.fire("Actualizado", `El producto "${data.title}" fue marcado como Más Vendido.`, "success");
                            socket.emit("getPaginatedProducts", { page: 1, limit: 6, sort: "asc" });
                        })
                        .catch(err => Swal.fire("Error", err.message, "error"));
                }
            });
        });

        document.querySelectorAll("#productsPagination .page-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const page = btn.getAttribute("data-page");
                socket.emit("getPaginatedProducts", { page, limit: 6, sort: "asc" });
            });
        });
    });

    socket.on("productUpdated", ({ product }) => {
        Swal.fire({
            title: "Producto actualizado",
            text: `Se actualizó ${product.title}`,
            icon: "success",
            showConfirmButton: true,
            timer: null
        });
    });

    socket.on("searchResults", (results) => {
        console.log("Resultados de búsqueda:", results);
    });

    socket.on("productDeleted", ({ id }) => {
        Swal.fire({
            title: "Eliminado",
            text: "El producto fue eliminado correctamente.",
            icon: "success",
            timer: null
        });
    });

    socket.on("error", (msg) => {
        Swal.fire("Error", msg, "error");
    });

    socket.on("productDetail", async (prod) => {
        const { value: formValues } = await Swal.fire({
            title: "Editar Producto",
            html: `
            <div class="edit-form">
                <input id="swal-title" class="swal2-input" placeholder="Nombre" value="${prod.title || ''}">
                <input id="swal-price" type="number" class="swal2-input" placeholder="Precio" value="${prod.price || ''}">
                <textarea id="swal-description" class="swal2-textarea" placeholder="Descripción">${prod.description || ''}</textarea>
                <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${prod.stock || ''}">
                <input id="swal-category" class="swal2-input" placeholder="Categoría" value="${prod.category || ''}">
                <input id="swal-brand" class="swal2-input" placeholder="Marca" value="${prod.brand || ''}">
                <input id="swal-offer_percentage" type="number" class="swal2-input" placeholder="Porcentaje de oferta" value="${prod.offer_percentage || ''}">
                <select id="swal-type_product" class="swal2-input">
                    <option value="">Tipo de producto</option>
                    <option value="destacado" ${prod.type_product === "destacado" ? "selected" : ""}>Destacado</option>
                    <option value="nuevo arribo" ${prod.type_product === "nuevo arribo" ? "selected" : ""}>Nuevo Arribo</option>
                    <option value="oferta" ${prod.type_product === "oferta" ? "selected" : ""}>Oferta</option>
                    <option value="mas vendido" ${prod.type_product === "mas vendido" ? "selected" : ""}>Más Vendido</option>
                </select>
                <label for="swal-image" class="swal-label">Imagen principal (opcional)</label>
                <input id="swal-image" type="file" class="swal2-file" accept="image/*">
                <label class="swal-label">Miniaturas (máx. 4)</label>
                <div id="swal-thumbnails"></div>
                <button type="button" id="addThumbBtn" class="swal-add-btn"><i class="fi fi-rr-plus-small"></i> Añadir miniatura</button>
            </div>
        `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            didOpen: () => {
                const thumbContainer = document.getElementById("swal-thumbnails");
                const addBtn = document.getElementById("addThumbBtn");
                addBtn.addEventListener("click", () => {
                    const currentInputs = thumbContainer.querySelectorAll("input[type='file']").length;
                    if (currentInputs < 4) {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.name = "thumbnails";
                        input.accept = "image/*";
                        input.classList.add("swal2-file", "thumb-input");
                        thumbContainer.appendChild(input);
                    } else {
                        Swal.showValidationMessage("Solo puedes subir hasta 4 miniaturas");
                    }
                });
            },
            preConfirm: () => {
                return {
                    title: document.getElementById("swal-title").value,
                    price: document.getElementById("swal-price").value,
                    description: document.getElementById("swal-description").value,
                    stock: document.getElementById("swal-stock").value,
                    category: document.getElementById("swal-category").value,
                    brand: document.getElementById("swal-brand").value,
                    type_product: document.getElementById("swal-type_product").value,
                    offer_percentage: document.getElementById("swal-offer_percentage").value,
                    image: document.getElementById("swal-image").files[0],
                    thumbnails: Array.from(document.querySelectorAll("#swal-thumbnails input[type='file']")).map(f => f.files[0]).filter(Boolean)
                };
            }
        });

        if (!formValues) return;

        const updateData = new FormData();
        updateData.append("title", formValues.title);
        updateData.append("price", formValues.price);
        updateData.append("description", formValues.description);
        updateData.append("stock", formValues.stock);
        updateData.append("category", formValues.category);
        updateData.append("brand", formValues.brand);
        updateData.append("type_product", formValues.type_product);
        updateData.append("offer_percentage", formValues.offer_percentage);

        if (formValues.image) {
            updateData.append("image", formValues.image);
        }

        if (formValues.thumbnails && formValues.thumbnails.length > 0) {
            formValues.thumbnails.forEach(file => updateData.append("thumbnails", file));
        }

        try {
            const response = await fetch(`/api/v1/products/${prod._id}`, {
                method: "PUT",
                body: updateData
            });

            if (!response.ok) throw new Error("Error al actualizar producto");
            const data = await response.json();

            Swal.fire({
                title: "Actualizado",
                text: `El producto "${data.title}" fue actualizado correctamente.`,
                icon: "success",
                showConfirmButton: true,
                timer: null
            });

            socket.emit("getPaginatedProducts", { page: 1, limit: 6, sort: "asc" });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "No se pudo actualizar el producto",
                icon: "error"
            });
        }
    });

    document.querySelectorAll(".action .page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const action = btn.getAttribute("data-action");

            if (action === "delete") {
                Swal.fire({
                    title: "¿Eliminar producto?",
                    text: "Esta acción no se puede deshacer",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("deleteProd", id);
                    }
                });
            } else if (action === "feature") {
                Swal.fire({
                    title: "¿Cambiar estado a Destacado?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cambiar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("featureProd", id);
                    }
                });
            } else if (action === "new") {
                Swal.fire({
                    title: "¿Marcar como Nuevo Arribo?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cambiar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("newArrive", id);
                    }
                });
            } else if (action === "seller") {
                Swal.fire({
                    title: "¿Marcar como Más Vendido?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cambiar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("bestSeller", id);
                    }
                });
            } else if (action === "edit") {
                socket.emit("getProductById", id);
            }
        });
    });
});
