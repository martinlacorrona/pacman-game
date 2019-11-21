class RecolectableBala extends Recolectable {

    constructor(x, y) {
        super(imagenes.icono_recolectable_bala, x, y);

        this.ancho = this.imagen.width;
        this.alto = this.imagen.height;
    }

}