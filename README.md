# HA Views

![HA Views](ha_views/logo.png)

> **Beta `0.3.0-beta.2`** — wizualny edytor widoków dla Home Assistanta / visual view editor for Home Assistant.

HA Views pozwala umieszczać encje Home Assistanta na dowolnym obrazie tła. Markery mogą działać jako kompaktowe **Badge** lub **Gauge**, są aktualizowane na żywo i zachowują ten sam układ na komputerze oraz telefonie.


## Najważniejsze funkcje

- dowolne tła PNG, JPG i WebP z trwałym zapisem;
- markery Badge i Gauge;
- przeciąganie, skalowanie, siatka i snap-to-grid;
- kolory, ramki, przezroczystość, zaokrąglenie i pozycjonowanie tekstu;
- ikony automatyczne z encji lub dowolne ikony MDI;
- kopiowanie i wklejanie pełnego stylu 1:1;
- aktualizacja stanów przez SSE bez przeładowania strony;
- responsywne skalowanie oraz zoom gestem na telefonie;
- lista integracji i encji dostępnych w Home Assistant.


## Wymagania

- Home Assistant OS albo Home Assistant Supervised;
- dostęp do Sklepu dodatków;
- encje skonfigurowane w Home Assistant.

## Instalacja

1. Otwórz **Ustawienia → Dodatki → Sklep dodatków**.
2. Otwórz menu **⋮ → Repozytoria**.
3. Dodaj adres:
   ```
   https://github.com/VoyteckPL/ha-views
   ```
4. Odszukaj **HA Views** i wybierz **Zainstaluj**.
5. Uruchom dodatek i otwórz interfejs.
6. Opcjonalnie włącz automatyczne uruchamianie i widoczność w panelu bocznym.

## Pierwsze uruchomienie

1. Włącz tryb edycji ikoną ołówka.
2. Wgraj obraz tła.
3. Przejdź do zakładki **Integracje**.
4. Rozwiń integrację i dodaj wybrane encje.
5. Wróć do **Widoku ogólnego**, rozmieść markery i dopasuj ich wygląd.

Dane aplikacji są zapisywane w `/config/basen_pv` — nazwa katalogu została zachowana dla zgodności ze starszymi instalacjami HA Views.

## Aktualizacja

Po opublikowaniu nowej wersji Home Assistant pokaże przy dodatku przycisk **Aktualizuj**. Przed aktualizacją wersji beta zalecany jest backup Home Assistanta.

## Status projektu

To wydanie testowe. Mogą występować błędy i zmiany formatu danych. Zgłoszenia proszę dodawać w zakładce **Issues**.

---

# English

HA Views places Home Assistant entities on any background image. Markers can be displayed as compact **Badges** or **Gauges**, update live, and retain proportional positioning across desktop and mobile screens.

## Features

- persistent PNG, JPG and WebP backgrounds;
- Badge and Gauge markers;
- drag, resize, grid and snap-to-grid;
- configurable colors, borders, opacity, radius and text positioning;
- automatic entity icons or any MDI icon;
- complete 1:1 style copy and paste;
- live entity updates over SSE;
- responsive scaling and mobile pinch zoom;
- integration and entity browser.

## Requirements

- Home Assistant OS or Home Assistant Supervised;
- access to the Add-on Store;
- entities configured in Home Assistant.

## Installation

1. Open **Settings → Add-ons → Add-on Store**.
2. Open **⋮ → Repositories**.
3. Add:
   ```
   https://github.com/VoyteckPL/ha-views
   ```
4. Find **HA Views** and select **Install**.
5. Start the add-on and open its web interface.
6. Optionally enable automatic startup and the sidebar shortcut.

## Getting started

1. Enter edit mode using the pencil icon.
2. Upload a background image.
3. Open **Integrations**.
4. Expand an integration and add entities.
5. Return to **Overview**, position the markers and customize their appearance.

Application data is stored in `/config/basen_pv`; this directory name is retained for compatibility with earlier HA Views installations.

## Updating

When a new version is published, Home Assistant will show an **Update** button for the add-on. Create a Home Assistant backup before updating beta releases.

## Beta notice

This is test software. Bugs and data-format changes are possible. Please report problems through GitHub **Issues**.

## License

MIT
