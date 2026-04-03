document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    document.querySelectorAll(".admin-section .page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const action = btn.getAttribute("data-action");
            if (!id || !action) return;
            if (action === "view") {
                socket.emit("getTicketById", id);
            } else if (action === "pay") {
                Swal.fire({
                    title: "¿Marcar ticket como pagado?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, pagar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("payTicket", id);
                    }
                });
            } else if (action === "process") {
                Swal.fire({
                    title: "¿Marcar ticket en proceso?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, procesar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("payProcess", id);
                    }
                });
            } else if (action === "cancel") {
                Swal.fire({
                    title: "¿Cancelar ticket?",
                    text: "Esta acción no se puede deshacer",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cancelar",
                    cancelButtonText: "Volver"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("payCancel", id);
                    }
                });
            } else if (action === "delete") {
                Swal.fire({
                    title: "¿Eliminar ticket?",
                    text: "Esta acción eliminará el ticket permanentemente",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        socket.emit("deleteTicket", id);
                    }
                });
            }
        });
    });

    socket.on("ticketPaid", (ticket) => {
        Swal.fire("Ticket pagado", `El ticket ${ticket._id} fue marcado como pagado.`, "success");
        location.reload();
    });

    socket.on("ticketInProcess", (ticket) => {
        Swal.fire("Ticket en proceso", `El ticket ${ticket._id} está en proceso.`, "info");
        location.reload();
    });

    socket.on("ticketCanceled", (ticket) => {
        Swal.fire("Ticket cancelado", `El ticket ${ticket._id} fue cancelado.`, "error");
        location.reload();
    });

    socket.on("ticketDeleted", (ticket) => {
        Swal.fire("Ticket eliminado", `El ticket ${ticket._id} fue eliminado.`, "success");
        location.reload();
    });

    socket.on("ticketDetail", (ticket) => {
        Swal.fire({
            title: `Ticket ${ticket._id}`,
            html: `
            <div class="swal-ticket">
                <p class="swal-ticket-field"><strong>Comprador:</strong> ${ticket.purchaser?.name || "Invitado"}</p>
                <p class="swal-ticket-field"><strong>Estado:</strong> ${ticket.status}</p>
                <p class="swal-ticket-field"><strong>Fecha:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
                <hr class="swal-ticket-divider">
                <h4 class="swal-ticket-subtitle">Productos</h4>
                <div class="swal-ticket-products">
                    ${ticket.viewProducts.map(p => `
                        <div class="swal-ticket-product">
                            <span class="swal-product-title">${p.title}</span>
                            <span class="swal-product-qty">(x${p.quantity})</span>
                            <span class="swal-product-price">$${p.price}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,
            width: 600
        });
    });

    socket.on("error", (msg) => {
        Swal.fire("Error", msg, "error");
    });
});
