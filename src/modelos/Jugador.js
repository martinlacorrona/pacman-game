class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador, x, y);

        this.velocidad = 3;

        this.vidas = 3;
        this.tiempoInvulnerable = 0;
        this.estado = estados.moviendo;
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        this.orientacion = orientaciones.derecha;

        this.ancho = 40*factorRedimension;
        this.alto = 40*factorRedimension;


        this.aIdleDerecha = new Animacion(imagenes.jugador_derecha,
            this.ancho, this.alto, 6, 3);
        this.aIdleIzquierda = new Animacion(imagenes.jugador_izquierda,
            this.ancho, this.alto, 6, 3);
        this.aIdleArriba = new Animacion(imagenes.jugador_arriba,
            this.ancho, this.alto, 6, 3);
        this.aIdleAbajo = new Animacion(imagenes.jugador_abajo,
            this.ancho, this.alto, 6, 3);


        this.animacion = this.aIdleDerecha;

        // Disparo
        this.cadenciaDisparo = 10;
        this.tiempoDisparo = 0;

    }

    actualizar() {
        if (this.tiempoInvulnerable > 0) {
            this.tiempoInvulnerable--;
        }

        this.animacion.actualizar();

        // Establecer orientación
        if (this.vx > 0) {
            this.orientacion = orientaciones.derecha;
        }
        if (this.vx < 0) {
            this.orientacion = orientaciones.izquierda;
        }
        if (this.vy < 0) {
            this.orientacion = orientaciones.arriba;
        }
        if (this.vy > 0) {
            this.orientacion = orientaciones.abajo;
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
        this.vx = direccion * this.velocidad;
    }

    moverY(direccion) {
        this.vy = direccion * this.velocidad;
    }

    disparar() {

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
        if (this.tiempoInvulnerable <= 0) {
            if (this.vidas > 0) {
                this.vidas--;
                this.tiempoInvulnerable = 100;
                // 100 actualizaciones de loop
            }
        }
    }
}
