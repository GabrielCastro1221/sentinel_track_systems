import tkinter as tk
from styles.styles import Colors

def add_hover_effect(widget, bg_normal, bg_hover):
    """Agrega efecto hover a un botón."""
    widget.bind("<Enter>", lambda e: widget.config(bg=bg_hover))
    widget.bind("<Leave>", lambda e: widget.config(bg=bg_normal))

def build_left_sidebar(root, create_intent_cb=None, view_intents_cb=None, chatbot_cb=None, exit_cb=None):
    left_sidebar = tk.Frame(root, bg=Colors.BG, width=220)
    left_sidebar.pack(side=tk.LEFT, fill=tk.Y)

    # Contenedor superior
    top_frame = tk.Frame(left_sidebar, bg=Colors.BG)
    top_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

    tk.Label(
        top_frame,
        text="SentinelTrack Systems",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 22, "bold"),
    ).pack(pady=10)

    tk.Label(
        top_frame,
        text="Vector ChatBot - Trainer",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 12, "bold"),
    ).pack(pady=(0, 20))

    # Botón Crear Intent
    btn_create = tk.Button(
        top_frame,
        text="Crear Intent",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 11, "bold"),
        command=create_intent_cb,
        cursor="hand2"
    )
    btn_create.pack(pady=5, fill=tk.X, padx=10)
    add_hover_effect(btn_create, Colors.BG, Colors.INPUT_BG)

    # Botón Ver Intents
    btn_view = tk.Button(
        top_frame,
        text="Ver Intents",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 11, "bold"),
        command=view_intents_cb,
        cursor="hand2"
    )
    btn_view.pack(pady=10, fill=tk.X, padx=10)
    add_hover_effect(btn_view, Colors.BG, Colors.INPUT_BG)

    # Botón ChatBot
    btn_chatbot = tk.Button(
        top_frame,
        text="ChatBot",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 11, "bold"),
        command=chatbot_cb,
        cursor="hand2"
    )
    btn_chatbot.pack(pady=5, fill=tk.X, padx=10)
    add_hover_effect(btn_chatbot, Colors.BG, Colors.INPUT_BG)

    # Contenedor inferior (botón salir)
    bottom_frame = tk.Frame(left_sidebar, bg=Colors.BG)
    bottom_frame.pack(side=tk.BOTTOM, fill=tk.X)

    btn_exit = tk.Button(
        bottom_frame,
        text="Salir",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 11, "bold"),
        command=exit_cb if exit_cb else root.quit,
        cursor="hand2"
    )
    btn_exit.pack(pady=10, fill=tk.X, padx=10)
    add_hover_effect(btn_exit, Colors.BG, Colors.INPUT_BG)


def build_right_sidebar(root, entries, create_cb, delete_cb):
    right_sidebar = tk.Frame(root, bg=Colors.BG, width=240)
    right_sidebar.pack(side=tk.RIGHT, fill=tk.Y)
    right_sidebar.pack_propagate(False)

    canvas = tk.Canvas(right_sidebar, bg=Colors.BG, highlightthickness=0)
    scrollbar = tk.Scrollbar(right_sidebar, orient="vertical", command=canvas.yview)

    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    canvas.configure(yscrollcommand=scrollbar.set)

    scroll_frame = tk.Frame(canvas, bg=Colors.BG)
    canvas.create_window((0, 0), window=scroll_frame, anchor="nw", width=220)

    scroll_frame.bind(
        "<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    def _on_mousewheel(event):
        canvas.yview_scroll(-int(event.delta / 120), "units")

    canvas.bind("<Enter>", lambda e: canvas.bind_all("<MouseWheel>", _on_mousewheel))
    canvas.bind("<Leave>", lambda e: canvas.unbind_all("<MouseWheel>"))
