const logoutBtn = document.getElementById("logout-admin");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión actual se cerrará y deberás volver a iniciar sesión.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-confirm-btn",
                cancelButton: "swal-cancel-btn"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                Swal.fire({
                    title: "Sesión cerrada",
                    text: "Has salido correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "swal-popup",
                        confirmButton: "swal-confirm-btn"
                    }
                }).then(() => {
                    window.location.href = "/login";
                });
            }
        });
    });
}