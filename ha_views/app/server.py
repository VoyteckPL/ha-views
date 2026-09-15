import os
import asyncio
import json
import re
import shutil
import time
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

import aiohttp
from aiohttp import web


HA_API = "http://supervisor/core/api"

# HA Views starts without any preconfigured entities. Each dashboard stores
# and requests only the entity IDs selected by its own Home Assistant user.
ENTITIES = []
HISTORY_ENTITIES = []

def token():
    return os.environ.get("SUPERVISOR_TOKEN", "")


def headers():
    return {
        "Authorization": f"Bearer {token()}"
    }


async def ha_state(session, entity_id):
    try:
        async with session.get(
            f"{HA_API}/states/{entity_id}",
            headers=headers(),
        ) as resp:
            text = await resp.text()

            if resp.status != 200:
                print(
                    f"HA API {entity_id}: HTTP {resp.status}: {text}",
                    flush=True,
                )
                return {
                    "state": "unavailable",
                    "attributes": {},
                    "error": f"HTTP {resp.status}",
                }

            return json.loads(text)

    except Exception as err:
        print(
            f"HA API {entity_id}: {type(err).__name__}: {err}",
            flush=True,
        )

        return {
            "state": "unavailable",
            "attributes": {},
            "error": str(err),
        }


async def api_states(request):
    async with aiohttp.ClientSession() as session:
        tasks = [
            ha_state(session, entity_id)
            for entity_id in ENTITIES
        ]

        values = await __import__("asyncio").gather(*tasks)

        result = {
            entity_id: value
            for entity_id, value in zip(ENTITIES, values)
        }

        return web.json_response(result)


async def api_selected_states(request):
    try:
        body = await request.json()
    except Exception:
        return web.json_response({"ok": False, "error": "Nieprawidłowy JSON"}, status=400)
    entity_ids = body.get("entity_ids") if isinstance(body, dict) else None
    if not isinstance(entity_ids, list):
        return web.json_response({"ok": False, "error": "Brak listy encji"}, status=400)
    entity_ids = [
        str(value).strip()
        for value in entity_ids[:250]
        if isinstance(value, str) and "." in value
    ]
    async with aiohttp.ClientSession() as session:
        values = await asyncio.gather(*[
            ha_state(session, entity_id)
            for entity_id in entity_ids
        ])
    return web.json_response({
        "ok": True,
        "states": {
            entity_id: value
            for entity_id, value in zip(entity_ids, values)
        },
    })



# Generic optional control endpoint. It never contains user-specific entity IDs.
async def api_control(request):
    try:
        body = await request.json()
    except Exception:
        return web.json_response({"ok": False, "error": "Invalid JSON"}, status=400)

    entity_id = str(body.get("entity_id", "")).strip()
    action = str(body.get("action", "")).strip()
    if not re.fullmatch(r"[a-z_]+\.[a-zA-Z0-9_]+", entity_id):
        return web.json_response({"ok": False, "error": "Invalid entity ID"}, status=400)

    domain = entity_id.split(".", 1)[0]
    payload = {"entity_id": entity_id}
    if action in ("turn_on", "turn_off") and domain in {"switch", "light", "fan", "input_boolean"}:
        service_url = f"{HA_API}/services/{domain}/{action}"
    elif action == "set_value" and domain in {"number", "input_number"}:
        try:
            payload["value"] = float(body.get("value"))
        except (TypeError, ValueError):
            return web.json_response({"ok": False, "error": "Invalid value"}, status=400)
        service_url = f"{HA_API}/services/{domain}/set_value"
    else:
        return web.json_response({"ok": False, "error": "Unsupported action"}, status=400)

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(service_url, headers=headers(), json=payload) as resp:
                if resp.status not in (200, 201):
                    return web.json_response({"ok": False, "error": f"HA HTTP {resp.status}"}, status=resp.status)
    except Exception as err:
        return web.json_response({"ok": False, "error": str(err)}, status=500)

    return web.json_response({"ok": True, "entity_id": entity_id, "action": action})


