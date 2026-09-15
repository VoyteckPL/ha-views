const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const uid = () => `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const DESIGN_WIDTH = 1600;

let uiLanguage = 'en';
const TRANSLATIONS = {
  en: {
    'Widoki':'Views','Integracje':'Integrations','Zarządzaj widokami':'Manage views','Nowy widok':'New view','Zmień nazwę widoku':'Rename view','Duplikuj widok':'Duplicate view','Usuń widok':'Delete view',
    'Łączenie…':'Connecting…','Siatka włączona':'Grid enabled','Siatka wyłączona':'Grid disabled','Wybierz tło':'Select background','Wgraj obraz':'Upload image','Usuń tło':'Delete background','Zarządzaj tłem':'Manage background','Edytuj widok':'Edit view','Zakończ edycję':'Finish editing',
    'Tło widoku HA Views':'HA Views view background','Wgraj tło widoku':'Upload view background','Dodane do widoku':'Added to view','Encje widoczne na scenie':'Entities visible on the scene','Integracje Home Assistant':'Home Assistant integrations','Tylko aktywne integracje widoczne w HA':'Only active integrations visible in HA','Odśwież':'Refresh',
    'Marker':'Marker','Ustaw domyślny':'Restore defaults','Kopiuj styl':'Copy style','Wklej styl':'Paste style','Usuń z widoku':'Remove from view','Zamknij':'Close','Wersja aplikacji HA Views':'HA Views app version',
    'Encja':'Entity','Rozmiar':'Size','Stan':'State','Nazwa':'Name','Ikona':'Icon','Tło':'Background','Ramka':'Border','Aktualny stan':'Current state','Historia':'History','Atrybuty':'Attributes','Wczytywanie…':'Loading…','Potwierdzenie':'Confirmation','Anuluj':'Cancel','Potwierdź':'Confirm',
    'Automatyczna':'Automatic','Brak wody':'No water','Energia domu':'Home energy','Pompa ciepła':'Heat pump','Drzwi otwarte':'Door open','Drzwi zamknięte':'Door closed','Okno otwarte':'Window open','Okno zamknięte':'Window closed',
    'Dodaj':'Add','Pokaż':'Show','Usuń':'Remove','Pozostałe integracje':'Other integrations','używane':'used','Zapisano':'Saved','Brak danych':'No data','Niedostępne':'Unavailable','Nieznany':'Unknown',
    'Przyciąganie do siatki włączone':'Snap to grid enabled','Przyciąganie do siatki wyłączone':'Snap to grid disabled','Dodano nowy widok':'New view added','Zmieniono nazwę widoku':'View renamed','Utworzono kopię widoku':'View duplicated','Usunięto widok':'View deleted','Przywrócono domyślne dopasowanie tła':'Default background fit restored','Przywrócono styl domyślny':'Default style restored','Wklejono kompletny styl 1:1':'Full style pasted 1:1',
    'Dodano do widoku':'Added to view','Usunięto z widoku':'Removed from view','Usunięto tło':'Background deleted','Skopiowano styl':'Style copied','Nie udało się wczytać układu:':'Could not load layout:',
    'Jednostka':'Unit','Zaokrąglenie':'Rounding','Tekst ON':'ON text','Tekst OFF':'OFF text','Pokaż':'Show','Kolor':'Colour','Przezrocz.':'Opacity','Szerokość':'Width','Wysokość':'Height','Grubość':'Thickness','Źródło':'Source','Z encji Home Assistant':'From Home Assistant entity','Logo integracji':'Integration logo','Własna ikona MDI':'Custom MDI icon','Brak danych':'No data','Zakres i wartość':'Range and value','Minimum':'Minimum','Maksimum':'Maximum','Tor':'Track','Wartość':'Value','Geometria wskaźnika':'Gauge geometry','Skala':'Scale','Pozycja':'Position','Kąt start':'Start angle','Kąt koniec':'End angle','Podziałka':'Ticks','Pokaż ticki':'Show ticks','Co ile':'Interval','Offset':'Offset','Długość':'Length','Liczby skali':'Scale labels','Czcionka':'Font','Odsunięcie':'Offset','Włącz':'Enable','Start':'Start','Koniec':'End','Procent':'Percent','Własny kolor RGB…':'Custom RGB colour…','Brak dodatkowych atrybutów.':'No additional attributes.','Nie dodano jeszcze żadnych encji.':'No entities have been added yet.','Kliknij, aby wczytać encje.':'Click to load entities.','Dodaj do widoku':'Add to view','Encja jest wyłączona':'Entity is disabled','Dodano świeży Badge z ustawieniami domyślnymi':'Added a new Badge with default settings','Usunięto marker i wszystkie jego ustawienia':'Removed marker and all its settings','Połączono':'Connected','Błąd danych':'Data error','Na żywo':'Live','Ponowne łączenie…':'Reconnecting…','Bez tła':'No background','Błąd zapisu':'Save error','Błąd':'Error'
  }
};
function translateValue(value) {
  const text = String(value ?? '');
  if (uiLanguage === 'pl') {
    const reverse = Object.fromEntries(Object.entries(TRANSLATIONS.en).map(([pl,en]) => [en,pl]));
    return reverse[text] || text;
  }
  const direct = TRANSLATIONS.en[text];
  if (direct) return direct;
  for (const [pl,en] of Object.entries(TRANSLATIONS.en)) if (text.startsWith(pl + ':')) return en + text.slice(pl.length);
  return text;
}
function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const translated = translateValue(node.nodeValue);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('#markers')) {
    [...node.childNodes].forEach(translateNode);
  }
}
function applyLanguage() {
  document.documentElement.lang = uiLanguage;
  const select = document.querySelector('#language-select');
  if (select) select.value = uiLanguage;
  const titles = {
    'integrations-button':'Integracje','view-manage':'Zarządzaj widokami','view-add':'Nowy widok','view-rename':'Zmień nazwę widoku','view-duplicate':'Duplikuj widok','view-delete':'Usuń widok',
    'background-manage':'Zarządzaj tłem','background-upload':'Wgraj obraz','background-delete':'Usuń tło','default-style':'Ustaw domyślny','copy-style':'Kopiuj styl','paste-style':'Wklej styl','remove-marker':'Usuń z widoku','editor-close':'Zamknij','more-info-close':'Zamknij'
  };
  Object.entries(titles).forEach(([id,label]) => { const el = document.getElementById(id); if (el) { const value = translateValue(label); el.title = value; el.setAttribute('aria-label', value); } });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const value = translateValue(el.dataset.i18nTitle);
    el.title = value; el.setAttribute('aria-label', value);
  });
  translateNode(document.body);
}
function bindLanguageObserver() {
  new MutationObserver(records => records.forEach(record => {
    if (record.type === 'characterData') translateNode(record.target);
    record.addedNodes.forEach(translateNode);
  })).observe(document.body, { subtree:true, childList:true, characterData:true });
}

const els = {
  body: document.body, viewport: $('#scene-viewport'), sceneCard: $('.scene-card'), scene: $('#scene'), image: $('#scene-image'), empty: $('#scene-empty'), markers: $('#markers'), panoramaIndicator: $('#panorama-indicator'), mobilePanStart: $('#mobile-pan-start'),
  selection: $('#selection'), editor: $('#editor'), editorTitle: $('#editor-title'), editorEntity: $('#editor-entity'), editorIntegration: $('#editor-integration'), editorIntegrationIcon: $('#editor-integration-icon'),
  editorContent: $('#editor-content'), editorStatus: $('#editor-status'), toast: $('#toast'), connection: $('#connection'),
  confirmBox: $('#app-confirm'), confirmTitle: $('#app-confirm-title'), confirmMessage: $('#app-confirm-message'), confirmInput: $('#app-confirm-input'), confirmCancel: $('#app-confirm-cancel'), confirmOk: $('#app-confirm-ok'), language: $('#language-select'),
  editToggle: $('#edit-toggle'), bgSelect: $('#background-select'), bgDelete: $('#background-delete'),
  bgFile: $('#background-file'), bgStatus: $('#background-status'), bgManage: $('#background-manage'), backgroundBar: $('#background-bar'), addedList: $('#added-list'),
  bgTransformToggle: $('#background-transform-toggle'), bgTransformPanel: $('#background-transform-panel'), bgMode: $('#background-mode'), bgScale: $('#background-scale'), bgX: $('#background-x'), bgY: $('#background-y'), bgScaleValue: $('#background-scale-value'), bgXValue: $('#background-x-value'), bgYValue: $('#background-y-value'),
  addedCount: $('#added-count'), integrationList: $('#integration-list'), snapToggle: $('#snap-toggle'),
  zoomOut: $('#zoom-out'), zoomIn: $('#zoom-in'), zoomReset: $('#zoom-reset'), zoomValue: $('#zoom-value'),
  sceneTabs: $('#scene-tabs'), integrationsButton: $('#integrations-button'), viewManage: $('#view-manage'), viewSwitcher: $('#view-switcher'), viewAdd: $('#view-add'), viewRename: $('#view-rename'), viewDuplicate: $('#view-duplicate'), viewDelete: $('#view-delete'),
  moreInfo: $('#more-info'), moreInfoBackdrop: $('#more-info-backdrop'), moreInfoIcon: $('#more-info-icon'), moreInfoTitle: $('#more-info-title'), moreInfoEntity: $('#more-info-entity'),
  moreInfoState: $('#more-info-state'), moreInfoUpdated: $('#more-info-updated'), moreInfoChart: $('#more-info-chart'), moreInfoAttributes: $('#more-info-attributes')
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
  trackColor: '#294657', progressColor: '#21BCEB', gaugeScale: 1, gaugeY: 0, startAngle: -180, endAngle: 0,
  showTicks: false, tickStep: 500, tickOffset: 4, tickLength: 7, tickWidth: 1, tickColor: '#8FDFFF', tickOpacity: .8,
  showTickLabels: false, tickLabelStep: 1000, tickFontSize: 8, tickFontFamily: 'Inter', tickLabelColor: '#9BC1D8', tickLabelOffset: 12,
  useGradient: false, gradientStart: '#21BCEB', gradientEnd: '#F59E0B',
  showBackground: true, backgroundColor: '#03101A', backgroundOpacity: .76,
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

let model = { version: 2, revision: 0, settings: { snapEnabled: true, snapStep: 1 }, activeViewId: '', viewOrder: [], views: {}, entities: {} };
let stateCache = {}, editMode = false, selectedId = null, styleClipboard = null, saveTimer = null;
let saveRunning = false, savePending = false, integrations = [], integrationEntities = new Map(), openIntegrations = new Set();
let unusedIntegrationsOpen = false, entityEvents = null, resumeTimer = null;
let editorDragged = false;
let sceneScale = 1;
let viewZoom = 1, viewPanX = 0, viewPanY = 0, mobileOrientation = '';
const viewPointers = new Map();
let panGesture = null, pinchGesture = null, desktopPanGesture = null;
let currentBackground = '';
let confirmResolver = null;
let confirmInputMode = false;
let moreInfoEntityId = '';
let moreInfoRequest = 0;

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
  const resolve = confirmResolver, value = confirmInputMode && result ? els.confirmInput.value.trim() : result;
  confirmResolver = null; confirmInputMode = false; els.confirmInput.hidden = true;
  els.confirmBox.classList.remove('visible'); els.confirmBox.setAttribute('aria-hidden', 'true');
  resolve(value);
}
function appConfirm({ title = 'Potwierdzenie', message = '', confirmText = 'Potwierdź', danger = false }) {
  if (confirmResolver) closeAppConfirm(false);
  confirmInputMode = false; els.confirmInput.hidden = true;
  els.confirmTitle.textContent = title; els.confirmMessage.textContent = message; els.confirmOk.textContent = confirmText;
  els.confirmOk.classList.toggle('danger-confirm', danger); els.confirmBox.classList.add('visible'); els.confirmBox.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => { confirmResolver = resolve; requestAnimationFrame(() => els.confirmCancel.focus()); });
}
function appPrompt({ title, message = '', value = '', confirmText = 'Zapisz' }) {
  if (confirmResolver) closeAppConfirm(false);
  confirmInputMode = true; els.confirmTitle.textContent = title; els.confirmMessage.textContent = message; els.confirmOk.textContent = confirmText;
  els.confirmOk.classList.remove('danger-confirm'); els.confirmInput.hidden = false; els.confirmInput.value = value;
  els.confirmBox.classList.add('visible'); els.confirmBox.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => { confirmResolver = resolve; requestAnimationFrame(() => { els.confirmInput.focus(); els.confirmInput.select(); }); });
}
function activeSceneView() { return model.views?.[model.activeViewId] || null; }
function attachActiveEntities() {
  const view = activeSceneView();
  model.entities = view?.entities || {};
  if (view) view.entities = model.entities;
}
function ensureMultiViewModel() {
  let migrated = false;
  if (!model.views || !Object.keys(model.views).length) {
    migrated = true;
    const id = 'view_main', oldEntities = model.entities || {};
    model.views = { [id]: { id, name: 'Widok ogólny', background: undefined, backgroundTransforms: clone(model.settings?.backgroundTransforms || {}), entities: oldEntities } };
    model.viewOrder = [id]; model.activeViewId = id;
  }
  model.viewOrder = (model.viewOrder || []).filter(id => model.views[id]);
  Object.keys(model.views).forEach(id => { if (!model.viewOrder.includes(id)) model.viewOrder.push(id); });
  if (!model.views[model.activeViewId]) model.activeViewId = model.viewOrder[0];
  Object.values(model.views).forEach((view, index) => {
    view.id ||= model.viewOrder[index]; view.name ||= `Widok ${index + 1}`; view.entities ||= {}; view.backgroundTransforms ||= {};
  });
  model.version = 2; attachActiveEntities(); return migrated;
}
function showMainView(name) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  els.integrationsButton?.classList.toggle('active', name === 'integrations');
  renderViewSelector(); if (name === 'integrations') loadIntegrations();
}
function renderViewSelector() {
  if (!els.sceneTabs) return;
  const overviewActive = $('#view-overview')?.classList.contains('active');
  els.sceneTabs.innerHTML = model.viewOrder.map(id => `<button class="tab scene-view-tab ${overviewActive && id === model.activeViewId ? 'active' : ''}" data-scene-view="${escapeHtml(id)}">${escapeHtml(model.views[id].name)}</button>`).join('');
  els.viewDelete.disabled = model.viewOrder.length <= 1;
}
async function switchSceneView(id, persist = true) {
  if (!model.views[id] || id === model.activeViewId && persist) return;
  closeEditor(); closeMoreInfo(); model.activeViewId = id; attachActiveEntities(); currentBackground = '';
  renderViewSelector(); els.markers.classList.add('background-pending'); renderIntegrations();
  await loadBackgrounds(true); resetViewZoom(); renderMarkers(); els.markers.classList.remove('background-pending'); await refreshStates();
  if (persist) scheduleSave(true);
}
async function addSceneView() {
  const name = await appPrompt({ title: 'Nowy widok', message: 'Podaj krótką nazwę nowego widoku.', value: `Widok ${model.viewOrder.length + 1}`, confirmText: 'Dodaj' });
  if (!name) return;
  const id = `view_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
  model.views[id] = { id, name, background: '', backgroundTransforms: {}, entities: {} }; model.viewOrder.push(id);
  await switchSceneView(id, false); scheduleSave(true); notify('Dodano nowy widok');
}
async function renameSceneView() {
  const view = activeSceneView(), name = await appPrompt({ title: 'Zmień nazwę widoku', message: 'Wpisz nową nazwę.', value: view?.name || '', confirmText: 'Zapisz' });
  if (!view || !name) return; view.name = name; renderViewSelector(); scheduleSave(true); notify('Zmieniono nazwę widoku');
}
async function duplicateSceneView() {
  const source = activeSceneView(); if (!source) return;
  const name = await appPrompt({ title: 'Duplikuj widok', message: 'Kopia zachowa tło, markery i wszystkie ich ustawienia.', value: `${source.name} — kopia`, confirmText: 'Duplikuj' });
  if (!name) return;
  const id = `view_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`, copy = clone(source);
  copy.id = id; copy.name = name; Object.values(copy.entities).forEach(marker => { marker.id = uid(); marker.updatedAt = new Date().toISOString(); });
  model.views[id] = copy; model.viewOrder.push(id); await switchSceneView(id, false); scheduleSave(true); notify('Utworzono kopię widoku');
}
async function deleteSceneView() {
  const view = activeSceneView(); if (!view || model.viewOrder.length <= 1) return;
  if (!await appConfirm({ title: 'Usunąć widok?', message: `„${view.name}” oraz wszystkie markery tego widoku zostaną usunięte.`, confirmText: 'Usuń widok', danger: true })) return;
  const index = model.viewOrder.indexOf(view.id); delete model.views[view.id]; model.viewOrder.splice(index, 1);
  model.activeViewId = model.viewOrder[Math.max(0, index - 1)]; attachActiveEntities(); renderViewSelector(); els.markers.classList.add('background-pending'); renderIntegrations(); await loadBackgrounds(true); renderMarkers(); els.markers.classList.remove('background-pending'); await refreshStates(); scheduleSave(true); notify('Usunięto widok');
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
  if (els.snapToggle) { els.snapToggle.classList.toggle('active', enabled); els.snapToggle.title = translateValue(enabled ? 'Siatka włączona' : 'Siatka wyłączona'); els.snapToggle.setAttribute('aria-label', els.snapToggle.title); }
}
function snapPercent(value) {
  if (model.settings?.snapEnabled === false) return clamp(value, 0, 100);
  const step = Number(model.settings?.snapStep) || 1;
  return clamp(Math.round(value / step) * step, 0, 100);
}
function mobileView() { return matchMedia('(max-width: 900px) and (pointer: coarse), (max-width: 768px)').matches; }
function sceneCameraActive() { return mobileView() || editMode || viewZoom > 1.001; }
function mobileWidePanorama() {
  return mobileView() && innerHeight > innerWidth && els.image.naturalWidth > els.image.naturalHeight;
}
function updateSceneGeometry() {
  const hasImage = !els.image.hidden && els.image.naturalWidth > 0 && els.image.naturalHeight > 0;
  const width = hasImage ? els.image.naturalWidth : 16, height = hasImage ? els.image.naturalHeight : 9, ratio = width / height;
  const panorama = mobileWidePanorama();
  let renderedWidth;
  if (panorama) {
    const viewportHeight = window.visualViewport?.height || innerHeight;
    const top = els.viewport.getBoundingClientRect().top;
    const renderedHeight = Math.max(180, viewportHeight - top - (editMode ? 44 : 8));
    renderedWidth = Math.round(renderedHeight * ratio);
    els.viewport.style.height = `${renderedHeight}px`; els.viewport.style.aspectRatio = 'auto';
    els.scene.style.width = `${renderedWidth}px`; els.scene.style.height = `${renderedHeight}px`;
  } else {
    els.scene.style.width = '100%';
    renderedWidth = els.scene.clientWidth;
    els.scene.style.height = `${renderedWidth / ratio}px`;
    els.viewport.style.height = `${renderedWidth / ratio}px`; els.viewport.style.aspectRatio = `${width} / ${height}`;
  }
  els.scene.style.aspectRatio = `${width} / ${height}`;
  els.scene.style.minHeight = '0px'; els.scene.style.maxHeight = 'none';
  els.viewport.classList.toggle('panorama-mode', panorama);
  const physicalScale = renderedWidth / (Number(model.settings?.designWidth) || DESIGN_WIDTH);
  // Markers follow the scene but never become unreadably tiny on a narrow portrait canvas.
  sceneScale = Math.max(.01, physicalScale, mobileView() ? .50 : .58);
  els.scene.style.setProperty('--scene-scale', sceneScale);
  applyViewTransform();
  requestAnimationFrame(() => { syncSelection(); positionEditor(); });
}
function portraitZoomExpansion() {
  return !mobileWidePanorama() && els.image.naturalHeight > els.image.naturalWidth && viewZoom > 1.01;
}
function minViewZoom() {
  if (!mobileWidePanorama()) return 1;
  return clamp(els.viewport.clientWidth / Math.max(1, els.scene.offsetWidth), .08, 1);
}
function clampViewPan() {
  if (!sceneCameraActive()) { viewPanX = 0; viewPanY = 0; return; }
  const panorama = mobileWidePanorama();
  if (viewZoom <= minViewZoom() && !panorama) { viewPanX = 0; viewPanY = 0; return; }
  const maxX = Math.max(0, els.scene.offsetWidth * viewZoom - els.viewport.clientWidth);
  const maxY = Math.max(0, els.scene.offsetHeight * viewZoom - els.viewport.clientHeight);
  viewPanX = clamp(viewPanX, -maxX, 0); viewPanY = clamp(viewPanY, -maxY, 0);
}
function updatePanoramaIndicator() {
  const indicator = els.panoramaIndicator; if (!indicator) return;
  const panorama = mobileWidePanorama(), maxX = Math.max(0, els.scene.offsetWidth * viewZoom - els.viewport.clientWidth);
  indicator.classList.toggle('visible', panorama && maxX > 1); indicator.setAttribute('aria-hidden', String(!(panorama && maxX > 1)));
  if (!panorama || maxX <= 1) return;
  const thumb = indicator.querySelector('i'), size = clamp(els.viewport.clientWidth / (els.scene.offsetWidth * viewZoom) * 100, 12, 92);
  thumb.style.width = `${size}%`; thumb.style.transform = `translateX(${(-viewPanX / maxX) * (100 - size)}%)`;
}
function applyViewTransform() {
  const expandedPortrait = portraitZoomExpansion();
  els.viewport.classList.toggle('portrait-zoom-expanded', expandedPortrait);
  els.sceneCard?.classList.toggle('portrait-zoom-expanded', expandedPortrait);
  if (!sceneCameraActive()) { els.scene.style.transform = ''; updatePanoramaIndicator(); return; }
  clampViewPan();
  els.scene.style.transformOrigin = '0 0';
  els.scene.style.transform = `translate(${viewPanX}px,${viewPanY}px) scale(${viewZoom})`;
  if (els.zoomValue) els.zoomValue.textContent = `${Math.round(viewZoom * 100)}%`;
  if (els.zoomOut) els.zoomOut.disabled = viewZoom <= minViewZoom() + .001;
  if (els.zoomIn) els.zoomIn.disabled = viewZoom >= 4;
  updatePanoramaIndicator();
  requestAnimationFrame(syncSelection);
}
function setViewZoom(next, clientX = null, clientY = null) {
  // In desktop viewing mode, wheel-down must land exactly on the fitted 100% view.
  if (!mobileView() && !editMode && next <= 1) next = 1;
  const old = viewZoom, zoom = clamp(next, minViewZoom(), 4); if (zoom === old) return;
  const r = els.viewport.getBoundingClientRect(), x = clientX == null ? r.width / 2 : clientX - r.left, y = clientY == null ? r.height / 2 : clientY - r.top;
  viewPanX = x - (x - viewPanX) * zoom / old; viewPanY = y - (y - viewPanY) * zoom / old; viewZoom = zoom; applyViewTransform();
}
function resetViewZoom() {
  // Normal scenes start fully visible; wide scenes on a portrait phone start at the saved panorama focus.
  viewZoom = 1; viewPanY = 0;
  const t = currentBackgroundTransform(), maxX = Math.max(0, els.scene.offsetWidth - els.viewport.clientWidth);
  viewPanX = mobileWidePanorama() ? -maxX * clamp(t.mobilePanStart ?? .5, 0, 1) : 0;
  applyViewTransform();
}
function syncMobileOrientation() {
  const next = mobileView() ? (innerHeight > innerWidth ? 'portrait' : 'landscape') : 'desktop';
  if (next !== mobileOrientation) { mobileOrientation = next; requestAnimationFrame(resetViewZoom); }
}
function defaultBackgroundTransform() { return { mode:'contain', scale:1, x:0, y:0, mobilePanStart:.5 }; }
function currentBackgroundTransform() {
  const view = activeSceneView(); if (!view || !currentBackground) return defaultBackgroundTransform();
  view.backgroundTransforms ||= {}; view.backgroundTransforms[currentBackground] ||= defaultBackgroundTransform();
  const t = view.backgroundTransforms[currentBackground]; if (t.mobilePanStart == null) t.mobilePanStart = .5;
  return t;
}
function applyBackgroundTransform() {
  const card = els.sceneCard; if (!card) return;
  const ratio = els.image.naturalWidth / Math.max(1, els.image.naturalHeight);
  const panorama = mobileWidePanorama();

  if (panorama) {
    // Wide image on a portrait phone: use full height and expose the extra width as a panorama.
    card.style.width = '100%'; card.style.marginLeft = '0'; card.style.marginRight = '0';
  } else {
    // Every other combination: largest whole image that still fits in the visible workspace.
    const parentWidth = Math.max(1, card.parentElement?.clientWidth || innerWidth);
    const top = card.getBoundingClientRect().top;
    const viewportHeight = window.visualViewport?.height || innerHeight;
    const availableHeight = Math.max(160, viewportHeight - top - (mobileView() && editMode ? 44 : 8));
    const fittedWidth = Math.min(parentWidth, availableHeight * ratio);
    card.style.width = `${(fittedWidth / parentWidth) * 100}%`;
    card.style.marginLeft = 'auto'; card.style.marginRight = 'auto';
  }
  els.image.style.objectFit = 'fill'; els.image.style.transform = '';
  requestAnimationFrame(updateSceneGeometry);
}
function syncBackgroundTransformControls() {
  if (!els.bgScale) return; const t = currentBackgroundTransform(), disabled = !currentBackground;
  els.bgScale.value = t.scale; els.bgScaleValue.textContent = `${Math.round(t.scale*100)}%`;
  if (els.mobilePanStart) { els.mobilePanStart.value = String(t.mobilePanStart ?? .5); els.mobilePanStart.disabled = disabled; }
  [els.bgScale,$('#background-transform-reset'),...$$('[data-bg-align-x]', els.bgTransformPanel)].forEach(control => { if (control) control.disabled = disabled; });
}
function updateBackgroundTransform() {
  if (!currentBackground) return; const t = currentBackgroundTransform(); t.scale = Number(els.bgScale.value);
  applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave();
}
function updateMobilePanStart() {
  if (!currentBackground || !els.mobilePanStart) return;
  currentBackgroundTransform().mobilePanStart = Number(els.mobilePanStart.value);
  resetViewZoom(); syncBackgroundTransformControls(); scheduleSave();
}
async function queueSave() {
  clearTimeout(saveTimer); savePending = true;
  if (saveRunning) return;
  saveRunning = true;
  while (savePending) {
    savePending = false; const snapshot = clone(model); delete snapshot.entities;
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
  Object.values(model.views || {}).flatMap(view => Object.values(view.entities || {})).forEach(marker => {
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
  return true;
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
function gaugePoint(cx, cy, radius, angle) {
  const radians = Number(angle) * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}
function gaugeArcPath(cx, cy, radius, startAngle, endAngle) {
  let sweep = Number(endAngle) - Number(startAngle);
  while (sweep <= 0) sweep += 360;
  sweep = Math.min(sweep, 359.9);
  const start = gaugePoint(cx, cy, radius, startAngle), end = gaugePoint(cx, cy, radius, Number(startAngle) + sweep);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}
function gaugeScaleMarkup(marker, s, cx, cy, radius, startAngle, sweep) {
  const min = Number(s.min), max = Number(s.max), tickStep = Math.abs(Number(s.tickStep)), labelStep = Math.abs(Number(s.tickLabelStep));
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return '';
  const markup = [], tickOffset = Number(s.tickOffset) || 0, tickLength = Number(s.tickLength) || 0;
  if (s.showTicks && Number.isFinite(tickStep) && tickStep > 0) {
    const count = Math.min(80, Math.floor((max - min) / tickStep) + 1);
    for (let index = 0; index < count; index++) {
      const value = min + index * tickStep; if (value > max + tickStep * .001) break;
      const angle = Number(startAngle) + sweep * ((value - min) / (max - min));
      const inner = gaugePoint(cx, cy, radius + tickOffset, angle), outer = gaugePoint(cx, cy, radius + tickOffset + tickLength, angle);
      markup.push(`<line class="gauge-tick" x1="${inner.x.toFixed(2)}" y1="${inner.y.toFixed(2)}" x2="${outer.x.toFixed(2)}" y2="${outer.y.toFixed(2)}"/>`);
    }
  }
  if (s.showTickLabels && Number.isFinite(labelStep) && labelStep > 0) {
    const count = Math.min(40, Math.floor((max - min) / labelStep) + 1);
    for (let index = 0; index < count; index++) {
      const value = min + index * labelStep; if (value > max + labelStep * .001) break;
      const angle = Number(startAngle) + sweep * ((value - min) / (max - min));
      const label = gaugePoint(cx, cy, radius + tickOffset + tickLength + Number(s.tickLabelOffset), angle);
      markup.push(`<text class="gauge-tick-label" x="${label.x.toFixed(2)}" y="${label.y.toFixed(2)}">${escapeHtml(Number(value.toFixed(4)))}</text>`);
    }
  }
  return markup.join('');
}
function markerHtml(marker) {
  const s = marker.style, formatted = formatState(marker), fullValue = `${formatted.value}${formatted.unit ? ` ${formatted.unit}` : ''}`, icon = iconMarkup(marker);
  if (marker.type === 'gauge') {
    const n = Number(stateCache[marker.entityId]?.state), span = Number(s.max) - Number(s.min) || 1;
    const percent = Number.isFinite(n) ? clamp(((n - Number(s.min)) / span) * 100, 0, 100) : 0;
    const cx = 100, cy = 90, radius = 70, start = Number(s.startAngle), rawSweep = Number(s.endAngle) - start;
    let sweep = rawSweep; while (sweep <= 0) sweep += 360; sweep = Math.min(sweep, 359.9);
    const path = gaugeArcPath(cx, cy, radius, start, start + sweep), gradientId = `gauge-gradient-${String(marker.id).replace(/[^a-z0-9_-]/gi, '')}`;
    const stroke = s.useGradient ? `url(#${gradientId})` : s.progressColor;
    return `<svg class="gauge-svg" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${escapeHtml(s.gradientStart)}"/><stop offset="100%" stop-color="${escapeHtml(s.gradientEnd)}"/></linearGradient></defs><g class="gauge-visual" style="transform:translateY(${Number(s.gaugeY)}px) scale(${Number(s.gaugeScale)});transform-origin:${cx}px ${cy}px"><path class="gauge-track" pathLength="100" d="${path}"/><path class="gauge-value" pathLength="100" d="${path}" style="stroke:${escapeHtml(stroke)};stroke-dasharray:${percent} 100"/>${gaugeScaleMarkup(marker,s,cx,cy,radius,start,sweep)}</g></svg>${icon}${s.showLabel ? `<span class="label">${escapeHtml(marker.displayName)}</span>` : ''}${s.showValue ? `<span class="value">${escapeHtml(fullValue)}</span>` : ''}${s.showPercent ? `<span class="percent">${Math.round(percent)}%</span>` : ''}`;
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
    const gradientId = `gauge-gradient-${String(marker.id).replace(/[^a-z0-9_-]/gi, '')}`;
    Object.assign(track.style, { stroke: s.trackColor, strokeWidth: s.thickness });
    Object.assign(progress.style, { stroke: s.useGradient ? `url(#${gradientId})` : s.progressColor, strokeWidth: s.thickness, strokeDasharray: `${pct} 100` });
    $$('.gauge-tick', node).forEach(tick => Object.assign(tick.style, { stroke: rgba(s.tickColor, s.tickOpacity), strokeWidth: s.tickWidth }));
    $$('.gauge-tick-label', node).forEach(text => Object.assign(text.style, { fill: s.tickLabelColor, fontSize: `${s.tickFontSize}px`, fontFamily: s.tickFontFamily }));
  }
}
function closeMoreInfo() {
  moreInfoEntityId = ''; moreInfoRequest++;
  els.moreInfo.classList.remove('visible'); els.moreInfoBackdrop.classList.remove('visible');
  els.moreInfo.setAttribute('aria-hidden','true'); els.moreInfoBackdrop.setAttribute('aria-hidden','true');
}
function readableAttribute(value) {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
function refreshMoreInfoState() {
  const marker = model.entities[moreInfoEntityId]; if (!marker) return;
  const state = stateCache[moreInfoEntityId] || {}, formatted = formatState(marker), icon = String(resolvedIcon(marker) || 'mdi:cube-outline').replace(/^mdi:/,'mdi-');
  els.moreInfoIcon.innerHTML = `<i class="mdi ${escapeHtml(icon)}"></i>`; els.moreInfoTitle.textContent = marker.displayName; els.moreInfoEntity.textContent = marker.entityId;
  els.moreInfoState.textContent = `${formatted.value}${formatted.unit ? ` ${formatted.unit}` : ''}`;
  const changed = state.last_changed || state.last_updated; els.moreInfoUpdated.textContent = changed ? `Ostatnia zmiana: ${new Date(changed).toLocaleString('pl-PL')}` : '';
  const ignored = new Set(['friendly_name','icon','unit_of_measurement']);
  const attributes = Object.entries(state.attributes || {}).filter(([key]) => !ignored.has(key)).slice(0,40);
  els.moreInfoAttributes.innerHTML = attributes.length ? attributes.map(([key,value]) => `<div><span>${escapeHtml(key.replaceAll('_',' '))}</span><strong>${escapeHtml(readableAttribute(value))}</strong></div>`).join('') : '<p>Brak dodatkowych atrybutów.</p>';
}
function historyChartMarkup(points) {
  if (!points.length) return '<span>Brak historii w wybranym okresie.</span>';
  const numeric = points.map(point => ({ t:new Date(point.t).getTime(), v:Number(point.state) })).filter(point => Number.isFinite(point.t) && Number.isFinite(point.v));
  if (numeric.length >= 2) {
    const width=360,height=150,padX=18,padY=18,minT=numeric[0].t,maxT=numeric[numeric.length-1].t||minT+1;
    let minV=Math.min(...numeric.map(p=>p.v)),maxV=Math.max(...numeric.map(p=>p.v)); if(minV===maxV){minV-=1;maxV+=1;}
    const coords=numeric.map(p=>({x:padX+(p.t-minT)/(maxT-minT||1)*(width-padX*2),y:height-padY-(p.v-minV)/(maxV-minV)*(height-padY*2)}));
    const line=coords.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), area=`${padX},${height-padY} ${line} ${width-padX},${height-padY}`;
    return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><linearGradient id="history-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20b9e7" stop-opacity=".34"/><stop offset="1" stop-color="#20b9e7" stop-opacity="0"/></linearGradient></defs><path class="history-grid" d="M18 18H342M18 75H342M18 132H342"/><polygon points="${area}" fill="url(#history-fill)"/><polyline class="history-line" points="${line}"/></svg><span class="history-max">${escapeHtml(Number(maxV.toFixed(2)))}</span><span class="history-min">${escapeHtml(Number(minV.toFixed(2)))}</span>`;
  }
  const changes=[]; points.forEach(point=>{if(!changes.length||changes[changes.length-1].state!==point.state)changes.push(point);});
  return `<div class="history-events">${changes.slice(-12).reverse().map(point=>`<div><time>${new Date(point.t).toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</time><strong>${escapeHtml(point.state ?? '—')}</strong></div>`).join('')}</div>`;
}
async function loadMoreInfoHistory(hours=24) {
  const entityId=moreInfoEntityId, request=++moreInfoRequest; if(!entityId)return;
  $$('.history-ranges button',els.moreInfo).forEach(button=>button.classList.toggle('active',Number(button.dataset.historyHours)===Number(hours)));
  els.moreInfoChart.innerHTML='<span>Wczytywanie historii…</span>';
  try { const data=await api(`entity_history?entity_id=${encodeURIComponent(entityId)}&hours=${hours}`); if(request!==moreInfoRequest||entityId!==moreInfoEntityId)return; els.moreInfoChart.innerHTML=historyChartMarkup(data.points||[]); }
  catch(error){if(request===moreInfoRequest)els.moreInfoChart.innerHTML=`<span>Nie udało się pobrać historii: ${escapeHtml(error.message)}</span>`;}
}
function deepFindMoreInfo(root) {
  if (!root?.querySelectorAll) return null;
  for (const element of root.querySelectorAll('*')) {
    const name = element.localName || '';
    if (name.includes('more-info') && (name.includes('dialog') || element.getAttribute?.('role') === 'dialog')) return element;
    const found = element.shadowRoot && deepFindMoreInfo(element.shadowRoot); if (found) return found;
  }
  return null;
}
function applyNativeThemeTree(root, parentDocument) {
  if (!root?.querySelectorAll) return 0;
  const variables = {
    '--primary-background-color':'#071923','--secondary-background-color':'#0b2331','--card-background-color':'#0b2331',
    '--ha-card-background':'#0b2331','--paper-card-background-color':'#0b2331','--primary-text-color':'#e8f4fa',
    '--secondary-text-color':'#86a5b6','--disabled-text-color':'#587485','--divider-color':'rgba(139,190,216,.18)',
    '--primary-color':'#20b9e7','--accent-color':'#20b9e7','--error-color':'#ff6374','--warning-color':'#ffd166',
    '--success-color':'#22d69b','--mdc-theme-surface':'#071923','--mdc-theme-on-surface':'#e8f4fa',
    '--mdc-dialog-container-color':'#071923','--mdc-menu-item-label-text-color':'#e8f4fa',
    '--mdc-text-field-fill-color':'#0b2331','--mdc-filled-text-field-container-color':'#0b2331',
    '--md-filled-field-container-color':'#0b2331','--md-outlined-field-container-color':'#0b2331',
    '--mdc-select-fill-color':'#0b2331','--md-filled-select-text-field-container-color':'#0b2331',
    '--ha-textfield-background-color':'#0b2331','--input-fill-color':'#0b2331','--input-ink-color':'#e8f4fa',
    '--mdc-text-field-ink-color':'#e8f4fa','--md-filled-field-label-text-color':'#86a5b6',
    '--md-filled-field-input-text-color':'#e8f4fa','--md-sys-color-surface-container-highest':'#0b2331',
    '--md-sys-color-on-surface':'#e8f4fa','--md-sys-color-on-surface-variant':'#86a5b6',
    '--ha-dialog-border-radius':'17px','color-scheme':'dark'
  };
  const selector = 'ha-more-info-dialog,ha-more-info-settings,ha-more-info-info,ha-dialog,mwc-dialog,md-dialog,mwc-menu,ha-md-menu,md-menu,ha-list-item,mwc-list-item,ha-textfield,ha-select,ha-control-select,ha-entity-picker,ha-icon-picker,ha-area-picker,ha-combo-box,ha-selector,ha-form,md-filled-text-field,md-outlined-text-field,md-filled-select,md-outlined-select';
  const targets = [...root.querySelectorAll(selector)];
  targets.forEach(element => Object.entries(variables).forEach(([key,value]) => element.style?.setProperty(key,value)));
  if (root.nodeType === 11 && root.host && !root.querySelector('style[data-ha-views-theme]')) {
    const style = parentDocument.createElement('style'); style.dataset.haViewsTheme = '';
    style.textContent = `
      :host{color-scheme:dark}
      .mdc-dialog__surface,.mdc-menu-surface,[role="dialog"],[role="menu"],ha-card{
        background:#071923!important;color:#e8f4fa!important;border-color:rgba(139,190,216,.18)!important
      }
      .mdc-list-item,.mdc-deprecated-list-item,[role="menuitem"]{color:#e8f4fa!important}
      .mdc-list-item:hover,.mdc-deprecated-list-item:hover,[role="menuitem"]:hover{background:#12384a!important}
      ha-textfield,ha-select,ha-control-select,ha-entity-picker,ha-icon-picker,ha-area-picker,
      ha-combo-box,md-filled-text-field,md-outlined-text-field,md-filled-select,md-outlined-select,
      .mdc-text-field,.mdc-select__anchor,input,textarea,select{
        background:#0b2331!important;background-color:#0b2331!important;color:#e8f4fa!important
      }
      .mdc-text-field__input,.mdc-select__selected-text,.mdc-floating-label{color:#e8f4fa!important}
      .mdc-line-ripple:before,.mdc-line-ripple:after{border-bottom-color:#20b9e7!important}
    `; root.append(style);
  }
  for (const element of root.querySelectorAll('*')) if (element.shadowRoot) applyNativeThemeTree(element.shadowRoot, parentDocument);
  return targets.length;
}
function nativeColorParts(value) {
  const match = String(value).match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)(?:[, /]+([\d.]+))?/);
  return match ? { r:+match[1], g:+match[2], b:+match[3], a:match[4] == null ? 1 : +match[4] } : null;
}
function darkenNativeSurfaces(root, parentDocument, inheritedDark = false) {
  if (!root) return;
  const win = parentDocument.defaultView, children = root.children ? [...root.children] : [];
  children.forEach(element => {
    const tag = element.localName || '', computed = win.getComputedStyle(element), bg = nativeColorParts(computed.backgroundColor);
    const light = bg && bg.a > .15 && (bg.r + bg.g + bg.b) / 3 > 185;
    const insideDark = inheritedDark || light;
    if (light && !['svg','path','img','ha-svg-icon','ha-icon'].includes(tag)) {
      element.style.setProperty('background-color','#0b2331','important');
      element.style.setProperty('background-image','none','important');
      element.style.setProperty('border-color','rgba(139,190,216,.28)','important');
    }
    const fg = nativeColorParts(computed.color);
    if (insideDark && fg && (fg.r + fg.g + fg.b) / 3 < 175) element.style.setProperty('color','#e8f4fa','important');
    darkenNativeSurfaces(element, parentDocument, insideDark);
    if (element.shadowRoot) darkenNativeSurfaces(element.shadowRoot, parentDocument, insideDark);
  });
}
function findNativeOverlays(root, found = []) {
  if (!root?.querySelectorAll) return found;
  root.querySelectorAll('ha-adaptive-dialog,ha-more-info-dialog,ha-dropdown,ha-md-menu,md-menu,mwc-menu,[role="menu"]').forEach(element => found.push(element));
  root.querySelectorAll('*').forEach(element => { if (element.shadowRoot) findNativeOverlays(element.shadowRoot, found); });
  return [...new Set(found)];
}
function styleNativeMoreInfo(parentDocument, attempt = 0) {
  const dialog = deepFindMoreInfo(parentDocument), roots = findNativeOverlays(parentDocument);
  if (dialog && !roots.includes(dialog)) roots.push(dialog);
  roots.forEach(root => {
    applyNativeThemeTree(root, parentDocument);
    if (root.shadowRoot) applyNativeThemeTree(root.shadowRoot, parentDocument);
    darkenNativeSurfaces(root, parentDocument);
    if (root.shadowRoot) darkenNativeSurfaces(root.shadowRoot, parentDocument);
  });
  if (!parentDocument.__haViewsThemeListener) {
    parentDocument.__haViewsThemeListener = true;
    parentDocument.addEventListener('click', () => [40,120,300,600].forEach(delay => setTimeout(() => styleNativeMoreInfo(parentDocument, 99), delay)), true);
  }
  if (attempt < 35 && dialog) setTimeout(() => styleNativeMoreInfo(parentDocument, attempt + 1), 100);
  else if (!dialog && attempt < 25) setTimeout(() => styleNativeMoreInfo(parentDocument, attempt + 1), 80);
}
function openNativeHaMoreInfo(entityId) {
  try {
    if (window.parent === window || !window.parent.document) return false;
    const parentDocument = window.parent.document, target = parentDocument.querySelector('home-assistant') || parentDocument.body;
    target.dispatchEvent(new CustomEvent('hass-more-info', { detail:{ entityId }, bubbles:true, composed:true }));
    // Native Home Assistant More Info is intentionally left completely untouched.
    return true;
  } catch { return false; }
}
function openMoreInfo(entityId) {
  const marker=model.entities[entityId]; if(!marker)return;
  if (openNativeHaMoreInfo(entityId)) return;
  moreInfoEntityId=entityId; refreshMoreInfoState(); els.moreInfo.classList.add('visible'); els.moreInfoBackdrop.classList.add('visible');
  els.moreInfo.setAttribute('aria-hidden','false'); els.moreInfoBackdrop.setAttribute('aria-hidden','false'); loadMoreInfoHistory(24);
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
  if (event.currentTarget.dataset.dragged === '1') { event.currentTarget.dataset.dragged = '0'; return; }
  event.stopPropagation();
  if (!editMode) return openMoreInfo(event.currentTarget.dataset.entityId);
  selectMarker(event.currentTarget.dataset.entityId);
}
function selectMarker(entityId) { selectedId = entityId; renderMarkers(); openEditor(); }
function hideSelection() { els.selection.classList.remove('visible'); }
function syncSelection() {
  const node = $(`.marker[data-entity-id="${CSS.escape(selectedId)}"]`); if (!node) return hideSelection();
  const sr = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect(), zoom = sceneCameraActive() ? viewZoom : 1;
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
  const output = type === 'range' ? `<output data-suffix="${escapeHtml(options.suffix || '')}">${value}${options.suffix || ''}</output>` : '<span></span>';
  return `<div class="control ${type === 'checkbox' ? 'checkbox' : ''}"><label>${label}</label>${input}${output}</div>`;
}
function mdiControl(label, path, value) {
  return `<div class="control"><label>${label}</label><input type="text" list="mdi-icon-list" value="${escapeHtml(value)}" data-path="${path}" data-value-type="text" placeholder="np. mdi:weather-rainy"><span></span></div>`;
}
function section(title, body, open = false) { return `<details class="editor-section" ${open ? 'open' : ''}><summary>${title}</summary><div class="editor-section-body">${body}</div></details>`; }
function gaugeSubsection(title, body) { return `<details class="gauge-subsection"><summary>${title}</summary><div class="gauge-subsection-body">${body}</div></details>`; }
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
  if (marker.type === 'gauge') {
    const range = gaugeSubsection('Zakres i wartość', control('Minimum','style.min','number',s.min,{valueType:'number'}) + control('Maksimum','style.max','number',s.max,{valueType:'number'}) + control('Grubość','style.thickness','range',s.thickness,{min:2,max:30,step:1,suffix:'px'}) + control('Tor','style.trackColor','color',s.trackColor) + control('Wartość','style.progressColor','color',s.progressColor));
    const geometry = gaugeSubsection('Geometria wskaźnika', control('Skala','style.gaugeScale','range',s.gaugeScale,{min:.35,max:1.8,step:.01}) + control('Pozycja','style.gaugeY','range',s.gaugeY,{min:-80,max:80,step:1,suffix:'px'}) + control('Kąt start','style.startAngle','range',s.startAngle,{min:-270,max:270,step:1,suffix:'°'}) + control('Kąt koniec','style.endAngle','range',s.endAngle,{min:-270,max:450,step:1,suffix:'°'}));
    const ticks = gaugeSubsection('Podziałka', control('Pokaż ticki','style.showTicks','checkbox',s.showTicks) + control('Co ile','style.tickStep','number',s.tickStep,{valueType:'number',min:0}) + control('Offset','style.tickOffset','range',s.tickOffset,{min:0,max:40,step:1,suffix:'px'}) + control('Długość','style.tickLength','range',s.tickLength,{min:2,max:24,step:1,suffix:'px'}) + control('Grubość','style.tickWidth','range',s.tickWidth,{min:.5,max:6,step:.5,suffix:'px'}) + control('Kolor','style.tickColor','color',s.tickColor) + control('Przezrocz.','style.tickOpacity','range',s.tickOpacity,{min:0,max:1,step:.01}));
    const tickLabels = gaugeSubsection('Liczby skali', control('Pokaż','style.showTickLabels','checkbox',s.showTickLabels) + control('Co ile','style.tickLabelStep','number',s.tickLabelStep,{valueType:'number',min:0}) + control('Rozmiar','style.tickFontSize','range',s.tickFontSize,{min:5,max:24,step:1,suffix:'px'}) + control('Czcionka','style.tickFontFamily','select',s.tickFontFamily,{items:[['Inter','Inter'],['Segoe UI','Segoe UI'],['Arial','Arial'],['monospace','Monospace']]}) + control('Kolor','style.tickLabelColor','color',s.tickLabelColor) + control('Odsunięcie','style.tickLabelOffset','range',s.tickLabelOffset,{min:-8,max:36,step:1,suffix:'px'}));
    const gradient = gaugeSubsection('Gradient', control('Włącz','style.useGradient','checkbox',s.useGradient) + control('Start','style.gradientStart','color',s.gradientStart) + control('Koniec','style.gradientEnd','color',s.gradientEnd));
    const percent = gaugeSubsection('Procent', control('Pokaż','style.showPercent','checkbox',s.showPercent) + control('Kolor','style.percentColor','color',s.percentColor) + control('Przezrocz.','style.percentOpacity','range',s.percentOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.percentScale','range',s.percentScale,{min:.5,max:3,step:.05}) + control('Pozycja','style.percentY','range',s.percentY,{min:-100,max:100,step:1,suffix:'px'}));
    gauge = section('Gauge', range + geometry + ticks + tickLabels + gradient + percent);
  }
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
  $$('.gauge-subsection', els.editorContent).forEach(details => details.addEventListener('toggle', () => {
    if (details.open) $$('.gauge-subsection', els.editorContent).forEach(other => { if (other !== details) other.removeAttribute('open'); });
    requestAnimationFrame(() => { if (details.open) details.scrollIntoView({ block: 'nearest' }); });
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
  const output = input.parentElement.querySelector('output'); if (output) output.textContent = `${value}${output.dataset.suffix || ''}`;
  const node = $(`.marker[data-entity-id="${CSS.escape(marker.entityId)}"]`);
  if (input.dataset.path === 'displayName') { els.editorTitle.textContent = value; if (node) node.innerHTML = markerHtml(marker); }
  if (input.dataset.path === 'unitOverride' || input.dataset.path === 'decimals' || input.dataset.path === 'stateOnLabel' || input.dataset.path === 'stateOffLabel' || input.dataset.path.startsWith('icon') || input.dataset.path.startsWith('style.show') || marker.type === 'gauge' && input.dataset.path.startsWith('style.')) { if (node) node.innerHTML = markerHtml(marker); }
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
  const unusedHtml = unused.length ? `<details class="unused-integrations" ${unusedIntegrationsOpen ? 'open' : ''}><summary><span>Pozostałe integracje</span><b>${unused.length}</b></summary><div class="unused-integrations-body">${unused.map(integrationMarkup).join('')}</div></details>` : '';
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
  entityEvents?.close();
  entityEvents = new EventSource('api/entity_events');
  entityEvents.onopen = () => { if (els.connection) { els.connection.textContent = 'Na żywo'; els.connection.className = 'connection live'; } };
  entityEvents.onmessage = event => { try { const data = JSON.parse(event.data), marker = model.entities[data.entity_id]; if (!marker) return; stateCache[data.entity_id] = { ...stateCache[data.entity_id], entity_id: data.entity_id, state: data.state, attributes: data.attributes || {}, last_changed: data.last_changed || new Date().toISOString() }; const node = $(`.marker[data-entity-id="${CSS.escape(data.entity_id)}"]`); if (node) { node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker); } if (moreInfoEntityId === data.entity_id) refreshMoreInfoState(); } catch {} };
  entityEvents.onerror = () => { if (els.connection) { els.connection.textContent = 'Ponowne łączenie…'; els.connection.className = 'connection error'; } };
  entityEvents.addEventListener('open', refreshStates);
}
function resumeLiveConnection() {
  if (document.hidden) return;
  clearTimeout(resumeTimer); resumeTimer = setTimeout(() => {
    refreshStates();
    if (!entityEvents || entityEvents.readyState === EventSource.CLOSED) connectEvents();
  }, 120);
}
async function loadBackgrounds(waitForImage = false, bustCache = false) {
  try {
    const data = await api('backgrounds'), items = data.items || [], names = new Set(items.map(item => item.name)), view = activeSceneView();
    if (view.background === undefined || view.background === null) { view.background = data.current || ''; scheduleSave(); }
    if (view.background && !names.has(view.background)) view.background = '';
    currentBackground = view.background || '';
    // Each view loads its own named file; no global background selection is needed.
    els.bgSelect.innerHTML = '<option value="">Bez tła</option>' + items.map(x => `<option value="${escapeHtml(x.name)}" ${x.name === currentBackground ? 'selected' : ''}>${escapeHtml(x.name)}</option>`).join('');
    els.bgSelect.value = currentBackground; els.bgSelect.disabled = false; els.bgDelete.disabled = !currentBackground;
    els.empty.classList.toggle('visible', !currentBackground); els.image.hidden = !currentBackground; syncBackgroundTransformControls();
    if (currentBackground) {
      applyBackgroundTransform();
      const cacheKey = bustCache ? `&v=${Date.now()}` : '', src = `api/background/file?name=${encodeURIComponent(currentBackground)}${cacheKey}`;
      const ready = els.image.dataset.backgroundName === currentBackground && els.image.complete && els.image.naturalWidth > 0 && !bustCache;
      if (!ready) {
        const loaded = new Promise(resolve => {
          const done = () => { els.image.removeEventListener('load', done); els.image.removeEventListener('error', done); resolve(); };
          els.image.addEventListener('load', done, { once:true }); els.image.addEventListener('error', done, { once:true });
        });
        els.image.dataset.backgroundName = currentBackground; els.image.src = src;
        if (waitForImage) await loaded;
      }
    } else { els.image.removeAttribute('src'); delete els.image.dataset.backgroundName; applyBackgroundTransform(); updateSceneGeometry(); }
  } catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; }
}
async function uploadBackground(file) {
  if (!file) return; els.bgStatus.textContent = 'Wgrywanie…'; const form = new FormData(); form.append('file', file);
  try { const result = await api('background/upload', { method: 'POST', body: form }); activeSceneView().background = result.name || null; els.bgStatus.textContent = 'Wgrano'; await loadBackgrounds(true, true); scheduleSave(true); }
  catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; } finally { els.bgFile.value = ''; }
}

function viewportPointerDown(event) {
  // Desktop uses a dedicated mouse drag below. Pointer gestures are touch-only there.
  if (!sceneCameraActive() || (!mobileView() && event.pointerType === 'mouse') || (event.pointerType === 'mouse' && event.button !== 0)) return;
  // A mouse can leave the transformed canvas before pointerup; never keep a stale pointer as a fake second touch.
  if (event.pointerType === 'mouse') { viewPointers.clear(); panGesture = null; pinchGesture = null; }
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
  if (viewPointers.size === 2) {
    const [a,b] = [...viewPointers.values()], r = els.viewport.getBoundingClientRect();
    pinchGesture = { distance:Math.hypot(a.x-b.x,a.y-b.y), zoom:viewZoom, panX:viewPanX, panY:viewPanY, x:(a.x+b.x)/2-r.left, y:(a.y+b.y)/2-r.top };
    panGesture = null; event.preventDefault();
  } else {
    const marker = event.target.closest('.marker');
    const canPan = viewZoom > minViewZoom() + .001 || mobileWidePanorama();
    // In viewing mode a drag beginning on a marker is still a panorama; only a short tap opens More Info.
    if (canPan && (!editMode || !marker)) {
      panGesture = { id:event.pointerId, x:event.clientX, y:event.clientY, panX:viewPanX, panY:viewPanY, marker, moved:false };
      els.scene.setPointerCapture?.(event.pointerId);
    }
  }
}
function viewportPointerMove(event) {
  if (!viewPointers.has(event.pointerId)) return;
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
  if (viewPointers.size === 2 && pinchGesture) {
    const [a,b] = [...viewPointers.values()], distance = Math.hypot(a.x-b.x,a.y-b.y), next = clamp(pinchGesture.zoom * distance / Math.max(1,pinchGesture.distance),minViewZoom(),4), ratio = next / pinchGesture.zoom;
    viewZoom = next; viewPanX = pinchGesture.x - (pinchGesture.x-pinchGesture.panX)*ratio; viewPanY = pinchGesture.y - (pinchGesture.y-pinchGesture.panY)*ratio; applyViewTransform(); event.preventDefault();
  } else if (panGesture?.id === event.pointerId) {
    const dx = event.clientX - panGesture.x, dy = event.clientY - panGesture.y;
    if (Math.hypot(dx, dy) > 6) { panGesture.moved = true; if (panGesture.marker) panGesture.marker.dataset.dragged = '1'; }
    viewPanX = panGesture.panX + dx; viewPanY = panGesture.panY + dy; applyViewTransform();
    if (panGesture.moved) event.preventDefault();
  }
}
function viewportPointerUp(event) {
  viewPointers.delete(event.pointerId);
  if (panGesture?.id === event.pointerId) panGesture = null;
  if (viewPointers.size < 2) pinchGesture = null;
}
function startDesktopPan(event) {
  if (mobileView() || event.button !== 0 || viewZoom <= 1.001) return;
  const marker = event.target.closest('.marker');
  if (editMode && marker) return;
  const start = { x:event.clientX, y:event.clientY, panX:viewPanX, panY:viewPanY, marker, moved:false };
  desktopPanGesture = start;
  const move = e => {
    if (!desktopPanGesture) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) > 4) {
      start.moved = true;
      if (start.marker) start.marker.dataset.dragged = '1';
      els.sceneCard?.classList.add('scene-panning');
      e.preventDefault();
    }
    if (!start.moved) return;
    viewPanX = start.panX + dx; viewPanY = start.panY + dy; applyViewTransform();
  };
  const up = () => {
    window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
    els.sceneCard?.classList.remove('scene-panning'); desktopPanGesture = null;
  };
  window.addEventListener('mousemove', move); window.addEventListener('mouseup', up, { once:true });
}

function bindEvents() {
  document.addEventListener('error', integrationIconError, true);
  els.language?.addEventListener('change', () => {
    uiLanguage = els.language.value === 'pl' ? 'pl' : 'en';
    model.settings ||= {}; model.settings.language = uiLanguage;
    applyLanguage(); scheduleSave(true);
  });
  els.sceneTabs?.addEventListener('click', event => { const tab=event.target.closest('[data-scene-view]'); if(!tab)return; showMainView('overview'); switchSceneView(tab.dataset.sceneView); });
  els.integrationsButton?.addEventListener('click', () => { closeEditor(); closeMoreInfo(); openIntegrations.clear(); unusedIntegrationsOpen = false; els.viewSwitcher?.classList.remove('open'); els.viewManage?.classList.remove('active'); showMainView('integrations'); });
  els.viewManage?.addEventListener('click', () => { const open = !els.viewSwitcher.classList.contains('open'); els.viewSwitcher.classList.toggle('open', open); els.viewManage.classList.toggle('active', open); els.backgroundBar.classList.remove('open'); els.bgManage.classList.remove('active'); });
  els.viewAdd?.addEventListener('click', addSceneView); els.viewRename?.addEventListener('click', renameSceneView);
  els.viewDuplicate?.addEventListener('click', duplicateSceneView); els.viewDelete?.addEventListener('click', deleteSceneView);
  els.confirmInput?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); closeAppConfirm(true); } });
  els.editToggle.addEventListener('click', () => { closeMoreInfo(); editMode = !editMode; els.body.classList.toggle('editing', editMode); els.editToggle.innerHTML = editMode ? '&#10003;' : '&#9998;'; els.editToggle.title = translateValue(editMode ? 'Zakończ edycję' : 'Edytuj widok'); els.editToggle.setAttribute('aria-label', els.editToggle.title); if (!editMode) { closeEditor(); els.backgroundBar.classList.remove('open'); els.bgManage.classList.remove('active'); els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); els.viewSwitcher?.classList.remove('open'); els.viewManage?.classList.remove('active'); } requestAnimationFrame(() => { applyBackgroundTransform(); updateSceneGeometry(); resetViewZoom(); }); });
  els.snapToggle.addEventListener('click', () => { model.settings.snapEnabled = !model.settings.snapEnabled; applySnapUi(); scheduleSave(true); notify(model.settings.snapEnabled ? 'Przyciąganie do siatki włączone' : 'Przyciąganie do siatki wyłączone'); });
  els.bgManage.addEventListener('click', () => { els.backgroundBar.classList.toggle('open'); els.bgManage.classList.toggle('active', els.backgroundBar.classList.contains('open')); els.viewSwitcher?.classList.remove('open'); els.viewManage?.classList.remove('active'); if (!els.backgroundBar.classList.contains('open')) { els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); } });
  els.bgTransformToggle?.addEventListener('click', () => { els.bgTransformPanel.classList.toggle('open'); els.bgTransformToggle.classList.toggle('active', els.bgTransformPanel.classList.contains('open')); syncBackgroundTransformControls(); });
  [els.bgScale].forEach(control => { control?.addEventListener('input', updateBackgroundTransform); control?.addEventListener('change', updateBackgroundTransform); });
  els.mobilePanStart?.addEventListener('change', updateMobilePanStart);
  els.bgTransformPanel?.addEventListener('click', event => { const x = event.target.closest('[data-bg-align-x]'); if (!currentBackground || !x) return; const t = currentBackgroundTransform(); t.x = Number(x.dataset.bgAlignX); applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave(true); });
  $('#background-transform-reset')?.addEventListener('click', async () => { if (!currentBackground || !await appConfirm({ title:'Zresetować dopasowanie tła?', message:'Skala, pozycja i tryb dopasowania tego tła wrócą do wartości domyślnych.', confirmText:'Resetuj', danger:true })) return; activeSceneView().backgroundTransforms[currentBackground] = defaultBackgroundTransform(); applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave(true); notify('Przywrócono domyślne dopasowanie tła'); });
  els.scene.addEventListener('click', event => { if (event.target === els.scene || event.target === els.markers || event.target === els.image) { closeEditor(); closeMoreInfo(); } });
  $('#editor-close').addEventListener('click', closeEditor); document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (els.confirmBox.classList.contains('visible')) closeAppConfirm(false); else if (els.moreInfo.classList.contains('visible')) closeMoreInfo(); else closeEditor(); });
  els.confirmCancel.addEventListener('click', () => closeAppConfirm(false)); els.confirmOk.addEventListener('click', () => closeAppConfirm(true));
  els.confirmBox.addEventListener('click', event => { if (event.target === els.confirmBox) closeAppConfirm(false); });
  $('#more-info-close')?.addEventListener('click', closeMoreInfo); els.moreInfoBackdrop?.addEventListener('click', closeMoreInfo);
  $('.history-ranges')?.addEventListener('click', event => { const button=event.target.closest('[data-history-hours]'); if(button) loadMoreInfoHistory(Number(button.dataset.historyHours)); });
  $('.editor-head').addEventListener('pointerdown', startEditorDrag);
  els.editorContent.addEventListener('click', onColorPickerClick);
  $$('[data-editor-tab]').forEach(button => button.addEventListener('click', () => changeType(button.dataset.editorTab)));
  $('#default-style').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Przywrócić styl domyślny?', message: 'Obecne ustawienia wyglądu markera zostaną zastąpione.', confirmText: 'Przywróć', danger: true })) return; m.style = m.type === 'gauge' ? gaugeDefaults() : badgeDefaults(); renderMarkers(); openEditor(); scheduleSave(true); notify('Przywrócono styl domyślny'); });
  $('#copy-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m) return; styleClipboard = { type: m.type, style: clone(m.style) }; $('#paste-style').disabled = false; notify(`Skopiowano styl ${m.type === 'gauge' ? 'Gauge' : 'Badge'}`); });
  $('#paste-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m || !styleClipboard) return; m.type = styleClipboard.type; m.style = clone(styleClipboard.style); m.updatedAt = new Date().toISOString(); renderMarkers(); openEditor(); scheduleSave(true); notify('Wklejono kompletny styl 1:1'); });
  $('#remove-marker').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Usunąć marker?', message: `„${m.displayName}” zniknie z tego widoku razem ze swoimi ustawieniami.`, confirmText: 'Usuń', danger: true })) return; removeEntity(m.entityId); });
  $('#background-upload').addEventListener('click', () => els.bgFile.click()); $('#empty-upload').addEventListener('click', () => els.bgFile.click()); els.bgFile.addEventListener('change', () => uploadBackground(els.bgFile.files[0]));
  els.bgSelect.addEventListener('change', async () => { try { const view = activeSceneView(); view.background = els.bgSelect.value; await loadBackgrounds(); scheduleSave(true); } catch (error) { notify(error.message, true); } });
  els.bgDelete.addEventListener('click', async () => { const name = els.bgSelect.value; if (!name || !await appConfirm({ title: 'Usunąć tło?', message: `Tło „${name}” zostanie trwale usunięte ze wszystkich widoków.`, confirmText: 'Usuń', danger: true })) return; try { await api('background/delete', jsonOptions({ name })); Object.values(model.views).forEach(view => { if (view.background === name) view.background = ''; if (view.backgroundTransforms) delete view.backgroundTransforms[name]; }); currentBackground = ''; scheduleSave(true); await loadBackgrounds(); notify('Usunięto tło'); } catch (error) { notify(error.message, true); } });
  $('#reload-integrations').addEventListener('click', () => { integrations = []; integrationEntities.clear(); openIntegrations.clear(); loadIntegrations(true); });
  els.integrationList.addEventListener('click', event => {
    const unusedSummary = event.target.closest('.unused-integrations > summary'), add = event.target.closest('[data-add]'), summary = event.target.closest('.integration-summary');
    if (unusedSummary) { event.preventDefault(); unusedIntegrationsOpen = !unusedIntegrationsOpen; renderIntegrations(); }
    else if (add) addEntity(add.dataset.add, add.dataset.entry);
    else if (summary) toggleIntegration(summary.closest('.integration').dataset.integration);
  });
  els.addedList.addEventListener('click', event => { const remove = event.target.closest('[data-remove]'), focus = event.target.closest('[data-focus]'); if (remove) removeEntity(remove.dataset.remove); else if (focus) { showMainView('overview'); if (!editMode) els.editToggle.click(); selectMarker(focus.dataset.focus); } });
  $$('.selection i').forEach(handle => handle.addEventListener('pointerdown', startResize));
  els.image.addEventListener('load', () => { updateSceneGeometry(); applyBackgroundTransform(); });
  window.addEventListener('resize', () => { applyBackgroundTransform(); syncMobileOrientation(); });
  window.visualViewport?.addEventListener('resize', () => { if (mobileView()) applyBackgroundTransform(); });
  if ('ResizeObserver' in window) new ResizeObserver(updateSceneGeometry).observe(els.scene);
  els.zoomOut?.addEventListener('click', () => setViewZoom(viewZoom-.5)); els.zoomIn?.addEventListener('click', () => setViewZoom(viewZoom+.5)); els.zoomReset?.addEventListener('click', resetViewZoom);
  els.viewport?.addEventListener('dblclick', event => { if (sceneCameraActive()) setViewZoom(viewZoom > 1 ? 1 : 2, event.clientX, event.clientY); });
  els.viewport?.addEventListener('wheel', event => {
    if (mobileView()) return;
    event.preventDefault();
    setViewZoom(viewZoom * Math.exp(-event.deltaY * .0015), event.clientX, event.clientY);
  }, { passive: false });
  // Touch gestures and desktop mouse dragging are deliberately separate.
  els.scene?.addEventListener('mousedown', startDesktopPan);
  els.scene?.addEventListener('pointerdown', viewportPointerDown); els.scene?.addEventListener('pointermove', viewportPointerMove);
  els.scene?.addEventListener('pointerup', viewportPointerUp); els.scene?.addEventListener('pointercancel', viewportPointerUp);
  window.addEventListener('pointermove', viewportPointerMove); window.addEventListener('pointerup', viewportPointerUp); window.addEventListener('pointercancel', viewportPointerUp);
  document.addEventListener('visibilitychange', resumeLiveConnection);
  window.addEventListener('pageshow', resumeLiveConnection); window.addEventListener('focus', resumeLiveConnection);
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
  bindEvents(); let legacyMigrated = false;
  try { const saved = await api('rewrite_state'); if (saved.exists && (saved.data?.entities || saved.data?.views)) model = saved.data; else legacyMigrated = await migrateLegacy(); }
  catch (error) { notify(`Nie udało się wczytać układu: ${error.message}`, true); }
  model.settings = { snapEnabled: true, snapStep: 1, designWidth: DESIGN_WIDTH, language: 'en', ...(model.settings || {}) };
  uiLanguage = model.settings.language === 'pl' ? 'pl' : 'en';
  bindLanguageObserver(); applyLanguage();
  const multiMigrated = ensureMultiViewModel(); applySnapUi(); renderViewSelector();
  Object.values(model.views).flatMap(view => Object.values(view.entities || {})).forEach(m => {
    m.type = m.type === 'gauge' ? 'gauge' : 'badge'; m.style = normalizedStyle(m.type, m.style);
    m.stateOnLabel ??= ''; m.stateOffLabel ??= ''; m.iconMode ||= 'auto'; m.iconName ??= ''; m.iconOn ??= ''; m.iconOff ??= '';
  });
  const gaugeMigrated = migrateGaugeZeroOffsets();
  if (legacyMigrated || multiMigrated || gaugeMigrated) scheduleSave(true);
  updateSceneGeometry(); els.markers.classList.add('background-pending'); await loadBackgrounds(true); resetViewZoom(); mobileOrientation = mobileView() ? (innerHeight > innerWidth ? 'portrait' : 'landscape') : 'desktop'; await refreshStates(); els.markers.classList.remove('background-pending'); updateSceneGeometry(); connectEvents();
}

boot();

[executed on device: C-PF5FZ66N (cc3bcbfb-8939-4cbf-862b-09938aa4fa40)]