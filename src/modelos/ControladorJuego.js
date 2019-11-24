class ControladorJuego {

    constructor() {
        this.reiniciarControlador();

        this.arrayBloquesNiveles =
            [imagenes.bloque_basico, imagenes.bloque_basico2, imagenes.bloque_basico3];
    }

    reiniciarControlador() {
        this.vidas = 3;
        this.vidasNivel = 0;
        this.puntosNivel = 0;
        this.puntosTotal = 0;
        this.nivelActual = 0;
        this.ultimoNivel = ultimoNivel;

        this.estadoJuego = estadosJuego.normal;

        this.tiempoActivadoModoEscapando = 0;

        this.activarModoFinal = false;

        this.time = 0;
        this.fueGeneradoBoss = false;
    }

    reiniciarNivel() {
        this.puntosNivel = 0;
        this.vidasNivel = 0;
        this.estadoJuego = estadosJuego.normal;
        this.tiempoActivadoModoEscapando = 0;
        this.activarModoFinal = false;
        this.time = 0;
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

        this.vidas += this.vidasNivel;
        this.vidasNivel = 0;

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

    activarModoEscapando(time, enemigos, enemigosBoss) {
        this.time = time;
        this.tiempoActivadoModoEscapando = time;
        this.estadoJuego = estadosJuego.enemigosEscapando;

        enemigos.forEach((item) => item.cambiarEstado(estados.escapando));
        enemigosBoss.forEach((item) => {
            if (item.estado != estados.esperando && !item.isInvencible())
                item.cambiarEstado(estados.escapando)
        });
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
            !this.fueGeneradoBoss && this.totalRecolectables != 0) {
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