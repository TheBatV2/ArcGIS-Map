// Initialize the Leaflet map when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Create the map centered on Idaho Falls
    const map = L.map('mapView').setView([43.4919, -112.0339], 13);
    
    // Add a light theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Define marker colors for different categories
    const markerColors = {
        restaurant: "#FF5733",
        park: "#33FF57",
        shopping: "#3357FF",
        landmark: "#FF33F5",
        entertainment: "#F5FF33"
    };
    
    // Create marker groups for each category (for filtering)
    const markerGroups = {
        restaurant: L.layerGroup().addTo(map),
        park: L.layerGroup().addTo(map),
        shopping: L.layerGroup().addTo(map),
        landmark: L.layerGroup().addTo(map),
        entertainment: L.layerGroup().addTo(map)
    };

    // Load location data from JSON file
    fetch('/static/data/locations.json')
        .then(response => response.json())
        .then(data => {
            // Store the data globally for filtering
            window.locationData = data;
            
            // Add markers to the map
            addMarkersToMap(data);
        })
        .catch(error => {
            console.error("Error loading location data:", error);
            // Display error message on the map
            const errorDiv = document.createElement("div");
            errorDiv.innerHTML = "<div class='alert alert-danger m-3'>Error loading location data. Please try refreshing the page.</div>";
            document.getElementById("mapView").appendChild(errorDiv);
        });

    // Function to add markers to the map
    function addMarkersToMap(locations) {
        // Clear existing markers from all groups
        Object.values(markerGroups).forEach(group => group.clearLayers());
        
        // Add each location to the map
        locations.forEach(location => {
            // Create marker with custom styling based on category
            const marker = L.circleMarker([location.latitude, location.longitude], {
                radius: 8,
                fillColor: markerColors[location.category],
                color: "#fff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            // Create popup content
            const popupContent = createPopupContent(location);
            marker.bindPopup(popupContent);
            
            // Add to appropriate category group
            markerGroups[location.category].addLayer(marker);
        });
    }

    // Function to create popup content
    function createPopupContent(location) {
        let ratingStars = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= location.rating) {
                ratingStars += "★"; // Filled star
            } else {
                ratingStars += "☆"; // Empty star
            }
        }
        
        return `
            <div class="popup-content">
                <div class="popup-title">
                    <h5>${location.name}</h5>
                </div>
                <div class="popup-rating">
                    <strong>Rating:</strong> ${ratingStars} (${location.rating}/5)
                </div>
                <div class="popup-address">
                    ${location.address}
                </div>
                <div class="popup-description">
                    ${location.description}
                </div>
                <div>
                    <span class="badge bg-secondary">${location.category.charAt(0).toUpperCase() + location.category.slice(1)}</span>
                </div>
            </div>
        `;
    }

    // Make the function available globally for filtering
    window.addMarkersToMap = addMarkersToMap;
});
