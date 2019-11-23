class Enemigo extends Modelo {

    constructor(x, y, imagen) {
        super(imagen, x, y);

        this.ancho = 40*factorRedimension;
        this.alto = 40*factorRedimension;
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

    impactado(){
        this.estado = estados.muerto;
    }

    getOrientacionContraria(orientacion) {
        switch (orientacion) {
            case orientaciones.derecha:
                return orientaciones.izquierda;
            case orientaciones.izquierda:
                return orientaciones.derecha;
            case orientaciones.arriba:
                return orientaciones.abajo;
            case orientaciones.abajo:
                return orientaciones.arriba;
        }
    }

    updateAnimation() {
        if(this.estado == estados.moviendo) {
            switch (this.orientacion) {
                case orientaciones.derecha:
                    this.animacion = this.aIdleDerecha;
                    break;
                case orientaciones.izquierda:
                    this.animacion = this.aIdleIzquierda;
                    break;
                case orientaciones.arriba:
                    this.animacion = this.aIdleArriba;
                    break;
                case orientaciones.abajo:
                    this.animacion = this.aIdleAbajo;
                    break;
            }
        } else if(this.estado == estados.escapando) {
            this.animacion = this.aIdleEscapando;
        } else if(this.estado == estados.escapandoFinal) {
            this.animacion = this.aIdleEscapandoFinal;
        }
    }

    cambiarEstado(estado) {
        this.orientacion =  this.getOrientacionContraria(this.orientacion);
        this.estado = estado;
        this.updateAnimation();
    }
}
