class Texto {

    constructor(valor, x, y) {
        this.valor = valor;
        this.x = x;
        this.y = y;
    }

    dibujar (){
        contexto.font = "20px Arial";
        contexto.fillStyle = "white";
        contexto.textAlign = "left";
        contexto.fillText(this.valor,this.x,this.y);
    }

}
