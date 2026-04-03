import tkinter as tk
from tkinter import messagebox
import threading
from functools import partial
from .components.sidebar import build_left_sidebar, build_right_sidebar
from .components.center_table import build_center_table
from src.services.api_client import get_intents, create_intent, delete_intent

COLORS = {
    "white": "#ffffff",
    "cyan": "#00e5ff",
    "green": "#00ff88",
    "red": "#ff3c3c",
    "bg_main": "#0a0a0a",
    "bg_secondary": "#1a1a1a"
}

class VectorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Vector AI • Sentinel Track")
        self.root.state("zoomed")
        self.root.configure(bg=COLORS["bg_main"])

        self.entries = {}
        self.setup_styles()
        self.build_ui()
        self.load_intents()

    def setup_styles(self):
        from tkinter import ttk
        style = ttk.Style()
        style.theme_use("default")

        style.configure(
            "Treeview",
            background=COLORS["bg_secondary"],
            foreground=COLORS["white"],
            rowheight=32,
            fieldbackground=COLORS["bg_secondary"]
        )

        style.configure(
            "Treeview.Heading",
            background=COLORS["bg_main"],
            foreground=COLORS["cyan"],
            font=("Segoe UI", 10, "bold")
        )

    def build_ui(self):
        build_left_sidebar(self.root)
        self.tree = build_center_table(self.root)
        build_right_sidebar(
            self.root,
            self.entries,
            partial(self.create_intent),
            partial(self.delete_intent)
        )

    def load_intents(self):
        def task():
            try:
                data = get_intents()
                self.tree.delete(*self.tree.get_children())
                for intent_id, intent in data.get("data", {}).items():
                    self.tree.insert("", "end", values=(intent_id, intent.get("name")))
            except Exception as e:
                messagebox.showerror("Error", str(e))

        threading.Thread(target=task, daemon=True).start()

    def create_intent(self):
        payload = {
            "name": self.entries["name"].get(),
            "description": self.entries["desc"].get(),
            "trainingPhrases": self.entries["phrases"].get().split(","),
            "responses": self.entries["responses"].get().split(","),
            "area": self.entries.get("area", tk.StringVar()).get(),
            "company": self.entries.get("company", tk.StringVar()).get(),
            "module": self.entries.get("module", tk.StringVar()).get(),
            "tags": self.entries.get("tags", tk.StringVar()).get(),
            "language": self.entries.get("language", tk.StringVar()).get(),
            "priority": self.entries.get("priority", tk.StringVar()).get(),
            "status": self.entries.get("status", tk.StringVar()).get(),
            "source": self.entries.get("source", tk.StringVar()).get(),
            "notes": self.entries.get("notes", tk.StringVar()).get()
        }

        def task():
            try:
                create_intent(payload)
                messagebox.showinfo("OK", "Intent creado")
                self.load_intents()
            except Exception as e:
                messagebox.showerror("Error", str(e))

        threading.Thread(target=task, daemon=True).start()

    def delete_intent(self):
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Warning", "Selecciona un intent")
            return

        intent_id = self.tree.item(selected[0])["values"][0]

        def task():
            try:
                delete_intent(intent_id)
                messagebox.showinfo("OK", "Intent eliminado")
                self.load_intents()
            except Exception as e:
                messagebox.showerror("Error", str(e))

        threading.Thread(target=task, daemon=True).start()

if __name__ == "__main__":
    root = tk.Tk()
    app = VectorApp(root)
    root.mainloop()