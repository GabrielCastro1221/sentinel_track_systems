const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerOptions = require("./swagger.middleware");

const userRouter = require("../routes/auth/user.routes");
const authRouter = require("../routes/auth/auth.routes");
const companyConfigRouter = require("../routes/config/companyConfig.routes");
const configPageRouter = require("../routes/config/configPage.routes");
const uploadRouter = require("../routes/config/upload.routes");
const cartRouter = require("../routes/store/cart.routes");
const productRouter = require("../routes/store/product.routes");
const shippingRouter = require("../routes/store/shipping.routes");
const categoryRouter = require("../routes/store/categories.routes");
const reviewRouter = require("../routes/store/review.routes");
const ticketRouter = require("../routes/store/ticket.routes");
const vehicleRouter = require("../routes/tracking/vehicle.routes");
const petRouter = require("../routes/tracking/pet.routes");
const gpsRouter = require("../routes/tracking/gpsDevice.routes");
const DisabledPersonRouter = require("../routes/tracking/disabledPerson.routes");
const viewsRouter = require("../routes/views.routes");
const specs = swaggerJsDoc(swaggerOptions);

const setupRoutes = (app) => {
    app.use("/", viewsRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/cart", cartRouter);
    app.use("/api/v1/categories", categoryRouter);
    app.use("/api/v1/configPage", configPageRouter);
    app.use("/api/v1/company-config", companyConfigRouter);
    app.use("/api/v1/gps-device", gpsRouter);
    app.use("/api/v1/pets", petRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/reviews", reviewRouter);
    app.use("/api/v1/tickets", ticketRouter);
    app.use("/api/v1/vehicles", vehicleRouter);
    app.use("/api/v1/disabled-persons", DisabledPersonRouter);
    app.use("/api/v1/shipping", shippingRouter);
    app.use("/api/v1/", uploadRouter);

    app.use(
        "/api-docs",
        swaggerUiExpress.serve,
        swaggerUiExpress.setup(specs)
    );
};

module.exports = setupRoutes;
