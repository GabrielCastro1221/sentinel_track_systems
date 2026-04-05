async function registerPetFormData(petData) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) {
        console.error("No se encontró el ID del usuario");
        return;
    }

    const formData = new FormData();
    formData.append("petName", petData.petName);
    formData.append("species", petData.species);
    formData.append("breed", petData.breed);
    formData.append("age", petData.age);
    formData.append("sex", petData.sex);
    formData.append("user", user._id);

    if (petData.photo) {
        formData.append("photo", petData.photo);
    }

    try {
        const response = await fetch(`/api/v1/pets/create`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.pet) {
            Swal.fire({
                title: "Mascota registrada",
                text: "Tu mascota se registró correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-custom-confirm"
                },
                buttonsStyling: false
            });
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error(error);

        Swal.fire({
            title: "Error",
            text: error.message || "No se pudo registrar la mascota",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                confirmButton: "swal-custom-confirm"
            },
            buttonsStyling: false
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const registerPetBtn = document.getElementById("register-pet");

    if (!registerPetBtn) return;

    registerPetBtn.addEventListener("click", (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Registrar Mascota",
            html: `
                <form class="swal-form">
                    <input id="swal-petName" class="swal-input" placeholder="Nombre de la mascota">
                    <input id="swal-species" class="swal-input" placeholder="Especie (ej. perro, gato)">
                    <input id="swal-breed" class="swal-input" placeholder="Raza">
                    <input id="swal-age" type="number" class="swal-input" placeholder="Edad">

                    <select id="swal-sex" class="swal-input">
                        <option value="">Seleccionar sexo</option>
                        <option value="macho">Macho</option>
                        <option value="hembra">Hembra</option>
                    </select>

                    <input id="swal-photo" type="file" class="swal-input" accept="image/*">
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: "Registrar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: "swal-custom-confirm",
                cancelButton: "swal-custom-cancel"
            },
            buttonsStyling: false,
            preConfirm: () => {
                const fileInput = document.getElementById("swal-photo");

                return {
                    petName: document.getElementById("swal-petName").value,
                    species: document.getElementById("swal-species").value,
                    breed: document.getElementById("swal-breed").value,
                    age: parseInt(document.getElementById("swal-age").value) || null,
                    sex: document.getElementById("swal-sex").value,
                    photo: fileInput.files[0] || null
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                registerPetFormData(result.value);
            }
        });
    });
});