

// Initialisation de la carte
var map = L.map('map').setView([43.9352, 6.0679], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

// Chargement des données des établissements
// Chemin vers votre fichier CSV
const csvGeoJsonPath = 'data/departements_geom_20180101.csv';
var markers = [];
// Variable pour stocker les données CSV
let csvData = [];
dataGeoJsonTest = loadCSVSync(csvGeoJsonPath)
var geoJSONDpt = JSON.parse(dataGeoJsonTest);

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




