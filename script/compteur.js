
var compteur = {
	minutes : 20,
	secondes : 00,
	minutesElt : null, //element minute qui est inséré dans l'HTML
	secondesElt : null, //element seconde qui est inséré dans l'HTML
	nomStation : null,
	compteARebour : null,
	compteARebourFin : null,
	annulationDeLaReservation : false,

	//confirmation d'une reservation
	confirmationReservation : function() {

		//Recache le canvas + panneau infos
		document.getElementById("panneau").style.display = "none";
		document.getElementById("bg-reservation").style.display = "none";

		// Insertion du nom de la station
		document.getElementsByClassName("compteurWrapper")[0].style.display = "block";
		document.querySelector("#texteInfoResa strong").innerHTML = Station.nom;

		// MAJ Affichage avant le lancement
		compteur.majAffichageCompteur();

		// Lancement du compte à rebours avec setInterval toutes les 1sec
		compteur.compteARebour = setInterval(compteur.majCompteur, 1000);

	},

	majAffichageCompteur : function() {
		if(compteur.minutes < 10) {
			// ajoute un 0 quand un seul chiffre
			compteur.minutesElt = "0" + compteur.minutes;
			//affiche les minutes normalement dans l'html
 		} else {
 			compteur.minutesElt = compteur.minutes;
 		}

 		if(compteur.secondes < 10) {
 			//ajoute un 0 quand un seul chiffre
 			compteur.secondesElt = "0" + compteur.secondes;
 			//Affiche les secondes normalement dans l'html
 		} else {
 			compteur.secondesElt = compteur.secondes;
 		}


		// Insertion du compteur dans l'HTML
		document.getElementById("compteur").innerHTML = compteur.minutesElt + " : " + compteur.secondesElt;

	},


	majCompteur : function() {
		
		if ((compteur.minutes >= 0) && (compteur.secondes > 0)) {

			compteur.secondes--;

		} else if((compteur.minutes > 0) && (compteur.secondes <=0)) {
			compteur.secondes = 59;
			compteur.minutes--;

		} else {
			document.getElementById("FinDeReservation").style.display = "block";
			document.getElementById("ReservationOk").style.display = "none";

			compteur.compteARebourFin = setTimeout(compteur.finDeLaReservation, 2000);
			// Arret du compte à rebours à 00:00
			clearInterval(compteur.compteARebour);
		}

		compteur.majAffichageCompteur();
	},

	finDeLaReservation: function() {

		//Reset du compteur
		compteur.minutes = 20;
		compteur.secondes = 00;
		compteur.minutesElt = null;
		compteur.secondesElt = null;

		

		// Remet l'affichage des blocs par défaut
		document.getElementsByClassName("compteurWrapper")[0].style.display = "none";
		document.getElementById("FinDeReservation").style.display = "none";
		document.getElementById("ReservationOk").style.display = "block";
		console.log("Pourquoi ça fait ça ? ");

	}

}

document.getElementById("btn-valider").addEventListener("click", function() {
	compteur.confirmationReservation();
	signatureCanvas.canvasClear();
})