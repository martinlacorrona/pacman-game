class EnemigoBoss extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo_basico_abajo_amarillo);
        this.estado = estados.esperando;

        this.velocidad = 0.25;

        this.vidas = 3;

        //gestionar la invencibilidad
        this.invencible = false;
        this.tiempoInvencible = 0;

        //Empieza con una orientacion aleatoria.
        this.orientacion = Math.floor(Math.random() * 4);

        //Guardamos el estado de la ultima orientacion
        this.ultimaOrientacion = this.orientacion;
        this.ultimaOrientacionContrario = this.getOrientacionContraria(this.ultimaOrientacion);
        this.aIdleDerecha = new Animacion(imagenes.enemigo_boss_derecha,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleIzquierda = new Animacion(imagenes.enemigo_boss_izquierda,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleArriba = new Animacion(imagenes.enemigo_boss_arriba,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleAbajo = new Animacion(imagenes.enemigo_boss_abajo,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleEscapando = new Animacion(imagenes.enemigo_basico_escapando,
            this.ancho, this.alto, 6*factorFotogramas, 4);
        this.aIdleEscapandoFinal = new Animacion(imagenes.enemigo_basico_escapando,
            this.ancho, this.alto, 2*factorFotogramas, 4);

        // Ref a la animación actual
        this.updateAnimation();
    }

    dibujar() {
        if(this.estado != estados.esperando) {
            if (this.tiempoInvencible > 0) {
                contexto.globalAlpha = 0.5;
                this.animacion.dibujar(this.x, this.y);
                contexto.globalAlpha = 1;
            } else {
                this.animacion.dibujar(this.x, this.y);
            }
            //TODO: dibujar encima aqui los puntos de vida restantes
            //TODO: al actualizar en funcion de los puntos de vida que se cambie la supuesta "animacion"
            //TODO: crear la imagen desde gimp del propio enemigo, borrarlo y dibujarlo encima
        }
    }

    actualizar(jugador, espacio) {
        if (this.tiempoInvencible > 0) {
            this.tiempoInvencible--;
        } else {
            this.invencible = false;
        }
        
        if(this.estado != estados.esperando && !this.isInvencible()) {
            super.actualizar();

            this.chequearPosicionJugador(jugador, espacio);

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
        } else if(this.isInvencible()) {
            this.vx = 0;
            this.vy = 0;
        }
    }

    chequearPosicionJugador(jugador, espacio) {
        //si ve al jugador
        let orientacionFinal = undefined;

        //El enemigo solo ve a la vision que este definida en globales
        let distanciaMaxima = sizeBloque * visionEnemigoBasico;
        let maxDerecha = this.x + distanciaMaxima;
        let maxIzquierda = this.x - distanciaMaxima;
        let maxArriba = this.y - distanciaMaxima;
        let maxAbajo = this.y + distanciaMaxima;

        //AVERIGUAMOS PARA DONDE ESTA EL JUGADOR.
        if(jugador.x >= this.x && jugador.x <= this.x) {
            //Entonces, esta o arriba o abajo.
            //Chequeamos si es arriba y esta dentro del rango de vision
            if(jugador.y < this.y && jugador.y > maxArriba) {
                orientacionFinal = orientaciones.arriba;
            }
            //Chequeamos si es abajo y esta dentro del rango de vision
            if(jugador.y > this.y && jugador.y < maxAbajo) {
                orientacionFinal = orientaciones.abajo;
            }
        } else if(jugador.y >= this.y && jugador.y <= this.y) {
            //Entonces, esta o derecha o izquierda.
            //Chequeamos si es derecha y esta dentro del rango de vision
            if(jugador.x > this.x && jugador.x < maxDerecha) {
                orientacionFinal = orientaciones.derecha;
            }
            //Chequeamos si es izquierda y esta dentro del rango de vision
            if(jugador.x < this.x && jugador.x > maxIzquierda) {
                orientacionFinal = orientaciones.izquierda;
            }
        }

        if (orientacionFinal != undefined) {
            if (this.estado == estados.escapando || this.estado == estados.escapandoFinal) {
                orientacionFinal = this.getOrientacionContraria(orientacionFinal);
            }
        this.orientacion = orientacionFinal;
        }
    }

    isInvencible() {
        return this.invencible;
    }

    golpear() {
        if(this.estado != estados.esperando) {
            //Si no es invencible, activa el modo invencible
            if (!this.invencible) {
                this.vidas--;
            }

            //Se añade mas tiempo si se le sigue matando...
            this.tiempoInvencible = 250; //activamos el modo invencible
            this.invencible = true;
        }
    }
}
