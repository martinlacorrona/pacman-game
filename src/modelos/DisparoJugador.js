class DisparoJugador extends Disparo {

    constructor(x, y) {
        super(x, y, imagenes.disparo_jugador2)
        this.vx = 9;
        this.vy = 0;

        this.defaultVx = 9;
        this.defaultVy = 9;
    }
}
