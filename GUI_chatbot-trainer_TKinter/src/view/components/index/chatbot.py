import tkinter as tk
from styles.styles import Colors


def build_chatbot(root):
    container = tk.Frame(root, bg=Colors.BG)
    container.pack(fill=tk.BOTH, expand=True)

    tk.Label(
        container,
        text="ChatBot",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 20, "bold"),
    ).pack(pady=10)

    chat_frame = tk.Frame(container, bg=Colors.BG)
    chat_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

    canvas = tk.Canvas(chat_frame, bg=Colors.BG, highlightthickness=0)
    scrollbar = tk.Scrollbar(chat_frame, orient="vertical", command=canvas.yview)

    scrollable_frame = tk.Frame(canvas, bg=Colors.BG)

    scrollable_frame.bind(
        "<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    input_frame = tk.Frame(container, bg=Colors.BG)
    input_frame.pack(fill=tk.X, padx=20, pady=10)

    entry = tk.Entry(
        input_frame,
        bg=Colors.INPUT_BG,
        fg="grey",  # 👈 color placeholder
        insertbackground=Colors.TEXT,
        relief="flat",
        font=("Roboto", 11),
    )
    entry.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=8, padx=(0, 20))

    # 🔥 Placeholder
    placeholder = "Escribir mensaje aquí..."
    entry.insert(0, placeholder)

    def on_focus_in(event):
        if entry.get() == placeholder:
            entry.delete(0, tk.END)
            entry.config(fg=Colors.TEXT)

    def on_focus_out(event):
        if not entry.get():
            entry.insert(0, placeholder)
            entry.config(fg="grey")

    entry.bind("<FocusIn>", on_focus_in)
    entry.bind("<FocusOut>", on_focus_out)

    send_btn = tk.Button(
        input_frame,
        text="Enviar",
        bg=Colors.CL3,
        fg="#000",
        font=("Roboto", 10, "bold"),
        cursor="hand2",
        relief="flat",
    )
    send_btn.pack(side=tk.RIGHT)

    def add_message(text, sender="user"):
        bubble_frame = tk.Frame(scrollable_frame, bg=Colors.BG)
        bubble_frame.pack(fill=tk.X, pady=5)

        if sender == "user":
            bg_color = Colors.CL3
            fg_color = "#000"
            anchor = "e"
            padx = (80, 10)
        else:
            bg_color = Colors.INPUT_BG
            fg_color = Colors.TEXT
            anchor = "w"
            padx = (10, 80)

        msg = tk.Label(
            bubble_frame,
            text=text,
            bg=bg_color,
            fg=fg_color,
            wraplength=800,
            justify="left",
            font=("Roboto", 10),
            padx=12,
            pady=8,
        )
        msg.pack(fill=tk.X, anchor=anchor, padx=padx)

        canvas.update_idletasks()
        canvas.yview_moveto(1.0)

    def send_message():
        text = entry.get().strip()
        if not text or text == placeholder:
            return

        add_message(text, "user")
        entry.delete(0, tk.END)
        entry.insert(0, placeholder)
        entry.config(fg="grey")

        root.after(500, lambda: add_message(f"Echo: {text}", "bot"))

    send_btn.config(command=send_message)
    entry.bind("<Return>", lambda e: send_message())

    add_message("Hola soy Vector tu asistente inteligente, ¿en qué te ayudo?", "bot")
