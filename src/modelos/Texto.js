class Texto {

    constructor(valor, x, y, color, font) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.color = color || "white";
        this.font = font || "12px Arial";
    }

    dibujar (){
        contexto.font = this.font;
        contexto.fillStyle = this.color;
        contexto.textAlign = "left";
        contexto.fillText(this.valor,this.x,this.y);
    }

}
