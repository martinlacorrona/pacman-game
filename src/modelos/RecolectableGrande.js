class RecolectableGrande extends Recolectable {

    constructor(x, y) {
        super(imagenes.icono_recolectable_grande, x, y);

        this.ancho = this.imagen.width;
        this.alto = this.imagen.height;
    }

}