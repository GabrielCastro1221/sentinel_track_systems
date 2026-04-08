import tkinter as tk
from tkinter import ttk
from components.index.sidebar import build_left_sidebar
from components.index.center_table import build_center_table
from styles.styles import Colors, Button


class VectorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Vector AI Chatbot • SentinelTrack Systems")
        self.root.state("zoomed")
        self.root.configure(bg=Colors.BG)

        self.setup_styles()
        self.build_ui()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("default")

        style.configure(
            "Treeview",
            background=Colors.CARD,
            foreground=Colors.TEXT,
            rowheight=32,
            fieldbackground=Colors.CARD,
        )

        style.configure(
            "Treeview.Heading",
            background=Colors.BG,
            foreground=Colors.ACCENT,
            font=("Roboto", 10, "bold"),
        )

        style.configure(
            "Accent.TButton",
            background=Button.BG,
            foreground=Button.TEXT,
            font=("Roboto", 10, "bold"),
            padding=6,
        )
        style.map("Accent.TButton", background=[("active", Button.HOVER)])

    def build_ui(self):
        build_left_sidebar(self.root)
        self.tree = build_center_table(self.root)


if __name__ == "__main__":
    root = tk.Tk()
    app = VectorApp(root)
    root.mainloop()
