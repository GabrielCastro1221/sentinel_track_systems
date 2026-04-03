def run_server(app, debug=True, port=8080):

    print("[Server] Starting SentinelTrack AI microservice...")
    print(f"[Server] Mode: {'DEV' if debug else 'BUILD'}")
    print(f"[Server] Port: {port}")

    app.run(
        debug=debug,
        host="0.0.0.0",
        port=port
    )