// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

// Controles
var controles = {};


// Capas
var layer;
var gameLayer;
var menuLayer;

var fotograma = 0;

// Inicio capas y bucle del juego
function iniciarJuego() {
    menuLayer = new MenuLayer();
    layer = menuLayer;
    setInterval(loop, 1000 / (30 * factorFotogramas));
}



function loop(){
    //Para que solo haga 30 fotogramas, aunque el resto se actualice cada menos
    if((fotograma + 0.0) % factorFotogramas == 0) {
        this.layer.dibujar();
    }
    fotograma++;

    layer.actualizar();
    if (entrada == entradas.pulsaciones) {
        layer.calcularPulsaciones(pulsaciones);
    }
    layer.procesarControles();

    actualizarPulsaciones();
}

function actualizarPulsaciones () {
    for(var i=0; i < pulsaciones.length; i++){
        if ( pulsaciones[i].tipo ==  tipoPulsacion.inicio){
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}

// Cambio de escalado
window.addEventListener('load', resize, false);

function resize() {
    console.log("Resize")
    var escaladoAncho = parseFloat(window.innerWidth / canvas.width);
    var escaladoAlto = parseFloat(window.innerHeight / canvas.height);

    escaladoMinimo = Math.min(escaladoAncho, escaladoAlto);

    canvas.width = canvas.width*escaladoMinimo;
    canvas.height = canvas.height*escaladoMinimo;

    contexto.scale(escaladoMinimo,escaladoMinimo);
}
