const VehicleRepository = require("../../../repositories/tracking/vehicle.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketVehicle {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket vehicles connected");

            socket.on("createVehicle", async (data) => {
                try {
                    const newVehicle = await VehicleRepository.createVehicle(data);
                    socket.emit("vehicleCreated", newVehicle);
                } catch (error) {
                    socket.emit("error", "Error creating vehicle: " + error.message);
                }
            });

            socket.on("getVehicles", async ({ page, type, brand, model, color }) => {
                try {
                    const vehicles = await VehicleRepository.getVehicles({ page, type, brand, model, color });
                    socket.emit("vehiclesList", vehicles);
                } catch (error) {
                    socket.emit("error", "Error fetching vehicles: " + error.message);
                }
            });

            socket.on("getVehicleById", async (id) => {
                try {
                    const vehicle = await VehicleRepository.getVehicleById(id);
                    socket.emit("vehicleDetail", vehicle);
                } catch (error) {
                    socket.emit("error", "Error fetching vehicle: " + error.message);
                }
            });

            socket.on("updateVehicle", async ({ id, updateData }) => {
                try {
                    const updatedVehicle = await VehicleRepository.updateVehicle(id, updateData);
                    socket.emit("vehicleUpdated", updatedVehicle);
                } catch (error) {
                    socket.emit("error", "Error updating vehicle: " + error.message);
                }
            });

            socket.on("deleteVehicle", async (id) => {
                try {
                    const deletedVehicle = await VehicleRepository.deleteVehicle(id);
                    socket.emit("vehicleDeleted", deletedVehicle);
                } catch (error) {
                    socket.emit("error", "Error deleting vehicle: " + error.message);
                }
            });

            socket.on("disconnect", () => {
                logger.info("Client disconnected from Vehicle socket:", socket.id);
            });
        });
    }
}

module.exports = SocketVehicle;
