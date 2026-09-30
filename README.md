# HA Views

![HA Views](ha_views/logo.png)

Create polished, interactive visual dashboards for Home Assistant on any image or solid-colour background. One saved layout stays responsive across desktop, laptop and mobile.

![HA Views at night: glowing rooms, live values, an animated Flow and a night floor plan](docs/screenshots/night-view.png)

## What's new in 0.5.0

- **Rooms**: draw any room shape on your plan. It glows while its lights are on, can have its own colour when off, and a tap toggles the whole room.
- **Flow**: animated arrows for energy, water or anything else. Five shapes, sharpness, overlapping spacing, direction by sign, activity threshold, glow, and constant-speed Pulse / Flow animations.
- **Night background**: a second image per view that crossfades in at sunset (`sun.sun`), by any entity, or always. Separate brightness for day and night.
- **A new editor**:
  - a Snap & grid menu with alignment guides for markers, Flows and rooms;
  - background bounds, align to background and rotation;
  - value-based colours;
  - text offsets;
  - ON/OFF previews;
  - colour-coded selection.
- **Views**: a new view menu, drag-to-reorder tabs, swipe between views on phones (Slide or 3D Cube), and a colour canvas with any size.
- **Background files manager**: thumbnails, where each file is used, rename, set as day/night, remove unused. Original file names are kept.
- **Viewer mode** for non-admin users, default Home Assistant panel option, safer multi-device sync, and a fix for large installations (`MESSAGE_TOO_BIG`).

The complete list is in the [Changelog](ha_views/CHANGELOG.md).

![Editing a room: amber handles, ON/OFF colours, intensity and edge softness](docs/screenshots/room-editor.png)

## Highlights

- **Independent dashboards** — create, duplicate, rename, reorder and delete views; choose the view that opens by default.
- **Complete background workflow** — use a solid colour or upload PNG, JPG and WebP images; select, download and delete saved backgrounds.
- **Rooms and Flow** — glowing room outlines driven by lights, and animated arrows driven by entity values.
- **Day and night backgrounds** — automatic crossfade by `sun.sun` or any entity, with separate brightness.
- **Four marker types** — Badge, Gauge, Icon and Horseshoe — each independently positioned, rotated and styled, with optional value-based colours.
- **Rich Badge and Icon styling** — labels, values and custom ON/OFF text; Home Assistant icons, custom MDI icons or integration logos; separate fill, outline, colour and opacity settings, including ON/OFF variants.
- **Background and border effects** — solid colour or central, corner, wall and ambient light gradients with position, spread and fill controls; adjustable borders, thickness, opacity and shapes.
- **Advanced Gauge and Horseshoe** — configurable range, track and value colours, gradient, arc geometry, scale, ticks, tick labels, value, name and percentage.
- **Fast visual editing** — drag markers, Flows and rooms with alignment guides, resize with corner handles, lock geometry, keep elements inside the background, align and rotate, use S/M/L grid presets and scale marker content independently.
- **Safe styling workflow** — reset individual sliders, restore defaults, copy/paste complete styles, and test an ON/OFF state without controlling the entity.
- **Home Assistant actions** — open native More Info or toggle supported entities directly from a marker in view mode.
- **Integration browser** — shows visible Home Assistant integrations only, with brand icons, used-marker counts and search by entity name or `entity_id`.
- **Responsive controls** — desktop mouse-wheel zoom plus mobile pinch, pan, swipe between views (Slide / Cube) and editing that preserves exact marker positions.
- **Viewer mode** — Home Assistant users without admin rights can view dashboards, read-only.
- **Built for Home Assistant** — layouts and styling are saved in Home Assistant; HA Views does not publish your entities, integrations or backgrounds.

![Integrations](docs/screenshots/integrations.png)

![Marker editor](docs/screenshots/editor.png)

## Status

Stable release. As with every Home Assistant add-on update, make a backup before updating.

See [Documentation](ha_views/DOCS.md) and [Changelog](ha_views/CHANGELOG.md).

---

# Polski

Twórz dopracowane, interaktywne wizualne pulpity Home Assistanta na dowolnym obrazie lub jednolitym kolorze tła. Jeden zapisany układ działa responsywnie na komputerze, laptopie i telefonie.

## Co nowego w 0.5.0

