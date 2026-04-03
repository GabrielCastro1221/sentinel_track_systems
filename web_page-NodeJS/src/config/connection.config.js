const mongoose = require("mongoose");
const configObject = require("./enviroment.config");
const { logger } = require("../middlewares/logger.middleware");

class Database {
    static #instance;
    constructor() {
        this.connectWithRetry();
    }
    async connectWithRetry() {
        try {
            await mongoose.connect(configObject.server.mongo_url, {
                connectTimeoutMS: 10000,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            logger.info("Database - MongoDB connection established successfully!");
        } catch (error) {
            logger.error(`Database - Error connecting to the database: ${error.message}`);
            setTimeout(this.connectWithRetry, 5000);
        }
    }
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Database();
        }
        return this.#instance;
    }
}
module.exports = Database.getInstance();
