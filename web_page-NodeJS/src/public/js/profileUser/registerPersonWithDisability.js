async function registerDisabledPersonFormData(personData) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
        console.error("No se encontró el ID del usuario en localStorage");
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
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.message || "No se pudo registrar la persona",
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn"
                }
            });
        }
    } catch (error) {
        console.error("Error al registrar persona con discapacidad:", error);
        Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor",
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-confirm-btn"
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const registerPersonBtn = document.getElementById("register-person-with-disability");
    if (registerPersonBtn) {
        registerPersonBtn.addEventListener("click", (e) => {
            e.preventDefault();

            Swal.fire({
                title: "Registrar Persona con Discapacidad",
                html: `
                    <form id="register-disabled-form" class="swal-form">
                        <input id="swal-name" class="swal-input elegant-input" placeholder="Nombre completo">
                        <input id="swal-cc" class="swal-input elegant-input" placeholder="Cédula">
                        <input id="swal-age" type="number" class="swal-input elegant-input" placeholder="Edad">
                        <input id="swal-dob" type="date" class="swal-input elegant-input">
                        <select id="swal-sex" class="swal-input elegant-input">
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <input id="swal-disabilityType" class="swal-input elegant-input" placeholder="Tipo de discapacidad">
                        <textarea id="swal-disabilityDescription" class="swal-input elegant-input" placeholder="Descripción de la discapacidad"></textarea>
                        <textarea id="swal-medicalHistory" class="swal-input elegant-input" placeholder="Historial médico"></textarea>
                        <input id="swal-allergies" class="swal-input elegant-input" placeholder="Alergias (separadas por coma)">
                        <input id="swal-medications" class="swal-input elegant-input" placeholder="Medicamentos (separados por coma)">
                        <select id="swal-bloodType" class="swal-input elegant-input">
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
                        <input id="swal-emergencyName" class="swal-input elegant-input" placeholder="Nombre contacto de emergencia">
                        <input id="swal-emergencyPhone" class="swal-input elegant-input" placeholder="Teléfono contacto de emergencia">
                        <input id="swal-emergencyRelation" class="swal-input elegant-input" placeholder="Relación contacto de emergencia">
                        <input id="swal-photo" type="file" class="swal-input elegant-input" accept="image/*">
                    </form>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Registrar",
                cancelButtonText: "Cancelar",
                customClass: {
                    popup: "swal-popup",
                    confirmButton: "swal-confirm-btn",
                    cancelButton: "swal-cancel-btn"
                },
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
                        allergies: document.getElementById("swal-allergies").value.split(",").map(a => a.trim()).filter(a => a),
                        medications: document.getElementById("swal-medications").value.split(",").map(m => m.trim()).filter(m => m),
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
    }
});
