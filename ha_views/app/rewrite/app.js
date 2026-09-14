const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const uid = () => `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const DESIGN_WIDTH = 1600;

const els = {
  body: document.body, viewport: $('#scene-viewport'), scene: $('#scene'), image: $('#scene-image'), empty: $('#scene-empty'), markers: $('#markers'),
  selection: $('#selection'), editor: $('#editor'), editorTitle: $('#editor-title'), editorEntity: $('#editor-entity'), editorIntegration: $('#editor-integration'), editorIntegrationIcon: $('#editor-integration-icon'),
  editorContent: $('#editor-content'), editorStatus: $('#editor-status'), toast: $('#toast'), connection: $('#connection'),
  confirmBox: $('#app-confirm'), confirmTitle: $('#app-confirm-title'), confirmMessage: $('#app-confirm-message'), confirmCancel: $('#app-confirm-cancel'), confirmOk: $('#app-confirm-ok'),
  editToggle: $('#edit-toggle'), bgSelect: $('#background-select'), bgDelete: $('#background-delete'),
  bgFile: $('#background-file'), bgStatus: $('#background-status'), bgManage: $('#background-manage'), backgroundBar: $('#background-bar'), addedList: $('#added-list'),
  bgTransformToggle: $('#background-transform-toggle'), bgTransformPanel: $('#background-transform-panel'), bgMode: $('#background-mode'), bgScale: $('#background-scale'), bgX: $('#background-x'), bgY: $('#background-y'), bgScaleValue: $('#background-scale-value'), bgXValue: $('#background-x-value'), bgYValue: $('#background-y-value'),
  addedCount: $('#added-count'), integrationList: $('#integration-list'), snapToggle: $('#snap-toggle'),
  zoomOut: $('#zoom-out'), zoomIn: $('#zoom-in'), zoomReset: $('#zoom-reset'), zoomValue: $('#zoom-value')
};

const badgeDefaults = () => ({
  width: 112, height: 62, showLabel: true, showValue: true, showBackground: true, showBorder: true,
  labelColor: '#9BC1D8', labelOpacity: 1, labelScale: 1, labelY: 0,
  valueColor: '#FFFFFF', valueOpacity: 1, valueScale: 1, valueY: 0,
  backgroundColor: '#03101A', backgroundOpacity: .76,
  borderColor: '#607D8B', borderOpacity: .55, borderWidth: 1, radius: 10,
  showIcon: false, iconSize: 26, iconX: -38, iconY: 0, iconOpacity: 1,
  iconColor: '#9BC1D8', iconOnColor: '#20B9E7', iconOffColor: '#8AA2AF', iconUnavailableColor: '#FF6374'
});
const gaugeDefaults = () => ({
  width: 185, height: 108, min: 0, max: 4000, thickness: 10,
  trackColor: '#294657', progressColor: '#21BCEB', showBackground: true, backgroundColor: '#03101A', backgroundOpacity: .76,
  showBorder: true, borderColor: '#607D8B', borderOpacity: .55, borderWidth: 1, radius: 16,
  showLabel: true, labelColor: '#9BC1D8', labelOpacity: 1, labelScale: 1, labelY: 0,
  showValue: true, valueColor: '#FFFFFF', valueOpacity: 1, valueScale: 1, valueY: 0,
  showPercent: true, percentColor: '#8FDFFF', percentOpacity: 1, percentScale: 1, percentY: 0,
  showIcon: false, iconSize: 26, iconX: 0, iconY: 0, iconOpacity: 1,
  iconColor: '#9BC1D8', iconOnColor: '#20B9E7', iconOffColor: '#8AA2AF', iconUnavailableColor: '#FF6374'
});
const COLOR_PALETTE = ['#FFFFFF','#DCE8EF','#9BC1D8','#607D8B','#03101A','#102A3A','#20B9E7','#147EA5','#22D69B','#39B86C','#FFD166','#F59E0B','#FF6374','#E63946','#B66DFF','#7C4DFF','#EC4899','#8B5E3C'];
const ICON_CHOICES = [['','Automatyczna'],['mdi:weather-rainy','Deszcz'],['mdi:weather-pouring','Ulewa'],['mdi:weather-sunny','Słońce'],['mdi:water','Woda'],['mdi:water-off','Brak wody'],['mdi:water-percent','Wilgotność'],['mdi:pool','Basen'],['mdi:heat-pump','Pompa ciepła'],['mdi:pump','Pompa'],['mdi:solar-power','Fotowoltaika'],['mdi:flash','Energia'],['mdi:home-lightning-bolt','Energia domu'],['mdi:thermometer','Temperatura'],['mdi:fan','Wentylator'],['mdi:power','Zasilanie'],['mdi:toggle-switch','Włączone'],['mdi:toggle-switch-off','Wyłączone'],['mdi:door-open','Drzwi otwarte'],['mdi:door-closed','Drzwi zamknięte'],['mdi:window-open','Okno otwarte'],['mdi:window-closed','Okno zamknięte'],['mdi:motion-sensor','Ruch'],['mdi:smoke-detector','Dym'],['mdi:alert-circle','Alarm'],['mdi:check-circle','OK'],['mdi:close-circle','Wyłączone'],['mdi:gauge','Wskaźnik'],['mdi:lightbulb','Światło'],['mdi:wifi','Sieć']];
const freshMarker = (entity, integration) => ({
  id: uid(), entityId: entity.entity_id, integrationId: integration.entry_id || '', integrationName: integration.title || integration.domain || 'Home Assistant',
  sourceDomain: integration.domain || entity.entity_id.split('.')[0], displayName: entity.name || entity.entity_id,
  unitOverride: entity.unit ?? '', decimals: 'auto', stateOnLabel: '', stateOffLabel: '', iconMode: 'auto', iconName: '', iconOn: '', iconOff: '', xPercent: 50, yPercent: 50, type: 'badge', style: badgeDefaults(),
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
});

let model = { version: 1, revision: 0, settings: { snapEnabled: true, snapStep: 1 }, entities: {} };
let stateCache = {}, editMode = false, selectedId = null, styleClipboard = null, saveTimer = null;
let saveRunning = false, savePending = false, integrations = [], integrationEntities = new Map(), openIntegrations = new Set();
let editorDragged = false;
let sceneScale = 1;
let viewZoom = 1, viewPanX = 0, viewPanY = 0;
const viewPointers = new Map();
let panGesture = null, pinchGesture = null;
let currentBackground = '';
let confirmResolver = null;

async function api(path, options = {}) {
  const response = await fetch(`api/${path}`, { cache: 'no-store', ...options });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('json') ? await response.json() : await response.text();
  if (!response.ok || (data && data.ok === false)) throw new Error(data?.error || `HTTP ${response.status}`);
  return data;
}
const jsonOptions = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
function notify(text, error = false) {
  els.toast.textContent = text; els.toast.style.borderColor = error ? '#ff6374' : ''; els.toast.classList.add('visible');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => els.toast.classList.remove('visible'), 2200);
}
function closeAppConfirm(result = false) {
  if (!confirmResolver) return;
  const resolve = confirmResolver; confirmResolver = null;
  els.confirmBox.classList.remove('visible'); els.confirmBox.setAttribute('aria-hidden', 'true');
  resolve(result);
}
function appConfirm({ title = 'Potwierdzenie', message = '', confirmText = 'Potwierdź', danger = false }) {
  if (confirmResolver) closeAppConfirm(false);
  els.confirmTitle.textContent = title; els.confirmMessage.textContent = message; els.confirmOk.textContent = confirmText;
  els.confirmOk.classList.toggle('danger-confirm', danger); els.confirmBox.classList.add('visible'); els.confirmBox.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => { confirmResolver = resolve; requestAnimationFrame(() => els.confirmCancel.focus()); });
}
function rgba(hex, alpha) {
  const raw = String(hex || '#000000').replace('#', '');
  const n = parseInt(raw.length === 3 ? raw.split('').map(x => x + x).join('') : raw, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${clamp(alpha, 0, 1)})`;
}
function scheduleSave(immediate = false) {
  model.revision = (model.revision || 0) + 1; clearTimeout(saveTimer);
  if (immediate) return queueSave();
  saveTimer = setTimeout(queueSave, 200);
}
function applySnapUi() {
  const enabled = model.settings?.snapEnabled !== false;
  els.body.classList.toggle('snap-enabled', enabled);
  if (els.snapToggle) { els.snapToggle.classList.toggle('active', enabled); els.snapToggle.title = enabled ? 'Siatka włączona' : 'Siatka wyłączona'; els.snapToggle.setAttribute('aria-label', els.snapToggle.title); }
}
function snapPercent(value) {
  if (model.settings?.snapEnabled === false) return clamp(value, 0, 100);
  const step = Number(model.settings?.snapStep) || 1;
  return clamp(Math.round(value / step) * step, 0, 100);
}
function updateSceneGeometry() {
  const hasImage = !els.image.hidden && els.image.naturalWidth > 0 && els.image.naturalHeight > 0;
  const width = hasImage ? els.image.naturalWidth : 16, height = hasImage ? els.image.naturalHeight : 9;
  const ratio = width / height, renderedWidth = els.scene.clientWidth;
  els.scene.style.aspectRatio = `${width} / ${height}`;
  els.scene.style.minHeight = '0px'; els.scene.style.maxHeight = 'none';
  els.scene.style.height = `${renderedWidth / ratio}px`;
  if (els.viewport) { els.viewport.style.height = `${renderedWidth / ratio}px`; els.viewport.style.aspectRatio = `${width} / ${height}`; }
  sceneScale = Math.max(.01, renderedWidth / (Number(model.settings?.designWidth) || DESIGN_WIDTH));
  els.scene.style.setProperty('--scene-scale', sceneScale);
  applyViewTransform();
  requestAnimationFrame(() => { syncSelection(); positionEditor(); });
}
function mobileView() { return matchMedia('(max-width: 900px) and (pointer: coarse), (max-width: 768px)').matches; }
function clampViewPan() {
  if (!mobileView() || viewZoom <= 1) { viewPanX = 0; viewPanY = 0; return; }
  const maxX = els.viewport.clientWidth * (viewZoom - 1), maxY = els.viewport.clientHeight * (viewZoom - 1);
  viewPanX = clamp(viewPanX, -maxX, 0); viewPanY = clamp(viewPanY, -maxY, 0);
}
function applyViewTransform() {
  if (!mobileView()) { els.scene.style.transform = ''; return; }
  clampViewPan();
  els.scene.style.transformOrigin = '0 0';
  els.scene.style.transform = `translate(${viewPanX}px,${viewPanY}px) scale(${viewZoom})`;
  if (els.zoomValue) els.zoomValue.textContent = `${Math.round(viewZoom * 100)}%`;
  if (els.zoomOut) els.zoomOut.disabled = viewZoom <= 1;
  if (els.zoomIn) els.zoomIn.disabled = viewZoom >= 4;
  requestAnimationFrame(syncSelection);
}
function setViewZoom(next, clientX = null, clientY = null) {
  if (!mobileView()) return;
  const old = viewZoom, zoom = clamp(next, 1, 4); if (zoom === old) return;
  const r = els.viewport.getBoundingClientRect(), x = clientX == null ? r.width / 2 : clientX - r.left, y = clientY == null ? r.height / 2 : clientY - r.top;
  viewPanX = x - (x - viewPanX) * zoom / old; viewPanY = y - (y - viewPanY) * zoom / old; viewZoom = zoom; applyViewTransform();
}
function resetViewZoom() { viewZoom = 1; viewPanX = 0; viewPanY = 0; applyViewTransform(); }
function defaultBackgroundTransform() { return { mode:'contain', scale:1, x:0, y:0 }; }
function currentBackgroundTransform() {
  model.settings.backgroundTransforms ||= {};
  if (!currentBackground) return defaultBackgroundTransform();
  model.settings.backgroundTransforms[currentBackground] ||= defaultBackgroundTransform();
  return model.settings.backgroundTransforms[currentBackground];
}
function applyBackgroundTransform() {
  if (!currentBackground) { els.image.style.objectFit = 'contain'; els.image.style.transform = ''; return; }
  const t = currentBackgroundTransform();
  t.mode = t.mode === 'cover' ? 'cover' : 'contain'; t.scale = clamp(t.scale, .5, 3); t.x = clamp(t.x, -50, 50); t.y = clamp(t.y, -50, 50);
  els.image.style.objectFit = t.mode; els.image.style.transformOrigin = '50% 50%'; els.image.style.transform = `translate(${t.x}%,${t.y}%) scale(${t.scale})`;
}
function syncBackgroundTransformControls() {
  if (!els.bgMode) return; const t = currentBackgroundTransform(), disabled = !currentBackground;
  els.bgMode.value = t.mode; els.bgScale.value = t.scale; els.bgX.value = t.x; els.bgY.value = t.y;
  els.bgScaleValue.textContent = `${Math.round(t.scale*100)}%`; els.bgXValue.textContent = `${t.x}%`; els.bgYValue.textContent = `${t.y}%`;
  [els.bgMode,els.bgScale,els.bgX,els.bgY,$('#background-transform-reset')].forEach(control => { if (control) control.disabled = disabled; });
}
function updateBackgroundTransform() {
  if (!currentBackground) return; const t = currentBackgroundTransform();
  t.mode = els.bgMode.value; t.scale = Number(els.bgScale.value); t.x = Number(els.bgX.value); t.y = Number(els.bgY.value);
  applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave();
}
async function queueSave() {
  clearTimeout(saveTimer); savePending = true;
  if (saveRunning) return;
  saveRunning = true;
  while (savePending) {
    savePending = false; const snapshot = clone(model);
    try { await api('rewrite_state', jsonOptions(snapshot)); els.editorStatus.textContent = 'Zapisano'; }
    catch (error) { savePending = true; els.editorStatus.textContent = 'Błąd zapisu'; notify(`Błąd zapisu: ${error.message}`, true); await new Promise(r => setTimeout(r, 900)); }
  }
  saveRunning = false;
}

