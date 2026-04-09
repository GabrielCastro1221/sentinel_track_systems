import tkinter as tk
from styles.styles import Colors


def build_center_container(root):
    center = tk.Frame(root, bg=Colors.BG)
    center.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    return center