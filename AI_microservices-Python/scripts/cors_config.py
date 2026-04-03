from flask_cors import CORS
from config.enviroment import config

def init_cors(app):
    """Inicializa CORS en la aplicación Flask"""

    allowed_origins = config["cors"]["origins"]

    print("CORS origins:", allowed_origins)

    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/chatbot/*": {
                "origins": allowed_origins
            }
        }
    )