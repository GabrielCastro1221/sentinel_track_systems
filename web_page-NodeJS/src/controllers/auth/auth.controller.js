const userModel = require("../../models/auth/user.model");
const UserRepository = require("../../repositories/auth/user.repository");
const { generateToken } = require("../../utils/generateToken.util");
const { generateResetToken } = require("../../utils/resetToken.util");
const { isValidPassword, createHash } = require("../../utils/hash.util");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");
const bcrypt = require("bcrypt");

class AuthController {
    register = async (req, res) => {
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
            logger.error("Error al registrar usuario:", error.message);
            res.status(500).json({ message: error.message });
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                logger.warn("Usuario no encontrado:", email);
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const isPasswordMatch = isValidPassword(password, user);
            if (!isPasswordMatch) {
                logger.warn("Credenciales incorrectas para usuario:", email);
                return res.status(400).json({ message: "Credenciales incorrectas" });
            }

            const token = generateToken(user);
            const { password: userPassword, ...rest } = user._doc;

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60,
            });

            logger.info("Inicio de sesión exitoso para usuario:", email);
            res.status(200).json({
                message: "Inicio de sesión exitoso",
                data: {
                    ...rest,
                    role: user.role,
                    token,
                },
            });
        } catch (error) {
            logger.error("Error al iniciar sesión para usuario:", email, error.message);
            res.status(500).json({ message: error.message });
        }
    };

    RequestPasswordReset = async (req, res) => {
        const { email } = req.body;
        try {
            let user = await userModel.findOne({ email });
            if (!user) {
                return res.render("resetPass", { error: "Usuario no encontrado" });
            }

            const token = generateResetToken();

            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000),
            };

            await user.save();
            await MailerController.SendEmailRecoveryPassword(email, token);

            res.redirect("/confirmacion-email");
        } catch (err) {
            res.status(500).json({
                status: false,
                message: "error interno del servidor",
                error: err.message,
            });
        }
    };

    resetPassword = async (req, res) => {
        const { email, password, token } = req.body;

        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                logger.warn(`Usuario no encontrado: ${email}`);
                return res.render("resetPass", { error: "Usuario no encontrado" });
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                logger.warn(`Token inválido para usuario: ${email}`);
                return res.render("resetPass", { error: "Token inválido" });
            }

            if (new Date() > resetToken.expire) {
                logger.warn(`Token expirado para usuario: ${email}`);
                return res.render("resetPass", { error: "El token expiró" });
            }

            const samePassword = await bcrypt.compare(password, user.password);
            if (samePassword) {
                logger.warn(`Nueva contraseña igual a la anterior para usuario: ${email}`);
                return res.render("resetPass", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();

            logger.info(`Contraseña restablecida con éxito para usuario: ${email}`);
            return res.redirect("/login");
        } catch (err) {
            logger.error(`Error al restablecer contraseña para usuario: ${email}`, err.message);
            return res.status(500).json({
                status: false,
                message: "Error interno del servidor",
                error: err.message,
            });
        }
    };
}

module.exports = new AuthController();