class BloqueTeletransporteDerecha extends BloqueTeletransporte {

    constructor(x, y) {
        super(x, y);
    }

    getPosXTeletransporte() {
        return this.bloqueToTeleport.x - this.ancho;
    }

    getPosYTeletransporte() {
        return this.y;
    }
}