from dotenv import load_dotenv
import os

mode = os.getenv("APP_MODE", "build")

env_path = ".env.dev" if mode == "dev" else ".env.build"

load_dotenv(env_path)

cors_origins = os.getenv("CORS_ORIGINS", "")
cors_list = [o.strip() for o in cors_origins.split(",") if o.strip()]

config = {
    "server": {
        "port": int(os.getenv("PORT", 8080)),
        "base_url": os.getenv("BASE_URL", "http://127.0.0.1"),
    },
    "cors": {
        "origins": cors_list
    },
    "mongo_db": {
        "mongo_url": os.getenv("MONGO_URL"),
    },
    "mode": mode
}