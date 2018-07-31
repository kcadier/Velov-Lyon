// Script pour le Canvas de signature (tuto ref : https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/)

function signatureCanvas(canvasWrapper, validationButton, clearButton, lineColor, lineWidth, lineCap) {

    this.canvasWrapper = canvasWrapper;
    this.validationButton = validationButton;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.clearButton = clearButton;
    this.mouseDown = 0; // bouton gauche de la souris relaché par defaut
    this.lineCap = lineCap;

    // propriété de tracking de la position tactile
    this.touchX = 0;
    this.touchY = 0;

    this.lastX = null; // stock les valeurs de lastX et lastY pour pouvoir relier avec lineTo sur les valeurs actuels pour dessiner un trait
    this.lastY = null; // ici "null" car on ne sait pas d'ou partira la premiere ligne

    var self = this;
    // Methode d'initialisation du Canvas + gestion des evenements declenches

    this.initCanvas = function () {
        self.context = document.getElementById(self.canvasWrapper).getContext('2d'); // On accede au contexte du Canvas
        document.getElementById(self.validationButton).style.display = "none"; // on cache le bouton de validation à l'initialisation comme le canvas est vide

        var canvas = document.getElementById(self.canvasWrapper); // on stock le canvas dans une variable 'canvas'

        canvas.addEventListener("mousedown", function (e) {
            self.sketchpad_mouseDown(e)
        });
        document.body.addEventListener("mouseup", function (e) { // Le add event listener est sur le body cette fois, pour qu'on voit si le bouton est relaché en dehors du canvas
            self.sketchpad_mouseUp(e)
        });
        canvas.addEventListener("mousemove", function (e) {
            self.sketchpad_mouseMove(e)
        });
        canvas.addEventListener("touchstart", function (e) {
            self.sketchpad_touchStart(e)
        });
        document.body.addEventListener("touchend", function (e) {
            self.sketchpad_touchEnd(e)
        });
        canvas.addEventListener("touchmove", function (e) {
            self.sketchpad_touchMove(e)
        });

        // Au clic sur le bouton effacer, on netoit le canvas à partir du point x:0 et y:0 du canvas et sur toute sa hauteur et largeur
        document.getElementById(self.clearButton).addEventListener("click", function () {
            self.canvasClear();
        });

    };

    this.drawLine = function (ctx, x, y, size) {
        // Si lastX et lastY sont "null", on les définie à la position actuelle => 1ere fois que cette fonction est appellée
        if (self.lastX === null) {
            self.lastX = x;
            self.lastY = y;
        }

        ctx.strokeStyle = self.lineColor; // couleur ligne
        ctx.lineCap = self.lineCap; // extremite de la ligne

        ctx.beginPath();

        ctx.moveTo(self.lastX, self.lastY);

        ctx.lineTo(x, y);

        ctx.lineWidth = size;

        ctx.stroke();

        ctx.closePath();

        //Met la dernière position comme référence à la position actuelle
        self.lastX = x;
        self.lastY = y;

        // Le canvas n'est plus vide, affiche donc le bouton "valider"
        document.getElementById(self.validationButton).style.display = "block";
    };


    // Methodes de tracking des evenements de la souris

    // Activé quand le bouton gauche de la souris est enfoncé
    this.sketchpad_mouseDown = function () {
        self.mouseDown = 1;
        self.drawLine(self.context, self.mouseX, self.mouseY, self.lineWidth);
    };

    // Activé quand le bouton gauche de la souris est relaché
    this.sketchpad_mouseUp = function () {
        self.mouseDown = 0;
        self.lastX = null; // Reset de lastX et lastY => pour ne pas que la prochaine fois que l'on dessine ça reprenne le trait ou il s'etait arrété
        self.lastY = null;
    };

    // Activé à chaque fois que la souris est déplacé, à condition que le bouton gauche de la souris soit enfoncée
    this.sketchpad_mouseMove = function (e) {
        if (self.mouseDown === 1) {
            self.drawLine(self.context, e.offsetX * 1, e.offsetY * 1, self.lineWidth);
        }
    };

    // Gestion des evenements tactiles 
    this.sketchpad_touchStart = function (e) {
        self.drawLine(self.context, e.offsetX * 1, e.offsetY * 1, self.lineWidth);
        event.preventDefault(); // Evite que l'evenement mouseDown soit généré en plus de celui-ci
    };

    this.sketchpad_touchEnd = function () {
        self.lastX = null; // Reset de lastX et lastY pour indiquer qu'ils sont maintenant invalides
        self.lastY = null;
    };

    this.sketchpad_touchMove = function (e) {
        event.preventDefault(); // Evite de lancer un evenement de scroll comme resultat de l'evenement touchMove

        e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft; // calcul la position du curseur dans le canvas par rapport à la page
        e.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
        self.drawLine(self.context, e.offsetX * 1, e.offsetY * 1, self.lineWidth);
    };

    this.canvasClear = function () {
        self.context.clearRect(0, 0, document.getElementById(self.canvasWrapper).width, document.getElementById(self.canvasWrapper).height);
        // Comme le canvas est vide, on re cache le bouton valider
        document.getElementById(self.validationButton).style.display = "none";

    };

};

var signatureReservation = new signatureCanvas("canvas", "btn-valider", "btn-effacer", "#1e48cf", 3.5, "round");

signatureReservation.initCanvas();
