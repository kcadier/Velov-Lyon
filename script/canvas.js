// Script pour le Canvas de signature (tuto ref : https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/)

var signatureCanvas = {
    

    mouseDown: 0, // bouton gauche de la souris relaché par defaut

    // propriété de tracking de la position tactile
    touchX: 0,
    touchY: 0,

    lastX: null, // stock les valeurs de lastX et lastY pour pouvoir relier avec lineTo sur les valeurs actuels pour dessiner un trait
    lastY: null, // ici "null" car on ne sait pas d'ou partira la premiere ligne


    // Methode d'initialisation du Canvas + gestion des evenements declenches
    initCanvas: function () {
        signatureCanvas.context = document.getElementById('canvas').getContext('2d'); // On accede au contexte du Canvas
        document.getElementById('btn-valider').style.display = "none"; // on cache le bouton de validation à l'initialisation comme le canvas est vide
        
        var canvas = document.getElementById('canvas'); // on stock le canvas dans une variable 'canvas'
        
        canvas.addEventListener("mousedown", function (e) {
            signatureCanvas.sketchpad_mouseDown(e)
        });
        document.body.addEventListener("mouseup", function (e){ // Le add event listener est sur le body cette fois, pour qu'on voit si le bouton est relaché en dehors du canvas
            signatureCanvas.sketchpad_mouseUp(e)
        });
        canvas.addEventListener("mousemove", function (e){
            signatureCanvas.sketchpad_mouseMove(e)
        });
        canvas.addEventListener("touchstart", function (e){
            signatureCanvas.sketchpad_touchStart(e)
        });
        document.body.addEventListener("touchend", function (e){
            signatureCanvas.sketchpad_touchEnd(e)
        });
        canvas.addEventListener("touchmove", function (e){
            signatureCanvas.sketchpad_touchMove(e)
        });

        // Au clic sur le bouton effacer, on netoit le canvas à partir du point x:0 et y:0 du canvas et sur toute sa hauteur et largeur
        //document.getElementById('btn-effacer').addEventListener("click", function() {
            //signatureCanvas.canvasClear();
        //});

    },

    drawLine: function (ctx, x, y, size) {
// Si lastX et lastY sont "null", on les définie à la position actuelle => 1ere fois que cette fonction est appellée
        if (signatureCanvas.lastX === null) { 
            signatureCanvas.lastX = x;
            signatureCanvas.lastY = y;
        }
 
        ctx.strokeStyle = "#1e48cf"; // couleur ligne
        ctx.lineCap = "round"; // extremite de la ligne

        ctx.beginPath();

        ctx.moveTo(signatureCanvas.lastX, signatureCanvas.lastY);

        ctx.lineTo(x, y);

        ctx.lineWidth = size;
        ctx.stroke();

        ctx.closePath();

        //Met la dernière position comme référence à la position actuelle
        signatureCanvas.lastX = x;
        signatureCanvas.lastY = y;

        // Le canvas n'est plus vide, affiche donc le bouton "valider"
        document.getElementById('btn-valider').style.display = "block";
    },


    // Methodes de tracking des evenements de la souris

    // Activé quand le bouton gauche de la souris est enfoncé
    sketchpad_mouseDown: function () {
        signatureCanvas.mouseDown = 1;
        signatureCanvas.drawLine(signatureCanvas.context, signatureCanvas.mouseX, signatureCanvas.mouseY, 3);
    },

    // Activé quand le bouton gauche de la souris est relaché
    sketchpad_mouseUp: function () {
        signatureCanvas.mouseDown = 0;
        signatureCanvas.lastX = null; // Reset de lastX et lastY => pour ne pas que la prochaine fois que l'on dessine ça reprenne le trait ou il s'etait arrété
        signatureCanvas.lastY = null;
    },

    // Activé à chaque fois que la souris est déplacé, à condition que le bouton gauche de la souris soit enfoncée
    sketchpad_mouseMove: function (e) {
        if (signatureCanvas.mouseDown === 1) {
            signatureCanvas.drawLine(signatureCanvas.context, e.offsetX*1, e.offsetY*1, 3);
        }
    },

    // Gestion des evenements tactiles 
    sketchpad_touchStart: function (e) {
        signatureCanvas.drawLine(signatureCanvas.context, e.offsetX * 1, e.offsetY * 1, 3);
        event.preventDefault(); // Evite que l'evenement mouseDown soit généré en plus de celui-ci
    },

    sketchpad_touchEnd: function () {
        signatureCanvas.lastX = null; // Reset de lastX et lastY pour indiquer qu'ils sont maintenant invalides
        signatureCanvas.lastY = null;
    },

    sketchpad_touchMove: function (e) {
        event.preventDefault(); // Evite de lancer un evenement de scroll comme resultat de l'evenement touchMove

        e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft; // calcul la position du curseur dans le canvas par rapport à la page
        e.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
        signatureCanvas.drawLine(signatureCanvas.context, e.offsetX * 1, e.offsetY * 1, 3);
    },

    canvasClear : function(){
        signatureCanvas.context.clearRect(0, 0, document.getElementById("canvas").width, document.getElementById('canvas').height);
        // Comme le canvas est vide, on re cache le bouton valider
        document.getElementById('btn-valider').style.display = "none";

    }

};

// On lance initCanvas qui appelle toutes les autres méthodes en fonction des evenements declenches
signatureCanvas.initCanvas()

// Au clic sur le bouton effacer, on netoit le canvas à partir du point x:0 et y:0 du canvas et sur toute sa hauteur et largeur
document.getElementById('btn-effacer').addEventListener("click", function() {
signatureCanvas.canvasClear();
});