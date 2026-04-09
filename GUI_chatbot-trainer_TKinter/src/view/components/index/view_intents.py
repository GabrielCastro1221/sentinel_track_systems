import tkinter as tk
from styles.styles import Colors


def build_view_intents(root, intents=None, on_delete=None, on_view=None, on_edit=None):
    container = tk.Frame(root, bg=Colors.BG)
    container.pack(fill=tk.BOTH, expand=True)

    tk.Label(
        container,
        text="Lista de Intents",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 22, "bold"),
    ).pack(pady=10)

    canvas = tk.Canvas(container, bg=Colors.BG, highlightthickness=0)
    scrollbar = tk.Scrollbar(container, orient="vertical", command=canvas.yview)

    scroll_frame = tk.Frame(canvas, bg=Colors.BG)

    scroll_frame.bind(
        "<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def _on_mousewheel(event):
        if event.num == 5 or event.delta < 0:
            canvas.yview_scroll(1, "units")
        elif event.num == 4 or event.delta > 0:
            canvas.yview_scroll(-1, "units")

    canvas.bind_all("<MouseWheel>", _on_mousewheel)
    canvas.bind_all("<Button-4>", _on_mousewheel)
    canvas.bind_all("<Button-5>", _on_mousewheel)

    if intents is None:
        intents = [
            {
                "name": f"Intent {i}",
                "description": "Descripción de ejemplo del intent",
                "tags": ["tag1", "tag2"],
                "status": "active",
                "language": "es",
                "priority": i,
            }
            for i in range(1, 13)
        ]

    for idx, intent in enumerate(intents):
        row = idx // 4
        col = idx % 4

        card = tk.Frame(
            scroll_frame,
            bg=Colors.CARD,
            highlightthickness=1,
            highlightbackground=Colors.INPUT_BG,
            width=250,
            height=180,
        )
        card.grid(row=row, column=col, padx=10, pady=10, sticky="n")

        header = tk.Frame(card, bg=Colors.CARD)
        header.pack(fill=tk.X, padx=10, pady=5)

        tk.Label(
            header,
            text=intent["name"],
            bg=Colors.CARD,
            fg=Colors.TEXT,
            font=("Roboto", 12, "bold"),
        ).pack(side=tk.LEFT)

        tk.Label(
            header,
            text=intent["status"].upper(),
            bg=Colors.CL3 if intent["status"] == "active" else Colors.INPUT_BG,
            fg="#000",
            font=("Roboto", 8, "bold"),
            padx=8,
            pady=2,
        ).pack(side=tk.RIGHT)

        tk.Label(
            card,
            text=intent.get("description", ""),
            bg=Colors.CARD,
            fg=Colors.TEXT,
            wraplength=200,
            justify="left",
        ).pack(fill=tk.X, padx=10, pady=5)

        info = tk.Frame(card, bg=Colors.CARD)
        info.pack(fill=tk.X, padx=10, pady=5)

        tk.Label(
            info,
            text=f"Tags: {', '.join(intent.get('tags', []))}",
            bg=Colors.CARD,
            fg=Colors.TEXT,
            font=("Roboto", 9),
        ).pack(anchor="w")

        tk.Label(
            info,
            text=f"Idioma: {intent.get('language')} | Prioridad: {intent.get('priority')}",
            bg=Colors.CARD,
            fg=Colors.TEXT,
            font=("Roboto", 9),
        ).pack(anchor="w")

        actions = tk.Frame(card, bg=Colors.CARD)
        actions.pack(fill=tk.X, padx=10, pady=10)

        tk.Button(
            actions,
            text="Ver",
            bg=Colors.INPUT_BG,
            fg=Colors.TEXT,
            relief="flat",
            cursor="hand2",
            command=lambda i=intent: on_view(i) if on_view else print("Ver", i),
        ).pack(side=tk.LEFT, padx=5)

        tk.Button(
            actions,
            text="Editar",
            bg="#ffaa00",
            fg="#000",
            relief="flat",
            cursor="hand2",
            command=lambda i=intent: on_edit(i) if on_edit else print("Editar", i),
        ).pack(side=tk.LEFT, padx=5)

        tk.Button(
            actions,
            text="Eliminar",
            bg="#ff4d4d",
            fg="#fff",
            relief="flat",
            cursor="hand2",
            command=lambda i=intent: (
                on_delete(i) if on_delete else print("Eliminar", i)
            ),
        ).pack(side=tk.LEFT, padx=5)