async def api_history(request):
    try:
        hours = int(request.query.get("hours", "24"))
    except ValueError:
        hours = 24

    hours = max(1, min(hours, 168))

    end = datetime.now(timezone.utc)
    start = end - timedelta(hours=hours)

    start_iso = start.isoformat()
    end_iso = end.isoformat()

    filter_ids = ",".join(HISTORY_ENTITIES)

    url = (
        f"{HA_API}/history/period/{quote(start_iso, safe=':+')}"
        f"?filter_entity_id={quote(filter_ids, safe=',._')}"
        f"&end_time={quote(end_iso, safe=':+')}"
        f"&no_attributes"
    )

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                headers=headers(),
            ) as resp:

                text = await resp.text()

                if resp.status != 200:
                    return web.json_response(
                        {
                            "error": f"HTTP {resp.status}",
                            "body": text,
                        },
                        status=resp.status,
                    )

                raw = json.loads(text)

    except Exception as err:
        return web.json_response(
            {"error": str(err)},
            status=500,
        )

    result = {}

    for series in raw:
        if not series:
            continue

        entity_id = series[0].get("entity_id")

        if not entity_id:
            continue

        points = []

        for item in series:
            try:
                value = float(item.get("state"))
            except (TypeError, ValueError):
                continue

            ts = (
                item.get("last_changed")
                or item.get("last_updated")
            )

            if not ts:
                continue

            points.append({
                "t": ts,
                "v": value,
            })

        result[entity_id] = points

    return web.json_response({
        "start": start_iso,
        "end": end_iso,
        "series": result,
    })



async def api_entity_history(request):
    entity_id = str(request.query.get("entity_id", "")).strip()
    if not re.fullmatch(r"[a-z_]+\.[a-zA-Z0-9_]+", entity_id):
        return web.json_response({"ok": False, "error": "Nieprawidlowa encja"}, status=400)
    try:
        hours = max(1, min(int(request.query.get("hours", "24")), 168))
    except ValueError:
        hours = 24
    end = datetime.now(timezone.utc)
    start = end - timedelta(hours=hours)
    start_iso, end_iso = start.isoformat(), end.isoformat()
    url = (
        f"{HA_API}/history/period/{quote(start_iso, safe=':+')}"
        f"?filter_entity_id={quote(entity_id, safe='._')}"
        f"&end_time={quote(end_iso, safe=':+')}&no_attributes"
    )
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers()) as resp:
                text = await resp.text()
                if resp.status != 200:
                    return web.json_response({"ok": False, "error": f"HA HTTP {resp.status}"}, status=resp.status)
                raw = json.loads(text)
    except Exception as err:
        return web.json_response({"ok": False, "error": str(err)}, status=500)
    series = raw[0] if isinstance(raw, list) and raw else []
    points = [{
        "state": item.get("state"),
        "t": item.get("last_changed") or item.get("last_updated"),
    } for item in series[-2000:] if item.get("last_changed") or item.get("last_updated")]
    return web.json_response({"ok": True, "entity_id": entity_id, "hours": hours, "points": points})


# ===== HA Views LAYOUT API V10 =====

LAYOUT_DIR = "/data/layouts"

# Na razie świadomie jeden profil desktopowy.
LAYOUT_PROFILE = "pc_wojtek"

LAYOUT_FILE = os.path.join(
    LAYOUT_DIR,
    LAYOUT_PROFILE + ".json",
)


def ensure_layout_dir():
    os.makedirs(
        LAYOUT_DIR,
        exist_ok=True,
    )


async def api_layout_get(request):
    ensure_layout_dir()

    if not os.path.exists(LAYOUT_FILE):
        return web.json_response({
            "ok": True,
            "profile": LAYOUT_PROFILE,
            "exists": False,
            "data": None,
        })

    try:
        with open(
            LAYOUT_FILE,
            "r",
            encoding="utf-8",
        ) as f:
            data = json.load(f)

    except Exception as err:
        return web.json_response(
            {
                "ok": False,
                "error": str(err),
            },
            status=500,
        )

    return web.json_response({
        "ok": True,
        "profile": LAYOUT_PROFILE,
        "exists": True,
        "data": data,
    })


