class ControladorAudio {
    constructor() {
        this.comerSemillaPlaying = false;
    }

    async playComerSemilla() {
        if(!this.comerSemillaPlaying) {
            this.comerSemillaPlaying = true;
            let audio = new Audio(sonidos.pacman_comeRecolectable);
            await audio.play();
            audio.onended = () => {this.comerSemillaPlaying = false;}
        }
    }
}