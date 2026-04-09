import tkinter as tk
from tkinter import ttk
from styles.styles import Colors


def build_create_intent(root):
    container = tk.Frame(root, bg=Colors.BG)
    container.pack(fill=tk.BOTH, expand=True)

    tk.Label(
        container,
        text="Crear Intent",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 22, "bold"),
    ).pack(pady=10)

    form = tk.Frame(container, bg=Colors.BG)
    form.pack(fill=tk.BOTH, expand=True, padx=100, pady=10)

    canvas = tk.Canvas(form, bg=Colors.BG, highlightthickness=0)
    scrollbar = tk.Scrollbar(form, orient="vertical", command=canvas.yview)

    scroll_frame = tk.Frame(canvas, bg=Colors.BG)

    scroll_frame.bind(
        "<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((20, 0), window=scroll_frame, anchor="nw", width=600)

    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def _on_mousewheel(event):
        if event.num == 5 or event.delta < 0:
            canvas.yview_scroll(1, "units")
        elif event.num == 4 or event.delta > 0:
            canvas.yview_scroll(-1, "units")

    def _bind_mousewheel(event):
        canvas.bind_all("<MouseWheel>", _on_mousewheel)
        canvas.bind_all("<Button-4>", _on_mousewheel)
        canvas.bind_all("<Button-5>", _on_mousewheel)

    def _unbind_mousewheel(event):
        canvas.unbind_all("<MouseWheel>")
        canvas.unbind_all("<Button-4>")
        canvas.unbind_all("<Button-5>")

    container.bind("<Enter>", _bind_mousewheel)
    container.bind("<Leave>", _unbind_mousewheel)

    def input(label):
        tk.Label(scroll_frame, text=label, bg=Colors.BG, fg=Colors.TEXT).pack(
            anchor="w"
        )
        entry = tk.Entry(scroll_frame, bg=Colors.INPUT_BG, fg=Colors.TEXT)
        entry.pack(fill=tk.X, pady=5)
        return entry

    def textarea(label):
        tk.Label(scroll_frame, text=label, bg=Colors.BG, fg=Colors.TEXT).pack(
            anchor="w"
        )
        txt = tk.Text(scroll_frame, height=4, bg=Colors.INPUT_BG, fg=Colors.TEXT)
        txt.pack(fill=tk.X, pady=5)
        return txt

    def checkbox(label, default=False):
        var = tk.BooleanVar(value=default)
        chk = tk.Checkbutton(
            scroll_frame,
            text=label,
            variable=var,
            bg=Colors.BG,
            fg=Colors.TEXT,
            selectcolor=Colors.INPUT_BG,
        )
        chk.pack(anchor="w")
        return var

    name = input("Nombre del Intent")
    description = input("Descripción")

    training_phrases = textarea("Training Phrases (una por línea)")
    responses = textarea("Respuestas (una por línea)")

    tags = input("Tags (separados por coma)")
    language = input("Idioma (default: es)")
    priority = input("Prioridad")

    tk.Label(scroll_frame, text="Estado", bg=Colors.BG, fg=Colors.TEXT).pack(anchor="w")
    status = ttk.Combobox(
        scroll_frame,
        values=["active", "inactive", "training"],
        state="readonly",
    )
    status.set("active")
    status.pack(fill=tk.X, pady=5)

    version = input("Versión")

    tk.Label(
        scroll_frame,
        text="Contexto",
        bg=Colors.BG,
        fg=Colors.CL3,
        font=("Roboto", 12, "bold"),
    ).pack(pady=10, anchor="w")

    ctx_area = input("Área")
    ctx_company = input("Compañía")
    ctx_module = input("Módulo")

    tk.Label(
        scroll_frame,
        text="Metadata",
        bg=Colors.BG,
        fg=Colors.CL3,
        font=("Roboto", 12, "bold"),
    ).pack(pady=10, anchor="w")

    meta_source = input("Source")
    meta_notes = textarea("Notes")

    tk.Label(
        scroll_frame,
        text="Training Config",
        bg=Colors.BG,
        fg=Colors.CL3,
        font=("Roboto", 12, "bold"),
    ).pack(pady=10, anchor="w")

    use_nlp = checkbox("Use For NLP", True)
    use_embedding = checkbox("Use For Embedding", False)
    use_faq = checkbox("Use For FAQ", True)

    created_by = input("Created By")

    def submit():
        data = {
            "name": name.get(),
            "description": description.get(),
            "trainingPhrases": training_phrases.get("1.0", tk.END).strip().split("\n"),
            "responses": responses.get("1.0", tk.END).strip().split("\n"),
            "tags": [t.strip() for t in tags.get().split(",") if t.strip()],
            "language": language.get() or "es",
            "priority": int(priority.get() or 0),
            "status": status.get(),
            "version": int(version.get() or 1),
            "context": {
                "area": ctx_area.get() or "general",
                "company": ctx_company.get() or "sentinel_track_systems",
                "module": ctx_module.get() or None,
            },
            "metadata": {
                "source": meta_source.get() or None,
                "notes": meta_notes.get("1.0", tk.END).strip() or None,
            },
            "trainingConfig": {
                "useForNLP": use_nlp.get(),
                "useForEmbedding": use_embedding.get(),
                "useForFAQ": use_faq.get(),
            },
            "createdBy": created_by.get() or "system",
            "embedding": [],
        }

        print("🔥 Intent creado:")
        print(data)

    tk.Button(
        scroll_frame,
        text="Guardar Intent",
        bg=Colors.CL3,
        fg="#000",
        font=("Roboto", 11, "bold"),
        command=submit,
        cursor="hand2",
    ).pack(pady=20, fill=tk.X)
