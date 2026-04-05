import tkinter as tk

COLORS = {
    "white": "#ffffff",
    "cyan": "#00e5ff",
    "green": "#00ff88",
    "bg_main": "#0a0a0a",
    "bg_secondary": "#1a1a1a"
}

def create_form_fields(parent, entries):
    """
    Crea dinámicamente todos los campos del formulario en `parent`.
    Guarda referencias de los Entry en el diccionario `entries`.
    """

    def section(title):
        """Crea un título de sección"""
        tk.Label(
            parent,
            text=title,
            fg=COLORS["green"],
            bg=COLORS["bg_secondary"],
            font=("Segoe UI", 10, "bold")
        ).pack(pady=(15, 5), anchor="w")

    def create_field(key, label_text, default=""):
        """Crea un label + entry y guarda en entries[key]"""
        tk.Label(
            parent,
            text=label_text,
            fg=COLORS["cyan"],
            bg=COLORS["bg_secondary"],
            font=("Segoe UI", 9, "bold")
        ).pack(pady=2, anchor="w")

        ent = tk.Entry(
            parent,
            bg=COLORS["bg_main"],
            fg=COLORS["white"],
            insertbackground=COLORS["cyan"],
            relief="flat",
            width=25
        )
        ent.insert(0, default)
        ent.pack(pady=2, fill=tk.X)
        entries[key] = ent

    section("Básico")
    create_field("name", "Nombre")
    create_field("desc", "Descripción")
    create_field("phrases", "Training Phrases")
    create_field("responses", "Responses")

    section("Contexto")
    create_field("area", "Área", "general")
    create_field("company", "Company", "sentinel_track_systems")
    create_field("module", "Module")

    section("Configuración")
    create_field("tags", "Tags")
    create_field("language", "Language", "es")
    create_field("priority", "Priority", "1")
    create_field("status", "Status", "active")

    section("Metadata")
    create_field("source", "Source", "gui")
    create_field("notes", "Notes")