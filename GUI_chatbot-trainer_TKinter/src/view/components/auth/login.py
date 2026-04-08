import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import os

from styles.styles import Colors, Button
from services.auth import authenticate
from components.interfaces.chatbot_trainner import VectorApp


def create_login(root):

    def login():
        usuario = entry_usuario.get()
        password = entry_password.get()

        if usuario == "Usuario":
            usuario = ""
        if password == "Contraseña":
            password = ""

        success, message = authenticate(usuario, password)

        if success:
            root.destroy()
            trainer_root = tk.Tk()
            VectorApp(trainer_root)
            trainer_root.mainloop()
        else:
            messagebox.showerror("Error", message)

    def set_placeholder(entry, text, is_password=False):
        def on_focus_in(e):
            if entry.get() == text:
                entry.delete(0, tk.END)
                entry.config(fg=Colors.TEXT)
                if is_password:
                    entry.config(show="*")

        def on_focus_out(e):
            if entry.get() == "":
                entry.insert(0, text)
                entry.config(fg=Colors.PLACEHOLDER)
                if is_password:
                    entry.config(show="")

        entry.insert(0, text)
        entry.config(fg=Colors.PLACEHOLDER)

        entry.bind("<FocusIn>", on_focus_in)
        entry.bind("<FocusOut>", on_focus_out)

    container = tk.Frame(root, bg=Colors.BG)
    container.place(relx=0.5, rely=0.5, anchor="center")

    left = tk.Frame(container, bg=Colors.BG)
    left.grid(row=0, column=0, padx=(0, 25))

    base_dir = os.path.dirname(__file__)
    img_path = os.path.abspath(
        os.path.join(base_dir, "..", "..", "images", "icon-gps.png")
    )

    imagen = Image.open(img_path).resize((100, 100), Image.Resampling.LANCZOS)
    logo = ImageTk.PhotoImage(imagen)

    tk.Label(left, image=logo, bg=Colors.BG).pack()
    tk.Label(
        left,
        text="Vector Trainer",
        font=("Roboto", 14, "bold"),
        bg=Colors.BG,
        fg=Colors.ACCENT,
    ).pack(pady=(2, 0))

    left.image = logo

    card = tk.Frame(
        container,
        bg=Colors.CARD,
        padx=18,
        pady=18,
        highlightthickness=1,
        highlightbackground="#1f2937",
    )
    card.grid(row=0, column=1)

    tk.Label(
        card,
        text="Iniciar sesión",
        font=("Roboto", 14, "bold"),
        bg=Colors.CARD,
        fg=Colors.TEXT,
    ).pack(pady=(0, 10))

    entry_usuario = tk.Entry(
        card,
        width=22,
        bg=Colors.INPUT_BG,
        fg=Colors.TEXT,
        insertbackground=Colors.TEXT,
        relief="flat",
    )
    entry_usuario.pack(pady=4, ipady=5)
    set_placeholder(entry_usuario, "Usuario")

    entry_password = tk.Entry(
        card,
        width=22,
        bg=Colors.INPUT_BG,
        fg=Colors.TEXT,
        insertbackground=Colors.TEXT,
        relief="flat",
    )
    entry_password.pack(pady=4, ipady=5)
    set_placeholder(entry_password, "Contraseña", True)

    btn = tk.Label(
        card,
        text="Iniciar sesión",
        bg=Button.BG,
        fg=Button.TEXT,
        font=("Roboto", 10, "bold"),
        pady=6,
        cursor="hand2",
    )
    btn.pack(fill="x", pady=10)

    def on_enter(e):
        btn.config(bg=Button.HOVER)

    def on_leave(e):
        btn.config(bg=Button.BG)

    btn.bind("<Enter>", on_enter)
    btn.bind("<Leave>", on_leave)
    btn.bind("<Button-1>", lambda e: login())