- **Pomieszczenia**: dowolny kształt pokoju na planie. Świeci, gdy palą się jego światła, może mieć własny kolor po wyłączeniu, a dotknięcie przełącza cały pokój.
- **Flow**: animowane strzałki dla energii, wody czy czegokolwiek. Pięć kształtów, ostrość, nachodzące strzałki, kierunek wg znaku, próg aktywności, poświata oraz animacje Pulsowanie / Przepływ o stałej prędkości.
- **Tło nocne**: drugi obraz dla widoku, który płynnie wchodzi po zachodzie słońca (`sun.sun`), według dowolnej encji albo na stałe. Osobna jasność dla dnia i nocy.
- **Nowy edytor**:
  - menu Przyciąganie i siatka z liniami pomocniczymi dla markerów, Flow i pomieszczeń;
  - granice tła, wyrównanie do tła i obrót;
  - kolory wg wartości;
  - przesuwanie tekstów;
  - podgląd ON/OFF;
  - kolory zaznaczenia wg rodzaju.
- **Widoki**: nowe menu widoku, zmiana kolejności zakładek przeciąganiem, przełączanie palcem na telefonie (Przesunięcie albo Kostka 3D) i kolorowe płótno w dowolnym rozmiarze.
- **Manager plików tła**: miniatury, miejsce użycia, zmiana nazwy, ustawienie jako dzień/noc, usuwanie nieużywanych. Wgrane pliki zachowują oryginalne nazwy.
- **Tryb podglądu** dla użytkowników bez uprawnień administratora, opcja domyślnego panelu Home Assistant, bezpieczniejsza synchronizacja między urządzeniami i poprawka dla dużych instalacji (`MESSAGE_TOO_BIG`).

Pełna lista zmian jest w [changelogu](ha_views/CHANGELOG.md).

## Najważniejsze funkcje

- **Niezależne pulpity** — twórz, duplikuj, zmieniaj nazwę, kolejność i usuwaj widoki; wybierz widok uruchamiany domyślnie.
- **Pełna obsługa tła** — jednolity kolor albo pliki PNG, JPG i WebP; wybór, pobieranie i usuwanie zapisanych teł.
- **Pomieszczenia i Flow** — świecące obrysy pokoi sterowane światłami oraz animowane strzałki sterowane wartościami encji.
- **Tło dzienne i nocne** — automatyczne przenikanie wg `sun.sun` lub dowolnej encji, z osobną jasnością.
- **Cztery typy markerów** — Badge, Gauge, Ikona i Podkowa — każdy niezależnie pozycjonowany, obracany i stylowany, z opcjonalnymi kolorami wg wartości.
- **Rozbudowany Badge i Ikona** — nazwa, stan oraz własne teksty ON/OFF; ikony Home Assistant, własne MDI lub logo integracji; osobne wypełnienie, obrys, kolor i przezroczystość, także dla ON/OFF.
- **Efekty tła i ramki** — jednolity kolor albo gradienty: centralny, róg, od ściany i ambient, z pozycją, rozproszeniem i wypełnieniem; regulowane ramki, grubość, przezroczystość i kształty.
- **Zaawansowane Gauge i Podkowa** — zakres, kolory toru i wartości, gradient, geometria łuku, skala, podziałki, liczby skali, stan, nazwa i procent.
- **Szybka edycja wizualna** — przeciąganie markerów, Flow i pomieszczeń z liniami pomocniczymi, zmiana rozmiaru uchwytami rogów, blokada geometrii, granice tła, wyrównanie i obrót, siatka S/M/L i niezależna skala zawartości markerów.
- **Bezpieczny styl** — reset pojedynczych suwaków, przywracanie domyślnych, kopiowanie/wklejanie pełnego stylu oraz test stanu ON/OFF bez sterowania encją.
- **Akcje Home Assistant** — natywne More Info albo bezpośrednie przełączanie obsługiwanych encji po kliknięciu markera w widoku.
- **Przeglądarka integracji** — tylko widoczne integracje Home Assistant, ikony marek, liczba użytych markerów i wyszukiwanie po nazwie lub `entity_id`.
- **Responsywne sterowanie** — zoom rolką na komputerze oraz pinch, pan, przełączanie widoków palcem (Przesunięcie / Kostka) i edycja na telefonie z zachowaniem dokładnych pozycji markerów.
- **Tryb podglądu** — użytkownicy Home Assistant bez uprawnień administratora mogą oglądać pulpity, bez możliwości edycji.
- **Dane pozostają u Ciebie** — układy i style są zapisywane w Home Assistant; HA Views nie publikuje Twoich encji, integracji ani teł.

## Status

Wersja stabilna. Jak przy każdej aktualizacji dodatku Home Assistant, przed aktualizacją wykonaj backup.

Pełna [dokumentacja](ha_views/DOCS.md) i [changelog](ha_views/CHANGELOG.md).
