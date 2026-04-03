const configPageRepository = require("../../repositories/config/configPage.repository");
const { logger } = require("../../middlewares/logger.middleware");

class ConfigPageController {
    async createConfigPage(req, res) {
        try {
            const configPage = await configPageRepository.createConfigPage(req.body);

            logger.info("Página de configuración creada exitosamente");
            res.status(201).json(configPage);
        } catch (error) {
            logger.error("Error al crear la página de configuración:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async getAllConfigPages(req, res) {
        try {
            const configPages = await configPageRepository.getAllConfigPages();

            logger.info("Páginas de configuración obtenidas exitosamente");
            res.status(200).json(configPages);
        } catch (error) {
            logger.error("Error al obtener las páginas de configuración:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async getConfigById(req, res) {
        try {
            const configPage = await configPageRepository.getConfigById(req.params.id);

            logger.info(`Página de configuración con id ${req.params.id} obtenida exitosamente`);
            res.status(200).json(configPage);
        } catch (error) {
            logger.error("Error al obtener la página de configuración:", error);
            res.status(404).json({ message: error.message });
        }
    }

    async updateConfigPage(req, res) {
        try {
            const updatedConfigPage = await configPageRepository.updateConfigPage(req.params.id, req.body);

            logger.info(`Página de configuración con id ${req.params.id} actualizada exitosamente`);
            res.status(200).json(updatedConfigPage);
        } catch (error) {
            logger.error("Error al actualizar la página de configuración:", error);
            res.status(404).json({ message: error.message });
        }
    }

    async deleteConfigPage(req, res) {
        try {
            const deletedConfigPage = await configPageRepository.deletedConfigPage(req.params.id);

            logger.info(`Página de configuración con id ${req.params.id} eliminada exitosamente`);
            res.status(200).json(deletedConfigPage);
        } catch (error) {
            logger.error("Error al eliminar la página de configuración:", error);
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new ConfigPageController();
