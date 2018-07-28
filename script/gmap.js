// Objet Google Map + markers

function Maps(lattitude, longitude) {

  this.lat = lattitude, // Lattitude de la carte
  this.long = longitude, // Longitude de la carte
  this.icon = "./images/marker.png",
  this.arrayOfMarkers = [], // Array qui va stocker les markers pour le clusterer

  // Insertion de la carte Google

  this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center : {lat: this.lat, lng: this.long}, // coordonnées de la carte contenu dans l'objet Maps
      zoom : 13,
      scrollwheel : true
      });
    };


  // On donne une image différente si la station est fermée pour statusStation
  // dans les else if avec txRemplissage on affiche une icone differente en fction du nb de velo dispo par rapport au nb d'attache dispo
  
  this.imageMarker = function(statusStation, txRemplissage){
    if(statusStation === "CLOSED") {
      this.icon = "./images/VeloMarker/markerClosed.png"; // Fermée
    } 

    else if (txRemplissage === 0){
      this.icon = "./images/VeloMarker/marker00.png";
      }
    else if (txRemplissage<=0.2){
      this.icon = "./images/VeloMarker/marker02.png";
      }
    else if (txRemplissage<=0.4){
      this.icon = "./images/VeloMarker/marker04.png";
      }
    else if (txRemplissage<=0.6){
      this.icon = "./images/VeloMarker/marker06.png";
      }
    else if (txRemplissage<=0.8){
      this.icon = "./images/VeloMarker/marker08.png";
      }
    else{
          this.icon = "./images/VeloMarker/marker10.png"; // Ouverte
          }
  };

  // méthode d'intégration des markers

  this.initMarker = function(positionStation){
    marker = new google.maps.Marker({
      map : map,
      icon: this.icon,
      position : positionStation // Récupère la position passé en paramètre dans la boucle ForEach de la requête AJAX
    });
    this.arrayOfMarkers.push(marker); // Ajoute les markers dans l'array déclaré en argument au début de l'objet Maps
  };

  this.streetView = function(positionStation) {
      streetView = new google.maps.StreetViewPanorama(document.getElementById("Street"), {
      position : positionStation,
      linksControl: false,
      panControl: false
    });
  };

  this.stockMarkers = function(){
    var markerClusterer = new MarkerClusterer(map, this.arrayOfMarkers, 
            {imagePath: "./images/markers/m"});

  };

};



// OBJET STATION (API JCDECEAUX)

function Station() {

  this.nom = null,
  this.etat = null,
  this.nbVelo = null,
  this.nbAttache = null,
  this.insertionDonnees = document.getElementById("InfoStationJS").querySelectorAll("span"),

  // méthode AJAX récupération liste des stations
  this.ajaxGet = function(url, callback){
    req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function(){
      if (req.status >= 200 && req.status < 400){
        callback(req.responseText);
      }
      else{
        console.error(req.status + " " + req.statusText + " " + url);
      }
    });
    req.send(null); // Envoi de la requête
  };

  this.datas = function(data){
    this.nom = data.name;
    this.etat = data.status;
    this.nbVelo = data.available_bikes;
    this.nbAttache = data.available_bike_stands;
  };

  //insertion des données dans l'HTML

  this.insertionDonneesStation = function() {
  // Insertion des donnÃ©es dans la page
    document.getElementById("Nom").innerHTML = " <strong> NOM : </strong>  " + this.nom;
    document.getElementById("Etat").innerHTML = " <strong> ETAT : </strong>  " + ((this.etat === 'OPEN') ? 'OUVERTE': 'FERMEÉE');
    document.getElementById("Velos").innerHTML = " <strong> VELO'V DISPO : </strong>  " + this.nbVelo;
    document.getElementById("Places").innerHTML = " <strong> PLACES LIBRES : </strong>  " +this.nbAttache;
    document.getElementById("titre-canvas").innerHTML = " <strong> Confirmez votre réservation à la station : </strong>  " +this.nom;


  };

  // Gestion de l'autorisation des reservations
  this.autorisationDesReservations = function(){

    if(this.etat === "OPEN") {

      document.getElementById("Etat").style.color = "";
      document.getElementById("Velos").style.color = "";
      document.getElementsByClassName("boutton-resa")[0].style.display = "block";

        if(this.nbVelo === 0) {
          document.getElementById("Velos").style.color = "#ed283e";
          document.getElementsByClassName("boutton-resa")[0].style.display = "none";
        }

        else if(this.nbVelo>0){
          document.getElementById("Velos").style.color = "";
          document.getElementsByClassName("boutton-resa")[0].style.display = "block";
        }
    }

      else {

        // Texte en rouge
        document.getElementById("Etat").style.color = "#ed283e";
        document.getElementById("Velos").style.color = "#ed283e";
        document.getElementsByClassName("boutton-resa")[0].style.display = "none";
      }
  };


};

var velovMaps = new Maps(45.757,4.855);

var lyonStation = new Station();

// Requête Ajax qui permet de récupérer la liste des stations

lyonStation.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=fa9832e5de05b90c18bbf6cd5ccb0f24676f2fa7", function (reponse) {
  
  var listeStations = JSON.parse(reponse);

  //Debut boucle ForEach
  listeStations.forEach(function(InfoStation) {

    // Appel de la méthode pour ajout de marker ouvert ou fermé ?
    velovMaps.imageMarker(InfoStation.status, InfoStation.available_bikes/InfoStation.bike_stands); // Récupération % place dispo

    // Positionnement des markers
    velovMaps.initMarker(InfoStation.position);

    // Event sur le marker
    google.maps.event.addListener(marker, "click", function() {

      //Insertion des données dans l'objet "station" 
      lyonStation.datas(InfoStation);

      // Street View
      velovMaps.streetView(InfoStation.position);

      // Apparition du bloc "info stations"
      $('#panneau').show(100);
      document.getElementById("panneau").style.transform = "translateX(0px)";

      //insertion des données dans le bloc
      lyonStation.insertionDonneesStation();

      // Gestion des autorisation des reservations
      lyonStation.autorisationDesReservations();

    }); 
  
  }); // Fin de boucle données stations

velovMaps.stockMarkers(); // Lancement de la méthode pour stocker les markers clusterer

// Clic sur le bouton de reservation
document.getElementsByClassName("boutton-resa")[0].addEventListener("click", function(){

    document.getElementById("bg-reservation").style.display = "block";
});

console.log(listeStations);


});









  