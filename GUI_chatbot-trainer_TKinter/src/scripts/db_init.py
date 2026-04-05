from src.config.connection import MongoConnection

def init_mongo():
    print("[MongoDB] Initializing connection...")

    try:
        MongoConnection().get_db()
        print("[MongoDB] Connection initialized")

    except Exception as e:
        print("[MongoDB] Connection failed")
        raise RuntimeError(e)