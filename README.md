# korerorero-voice-service

Abstract tts and voice caching

## Docker

To build

```bash
docker build -t korerorero-voice-service:dev .
```

To run

```bash
docker run -p 4000:4000 --env-file .env korerorero-voice-service:dev
```

## Start dependant services in korerorero-reverse-proxy

```bash
docker-compose run -p 3005:3005 -e IS_DEV=true -e TMP_DIR=/tmp/ mouth-shapes
```
