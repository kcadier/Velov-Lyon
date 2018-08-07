// Objet Google Map + markers

function Maps(lattitude, longitude, zoom) {

    this.lat = lattitude; // Lattitude de la carte
    this.long = longitude; // Longitude de la carte
    this.zoom = zoom;
    this.icon = "";
    this.arrayOfMarkers = []; // Array qui va stocker les markers pour le clusterer

    // Insertion de la carte Google

    this.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: this.lat,
                lng: this.long
            }, // coordonnées de la carte contenu dans l'objet Maps
            zoom: this.zoom,
            scrollwheel: true
        });
    };


    // On donne une image différente si la station est fermée pour statusStation
    // dans les else if avec txRemplissage on affiche une icone differente en fction du nb de velo dispo par rapport au nb d'attache dispo

    this.imageMarker = function (statusStation, txRemplissage) {
        if (statusStation === "CLOSED") {
            this.icon = "./images/veloMarker/markerClosed.png"; // Fermée
        } else if (txRemplissage === 0) {
            this.icon = "./images/veloMarker/marker00.png";
        } else if (txRemplissage <= 0.2) {
            this.icon = "./images/veloMarker/marker02.png";
        } else if (txRemplissage <= 0.4) {
            this.icon = "./images/veloMarker/marker04.png";
        } else if (txRemplissage <= 0.6) {
            this.icon = "./images/veloMarker/marker06.png";
        } else if (txRemplissage <= 0.8) {
            this.icon = "./images/veloMarker/marker08.png";
        } else {
            this.icon = "./images/veloMarker/marker10.png"; // Ouverte
        }
    };

    // méthode d'intégration des markers
    this.initMarker = function (positionStation) {
        marker = new google.maps.Marker({
            map: map,
            icon: this.icon,
            position: positionStation // Récupère la position passé en paramètre dans la boucle ForEach de la requête AJAX
        });
        this.arrayOfMarkers.push(marker); // Ajoute les markers dans l'array déclaré en argument au début de l'objet Maps
    };

    this.streetView = function (positionStation) {
        streetView = new google.maps.StreetViewPanorama(document.getElementById("Street"), {
            position: positionStation,
            linksControl: false,
            panControl: false
        });

    };

    this.stockMarkers = function () {
        var markerClusterer = new MarkerClusterer(map, this.arrayOfMarkers, {
            imagePath: "./images/markers/m"
        });

    };
};


// OBJET STATION (API JCDECEAUX)

function Station(lienRequeteAjax, mapCible, idNomHtml, idEtatHtml, idNbVeloHtml, idNbAttacheHtml, idTitreDuCanvas, canvasWrapper, infosStationsWrapper, reservationBoutton) {

    this.lienRequeteAjax = lienRequeteAjax;
    this.mapCible = mapCible;
    this.nomHtml = idNomHtml;
    this.etatHtml = idEtatHtml;
    this.nbVeloHtml = idNbVeloHtml;
    this.reservationBoutton = reservationBoutton;
    this.nbAttacheHtml = idNbAttacheHtml;
    this.titreDuCanvas = idTitreDuCanvas;
    this.canvasWrapper = canvasWrapper;
    this.infosStationsWrapper = infosStationsWrapper;
    this.nom = null;
    this.etat = null;
    this.nbVelo = null;
    this.nbAttache = null;

    var self = this;

    this.initStation = function () {

        self.ajaxGet(this.lienRequeteAjax, function (reponse) {

            var listeStations = JSON.parse(reponse);

            //----------------------------   DEBUT BOUCLE FOREACH --------------------------- 

            listeStations.forEach(function (InfoStation) {

                // Appel de la méthode pour ajout de marker ouvert ou fermé ?
                self.mapCible.imageMarker(InfoStation.status, InfoStation.available_bikes / InfoStation.bike_stands); // Récupération % place dispo pour les markers. Renvoi un chiffre compris entre 0 et 1

                // Positionnement des markers
                self.mapCible.initMarker(InfoStation.position);

                // Lancé lors d'un clic sur l'un des markers
                google.maps.event.addListener(marker, "click", function () {

                    //Insertion des données dans l'objet "station" 
                    self.datas(InfoStation);

                    // Street View
                    self.mapCible.streetView(InfoStation.position);

                    document.getElementById(self.infosStationsWrapper).style.display = "block";
                    document.getElementById(self.infosStationsWrapper).style.transform = "translateX(0px)";

                    //insertion des données dans le bloc
                    self.insertionDonneesStation();

                    // Gestion des autorisation des reservations
                    self.autorisationDesReservations();
                });
            });
            //-------------------- FIN BOUCLE ------------------------------

            self.mapCible.stockMarkers(); // Lancement de la méthode pour stocker les markers clusterer

            // Clic sur le bouton de reservation
            document.getElementsByClassName(self.reservationBoutton)[0].addEventListener("click", function () {
                document.getElementById(self.canvasWrapper).style.display = "block";
            });
        });
    }

    // méthode AJAX récupération liste des stations
    this.ajaxGet = function (url, callback) {
        req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.send(null); // Envoi de la requête
    };

    this.datas = function (data) {
        this.nom = data.name;
        this.etat = data.status;
        this.nbVelo = data.available_bikes;
        this.nbAttache = data.available_bike_stands;
    };

    //insertion des données dans l'HTML

    this.insertionDonneesStation = function () {
        // Insertion des donnÃ©es dans la page
        document.getElementById(self.nomHtml).innerHTML = " <strong> NOM&nbsp;: </strong>  " + this.nom;
        document.getElementById(self.etatHtml).innerHTML = " <strong> ETAT&nbsp;: </strong>  " + ((this.etat === 'OPEN') ? 'OUVERTE' : 'FERMEÉE');
        document.getElementById(self.nbVeloHtml).innerHTML = " <strong> VELO'V DISPO&nbsp;: </strong>  " + this.nbVelo;
        document.getElementById(self.nbAttacheHtml).innerHTML = " <strong> PLACES LIBRES&nbsp;: </strong>  " + this.nbAttache;
        document.getElementById(self.titreDuCanvas).innerHTML = " <strong> Confirmez votre réservation à la station&nbsp;: </strong>  " + this.nom;


    };

    // Gestion de l'autorisation des reservations
    this.autorisationDesReservations = function () {

        if (this.etat === "OPEN") {

            document.getElementById(self.etatHtml).style.color = "";
            document.getElementById(self.nbVeloHtml).style.color = "";
            document.getElementsByClassName(self.reservationBoutton)[0].style.display = "block";

            if (this.nbVelo === 0) {
                document.getElementById(self.nbVeloHtml).style.color = "#ed283e";
                document.getElementsByClassName(self.reservationBoutton)[0].style.display = "none";
            } else if (this.nbVelo > 0) {
                document.getElementById(self.nbVeloHtml).style.color = "";
                document.getElementsByClassName(self.reservationBoutton)[0].style.display = "block";
            }
        } else {

            // Texte en rouge
            document.getElementById(self.etatHtml).style.color = "#ed283e";
            document.getElementById(self.nbVeloHtml).style.color = "#ed283e";
            document.getElementsByClassName(self.reservationBoutton)[0].style.display = "none";
        }
    };

  this.initStation();
};

var velovMaps = new Maps(45.757, 4.855, 13);

var lyonStation = new Station("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=fa9832e5de05b90c18bbf6cd5ccb0f24676f2fa7", velovMaps, "Nom", "Etat", "Velos", "Places", "titre-canvas", "bg-reservation", "panneau", "boutton-resa");
