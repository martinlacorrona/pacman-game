class ControladorAudio {
    constructor() {
        this.comerSemillaPlaying = false;
        this.escapandoPlaying = false;
        this.comerEnemigoPlaying = false;
        this.perderPlaying = false;
        this.perderPartidaPlaying = false;

        this.audioEscapando = new Audio(sonidos.pacman_modoEscapando);
        this.audioPerderPartida = new Audio(sonidos.perderPartida);
    }

    async playComerSemilla() {
        if(!this.comerSemillaPlaying) {
            this.comerSemillaPlaying = true;
            let audio = new Audio(sonidos.pacman_comeRecolectable);
            await audio.play();
            audio.onended = () => {this.comerSemillaPlaying = false;}
        }
    }

    async playEscapando() {
        if(!this.escapandoPlaying) {
            this.escapandoPlaying = true;
            this.audioEscapando.load();
            await this.audioEscapando.play();
            this.audioEscapando.onended = () => {this.escapandoPlaying = false;}
        }
    }

    async stopEscapando() {
        this.audioEscapando.pause();
        this.escapandoPlaying = false;
    }

    async playComerEnemigo() {
        if(!this.comerEnemigoPlaying) {
            this.comerEnemigoPlaying = true;
            let audio = new Audio(sonidos.pacman_comeEnemigo);
            await audio.play();
            audio.onended = () => {this.comerEnemigoPlaying = false;}
        }
    }

    async playComerVida() {
        new Audio(sonidos.pacman_comeVida).play();
    }

    async playComerBala() {
        new Audio(sonidos.pacman_eatingBala).play();
    }

    async playGenerarEnemigoBoss() {
        new Audio(sonidos.boss_generado).play();
    }

    async playGanar() {
        new Audio(sonidos.ganar).play();
    }

    async playPasarNivel() {
        new Audio(sonidos.pasarNivel).play();
    }

    async playPerder() {
        if(!this.perderPlaying) {
            this.perderPlaying = true;
            let audio = new Audio(sonidos.perder);
            await audio.play();
            audio.onended = () => {this.perderPlaying = false;}
        }
    }

    async playPerderPartida() {
        if(!this.perderPartidaPlaying) {
            this.perderPartidaPlaying = true;
            this.audioPerderPartida.load();
            await this.audioPerderPartida.play();
            this.audioPerderPartida.onended = () => {this.perderPartidaPlaying = false;}
        }
    }

    async stopPerderPartida() {
        this.audioPerderPartida.pause();
        this.perderPartidaPlaying = false;
    }

    async playDisparar() {
        new Audio(sonidos.disparar).play();
    }
}