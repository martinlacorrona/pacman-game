class EnemigoDisparador extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo_disparador);
        this.estado = estados.moviendo;
        this.vxInteligencia = -2;
        this.vx = this.vxInteligencia;


        this.aMover = new Animacion(imagenes.enemigo_disparador_animacion,
            this.ancho, this.alto, 6, 8);

        this.aMorir = new Animacion(imagenes.enemigo_disparador_muriendo,
            this.ancho,this.alto,6,6, this.finAnimacionMorir.bind(this));
        // Ref a la animación actual
        this.animacion = this.aMover;

        this.vy = 0;
        this.vx = 2;

        this.ultimaVezIntentoDisparo = 0;
    }

    disparar() {
        super.disparar();
        if(this.ultimaVezIntentoDisparo == 5 && this.estado != estados.muriendo && this.estado != estados.muerto) {
            this.ultimaVezIntentoDisparo = 0;
            return new DisparoEnemigoDisparador(this.x, this.y);
        }
        this.ultimaVezIntentoDisparo++;
        return null;
    }

    actualizar (){
        this.animacion.actualizar();

        switch (this.estado){
            case estados.moviendo:
                this.animacion = this.aMover;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if ( this.estado == estados.muriendo) {
            this.vx = 0;
        } else {
            if ( this.vx == 0){
                this.vxInteligencia = this.vxInteligencia * -1;
                this.vx = this.vxInteligencia;
            }
            if (this.fueraPorDerecha ){
                // mover hacia la izquierda vx tiene que ser negativa
                if ( this.vxInteligencia > 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
            }
            if (this.fueraPorIzquierda ){
                // mover hacia la derecha vx tiene que ser positiva
                if ( this.vxInteligencia < 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
            }
        }

    }
}
