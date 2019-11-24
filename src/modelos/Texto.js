class Texto {

    constructor(valor, x, y, color) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.color = color || "white";
    }

    dibujar (){
        contexto.font = "12px Arial";
        contexto.fillStyle = this.color;
        contexto.textAlign = "left";
        contexto.fillText(this.valor,this.x,this.y);
    }

}
