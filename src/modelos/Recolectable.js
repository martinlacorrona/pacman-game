class Recolectable extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y);

        this.ancho = this.imagen.width*factorRedimension;
        this.alto = this.imagen.height*factorRedimension;
    }

    getValor() {
        return 0;
    }

}