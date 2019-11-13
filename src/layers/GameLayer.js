class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;

        this.ultimoControl = orientaciones.derecha;

        this.iniciar();
    }

    iniciar() {
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);
        this.fondo = new Fondo(imagenes.fondo, 480*0.5,320*0.5)

        this.espacio = new Espacio(0);
        this.scrollX = 0;
        this.scrollY = 0;

        this.bloques = [];

        this.enemigos = [];

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);


        this.disparosJugador = [];
        this.puntos = new Texto(0,480*0.9,320*0.07);

        this.vidas = new Texto(3, 480*0.8, 320*0.07);

        this.recolectables = [];

        this.cargarMapa("res/" + nivelActual + ".txt");
    }

    actualizar (){
        if (this.pausa){
            return;
        }

        this.espacio.actualizar();

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
                this.jugador.golpeado();
            }
        }

        // colisiones , disparoJugador - enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.enemigos[j].impactado();
                    this.puntos.valor++;
                }
            }
        }

        // //Colisiones jugador con recolectable
        for(var i=0; i < this.recolectables.length; i++) {
            if(this.jugador.colisiona(this.recolectables[i])) {
                this.espacio.eliminarCuerpoDinamico(this.recolectables[i]);
                this.recolectables.splice(i, 1);
                i=i-1;
                //TODO: sumar puntos o lo que sea
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

        for(var i=0; i < this.recolectables.length; i++) {
            this.recolectables[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX, this.scrollY);
        }

        this.jugador.dibujar(this.scrollX, this.scrollY);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        //HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.vidas.dibujar();
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
                var bloque = new BloqueBasico(x,y);
                bloque.y = bloque.y - bloque.alto/2;
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);

                break;

            case ".":
                var recolectableNormal = new RecolectableNormal(x,y);
                recolectableNormal.y = recolectableNormal.y - recolectableNormal.alto/2;
                this.recolectables.push(recolectableNormal);
                this.espacio.agregarCuerpoDinamico(recolectableNormal);

                break;

            case "+":
                var recolectableGrande = new RecolectableGrande(x,y);
                recolectableGrande.y = recolectableGrande.y - recolectableGrande.alto/2;
                this.recolectables.push(recolectableGrande);
                this.espacio.agregarCuerpoDinamico(recolectableGrande);

                break;

            case "*":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);

                break;

            case "S":
                var enemigo = new EnemigoBasico(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);

                break;
        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;
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

}
