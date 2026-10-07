/* HA Views — web demo.
   Stands in for the add-on server (api/*) inside the browser: example entities with live values, a sample
   layout, and everything a visitor changes is kept only in this browser (localStorage / IndexedDB).
   Background images are served by sw.js (a service worker), which also serves images the visitor uploads. */
(() => {
  'use strict';
  const LAYOUT_KEY = 'ha-views-demo-layout-v1', FILES_HIDDEN_KEY = 'ha-views-demo-hidden-files-v1';
  const BUNDLED = { 'plan-day.png': 48832, 'plan-night.png': 44345 };
  const API = new URL('api/', location.href).pathname;
  const now = () => new Date().toISOString();

  // ---- Example Home Assistant entities -------------------------------------------------------
  const E = {}, INTEGRATIONS = [], BY_ENTRY = {};
  const add = (entry, domainTitle, list) => {
    INTEGRATIONS.push({ entry_id: entry, domain: domainTitle[0], title: domainTitle[1], state: 'loaded', source: 'user' });
    BY_ENTRY[entry] = list.map(([id, name, state, attrs = {}]) => { E[id] = { entity_id: id, state: String(state), attributes: { friendly_name: name, ...attrs }, last_changed: now() }; return id; });
  };
  const T = { unit_of_measurement: '°C', device_class: 'temperature' }, W = { unit_of_measurement: 'W', device_class: 'power' };
  add('hue', ['hue', 'Philips Hue'], [
    ['light.living_room', 'Living room light', 'on', { brightness: 230 }], ['light.kitchen', 'Kitchen light', 'on'], ['light.hall', 'Hall light', 'on'],
    ['light.bedroom', 'Bedroom lamp', 'off'], ['light.bathroom', 'Bathroom light', 'off'], ['light.garden', 'Garden lights', 'off']]);
  add('netatmo', ['netatmo', 'Netatmo'], [
    ['sensor.living_room_temperature', 'Living room temperature', 21.8, T], ['sensor.kitchen_temperature', 'Kitchen temperature', 22.4, T],
    ['sensor.bedroom_temperature', 'Bedroom temperature', 19.6, T], ['sensor.outdoor_temperature', 'Outdoor temperature', 8.4, T],
    ['sensor.bathroom_humidity', 'Bathroom humidity', 58, { unit_of_measurement: '%', device_class: 'humidity' }], ['sensor.living_room_co2', 'Living room CO₂', 640, { unit_of_measurement: 'ppm', device_class: 'carbon_dioxide' }]]);
  add('shelly', ['shelly', 'Shelly'], [
    ['switch.coffee_machine', 'Coffee machine', 'on'], ['switch.washing_machine', 'Washing machine', 'off'], ['switch.heat_pump', 'Heat pump', 'on'],
    ['sensor.house_power', 'House power', 2430, W]]);
  add('solar', ['solaredge', 'SolarEdge'], [
    ['sensor.solar_power', 'Solar power', 3100, W], ['sensor.battery_power', 'Battery power', 850, W], ['sensor.grid_power', 'Grid power', -420, W],
    ['sensor.battery_level', 'Battery level', 76, { unit_of_measurement: '%', device_class: 'battery' }]]);
  add('tado', ['tado', 'tado°'], [
    ['climate.living_room', 'Living room heating', 'heat', { hvac_modes: ['heat', 'auto', 'off'], preset_modes: ['eco', 'comfort', 'boost'], preset_mode: 'comfort', hvac_action: 'heating', current_temperature: 20.6, temperature: 21.5, min_temp: 5, max_temp: 30, target_temp_step: 0.5 }],
    ['sensor.boiler_pressure', 'Boiler pressure', 1.6, { unit_of_measurement: 'bar', device_class: 'pressure' }]]);
  add('helpers', ['input_boolean', 'Helpers'], [['input_boolean.night_mode', 'Night mode', 'off'], ['input_boolean.guest_mode', 'Guest mode', 'off']]);
  add('sun', ['sun', 'Sun'], [['sun.sun', 'Sun', 'above_horizon']]);

  // Live values: small random walks, so the demo feels connected.
  const listeners = new Set();
  const emit = id => { const s = E[id]; listeners.forEach(fn => fn(s)); };
  const setState = (id, state, attrs) => { const s = E[id]; if (!s) return; s.state = String(state); if (attrs) Object.assign(s.attributes, attrs); s.last_changed = now(); emit(id); };
  const walk = (id, step, min, max, digits = 1) => { const v = Number(E[id].state) + (Math.random() - .5) * 2 * step; setState(id, Math.min(max, Math.max(min, v)).toFixed(digits)); };
  setInterval(() => {
    walk('sensor.living_room_temperature', .1, 20, 23.5); walk('sensor.kitchen_temperature', .1, 20.5, 24); walk('sensor.bedroom_temperature', .08, 18, 21);
    walk('sensor.outdoor_temperature', .15, 3, 14); walk('sensor.bathroom_humidity', 1.2, 45, 72, 0); walk('sensor.living_room_co2', 25, 420, 1100, 0);
    const solar = Math.max(0, Number(E['sensor.solar_power'].state) + (Math.random() - .5) * 400); setState('sensor.solar_power', Math.round(Math.min(5200, solar)));
    const lights = ['light.living_room','light.kitchen','light.hall','light.bedroom','light.bathroom','light.garden'].filter(id => E[id].state === 'on').length;
    const house = 380 + lights * 60 + (E['switch.coffee_machine'].state === 'on' ? 900 : 0) + (E['switch.heat_pump'].state === 'on' ? 1100 : 0) + (E['switch.washing_machine'].state === 'on' ? 1800 : 0) + Math.round((Math.random() - .5) * 120);
    setState('sensor.house_power', house);
    const battery = Math.round(Math.max(-2500, Math.min(2500, (solar - house) * .6)));
    setState('sensor.battery_power', battery); setState('sensor.grid_power', Math.round(house - solar + battery));
    walk('sensor.battery_level', .3, 15, 100, 0); walk('sensor.boiler_pressure', .02, 1.3, 1.9, 2);
    const th = E['climate.living_room'], a = th.attributes, on = th.state !== 'off', cur = Number(a.current_temperature), target = Number(a.temperature);
    const next = Math.round((cur + (on && cur < target ? .08 : -.04) + (Math.random() - .5) * .04) * 10) / 10;
    setState('climate.living_room', th.state, { current_temperature: next, hvac_action: !on ? 'off' : next < target - .1 ? 'heating' : 'idle' });
  }, 3000);

  // ---- Layout storage ---------------------------------------------------------------------------
  let layout = null;
  try { layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null'); } catch {}
  if (!layout) layout = JSON.parse(JSON.stringify(window.HA_VIEWS_DEMO_LAYOUT));
  layout.revision = Number(layout.revision) || 1;
  const saveLayout = () => { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch {} };

  // ---- Uploaded backgrounds (IndexedDB, shared with sw.js) ------------------------------------------
  const db = () => new Promise((resolve, reject) => { const r = indexedDB.open('ha-views-demo', 1); r.onupgradeneeded = () => r.result.createObjectStore('files'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  const idb = async (mode, fn) => { const d = await db(); return new Promise((resolve, reject) => { const tx = d.transaction('files', mode), st = tx.objectStore('files'), req = fn(st); tx.oncomplete = () => resolve(req?.result); tx.onerror = () => reject(tx.error); }); };
  const uploads = async () => { const keys = await idb('readonly', st => st.getAllKeys()) || []; const out = []; for (const k of keys) { const v = await idb('readonly', st => st.get(k)); out.push({ name: k, size: v?.blob?.size || 0 }); } return out; };
  const hidden = () => { try { return new Set(JSON.parse(localStorage.getItem(FILES_HIDDEN_KEY) || '[]')); } catch { return new Set(); } };
  const setHidden = set => { try { localStorage.setItem(FILES_HIDDEN_KEY, JSON.stringify([...set])); } catch {} };
  const listFiles = async () => { const h = hidden(), items = Object.entries(BUNDLED).filter(([n]) => !h.has(n)).map(([name, size]) => ({ name, size })); (await uploads()).forEach(u => { if (!items.some(i => i.name === u.name)) items.push(u); }); return items.sort((a, b) => a.name.localeCompare(b.name)); };
  const freeName = async wanted => { const names = new Set((await listFiles()).map(i => i.name)); const dot = wanted.lastIndexOf('.'), stem = dot > 0 ? wanted.slice(0, dot) : wanted, ext = dot > 0 ? wanted.slice(dot) : ''; let name = wanted, n = 2; while (names.has(name)) name = `${stem} (${n++})${ext}`; return name; };
  const fileBlob = async name => { const v = await idb('readonly', st => st.get(name)); if (v?.blob) return v.blob; if (BUNDLED[name]) return (await fetchOrig(`backgrounds/${encodeURIComponent(name)}`)).blob(); return null; };

  // ---- Fake api/* ----------------------------------------------------------------------------
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  const history = (id, hours) => {
    const s = E[id]; if (!s) return [];
    const points = [], n = 96, t0 = Date.now() - hours * 3600e3, num = Number(s.state);
    for (let i = 0; i <= n; i++) {
      const t = new Date(t0 + i * hours * 3600e3 / n).toISOString();
      if (Number.isFinite(num)) points.push({ state: (num + Math.sin(i / 9) * Math.max(.6, Math.abs(num) * .08) + (Math.random() - .5) * Math.max(.2, Math.abs(num) * .03)).toFixed(1), t });
      else points.push({ state: i % 17 < 9 ? 'off' : 'on', t });
    }
    points[points.length - 1].state = s.state; return points;
  };
  const fetchOrig = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(API)) return fetchOrig(input, init);
    const path = url.pathname.slice(API.length), method = String(init.method || 'GET').toUpperCase(), q = url.searchParams;
    const body = () => { try { return JSON.parse(init.body || '{}'); } catch { return {}; } };
    switch (path) {
      case 'access': return json({ ok: true, viewer: false });
      case 'rewrite_state':
        if (method === 'POST') { const d = body(); delete d.baseRevision; d.revision = (Number(layout.revision) || 1) + 1; layout = d; saveLayout(); return json({ ok: true, revision: d.revision }); }
        return json({ ok: true, exists: true, data: layout });
      case 'rewrite_state_revision': return json({ ok: true, revision: layout.revision });
      case 'marker_styles': return json({ ok: true, data: {} });
      case 'selected_states': { const ids = body().entity_ids || []; return json({ ok: true, states: Object.fromEntries(ids.filter(id => E[id]).map(id => [id, E[id]])) }); }
      case 'states': return json({ ok: true, states: Object.values(E) });
      case 'control': {
        const { entity_id: id, action } = body();
        if (E[id] && (action === 'turn_on' || action === 'turn_off')) setTimeout(() => setState(id, action === 'turn_on' ? 'on' : 'off'), 250);
        // Thermostat: set temperature, mode and preset like Home Assistant would (after a short delay).
        const value = body().value, th = E[id];
        if (th && action === 'set_temperature') setTimeout(() => setState(id, th.state, { temperature: Number(value) }), 300);
        if (th && action === 'set_hvac_mode') setTimeout(() => setState(id, String(value), { hvac_action: value === 'off' ? 'off' : Number(th.attributes.current_temperature) < Number(th.attributes.temperature) ? 'heating' : 'idle' }), 400);
        if (th && action === 'set_preset_mode') setTimeout(() => setState(id, th.state, { preset_mode: String(value) }), 300);
        return json({ ok: true, entity_id: id, action });
      }
      case 'integrations': return json({ ok: true, integrations: INTEGRATIONS });
      case 'integration_entities': { const entry = q.get('entry_id'); return json({ ok: true, entry_id: entry, entities: (BY_ENTRY[entry] || []).map(id => ({ entity_id: id, name: E[id].attributes.friendly_name, state: E[id].state, unit: E[id].attributes.unit_of_measurement || null, platform: entry, disabled_by: null, enabled: true, device_id: '', device_name: '' })) }); }
      case 'entity_catalog': {
        const AREAS = ['Living room', 'Kitchen', 'Bedroom', 'Bathroom', 'Hall', 'Garden', 'Office', 'Garage'];
        const entryOf = id => Object.keys(BY_ENTRY).find(entry => BY_ENTRY[entry].includes(id)) || '';
        const entities = Object.values(E).map(e => { const name = e.attributes.friendly_name || e.entity_id; return { entity_id: e.entity_id, name, domain: e.entity_id.split('.')[0], state: e.state, unit: e.attributes.unit_of_measurement || '', device_class: e.attributes.device_class || '', icon: e.attributes.icon || '', area: AREAS.find(a => name.toLowerCase().includes(a.toLowerCase())) || '', entry_id: entryOf(e.entity_id), platform: '', hidden: false }; }).sort((a, b) => a.name.localeCompare(b.name));
        return json({ ok: true, entities, areas: AREAS.filter(a => entities.some(e => e.area === a)) });
      }
      case 'integration_entities_all': return json({ ok: true, entities_by_entry: Object.fromEntries(Object.entries(BY_ENTRY).map(([entry, ids]) => [entry, ids.map(id => ({ entity_id: id, name: E[id].attributes.friendly_name, enabled: true }))])) });
      case 'entity_history': { const hours = Number(q.get('hours')) || 24, id = q.get('entity_id'); return json({ ok: true, entity_id: id, hours, points: history(id, hours) }); }
      case 'backgrounds': return json({ ok: true, current: null, items: await listFiles() });
      case 'background/usage': return json({ ok: true, other: {}, otherChannel: 'stable', stable: {} });
      case 'background/upload': {
        const file = init.body instanceof FormData ? init.body.get('file') : null; if (!file) return json({ ok: false, error: 'No file' }, 400);
        if (file.size > 12 * 1024 * 1024) return json({ ok: false, error: 'File is larger than 12 MB' }, 400);
        const name = await freeName(String(file.name || 'background.png').replace(/[\\/:*?"<>|]+/g, '_'));
        await idb('readwrite', st => st.put({ blob: file }, name)); return json({ ok: true, name, size: file.size });
      }
      case 'background/delete': { const { name } = body(); await idb('readwrite', st => st.delete(name)); if (BUNDLED[name]) { const h = hidden(); h.add(name); setHidden(h); } return json({ ok: true }); }
      case 'background/rename': {
        const { name, newName } = body(), blob = await fileBlob(name); if (!blob) return json({ ok: false, error: 'Nie znaleziono tła' }, 404);
        const ext = name.slice(name.lastIndexOf('.')), stem = String(newName || '').trim().replace(/\.(png|jpe?g|webp)$/i, '').replace(/[\\/:*?"<>|]+/g, '_') || 'background', next = stem + ext;
        if ((await listFiles()).some(i => i.name === next)) return json({ ok: false, error: 'Plik o tej nazwie już istnieje' }, 409);
        await idb('readwrite', st => st.put({ blob }, next)); await idb('readwrite', st => st.delete(name)); if (BUNDLED[name]) { const h = hidden(); h.add(name); setHidden(h); }
        return json({ ok: true, name: next });
      }
      default: return json({ ok: true });
    }
  };

  // ---- Live updates (api/entity_events) ---------------------------------------------------------
  const OrigEventSource = window.EventSource;
  window.EventSource = function (url, config) {
    const u = new URL(url, location.href);
    if (!u.pathname.startsWith(API)) return new OrigEventSource(url, config);
    const target = new EventTarget(), es = { readyState: 1, url: u.href, onopen: null, onmessage: null, onerror: null,
      addEventListener: (...a) => target.addEventListener(...a), removeEventListener: (...a) => target.removeEventListener(...a),
      close() { listeners.delete(push); es.readyState = 2; } };
    const fire = (type, data) => { const ev = new MessageEvent(type, data === undefined ? {} : { data }); target.dispatchEvent(ev); es[`on${type}`]?.(ev); };
    const push = s => fire('message', JSON.stringify({ entity_id: s.entity_id, state: s.state, attributes: s.attributes, last_changed: s.last_changed }));
    listeners.add(push); setTimeout(() => fire('open'), 50);
    return es;
  };

  Object.assign(window.EventSource, { CONNECTING: 0, OPEN: 1, CLOSED: 2 });

  // ---- Demo bar: what this is + reset -----------------------------------------------------------
  window.haViewsDemoReset = async () => {
    try { localStorage.removeItem(LAYOUT_KEY); localStorage.removeItem(FILES_HIDDEN_KEY); } catch {}
    try { indexedDB.deleteDatabase('ha-views-demo'); } catch {}
    location.reload();
  };

  // ---- Start: images need the service worker, so the app starts once it controls the page ----------------
  const startApp = () => { const s = document.createElement('script'); s.type = 'module'; s.src = document.currentScript?.dataset.app || window.HA_VIEWS_DEMO_APP; document.body.append(s); };
  const ready = () => {
    if (!('serviceWorker' in navigator)) return startApp();
    if (navigator.serviceWorker.controller) return startApp();
    navigator.serviceWorker.register('sw.js').catch(startApp);
    let started = false; const go = () => { if (!started) { started = true; startApp(); } };
    navigator.serviceWorker.addEventListener('controllerchange', go);
    setTimeout(go, 4000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
