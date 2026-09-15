# HA Views — User Manual

## Language

HA Views includes an **English / Polski** language selector in the top toolbar. English is the default for new installations; the selected language is saved with the dashboard. Entity names, states, units and Home Assistant's native **More Info** dialog still come directly from the user's own Home Assistant installation.

## Installation

1. In Home Assistant, open **Settings → Add-ons → Add-on store**.
2. Open the top-right **⋮** menu and select **Repositories**.
3. Add `https://github.com/VoyteckPL/ha-views`.
4. Find **HA Views**, install it, then start the add-on.
5. Open its web interface.

## First dashboard

1. At the top, click the pencil icon to enter **edit mode**.
2. Open background management (image icon) and upload a PNG, JPG or WebP.
3. Open the integrations button, then expand an integration.
4. Select an entity to add it to the active view. It is added as a **Badge** in the centre of the scene.
5. Return to the scene tab. Drag the marker to its position. Use the grid icon for precise alignment.
6. Click the marker to open its editor and customise it.

Each scene tab is an independent view: it has its own background, markers and saved layout. Use the view menu to add, rename or remove views.

## Marker types

- **Badge** — compact name, state and optional icon; ideal for temperatures, switches and short statuses.
- **Gauge** — visual meter; ideal for power, energy, percentage or numeric readings.

Inside the marker editor, select **Badge** or **Gauge** at the top. Switching type keeps shared style settings where possible.

## Editing a marker

In edit mode, click a marker. Only one editor section is expanded at a time.

- **Entity**: name, unit, rounding, display text for on/off states.
- **Size**: width and height.
- **State** and **Name**: visibility, position, font size and colour.
- **Icon**: entity icon or a custom MDI icon, on/off colours and vertical placement.
- **Gauge**: range, value geometry, start/end angle, thickness, ticks, scale labels and gradient.
- **Background** and **Border**: colours, opacity, rounding and border thickness.

The action icons in the editor header are: restore defaults, copy style, paste style, delete marker and close. Deleting or restoring defaults requires confirmation.

## Moving, resizing and zooming

- Drag a marker only in edit mode.
- Drag the bottom-right resize handle to resize it.
- On desktop, use the mouse wheel over the scene to zoom. Drag an enlarged scene to pan.
- On mobile, use two fingers to pinch-zoom. Wide images become a horizontal panorama in portrait mode; swipe sideways to see the rest.
- In viewing mode, tap/click a marker to open Home Assistant **More Info**. Dragging the background does not open it.

## Backgrounds

Every view has its own background. HA Views automatically fits portrait and landscape backgrounds for desktop and mobile. You do not need to create separate desktop/mobile layouts.

For the best result, use a sharp image with empty space around equipment or rooms where markers will appear. You can replace or delete a background at any time; the marker layout remains saved for that view.

## Integrations and entities

The integrations page shows active Home Assistant integrations. Integrations already used on the current view appear first and show a counter. The remaining integrations are collapsed by default.

The add-on does not contain or publish any entities from the developer's Home Assistant. After installation it reads only the integrations and entities available in the installer's own Home Assistant.

## Backup and beta feedback

HA Views is beta software. Create a Home Assistant backup before updating. When reporting an issue, include:

- Home Assistant version;
- HA Views version;
- short reproduction steps;
- screenshot or screen recording without private data where possible.

---

# HA Views — Instrukcja obsługi

## Język

HA Views ma przełącznik języka **English / Polski** w górnym pasku. Domyślnie przy nowej instalacji wybrany jest angielski, a wybór języka zapisuje się razem z pulpitem. Nazwy encji, stany, jednostki i natywne okno **More Info** nadal pochodzą bezpośrednio z Home Assistanta użytkownika.

## Instalacja

1. W Home Assistant otwórz **Ustawienia → Dodatki → Sklep z dodatkami**.
2. Otwórz menu **⋮** w prawym górnym rogu i wybierz **Repozytoria**.
3. Dodaj `https://github.com/VoyteckPL/ha-views`.
4. Znajdź **HA Views**, zainstaluj go, a następnie uruchom dodatek.
5. Otwórz interfejs WWW dodatku.

## Pierwszy widok

1. U góry kliknij ikonę ołówka, aby wejść w **tryb edycji**.
2. Otwórz zarządzanie tłem (ikona obrazka) i wgraj PNG, JPG albo WebP.
3. Otwórz przycisk integracji, a następnie rozwiń wybraną integrację.
4. Wybierz encję, którą chcesz dodać do aktywnego widoku. Pojawi się jako **Badge** na środku sceny.
5. Wróć do zakładki widoku. Przeciągnij marker w wybrane miejsce. Użyj ikony siatki, aby ustawić go precyzyjnie.
6. Kliknij marker, aby otworzyć edytor i go spersonalizować.

Każda zakładka sceny to osobny widok — ma własne tło, markery i zapisany układ. Z menu widoków możesz dodawać, zmieniać nazwy oraz usuwać widoki.

## Typy markerów

- **Badge** — kompaktowa nazwa, stan i opcjonalna ikona; dobry do temperatur, przełączników i krótkich statusów.
- **Gauge** — wskaźnik wartości; dobry do mocy, energii, procentów i odczytów liczbowych.

W edytorze markera wybierz u góry **Badge** albo **Gauge**. Zmiana typu zachowuje wspólne ustawienia stylu, gdy jest to możliwe.

## Edycja markera

W trybie edycji kliknij marker. Jednocześnie rozwinięta jest tylko jedna sekcja edytora.

- **Encja**: nazwa, jednostka, zaokrąglenie, tekst dla stanu włączony/wyłączony.
- **Rozmiar**: szerokość i wysokość.
- **Stan** i **Nazwa**: widoczność, pozycja, rozmiar czcionki i kolor.
- **Ikona**: ikona encji lub własna ikona MDI, kolory dla on/off i pozycja w pionie.
- **Gauge**: zakres, geometria wskaźnika, kąty początku/końca, grubość, podziałki, liczby skali i gradient.
- **Tło** i **Ramka**: kolory, przezroczystość, zaokrąglenie i grubość obramowania.

Ikony akcji w nagłówku edytora to: przywrócenie domyślnych, kopiowanie stylu, wklejenie stylu, usunięcie markera i zamknięcie. Usunięcie oraz przywrócenie domyślnych ustawień wymagają potwierdzenia.

## Przesuwanie, skalowanie i zoom

- Marker przeciągasz tylko w trybie edycji.
- Przeciągnij uchwyt w prawym dolnym rogu, aby zmienić jego rozmiar.
- Na komputerze użyj rolki myszy nad sceną, aby przybliżyć lub oddalić widok. Powiększoną scenę przeciągnij, aby ją przesunąć.
- Na telefonie użyj dwóch palców do zoomu. Szerokie obrazy w pionie działają jako panorama — przesuwaj je w bok.
- W trybie oglądania kliknięcie markera otwiera Home Assistant **More Info**. Przeciąganie tła nie otwiera okna.

## Tła

Każdy widok ma własne tło. HA Views automatycznie dopasowuje tła pionowe i poziome do komputera oraz telefonu — nie musisz tworzyć osobnych układów na desktop i mobile.

Najlepiej użyć ostrego obrazu z wolną przestrzenią obok urządzeń lub pomieszczeń, gdzie będą widoczne markery. Tło można w każdej chwili podmienić albo usunąć; układ markerów danego widoku pozostaje zapisany.

## Integracje i encje

Zakładka integracji pokazuje aktywne integracje Home Assistant. Integracje używane w bieżącym widoku są na górze i mają licznik. Pozostałe integracje są domyślnie zwinięte.

Dodatek nie zawiera ani nie publikuje encji z Home Assistanta autora. Po instalacji odczytuje wyłącznie integracje i encje dostępne w Home Assistant osoby, która go instaluje.

## Backup i feedback beta

HA Views jest oprogramowaniem beta. Przed aktualizacją wykonaj backup Home Assistanta. Zgłaszając błąd, dołącz:

- wersję Home Assistanta;
- wersję HA Views;
- krótkie kroki do odtworzenia problemu;
- screen lub nagranie ekranu — bez prywatnych danych, jeśli to możliwe.