function hexKey(entityId) { return `dyn_${[...entityId].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`; }
function numberOr(value, fallback) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function normalizedStyle(type, raw = {}) {
  const base = type === 'gauge' ? gaugeDefaults() : badgeDefaults();
  const aliases = {
    borderEnabled: 'showBorder', backgroundEnabled: 'showBackground', radiusPx: 'radius', borderWidthPx: 'borderWidth',
    bgColor: 'backgroundColor', bgOpacity: 'backgroundOpacity', nameColor: 'labelColor', stateColor: 'valueColor',
    nameScale: 'labelScale', stateScale: 'valueScale', gaugeMin: 'min', gaugeMax: 'max'
  };
  Object.entries(raw || {}).forEach(([key, value]) => { const target = aliases[key] || key; if (target in base && value !== undefined && value !== null) base[target] = value; });
  ['width','height','borderWidth','radius','labelScale','valueScale','labelY','valueY','iconSize','iconX','iconY','iconOpacity'].forEach(k => base[k] = numberOr(base[k], type === 'gauge' ? gaugeDefaults()[k] : badgeDefaults()[k]));
  if (type === 'gauge') ['min','max','thickness','percentScale','percentY'].forEach(k => base[k] = numberOr(base[k], gaugeDefaults()[k]));
  return base;
}
function migrateGaugeZeroOffsets() {
  if (model.settings?.gaugeZeroOffsetsV2) return false;
  Object.values(model.entities).forEach(marker => {
    if (marker.type !== 'gauge') return;
    marker.style.labelY = numberOr(marker.style.labelY, 78) - 78;
    marker.style.valueY = numberOr(marker.style.valueY, 12) - 12;
    marker.style.percentY = numberOr(marker.style.percentY, -46) + 46;
  });
  model.settings.gaugeZeroOffsetsV2 = true; return true;
}
async function migrateLegacy() {
  let selected = {};
  try { selected = JSON.parse(localStorage.getItem('basen_pv_scene_entities_v1') || '{}') || {}; } catch {}
  if (!Object.keys(selected).length) return false;
  let positions = {}, styles = {};
  try { positions = JSON.parse(localStorage.getItem('basen_pv_scene_positions_v1') || '{}') || {}; } catch {}
  try { styles = (await api('marker_styles')).data || {}; } catch {}
  for (const [entityId, data] of Object.entries(selected)) {
    const key = hexKey(entityId), raw = styles[key] || styles[`scene-extra-${key}`] || styles[entityId] || {};
    const type = String(raw.displayMode || raw.type || 'badge').toLowerCase() === 'gauge' ? 'gauge' : 'badge';
    const pos = positions[key] || positions[`scene-extra-${key}`] || {};
    model.entities[entityId] = {
      id: uid(), entityId, integrationId: '', integrationName: 'Home Assistant', sourceDomain: entityId.split('.')[0],
      displayName: data.name || raw.displayName || entityId, unitOverride: raw.unitOverride ?? '', decimals: raw.decimals ?? 'auto',
      stateOnLabel: '', stateOffLabel: '', iconMode: 'auto', iconName: '', iconOn: '', iconOff: '',
      xPercent: clamp(pos.x ?? pos.left ?? 50, 0, 100), yPercent: clamp(pos.y ?? pos.top ?? 50, 0, 100),
      type, style: normalizedStyle(type, raw), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
  }
  await queueSave(); return true;
}

function formatState(marker) {
  const obj = stateCache[marker.entityId] || {}; const raw = obj.state; let value = raw;
  if (raw === 'on' && marker.stateOnLabel) value = marker.stateOnLabel;
  if (raw === 'off' && marker.stateOffLabel) value = marker.stateOffLabel;
  if (value === undefined || value === null || value === 'unknown' || value === 'unavailable') value = '—';
  const numeric = Number(value);
  if (Number.isFinite(numeric) && marker.decimals !== 'auto') value = numeric.toFixed(clamp(marker.decimals, 0, 3));
  const unit = raw === 'on' || raw === 'off' ? '' : (marker.unitOverride !== '' ? marker.unitOverride : (obj.attributes?.unit_of_measurement || ''));
  return { value: String(value), unit: String(unit || '') };
}
function stateKind(marker) {
  const raw = stateCache[marker.entityId]?.state;
  if (raw === 'on') return 'on';
  if (raw === 'off') return 'off';
  if (raw == null || raw === 'unknown' || raw === 'unavailable') return 'unavailable';
  return 'normal';
}
function automaticIcon(marker) {
  const obj = stateCache[marker.entityId] || {}, raw = obj.state, attrs = obj.attributes || {};
  if (attrs.icon) return attrs.icon;
  const active = raw === 'on', dc = String(attrs.device_class || '').toLowerCase(), domain = marker.entityId.split('.')[0];
  const byDevice = {
    moisture: active ? 'mdi:weather-rainy' : 'mdi:weather-sunny',
    opening: active ? 'mdi:door-open' : 'mdi:door-closed', door: active ? 'mdi:door-open' : 'mdi:door-closed',
    window: active ? 'mdi:window-open' : 'mdi:window-closed', motion: 'mdi:motion-sensor',
    smoke: 'mdi:smoke-detector', heat: 'mdi:thermometer', temperature: 'mdi:thermometer',
    power: 'mdi:flash', energy: 'mdi:lightning-bolt', battery: 'mdi:battery'
  };
  if (byDevice[dc]) return byDevice[dc];
  return ({ binary_sensor: active ? 'mdi:checkbox-marked-circle' : 'mdi:checkbox-blank-circle-outline', sensor: 'mdi:gauge', switch: active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off', light: 'mdi:lightbulb', climate: 'mdi:thermostat', fan: 'mdi:fan', water_heater: 'mdi:water-boiler', sun: 'mdi:weather-sunny' })[domain] || 'mdi:cube-outline';
}
function resolvedIcon(marker) {
  if (marker.iconMode !== 'manual') return automaticIcon(marker);
  const kind = stateKind(marker);
  if (kind === 'on' && marker.iconOn) return marker.iconOn;
  if (kind === 'off' && marker.iconOff) return marker.iconOff;
  return marker.iconName || automaticIcon(marker);
}
function iconMarkup(marker) {
  if (!marker.style.showIcon) return '';
  if (marker.iconMode === 'integration') {
    const domain = marker.sourceDomain || marker.entityId.split('.')[0], fallback = `https://brands.home-assistant.io/_/${encodeURIComponent(domain)}/dark_icon.png`;
    return `<img class="marker-icon marker-brand-icon" src="api/integration_icon?domain=${encodeURIComponent(domain)}" data-icon-fallback="${escapeHtml(fallback)}" alt="">`;
  }
  const cls = String(resolvedIcon(marker) || 'mdi:help-circle-outline').replace(/^mdi:/, 'mdi-');
  return `<i class="mdi ${escapeHtml(cls)} marker-icon" aria-hidden="true"></i>`;
}
function markerHtml(marker) {
  const s = marker.style, formatted = formatState(marker), fullValue = `${formatted.value}${formatted.unit ? ` ${formatted.unit}` : ''}`, icon = iconMarkup(marker);
  if (marker.type === 'gauge') {
    const n = Number(stateCache[marker.entityId]?.state), span = Number(s.max) - Number(s.min) || 1;
    const percent = Number.isFinite(n) ? clamp(((n - Number(s.min)) / span) * 100, 0, 100) : 0;
    return `<svg class="gauge-svg" viewBox="0 0 200 110" preserveAspectRatio="none"><path class="gauge-track" pathLength="100" d="M20 90 A80 80 0 0 1 180 90"/><path class="gauge-value" pathLength="100" d="M20 90 A80 80 0 0 1 180 90"/></svg>${icon}${s.showLabel ? `<span class="label">${escapeHtml(marker.displayName)}</span>` : ''}${s.showValue ? `<span class="value">${escapeHtml(fullValue)}</span>` : ''}${s.showPercent ? `<span class="percent">${Math.round(percent)}%</span>` : ''}`;
  }
  return `${icon}${s.showLabel ? `<span class="label">${escapeHtml(marker.displayName)}</span>` : ''}${s.showValue ? `<span class="value">${escapeHtml(fullValue)}</span>` : ''}`;
}
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value ?? ''; return div.innerHTML; }
function integrationIconMarkup(group) {
  const domain = group.entries[0]?.domain || '', initial = group.title.charAt(0).toUpperCase() || '?';
  return integrationIconMarkupFor(domain, initial);
}
function integrationIconMarkupFor(domain, initial = '?', extraClass = '') {
  const fallback = `https://brands.home-assistant.io/_/${encodeURIComponent(domain)}/dark_icon.png`;
  return `<span class="integration-icon ${extraClass}"><span>${escapeHtml(String(initial).charAt(0).toUpperCase() || '?')}</span><img src="api/integration_icon?domain=${encodeURIComponent(domain)}" data-icon-fallback="${escapeHtml(fallback)}" alt="" loading="lazy"></span>`;
}
function integrationIconError(event) {
  const img = event.target.closest?.('img[data-icon-fallback]'); if (!img) return;
  const fallback = img.dataset.iconFallback;
  if (fallback) { img.dataset.iconFallback = ''; img.src = fallback; } else img.remove();
}
function enabledIcon(enabled) {
  return enabled
    ? '<span class="entity-enabled on" title="Encja włączona" aria-label="Encja włączona"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.7L16.5 9"/></svg></span>'
    : '<span class="entity-enabled off" title="Encja wyłączona" aria-label="Encja wyłączona"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 8.5l7 7m0-7-7 7"/></svg></span>';
}
function applyMarkerStyle(node, marker) {
  const s = marker.style;
  Object.assign(node.style, {
    left: `${marker.xPercent}%`, top: `${marker.yPercent}%`, width: `${s.width}px`, height: `${s.height}px`,
    background: s.showBackground ? rgba(s.backgroundColor, s.backgroundOpacity) : 'transparent',
    border: s.showBorder ? `${s.borderWidth}px solid ${rgba(s.borderColor, s.borderOpacity)}` : '0 solid transparent',
    borderRadius: `${s.radius}px`
  });
  const label = $('.label', node), value = $('.value', node);
  if (label) Object.assign(label.style, { color: rgba(s.labelColor, s.labelOpacity), fontSize: `${12 * s.labelScale}px` });
  if (value) Object.assign(value.style, { color: rgba(s.valueColor, s.valueOpacity), fontSize: `${22 * s.valueScale}px` });
  if (marker.type === 'badge') {
    if (label) label.style.transform = `translateY(${s.labelY}px)`;
    if (value) value.style.transform = `translateY(${s.valueY}px)`;
  }
  const icon = $('.marker-icon', node);
  if (icon) {
    const kind = stateKind(marker), color = kind === 'on' ? s.iconOnColor : kind === 'off' ? s.iconOffColor : kind === 'unavailable' ? s.iconUnavailableColor : s.iconColor;
    Object.assign(icon.style, { color, opacity: clamp(s.iconOpacity, 0, 1), fontSize: `${s.iconSize}px`, left: '50%', top: '50%', transform: `translate(-50%, calc(-50% + ${s.iconY}px))` });
    if (icon.classList.contains('marker-brand-icon')) Object.assign(icon.style, { width:`${s.iconSize}px`, height:`${s.iconSize}px`, objectFit:'contain' });
  }
  if (marker.type === 'gauge') {
    if (label) Object.assign(label.style, { top: `calc(12% + 78px + ${s.labelY}px)` });
    if (value) Object.assign(value.style, { top: `calc(48% + 12px + ${s.valueY}px)` });
    const percent = $('.percent', node); if (percent) Object.assign(percent.style, { top: `calc(76% - 46px + ${s.percentY}px)`, color: rgba(s.percentColor, s.percentOpacity), fontSize: `${11 * s.percentScale}px` });
    const track = $('.gauge-track', node), progress = $('.gauge-value', node), n = Number(stateCache[marker.entityId]?.state), span = Number(s.max) - Number(s.min) || 1;
    const pct = Number.isFinite(n) ? clamp(((n - Number(s.min)) / span) * 100, 0, 100) : 0;
    Object.assign(track.style, { stroke: s.trackColor, strokeWidth: s.thickness });
    Object.assign(progress.style, { stroke: s.progressColor, strokeWidth: s.thickness, strokeDasharray: `${pct} 100` });
  }
}
function renderMarkers() {
  const previous = selectedId;
  els.markers.innerHTML = '';
  Object.values(model.entities).forEach(marker => {
    const node = document.createElement('div'); node.className = `marker ${marker.type}${marker.id === selectedId ? ' selected' : ''}`;
    node.dataset.entityId = marker.entityId; node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker);
    node.addEventListener('pointerdown', startDrag); node.addEventListener('click', onMarkerClick); els.markers.append(node);
  });
  if (previous && model.entities[previous]) syncSelection(); else hideSelection();
  renderAdded();
}
function onMarkerClick(event) {
  if (!editMode || event.currentTarget.dataset.dragged === '1') { event.currentTarget.dataset.dragged = '0'; return; }
  event.stopPropagation(); selectMarker(event.currentTarget.dataset.entityId);
}
function selectMarker(entityId) { selectedId = entityId; renderMarkers(); openEditor(); }
function hideSelection() { els.selection.classList.remove('visible'); }
function syncSelection() {
  const node = $(`.marker[data-entity-id="${CSS.escape(selectedId)}"]`); if (!node) return hideSelection();
  const sr = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect(), zoom = mobileView() ? viewZoom : 1;
  Object.assign(els.selection.style, { left: `${(r.left - sr.left) / zoom}px`, top: `${(r.top - sr.top) / zoom}px`, width: `${r.width / zoom}px`, height: `${r.height / zoom}px` });
  els.selection.classList.add('visible');
}
function positionEditor() {
  if (mobileView() || editorDragged || !selectedId || !els.editor.classList.contains('visible')) return;
  const node = $(`.marker[data-entity-id="${CSS.escape(selectedId)}"]`); if (!node) return;
  const r = node.getBoundingClientRect(), width = els.editor.offsetWidth || 390, height = els.editor.offsetHeight || 500, gap = 14;
  let left = r.left + r.width / 2 < innerWidth / 2 ? r.right + gap : r.left - width - gap;
  if (left + width > innerWidth - 8) left = r.left - width - gap;
  if (left < 8) left = r.right + gap;
  left = clamp(left, 8, Math.max(8, innerWidth - width - 8));
  const top = clamp(r.top - 18, 80, Math.max(80, innerHeight - height - 8));
  Object.assign(els.editor.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
}
function keepEditorInViewport() {
  if (mobileView() || !els.editor.classList.contains('visible')) return;
  const r = els.editor.getBoundingClientRect(), left = clamp(r.left, 8, Math.max(8, innerWidth - r.width - 8)), top = clamp(r.top, 8, Math.max(8, innerHeight - r.height - 8));
  Object.assign(els.editor.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
}
function startDrag(event) {
  if (!editMode || event.button !== 0) return;
  event.preventDefault(); const node = event.currentTarget, entityId = node.dataset.entityId, marker = model.entities[entityId];
  const start = { x: event.clientX, y: event.clientY, px: marker.xPercent, py: marker.yPercent }; let moved = false;
  node.setPointerCapture(event.pointerId);
  const move = e => {
    const r = els.scene.getBoundingClientRect(), dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) > 3 && !moved) { moved = true; els.editor.classList.add('marker-moving'); }
    if (!moved) return;
    marker.xPercent = snapPercent(start.px + dx / r.width * 100); marker.yPercent = snapPercent(start.py + dy / r.height * 100);
    node.style.left = `${marker.xPercent}%`; node.style.top = `${marker.yPercent}%`; if (selectedId === entityId) syncSelection();
  };
  const up = () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up); els.editor.classList.remove('marker-moving'); node.dataset.dragged = moved ? '1' : '0'; if (moved) { marker.updatedAt = new Date().toISOString(); scheduleSave(true); positionEditor(); } };
  node.addEventListener('pointermove', move); node.addEventListener('pointerup', up, { once: true }); node.addEventListener('pointercancel', up, { once: true });
}

