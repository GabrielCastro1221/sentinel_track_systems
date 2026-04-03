const DisabledPersonRepository = require("../../../repositories/tracking/disabledPerson.respository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketDisabledPerson {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket disabled persons connected");

            socket.on("createDisabledPerson", async (data) => {
                try {
                    const newPerson = await DisabledPersonRepository.createDisabledPerson(data);
                    socket.emit("disabledPersonCreated", newPerson);
                } catch (error) {
                    socket.emit("error", "Error creating disabled person: " + error.message);
                }
            });

            socket.on("getDisabledPersons", async ({ page, disabilityType, age, name }) => {
                try {
                    const persons = await DisabledPersonRepository.getDisabledPersons({ page, disabilityType, age, name });
                    socket.emit("disabledPersonsList", persons);
                } catch (error) {
                    socket.emit("error", "Error fetching disabled persons: " + error.message);
                }
            });

            socket.on("getDisabledPersonById", async (id) => {
                try {
                    const person = await DisabledPersonRepository.getDisabledPersonById(id);
                    socket.emit("disabledPersonDetail", person);
                } catch (error) {
                    socket.emit("error", "Error fetching disabled person: " + error.message);
                }
            });

            socket.on("updateDisabledPerson", async ({ id, updateData }) => {
                try {
                    const updatedPerson = await DisabledPersonRepository.updateDisabledPerson(id, updateData);
                    socket.emit("disabledPersonUpdated", updatedPerson);
                } catch (error) {
                    socket.emit("error", "Error updating disabled person: " + error.message);
                }
            });

            socket.on("deleteDisabledPerson", async (id) => {
                try {
                    const deletedPerson = await DisabledPersonRepository.deleteDisabledPerson(id);
                    socket.emit("disabledPersonDeleted", deletedPerson);
                } catch (error) {
                    socket.emit("error", "Error deleting disabled person: " + error.message);
                }
            });

            socket.on("disconnect", () => {
                logger.info("Client disconnected from DisabledPerson socket:", socket.id);
            });
        });
    }
}

module.exports = SocketDisabledPerson;
