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

        this.totalRecolectables = 0;
        this.recolectablesRestantes = 0;
        this.fueGeneradoBoss = false;
    }

    reiniciarNivel() {
        this.puntosNivel = 0;
        this.estadoJuego = estadosJuego.normal;
        this.tiempoActivadoModoEscapando = 0;
        this.activarModoFinal = false;
        this.time = 0;
        this.recolectablesRestantes = this.totalRecolectables;
        this.fueGeneradoBoss = false;
    }

    pasarNivel() {
        if(this.nivelActual === this.ultimoNivel)
            this.nivelActual = -1; //HAS GANADO!
        else
            this.nivelActual++;

        this.estadoJuego = estadosJuego.normal;
        this.tiempoActivadoModoEscapando = 0;
        this.activarModoFinal = false;
        this.time = 0;
        this.totalRecolectables = 0;
        this.recolectablesRestantes = 0;
        this.fueGeneradoBoss = false;

        this.puntosTotal += this.puntosNivel;
        this.puntosNivel = 0;

    }

    actualizar() {
        this.tiempoActivadoModoEscapando--;

        if(this.tiempoActivadoModoEscapando == 0) {
            this.estadoJuego = estadosJuego.normal;
        }
    }

    getPuntosTotales() {
        return this.puntosNivel + this.puntosTotal;
    }

    activarModoEscapando(time, enemigos) {
        this.time = time;
        this.tiempoActivadoModoEscapando = time;
        this.estadoJuego = estadosJuego.enemigosEscapando;

        enemigos.forEach((item) => item.cambiarEstado(estados.escapando));
        this.activarModoFinal = true;
    }

    isEnableModoEscapandoFinal() {
        if(this.activarModoFinal && this.time / 3 > this.tiempoActivadoModoEscapando) {
            this.activarModoFinal = false;
            return true;
        }
        return false;
    }

    isGenerarBossFinal() {
        if(this.totalRecolectables / 2 > this.recolectablesRestantes &&
            !this.fueGeneradoBoss) {
                this.fueGeneradoBoss = true;
                return true;
        }
    }

    isGanar() {
        if(this.recolectablesRestantes == 0 && this.totalRecolectables != 0)
            return true;
        return false;
    }

}