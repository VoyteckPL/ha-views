#!/usr/bin/with-contenv sh

echo "HA Views start"

if [ -n "$SUPERVISOR_TOKEN" ]; then
    echo "SUPERVISOR_TOKEN: OK (${#SUPERVISOR_TOKEN})"
else
    echo "SUPERVISOR_TOKEN: BRAK"
fi

exec python3 /app/server.py