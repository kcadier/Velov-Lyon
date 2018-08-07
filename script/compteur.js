function compteur(compteurWrapper, compteurHTML, secondes, interval, stationVille, declencheur, infosStationsWrapper, canvasWrapper, countDownElt, debutReservationTitre, finReservationTitre, bouttonAnnuler) {

    this.compteurWrapper = compteurWrapper;
    this.compteurHTML = compteurHTML;
    this.countDownElt = countDownElt;
    this.secondes = secondes;
    this.interval = interval;
    this.infosStationsWrapper = infosStationsWrapper;
    this.canvasWrapper = canvasWrapper;
    this.bouttonAnnuler = bouttonAnnuler;
    this.debutReservationTitre = debutReservationTitre;
    this.finReservationTitre = finReservationTitre;
    this.minutesElt = null; //element minute qui est inséré dans l'HTML
    this.secondesElt = null; //element seconde qui est inséré dans l'HTML
    this.nomStation = null;
    this.compteARebour = null;
    this.annulationDeLaReservation = false;
    this.stationVille = stationVille;
    this.declencheur = declencheur;

    //Encapsule this dans une variable pour corriger le contexte de certaines méthodes
    var self = this;

    this.initCompteur = function () {
        self.checkSessionStorage();

        document.getElementById(this.declencheur).addEventListener("click", function () {
            signatureReservation.canvasClear();

            // Verification d'une reservation déjà existante
            if (sessionStorage.getItem("secondes")) {

                // Demande de suppression de la reservation existante
                self.reservationReset();
            } else {
                //Mise en place des sessions storage
                sessionStorage.setItem("secondes", this.secondes);
                sessionStorage.setItem("nomStation", stationVille.nom);

                //Sauvegarde la session storage du nom de la station dans l'attribut de l'objet
                self.nomStation = sessionStorage.getItem("nomStation");

                //Recache le canvas + panneau infos
                document.querySelector(self.infosStationsWrapper).style.display = "none";
                document.querySelector(self.canvasWrapper).style.display = "none";

                // Insertion du nom de la station
                document.getElementsByClassName(self.compteurWrapper)[0].style.display = "block";
                document.querySelector(self.compteurHTML).innerHTML = self.nomStation;

                self.confirmationReservation();
            }
        });
    }


    //confirmation d'une reservation
    this.confirmationReservation = function () {
        // MAJ Affichage avant le lancement
        self.majAffichageCompteur();

        // Lancement du compte à rebours avec setInterval toutes les 1sec			
        self.compteARebour = setInterval(function () {
            self.majCompteur();
        }, self.interval);
    };

    this.majAffichageCompteur = function () {
        if ((this.secondes < 600) && (this.secondes > 0)) {
            // ajoute un 0 quand un seul chiffre
            this.minutesElt = "0" + Math.floor(this.secondes / 60);
            this.secondesElt = Math.floor(this.secondes % 60);
        } else if (this.secondes <= 0) {
            this.secondesElt = "0";
            this.minutesElt = "00";
        } else {
            this.minutesElt = Math.floor(this.secondes / 60);
            this.secondesElt = Math.floor(this.secondes % 60);
        }

        if (this.secondesElt < 10) {
            this.secondesElt = "0" + this.secondesElt;
        }
        // Insertion du compteur dans l'HTML
        document.getElementById(self.countDownElt).innerHTML = this.minutesElt + " : " + this.secondesElt;
    };


    this.majCompteur = function () {


        if (this.secondes >= 0) {

            this.secondes--;
            sessionStorage.setItem("secondes", this.secondes);


        } else {
            document.getElementById(self.finReservationTitre).style.display = "block";
            document.getElementById(self.debutReservationTitre).style.display = "none";

            self.compteARebourFin = setTimeout(self.finDeLaReservation, 4500);

            clearInterval(self.compteARebour);
            // Evite de stocker la valeure de compteARebour inutilement
            self.compteARebour = null;
        }

        self.majAffichageCompteur();

        document.getElementById(self.bouttonAnnuler).addEventListener("click", function () {
            self.finDeLaReservation();
        });

    };

    this.finDeLaReservation = function () {

        self.secondes = secondes;
        self.minutesElt = null;
        self.secondesElt = null;

        sessionStorage.clear();

        // Remet l'affichage des blocs par défaut
        document.getElementsByClassName(self.compteurWrapper)[0].style.display = "none";
        document.getElementById(self.finReservationTitre).style.display = "none";
        document.getElementById(self.debutReservationTitre).style.display = "block";

        clearInterval(self.compteARebour);

    };


    this.checkSessionStorage = function () {
        if (sessionStorage.getItem("secondes")) {
            self.secondes = sessionStorage.getItem("secondes");
            self.nomStation = sessionStorage.getItem("nomStation");

            document.querySelector(self.compteurHTML).innerHTML = self.nomStation;
            document.getElementsByClassName(self.compteurWrapper)[0].style.display = "block";

            //Recache le canvas + panneau infos
           	document.querySelector(self.infosStationsWrapper).style.display = "none";
            document.querySelector(self.canvasWrapper).style.display = "none";

            //Relance le compte à rebours ou il en etait
            self.compteARebour = setInterval(function () {
                self.majCompteur();
            }, self.interval);

        } else {
            document.getElementsByClassName(self.compteurWrapper)[0].style.display = "none";
            self.secondes = secondes;
            self.minutesElt = null;
            self.secondesElt = null;
        }
    };

    this.reservationReset = function () {
        if (self.nomStation != stationVille.nom) {
            self.annulationDeLaReservation = window.confirm("Cette nouvelle réservation va annuler l'ancienne")
        } else {
            self.annulationDeLaReservation = window.confirm("Il y a déjà une réservation en cours sur cette station. \n Etes-vous sur de vouloir la supprimer ?")
        }

        if (self.annulationDeLaReservation) {

            sessionStorage.clear();
            clearInterval(self.compteARebour);

            self.secondes = secondes;
            self.minutesElt = null;
            self.secondesElt = null;

            sessionStorage.setItem("nomStation", stationVille.nom);

            //Recache le canvas + panneau infos
            document.querySelector(self.infosStationsWrapper).style.display = "none";
            document.querySelector(self.canvasWrapper).style.display = "none";
            document.querySelector(self.compteurHTML).innerHTML = stationVille.nom;


            self.confirmationReservation();
        }
    };

};

var compteurReservation = new compteur("compteurWrapper", "#texteInfoResa strong", 1200, 1000, lyonStation, "btn-valider", "#panneau", "#bg-reservation", "compteur", "ReservationOk", "FinDeReservation", "btn-annuler");

compteurReservation.initCompteur();