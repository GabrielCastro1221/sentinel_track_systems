async function registerDisabledPersonFormData(personData) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) {
        console.error("No se encontró el ID del usuario");
        return;
    }

    const formData = new FormData();

    formData.append("name", personData.name);
    formData.append("CC", personData.CC);
    formData.append("age", personData.age);
    formData.append("dateOfBirth", personData.dateOfBirth);
    formData.append("sex", personData.sex);
    formData.append("disabilityType", personData.disabilityType);
    formData.append("disabilityDescription", personData.disabilityDescription);
    formData.append("medicalHistory", personData.medicalHistory);
    formData.append("allergies", JSON.stringify(personData.allergies));
    formData.append("medications", JSON.stringify(personData.medications));
    formData.append("bloodType", personData.bloodType);
    formData.append("emergencyContactName", personData.emergencyContactName);
    formData.append("emergencyContactPhone", personData.emergencyContactPhone);
    formData.append("emergencyContactRelation", personData.emergencyContactRelation);
    formData.append("responsibleUser", user._id);

    if (personData.photo) {
        formData.append("photo", personData.photo);
    }

    try {
        const response = await fetch(`/api/v1/disabled-persons/create`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.person) {
            Swal.fire({
                title: "Registro exitoso",
                text: `Se registró correctamente a ${result.person.name}`,
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
            text: error.message || "No se pudo registrar",
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
    const registerPersonBtn = document.getElementById("register-person-with-disability");

    if (!registerPersonBtn) return;

    registerPersonBtn.addEventListener("click", (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Registrar Persona",
            html: `
                <form class="swal-form">
                    <input id="swal-name" class="swal-input" placeholder="Nombre completo">
                    <input id="swal-cc" class="swal-input" placeholder="Cédula">
                    <input id="swal-age" type="number" class="swal-input" placeholder="Edad">
                    <input id="swal-dob" type="date" class="swal-input">

                    <select id="swal-sex" class="swal-input">
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <input id="swal-disabilityType" class="swal-input" placeholder="Tipo de discapacidad">

                    <textarea id="swal-disabilityDescription" class="swal-input" placeholder="Descripción"></textarea>

                    <textarea id="swal-medicalHistory" class="swal-input" placeholder="Historial médico"></textarea>

                    <input id="swal-allergies" class="swal-input" placeholder="Alergias (coma)">
                    <input id="swal-medications" class="swal-input" placeholder="Medicamentos (coma)">

                    <select id="swal-bloodType" class="swal-input">
                        <option value="">Tipo de sangre</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>

                    <input id="swal-emergencyName" class="swal-input" placeholder="Nombre contacto emergencia">
                    <input id="swal-emergencyPhone" class="swal-input" placeholder="Teléfono contacto">
                    <input id="swal-emergencyRelation" class="swal-input" placeholder="Relación">

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
                    name: document.getElementById("swal-name").value,
                    CC: document.getElementById("swal-cc").value,
                    age: parseInt(document.getElementById("swal-age").value) || null,
                    dateOfBirth: document.getElementById("swal-dob").value,
                    sex: document.getElementById("swal-sex").value,
                    disabilityType: document.getElementById("swal-disabilityType").value,
                    disabilityDescription: document.getElementById("swal-disabilityDescription").value,
                    medicalHistory: document.getElementById("swal-medicalHistory").value,
                    allergies: document.getElementById("swal-allergies").value.split(",").map(a => a.trim()).filter(Boolean),
                    medications: document.getElementById("swal-medications").value.split(",").map(m => m.trim()).filter(Boolean),
                    bloodType: document.getElementById("swal-bloodType").value,
                    emergencyContactName: document.getElementById("swal-emergencyName").value,
                    emergencyContactPhone: document.getElementById("swal-emergencyPhone").value,
                    emergencyContactRelation: document.getElementById("swal-emergencyRelation").value,
                    photo: fileInput.files[0] || null
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                registerDisabledPersonFormData(result.value);
            }
        });
    });
});