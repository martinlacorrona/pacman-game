class Fondo extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y);
        this.vx = 0;
        this.rutaImagen = rutaImagen;
    }

    actualizar(){
        if ( this.vx != 0) {
            if ( this.fondoAux == null){
                this.fondoAux =
                    new Fondo(this.rutaImagen, this.x, this.y);
            }

            this.x = this.x + this.vx;

            // margen derecho se sale por la izquierda
            if (this.x + this.ancho / 2 < 0) {
                // vuelve a aparecer por la parte derecha
                this.x = 480 + this.ancho / 2;
            }
            // margen izquierdo se sale por la derecha
            if (this.x - this.ancho / 2 > 480 ) {
                // vuelve a la parte izquierda
                this.x = 0 - this.ancho / 2;
            }
        }
    }

    dibujar(){
        super.dibujar();

        if ( this.fondoAux != null ) {
            // hueco por la izquierda
            if ( this.x - this.ancho/2 > 0){
                // pintar auxiliar por la izquierda
                this.fondoAux.x = this.x - this.ancho;
            }
            // hueco por la derecha
            if (this.x + this.ancho/2 < 480){
                // pintar auxiliar por la derecha
                this.fondoAux.x =this.x + this.ancho;
            }
            this.fondoAux.dibujar();
        }
    }
}

