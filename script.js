

// Initialisation de la carte
var map = L.map('map').setView([43.9352, 6.0679], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

// Chargement des données des établissements
// Chemin vers votre fichier CSV
const csvGeoJsonPath = 'data/departements_geom_20180101.csv';
const csvCity = 'data/villes.csv';
var markers = [];
// Variable pour stocker les données CSV
let csvData = [];
dataGeoJson = loadCSVSync(csvGeoJsonPath)
var geoJSONDpt = JSON.parse(dataGeoJson);



// Définir un style pour le GeoJSON
function style(feature) {
    return {
        color: '#e94b3c',
        weight: 2,    // Épaisseur des contours
        dashArray: '4', // Pointillé
        fillOpacity: 0   // Opacité du remplissage
    };
}

// Ajoute l'objet GeoJSON à la carte Leaflet avec le style défini
L.geoJSON(geoJSONDpt, { style: style }).addTo(map);


addDataToMap("cma");
// Charger et parser le CSV, puis stocker les données dans la variable




document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');

    var dataCity = loadCSVSync(csvCity);
    cities = parseCSV(dataCity);

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (query.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredData = cities.filter(item =>
            item.label.toLowerCase().includes(query) || item.code_postale.includes(query)
        );

        if (filteredData.length > 0) {
            suggestionsContainer.style.display = 'block';
            filteredData.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = `${item.label} (${item.code_postale})`;
                div.addEventListener('click', function() {
                    searchInput.value = item.label;
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
});