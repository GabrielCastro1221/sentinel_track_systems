const cors = require("cors");
const configObject = require("../config/enviroment.config");

const allowedOrigins = [
    `${configObject.server.base_url}`,
    `${configObject.microservices.microservices_base_url}:${configObject.microservices.microservices_port}`
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

module.exports = function (app) {
    app.use(cors(corsOptions));
};
