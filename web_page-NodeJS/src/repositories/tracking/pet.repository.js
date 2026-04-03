const PetModel = require("../../models/tracking/pet.model");

class PetRepository {
    async createPet(petData) {
        try {
            const newPet = new PetModel(petData);
            await newPet.save();
            return newPet;
        } catch (error) {
            throw new Error(`No se pudo crear la mascota: ${error.message}`);
        }
    }

    async getPets({ page = 1, age, breed, species }) {
        try {
            const query = {};
            if (age) query.age = age;
            if (breed) query.breed = breed;
            if (species) query.species = species;

            const options = {
                page: parseInt(page),
                limit: 10,
                sort: { createdAt: -1 },
                lean: true,
            };

            return await PetModel.paginate(query, options);
        } catch (error) {
            throw new Error(`No se pudieron obtener las mascotas: ${error.message}`);
        }
    }

    async getPetById(id) {
        try {
            const pet = await PetModel.findById(id);
            if (!pet) {
                throw new Error(`Mascota con id ${id} no encontrada`);
            }
            return pet;
        } catch (error) {
            throw new Error(`No se pudo obtener la mascota: ${error.message}`);
        }
    }

    async updatePet(id, updateData) {
        try {
            const updatedPet = await PetModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedPet) {
                throw new Error(`Mascota con id ${id} no encontrada para actualizar`);
            }
            return updatedPet;
        } catch (error) {
            throw new Error(`No se pudo actualizar la mascota: ${error.message}`);
        }
    }

    async deletePet(id) {
        try {
            const deletedPet = await PetModel.findByIdAndDelete(id);
            if (!deletedPet) {
                throw new Error(`Mascota con id ${id} no encontrada para eliminar`);
            }
            return deletedPet;
        } catch (error) {
            throw new Error(`No se pudo eliminar la mascota: ${error.message}`);
        }
    }
}

module.exports = new PetRepository();
