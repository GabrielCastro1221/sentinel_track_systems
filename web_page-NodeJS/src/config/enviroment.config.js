const dotenv = require("dotenv");
const program = require("./commander.config");

const { mode } = program.opts();
dotenv.config({ path: mode === "dev" ? "./.env.dev" : "./.env.build" });

const configObject = {
    server: {
        port: process.env.PORT || 8080,
        base_url: process.env.BASE_URL,
        mongo_url: process.env.MONGO_URL,
    },
    microservices: {
        microservices_port: process.env.MICROSERVICE_PORT || 5000,
        microservices_base_url: process.env.MICROSERVICES_BASE_URL,
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET,
    },
    logger: {
        log_level: process.env.LOG_LEVEL,
        log_to_file: process.env.LOG_TO_FILE,
        log_file_name: process.env.LOG_FILE_NAME,
    },
    cloudinary: {
        api_key: process.env.API_KEY,
        cloudinary_url: process.env.CLOUDINARY_URL,
        api_secret: process.env.API_SECRET,
        cloud_name: process.env.CLOUD_NAME,
    },
    mailer: {
        mailer_user: process.env.MAILER_USER,
        mailer_pass: process.env.MAILER_PASS,
        email_from: process.env.EMAIL_FROM,
        email_service: process.env.EMAIL_SERVICE,
    },
    epayco: {
        epayco_public_key: process.env.EPAYCO_PUBLIC_KEY,
        epayco_mode: process.env.EPAYCO_MODE,
    },
};

module.exports = configObject;