const CompanyConfigRepository = require('../../repositories/config/companyConfig.repository');
const { logger } = require('../../middlewares/logger.middleware');

class CompanyConfigController {
    async createCompanyConfig(req, res) {
        try {
            const config = await CompanyConfigRepository.createCompanyConfig(req.body);
            logger.info(`Configuración de compañía creada: ${config._id}`);
            res.status(201).json(config);
        } catch (error) {
            logger.error(`Error al crear configuración de compañía: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCompanyConfigs(req, res) {
        try {
            const configs = await CompanyConfigRepository.getAllCompanyConfigs();
            logger.info(`Configuraciones de compañía obtenidas: ${configs.length}`);
            res.status(200).json(configs);
        } catch (error) {
            logger.error(`Error al obtener configuraciones de compañía: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getCompanyConfigById(req, res) {
        try {
            const config = await CompanyConfigRepository.getConfigById(req.params.id);
            if (!config) return res.status(404).json({ message: 'Configuración no encontrada' });

            logger.info(`Configuración de compañía obtenida: ${config._id}`);
            res.status(200).json(config);
        } catch (error) {
            logger.error(`Error al obtener configuración de compañía: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateCompanyConfig(req, res) {
        try {
            const config = await CompanyConfigRepository.updateCompanyConfig(req.params.id, req.body);
            if (!config) return res.status(404).json({ message: 'Configuración no encontrada' });

            logger.info(`Configuración de compañía actualizada: ${config._id}`);
            res.status(200).json(config);
        } catch (error) {
            logger.error(`Error al actualizar configuración de compañía: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCompanyConfig(req, res) {
        try {
            const config = await CompanyConfigRepository.deleteCompanyConfig(req.params.id);
            if (!config) return res.status(404).json({ message: 'Configuración no encontrada' });

            logger.info(`Configuración de compañía eliminada: ${config._id}`);
            res.status(200).json({ message: 'Configuración eliminada exitosamente' });
        } catch (error) {
            logger.error(`Error al eliminar configuración de compañía: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CompanyConfigController();