class EnemigoBoss extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo_basico_abajo_amarillo);
        this.estado = estados.esperando;

        this.velocidad = velocidadEnemigoJefeNormal;

        this.vidas = 3;

        //Para ejecutar el algoritmo wavefront cada 30 iteraciones
        this.lastUpdate = 0;

        //gestionar la invencibilidad
        this.invencible = false;
        this.tiempoInvencible = 0;

        //Empieza con una orientacion aleatoria.
        this.orientacion = Math.floor(Math.random() * 4);

        //Guardamos el estado de la ultima orientacion
        this.ultimaOrientacion = this.orientacion;

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

        this.animacionVidas = new Animacion(imagenes.enemigo_boss_3_vidas,
            this.ancho, this.alto, 2*factorFotogramas, 1);

        // Ref a la animación actual
        this.updateAnimation();
    }

    dibujar() {
        if(this.estado != estados.esperando) {
            if (this.tiempoInvencible > 0) {
                contexto.globalAlpha = 0.5;
                this.animacion.dibujar(this.x, this.y);
                this.animacionVidas.dibujar(this.x, this.y);
                contexto.globalAlpha = 1;
            } else {
                this.animacion.dibujar(this.x, this.y);
                this.animacionVidas.dibujar(this.x, this.y);
            }
        }
    }

    actualizar(jugador, matrizMapa) {
        if (this.tiempoInvencible > 0) {
            this.tiempoInvencible--;
        } else {
            this.invencible = false;
        }
        this.lastUpdate++;

        if(this.estado != estados.esperando && !this.isInvencible()) {
            super.actualizar();

            //if(this.lastUpdate % 30 == 0) {
                this.calcularMejorMovimiento(jugador, matrizMapa);
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
            //}

            this.actualizarAnimacionVida();

            if (this.estado == estados.muriendo && this.estado == estados.muerto) {
                this.vx = 0;
                this.vy = 0;
            }
        } else if(this.isInvencible()) {
            this.vx = 0;
            this.vy = 0;
        }
    }

    calcularMejorMovimiento(jugador, matrizMapa) {
        //Primero vamos a revisar que este exactamente en el bloque, ya que si no, no se debera de chequear.
        let iEnemigo = (this.y - this.alto/2) / factorPintado;
        let jEnemigo = this.x / factorPintado - 1;

        let exactIEnemigo = Math.floor((this.y - this.alto/2) / factorPintado);
        let exactJEnemigo = Math.floor(this.x / factorPintado) - 1;

        if(iEnemigo != exactIEnemigo || jEnemigo != exactJEnemigo) {
            return;
        }

        //CALCULAR MATRIZ WAVEFRONT
        let matrizWaveFront = this.calcularMatrizWaveFront(matrizMapa, jugador, iEnemigo, jEnemigo);

        if(this.estado != estados.escapando && this.estado != estados.escapandoFinal) {
            this.velocidad = velocidadEnemigoJefeNormal;
            let min = Number.MAX_SAFE_INTEGER;

            //ABAJO
            if (matrizWaveFront[iEnemigo + 1][jEnemigo] != undefined && matrizWaveFront[iEnemigo + 1][jEnemigo] < min) {
                min = matrizWaveFront[iEnemigo + 1][jEnemigo];
                this.orientacion = orientaciones.abajo;
            }
            //ARRIBA
            if (matrizWaveFront[iEnemigo - 1][jEnemigo] != undefined && matrizWaveFront[iEnemigo - 1][jEnemigo] < min) {
                min = matrizWaveFront[iEnemigo - 1][jEnemigo];
                this.orientacion = orientaciones.arriba;
            }
            //DERECHA
            if (matrizWaveFront[iEnemigo][jEnemigo + 1] != undefined && matrizWaveFront[iEnemigo][jEnemigo + 1] < min) {
                min = matrizWaveFront[iEnemigo][jEnemigo + 1];
                this.orientacion = orientaciones.derecha;
            }
            //IZQUIERDA
            if (matrizWaveFront[iEnemigo][jEnemigo - 1] != undefined && matrizWaveFront[iEnemigo][jEnemigo - 1] < min) {
                this.orientacion = orientaciones.izquierda;
            }
        } else {
            this.velocidad = velocidadEnemigoJefeEscapando;
            this.calcularMejorMovimientoEscapando(jugador);
        }
    }

    calcularMejorMovimientoEscapando(jugador) {
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
            orientacionFinal = this.getOrientacionContraria(orientacionFinal);
            this.orientacion = orientacionFinal;
        }

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
        }
    }

    calcularMatrizWaveFront(matrizMapa, jugador, iEnemigo, jEnemigo) {
        let matrizWaveFront = Array.from(Array(sizeMapaAncho), () => new Array(sizeMapaAlto));

        let iJugador = Math.floor(jugador.y / factorPintado);
        let jJugador = Math.floor(jugador.x / factorPintado) - 1;

        matrizWaveFront[iJugador][jJugador] = 1;

        return this.recursiveWaveFront(matrizMapa, matrizWaveFront, 1, iEnemigo, jEnemigo);
    }

    recursiveWaveFront(matrizMapa, matrizWaveFront, iteration, iEnemigo, jEnemigo) {
        let countMovimiento = 0;
        //APLICAMOS ALGORITMO
        for(let i=0; i < matrizWaveFront.length; i++) {
            for(let j=0; j < matrizWaveFront[i].length; j++) {
                if(matrizWaveFront[i][j] == iteration) {
                    countMovimiento += this.updateCellArrayWaveFront(i + 1, j, matrizMapa, matrizWaveFront, iteration);
                    countMovimiento += this.updateCellArrayWaveFront(i - 1, j, matrizMapa, matrizWaveFront, iteration);
                    countMovimiento += this.updateCellArrayWaveFront(i, j + 1, matrizMapa, matrizWaveFront, iteration);
                    countMovimiento += this.updateCellArrayWaveFront(i, j - 1, matrizMapa, matrizWaveFront, iteration);
                }
            }
        }

        //Si no hubo ningun movimiento, no va a haber mas seguro
        if(countMovimiento == 0 || this.chequearSiYaTieneMovimientoEnemigo(matrizWaveFront, iEnemigo, jEnemigo)) {
            return matrizWaveFront;
        }


        //Como ha habido moviemiento hay que chequear la siguiente iteracion
        return this.recursiveWaveFront(matrizMapa, matrizWaveFront, iteration + 1, iEnemigo, jEnemigo);
    }

    chequearSiYaTieneMovimientoEnemigo(matrizWaveFront, iEnemigo, jEnemigo) {
        //Valores dentro del mapa
        if(iEnemigo-1 < 0 || jEnemigo-1 < 0 || iEnemigo+1 > sizeMapaAncho-1 || jEnemigo+1 > sizeMapaAlto-1)
            return false;
        if(iEnemigo == undefined || jEnemigo == undefined)
            return false;

        let valueEnemigo = matrizWaveFront[iEnemigo+1][jEnemigo];
        if(valueEnemigo == undefined) //Aun no llego al enemigo
            return false;

        //Si ya hay algo menor que el propio jugador podemos dejar de generar ya que tenemos movimiento posible
        if((matrizWaveFront[iEnemigo+1][jEnemigo] != undefined && matrizWaveFront[iEnemigo+1][jEnemigo] < valueEnemigo)
            || (matrizWaveFront[iEnemigo-1][jEnemigo] != undefined && !matrizWaveFront[iEnemigo-1][jEnemigo] < valueEnemigo)
                || (matrizWaveFront[iEnemigo][jEnemigo+1] != undefined && !matrizWaveFront[iEnemigo][jEnemigo+1] < valueEnemigo)
                    || (matrizWaveFront[iEnemigo][jEnemigo-1] != undefined && !matrizWaveFront[iEnemigo][jEnemigo-1] < valueEnemigo)) {
            return true;
        }
        return false;
    }


    updateCellArrayWaveFront(i, j, matrizMapa, matrizWaveFront, iteration) {
        //En este caso se sale del mapa
        if(i-1 < 0 || j-1 < 0 || i+1 > sizeMapaAncho-1 ||j+1 > sizeMapaAlto-1)
            return 0;
        //Condiciones que se tienen que dar:
        // - Que este indefinido el valor
        // - Que la matriz del mapa sea igual a true y por tanto el movimiento sea posible
        if(matrizWaveFront[i][j] == undefined &&
            matrizMapa[i][j]) {
                matrizWaveFront[i][j] = iteration + 1;
                return 1;
        }
        return 0;
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
            this.tiempoInvencible = 500; //activamos el modo invencible
            this.invencible = true;
        }
    }

    actualizarAnimacionVida() {
        switch (this.vidas) {
            case 3:
                this.animacionVidas = new Animacion(imagenes.enemigo_boss_3_vidas,
                    this.ancho, this.alto, 2*factorFotogramas, 1);
                break;
            case 2:
                this.animacionVidas = new Animacion(imagenes.enemigo_boss_2_vidas,
                    this.ancho, this.alto, 2*factorFotogramas, 1);
                break;
            case 1:
                this.animacionVidas = new Animacion(imagenes.enemigo_boss_1_vidas,
                    this.ancho, this.alto, 2*factorFotogramas, 1);
                break;
        }
    }
}
