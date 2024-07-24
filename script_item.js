var paramsURL = getUrlParameters();
var id = Object.keys(paramsURL)[0];
var nom = paramsURL[id];
var lat;
var long;

initializeMap(id, nom);






