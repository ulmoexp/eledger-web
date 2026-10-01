# eledger-web

La web de **Movimientos bancarios** (eledger), la herramienta que clasifica
tus movimientos bancarios sin que salgan de tu ordenador:
**https://eledger.surge.sh**

- La herramienta, su código y las descargas están en
  [ulmoexp/eledger](https://github.com/ulmoexp/eledger)
  ([última versión](https://github.com/ulmoexp/eledger/releases/latest)).
- ¿Un error o una sugerencia, de la web o de la herramienta? Abre un
  [issue](https://github.com/ulmoexp/eledger/issues) en ese repositorio.

## Apoya el proyecto

Es gratis y lo seguirá siendo. Si te resulta útil, puedes enviar lo que
quieras por Lightning (bitcoin) a
**`victoriouscookie143740@getalby.com`**, o escanear el código QR de la
[portada](https://eledger.surge.sh/#apoya).

## Qué hay aquí

```
index.html        la portada
guia/             la guía de uso
reglas.html       cómo escribir tus reglas de clasificación
assets/           los estilos, la escena animada y el vídeo de la portada
```

Es HTML y CSS a mano, sin frameworks ni paso de compilación. Se publica en
[Surge](https://surge.sh) con `./publicar.sh`, que sube solo lo que está
comiteado (la primera vez hace falta `surge login`).

**Ojo: un `git push` no actualiza la web.** Después de comitear un cambio
hay que ejecutar `./publicar.sh`. La copia de GitHub Pages
(ulmoexp.github.io/eledger-web) solo redirige a eledger.surge.sh.

## Privacidad

La web no usa analítica, cookies ni recursos de terceros (tampoco fuentes
externas). La escena de la portada solo lee la hora de tu propio navegador
para pintar el cielo; no envía nada a ningún sitio.

## Verla en tu ordenador

```
python3 -m http.server
```

y abre `http://localhost:8000`.
