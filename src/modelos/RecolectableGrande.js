class RecolectableGrande extends Recolectable {

    constructor(x, y) {
        super(imagenes.icono_recolectable, x, y);

        this.valor = 5;
    }

    getValor() {
        return this.valor;
    }

}