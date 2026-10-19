## 0.8.0 — Weather, motion, drip lines, light control and a tidier editor

### English

**Before you update**

- Make a Home Assistant backup, as with every add-on update. Your 0.7.0 layout is kept; everything new is optional and nothing changes its look until you use it. Going back to 0.7.0 after saving with 0.8.0 is not supported (new settings are ignored by the old version).

**New elements and areas** (in the **+** menu)

- **Weather**: an area that shows the current weather of a `weather.*` entity (e.g. OpenWeatherMap): sun with rays, drifting clouds with a soft shadow, snow, hail, fog, stars on a clear night, wind. Rain and downpour use the rain area. A row of **preview buttons** shows any weather while editing; "Rain from weather" can be switched off when a real rain sensor has its own area. It sits underneath and does not catch taps, so a weather and a rain area can cover almost the whole plan.
- **Motion**: motion sensors in an area or as a layer of a room, with a "whole room" wave, cones (Waves, Radar, Flash), fade-out and its own preview. A **Room** is now light plus optional motion; **Irrigation** and **Rain** are separate areas.
- **Irrigation** is one category: **sprinklers in an area** or a **drip line**. Drip lines are drawn freely anywhere on the plan (no area needed) with their own valve and ON/OFF preview: hose thickness, glow, spots and drops, rounded corners, extend, add / remove points (right button, double click or long press), 45° snapping, grab and move the whole line, copy / paste style. Sprinkler heads and range dots snap to the grid; the edit dots are smaller; the preview hides them. A new area no longer adds a sprinkler by itself.
- **Add as HA card** (view menu): writes a small Lovelace card and registers it as a dashboard resource; it shows one view without the bar.

**Lights**

- **Hold a label with a dimmable light** (right button on a computer) for a small popup: brightness, colour temperature, ready colours, a hue bar and white. **Save as default** makes the tap switch the light on in that colour.
- A room can glow in the **colour of its lamp**, follows it live, and has **Click: whole area / icon only**.
- **State sync**: no more flicker of a light you have just switched (a late answer never overwrites a newer state, contradicting updates are ignored for 2.5 s), and after the app slept in the background the live stream is made again and the states are asked for until they arrive.

**Labels, icons and thermostat**

- **Icon effects in two groups you can combine**: a look (3D, glass ball, metal, gradient, long shadow) and a motion / light (neon, breathing, ripples, rays, floating, spinning ring, inner light); they also work on elements without an ON state; metal and gradient take the icon's colour.
- **Thermostat**: icon effects and shape, bigger defaults for icon and name, same "symbol size / circle size" sliders as a lone icon, modes, button visibility and confirmations moved to "General" (only the single mode buttons stay as sections), mode and −/+ icons centred exactly on every device, reset values of the thermostat's own.
- **Lone icon**: one consistent layout and a bigger default symbol. **Copy style** also copies a label's size.
- **Tiles**: width and height of a label, thermostat or gauge with big **− / +** buttons (easy on a phone); a label's layout follows live while stretching.

**View menu and editor**

- **View menu**: one even row of icons (rename, start view, zoom outside edit; delete, duplicate, add), the view's name as the title, all sections folded, the night background grouped, "Options" removed.
- **Editor**: every subsection is folded by default and stays open while you choose inside it.

### Polski

**Przed aktualizacją**

- Zrób kopię zapasową Home Assistanta, jak przy każdej aktualizacji dodatku. Twój układ z 0.7.0 zostaje; wszystko nowe jest opcjonalne i niczego nie zmienia, dopóki z tego nie skorzystasz. Powrót do 0.7.0 po zapisaniu układu w 0.8.0 nie jest wspierany (stara wersja ignoruje nowe ustawienia).

**Nowe elementy i obszary** (w menu **+**)

- **Pogoda**: obszar pokazujący aktualną pogodę z encji `weather.*` (np. OpenWeatherMap): słońce z promieniami, płynące chmury z miękkim cieniem, śnieg, grad, mgła, gwiazdy w pogodną noc, wiatr. Deszcz i ulewa korzystają z obszaru deszczu. Rząd **przycisków podglądu** pokazuje dowolną pogodę w edycji; „Deszcz z pogody” można wyłączyć, gdy prawdziwy czujnik deszczu ma własny obszar. Obszar leży na spodzie i nie przechwytuje kliknięć, więc pogoda i deszcz mogą zająć prawie cały plan.
- **Ruch**: czujniki ruchu w obszarze albo jako warstwa pomieszczenia: fala „cały pokój”, stożki (Fale, Radar, Błysk), zanikanie i własny podgląd. **Pomieszczenie** to teraz światło plus opcjonalny ruch; **Podlewanie** i **Deszcz** to osobne obszary.
- **Podlewanie** to jedna kategoria: **zraszacze w obszarze** albo **linia kroplująca**. Linie kroplujące rysujesz dowolnie na planie (bez obszaru), z własnym zaworem i podglądem ON/OFF: grubość węża, poświata, plamy i krople, zaokrąglone zakręty, dorysowanie, dodawanie / usuwanie punktów (prawy przycisk, dwuklik albo długie przytrzymanie), przyciąganie co 45°, łapanie i przesuwanie całej linii, kopiuj / wklej styl. Głowice i kropki zasięgu zraszaczy przyciągają się do siatki; kropki w edycji są mniejsze; podgląd je ukrywa. Nowy obszar nie dodaje już sam zraszacza.
- **Dodaj jako kartę HA** (menu widoku): zapisuje małą kartę Lovelace i rejestruje ją w zasobach dashboardu; pokazuje jeden widok bez paska.

**Światła**

- **Przytrzymaj etykietę ze światłem z regulacją** (na komputerze prawy przycisk), a pojawi się dymek: jasność, temperatura barwy, gotowe kolory, pasek odcienia i biel. **Zapisz jako domyślny** sprawia, że kliknięcie włącza światło w tym kolorze.
- Pomieszczenie może świecić **kolorem swojej lampy** (na bieżąco) i ma opcję **Klikanie: cały obszar / tylko ikona**.
- **Synchronizacja stanu**: koniec migotania świecącej się chwilę wcześniej lampy (spóźniona odpowiedź nie nadpisuje nowszego stanu, sprzeczne aktualizacje są ignorowane przez 2,5 s), a po uśpieniu aplikacji w tle strumień na żywo jest nawiązywany od nowa i stany są pobierane do skutku.

**Etykiety, ikony i termostat**

- **Efekty ikony w dwóch grupach, które można łączyć**: wygląd (3D, szklana kula, metal, gradient, długi cień) oraz animacja / światło (neon, oddech, fale, promienie, unoszenie, wirujący pierścień, światło od środka); działają też na elementach bez stanu ON; metal i gradient biorą kolor ikony.
- **Termostat**: efekty ikony i kształt, większe domyślne rozmiary ikony i nazwy, takie same suwaki „wielkość symbolu / koła” jak w samotnej ikonie, tryby, widoczność przycisków i potwierdzenia w „Ogólne” (jako sekcje zostały pojedyncze przyciski trybów), ikony trybów oraz −/+ wyśrodkowane dokładnie na każdym urządzeniu, reset do własnych wartości termostatu.
- **Samotna ikona**: spójny układ i większy domyślny symbol. **Kopiuj styl** kopiuje też rozmiar etykiety.
- **Kafelki**: szerokość i wysokość etykiety, termostatu lub wskaźnika dużymi przyciskami **− / +** (wygodne na telefonie); układ etykiety dopasowuje się na żywo przy rozciąganiu.

