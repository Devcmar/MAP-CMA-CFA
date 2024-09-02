
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
    var csvFilePath = "data/cfa.csv";
    var markerList = "logo/markerCFA.svg";
        // Définir une icône personnalisée pour CFA
        var customIcon = L.icon({
            iconUrl: 'logo/markerCFA.svg', // Remplacez par le chemin de votre image
            iconSize: [38, 38], // Taille de l'icône
            iconAnchor: [19, 38], // Point de l'icône qui correspondra à la position du marqueur
            popupAnchor: [0, -38] // Point où la popup s'ouvre par rapport à l'icône
        });
    
} else if (from == "cma"){
    var csvFilePath = "data/cma.csv";
    var markerList = "logo/marker.svg";
    // Définir une icône personnalisée pour CMA
    var customIcon = L.icon({
        iconUrl: 'logo/marker.svg', // Remplacez par le chemin de votre image
        iconSize: [38, 38], // Taille de l'icône
        iconAnchor: [19, 38], // Point de l'icône qui correspondra à la position du marqueur
        popupAnchor: [0, -38] // Point où la popup s'ouvre par rapport à l'icône
    });
}
    loadCSV(csvFilePath)
    .then(csvText => {
        csvData = parseCSV(csvText);

        var marker = {};
        // ajouter des marqueurs à la carte
        csvData.forEach(row => {
            var lat = parseFloat(row.lat);
            var long = parseFloat(row.long);
            if (lat && long) {
                if (from == "cma"){
                    var nousContcater = "https://www.cmar-paca.fr/contact";
                    var baseUrl = 'item.html';
                    var parameter = `${encodeURIComponent(row.Id)}/${encodeURIComponent(row.Nom)}`;
                    var buttonFiche = `<button class="boutton-voir-la-fiche-marker" onclick="window.location.href='${baseUrl}?${parameter}'">VOIR LA FICHE</button>`;
                    //var buttonFiche = `<button class="boutton-voir-la-fiche-marker" onclick="window.location.href='item.html?${encodeURIComponent(row.Id)}/${encodeURIComponent(row.Nom)}'">VOIR LA FICHE</button>`
                }else if ( from == "cfa"){
                    
                    var nousContcater = "https://www.urma-paca.fr/contactez-nous";

                    var buttonFiche = `
                    <button class="boutton-voir-la-fiche" onclick="window.open('${row.site}', '_blank');">
        VOIR LE SITE
    </button>`;
                }

                    var telHref = formatPhoneNumber(row.Telephone);
                    
                    marker[row.id] = L.marker([lat, long], { icon: customIcon }).addTo(map)
                    .bindPopup(
                        `<div class="popupMarker">
                        <h3 class="h3-popup" >${row.Nom }</h3>
                        <div class= "div-item-marker" ><img src="logo/location-black.svg" class="img-marker" alt=""><p class= "p-marker">${row.Adresse }</p></div>
                        <div class= "div-item-marker"><img src="logo/telephone.svg" class="img-marker" alt=""><a target="_blank" class="call-link" href="tel:${telHref}">${row.Telephone}</a></div>
                        <div class= "div-item-marker"><img src="logo/enveloppe.svg" class="img-marker" alt=""><a class="ancre-black" target="_blank" href=${nousContcater} >Nous contacter</a></div>
                        <div class= "div-item-marker">` +
                        buttonFiche +
                        `<a class="boutton-itineraire" target= "_blank" href="https://www.google.com/maps/dir/My+location/${row.lat},${row.long}"> Itinéraire</a>
                        </div>
                        </div>`
                )
                .on('click', function() {
                    document.getElementsByClassName('toggle-switch')[0].classList.add('hidden');
                });;
                    markers.push(marker[row.id]);
            }
        }); 

        var listContainer = document.getElementsByClassName('list-container');
if (divItemLength > 0){
    listContainer[0].innerHTML = '';
}
        csvData.forEach(row => {
           
                var itemDiv = document.createElement('div');
                itemDiv.className = 'list-item';
                itemDiv.dataset.ville = row.ville;
                itemDiv.dataset.lat = row.lat;
                itemDiv.dataset.long = row.long;
                itemDiv.id = row.Nom;
                itemDiv.onclick = function(){
                    markers[row.Id].openPopup();
                    document.getElementsByClassName('toggle-switch')[0].classList.add('hidden');
                }
            
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
                title.textContent = `${row.Nom}`;
        
                itemDiv.appendChild(leftItemDiv);
                itemDiv.appendChild(righttItemDiv);
        
                righttItemDiv.appendChild(title);
        
                // Sous-titre avec code postal
                var subtitle = document.createElement('p');
                subtitle.textContent = `${row.ville} (${row.CP})`;
                righttItemDiv.appendChild(subtitle);
        
                var buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'buttonsDiv';

                if (from == "cma"){
                    var viewButton = document.createElement('button');
                    viewButton.textContent = 'VOIR LA FICHE';
                    viewButton.className="boutton-voir-la-fiche";
                    viewButton.addEventListener('click', function() {
                        var baseUrl = 'item.html';  // Remplacez par l'URL de votre page cible
                        var parameter = `${row.Id}/${row.Nom}`;
                        const newUrl = `${baseUrl}?${parameter}`;
                        window.location.href = newUrl;
                    });
                    buttonsDiv.appendChild(viewButton)
                } else if (from == "cfa"){
                    var viewButton = document.createElement('button');
                    viewButton.textContent = 'VOIR LE SITE';
                    viewButton.className="boutton-voir-la-fiche";
                    viewButton.target="_blank";
                    viewButton.onclick = function() {
                        window.open(row.site, '_blank'); // Ouvrir l'URL dans un nouvel onglet
                    };
                    buttonsDiv.appendChild(viewButton)
                }

                // Bouton "Itinéraire"
                var directionButton = document.createElement('a');
                directionButton.className="boutton-itineraire";
                directionButton.textContent = 'Itinéraire';

/*                 directionButton.href = `https://www.google.com/maps/dir/My+location/${row.lat},${row.long}`;
                directionButton.target = "_blank"; */

                var lat = encodeURIComponent(row.lat);  // Latitude de la destination
                var long = encodeURIComponent(row.long); // Longitude de la destination
                directionButton.href = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${lat},${long}`;
                directionButton.target = "_blank";  // Ouvre le lien dans un nouvel onglet

                buttonsDiv.appendChild(directionButton);
                righttItemDiv.appendChild(buttonsDiv);


                
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
    var csv;
    if (nom.includes("CMA")) {
        csv = "data/cma.csv";
    } else if (nom.includes("Centre de formation")) {
        csv = "data/cfa.csv";
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

       

        var divLogoContact = document.getElementsByClassName('logo-contacts')
        var imgContact = document.createElement('img')
        imgContact.className = "imgInfo";
        imgContact.src = 'logo/info.svg';

        divLogoContact[0].append(imgContact);

        var textContact = document.getElementsByClassName('text-contacts')[0];

        //var textContact = document.getElementsByClassName('text-contacts');

        var telHref = formatPhoneNumber(data.Telephone);

        textContact.innerHTML = `<a class="call-link" target="_blank" href="tel:${telHref}  ">${data.Telephone}</a>`;

        var divLogoAdresse = document.getElementsByClassName('logo-adresse')
        var imgAdresse = document.createElement('img')
        imgAdresse.className = "imgAdresse";
        imgAdresse.src = 'logo/location.svg';
        divLogoAdresse[0].append(imgAdresse);
        var textAdresse = document.getElementsByClassName('text-adresse');
        textAdresse[0].innerHTML = data.Adresse;

        var divLogoHoraire = document.getElementsByClassName('logo-horaires')
        var imgHoraires = document.createElement('img')
        imgHoraires.className = "imgHoraires";
        imgHoraires.src = 'logo/clock.svg';
        divLogoHoraire[0].append(imgHoraires);
        var textHoraires = document.getElementsByClassName('text-horaires');
        textHoraires[0].innerHTML = data.Horaires;

 // Initialiser la carte Leaflet
 var map = L.map('map').setView([lat, long], 11);

 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: 'OpenStreetMap'
 }).addTo(map);

 var customIcon = L.icon({
     iconUrl: 'logo/marker.svg', // Remplacez par le chemin de votre image
     iconSize: [38, 38], // Taille de l'icône
     iconAnchor: [19, 38], // Point de l'icône qui correspondra à la position du marqueur
     popupAnchor: [0, -38] // Point où la popup s'ouvre par rapport à l'icône
 });

 // Ajouter un marqueur
 L.marker([lat, long], {icon : customIcon}).addTo(map)
     .bindPopup(`Location: ${lat}, ${long}`)
        

    }
}

function handleInputEvent(event) {
    searchBar(event).catch(error => console.error('Erreur lors de la recherche:', error));
}

async function searchBar () {
    const query = searchInput.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    
    if (query.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Filtrage des villes en fonction de la recherche
    const filteredData = cities.filter(item =>
        item.label.toLowerCase().includes(query) || item.code_postale.includes(query)
    );

    if (filteredData.length > 0) {
        suggestionsContainer.style.display = 'block';
        filteredData.forEach(item => {
            var div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = `${item.label} (${item.code_postale})`;
            div.dataset.lat = item.lat; // Utilisation de 'lat'
            div.dataset.lng = item.long; // Utilisation de 'long'
            div.addEventListener('click', function() {
                var originLat = div.dataset.lat;
                var originLng = div.dataset.lng;
                var origin = `${originLat},${originLng}`;

                // Préparation des destinations
                var destinations = csvData
                    .map(city => `${city.lat},${city.long}`)
                    .join('|');
                
                // Clé API pour Distance Matrix API
                //const apiKey = 'lQTbIAMxvLyqxYvmKv6DsHN0DjXBCtojha4CNkQOIgq5nFBiFQQESU3NRT31j0lb'; 
                const apiKey = "bPQ0oykkFGiJDd9iANdxtBXvu1AjKwczfi3bctcevx3MycCvUjworn9phKIHnfz8";
                
                var url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`;
                // Envoyer la requête API
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        var distanceDivs = document.querySelectorAll('.distance-div');
                        distanceDivs.forEach(div => div.remove());
                        var dataDistance = data.rows[0].elements;
                        for (let index = 0; index < csvData.length; index++) {
                            csvData[index].ville["ville"] = csvData[index].Nom
                            var divListItem = document.getElementById(csvData[index].Nom);
                            divListItem.dataset.distance =  dataDistance[index].distance.text;
                            var distanceDiv = document.createElement('div');
                            distanceDiv.className = 'distance-div';
                            
                            distanceDiv.innerText = dataDistance[index].distance.text;
                            divListItem.append(distanceDiv);
                        }
                        var containerList = document.querySelector('.list-container');
                        var itemsList = Array.from(containerList.querySelectorAll('.list-item'));
            
                        // Trier les éléments par distance
                        itemsList.sort((a, b) => {
                            var distanceA = parseFloat(a.dataset.distance);
                            var distanceB = parseFloat(b.dataset.distance);
                            return distanceA - distanceB;
                        });

                        map.setView([itemsList[0].dataset.lat, itemsList[0].dataset.long], 9);

                        // Réorganiser les éléments dans le DOM
                        itemsList.forEach(item => containerList.appendChild(item));

                        // Traitez les données de la réponse ici
                    })
                    .catch(error => console.error('Erreur:', error));

                // Mettre à jour le champ de saisie avec le texte sélectionné
                searchInput.value = `${item.label} (${item.code_postale})`;
                // Réinitialiser les suggestions
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(div);
        });
    } else {
        suggestionsContainer.style.display = 'none';
    }
};

// Cacher les suggestions quand on clique en dehors du champ de saisie
document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

function goBack() {
    window.history.back();
}

function formatPhoneNumber(phoneNumber) {
    // Supprimer les espaces et les autres caractères non numériques
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Vérifier que le numéro a 10 chiffres
    if (cleaned.length !== 10) {
        throw new Error('Numéro de téléphone invalide');
    }

    // Ajouter l'indicatif international pour la France (+33)
    let formatted = '+33' + cleaned.substring(1);

    return formatted;
}