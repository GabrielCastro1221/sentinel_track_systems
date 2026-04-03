import random

class ResponseService:

    @staticmethod
    def format_response(message: str, tone: str = "neutral", status: str = "ok"):
        """
        Devuelve un diccionario con la respuesta, el tono y el estado.
        """
        return {
            "response": message,
            "tone": tone,
            "status": status
        }

    @staticmethod
    def not_understood():
        """
        Respuesta cuando el bot no logra interpretar el mensaje.
        """
        opciones = [
            "Lo siento, no logré entenderte 🤔. ¿Podrías decirlo de otra forma?",
            "Ups, no capté bien tu mensaje 😅. ¿Me lo repites distinto?",
            "Hmm... parece que no entendí eso 📌. ¿Quieres intentarlo de nuevo?"
        ]
        return {
            "response": random.choice(opciones),
            "tone": "confused",
            "status": "error"
        }

    @staticmethod
    def greeting_response(custom_message: str, estilo: str = "cordial"):
        """
        Respuesta personalizada para saludos, con estilo opcional.
        """
        return {
            "response": custom_message,
            "tone": estilo,
            "status": "ok"
        }
