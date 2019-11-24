class Boton extends Modelo {

    constructor(rutaImagen, x, y, anchoRedimension, altoRedimension) {
        super(rutaImagen, x, y)
        this.pulsado = false;
        if(anchoRedimension != undefined && altoRedimension != undefined) {
            this.ancho = this.imagen.width * anchoRedimension;
            this.alto = this.imagen.height * altoRedimension;
        }
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