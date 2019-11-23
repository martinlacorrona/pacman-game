class EnemigoBasico extends Enemigo {

    constructor(x, y) {
        super(x, y, imagenes.enemigo_basico_abajo_amarillo);
        this.estado = estados.moviendo;

        this.velocidad = 0.5;


        //Empieza con una orientacion aleatoria.
        this.orientacion = Math.floor(Math.random() * 4);

        //Guardamos el estado de la ultima orientacion
        this.ultimaOrientacion = this.orientacion;
        this.ultimaOrientacionContrario = this.getOrientacionContraria(this.ultimaOrientacion);

        let animacionDerecha, animacionIzquierda, animacionArriba, animacionAbajo;

        switch (getNextColorEnemigo()) {
            case coloresEnemigos.amarillo:
                animacionDerecha = imagenes.enemigo_basico_derecha_amarillo;
                animacionIzquierda = imagenes.enemigo_basico_izquierda_amarillo;
                animacionArriba = imagenes.enemigo_basico_arriba_amarillo;
                animacionAbajo = imagenes.enemigo_basico_abajo_amarillo;
                break;
            case coloresEnemigos.verde:
                animacionDerecha = imagenes.enemigo_basico_derecha_verde;
                animacionIzquierda = imagenes.enemigo_basico_izquierda_verde;
                animacionArriba = imagenes.enemigo_basico_arriba_verde;
                animacionAbajo = imagenes.enemigo_basico_abajo_verde;
                break;
            case coloresEnemigos.rojo:
                animacionDerecha = imagenes.enemigo_basico_derecha_rojo;
                animacionIzquierda = imagenes.enemigo_basico_izquierda_rojo;
                animacionArriba = imagenes.enemigo_basico_arriba_rojo;
                animacionAbajo = imagenes.enemigo_basico_abajo_rojo;
                break;
            case coloresEnemigos.azul:
                animacionDerecha = imagenes.enemigo_basico_derecha_azul;
                animacionIzquierda = imagenes.enemigo_basico_izquierda_azul;
                animacionArriba = imagenes.enemigo_basico_arriba_azul;
                animacionAbajo = imagenes.enemigo_basico_abajo_azul;
                break;
        }
        this.aIdleDerecha = new Animacion(animacionDerecha,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleIzquierda = new Animacion(animacionIzquierda,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleArriba = new Animacion(animacionArriba,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleAbajo = new Animacion(animacionAbajo,
            this.ancho, this.alto, 6*factorFotogramas, 2);
        this.aIdleEscapando = new Animacion(imagenes.enemigo_basico_escapando,
            this.ancho, this.alto, 6*factorFotogramas, 4);
        this.aIdleEscapandoFinal = new Animacion(imagenes.enemigo_basico_escapando,
            this.ancho, this.alto, 2*factorFotogramas, 4);

        // Ref a la animación actual
        this.updateAnimation();
    }

    actualizar(jugador, espacio) {
        super.actualizar();

        this.calcularMejorMovimiento(jugador, espacio);

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

    calcularMejorMovimiento(jugador) {
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
}
