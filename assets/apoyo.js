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

  function avisar(texto, fallo) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.toggle("fallo", !!fallo);
    aviso.classList.add("visible");
    clearTimeout(reloj);
    reloj = setTimeout(function () { aviso.classList.remove("visible"); }, 2500);
  }

  boton.addEventListener("click", function () {
    navigator.clipboard.writeText(direccion.textContent.trim()).then(function () {
      avisar("Dirección copiada");
    }, function () {
      avisar("No se ha podido copiar: selecciónala a mano", true);
    });
  });
})();
