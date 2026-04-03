const ConfigPageModel = require("../../models/config/config_page.model");

class ConfigPageRepository {
    async createConfigPage(data) {
        try {
            const configPage = new ConfigPageModel(data);
            return await configPage.save();
        } catch (error) {
            throw new Error("No se pudo crear la página de configuración");
        }
    }

    async getAllConfigPages() {
        try {
            return await ConfigPageModel.find();
        } catch (error) {
            throw new Error("No se pudieron obtener las páginas de configuración");
        }
    }

    async getConfigById(id) {
        try {
            const configPage = await ConfigPageModel.findById(id);
            if (!configPage) {
                throw new Error(`ConfigPage con id ${id} no encontrada`);
            }

            return configPage;
        } catch (error) {
            throw new Error("No se pudo obtener la página de configuración");
        }
    }

    async updateConfigPage(id, data) {
        try {
            const updatedConfigPage = await ConfigPageModel.findByIdAndUpdate(id, data, { new: true });
            if (!updatedConfigPage) {
                throw new Error(`ConfigPage con id ${id} no encontrada para actualizar`);
            }

            return updatedConfigPage;
        } catch (error) {
            throw new Error("No se pudo actualizar la página de configuración");
        }
    }

    async deletedConfigPage(id) {
        try {
            const deletedConfigPage = await ConfigPageModel.findByIdAndDelete(id);
            if (!deletedConfigPage) {
                throw new Error(`ConfigPage con id ${id} no encontrada para eliminar`);
            }

            return deletedConfigPage;
        } catch (error) {
            throw new Error("No se pudo eliminar la página de configuración");
        }
    }
}

module.exports = new ConfigPageRepository();

