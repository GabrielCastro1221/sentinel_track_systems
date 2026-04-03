document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".action .page-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const action = btn.getAttribute("data-action");

            try {
                let url = "";
                let method = "PUT";

                if (action === "view") {
                    url = `/api/v1/user/${id}`;
                    method = "GET";

                    const response = await fetch(url, { method });
                    if (!response.ok) throw new Error("Error al obtener datos del usuario");
                    const { user } = await response.json();

                    Swal.fire({
                        title: `Detalles de ${user.name}`,
                        html: `
                            <div class="get-user-details" style="text-align:left; font-size:14px;">
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Rol:</strong> ${user.role}</p>
                                <p><strong>Teléfono:</strong> ${user.phone || "No registrado"}</p>
                                <p><strong>Ciudad:</strong> ${user.city || "No registrada"}</p>
                                <p><strong>Edad:</strong> ${user.age || "No registrada"}</p>
                                <p><strong>Dirección:</strong> ${user.address || "No registrada"}</p>
                                <p><strong>Género:</strong> ${user.gender || "No registrado"}</p>
                                <p><strong>Tickets:</strong> <a href="#" class="btn-arrays view-tickets" data-id="${user._id}">Ver ${user.tickets?.length || 0} tickets</a></p>
                                <p><strong>Mascotas:</strong> <a href="#" class="btn-arrays view-pets" data-id="${user._id}">Ver ${user.pets?.length || 0} Mascotas</a></p>
                                <p><strong>Vehículos:</strong> <a href="#" class="btn-arrays view-vehicle" data-id="${user._id}">Ver ${user.vehicle?.length || 0} Vehículos</a></p>
                                <p><strong>Personas con discapacidad:</strong><a href="#" class="btn-arrays view-disabled" data-id="${user._id}">Ver ${user.disabled_person?.length || 0} Personas</a></p>
                                <p><strong>Creado:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                                <p><strong>Actualizado:</strong> ${new Date(user.updatedAt).toLocaleString()}</p>
                            </div>
                        `,
                        imageUrl: user.photo || "",
                        imageWidth: 100,
                        imageHeight: 100,
                        imageAlt: user.name,
                        confirmButtonText: "Cerrar"
                    });

                    return;
                }

                if (action === "admin") {
                    url = `/api/v1/user/admin/${id}`;
                }
                else if (action === "user") {
                    url = `/api/v1/user/user/${id}`;
                }
                else if (action === "delete") {
                    const result = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Este usuario será eliminado permanentemente.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar"
                    });
                    if (!result.isConfirmed) return;
                    url = `/api/v1/user/delete/${id}`;
                    method = "DELETE";
                }

                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Error en la petición");
                const data = await response.json();

                if (action === "admin" || action === "user") {
                    Toastify({
                        text: `El rol del usuario ${data.name} ha sido actualizado a ${data.role}`,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: action === "admin"
                            ? "linear-gradient(to right, #ffe55e)"
                            : "linear-gradient(to right, #4caf50)"
                    }).showToast();
                }
                if (action === "delete") {
                    Swal.fire({
                        title: "Eliminado",
                        text: `El usuario ha sido eliminado correctamente.`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                }

                setTimeout(() => window.location.reload(), 1500);

            } catch (error) {
                console.error("Error:", error);
                Toastify({
                    text: "No se pudo completar la acción",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #d32f2f, #f44336)"
                }).showToast();
            }
        });
    });

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-pets")) {
            e.preventDefault();
            const userId = e.target.getAttribute("data-id");
            try {
                const petsUrl = `/api/v1/user/${userId}/pets`;
                const petsResponse = await fetch(petsUrl, { method: "GET" });
                if (!petsResponse.ok) throw new Error("Error al obtener mascotas");
                const data = await petsResponse.json();

                const pets = data.pets || [];

                let petsHtml = `
                    <div class="pets-container">
                        ${pets.length === 0
                        ? "<p class='no-pets'>No hay mascotas registradas.</p>"
                        : pets.map(pet => `
                                <div class="pet-card">
                                    <div class="pet-photo">
                                        ${pet.photo
                                ? `<img src="${pet.photo}" alt="${pet.petName}" />`
                                : `<div class="placeholder">🐾</div>`}
                                    </div>
                                    <div class="pet-info">
                                        <h4>${pet.petName}</h4>
                                        <p><strong>Especie:</strong> ${pet.species || "No registrada"}</p>
                                        <p><strong>Raza:</strong> ${pet.breed || "No registrada"}</p>
                                        <p><strong>Edad:</strong> ${pet.age || "No registrada"}</p>
                                        <p><strong>Sexo:</strong> ${pet.sex || "No registrado"}</p>
                                    </div>
                                    <div>
                                        <button type="submit" class="page-btn">Rastrear</button>
                                    </div>
                                </div>
                            `).join("")}
                    </div>
                `;

                Swal.fire({
                    title: "Mascotas del usuario",
                    html: petsHtml,
                    width: 600,
                    background: "#f9f9f9",
                    color: "#333",
                    confirmButtonColor: "#ff3c3c",
                    customClass: {
                        popup: "pets-popup",
                        title: "pets-title",
                        htmlContainer: "pets-html"
                    },
                    confirmButtonText: "Cerrar"
                });
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar las mascotas.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }
        }
    });

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-vehicle")) {
            e.preventDefault();
            const userId = e.target.getAttribute("data-id");
            try {
                const vehicleUrl = `/api/v1/user/${userId}/vehicle`;
                const vehicleResponse = await fetch(vehicleUrl, { method: "GET" });
                if (!vehicleResponse.ok) throw new Error("Error al obtener vehículos");
                const data = await vehicleResponse.json();
                const vehicles = data.vehicles || data.vehicle || [];
                let vehicleHtml = `
                <div class="vehicles-container">
                    ${vehicles.length === 0
                        ? "<p class='no-vehicles'>No hay vehículos registrados.</p>"
                        : vehicles.map(v => `
                            <div class="vehicle-card">
                                <div class="vehicle-photo">
                                    ${v.photo
                                ? `<img src="${v.photo}" alt="${v.brand || "Vehículo"}" />`
                                : `<div class="placeholder">🚗</div>`}
                                </div>
                                <div class="vehicle-info">
                                    <h4>${v.brand || "Marca desconocida"} ${v.model || ""}</h4>
                                    <p><strong>Placa:</strong> ${v.licensePlate || "No registrada"}</p>
                                    <p><strong>Color:</strong> ${v.color || "No registrado"}</p>
                                    <p><strong>Año:</strong> ${v.model || "No registrado"}</p>
                                    <p><strong>Tipo:</strong> ${v.type || "No registrado"}</p>
                                </div>
                                <div>
                                    <button type="submit" class="page-btn">Rastrear</button>
                                </div>
                            </div>
                        `).join("")}
                </div>
            `;

                Swal.fire({
                    title: "Vehículos del usuario",
                    html: vehicleHtml,
                    width: 600,
                    background: "#f9f9f9",
                    color: "#333",
                    confirmButtonColor: "#ff3c3c",
                    confirmButtonText: "Cerrar"
                });
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los vehículos.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }
        }
    });

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-tickets")) {
            e.preventDefault();
            const userId = e.target.getAttribute("data-id");
            try {
                const ticketsUrl = `/api/v1/user/${userId}/tickets`;
                const ticketsResponse = await fetch(ticketsUrl, { method: "GET" });
                if (!ticketsResponse.ok) throw new Error("Error al obtener tickets");
                const data = await ticketsResponse.json();

                const tickets = data.tickets || data.userTickets || [];

                let ticketsHtml = `
                <div class="tickets-container">
                    ${tickets.length === 0
                        ? "<p class='no-tickets'>No hay tickets registrados.</p>"
                        : tickets.map(t => `
                            <div class="ticket-card">
                                <div class="ticket-info">
                                    <h4>Ticket #${t.code}</h4>
                                    <p><strong>Estado:</strong> ${t.status}</p>
                                    <p><strong>Fecha de compra:</strong> ${t.purchase_datetime ? new Date(t.purchase_datetime).toLocaleString() : "No registrada"}</p>
                                    <p><strong>Subtotal:</strong> $${t.subtotal}</p>
                                    <p><strong>Envío:</strong> $${t.shipping}</p>
                                    <p><strong>Total:</strong> $${t.amount}</p>
                                    <p><strong>Carrito:</strong> ${t.cart || "No registrado"}</p>
                                    <p><strong>Comprador:</strong> ${t.purchaser || "No registrado"}</p>
                                    <div class="ticket-products">
                                        <strong>Productos:</strong>
                                        ${t.products && t.products.length > 0
                                ? t.products.map(p => `
                                                <div class="product-item">
                                                    <p>${p.title} - $${p.price} x ${p.quantity}</p>
                                                </div>
                                            `).join("")
                                : "<p>No hay productos en este ticket.</p>"}
                                    </div>
                                </div>
                                <div class="ticket-actions">
                                    <button type="button" class="page-btn">Descargar PDF</button>
                                </div>
                            </div>
                        `).join("")}
                </div>
            `;

                Swal.fire({
                    title: "Tickets del usuario",
                    html: ticketsHtml,
                    width: 650,
                    background: "#f9f9f9",
                    color: "#333",
                    confirmButtonColor: "#ff3c3c",
                    confirmButtonText: "Cerrar"
                });
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los tickets.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }
        }
    });

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-disabled")) {
            e.preventDefault();
            const userId = e.target.getAttribute("data-id");
            try {
                const disabledUrl = `/api/v1/user/${userId}/disabled-person`;
                const disabledResponse = await fetch(disabledUrl, { method: "GET" });
                if (!disabledResponse.ok) throw new Error("Error al obtener personas con discapacidad");
                const data = await disabledResponse.json();

                const disabledPersons = data.disabledPerson || [];

                let disabledHtml = `
                <div class="disabled-container">
                    ${disabledPersons.length === 0
                        ? "<p class='no-disabled'>No hay personas registradas.</p>"
                        : disabledPersons.map(d => `
                            <div class="disabled-card">
                                <div class="disabled-photo">
                                    ${d.photo
                                ? `<img src="${d.photo}" alt="${d.name}" />`
                                : `<div class="placeholder">🧑‍🦽</div>`}
                                </div>
                                <div class="disabled-info">
                                    <h4>${d.name}</h4>
                                    <p><strong>Edad:</strong> ${d.age || "No registrada"}</p>
                                    <p><strong>CC:</strong> ${d.CC}</p>
                                    <p><strong>Fecha de nacimiento:</strong> ${d.dateOfBirth ? new Date(d.dateOfBirth).toLocaleDateString() : "No registrada"}</p>
                                    <p><strong>Sexo:</strong> ${d.sex}</p>
                                    <p><strong>Tipo de discapacidad:</strong> ${d.disabilityType}</p>
                                    <p><strong>Descripción:</strong> ${d.disabilityDescription || "No registrada"}</p>
                                    <p><strong>Historial médico:</strong> ${d.medicalHistory || "No registrado"}</p>
                                    <p><strong>Alergias:</strong> ${Array.isArray(d.allergies) ? d.allergies.join(", ") : "No registradas"}</p>
                                    <p><strong>Medicamentos:</strong> ${Array.isArray(d.medications) ? d.medications.join(", ") : "No registrados"}</p>
                                    <p><strong>Tipo de sangre:</strong> ${d.bloodType || "No registrado"}</p>
                                    <p><strong>Contacto de emergencia:</strong> ${d.emergencyContactName || "No registrado"} (${d.emergencyContactRelation || ""}) - ${d.emergencyContactPhone || ""}</p>
                                    <p><strong>GPS:</strong> ${d.gps ? d.gps : "No asociado"}</p>
                                    <p><strong>Historial de ubicaciones:</strong> ${d.locationHistory?.length || 0} registros</p>
                                </div>
                                <div class="disabled-actions">
                                    <button type="button" class="page-btn">Rastrear</button>
                                </div>
                                </div>
                        `).join("")}
                </div>
            `;

                Swal.fire({
                    title: "Personas con discapacidad",
                    html: disabledHtml,
                    width: 650,
                    background: "#f9f9f9",
                    color: "#333",
                    confirmButtonColor: "#ff3c3c",
                    confirmButtonText: "Cerrar"
                });
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar las personas con discapacidad.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }
        }
    });
});
