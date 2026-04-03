document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".sign-in .formulario");
    if (loginForm) {
        const loginEmail = loginForm.querySelector('input[type="email"]');
        const loginPassword = loginForm.querySelector('input[type="password"]');
        const loginBtn = loginForm.querySelector('input[type="button"]');

        loginBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: loginEmail.value.trim(),
                        password: loginPassword.value.trim()
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    const user = {
                        token: data.data.token,
                        role: data.data.role,
                        name: data.data.name
                    };

                    localStorage.setItem("user", JSON.stringify(user));

                    Toastify({
                        text: "Inicio de sesión exitoso",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();

                    setTimeout(() => {
                        if (user.role === "admin") {
                            window.location.href = "/perfil-admin";
                        } else {
                            window.location.href = "/perfil-usuario";
                        }
                    }, 1500);

                } else {
                    alert(data.message || "Error al iniciar sesión.");
                }

            } catch (error) {
                alert("Error de conexión con el servidor.");
            }
        });
    }

    const registerForm = document.querySelector(".sign-up .formulario");
    if (registerForm) {
        const registerName = registerForm.querySelector('input[type="text"]');
        const registerEmail = registerForm.querySelector('input[type="email"]');
        const registerPassword = registerForm.querySelector('input[type="password"]');
        const registerBtn = registerForm.querySelector('input[type="button"]');

        registerBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/v1/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: registerName.value.trim(),
                        email: registerEmail.value.trim(),
                        password: registerPassword.value.trim()
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("Registro exitoso:", data);

                    Toastify({
                        text: "Registro exitoso",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();

                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1500);
                } else {
                    alert(data.message || "Error al registrarse.");
                }
            } catch (error) {
                alert("Error de conexión con el servidor.");
            }
        });
    }
});
