# Changelog

## 0.3.1

### English

- Added a background download action in HA Views.
- New mobile views start with a portrait 9:16 canvas; the first-view colour picker now matches the marker editor palette.
- Improved touch recovery after an interrupted gesture or WebView resume, without resetting the zoom.
- Integration search now loads all integrations, updates results while loading and excludes entities already on the active view.

### Polski

- Dodano pobieranie tła bezpośrednio z HA Views.
- Nowy widok na telefonie startuje w formacie 9:16; wybór koloru w kreatorze jest taki sam jak w edytorze markera.
- Poprawiono odzyskiwanie obsługi dotyku po przerwanym geście lub powrocie WebView, bez resetu zoomu.
- Wyszukiwarka Integracji przeszukuje wszystkie integracje, pokazuje wyniki podczas ładowania i pomija encje już dodane do aktywnego widoku.

## 0.3.0 — Stable release

### English

- Stable release of HA Views with responsive desktop and mobile dashboards.
- Improved mobile editor: full-height scene creation, compact S/M/L grid selection and stable marker placement between Edit and View.
- Per-marker content scaling for Badge and Gauge, with a centred Gauge indicator.
- Optional “Tap in View: Toggle ON/OFF” action for supported switch, light, fan and input_boolean entities; More Info remains the default.
- Compact integration entity search by entity ID or entity name.
- Safer updates: frontend files refresh after an add-on update, while view backgrounds stay cached in full resolution for fast switching.

### Polski

- Stabilne wydanie HA Views z responsywnymi pulpitami na komputerze i telefonie.
- Ulepszony edytor mobilny: pełnoekranowe tworzenie widoku, wybór siatki S/M/L i stałe położenie markerów między trybami Edycja i Widok.
- Skalowanie zawartości pojedynczego Badge lub Gauge oraz wyśrodkowany wskaźnik Gauge.
- Opcjonalne działanie „Tap in View: Toggle ON/OFF” dla encji switch, light, fan i input_boolean; domyślnie nadal otwiera się More Info.
- Kompaktowe wyszukiwanie encji w Integracjach po nazwie lub entity_id.
- Bezpieczniejsze aktualizacje: pliki aplikacji odświeżają się po aktualizacji dodatku, a tła widoków pozostają w cache w pełnej rozdzielczości dla szybkiego przełączania.

## 0.3.0-beta.26 — English interface

### English

- Added an English / Polski selector in the top toolbar.
- English is the default for new installations; the selection is saved with the dashboard.

### Polski

- Dodano przełącznik English / Polski w górnym pasku.
- Angielski jest domyślny przy nowej instalacji, a wybór jest zapisywany z pulpitem.

## 0.3.0-beta.25 — Public test release

### English

- multi-view visual dashboards with persistent backgrounds and marker layouts;
- configurable Badge and Gauge markers, including icons, gradients, geometry, ticks and scale labels;
- compact editor with style copy/paste, defaults and safe removal confirmations;
- Home Assistant integration browser with brand icons, usage counts and collapsed unused integrations;
- native Home Assistant More Info when clicking a marker outside edit mode;
- responsive desktop, laptop and mobile layouts;
- mouse-wheel zoom and drag pan on desktop; pinch zoom and panorama panning on mobile;
- background uploads stored persistently under Home Assistant configuration;
- bilingual English/Polish documentation and screenshots.

### Polski

- wizualne pulpity z wieloma widokami, trwałymi tłami i układem markerów;
- konfigurowalne markery Badge i Gauge, w tym ikony, gradienty, geometria, podziałki i liczby skali;
- kompaktowy edytor z kopiowaniem/wklejaniem stylu, domyślnymi ustawieniami i bezpiecznym usuwaniem;
- przeglądarka integracji Home Assistant z ikonami marek, liczbą użytych encji i zwiniętymi pozostałymi integracjami;
- natywne Home Assistant More Info po kliknięciu markera poza edycją;
- responsywny widok na komputerze, laptopie i telefonie;
- zoom rolką i przesuwanie na komputerze; pinch zoom i panorama na telefonie;
- trwały zapis wgranych teł w konfiguracji Home Assistant;
- dokumentacja angielska i polska oraz screeny.

## 0.3.0-beta.1

- first public beta;
- responsive Badge and Gauge editor;
- persistent backgrounds and layouts;
- live entity updates;
- integrations browser.

[executed on device: C-PF5FZ66N (cc3bcbfb-8939-4cbf-862b-09938aa4fa40)]