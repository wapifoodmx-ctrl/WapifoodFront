# Cómo agregar el sonido de notificación

## Opción 1: Descargar un sonido gratuito
1. Ve a https://pixabay.com/sound-effects/search/notification/
2. Descarga un sonido de notificación/campanita
3. Renómbralo a "notification.mp3"
4. Cópialo a la carpeta /home/hugo/Documentos/Comanadas/public/

## Opción 2: Convertir un archivo existente
Si tienes un archivo de audio, usa ffmpeg:
```bash
ffmpeg -i tu_archivo.mp3 -codec:a libmp3lame -q:a 2 notification.mp3
```

## Opción 3: Generar con sox (si lo tienes instalado)
```bash
sox -n -r 44100 -c 2 notification.mp3 synth 0.3 sine 800 fade 0 0.3 0.1
```

Luego mueve el archivo a la carpeta public.
