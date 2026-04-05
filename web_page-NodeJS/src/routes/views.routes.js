const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");
const auth = require("../middlewares/auth.middleware");

const router = Router();

router.get("/login", ViewsController.renderLogin);
router.get("/reset-password", ViewsController.renderResetPass);
router.get("/change-password", ViewsController.renderChangePass);
router.get("/confirmacion-email", ViewsController.renderEmailConfirm);
router.get("/", ViewsController.renderIndexPage);
router.get("/servicios", ViewsController.renderService);
router.get("/acceso-denegado", ViewsController.renderAccessDenied);
router.get("/pagina-no-encontrada", ViewsController.renderPageNotFound);
router.get("/producto/:id", ViewsController.renderProductDetails);
router.get("/datos-de-envio", ViewsController.renderRegisterGuest);
router.get("/cart/:id", ViewsController.renderCart);
router.get("/ticket/:id", ViewsController.renderTicket);
router.get("/rastrear", ViewsController.renderTracking);
router.get("/gps/:id", ViewsController.renderTrackingMapById);

router.get(
    "/perfil-usuario",
    auth.authenticate,
    auth.restrict(["usuario"]),
    ViewsController.renderProfileUser
);

module.exports = router;
