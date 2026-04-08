def authenticate(usuario, password):
    if not usuario or not password:
        return False, "Campos vacíos"

    if usuario == "admin" and password == "1234":
        return True, "Bienvenido"

    return False, "Usuario o contraseña incorrectos"
