class Disparo extends Modelo {

    constructor(x, y, imagen) {
        super(imagen, x, y);

        this.ancho = this.imagen.width*factorRedimension;
        this.alto = this.imagen.height*factorRedimension;
    }

    actualizar() {

    }
}