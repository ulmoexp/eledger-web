#!/bin/sh
# Publica la web en Surge (https://eledger.surge.sh).
#
#   ./publicar.sh                 publica en eledger.surge.sh
#   ./publicar.sh --prueba        enseña qué se publicaría, sin publicar
#
# Se publica SOLO lo que está comiteado (git archive HEAD), nunca la carpeta
# tal cual: en ella viven ficheros que no son de la web y no deben salir
# (las notas CLAUDE.md, el briefing del vídeo...), que Surge subiría sin
# preguntar. Por eso, además, se niega a publicar con cambios sin comitear:
# lo publicado es siempre un commit concreto.
#
# La primera vez hace falta `surge login` (se guarda en ~/.netrc).
set -e
cd "$(dirname "$0")"
DOMINIO="eledger.surge.sh"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Hay cambios sin comitear. Comitea primero: se publica lo que hay en el último commit." >&2
  exit 1
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
git archive HEAD | tar -x -C "$TMP"
# lo que está en el repo pero no es parte de la web
rm -f "$TMP/.gitignore" "$TMP/publicar.sh" "$TMP/README.md"

echo "Commit: $(git log -1 --format='%h %s')"
if [ "$1" = "--prueba" ]; then
  (cd "$TMP" && find . -type f | sort)
  exit 0
fi
surge "$TMP" "https://$DOMINIO"
