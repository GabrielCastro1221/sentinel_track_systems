document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const searchBtn = document.querySelector(".search-btn");
    const resultsContainer = document.getElementById("results");

    async function searchDevices(query) {
        try {
            const response = await fetch(`/api/v1/gps-device/search?q=${encodeURIComponent(query)}&limit=10`);
            if (!response.ok) throw new Error("Error en la búsqueda");
            const devices = await response.json();

            resultsContainer.innerHTML = "";
            if (devices.length === 0) {
                resultsContainer.innerHTML = "<p>No se encontraron dispositivos.</p>";
                return;
            }

            devices.forEach(device => {
                const item = document.createElement("div");
                item.classList.add("device-item");

                let assignedEntity = "";
                if (device.pet) {
                    assignedEntity = `
                        <p><strong>Mascota asignada al GPS:</strong></p>
                        <p><span>Nombre: </span>${device.pet.petName}</p>
                        <p><span>Especie:</span> ${device.pet.species}</p>
                        <p><span>Raza:</span> ${device.pet.breed}</p>
                        <p><span>Edad:</span> ${device.pet.age}</p>
                        <p><span>Sexo:</span> ${device.pet.sex}</p>
                    `;
                } else if (device.vehicle) {
                    assignedEntity = `
                        <p><strong>Vehículo asignado al GPS:</strong></p>
                        <p><span>Placa:</span> ${device.vehicle.licensePlate}</p>
                        <p><span>Tipo:</span> ${device.vehicle.type}</p>
                        <p><span>Marca:</span> ${device.vehicle.brand}</p>
                        <p><span>Modelo:</span> ${device.vehicle.model}</p>
                        <p><span>Color:</span> ${device.vehicle.color}</p>
                    `;
                } else if (device.disabled_person) {
                    assignedEntity = `
                        <p><strong>Persona con discapacidad asignada al GPS:</strong></p>
                        <p><span>Nombre: </span>${device.disabled_person.name}</p>
                        <p><span>Edad:</span> ${device.disabled_person.age}</p>
                        <p><span>Tipo de discapacidad:</span> ${device.disabled_person.disabilityType}</p>
                        <p><span>Identificación:</span> ${device.disabled_person.CC}</p>
                    `;
                } else {
                    assignedEntity = "<p><strong>No asignado</strong></p>";
                }

                const lastLocation = device.lastLocation
                    ? `<br><span>Latitud:</span> ${device.lastLocation.latitude ?? "N/A"}
                    <br><span>Longitud:</span> ${device.lastLocation.longitude ?? "N/A"} 
                    <br><span>Ciudad:</span> ${device.lastLocation.city ?? "N/A"} 
                    <br><span>Direccion:</span> ${device.lastLocation.address ?? "N/A"} 
                    <br><span>Zona:</span> ${device.lastLocation.zone ?? "N/A"} 
                    <br><span>Fecha:</span> ${device.lastLocation.date ? new Date(device.lastLocation.date).toLocaleString() : "sin fecha"}`
                    : "No disponible";

                const userInfo = device.assignedToUser
                    ? `<p><strong>Propietario del GPS:</strong>
                        <br><span>Nombre:</span> ${device.assignedToUser.name}
                        <br><span>Email:</span> ${device.assignedToUser.email})</p>`
                    : "<p><strong>Usuario asignado:</strong> N/A</p>";

                item.innerHTML = `
                    <article class="device-item" role="listitem" itemscope itemtype="https://schema.org/Product">
                        <h3 class="device-title" itemprop="name">${device.name}</h3>
                        <p><strong>ID:</strong> <span itemprop="sku">${device._id}</span></p>
                        <p><strong>DeviceId:</strong> <span itemprop="productID">${device.deviceId}</span></p>
                        <p><strong>Estado:</strong> <span itemprop="status">${device.active ? "Activo" : "Inactivo"}</span></p>
                        <p><strong>Conexión:</strong> <span itemprop="additionalProperty">${device.connectionStatus}</span></p>
        
                        ${assignedEntity}
                        ${userInfo}
        
                        <p><strong>Última ubicación:</strong></p>
                        <p itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                            <span>Latitud:</span> ${device.lastLocation?.latitude ?? "N/A"}<br>
                            <span>Longitud:</span> ${device.lastLocation?.longitude ?? "N/A"}<br>
                            <span>Ciudad:</span> ${device.lastLocation?.city ?? "N/A"}<br>
                            <span>Dirección:</span> ${device.lastLocation?.address ?? "N/A"}<br>
                            <span>Zona:</span> ${device.lastLocation?.zone ?? "N/A"}<br>
                            <span>Fecha:</span> ${device.lastLocation?.date ? new Date(device.lastLocation.date).toLocaleString() : "sin fecha"}
                        </p>
        
                        <p><strong>Creado:</strong> <time itemprop="releaseDate">${new Date(device.createdAt).toLocaleString()}</time></p>
                        <p><strong>Actualizado:</strong> <time itemprop="dateModified">${new Date(device.updatedAt).toLocaleString()}</time></p>
        
                        <div class="btn-content">
                            <a href="/gps/${device._id}" class="page-btn-green"
                                aria-label="Rastrear ${device.name} en el mapa"
                                title="Ver en el mapa"
                                data-tooltip="Ver en el mapa"
                                itemprop="url">Rastrear GPS ${device.name}
                            </a>
                        </div>
                    </article>
                `;
                resultsContainer.appendChild(item);
            });
        } catch (error) {
            resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) searchDevices(query);
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) searchDevices(query);
        }
    });
});
