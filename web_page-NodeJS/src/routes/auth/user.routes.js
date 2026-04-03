const { Router } = require("express");
const UserController = require("../../controllers/auth/user.controller");
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/cloudinary.middleware");
const router = Router();

router.post("/create", UserController.createUser);
router.post("/register-guest", UserController.registerGuest);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    UserController.getUsers
);

router.get("/:id", UserController.getUserById);
router.get(
    "/:id/tickets",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    UserController.getUserTickets
);
router.get(
    "/:userId/pets",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    UserController.getUserPets
);
router.get(
    "/:userId/vehicle",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    UserController.getUserVehicle
);
router.get(
    "/:userId/asset",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    UserController.getUserAsset
);
router.get(
    "/:userId/disabled-person",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    UserController.getUserDisabledPerson
);
router.get(
    "/profile/me",
    auth.authenticate,
    auth.restrict(["usuario", "admin", "super_admin"]),
    UserController.getUserProfile
);

router.put(
    "/update/:id",
    upload.single("photo"),
    UserController.updateUser
);

router.put(
    "/user/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    UserController.changeRolUser
);
router.put(
    "/admin/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    UserController.changeRolAdmin
);

router.delete("/delete/:id", UserController.deleteUser);

module.exports = router;