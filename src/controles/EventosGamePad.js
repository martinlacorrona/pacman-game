//console.log("Navegador admiteMandos: "+admiteMandos());

// Los que hay pulsados actualmente
var botonesPulsados = [];

function admiteMandos() {
    return "getGamepads" in navigator;
}

window.addEventListener("gamepadconnected", function(e) {
    //console.log("GamePad Conectado tipo: "+e.gamepad.id);
    // Se podrían conectar varios, multijugador
    //console.log("Número: "+e.gamepad.index);

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

    //X
    let valorXJoystickIzquierdo = gP1.axes[0];
    if(valorXJoystickIzquierdo < zonaMuertaMando && valorXJoystickIzquierdo > -zonaMuertaMando)
        valorXJoystickIzquierdo = 0;
    controles.moverX = parseFloat(valorXJoystickIzquierdo).toFixed( 2 );

    //Y
    let valorYJoystickIzquierdo = gP1.axes[1] * (-1); //multiplicamos por -1 que estan invertidos
    if(valorYJoystickIzquierdo < zonaMuertaMando && valorYJoystickIzquierdo > -zonaMuertaMando)
        valorYJoystickIzquierdo = 0;
    controles.moverY = parseFloat(valorYJoystickIzquierdo).toFixed( 2 );

    if(gP1.buttons[0].pressed) { // 1 es el botón A
        if ( botonesPulsados[0] == false ) {
            botonesPulsados[0] = true;
            controles.disparo = true;
            controles.continuar = true;
        }
    } else if(gP1.buttons[9].pressed) { //start
        botonesPulsados[9] = true;
        controles.continuar = false;
        controles.pausa = true;
    } else {
        botonesPulsados[0] = false;
        botonesPulsados[9] = false;
        controles.disparo = false;
    }
}
