import sys
import os
import click
from dotenv import load_dotenv

sys.path.append(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

@click.group()
def cli():
    """CLI para ejecutar microservicios IA en distintos entornos"""
    pass


def run_app(env_file, mode, port, debug):
    os.environ["APP_MODE"] = mode
    load_dotenv(env_file)
    from app import app

    app.run(
        debug=debug,
        host="0.0.0.0",
        port=port
    )

@cli.command()
@click.option("--port", default=8080, help="Puerto del servidor")
def dev(port):
    """Ejecuta en modo desarrollo"""
    run_app(".env.dev", "dev", port, True)

@cli.command()
@click.option("--port", default=8080, help="Puerto del servidor")
def build(port):
    """Ejecuta en modo producción"""
    run_app(".env.build", "build", port, False)

if __name__ == "__main__":
    cli()