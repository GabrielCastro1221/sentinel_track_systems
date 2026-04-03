const categoryModel = require("../../models/store/category.model");

class CategoryRepository {
    async createCategory(categoryData) {
        try {
            const existingCategory = await categoryModel.findOne({ category: categoryData.category });
            if (existingCategory) {
                throw new Error("La categoria ya existe");
            }

            const newCategory = new categoryModel({
                ...categoryData
            });

            await newCategory.save();
            return newCategory;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCategories() {
        try {
            const categories = await categoryModel.find({});
            return categories;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCategory(categoryId, newData) {
        try {
            const existingCategory = await categoryModel.findById(categoryId);
            if (!existingCategory) {
                throw new Error("La categoría no existe");
            }

            if (newData.category) {
                const duplicate = await categoryModel.findOne({ category: newData.category });
                if (duplicate && duplicate._id.toString() !== categoryId) {
                    throw new Error("Ya existe una categoría con ese nombre");
                }
            }

            const updatedCategory = await categoryModel.findByIdAndUpdate(
                categoryId,
                { $set: newData },
                { new: true, runValidators: true }
            );

            return updatedCategory;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCategory(categoryId) {
        try {
            const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
            if (!deletedCategory) {
                throw new Error("La categoría no existe");
            }

            return { message: "Categoría eliminada correctamente" };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryRepository();
