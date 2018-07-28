
function compteur(secondes, interval) {

	this.secondes = secondes;
	this.interval = interval;
	this.minutesElt = null; //element minute qui est inséré dans l'HTML
	this.secondesElt = null; //element seconde qui est inséré dans l'HTML
	this.nomStation = null;
	this.compteARebour = null;
	this.compteARebourFin = null;
	this.annulationDeLaReservation = false;

	var self = this;


	//confirmation d'une reservation
	this.confirmationReservation = function() {

		//Recache le canvas + panneau infos
		document.getElementById("panneau").style.display = "none";
		document.getElementById("bg-reservation").style.display = "none";

		// Insertion du nom de la station
		document.getElementsByClassName("compteurWrapper")[0].style.display = "block";
		document.querySelector("#texteInfoResa strong").innerHTML = lyonStation.nom;

		// MAJ Affichage avant le lancement
		this.majAffichageCompteur();

		// Lancement du compte à rebours avec setInterval toutes les 1sec
		
		this.compteARebour = setInterval(function () {
			self.majCompteur();
		}, this.interval);

	};

	this.majAffichageCompteur = function() {
		if((this.secondes < 600) && (this.secondes>0)) {
			// ajoute un 0 quand un seul chiffre
			this.minutesElt = "0" + Math.floor(this.secondes/60);
			this.secondesElt = Math.floor(this.secondes%60);
 		} 

 		else if(this.secondes<=0)
 		{
 			this.secondesElt = "0";
 			this.minutesElt = "00";
 		}

 		else {
 			this.minutesElt = Math.floor(this.secondes/60);
 			this.secondesElt = Math.floor(this.secondes%60);
 		} 

 		if(this.secondesElt <10){
 			this.secondesElt = "0" + this.secondesElt;
 		}
		// Insertion du compteur dans l'HTML
		document.getElementById("compteur").innerHTML = this.minutesElt + " : " + this.secondesElt;

	};


	this.majCompteur = function() {

		
		if (this.secondes >= 0) {

			this.secondes--;

		} else {
			document.getElementById("FinDeReservation").style.display = "block";
			document.getElementById("ReservationOk").style.display = "none";

			this.compteARebourFin = setTimeout(this.finDeLaReservation, 3000);
			// Arret du compte à rebours à 00:00
			clearInterval(this.compteARebour);
		}

		//console.log(self);

		self.majAffichageCompteur();
				
		
	};

	this.finDeLaReservation = function() {

		//Reset du compteur
		self.secondes = secondes;
		self.minutesElt = null;
		self.secondesElt = null;
		console.log(self);	

		// Remet l'affichage des blocs par défaut
		document.getElementsByClassName("compteurWrapper")[0].style.display = "none";
		document.getElementById("FinDeReservation").style.display = "none";
		document.getElementById("ReservationOk").style.display = "block";
	};

}

var compteurReservation = new compteur(1200,1000);

document.getElementById("btn-valider").addEventListener("click", function() {
	compteurReservation.confirmationReservation();
	signatureCanvas.canvasClear();
})

document.getElementById("btn-annuler").addEventListener("click", function() {
	compteurReservation.finDeLaReservation();
})