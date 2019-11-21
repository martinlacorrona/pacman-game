var pulsaciones = []; // actuales registradas

var entradas = {}; // tipos
entradas.pulsaciones = 1;
entradas.teclado = 2;
entradas.gamepad = 3;
var entrada = entradas.pulsaciones;

var tipoPulsacion = {}; // tipos
tipoPulsacion.inicio = 1;
tipoPulsacion.mantener = 2;

var estados = {};
estados.moviendo= 2; // Incluye parado, derecha , izquierda
estados.saltando = 3;
estados.muriendo = 4;
estados.muerto = 5;
estados.disparando = 6;
estados.impactado = 7;
estados.escapando = 8;

var orientaciones = {};
orientaciones.derecha = 0;
orientaciones.izquierda = 1;
orientaciones.arriba = 2;
orientaciones.abajo = 3;
orientaciones.parado = 4;

factorRedimension = 0.35;
factorFotogramas = 3;

var estadosJuego = {};
estadosJuego.normal = 2;
estadosJuego.enemigosEscapando = 3;
