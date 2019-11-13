class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }

    iniciar() {
        this.botonSalto = new Boton(imagenes.boton_salto,480*0.9,320*0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);

        this.espacio = new Espacio(1);
        this.scrollX = 0;
        this.scrollY = 0;

        this.bloques = [];
        this.bloquesDestruibles = [];

        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.enemigos = [];

        this.disparosEnemigos = [];

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);


        this.disparosJugador = [];
        this.puntos = new Texto(0,480*0.9,320*0.07);

        this.vidas = new Texto(3, 480*0.8, 320*0.07);

        this.recolectablesTexto = new Texto(0, 480*0.25, 320*0.07);
        this.fondoRecolectables =
            new Fondo(imagenes.icono_recolectable, 480*0.2,320*0.05);
        this.recolectables = [];

        this.cargarMapa("resOld/" + nivelActual + ".txt");
    }

    actualizar (){
        if (this.pausa){
            return;
        }

        this.espacio.actualizar();

        if (this.copa.colisiona(this.jugador)){
            nivelActual++;
            if (nivelActual > nivelMaximo){
                nivelActual = 0;
            }
            this.pausa = true;
            this.mensaje =
                new Boton(imagenes.mensaje_ganar, 480/2, 320/2);

            this.iniciar();
        }

        //Actualizamos el numero de vidas
        this.vidas.valor = this.jugador.vidas;

        // Jugador se cae
        if ( this.jugador.y > 480 ){
            this.iniciar();
        }

        //ENEMIGOS DISPARAR
        for(var i=0; i < this.enemigos.length; i++) {
            if(Math.floor(Math.random() * 20) == 0 && this.enemigos[i] instanceof EnemigoDisparador) {
                var disparo = this.enemigos[i].disparar();
                if(disparo != null) {
                    this.espacio.agregarCuerpoDinamico(disparo);
                    this.disparosEnemigos.push(disparo);
                }
            } else if(Math.floor(Math.random() * 20) == 0 && this.enemigos[i] instanceof EnemigoGenerador) {
                var enemigo = this.enemigos[i].disparar();
                if(enemigo != null) {
                    this.enemigos.push(enemigo);
                    this.espacio.agregarCuerpoDinamico(enemigo);
                }
            }
        }

        //FONDO
        this.fondo.vx = -1;
        this.fondo.actualizar();

        // Eliminar disparos JUGADOR sin velocidad
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }

        // Eliminar disparos JUGADOR fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
                i=i-1;
            }
        }

        // Eliminar disparos ENEMIGO sin velocidad
        for (var i=0; i < this.disparosEnemigos.length; i++){
            if ( this.disparosEnemigos[i] != null &&
                this.disparosEnemigos[i].vx == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosEnemigos[i]);
                this.disparosEnemigos.splice(i, 1);
            }
        }

        // Eliminar disparos ENEMIGO fuera de pantalla
        for (var i=0; i < this.disparosEnemigos.length; i++){
            if ( this.disparosEnemigos[i] != null &&
                !this.disparosEnemigos[i].estaEnPantalla()){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparosEnemigos[i]);

                this.disparosEnemigos.splice(i, 1);
                i=i-1;
            }
        }

        for (var i=0; i < this.disparosEnemigos.length; i++) {
            this.disparosEnemigos[i].actualizar();
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
                if(this.enemigos[i] instanceof EnemigoSaltador) {
                    if(this.enemigos[i].y > this.jugador.y + 15) {
                        this.enemigos[i].impactado();
                        this.puntos.valor++;
                    } else {
                        this.jugador.golpeado();
                        if (this.jugador.vidas <= 0) {
                            this.iniciar();
                        }
                    }
                } else {
                    this.jugador.golpeado();
                    if (this.jugador.vidas <= 0) {
                        this.iniciar();
                    }
                }
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

        //Colisiones jugador con recolectable
        for(var i=0; i < this.recolectables.length; i++) {
            if(this.jugador.colisiona(this.recolectables[i])) {
                this.espacio.eliminarCuerpoDinamico(this.recolectables[i]);
                this.recolectables.splice(i, 1);
                i=i-1;
                this.recolectablesTexto.valor = this.recolectablesTexto.valor + 1;
            }
        }

        // colisiones , disparoJugador - bloquesDestruibles
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.bloquesDestruibles.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.bloquesDestruibles[j] != null &&
                    this.disparosJugador[i].colisiona(this.bloquesDestruibles[j])) {
                    this.espacio
                        .eliminarCuerpoEstatico(this.bloquesDestruibles[j]);
                    this.disparosJugador.splice(i, 1)
                    this.bloquesDestruibles.splice(j, 1);
                    j=j-1;
                    i = i-1;
                }
            }
        }

        // colisiones , disparoEnemigo - Jugador
        for (var i=0; i < this.disparosEnemigos.length; i++){
            if (this.disparosEnemigos[i] != null &&
                this.disparosEnemigos[i].colisiona(this.jugador)) {

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosEnemigos[i]);
                this.disparosEnemigos.splice(i, 1);
                i = i-1;
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0) {
                    this.iniciar();
                }
            }
        }

        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {

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

        for (var i=0; i < this.bloquesDestruibles.length; i++){
            this.bloquesDestruibles[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i=0; i < this.disparosEnemigos.length; i++){
            this.disparosEnemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX, this.scrollY);
        }

        this.copa.dibujar(this.scrollX, this.scrollY);

        this.jugador.dibujar(this.scrollX, this.scrollY);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }

        //HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.vidas.dibujar();
        this.fondoRecolectables.dibujar();
        this.recolectablesTexto.dibujar();
        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
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
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.saltar();
        } else if ( controles.moverY < 0 ){


        } else {

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
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {
            case "C":
                this.copa = new Bloque(imagenes.copa, x,y);
                this.copa.y = this.copa.y - this.copa.alto/2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.copa);
                break;

            case "E":
                var enemigo = new EnemigoBasico(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);

                break;

            case "D":
                var enemigo = new EnemigoDisparador(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);

                break;

            case "S":
                var enemigo = new EnemigoSaltador(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);

                break;

            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);

                break;
            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
            case "U":
                var bloque = new BloqueDestruible(imagenes.bloque_metal, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloquesDestruibles.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
            case "G":
                var enemigo = new EnemigoGenerador(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "R":
                var recolectable = new Recolectable(x,y);
                recolectable.y = recolectable.y - recolectable.alto/2;
                // modificación para empezar a contar desde el suelo
                this.recolectables.push(recolectable);
                this.espacio.agregarCuerpoDinamico(recolectable);
                break;
        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;
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

            if (this.botonSalto.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonSalto.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if ( !this.botonSalto.pulsado ){
            controles.moverY = 0;
        }
    }

}
