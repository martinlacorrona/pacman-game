class PuntosImagen extends Modelo {

    constructor(x, y, imagen, duracion) {
        super(imagen, x, y);

        this.ancho = this.imagen.width*factorRedimension*2;
        this.alto = this.imagen.height*factorRedimension*2;

        this.duracion = duracion;
    }

    actualizar() {
        this.duracion--;
    }

    isDestruir() {
        if(this.duracion < 0) {
            return true;
        }
        return false;
    }
}