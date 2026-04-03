const { logger } = require("./logger.middleware");
const socketMiddleware = require("./socket.middleware");
const configObject = require("../config/enviroment.config");
const { Server } = require("socket.io");

require("../config/connection.config");

const serverListenMiddleware = (app) => {
    const PORT = configObject.server.port;

    const httpServer = app.listen(PORT, () => {
        try {
            logger.info(`Server is running on PORT:${PORT}`);
            logger.info(`SentinelTrack Systems is running on URL http://localhost:${PORT}`);
        } catch (error) {
            logger.error(`Error occurred while starting the server: ${error.message}`);
        }
    });

    const io = new Server(httpServer);
    socketMiddleware(io);
};

module.exports = serverListenMiddleware;
