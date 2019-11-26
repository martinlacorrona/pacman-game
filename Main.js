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

let fotograma = 0;

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
    for(let i=0; i < pulsaciones.length; i++){
        if ( pulsaciones[i].tipo ==  tipoPulsacion.inicio){
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}

// Cambio de escalado
window.addEventListener('load', resize, false);
window.addEventListener('resize', resize);

function resize() {
    let defaultValueCanvasWidth = 480;
    let defaultValueCanvasHeigth = 320;
    let escaladoAncho = parseFloat(window.innerWidth / defaultValueCanvasWidth);
    let escaladoAlto = parseFloat(window.innerHeight / defaultValueCanvasHeigth);

    escaladoMinimo = Math.min(escaladoAncho, escaladoAlto);

    canvas.width = defaultValueCanvasWidth*escaladoMinimo;
    canvas.height = defaultValueCanvasHeigth*escaladoMinimo;

    contexto.scale(escaladoMinimo,escaladoMinimo);
}
