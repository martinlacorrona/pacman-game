class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;

        this.ultimoControl = orientaciones.derecha;

        this.controladorJuego = new ControladorJuego();

        this.iniciar();
    }

    iniciar() {
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);
        this.fondo = new Fondo(imagenes.fondo, 480*0.5,320*0.5)

        this.espacio = new Espacio(0);

        this.bloques = [];
        this.bloquesTeletransporte = [];

        this.enemigos = [];

        this.puntosImagenes = [];

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);


        this.disparosJugador = [];
        this.puntos = new Texto(this.controladorJuego.puntosTotal + this.controladorJuego.puntosNivel,480*0.9,320*0.07);

        this.vidas = new Texto(this.controladorJuego.vidas, 480*0.8, 320*0.07);

        this.balas = new Texto(0, 480*0.7, 320*0.07);

        this.recolectables = [];

        this.ultimoEstadoJuego = estadosJuego.normal;

        this.cargarMapa("res/" + this.controladorJuego.nivelActual + ".txt");
    }

    actualizar (){
        if (this.pausa){
            return;
        }

        this.controladorJuego.actualizar();

        if(this.controladorJuego.estadoJuego !== this.ultimoEstadoJuego &&
                this.controladorJuego.estadoJuego === estadosJuego.normal) {
            this.enemigos.forEach((item) => item.cambiarEstado(estados.moviendo));
            this.ultimoEstadoJuego = this.controladorJuego.estadoJuego;
        }


        //UI values
        this.puntos.valor = this.controladorJuego.puntosTotal + this.controladorJuego.puntosNivel;
        this.vidas.valor = this.controladorJuego.vidas;
        this.balas.valor = this.jugador.balas;

        if(this.jugador.estado == estados.muerto) {
            if(this.controladorJuego.vidas == 0) {
                this.perder();
            }
            this.reiniciarNivel();
            return;
        }

        this.espacio.actualizar();

        //ACTUALIZAR PUNTOS IMAGEN
        for (var i=0; i < this.puntosImagenes.length; i++) {
            this.puntosImagenes[i].actualizar();
        }

        //Chequear si ya los hay que destruir.
        for (var i=0; i < this.puntosImagenes.length; i++) {
            if(this.puntosImagenes[i].isDestruir()) {
                this.puntosImagenes.splice(i, 1);
                i=i-1;
            }
        }

        // Eliminar disparos JUGADOR sin velocidad
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0 && this.disparosJugador[i].vy == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }

        for (var i=0; i < this.recolectables.length; i++) {
            this.recolectables[i].actualizar();
        }

        this.jugador.actualizar();

        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        // colisiones
        for (var i=0; i < this.enemigos.length; i++){
            if (this.jugador.colisiona(this.enemigos[i]) && this.enemigos[i].estado != estados.muerto
                        && this.enemigos[i].estado != estados.muriendo) {
                if(this.controladorJuego.estadoJuego === estadosJuego.normal) {
                    if (this.jugador.estado != estados.muerto && this.jugador.estado != estados.muriendo) {
                        this.controladorJuego.vidas--;
                        this.controladorJuego.reiniciarNivel();
                    }
                    this.jugador.golpeado();
                } else if(this.controladorJuego.estadoJuego === estadosJuego.enemigosEscapando) {
                    this.comerEnemigo(this.jugador.x, this.jugador.y);
                    this.enemigos.splice(i, 1);
                    i = i-1;
                }
            }
        }

        // colisiones , disparoJugador - enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.golpearEnemigoBala(this.enemigos[j].x, this.enemigos[j].y);

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.enemigos[j].impactado();
                }
            }
        }

        //Colisiones jugador con recolectable
        for(var i=0; i < this.recolectables.length; i++) {
            if(this.jugador.colisiona(this.recolectables[i])) {
                //En funcion de si es una semilla o otra
                if(this.recolectables[i] instanceof RecolectableNormal)
                    this.comerSemillaBasica(this.recolectables[i].x, this.recolectables[i].y);
                if(this.recolectables[i] instanceof RecolectableGrande)
                    this.comerSemillaGrande(this.recolectables[i].x, this.recolectables[i].y);
                if(this.recolectables[i] instanceof RecolectableBala)
                    this.comerBala(this.recolectables[i].x, this.recolectables[i].y);

                this.espacio.eliminarCuerpoDinamico(this.recolectables[i]);
                this.recolectables.splice(i, 1);
                i=i-1;
            }
        }

        //Colisiones jugador - bloqueTeletranposrtable
        for(var i=0; i < this.bloquesTeletransporte.length; i++) {
            if(this.jugador.colisiona(this.bloquesTeletransporte[i])) {
                this.jugador.x = this.bloquesTeletransporte[i].getPosXTeletransporte();
                this.jugador.y = this.bloquesTeletransporte[i].getPosYTeletransporte();
            }
        }

        //Colisiones enemigo - bloqueTeletranposrtable
        for (var j=0; j < this.enemigos.length; j++) {
            for (var i = 0; i < this.bloquesTeletransporte.length; i++) {
                if (this.enemigos[j].colisiona(this.bloquesTeletransporte[i])) {
                    this.enemigos[j].x = this.bloquesTeletransporte[i].getPosXTeletransporte();
                    this.enemigos[j].y = this.bloquesTeletransporte[i].getPosYTeletransporte();
                }
            }
        }

        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto ) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);
                j = j-1;
            }
        }
    }

    dibujar (){

        this.fondo.dibujar();

        this.recolectables.forEach((item) => item.dibujar());
        this.puntosImagenes.forEach((item) => item.dibujar());
        this.bloques.forEach((item) => item.dibujar());
        this.disparosJugador.forEach((item) => item.dibujar());

        this.jugador.dibujar();

        this.enemigos.forEach((item) => item.dibujar());

        //HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.vidas.dibujar();
        this.balas.dibujar();
        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.pad.dibujar();
        }

        if ( this.pausa ) {
            this.mensaje.dibujar();
        }
    }

    procesarControles( ){
        if (controles.continuar){
            controles.continuar = false;
            this.pausa = false;
        }

        // disparar
        if (  controles.disparo ){
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                this.disparosJugador.push(nuevoDisparo);
            }
        }

        // Eje X
        if (controles.moverX > 0){
            this.ultimoControl = orientaciones.derecha;

        } else if ( controles.moverX < 0){
            this.ultimoControl = orientaciones.izquierda;

        }

        // Eje Y
        if (controles.moverY < 0){
            this.ultimoControl = orientaciones.arriba;

        } else if (controles.moverY > 0){
            this.ultimoControl = orientaciones.abajo;
        }

        this.procesarUltimaOrientacion();

    }

    procesarUltimaOrientacion() {
        if(this.ultimoControl == orientaciones.derecha) {
            this.jugador.moverX(1);
        } else if(this.ultimoControl == orientaciones.izquierda) {
            this.jugador.moverX(-1);
        } else if(this.ultimoControl == orientaciones.arriba) {
            this.jugador.moverY(1);
        } else if(this.ultimoControl == orientaciones.abajo) {
            this.jugador.moverY(-1);
        }
    }

    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length-1) * 40;
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = (40/2*factorRedimension) + j * (40*factorRedimension); // x central
                    var y = (40/2*factorRedimension) + i * (40*factorRedimension); // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch(simbolo) {
            case "#":
                let bloque = new BloqueBasico(x,y);
                bloque.y = bloque.y - bloque.alto/2;
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);

                break;

            case ".":
                let recolectableNormal = new RecolectableNormal(x,y);
                recolectableNormal.y = recolectableNormal.y - recolectableNormal.alto/2;
                this.recolectables.push(recolectableNormal);
                this.espacio.agregarCuerpoDinamico(recolectableNormal);

                break;

            case "+":
                let recolectableGrande = new RecolectableGrande(x,y);
                recolectableGrande.y = recolectableGrande.y - recolectableGrande.alto/2;
                this.recolectables.push(recolectableGrande);
                this.espacio.agregarCuerpoDinamico(recolectableGrande);

                break;

            case "B":
                let bala = new RecolectableBala(x,y);
                bala.y = bala.y - bala.alto/2;
                this.recolectables.push(bala);
                this.espacio.agregarCuerpoDinamico(bala);

                break;

            case "*":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);

                break;

            case "S":
                let enemigo = new EnemigoBasico(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);

                break;

            case ">":
                let bloqueTeletranporteDerecha = new BloqueTeletransporteDerecha(x,y);
                bloqueTeletranporteDerecha.y = bloqueTeletranporteDerecha.y - bloqueTeletranporteDerecha.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloquesTeletransporte.push(bloqueTeletranporteDerecha);
                this.espacio.agregarCuerpoDinamico(bloqueTeletranporteDerecha);

                break;

            case "<":
                let bloqueTeletranporteIzquierda = new BloqueTeletransporteIzquierda(x,y);
                this.bloquesTeletransporte[0].bloqueToTeleport = bloqueTeletranporteIzquierda;
                bloqueTeletranporteIzquierda.bloqueToTeleport = this.bloquesTeletransporte[0];
                bloqueTeletranporteIzquierda.y = bloqueTeletranporteIzquierda.y - bloqueTeletranporteIzquierda.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloquesTeletransporte.push(bloqueTeletranporteIzquierda);
                this.espacio.agregarCuerpoDinamico(bloqueTeletranporteIzquierda);

                break;
        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;
        controles.moverY = 0;
        // Suponemos a false
        controles.continuar = false;


        for(var i=0; i < pulsaciones.length; i++) {
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }

            if (this.pad.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if (orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if (orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }

                var orientacionY = this.pad.obtenerOrientacionY(pulsaciones[i].y);
                if (orientacionY > 20) { // de 0 a 20 no contabilizamos
                    controles.moverY = (-1) * orientacionY;
                }
                if (orientacionY < -20) { // de -20 a 0 no contabilizamos
                    controles.moverY = (-1) * orientacionY;
                }
            }
            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }
    }

    comerSemillaBasica(x, y) {
        this.puntosImagenes.push(
            new PuntosImagen(x, y, imagenes.puntos_10, 100));
        this.controladorJuego.puntosNivel += 10;
    }

    golpearEnemigoBala(x, y) {
        this.puntosImagenes.push(
            new PuntosImagen(x, y, imagenes.puntos_100, 100));
        this.controladorJuego.puntosNivel += 100;
    }

    comerEnemigo(x, y) {
        this.puntosImagenes.push(
            new PuntosImagen(x, y, imagenes.puntos_200, 100));
        this.controladorJuego.puntosNivel += 200;
    }

    perder() {
        this.controladorJuego = new ControladorJuego();
    }

    reiniciarNivel() {
        this.iniciar();
    }

    comerSemillaGrande(x, y) {
        this.enemigos.forEach((item) => item.cambiarEstado(estados.escapando));
        this.controladorJuego.activarModoEscapando(1000);
        this.ultimoEstadoJuego = estadosJuego.enemigosEscapando;
        this.puntosImagenes.push(
            new PuntosImagen(x, y, imagenes.puntos_10, 100));
        this.controladorJuego.puntosNivel += 10;
    }

    comerBala(x, y) {
        this.jugador.balas++;
        this.puntosImagenes.push(
            new PuntosImagen(x, y, imagenes.puntos_1, 100));
    }
}
