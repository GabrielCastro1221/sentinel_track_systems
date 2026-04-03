const DisabledPersonRepository = require("../../repositories/tracking/disabledPerson.respository");
const UserModel = require("../../models/auth/user.model");
const GPSDeviceModel = require("../../models/tracking/gps_devise.model");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");

class DisabledPersonController {
    async createDisabledPerson(req, res) {
        try {
            const personData = req.body;
            if (req.file && req.file.path) {
                personData.photo = req.file.path;
            }

            const newPerson = await DisabledPersonRepository.createDisabledPerson(personData);

            await UserModel.findByIdAndUpdate(
                personData.responsibleUser,
                { $push: { disabled_person: newPerson._id } },
                { new: true }
            );

            const user = await UserModel.findById(personData.responsibleUser);
            await MailerController.sendDisabledPersonCreatedEmail(user, newPerson);
            logger.info(`Persona con discapacidad registrada: ${newPerson.name} (ID: ${newPerson._id})`);
            res.status(201).json({ message: "Persona con discapacidad registrada con éxito", person: newPerson });
        } catch (error) {
            logger.error(`Error al registrar persona con discapacidad: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getDisabledPersons(req, res) {
        try {
            const { page, disabilityType, age, name } = req.query;
            const persons = await DisabledPersonRepository.getDisabledPersons({ page, disabilityType, age, name });

            if (!persons.docs.length) {
                logger.warn("No se encontraron personas con discapacidad con los filtros aplicados");
            } else {
                logger.info(`Personas con discapacidad obtenidas: ${persons.docs.length} encontradas`);
            }

            res.status(200).json(persons);
        } catch (error) {
            logger.error(`Error al obtener personas con discapacidad: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getDisabledPerson(req, res) {
        const { id } = req.params;
        try {
            const person = await DisabledPersonRepository.getDisabledPersonById(id);

            logger.info(`Persona con discapacidad obtenida: ${person.name} (ID: ${id})`);
            res.status(200).json({ message: "Persona con discapacidad encontrada", person });
        } catch (error) {
            logger.error(`Error al obtener persona con discapacidad con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updateDisabledPerson(req, res) {
        const { id } = req.params;
        try {
            const updateData = { ...req.body };
            if (req.file && req.file.path) {
                updateData.photo = req.file.path;
            }

            const updatedPerson = await DisabledPersonRepository.updateDisabledPerson(id, updateData);

            logger.info(`Persona con discapacidad actualizada: ${updatedPerson.name} (ID: ${id})`);
            res.status(200).json({ message: "Persona con discapacidad actualizada correctamente", person: updatedPerson });
        } catch (error) {
            logger.error(`Error al actualizar persona con discapacidad con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async deleteDisabledPerson(req, res) {
        const { id } = req.params;
        try {
            const deletedPerson = await DisabledPersonRepository.deleteDisabledPerson(id);

            if (!deletedPerson) {
                throw new Error("Persona con discapacidad no encontrada");
            }

            if (deletedPerson.responsibleUser) {
                await UserModel.findByIdAndUpdate(
                    deletedPerson.responsibleUser,
                    { $pull: { disabled_person: deletedPerson._id } },
                    { new: true }
                );
            }

            if (deletedPerson.gps) {
                await GPSDeviceModel.findByIdAndUpdate(
                    deletedPerson.gps,
                    { $set: { disabled_person: null } },
                    { new: true }
                );
            }

            logger.info(`Persona con discapacidad eliminada: ${deletedPerson.name} (ID: ${id})`);
            res.status(200).json({ message: "Persona con discapacidad eliminada y GPS desvinculado", person: deletedPerson });
        } catch (error) {
            logger.error(`Error al eliminar persona con discapacidad con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new DisabledPersonController();
