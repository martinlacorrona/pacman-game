class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador, x, y);

        this.velocidad = 0.8;

        this.vidas = 3;

        this.puntosNivel = 0;
        this.puntosTotales = 0;

        this.tiempoInvulnerable = 0;
        this.estado = estados.moviendo;
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        this.orientacion = orientaciones.derecha;

        this.ancho = 40*factorRedimension;
        this.alto = 40*factorRedimension;


        this.aIdleDerecha = new Animacion(imagenes.jugador_derecha,
            this.ancho, this.alto, 6*factorFotogramas, 3);
        this.aIdleIzquierda = new Animacion(imagenes.jugador_izquierda,
            this.ancho, this.alto, 6*factorFotogramas, 3);
        this.aIdleArriba = new Animacion(imagenes.jugador_arriba,
            this.ancho, this.alto, 6*factorFotogramas, 3);
        this.aIdleAbajo = new Animacion(imagenes.jugador_abajo,
            this.ancho, this.alto, 6*factorFotogramas, 3);
        this.aIdleMorir = new Animacion(imagenes.jugador_muriendose,
            this.ancho, this.alto, 3*factorFotogramas, 12, this.finAnimacionMorir.bind(this));


        this.animacion = this.aIdleDerecha;

        // Disparo
        this.cadenciaDisparo = 10;
        this.tiempoDisparo = 0;

    }

    actualizar() {
        if (this.tiempoInvulnerable > 0) {
            this.tiempoInvulnerable--;
        }

        if(this.orientacion != orientaciones.parado || this.estado == estados.muriendo) {
            this.animacion.actualizar();
        }

        // Establecer orientación
        if (this.vx > 0) {
            this.orientacion = orientaciones.derecha;
        }
        else if (this.vx < 0) {
            this.orientacion = orientaciones.izquierda;
        }
        else if (this.vy < 0) {
            this.orientacion = orientaciones.arriba;
        }
        else if (this.vy > 0) {
            this.orientacion = orientaciones.abajo;
        } else {
            this.orientacion = orientaciones.parado;
        }
        //Activar animacion para el lado que vaya
        if (this.orientacion == orientaciones.derecha) {
            this.animacion = this.aIdleDerecha;
        }
        if (this.orientacion == orientaciones.izquierda) {
            this.animacion = this.aIdleIzquierda;
        }
        if (this.orientacion == orientaciones.arriba) {
            this.animacion = this.aIdleArriba;
        }
        if (this.orientacion == orientaciones.abajo) {
            this.animacion = this.aIdleAbajo;
        }


        // Tiempo Disparo
        if (this.tiempoDisparo > 0) {
            this.tiempoDisparo--;
        }
    }

    moverX(direccion) {
        if(this.estado != estados.muriendo && this.estado != estados.muerto) {
            this.vx = direccion * this.velocidad;
        }
    }

    moverY(direccion) {
        if(this.estado != estados.muriendo && this.estado != estados.muerto) {
            this.vy = direccion * this.velocidad;
        }
    }

    disparar() {
        if(this.estado != estados.muriendo && this.estado != estados.muerto) {
            if (this.tiempoDisparo == 0) {
                // reiniciar Cadencia
                this.estado = estados.disparando;
                this.tiempoDisparo = this.cadenciaDisparo;

                //Direccion disparo
                var disparo = new DisparoJugador(this.x, this.y);
                if (this.orientacion == orientaciones.izquierda) {
                    disparo.vx = disparo.defaultVx * -1; //invertir
                }
                if (this.orientacion == orientaciones.arriba) {
                    disparo.vx = 0;
                    disparo.vy = disparo.defaultVy * -1; //invertir
                }
                if (this.orientacion == orientaciones.abajo) {
                    disparo.vx = 0;
                    disparo.vy = disparo.defaultVy;
                }
                return disparo;

            } else {
                return null;
            }
        }
    }

    dibujar(scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        if (this.tiempoInvulnerable > 0) {
            contexto.globalAlpha = 0.5;
            this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
            contexto.globalAlpha = 1;
        } else {
            this.animacion.dibujar(this.x - scrollX, this.y- scrollY);
        }
    }

    golpeado() {
        if(this.estado != estados.muriendo && this.estado != estados.muerto) {
            this.estado = estados.muriendo;
            this.animacion = this.aIdleMorir;
        }
        this.vx = 0;
        this.vy = 0;
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }
}