async def api_layout_save(request):
    try:
        body = await request.json()
    except Exception:
        return web.json_response(
            {
                "ok": False,
                "error": "Nieprawidłowy JSON",
            },
            status=400,
        )

    if not isinstance(body, dict):
        return web.json_response(
            {
                "ok": False,
                "error": "Layout musi być obiektem JSON",
            },
            status=400,
        )

    # Prosty limit bezpieczeństwa.
    raw = json.dumps(
        body,
        ensure_ascii=False,
    )

    if len(raw.encode("utf-8")) > 512 * 1024:
        return web.json_response(
            {
                "ok": False,
                "error": "Layout jest za duży",
            },
            status=413,
        )

    ensure_layout_dir()

    tmp = LAYOUT_FILE + ".tmp"

    try:
        with open(
            tmp,
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(
                body,
                f,
                ensure_ascii=False,
                indent=2,
            )

        # Atomowy replace:
        # nie zostawiamy pół pliku przy problemie.
        os.replace(
            tmp,
            LAYOUT_FILE,
        )

    except Exception as err:
        try:
            if os.path.exists(tmp):
                os.remove(tmp)
        except Exception:
            pass

        return web.json_response(
            {
                "ok": False,
                "error": str(err),
            },
            status=500,
        )

    return web.json_response({
        "ok": True,
        "profile": LAYOUT_PROFILE,
    })

# ===== END HA Views LAYOUT API V10 =====



# ============================================================
# HA Views INTEGRATIONS API V1
# ============================================================

HA_WS = "ws://supervisor/core/websocket"


async def ha_ws_command(command):
    """
    Jedno zapytanie do WebSocket API Home Assistanta.
    Używamy SUPERVISOR_TOKEN dostępnego w add-onie.
    """

    async with aiohttp.ClientSession() as session:

        async with session.ws_connect(
            HA_WS,
            headers=headers(),
            heartbeat=30,
        ) as ws:

            first = await ws.receive_json()

            if first.get("type") == "auth_required":

                await ws.send_json({
                    "type": "auth",
                    "access_token": token(),
                })

                auth_result = await ws.receive_json()

                if auth_result.get("type") != "auth_ok":
                    raise RuntimeError(
                        "Home Assistant WebSocket authentication failed"
                    )

            elif first.get("type") == "auth_invalid":

                raise RuntimeError(
                    "Home Assistant WebSocket authentication invalid"
                )


            request_id = 1

            payload = {
                "id": request_id,
                **command,
            }

            await ws.send_json(
                payload
            )


            while True:

                msg = await ws.receive_json()

                if msg.get("id") != request_id:
                    continue
                if msg.get("type") != "result":
                    continue

                if not msg.get("success"):
                    raise RuntimeError(
                        str(
                            msg.get(
                                "error",
                                "Home Assistant WebSocket error"
                            )
                        )
                    )

                return msg.get("result")


async def ha_all_states():
    """
    Wszystkie aktualne stany HA.
    """

    async with aiohttp.ClientSession() as session:

        async with session.get(
            f"{HA_API}/states",
            headers=headers(),
        ) as resp:

            text = await resp.text()

            if resp.status != 200:
                raise RuntimeError(
                    f"HA states HTTP {resp.status}: {text}"
                )

            data = json.loads(text)

            if not isinstance(data, list):
                return []

            return data


async def api_integrations(request):
    """
    Lista wszystkich config entries Home Assistanta.
    Jedna pozycja = jedna skonfigurowana instancja integracji.
    """

    try:

        entries = await ha_ws_command({
            "type": "config_entries/get",
        })

    except Exception as err:

        return web.json_response(
            {
                "ok": False,
                "error": str(err),
                "integrations": [],
            },
            status=500,
        )


    result = []

    if not isinstance(entries, list):
        entries = []


    for item in entries:

        if not isinstance(item, dict):
            continue


        entry_id = item.get("entry_id")

        if not entry_id:
            continue


        # Pokazujemy tylko działające config entries,
        # odpowiadające aktywnym integracjom widocznym w HA.
        if (
            item.get("state") != "loaded"
            or item.get("disabled_by")
            or item.get("source") == "ignore"
        ):
            continue


        result.append({
            "entry_id":
                entry_id,

            "domain":
                item.get("domain") or "",

            "title":
                item.get("title")
                or item.get("domain")
                or entry_id,

            "state":
                item.get("state") or "",

            "source":
                item.get("source") or "",
        })


    result.sort(
        key=lambda x: (
            str(
                x.get("title", "")
            ).lower(),
            str(
                x.get("domain", "")
            ).lower(),
        )
    )


    return web.json_response({
        "ok": True,
        "integrations": result,
    })


async def api_integration_entities(request):
    """
    Wszystkie encje należące do jednej config entry.

    Obsługujemy:
    - bezpośredni config_entry_id encji,
    - config_entry_ids,
    - encje należące do urządzenia przypisanego
      do wybranej config entry.
    """

    entry_id = (
        request.query.get(
            "entry_id",
            ""
        )
        .strip()
    )


    if not entry_id:

        return web.json_response(
            {
                "ok": False,
                "error": "Brak entry_id",
                "entities": [],
            },
            status=400,
        )


    try:

        entity_registry = await ha_ws_command({
            "type": "config/entity_registry/list",
        })

        # HA Views ENABLED ENTITY SOURCE OF TRUTH V3
        #
        # Home Assistant zwraca tutaj WYŁĄCZNIE encje aktywne.
        # Nie opieramy więc klasyfikacji tylko na disabled_by.
        display_registry = await ha_ws_command({
            "type": "config/entity_registry/list_for_display",
        })

        device_registry = await ha_ws_command({
            "type": "config/device_registry/list",
        })

        states = await ha_all_states()

    except Exception as err:

        return web.json_response(
            {
                "ok": False,
                "error": str(err),
                "entities": [],
            },
            status=500,
        )


    if not isinstance(entity_registry, list):
        entity_registry = []

    if not isinstance(device_registry, list):
        device_registry = []

    if not isinstance(states, list):
        states = []


    # ========================================================
    # HA Views ENABLED ENTITY SOURCE OF TRUTH V3
    # ========================================================

    enabled_entity_ids = set()


    if isinstance(display_registry, dict):

        display_entities = (
            display_registry.get("entities")
            or []
        )

    else:

        display_entities = []


    for display_item in display_entities:

        if not isinstance(display_item, dict):
            continue


        # list_for_display używa kompaktowego klucza "ei"
        entity_id = (
            display_item.get("ei")
            or display_item.get("entity_id")
        )


        if entity_id:
            enabled_entity_ids.add(
                entity_id
            )


    state_map = {
        item.get("entity_id"): item
        for item in states
        if isinstance(item, dict)
        and item.get("entity_id")
    }


    matching_devices = set()
    device_name_map = {}


    for device in device_registry:

        if not isinstance(device, dict):
            continue


        device_id = device.get("id")

        if device_id:

            device_name_map[device_id] = (
                device.get("name_by_user")
                or device.get("name")
                or ""
            )


        config_entries = (
            device.get("config_entries")
            or []
        )

        if isinstance(config_entries, str):
            config_entries = [config_entries]


        singular_entry = (
            device.get("config_entry_id")
        )


        device_entry_ids = set(
            config_entries
        )

        if singular_entry:
            device_entry_ids.add(
                singular_entry
            )


        if entry_id in device_entry_ids:
            if device_id:
                matching_devices.add(
                    device_id
                )


    entities = []


    for item in entity_registry:

        if not isinstance(item, dict):
            continue


        entity_id = item.get("entity_id")

        if not entity_id:
            continue


        direct_entry_id = (
            item.get("config_entry_id")
        )

        direct_entry_ids = (
            item.get("config_entry_ids")
            or []
        )

        device_id = (
            item.get("device_id")
        )


        belongs = (
            direct_entry_id == entry_id
            or entry_id in direct_entry_ids
            or (
                device_id
                and device_id
                in matching_devices
            )
        )


        if not belongs:
            continue


        state_obj = (
            state_map.get(entity_id)
            or {}
        )

        attributes = (
            state_obj.get("attributes")
            or {}
        )


        friendly_name = (
            attributes.get("friendly_name")
            or item.get("name")
            or item.get("original_name")
            or entity_id
        )


        entities.append({

            "entity_id":
                entity_id,

            "name":
                friendly_name,

            "state":
                state_obj.get("state"),

            "unit":
                attributes.get(
                    "unit_of_measurement"
                ),

            "platform":
                item.get("platform") or "",

            "disabled_by":
                item.get("disabled_by"),

            # V3:
            # prawdziwy status aktywności według
            # entity_registry/list_for_display.
            "enabled":
                entity_id in enabled_entity_ids,

            "device_id":
                device_id,

            "device_name":
                device_name_map.get(
                    device_id,
                    ""
                ),

        })


    entities.sort(
        key=lambda x: (
            str(
                x.get("name", "")
            ).lower(),
            x.get("entity_id", ""),
        )
    )


    return web.json_response({
        "ok": True,
        "entry_id": entry_id,
        "count": len(entities),
        "entities": entities,
    })


# ===== END HA Views INTEGRATIONS API V1 =====





# ============================================================
# HA Views ENABLE ENTITY API V2
# ============================================================

async def api_enable_entity(request):

    try:

        body = await request.json()

    except Exception:

        return web.json_response(
            {
                "ok": False,
                "error": "Nieprawidłowy JSON",
            },
            status=400,
        )


    entity_id = str(
        body.get(
            "entity_id",
            ""
        )
    ).strip()


    if not entity_id:

        return web.json_response(
            {
                "ok": False,
                "error": "Brak entity_id",
            },
            status=400,
        )


    try:

        result = await ha_ws_command({

            "type":
                "config/entity_registry/update",

            "entity_id":
                entity_id,

            "disabled_by":
                None,

        })

    except Exception as err:

        return web.json_response(
            {
                "ok": False,
                "error": str(err),
                "entity_id": entity_id,
            },
            status=500,
        )


    return web.json_response({
        "ok": True,
        "entity_id": entity_id,
        "result": result,
    })


# ===== END HA Views ENABLE ENTITY API V2 =====


# ============================================================
# HA Views DISABLE ENTITY API V5
# ============================================================

async def api_disable_entity(request):

    try:

        body = await request.json()

    except Exception:

        return web.json_response(
            {
                "ok": False,
                "error": "Nieprawidłowy JSON",
            },
            status=400,
        )


    entity_id = str(
        body.get(
            "entity_id",
            ""
        )
    ).strip()


    if not entity_id:

        return web.json_response(
            {
                "ok": False,
                "error": "Brak entity_id",
            },
            status=400,
        )


    try:

        result = await ha_ws_command({

            "type":
                "config/entity_registry/update",

            "entity_id":
                entity_id,

            "disabled_by":
                "user",

        })


    except Exception as err:

        return web.json_response(
            {
                "ok": False,
                "error": str(err),
                "entity_id": entity_id,
            },
            status=500,
        )


    return web.json_response({
        "ok": True,
        "entity_id": entity_id,
        "result": result,
    })


# ===== END HA Views DISABLE ENTITY API V5 =====






# HA Views ENTITY HISTORY API V6 REMOVED BY V7


# ===== HA Views NO CACHE V1 =====

# HA Views LIVE ENTITY EVENTS V1
async def api_entity_events(request):
    response = web.StreamResponse(
        status=200,
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )

    await response.prepare(request)

    try:

        async with aiohttp.ClientSession() as session:

            async with session.ws_connect(
                HA_WS,
                headers=headers(),
                heartbeat=30,
            ) as ws:

                first = await ws.receive_json()

                if first.get("type") == "auth_required":

                    await ws.send_json({
                        "type": "auth",
                        "access_token": token(),
                    })

                    auth_result = await ws.receive_json()

                    if auth_result.get("type") != "auth_ok":
                        raise RuntimeError(
                            "HA WebSocket auth failed"
                        )

                await ws.send_json({
                    "id": 1,
                    "type": "subscribe_events",
                    "event_type": "state_changed",
                })

                while True:

                    msg = await ws.receive_json()

                    if msg.get("type") != "event":
                        continue

                    event = msg.get("event") or {}

                    if event.get("event_type") != "state_changed":
                        continue

                    data = event.get("data") or {}

                    entity_id = data.get("entity_id")
                    new_state = data.get("new_state")

                    if not entity_id or not new_state:
                        continue

                    payload = json.dumps(
                        {
                            "entity_id": entity_id,
                            "state": new_state.get("state"),
                            "attributes": new_state.get(
                                "attributes",
                                {},
                            ),
                        },
                        ensure_ascii=False,
                    )

                    await response.write(
                        (
                            "data: "
                            + payload
                            + "\n\n"
                        ).encode("utf-8")
                    )

    except (
        ConnectionResetError,
        asyncio.CancelledError,
    ):
        pass

    except Exception as err:

        print(
            "LIVE ENTITY EVENTS:",
            type(err).__name__,
            err,
            flush=True,
        )

    return response


# ===== HA Views BACKGROUNDS + MARKER STYLES V16 =====
BACKGROUND_DIR = "/config/ha_views/backgrounds"
BACKGROUND_META = "/config/ha_views/background.json"
MARKER_STYLE_FILE = "/config/ha_views/marker_styles.json"
ALLOWED_BACKGROUND_EXT = {".png", ".jpg", ".jpeg", ".webp"}
MAX_BACKGROUND_BYTES = 12 * 1024 * 1024

def _atomic_json(path, value):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(tmp, path)

def _read_json(path, fallback):
    try:
        with open(path, "r", encoding="utf-8") as handle:
            value = json.load(handle)
        return value
    except Exception:
        return fallback

def ensure_background_store():
    os.makedirs(BACKGROUND_DIR, exist_ok=True)
    meta = _read_json(BACKGROUND_META, {})
    current = meta.get("current")
    if current and os.path.isfile(os.path.join(BACKGROUND_DIR, current)):
        return
    legacy = "/app/ha_views_scene.png"
    target = os.path.join(BACKGROUND_DIR, "ha_views_scene.png")
    if os.path.isfile(legacy):
        if not os.path.isfile(target):
            shutil.copy2(legacy, target)
        _atomic_json(BACKGROUND_META, {"current": "ha_views_scene.png"})
    else:
        _atomic_json(BACKGROUND_META, {"current": None})

def _background_name(value):
    name = os.path.basename(str(value or "")).strip()
    if not name or name in {".", ".."}:
        return None
    return name

async def api_backgrounds_list(request):
    ensure_background_store()
    meta = _read_json(BACKGROUND_META, {"current": None})
    items = []
    for name in sorted(os.listdir(BACKGROUND_DIR), key=str.lower):
        path = os.path.join(BACKGROUND_DIR, name)
        if os.path.isfile(path) and os.path.splitext(name)[1].lower() in ALLOWED_BACKGROUND_EXT:
            items.append({"name": name, "size": os.path.getsize(path), "current": name == meta.get("current")})
    return web.json_response({"ok": True, "current": meta.get("current"), "items": items})

async def api_background_current(request):
    ensure_background_store()
    name = _read_json(BACKGROUND_META, {}).get("current")
    path = os.path.join(BACKGROUND_DIR, name) if name else ""
    if not name or not os.path.isfile(path):
        raise web.HTTPNotFound()
    response = web.FileResponse(path)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

async def api_background_file(request):
    ensure_background_store()
    name = _background_name(request.query.get("name"))
    path = os.path.join(BACKGROUND_DIR, name) if name else ""
    if not name or not os.path.isfile(path):
        raise web.HTTPNotFound()
    response = web.FileResponse(path)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

async def api_background_upload(request):
    ensure_background_store()
    reader = await request.multipart()
    field = await reader.next()
    if field is None or field.name != "file":
        return web.json_response({"ok": False, "error": "Brak pliku"}, status=400)
    original = _background_name(field.filename)
    ext = os.path.splitext(original or "")[1].lower()
    if ext not in ALLOWED_BACKGROUND_EXT:
        return web.json_response({"ok": False, "error": "Dozwolone: PNG, JPG, JPEG, WEBP"}, status=400)
    stem = re.sub(r"[^A-Za-z0-9._-]+", "_", os.path.splitext(original)[0]).strip("._") or "background"
    name = stem + "_" + str(int(time.time())) + ext
    final_path = os.path.join(BACKGROUND_DIR, name)
    tmp_path = final_path + ".upload"
    size = 0
    try:
        with open(tmp_path, "wb") as handle:
            while True:
                chunk = await field.read_chunk(256 * 1024)
                if not chunk:
                    break
                size += len(chunk)
                if size > MAX_BACKGROUND_BYTES:
                    raise ValueError("Plik jest większy niż 12 MB")
                handle.write(chunk)
        os.replace(tmp_path, final_path)
        _atomic_json(BACKGROUND_META, {"current": name})
    except Exception as err:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return web.json_response({"ok": False, "error": str(err)}, status=400)
    return web.json_response({"ok": True, "name": name, "size": size})

async def api_background_select(request):
    ensure_background_store()
    body = await request.json()
    name = _background_name(body.get("name"))
    path = os.path.join(BACKGROUND_DIR, name) if name else ""
    if not name or not os.path.isfile(path):
        return web.json_response({"ok": False, "error": "Nie znaleziono tła"}, status=404)
    _atomic_json(BACKGROUND_META, {"current": name})
    return web.json_response({"ok": True, "current": name})

async def api_background_delete(request):
    ensure_background_store()
    body = await request.json()
    name = _background_name(body.get("name"))
    path = os.path.join(BACKGROUND_DIR, name) if name else ""
    if not name or not os.path.isfile(path):
        return web.json_response({"ok": False, "error": "Nie znaleziono tła"}, status=404)
    os.remove(path)
    meta = _read_json(BACKGROUND_META, {})
    if meta.get("current") == name:
        _atomic_json(BACKGROUND_META, {"current": None})
    return web.json_response({"ok": True})

async def api_marker_styles_get(request):
    data = _read_json(MARKER_STYLE_FILE, {})
    return web.json_response({"ok": True, "data": data})

async def api_marker_styles_save(request):
    data = await request.json()
    if not isinstance(data, dict):
        return web.json_response({"ok": False, "error": "Dane muszą być obiektem JSON"}, status=400)
    encoded = json.dumps(data, ensure_ascii=False).encode("utf-8")
    if len(encoded) > 2 * 1024 * 1024:
        return web.json_response({"ok": False, "error": "Plik stylów jest za duży"}, status=413)
    _atomic_json(MARKER_STYLE_FILE, data)
    return web.json_response({"ok": True})

# ===== END HA Views BACKGROUNDS + MARKER STYLES V16 =====


# ===== HA Views CLEAN REWRITE STATE =====
REWRITE_STATE_FILE = "/config/ha_views/rewrite_state.json"

async def api_rewrite_state_get(request):
    data = _read_json(REWRITE_STATE_FILE, None)
    return web.json_response({
        "ok": True,
        "exists": isinstance(data, dict),
        "data": data if isinstance(data, dict) else None,
    })

async def api_rewrite_state_save(request):
    try:
        data = await request.json()
    except Exception:
        return web.json_response(
            {"ok": False, "error": "Nieprawidłowy JSON"},
            status=400,
        )
    if not isinstance(data, dict):
        return web.json_response(
            {"ok": False, "error": "Stan musi być obiektem JSON"},
            status=400,
        )
    encoded = json.dumps(data, ensure_ascii=False).encode("utf-8")
    if len(encoded) > 2 * 1024 * 1024:
        return web.json_response(
            {"ok": False, "error": "Stan jest za duży"},
            status=413,
        )
    _atomic_json(REWRITE_STATE_FILE, data)
    return web.json_response({"ok": True})

CUSTOM_COMPONENTS_DIR = "/config/custom_components"
INTEGRATION_ICON_FILES = (
    "brand/icon.svg",
    "brand/icon.png",
    "brand/logo.svg",
    "brand/logo.png",
)

async def api_integration_icon(request):
    domain = str(request.query.get("domain", "")).strip().lower()
    if not re.fullmatch(r"[a-z0-9_]+", domain):
        raise web.HTTPBadRequest(text="Invalid integration domain")
    component_dir = os.path.join(CUSTOM_COMPONENTS_DIR, domain)
    for relative_path in INTEGRATION_ICON_FILES:
        icon_path = os.path.join(component_dir, *relative_path.split("/"))
        if os.path.isfile(icon_path):
            response = web.FileResponse(icon_path)
            response.headers["Cache-Control"] = "public, max-age=3600"
            return response
    raise web.HTTPNotFound(text="Local integration icon not found")

async def rewrite_index(request):
    response = web.FileResponse("/app/rewrite/index.html")
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

# ===== END HA Views CLEAN REWRITE STATE =====


async def index(request):
    response = web.FileResponse("/app/rewrite/index.html")
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


app = web.Application()

app.router.add_get("/", index)
app.router.add_get("/rewrite", rewrite_index)
app.router.add_get("/api/rewrite_state", api_rewrite_state_get)
app.router.add_post("/api/rewrite_state", api_rewrite_state_save)
app.router.add_get("/api/integration_icon", api_integration_icon)

app.router.add_static(
    "/rewrite-assets/",
    "/app/rewrite/",
    show_index=False
)

app.router.add_static(
    "/static/",
    "/app/",
    show_index=False
)

app.router.add_get("/api/states", api_states)
app.router.add_post("/api/selected_states", api_selected_states)
app.router.add_get("/api/entity_events", api_entity_events)

# HA Views INTEGRATIONS API V1
app.router.add_get("/api/integrations", api_integrations)
app.router.add_get("/api/integration_entities", api_integration_entities)

# HA Views ENABLE ENTITY API V2
app.router.add_post("/api/enable_entity", api_enable_entity)
app.router.add_post("/api/disable_entity", api_disable_entity)

app.router.add_post("/api/control", api_control)
app.router.add_get("/api/history", api_history)
app.router.add_get("/api/entity_history", api_entity_history)
app.router.add_get("/api/layout", api_layout_get)
app.router.add_post("/api/layout", api_layout_save)

# HA Views BACKGROUNDS + MARKER STYLES V16
app.router.add_get("/api/backgrounds", api_backgrounds_list)
app.router.add_get("/api/background/current", api_background_current)
app.router.add_get("/api/background/file", api_background_file)
app.router.add_post("/api/background/upload", api_background_upload)
app.router.add_post("/api/background/select", api_background_select)
app.router.add_post("/api/background/delete", api_background_delete)
app.router.add_get("/api/marker_styles", api_marker_styles_get)
app.router.add_post("/api/marker_styles", api_marker_styles_save)

web.run_app(
    app,
    host="0.0.0.0",
    port=8099,
)


# ============================================================
# HA Views ENABLED ENTITY SOURCE OF TRUTH V3
# ============================================================


# ============================================================
# HA Views ENTITY ACTIONS HISTORY V6
# ============================================================