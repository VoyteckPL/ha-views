# HA Views — Documentation

## Installation

1. Add `https://github.com/VoyteckPL/ha-views` to **Settings → Add-ons → Add-on store → ⋮ → Repositories**.
2. Find **HA Views** in the add-on store and install it.
3. Start the add-on and open its web interface.
4. Select the pencil icon to enter edit mode.
5. Open background management and upload a PNG, JPG or WebP image.
6. Open **Integrations**, expand an integration and add the entities you need.
7. Return to a scene tab and arrange the markers.

## Backgrounds and layout

Each view has its own background and marker layout. Background files and saved configuration are stored locally in Home Assistant under `/config/basen_pv` for backward compatibility.

The layout is shared across devices. Wide backgrounds become a horizontally pannable panorama on portrait phones. Portrait backgrounds fit automatically and can be enlarged with pinch zoom. On desktop, use the mouse wheel over the scene to zoom and drag the enlarged scene to pan.

## Editing markers

Click a marker in edit mode. You can switch between **Badge** and **Gauge**, change names, units, rounding, icons, dimensions, colours, background, border and text placement.

Gauge markers also support ranges, thickness, geometry, start/end angles, gradients, ticks and scale labels.

**Copy style** saves the complete visual style and marker type. **Paste style** restores it one-to-one. **Restore defaults** and removal require confirmation.

## Viewing

Outside edit mode, click a marker to open the native Home Assistant More Info dialog, including history and entity controls.

## Backup and feedback

This is beta software. Create a Home Assistant backup before updating. Please report reproducible issues with a short description, Home Assistant version and a screenshot.

---

# HA Views — Dokumentacja

## Instalacja

1. Dodaj `https://github.com/VoyteckPL/ha-views` w **Ustawienia → Dodatki → Sklep z dodatkami → ⋮ → Repozytoria**.
2. Znajdź **HA Views** w sklepie z dodatkami i zainstaluj.
3. Uruchom dodatek i otwórz jego interfejs WWW.
4. Kliknij ikonę ołówka, aby włączyć edycję.
5. Otwórz zarządzanie tłem i wgraj PNG, JPG lub WebP.
6. Przejdź do **Integracje**, rozwiń integrację i dodaj potrzebne encje.
7. Wróć do zakładki widoku i rozmieść markery.

## Tła i układ

Każdy widok ma własne tło oraz układ markerów. Pliki teł i konfiguracja są zapisywane lokalnie w Home Assistant w `/config/basen_pv` — nazwa katalogu została zachowana dla zgodności.

Układ jest wspólny dla wszystkich urządzeń. Szerokie tła na telefonie w pionie działają jako panorama przesuwana w poziomie. Pionowe tła dopasowują się automatycznie i można je przybliżać gestem dwoma palcami. Na komputerze użyj rolki myszy nad sceną do zoomu, a następnie przeciągnij powiększoną scenę.

## Edycja markerów

Kliknij marker w trybie edycji. Możesz zmieniać typ **Badge** / **Gauge**, nazwę, jednostkę, zaokrąglenie, ikonę, wymiary, kolory, tło, ramkę i pozycje tekstu.

Gauge obsługuje również zakresy, grubość, geometrię, kąty początku/końca, gradienty, podziałki i liczby skali.

**Kopiuj styl** zapisuje kompletny styl oraz typ markera. **Wklej styl** odtwarza go 1:1. Przywrócenie domyślnych ustawień i usunięcie wymagają potwierdzenia.

## Oglądanie

Poza trybem edycji kliknij marker, aby otworzyć natywne okno Home Assistant More Info — z historią i sterowaniem encją.

## Backup i feedback

To oprogramowanie beta. Przed aktualizacją wykonaj backup Home Assistanta. Zgłaszając błąd, podaj krótki opis, wersję Home Assistant i screen.

[executed on device: C-PF5FZ66N (cc3bcbfb-8939-4cbf-862b-09938aa4fa40)]