// Slideshow accueil

function Slideshow() {

  this.slides = document.getElementsByClassName("mySlides"); // On cible les div qui contiennent les slides et les textes
  this.slideIndex = 0; // initialisation à 0 => permet de changer d'image

  this.clavier = function() {
    if(event.keyCode === 39) {
     this.slidePlus(); // Touche Droite activée
    }

    else if(event.keyCode === 37){
     this.slideMoins(); // Touche Gauche activée
    }
  };

  this.slidePlus = function() {

   this.changeSlide(+1);
  };


  this.slideMoins = function(){
    
    this.changeSlide(-1);
  };

  this.changeSlide = function(direction){

    this.slides[this.slideIndex].style.opacity = "0"; // Fait disparaître l'image actuelle
    this.slideIndex += direction;

    if(this.slideIndex <= -1){ 
      this.slideIndex = this.slides.length-1;
    } else if (this.slideIndex >= this.slides.length-1) {
      this.slideIndex = 0;
    }

    this.slides[this.slideIndex].style.opacity = "1";
  };

};

var slideshowAccueil = new Slideshow();

//flèche droite appelle la méthode "next" de l'objet Slideshow

document.getElementById("next").addEventListener("click", function() {slideshowAccueil.slidePlus()});


//flèche gauche appelle la méthode "prev" de l'objet Slideshow
document.getElementById("prev").addEventListener("click", function() {slideshowAccueil.slideMoins()});

// Gestion de l'appui et du relachement d'une touche du clavier
document.addEventListener("keydown", function() {slideshowAccueil.clavier()});

// Scroll animé au clic sur la flèche du slider jusqu'à la map
$("#book").on('click', function() {
    var body = $("html, body");
    body.stop().animate({scrollTop:$('.location').offset().top}, "500");
})




