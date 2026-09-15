ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --no-cache python3 py3-aiohttp

COPY app /app
COPY run.sh /run.sh

RUN chmod +x /run.sh

WORKDIR /app

CMD ["/run.sh"]

[executed on device: C-PF5FZ66N (cc3bcbfb-8939-4cbf-862b-09938aa4fa40)]