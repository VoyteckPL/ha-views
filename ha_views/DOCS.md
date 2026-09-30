# HA Views — User Manual

## Installation

1. In Home Assistant, open **Settings → Add-ons → Add-on store**.
2. Open the top-right **⋮** menu and select **Repositories**.
3. Add `https://github.com/VoyteckPL/ha-views`.
4. Find **HA Views**, install it and start it.
5. Open it from the Home Assistant sidebar.

The interface language (English / Polski) is chosen in the **Edit menu** (pencil icon). Entity names, states, units and Home Assistant's **More Info** dialog come from your own Home Assistant.

## Toolbar

- **View tabs**: click a tab to switch views. Drag a tab to reorder it (on touch: long-press, then drag). The start view has a home icon.
- **View menu** (icon next to the tabs): a bottom sheet on phones, a dropdown on desktop.
- **Snap & grid** (magnet icon): visible in edit mode.
- **Integrations** (puzzle icon): add entities and see what is on the view.
- **Edit** (pencil icon): turns edit mode on and off and opens the Edit menu (Room, Flow, language).

## First dashboard

1. Open the **view menu → Background** and upload a floor plan or any image (PNG, JPG, WebP). You can also pick a colour.
2. Open **Integrations**, expand an integration or search, and add an entity. It appears as a **Badge** in the centre of the view.
3. Turn on **edit mode** (pencil). Drag the marker into place and click it to open its editor.
4. Add **rooms** and **Flows** from the Edit menu.

Each tab is an independent view with its own background, markers, Flows and rooms.

## View menu

- Main page: **Add view**, **Rename**, **Duplicate**, **Set as start view**, then **Background** and **Options**.
- **Options**: **Swipe between views** (off, Slide, Cube), **Default Home Assistant panel** (HA Views for my account or this device only), **Delete view** (with **Undo**).

### Background

- **Image**: pick a background, then **Upload**, **Download**, **Rename file** or **Background files**. The **brightness** slider (30–200 %) changes only the image.
- **Night background**: a second image of the same size that crossfades over the day image.
  - Mode **Auto** switches with an entity: `sun.sun` by default, where `below_horizon` = night. With another entity, the states `on`, `true`, `night` and `below_horizon` mean night. Examples: an `input_boolean` switched by an automation, or a dusk sensor.
  - **Always day** and **Always night** ignore the entity.
  - The night image has its own brightness.
- **Colour**: a palette colour instead of an image, with formats 16:9 / 4:3 / 1:1 / 3:4 / 9:16 / 21:9 or a custom width × height. The resize icon lets you drag the size on screen; press **Done** to return.
- **Background files**: every uploaded image with a thumbnail, size and where it is used.
  - Set a file as this view's day or night background, rename, download or delete it.
  - **Remove unused** cleans everything that no view uses.
  - Files used by HA Views Beta are marked and need confirmation.

Uploaded files keep their original name. Only a name that is already taken gets " (2)".

## Markers

Four types: **Badge**, **Gauge**, **Icon** and **Horseshoe**. Click a marker in edit mode to open its editor.

- **Entity**: name, unit, rounding, ON/OFF texts and **Tap in view** (More info, Toggle ON/OFF, No action).
- **Size**: width, height, element scale and **rotation**.
- **Name** / **State**: visibility, colour, opacity, size, left / right and up / down.
- **Icon**: from Home Assistant, the integration logo or a custom MDI icon, ON/OFF icons, fill, outline and colours.
- **Background** / **Border**: colour, gradients, opacity, shape, thickness and ON/OFF variants.
- **Gauge** / **Horseshoe**: range, arc, thickness, ticks, labels and gradient.
- **Value colours**: two thresholds, three colours and optional per-range icons.

Header buttons: restore defaults, geometry lock, copy style, paste style (it also copies the icon choice and tap action), remove and close. The **ON / OFF** buttons preview a state without controlling the entity.

## Flow

**Edit menu → Flow** adds animated arrows. In the Flow editor:

- **Entity and direction**: search for the entity, choose a fixed direction or one that depends on the sign, set the activity threshold and whether to hide the Flow below it.
- **Frame and position**: frame length and width, rotation. The corner handles resize the frame.
- **Arrows**: shape, sharpness, thickness, arrow length, spacing (it can be negative) and count.
- **Colours and appearance**: colour for + / −, outline, glow and opacity.
- **Animation**: Pulse or Flow, speed, speed that follows the value, and "apply to the other Flows of this entity".

## Rooms

**Edit menu → Room**, click the corners, then **Done**. In the room editor:

- **Room**: name, state, **Tap in view** and the entities that light the room (search).
- **Appearance**: ON / OFF preview, colour, intensity and edge softness. **Colour depends on ON/OFF** adds a separate OFF colour and intensity.

To edit the shape, drag the corners, use an edge's middle handle to add a corner, double-click a corner to remove it, or drag inside to move the room.

## Snap & grid, alignment, rotation

