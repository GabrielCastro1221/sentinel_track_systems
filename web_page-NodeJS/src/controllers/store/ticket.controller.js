const TicketRepository = require("../../repositories/store/ticket.repository");
const CartRepository = require("../../repositories/store/cart.repository");
const { ticketNumberRandom } = require("../../utils/cart.util");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");

class TicketController {
    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        const { amount, shipping, subtotal } = req.body;
        try {
            const cart = await CartRepository.getProductsInCart(cartId);
            const user = await TicketRepository.findUserByCartId(cartId);

            if (!cart || !user) {
                logger.warn("Carrito o usuario no encontrado para el ID de carrito: " + cartId);
                return res.status(404).json({ error: "Carrito o usuario no encontrado" });
            }

            if (!Array.isArray(cart.products)) {
                logger.error("El carrito no tiene productos o no fueron poblados correctamente para el ID de carrito: " + cartId);
                throw new Error("El carrito no tiene productos o no fueron poblados correctamente.");
            }

            const productsData = cart.products.map((item) => ({
                productId: item.product._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
            }));

            const ticketData = {
                code: await ticketNumberRandom(),
                amount: Number(amount),
                shipping: Number(shipping),
                subtotal: Number(subtotal),
                purchaser: user._id,
                cart: cartId,
                purchase_datetime: new Date(),
                products: productsData,
            };

            const ticket = await TicketRepository.createTicket(ticketData);
            await TicketRepository.addTicketToUser(user._id, ticket._id);
            await CartRepository.emptyCart(cartId);

            await MailerController.sendPurchaseTicket({
                email: user.email,
                name: user.name,
                ticket_id: ticket.code,
                purchase_date: ticket.purchase_datetime.toLocaleString(),
                products: productsData.map(p => ({
                    title: p.title,
                    quantity: p.quantity,
                    price: p.price
                })),
                total: ticket.amount,
                payment_method: "Tarjeta / Transferencia",
                shipping_address: user.address || "No especificada",
                shipping_city: user.city || "No especificada"
            });

            logger.info(`Compra realizada con éxito para el usuario: ${user._id}, ticket ID: ${ticket._id}`);
            res.status(201).json({ _id: ticket._id, message: "Compra realizada con éxito" });
        } catch (error) {
            logger.error("Error al realizar la compra: " + error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getTickets(req, res) {
        const { page = 1, limit = 1000 } = req.query;

        try {
            const tickets = await TicketRepository.getTickets({ page, limit });
            logger.info(`Tickets obtenidos: página ${page}, límite ${limit}`);
            res.status(200).json({ message: "Lista de tickets", tickets });
        } catch (error) {
            logger.error("Error al obtener tickets: " + error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getTicketById(req, res) {
        const { id } = req.params;

        try {
            const Ticket = await TicketRepository.getTicketById(id);
            logger.info(`Ticket obtenido por ID: ${id}`);
            res.status(200).json({ message: "Ticket", ticket: Ticket });
        } catch (error) {
            logger.error("Error al obtener ticket por ID: " + error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductsByTicketId(req, res) {
        const { id } = req.params;

        try {
            const products = await TicketRepository.getProductsByTicketId(id);
            logger.info(`Productos obtenidos para ticket ID: ${id}`);
            res.status(200).json({
                message: "Productos del ticket",
                products: products,
            });
        } catch (error) {
            logger.error("Error al obtener productos del ticket:", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async payTicket(req, res) {
        const id = req.params.id;

        try {
            const updatedTicket = await TicketRepository.payTicket(id);

            await MailerController.sendTicketPaidEmail(user, updatedTicket);
            logger.info(`Ticket pagado: ${id}`);
            res.status(200).json({
                message: "El estado del ticket se actualizó a pagado",
                ticket: updatedTicket,
            });
        } catch (error) {
            logger.error(`Error al pagar ticket: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async cancelTicket(req, res) {
        const id = req.params.id;

        try {
            const updatedTicket = await TicketRepository.payCancel(id);

            logger.info(`Ticket cancelado: ${id}`);
            res.status(200).json({
                message: "Compra cancelada",
                ticket: updatedTicket,
            });
        } catch (error) {
            logger.error(`Error al cancelar ticket: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async processTicket(req, res) {
        const id = req.params.id;

        try {
            const updatedTicket = await TicketRepository.payProcess(id);

            await MailerController.sendTicketInProcessEmail(user, updatedTicket);
            logger.info(`Ticket en proceso: ${id}`);
            res.status(200).json({
                message: "El estado del ticket se actualizó a en proceso",
                ticket: updatedTicket,
            });
        } catch (error) {
            logger.error(`Error al procesar ticket: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteTicket(req, res) {
        const { id } = req.params;

        try {
            const deleteTicket = await TicketRepository.deleteTicket(id);

            logger.info(`Ticket eliminado: ${id}`);
            res.status(200).json({
                message: "Ticket eliminado",
                ticket: deleteTicket
            });
        } catch (error) {
            logger.error(`Error al eliminar ticket: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async downloadTicketPDF(req, res) {
        const { id } = req.params;
        try {
            await TicketRepository.generateTicketPDF(id, res);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TicketController();
