class Modelo {

    constructor(imagenRuta, x, y) {
        this.imagen = cache[imagenRuta];
        this.x = x;
        this.y = y;
        this.ancho = this.imagen.width;
        this.alto = this.imagen.height;

        //Declaramos como undefinida la animacion
        this.animacion = undefined;
    }


    dibujar (scrollX, scrollY){
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        contexto.drawImage(this.imagen,
            this.x - this.ancho /2 - scrollX,
            this.y - this.alto /2 - scrollY,
            this.ancho,
            this.alto);
    }


    colisiona(modelo){
        var colisiona = false;

        if ( modelo.x - modelo.ancho/2 <=  this.x + this.ancho/2
            && modelo.x + modelo.ancho/2 >= this.x - this.ancho/2
            && this.y + this.alto/2 >= modelo.y - modelo.alto/2
            && this.y - this.alto/2 <= modelo.y + modelo.alto/2 ){

            colisiona = true;

        }
        return colisiona;
    }

    actualizar() {
        if(this.animacion != undefined)
            this.animacion.actualizar();
    }

}
