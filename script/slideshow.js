// Slider Tutoriel Velo'v App

function Slideshow(arrayOfSlides, buttonPrev, buttonNext) {

    this.slides = document.getElementsByClassName(arrayOfSlides); // On cible les div qui contiennent les slides et les textes
    this.slideIndex = 0; // initialisation à l'index 0 => permettra de changer d'image
    this.buttonPrev = buttonPrev;
    this.buttonNext = buttonNext;

    var self = this;

        //Clic sur l'icon flèche droite appelle la méthode SlidePlus de l'objet
        document.getElementById(this.buttonNext).addEventListener("click", function () {
            self.slidePlus()
        });


        //Clic sur l'icon flèche gauche appelle la méthode SlideMoins de l'objet Slideshow
        document.getElementById(this.buttonPrev).addEventListener("click", function () {
            self.slideMoins()
        });

        // Gestion de l'appui et du relachement d'une touche du clavier
        document.addEventListener("keydown", function () {
            self.clavier()
        });

        // Scroll animé au clic sur la flèche du slider jusqu'à la map
        $("#book").click(function () {
            var body = $("html, body");
            body.stop().animate({
                scrollTop: $('.location').offset().top
            }, "500");
        });

    this.clavier = function () {
        if (event.keyCode === 39) {
            this.slidePlus(); // Si la touche Droite est activée, lance la méthode slidePlus
        } else if (event.keyCode === 37) {
            this.slideMoins(); // Si la touche Gauche est activée, lance la méthode slideMoins
        }
    };

    this.slidePlus = function () {
        this.changeSlide(+1); 
    };


    this.slideMoins = function () {
        this.changeSlide(-1);
    };

    this.changeSlide = function (direction) {

        this.slides[this.slideIndex].style.opacity = "0"; // Fait disparaître l'image actuelle
        this.slideIndex += direction; //Ajoute +1 ou -1 au slideIndex

        //Si quand SlideMoins activé il n'y a plus de Slide, retourne à la dernière Slide
        if (this.slideIndex <= -1) {
            this.slideIndex = this.slides.length-1;
        // Si quand SlidePlus est activé, il n'y a plus de Slide, retourne à la première Slide
        } else if (this.slideIndex >= this.slides.length) {
            this.slideIndex = 0;
        }
        // Fait apparaître le nouveau Slide
        this.slides[this.slideIndex].style.opacity = "1";
    };

};

var slideshowAccueil = new Slideshow("mySlides", "prev", "next");
