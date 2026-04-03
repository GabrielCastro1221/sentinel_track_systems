const cartModel = require("../../models/store/cart.model");
const CartRepository = require("../../repositories/store/cart.repository");
const UserRepository = require("../../repositories/auth/user.repository");
const { generateToken } = require("../../utils/generateToken.util");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");
const mongoose = require("mongoose");
const UserModel = require("../../models/auth/user.model");
const PetModel = require("../../models/tracking/pet.model");
const VehicleModel = require("../../models/tracking/vehicle.model");
const DisabledPersonModel = require("../../models/tracking/disabled_person.model");
const GPSDeviceModel = require("../../models/tracking/gps_devise.model");

class UserController {
    async createUser(req, res) {
        try {
            const userData = req.body;
            await UserRepository.createUser(userData);

            await MailerController.userRegister(userData);
            logger.info("Usuario registrado con éxito");
            res.status(200).json({
                message: "Usuario registrado con exito",
                user: userData
            });

        } catch (error) {
            logger.error(`Error al crear el usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async registerGuest(req, res) {
        try {
            const userData = req.body;
            const user = await UserRepository.createUser(userData);

            const newCart = new cartModel({ products: [] });
            await newCart.save();

            user.cart = newCart._id;
            await user.save();

            const guestId = req.body.guestId;
            if (guestId) {
                await CartRepository.migrateGuestCartToUser(guestId, newCart._id);
            }

            const token = generateToken(user);
            const { password, ...rest } = user._doc;

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60,
            });

            await MailerController.userRegister(userData);

            logger.info("Usuario registrado, carrito migrado y sesión iniciada:", user.email);

            res.status(200).json({
                message: "Usuario registrado, carrito migrado y sesión iniciada",
                user: rest,
                cart: newCart,
                token,
            });
        } catch (error) {
            logger.error(`Error al registrar el usuario invitado: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            const { page, role, gender } = req.query;
            const users = await UserRepository.getUsers({ page, role, gender });

            logger.info("Usuarios obtenidos con éxito");
            res.status(200).json(users);
        } catch (error) {
            logger.error(`Error al obtener los usuarios: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserRepository.getUserById(id);

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const { password, ...rest } = user;

            logger.info(`Usuario obtenido exitosamente con ID: ${id}`);
            res.status(200).json({
                message: "Usuario obtenido con éxito",
                user: rest,
            });
        } catch (error) {
            logger.error(`Error al obtener el usuario por ID: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserProfile(req, res) {
        const userId = req.user._id;
        try {
            const user = await UserRepository.getUserProfile(userId);
            const { password, ...rest } = user.toObject();

            logger.info(`Información del perfil obtenida exitosamente para usuario: ${user.email}`);
            res.status(200).json({
                message: "Información del perfil obtenida exitosamente",
                data: rest,
            });
        } catch (error) {
            logger.error(`Error al obtener la información del perfil: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async getUserPets(req, res) {
        try {
            const { userId } = req.params;
            const pets = await UserRepository.getUserPets(userId);

            logger.info(`Mascotas del usuario obtenidas exitosamente para usuario ID: ${userId}`);
            res.status(200).json({
                message: "Mascotas obtenidas con éxito",
                pets: pets,
            });
        } catch (error) {
            logger.error(`Error al obtener las mascotas del usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserVehicle(req, res) {
        try {
            const { userId } = req.params;
            const vehicle = await UserRepository.getUserVehicle(userId);

            logger.info(`Vehículo del usuario obtenido exitosamente para usuario ID: ${userId}`);
            res.status(200).json({
                message: "Vehículo obtenido con éxito",
                vehicle: vehicle,
            });
        } catch (error) {
            logger.error(`Error al obtener el vehículo del usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserAsset(req, res) {
        try {
            const { userId } = req.params;
            const asset = await UserRepository.getUserAsset(userId);

            logger.info(`Activo del usuario obtenido exitosamente para usuario ID: ${userId}`);
            res.status(200).json({
                message: "Activo obtenido con éxito",
                asset: asset,
            });
        } catch (error) {
            logger.error(`Error al obtener el activo del usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserDisabledPerson(req, res) {
        try {
            const { userId } = req.params;
            const disabledPerson = await UserRepository.getUserDisabledPerson(userId);

            logger.info(`Persona discapacitada del usuario obtenida exitosamente para usuario ID: ${userId}`);
            res.status(200).json({
                message: "Persona discapacitada obtenida con éxito",
                disabledPerson: disabledPerson,
            });
        } catch (error) {
            logger.error(`Error al obtener la persona discapacitada del usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getUserTickets(req, res) {
        try {
            const { id } = req.params;
            const tickets = await UserRepository.getUserTickets(id);

            logger.info(`Tickets del usuario obtenidos exitosamente para usuario ID: ${id}`);
            res.status(200).json({
                message: "Tickets obtenidos con éxito",
                tickets,
            });
        } catch (error) {
            logger.error(`Error al obtener los tickets del usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;

        try {
            const updateData = { ...req.body };

            if (req.file && req.file.path) {
                updateData.photo = req.file.path;
            }

            const updatedUser = await UserRepository.updateUser(id, updateData);

            logger.info(`Usuario actualizado con éxito para usuario ID: ${id}`);
            res.status(200).json({
                message: "Usuario actualizado correctamente",
                user: updatedUser,
            });
        } catch (error) {
            logger.error(`Error al actualizar el usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async changeRolAdmin(req, res) {
        const { id } = req.params;

        try {
            const updatedUser = await UserRepository.changeRole(id, "admin");

            await MailerController.roleChangedToAdmin(updatedUser);
            logger.info(`Rol del usuario cambiado a admin`);
            res.status(200).json(updatedUser);
        } catch (error) {
            logger.error(`Error al cambiar el rol del usuario a admin: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async changeRolUser(req, res) {
        const { id } = req.params;

        try {
            const updatedUser = await UserRepository.changeRole(id, "usuario");

            logger.info("Rol del usuario cambiado a usuario");
            res.status(200).json(updatedUser);
        } catch (error) {
            logger.error(`Error al cambiar el rol del usuario a usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const deletedUser = await UserModel.findByIdAndDelete(id, { session });
            if (!deletedUser) {
                throw new Error("Usuario no encontrado");
            }

            for (const petId of deletedUser.pets) {
                const pet = await PetModel.findByIdAndDelete(petId, { session });
                if (pet?.gps) {
                    await GPSDeviceModel.findByIdAndUpdate(
                        pet.gps,
                        { $set: { pet: null } },
                        { new: true, session }
                    );
                }
            }

            for (const vehicleId of deletedUser.vehicle) {
                const vehicle = await VehicleModel.findByIdAndDelete(vehicleId, { session });
                if (vehicle?.gps) {
                    await GPSDeviceModel.findByIdAndUpdate(
                        vehicle.gps,
                        { $set: { vehicle: null } },
                        { new: true, session }
                    );
                }
            }

            for (const personId of deletedUser.disabled_person) {
                const person = await DisabledPersonModel.findByIdAndDelete(personId, { session });
                if (person?.gps) {
                    await GPSDeviceModel.findByIdAndUpdate(
                        person.gps,
                        { $set: { disabled_person: null } },
                        { new: true, session }
                    );
                }
            }

            await MailerController.accountDeleted(deletedUser);

            await session.commitTransaction();
            session.endSession();

            logger.info(`Usuario eliminado con éxito y todas las referencias limpiadas`);
            res.status(200).json({
                message: "Usuario eliminado y referencias desvinculadas",
                user: deletedUser,
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            logger.error(`Error al eliminar el usuario: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController();