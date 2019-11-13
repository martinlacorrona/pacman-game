var cache = [];

// Lista re recursos a precargar
var imagenes = {
    jugador : "res/pacman.png",
    jugador_arriba : "res/pacman-arriba.png",
    jugador_abajo : "res/pacman-abajo.png",
    jugador_derecha : "res/pacman-derecha.png",
    jugador_izquierda : "res/pacman-izquierda.png",
   //bloque_basico : "resOld/bloque_metal.png",
    bloque_basico : "res/bloque-basico.png",
    fondo : "res/fondo.png",
    enemigo : "resOld/enemigo.png",
    enemigo_movimiento : "resOld/enemigo_movimiento.png",
    disparo_jugador : "resOld/disparo_jugador.png",
    disparo_jugador2 : "resOld/disparo_jugador2.png",
    disparo_enemigo : "resOld/disparo_enemigo.png",
    icono_puntos : "resOld/icono_puntos.png",
    icono_vidas : "resOld/icono_vidas.png",
    icono_recolectable : "res/pacdot.png",
    animacion_recolectable : "resOld/recolectable.png",
    fondo_2 : "resOld/fondo_2.png",
    jugador_idle_derecha : "resOld/jugador_idle_derecha.png",
    jugador_idle_izquierda : "resOld/jugador_idle_izquierda.png",
    jugador_corriendo_derecha : "resOld/jugador_corriendo_derecha.png",
    jugador_corriendo_izquierda : "resOld/jugador_corriendo_izquierda.png",
    jugador_disparando_derecha : "resOld/jugador_disparando_derecha.png",
    jugador_disparando_izquierda : "resOld/jugador_disparando_izquierda.png",
    jugador_saltando_derecha : "resOld/jugador_saltando_derecha.png",
    jugador_saltando_izquierda : "resOld/jugador_saltando_izquierda.png",
    enemigo_morir : "resOld/enemigo_morir.png",
    bloque_tierra : "resOld/bloque_tierra.png",
    bloque_metal : "resOld/bloque_metal.png",
    bloque_fondo_muro : "resOld/bloque_fondo_muro.png",
    copa : "resOld/copa.png",
    pad :"resOld/pad.png",
    boton_disparo : "resOld/boton_disparo.png",
    boton_salto : "resOld/boton_salto.png",
    boton_pausa : "resOld/boton_pausa.png",
    menu_fondo : "res/menuImg.png",
    boton_jugar : "resOld/boton_jugar.png",
    mensaje_como_jugar : "resOld/mensaje_como_jugar.png",
    mensaje_ganar : "resOld/mensaje_ganar.png",
    mensaje_perder : "resOld/mensaje_perder.png",
    enemigo_disparador: "resOld/enemigodisparador.png",
    enemigo_disparador_muriendo: "resOld/enemigodisparador_muriendo.png",
    enemigo_disparador_animacion: "resOld/enemigodisparador_animacion.png",
    enemigo_saltador: "resOld/enemigosaltador.png",
    enemigo_saltador_muriendo: "resOld/enemigosaltador_muriendo.png",
    enemigo_saltador_animacion: "resOld/enemigosaltador_movimiento.png",
    enemigo_generador: "resOld/generador.png",
};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    var imagenCargar = new Image();
    imagenCargar.src = rutasImagenes[indice];
    cache[rutasImagenes[indice]] = new Image();
    cache[rutasImagenes[indice]].src = rutasImagenes[indice];
    imagenCargar.onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}
