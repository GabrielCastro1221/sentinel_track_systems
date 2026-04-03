const ShippinRepository = require("../../repositories/store/shipping.repository");
const { logger } = require("../../middlewares/logger.middleware");

class ShippingController {
    async createShipping(req, res) {
        try {
            const shippingData = req.body;
            await ShippinRepository.createShipping(shippingData);

            logger.info(`Destino creado con éxito: ${shippingData.city_ship}`);
            res.status(201).json({
                message: "Destino creado con exito",
                shippingData
            });
        } catch (error) {
            logger.error(`Error al crear destino: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getShipping(req, res) {
        try {
            const shipping = await ShippinRepository.getShipping();
            if (!shipping || shipping.length === 0) {
                logger.warn("No hay destinos disponibles");
                return res.status(404).json({ message: "No hay destinos disponibles" });
            }

            logger.info("Destinos obtenidos exitosamente");
            res.status(200).json({ shipping });
        } catch (error) {
            logger.error(`Error al obtener destinos: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateShipping(req, res) {
        try {
            const { id } = req.params;
            const { city_ship, amount } = req.body;
            const updatedShipping = await ShippinRepository.updateShipping(id, { city_ship, amount });

            logger.info(`Destino actualizado correctamente: ${updatedShipping.city_ship}`);
            res.status(200).json({ message: "Destino actualizado correctamente", updatedShipping });
        } catch (error) {
            logger.error(`Error al actualizar destino: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteShipping(req, res) {
        try {
            const { id } = req.params;
            const deletedShipping = await ShippinRepository.deleteShippingById(id);

            logger.info(`Destino eliminado correctamente: ${deletedShipping.city_ship}`);
            res.status(200).json({ message: "Destino eliminado correctamente", deletedShipping });
        } catch (error) {
            logger.error(`Error al eliminar destino: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ShippingController();