import tkinter as tk
from tkinter import ttk

from components.index.sidebar import build_left_sidebar
from components.index.center_table import build_center_container

from components.index.form_create import build_create_intent
from components.index.view_intents import build_view_intents
from components.index.chatbot import build_chatbot

from styles.styles import Colors


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

    def build_ui(self):
        build_left_sidebar(
            self.root,
            create_intent_cb=self.show_create,
            view_intents_cb=self.show_view,
            chatbot_cb=self.show_chatbot,
        )

        self.center = build_center_container(self.root)
        self.show_create()

    def clear_center(self):
        for widget in self.center.winfo_children():
            widget.destroy()

    def show_create(self):
        self.clear_center()
        build_create_intent(self.center)

    def show_view(self):
        self.clear_center()
        build_view_intents(self.center)

    def show_chatbot(self):
        self.clear_center()
        build_chatbot(self.center)


if __name__ == "__main__":
    root = tk.Tk()
    app = VectorApp(root)
    root.mainloop()
