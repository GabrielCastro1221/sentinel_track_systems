import tkinter as tk
from tkinter import ttk

COLORS = {
    "white": "#ffffff",
    "cyan": "#00e5ff",
    "bg_main": "#0a0a0a",
    "bg_secondary": "#1a1a1a"
}

def build_center_table(root):
    """
    Construye el frame central con la tabla de intents.
    Retorna el Treeview para que pueda ser usado en la app principal.
    """
    center = tk.Frame(root, bg=COLORS["bg_main"])
    center.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    tk.Label(
        center,
        text="Intent Manager",
        fg=COLORS["white"],
        bg=COLORS["bg_main"],
        font=("Segoe UI", 18, "bold")
    ).pack(anchor="w", padx=20, pady=10)

    table_frame = tk.Frame(center, bg=COLORS["bg_main"])
    table_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

    tree = ttk.Treeview(
        table_frame,
        columns=("ID", "Name"),
        show="headings"
    )

    tree.heading("ID", text="ID")
    tree.heading("Name", text="Intent")

    vsb = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=vsb.set)

    tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    vsb.pack(side=tk.RIGHT, fill=tk.Y)

    return tree