**Menu widoku i edytor**

- **Menu widoku**: jeden równy rząd ikon (zmiana nazwy, widok startowy, zoom poza edycją; usuń, duplikuj, dodaj), nazwa widoku jako tytuł, wszystkie sekcje zwinięte, tło nocne pogrupowane, bez „Opcji widoku”.
- **Edytor**: każda podsekcja jest domyślnie zwinięta i zostaje otwarta, gdy wybierasz coś w jej środku.

## 0.7.0 — Tiles, camera, rain and irrigation, a new label engine

### English

**Before you update**

- Make a Home Assistant backup, as with every add-on update. Your 0.6.x layout is kept: existing labels, thermostats and gauges keep their look and switch to the new engine only when you pick a preset.

**New views: Image with grid or Tiles**

- The new-view wizard has two steps: **Image with grid** (your floor plan or photo, elements placed freely; existing backgrounds shown as a thumbnail gallery) or **Tiles** (a colour background split into tiles, Phone 9:16 or Desktop 16:9).
- **Tiles**: labels, buttons, thermostats and gauges snap into tiles and fill them; stretch them over more tiles with the corner dots (on phones after a short hold), a small **+** on every empty tile adds an element right there, labels never overlap, and the grid sliders sit in the view menu.
- Label presets on tiles: **Stacked**, **Icon on the left**, icon and name in a row, and for two parts **Stacked**, **Side by side** and **Small over big**; text always fills its frame.
- The view menu is one page with collapsible sections; the gear screen has three columns: Options (with the template Library), **Added to view** and **Home Assistant integrations**.

**Labels, rooms and buttons**

- One label engine everywhere (tiles and background): presets, own size with corner dots and **Width / Height** sliders (up to 500 px, arrows at round values, reset per axis), new labels are 160 × 160 px, inner margin for name and state, font weight slider, the full state always visible (never "…"), no clipped descenders.
- A lone icon becomes the label: circle, square or free shape, **Circle size** and **Symbol size**.
- A room can hide its icon, name and state to show only the area; its label is clickable and moves with the room.
- **Effects**: Themes (Aurora, Neon, Sunset, Gold, Crystal, Frost, Midnight, Mint), **Liquid glass** and **Gradient** frames with presets, and **Icon effects** (Neon, Breathing, Ripples, Rays, 3D, glass ball, metal, long shadow, floating, spinning ring and more).
- **Text is now Button**: icon and text like a label, **Go to view** with transitions (Lift, Into the button, Flip, Slide, Fade, 3D floors, reveal from the button…) and **Try the transition**.
- MDI icon search: type words (e.g. "arrow left") and pick from a grid of matching icons. Entity search also finds helpers (input_number, input_boolean) and YAML entities.

**Thermostat and gauge**

- **9 dial styles** (Classic, LED segments, Chronograph, Twin ring, Thermal, Neon, Half circle, Comet, Ticks) with their own settings.
- A new default thermostat that fits the device: parts the entity does not report start hidden, more modes give a different layout, work states are picked from a list.
- **New gauge** built like the thermostat: icon, name, arc in every dial style, value, min/max and percent, colours by value, sensible ranges by sensor type.
- Thermostats and gauges on the background get their own box (corner dots, sliders); on tiles they fill 2×3 tiles.

**Camera (new element)**

- **+ → Camera**: the picture of any `camera.*` entity right on the plan, **live** or refreshed every 2 s – 5 min, with fit, rounded corners, frame, glass look, name and frame time.
- Tap opens a **live window** (landscape or portrait, HLS with sound muted by default or MJPEG, pinch / wheel zoom, swipe down to close) or **full screen in landscape**.
- **WebRTC-only cameras** (e.g. Mammotion mowers, Nest) work through the add-on, including live on the plan; their tile shows the last frame.
- A camera can also be shown as an icon (a label), and a label with a camera entity can open the camera on tap.

**Rain and irrigation (areas)**

- **Rain**: an area can show animated rain from above while its sensor is on: Ripples, Streaks, Ripples + streaks + wet, Drizzle; intensity (or live from a sensor in mm/h), drop size, blue palette, wind, wet tint and downpour waves; it stays visible from afar.
- **Irrigation (new element)**: draw a zone and place animated sprinklers – **Rotor**, **Impact**, **Spray**, **Mist** – each with range, direction, sweep angle (10–360°, snapping every 45°), speed and power. They run while the zone's valve / switch is on. Drag the blue dot to move a sprinkler and the white one to set range and direction; sprinklers snap to the zone's corners and walls.

**Snapping and editing**

- One snapping system for everything, with guide lines in each object's colour, equal-gap arrows, a square grid up to 48 zones (36 by default) and **Size by zones**.
- Template **Library**: save the look of any element from its panel and add new elements **From a template**.
- Adding is simpler: every element appears in the middle of the screen, **X** or Esc cancels the wizard, drawing a room has a clear **Cancel**.
- Phone: elements move and resize after a short hold, swipes move the view, sliders change only when you drag their knob, and the selected element is centred above the panel. Desktop: the plan can be panned with the mouse in edit mode.
- Many fixes: stuck touch after a system gesture, exact corners on the grid, no shrinking labels, stable ungroup / regroup.

### Polski

**Przed aktualizacją**

- Zrób kopię zapasową Home Assistant, jak przy każdej aktualizacji dodatku. Układ z 0.6.x zostaje: istniejące etykiety, termostaty i wskaźniki zachowują wygląd i przechodzą na nowy silnik dopiero po wybraniu presetu.

**Nowe widoki: Obraz z siatką albo Kafelki**

- Kreator nowego widoku ma dwa kroki: **Obraz z siatką** (rzut lub zdjęcie, elementy kładziesz swobodnie; istniejące tła jako galeria miniatur) albo **Kafelki** (kolorowe tło podzielone na kafle, Telefon 9:16 albo Desktop 16:9).
- **Kafelki**: etykiety, przyciski, termostaty i wskaźniki wskakują w kafle i je wypełniają; kropkami w rogach rozciągasz je na kolejne kafle (na telefonie po krótkim przytrzymaniu), mały **+** na pustym kaflu dodaje element właśnie tam, etykiety się nie nakładają, a suwaki siatki są w menu widoku.
- Presety etykiety na kaflu: **Jedno pod drugim**, **Ikona z lewej**, ikona i nazwa w rzędzie, a przy dwóch częściach **Jedno pod drugim**, **Obok siebie** i **Małe nad dużym**; tekst zawsze wypełnia swoją ramkę.
- Menu widoku na jednej stronie ze zwijanymi sekcjami; ekran zębatki w trzech kolumnach: Opcje (z Biblioteką szablonów), **Dodane do widoku** i **Integracje Home Assistant**.

