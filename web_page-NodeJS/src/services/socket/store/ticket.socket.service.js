const ticketRepository = require("../../../repositories/store/ticket.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketTicket {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket tickets connected");

            socket.on("createTicket", async (data) => {
                try {
                    const newTicket = await ticketRepository.createTicket(data);
                    socket.emit("ticketCreated", newTicket);
                } catch (error) {
                    socket.emit("error", error.message);
                }
            });

            socket.on("getTickets", async () => {
                try {
                    const tickets = await ticketRepository.getTickets();
                    socket.emit("ticketsList", tickets);
                } catch (error) {
                    socket.emit("error", "Error fetching tickets list");
                }
            });

            socket.on("getTicketById", async (id) => {
                try {
                    const ticket = await ticketRepository.getTicketById(id);
                    socket.emit("ticketDetail", ticket);
                } catch (error) {
                    socket.emit("error", "Error fetching ticket");
                }
            });

            socket.on("deleteTicket", async (id) => {
                try {
                    const deletedTicket = await ticketRepository.deleteTicket(id);
                    socket.emit("ticketDeleted", deletedTicket);
                } catch (error) {
                    socket.emit("error", "Error deleting ticket");
                }
            });

            socket.on("payTicket", async (id) => {
                try {
                    const updatedTicket = await ticketRepository.payTicket(id);
                    socket.emit("ticketPaid", updatedTicket);
                } catch (error) {
                    socket.emit("error", "Error updating ticket status");
                }
            });

            socket.on("payCancel", async (id) => {
                try {
                    const updatedTicket = await ticketRepository.payCancel(id);
                    socket.emit("ticketCanceled", updatedTicket);
                } catch (error) {
                    socket.emit("error", "Error updating ticket status");
                }
            });

            socket.on("payProcess", async (id) => {
                try {
                    const updatedTicket = await ticketRepository.payProcess(id);
                    socket.emit("ticketInProcess", updatedTicket);
                } catch (error) {
                    socket.emit("error", "Error updating ticket status");
                }
            });

            socket.on("findUserByCartId", async (cartId) => {
                try {
                    const user = await ticketRepository.findUserByCartId(cartId);
                    socket.emit("userFoundByCart", user);
                } catch (error) {
                    socket.emit("error", "Error finding user by cart ID");
                }
            });

            socket.on("addTicketToUser", async ({ userId, ticketId }) => {
                try {
                    const updatedUser = await ticketRepository.addTicketToUser(
                        userId,
                        ticketId
                    );
                    socket.emit("ticketAddedToUser", updatedUser);
                } catch (error) {
                    socket.emit("error", "Error assigning ticket to user");
                }
            });
        });
    }
}

module.exports = SocketTicket;
