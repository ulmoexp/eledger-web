# eledger-web

La web de [Movimientos bancarios](https://github.com/ulmoexp/eledger):
qué hace, cómo se instala y la guía de uso. Estática, sin build, servida
por GitHub Pages desde la raíz de `main`.

```
index.html       portada
guia/             la guía (en construcción)
reglas.html       sintaxis de rules.json (en construcción)
assets/           CSS compartido
```

## Ver los cambios en local

```
python3 -m http.server
```

y abrir `http://localhost:8000`.

## Nada de analítica

La portada promete privacidad; sería incoherente meter cualquier tipo de
rastreo aquí. Nada de Google Analytics, ni siquiera algo "anónimo".
