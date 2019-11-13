console.log("Navegador admiteMandos: "+admiteMandos());

// Los que hay pulsados actualmente
var botonesPulsados = [];

function admiteMandos() {
    return "getGamepads" in navigator;
}

window.addEventListener("gamepadconnected", function(e) {
    console.log("GamePad Conectado tipo: "+e.gamepad.id);
    // Se podrían conectar varios, multijugador
    console.log("Número: "+e.gamepad.index);

    // Leer botones del mando
    if ( navigator.getGamepads()[0] != null ){
        setInterval(actualizarOrdenes,1000/30);
    }

});

function actualizarOrdenes(){
    // Obtener gamePad en cada iteración
    var gP1 = navigator.getGamepads()[0];

    for(var i=0; i <  gP1.buttons.length; i++){
        if ( gP1.buttons[i].pressed ) {
            entrada = entradas.gamepad;
        }
    }
    if ( entrada != entradas.gamepad){
        return;
    }
    // Pad de la izquierda gP1.axes[0] - X ,  gP1.axes[1] - Y
    // Los joystics van valores entre -1(izquierda) y 1(derecha)
    // El centro del joystick es 0
    // Float con 2 decimales
    controles.moverX = parseFloat(gP1.axes[0]).toFixed( 2 );

    if ( gP1.buttons[0].pressed){ // 1 es el botón B
        if ( botonesPulsados[0] == false ) {
            botonesPulsados[0] = true;
            controles.moverY = 1;
        }
    } else {
        botonesPulsados[0] = false;
        controles.moverY = 0;
    }

    if ( gP1.buttons[2].pressed){ // 2 es el botón A
        if ( botonesPulsados[2] == false ) {
            botonesPulsados[2] = true
            controles.disparo = true;
            controles.continuar = true;
        }
    } else {
        botonesPulsados[2] = false
        controles.disparo = false;
        controles.continuar = false;
    }
}
