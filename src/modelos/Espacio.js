class Espacio {

    constructor(gravedad) {
        this.gravedad = gravedad;
        this.dinamicos = [];
        this.estaticos = [];
    }

    agregarCuerpoDinamico(modelo){
        this.dinamicos.push(modelo);
    }

    agregarCuerpoEstatico(modelo){
        this.estaticos.push(modelo);
    }

    eliminarCuerpoDinamico (modelo) {
        for (var i = 0; i < this.dinamicos.length; i++) {
            if (this.dinamicos[i] == modelo) {
                this.dinamicos.splice(i, 1);
            }
        }
    }

    eliminarCuerpoEstatico(modelo){
        for (var i = 0; i < this.estaticos.length; i++) {
            if (this.estaticos[i] == modelo) {
                this.estaticos.splice(i, 1);
            }
        }
    }

    actualizar(){
        for( var i=0; i < this.dinamicos.length; i++){

            // aplicar gravedad ( dinamicos)
            this.dinamicos[i].vy = this.dinamicos[i].vy + this.gravedad;
            // maxima velocidad de caida por gravedad
            if (this.dinamicos[i].vy > 20) {
                this.dinamicos[i].vy = 20;
            }

            // reiniciar choques
            this.dinamicos[i].choqueAbajo = false;
            this.dinamicos[i].fueraPorDerecha = true;
            this.dinamicos[i].fueraPorIzquierda = true;


            //derecha
            this.moverDerecha(i);
            this.moverIzquierda(i);
            this.moverArriba(i);
            this.moverAbajo(i);
        }

    }

    moverDerecha(i){
        if ( this.dinamicos[i].vx > 0){
            var movimientoPosible = this.dinamicos[i].vx;
            // El mejor "idealmente" vx partimos de ese

            for(var j=0; j < this.estaticos.length; j++){
                var derechaDinamico
                    = this.dinamicos[i].x + this.dinamicos[i].ancho/2;
                var arribaDinamico
                    = this.dinamicos[i].y - this.dinamicos[i].alto/2;
                var abajoDinamico
                    = this.dinamicos[i].y + this.dinamicos[i].alto/2;
                var izquierdaEstatico
                    = this.estaticos[j].x - this.estaticos[j].ancho/2;
                var arribaEstatico
                    = this.estaticos[j].y - this.estaticos[j].alto/2;
                var abajoEstatico
                    = this.estaticos[j].y + this.estaticos[j].alto/2;

                // Alerta!, Elemento estático en la trayectoria.
                if ( (derechaDinamico + this.dinamicos[i].vx) >= izquierdaEstatico
                    && derechaDinamico <= izquierdaEstatico
                    && arribaEstatico < abajoDinamico
                    && abajoEstatico > arribaDinamico){

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible >= izquierdaEstatico - derechaDinamico){
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        movimientoPosible = izquierdaEstatico - derechaDinamico ;
                    }

                    console.log("CHOQUE DERECHA");

                }

            }
            // Ya se han comprobado todos los estáticos
            this.dinamicos[i].x = this.dinamicos[i].x + movimientoPosible;
            this.dinamicos[i].vx = movimientoPosible;
        }
    }

    moverIzquierda(i){
        // Izquierda
        if ( this.dinamicos[i].vx < 0){
            var movimientoPosible = this.dinamicos[i].vx;
            // El mejor "idealmente" vx partimos de ese

            for(var j=0; j < this.estaticos.length; j++){
                var izquierdaDinamico
                    = this.dinamicos[i].x - this.dinamicos[i].ancho/2;
                var arribaDinamico
                    = this.dinamicos[i].y - this.dinamicos[i].alto/2;
                var abajoDinamico
                    = this.dinamicos[i].y + this.dinamicos[i].alto/2;
                var derechaEstatico
                    = this.estaticos[j].x + this.estaticos[j].ancho/2;
                var arribaEstatico
                    = this.estaticos[j].y - this.estaticos[j].alto/2;
                var abajoEstatico
                    = this.estaticos[j].y + this.estaticos[j].alto/2;

                // Alerta!, Elemento estático en la trayectoria.
                if ( (izquierdaDinamico + this.dinamicos[i].vx) <= derechaEstatico
                    && izquierdaDinamico >= derechaEstatico
                    && arribaEstatico < abajoDinamico
                    && abajoEstatico > arribaDinamico ){

                    // Comprobamos si la distancia al estático es mayor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible <= derechaEstatico - izquierdaDinamico ){
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor
                        movimientoPosible = derechaEstatico - izquierdaDinamico ;
                    }

                }
            }

            // Ya se han comprobado todos los estaticos
            this.dinamicos[i].x = this.dinamicos[i].x + movimientoPosible;
            this.dinamicos[i].vx = movimientoPosible;
        }

    }

    moverAbajo(i){
        if ( this.dinamicos[i].vy > 0){
            var movimientoPosible = this.dinamicos[i].vy;
            // El mejor "idealmente" es la velocidad vy.

            for(var j=0; j < this.estaticos.length; j++){
                var arribaDinamico
                    = this.dinamicos[i].y - this.dinamicos[i].alto/2;
                var abajoDinamico
                    = this.dinamicos[i].y + this.dinamicos[i].alto/2;
                var derechaDinamico
                    = this.dinamicos[i].x + this.dinamicos[i].ancho/2;
                var izquierdaDinamico
                    = this.dinamicos[i].x - this.dinamicos[i].ancho/2;
                var arribaEstatico
                    = this.estaticos[j].y - this.estaticos[j].alto/2;
                var abajoEstatico
                    = this.estaticos[j].y + this.estaticos[j].alto/2;
                var derechaEstatico
                    = this.estaticos[j].x + this.estaticos[j].ancho/2;
                var izquierdaEstatico
                    = this.estaticos[j].x - this.estaticos[j].ancho/2;

                // Alerta!, Elemento estático en la trayectoria.
                if ( (abajoDinamico +  this.dinamicos[i].vy) >= arribaEstatico &&
                    arribaDinamico < abajoEstatico
                    && izquierdaDinamico < derechaEstatico
                    && derechaDinamico > izquierdaEstatico ){

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible >= arribaEstatico - abajoDinamico ){
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        movimientoPosible = arribaEstatico - abajoDinamico;
                        this.dinamicos[i].choqueAbajo = true;

                        if (derechaDinamico <= derechaEstatico) {
                            this.dinamicos[i].fueraPorDerecha = false;
                        }

                        if (izquierdaDinamico >= izquierdaEstatico) {
                            this.dinamicos[i].fueraPorIzquierda = false;
                        }
                    }
                }
            }

            // Ya se han comprobado todos los estáticos
            this.dinamicos[i].y = this.dinamicos[i].y + movimientoPosible;
            this.dinamicos[i].vy = movimientoPosible;
        }
    }

    moverArriba(i){
        if ( this.dinamicos[i].vy < 0){
            var movimientoPosible = this.dinamicos[i].vy;
            // El mejor "idealmente" es la velocidad vy.

            for(var j=0; j < this.estaticos.length; j++){
                var arribaDinamico
                    = this.dinamicos[i].y - this.dinamicos[i].alto/2;
                var abajoDinamico
                    = this.dinamicos[i].y + this.dinamicos[i].alto/2;
                var derechaDinamico
                    = this.dinamicos[i].x + this.dinamicos[i].ancho/2;
                var izquierdaDinamico
                    = this.dinamicos[i].x - this.dinamicos[i].ancho/2;
                var arribaEstatico
                    = this.estaticos[j].y - this.estaticos[j].alto/2;
                var abajoEstatico
                    = this.estaticos[j].y + this.estaticos[j].alto/2;
                var derechaEstatico
                    = this.estaticos[j].x + this.estaticos[j].ancho/2;
                var izquierdaEstatico
                    = this.estaticos[j].x - this.estaticos[j].ancho/2;

                // Alerta!, Elemento estático en la trayectoria
                if ( (arribaDinamico +  this.dinamicos[i].vy) <= abajoEstatico &&
                    abajoDinamico > arribaEstatico
                    && izquierdaDinamico < derechaEstatico
                    && derechaDinamico > izquierdaEstatico ){

                    // Comprobamos si la distancia al estático es MAYOR
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible <= abajoEstatico - arribaDinamico ){
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor

                        movimientoPosible = abajoEstatico - arribaDinamico ;
                    }

                }
            }

            this.dinamicos[i].y = this.dinamicos[i].y + movimientoPosible;
            this.dinamicos[i].vy = movimientoPosible;
        }
    }
}
