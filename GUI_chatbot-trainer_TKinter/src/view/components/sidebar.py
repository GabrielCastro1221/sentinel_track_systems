import tkinter as tk
from functools import partial
from .form_fields import create_form_fields

COLORS = {
    "white": "#ffffff",
    "cyan": "#00e5ff",
    "green": "#00ff88",
    "red": "#ff3c3c",
    "bg_main": "#0a0a0a",
    "bg_secondary": "#1a1a1a"
}

def build_left_sidebar(root):
    """Crea el sidebar izquierdo estático"""
    left_sidebar = tk.Frame(root, bg=COLORS["bg_secondary"], width=220)
    left_sidebar.pack(side=tk.LEFT, fill=tk.Y)

    tk.Label(
        left_sidebar,
        text="VECTOR",
        fg=COLORS["cyan"],
        bg=COLORS["bg_secondary"],
        font=("Segoe UI", 22, "bold")
    ).pack(pady=30)

    tk.Label(
        left_sidebar,
        text="Sentinel Track AI",
        fg=COLORS["white"],
        bg=COLORS["bg_secondary"]
    ).pack()


def build_right_sidebar(root, entries, create_cb, delete_cb):
    """
    Construye el sidebar derecho con scroll, formulario y botones.
    - entries: diccionario donde se guardarán los Entry widgets
    - create_cb, delete_cb: callbacks para los botones
    """
    right_sidebar = tk.Frame(root, bg=COLORS["bg_secondary"], width=240)
    right_sidebar.pack(side=tk.RIGHT, fill=tk.Y)
    right_sidebar.pack_propagate(False)

    canvas = tk.Canvas(right_sidebar, bg=COLORS["bg_secondary"], highlightthickness=0)
    scrollbar = tk.Scrollbar(right_sidebar, orient="vertical", command=canvas.yview)

    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    canvas.configure(yscrollcommand=scrollbar.set)

    scroll_frame = tk.Frame(canvas, bg=COLORS["bg_secondary"])
    canvas.create_window((0, 0), window=scroll_frame, anchor="nw", width=220)

    scroll_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    def _on_mousewheel(event):
        canvas.yview_scroll(-int(event.delta / 120), "units")

    canvas.bind("<Enter>", lambda e: canvas.bind_all("<MouseWheel>", _on_mousewheel))
    canvas.bind("<Leave>", lambda e: canvas.unbind_all("<MouseWheel>"))

    create_form_fields(scroll_frame, entries)

    tk.Button(
        scroll_frame,
        text="Crear Intent",
        bg=COLORS["green"],
        fg="black",
        relief="flat",
        command=partial(create_cb, entries)
    ).pack(pady=10, fill=tk.X)

    tk.Button(
        scroll_frame,
        text="Eliminar Intent",
        bg=COLORS["red"],
        fg="white",
        relief="flat",
        command=partial(delete_cb, entries)
    ).pack(pady=5, fill=tk.X)