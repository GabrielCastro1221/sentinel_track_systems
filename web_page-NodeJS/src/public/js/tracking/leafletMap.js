document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map", {
        center: [5.0668, -75.5068],
        zoom: 13,
        minZoom: 10,
        doubleClickZoom: false
    });

    const openStreet = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, attribution: "© OpenStreetMap" }
    );

    const satellite = L.tileLayer(
        "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
            maxZoom: 20,
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
            attribution: "© Google Satellite"
        }
    );

    const cartoLight = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
            attribution: "© OpenStreetMap © Carto",
            subdomains: "abcd",
            maxZoom: 20
        }
    );

    openStreet.addTo(map);

    const baseMaps = {
        "OpenStreetMap": openStreet,
        "Satélite": satellite,
        "Carto Light": cartoLight
    };

    L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

    const socket = io();
    const urlParts = window.location.pathname.split("/");
    const deviceId = urlParts[urlParts.length - 1];

    const gpsIcon = L.icon({
        iconUrl: "/assets/images/icon-gps.png",
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -40]
    });

    const poiIcon = L.icon({
        iconUrl: "/assets/images/icon-poi.png",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -30]
    });

    const poiMarkers = [];
    const geofenceLayers = [];

    let geofenceMode = false;
    let geofencePoints = [];
    let tempPolygon = null;
    let tempLine = null;
    let gpsMarker = null;

    function formatLocationInfo(title, loc) {
        const date = loc.date
            ? new Date(loc.date).toLocaleString()
            : "Sin fecha";
        const city = loc.city || "Sin ciudad";
        const zone = loc.zone || "Sin zona";
        const address = loc.address || "Sin dirección";
        return `
            <div style="font-size:13px;line-height:1.4">
                <b>GPS - ${title}</b><br>
                Latitud: ${loc.latitude.toFixed(6)}<br>
                Longitud: ${loc.longitude.toFixed(6)}<br>
                Ciudad: ${city}<br>
                Zona: ${zone}<br>
                Dirección: ${address}<br>
                Fecha: ${date}
            </div>
        `;
    }

    const control = L.control({ position: "bottomleft" });
    control.onAdd = () => {
        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control")
        div.innerHTML = `
            <button id="btn-geofence">Dibujar zona segura</button>
            <button id="btn-finish">Guardar</button>
        `;
        L.DomEvent.disableClickPropagation(div);
        return div;
    };

    control.addTo(map);
    setTimeout(() => {
        const btnGeo = document.getElementById("btn-geofence");
        const btnFinish = document.getElementById("btn-finish");
        btnGeo.onclick = () => {
            geofenceMode = true;
            geofencePoints = [];
            if (tempPolygon) map.removeLayer(tempPolygon);
            if (tempLine) map.removeLayer(tempLine);
            btnGeo.classList.add("active");
        };

        btnFinish.onclick = () => {
            if (!geofenceMode) return;
            if (geofencePoints.length < 3) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Debes seleccionar mínimo 3 puntos de referencia"
                });
                btnGeo.classList.remove("active");
                return;
            }

            Swal.fire({
                title: "Nombre de la zona segura",
                input: "text",
                inputPlaceholder: "Escribe un nombre",
                showCancelButton: true,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (!result.isConfirmed || !result.value) return;
                socket.emit("gps:geofence:add", {
                    gpsId: deviceId,
                    geofenceData: {
                        name: result.value,
                        polygon: geofencePoints
                    }
                });
                geofenceMode = false;
                geofencePoints = [];
                if (tempPolygon) map.removeLayer(tempPolygon);
                if (tempLine) map.removeLayer(tempLine);
                btnGeo.classList.remove("active");
            });
        };
    }, 200);

    map.on("dblclick", (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        if (geofenceMode) {
            geofencePoints.push([lng, lat]);
            if (tempPolygon) map.removeLayer(tempPolygon);
            tempPolygon = L.polygon(
                geofencePoints.map(p => [p[1], p[0]]),
                { color: "red" }
            ).addTo(map);
            if (tempLine) map.removeLayer(tempLine);
            return;
        }

        const html = `
            <div>
                <h5 class="poi-title">Añadir esta ubicación a mis puntos de interes</h5>
                <input id="poi-name" class="input" placeholder="nombre del punto de interes"/>
                <button id="save-poi">Guardar punto de interes</button>
            </div>
        `;

        const popup = L.popup()
            .setLatLng([lat, lng])
            .setContent(html);
        popup.on("add", () => {
            const input = document.getElementById("poi-name");
            const btnSave = document.getElementById("save-poi");

            function savePOI() {
                const name = input.value.trim();
                if (!name) return;

                socket.emit("gps:poi:add", {
                    gpsId: deviceId,
                    poiData: {
                        name,
                        latitude: lat,
                        longitude: lng
                    }
                });
                map.closePopup();
            }

            btnSave.onclick = savePOI;
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    savePOI();
                }
            });
        });
        popup.openOn(map);
    });

    map.on("mousemove", (e) => {
        if (geofenceMode && geofencePoints.length > 0) {
            const lastPoint = geofencePoints[geofencePoints.length - 1];
            const currentPoint = [e.latlng.lat, e.latlng.lng];
            if (tempLine) map.removeLayer(tempLine);
            tempLine = L.polyline(
                [[lastPoint[1], lastPoint[0]], currentPoint],
                { color: "orange", dashArray: "5,5" }
            ).addTo(map);
        }
    });

    function renderPOIs(pois) {
        poiMarkers.forEach(m => map.removeLayer(m));
        poiMarkers.length = 0;
        pois.forEach(p => {
            const m = L.marker(
                [p.latitude, p.longitude],
                { icon: poiIcon }
            ).addTo(map);
            m.bindTooltip(p.name);
            poiMarkers.push(m);
        });
    }

    function renderGeofences(list) {
        geofenceLayers.forEach(l => map.removeLayer(l));
        geofenceLayers.length = 0;
        list.forEach(g => {
            const coords =
                g.polygon.map(p => [p[1], p[0]]);
            const poly = L.polygon(
                coords,
                { color: "red" }
            ).addTo(map);
            poly.bindTooltip(g.name);
            geofenceLayers.push(poly);
        });
    }

    socket.on("connect", () => {
        socket.emit("gps:poi:get", { gpsId: deviceId });
        socket.emit("gps:geofence:get", { gpsId: deviceId });
        socket.emit("gps:getById", { deviceId });
        socket.emit("gps:location:last", { deviceId });
    });

    socket.on("gps:poi:get:response", renderPOIs);
    socket.on("gps:geofence:get:response", renderGeofences);
    socket.on("gps:getById:response", (gps) => {
        if (!gps || !gps.lastLocation) return;
        const loc = gps.lastLocation;
        if (gpsMarker) map.removeLayer(gpsMarker);
        gpsMarker = L.marker(
            [loc.latitude, loc.longitude],
            { icon: gpsIcon }
        ).addTo(map);

        const info = formatLocationInfo(gps.name || "GPS Device", loc);
        gpsMarker.bindPopup(info);
        gpsMarker.bindTooltip(gps.name || "GPS");
        map.setView([loc.latitude, loc.longitude], 15);
    });

    socket.on("gps:location:last:response", (location) => {
        if (!location) return;
        if (gpsMarker)
            map.removeLayer(gpsMarker);
        gpsMarker = L.marker(
            [
                location.latitude,
                location.longitude
            ],
            { icon: gpsIcon }
        ).addTo(map);

        const info = formatLocationInfo(
            "Última ubicación",
            location
        );

        gpsMarker.bindPopup(info);
        gpsMarker.bindTooltip(location.city || "GPS");

        map.setView(
            [
                location.latitude,
                location.longitude
            ],
            15
        );
    }
    );
});