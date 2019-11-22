class DisparoJugador extends Disparo {

    constructor(x, y) {
        super(x, y, imagenes.disparo_jugador);
        this.vx = 9 / factorFotogramas;
        this.vy = 0;

        this.defaultVx = 9;
        this.defaultVy = 9;
    }
}
