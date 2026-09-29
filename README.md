# eledger-web

La web de **Movimientos bancarios** (eledger), la herramienta que clasifica
tus movimientos bancarios sin que salgan de tu ordenador:
**https://ulmoexp.github.io/eledger-web/**

- La herramienta, su código y las descargas están en
  [ulmoexp/eledger](https://github.com/ulmoexp/eledger)
  ([última versión](https://github.com/ulmoexp/eledger/releases/latest)).
- ¿Un error o una sugerencia, de la web o de la herramienta? Abre un
  [issue](https://github.com/ulmoexp/eledger/issues) en ese repositorio.

## Apoya el proyecto

Es gratis y lo seguirá siendo. Si te resulta útil, puedes enviar lo que
quieras por Lightning (bitcoin) a
**`victoriouscookie143740@getalby.com`**, o escanear el código QR de la
[portada](https://ulmoexp.github.io/eledger-web/#apoya).

## Qué hay aquí

```
index.html        la portada
guia/             la guía de uso
reglas.html       cómo escribir tus reglas de clasificación
assets/           los estilos y la escena animada de la portada
```

Es HTML y CSS a mano, sin frameworks ni paso de compilación, servido por
GitHub Pages.

## Privacidad

La web no usa analítica, cookies ni recursos de terceros (tampoco fuentes
externas). La escena de la portada solo lee la hora de tu propio navegador
para pintar el cielo; no envía nada a ningún sitio.

## Verla en tu ordenador

```
python3 -m http.server
```

y abre `http://localhost:8000`.
