const CategoryRepository = require("../../repositories/store/categories.repository");
const { logger } = require("../../middlewares/logger.middleware");

class CategoryController {
    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const newCategory = await CategoryRepository.createCategory(categoryData);

            logger.info(`Categoría creada: ${newCategory._id} - ${newCategory.category}`);
            res.status(201).json({
                message: "Categoría creada con éxito",
                category: newCategory
            });
        } catch (error) {
            logger.error(`Error al crear categoría: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await CategoryRepository.getCategories();
            if (!categories || categories.length === 0) {
                logger.warn("No hay categorías disponibles");
                return res.status(404).json({ message: "No hay categorías disponibles" });
            }

            logger.info(`Categorías obtenidas: ${categories.length}`);
            res.status(200).json({ categories });
        } catch (error) {
            logger.error(`Error al obtener categorías: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const newData = req.body;
            const updatedCategory = await CategoryRepository.updateCategory(id, newData);

            logger.info(`Categoría actualizada: ${updatedCategory._id} - ${updatedCategory.category}`);
            res.status(200).json({
                message: "Categoría actualizada con éxito",
                category: updatedCategory
            });
        } catch (error) {
            logger.error(`Error al actualizar categoría: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const result = await CategoryRepository.deleteCategory(id);

            logger.info(`Categoría eliminada: ${id}`);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error al eliminar categoría: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
