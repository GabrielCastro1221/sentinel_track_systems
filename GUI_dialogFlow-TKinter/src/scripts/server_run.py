from fastapi import FastAPI
from src.routes.intents import router
from src.scripts.db_init import init_mongo

app = FastAPI(
    title="Chatbot Intents API",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    print("[App] Initializing services...")
    try:
        init_mongo()
        print("[App] MongoDB initialized successfully")
    except Exception as e:
        print("[App] MongoDB initialization failed")
        raise e

app.include_router(router)

def run_server(debug: bool = True, port: int = 8080):
    import uvicorn

    print("[Server] Starting SentinelTrack AI microservice...")
    print(f"[Server] Mode: {'DEV' if debug else 'BUILD'}")
    print(f"[Server] Port: {port}")

    uvicorn.run(
        "src.server:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="debug"
    )