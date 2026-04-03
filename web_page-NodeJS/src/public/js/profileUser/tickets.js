document.addEventListener("DOMContentLoaded", () => {
    const viewTicketsBtn = document.getElementById("view-tickets");

    if (!viewTicketsBtn) return;

    viewTicketsBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user._id) {
            console.error("Usuario no encontrado en localStorage");
            return;
        }

        try {
            const response = await fetch(`/api/v1/user/${user._id}/tickets`, {
                method: "GET",
                credentials: "include"
            });

            const result = await response.json();
            console.log("Tickets recibidos:", result);

            const tickets = Array.isArray(result.tickets) ? result.tickets : [];

            let ticketsHtml = "";

            if (tickets.length === 0) {
                ticketsHtml = "<p>No tienes tickets registrados.</p>";
            } else {
                ticketsHtml = tickets.map(ticket => `
                    <article class="ticket-card-item" itemscope itemtype="https://schema.org/Order">
                        <header class="ticket-info">
                            <h2 class="title-ticket">Orden de compra</h2>
                            <h2 class="code" itemprop="orderNumber"><span>Codigo de compra: </span> # ${ticket?.code ?? "N/A"}</h2>
                            <p><strong>Fecha de compra:</strong>
                            <time itemprop="orderDate" datetime="${ticket?.purchase_datetime}">
                                ${ticket?.purchase_datetime ? new Date(ticket.purchase_datetime).toLocaleString() : "N/A"}
                            </time>
                            </p>
                            <p><strong>Monto:</strong> <span itemprop="priceCurrency" content="USD">$</span><span itemprop="price">${ticket?.amount ?? "N/A"}</span></p>
                            <p><strong>Estado:</strong> <span itemprop="orderStatus">${ticket?.status ?? "N/A"}</span></p>
                        </header>

                        <section class="ticket-products" role="list" aria-label="Productos del ticket">
                            <h3>Productos:</h3>
                            <ul>
                            ${ticket?.products?.map(p => `
                                <li role="listitem" itemprop="acceptedOffer" itemscope itemtype="https://schema.org/Offer">
                                <span itemprop="name" class="prod-title">${p.title}</span> -
                                <span>Cantidad: <span itemprop="eligibleQuantity">${p.quantity}</span></span> -
                                <span>Precio: $<span itemprop="price">${p.price}</span></span>
                                </li>
                            `).join("") ?? "<li>No hay productos</li>"}
                            </ul>
                        </section>

                        <footer class="ticket-actions">
                            <button class="page-btn-green" onclick="downloadTicketPDF('${ticket._id}')" aria-label="Descargar comprobante en PDF" title="Descargar comprobante en PDF">
                            Descargar PDF
                            </button>
                            <button class="page-btn-red bt btn--danger" onclick="cancelTicket('${ticket._id}')" aria-label="Cancelar compra" title="Cancelar compra">
                            Cancelar compra
                            </button>
                        </footer>
                        </article>
                    `).join("");
            }

            Swal.fire({
                title: "Mi historial de compras",
                html: `<div class="tickets-list">${ticketsHtml}</div>`,
                width: 720,
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn",
                    htmlContainer: "swal-form"
                }
            });

        } catch (error) {
            console.error("Error al obtener tickets:", error);

            Swal.fire({
                title: "Error",
                text: "No se pudieron obtener los tickets",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    });

    window.cancelTicket = async function (ticketId) {
        const confirmCancel = await Swal.fire({
            title: "¿Cancelar compra?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-confirm-btn",
                cancelButton: "swal-cancel-btn"
            }
        });

        if (!confirmCancel.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/tickets/cancel/${ticketId}`, {
                method: "PUT",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Cancelado",
                    text: "La compra fue cancelada correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "swal-popup",
                        confirmButton: "swal-confirm-btn"
                    }
                });

                setTimeout(() => {
                    document.getElementById("view-tickets").click();
                }, 700);
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message || "No se pudo cancelar la compra",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "swal-popup",
                        confirmButton: "swal-confirm-btn"
                    }
                });
            }
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Error de conexión con el servidor",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    };

    window.downloadTicketPDF = async function (ticketId) {
        try {
            const response = await fetch(`/api/v1/tickets/pdf/${ticketId}`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al generar PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `ticket-${ticketId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "No se pudo descargar el PDF",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    };
});
