const VehicleModel = require("../../models/tracking/vehicle.model");

class VehicleRepository {
    async createVehicle(vehicleData) {
        try {
            const newVehicle = new VehicleModel(vehicleData);
            await newVehicle.save();
            return newVehicle;
        } catch (error) {
            throw new Error(`No se pudo crear el vehículo: ${error.message}`);
        }
    }

    async getVehicles({ page = 1, type, brand, model, color }) {
        try {
            const query = {};
            if (type) query.type = type;
            if (brand) query.brand = brand;
            if (model) query.model = model;
            if (color) query.color = color;

            const options = {
                page: parseInt(page),
                limit: 10,
                sort: { createdAt: -1 },
                lean: true,
            };

            return await VehicleModel.paginate(query, options);
        } catch (error) {
            throw new Error(`No se pudieron obtener los vehículos: ${error.message}`);
        }
    }

    async getVehicleById(id) {
        try {
            const vehicle = await VehicleModel.findById(id);
            if (!vehicle) {
                throw new Error(`Vehículo con id ${id} no encontrado`);
            }
            return vehicle;
        } catch (error) {
            throw new Error(`No se pudo obtener el vehículo: ${error.message}`);
        }
    }

    async updateVehicle(id, updateData) {
        try {
            const updatedVehicle = await VehicleModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedVehicle) {
                throw new Error(`Vehículo con id ${id} no encontrado para actualizar`);
            }
            return updatedVehicle;
        } catch (error) {
            throw new Error(`No se pudo actualizar el vehículo: ${error.message}`);
        }
    }

    async deleteVehicle(id) {
        try {
            const deletedVehicle = await VehicleModel.findByIdAndDelete(id);
            if (!deletedVehicle) {
                throw new Error(`Vehículo con id ${id} no encontrado para eliminar`);
            }
            return deletedVehicle;
        } catch (error) {
            throw new Error(`No se pudo eliminar el vehículo: ${error.message}`);
        }
    }
}

module.exports = new VehicleRepository();