function control(label, path, type, value, options = {}) {
  const attrs = [`data-path="${path}"`, `data-value-type="${options.valueType || type}"`];
  if (options.min !== undefined) attrs.push(`min="${options.min}"`); if (options.max !== undefined) attrs.push(`max="${options.max}"`); if (options.step !== undefined) attrs.push(`step="${options.step}"`);
  let input;
  if (type === 'checkbox') input = `<input type="checkbox" ${attrs.join(' ')} ${value ? 'checked' : ''}>`;
  else if (type === 'select') input = `<select ${attrs.join(' ')}>${options.items.map(([v,t]) => `<option value="${v}" ${String(v) === String(value) ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  else if (type === 'color') input = `<div class="color-picker"><button type="button" class="color-current" data-color-toggle style="background:${escapeHtml(value)}" aria-label="Wybierz kolor"></button><input class="color-native" type="color" value="${escapeHtml(value)}" ${attrs.join(' ')}><div class="color-menu"><div class="color-palette">${COLOR_PALETTE.map(color => `<button type="button" data-palette-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join('')}</div><button type="button" class="rgb-button" data-rgb-color>Własny kolor RGB…</button></div></div>`;
  else input = `<input type="${type}" value="${escapeHtml(value)}" ${attrs.join(' ')}>`;
  const output = type === 'range' ? `<output>${value}${options.suffix || ''}</output>` : '<span></span>';
  return `<div class="control ${type === 'checkbox' ? 'checkbox' : ''}"><label>${label}</label>${input}${output}</div>`;
}
function mdiControl(label, path, value) {
  return `<div class="control"><label>${label}</label><input type="text" list="mdi-icon-list" value="${escapeHtml(value)}" data-path="${path}" data-value-type="text" placeholder="np. mdi:weather-rainy"><span></span></div>`;
}
function section(title, body, open = false) { return `<details class="editor-section" ${open ? 'open' : ''}><summary>${title}</summary><div class="editor-section-body">${body}</div></details>`; }
function editorMarkup(marker) {
  const s = marker.style;
  const entity = section('Encja', control('Nazwa','displayName','text',marker.displayName) + control('Jednostka','unitOverride','text',marker.unitOverride) + control('Zaokrąglenie','decimals','select',marker.decimals,{items:[['auto','Auto'],[0,'0'],[1,'1'],[2,'2'],[3,'3']]}) + control('Tekst ON','stateOnLabel','text',marker.stateOnLabel) + control('Tekst OFF','stateOffLabel','text',marker.stateOffLabel));
  const label = section('Nazwa', control('Pokaż','style.showLabel','checkbox',s.showLabel) + control('Kolor','style.labelColor','color',s.labelColor) + control('Przezrocz.','style.labelOpacity','range',s.labelOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.labelScale','range',s.labelScale,{min:.5,max:3,step:.05}) + control('Pozycja','style.labelY','range',s.labelY,{min:-100,max:100,step:1,suffix:'px'}));
  const value = section('Stan', control('Pokaż','style.showValue','checkbox',s.showValue) + control('Kolor','style.valueColor','color',s.valueColor) + control('Przezrocz.','style.valueOpacity','range',s.valueOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.valueScale','range',s.valueScale,{min:.5,max:3,step:.05}) + control('Pozycja','style.valueY','range',s.valueY,{min:-100,max:100,step:1,suffix:'px'}));
  const size = section('Rozmiar', control('Szerokość','style.width','range',s.width,{min:54,max:500,step:1,suffix:'px'}) + control('Wysokość','style.height','range',s.height,{min:34,max:350,step:1,suffix:'px'}));
  const background = section('Tło', control('Pokaż','style.showBackground','checkbox',s.showBackground) + control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezrocz.','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01}));
  const border = section('Ramka', control('Pokaż','style.showBorder','checkbox',s.showBorder) + control('Kolor','style.borderColor','color',s.borderColor) + control('Przezrocz.','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}));
  const mdiList = `<datalist id="mdi-icon-list">${ICON_CHOICES.slice(1).map(([name,label]) => `<option value="${name}">${label}</option>`).join('')}</datalist>`;
  const manualIcons = `<div data-manual-icons ${marker.iconMode === 'manual' ? '' : 'hidden'}>${mdiControl('Podstawowa','iconName',marker.iconName)}${mdiControl('Dla ON','iconOn',marker.iconOn)}${mdiControl('Dla OFF','iconOff',marker.iconOff)}</div>`;
  const icon = section('Ikona', control('Pokaż','style.showIcon','checkbox',s.showIcon) + control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']]}) + manualIcons + mdiList + control('Kolor','style.iconColor','color',s.iconColor) + control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) + control('Brak danych','style.iconUnavailableColor','color',s.iconUnavailableColor) + control('Przezrocz.','style.iconOpacity','range',s.iconOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + control('Pozycja','style.iconY','range',s.iconY,{min:-100,max:100,step:1,suffix:'px'}));
  let gauge = '';
  if (marker.type === 'gauge') gauge = section('Gauge', control('Minimum','style.min','number',s.min,{valueType:'number'}) + control('Maksimum','style.max','number',s.max,{valueType:'number'}) + control('Grubość','style.thickness','range',s.thickness,{min:2,max:30,step:1,suffix:'px'}) + control('Tor','style.trackColor','color',s.trackColor) + control('Wartość','style.progressColor','color',s.progressColor) + control('Pokaż %','style.showPercent','checkbox',s.showPercent) + control('Kolor %','style.percentColor','color',s.percentColor) + control('Przezrocz. %','style.percentOpacity','range',s.percentOpacity,{min:0,max:1,step:.01}) + control('Rozmiar %','style.percentScale','range',s.percentScale,{min:.5,max:3,step:.05}) + control('Pozycja %','style.percentY','range',s.percentY,{min:-100,max:100,step:1,suffix:'px'}));
  return entity + size + value + label + icon + gauge + background + border;
}
function openEditor() {
  const marker = model.entities[selectedId]; if (!marker) return closeEditor();
  els.editorTitle.textContent = marker.displayName; els.editorEntity.textContent = marker.entityId; els.editorIntegration.textContent = `Integracja: ${marker.integrationName || 'Home Assistant'}`;
  if (els.editorIntegrationIcon) els.editorIntegrationIcon.innerHTML = integrationIconMarkupFor(marker.sourceDomain || marker.entityId.split('.')[0], marker.integrationName || marker.sourceDomain, 'editor-brand-icon');
  els.editorContent.innerHTML = editorMarkup(marker);
  $$('[data-editor-tab]').forEach(b => b.classList.toggle('active', b.dataset.editorTab === marker.type));
  $('#paste-style').disabled = !styleClipboard; els.editor.classList.add('visible'); els.editor.setAttribute('aria-hidden','false');
  $$('input,select', els.editorContent).forEach(input => { input.addEventListener('input', onEditorInput); input.addEventListener('change', onEditorInput); });
  $$('.editor-section', els.editorContent).forEach(details => details.addEventListener('toggle', () => {
    if (details.open) $$('.editor-section', els.editorContent).forEach(other => { if (other !== details) other.removeAttribute('open'); });
    requestAnimationFrame(() => requestAnimationFrame(() => { if (details.open) details.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(); }));
  }));
  requestAnimationFrame(positionEditor);
}
function onColorPickerClick(event) {
  const toggle = event.target.closest('[data-color-toggle]'), swatch = event.target.closest('[data-palette-color]'), rgb = event.target.closest('[data-rgb-color]');
  if (toggle) { event.preventDefault(); const menu = toggle.closest('.color-picker').querySelector('.color-menu'), open = menu.classList.contains('visible'); $$('.color-menu', els.editorContent).forEach(x => x.classList.remove('visible')); menu.classList.toggle('visible', !open); requestAnimationFrame(() => { if (!open) menu.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(); }); return; }
  if (swatch) { event.preventDefault(); const picker = swatch.closest('.color-picker'), input = $('.color-native', picker); input.value = swatch.dataset.paletteColor; $('.color-current', picker).style.background = input.value; input.dispatchEvent(new Event('input', { bubbles: true })); $('.color-menu', picker).classList.remove('visible'); return; }
  if (rgb) { event.preventDefault(); rgb.closest('.color-picker').querySelector('.color-native').click(); }
}
function closeEditor() { selectedId = null; editorDragged = false; els.editor.classList.remove('visible'); els.editor.setAttribute('aria-hidden','true'); hideSelection(); $$('.marker.selected').forEach(n => n.classList.remove('selected')); }
function startEditorDrag(event) {
  if (mobileView() || event.button !== 0 || (event.buttons & 1) !== 1 || event.target.closest('button,input,select')) return;
  event.preventDefault(); editorDragged = true;
  const r = els.editor.getBoundingClientRect(), startX = event.clientX, startY = event.clientY, startLeft = r.left, startTop = r.top;
  const move = e => {
    if ((e.buttons & 1) !== 1) return finish();
    const left = clamp(startLeft + e.clientX - startX, 8, Math.max(8, innerWidth - els.editor.offsetWidth - 8));
    const top = clamp(startTop + e.clientY - startY, 8, Math.max(8, innerHeight - els.editor.offsetHeight - 8));
    Object.assign(els.editor.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
  };
  const finish = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
}
function setPath(object, path, value) { const parts = path.split('.'); let target = object; while (parts.length > 1) target = target[parts.shift()]; target[parts[0]] = value; }
function onEditorInput(event) {
  const marker = model.entities[selectedId], input = event.target; if (!marker || !input.dataset.path) return;
  let value = input.type === 'checkbox' ? input.checked : input.value;
  if (input.dataset.valueType === 'range' || input.dataset.valueType === 'number') value = Number(value);
  setPath(marker, input.dataset.path, value); marker.updatedAt = new Date().toISOString();
  if (input.dataset.path === 'iconMode') { const manual = $('[data-manual-icons]', els.editorContent); if (manual) manual.hidden = value !== 'manual'; }
  if (input.type === 'color') { const preview = input.closest('.color-picker')?.querySelector('.color-current'); if (preview) preview.style.background = value; }
  const output = input.parentElement.querySelector('output'); if (output) output.textContent = `${value}${output.textContent.endsWith('px') ? 'px' : ''}`;
  const node = $(`.marker[data-entity-id="${CSS.escape(marker.entityId)}"]`);
  if (input.dataset.path === 'displayName') { els.editorTitle.textContent = value; if (node) node.innerHTML = markerHtml(marker); }
  if (input.dataset.path === 'unitOverride' || input.dataset.path === 'decimals' || input.dataset.path === 'stateOnLabel' || input.dataset.path === 'stateOffLabel' || input.dataset.path.startsWith('icon') || input.dataset.path.startsWith('style.show')) { if (node) node.innerHTML = markerHtml(marker); }
  if (node) applyMarkerStyle(node, marker); syncSelection(); renderAdded(); scheduleSave();
}
function changeType(type) {
  const marker = model.entities[selectedId]; if (!marker || marker.type === type) return;
  marker.type = type; marker.style = type === 'gauge' ? gaugeDefaults() : badgeDefaults(); marker.updatedAt = new Date().toISOString();
  renderMarkers(); openEditor(); scheduleSave(true); notify(`Zmieniono na ${type === 'gauge' ? 'Gauge' : 'Badge'}`);
}

function renderAdded() {
  const items = Object.values(model.entities); els.addedCount.textContent = items.length;
  els.addedList.innerHTML = items.length ? items.map(m => `<div class="entity-row added-row"><div class="added-identity">${integrationIconMarkupFor(m.sourceDomain || m.entityId.split('.')[0], m.integrationName || m.sourceDomain, 'added-icon')}<div><strong>${escapeHtml(m.displayName)}</strong><small>${escapeHtml(m.entityId)} · ${escapeHtml(m.integrationName || 'Home Assistant')} · ${m.type === 'gauge' ? 'Gauge' : 'Badge'}</small></div></div><div class="entity-actions"><button data-focus="${escapeHtml(m.entityId)}">Pokaż</button><button class="danger" data-remove="${escapeHtml(m.entityId)}">Usuń z widoku</button></div></div>`).join('') : '<div class="empty-row">Nie dodano jeszcze żadnych encji.</div>';
}
async function loadIntegrations(force = false) {
  if (integrations.length && !force) return renderIntegrations();
  els.integrationList.innerHTML = '<div class="empty-row">Wczytywanie integracji…</div>';
  try { const data = await api('integrations'); integrations = data.integrations || []; renderIntegrations(); }
  catch (error) { els.integrationList.innerHTML = `<div class="empty-row">Błąd: ${escapeHtml(error.message)}</div>`; }
}
function renderIntegrations() {
  const groups = getIntegrationGroups();
  if (!groups.length) { els.integrationList.innerHTML = '<div class="empty-row">Brak aktywnych integracji.</div>'; return; }
  const used = groups.filter(group => group.used), unused = groups.filter(group => !group.used);
  const usedHtml = used.map(integrationMarkup).join('');
  const unusedHtml = unused.length ? `<details class="unused-integrations"><summary><span>Pozostałe integracje</span><b>${unused.length}</b></summary><div class="unused-integrations-body">${unused.map(integrationMarkup).join('')}</div></details>` : '';
  els.integrationList.innerHTML = usedHtml + unusedHtml;
}
function integrationMarkup(group) {
  return `<div class="integration ${group.used ? 'used' : ''} ${openIntegrations.has(group.key) ? 'open' : ''}" data-integration="${escapeHtml(group.key)}"><button class="integration-summary">${integrationIconMarkup(group)}<span class="integration-name"><strong>${escapeHtml(group.title)}</strong><small>${escapeHtml([...new Set(group.entries.map(x => x.domain))].join(', '))}${group.entries.length > 1 ? ` · ${group.entries.length} połączone` : ''}</small></span>${group.used ? `<span class="used-count">${group.used} używane</span>` : ''}</button><div class="integration-body">${integrationBody(group)}</div></div>`;
}
function getIntegrationGroups() {
  const grouped = new Map();
  integrations.forEach(item => { const key = String(item.title || item.domain || item.entry_id).trim().toLocaleLowerCase('pl'); if (!grouped.has(key)) grouped.set(key, { key, title: item.title || item.domain || item.entry_id, entries: [] }); grouped.get(key).entries.push(item); });
  return [...grouped.values()].map(group => { const ids = new Set(group.entries.map(x => x.entry_id)); group.used = Object.values(model.entities).filter(marker => ids.has(marker.integrationId) || (!marker.integrationId && String(marker.integrationName).trim().toLocaleLowerCase('pl') === group.key)).length; return group; }).sort((a,b) => (b.used - a.used) || a.title.localeCompare(b.title, 'pl', { sensitivity: 'base' }));
}
function integrationBody(group) {
  if (group.entries.some(item => !integrationEntities.has(item.entry_id))) return '<div class="empty-row">Kliknij, aby wczytać encje.</div>';
  const seen = new Set(), entities = group.entries.flatMap(item => (integrationEntities.get(item.entry_id) || []).map(entity => ({ ...entity, _entryId: item.entry_id }))).filter(entity => !seen.has(entity.entity_id) && seen.add(entity.entity_id)).sort((a,b) => String(a.name).localeCompare(String(b.name), 'pl', { sensitivity: 'base' }));
  if (!entities.length) return '<div class="empty-row">Brak encji.</div>';
  return entities.map(e => { const added = !!model.entities[e.entity_id]; return `<div class="entity-row ${e.enabled ? '' : 'disabled-entity'}"><div><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.entity_id)}${e.state != null ? ` · ${escapeHtml(e.state)}${e.unit ? ` ${escapeHtml(e.unit)}` : ''}` : ''}</small></div><div class="entity-actions">${enabledIcon(e.enabled)}<button class="add-entity" data-add="${escapeHtml(e.entity_id)}" data-entry="${escapeHtml(e._entryId)}" ${added || !e.enabled ? 'disabled' : ''} title="${added ? 'Dodano do widoku' : e.enabled ? 'Dodaj do widoku' : 'Encja jest wyłączona'}">${added ? '✓' : '+'}</button></div></div>`; }).join('');
}
async function toggleIntegration(groupKey) {
  if (openIntegrations.has(groupKey)) { openIntegrations.delete(groupKey); return renderIntegrations(); }
  openIntegrations.add(groupKey); renderIntegrations(); const group = getIntegrationGroups().find(item => item.key === groupKey); if (!group) return;
  const missing = group.entries.filter(item => !integrationEntities.has(item.entry_id)); if (!missing.length) return renderIntegrations();
  try { await Promise.all(missing.map(async item => { const data = await api(`integration_entities?entry_id=${encodeURIComponent(item.entry_id)}`); integrationEntities.set(item.entry_id, data.entities || []); updateIntegrationMetadata(item.entry_id); })); renderIntegrations(); }
  catch (error) { notify(`Błąd encji: ${error.message}`, true); }
}
function updateIntegrationMetadata(entryId) {
  const integration = integrations.find(x => x.entry_id === entryId), entities = integrationEntities.get(entryId) || []; let changed = false;
  entities.forEach(e => { const marker = model.entities[e.entity_id]; if (marker && integration && (!marker.integrationId || marker.integrationName === 'Home Assistant')) { marker.integrationId = entryId; marker.integrationName = integration.title; marker.sourceDomain = integration.domain; changed = true; } });
  if (changed) { renderAdded(); scheduleSave(); }
}
async function addEntity(entityId, entryId) {
  if (model.entities[entityId]) return;
  const integration = integrations.find(x => x.entry_id === entryId), entity = (integrationEntities.get(entryId) || []).find(x => x.entity_id === entityId); if (!integration || !entity) return;
  let offset = Object.keys(model.entities).length % 7; const marker = freshMarker(entity, integration); marker.xPercent = 50 + offset * 2; marker.yPercent = 50 + offset * 2;
  model.entities[entityId] = marker; renderMarkers(); renderIntegrations(); await queueSave(); await refreshStates(); notify('Dodano świeży Badge z ustawieniami domyślnymi');
}
async function removeEntity(entityId) {
  if (!model.entities[entityId]) return; delete model.entities[entityId]; delete stateCache[entityId]; if (selectedId === entityId) closeEditor();
  renderMarkers(); renderIntegrations(); await queueSave(); notify('Usunięto marker i wszystkie jego ustawienia');
}
async function refreshStates() {
  const ids = Object.keys(model.entities); if (!ids.length) return renderMarkers();
  try { const data = await api('selected_states', jsonOptions({ entity_ids: ids })); stateCache = { ...stateCache, ...(data.states || {}) }; renderMarkers(); els.connection.textContent = 'Połączono'; els.connection.className = 'connection live'; }
  catch (error) { els.connection.textContent = 'Błąd danych'; els.connection.className = 'connection error'; }
}
function connectEvents() {
  const events = new EventSource('api/entity_events');
  events.onopen = () => { els.connection.textContent = 'Na żywo'; els.connection.className = 'connection live'; };
  events.onmessage = event => { try { const data = JSON.parse(event.data), marker = model.entities[data.entity_id]; if (!marker) return; stateCache[data.entity_id] = { entity_id: data.entity_id, state: data.state, attributes: data.attributes || {} }; const node = $(`.marker[data-entity-id="${CSS.escape(data.entity_id)}"]`); if (node) { node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker); } } catch {} };
  events.onerror = () => { els.connection.textContent = 'Ponowne łączenie…'; els.connection.className = 'connection error'; };
  events.addEventListener('open', refreshStates);
}
async function loadBackgrounds() {
  try {
    const data = await api('backgrounds'), items = data.items || []; els.bgSelect.innerHTML = items.length ? items.map(x => `<option value="${escapeHtml(x.name)}" ${x.name === data.current ? 'selected' : ''}>${escapeHtml(x.name)}</option>`).join('') : '<option value="">Brak tła</option>';
    currentBackground = data.current || '';
    els.bgSelect.disabled = !items.length; els.bgDelete.disabled = !data.current; els.empty.classList.toggle('visible', !data.current); els.image.hidden = !data.current;
    syncBackgroundTransformControls();
    if (data.current) { applyBackgroundTransform(); els.image.src = `api/background/current?t=${Date.now()}`; } else { applyBackgroundTransform(); updateSceneGeometry(); }
  } catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; }
}
async function uploadBackground(file) {
  if (!file) return; els.bgStatus.textContent = 'Wgrywanie…'; const form = new FormData(); form.append('file', file);
  try { await api('background/upload', { method: 'POST', body: form }); els.bgStatus.textContent = 'Wgrano'; await loadBackgrounds(); }
  catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; } finally { els.bgFile.value = ''; }
}

function viewportPointerDown(event) {
  if (!mobileView() || event.pointerType === 'mouse') return;
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
  if (viewPointers.size === 2) {
    const [a,b] = [...viewPointers.values()], r = els.viewport.getBoundingClientRect();
    pinchGesture = { distance:Math.hypot(a.x-b.x,a.y-b.y), zoom:viewZoom, panX:viewPanX, panY:viewPanY, x:(a.x+b.x)/2-r.left, y:(a.y+b.y)/2-r.top };
    panGesture = null; event.preventDefault();
  } else if (viewZoom > 1 && !event.target.closest('.marker')) {
    panGesture = { id:event.pointerId, x:event.clientX, y:event.clientY, panX:viewPanX, panY:viewPanY };
    els.viewport.setPointerCapture?.(event.pointerId); event.preventDefault();
  }
}
function viewportPointerMove(event) {
  if (!viewPointers.has(event.pointerId)) return;
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
  if (viewPointers.size === 2 && pinchGesture) {
    const [a,b] = [...viewPointers.values()], distance = Math.hypot(a.x-b.x,a.y-b.y), next = clamp(pinchGesture.zoom * distance / Math.max(1,pinchGesture.distance),1,4), ratio = next / pinchGesture.zoom;
    viewZoom = next; viewPanX = pinchGesture.x - (pinchGesture.x-pinchGesture.panX)*ratio; viewPanY = pinchGesture.y - (pinchGesture.y-pinchGesture.panY)*ratio; applyViewTransform(); event.preventDefault();
  } else if (panGesture?.id === event.pointerId) {
    viewPanX = panGesture.panX + event.clientX-panGesture.x; viewPanY = panGesture.panY + event.clientY-panGesture.y; applyViewTransform(); event.preventDefault();
  }
}
function viewportPointerUp(event) {
  viewPointers.delete(event.pointerId);
  if (panGesture?.id === event.pointerId) panGesture = null;
  if (viewPointers.size < 2) pinchGesture = null;
}

function bindEvents() {
  document.addEventListener('error', integrationIconError, true);
  $$('.tab').forEach(tab => tab.addEventListener('click', () => { if (tab.dataset.view !== 'overview') closeEditor(); $$('.tab').forEach(x => x.classList.toggle('active', x === tab)); $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${tab.dataset.view}`)); if (tab.dataset.view === 'integrations') loadIntegrations(); }));
  els.editToggle.addEventListener('click', () => { editMode = !editMode; els.body.classList.toggle('editing', editMode); els.editToggle.innerHTML = editMode ? '&#10003;' : '&#9998;'; els.editToggle.title = editMode ? 'Zakończ edycję' : 'Edytuj widok'; els.editToggle.setAttribute('aria-label', els.editToggle.title); if (!editMode) { closeEditor(); els.backgroundBar.classList.remove('open'); els.bgManage.classList.remove('active'); els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); } });
  els.snapToggle.addEventListener('click', () => { model.settings.snapEnabled = !model.settings.snapEnabled; applySnapUi(); scheduleSave(true); notify(model.settings.snapEnabled ? 'Przyciąganie do siatki włączone' : 'Przyciąganie do siatki wyłączone'); });
  els.bgManage.addEventListener('click', () => { els.backgroundBar.classList.toggle('open'); els.bgManage.classList.toggle('active', els.backgroundBar.classList.contains('open')); if (!els.backgroundBar.classList.contains('open')) { els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); } });
  els.bgTransformToggle?.addEventListener('click', () => { els.bgTransformPanel.classList.toggle('open'); els.bgTransformToggle.classList.toggle('active', els.bgTransformPanel.classList.contains('open')); syncBackgroundTransformControls(); });
  [els.bgMode,els.bgScale,els.bgX,els.bgY].forEach(control => { control?.addEventListener('input', updateBackgroundTransform); control?.addEventListener('change', updateBackgroundTransform); });
  $('#background-transform-reset')?.addEventListener('click', () => { if (!currentBackground) return; model.settings.backgroundTransforms[currentBackground] = defaultBackgroundTransform(); applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave(true); notify('Przywrócono domyślne dopasowanie tła'); });
  els.scene.addEventListener('click', event => { if (event.target === els.scene || event.target === els.markers || event.target === els.image) closeEditor(); });
  $('#editor-close').addEventListener('click', closeEditor); document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (els.confirmBox.classList.contains('visible')) closeAppConfirm(false); else closeEditor(); });
  els.confirmCancel.addEventListener('click', () => closeAppConfirm(false)); els.confirmOk.addEventListener('click', () => closeAppConfirm(true));
  els.confirmBox.addEventListener('click', event => { if (event.target === els.confirmBox) closeAppConfirm(false); });
  $('.editor-head').addEventListener('pointerdown', startEditorDrag);
  els.editorContent.addEventListener('click', onColorPickerClick);
  $$('[data-editor-tab]').forEach(button => button.addEventListener('click', () => changeType(button.dataset.editorTab)));
  $('#default-style').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Przywrócić styl domyślny?', message: 'Obecne ustawienia wyglądu markera zostaną zastąpione.', confirmText: 'Przywróć', danger: true })) return; m.style = m.type === 'gauge' ? gaugeDefaults() : badgeDefaults(); renderMarkers(); openEditor(); scheduleSave(true); notify('Przywrócono styl domyślny'); });
  $('#copy-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m) return; styleClipboard = { type: m.type, style: clone(m.style) }; $('#paste-style').disabled = false; notify(`Skopiowano styl ${m.type === 'gauge' ? 'Gauge' : 'Badge'}`); });
  $('#paste-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m || !styleClipboard) return; m.type = styleClipboard.type; m.style = clone(styleClipboard.style); m.updatedAt = new Date().toISOString(); renderMarkers(); openEditor(); scheduleSave(true); notify('Wklejono kompletny styl 1:1'); });
  $('#remove-marker').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Usunąć marker?', message: `„${m.displayName}” zniknie z tego widoku razem ze swoimi ustawieniami.`, confirmText: 'Usuń', danger: true })) return; removeEntity(m.entityId); });
  $('#background-upload').addEventListener('click', () => els.bgFile.click()); $('#empty-upload').addEventListener('click', () => els.bgFile.click()); els.bgFile.addEventListener('change', () => uploadBackground(els.bgFile.files[0]));
  els.bgSelect.addEventListener('change', async () => { try { await api('background/select', jsonOptions({ name: els.bgSelect.value })); await loadBackgrounds(); } catch (error) { notify(error.message, true); } });
  els.bgDelete.addEventListener('click', async () => { const name = els.bgSelect.value; if (!name || !await appConfirm({ title: 'Usunąć tło?', message: `Tło „${name}” zostanie trwale usunięte.`, confirmText: 'Usuń', danger: true })) return; try { await api('background/delete', jsonOptions({ name })); if (model.settings.backgroundTransforms) delete model.settings.backgroundTransforms[name]; scheduleSave(true); await loadBackgrounds(); notify('Usunięto tło'); } catch (error) { notify(error.message, true); } });
  $('#reload-integrations').addEventListener('click', () => { integrations = []; integrationEntities.clear(); openIntegrations.clear(); loadIntegrations(true); });
  els.integrationList.addEventListener('click', event => { const add = event.target.closest('[data-add]'), summary = event.target.closest('.integration-summary'); if (add) addEntity(add.dataset.add, add.dataset.entry); else if (summary) toggleIntegration(summary.closest('.integration').dataset.integration); });
  els.addedList.addEventListener('click', event => { const remove = event.target.closest('[data-remove]'), focus = event.target.closest('[data-focus]'); if (remove) removeEntity(remove.dataset.remove); else if (focus) { $(`[data-view="overview"]`).click(); if (!editMode) els.editToggle.click(); selectMarker(focus.dataset.focus); } });
  $$('.selection i').forEach(handle => handle.addEventListener('pointerdown', startResize));
  els.image.addEventListener('load', () => { updateSceneGeometry(); applyBackgroundTransform(); }); window.addEventListener('resize', updateSceneGeometry);
  if ('ResizeObserver' in window) new ResizeObserver(updateSceneGeometry).observe(els.scene);
  els.zoomOut?.addEventListener('click', () => setViewZoom(viewZoom-.5)); els.zoomIn?.addEventListener('click', () => setViewZoom(viewZoom+.5)); els.zoomReset?.addEventListener('click', resetViewZoom);
  els.viewport?.addEventListener('dblclick', event => { if (mobileView()) setViewZoom(viewZoom > 1 ? 1 : 2, event.clientX, event.clientY); });
  els.viewport?.addEventListener('pointerdown', viewportPointerDown); els.viewport?.addEventListener('pointermove', viewportPointerMove);
  els.viewport?.addEventListener('pointerup', viewportPointerUp); els.viewport?.addEventListener('pointercancel', viewportPointerUp);
}
function startResize(event) {
  const marker = model.entities[selectedId];
  if (!editMode || !marker || event.button !== 0 || (event.buttons & 1) !== 1) return;
  event.preventDefault(); event.stopPropagation();
  const handle = event.currentTarget.dataset.handle, scale = sceneScale || 1, start = { x:event.clientX, y:event.clientY, w:marker.style.width, h:marker.style.height }; let changed = false;
  const move = e => {
    if ((e.buttons & 1) !== 1) return finish();
    const sx = handle.includes('w') ? -1 : 1, sy = handle.includes('n') ? -1 : 1; changed = true;
    marker.style.width = clamp(start.w + (e.clientX-start.x)*sx*2/scale,54,500); marker.style.height = clamp(start.h + (e.clientY-start.y)*sy*2/scale,34,350);
    const node = $(`.marker[data-entity-id="${CSS.escape(marker.entityId)}"]`); if (node) applyMarkerStyle(node, marker); syncSelection();
  };
  const finish = () => {
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
    if (changed) { marker.updatedAt = new Date().toISOString(); scheduleSave(true); openEditor(); }
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
}

async function boot() {
  bindEvents();
  try { const saved = await api('rewrite_state'); if (saved.exists && saved.data?.entities) model = saved.data; else await migrateLegacy(); }
  catch (error) { notify(`Nie udało się wczytać układu: ${error.message}`, true); }
  model.settings = { snapEnabled: true, snapStep: 1, designWidth: DESIGN_WIDTH, ...(model.settings || {}) }; applySnapUi();
  Object.values(model.entities).forEach(m => {
    m.type = m.type === 'gauge' ? 'gauge' : 'badge'; m.style = normalizedStyle(m.type, m.style);
    m.stateOnLabel ??= ''; m.stateOffLabel ??= ''; m.iconMode ||= 'auto'; m.iconName ??= ''; m.iconOn ??= ''; m.iconOff ??= '';
  });
  if (migrateGaugeZeroOffsets()) scheduleSave(true);
  updateSceneGeometry(); renderMarkers(); await Promise.all([loadBackgrounds(), refreshStates()]); updateSceneGeometry(); connectEvents();
}

boot();