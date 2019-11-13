class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador, x, y);
        this.vidas = 3;
        this.tiempoInvulnerable = 0;
        this.estado = estados.moviendo;
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        this.orientacion = orientaciones.derecha;

        // Animaciones
        this.aDispararDerecha = new Animacion(imagenes.jugador_disparando_derecha,
            this.ancho, this.alto, 6, 4, this.finAnimacionDisparar.bind(this));
        // No pasar funciones del DIRECTAMNTE COMO callback
        // El objeto que ejecute la función no sabrá interpretar el "this."

        this.aDispararIzquierda = new Animacion(imagenes.jugador_disparando_izquierda,
            this.ancho, this.alto, 6, 4, this.finAnimacionDisparar.bind(this));


        this.aIdleDerecha = new Animacion(imagenes.jugador_idle_derecha,
            this.ancho, this.alto, 6, 8);
        this.aIdleIzquierda = new Animacion(imagenes.jugador_idle_izquierda,
            this.ancho, this.alto, 6, 8);
        this.aCorriendoDerecha =
            new Animacion(imagenes.jugador_corriendo_derecha,
                this.ancho, this.alto, 6, 8);
        this.aCorriendoIzquierda = new Animacion(imagenes.jugador_corriendo_izquierda,
            this.ancho, this.alto, 6, 8);
        this.aSaltandoDerecha = new Animacion(imagenes.jugador_saltando_derecha,
            this.ancho, this.alto, 6, 4);
        this.aSaltandoIzquierda = new Animacion(imagenes.jugador_saltando_izquierda,
            this.ancho, this.alto, 6, 4);


        this.animacion = this.aIdleDerecha;

        // Disparo
        this.cadenciaDisparo = 10;
        this.tiempoDisparo = 0;

    }

    actualizar() {
        if (this.enElAire && this.estado == estados.moviendo) {
            this.estado = estados.saltando;
        }
        if (!this.enElAire && this.estado == estados.saltando) {
            this.estado = estados.moviendo;
        }

        if (this.tiempoInvulnerable > 0) {
            this.tiempoInvulnerable--;
        }

        this.animacion.actualizar();

        // ¿Esta en el aire?
        if (this.choqueAbajo == true) {
            this.enElAire = false;
        } else {
            this.enElAire = true;
        }

        // Establecer orientación
        if (this.vx > 0) {
            this.orientacion = orientaciones.derecha;
        }
        if (this.vx < 0) {
            this.orientacion = orientaciones.izquierda;
        }

        switch (this.estado) {
            case estados.saltando:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aSaltandoDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aSaltandoIzquierda;
                }
                break;
            case estados.disparando:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aDispararDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aDispararIzquierda;
                }
                break;
            case estados.moviendo:
                if (this.vx != 0) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aCorriendoDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aCorriendoIzquierda;
                    }
                }
                if (this.vx == 0) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aIdleDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aIdleIzquierda;
                    }
                }
                break;
        }


        // Tiempo Disparo
        if (this.tiempoDisparo > 0) {
            this.tiempoDisparo--;
        }
    }

    moverX(direccion) {
        this.vx = direccion * 3;
    }

    moverY(direccion) {
        this.vy = direccion * 3;
    }

    disparar() {

        if (this.tiempoDisparo == 0) {
            // reiniciar Cadencia
            this.estado = estados.disparando;
            this.tiempoDisparo = this.cadenciaDisparo;

            //Direccion disparo
            var disparo = new DisparoJugador(this.x, this.y);
            if (this.orientacion == orientaciones.izquierda) {
                disparo.vx = disparo.vx * -1; //invertir
            }
            return disparo;

        } else {
            return null;
        }

    }

    finAnimacionDisparar() {
        this.estado = estados.moviendo;
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

    saltar() {
        if (!this.enElAire) {
            this.vy = -16;
            this.enElAire = true;
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
