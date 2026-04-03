const DisabledPersonModel = require("../../models/tracking/disabled_person.model");

class DisabledPersonRepository {
    async createDisabledPerson(data) {
        try {
            const newDisabledPerson = new DisabledPersonModel(data);
            await newDisabledPerson.save();
            return newDisabledPerson;
        } catch (error) {
            throw new Error(`No se pudo crear la persona con discapacidad: ${error.message}`);
        }
    }

    async getDisabledPersons({ page = 1, disabilityType, age, name }) {
        try {
            const query = {};
            if (disabilityType) query.disabilityType = disabilityType;
            if (age) query.age = age;
            if (name) query.name = { $regex: name, $options: "i" };

            const options = {
                page: parseInt(page),
                limit: 10,
                sort: { createdAt: -1 },
                lean: true,
            };

            return await DisabledPersonModel.paginate(query, options);
        } catch (error) {
            throw new Error(`No se pudieron obtener las personas con discapacidad: ${error.message}`);
        }
    }

    async getDisabledPersonById(id) {
        try {
            const person = await DisabledPersonModel.findById(id);
            if (!person) {
                throw new Error(`Persona con discapacidad con id ${id} no encontrada`);
            }
            return person;
        } catch (error) {
            throw new Error(`No se pudo obtener la persona con discapacidad: ${error.message}`);
        }
    }

    async updateDisabledPerson(id, updateData) {
        try {
            const updatedPerson = await DisabledPersonModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedPerson) {
                throw new Error(`Persona con discapacidad con id ${id} no encontrada para actualizar`);
            }
            return updatedPerson;
        } catch (error) {
            throw new Error(`No se pudo actualizar la persona con discapacidad: ${error.message}`);
        }
    }

    async deleteDisabledPerson(id) {
        try {
            const deletedPerson = await DisabledPersonModel.findByIdAndDelete(id);
            if (!deletedPerson) {
                throw new Error(`Persona con discapacidad con id ${id} no encontrada para eliminar`);
            }
            return deletedPerson;
        } catch (error) {
            throw new Error(`No se pudo eliminar la persona con discapacidad: ${error.message}`);
        }
    }
}

module.exports = new DisabledPersonRepository();
