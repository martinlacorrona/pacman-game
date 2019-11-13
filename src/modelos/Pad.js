class Pad extends Boton {

    constructor(x, y) {
        super(imagenes.pad, x, y)
    }

    obtenerOrientacionX(pX){
        return pX - this.x;
    }

    obtenerOrientacionY(pY){
        return pY - this.y;
    }

}