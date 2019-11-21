class ControladorJuego {

    constructor() {
        this.vidas = 3;
        this.puntosNivel = 0;
        this.puntosTotal = 0;
        this.nivelActual = 0;
        this.ultimoNivel = 2;

        this.estadoJuego = estadosJuego.normal;

        this.tiempoActivadoModoEscapando = 0;
    }

    reiniciarNivel() {
        this.puntosNivel = 0;
        this.estadoJuego = estadosJuego.normal;
    }

    actualizar() {
        this.tiempoActivadoModoEscapando--;

        if(this.tiempoActivadoModoEscapando == 0) {
            this.estadoJuego = estadosJuego.normal;
        }
    }

    activarModoEscapando(time) {
        this.tiempoActivadoModoEscapando = time;
        this.estadoJuego = estadosJuego.enemigosEscapando;
    }


}