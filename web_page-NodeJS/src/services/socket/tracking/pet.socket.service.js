const { logger } = require("../../../middlewares/logger.middleware");
const PetRepository = require("../../../repositories/tracking/pet.repository");

module.exports = function (io) {
    io.on("connection", (socket) => {
        logger.info("Client connected to Pet socket:", socket.id);

        socket.on("pet:create", async (data) => {
            try {
                const pet = await PetRepository.createPet(data);
                io.emit("pet:created", pet);
            } catch (error) {
                socket.emit("pet:error", { message: error.message });
            }
        });

        socket.on("pet:getAll", async ({ page, age, breed, species }) => {
            try {
                const pets = await PetRepository.getPets({ page, age, breed, species });
                socket.emit("pet:getAll:response", pets);
            } catch (error) {
                socket.emit("pet:error", { message: error.message });
            }
        });

        socket.on("pet:getById", async ({ id }) => {
            try {
                const pet = await PetRepository.getPetById(id);
                socket.emit("pet:getById:response", pet);
            } catch (error) {
                socket.emit("pet:error", { message: error.message });
            }
        });

        socket.on("pet:update", async ({ id, data }) => {
            try {
                const updated = await PetRepository.updatePet(id, data);
                io.emit("pet:updated", updated);
            } catch (error) {
                socket.emit("pet:error", { message: error.message });
            }
        });

        socket.on("pet:delete", async ({ id }) => {
            try {
                const deleted = await PetRepository.deletePet(id);
                io.emit("pet:deleted", deleted);
            } catch (error) {
                socket.emit("pet:error", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            logger.info("Client disconnected from Pet socket:", socket.id);
        });
    });
};
