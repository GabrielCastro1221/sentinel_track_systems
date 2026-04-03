const nodemailer = require("nodemailer");
const configObject = require("../../config/enviroment.config");
const { logger } = require("../../middlewares/logger.middleware");

class MailerController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: configObject.mailer.email_service,
            auth: {
                user: configObject.mailer.mailer_user,
                pass: configObject.mailer.mailer_pass,
            },
        });
    }

    async userRegister(userData) {
        try {
            const { name, email, age, role, gender, phone, address, city } = userData;
            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: "SentinelTrack Systems - Bienvenido a la plataforma integral de rastreo GPS",
                html: `
                <div style="font-family: Roboto, sans-serif; background-color: #F2F4F8; color: #4B4B4B; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #D9E2EC; padding: 20px; border-radius: 12px;">
                    <div style="background-color: #1A2A6C; padding: 20px; text-align: center; border-radius: 8px;">
                        <h1 style="color: #FFFFFF; font-family: Montserrat, sans-serif; margin: 0;">SentinelTrack Systems</h1>
                    </div>
                    <h2 style="color: #4F7CAC;">¡Bienvenido, ${name}!</h2>
                    <p>Nos alegra que te hayas registrado en nuestra plataforma. SentinelTrack Systems te permite rastrear en tiempo real mascotas, vehículos, activos y personas con discapacidad.</p>
                    <ul>
                        <li><strong>Nombre completo:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Edad:</strong> ${age}</li>
                        <li><strong>Rol:</strong> ${role}</li>
                        <li><strong>Género:</strong> ${gender}</li>
                        <li><strong>Teléfono:</strong> ${phone}</li>
                        <li><strong>Dirección:</strong> ${address}, ${city}</li>
                    </ul>
                    <p>Estamos aquí para ofrecerte la mejor experiencia de rastreo GPS integral.</p>
                    <div style="margin-top: 20px; text-align: center;">
                        <h3 style="color: #A3D9B1;">¡Gracias por confiar en SentinelTrack Systems!</h3>
                        <p>Si necesitas ayuda, no dudes en <a href="${configObject.server.base_url}/contact">contactarnos</a>.</p>
                    </div>
                </div>
            `,
            };
            await this.transporter.sendMail(Opt);
            logger.info("Correo de bienvenida enviado exitosamente a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de bienvenida:", error);
        }
    }

    async accountDeleted(userData) {
        try {
            const { name, email } = userData;
            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: "SentinelTrack Systems - Confirmación de eliminación de cuenta",
                html: `
                <div style="font-family: Roboto, sans-serif; background-color: #F2F4F8; color: #4B4B4B; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #D9E2EC; padding: 20px; border-radius: 12px;">
                    <div style="background-color: #1A2A6C; padding: 20px; text-align: center; border-radius: 8px;">
                        <h1 style="color: #FFFFFF;">SentinelTrack Systems</h1>
                    </div>
                    <h2 style="color: #F56565;">Tu cuenta ha sido eliminada</h2>
                    <p>Hola <strong>${name}</strong>, te confirmamos que tu cuenta asociada al correo <strong>${email}</strong> ha sido eliminada de nuestro sistema.</p>
                    <p>Esto significa que ya no tendrás acceso al rastreo de mascotas, vehículos, activos o personas con discapacidad vinculados a tu perfil.</p>
                    <p>Si en el futuro deseas regresar, siempre podrás registrarte nuevamente.</p>
                    <div style="margin-top: 20px; text-align: center;">
                        <h3 style="color: #A3D9B1;">SentinelTrack Systems siempre estará aquí para proteger lo que más valoras</h3>
                    </div>
                </div>
            `,
            };
            await this.transporter.sendMail(Opt);
            logger.info("Correo de eliminación de cuenta enviado exitosamente a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de eliminación de cuenta:", error);
        }
    }

    async roleChangedToAdmin(userData) {
        try {
            const { name, email } = userData;
            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: "SentinelTrack Systems - Tu rol ha sido actualizado a Administrador",
                html: `
                <div style="font-family: Roboto, sans-serif; background-color: #F2F4F8; color: #4B4B4B; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #D9E2EC; padding: 20px; border-radius: 12px;">
                    <div style="background-color: #1A2A6C; padding: 20px; text-align: center;">
                        <h1 style="color: #FFFFFF;">SentinelTrack Systems</h1>
                    </div>
                    <h2 style="color: #4F7CAC;">¡Felicitaciones, ${name}!</h2>
                    <p>Tu cuenta ha sido actualizada y ahora tienes el rol de <strong>Administrador</strong>.</p>
                    <p>Como administrador, tendrás acceso a funciones avanzadas de gestión de usuarios, dispositivos GPS y activos dentro de SentinelTrack Systems.</p>
                </div>
            `,
            };
            await this.transporter.sendMail(Opt);
            logger.info("Correo de cambio de rol a Admin enviado exitosamente a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de cambio de rol a Admin:", error);
        }
    }

    async SendEmailRecoveryPassword(email, token) {
        try {
            const Opt = {
                from: `"SentinelTrack Systems - Recuperación" <${configObject.mailer.mailer_user}>`,
                to: email,
                subject: "SentinelTrack Systems - Recuperar contraseña",
                html: `
                <div style="font-family: Roboto, sans-serif; background-color: #F2F4F8; padding: 20px;">
                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p>Has solicitado recuperar tu acceso a SentinelTrack Systems.</p>
                    <p>Tu código de recuperación es:</p>
                    <h1 style="color: #A3D9B1;">${token}</h1>
                    <p>Este código expira en 1 hora. Por favor, úsalo para restablecer tu contraseña.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${configObject.server.base_url}/change-password"
                            style="display: inline-block; background-color: #0D1936; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                            Recuperar contraseña
                        </a>
                    </div>
                </div>
            `,
            };
            const info = await this.transporter.sendMail(Opt);
            logger.info("Correo de recuperación enviado:", info.messageId);
        } catch (error) {
            logger.error("Error al enviar correo de recuperación:", error);
        }
    }

    async sendTicketCancelledEmail(userData, ticketData) {
        try {
            const { name, email } = userData;
            const { code, purchase_date, amount, products } = ticketData;

            const productsHTML = products.map(p => `
            <li><strong>${p.title}</strong> - Cantidad: ${p.quantity} - Precio: $${p.price}</li>
        `).join("");

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Ticket #${code} Cancelado`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#F56565;">Ticket Cancelado</h1>
                <p>Hola <strong>${name}</strong>, tu ticket ha sido cancelado. Aquí están los detalles:</p>
                <ul>
                    <li><strong>ID del Ticket:</strong> ${code}</li>
                    <li><strong>Fecha de compra:</strong> ${new Date(purchase_date).toLocaleString()}</li>
                    <li><strong>Monto total:</strong> $${amount}</li>
                </ul>
                <h3>Productos en el ticket:</h3>
                <ul>${productsHTML}</ul>
                <p>Si esta cancelación fue un error o necesitas asistencia, por favor <a href="${configObject.server.base_url}/contact">contáctanos</a>.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre estará aquí para proteger lo que más valoras</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de ticket cancelado enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de ticket cancelado:", error);
        }
    }

    async sendTicketInProcessEmail(userData, ticketData) {
        try {
            const { name, email } = userData;
            const { code, purchase_date, amount, products } = ticketData;

            const productsHTML = products.map(p => `
            <li><strong>${p.title}</strong> - Cantidad: ${p.quantity} - Precio: $${p.price}</li>
        `).join("");

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Ticket #${code} en proceso`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#4F7CAC;">Ticket en proceso</h1>
                <p>Hola <strong>${name}</strong>, tu ticket ha sido actualizado al estado <strong>En proceso</strong>. Aquí están los detalles:</p>
                <ul>
                    <li><strong>ID del Ticket:</strong> ${code}</li>
                    <li><strong>Fecha de compra:</strong> ${new Date(purchase_date).toLocaleString()}</li>
                    <li><strong>Total:</strong> $${amount}</li>
                </ul>
                <h3>Productos:</h3>
                <ul>${productsHTML}</ul>
                <p>Estamos preparando tu pedido y pronto estará listo para envío.</p>
                <h3 style="color:#A3D9B1;">Gracias por confiar en SentinelTrack Systems</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de ticket en proceso enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de ticket en proceso:", error);
        }
    }

    async sendPetCreatedEmail(userData, petData) {
        try {
            const { name, email } = userData;
            const { pet_name, species, breed, age, sex, photo } = petData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Mascota ${pet_name} registrada`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#4F7CAC;">¡Nueva mascota registrada!</h1>
                <p>Hola <strong>${name}</strong>, tu mascota ha sido registrada exitosamente en SentinelTrack Systems. Aquí están los detalles:</p>
                <ul>
                    <li><strong>Nombre:</strong> ${pet_name}</li>
                    <li><strong>Especie:</strong> ${species || "No especificada"}</li>
                    <li><strong>Raza:</strong> ${breed || "No especificada"}</li>
                    <li><strong>Edad:</strong> ${age || "No especificada"}</li>
                    <li><strong>Sexo:</strong> ${sex || "No especificado"}</li>
                </ul>
                ${photo ? `<div><img src="${photo}" alt="Foto de ${pet_name}" style="max-width:200px; border-radius:8px;" /></div>` : ""}
                <p>Ahora podrás vincular dispositivos GPS y gestionar toda la información de tu mascota desde la plataforma.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tu mascota</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de mascota registrada enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de mascota registrada:", error);
        }
    }

    async sendPetDeletedEmail(userData, petData) {
        try {
            const { name, email } = userData;
            const { pet_name, species, breed, age, sex } = petData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Mascota ${pet_name} eliminada`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#F56565;">Mascota eliminada</h1>
                <p>Hola <strong>${name}</strong>, te confirmamos que tu mascota <strong>${pet_name}</strong> ha sido eliminada de tu perfil en SentinelTrack Systems.</p>
                <ul>
                    <li><strong>Nombre:</strong> ${pet_name}</li>
                    <li><strong>Especie:</strong> ${species || "No especificada"}</li>
                    <li><strong>Raza:</strong> ${breed || "No especificada"}</li>
                    <li><strong>Edad:</strong> ${age || "No especificada"}</li>
                    <li><strong>Sexo:</strong> ${sex || "No especificado"}</li>
                </ul>
                <p>Si esta acción fue un error o necesitas asistencia, por favor <a href="${configObject.server.base_url}/contact">contáctanos</a>.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tu mascota</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de mascota eliminada enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de mascota eliminada:", error);
        }
    }

    async sendVehicleCreatedEmail(userData, vehicleData) {
        try {
            const { name, email } = userData;
            const { licensePlate, type, brand, model, color, photo } = vehicleData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Vehículo ${licensePlate} registrado`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#4F7CAC;">¡Nuevo vehículo registrado!</h1>
                <p>Hola <strong>${name}</strong>, tu vehículo ha sido registrado exitosamente en SentinelTrack Systems. Aquí están los detalles:</p>
                <ul>
                    <li><strong>Placa:</strong> ${licensePlate}</li>
                    <li><strong>Tipo:</strong> ${type || "No especificado"}</li>
                    <li><strong>Marca:</strong> ${brand || "No especificada"}</li>
                    <li><strong>Modelo:</strong> ${model || "No especificado"}</li>
                    <li><strong>Color:</strong> ${color || "No especificado"}</li>
                </ul>
                ${photo ? `<div><img src="${photo}" alt="Foto del vehículo" style="max-width:200px; border-radius:8px;" /></div>` : ""}
                <p>Ahora podrás vincular dispositivos GPS y gestionar toda la información de tu vehículo desde la plataforma.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tus vehículos</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de vehículo registrado enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de vehículo registrado:", error);
        }
    }

    async sendVehicleDeletedEmail(userData, vehicleData) {
        try {
            const { name, email } = userData;
            const { licensePlate, type, brand, model, color } = vehicleData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Vehículo ${licensePlate} eliminado`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#F56565;">Vehículo eliminado</h1>
                <p>Hola <strong>${name}</strong>, te confirmamos que tu vehículo <strong>${licensePlate}</strong> ha sido eliminado de tu perfil en SentinelTrack Systems.</p>
                <ul>
                    <li><strong>Placa:</strong> ${licensePlate}</li>
                    <li><strong>Tipo:</strong> ${type || "No especificado"}</li>
                    <li><strong>Marca:</strong> ${brand || "No especificada"}</li>
                    <li><strong>Modelo:</strong> ${model || "No especificado"}</li>
                    <li><strong>Color:</strong> ${color || "No especificado"}</li>
                </ul>
                <p>Si esta acción fue un error o necesitas asistencia, por favor <a href="${configObject.server.base_url}/contact">contáctanos</a>.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tus vehículos</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de vehículo eliminado enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de vehículo eliminado:", error);
        }
    }

    async sendDisabledPersonCreatedEmail(userData, disabledPersonData) {
        try {
            const { name, email } = userData;
            const { name: personName, age, disabilityType, photo } = disabledPersonData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Persona con discapacidad ${personName} registrada`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#4F7CAC;">¡Nueva persona con discapacidad registrada!</h1>
                <p>Hola <strong>${name}</strong>, has registrado exitosamente a una persona con discapacidad en SentinelTrack Systems. Aquí están los detalles:</p>
                <ul>
                    <li><strong>Nombre:</strong> ${personName}</li>
                    <li><strong>Edad:</strong> ${age || "No especificada"}</li>
                    <li><strong>Tipo de discapacidad:</strong> ${disabilityType || "No especificado"}</li>
                </ul>
                ${photo ? `<div><img src="${photo}" alt="Foto de ${personName}" style="max-width:200px; border-radius:8px;" /></div>` : ""}
                <p>Ahora podrás vincular dispositivos GPS y gestionar toda la información desde la plataforma.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tus seres queridos</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de persona con discapacidad registrada enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de persona con discapacidad registrada:", error);
        }
    }

    async sendDisabledPersonDeletedEmail(userData, disabledPersonData) {
        try {
            const { name, email } = userData;
            const { name: personName, age, disabilityType } = disabledPersonData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Persona con discapacidad ${personName} eliminada`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h1 style="color:#F56565;">Persona con discapacidad eliminada</h1>
                <p>Hola <strong>${name}</strong>, te confirmamos que la persona con discapacidad <strong>${personName}</strong> ha sido eliminada de tu perfil en SentinelTrack Systems.</p>
                <ul>
                    <li><strong>Nombre:</strong> ${personName}</li>
                    <li><strong>Edad:</strong> ${age || "No especificada"}</li>
                    <li><strong>Tipo de discapacidad:</strong> ${disabilityType || "No especificado"}</li>
                </ul>
                <p>Si esta acción fue un error o necesitas asistencia, por favor <a href="${configObject.server.base_url}/contact">contáctanos</a>.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo y tus seres queridos</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de persona con discapacidad eliminada enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de persona con discapacidad eliminada:", error);
        }
    }


    async sendPurchaseTicket(ticketData) {
        try {
            const { email, name, ticket_id, purchase_date, products, total, payment_method, shipping_address, shipping_city } = ticketData;

            const productsHTML = products.map(p => `
            <li><strong>${p.title}</strong> - Cantidad: ${p.quantity} - Precio: $${p.price}</li>
        `).join("");

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Ticket de compra #${ticket_id}`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h2>¡Gracias por tu compra, ${name}!</h2>
                <p>Detalles de tu ticket:</p>
                <ul>
                    <li>ID del Ticket: ${ticket_id}</li>
                    <li>Fecha de compra: ${purchase_date}</li>
                    <li>Método de pago: ${payment_method}</li>
                    <li>Dirección de envío: ${shipping_address}, ${shipping_city}</li>
                </ul>
                <h3>Productos adquiridos:</h3>
                <ul>${productsHTML}</ul>
                <h2>Total: $${total}</h2>
                <p>Tu pedido será procesado y enviado lo antes posible.</p>
                <h3 style="color:#A3D9B1;">¡Gracias por confiar en SentinelTrack Systems!</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de ticket de compra enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de ticket de compra:", error);
        }
    }

    async sendTicketPaidEmail(userData, ticketData) {
        try {
            const { name, email } = userData;
            const { code, purchase_date, amount, products } = ticketData;

            const productsHTML = products.map(p => `
            <li><strong>${p.title}</strong> - Cantidad: ${p.quantity} - Precio: $${p.price}</li>
        `).join("");

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Ticket #${code} Pagado`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h2>¡Pago confirmado, ${name}!</h2>
                <p>Tu ticket ha sido marcado como <strong>Pagado</strong>. Aquí están los detalles:</p>
                <ul>
                    <li>ID del Ticket: ${code}</li>
                    <li>Fecha de compra: ${new Date(purchase_date).toLocaleString()}</li>
                    <li>Total pagado: $${amount}</li>
                </ul>
                <h3>Productos:</h3>
                <ul>${productsHTML}</ul>
                <h3 style="color:#A3D9B1;">¡Gracias por tu compra en SentinelTrack Systems!</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de ticket pagado enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de ticket pagado:", error);
        }
    }

    async sendProductReviewEmail(userData, productData, reviewData) {
        try {
            const { name, email } = userData;
            const { title } = productData;
            const { comment, rating } = reviewData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: `SentinelTrack Systems - Nuevo comentario en ${title}`,
                html: `
            <div style="font-family: Roboto, sans-serif; background-color:#F2F4F8; padding:20px;">
                <h2>¡Nuevo comentario en tu producto!</h2>
                <p>Hola <strong>${name}</strong>, tu producto <strong>${title}</strong> ha recibido una nueva reseña:</p>
                <ul>
                    <li><strong>Comentario:</strong> ${comment}</li>
                    <li><strong>Calificación:</strong> ⭐ ${rating}/5</li>
                </ul>
                <p>Recuerda que las reseñas ayudan a otros usuarios a confiar en tus productos.</p>
                <h3 style="color:#A3D9B1;">SentinelTrack Systems siempre contigo</h3>
            </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de nueva reseña enviado a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de nueva reseña:", error);
        }
    }
}

module.exports = new MailerController();
