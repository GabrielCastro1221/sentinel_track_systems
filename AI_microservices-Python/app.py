from flask import Flask
from routes.chat_routes import chatbot_bp
from scripts.cors_config import init_cors
from scripts.db_init import init_mongo

def create_app():
    app = Flask(__name__)
    init_cors(app)
    app.register_blueprint(chatbot_bp)
    init_mongo()
    return app

app = create_app()