// Set up the filter event listeners
document.addEventListener("DOMContentLoaded", function() {
    const categoryFilter = document.getElementById("categoryFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const ratingValue = document.getElementById("ratingValue");
    const resetButton = document.getElementById("resetFilters");

    // Update the rating value display
    ratingFilter.addEventListener("input", function() {
        ratingValue.textContent = this.value + "+";
        applyFilters();
    });

    // Apply category filter
    categoryFilter.addEventListener("change", applyFilters);

    // Reset all filters
    resetButton.addEventListener("click", function() {
        categoryFilter.value = "all";
        ratingFilter.value = "1";
        ratingValue.textContent = "1+";
        applyFilters();
    });

    // Function to apply all active filters
    function applyFilters() {
        // Get filter values
        const selectedCategory = categoryFilter.value;
        const minRating = parseInt(ratingFilter.value);
        
        // If the location data is loaded
        if (window.locationData) {
            // Filter the data
            const filteredLocations = window.locationData.filter(location => {
                // Check category filter
                const categoryMatch = selectedCategory === "all" || location.category === selectedCategory;
                
                // Check rating filter
                const ratingMatch = location.rating >= minRating;
                
                // Return true if all filters match
                return categoryMatch && ratingMatch;
            });
            
            // Update map with filtered locations
            window.addMarkersToMap(filteredLocations);
        }
    }
});
