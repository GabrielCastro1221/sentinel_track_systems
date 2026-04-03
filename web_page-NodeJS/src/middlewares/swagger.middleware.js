const swaggerUiExpress = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "API SentinelTrack Systems – Documentación Oficial",
            description: "SentinelTrack Systems es una plataforma integral de rastreo IoT que combina dispositivos GPS, inteligencia artificial y arquitectura modular para ofrecer soluciones de monitoreo en tiempo real. La API permite gestionar usuarios, vehículos, activos, mascotas y personas con discapacidad, integrando hardware y software de manera escalable y confiable. Aquí encontrarás la documentación oficial de los endpoints, metodologías y casos de uso que facilitan la integración con SentinelTrack Systems, garantizando seguridad, trazabilidad y control en entornos dinámicos."
        }
    },
    apis: ["./src/docs/**/*.yml"]
};

module.exports = swaggerOptions;
