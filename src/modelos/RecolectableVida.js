class RecolectableVida extends Recolectable {

    constructor(x, y) {
        super(imagenes.icono_recolectable_vida, x, y);

        this.ancho = this.imagen.width / 2;
        this.alto = this.imagen.height / 2;
    }

}