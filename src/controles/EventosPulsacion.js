window.addEventListener('touchstart', touchstart, false);
window.addEventListener('touchmove', touchmove, false);

window.addEventListener('touchend', eliminarTouch, false);
window.addEventListener('touchcancel', eliminarTouch, false);
window.addEventListener('touchleave', eliminarTouch, false);

function touchstart( event) {
    var touches = event.changedTouches;
    for (var i=0; i<touches.length; i++) {
        agregarPulsacion( touches[i].identifier,
            tipoPulsacion.inicio, touches[i]);
    }
}

function touchmove( event) {
    var touches = event.changedTouches;
    for (var i=0; i<touches.length; i++) {
        agregarPulsacion( touches[i].identifier,
            tipoPulsacion.mantener, touches[i]);
    }
}

function eliminarTouch ( event) {
    var touches = event.changedTouches;
    for (var i=0; i<touches.length; i++) {
        eliminarPulsacion( touches[i].identifier);
    }
}

window.addEventListener('mousedown', mousedown);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);

function mousedown( event) {
    agregarPulsacion(1, tipoPulsacion.inicio, event);
}

function mousemove (event){
    if (pulsaciones.length == 0 || event.timeStamp - pulsaciones[0].timeStamp > 10 ) {
        agregarPulsacion(1, tipoPulsacion.mantener, event);
    }
}

function mouseup(event) {
    eliminarPulsacion(1);
}

function agregarPulsacion(id, tipoPulsacion, event ){
    entrada = entradas.pulsaciones;

    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;

    var p = {};
    p.x = x /escaladoMinimo;
    p.y = y /escaladoMinimo;
    p.id = id; // Ratón SOLO hay 1
    p.tipo = tipoPulsacion;
    p.timeStamp = event.timeStamp;

    var pulsacionEncontrada = false;
    for(var i=0; i < pulsaciones.length; i++){
        if ( pulsaciones[i].id ==  id){
            pulsaciones[i] = p;
            pulsacionEncontrada = true;
        }
    }

    if ( !pulsacionEncontrada ) {
        pulsaciones.push(p);
    }

}


function eliminarPulsacion(id){
    for(var i=0; i < pulsaciones.length; i++){
        if ( pulsaciones[i].id ==  id){
            pulsaciones.splice( i, 1);
        }
    }
}
