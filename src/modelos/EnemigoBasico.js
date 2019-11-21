class EnemigoBasico extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo);
        this.estado = estados.moviendo;

        this.velocidad = 0.5;


        //Empieza con una orintacion aleatoria.
        this.orientacion = Math.floor(Math.random() * 4);;
        //Guardamos el estado de la ultima orientacion
        this.ultimaOrientacion = this.orientacion;
        this.ultimaOrientacionContrario = this.getOrientacionContraria(this.ultimaOrientacion);

        this.aIdleDerecha = new Animacion(imagenes.enemigo_basico_derecha,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleIzquierda = new Animacion(imagenes.enemigo_basico_izquierda,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleArriba = new Animacion(imagenes.enemigo_basico_arriba,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleAbajo = new Animacion(imagenes.enemigo_basico_abajo,
            this.ancho, this.alto, 6*factorFotogramas, 2);

        this.aIdleEscapando = new Animacion(imagenes.enemigo_basico_escapando,
            this.ancho, this.alto, 6*factorFotogramas, 4);

        // Ref a la animación actual
        this.updateAnimation();
    }

    actualizar() {
        super.actualizar();
        if (this.estado != estados.muriendo && this.estado != estados.muerto) {
            if (this.vx == 0 && this.vy == 0 && this.orientacion != undefined) { //SE HA PARADO
                this.ultimaOrientacion = this.orientacion;
                this.ultimaOrientacionContrario = this.getOrientacionContraria(this.ultimaOrientacion);
                this.orientacion = undefined; //orientacion no definida
            }

            if (this.estado != estados.muerto) {
                if (this.vx == 0 && this.vy == 0) {
                    let orientacion = Math.floor(Math.random() * 4);
                    while (orientacion == this.ultimaOrientacion || orientacion == this.ultimaOrientacionContrario) {
                        orientacion = Math.floor(Math.random() * 4);
                    }
                    this.orientacion = orientacion;
                    this.updateAnimation();
                }
            }
            switch (this.orientacion) {
                case orientaciones.derecha:
                    this.vx = this.velocidad * 1;
                    this.vy = 0;
                    break;
                case orientaciones.izquierda:
                    this.vx = this.velocidad * -1;
                    this.vy = 0;
                    break;
                case orientaciones.arriba:
                    this.vx = 0;
                    this.vy = this.velocidad * -1;
                    break;
                case orientaciones.abajo:
                    this.vx = 0;
                    this.vy = this.velocidad * 1;
                    break;
            }
        } else {
            this.vx = 0;
            this.vy = 0;
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
        }
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

    cambiarEstado(estado) {
        this.orientacion =  this.getOrientacionContraria(this.orientacion);
        this.estado = estado;
        this.updateAnimation();
    }
}
