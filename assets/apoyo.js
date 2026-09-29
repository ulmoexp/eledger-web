/* El botón «Copiar» de la dirección Lightning (sección «Apoya el
   proyecto» de la portada). Solo copia al portapapeles: no se pide nada a
   ningún servidor. Sin JS, o sin portapapeles disponible, el botón no
   aparece y la dirección se puede seleccionar a mano.

   Al copiar sale un aviso al lado del botón, que se va solo. Es una zona
   role="status": los lectores de pantalla también lo anuncian. */
(function () {
  "use strict";
  var boton = document.getElementById("copiar-ln");
  var direccion = document.getElementById("direccion-ln");
  var aviso = document.getElementById("aviso-ln");
  if (!boton || !direccion || !navigator.clipboard) return;
  boton.hidden = false;
  var reloj = null;

  // el tick, dibujado como los iconos de la portada (trazo, sin emoji)
  var TICK = '<svg class="apoyo-tick" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
    'stroke="currentColor" stroke-width="2.4" stroke-linecap="square" ' +
    'stroke-linejoin="miter"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  function avisar(texto, fallo) {
    if (!aviso) return;
    aviso.innerHTML = (fallo ? "" : TICK) + "<span>" + texto + "</span>";
    aviso.classList.toggle("fallo", !!fallo);
    aviso.classList.add("visible");
    clearTimeout(reloj);
    reloj = setTimeout(function () { aviso.classList.remove("visible"); }, 2500);
  }

  boton.addEventListener("click", function () {
    navigator.clipboard.writeText(direccion.textContent.trim()).then(function () {
      avisar("Copiado");
    }, function () {
      avisar("No se ha podido copiar: selecciónala a mano", true);
    });
  });
})();