**Etykiety, pomieszczenia i przyciski**

- Jeden silnik etykiet wszędzie (kafelki i tło): presety, własny rozmiar kropkami w rogach i suwakami **Szerokość / Wysokość** (do 500 px, strzałki w okrągłych wartościach, reset osobno dla każdej osi), nowe etykiety 160 × 160 px, margines wewnętrzny nazwy i stanu, suwak grubości czcionki, pełny stan zawsze widoczny (bez „…”), bez obciętych ogonków liter.
- Samotna ikona staje się etykietą: koło, kwadrat albo dowolny kształt, **Wielkość koła** i **Wielkość symbolu**.
- Pomieszczenie może ukryć ikonę, nazwę i stan – zostaje sam obszar; jego etykieta jest klikalna i jedzie razem z pomieszczeniem.
- **Efekty**: Motywy (Zorza, Neon, Zachód, Złoto, Kryształ, Szron, Północ, Mięta), ramki **Liquid glass** i **Gradient** z presetami oraz **Efekty ikony** (Neon, Oddech, Fale, Promienie, 3D, szklana kula, metal, długi cień, unoszenie, wirujący pierścień i inne).
- **Tekst to teraz Przycisk**: ikona i tekst jak w etykiecie, **Przejdź do widoku** z przejściami (Winda, Wejście w przycisk, Przewrót, Przesunięcie, Przenikanie, Piętra 3D, odsłonięcie z przycisku…) i **Przetestuj przejście**.
- Wyszukiwarka ikon MDI: wpisz słowa (np. „arrow left”) i wybierz z siatki pasujących ikon. Wyszukiwanie encji znajduje też pomocników (input_number, input_boolean) i encje z YAML.

**Termostat i wskaźnik**

- **9 stylów tarczy** (Klasyczna, Segmenty LED, Chronograf, Podwójny pierścień, Termiczna, Neon, Półkole, Kometa, Podziałka) z własnymi ustawieniami.
- Nowy domyślny termostat dopasowany do urządzenia: części, których encja nie podaje, startują ukryte, więcej trybów daje inny układ, stany pracy wybierasz z listy.
- **Nowy wskaźnik** zbudowany jak termostat: ikona, nazwa, łuk w każdym stylu tarczy, wartość, min/max i procent, kolory wg wartości, rozsądne zakresy wg rodzaju czujnika.
- Termostat i wskaźnik na tle mają własne pole (kropki w rogach, suwaki); na kafelkach zajmują 2×3 kafle.

**Kamera (nowy element)**

- **+ → Kamera**: obraz z dowolnej encji `camera.*` prosto na planie, **na żywo** albo odświeżany co 2 s – 5 min, z dopasowaniem, zaokrągleniem, ramką, szklanym wyglądem, nazwą i godziną klatki.
- Dotknięcie otwiera **okno podglądu na żywo** (poziome lub pionowe, HLS z domyślnie wyciszonym dźwiękiem albo MJPEG, zoom palcami / kółkiem, zamknięcie przeciągnięciem w dół) albo **pełny ekran w poziomie**.
- **Kamery tylko z WebRTC** (np. kosiarki Mammotion, Nest) działają przez dodatek, także na żywo na planie; ich kafel pokazuje ostatnią klatkę.
- Kamerę można też pokazać jako ikonę (etykietę), a etykieta z encją kamery może po dotknięciu otwierać podgląd.

**Deszcz i podlewanie (obszary)**

- **Deszcz**: obszar może pokazywać animowany deszcz z góry, gdy czujnik jest włączony: Kręgi, Smugi, Kręgi + smugi + mokro, Mżawka; natężenie (albo na żywo z czujnika w mm/h), rozmiar kropli, niebieska paleta, wiatr, mokra poświata i fale ulewy; dobrze widoczny także z daleka.
- **Podlewanie (nowy element)**: rysujesz sekcję i rozmieszczasz animowane zraszacze – **Rotacyjny**, **Udarowy**, **Dyszowy**, **Mgiełka** – każdy z zasięgiem, kierunkiem, kątem pracy (10–360°, ząbki co 45°), prędkością i mocą. Pracują, gdy zawór / przełącznik sekcji jest włączony. Niebieska kropka przesuwa zraszacz, biała ustawia zasięg i kierunek; zraszacze przyciągają się do narożników i ścian sekcji.

**Przyciąganie i edycja**

- Jeden system przyciągania dla wszystkiego: linie pomocnicze w kolorze obiektu, strzałki równych odstępów, kwadratowa siatka do 48 stref (domyślnie 36) i **Rozmiar po strefach**.
- **Biblioteka** szablonów: zapisz wygląd dowolnego elementu z jego panelu i dodawaj nowe elementy **Z szablonu**.
- Prostsze dodawanie: każdy element pojawia się na środku ekranu, **X** albo Esc anuluje kreator, rysowanie pomieszczenia ma wyraźne **Anuluj**.
- Telefon: elementy przesuwasz i zmieniasz po krótkim przytrzymaniu, przeciągnięcie przesuwa widok, suwaki zmieniają się tylko po złapaniu gałki, a zaznaczony element centruje się nad panelem. Komputer: plan można przesuwać myszką w trybie edycji.
- Wiele poprawek: zablokowany dotyk po geście systemowym, dokładne rogi na siatce, etykiety już nie maleją, stabilne rozgrupowanie i zgrupowanie.

## 0.6.2 — Saving large layouts

### English

