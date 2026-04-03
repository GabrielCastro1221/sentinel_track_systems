const PetRepository = require("../../repositories/tracking/pet.repository");
const UserModel = require("../../models/auth/user.model");
const GPSDeviceModel = require("../../models/tracking/gps_devise.model");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");

class PetController {
    async createPet(req, res) {
        try {
            const petData = req.body;
            if (req.file && req.file.path) {
                petData.photo = req.file.path;
            }

            const newPet = await PetRepository.createPet(petData);

            await UserModel.findByIdAndUpdate(
                petData.user,
                { $push: { pets: newPet._id } },
                { new: true }
            );

            const user = await UserModel.findById(petData.user);

            await MailerController.sendPetCreatedEmail(user, newPet);
            logger.info(`Mascota registrada con éxito: ${newPet.petName} (ID: ${newPet._id})`);
            res.status(201).json({ message: "Mascota registrada con éxito", pet: newPet });
        } catch (error) {
            logger.error(`Error al registrar mascota: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getPets(req, res) {
        try {
            const { page, age, breed, species } = req.query;
            const pets = await PetRepository.getPets({ page, age, breed, species });

            if (!pets.docs.length) {
                logger.warn("No se encontraron mascotas con los filtros aplicados");
            } else {
                logger.info(`Mascotas obtenidas: ${pets.docs.length} encontradas`);
            }

            res.status(200).json(pets);
        } catch (error) {
            logger.error(`Error al obtener mascotas: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getPet(req, res) {
        const { id } = req.params;
        try {
            const pet = await PetRepository.getPetById(id);

            logger.info(`Mascota obtenida: ${pet.petName} (ID: ${id})`);
            res.status(200).json({ message: "Mascota encontrada", pet });
        } catch (error) {
            logger.error(`Error al obtener mascota con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updatePet(req, res) {
        const { id } = req.params;
        try {
            const updateData = { ...req.body };
            if (req.file && req.file.path) {
                updateData.photo = req.file.path;
            }

            const updatedPet = await PetRepository.updatePet(id, updateData);

            logger.info(`Mascota actualizada: ${updatedPet.petName} (ID: ${id})`);
            res.status(200).json({ message: "Mascota actualizada correctamente", pet: updatedPet });
        } catch (error) {
            logger.error(`Error al actualizar mascota con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async deletePet(req, res) {
        const { id } = req.params;
        try {
            const deletedPet = await PetRepository.deletePet(id);
            if (!deletedPet) {
                throw new Error("Mascota no encontrada");
            }

            if (deletedPet.user) {
                await UserModel.findByIdAndUpdate(
                    deletedPet.user,
                    { $pull: { pets: deletedPet._id } },
                    { new: true }
                );
            }

            if (deletedPet.gps) {
                await GPSDeviceModel.findByIdAndUpdate(
                    deletedPet.gps,
                    { $set: { pet: null } },
                    { new: true }
                );
            }

            logger.info(`Mascota eliminada: ${deletedPet.petName} (ID: ${id})`);
            res.status(200).json({ message: "Mascota eliminada y GPS desvinculado", pet: deletedPet });
        } catch (error) {
            logger.error(`Error al eliminar mascota con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

}

module.exports = new PetController();
