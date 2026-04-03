const CompanyConfigModel = require("../../models/config/company_config.model");

class CompanyConfigRepository {
    async createCompanyConfig(data) {
        try {
            const config = new CompanyConfigModel(data);
            return await config.save();
        } catch (error) {
            throw new Error("No se pudo crear la configuración de compañía");
        }
    }

    async getAllCompanyConfigs() {
        try {
            return await CompanyConfigModel.find();
        } catch (error) {
            throw new Error("No se pudieron obtener las configuraciones de compañía");
        }
    }

    async getConfigById(id) {
        try {
            const config = await CompanyConfigModel.findById(id);
            if (!config) {
                throw new Error(`Configuración con id ${id} no encontrada`);
            }
            return config;
        } catch (error) {
            throw new Error("No se pudo obtener la configuración de compañía");
        }
    }

    async updateCompanyConfig(id, data) {
        try {
            const updatedConfig = await CompanyConfigModel.findByIdAndUpdate(id, data, { new: true });
            if (!updatedConfig) {
                throw new Error(`Configuración con id ${id} no encontrada para actualizar`);
            }
            return updatedConfig;
        } catch (error) {
            throw new Error("No se pudo actualizar la configuración de compañía");
        }
    }

    async deleteCompanyConfig(id) {
        try {
            const deletedConfig = await CompanyConfigModel.findByIdAndDelete(id);
            if (!deletedConfig) {
                throw new Error(`Configuración con id ${id} no encontrada para eliminar`);
            }
            return deletedConfig;
        } catch (error) {
            throw new Error("No se pudo eliminar la configuración de compañía");
        }
    }
}

module.exports = new CompanyConfigRepository();