- **Layouts above 1 MiB save again**: the add-on's server accepted requests only up to 1 MiB (aiohttp's default), so a large layout stopped saving with "Save error: Invalid JSON". The limit is now 32 MiB; a layout bigger than that shows a clear "layout too large" message. Thanks to @tyrpapatryk-hash for the report and the fix (#6).

### Polski

- **Duże układy znów się zapisują**: serwer dodatku przyjmował zapytania tylko do 1 MiB (domyślny limit aiohttp), więc duży układ przestawał się zapisywać z błędem „Błąd zapisu: Nieprawidłowy JSON”. Limit wynosi teraz 32 MiB, a większy układ pokaże czytelny komunikat „Układ jest za duży do zapisania”. Dzięki @tyrpapatryk-hash za zgłoszenie i poprawkę (#6).

## 0.6.1 — Thermostat modes as parts, smarter grouping and snapping

### English

**Before you update**

- Make a Home Assistant backup, as with every add-on update. Your 0.6.0 layout is kept.
- Thermostats switch to separate mode parts the first time you select them in edit mode; every mode button stays exactly where it was.

**Thermostat**

- **Each mode is its own part** (heat, auto, off…), like the icon: its own section with size, icon, colour and opacity for active and inactive, background, frame and corners, copy style, and its own place when ungrouped. The "Modes" section keeps the list of modes (show / hide), presets and confirmations.
- **"State" and "Modes" follow the mode, not the work state**: colours, background and frame can be set per mode ("By mode"). Editing a mode's look previews that mode.
- The active mode button takes its mode's colour: heat stays orange while the boiler is idle, auto is green.

**Group and parts**

- Ungrouping is for arranging: the label or thermostat is grouped again by itself when you close its panel, pick another element, switch view or leave edit mode.
- Group / ungroup without moving anything changes nothing (positions are no longer rounded to whole pixels on every switch).
- While ungrouped, the group's frame and background keep the group's size and place. The Size slider never moves the frame. Group size goes up to 6×. The group's Margin slider was removed (existing values are kept).
- Copy / paste the look of one part onto another (any label or thermostat), from the open part section.
- **Duplicate** is back, in the first section of every panel.

**Snapping**

- The group has its own magnet next to "Group": on / off, parts, centre and frame, equal spacing, plan elements, and its own S / M / L grid.
- Of the lines within reach, the nearest object wins; a centre line comes before an edge.
- Snapping keeps working near the screen edge while the plan moves; on phones the edge zone is narrower.
- Small lime arrows show equal gaps between elements.
- A room's label parts snap to the room's own centre and edges.

### Polski

**Przed aktualizacją**

- Zrób kopię zapasową Home Assistant, jak przy każdej aktualizacji dodatku. Twój układ z 0.6.0 zostaje.
- Termostaty przechodzą na osobne części trybów przy pierwszym wybraniu w trybie edycji; każdy przycisk trybu zostaje dokładnie w swoim miejscu.

**Termostat**

- **Każdy tryb to osobna część** (grzanie, auto, wyłączony…), jak ikona: własna sekcja z rozmiarem, ikoną, kolorem i przezroczystością dla aktywnego i nieaktywnego, tłem, ramką i zaokrągleniem, kopiowaniem stylu i własnym miejscem po rozgrupowaniu. Sekcja „Tryby” zostaje dla listy trybów (pokaż / ukryj), presetów i potwierdzeń.
- **„Stan” i „Tryby” zależą od trybu, nie od stanu pracy**: kolory, tło i ramkę ustawisz dla każdego trybu („Zależne od trybu”). Zmiana wyglądu trybu włącza jego podgląd.
- Aktywny przycisk trybu ma kolor swojego trybu: grzanie zostaje pomarańczowe także przy bezczynnym piecu, auto jest zielone.

**Grupa i części**

- Rozgrupowanie służy do układania: etykieta lub termostat grupuje się sam, gdy zamkniesz panel, wybierzesz inny element, przełączysz widok albo wyjdziesz z edycji.
- Rozgrupowanie i zgrupowanie bez ruszania niczego niczego nie zmienia (położenia nie są już zaokrąglane do pełnego piksela przy każdym przełączeniu).
- W rozgrupowanym ramka i tło grupy mają rozmiar i miejsce z grupy. Suwak Rozmiar nigdy nie rusza ramki. Rozmiar grupy do 6×. Usunięty suwak Margines grupy (dotychczasowe wartości zostają).
- Kopiowanie wyglądu jednej części na inną (także w innej etykiecie lub termostacie), z otwartej sekcji części.
- **Duplikuj** wróciło, w pierwszej sekcji każdego panelu.

**Przyciąganie**

- Grupa ma własny magnes obok „Grupa”: wł. / wył., części, środek i ramka, równe odstępy, elementy planu i własna siatka S / M / L.
- Z linii w zasięgu wygrywa najbliższy obiekt; środek ma pierwszeństwo przed krawędzią.
- Przyciąganie działa także przy krawędzi ekranu, gdy plan jedzie; na telefonie pas krawędzi jest węższy.
- Małe limonkowe strzałki pokazują równe odstępy między elementami.
- Części etykiety pomieszczenia przyciągają się do środka i krawędzi swojego pokoju.

## 0.6.0 — Thermostat, Labels, Text and a smarter editor

### English

**Before you update**

- Make a Home Assistant backup, as with every add-on update.
- Your 0.5.0 layout is kept. On the first save it is upgraded to the new layout format, and the previous file is kept once as `rewrite_state.v2-backup.json`, so you can go back if needed.
- Some new effects (the "pending" pulse, the one-line typing mode) need a recent browser (about Chrome 111+ / Safari 16+). On older WebViews HA Views still works, without those effects.

**New elements**

- **Label** (formerly "Icon"): the icon, name and state of one entity, with ready-made layouts and styles, background, border, ON/OFF colours, icon animation, a custom MDI icon or an integration logo.
- **Text**: any text with a caption and a tap action, for example a button that switches views.
- **Thermostat** for `climate` and `water_heater` entities, built from separate parts: a dial with fill and glow, target and current temperature, working state, −/+ buttons and mode buttons.
- The Add dialog has 6 tiles, and the "+" next to an entity in Integrations adds a Label. The same entity can now be placed on a view several times.

**Thermostat**

- The look follows the working state (heating, idle, off…): colours, icons and animations, with a preview of each state. You choose which states your device uses.
- Modes: choose and order them, a single-button layout, presets (eco / comfort / boost), a "pending" state and a message when the device does not accept a change, optional confirmation for selected modes (for example turning the boiler on or off), and water heater operation modes.
- 5 templates, copy style 1:1 and "Set as default".
- Up to 4 extra entities (for example boiler pressure) shown as their own parts.
- Icon and dial-glow animations run in sync.

**Group and parts**

- Ungroup a Label or Thermostat: every part can be moved on its own and has its own section in the panel. The Group button sits in the panel header.
- Resize with the corner handles (free, or proportional with Shift), a 1:1 indicator, and group size up to 4.5×.
- A separate snapping system inside a group, with its own grid.
- Tapping a section name in the panel selects that part and zooms to it.

**Snapping and grid**

- Square S/M/L grid, centred, with a clear centre and quarters.
- Thinner guide lines placed exactly on edges, coloured by source, with the target highlighted. They also catch elements just outside the visible area.
- Snap everything to everything: edges, centres, equal spacing and the size of a neighbour.
- Elements cannot be resized past the background.

**Editing on phones**

- The tapped element is centred above the panel. Zoom below 100% while editing, also with two fingers outside the plan.
- Two fingers always zoom and cancel an accidental drag. A small guard stops you from grabbing a part you did not select.
- While typing in the panel the camera stays put.
- Thermostat buttons work with touch.

**Editing on desktop**

- The edit panel is docked at the side, and the zoomed plan fills the free space.
- While editing you can pan the plan past its edge, and the clicked element is centred.
- Resize handles stay visible even outside the plan. No more flicker or scrollbars.

**Panels, views and smoothness**

- One consistent panel style: coloured sections, buttons on section bars, sliders with "reset to default", a colour picker, and a View menu in the same style.
- "Zoom outside edit mode" can be set per view.
- Many flicker fixes (Cube transition, room glow, pinch zoom). Icons are drawn as SVG.
- Viewer mode: non-admin users can toggle entities and set thermostats that an admin placed on a view with those controls. Nothing else can be controlled.

### Polski

**Przed aktualizacją**

- Zrób kopię zapasową Home Assistant, jak przy każdej aktualizacji dodatku.
- Twój układ z 0.5.0 zostaje. Przy pierwszym zapisie jest przenoszony do nowego formatu, a poprzedni plik zostaje raz zachowany jako `rewrite_state.v2-backup.json`, więc w razie potrzeby można wrócić.
- Część nowych efektów (pulsowanie „w trakcie”, tryb jednej linii przy pisaniu) wymaga nowszej przeglądarki (mniej więcej Chrome 111+ / Safari 16+). Na starszych WebView HA Views działa, tylko bez tych efektów.

**Nowe elementy**

- **Etykieta** (dawniej „Ikona”): ikona, nazwa i stan jednej encji, z gotowymi układami i stylami, tłem, ramką, kolorami ON/OFF, animacją ikony, własną ikoną MDI albo logo integracji.
- **Tekst**: dowolny napis z podpisem i akcją po dotknięciu, np. przycisk przełączający widok.
- **Termostat** dla encji `climate` i `water_heater`, złożony z osobnych części: tarcza z wypełnieniem i poświatą, temperatura ustawiona i aktualna, stan pracy, przyciski −/+ i przyciski trybów.
- Okno dodawania ma 6 kafelków, a „+” przy encji w Integracjach dodaje etykietę. Tę samą encję można teraz umieścić na widoku kilka razy.

**Termostat**

- Wygląd zależy od stanu pracy (grzeje, bezczynny, wyłączony…): kolory, ikony i animacje, z podglądem każdego stanu. Wybierasz, których stanów używa urządzenie.
- Tryby: wybór i kolejność, układ „jeden przycisk”, presety (eco / komfort / boost), stan „w trakcie” i komunikat, gdy urządzenie nie przyjmie zmiany, opcjonalne potwierdzenie dla wybranych trybów (np. włączenie i wyłączenie pieca) oraz tryby pracy bojlera.
- 5 szablonów, kopiowanie stylu 1:1 i „Ustaw domyślny”.
- Do 4 dodatkowych encji (np. ciśnienie w kotle) jako osobne części.
- Animacje ikony i poświaty tarczy są zsynchronizowane.

**Grupa i części**

- Rozgrupowanie etykiety lub termostatu: każdą część przesuwasz osobno i ma własną sekcję w panelu. Przycisk Grupa jest w nagłówku panelu.
- Zmiana rozmiaru kropkami w rogach (dowolnie albo proporcjonalnie z Shiftem), wskaźnik 1:1, rozmiar grupy do 4,5×.
- Osobne przyciąganie wewnątrz grupy, z własną siatką.
- Kliknięcie nazwy sekcji w panelu zaznacza tę część i ją przybliża.

**Przyciąganie i siatka**

- Kwadratowa siatka S/M/L, wyśrodkowana, z wyraźnym środkiem i ćwiartkami.
- Cieńsze linie pomocnicze dokładnie na krawędziach, w kolorach według źródła, z podświetleniem celu. Łapią też elementy tuż poza widocznym obszarem.
- Przyciąganie wszystkiego do wszystkiego: krawędzie, środki, równe odstępy i rozmiar sąsiada.
- Elementów nie da się powiększyć poza tło.

**Edycja na telefonie**

- Dotknięty element jest centrowany nad panelem. Zoom poniżej 100% w edycji, także dwoma palcami poza planem.
- Dwa palce zawsze zoomują i anulują przypadkowe przesunięcie. Małe zabezpieczenie chroni przed złapaniem niezaznaczonej części.
- Przy pisaniu w panelu kamera stoi w miejscu.
- Przyciski termostatu działają dotykiem.

**Edycja na komputerze**

- Panel edycji jest zadokowany z boku, a przybliżony plan wypełnia wolne miejsce.
- W edycji plan można przesunąć poza krawędź, a kliknięty element jest centrowany.
- Kropki zmiany rozmiaru są widoczne także poza planem. Bez mrugania i pasków przewijania.

**Panele, widoki i płynność**

- Jednolity styl paneli: kolorowe sekcje, przyciski na paskach sekcji, suwaki z „przywróć domyślne”, wybór koloru i menu Widok w tym samym stylu.
- „Zoom poza edycją” ustawiany osobno dla każdego widoku.
- Wiele poprawek mrugania (przejście Kostka, poświata pomieszczeń, szczypanie). Ikony rysowane jako SVG.
- Tryb podglądu: użytkownicy bez uprawnień administratora mogą przełączać encje i ustawiać termostaty, które administrator umieścił na widoku z takimi przyciskami. Niczym innym nie mogą sterować.

## 0.5.0 — Rooms, Flow, night backgrounds and a new editor

### English

**Before you update**

- Make a Home Assistant backup, as with every add-on update.
- Your 0.4.0 layouts, views, markers and backgrounds are kept and loaded as they are. Nothing needs to be migrated.
- The stable add-on keeps its layout in `/config/ha_views/rewrite_state.json`. HA Views Beta, from the separate beta repository, uses its own `rewrite_state_beta.json`. Both share the backgrounds folder.
- Home Assistant users without admin rights now see the HA Views panel in read-only **Viewer mode** (see below).

**Rooms (new)**

- Draw any room outline on your floor plan: L-shapes, stairs and slanted walls are all fine. Open **Edit menu → Room**, click the corners, then click the first point again or press **Done**. **Undo point** removes the last corner.
- While drawing, corners snap to other rooms' corners, to markers, Flows, the background and the grid, with guide lines. Hold **Alt** on desktop to place freely.
- A room glows softly while any of its entities is on: lights, sockets, motion, doors… It fades in and out smoothly.
- Entities are added with a live search over all Home Assistant entities.
- **Appearance** has colour, intensity and edge softness. Optionally, **Colour depends on ON/OFF** gives separate ON and OFF colour and intensity, so a room that is off can stay tinted instead of disappearing.
- **Tap in view** can toggle all of the room's lights and sockets (all off if any is on, otherwise all on, shown instantly), open More info, or do nothing.
- Shape editing:
  - drag the corners (also with a finger on phones);
  - use the small handle in the middle of an edge to add a corner;
  - double-click a corner to remove it;
  - drag inside the room to move all of it;
  - lock the geometry.
- **ON / OFF** preview buttons, plus copy / paste style, duplicate and restore defaults.
- Rooms are shown in the swipe preview between views. On phones, tapping a room in edit mode zooms in on it and centres it.

**Flow (new)**

- Animated arrows that show energy, water or anything else flowing, driven by an entity value. Add one from **Edit menu → Flow**. The entity is picked (or changed) with a search in the Flow editor, and a Flow can also have no entity.
- The same entity can have any number of Flows, each with its own position and style. **Duplicate Flow** makes a copy.
- Shapes: Chevron, Arrow, Arrowhead, Triangle and Segment.
  - **Sharpness** goes from 10 to 300 %.
  - Frame length and width, arrow length, shaft thickness and count (up to 12) are adjustable.
  - Spacing can be negative, so arrows can overlap.
  - Rotation is free.
- Direction is fixed (right, left, up, down) or follows the sign (+ / −). Each side has its own direction and colour, and **Separate style for −** gives the negative side its own shape, size, outline, glow, opacity and animation.
- **Activity threshold**: a Flow is inactive when |value| ≤ threshold, for example no solar arrows at 0 W at night. It is either dimmed or hidden completely; in edit mode a hidden Flow keeps a dashed frame so you can still click it.
- Colours: fill, outline (thickness and colour), glow with an optional separate colour, and opacity.
- Animations:
  - **Pulse**.
  - **Flow**: a continuous stream at a constant speed in px/s, where 1× = 150 px/s. Count, size and spacing do not change the speed, so two Flows of one entity move identically.
  - **Speed follows value**.
  - **Apply this animation to the other Flows of this entity**.
- The editor works like the marker editor: collapsible sections, a reset button on every slider, restore defaults, geometry lock, and copy / paste style (Flow → Flow). Corner handles resize the frame. Flows scale with the scene.

**Markers**

- **Value colours** (optional): two thresholds make three ranges, each with its own colour, with an optional smooth blend. They can colour the icon, value, background, border and Gauge/Horseshoe arc, and each range can have its own icon.
- **Tap in view** is available for every marker, with the same names as rooms: More info, Toggle ON/OFF (only where there is something to toggle) and **No action** (new).
- **Rotation**: rotate a marker in steps or smoothly.
- The **Name** and **State** text can be moved left / right as well as up / down (Badge, Icon, Gauge, Horseshoe).
- ON / OFF preview buttons in every section whose look depends on the state. Leaving edit mode returns to the real state and 100 % zoom.
- **Copy / paste style** also copies the icon choice (source, custom MDI icon, ON/OFF icons) and the tap action.
- Markers and Flows saved outside the scene are brought back to its edge; **Show in view** brings a marker back.

**Editing tools**

- New **Snap & grid** menu (magnet icon, in edit mode):
  - grid with S / M / L size;
  - **Background bounds** keeps markers, Flows and rooms fully inside the image (on by default);
  - alignment guides on/off;
  - snap to markers, Flows, rooms and background;
  - snap by centres and/or edges.
- Alignment guides behave the same for markers, Flows and rooms, wherever the drag starts. Blue lines are elements, amber lines are rooms (box, centre and corners of irregular walls) and green lines are the background. **Alt** disables snapping on desktop.
- **Align selected** to the left, right, top or bottom background edge, or centre it horizontally or vertically.
- **Rotate selected**: ±15°, ±90°, reset, or a smooth slider.
- Selection colours by type: marker cyan, Flow violet, room amber. Other elements show dimmer dashed outlines in the same colours.
- Lighter, sparser grid (every 10 %). Precise alignment now comes from the guides.
- Geometry lock in the header of every editor (marker, Flow, room).
- Phones:
  - tapping a marker, Flow or room zooms in and centres it above the bottom editor;
  - the view no longer shows an empty frame below the background;
  - the scene has no frame while editing;
  - room corners can be dragged smoothly.
- **Integrations** has its own toolbar button (puzzle icon). **Added to view** is grouped into Markers, Flows and Rooms, each with **Show** and **Remove from view**.

**Views and backgrounds**

- New **view menu**: a bottom sheet on phones and a dropdown on desktop.
  - Main page: four icons (Add view, Rename, Duplicate, Set as start view) and two tiles, **Background** and **Options**.
  - **Options**: swipe between views, default Home Assistant panel, Delete view (with confirmation and **Undo**).
- Reorder view tabs by dragging (on touch: long-press, then drag). The start view has a home icon on its tab.
- **Swipe between views** on phones, with a choice of **Slide** or **Cube** (3D), or off (tabs only).
  - The next view is prepared in advance (background, markers, Flows and rooms with live values), so nothing loads while you swipe.
  - Whether a swipe switches views depends on its direction and speed.
  - In a panorama the image scrolls first, then the next view comes in.
  - Gestures are much more robust inside the Home Assistant app.
- **Night background** per view: a second image of the same size that lies exactly over the day image and crossfades in.
  - Mode: **Auto**, **Always day** or **Always night**.
  - Auto uses `sun.sun` by default (`below_horizon` = night). Any other entity can be used: the states `on`, `true`, `night` and `below_horizon` mean night.
- **Brightness** of the day and the night image (30–200 %). It is a GPU filter on the image only, so markers and animations are not slowed down.
- **Colour background**:
  - palette colour;
  - formats 16:9, 4:3, 1:1, 3:4, 9:16 and 21:9, or a custom width × height;
  - size set by dragging handles on the screen;
  - the colour canvas now fits the screen completely, like an image.
- **Background files** manager:
  - thumbnails that show the whole image, with size and where each file is used (view · day / night, beta);
  - set as this view's day or night background, rename, download or delete;
  - **Remove unused**;
  - files used by HA Views Beta are protected and can be removed only after an explicit warning;
  - deleting backgrounds is done only here.
- Uploaded backgrounds keep their original file name (Polish letters and spaces included). Only a name that is already taken gets " (2)", so an existing file is never overwritten. Renaming keeps the file's extension and updates all views.
- Choosing an existing background shows a full preview first, with **Cancel** and **Set background**.

**Home Assistant**

- **Viewer mode**: Home Assistant users who are not administrators can open the panel. Editing views, markers and backgrounds, and controlling entities, is blocked, also on the server. If permissions cannot be confirmed, HA Views safely stays read-only.
- **Default Home Assistant panel** option: HA Views for my account (all devices) or this device only. An invalid saved panel is repaired automatically.
- Multi-device sync:
  - saves are checked against the layout revision;
  - concurrent changes from two devices are merged field by field instead of overwriting each other;
  - an open page picks up changes from other devices every 20 s and when you return to it;
  - in edit mode, changes are loaded in place.
- Large installations: entity and device registries bigger than 4 MB no longer fail with `MESSAGE_TOO_BIG`. The WebSocket message limit is now 128 MB.

**Interface, performance and language**

- Faster start: layout, backgrounds, permissions and states load in parallel. There are no flashes of the background picker or of red icons, and a 5 s safety net always shows the view.
- Smooth Flow animations even with frequent state updates. Unchanged Flows are no longer rebuilt.
- The top bar is lower (44 px), which leaves more room for the view. The active view tab is shown in bold white.
- About 150 more English translations: the Flow editor, marker options, confirmations, welcome screen, backgrounds and errors. Tooltips, labels and placeholders are translated too. Entity names are never translated.
- Popups have no inline hints for now, which keeps them compact.

### Polski

**Przed aktualizacją**

- Jak przy każdej aktualizacji dodatku zrób backup Home Assistant.
- Układy, widoki, markery i tła z 0.4.0 zostają i wczytują się bez zmian. Nic nie trzeba migrować.
- Stabilny dodatek zapisuje układ w `/config/ha_views/rewrite_state.json`. HA Views Beta, z osobnego repozytorium beta, ma własny `rewrite_state_beta.json`. Obie wersje używają wspólnego folderu teł.
- Użytkownicy Home Assistant bez uprawnień administratora widzą teraz panel HA Views w trybie **tylko do odczytu** (opis niżej).

**Pomieszczenia (nowość)**

- Rysujesz dowolny kształt pokoju na planie, także L, schody czy skosy. Otwórz **menu edycji → Pomieszczenie**, klikaj kolejne narożniki, a na koniec kliknij pierwszy punkt albo **Gotowe**. **Cofnij punkt** usuwa ostatni narożnik.
- Podczas rysowania narożniki przyciągają się do narożników innych pomieszczeń, do markerów, Flow, tła i siatki, z liniami pomocniczymi. **Alt** na komputerze wyłącza przyciąganie.
- Pomieszczenie świeci miękką poświatą, gdy włączona jest dowolna z jego encji: światło, gniazdko, ruch, drzwi… Płynnie się zapala i gaśnie.
- Encje dodaje się wyszukiwarką po wszystkich encjach Home Assistant.
- W sekcji **Wygląd** są kolor, intensywność i miękkość krawędzi. Opcja **Kolor zależny ON/OFF** daje osobny kolor i intensywność dla ON i OFF, więc wyłączony pokój może mieć własny odcień zamiast znikać.
- **Dotknięcie w widoku** może przełączać wszystkie światła i gniazdka pokoju (gdy któreś świeci, gasi wszystkie, inaczej zapala; zmiana widać od razu), otwierać Więcej informacji albo nic nie robić.
- Edycja kształtu:
  - przeciąganie narożników (także palcem na telefonie);
  - mały uchwyt w połowie krawędzi dodaje narożnik;
  - dwuklik usuwa narożnik;
  - przeciągnięcie wnętrza przesuwa całe pomieszczenie;
  - blokada geometrii.
- Przyciski podglądu **ON / OFF**, a także kopiuj / wklej styl, duplikuj i przywróć domyślne.
- Pomieszczenia są widoczne w podglądzie przy przesuwaniu między widokami. Na telefonie kliknięcie pomieszczenia w edycji przybliża je i centruje.

**Flow (nowość)**

- Animowane strzałki pokazujące przepływ energii, wody czy czegokolwiek, sterowane wartością encji. Dodajesz je z **menu edycji → Flow**. Encję wybiera się (lub zmienia) wyszukiwarką w edytorze Flow, a Flow może też być bez encji.
- Ta sama encja może mieć dowolnie wiele Flow, każdy z własną pozycją i stylem. **Duplikuj Flow** tworzy kopię.
- Kształty: Chevron, Strzałka, Grot, Trójkąt i Segment.
  - **Ostrość** ma zakres 10–300 %.
  - Regulujesz długość i szerokość ramki, długość strzałki, grubość trzonu i liczbę (do 12).
  - Odstęp może być ujemny, więc strzałki mogą na siebie nachodzić.
  - Obrót jest dowolny.
- Kierunek jest stały (prawo, lewo, góra, dół) albo zależy od znaku (+ / −). Każda strona ma własny kierunek i kolor, a **Osobny styl dla −** daje minusowi własny kształt, rozmiar, obrys, poświatę, krycie i animację.
- **Próg aktywności**: Flow jest nieaktywny, gdy |wartość| ≤ próg, np. bez strzałek fotowoltaiki przy 0 W w nocy. Jest wtedy przygaszony albo całkiem ukryty; w edycji ukryty Flow ma przerywaną ramkę, żeby dało się go kliknąć.
- Kolory: wypełnienie, obrys (grubość i kolor), poświata z opcjonalnym osobnym kolorem oraz krycie.
- Animacje:
  - **Pulsowanie**.
  - **Przepływ**: ciągły strumień o stałej prędkości w px/s, gdzie 1× = 150 px/s. Liczba, rozmiar i odstęp nie zmieniają tempa, więc dwa Flow jednej encji jadą identycznie.
  - **Tempo od wartości**.
  - **Ustaw tę animację w pozostałych Flow tej encji**.
- Edytor działa jak edytor markerów: zwijane sekcje, reset przy każdym suwaku, przywróć domyślne, blokada geometrii oraz kopiuj / wklej styl (Flow → Flow). Narożne uchwyty zmieniają rozmiar ramki. Flow skaluje się razem ze sceną.

**Markery**

- **Kolory wg wartości** (opcjonalne): dwa progi dzielą wartość na trzy zakresy z własnym kolorem, opcjonalnie z płynnym przejściem. Kolorować można ikonę, wartość, tło, ramkę i łuk Gauge/Podkowy, a każdy zakres może mieć własną ikonę.
- **Dotknięcie w widoku** jest dostępne dla każdego markera, z tymi samymi nazwami co w pomieszczeniach: Więcej informacji, Przełącz ON/OFF (tylko gdy jest co przełączyć) i **Brak akcji** (nowość).
- **Obrót**: marker obracasz skokowo albo płynnie.
- Tekst **Nazwy** i **Stanu** przesuwa się teraz także w lewo / prawo, a nie tylko w górę / dół (Badge, Ikona, Gauge, Podkowa).
- Przyciski podglądu ON / OFF są w każdej sekcji, której wygląd zależy od stanu. Po wyjściu z edycji wraca rzeczywisty stan i zoom 100 %.
- **Kopiuj / wklej styl** przenosi też wybór ikony (źródło, własna ikona MDI, ikony ON/OFF) i dotknięcie w widoku.
- Markery i Flow zapisane poza sceną wracają na jej krawędź; **Pokaż w widoku** przywraca marker.

**Narzędzia edycji**

- Nowe menu **Przyciąganie i siatka** (ikona magnesu, w trybie edycji):
  - siatka w rozmiarze S / M / L;
  - **Granice tła** trzymają markery, Flow i pomieszczenia w całości na obrazie (domyślnie włączone);
  - linie pomocnicze włącz/wyłącz;
  - przyciąganie do markerów, Flow, pomieszczeń i tła;
  - przyciąganie po środkach i/lub krawędziach.
- Linie pomocnicze działają tak samo dla markerów, Flow i pomieszczeń, niezależnie od miejsca rozpoczęcia przeciągania. Niebieskie linie to elementy, bursztynowe to pomieszczenia (obrys, środek i narożniki nieregularnych ścian), zielone to tło. **Alt** na komputerze wyłącza przyciąganie.
- **Wyrównaj zaznaczony** do lewej, prawej, górnej lub dolnej krawędzi tła albo wyśrodkuj go w poziomie lub pionie.
- **Obróć zaznaczony**: ±15°, ±90°, reset albo płynny suwak.
- Kolory zaznaczenia zależne od rodzaju: marker niebieski, Flow fioletowy, pomieszczenie bursztynowe. Pozostałe elementy mają słabsze przerywane obrysy w tych samych kolorach.
- Siatka jest delikatniejsza i rzadsza (co 10 %). Dokładne wyrównanie dają teraz linie pomocnicze.
- Blokada geometrii jest w nagłówku każdego edytora (marker, Flow, pomieszczenie).
- Telefon:
  - kliknięcie markera, Flow albo pomieszczenia przybliża je i centruje nad dolnym edytorem;
  - widok nie pokazuje pustej ramki pod tłem;
  - scena w edycji jest bez ramki;
  - narożniki pomieszczeń przeciąga się płynnie.
- **Integracje** mają własny przycisk w górnym pasku (ikona puzzla). **Dodane do widoku** jest podzielone na Markery, Flow i Pomieszczenia, a każdy element ma **Pokaż** i **Usuń z widoku**.

**Widoki i tła**

- Nowe **menu widoku**: na telefonie dolny panel, na komputerze rozwijane okno.
  - Strona główna: cztery ikony (Dodaj widok, Zmień nazwę, Duplikuj, Ustaw jako startowy) i dwa kafelki, **Tło** i **Opcje**.
  - **Opcje**: przełączanie palcem, domyślny panel Home Assistant, Usuń widok (z potwierdzeniem i **Cofnij**).
- Kolejność zakładek zmieniasz przeciąganiem (na dotyku: przytrzymaj i przeciągnij). Widok startowy ma ikonę domku na zakładce.
- **Przełączanie widoków palcem** na telefonie: **Przesunięcie** albo **Kostka** (3D), albo wyłączone (tylko zakładki).
  - Następny widok jest przygotowany zawczasu (tło, markery, Flow i pomieszczenia z aktualnymi wartościami), więc w trakcie ruchu nic się nie doczytuje.
  - O przełączeniu decydują kierunek i prędkość palca.
  - W panoramie najpierw przewija się obraz, potem wjeżdża kolejny widok.
  - Gesty są dużo odporniejsze w aplikacji Home Assistant.
- **Tło nocne** dla widoku: drugi obraz tego samego rozmiaru, który leży dokładnie na dziennym i płynnie się przenika.
  - Tryb: **Auto**, **Zawsze dzień** albo **Zawsze noc**.
  - Auto domyślnie korzysta z `sun.sun` (`below_horizon` = noc). Można podać dowolną inną encję: stany `on`, `true`, `night` i `below_horizon` oznaczają noc.
- **Jasność** obrazu dziennego i nocnego (30–200 %). To filtr na karcie graficznej działający tylko na obraz, więc markery i animacje nie zwalniają.
- **Tło w kolorze**:
  - kolor z palety;
  - formaty 16:9, 4:3, 1:1, 3:4, 9:16 i 21:9 albo własna szerokość × wysokość;
  - rozmiar ustawiany uchwytami na ekranie;
  - kolorowe płótno mieści się teraz w całości na ekranie, tak jak obraz.
- Manager **Pliki tła**:
  - miniatury pokazujące cały obraz, z rozmiarem i miejscem użycia każdego pliku (widok · dzień / noc, beta);
  - ustaw jako tło dzienne lub nocne tego widoku, zmień nazwę, pobierz albo usuń;
  - **Usuń nieużywane**;
  - pliki używane przez HA Views Beta są chronione i można je usunąć dopiero po wyraźnym ostrzeżeniu;
  - tła usuwa się tylko tutaj.
- Wgrywane tło zachowuje oryginalną nazwę pliku (także polskie znaki i spacje). Tylko zajęta nazwa dostaje „(2)”, więc istniejący plik nigdy nie jest nadpisywany. Zmiana nazwy zachowuje rozszerzenie i poprawia wszystkie widoki.
- Wybór istniejącego tła najpierw pokazuje pełny podgląd z przyciskami **Anuluj** i **Ustaw tło**.

**Home Assistant**

- **Tryb podglądu (Viewer mode)**: użytkownicy Home Assistant bez uprawnień administratora mogą otwierać panel. Edycja widoków, markerów i teł oraz sterowanie encjami są zablokowane, także po stronie serwera. Gdy nie da się potwierdzić uprawnień, HA Views bezpiecznie zostaje w trybie tylko do odczytu.
- Opcja **Domyślny panel Home Assistant**: HA Views dla mojego konta (wszystkie urządzenia) albo tylko dla tego urządzenia. Błędnie zapisany panel jest naprawiany automatycznie.
- Synchronizacja między urządzeniami:
  - zapisy są sprawdzane numerem wersji układu;
  - równoczesne zmiany z dwóch urządzeń są łączone pole po polu zamiast się nadpisywać;
  - otwarta strona wczytuje zmiany z innych urządzeń co 20 s i przy powrocie na ekran;
  - w trybie edycji zmiany są wczytywane na miejscu.
- Duże instalacje: rejestry encji i urządzeń większe niż 4 MB nie kończą się już błędem `MESSAGE_TOO_BIG`. Limit wiadomości WebSocket wynosi teraz 128 MB.

**Interfejs, wydajność i język**

- Szybszy start: układ, tła, uprawnienia i stany ładują się równolegle. Nie ma mignięć panelu wyboru tła ani czerwonych ikon, a zabezpieczenie po 5 s zawsze pokazuje widok.
- Płynne animacje Flow także przy częstych aktualizacjach stanu. Niezmienione Flow nie są przebudowywane.
- Górny pasek jest niższy (44 px), więc widok ma więcej miejsca. Aktywna zakładka widoku jest białą, pogrubioną nazwą.
- Około 150 nowych tłumaczeń angielskich: edytor Flow, opcje markerów, potwierdzenia, ekran powitalny, tła i komunikaty błędów. Tłumaczone są też podpowiedzi, etykiety i placeholdery. Nazwy encji nigdy nie są tłumaczone.
- Popupy na razie nie mają podpowiedzi w treści, dzięki czemu są zwarte.

## 0.3.3

### English

- Released the latest marker editor improvements: Icon and Horseshoe types, reliable marker sizing and resizing, element scale up to 5×, improved mobile editing, entity search and ON/OFF toggle support.
- Refined editing handles and selection frame; stable add-on is now named **HA Views**.

### Polski

- Wydano aktualne usprawnienia edytora markerów: typy Ikona i Podkowa, większy oraz pewniejszy rozmiar markerów, skala elementów do 5×, ulepszenia edycji mobilnej, wyszukiwanie encji i obsługa przełączania ON/OFF.
- Dopracowano uchwyty i ramkę zaznaczenia; stabilny dodatek nosi teraz nazwę **HA Views**.

# Changelog

## 0.3.2

### English

- Added Icon and Horseshoe marker types; the marker-type selector now uses four icons in one row.
- Refined Horseshoe defaults: clean arc without ticks, approved text layout and independent arc size.
- Fixed smooth mobile marker sliders, label controls and icon centring.
- Icon X/Y offsets now work correctly.

### Polski

- Dodano typy markerów Ikona i Podkowa; wybór typu ma cztery ikony w jednym rzędzie.
- Dopracowano domyślne ustawienia Podkowy: łuk bez podziałki, zatwierdzony układ tekstów oraz niezależny rozmiar łuku.
- Naprawiono płynne suwaki markerów na telefonie, regulację nazwy i centrowanie ikony.
- Przesunięcia ikony X/Y działają poprawnie.

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