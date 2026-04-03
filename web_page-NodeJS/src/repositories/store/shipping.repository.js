const shippingModel = require("../../models/store/shipping.model");

class ShippinRepository {
    async createShipping(shippingData) {
        try {
            const existingshipping = await shippingModel.findOne({ city_ship: shippingData.city_ship });
            if (existingshipping) {
                throw new Error("El destino ya existe");
            }

            const newShipping = new shippingModel({
                ...shippingData
            });

            await newShipping.save();
            return newShipping;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getShipping() {
        try {
            const shipping = await shippingModel.find({});
            return shipping;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateShipping(id, data) {
        try {
            const shipping = await shippingModel.findById(id);
            if (!shipping) {
                throw new Error("Destino no encontrado");
            }

            shipping.city_ship = data.city_ship ?? shipping.city_ship;
            shipping.amount = data.amount ?? shipping.amount;

            await shipping.save();
            return shipping;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteShippingById(id) {
        try {
            const deletedShipping = await shippingModel.findByIdAndDelete(id);
            if (!deletedShipping) {
                throw new Error("El destino no fue encontrado");
            }

            return deletedShipping;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new ShippinRepository();