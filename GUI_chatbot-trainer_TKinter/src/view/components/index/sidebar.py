import tkinter as tk
from styles.styles import Colors

def build_left_sidebar(root):
    left_sidebar = tk.Frame(root, bg=Colors.BG, width=220)
    left_sidebar.pack(side=tk.LEFT, fill=tk.Y)

    tk.Label(
        left_sidebar,
        text="SentinelTrack Systems",
        fg=Colors.CL3,
        bg=Colors.BG,
        font=("Roboto", 22, "bold")
    ).pack(pady=10)

    tk.Label(
        left_sidebar,
        text="Vector ChatBot - Trainer",
        fg=Colors.TEXT,
        bg=Colors.BG,
        font=("Roboto", 12, "bold")
    ).pack()


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
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    def _on_mousewheel(event):
        canvas.yview_scroll(-int(event.delta / 120), "units")

    canvas.bind("<Enter>", lambda e: canvas.bind_all("<MouseWheel>", _on_mousewheel))
    canvas.bind("<Leave>", lambda e: canvas.unbind_all("<MouseWheel>"))