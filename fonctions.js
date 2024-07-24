
// Fonction pour charger le fichier CSV
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return csvText;
}

// Fonction pour parser le CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(';');
    const data = lines.slice(1).map(line => {
        const values = line.split(';');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = cleanValue(values[index]);
            return obj;
        }, {});
    });
    return data;
}

// Fonction pour nettoyer les valeurs
function cleanValue(value) {
    return value.replace(/[\r\n]+/g, '').trim();
}

function loadCSVSync(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, false);  // false for synchronous request
    xhr.send(null);
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.error("Erreur de chargement du fichier CSV:", xhr.status, xhr.statusText);
        return null;
    }
}


function addDataToMap (from){

var divItem = document.getElementsByClassName('list-item');
var divItemLength = divItem.length;
var csvFilePath = "";

if (from == "cfa"){
    var csvFilePath = "cfa.csv";
    var markerList = "markerCFA.svg";
        // Définir une icône personnalisée pour CFA
        var customIcon = L.icon({
            iconUrl: 'markerCFA.svg', // Remplacez par le chemin de votre image
            iconSize: [38, 38], // Taille de l'icône
            iconAnchor: [19, 38], // Point de l'icône qui correspondra à la position du marqueur
            popupAnchor: [0, -38] // Point où la popup s'ouvre par rapport à l'icône
        });
    
} else if (from == "cma"){
    var csvFilePath = "cma.csv";
    var markerList = "marker.svg";
    // Définir une icône personnalisée pour CMA
    var customIcon = L.icon({
        iconUrl: 'marker.svg', // Remplacez par le chemin de votre image
        iconSize: [38, 38], // Taille de l'icône
        iconAnchor: [19, 38], // Point de l'icône qui correspondra à la position du marqueur
        popupAnchor: [0, -38] // Point où la popup s'ouvre par rapport à l'icône
    });
}
    loadCSV(csvFilePath)
    .then(csvText => {
        csvData = parseCSV(csvText);
        // ajouter des marqueurs à la carte
        csvData.forEach(row => {
            var lat = parseFloat(row.lat);
            var long = parseFloat(row.long);
            if (lat && long) {
/*                 L.marker([lat, long]).addTo(map)
                    .bindPopup(row.Nom || 'No name'); */
                    var marker = L.marker([lat, long], { icon: customIcon }).addTo(map)
                    .bindPopup(row.Nom || 'No name');
                    markers.push(marker);
            }
        }); 

        var listContainer = document.getElementsByClassName('list-container');
if (divItemLength > 0){
    listContainer[0].innerHTML = '';
}
        csvData.forEach(row => {
           
            
                var itemDiv = document.createElement('div');
                itemDiv.className = 'list-item';
            
                var leftItemDiv = document.createElement('div');
                leftItemDiv.className = 'left-div-list-item';
                var righttItemDiv = document.createElement('div');
                righttItemDiv.className = 'right-div-list-item';
        
                var img = document.createElement('img');

                img.src = markerList; // Remplacez par l'URL de votre image
                img.className = 'img-marker-list';

        
                // Ajouter l'image à la div
                leftItemDiv.appendChild(img);
    
                listContainer[0].appendChild(itemDiv);
                // Titre avec département et ville
                var title = document.createElement('h3');
                title.textContent = `${row.departement}`;
        
                itemDiv.appendChild(leftItemDiv);
                itemDiv.appendChild(righttItemDiv);
        
                righttItemDiv.appendChild(title);
        
                // Sous-titre avec code postal
                var subtitle = document.createElement('p');
                subtitle.textContent = `${row.ville} (${row.CP})`;
                righttItemDiv.appendChild(subtitle);
        
                // Bouton "Voir la fiche"
                var viewButton = document.createElement('button');
                viewButton.textContent = 'VOIR LA FICHE';
                viewButton.className="boutton-voir-la-fiche";
                viewButton.addEventListener('click', function() {
                    var baseUrl = 'item.html';  // Remplacez par l'URL de votre page cible
                    var parameter = `${row.Id}/${row.Nom}`;
                    const newUrl = `${baseUrl}?${parameter}`;
                    window.location.href = newUrl;
                });
                righttItemDiv.appendChild(viewButton);

        
                // Bouton "Itinéraire"
                var directionButton = document.createElement('button');
                directionButton.className="boutton-itineraire"
                directionButton.textContent = 'Itinéraire';
                righttItemDiv.appendChild(directionButton);
        }); 
    })
    .catch(error => console.error('Error loading CSV:', error));
}


// Fonction pour supprimer tous les marqueurs
function clearAllMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}
        
function getUrlParameters() {
    // Récupérer la partie query de l'URL
    var queryString = window.location.search.substring(1); // Enlever le '?' initial

    // Séparer les différentes parties par le caractère '/'
    var params = queryString.split('/');

    // Initialiser l'objet résultat
    var result = {};

    // Vérifier si au moins deux paramètres sont présents
    if (params.length >= 2) {
        // Définir les paramètres attendus et les décoder
        var key = decodeURIComponent(params[0]);
        var value = decodeURIComponent(params.slice(1).join(' '));
        result[key] = value;
    }
    return result;
}


async function processData(id, nom) {
    let csv;
    if (nom.includes("CMA")) {
        csv = "cma.csv";
    } else if (nom.includes("CFA")) {
        csv = "cfa.csv";
    }
    if (csv) {
        try {
            var csvText = await loadCSV(csv);
            var data = parseCSV(csvText);
            var obj = {};
            for (let index = 0; index < data.length; index++) {
                if (id == data[index]["Id"]) {
                    obj = data[index];
                    break;
                }
            }
            return obj;

        } catch (error) {
            console.error("Error loading CSV file:", error);
        }
    } else {
        console.error("No valid CSV file specified based on the provided `nom`.");
    }
}

async function initializeMap(id, nom) {
    const data = await processData(id, nom);

    if (data) {
        const lat = data.lat;
        const long = data.long;

        // Initialiser la carte Leaflet
        var map = L.map('map').setView([lat, long], 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap'
        }).addTo(map);

        // Ajouter un marqueur
        L.marker([lat, long]).addTo(map)
            .bindPopup(`Location: ${lat}, ${long}`)

        var divLogoContact = document.getElementsByClassName('logo-contacts')
        var imgContact = document.createElement('img')
        imgContact.className = "imgInfo";
        imgContact.src = 'info.svg';
        divLogoContact[0].append(imgContact);
        var textContact = document.getElementsByClassName('text-contacts');
        textContact[0].innerHTML = data.Telephone;

        var divLogoAdresse = document.getElementsByClassName('logo-adresse')
        var imgAdresse = document.createElement('img')
        imgAdresse.className = "imgAdresse";
        imgAdresse.src = 'location.svg';
        divLogoAdresse[0].append(imgAdresse);
        var textAdresse = document.getElementsByClassName('text-adresse');
        textAdresse[0].innerHTML = data.Adresse;

        var divLogoHoraire = document.getElementsByClassName('logo-horaires')
        var imgHoraires = document.createElement('img')
        imgHoraires.className = "imgHoraires";
        imgHoraires.src = 'clock.svg';
        divLogoHoraire[0].append(imgHoraires);
        var textHoraires = document.getElementsByClassName('text-horaires');
        textHoraires[0].innerHTML = data.Horaires;

    }
}