import tkinter as tk
from tkinter import ttk
from styles.styles import Colors


def build_center_table(root):
    center = tk.Frame(root, bg=Colors.BG)
    center.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    table_frame = tk.Frame(center, bg=Colors.BG)
    table_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

    tree = ttk.Treeview(table_frame, show="tree")

    vsb = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=vsb.set)

    tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    vsb.pack(side=tk.RIGHT, fill=tk.Y)

    return tree
