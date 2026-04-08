import tkinter as tk
from components.auth.login import create_login

root = tk.Tk()
root.title("Vector Trainer")
root.geometry("460x280")
root.configure(bg="#0f172a")
root.resizable(width=0, height=0)

create_login(root)

root.mainloop()
