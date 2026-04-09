import tkinter as tk
from styles.styles import Colors


def build_create_title(root):
    tk.Label(
        root,
        text="Editar Intent",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 26, "bold"),
    ).pack(pady=20)