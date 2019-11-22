class ControladorJuego {

    constructor() {
        this.vidas = 3;
        this.puntosNivel = 0;
        this.puntosTotal = 0;
        this.nivelActual = 0;
        this.ultimoNivel = 2;

        this.estadoJuego = estadosJuego.normal;

        this.tiempoActivadoModoEscapando = 0;

        this.activarModoFinal = false;

        this.time = 0;
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

    activarModoEscapando(time, enemigos) {
        this.time = time;
        this.tiempoActivadoModoEscapando = time;
        this.estadoJuego = estadosJuego.enemigosEscapando;

        enemigos.forEach((item) => item.cambiarEstado(estados.escapando));
        this.activarModoFinal = true;
        console.log("acivado modo escapando");
    }

    isEnableModoEscapandoFinal() {
        if(this.activarModoFinal && this.time / 3 > this.tiempoActivadoModoEscapando) {
            this.activarModoFinal = false;
            console.log("activado modo escapando final")
            return true;
        }
        return false;
    }


}