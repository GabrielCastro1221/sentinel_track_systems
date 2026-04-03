const { Router } = require('express');
const TicketController = require('../../controllers/store/ticket.controller');
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/cart/:cid/finish-purchase",
    auth.authenticate,
    auth.restrict(["usuario"]),
    TicketController.finishPurchase
);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    TicketController.getTickets
);
router.get("/:id", TicketController.getTicketById);
router.get("/products/:id", TicketController.getProductsByTicketId);
router.get("/pdf/:id", TicketController.downloadTicketPDF);

router.put("/pay/:id", TicketController.payTicket);
router.put("/cancel/:id", TicketController.cancelTicket);
router.put("/process/:id", TicketController.processTicket);

router.delete("/:id", TicketController.deleteTicket);

module.exports = router;
