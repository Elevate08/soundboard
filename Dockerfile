FROM denoland/deno:2.0.2

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

ENV background_color=#023e8a
ENV font_color=#caf0f8
ENV button_background_color=#0077b6
ENV button_border_color=#00b4d8

# Cache the dependencies as a layer (the following two steps are re-run only when deno.json modified).
# Ideally cache deno.json will download and compile _all_ external files used in main.ts.
COPY deno.json .
RUN deno install --entrypoint deno.json

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.js

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--allow-write", "main.js"]
