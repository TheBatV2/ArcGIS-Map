require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/PopupTemplate"
], function(Map, MapView, Graphic, GraphicsLayer, BasemapToggle, Locate, Search, PopupTemplate) {
    
    // Create the map
    const map = new Map({
        basemap: "dark-gray-vector"
    });

    // Create the map view
    const view = new MapView({
        container: "mapView",
        map: map,
        center: [-112.0339, 43.4919], // Idaho Falls, Idaho
        zoom: 13
    });

    // Create graphics layer for points
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Add widgets to the map
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "hybrid"
    });
    view.ui.add(basemapToggle, "bottom-right");

    const locateWidget = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToOverride: function(view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
        }
    });
    view.ui.add(locateWidget, "top-left");

    const searchWidget = new Search({
        view: view,
        popupEnabled: true,
        popupOpenOnSelect: true
    });
    view.ui.add(searchWidget, "top-right");

    // Define marker symbols for different categories
    const markerSymbols = {
        restaurant: {
            type: "simple-marker",
            color: "#FF5733",
            outline: {
                color: [255, 255, 255, 0.7],
                width: 1
            },
            size: 12
        },
        park: {
            type: "simple-marker",
            color: "#33FF57",
            outline: {
                color: [255, 255, 255, 0.7],
                width: 1
            },
            size: 12
        },
        shopping: {
            type: "simple-marker",
            color: "#3357FF",
            outline: {
                color: [255, 255, 255, 0.7],
                width: 1
            },
            size: 12
        },
        landmark: {
            type: "simple-marker",
            color: "#FF33F5",
            outline: {
                color: [255, 255, 255, 0.7],
                width: 1
            },
            size: 12
        },
        entertainment: {
            type: "simple-marker",
            color: "#F5FF33",
            outline: {
                color: [255, 255, 255, 0.7],
                width: 1
            },
            size: 12
        }
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
            view.ui.add(
                document.createElement("div").innerHTML = 
                "<div class='alert alert-danger m-3'>Error loading location data. Please try refreshing the page.</div>",
                "top-center"
            );
        });

    // Function to add markers to the map
    function addMarkersToMap(locations) {
        // Clear existing graphics
        graphicsLayer.removeAll();
        
        // Add each location to the map
        locations.forEach(location => {
            const point = {
                type: "point",
                longitude: location.longitude,
                latitude: location.latitude
            };

            // Create popup template
            const popupTemplate = new PopupTemplate({
                title: location.name,
                content: createPopupContent(location)
            });

            // Create graphic
            const graphic = new Graphic({
                geometry: point,
                symbol: markerSymbols[location.category],
                attributes: location,
                popupTemplate: popupTemplate
            });

            // Add graphic to the layer
            graphicsLayer.add(graphic);
        });
    }

    // Function to create popup content
    function createPopupContent(location) {
        // Create popup content div
        const div = document.createElement("div");
        div.className = "popup-content";
        
        // Add rating stars
        const ratingDiv = document.createElement("div");
        ratingDiv.className = "popup-rating";
        
        let ratingStars = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= location.rating) {
                ratingStars += "★"; // Filled star
            } else {
                ratingStars += "☆"; // Empty star
            }
        }
        
        ratingDiv.innerHTML = `<strong>Rating:</strong> ${ratingStars} (${location.rating}/5)`;
        div.appendChild(ratingDiv);
        
        // Add address
        const addressDiv = document.createElement("div");
        addressDiv.className = "popup-address";
        addressDiv.innerHTML = location.address;
        div.appendChild(addressDiv);
        
        // Add description
        const descDiv = document.createElement("div");
        descDiv.className = "popup-description";
        descDiv.innerHTML = location.description;
        div.appendChild(descDiv);
        
        // Add category badge
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `<span class="badge bg-secondary">${location.category.charAt(0).toUpperCase() + location.category.slice(1)}</span>`;
        div.appendChild(categoryDiv);
        
        return div;
    }

    // Make the function available globally for filtering
    window.addMarkersToMap = addMarkersToMap;
});
