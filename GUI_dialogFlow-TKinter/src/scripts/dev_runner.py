import subprocess
import sys
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class RestartHandler(FileSystemEventHandler):
    def __init__(self, command):
        self.command = command
        self.process = subprocess.Popen(self.command)

    def restart(self):
        print("Changes detected, restarting server...")
        self.process.terminate()
        self.process = subprocess.Popen(self.command)

    def on_modified(self, event):
        if event.src_path.endswith((".py", ".env", ".json")):
            self.restart()

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: python src/scripts/dev_runner.py [dev|build] [--port 3000]")
        sys.exit(1)

    mode = sys.argv[1]
    extra_args = sys.argv[2:]
    cli_path = os.path.join(os.path.dirname(__file__), "cli.py")
    command = ["python", cli_path, mode] + extra_args

    print("Starting runner in mode:", mode)
    print("Command:", " ".join(command))

    handler = RestartHandler(command)
    observer = Observer()
    observer.schedule(handler, "./src", recursive=True)
    observer.schedule(handler, ".", recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("Stopping runner...")
        observer.stop()

    observer.join()