/* El botón «Copiar» de la dirección Lightning (sección «Apoya el
   proyecto» de la portada). Solo copia al portapapeles: no se pide nada a
   ningún servidor. Sin JS, o sin portapapeles disponible, el botón no
   aparece y la dirección se puede seleccionar a mano. */
(function () {
  "use strict";
  var boton = document.getElementById("copiar-ln");
  var direccion = document.getElementById("direccion-ln");
  if (!boton || !direccion || !navigator.clipboard) return;
  boton.hidden = false;
  var reloj = null;
  boton.addEventListener("click", function () {
    navigator.clipboard.writeText(direccion.textContent.trim()).then(function () {
      boton.textContent = "Copiada";
      clearTimeout(reloj);
      reloj = setTimeout(function () { boton.textContent = "Copiar"; }, 2000);
    });
  });
})();
