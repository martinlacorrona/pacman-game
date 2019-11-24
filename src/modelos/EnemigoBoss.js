class EnemigoBoss extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo_basico_abajo_amarillo);
        this.estado = estados.esperando;

        this.velocidad = 0.25;

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

        this.animacionVidas = new Animacion(imagenes.enemigo_boss_3_vidas,
            this.ancho, this.alto, 2*factorFotogramas, 1);

        //TODO: borrar, solo debug
        this.iJugador = undefined;
        this.jJugador = undefined;

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
            //TODO: borrrar, solo debug
            new Animacion(imagenes.bloque_basico, this.ancho, this.alto, 2, 1). dibujar(
                Math.floor(this.x / factorPintado)*factorPintado, Math.floor(this.y / factorPintado)*factorPintado + this.alto/2);
            if(this.iJugador != undefined)
                new Animacion(imagenes.bloque_basico, this.ancho, this.alto, 2, 1). dibujar(
                    this.iJugador*factorPintado, this.jJugador*factorPintado);
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

            if(this.lastUpdate % 30 == 0) {
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
            }

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
        //CALCULAR MATRIZ WAVEFRONT
        let matrizWaveFront = this.calcularMatrizWaveFront(matrizMapa, jugador);
        
        let iEnemigo = Math.floor(this.x / factorPintado) - 4;
        let jEnemigo = Math.floor(this.y / factorPintado) + 3;

        let min = Number.MAX_SAFE_INTEGER;
        console.log("Enemigo: " + matrizWaveFront[iEnemigo ][jEnemigo])
        console.log("derecha: " + matrizWaveFront[iEnemigo + 1][jEnemigo])
        console.log("izq: " + matrizWaveFront[iEnemigo - 1][jEnemigo])
        console.log("arriba: " + matrizWaveFront[iEnemigo][jEnemigo + 1])
        console.log("abajo: " + matrizWaveFront[iEnemigo][jEnemigo - 1])
        //DERECHA
        if(matrizWaveFront[iEnemigo + 1][jEnemigo] != undefined && matrizWaveFront[iEnemigo + 1][jEnemigo] < min) {
            console.log("derecha")
            min = matrizWaveFront[iEnemigo + 1][jEnemigo];
            this.orientacion = orientaciones.derecha;
        }
        //IZQUIERDA
        if(matrizWaveFront[iEnemigo - 1][jEnemigo] != undefined && matrizWaveFront[iEnemigo -1][jEnemigo] < min) {
            console.log("izq")
            min = matrizWaveFront[iEnemigo - 1][jEnemigo];
            this.orientacion = orientaciones.izquierda;
        }
        //ARRIBA
        if(matrizWaveFront[iEnemigo][jEnemigo + 1] != undefined && matrizWaveFront[iEnemigo][jEnemigo + 1] < min) {
            console.log("abajo")
            min = matrizWaveFront[iEnemigo][jEnemigo + 1];
            this.orientacion = orientaciones.abajo;
        }
        //ABAJO
        if(matrizWaveFront[iEnemigo][jEnemigo - 1] != undefined && matrizWaveFront[iEnemigo][jEnemigo - 1] < min) {
            console.log("arriba")
            this.orientacion = orientaciones.arriba;
        }
    }

    calcularMatrizWaveFront(matrizMapa, jugador) {
        let matrizWaveFront = Array.from(Array(sizeMapaAncho), () => new Array(sizeMapaAlto));

        let iJugador = Math.floor(jugador.x / factorPintado) + 1;
        let jJugador = Math.floor(jugador.y / factorPintado) - 2;

        //TODO: borrar, solo debug
        this.iJugador = iJugador;
        this.jJugador = jJugador;
        console.log(iJugador + "/" + jJugador)

        matrizWaveFront[iJugador][jJugador] = 1;

        return this.recursiveWaveFront(matrizMapa, matrizWaveFront, 1);
    }

    recursiveWaveFront(matrizMapa, matrizWaveFront, iteration) {
        //TODO: borrar estas 2 lineas de codigo, solo debug
        console.log(iteration)
        this.printMatriz(matrizWaveFront)
        this.printMatrizMapa(matrizMapa)
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
        //TODO: chequear si ya esta el enemigo rodeado de puntos o bloques, entonces podemos parar...
        if(countMovimiento == 0)
            return matrizWaveFront;


        //Como ha habido moviemiento hay que chequear la siguiente iteracion
        return this.recursiveWaveFront(matrizMapa, matrizWaveFront, iteration + 1);
    }

    //TODO: borrar, solo es para debug
    printMatriz(matriz) {
        let string;
        for(let i=0; i < matriz.length; i++) {
            if(i < 10)
                string = "0" + i + ": ";
            else
                string = i + ": ";
            for(let j=0; j < matriz[i].length; j++) {
                if(matriz[i][j] == undefined)
                    string += "##" + "-";
                else if(matriz[i][j] < 10)
                    string += "0" + matriz[i][j] + "-";
                else
                    string += matriz[i][j] + "-";
            }
            console.log(string);
        }
    }

    //TODO: borrar, solo es para debug
    printMatrizMapa(matriz) {
        let iEnemigo = Math.floor(this.x / factorPintado) - 4;
        let jEnemigo = Math.floor(this.y / factorPintado) + 3;

        let string;
        for(let i=0; i < matriz.length; i++) {
            if(i < 10)
                string = "0" + i + ": ";
            else
                string = i + ": ";
            for(let j=0; j < matriz[i].length; j++) {
                if(iEnemigo == i && jEnemigo == j) {
                    string += "EE" + "-";
                } else {
                    if (matriz[i][j])
                        string += "__" + "-";
                    else
                        string += "##" + "-";
                }
            }
            console.log(string);
        }
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
