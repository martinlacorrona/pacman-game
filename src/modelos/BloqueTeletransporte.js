class BloqueTeletransporte extends Bloque {

    constructor(x, y) {
        super(imagenes.bloque_vacio, x, y);
        this.bloqueToTeleport = undefined;
    }

    getPosXTeletransporte() { }

    getPosYTeletransporte() {
        return this.bloqueToTeleport.y;
    }

}