- Grid S / M / L, **Background bounds** (elements stay inside the image), and alignment guides.
- Snap targets: markers, Flows, rooms, background. Snap points: centres and edges. Blue guides are elements, amber guides are rooms, green guides are the background. On desktop, hold **Alt** to move freely.
- **Align selected** to the background edges or centre, and **Rotate selected** in steps of 15° / 90° or smoothly.

## Viewing and gestures

- Tap a marker or room to run its **Tap in view** action.
- Desktop: the mouse wheel zooms and dragging pans.
- Phone: pinch to zoom. Wide images become a panorama. Swipe sideways to change views (Slide / Cube).

## Users, sync and data

- Administrators can edit. Other Home Assistant users get a read-only **Viewer mode**, which is also enforced on the server.
- The layout is saved in Home Assistant (`/config/ha_views/rewrite_state.json`) and synchronised between devices. Changes made at the same time on two devices are merged.
- Backgrounds are stored in `/config/ha_views/backgrounds`.
- HA Views does not publish your entities, integrations or backgrounds.

## Backup and feedback

Create a Home Assistant backup before updating. When reporting an issue, include the Home Assistant version, the HA Views version, short steps to reproduce it and, where possible, a screenshot without private data.

---

# HA Views — Instrukcja obsługi

## Instalacja

1. W Home Assistant otwórz **Ustawienia → Dodatki → Sklep z dodatkami**.
2. Otwórz menu **⋮** w prawym górnym rogu i wybierz **Repozytoria**.
3. Dodaj `https://github.com/VoyteckPL/ha-views`.
4. Znajdź **HA Views**, zainstaluj go i uruchom.
5. Otwórz go z bocznego menu Home Assistant.

Język interfejsu (English / Polski) wybierasz w **menu edycji** (ikona ołówka). Nazwy encji, stany, jednostki i okno **Więcej informacji** pochodzą z Twojego Home Assistant.

## Górny pasek

- **Zakładki widoków**: kliknięcie przełącza widok. Przeciągnięcie zmienia kolejność (na dotyku: przytrzymaj i przeciągnij). Widok startowy ma ikonę domku.
- **Menu widoku** (ikona obok zakładek): na telefonie dolny panel, na komputerze rozwijane okno.
- **Przyciąganie i siatka** (ikona magnesu): widoczne w trybie edycji.
- **Integracje** (ikona puzzla): dodawanie encji i lista elementów widoku.
- **Edycja** (ołówek): włącza i wyłącza tryb edycji oraz otwiera menu edycji (Pomieszczenie, Flow, język).

## Pierwszy widok

1. Otwórz **menu widoku → Tło** i wgraj rzut mieszkania albo dowolny obraz (PNG, JPG, WebP). Możesz też wybrać kolor.
2. Otwórz **Integracje**, rozwiń integrację albo użyj wyszukiwarki i dodaj encję. Pojawi się jako **Badge** na środku widoku.
3. Włącz **tryb edycji** (ołówek). Przeciągnij marker na miejsce i kliknij go, żeby otworzyć edytor.
4. **Pomieszczenia** i **Flow** dodajesz z menu edycji.

Każda zakładka to niezależny widok z własnym tłem, markerami, Flow i pomieszczeniami.

## Menu widoku

- Strona główna: **Dodaj widok**, **Zmień nazwę**, **Duplikuj**, **Ustaw jako startowy**, a pod nimi **Tło** i **Opcje**.
- **Opcje**: **Przełączanie palcem** (wyłączone, Przesunięcie, Kostka), **Domyślny panel Home Assistant** (HA Views dla mojego konta albo tylko to urządzenie) oraz **Usuń widok** (z **Cofnij**).

### Tło

- **Obraz**: wybór tła oraz **Wgraj**, **Pobierz**, **Zmień nazwę pliku** i **Pliki tła**. Suwak **jasności** (30–200 %) zmienia tylko obraz.
- **Tło nocne**: drugi obraz tego samego rozmiaru, który płynnie przenika się z dziennym.
  - Tryb **Auto** przełącza encja: domyślnie `sun.sun`, gdzie `below_horizon` = noc. Przy innej encji noc oznaczają stany `on`, `true`, `night` i `below_horizon`. Przykłady: `input_boolean` przełączany automatyzacją albo czujnik zmierzchu.
  - **Zawsze dzień** i **Zawsze noc** ignorują encję.
  - Obraz nocny ma własną jasność.
- **Kolor**: kolor z palety zamiast obrazu, z formatami 16:9 / 4:3 / 1:1 / 3:4 / 9:16 / 21:9 albo własną szerokością × wysokością. Ikona zmiany rozmiaru pozwala ustawić rozmiar uchwytami na ekranie; **Gotowe** wraca do menu.
- **Pliki tła**: wszystkie wgrane obrazy z miniaturą, rozmiarem i miejscem użycia.
  - Plik możesz ustawić jako tło dzienne lub nocne tego widoku, zmienić mu nazwę, pobrać go albo usunąć.
  - **Usuń nieużywane** czyści wszystko, czego nie używa żaden widok.
  - Pliki używane przez HA Views Beta są oznaczone i wymagają potwierdzenia.

