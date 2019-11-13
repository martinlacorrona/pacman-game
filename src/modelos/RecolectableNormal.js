class RecolectableNormal extends Recolectable {

    constructor(x, y) {
        super(imagenes.icono_recolectable, x, y);

        this.valor = 1;
    }

    getValor() {
        return this.valor;
    }

}