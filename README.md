# soundboard

## How to use

```bash
docker run -v local_path:/app/public/sounds -d -p 8000:80 xelevate/soundboard:latest
# or
docker run -d -p 8000:80 xelevate/soundboard:v2.0.4
```

```bash
podman run -d -p 8000:80 xelevate/soundboard:latest
# or
podman run -d -p 8000:80 xelevate/soundboard:v2.0.4
```

## Persistent Storage

```bash
docker run -v local_path:/app/public/sounds -d -p 8000:80 xelevate/soundboard:latest
# or
docker run -v local_path:/app/public/sounds -d -p 8000:80 xelevate/soundboard:v2.0.4
```

```bash
podman run -v local_path:/app/public/sounds -d -p 8000:80 xelevate/soundboard:latest
# or
podman run -v local_path:/app/public/sounds -d -p 8000:80 xelevate/soundboard:v2.0.4
```

## Custom CSS Environment Variables

```
background_color=#023e8a
font_color=#caf0f8
button_background_color=#0077b6
button_border_color=#00b4d8
```
