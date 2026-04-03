import os
from dotenv import load_dotenv

MODE = os.getenv("APP_MODE", "dev")
ENV_FILE = ".env.dev" if MODE == "dev" else ".env.build"

load_dotenv(ENV_FILE)

print("MODE:", MODE)
print("ENV:", ENV_FILE)

config = {
    "mode": MODE,
    "server": {
        "port": int(os.getenv("PORT", "5000")),
        "base_url": os.getenv("BASE_URL", "127.0.0.1"),
    },
    "mongo": {
        "url": os.getenv("MONGO_URL"),
    },
}