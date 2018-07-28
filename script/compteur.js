
function compteur() {
	this.minutes = 20;
	this.secondes = 00;
	this.minutesElt = null; //element minute qui est inséré dans l'HTML
	this.secondesElt = null; //element seconde qui est inséré dans l'HTML
	this.nomStation = null;
	this.compteARebour = null;
	this.compteARebourFin = null;
	this.annulationDeLaReservation = false;

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
		this.compteARebour = setInterval(this.majCompteur, 1000);

	};

	this.majAffichageCompteur = function() {
		if(this.minutes < 10) {
			// ajoute un 0 quand un seul chiffre
			this.minutesElt = "0" + this.minutes;
			//affiche les minutes normalement dans l'html
 		} else {
 			this.minutesElt = this.minutes;
 		}

 		if(this.secondes < 10) {
 			//ajoute un 0 quand un seul chiffre
 			this.secondesElt = "0" + this.secondes;
 			//Affiche les secondes normalement dans l'html
 		} else {
 			this.secondesElt = this.secondes;
 		}

		// Insertion du compteur dans l'HTML
		document.getElementById("compteur").innerHTML = this.minutesElt + " : " + this.secondesElt;

	};


	this.majCompteur = function() {
		
		if ((this.minutes >= 0) && (this.secondes > 0)) {

			this.secondes--;

		} else if((this.minutes > 0) && (this.secondes <=0)) {
			this.secondes = 59;
			this.minutes--;

		} else {
			document.getElementById("FinDeReservation").style.display = "block";
			document.getElementById("ReservationOk").style.display = "none";

			this.compteARebourFin = setTimeout(this.finDeLaReservation, 2000);
			// Arret du compte à rebours à 00:00
			clearInterval(this.compteARebour);
		}
			console.log(this);	
			this.majAffichageCompteur(); // <<<------------------------ C'est ici que le 'this' cible window, alors que tous les autres this dans les méthodes cibles bien l'objet, je ne comprends pas la logique !!!
				
		
	};

	this.finDeLaReservation = function() {

		//Reset du compteur
		this.minutes = 20;
		this.secondes = 00;
		this.minutesElt = null;
		this.secondesElt = null;		

		// Remet l'affichage des blocs par défaut
		document.getElementsByClassName("compteurWrapper")[0].style.display = "none";
		document.getElementById("FinDeReservation").style.display = "none";
		document.getElementById("ReservationOk").style.display = "block";
	};

}

var compteurReservation = new compteur();

document.getElementById("btn-valider").addEventListener("click", function() {
	compteurReservation.confirmationReservation();
	signatureCanvas.canvasClear();
})

document.getElementById("btn-annuler").addEventListener("click", function() {
	compteurReservation.finDeLaReservation();
})