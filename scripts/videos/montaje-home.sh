#!/bin/sh
# Video del home: montaje con cortes rápidos de las otras tomas (Simón, 12-oct-2026:
# «el video de la portada debe ser impactante… expresar quizás todo… no es tan dinámico»).
# Uso: sh scripts/videos/montaje-home.sh /carpeta/con/las/tomas /salida/home-montaje.mp4
# La carpeta debe tener las tomas de automatizacion, home, dashboards, modelamiento y
# agentes-portada (cada una sale de su .mjs). Tramos en segundos: inicio:fin.
D="$1"; OUT="$2"
corte() { echo "[$1:v]trim=$2:$3,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.18:c=0xF4F5F9,fade=t=out:st=$(echo "$3 - $2 - 0.18" | bc):d=0.18:c=0xF4F5F9[v$1];"; }
ffmpeg -y -loglevel error \
  -i "$D/automatizacion.mp4" -i "$D/home.mp4" -i "$D/dashboards.mp4" -i "$D/modelamiento.mp4" -i "$D/home.mp4" -i "$D/agentes-portada.mp4" \
  -filter_complex "$(corte 0 0.3 3.0)$(corte 1 2.5 6.0)$(corte 2 4.6 7.4)$(corte 3 4.0 6.8)$(corte 4 10.3 12.3)$(corte 5 4.2 14.5)[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0,setpts=PTS/1.45,fps=30[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart "$OUT"
