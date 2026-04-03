import random

respuestas_por_tono = {
    "cordial": [
        "¡Qué alegría saludarte! ¿Cómo puedo ayudarte hoy?",
        "¡Muy buenas! ¿Tienes algo en mente que quieras resolver?",
        "¡Encantado de verte por aquí! ¿Qué necesitas?"
    ],
    "buena_onda": [
        "¡Hey, qué buena vibra! ¿Qué tal todo?",
        "¡Hola crack! Dime, ¿qué se te ocurre hoy?",
        "¡Qué onda! Aquí estoy para lo que necesites."
    ],
    "empatico": [
        "¡Aquí estoy contigo! Cuéntame qué pasa y lo vemos juntos.",
        "¡Hola! No te preocupes, vamos a resolverlo paso a paso.",
        "¡Te escucho! Dime qué necesitas y lo solucionamos."
    ],
    "neutro": [
        "¡Hola! ¿Qué estás buscando?",
        "¡Bienvenido! ¿Quieres que te dé una mano?",
        "¡Saludos! Dime qué necesitas y te ayudo."
    ]
}

def clasificar_tono(saludo):
    saludo = saludo.lower()
    if saludo in ["buen día", "buenas tardes", "buenas noches"]:
        return "cordial"
    elif saludo in ["hola amigo", "hey", "hola"]:
        return "buena_onda"
    elif saludo in ["hay alguien ahí?", "hola, necesito ayuda"]:
        return "empatico"
    else:
        return "neutro"

def responder_saludo(saludo_usuario):
    tono = clasificar_tono(saludo_usuario)
    return random.choice(respuestas_por_tono[tono])