Wgrane pliki zachowują oryginalną nazwę. Tylko nazwa, która jest już zajęta, dostaje „(2)”.

## Markery

Cztery typy: **Badge**, **Gauge**, **Ikona** i **Podkowa**. Kliknij marker w trybie edycji, żeby otworzyć edytor.

- **Encja**: nazwa, jednostka, zaokrąglenie, teksty ON/OFF i **Dotknięcie w widoku** (Więcej informacji, Przełącz ON/OFF, Brak akcji).
- **Rozmiar**: szerokość, wysokość, skala elementów i **obrót**.
- **Nazwa** / **Stan**: widoczność, kolor, przezroczystość, rozmiar, lewo / prawo i góra / dół.
- **Ikona**: z Home Assistant, logo integracji albo własna ikona MDI, ikony ON/OFF, wypełnienie, obrys i kolory.
- **Tło** / **Ramka**: kolor, gradienty, przezroczystość, kształt, grubość i warianty ON/OFF.
- **Gauge** / **Podkowa**: zakres, łuk, grubość, podziałki, opisy i gradient.
- **Kolory wg wartości**: dwa progi, trzy kolory i opcjonalne ikony dla zakresów.

Przyciski w nagłówku: przywróć domyślne, blokada geometrii, kopiuj styl, wklej styl (przenosi też wybór ikony i dotknięcie w widoku), usuń i zamknij. Przyciski **ON / OFF** pokazują podgląd stanu bez sterowania encją.

## Flow

**Menu edycji → Flow** dodaje animowane strzałki. W edytorze Flow:

- **Encja i kierunek**: wyszukanie encji, kierunek stały albo zależny od znaku, próg aktywności i ukrywanie poniżej progu.
- **Ramka i pozycja**: długość i szerokość ramki oraz obrót. Narożne uchwyty zmieniają rozmiar ramki.
- **Strzałki**: kształt, ostrość, grubość, długość strzałki, odstęp (może być ujemny) i liczba.
- **Kolory i wygląd**: kolor dla + / −, obrys, poświata i krycie.
- **Animacja**: Pulsowanie albo Przepływ, tempo, tempo od wartości oraz „ustaw w pozostałych Flow tej encji”.

## Pomieszczenia

**Menu edycji → Pomieszczenie**, kliknij kolejne narożniki, a potem **Gotowe**. W edytorze pomieszczenia:

- **Pomieszczenie**: nazwa, stan, **Dotknięcie w widoku** i encje, które je zapalają (wyszukiwarka).
- **Wygląd**: podgląd ON / OFF, kolor, intensywność i miękkość krawędzi. **Kolor zależny ON/OFF** dodaje osobny kolor i intensywność dla OFF.

Kształt edytujesz tak: przeciągasz narożniki, środkowym uchwytem krawędzi dodajesz narożnik, dwuklikiem na narożniku go usuwasz, a przeciągnięciem wnętrza przesuwasz całe pomieszczenie.

## Przyciąganie, wyrównanie, obrót

- Siatka S / M / L, **Granice tła** (elementy zostają na obrazie) i linie pomocnicze.
- Cele przyciągania: markery, Flow, pomieszczenia i tło. Punkty przyciągania: środki i krawędzie. Niebieskie linie to elementy, bursztynowe to pomieszczenia, zielone to tło. Na komputerze **Alt** pozwala przesuwać swobodnie.
- **Wyrównaj zaznaczony** do krawędzi lub środka tła oraz **Obróć zaznaczony** o 15° / 90° albo płynnie.

## Oglądanie i gesty

- Dotknięcie markera lub pomieszczenia wykonuje jego akcję **Dotknięcie w widoku**.
- Komputer: rolka myszy przybliża, a przeciąganie przesuwa widok.
- Telefon: dwa palce przybliżają. Szerokie obrazy stają się panoramą. Przesunięcie w bok zmienia widok (Przesunięcie / Kostka).

## Użytkownicy, synchronizacja i dane

- Administratorzy mogą edytować. Pozostali użytkownicy Home Assistant widzą **tryb podglądu** tylko do odczytu, pilnowany także przez serwer.
- Układ jest zapisywany w Home Assistant (`/config/ha_views/rewrite_state.json`) i synchronizowany między urządzeniami. Równoczesne zmiany z dwóch urządzeń są łączone.
- Tła są w `/config/ha_views/backgrounds`.
- HA Views nie publikuje Twoich encji, integracji ani teł.

## Backup i zgłaszanie błędów

Przed aktualizacją zrób backup Home Assistant. Zgłaszając problem, podaj wersję Home Assistant, wersję HA Views, krótkie kroki odtworzenia i, jeśli możesz, zrzut ekranu bez prywatnych danych.
