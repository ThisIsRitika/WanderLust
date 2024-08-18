// Setup map based on address or coordinates
function setupMap() {
    const mapElement = document.getElementById('map');
    const address = mapElement ? mapElement.getAttribute('data-address') : '';
    var locationName = mapElement.getAttribute('data-location-name');

    if (address) {
        geocodeAddress(address, (lat, lng) => {
            initMap(lat, lng, locationName);
        });
    } else {
        // Fallback if no address provided (e.g., using default coordinates)
        const lat = 51.505;
        const lng = -0.09;
        initMap(lat, lng);
    }
}

// Function to initialize the map
function initMap(lat, lng, locationName, zoom = 9) {
    var map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom icon URL
    var customIcon = L.divIcon({
        className: 'custom-icon',
        html: '<i class="fa-solid fa-location-dot"></i>', // Font Awesome icon
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map)
    .bindPopup(locationName)
    .openPopup();
}

// Function to geocode an address
function geocodeAddress(address, callback) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                callback(lat, lon);
            } else {
                console.error('No results found');
            }
        })
        .catch(error => console.error('Error during geocoding', error));
}



// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupMap);
