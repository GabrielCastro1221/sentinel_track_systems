const PDFDocument = require("pdfkit");
const ticketModel = require("../../models/store/ticket.model");
const userModel = require("../../models/auth/user.model");

class TicketRepository {
    async createTicket(data) {
        const ticket = new ticketModel(data);
        await ticket.save();
        return ticket;
    }

    async findUserByCartId(cartId) {
        return await userModel.findOne({ cart: cartId });
    }

    async addTicketToUser(userId, ticketId) {
        const user = await userModel.findById(userId);
        if (!user) return null;
        user.tickets.push(ticketId);
        await user.save();
        return user;
    }

    async getTickets({ page = 1, limit = 1000 }) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                populate: "purchaser",
                lean: true,
                sort: { createdAt: -1 },
            };

            const result = await ticketModel.paginate({}, options);

            if (result.docs.length === 0) {
                throw new Error("No se encontraron tickets");
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await ticketModel
                .findById(id)
                .populate("purchaser", "name email phone address city")
                .populate({
                    path: "products.productId",
                    model: "Product",
                    select: "image title price description"
                })
                .lean();

            if (!ticket) throw new Error("Ticket no encontrado");

            ticket.viewProducts = (ticket.products || []).map(p => ({
                title: p.title || p.productId?.title,
                price: (p.price ?? p.productId?.price) ?? 0,
                quantity: p.quantity,
                image: p.image || p.productId?.image,
                description: p.description || p.productId?.description
            }));
            return ticket;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductsByTicketId(id) {
        try {
            const ticket = await ticketModel
                .findById(id)
                .populate({
                    path: "products.productId",
                    model: "Product",
                    select: "image title price description"
                })
                .lean();

            if (!ticket) throw new Error("Ticket no encontrado");

            const products = (ticket.products || []).map(p => ({
                title: p.title || p.productId?.title,
                price: (p.price ?? p.productId?.price) ?? 0,
                quantity: p.quantity,
                image: p.image || p.productId?.image,
                description: p.description || p.productId?.description
            }));

            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async payTicket(id) {
        try {
            const ticket = await ticketModel.findById(id);
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            ticket.status = "pagado";
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async payCancel(id) {
        try {
            const ticket = await ticketModel.findById(id);
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            ticket.status = "cancelado";
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async payProcess(id) {
        try {
            const ticket = await ticketModel.findById(id);
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            ticket.status = "en proceso";
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteTicket(id) {
        try {
            const ticket = await ticketModel.findByIdAndDelete(id);
            if (!ticket) {
                throw new Error("Ticket no encontrado");
            }
            return ticket;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async generateTicketPDF(ticketId, res) {
        try {
            const ticket = await ticketModel.findById(ticketId)
                .populate("purchaser")
                .populate("products.productId")
                .lean();

            if (!ticket) throw new Error("Ticket no encontrado");

            const PDFDocument = require("pdfkit");
            const doc = new PDFDocument({ margin: 40 });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=ticket-${ticket.code}.pdf`
            );

            doc.pipe(res);

            doc.rect(0, 0, 612, 80).fill("#0b3d91");
            doc.fillColor("#ffffff").fontSize(20).text("Sentinel Track Systems", 0, 30, { align: "center" });
            doc.fontSize(10).text("Sistema de monitoreo y rastreo", { align: "center" });
            doc.moveDown(3);

            doc.fillColor("#0b3d91").fontSize(18).text(`TICKET #${ticket.code}`, { align: "center" });
            doc.moveDown();

            const boxTop = doc.y;
            doc.rect(40, boxTop, 530, 90).fillAndStroke("#f4f6f8", "#d1d5db");
            doc.fillColor("#000").fontSize(11);

            doc.text(`Fecha: ${new Date(ticket.purchase_datetime).toLocaleString()}`, 50, boxTop + 10);
            doc.text(`Comprador: ${ticket.purchaser?.name ?? "N/A"}`, 50, boxTop + 25);
            doc.text(`Email: ${ticket.purchaser?.email ?? "N/A"}`, 50, boxTop + 40);
            doc.text(`Estado: ${ticket.status}`, 50, boxTop + 55);

            doc.text(`Subtotal: $${ticket.subtotal}`, 350, boxTop + 10);
            doc.text(`Envío: $${ticket.shipping}`, 350, boxTop + 25);
            doc.font("Helvetica-Bold").text(`TOTAL: $${ticket.amount}`, 350, boxTop + 45);

            doc.moveDown(6);

            doc.fillColor("#0b3d91").fontSize(14).text("Productos", 40);
            doc.moveDown(0.5);

            const tableTop = doc.y;
            doc.rect(40, tableTop, 530, 20).fill("#0b3d91");
            doc.fillColor("#fff").fontSize(11);

            doc.text("Producto", 50, tableTop + 5);
            doc.text("Cant.", 300, tableTop + 5);
            doc.text("Precio", 380, tableTop + 5);
            doc.text("Total", 460, tableTop + 5);

            let y = tableTop + 25;
            doc.fillColor("#000");

            ticket.products.forEach((p) => {
                doc.text(p.title, 50, y);
                doc.text(p.quantity.toString(), 300, y);
                doc.text(`$${p.price}`, 380, y);
                doc.text(`$${p.price * p.quantity}`, 460, y);

                y += 20;

                doc.moveTo(40, y).lineTo(570, y).strokeColor("#e5e7eb").stroke();
            });

            doc.moveDown(3);
            doc.fontSize(9).fillColor("#6b7280").text("Sentinel Track Systems © 2026", 0, 750, { align: "center" });
            doc.text("Sistema de rastreo y monitoreo satelital", { align: "center" });

            doc.end();
        } catch (error) {
            throw new Error("Error al generar PDF: " + error.message);
        }
    }
}

module.exports = new TicketRepository();