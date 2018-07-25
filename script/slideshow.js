// Slideshow accueil

var Slideshow = {

  slides : document.getElementsByClassName("mySlides"), // On cible les div qui contiennent les slides et les textes
  slideIndex : 0, // initialisation à 0 => permet de changer d'image

  clavier : function(e) {
    if(e.keyCode === 39) {
      this.slidePlus(); // Touche Droite activée
    }

    else if(e.keyCode === 37){
      this.slideMoins(); // Touche Gauche activée
    }
  },

  slidePlus : function(){

   this.changeSlide(+1);
  },


  slideMoins : function(){
    
    this.changeSlide(-1);
  },

  changeSlide : function(direction){

    this.slides[this.slideIndex].style.opacity = "0"; // Fait disparaître l'image actuelle
    this.slideIndex += direction;

    if(this.slideIndex <= -1){ 
      this.slideIndex = this.slides.length-1;
    } else if (this.slideIndex >= this.slides.length-1) {
      this.slideIndex = 0;
    }

    this.slides[this.slideIndex].style.opacity = "1";
  }

};

//flèche droite appelle la méthode "next" de l'objet Slideshow

document.getElementById("next").addEventListener("click", Slideshow.slidePlus.bind(Slideshow));


//flèche gauche appelle la méthode "prev" de l'objet Slideshow
document.getElementById("prev").addEventListener("click", Slideshow.slideMoins.bind(Slideshow));

// Gestion de l'appui et du relachement d'une touche du clavier
document.addEventListener("keydown", Slideshow.clavier.bind(Slideshow));

// Scroll animé au clic sur la flèche du slider jusqu'à la map
$("#book").on('click', function() {
    var body = $("html, body");
    body.stop().animate({scrollTop:$('.location').offset().top}, "500");
})




