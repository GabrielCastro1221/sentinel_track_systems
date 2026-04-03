const { logger } = require("./logger.middleware");

const socketModules = [
    require("../services/socket/auth/user.socket.service"),
    require("../services/socket/store/cart.socket.service"),
    require("../services/socket/store/product.socket.service"),
    require("../services/socket/store/review.socket.service"),
    require("../services/socket/store/ticket.socket.service"),
    require("../services/socket/tracking/pet.socket.service"),
    require("../services/socket/tracking/vehicle.socket.service"),
    require("../services/socket/tracking/disabledPerson.socket.service"),
    require("../services/socket/tracking/gpsDevice.socket.service"),
];

const socketMiddleware = (io) => {
    io.on("connection", (socket) => {
        logger.info("New client connected:", socket.id);

        socketModules.forEach((SocketClass) => {
            new SocketClass(io, socket);
        });

        socket.on("disconnect", () => {
            logger.info("Client disconnected:", socket.id);
        });
    });
};

module.exports = socketMiddleware;
