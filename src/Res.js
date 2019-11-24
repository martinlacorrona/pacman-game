var cache = [];

// Lista re recursos a precargar
var imagenes = {
    /** JUGADOR **/
    jugador : "res/pacman.png",
    jugador_arriba : "res/pacman-arriba.png",
    jugador_abajo : "res/pacman-abajo.png",
    jugador_derecha : "res/pacman-derecha.png",
    jugador_izquierda : "res/pacman-izquierda.png",
    jugador_muriendose : "res/pacman-muriendose.png",
    disparo_jugador : "res/disparo_jugador.png",

    /** BLOQUES e ICONOS**/
    bloque_basico : "res/bloque-basico.png",
    bloque_basico2 : "res/bloque-nivel2.png",
    bloque_basico3 : "res/bloque-nivel3.png",
    bloque_vacio : "res/bloque-vacio.png",
    icono_recolectable : "res/pacdot.png",
    icono_recolectable_grande : "res/pacdot-big.png",
    icono_recolectable_bala : "res/bala.png",
    icono_recolectable_vida : "res/vida.png",

    /** ENEMIGOS **/
    enemigo_basico_abajo_rojo: "res/enemigo-basico-abajo-rojo.png",
    enemigo_basico_arriba_rojo: "res/enemigo-basico-arriba-rojo.png",
    enemigo_basico_derecha_rojo: "res/enemigo-basico-derecha-rojo.png",
    enemigo_basico_izquierda_rojo: "res/enemigo-basico-izquierda-rojo.png",
    enemigo_basico_abajo_verde: "res/enemigo-basico-abajo-verde.png",
    enemigo_basico_arriba_verde: "res/enemigo-basico-arriba-verde.png",
    enemigo_basico_derecha_verde: "res/enemigo-basico-derecha-verde.png",
    enemigo_basico_izquierda_verde: "res/enemigo-basico-izquierda-verde.png",
    enemigo_basico_abajo_azul: "res/enemigo-basico-abajo-azul.png",
    enemigo_basico_arriba_azul: "res/enemigo-basico-arriba-azul.png",
    enemigo_basico_derecha_azul: "res/enemigo-basico-derecha-azul.png",
    enemigo_basico_izquierda_azul: "res/enemigo-basico-izquierda-azul.png",
    enemigo_basico_abajo_amarillo: "res/enemigo-basico-abajo-amarillo.png",
    enemigo_basico_arriba_amarillo: "res/enemigo-basico-arriba-amarillo.png",
    enemigo_basico_derecha_amarillo: "res/enemigo-basico-derecha-amarillo.png",
    enemigo_basico_izquierda_amarillo: "res/enemigo-basico-izquierda-amarillo.png",
    enemigo_basico_escapando: "res/enemigo-basico-escapando.png",

    enemigo_boss_abajo: "res/enemigo-boss-abajo.png",
    enemigo_boss_arriba: "res/enemigo-boss-arriba.png",
    enemigo_boss_derecha: "res/enemigo-boss-derecha.png",
    enemigo_boss_izquierda: "res/enemigo-boss-izquierda.png",

    enemigo_boss_3_vidas: "res/enemigo-boss-3-vidas.png",
    enemigo_boss_2_vidas: "res/enemigo-boss-2-vidas.png",
    enemigo_boss_1_vidas: "res/enemigo-boss-1-vidas.png",

    /** PUNTOS **/
    puntos_1: "res/1pt.png",
    puntos_10: "res/10pts.png",
    puntos_100: "res/100pts.png",
    puntos_200: "res/200pts.png",
    puntos_400: "res/400pts.png",

    /** GUI **/
    gui : "res/gui.png",
    icono_vidas : "res/vida.png",
    icono_puntos : "res/icono_puntos.png",
    menu_fondo : "res/menuImg.png",
    mensaje_como_jugar : "res/mensaje_como_jugar.png",
    mensaje_ganar : "res/mensaje_ganar.png",
    mensaje_pasarDeNivel : "res/mensaje_pasarNivel.png",
    mensaje_pausa : "res/mensaje_pausa.png",
    mensaje_perder : "res/mensaje_perder.png",
    mensaje_perderVida : "res/mensaje_perderVida.png",
    boton_jugar : "res/boton_jugar.png",
    boton_pausa : "res/boton_pausa.png",
    boton_disparo : "res/boton_disparo.png",
    boton_salto : "res/boton_salto.png",
    boton_jugar : "res/boton_jugar.png",
    pad :"res/pad.png",
    fondo : "res/fondo.png",
};

var sonidos = {
    pacman_muere: "res/sounds/pacman_death.wav",
    pacman_comeEnemigo:  "res/sounds/pacman_eatenemy.wav",
    pacman_comeRecolectable: "res/sounds/pacman_eatingRecolectable.wav",
    pacman_comeVida: "/res/sounds/pacman_eatlife.wav",
    pacman_modoEscapando: "/res/sounds/pacman_intermission.wav",
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
