class Enemigo extends Modelo {

    constructor(x, y, imagen) {
        super(imagen, x, y);

        this.ancho = 40*factorRedimension;
        this.alto = 40*factorRedimension;
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    actualizar (){
        this.animacion.actualizar();
    }

    dibujar (scrollX, scrollY){
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

    disparar() {}
}
