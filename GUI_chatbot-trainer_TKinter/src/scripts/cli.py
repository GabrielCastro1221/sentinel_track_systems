import sys
import os
import click
import uvicorn

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(ROOT_DIR)

@click.group()
def cli():
    pass

def run_app(mode, port, reload):
    print("RUN APP", mode)
    os.environ["APP_MODE"] = mode

    from src.config.enviroment import config
    print("CONFIG LOADED")

    base_url = config["server"]["base_url"]
    env_port = int(config["server"]["port"])
    final_port = port if port is not None else env_port

    print("HOST:", base_url)
    print("PORT:", final_port)

    uvicorn.run(
        "src.scripts.server_run:app",
        host=base_url,
        port=final_port,
        reload=reload,
        reload_dirs=["src"],
        log_level="debug"
    )

@cli.command()
@click.option("--port", default=None, type=int)
def dev(port):
    run_app("dev", port, True)

@cli.command()
@click.option("--port", default=None, type=int)
def build(port):
    run_app("build", port, False)

if __name__ == "__main__":
    cli()