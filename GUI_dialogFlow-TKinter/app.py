from src.scripts.db_init import init_mongo

def init_app():
    print("[Init] Initializing services...")
    init_mongo()