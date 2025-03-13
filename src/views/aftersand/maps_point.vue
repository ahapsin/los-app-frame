<template>
    <div ref="mapContainer" class="w-full h-full">
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet's CSS is included

const status = ref('Getting your location...');
const errorMessage = ref(null);
const location = ref(null);

const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Successfully got the position
                location.value = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                status.value = 'Location found!';
                errorMessage.value = null;
            },
            (error) => {
                // Handle error if permission is denied or unable to retrieve location
                location.value = null;
                status.value = 'Unable to retrieve your location.';
                errorMessage.value = error.message;
            }
        );
    } else {
        status.value = 'Geolocation is not supported by your browser.';
    }
};
// Reference to the map container
const lat = ref();
const lng = ref();
const mapContainer = ref(null);

onMounted(() => {
    getCurrentLocation();
    const map = L.map(mapContainer.value).setView([-6.717598, 108.5640679], 20);


    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Marker variable to store the current marker
    let marker = null;

    // Listen for click event on the map
    map.on('click', function (e) {
        // Update lat and lng with the clicked coordinates
        lat.value = e.latlng.lat;
        lng.value = e.latlng.lng;
        console.log(`lat: ${lat.value} lng: ${lng.value}`);

        // If a marker already exists, remove it
        if (marker) {
            marker.remove();
        }

        // Add a new marker at the clicked position
        marker = L.marker([lat.value, lng.value]).addTo(map);
    });
});
</script>
