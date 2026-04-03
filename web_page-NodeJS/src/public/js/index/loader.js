function recargarIndexUnaVez() {
    if (!sessionStorage.getItem("recargado")) {
        sessionStorage.setItem("recargado", "true");
        window.location.reload();
    }
}

recargarIndexUnaVez();