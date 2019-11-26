class Texto {

    constructor(valor, x, y, color, font, textAlign) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.color = color || "white";
        this.font = font || "12px Arial";
        this.textAlign = textAlign || "left";
    }

    dibujar (){
        contexto.font = this.font;
        contexto.fillStyle = this.color;
        contexto.textAlign = this.textAlign;
        contexto.fillText(this.valor,this.x,this.y);
    }

}
