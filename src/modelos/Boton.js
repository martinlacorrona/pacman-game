class Boton extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)
        this.pulsado = false;
    }

    contienePunto(pX, pY){
        if ( pY >= this.y - this.alto/2 &&
            pY <= this.y + this.alto/2 &&
            pX <= this.x + this.ancho/2 &&
            pX >= this.x - this.ancho/2){
            return true;
        }
        return false;
    }

}