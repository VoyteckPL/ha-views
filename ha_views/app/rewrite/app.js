const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const uid = () => `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
// Markers are keyed by their own id (layout v3); the HA entity is marker.entityId, so one entity can appear on a view many times.
// Layouts from before v3 used the entity id as the key — those keys stay valid ids, nothing is moved.
const markersForEntity = (entityId, entities = model.entities) => Object.values(entities || {}).filter(marker => marker.entityId === entityId);
const markerForEntity = (entityId, entities = model.entities) => entities?.[entityId]?.entityId === entityId ? entities[entityId] : markersForEntity(entityId, entities)[0];
const markerNode = key => $(`.marker[data-marker-id="${CSS.escape(String(key || ''))}"]`);
const DESIGN_WIDTH = 1600;
const ACTIVE_VIEW_CACHE_KEY = 'ha-views:last-active-view';

let uiLanguage = 'en';
const TRANSLATIONS = {
  en: {
    'Widoki':'Views','Integracje':'Integrations','Zacznij tworzyć pierwszy widok':'Start your first view','Stwórz wizualny pulpit w trzech prostych krokach.':'Create a visual dashboard in three quick steps.','Wybierz obraz albo kolor tła.':'Choose an image or a background colour.','Otwórz Integracje i dodaj encję.':'Open Integrations and add an entity.','Użyj Edytuj, aby ustawić i ostylować marker.':'Use Edit to position and style the marker.','Wgraj obraz':'Upload image','Kolor tła':'Background colour','Zacznij z kolorem':'Start with colour','Nowy widok':'New view','Podaj krótką nazwę nowego widoku.':'Enter a short name for the new view.','Wpisz nową nazwę.':'Enter a new name.','Zapisz':'Save','Usunąć widok?':'Delete view?','Usuń widok':'Delete view','Kopia zachowa tło, markery i wszystkie ich ustawienia.':'The copy will keep the background, markers and all their settings.','Duplikuj':'Duplicate','Przywrócić styl domyślny?':'Restore default style?','Obecne ustawienia wyglądu markera zostaną zastąpione.':'The current marker appearance settings will be replaced.','Przywróć':'Restore','Usunąć marker?':'Remove marker?','Usuń':'Remove','Anuluj':'Cancel','Skopiowano styl':'Style copied','Dodaj pierwszą encję':'Add your first entity','Otwórz menu Integracje u góry i wybierz encję, którą chcesz umieścić na tym widoku.':'Open the Integrations menu above and choose an entity to place on this view.','Ustawienia':'Settings','Język':'Language','Edytuj widok':'Edit view','Siatka':'Grid','Wielkość siatki':'Grid size','Zarządzaj tłem':'Manage background','Tło':'Background','Format koloru':'Colour canvas format','Dodaj widok':'Add view','Zmień nazwę':'Rename','Duplikuj widok':'Duplicate view','Usuń widok':'Delete view','Wgraj obraz':'Upload image','Usuń tło':'Delete background','Własny kolor RGB…':'Custom RGB colour…','Wgrywanie tła…':'Uploading background…','Mała':'Small','Średnia':'Medium','Duża':'Large','Bardzo duża':'Very large','Zarządzaj widokami':'Manage views','Nowy widok':'New view','Zmień nazwę widoku':'Rename view','Duplikuj widok':'Duplicate view','Usuń widok':'Delete view',
    'Łączenie…':'Connecting…','Siatka włączona':'Grid enabled','Siatka wyłączona':'Grid disabled','Wybierz tło':'Select background','Wgraj obraz':'Upload image','Usuń tło':'Delete background','Zarządzaj tłem':'Manage background','Edytuj widok':'Edit view','Zakończ edycję':'Finish editing',
    'Tło widoku HA Views':'HA Views view background','Wgraj tło widoku':'Upload view background','Tło':'Background','Kolor':'Colour','Obraz':'Image','Dodaj pierwszą encję':'Add your first entity','Otwórz integracje':'Open integrations','Otwórz menu':'Open the','u góry i wybierz encję, którą chcesz umieścić na tym widoku.':'menu above and choose an entity to place on this view.','Wybierz obraz albo kolor tła, aby zacząć.':'Choose an image or a background colour to begin.','Zacznij tworzyć pierwszy widok':'Start your first view','Stwórz wizualny pulpit w trzech prostych krokach.':'Create a visual dashboard in three quick steps.','Wybierz obraz albo kolor tła.':'Choose an image or a background colour.','Otwórz':'Open','i dodaj encję.':'and add an entity.','Użyj':'Use','aby ustawić i ostylować marker.':'to position and style its marker.','Wgraj obraz':'Upload image','Kolor tła':'Background colour','Zacznij z kolorem':'Start with colour','Dodane do widoku':'Added to view','Encje widoczne na scenie':'Entities visible on the scene','Integracje Home Assistant':'Home Assistant integrations','Tylko aktywne integracje widoczne w HA':'Only active integrations visible in HA','Odśwież':'Refresh',
    'Marker':'Marker','Ustaw domyślny':'Restore defaults','Kopiuj styl':'Copy style','Wklej styl':'Paste style','Usuń z widoku':'Remove from view','Zamknij':'Close','Wersja aplikacji HA Views':'HA Views app version',
    'Encja':'Entity','Rozmiar':'Size','Stan':'State','Nazwa':'Name','Ikona':'Icon','Tło':'Background','Ramka':'Border','Aktualny stan':'Current state','Historia':'History','Atrybuty':'Attributes','Wczytywanie…':'Loading…','Potwierdzenie':'Confirmation','Anuluj':'Cancel','Potwierdź':'Confirm',
    'Automatyczna':'Automatic','Brak wody':'No water','Energia domu':'Home energy','Pompa ciepła':'Heat pump','Drzwi otwarte':'Door open','Drzwi zamknięte':'Door closed','Okno otwarte':'Window open','Okno zamknięte':'Window closed',
    'Dodaj':'Add','Pokaż':'Show','Usuń':'Remove','Pozostałe integracje':'Other integrations','używane':'used','Zapisano':'Saved','Brak danych':'No data','Niedostępne':'Unavailable','Nieznany':'Unknown',
    'Przyciąganie do siatki włączone':'Snap to grid enabled','Przyciąganie do siatki wyłączone':'Snap to grid disabled','Dodano nowy widok':'New view added','Zmieniono nazwę widoku':'View renamed','Zmieniono kolejność widoków':'View order updated','Ustawiono widok startowy':'Startup view set','Kolejność widoków':'View order','Przesuń widok w lewo':'Move view left','Przesuń widok w prawo':'Move view right','Ustaw jako widok startowy':'Set as startup view','Widok startowy':'Startup view','Blokada geometrii':'Geometry lock','Efekt światła':'Light effect','Jednolity':'Solid','Centralny':'Center','Róg':'Corner','Od ściany':'From wall','Ambient':'Ambient','Pozycja pozioma':'Horizontal position','Pozycja pionowa':'Vertical position','Rozproszenie':'Spread','Wypełnienie':'Fill','Kierunek':'Direction','Pozycja na ścianie':'Position on wall','Lewa':'Left','Prawa':'Right','Góra':'Top','Dół':'Bottom','Utworzono kopię widoku':'View duplicated','Usunięto widok':'View deleted','Przywrócono domyślne dopasowanie tła':'Default background fit restored','Przywrócono styl domyślny':'Default style restored','Wklejono kompletny styl 1:1':'Full style pasted 1:1',
    'Dodano do widoku':'Added to view','Usunięto z widoku':'Removed from view','Usunięto tło':'Background deleted','Skopiowano styl':'Style copied','Nie udało się wczytać układu:':'Could not load layout:',
    'Jednostka':'Unit','Zaokrąglenie':'Rounding','Skala elementów':'Element scale','Oba wymiary':'Both dimensions','Dotknięcie w widoku':'Tap in View','Więcej informacji':'More info','Przełącz ON/OFF':'Toggle ON/OFF','Tekst ON':'ON text','Tekst OFF':'OFF text','Pokaż':'Show','Kolor':'Colour','Przezrocz.':'Opacity','Przezroczystość':'Opacity','Przezroczystość ON':'ON opacity','Przezroczystość OFF':'OFF opacity','Przezroczystość obrysu':'Outline opacity','Przezroczystość obrysu ON':'ON outline opacity','Przezroczystość obrysu OFF':'OFF outline opacity','Kolor zależny ON/OFF':'Colour depends on ON/OFF','Przezroczystość zależna ON/OFF':'Opacity depends on ON/OFF','Ikona zależna ON/OFF':'Icon depends on ON/OFF','Tło zależne ON/OFF':'Background depends on ON/OFF','Ramka zależna ON/OFF':'Border depends on ON/OFF','Obrys zależny ON/OFF':'Outline depends on ON/OFF','Ikona podstawowa':'Base icon','Ikona ON':'ON icon','Ikona OFF':'OFF icon','Szerokość':'Width','Wysokość':'Height','Grubość':'Thickness','Źródło':'Source','Z encji Home Assistant':'From Home Assistant entity','Logo integracji':'Integration logo','Własna ikona MDI':'Custom MDI icon','Brak danych':'No data','Zakres i wartość':'Range and value','Minimum':'Minimum','Maksimum':'Maximum','Tor':'Track','Wartość':'Value','Geometria wskaźnika':'Gauge geometry','Skala':'Scale','Pozycja':'Position','Kąt start':'Start angle','Kąt koniec':'End angle','Podziałka':'Ticks','Pokaż ticki':'Show ticks','Co ile':'Interval','Offset':'Offset','Długość':'Length','Liczby skali':'Scale labels','Czcionka':'Font','Odsunięcie':'Offset','Włącz':'Enable','Start':'Start','Koniec':'End','Procent':'Percent','Własny kolor RGB…':'Custom RGB colour…','Brak dodatkowych atrybutów.':'No additional attributes.','Nie dodano jeszcze żadnych encji.':'No entities have been added yet.','Kliknij, aby wczytać encje.':'Click to load entities.','Dodaj do widoku':'Add to view','Encja jest wyłączona':'Entity is disabled','Dodano świeży Badge z ustawieniami domyślnymi':'Added a new Badge with default settings','Usunięto marker i wszystkie jego ustawienia':'Removed marker and all its settings','Połączono':'Connected','Błąd danych':'Data error','Na żywo':'Live','Ponowne łączenie…':'Reconnecting…','Bez tła':'No background','Błąd zapisu':'Save error','Błąd':'Error',
    "Encja i kierunek":"Entity and direction","Dodatkowe encje":"Extra entities","Inne encje związane z urządzeniem (np. ciśnienie, temperatura wody). Każda dostaje swoją sekcję i można ją ustawić jak rozgrupowaną część.":"Other entities of the device (e.g. pressure, water temperature). Each gets its own section and can be placed like an ungrouped part.","Dodaj encję":"Add entity","szukaj encji…":"search entities…","Wartość":"Value","Tekst przed wartością":"Text before the value","np. Ciśnienie:":"e.g. Pressure:","Urządzenie nie przyjęło zmiany":"The device did not accept the change","Zmienić tryb?":"Change mode?","Zmień":"Change","Presety":"Presets","Pokaż presety":"Show presets","Pokaż":"Show","Pytaj":"Ask","Wyżej":"Up","Niżej":"Down","Wszystkie przyciski":"All buttons","Jeden przycisk (następny tryb)":"One button (next mode)","Zaznacz, przy których zmianach zapytać przed wysłaniem.":"Tick which changes should ask before they are sent.","Komfort":"Comfort","Poza domem":"Away","Dom":"Home","Sen":"Sleep","Aktywność":"Activity","Ręczny":"Manual","Urlop":"Holiday","Ochrona przed mrozem":"Frost protection","Normalny":"Normal","Eko":"Eco","Elektryczny":"Electric","Gazowy":"Gas","Pompa ciepła":"Heat pump","Duże zużycie":"High demand","Wydajny":"Performance","Rozgrupuj":"Ungroup","Grupuj":"Group","Animacje":"Animations","Synchronizuj animacje":"Synchronise animations","Czas cyklu":"Cycle time","Kolor ikony":"Icon colour","Wypełnienie środka":"Centre fill","Efekt":"Effect","Stałe":"Steady","Oddychanie":"Breathing","Intensywność":"Intensity","Kolor":"Colour","Przezrocz.":"Opacity","Grubość":"Width","Przyciski":"Buttons","Zależne od stanu pracy":"By work state","Ikona zależna od stanu pracy":"Icon by work state","Ikony trybów":"Mode icons","Kolor aktywnego wg trybu":"Active colour by mode","Kolor aktywnego":"Active colour","Ramki przycisków":"Button frames","Stany pracy":"Work states","Zaznacz stany, których używa to urządzenie — tylko one pojawią się w ustawieniach stanu pracy.":"Tick the states this device uses — only they appear in the work state settings.","Potwierdzenie":"Confirmation","Pytaj przy włączeniu i wyłączeniu":"Ask before turning on and off","Wyłączyć?":"Turn off?","Włączyć?":"Turn on?","urządzenie zostanie wyłączone.":"the device will be turned off.","urządzenie zostanie włączone.":"the device will be turned on.","Wyłącz":"Turn off","Włącz":"Turn on","Mruganie":"Blink","Przygasanie":"Fade","Drganie":"Shake","Aktualna wartość":"Current value","Sterowanie":"Control","Stały kierunek":"Fixed direction","Kierunek wg znaku + / −":"Direction by sign + / −","Kierunek dla +":"Direction for +","Kierunek dla −":"Direction for −","Osobny styl dla −":"Separate style for −","Prawo":"Right","Lewo":"Left","Próg aktywności":"Activity threshold","Ukryj poniżej progu":"Hide below threshold","Flow jest nieaktywny, gdy |wartość| ≤ próg — np. próg 0 wyłącza strzałki fotowoltaiki przy 0 W w nocy. Nieaktywny Flow jest przygaszony i bez animacji albo, z opcją ukrywania, całkiem niewidoczny. W trybie edycji ukryty Flow ma tylko przerywaną ramkę, żeby dało się go kliknąć.":"Flow is inactive when |value| ≤ threshold — e.g. a threshold of 0 turns off the solar arrows at 0 W at night. An inactive Flow is dimmed without animation or, with hiding enabled, fully invisible. In edit mode a hidden Flow shows only a dashed frame so it can still be clicked.","Kształt":"Shape","Rodzaj":"Type","Chevron":"Chevron","Strzałka":"Arrow","Grot":"Arrowhead","Trójkąt":"Triangle","Segment":"Segment","Liczba":"Count","Grubość trzonu":"Shaft thickness","Rozmiar i pozycja":"Size and position","Odstęp":"Spacing","Korekta obrotu":"Rotation offset","Długość i szerokość to rozmiar ramki liczony względem kierunku strzałki. Liczba i odstęp rozkładają elementy wewnątrz ramki i nie zmieniają jej rozmiaru.":"Length and width are the frame size, measured along the arrow direction. Count and spacing arrange the items inside the frame and do not change its size.","Kolory i wygląd":"Colours and appearance","Kolor dla +":"Colour for +","Kolor dla −":"Colour for −","Obrys":"Outline","Kolor obrysu":"Outline colour","Poświata":"Glow","Osobny kolor poświaty":"Separate glow colour","Kolor poświaty":"Glow colour","Krycie":"Opacity","Animacja":"Animation","Typ":"Type","Brak":"None","Pulsowanie":"Pulse","Przepływ":"Flow","Tempo":"Speed","Tempo od wartości":"Speed follows value","Pełne tempo przy":"Full speed at","Wartość +":"Value +","Wartość −":"Value −","Styl dla +":"Style for +","Styl dla −":"Style for −","Styl wspólny dla + i −":"Shared style for + and −","Podgląd i edycja dla wartości dodatniej.":"Preview and editing for a positive value.","Podgląd i edycja dla wartości ujemnej.":"Preview and editing for a negative value.","Każda strona ma własny styl.":"Each side has its own style.","Kształt, rozmiar i animacja są wspólne — kolor jest osobny.":"Shape, size and animation are shared — only the colour is separate.","Kopiuj styl Flow":"Copy Flow style","Wklej styl Flow":"Paste Flow style","Usuń Flow":"Delete Flow","Dodaj Flow testowy":"Add Flow","Skopiowano styl Flow — wklej go w innym Flow":"Flow style copied — paste it into another Flow","Wklejono styl Flow":"Flow style pasted","Przywrócono domyślny Flow":"Flow defaults restored","Dodano Flow — przeciągnij go w trybie edycji":"Flow added — drag it in edit mode","Usunięto Flow":"Flow removed","Przywrócić domyślny Flow?":"Restore Flow defaults?","Obecne ustawienia wyglądu i działania Flow zostaną zastąpione domyślnymi. Pozycja i nazwa zostaną zachowane.":"The current Flow appearance and behaviour settings will be replaced with defaults. Position and name are kept.","Usunąć Flow?":"Delete Flow?","Kolor ON":"ON colour","Kolor OFF":"OFF colour","Kolor obrysu ON":"ON outline colour","Kolor obrysu OFF":"OFF outline colour","Grubość obrysu":"Outline thickness","Grubość obrysu ON":"ON outline thickness","Grubość obrysu OFF":"OFF outline thickness","Grubość ON":"ON thickness","Grubość OFF":"OFF thickness","Zależne ON/OFF":"Depends on ON/OFF","Przezrocz. ON":"ON opacity","Przezrocz. OFF":"OFF opacity","Lewo / prawo":"Left / right","Góra / dół":"Up / down","Prostokąt":"Rectangle","Zaokrąglony":"Rounded","Koło / owal":"Circle / oval","Gradient":"Gradient","Auto":"Auto","Monospace":"Monospace","Przywróć domyślną wartość":"Restore default value","Wybierz kolor":"Choose colour","Własny kolor":"Custom colour","Własny kolor RGB":"Custom RGB colour","Podaj kolor w formacie #RRGGBB.":"Enter a colour in #RRGGBB format.","Ustaw":"Set","Typ markera i jego ustawienia wyglądu zostaną zastąpione domyślnymi.":"The marker type and its appearance settings will be replaced with defaults.","Zmień":"Change","Nie można przełączyć encji w tym stanie.":"This entity cannot be toggled in its current state.","Stan encji nie został jeszcze potwierdzony.":"The entity state has not been confirmed yet.","Błąd encji":"Entity error","Błąd przełączania":"Toggle error","Nie udało się pobrać historii":"Could not load history","Pobierz tło":"Download background","Wybierz tło widoku":"Choose view background","Wgraj nowy obraz":"Upload a new image","Wybierz istniejące tło":"Choose an existing background","Wybierz istniejące tło…":"Choose an existing background…","Załaduj wybrane tło":"Load selected background","Wybierz kolor tła":"Choose background colour","Format kolorowego tła":"Colour background format","Usunąć tło?":"Delete background?","Zresetować dopasowanie tła?":"Reset background fit?","Skala, pozycja i tryb dopasowania tego tła wrócą do wartości domyślnych.":"Scale, position and fit mode of this background will return to defaults.","Resetuj":"Reset","Brak aktywnych integracji.":"No active integrations.","Brak encji.":"No entities.","Brak historii w wybranym okresie.":"No history in the selected period.","Brak pasujących encji.":"No matching entities.","Nie dodano jeszcze żadnych elementów.":"Nothing has been added yet.","Widok ogólny":"Overview",
    "Brak entity_id":"Missing entity_id","Brak entry_id":"Missing entry_id","Brak listy encji":"Missing entity list","Brak pliku":"No file","Dane muszą być obiektem JSON":"Data must be a JSON object","Dozwolone: PNG, JPG, JPEG, WEBP":"Allowed: PNG, JPG, JPEG, WEBP","Layout jest za duży":"Layout is too large","Layout musi być obiektem JSON":"Layout must be a JSON object","Nie znaleziono tła":"Background not found","Nieprawidlowa encja":"Invalid entity","Nieprawidłowy JSON":"Invalid JSON","Plik stylów jest za duży":"Style file is too large","Stan jest za duży":"State is too large","Stan musi być obiektem JSON":"State must be a JSON object",
    "Cofnij":"Undo","Przywrócono widok":"View restored","Usunięto widok":"View deleted","Widok jest pusty.":"The view is empty.","Usuń widok":"Delete view","Usunąć widok?":"Delete view?",
    "Długość ramki":"Frame length","Długość elementu":"Item length","Długość ramki i szerokość to rozmiar ramki liczony względem kierunku strzałki. Długość elementu to rozmiar jednej strzałki. Liczba i odstęp nie zmieniają ani ramki, ani kształtu strzałek — elementy są wyśrodkowane w ramce, a to, co się nie mieści, jest przycinane.":"Frame length and width are the frame size, measured along the arrow direction. Item length is the size of a single arrow. Count and spacing change neither the frame nor the arrow shape — items are centred in the frame and anything that does not fit is clipped.",
    "Duplikuj Flow":"Duplicate Flow","Utworzono kopię Flow — przeciągnij ją w wybrane miejsce":"Flow copy created — drag it where you want","Utworzono kopię markera — przeciągnij ją w wybrane miejsce":"Marker copy created — drag it where you want","Duplikuj marker":"Duplicate marker","Grupa":"Group","Wymiary":"Dimensions","Położenie":"Position","Przezrocz. obrysu":"Outline opacity","Zależne ON/OFF":"Depends on ON/OFF","Grubość ON":"Width ON","Grubość OFF":"Width OFF","Źródło":"Source","Z encji":"From entity","Logo integracji":"Integration logo","Własna ikona MDI":"Custom MDI icon","Kształt":"Shape","Kwadrat":"Square","Koło":"Circle","Dowolny":"Custom","Ramka":"Border","Podgląd stanu":"State preview","Grupuj ikonę, nazwę i stan":"Group icon, name and state","Ikona, nazwa i stan są jedną grupą ze wspólnym tłem. Układ, styl i wymiary ustawiasz niżej.":"Icon, name and state are one group with a shared background. Set the layout, style and dimensions below.","Na planie w trybie edycji możesz przeciągać grupę albo jej części palcem lub myszą.":"In edit mode you can drag the group or its parts on the plan with a finger or the mouse.","Jedno pod drugim":"Stacked","Obok siebie":"Side by side","Ikona z lewej":"Icon on the left","Ikona z prawej":"Icon on the right","Styl":"Style","Bez tła":"No background","Ciemne":"Dark","Jasne":"Light","Szkło":"Glass","Kolor pokoju":"Room colour","Wyrównanie":"Alignment","Do lewej":"Left","Do środka":"Centre","Do prawej":"Right","Rozmycie pod spodem":"Blur behind","Kolor ramki":"Border colour","Przezrocz. ramki":"Border opacity","Grubość ramki":"Border width","Margines":"Padding","Odstęp":"Gap","Rozmiar całości":"Overall size","Przesunięcie w grupie: poziomo":"Offset in group: horizontal","Przesunięcie w grupie: pionowo":"Offset in group: vertical","Ikona, nazwa i stan jako jeden element":"Icon, name and state as one element","Przeciągnięcie dowolnej części przesuwa całą etykietę.":"Dragging any part moves the whole label.","Ikona, nazwa i stan są osobno — każdą część przesuwasz na planie oddzielnie (linie pomocnicze pokazują krawędzie i środki pozostałych). Kropki na bokach zmieniają rozmiar ramki. Tło grupy obejmuje wszystkie części.":"Icon, name and state are separate — move each part on the plan (guides show the edges and centres of the others). The dots on the sides resize the frame. The group background covers all parts.","Efekt światła":"Light effect","Pozycja na ścianie":"Position on the wall","Kolor tła":"Background colour","Przezrocz. ON":"Opacity ON","Przezrocz. OFF":"Opacity OFF","Na planie w trybie edycji możesz przeciągać ikonę, nazwę i stan palcem albo myszą.":"In edit mode you can drag the icon, name and state on the plan with a finger or the mouse.","Pokaż ikonę":"Show icon","Pokaż nazwę":"Show name","Pokaż stan":"Show state","Kolor ikony ON":"Icon colour ON","Kolor ikony OFF":"Icon colour OFF","Kolor tekstu":"Text colour","Tło etykiety":"Label background","Przezrocz. tła":"Background opacity","Układ":"Layout","Pionowo":"Vertical","Poziomo":"Horizontal","Wł.":"On","Wył.":"Off","automatyczna":"automatic","Ikona, nazwa i stan rysowane na środku pomieszczenia. Dotknięcie etykiety działa jak dotknięcie pomieszczenia.":"Icon, name and state drawn in the middle of the room. Tapping the label works like tapping the room.","Dodaj do widoku":"Add to view","Wybierz wygląd dla tej encji":"Choose a look for this entity","Wybierz, co chcesz dodać":"Choose what you want to add","Dodano pomieszczenie":"Room added","Nazwa ikony":"Icon name","Encje ikony":"Icon entities","Zaznacz encje, od których zależy stan ikony — światło, włącznik, czujnik… Możesz wybrać kilka.":"Tick the entities the icon state depends on — a light, a switch, a sensor… You can pick several.","Wyszukaj i wybierz encje, od których zależy stan ikony (światło, włącznik, czujnik…).":"Search and pick the entities the icon state depends on (a light, a switch, a sensor…).","Ogólne":"General","Encje":"Entities","Dodano ikonę":"Icon added","Układ grupy":"Group layout","Zakres":"Range","Łuk":"Arc","Kąt":"Angle","Gradient: start":"Gradient: start","Gradient: koniec":"Gradient: end","Podziałka":"Ticks","Liczby skali":"Scale numbers","Procent":"Percent","Pokaż":"Show","Podkowa":"Horseshoe","Wybierz encję, od której zależy stan pomieszczenia — światło, włącznik, czujnik…":"Pick the entity the room state depends on — a light, a switch, a sensor…","Encja pomieszczenia":"Room entity","Gauge albo podkowa — moc, poziom, procent":"Gauge or horseshoe — power, level, percent","Wskaźnik":"Gauge","Wskaźniki i markery":"Gauges and markers","Wskaźniki":"Gauges","Etykiety":"Labels","Dodaj etykietę":"Add label","Więcej":"More","Światło":"Light","Usunąć etykietę?":"Remove label?","Usunięto etykietę":"Label removed","Duplikuj etykietę":"Duplicate label","Kopiuj styl etykiety":"Copy label style","Wklej styl etykiety":"Paste label style","Usuń etykietę":"Remove label","Siatka dashboardu":"Dashboard grid","Kolumny":"Columns","Wiersze":"Rows","Siatka dashboardu włączona — upuść grupę etykiety na kratki":"Dashboard grid on — drop a label group onto the cells","Siatka dashboardu wyłączona":"Dashboard grid off","Szerokość (kratki)":"Width (cells)","Wysokość (kratki)":"Height (cells)","Odepnij od siatki":"Unpin from grid","Przypnij do siatki":"Pin to grid","Siatka":"Grid","Format":"Format","Tło i ramka":"Fill & border","Widoczna jest jedna część — tło i ramka grupy nie są rysowane. Wrócą, gdy pokażesz drugą część.":"Only one part is shown — the group background and border are not drawn. They come back when you show a second part.","Dodano etykietę":"Label added","Utwórz etykietę":"Create label","Nazwa etykiety":"Label name","Encja etykiety":"Label entity","Wybierz encję, od której zależy stan etykiety — światło, włącznik, czujnik…":"Pick the entity the label state depends on — a light, a switch, a sensor…","Etykieta":"Label","Ta etykieta nie ma jeszcze encji — wybierz ją w trybie edycji":"This label has no entity yet — pick it in edit mode","Wygląd i akcja dotknięcia etykiety wrócą do domyślnych. Położenie, nazwa i encja zostaną.":"The look and tap action of the label go back to the defaults. Its position, name and entity stay.","Przywrócono domyślny wygląd etykiety":"Label look reset to default","Utworzono kopię etykiety":"Label copy created","Ikona, nazwa i stan w dowolnym miejscu":"Icon, name and state anywhere","Tło ikony":"Icon background","Ramka ikony":"Icon border","Domyślna":"Default","Ciągła":"Solid","Kreskowana":"Dashed","Kropkowana":"Dotted","Linia":"Line","Automatycznie":"Automatic","Koloruj stan":"Colour the state","Cień":"Shadow","Grubość czcionki":"Font weight","Normalna":"Normal","Średnia":"Medium","Pogrubiona":"Bold","Treść":"Content","Przezroczystość":"Opacity","Kolor ON":"Colour ON","Kolor OFF":"Colour OFF","Panel edycji":"Edit panel","Poświata pomieszczeń":"Room glow","Płynna (telefon)":"Smooth (phone)","Dokładna":"Exact","Po prawej":"On the right","Po lewej":"On the left","Rozmycie":"Blur","Tło grupy":"Group background","Domyślny układ grupy":"Default group layout","Ramki":"Frames","Jednakowe ramki":"Equal frames","Przywrócono domyślny wygląd ikony":"Icon look reset to default","Wygląd i akcja dotknięcia ikony wrócą do domyślnych. Położenie, nazwa i encje zostaną.":"The look and tap action of the icon go back to the defaults. Its position, name and entities stay.","Ta część jest ukryta — włączysz ją w sekcji Grupa.":"This part is hidden — turn it on in the Group section.","Co najmniej jedna część musi być widoczna":"At least one part must stay visible","Tekst":"Text","Co ma być widać?":"What should be shown?","Utwórz ikonę":"Create icon","Wybierz, co pokazać. Resztę zmienisz potem w panelu.":"Choose what to show. You can change the rest later in the panel.","Ta ikona nie ma jeszcze encji — wybierz je w trybie edycji":"This icon has no entities yet — pick them in edit mode","Utworzono kopię ikony":"Icon copy created","Encje pomieszczenia":"Room entities","Zaznacz encje, od których zależy stan pomieszczenia — światło, włącznik, czujnik… Możesz wybrać kilka.":"Tick the entities the room state depends on — a light, a switch, a sensor… You can pick several.","Wyszukaj i wybierz encje, od których zależy stan pomieszczenia (światło, włącznik, czujnik…).":"Search and pick the entities the room state depends on (a light, a switch, a sensor…).","Obszar ze stanem encji":"Area showing entity state","Nazwa pomieszczenia":"Room name","Co zapala to pomieszczenie?":"What lights up this room?","Dalej":"Next","Pomiń":"Skip","Wpisz nazwę, obszar albo entity_id.":"Type a name, area or entity_id.","Dodano pomieszczenie — encje możesz dodać w panelu":"Room added — you can add entities in the panel","Puste = nazwa automatyczna":"Empty = automatic name","Zaznacz encje (np. światła). Możesz wybrać kilka.":"Tick the entities (e.g. lights). You can pick several.","Szukaj encji":"Search entities","Wybierz encję dla tego elementu":"Choose an entity for this element","Zmień typ":"Change type","Wyszukaj i wybierz encje (np. światła), które zapalają to pomieszczenie.":"Search and pick the entities (e.g. lights) that light up this room.","Wybierz typ albo encję — kolejność dowolna":"Pick a type or an entity — in any order","Co dodać?":"What to add?","Encja":"Entity","— tylko encje liczbowe":"— numeric entities only","— opcjonalnie dla Pomieszczenia, Flow i Tekstu":"— optional for Room, Flow and Text","Szukaj: nazwa, obszar, entity_id…":"Search: name, area, entity_id…","Szukaj encji":"Search entities","Wszystkie":"All","Ostatnie":"Recent","Bez obszaru":"No area","Obszary":"Areas","Typy":"Types","Światła":"Lights","Przełączniki":"Switches","Czujniki":"Sensors","Czujniki binarne":"Binary sensors","Rolety":"Covers","Klimat":"Climate","Media":"Media","Inne":"Other","Wczytywanie encji…":"Loading entities…","Ten element nie potrzebuje encji.":"This element needs no entity.","Brak ostatnio dodanych encji.":"No recently added entities.","Brak pasujących encji.":"No matching entities.","na widoku":"on view","Pokazano":"Showing","zawęż wyszukiwanie":"narrow the search","Wybierz, co dodać":"Choose what to add","Wybierz typ":"Choose a type","Wybierz encję":"Choose an entity","Dodaj":"Add","Polecane":"Suggested","Zmień":"Change","Dla wartości liczbowych":"For numeric values","Bez encji":"No entity","Ikona":"Icon","Tekst / przycisk":"Text / button","Pomieszczenie":"Room","Światło, gniazdko, przełącznik":"Light, socket, switch","Temperatura, wilgotność, stan":"Temperature, humidity, state","Moc, poziom, procent":"Power, level, percent","Moc, bateria, zużycie":"Power, battery, usage","Obszar świeci od encji":"Area lit by an entity","Przepływ energii, wody":"Energy or water flow","Podpis, link do widoku, akcja":"Label, view link, action","Podpis":"Label","Przycisk":"Button","Wskaż miejsce na planie":"Pick the spot on the plan","Anuluj":"Cancel","Zamknij":"Close","Dotknij plan w miejscu, gdzie ma stanąć element":"Tap the plan where the element should go","Anulowano dodawanie":"Adding cancelled","Dodano":"Added","Dodano Flow":"Flow added","Poziom":"Level","Bateria":"Battery","Salon":"Living room",
    "Ostrość":"Sharpness",
    "Układ został zmieniony na innym urządzeniu — wczytano najnowszą wersję. Ostatnia zmiana z tego urządzenia nie została zapisana.":"The layout was changed on another device — the latest version was loaded. The last change from this device was not saved.","Układ zmieniono na innym urządzeniu":"Layout changed on another device","Wczytaj":"Load","Wczytano zmiany z innego urządzenia":"Loaded changes from another device","Ściemniaj tło wg słońca":"Dim the background with the sun","Jasność w nocy":"Night brightness","Zaczyna ściemniać, gdy słońce na":"Starts dimming with the sun at","Pełna noc, gdy słońce na":"Full night with the sun at","Chłodny odcień nocą":"Cool tint at night","Ściemnienie":"Dimming","słońce":"sun","Edycja":"Editing","Przenieś panel na drugą stronę":"Move the panel to the other side","Kliknij element, aby go edytować.":"Click an element to edit it.","Nowe elementy dodasz z menu plus lub z menu integracji.":"Add new elements from the plus menu or the integrations menu.","Usuń narożnik":"Remove corner","Ostatnia zmiana":"Last changed","7 dni":"7 days","Tekst / przycisk":"Text / button","Tekst":"Text","Tekst i akcja":"Text and action","Podpis":"Caption","Termostat":"Thermostat","Tarcza":"Dial","Temperatura ustawiona":"Target temperature","Przycisk −":"− button","Przycisk +":"+ button","Nazwa termostatu":"Thermostat name","Dodano termostat":"Thermostat added","Grubość łuku":"Arc width","Kolory trybów":"Mode colours","Poświata podczas pracy":"Glow while working","Kolor wg trybu":"Colour by mode","Szablony":"Templates","Szablon":"Template","Pusty":"Empty","Wczytaj szablon":"Load template","Usuń szablon":"Delete template","Zapisz aktualny układ jako szablon":"Save the current layout as a template","Zapisano szablon":"Template saved","Usunięto szablon":"Template deleted","Wczytano szablon":"Template loaded","Maks. 5 szablonów — usuń któryś koszem":"Max. 5 templates — delete one with the bin","Kolory stanu pracy":"Activity colours","Kropka temperatury aktualnej":"Current temperature dot","Uchwyt temperatury ustawionej":"Target temperature handle","Teksty":"Texts","Teksty trybów":"Mode texts","Tryb (stan)":"Mode (state)","Przywrócono domyślny wygląd termostatu":"Thermostat look restored to default","Utwórz termostat":"Create thermostat","Utwórz tekst":"Create text","Ogrzewanie / klimatyzacja — temperatura, tryby, sterowanie":"Heating / AC — temperature, modes, control","Grzanie":"Heat","Chłodzenie":"Cool","Grzanie / chłodzenie":"Heat / cool","Osuszanie":"Dry","Wentylator":"Fan","Wyłączony":"Off","Grzeje":"Heating","Nagrzewa":"Preheating","Chłodzi":"Cooling","Osusza":"Drying","Wentyluje":"Fan","Odmraża":"Defrosting","Bezczynny":"Idle","Ustawiona":"Target","Niedostępny":"Unavailable","Wył.":"Off","Błąd termostatu":"Thermostat error","Encja nie ma tego atrybutu":"The entity does not have this attribute","Atrybuty":"Attributes","Stan pracy (grzeje / bezczynny)":"Activity (heating / idle)","Temperatura aktualna":"Current temperature","Przyciski − / +":"− / + buttons","Tryby":"Modes","Zakres min / max":"Min / max range","Wilgotność":"Humidity","Preset":"Preset","Inne atrybuty":"Other attributes","Kolory":"Colours","Tor tarczy":"Dial track","Skala zawartości":"Content scale","Zaokrąglenie":"Corner radius","Akcja po dotknięciu":"Action on tap","Dodano tekst":"Text added","Napis z akcją — widok, strona HA, link":"Text with an action — view, HA page, link","Co ma się stać po dotknięciu tekstu w trybie przeglądania. Zmienisz to potem w panelu.":"What a tap on the text does in view mode. You can change it later in the panel.","Przejdź do widoku":"Go to view","Otwórz stronę Home Assistant":"Open a Home Assistant page","Otwórz link":"Open a link","Adres w HA":"HA path","Link":"Link","W nowej karcie":"In a new tab","Dodano tekst — przeciągnij go w wybrane miejsce":"Text added — drag it into place","Link do tego widoku":"Link to this view","Kopiuj link do widoku":"Copy link to this view","Skopiowano do schowka. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.":"Copied to the clipboard. It opens HA Views directly on this view — in a browser, a bookmark or a “navigate” action of another dashboard.","Skopiuj link. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.":"Copy the link. It opens HA Views directly on this view — in a browser, a bookmark or a “navigate” action of another dashboard.","OK":"OK","HA Views Beta":"HA Views Beta","stabilna wersja HA Views":"the stable HA Views","Beta":"Beta","Używane przez":"Used by","Usunąć tło używane przez drugą wersję?":"Delete a background used by the other version?","Zmienić nazwę tła używanego przez drugą wersję?":"Rename a background used by the other version?","Jasność":"Brightness","Przywróć 100%":"Reset to 100%","Widok":"View","Opcje":"Options","Obraz":"Image","Wgraj tło":"Upload background","Zmień nazwę pliku tła":"Rename background file","Auto — przełącza encja":"Auto — switched by the entity","Kolor zamiast obrazu":"Colour instead of an image","Wybór koloru zastąpi obraz":"Choosing a colour replaces the image","Tło w kolorze":"Colour background","Szerokość":"Width","Wysokość":"Height","Ustaw rozmiar na ekranie":"Set the size on screen","Przeciągnij kółka, aby ustawić rozmiar":"Drag the circles to set the size","Tło tego widoku":"This view's background","Ustaw jako tło tego widoku":"Use as this view's background","Tło nocne tego widoku":"This view's night background","Ustaw jako tło nocne tego widoku":"Use as this view's night background","Zmień nazwę":"Rename","Pobierz":"Download","Ustawiono tło widoku":"View background set","Zmień nazwę pliku tła?":"Rename background file?","Zmienić nazwę tła wersji stabilnej?":"Rename a stable-version background?","Zmień mimo to":"Rename anyway","Zmieniono nazwę tła":"Background renamed","Zmień":"Change","Używane w stabilnej wersji — usunięcie wymaga potwierdzenia":"Used by the stable version — deleting needs confirmation","Usunąć tło wersji stabilnej?":"Delete a stable-version background?","Usuń mimo to":"Delete anyway","Tego nie da się cofnąć.":"This cannot be undone.","Tryb tła":"Background mode","Automatycznie wg encji":"Automatic by entity","Zawsze dzień":"Always day","Zawsze noc":"Always night","Zawsze noc — encja nie jest używana":"Always night — the entity is not used","Zawsze dzień — encja nie jest używana":"Always day — the entity is not used","Pliki tła":"Background files","Usuń nieużywane":"Remove unused","plików":"files","plik":"file","pliki":"files","nieużywane":"unused","Nieużywane":"Unused","Stabilna":"Stable","noc":"night","dzień":"day","Używane w stabilnej wersji — usuń je tam":"Used by the stable version — remove it there","Usuń plik":"Delete file","Brak wgranych teł.":"No uploaded backgrounds.","Wczytywanie…":"Loading…","Usunąć plik tła?":"Delete background file?","Usunąć nieużywane tła?":"Remove unused backgrounds?","Usunięto plik tła":"Background file deleted","Tło nocne":"Night background","Bez tła nocnego":"No night background","Wgraj tło nocne":"Upload night background","Przełącza encja":"Switched by entity","Encja przełączająca tło nocne":"Entity that switches the night background","Dzień":"Day","Noc":"Night","Podgląd: dzień":"Preview: day","Podgląd: noc":"Preview: night","Podgląd tła":"Background preview","Teraz: noc":"Now: night","Teraz: dzień":"Now: day","podgląd":"preview","Najpierw ustaw tło dzienne":"Set the day background first","Ustawiono tło nocne":"Night background set","Wgrywanie…":"Uploading…","Intensywność ON":"ON intensity","Intensywność OFF":"OFF intensity","Obrót":"Rotation","Obróć zaznaczony":"Rotate selected","Obróć o 90° w lewo":"Rotate 90° left","Obróć o 15° w lewo":"Rotate 15° left","Obróć o 15° w prawo":"Rotate 15° right","Obróć o 90° w prawo":"Rotate 90° right","Bez obrotu":"No rotation","Obrót płynny":"Smooth rotation","Przyciąganie i siatka":"Snapping and grid","Linie pomocnicze":"Guides","Tylko elementy widoczne na ekranie":"Only elements visible on screen","Przyciągaj do":"Snap to","Tło (środek i krawędzie)":"Background (centre and edges)","Punkty":"Points","Wyrównuj po":"Align by","Środki":"Centres","Krawędzie":"Edges","Animacja":"Animation","Rodzaj":"Type","Obrót":"Spin","Pulsowanie":"Pulse","Miganie":"Blink","Kołysanie":"Swing","Czas cyklu":"Cycle time","Kierunek":"Direction","W prawo":"Clockwise","W lewo":"Counter-clockwise","Tylko gdy ON":"Only when ON","Prędkość z encji (%)":"Speed from entity (%)","Odstępy — pośrodku między dwiema etykietami i równe odstępy":"Spacing — exactly between two labels and equal gaps","Wyrównaj zaznaczony do tła":"Align selected to background","Do lewej krawędzi tła":"To the left edge","Wyśrodkuj w poziomie":"Centre horizontally","Do prawej krawędzi tła":"To the right edge","Do górnej krawędzi tła":"To the top edge","Wyśrodkuj w pionie":"Centre vertically","Do dolnej krawędzi tła":"To the bottom edge","Dodaj Flow":"Add Flow","Dodano Flow — wybierz encję albo zostaw bez encji":"Flow added — choose an entity or leave it without one","Usuń encję":"Remove entity","Podgląd: włączony":"Preview: on","Podgląd: wyłączony":"Preview: off","Tempo to stała prędkość strzałek (1× = 150 px/s) — nie zależy od rozmiaru, odstępu ani liczby, więc Flow z tym samym tempem jadą identycznie.":"Tempo is a constant arrow speed (1\u00d7 = 75 px/s) \u2014 it does not depend on size, spacing or count, so Flows with the same tempo move identically.","Ramka i pozycja":"Frame and position","Szerokość ramki":"Frame width","Strzałki":"Arrows","Długość strzałki":"Arrow length","Ramka to obszar Flow na planie, liczony wzdłuż kierunku strzałek. Szerokość ramki jest też wysokością strzałek. Uchwyty zaznaczenia zmieniają to samo.":"The frame is the Flow area on the plan, measured along the arrow direction. The frame width is also the arrow height. The selection handles change the same values.","W animacji „Przepływ” strzałki wypełniają całą ramkę, więc liczba nie ma znaczenia.":"With the “Flow” animation the arrows fill the whole frame, so the count does not matter.","Strzałki są wyśrodkowane w ramce; to, co się nie mieści, jest przycinane. Liczba i odstęp nie zmieniają ramki. Ujemny odstęp wsuwa strzałki jedna w drugą (gęściej).":"Arrows are centred in the frame; what does not fit is clipped. Count and spacing do not change the frame. A negative spacing nests the arrows into each other (denser).","Tempo pulsowania nie zależy od rozmiaru Flow.":"The pulse tempo does not depend on the Flow size.","Ustaw tę animację w pozostałych Flow tej encji":"Apply this animation to the other Flows of this entity","Ustawiono tę samą animację w innych Flow tej encji":"Same animation applied to other Flows of this entity","Granice tła":"Background bounds","Elementy nie wychodzą poza tło":"Elements stay inside the background","Elementy nie wyjdą poza tło":"Elements will stay inside the background","Elementy mogą wychodzić poza tło":"Elements may go outside the background","Edytuj ikonę":"Edit icon","Usuń ikonę":"Remove icon","Dodaj ikonę":"Add icon","Ikona pomieszczenia to zwykły marker typu Ikona z pełnym edytorem (kolory ON/OFF, obrys, tło, ramka, rozmiar, kolory wg wartości). Świeci, gdy pomieszczenie jest zapalone, a dotknięcie wykonuje akcję pomieszczenia.":"The room icon is a regular Icon marker with the full editor (ON/OFF colours, outline, background, border, size, colours by value). It is lit while the room is on, and tapping it runs the room action.","Dodano ikonę pomieszczenia — przeciągnij ją w wybrane miejsce":"Room icon added — drag it where you want it","Usunięto ikonę pomieszczenia":"Room icon removed","Markery":"Markers","Pomieszczenia":"Rooms","Markery, Flow i pomieszczenia tego widoku":"Markers, Flows and rooms of this view","Rozjaśnij — jak światło lampy: plan jaśnieje w kolorze poświaty, ciemne miejsca najmocniej.":"Lighten — like lamp light: the plan brightens in the glow colour, dark areas the most.","Miękkie światło — delikatne ocieplenie, plan zachowuje swoje kolory i kontrast.":"Soft light — a gentle tint, the plan keeps its colours and contrast.","Nakładka — mocniejszy efekt: jasne miejsca jaśnieją, ciemne ciemnieją, kolor jest wyraźny.":"Overlay — a stronger effect: light areas get lighter, dark areas darker, the colour is clear.","Zwykłe — płaski, półprzezroczysty kolor położony na plan.":"Normal — a flat, semi-transparent colour laid over the plan.","Geometria zablokowana — kliknij, aby odblokować":"Geometry locked — click to unlock","Zablokuj geometrię":"Lock geometry","Zablokowano geometrię":"Geometry locked","Odblokowano geometrię":"Geometry unlocked","Podgląd":"Preview","Rzeczywisty stan":"Actual state","Włączony":"On","Wyłączony":"Off","Usuń z pomieszczenia":"Remove from room","Dodaj do pomieszczenia":"Add to room","Z tego widoku":"From this view","Wpisz co najmniej 2 znaki.":"Type at least 2 characters.","Wyszukiwanie encji…":"Searching entities…","Brak — wyszukaj encję poniżej.":"None — search for an entity below.","Szukaj nazwy lub encji…":"Search name or entity…","Geometria jest zablokowana (kłódka u góry).":"The geometry is locked (padlock at the top).","Duplikuj pomieszczenie":"Duplicate room","Kopiuj styl pomieszczenia":"Copy room style","Wklej styl pomieszczenia":"Paste room style","Skopiowano styl pomieszczenia — wklej go w innym pomieszczeniu":"Room style copied — paste it into another room","Wklejono styl pomieszczenia":"Room style pasted","Przywrócić domyślny wygląd?":"Restore the default look?","Wygląd i akcja dotknięcia pomieszczenia wrócą do domyślnych. Kształt, nazwa i encje zostaną.":"The room look and tap action return to defaults. Shape, name and entities stay.","Przywrócono domyślny wygląd pomieszczenia":"Room look restored to default","kopia":"copy","Utworzono kopię pomieszczenia — przeciągnij ją w wybrane miejsce":"Room copied — drag it where you want it","Naprawiono błędny domyślny panel HA — ustaw go ponownie w menu widoku":"Fixed an invalid HA default panel — set it again in the view menu","Domyślny panel Home Assistant":"Home Assistant default panel","Bez zmian (ustawienia HA)":"Unchanged (HA settings)","HA Views — moje konto":"HA Views — my account","HA Views — tylko to urządzenie":"HA Views — this device only","HA Views jest teraz domyślnym panelem na Twoim koncie":"HA Views is now the default panel for your account","HA Views jest domyślnym panelem na tym urządzeniu":"HA Views is the default panel on this device","Przywrócono domyślny panel z ustawień Home Assistant":"Restored the default panel from Home Assistant settings","Otwieraj HA Views po starcie Home Assistant (to urządzenie)":"Open HA Views when Home Assistant starts (this device)","Ta opcja działa tylko w HA Views otwartym z panelu Home Assistant":"This option only works when HA Views is opened from the Home Assistant sidebar","HA Views będzie otwierać się po starcie Home Assistant na tym urządzeniu":"HA Views will open when Home Assistant starts on this device","Po starcie Home Assistant znów otworzy się domyślny dashboard":"Home Assistant will open its default dashboard again","Brak akcji":"No action","Przełącz światło":"Toggle the light","Nic":"Nothing","To pomieszczenie nie ma jeszcze encji — wybierz je w trybie edycji":"This room has no entities yet — choose them in edit mode","Błąd przełączania: ":"Toggle error: ","Pomieszczenie":"Room","Dodaj pomieszczenie":"Add room","Klikaj kolejne narożniki pomieszczenia":"Click the corners of the room one by one","Kliknij pierwszy punkt albo „Gotowe”, aby zamknąć kształt":"Click the first point or “Done” to close the shape","Cofnij punkt":"Undo point","Gotowe":"Done","Usuń pomieszczenie":"Delete room","Dodano pomieszczenie — wybierz encje, które je zapalają":"Room added — choose the entities that light it up","Pomieszczenie musi mieć co najmniej 3 narożniki":"A room needs at least 3 corners","Ten widok nie ma jeszcze encji — dodaj np. światło przez Integracje albo wpisz encję poniżej.":"This view has no entities yet — add e.g. a light via Integrations or type an entity below.","Brak encji":"No entities","Zapalają je encje":"Lit by entities","Inne encje":"Other entities","Pomieszczenie świeci, gdy włączona jest dowolna z wybranych encji (światło, gniazdko, ruch, otwarte drzwi…).":"The room lights up when any of the selected entities is on (light, plug, motion, open door…).","Wygląd":"Appearance","Efekt":"Effect","Poświata kolorem":"Colour glow","Zapalony obraz":"Lit image","Obraz zapalony":"Lit image","— wybierz —":"— choose —","Wgraj jako tło drugą wersję planu (np. render z włączonymi światłami) i wybierz ją tutaj — pomieszczenie odsłoni ją tylko w swoim kształcie. Obraz powinien mieć ten sam kadr co plan.":"Upload a second version of the plan as a background (e.g. a render with the lights on) and choose it here — the room reveals it only inside its shape. The image should have the same framing as the plan.","Kolor ze światła":"Colour from the light","Mieszanie":"Blending","Rozjaśnij":"Lighten","Miękkie światło":"Soft light","Nakładka":"Overlay","Zwykłe":"Normal","Jasność ze światła":"Brightness from the light","Intensywność":"Intensity","Miękkość krawędzi":"Edge softness","Podgląd włączonego":"Preview as on","Przeciągnij narożnik, aby go przesunąć. Mały punkt na krawędzi dodaje nowy narożnik. Dwuklik na narożniku go usuwa. Przeciągnij wnętrze, aby przesunąć całe pomieszczenie. Narożniki przyciągają się do ścian innych pomieszczeń (Alt wyłącza).":"Drag a corner to move it. The small dot on an edge adds a corner. Double-click a corner to remove it. Drag the inside to move the whole room. Corners snap to the walls of other rooms (Alt disables).","Usunąć pomieszczenie?":"Delete room?","Usunięto pomieszczenie":"Room deleted","Kolory wg wartości":"Colours by value","Dolny próg":"Lower threshold","Górny próg":"Upper threshold","Kolor poniżej":"Colour below","Kolor pomiędzy":"Colour between","Kolor od górnego":"Colour from upper","Płynne przejście":"Smooth blend","Koloruj ikonę":"Colour the icon","Koloruj wartość":"Colour the value","Koloruj łuk":"Colour the arc","Koloruj tło":"Colour the background","Koloruj ramkę":"Colour the border","Ikona poniżej":"Icon below","Ikona pomiędzy":"Icon between","Ikona od górnego":"Icon from upper","Puste pole ikony = zwykła ikona markera.":"Empty icon field = the marker’s normal icon.","Stan encji nie jest liczbą — kolory wg wartości nie działają dla tej encji.":"The entity state is not a number — colours by value do not apply to this entity.","Teraz: poniżej dolnego progu.":"Now: below the lower threshold.","Teraz: pomiędzy progami.":"Now: between the thresholds.","Teraz: od górnego progu.":"Now: at or above the upper threshold.","Połączono z nowszymi zmianami z innego urządzenia":"Merged with newer changes from another device","Układ został zmieniony na innym urządzeniu":"The layout was changed on another device",
    "Zarządzaj widokiem":"Manage view","Tło widoku":"View background","Ustaw tło":"Set background","Wstecz":"Back","Podgląd wybranego tła":"Selected background preview",
    "Zoom poza edycją":"Zoom outside editing","Panel startowy HA":"HA start panel","Bez zmian":"Unchanged","HA Views (konto)":"HA Views (account)","HA Views (urządzenie)":"HA Views (device)","Przełączanie palcem":"Swipe between views","Wyłączone (tylko zakładki)":"Off (tabs only)","Przesunięcie":"Slide","Kostka":"Cube","Zapisano sposób przełączania widoków":"View switching saved",
    "Diagnostyka przesuwania":"Swipe diagnostics"
  }
};
function translateValue(value) {
  const text = String(value ?? '');
  if (text.includes('\n')) return text.split('\n').map(translateValue).join('\n');
  if (uiLanguage === 'pl') {
    translateValue.reverse ||= Object.fromEntries(Object.entries(TRANSLATIONS.en).map(([pl,en]) => [en,pl]));
    return translateValue.reverse[text] || text;
  }
  const direct = TRANSLATIONS.en[text];
  if (direct) return direct;
  const deleteViewMatch = text.match(/^„(.+)” oraz wszystkie markery tego widoku zostaną usunięte\.$/);
  if (deleteViewMatch) return `“${deleteViewMatch[1]}” and all markers in this view will be deleted.`;
  const deleteMarkerMatch = text.match(/^„(.+)” zniknie z tego widoku razem ze swoimi ustawieniami\.$/);
  if (deleteMarkerMatch) return `“${deleteMarkerMatch[1]}” will be removed from this view together with its settings.`;
  if (text.startsWith('Skopiowano styl ')) return `Style copied: ${text.slice('Skopiowano styl '.length)}`;
  const viewCountsMatch = text.match(/^Markery: (\d+), Flow: (\d+)\.$/);
  if (viewCountsMatch) return `Markers: ${viewCountsMatch[1]}, Flow: ${viewCountsMatch[2]}.`;
  const deleteFlowMatch = text.match(/^„(.+)” zniknie z tego widoku\. Zwykły marker tej encji zostanie\.$/);
  if (deleteFlowMatch) return `“${deleteFlowMatch[1]}” will be removed from this view. The regular marker of this entity stays.`;
  const deleteBackgroundMatch = text.match(/^Tło „(.+)” zostanie trwale usunięte ze wszystkich widoków\.$/);
  if (deleteBackgroundMatch) return `Background “${deleteBackgroundMatch[1]}” will be permanently deleted from all views.`;
  const changeTypeMatch = text.match(/^Zmienić na (.+)\?$/);
  if (changeTypeMatch) return `Change to ${translateValue(changeTypeMatch[1])}?`;
  for (const [pl,en] of Object.entries(TRANSLATIONS.en)) if (text.startsWith(pl + ':')) { const rest = text.slice(pl.length + 1).trim(); return en + ':' + (rest ? ' ' + (TRANSLATIONS.en[rest] || rest) : ''); }
  return text;
}
const I18N_ATTRIBUTES = [['title','i18nTitle'],['aria-label','i18nAriaLabel'],['placeholder','i18nPlaceholder']];
// Attributes keep their Polish source in data-i18n-*; a value changed later by the app becomes the new source.
function translateAttributes(element) {
  I18N_ATTRIBUTES.forEach(([attribute, key]) => {
    if (!element.hasAttribute(attribute)) return;
    const current = element.getAttribute(attribute), cached = element.dataset[key];
    const source = cached !== undefined && (current === cached || current === translateValue(cached)) ? cached : current;
    element.dataset[key] = source;
    const value = translateValue(source);
    if (value !== current) element.setAttribute(attribute, value);
  });
}
function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentElement?.closest('#markers,[data-no-i18n]')) return;
    const translated = translateValue(node.nodeValue);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('#markers')) {
    translateAttributes(node);
    if (node.hasAttribute('data-no-i18n')) return;
    [...node.childNodes].forEach(translateNode);
  }
}
function applyLanguage() {
  document.documentElement.lang = uiLanguage;
  const select = document.querySelector('#language-select');
  if (select) select.value = uiLanguage;
  const titles = {
    'settings-toggle':'Ustawienia','integrations-button':'Integracje','edit-toggle':'Edytuj widok','view-manage':'Zarządzaj widokami','view-add':'Dodaj widok','view-rename':'Zmień nazwę widoku','view-duplicate':'Duplikuj widok','view-delete':'Usuń widok',
    'background-manage':'Zarządzaj tłem','background-upload':'Wgraj obraz','background-download':'Pobierz tło','background-delete':'Usuń tło','snap-toggle':'Siatka włączona','default-style':'Ustaw domyślny','preview-state-toggle':'Testuj stan ON/OFF','copy-style':'Kopiuj styl','paste-style':'Wklej styl','remove-marker':'Usuń z widoku','marker-duplicate':'Duplikuj marker','element-add':'Dodaj do widoku','add-button':'Dodaj do widoku','editor-close':'Zamknij','more-info-close':'Zamknij'
  };
  Object.entries(titles).forEach(([id,label]) => { const el = document.getElementById(id); if (el) { const value = translateValue(label); el.title = value; el.setAttribute('aria-label', value); } });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const value = translateValue(el.dataset.i18nTitle);
    el.title = value; el.setAttribute('aria-label', value);
  });
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = translateValue(el.dataset.i18n || '');
    const icon = el.querySelector(':scope > i');
    if (icon) {
      const iconMarkup = icon.outerHTML;
      el.innerHTML = `${iconMarkup} ${value}`;
    } else {
      el.textContent = value;
    }
  });
  translateNode(document.body);
  document.querySelectorAll('[title],[aria-label],[placeholder]').forEach(el => { if (!el.closest('#markers')) translateAttributes(el); });
}
function bindLanguageObserver() {
  new MutationObserver(records => records.forEach(record => {
    if (record.type === 'characterData') translateNode(record.target);
    record.addedNodes.forEach(translateNode);
  })).observe(document.body, { subtree:true, childList:true, characterData:true });
}

const els = {
  body: document.body, viewport: $('#scene-viewport'), sceneCard: $('.scene-card'), scene: $('#scene'), image: $('#scene-image'), nightImage: $('#scene-night-image'), empty: $('#scene-empty'), markers: $('#markers'), panoramaIndicator: $('#panorama-indicator'), mobilePanStart: $('#mobile-pan-start'),
  selection: $('#selection'), flowSelection: $('#flow-selection'), editor: $('#editor'), editorTitle: $('#editor-title'), editorEntity: $('#editor-entity'), editorIntegration: $('#editor-integration'), editorIntegrationIcon: $('#editor-integration-icon'),
  editorContent: $('#editor-content'), editorStatus: $('#editor-status'), flowEditor: $('#flow-editor'), flowEditorEntity: $('#flow-editor-entity'), flowEditorContent: $('#flow-editor-content'), flowEditorTitle: $('#flow-editor-title'), flowEditorIntegration: $('#flow-editor-integration'), flowEditorIcon: $('#flow-editor-icon'), flowEditorClose: $('#flow-editor-close'), toast: $('#toast'), connection: $('#connection'),
  confirmBox: $('#app-confirm'), confirmTitle: $('#app-confirm-title'), confirmMessage: $('#app-confirm-message'), confirmInput: $('#app-confirm-input'), confirmCancel: $('#app-confirm-cancel'), confirmOk: $('#app-confirm-ok'), language: $('#language-select'),
  editToggle: $('#edit-toggle'), addDialog: $('#add-dialog'), settingsToggle: $('#settings-toggle'), settingsMenu: $('#settings-menu'), gridStatus: $('#grid-status'), gridPresets: Array.from(document.querySelectorAll('.grid-preset')), bgUploadProgress: $('#background-upload-progress'), solidCanvasRatio: $('#solid-canvas-ratio'), bgColorToggle: $('#background-color-toggle'), bgRgbOpen: $('#background-rgb-open'), bgSelect: $('#background-select'), bgColor: $('#background-color'), bgDownload: $('#background-download'), bgDelete: $('#background-delete'),
  bgFile: $('#background-file'), bgStatus: $('#background-status'), bgManage: $('#background-manage'), backgroundBar: $('#vm-background'), emptyColor: $('#empty-background-color'), emptyColorToggle: $('#empty-color-toggle'), emptyColorMenu: $('#empty-color-menu'), emptyColorStart: $('#empty-color-start'), emptyRgb: $('#empty-rgb'), emptyBackgroundSelect: $('#empty-background-select'), emptyBackgroundPreviewWrap: $('#empty-background-preview-wrap'), emptyBackgroundPreview: $('#empty-background-preview'), emptyBackgroundConfirm: $('#empty-background-confirm'), emptyOpenIntegrations: $('#empty-open-integrations'), addedList: $('#added-list'),
  bgTransformToggle: $('#background-transform-toggle'), bgTransformPanel: $('#background-transform-panel'), bgMode: $('#background-mode'), bgScale: $('#background-scale'), bgX: $('#background-x'), bgY: $('#background-y'), bgScaleValue: $('#background-scale-value'), bgXValue: $('#background-x-value'), bgYValue: $('#background-y-value'),
  addedCount: $('#added-count'), integrationList: $('#integration-list'), integrationSearch: $('#integration-search'), snapToggle: $('#snap-toggle'),
  zoomOut: $('#zoom-out'), zoomIn: $('#zoom-in'), zoomReset: $('#zoom-reset'), zoomValue: $('#zoom-value'),
  sceneTabs: $('#scene-tabs'), integrationsButton: $('#integrations-button'), viewManage: $('#view-manage'), viewSwitcher: $('#view-menu'), viewAdd: $('#view-add'), viewRename: $('#view-rename'), viewDuplicate: $('#view-duplicate'), viewMoveLeft: $('#view-move-left'), viewMoveRight: $('#view-move-right'), viewDefault: $('#view-default'), viewDelete: $('#view-delete'),
  moreInfo: $('#more-info'), moreInfoBackdrop: $('#more-info-backdrop'), moreInfoIcon: $('#more-info-icon'), moreInfoTitle: $('#more-info-title'), moreInfoEntity: $('#more-info-entity'),
  moreInfoState: $('#more-info-state'), moreInfoUpdated: $('#more-info-updated'), moreInfoChart: $('#more-info-chart'), moreInfoAttributes: $('#more-info-attributes')
};

const badgeDefaults = () => ({
  width: 247, height: 137, contentScale: 1, baseContentScale: 2.2, showLabel: true, showValue: true, showBackground: true, showBorder: true,
  labelColor: '#9BC1D8', labelOpacity: 1, labelScale: 1, labelX: 0, labelY: 0,
  valueColor: '#FFFFFF', valueOpacity: 1, valueScale: 1, valueX: 0, valueY: 0,
  backgroundColor: '#03101A', backgroundOpacity: .76, backgroundGradient: 'none', backgroundGradientX: 50, backgroundGradientY: 50, backgroundGradientSpread: .65, backgroundGradientFill: .15, backgroundGradientDirection: 'left', backgroundStateEnabled: false, backgroundOnColor: '#03101A', backgroundOffColor: '#03101A', backgroundOnOpacity: .76, backgroundOffOpacity: .76,
  borderColor: '#607D8B', borderOpacity: .55, borderWidth: 1, radius: 10, shape: 'rounded', borderStateEnabled: false, borderOnColor: '#607D8B', borderOffColor: '#607D8B', borderOnOpacity: .55, borderOffOpacity: .55, borderOnWidth: 1, borderOffWidth: 1,
  showIcon: false, iconSize: 26, iconX: 0, iconY: 0, iconOpacity: 1, iconStateEnabled: true, iconOpacityStateEnabled: false, iconOnOpacity: 1, iconOffOpacity: 1, iconFillEnabled: true, iconOutlineEnabled: false, iconOutlineColor: '#FFFFFF', iconOutlineOpacity: 1, iconOutlineWidth: 1, iconOutlineStateEnabled: false, iconOutlineOnColor: '#FFFFFF', iconOutlineOffColor: '#FFFFFF', iconOutlineOnOpacity: 1, iconOutlineOffOpacity: 1, iconOutlineOnWidth: 1, iconOutlineOffWidth: 1,
  iconColor: '#9BC1D8', iconOnColor: '#20B9E7', iconOffColor: '#8AA2AF', iconUnavailableColor: '#FF6374'
});
const gaugeDefaults = () => ({
  width: 407, height: 237, contentScale: 1, baseContentScale: 2.2, min: 0, max: 4000, thickness: 10,
  trackColor: '#294657', progressColor: '#21BCEB', gaugeScale: 1, gaugeY: 0, startAngle: -180, endAngle: 0,
  showTicks: false, tickStep: 500, tickOffset: 4, tickLength: 7, tickWidth: 1, tickColor: '#8FDFFF', tickOpacity: .8,
  showTickLabels: false, tickLabelStep: 1000, tickFontSize: 8, tickFontFamily: 'Inter', tickLabelColor: '#9BC1D8', tickLabelOffset: 12,
  useGradient: false, gradientStart: '#21BCEB', gradientEnd: '#F59E0B',
  showBackground: true, backgroundColor: '#03101A', backgroundOpacity: .76, backgroundGradient: 'none', backgroundGradientX: 50, backgroundGradientY: 50, backgroundGradientSpread: .65, backgroundGradientFill: .15, backgroundGradientDirection: 'left', backgroundStateEnabled: false, backgroundOnColor: '#03101A', backgroundOffColor: '#03101A', backgroundOnOpacity: .76, backgroundOffOpacity: .76,
  showBorder: true, borderColor: '#607D8B', borderOpacity: .55, borderWidth: 1, radius: 16, shape: 'rounded', borderStateEnabled: false, borderOnColor: '#607D8B', borderOffColor: '#607D8B', borderOnOpacity: .55, borderOffOpacity: .55, borderOnWidth: 1, borderOffWidth: 1,
  showLabel: true, labelColor: '#9BC1D8', labelOpacity: 1, labelScale: 1, labelX: 0, labelY: 0,
  showValue: true, valueColor: '#FFFFFF', valueOpacity: 1, valueScale: 1, valueX: 0, valueY: 0,
  showPercent: true, percentColor: '#8FDFFF', percentOpacity: 1, percentScale: 1, percentY: 0,
  showIcon: false, iconSize: 26, iconX: 0, iconY: 0, iconOpacity: 1, iconStateEnabled: true, iconOpacityStateEnabled: false, iconOnOpacity: 1, iconOffOpacity: 1, iconFillEnabled: true, iconOutlineEnabled: false, iconOutlineColor: '#FFFFFF', iconOutlineOpacity: 1, iconOutlineWidth: 1, iconOutlineStateEnabled: false, iconOutlineOnColor: '#FFFFFF', iconOutlineOffColor: '#FFFFFF', iconOutlineOnOpacity: 1, iconOutlineOffOpacity: 1, iconOutlineOnWidth: 1, iconOutlineOffWidth: 1,
  iconColor: '#9BC1D8', iconOnColor: '#20B9E7', iconOffColor: '#8AA2AF', iconUnavailableColor: '#FF6374'
});

const iconDefaults = () => ({ ...badgeDefaults(), width: 124, height: 124, showLabel: false, showValue: false, showBackground: true, backgroundOpacity: .76, showBorder: true, radius: 16, showIcon: true, iconSize: 32, iconX: 0, iconY: 0 });
const horseshoeDefaults = () => ({ ...gaugeDefaults(), width: 330, height: 291, showLabel: true, showValue: true, showPercent: true, showTicks: false, startAngle: 135, endAngle: 405, gaugeScale: 1, gaugeY: 0, valueScale: .65, valueY: -19, percentScale: .8, percentY: -8 });
const isGaugeType = type => type === 'gauge' || type === 'horseshoe';
// Termostat (climate): a dial from the entity's min to max temperature with the target, the current temperature, what it
// is doing now, − / + and its modes. Which of them show is chosen in its panel (only those the entity really has).
const thermostatDefaults = () => ({ ...badgeDefaults(), width: 216, height: 250, baseContentScale: 1, contentScale: 1, showLabel: true, showValue: true, showIcon: false,
  backgroundColor: '#071A26', backgroundOpacity: .88, borderColor: '#8FDFFF', borderOpacity: .18, radius: 24,
  thermoShowAction: true, thermoShowCurrent: true, thermoShowControls: true, thermoShowModes: true, thermoShowRange: true, thermoShowHumidity: true, thermoShowPreset: true, thermoShowFan: false,
  thermoHeatColor: '#FF7A2F', thermoCoolColor: '#38BDF8', thermoAutoColor: '#34D399', thermoDryColor: '#FBBF24', thermoFanColor: '#A78BFA', thermoOffColor: '#64748B', thermoTrackColor: '#1E3546' });
const markerStyleDefaults = type => type === 'thermostat' ? thermostatDefaults() : type === 'icon' ? iconDefaults() : type === 'horseshoe' ? horseshoeDefaults() : type === 'gauge' ? gaugeDefaults() : badgeDefaults();
const markerTypeLabel = type => ({ badge:'Badge', gauge:'Gauge', icon:'Ikona', horseshoe:'Podkowa' }[type] || 'Badge');
const gaugeVisualTransform = (marker, style) => {
  const horseshoe = marker.type === 'horseshoe';
  const y = (horseshoe ? -35 : 0) + (Number(style.gaugeY) || 0);
  const scale = (horseshoe ? .92 : 1) * (Number(style.gaugeScale) || 1);
  return `translateY(${y}px) scale(${scale})`;
};
const COLOR_PALETTE = ['#FFFFFF','#DCE8EF','#9BC1D8','#607D8B','#03101A','#102A3A','#20B9E7','#147EA5','#22D69B','#39B86C','#FFD166','#F59E0B','#FF6374','#E63946','#B66DFF','#7C4DFF','#EC4899','#8B5E3C'];
const FLOW_DEFAULTS = Object.freeze({ direction:'right', directionMode:'manual', positiveDirection:'right', negativeDirection:'left', negativeStyleEnabled:false, itemSizeV2:true, shape:'chevron', shapeSharpness:100, flowCount:3, flowLength:84, chevronWidth:22, chevronHeight:22, chevronThickness:5, gap:9, rotation:0, color:'#20B9E7', positiveColor:'#20B9E7', negativeColor:'#FF6374', outlineWidth:0, outlineColor:'#FFFFFF', glowCustom:false, glowColor:'#20B9E7', glow:5, opacity:100, deadband:0, hideInactive:false, animation:'none', animationSpeed:1.2, speedByValue:false, speedValueMax:1000 });
// Tempo is a real travel speed: 1× = FLOW_SPEED_PX design pixels per second, whatever the item size, spacing
// or count, so two Flows with the same tempo move exactly alike.
const FLOW_SPEED_PX = 150;
const FLOW_ANIMATION_KEYS = ['animation','animationSpeed','speedByValue','speedValueMax'];
const FLOW_STYLE_KEYS = ['shape','shapeSharpness','flowCount','flowLength','chevronWidth','chevronHeight','chevronThickness','gap','outlineWidth','outlineColor','glow','glowCustom','glowColor','opacity','animation','animationSpeed','speedByValue','speedValueMax'];
const FLOW_SHAPES = [['chevron','Chevron'],['arrow','Strzałka'],['dart','Grot'],['triangle','Trójkąt'],['segment','Segment']];
const FLOW_LIMITS = Object.freeze({ min:4, size:600, length:1600, thickness:120, gap:300, count:12 });
const ICON_LABELS_EN = {"Deszcz": "Rain", "Ulewa": "Downpour", "Słońce": "Sun", "Woda": "Water", "Wilgotność": "Humidity", "Basen": "Pool", "Pompa": "Pump", "Fotowoltaika": "Solar", "Energia": "Energy", "Temperatura": "Temperature", "Wentylator": "Fan", "Zasilanie": "Power", "Włączone": "On", "Wyłączone": "Off", "Ruch": "Motion", "Dym": "Smoke", "Alarm": "Alarm", "Wskaźnik": "Gauge", "Światło": "Light", "Sieć": "Network"};
const iconChoiceLabel = label => uiLanguage === 'en' ? (ICON_LABELS_EN[label] || translateValue(label)) : label;
const ICON_CHOICES = [['','Automatyczna'],['mdi:weather-rainy','Deszcz'],['mdi:weather-pouring','Ulewa'],['mdi:weather-sunny','Słońce'],['mdi:water','Woda'],['mdi:water-off','Brak wody'],['mdi:water-percent','Wilgotność'],['mdi:pool','Basen'],['mdi:heat-pump','Pompa ciepła'],['mdi:pump','Pompa'],['mdi:solar-power','Fotowoltaika'],['mdi:flash','Energia'],['mdi:home-lightning-bolt','Energia domu'],['mdi:thermometer','Temperatura'],['mdi:fan','Wentylator'],['mdi:power','Zasilanie'],['mdi:toggle-switch','Włączone'],['mdi:toggle-switch-off','Wyłączone'],['mdi:door-open','Drzwi otwarte'],['mdi:door-closed','Drzwi zamknięte'],['mdi:window-open','Okno otwarte'],['mdi:window-closed','Okno zamknięte'],['mdi:motion-sensor','Ruch'],['mdi:smoke-detector','Dym'],['mdi:alert-circle','Alarm'],['mdi:check-circle','OK'],['mdi:close-circle','Wyłączone'],['mdi:gauge','Wskaźnik'],['mdi:lightbulb','Światło'],['mdi:wifi','Sieć']];
const freshMarker = (entity, integration) => ({
  id: uid(), entityId: entity.entity_id, integrationId: integration.entry_id || '', integrationName: integration.title || integration.domain || 'Home Assistant',
  sourceDomain: integration.domain || entity.entity_id.split('.')[0], displayName: entity.name || entity.entity_id,
  unitOverride: entity.unit ?? '', decimals: 'auto', stateOnLabel: '', stateOffLabel: '', iconMode: 'auto', iconName: '', iconOn: '', iconOff: '', iconVariantEnabled: false, tapAction: 'more_info', xPercent: 50, yPercent: 50, type: 'badge', style: badgeDefaults(),
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
});

let model = { version: 3, revision: 0, settings: { snapEnabled: true, snapStep: .25 }, activeViewId: '', viewOrder: [], views: {}, entities: {} };
let stateCache = {}, editMode = false, selectedId = null, selectedFlowId = null, styleClipboard = null, flowStyleClipboard = null, saveTimer = null, access = { viewer: false };
let viewSwipe = null, tabDrag = null, suppressTabClick = false, lastSwipeDecision = null;
let saveRunning = false, savePending = false, integrations = [], integrationEntities = new Map(), openIntegrations = new Set();
let unusedIntegrationsOpen = false, entityEvents = null, resumeTimer = null;
let integrationSearchText = '', integrationSearchTimer = null, integrationSearchLoading = false, integrationSearchRequest = 0;
let editorDragged = false, flowEditorDragged = false;
let editorOpenSectionIndex = -1;
let editorPreview = { entityId: '', state: '' };
let sceneScale = 1;
const mobileLayoutY = new Map();
let viewZoom = 1, viewPanX = 0, viewPanY = 0, mobileOrientation = '';
const viewPointers = new Map();
let panGesture = null, pinchGesture = null, desktopPanGesture = null;
let currentBackground = '';
let confirmResolver = null;
let confirmInputMode = false;
let moreInfoEntityId = '';
let moreInfoRequest = 0;
const markerTogglesInFlight = new Set();
const pendingToggleStates = new Map();

async function api(path, options = {}) {
  const response = await fetch(`api/${path}`, { cache: 'no-store', ...options });
  const type = response.headers.get('content-type') || '';
  const data = type.includes('json') ? await response.json() : await response.text();
  if (!response.ok || (data && data.ok === false)) { const error = new Error(data?.error || `HTTP ${response.status}`); error.status = response.status; error.data = data; throw error; }
  return data;
}
const jsonOptions = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
function notify(text, error = false) {
  els.toast.classList.remove('with-action');
  els.toast.textContent = text; els.toast.style.borderColor = error ? '#ff6374' : ''; els.toast.classList.add('visible');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => els.toast.classList.remove('visible'), 2200);
}
function notifyWithAction(text, actionText, action, duration = 7000) {
  els.toast.innerHTML = ''; els.toast.style.borderColor = ''; els.toast.classList.add('visible','with-action');
  const label = document.createElement('span'), button = document.createElement('button');
  label.textContent = text; button.type = 'button'; button.textContent = actionText;
  button.addEventListener('click', () => { clearTimeout(notify.timer); els.toast.classList.remove('visible','with-action'); action(); }, { once:true });
  els.toast.append(label, button);
  clearTimeout(notify.timer); notify.timer = setTimeout(() => els.toast.classList.remove('visible','with-action'), duration);
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
  els.confirmTitle.textContent = translateValue(title); els.confirmMessage.textContent = translateValue(message); els.confirmOk.textContent = translateValue(confirmText); els.confirmCancel.textContent = translateValue('Anuluj');
  els.confirmOk.classList.toggle('danger-confirm', danger); els.confirmBox.classList.add('visible'); els.confirmBox.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => { confirmResolver = resolve; requestAnimationFrame(() => els.confirmCancel.focus()); });
}
function appPrompt({ title, message = '', value = '', confirmText = 'Zapisz' }) {
  if (confirmResolver) closeAppConfirm(false);
  confirmInputMode = true; els.confirmTitle.textContent = translateValue(title); els.confirmMessage.textContent = translateValue(message); els.confirmOk.textContent = translateValue(confirmText);
  els.confirmOk.classList.remove('danger-confirm'); els.confirmInput.hidden = false; els.confirmInput.value = value;
  els.confirmBox.classList.add('visible'); els.confirmBox.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => { confirmResolver = resolve; requestAnimationFrame(() => { els.confirmInput.focus(); els.confirmInput.select(); }); });
}
function activeSceneView() { return model.views?.[model.activeViewId] || null; }
function updateEmptyState() {
  const view = activeSceneView(), hasMarkers = Object.keys(model.entities || {}).length > 0 || Object.keys(view?.flows || {}).length > 0 || Object.keys(view?.rooms || {}).length > 0;
  const showWelcome = !currentBackground && !view?.onboardingDone && !hasMarkers;
  els.empty.classList.toggle('visible', showWelcome);
  const solid = String(view?.backgroundColor || '');
  els.empty.classList.toggle('solid-background', Boolean(solid));
  els.empty.style.setProperty('--solid-background', solid || 'transparent');
}
// The background panel is the second page of the view menu (a bottom sheet on phones).
// On phones the view menu is a bottom sheet. The top bar uses backdrop-filter, which would make it the
// containing block of a fixed child, so the sheet is moved to <body> there and back to its anchor on desktop.
function placeViewSheet() {
  const sheet = els.viewSwitcher, anchor = els.viewManage?.parentElement; if (!sheet || !anchor) return;
  if (mobileView()) { if (sheet.parentElement !== document.body) document.body.append(sheet); }
  else if (sheet.parentElement !== anchor) els.viewManage.after(sheet);
}
// Pages of the view menu: main (view actions + Tło / Opcje), background and options.
function setViewMenuPage(page) {
  const menu = els.viewSwitcher; if (!menu) return;
  menu.dataset.page = page;
  const title = $('#vm-title'); if (title) title.textContent = translateValue(page === 'background' ? 'Tło' : page === 'options' ? 'Opcje' : 'Widok');
  const name = $('#vm-name'); if (name) name.textContent = activeSceneView()?.name || '';
  if (page !== 'background') { hideBackgroundPreview(true); els.backgroundBar?.classList.remove('open','onboarding'); if (els.bgStatus) els.bgStatus.textContent = ''; }
  else { els.backgroundBar?.classList.add('open'); syncCanvasControls(); syncNightControls(); }
}
function setBackgroundPage(open) { setViewMenuPage(open ? 'background' : 'main'); }
function hideBackgroundPreview(resetSelect = false) {
  const wrap = $('#background-preview-wrap'); if (wrap) wrap.hidden = true;
  if (resetSelect && els.bgSelect) els.bgSelect.value = currentBackground || '';
}
function showBackgroundPreview(name) {
  const wrap = $('#background-preview-wrap'), image = $('#background-preview'); if (!wrap || !image) return;
  image.src = `api/background/file?name=${encodeURIComponent(name)}`; wrap.hidden = false;
  requestAnimationFrame(() => wrap.scrollIntoView({ block:'nearest' }));
}
function openBackgroundMenu(hint = '') {
  setBackgroundPage(true);
  els.backgroundBar.classList.toggle('onboarding', Boolean(hint));
  els.bgStatus.textContent = hint;
}
function applyBackgroundColour() {
  const colour = activeSceneView()?.backgroundColor || '';
  els.scene.style.background = colour || 'linear-gradient(145deg,#0d2838,#0a1c27)';
  if (els.bgColor) els.bgColor.value = colour || '#0d2838';
  if (els.bgColorToggle) els.bgColorToggle.style.background = colour || '#0d2838';
  if (els.emptyColor) els.emptyColor.value = colour || '#0d2838';
  if (els.emptyColorToggle) els.emptyColorToggle.style.background = colour || '#0d2838';
}
function setBackgroundColour(colour) {
  const view = activeSceneView(); if (!view || !/^#[0-9a-f]{6}$/i.test(colour || '')) return;
  const imageRatio = !els.image.hidden && els.image.naturalWidth > 0 && els.image.naturalHeight > 0 ? els.image.naturalWidth / els.image.naturalHeight : 0;
  if (imageRatio) view.solidCanvasRatio = imageRatio;
  view.solidCanvasRatio ||= mobileView() ? 9 / 16 : 16 / 9;
  view.background = ''; currentBackground = '';
  view.backgroundColor = colour.toUpperCase(); view.onboardingDone = true;
  els.image.hidden = true; els.image.removeAttribute('src'); delete els.image.dataset.backgroundName;
  els.scene.style.setProperty('background', view.backgroundColor, 'important');
  els.empty.style.setProperty('--solid-background', view.backgroundColor);
  els.empty.classList.add('solid-background');
  els.scene.style.backgroundImage = 'none'; els.scene.style.backgroundColor = view.backgroundColor;
  els.bgSelect.value = ''; syncCanvasControls();
  if (els.bgColor) els.bgColor.value = view.backgroundColor;
  if (els.bgColorToggle) els.bgColorToggle.style.background = view.backgroundColor;
  applyBackgroundColour(); updateEmptyState(); renderMarkers(); updateSceneGeometry(); scheduleSave(true);
}
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
  const defaultView = model.settings?.defaultViewId;
  let reloadView = ''; try { reloadView = sessionStorage.getItem(RELOAD_VIEW_KEY) || ''; sessionStorage.removeItem(RELOAD_VIEW_KEY); } catch {}
  const linkedView = viewFromLink();
  if (reloadView && model.views[reloadView]) model.activeViewId = reloadView;
  else if (linkedView) model.activeViewId = linkedView;
  else if (defaultView && model.views[defaultView]) model.activeViewId = defaultView;
  else try {
    const rememberedView = localStorage.getItem(ACTIVE_VIEW_CACHE_KEY);
    if (rememberedView && model.views[rememberedView]) model.activeViewId = rememberedView;
  } catch {}
  if (!model.views[model.activeViewId]) model.activeViewId = model.viewOrder[0];
  Object.values(model.views).forEach((view, index) => {
    view.id ||= model.viewOrder[index]; view.name ||= `Widok ${index + 1}`; view.entities ||= {}; view.flows ||= {}; view.backgroundTransforms ||= {};
    view.backgroundColor ??= ''; view.onboardingDone ??= false;
    // An icon whose wizard was never finished is not kept.
    Object.entries(view.rooms || {}).forEach(([key, room]) => { if (room?.draft) { delete view.rooms[key]; migrated = true; } });
    // The geometry lock was removed (to be solved another way): nothing stays locked.
    [...Object.values(view.rooms || {}), ...Object.values(view.entities || {}), ...Object.values(view.flows || {})].forEach(item => { if (item?.geometryLocked) { item.geometryLocked = false; migrated = true; } });
    // Layout v3: a marker's id is its key in view.entities (older layouts keyed markers by entity id and some had a random id).
    Object.entries(view.entities).forEach(([key, marker]) => { if (marker.id !== key) { marker.id = key; migrated = true; } marker.entityId ||= key; marker.tapAction ??= 'more_info'; if (bringIntoScene(marker)) migrated = true; });
    Object.values(view.flows).forEach((flow, flowIndex) => {
      if (Number.isFinite(Number(flow.xPercent)) && Number.isFinite(Number(flow.yPercent)) && bringIntoScene(flow)) migrated = true;
      if (!Number.isFinite(Number(flow.xPercent))) { flow.xPercent = 50 + (flowIndex % 4) * 3; migrated = true; }
      if (!Number.isFinite(Number(flow.yPercent))) { flow.yPercent = 50 + (flowIndex % 4) * 3; migrated = true; }
      if (!Number.isFinite(Number(flow.rotation))) { flow.rotation = 0; migrated = true; }
      if (!Number.isFinite(Number(flow.width))) { flow.width = 140; migrated = true; }
      if (!Number.isFinite(Number(flow.height))) { flow.height = 54; migrated = true; }
      if (!Number.isFinite(Number(flow.chevronSize))) { flow.chevronSize = 22; migrated = true; }
      if (!Number.isFinite(Number(flow.gap))) { flow.gap = 9; migrated = true; }
      if (!flow.color) { flow.color = '#20B9E7'; migrated = true; }
      if (flow.outlineCustom === undefined) { flow.outlineCustom = Boolean(flow.outlineColor) && String(flow.outlineColor).toUpperCase() !== String(flow.color).toUpperCase(); migrated = true; }
      if (flow.glowCustom === undefined) { flow.glowCustom = Boolean(flow.glowColor) && String(flow.glowColor).toUpperCase() !== String(flow.color).toUpperCase(); migrated = true; }
      // Old Flow versions kept the fill colour in fillColor/chevronMode. Take it over once (only for flows
      // from before shapes existed) and drop the old keys — otherwise every start overwrote the colour.
      if (flow.fillColor !== undefined || flow.chevronMode !== undefined) {
        if (!flow.shape && flow.directionMode !== 'auto' && flow.fillColor && flow.chevronMode === 'filled') flow.color = flow.fillColor;
        delete flow.fillColor; delete flow.chevronMode; migrated = true;
      }
      if (!flow.shape) {
        flow.shape = flow.flowStyle === 'segments' ? 'segment' : ['arrow','bar'].includes(flow.chevronVariant) ? 'arrow' : 'chevron';
        if (flow.shape === 'segment') { flow.chevronWidth = Math.max(8, Math.round((Number(flow.chevronWidth) || 22) * .9)); flow.chevronHeight = Math.max(4, Math.round((Number(flow.chevronHeight) || 22) * .32)); }
        flow.outlineWidth ??= flow.outlineCustom ? 2 : 0; migrated = true;
      }
      [flow, flow.negativeStyle].forEach(style => {
        if (!style || Number.isFinite(Number(style.flowLength)) && Number(style.flowLength) > 0) return;
        const count = clamp(Math.round(Number(style.flowCount ?? flow.flowCount) || 3), 1, 12), width = Number(style.chevronWidth ?? flow.chevronWidth) || 22, gap = Math.max(0, Number(style.gap ?? flow.gap) || 0);
        if (style === flow || style.chevronWidth !== undefined || style.gap !== undefined || style.flowCount !== undefined) { style.flowLength = Math.round(count * width + (count - 1) * gap); migrated = true; }
      });
      // beta.180: item length is stored separately again; keep the item size the frame produced so far.
      if (!flow.itemSizeV2) {
        [flow, flow.negativeStyle].forEach(style => {
          if (!style) return;
          const effective = style === flow ? flow : { ...flow, ...style };
          if (style !== flow && style.flowLength === undefined && style.gap === undefined && style.flowCount === undefined && style.chevronWidth === undefined) return;
          const count = clamp(Math.round(Number(effective.flowCount) || 3), 1, 12), length = clamp(Number(effective.flowLength) || 84, 8, 1600);
          const gap = count > 1 ? Math.min(Math.max(0, Number(effective.gap) || 0), (length - count * 2) / (count - 1)) : 0;
          style.chevronWidth = Math.max(2, Math.round((length - (count - 1) * gap) / count));
        });
        flow.itemSizeV2 = true; migrated = true;
      }
    });
  });
  if ((Number(model.version) || 0) < 3) migrated = true;
  model.version = 3; attachActiveEntities(); return migrated;
}
function showMainView(name) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  const integrationsOpen = name === 'integrations';
  els.integrationsButton?.classList.toggle('active', integrationsOpen);
  els.viewManage.disabled = integrationsOpen; els.editToggle.disabled = integrationsOpen;
  if (integrationsOpen) { closeCompactMenus(); closeEditor(); closeMoreInfo(); }
  renderViewSelector(); if (integrationsOpen) loadIntegrations();
}
function renderViewSelector() {
  if (!els.sceneTabs) return;
  const sheetName = $('#vm-name'); if (sheetName) sheetName.textContent = activeSceneView()?.name || '';
  syncZoomToggle();
  const transition = $('#view-transition'); if (transition) transition.value = viewTransitionMode();
  els.sceneCard?.parentElement?.classList.toggle('swipe-mode-cube', viewTransitionMode() === 'cube' && mobileView());
  els.sceneTabs.innerHTML = model.viewOrder.map(id => `<button class="tab scene-view-tab ${id === model.activeViewId ? 'active' : ''}" data-scene-view="${escapeHtml(id)}">${model.settings?.defaultViewId === id ? '<i class="mdi mdi-home-variant-outline scene-tab-home" title="Widok startowy" aria-label="Widok startowy"></i>' : ''}<span data-no-i18n>${escapeHtml(model.views[id].name)}</span></button>`).join('');
  els.viewDelete.disabled = model.viewOrder.length <= 1;
  const index = model.viewOrder.indexOf(model.activeViewId);
  if (els.viewMoveLeft) els.viewMoveLeft.disabled = index <= 0;
  if (els.viewMoveRight) els.viewMoveRight.disabled = index < 0 || index >= model.viewOrder.length - 1;
  if (els.viewDefault) { const isDefault = model.settings?.defaultViewId === model.activeViewId; els.viewDefault.classList.toggle('active', isDefault); els.viewDefault.title = translateValue(isDefault ? 'Widok startowy' : 'Ustaw jako widok startowy'); els.viewDefault.setAttribute('aria-label', els.viewDefault.title); const label = $('span', els.viewDefault); if (label) label.textContent = els.viewDefault.title; }
}
async function switchSceneView(id, persist = true) {
  if (!model.views[id] || id === model.activeViewId && persist) return;
  closeCompactMenus(); closeEditor(); closeMoreInfo(); closeRoomEditor(); cancelRoomDrawing(); model.activeViewId = id; try { localStorage.setItem(ACTIVE_VIEW_CACHE_KEY, id); } catch {} attachActiveEntities(); currentBackground = '';
  renderViewSelector(); els.markers.classList.add('background-pending'); renderIntegrations();
  await loadBackgrounds(true, false, null, 2500); await nightImageReady(); if (currentBackground) applyBackgroundTransform(); updateSceneGeometry(); resetViewZoom(); renderMarkers(); els.markers.classList.remove('background-pending'); refreshStates();
  // The open view is remembered per device (localStorage); switching views does not rewrite the shared layout.
  prebuildSwipePreviews(60);
}
async function addSceneView() {
  closeCompactMenus();
  const name = await appPrompt({ title: 'Nowy widok', message: 'Podaj krótką nazwę nowego widoku.', value: `Widok ${model.viewOrder.length + 1}`, confirmText: 'Dodaj' });
  if (!name) return;
  const id = `view_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
  model.views[id] = { id, name, background: '', backgroundColor: '', solidCanvasRatio: mobileView() ? 9 / 16 : 16 / 9, onboardingDone: false, backgroundTransforms: {}, entities: {}, flows: {} }; model.viewOrder.push(id);
  await switchSceneView(id, false); scheduleSave(true); notify('Dodano nowy widok');
}
// Tabs can be reordered by dragging (mouse: drag; touch: long-press, then drag). Admin only.
function startTabDrag(event) {
  const tab = event.target.closest('[data-scene-view]');
  if (!tab || isViewer() || model.viewOrder.length < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
  const touch = event.pointerType !== 'mouse';
  tabDrag = { tab, id:event.pointerId, x:event.clientX, y:event.clientY, active:false, timer:null };
  const activate = () => { if (!tabDrag) return; tabDrag.active = true; tab.classList.add('dragging'); els.sceneTabs.classList.add('reordering'); try { tab.setPointerCapture(event.pointerId); } catch {} navigator.vibrate?.(15); };
  if (touch) tabDrag.timer = setTimeout(activate, 380);
  const move = e => {
    if (!tabDrag || e.pointerId !== tabDrag.id) return;
    const dx = e.clientX - tabDrag.x, dy = e.clientY - tabDrag.y;
    if (!tabDrag.active) { if (touch) { if (Math.hypot(dx, dy) > 8) finish(); return; } if (Math.abs(dx) > 6) activate(); else return; }
    e.preventDefault();
    const siblings = $$('[data-scene-view]', els.sceneTabs).filter(item => item !== tab);
    const before = siblings.find(item => { const r = item.getBoundingClientRect(); return e.clientX < r.left + r.width / 2; });
    if (before) { if (tab.nextElementSibling !== before) els.sceneTabs.insertBefore(tab, before); } else if (els.sceneTabs.lastElementChild !== tab) els.sceneTabs.append(tab);
    const r = els.sceneTabs.getBoundingClientRect();
    if (e.clientX < r.left + 24) els.sceneTabs.scrollLeft -= 8; else if (e.clientX > r.right - 24) els.sceneTabs.scrollLeft += 8;
  };
  const finish = () => {
    if (!tabDrag) return;
    clearTimeout(tabDrag.timer); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
    const wasActive = tabDrag.active; tabDrag = null; tab.classList.remove('dragging'); els.sceneTabs.classList.remove('reordering');
    if (!wasActive) return;
    suppressTabClick = true; setTimeout(() => { suppressTabClick = false; }, 200);
    const order = $$('[data-scene-view]', els.sceneTabs).map(item => item.dataset.sceneView);
    if (order.join('|') === model.viewOrder.join('|')) return renderViewSelector();
    model.viewOrder = order; renderViewSelector(); scheduleSave(true); notify('Zmieniono kolejność widoków');
  };
  window.addEventListener('pointermove', move, { passive:false }); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
}
function setDefaultSceneView() {
  if (!model.views[model.activeViewId]) return;
  model.settings ||= {}; model.settings.defaultViewId = model.activeViewId;
  renderViewSelector(); scheduleSave(true); notify('Ustawiono widok startowy');
}
function moveSceneView(direction) {
  const index = model.viewOrder.indexOf(model.activeViewId), target = index + direction;
  if (index < 0 || target < 0 || target >= model.viewOrder.length) return;
  [model.viewOrder[index], model.viewOrder[target]] = [model.viewOrder[target], model.viewOrder[index]];
  renderViewSelector(); scheduleSave(true); notify('Zmieniono kolejność widoków');
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
  copy.id = id; copy.name = name; Object.entries(copy.entities).forEach(([key, marker]) => { marker.id = key; marker.updatedAt = new Date().toISOString(); });
  model.views[id] = copy; model.viewOrder.push(id); await switchSceneView(id, false); scheduleSave(true); notify('Utworzono kopię widoku');
}
async function deleteSceneView() {
  const view = activeSceneView(); if (!view || model.viewOrder.length <= 1) return;
  const markerCount = Object.keys(view.entities || {}).length, flowCount = Object.keys(view.flows || {}).length;
  const message = `„${view.name}” oraz wszystkie markery tego widoku zostaną usunięte.`;
  const details = markerCount || flowCount ? `Markery: ${markerCount}, Flow: ${flowCount}.` : 'Widok jest pusty.';
  if (!await appConfirm({ title: 'Usunąć widok?', message: message + '\n' + details, confirmText: 'Usuń widok', danger: true })) return;
  const index = model.viewOrder.indexOf(view.id), snapshot = clone(view), wasDefault = model.settings?.defaultViewId === view.id;
  delete model.views[view.id]; model.viewOrder.splice(index, 1);
  model.activeViewId = model.viewOrder[Math.max(0, index - 1)]; if (wasDefault) model.settings.defaultViewId = model.activeViewId; attachActiveEntities(); renderViewSelector(); els.markers.classList.add('background-pending'); renderIntegrations(); await loadBackgrounds(true); renderMarkers(); els.markers.classList.remove('background-pending'); await refreshStates(); scheduleSave(true);
  notifyWithAction('Usunięto widok', 'Cofnij', async () => {
    if (model.views[snapshot.id]) return;
    model.views[snapshot.id] = snapshot; model.viewOrder.splice(Math.min(index, model.viewOrder.length), 0, snapshot.id);
    if (wasDefault) model.settings.defaultViewId = snapshot.id;
    await switchSceneView(snapshot.id, false); scheduleSave(true); notify('Przywrócono widok');
  });
}
function rgba(hex, alpha) {
  const raw = String(hex || '#000000').replace('#', '');
  const n = parseInt(raw.length === 3 ? raw.split('').map(x => x + x).join('') : raw, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${clamp(alpha, 0, 1)})`;
}
function markerBackgroundFill(color, opacity, variant = 'none', style = {}) {
  const alpha = clamp(opacity, 0, 1), x = clamp(style.backgroundGradientX, 0, 100), y = clamp(style.backgroundGradientY, 0, 100), spread = clamp(style.backgroundGradientSpread, .15, 1), fill = clamp(style.backgroundGradientFill, 0, 1), direction = style.backgroundGradientDirection || 'left', tone = value => rgba(color, alpha * value);
  const base = `linear-gradient(${tone(fill)},${tone(fill)})`, wide = 42 + spread * 88, tall = 34 + spread * 82;
  if (variant === 'center') return `radial-gradient(ellipse ${wide}% ${tall}% at ${x}% ${y}%,${tone(1)} 0%,${tone(.55)} 40%,${tone(.12)} 72%,${tone(0)} 100%), ${base}`;
  if (variant === 'corner') return `radial-gradient(ellipse ${wide}% ${tall}% at ${x}% ${y}%,${tone(1)} 0%,${tone(.56)} 34%,${tone(.12)} 68%,${tone(0)} 100%), ${base}`;
  if (variant === 'wall') { const angle = { left:90, right:270, top:180, bottom:0 }[direction] ?? 90; const cross = direction === 'left' || direction === 'right' ? y : x; return `radial-gradient(ellipse ${wide}% ${tall}% at ${direction === 'left' ? 0 : direction === 'right' ? 100 : x}% ${direction === 'top' ? 0 : direction === 'bottom' ? 100 : cross}%,${tone(.9)} 0%,${tone(.3)} 48%,${tone(0)} 100%), linear-gradient(${angle}deg,${tone(.55)},${tone(0)} 82%), ${base}`; }
  if (variant === 'ambient') return `radial-gradient(ellipse ${wide}% ${tall}% at ${x}% ${y}%,${tone(.82)} 0%,${tone(.23)} 51%,${tone(0)} 100%), linear-gradient(145deg,${tone(.18)},${tone(.62)}), ${base}`;
  return rgba(color, alpha);
}
function scheduleSave(immediate = false) {
  if (isViewer()) return Promise.resolve();
  clearTimeout(saveTimer); lastLocalChangeAt = Date.now();
  if (immediate) return queueSave();
  saveTimer = setTimeout(queueSave, 200);
}
function migrateGridPresetSteps() {
  if (model.settings?.gridPresetV2) return false;
  const legacy = Number(model.settings?.snapStep);
  if (legacy === 1) model.settings.snapStep = .25;
  else if (legacy === 5) model.settings.snapStep = 1;
  else if (legacy === 10) model.settings.snapStep = 4;
  model.settings.gridPresetV2 = true;
  return true;
}
function applySnapUi() {
  const enabled = model.settings?.snapEnabled !== false;
  els.body.classList.toggle('snap-enabled', enabled);
  if (els.snapToggle) { els.snapToggle.classList.toggle('active', enabled); els.snapToggle.title = translateValue(enabled ? 'Siatka włączona' : 'Siatka wyłączona'); els.snapToggle.setAttribute('aria-label', els.snapToggle.title); }
  if (els.gridStatus) els.gridStatus.textContent = enabled ? 'ON' : 'OFF';
  const step = clamp(model.settings?.snapStep || .25, .25, 4);
  els.scene?.style.setProperty('--grid-minor', `${step}%`);
  els.scene?.style.setProperty('--grid-major', `${step * 5}%`);
  els.scene?.style.setProperty('--grid-vis', `${gridVisual()}%`); syncGridGeometry();
  const activePreset = [.25, 1, 4].reduce((best, value) => Math.abs(value - step) < Math.abs(best - step) ? value : best, .25);
  els.gridPresets.forEach(button => button.classList.toggle('active', Number(button.dataset.gridStep) === activePreset));
}
function closeCompactMenus() {
  els.settingsMenu?.classList.remove('open'); els.settingsToggle?.classList.remove('active');
  $('#snap-menu')?.classList.remove('open'); $('#snap-menu-button')?.classList.remove('active'); els.viewSwitcher?.classList.remove('open'); els.viewManage?.classList.remove('active'); setBackgroundPage(false);
  els.backgroundBar?.classList.remove('open','onboarding'); els.bgManage?.classList.remove('active');
}
// Keeps a stored position inside the scene (0–100 %); returns true when it had to be corrected.
function bringIntoScene(item) {
  if (!item) return false;
  const x = Number(item.xPercent), y = Number(item.yPercent);
  const nx = Number.isFinite(x) ? clamp(x, 0, 100) : 50, ny = Number.isFinite(y) ? clamp(y, 0, 100) : 50;
  if (nx === x && ny === y) return false;
  item.xPercent = nx; item.yPercent = ny; return true;
}
// The visible edit grid: L = 10 % of the plan (as before), M = 5 %, S = 2,5 %. Lines start at the plan's edges, so the
// grid is always symmetric (a line through the centre) and scales with the plan. Resize dots snap to these lines.
function gridVisual() { const step = Number(model.settings?.snapStep) || .25; return step >= 4 ? 10 : step >= 1 ? 5 : 2.5; }
// Square grid: the cell is a share of the plan's width (L 10 %, M 5 %, S 2,5 %) on both axes, and the lines are counted
// from the plan's centre, so a line always runs through the middle of the plan both ways.
function syncGridGeometry() {
  // Guide and edit lines are one device pixel thin, whatever the screen density.
  document.documentElement.style.setProperty('--dpr', String(window.devicePixelRatio || 1));
  const scene = els.scene; if (!scene) return; const w = scene.offsetWidth, h = scene.offsetHeight, g = w * gridVisual() / 100; if (!g) return;
  scene.style.setProperty('--grid-px', `${g}px`); scene.style.setProperty('--grid-ox', `${(w / 2) % g}px`); scene.style.setProperty('--grid-oy', `${(h / 2) % g}px`);
}
function gridLineNear(v, horizontal) {
  if (model.settings?.snapEnabled === false) return null;
  const sc = els.scene.getBoundingClientRect(), origin = horizontal ? sc.left + sc.width / 2 : sc.top + sc.height / 2, step = sc.width * gridVisual() / 100; if (!step) return null;
  const line = origin + Math.round((v - origin) / step) * step; return Math.abs(line - v) <= (mobileView() ? 18 : 13) ? line : null;
}
function snapPercent(value) {
  if (model.settings?.snapEnabled === false) return clamp(value, 0, 100);
  const step = Number(model.settings?.snapStep) || .25;
  return clamp(Math.round(value / step) * step, 0, 100);
}
// ---- Rooms: polygons on the plan that light up with their entities -------------------
// A room is a polygon in scene percent coordinates (any shape: L-shapes, stairs, slanted walls). It lights
// up when one of its entities is on: either a soft coloured glow blended over the plan, or a second "lit"
// image revealed only inside the polygon. Light colour and brightness can follow the light entity.
// One set of tap actions (same names and order) for markers and rooms; "toggle" only where something can be switched.
// Copy / paste style also carries the icon choice (source, own MDI icon, ON/OFF icons) and the tap action.
const MARKER_ICON_KEYS = ['iconMode','iconName','iconOn','iconOff','iconVariantEnabled'];
const TAP_ACTIONS = [['more_info','Więcej informacji'],['toggle','Przełącz ON/OFF'],['none','Brak akcji']];
function tapActionControl(value, canToggle) {
  const items = TAP_ACTIONS.filter(([key]) => key !== 'toggle' || canToggle), current = items.some(([key]) => key === value) ? value : 'more_info';
  return control('Dotknięcie w widoku','tapAction','select',current,{ items });
}
const ROOM_DEFAULTS = Object.freeze(withExtraPartDefaults({ name:'Pomieszczenie', points:[], entityIds:[], tapAction:'toggle', mode:'glow', color:'#FFD27A', useLightColor:true, useBrightness:true, opacity:.45, feather:14, blend:'screen', litImage:'', stateEnabled:false, offColor:'#20B9E7', offOpacity:.2,
  lightEffect:'none', lightX:50, lightY:50, lightDirection:'left', lightWallPos:50, lightSpread:.6, lightFill:.15, labelLinked:false,
  labelCardX:0, labelCardY:0, labelCardLayout:'column', labelCardAlign:'center', labelCardBg:true, labelCardBgColor:'#081822', labelCardBgOpacity:.62, labelCardBlur:false, labelCardRadius:14, labelCardPadding:10, labelCardGap:4,
  labelCardBorder:false, labelCardBorderColor:'#FFFFFF', labelCardBorderOpacity:.3, labelCardBorderWidth:1,
  labelCardBgState:false, labelCardBgOnColor:'#3A2A08', labelCardBgOffColor:'#081822', labelCardBgOnOpacity:.62, labelCardBgOffOpacity:.62,
  labelCardBorderState:false, labelCardBorderOnColor:'#FFC46B', labelCardBorderOffColor:'#FFFFFF', labelCardBorderOnOpacity:.7, labelCardBorderOffOpacity:.3, labelCardBorderOnWidth:1.5, labelCardBorderOffWidth:1, labelCardScale:1, labelIconDX:0, labelIconDY:0, labelNameDX:0, labelNameDY:0, labelStateDX:0, labelStateDY:0,
  labelIcon:false, labelIconName:'', labelIconOn:'#FFC46B', labelIconOff:'#9FB6C3', labelIconSize:120, labelIconX:0, labelIconY:-80, labelIconBg:false, labelIconBgOpacity:.55, labelIconBgColor:'#081822',
  labelIconAnim:false, labelIconAnimType:'spin', labelIconAnimSpeed:1.5, labelIconAnimDir:'cw', labelIconAnimOnlyOn:true, labelIconAnimEntitySpeed:false,
  labelIconVariant:false, labelIconNameOn:'', labelIconNameOff:'', labelIconOpacityOn:1, labelIconOpacityOff:1, labelIconFill:true, labelIconOutline:false, labelIconOutlineColor:'#FFFFFF', labelIconOutlineWidth:1.5,
  labelIconSource:'entity', labelIconColorState:true, labelIconColor:'#FFC46B', labelIconOpacity:1,
  labelIconOutlineState:false, labelIconOutlineOnColor:'#FFFFFF', labelIconOutlineOffColor:'#9FB6C3', labelIconOutlineOnWidth:1.5, labelIconOutlineOffWidth:1.5, labelIconOutlineOpacity:1, labelIconOutlineOnOpacity:1, labelIconOutlineOffOpacity:1,
  labelIconBgState:false, labelIconBgOnColor:'#3A2A08', labelIconBgOffColor:'#081822', labelIconBgOnOpacity:.6, labelIconBgOffOpacity:.55,
  labelIconBorderState:false, labelIconBorderOnColor:'#FFC46B', labelIconBorderOffColor:'#9FB6C3', labelIconBorderOnOpacity:.8, labelIconBorderOffOpacity:.5, labelIconBorderOnWidth:2, labelIconBorderOffWidth:1.5,
  labelIconBorder:false, labelIconBlur:false, labelIconBorderColor:'#FFFFFF', labelIconBorderOpacity:.6, labelIconBorderWidth:1.5, labelIconShape:'circle', labelIconRadius:10, labelIconPadding:6,
  labelNameBorder:false, labelNameBorderColor:'#FFFFFF', labelNameBorderOpacity:.6, labelNameBorderWidth:1.5,
  labelStateBorder:false, labelStateBorderColor:'#FFFFFF', labelStateBorderOpacity:.6, labelStateBorderWidth:1.5,
  labelEqualFrames:false, labelCardFree:false, labelCardShadow:true,
  outline:false, outlineColor:'#FFFFFF', outlineOpacity:.6, outlineWidth:2, outlineStyle:'solid', outlineState:false, outlineOnColor:'#FFC46B', outlineOffColor:'#9FB6C3', outlineOnOpacity:.9, outlineOffOpacity:.4, outlineOnWidth:2.5, outlineOffWidth:1.5,
  labelStateOnText:'', labelStateOffText:'', labelStateUnit:'', labelStateDecimals:'auto',
  labelRules:false, labelRulesLow:18, labelRulesHigh:24, labelRulesColorLow:'#4FC3F7', labelRulesColorMid:'#81C784', labelRulesColorHigh:'#FF8A65', labelRulesSmooth:false, labelRulesIcon:true, labelRulesState:true,
  labelNameColorState:false, labelNameColorOn:'#FFFFFF', labelNameColorOff:'#9FB6C3', labelNameOpacity:1, labelNameOpacityOn:1, labelNameOpacityOff:1, labelNameWeight:'bold',
  labelStateColorState:false, labelStateColorOn:'#FFC46B', labelStateColorOff:'#9FB6C3', labelStateOpacity:1, labelStateOpacityOn:1, labelStateOpacityOff:1, labelStateWeight:'normal',
  labelNameBgState:false, labelNameBgOnColor:'#3A2A08', labelNameBgOffColor:'#081822', labelNameBgOnOpacity:.55, labelNameBgOffOpacity:.55, labelNameBlur:false,
  labelStateBgState:false, labelStateBgOnColor:'#3A2A08', labelStateBgOffColor:'#081822', labelStateBgOnOpacity:.55, labelStateBgOffOpacity:.55, labelStateBlur:false,
  labelNameBorderState:false, labelNameBorderOnColor:'#FFC46B', labelNameBorderOffColor:'#9FB6C3', labelNameBorderOnOpacity:.8, labelNameBorderOffOpacity:.5, labelNameBorderOnWidth:2, labelNameBorderOffWidth:1.5,
  labelStateBorderState:false, labelStateBorderOnColor:'#FFC46B', labelStateBorderOffColor:'#9FB6C3', labelStateBorderOnOpacity:.8, labelStateBorderOffOpacity:.5, labelStateBorderOnWidth:2, labelStateBorderOffWidth:1.5,
  labelIconW:0, labelIconH:0, labelNameW:0, labelNameH:0, labelStateW:0, labelStateH:0,
  labelIconFX:0, labelIconFY:0, labelNameFX:0, labelNameFY:0, labelStateFX:0, labelStateFY:0,
  labelName:false, labelNameColor:'#FFFFFF', labelNameSize:60, labelNameX:0, labelNameY:28, labelNameBg:false, labelNameBgOpacity:.55, labelNameBgColor:'#081822',
  labelState:false, labelStateColor:'#DCE8EF', labelStateSize:50, labelStateX:0, labelStateY:84, labelStateBg:false, labelStateBgOpacity:.55, labelStateBgColor:'#081822', labelDial:false, labelDialColor:'#FFFFFF', labelDialSize:26, labelDialX:0, labelDialY:0, labelDialBg:false, labelDialBgOpacity:.55, labelDialBgColor:'#081822', labelDialBorder:false, labelDialBorderColor:'#FFFFFF', labelDialBorderOpacity:.6, labelDialBorderWidth:1.5, labelDialDX:0, labelDialDY:0, labelDialOpacity:1, labelDialOpacityOn:1, labelDialOpacityOff:1, labelDialColorOn:'#FFFFFF', labelDialColorOff:'#FFFFFF', labelTarget:false, labelTargetColor:'#FFFFFF', labelTargetSize:36, labelTargetX:0, labelTargetY:0, labelTargetBg:false, labelTargetBgOpacity:.55, labelTargetBgColor:'#081822', labelTargetBorder:false, labelTargetBorderColor:'#FFFFFF', labelTargetBorderOpacity:.6, labelTargetBorderWidth:1.5, labelTargetDX:0, labelTargetDY:0, labelTargetOpacity:1, labelTargetOpacityOn:1, labelTargetOpacityOff:1, labelTargetColorOn:'#FFFFFF', labelTargetColorOff:'#FFFFFF', labelCurrent:false, labelCurrentColor:'#A9C6D4', labelCurrentSize:14, labelCurrentX:0, labelCurrentY:0, labelCurrentBg:false, labelCurrentBgOpacity:.55, labelCurrentBgColor:'#081822', labelCurrentBorder:false, labelCurrentBorderColor:'#FFFFFF', labelCurrentBorderOpacity:.6, labelCurrentBorderWidth:1.5, labelCurrentDX:0, labelCurrentDY:0, labelCurrentOpacity:1, labelCurrentOpacityOn:1, labelCurrentOpacityOff:1, labelCurrentColorOn:'#FFFFFF', labelCurrentColorOff:'#FFFFFF', labelAction:false, labelActionColor:'#FFFFFF', labelActionSize:12, labelActionX:0, labelActionY:0, labelActionBg:false, labelActionBgOpacity:.55, labelActionBgColor:'#081822', labelActionBorder:false, labelActionBorderColor:'#FFFFFF', labelActionBorderOpacity:.6, labelActionBorderWidth:1.5, labelActionDX:0, labelActionDY:0, labelActionOpacity:1, labelActionOpacityOn:1, labelActionOpacityOff:1, labelActionColorOn:'#FFFFFF', labelActionColorOff:'#FFFFFF', labelMinus:false, labelMinusColor:'#FFFFFF', labelMinusSize:18, labelMinusX:0, labelMinusY:0, labelMinusBg:false, labelMinusBgOpacity:.55, labelMinusBgColor:'#081822', labelMinusBorder:false, labelMinusBorderColor:'#FFFFFF', labelMinusBorderOpacity:.6, labelMinusBorderWidth:1.5, labelMinusDX:0, labelMinusDY:0, labelMinusOpacity:1, labelMinusOpacityOn:1, labelMinusOpacityOff:1, labelMinusColorOn:'#FFFFFF', labelMinusColorOff:'#FFFFFF', labelPlus:false, labelPlusColor:'#FFFFFF', labelPlusSize:18, labelPlusX:0, labelPlusY:0, labelPlusBg:false, labelPlusBgOpacity:.55, labelPlusBgColor:'#081822', labelPlusBorder:false, labelPlusBorderColor:'#FFFFFF', labelPlusBorderOpacity:.6, labelPlusBorderWidth:1.5, labelPlusDX:0, labelPlusDY:0, labelPlusOpacity:1, labelPlusOpacityOn:1, labelPlusOpacityOff:1, labelPlusColorOn:'#FFFFFF', labelPlusColorOff:'#FFFFFF', labelModes:false, labelModesColor:'#8FA9B7', labelModesSize:15, labelModesX:0, labelModesY:0, labelModesBg:false, labelModesBgOpacity:.55, labelModesBgColor:'#081822', labelModesBorder:false, labelModesBorderColor:'#FFFFFF', labelModesBorderOpacity:.6, labelModesBorderWidth:1.5, labelModesDX:0, labelModesDY:0, labelModesOpacity:1, labelModesOpacityOn:1, labelModesOpacityOff:1, labelModesColorOn:'#FFFFFF', labelModesColorOff:'#FFFFFF', thermoHeatColor:'#FF7A2F', thermoCoolColor:'#38BDF8', thermoAutoColor:'#34D399', thermoDryColor:'#FBBF24', thermoFanColor:'#A78BFA', thermoOffColor:'#64748B', thermoTrackColor:'#1E3546', thermoDialWidth:9, thermoDialRange:true, thermoGlow:true, labelActionAccent:true, labelTargetAccent:false, labelCurrentAccent:false, labelTargetUnit:'°C', labelTargetDecimals:'auto', labelCurrentUnit:'°C', labelCurrentDecimals:'auto', thermoDotSize:100, thermoKnobSize:100 }));
// A freshly drawn room starts with its icon, name and state visible and the usual extras switched on
// (icon outline, backgrounds, icon border), so every option is visible and can be tuned or turned off.
const NEW_ROOM_LABEL = Object.freeze({ labelIcon:true, labelName:true, labelState:true, labelLinked:true, labelCardBg:true, labelCardBorder:true,
  labelIconOutline:true, labelIconBg:true, labelIconBorder:true, labelIconColor:'#9FB6C3', labelNameBg:true, labelNameBorder:true, labelStateBg:true, labelStateBorder:true, labelIconY:-97, labelNameY:26, labelStateY:123 });
// Scales a new room's group so it fits inside the drawn shape (at most 70 % of its width and 60 % of its height, never above the default size).
function fitRoomLabel(id) {
  const room = roomsOf()[id], card = document.querySelector(`.room-label-card[data-room-id="${CSS.escape(id)}"]`), scene = els.scene?.getBoundingClientRect();
  if (!room?.labelLinked || !card || !scene?.width || !room.points?.length) return;
  const box = card.getBoundingClientRect(), scale = clamp(Number(room.labelCardScale) || 1, .3, 4.5); if (!box.width || !box.height) return;
  const xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
  const roomW = (Math.max(...xs) - Math.min(...xs)) / 100 * scene.width, roomH = (Math.max(...ys) - Math.min(...ys)) / 100 * scene.height;
  const fit = Math.min(roomW * .7 / (box.width / scale), roomH * .6 / (box.height / scale));
  const next = Math.round(clamp(fit, .3, 1) * 20) / 20; if (next === room.labelCardScale) return;
  room.labelCardScale = next; renderRooms();
}
// Room label parts: each is shown, styled and placed on its own (offsets in plan pixels from the room centre).
// A thermostat (a label on a climate entity) has more parts; for other labels they stay off and empty.
const THERMO_PARTS = [['dial','labelDial','Tarcza'],['target','labelTarget','Temperatura ustawiona'],['current','labelCurrent','Temperatura aktualna'],['action','labelAction','Stan pracy'],['minus','labelMinus','Przycisk −'],['plus','labelPlus','Przycisk +'],['modes','labelModes','Tryby']];
// Extra entities of a thermostat (another sensor of the heater…): up to four more parts, each placed and styled like the
// others; they show that entity's state (with its unit) and an optional text before it.
const EXTRA_PARTS = [1, 2, 3, 4].map(i => [`x${i}`, `labelX${i}`, `Encja ${i}`]);
const ROOM_LABEL_PARTS = [['icon','labelIcon','Ikona'],['name','labelName','Nazwa'],['state','labelState','Stan'], ...THERMO_PARTS, ...EXTRA_PARTS];
const isExtraPart = part => /^x\d$/.test(part);
function extraEntityText(r, key) {
  const id = r[`${key}Entity`], st = stateCache[id]; if (!st) return '–';
  const text = roomLabelState({ ...ROOM_DEFAULTS, kind: 'icon', entityIds: [id], labelStateUnit: r[`${key}Unit`] ?? '', labelStateDecimals: r[`${key}Decimals`] ?? 'auto' });
  // Numbers with a decimal comma (like the thermostat's own values); plain HA states in words.
  const raw = String(st.state ?? '').toLowerCase(), words = { on: 'Włączone', off: 'Wyłączone', unavailable: 'Niedostępny', unknown: '–', open: 'Otwarte', closed: 'Zamknięte' };
  const shown = words[raw] && Number.isNaN(Number(st.state)) ? translateValue(words[raw]) : translateValue(String(text).replace(/(\d)\.(\d)/g, '$1,$2'));
  const prefix = String(r[`${key}Prefix`] || '').trim(); return `${prefix ? `${prefix} ` : ''}${shown}`;
}
function extraEntityName(id) { return String(stateCache[id]?.attributes?.friendly_name || allEntitiesCache?.find(e => e.id === id)?.name || id || ''); }
// Placed freely, a thermostat's dial is the bottom layer: the parts lying on it (name, icon, state...) stay grabbable.
const layeredParts = list => [...list].sort((a, b) => (b[0] === 'dial') - (a[0] === 'dial'));
const ROOM_LABEL_KEYS = ROOM_LABEL_PARTS.flatMap(([, k]) => [k, `${k}Size`, `${k}X`, `${k}Y`, `${k}Bg`, `${k}BgOpacity`, `${k}BgColor`]).concat(['labelCardX','labelCardY','labelCardW','labelCardH','labelCardLayout','labelCardAlign','labelCardBg','labelCardBgColor','labelCardBgOpacity','labelCardBlur','labelCardRadius','labelCardPadding','labelCardGap','labelCardBorder','labelCardBorderColor','labelCardBorderOpacity','labelCardBorderWidth','labelCardBgState','labelCardBgOnColor','labelCardBgOffColor','labelCardBgOnOpacity','labelCardBgOffOpacity','labelCardBorderState','labelCardBorderOnColor','labelCardBorderOffColor','labelCardBorderOnOpacity','labelCardBorderOffOpacity','labelCardBorderOnWidth','labelCardBorderOffWidth','labelCardScale','labelIconDX','labelIconDY','labelNameDX','labelNameDY','labelStateDX','labelStateDY']).concat(['labelLinked','labelIconName','labelIconOn','labelIconOff','labelNameColor','labelStateColor','labelIconVariant','labelIconNameOn','labelIconNameOff','labelIconOpacityOn','labelIconOpacityOff','labelIconFill','labelIconOutline','labelIconOutlineColor','labelIconOutlineWidth','labelIconSource','labelIconBorder','labelIconBorderColor','labelIconBorderOpacity','labelIconBorderWidth','labelIconShape','labelIconRadius','labelIconPadding','labelIconBlur','labelIconColorState','labelIconColor','labelIconOpacity','labelIconOutlineState','labelIconOutlineOnColor','labelIconOutlineOffColor','labelIconOutlineOnWidth','labelIconOutlineOffWidth','labelIconOutlineOpacity','labelIconOutlineOnOpacity','labelIconOutlineOffOpacity','labelIconBgState','labelIconBgOnColor','labelIconBgOffColor','labelIconBgOnOpacity','labelIconBgOffOpacity','labelIconBorderState','labelIconBorderOnColor','labelIconBorderOffColor','labelIconBorderOnOpacity','labelIconBorderOffOpacity','labelIconBorderOnWidth','labelIconBorderOffWidth','labelNameBorder','labelNameBorderColor','labelNameBorderOpacity','labelNameBorderWidth','labelStateBorder','labelStateBorderColor','labelStateBorderOpacity','labelStateBorderWidth','labelEqualFrames','labelCardFree','labelIconW','labelIconH','labelNameW','labelNameH','labelStateW','labelStateH','labelIconFX','labelIconFY','labelNameFX','labelNameFY','labelStateFX','labelStateFY','labelCardShadow','labelStateOnText','labelStateOffText','labelStateUnit','labelStateDecimals','labelRules','labelRulesLow','labelRulesHigh','labelRulesColorLow','labelRulesColorMid','labelRulesColorHigh','labelRulesSmooth','labelRulesIcon','labelRulesState'], ['labelName','labelState'].flatMap(k => ['ColorState', 'ColorOn', 'ColorOff', 'Opacity', 'OpacityOn', 'OpacityOff', 'Weight', 'BgState', 'BgOnColor', 'BgOffColor', 'BgOnOpacity', 'BgOffOpacity', 'Blur', 'BorderState', 'BorderOnColor', 'BorderOffColor', 'BorderOnOpacity', 'BorderOffOpacity', 'BorderOnWidth', 'BorderOffWidth', 'Radius', 'Padding'].map(f => k + f)));
// Outline of a room's shape (drawn on top of its light, not faded with it); can follow ON / OFF.
const ROOM_OUTLINE_KEYS = ['outline','outlineColor','outlineOpacity','outlineWidth','outlineStyle','outlineState','outlineOnColor','outlineOffColor','outlineOnOpacity','outlineOffOpacity','outlineOnWidth','outlineOffWidth'];
function pct100(value) { return Math.round(clamp(Number(value ?? 1), 0, 1) * 100); }
function roomOutlineMarkup(room, preview = '') {
  const r = { ...ROOM_DEFAULTS, ...room }; if (!r.outline || isIconRoom(r) || (r.points || []).length < 3) return '';
  const on = preview ? preview === 'on' : roomLight(r).on, dual = !!r.outlineState && roomSwitchable(r);
  const pick = field => dual ? r[`outline${on ? 'On' : 'Off'}${field}`] : r[`outline${field}`];
  const width = clamp(Number(pick('Width')) || 2, .5, 20), dash = r.outlineStyle === 'dashed' ? ` stroke-dasharray="${width * 4} ${width * 3}"` : r.outlineStyle === 'dotted' ? ` stroke-dasharray="0 ${width * 2.2}" stroke-linecap="round"` : '';
  return `<svg class="room-outline-layer" data-room-id="${escapeHtml(r.id)}" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${roomPointsAttr(r.points)}" fill="none" stroke="${rgba(pick('Color') || '#FFFFFF', clamp(Number(pick('Opacity') ?? .6), 0, 1))}" stroke-width="${width}" stroke-linejoin="round"${dash} vector-effect="non-scaling-stroke"/></svg>`;
}
const ROOM_LIGHT_KEYS = ['lightEffect','lightX','lightY','lightDirection','lightWallPos','lightSpread','lightFill'];
const ROOM_ON_STATES = new Set(['on','open','opening','home','playing','heat','heating','cool','cooling','detected','unlocked','active','true']);
// The part picked by its section name in the editor (marked on the plan and zoomed to on a phone).
let panelPart = null;
let skipRoomFocus = false, movingRoomId = null, selectedLabelPart = 'icon', selectedRoomId = null, roomDraft = null, roomPreviewOn = '', roomEditorOpenSectionIndex = -1, roomStyleClipboard = null, allEntitiesCache = null, allEntitiesLoading = null;
const ROOM_STYLE_KEYS = ['tapAction','color','opacity','feather','stateEnabled','offColor','offOpacity', ...ROOM_LIGHT_KEYS, ...ROOM_LABEL_KEYS, ...ROOM_OUTLINE_KEYS];
function roomsOf(view = activeSceneView()) { return view?.rooms || {}; }
function roomOf(id) { const room = roomsOf()[id]; return room ? { ...ROOM_DEFAULTS, ...room } : null; }
function roomLight(room) {
  let on = false, color = '', level = 0;
  (room.entityIds || []).forEach(id => {
    const st = stateCache[id], state = String(st?.state ?? '').toLowerCase(); if (!ROOM_ON_STATES.has(state)) return;
    on = true; const attrs = st?.attributes || {};
    level = 1;
  });
  return { on, color: color || room.color, level: on ? level || 1 : 0 };
}
function roomPointsAttr(points) { return (points || []).map(([x, y]) => `${Math.round(x * 1000) / 1000},${Math.round(y * 1000) / 1000}`).join(' '); }
function roomBackgroundUrl(name) { return `api/background/file?name=${encodeURIComponent(name)}`; }
// One <svg> per room so each can blend with the plan (mix-blend-mode) on its own.
// Light effects like a marker background: a soft spot (centre / corner / ambient) or light from a wall, on top of an
// even base ("Wypełnienie"). Gradients are in plan coordinates of the room's bounding box, all layers share the blur.
function roomEffectBody(r, id, blur, points, color) {
  const effect = ['center','corner','wall','ambient'].includes(r.lightEffect) ? r.lightEffect : 'none', c = escapeHtml(color);
  const layer = (fill, extra = '', cls = 'room-fill-layer') => `<polygon class="${cls}" points="${points}" fill="${fill}" ${extra} filter="url(#${id}-blur)"/>`;
  if (effect === 'none') return `<defs>${blur}</defs>${layer(c, '', 'room-fill')}`;
  const xs = r.points.map(p => p[0]), ys = r.points.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), bw = Math.max(.1, x1 - x0), bh = Math.max(.1, y1 - y0);
  const spread = clamp(Number(r.lightSpread) || .6, .15, 1), fill = clamp(Number(r.lightFill) || 0, 0, 1), px = clamp(Number(r.lightX ?? 50), 0, 100) / 100, py = clamp(Number(r.lightY ?? 50), 0, 100) / 100;
  const wide = (42 + spread * 88) / 100, tall = (34 + spread * 82) / 100, stops = list => list.map(([o, t]) => `<stop class="room-stop" offset="${o}" stop-color="${c}" stop-opacity="${t}"/>`).join('');
  const radial = (name, cx, cy, list) => `<radialGradient id="${id}-${name}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${cx.toFixed(3)} ${cy.toFixed(3)}) scale(${(bw * wide).toFixed(3)} ${(bh * tall).toFixed(3)})">${stops(list)}</radialGradient>`;
  const linear = (name, ax, ay, bx, by, list) => `<linearGradient id="${id}-${name}" gradientUnits="userSpaceOnUse" x1="${ax.toFixed(3)}" y1="${ay.toFixed(3)}" x2="${bx.toFixed(3)}" y2="${by.toFixed(3)}">${stops(list)}</linearGradient>`;
  let defs = '', shapes = layer(c, `fill-opacity="${fill}"`, 'room-fill');
  if (effect === 'center' || effect === 'corner') {
    defs += radial('spot', x0 + bw * px, y0 + bh * py, effect === 'center' ? [[0, 1], [.4, .55], [.72, .12], [1, 0]] : [[0, 1], [.34, .56], [.68, .12], [1, 0]]); shapes += layer(`url(#${id}-spot)`);
  } else if (effect === 'ambient') {
    defs += radial('spot', x0 + bw * px, y0 + bh * py, [[0, .82], [.51, .23], [1, 0]]) + linear('wash', x0, y0, x1, y1, [[0, .18], [1, .62]]); shapes += layer(`url(#${id}-wash)`) + layer(`url(#${id}-spot)`);
  } else {
    const dir = ['left','right','top','bottom'].includes(r.lightDirection) ? r.lightDirection : 'left', along = clamp(Number(r.lightWallPos ?? 50), 0, 100) / 100;
    const at = { left:[x0, y0 + bh * along], right:[x1, y0 + bh * along], top:[x0 + bw * along, y0], bottom:[x0 + bw * along, y1] }[dir];
    const end = { left:[x0 + bw * .82, at[1]], right:[x1 - bw * .82, at[1]], top:[at[0], y0 + bh * .82], bottom:[at[0], y1 - bh * .82] }[dir];
    defs += radial('spot', at[0], at[1], [[0, .9], [.48, .3], [1, 0]]) + linear('wash', at[0], at[1], end[0], end[1], [[0, .55], [1, 0]]); shapes += layer(`url(#${id}-wash)`) + layer(`url(#${id}-spot)`);
  }
  return `<defs>${blur}${defs}</defs>${shapes}`;
}
// A lit room's soft glow is drawn once into a bitmap and shown as an image. A live SVG blur is re-rasterised whenever
// the plan gets its own GPU layer (a finger pan / pinch) and on a phone it could vanish for a frame (a blink).
// The glow is blurred anyway, so the bitmap scales without visible loss; a sharp-edged room (no feather) stays live.
const ROOM_GLOW_BITMAPS = new Map(), ROOM_GLOW_PENDING = new Map();
function roomGlowBitmap(roomId, key, body, width, height, box, onReady = renderRooms, tone = null) {
  const ready = ROOM_GLOW_BITMAPS.get(key); if (ready) { ROOM_GLOW_BITMAPS.delete(key); ROOM_GLOW_BITMAPS.set(key, ready); return ready; }
  if (ROOM_GLOW_PENDING.get(roomId)?.key === key) return null;
  clearTimeout(ROOM_GLOW_PENDING.get(roomId)?.timer);
  // Debounced per room, so dragging a vertex or a slider does not render a bitmap for every step.
  const job = { key, timer: setTimeout(async () => {
    try {
      // Only the room's own box (plus its soft edge) is drawn, so the bitmap and its GPU texture stay small.
      const [bx, by, bw, bh] = box, pw = width * bw / 100, ph = height * bh / 100;
      const scale = Math.min(clamp(window.devicePixelRatio || 1, 1, 2), 2048 / Math.max(1, pw, ph)), w = Math.max(1, Math.round(pw * scale)), h = Math.max(1, Math.round(ph * scale));
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${bx} ${by} ${bw} ${bh}" preserveAspectRatio="none">${body}</svg>`);
      await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
      if (tone) {
        // "Screen" baked in: over a backdrop of colour B, screen(B, glow) = B + a*G*(1-B), which a plain (normal-blended)
        // pixel of colour B + G*(1-B) with the glow's own alpha gives exactly. B is the average plan colour under the room.
        const data = ctx.getImageData(0, 0, w, h), d = data.data, t = tone.map(v => v * 255), k = tone.map(v => 1 - v);
        for (let i = 0; i < d.length; i += 4) if (d[i + 3]) { d[i] = t[0] + d[i] * k[0]; d[i + 1] = t[1] + d[i + 1] * k[1]; d[i + 2] = t[2] + d[i + 2] * k[2]; }
        ctx.putImageData(data, 0, 0);
      }
      const blob = await new Promise(done => canvas.toBlob(done, 'image/png')); if (!blob) return;
      const url = URL.createObjectURL(blob), probe = new Image(); probe.src = url; await probe.decode().catch(() => {});
      ROOM_GLOW_BITMAPS.set(key, url);
      while (ROOM_GLOW_BITMAPS.size > 80) { const [oldKey, oldUrl] = ROOM_GLOW_BITMAPS.entries().next().value; ROOM_GLOW_BITMAPS.delete(oldKey); URL.revokeObjectURL(oldUrl); }
    } catch {} finally { if (ROOM_GLOW_PENDING.get(roomId) === job) ROOM_GLOW_PENDING.delete(roomId); }
    if (ROOM_GLOW_BITMAPS.has(key)) onReady();
  }, 220) };
  ROOM_GLOW_PENDING.set(roomId, job); return null;
}
// Swaps a lit room's live SVG for its cached glow bitmap once one is ready (see roomGlowBitmap).
// Glow drawing on touch devices: plain transparency with the "screen" look baked in (see roomGlowBitmap). A blended
// (mix-blend-mode) glow makes a phone compose the plan in expensive tiles: at a high zoom parts of the light were
// missing while panning, and it blinked when the view card turned in 3D (cube). A plain glow is a cheap image drawn
// together with the plan. Mouse devices keep the exact blend. Settings → "Poświata pomieszczeń" overrides it.
function roomGlowFlat() { const mode = model.settings?.glowBlend; return mode === 'normal' || (mode !== 'screen' && !!window.matchMedia?.('(pointer: coarse)').matches); }
// The average colour (0..1 RGB) of the plan under a room's box: the background image with its brightness filter and
// the sun dimming tint, measured from a 12x12 sample. Falls back to a mid grey (e.g. an image from another origin).
const BACKDROP_TONES = new Map();
function backdropTone(backdrop, box) {
  const img = backdrop?.img, tint = clamp(Number(backdrop?.tint) || 0, 0, 1), useImage = img?.complete && img.naturalWidth > 0;
  const key = [useImage ? img.currentSrc || img.src : backdrop?.color, backdrop?.filter || '', box, tint.toFixed(2)].join('|'); if (BACKDROP_TONES.has(key)) return BACKDROP_TONES.get(key);
  let tone = [.45, .45, .45];
  try {
    if (useImage) {
      const c = document.createElement('canvas'); c.width = c.height = 12; const ctx = c.getContext('2d'), nw = img.naturalWidth, nh = img.naturalHeight;
      const x0 = clamp(box[0], 0, 100), y0 = clamp(box[1], 0, 100), x1 = clamp(box[0] + box[2], 0, 100), y1 = clamp(box[1] + box[3], 0, 100);
      if (x1 - x0 > .1 && y1 - y0 > .1) {
        ctx.filter = backdrop.filter || 'none'; ctx.drawImage(img, x0 / 100 * nw, y0 / 100 * nh, (x1 - x0) / 100 * nw, (y1 - y0) / 100 * nh, 0, 0, 12, 12);
        const d = ctx.getImageData(0, 0, 12, 12).data, sum = [0, 0, 0]; for (let i = 0; i < d.length; i += 4) { sum[0] += d[i]; sum[1] += d[i + 1]; sum[2] += d[i + 2]; }
        tone = sum.map(v => v / 144 / 255);
      }
    } else {
      const hex = String(backdrop?.color || '').match(/#([0-9a-f]{6})/i)?.[1] || '0d2838'; tone = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    }
    // The dimming tint (#16244f, multiply) lies over the image and under the lights.
    if (tint) tone = tone.map((v, i) => v * (1 - tint + tint * [22, 36, 79][i] / 255));
  } catch {}
  tone = tone.map(v => Math.round(clamp(v, 0, 1) * 50) / 50); // coarse steps: a slowly changing sun tint re-draws rarely
  BACKDROP_TONES.set(key, tone); if (BACKDROP_TONES.size > 400) BACKDROP_TONES.delete(BACKDROP_TONES.keys().next().value);
  return tone;
}
function sceneBackdrop() {
  const view = activeSceneView(), night = !!els.nightImage && !els.nightImage.hidden && els.nightImage.classList.contains('visible') && els.nightImage.naturalWidth > 0, img = night ? els.nightImage : els.image;
  return { img: img && !img.hidden ? img : null, filter: img?.style.filter || '', tint: night ? 0 : Number($('#scene-dim-tint')?.style.opacity) || 0, color: view?.backgroundColor };
}
// Swaps a lit room's live SVG for its cached glow bitmap once one is ready (see roomGlowBitmap).
function roomGlowApply(room, built, width, height, slot, onReady, backdrop = null) {
  if (built.feather < 2) return built;
  const xs = room.points.map(p => Number(p[0])), ys = room.points.map(p => Number(p[1])), mx = built.feather * 3 * 100 / width, my = built.feather * 3 * 100 / height;
  const box = [Math.min(...xs) - mx, Math.min(...ys) - my, Math.max(...xs) - Math.min(...xs) + 2 * mx, Math.max(...ys) - Math.min(...ys) + 2 * my].map(v => +v.toFixed(3));
  const tone = roomGlowFlat() ? backdropTone(backdrop || sceneBackdrop(), box) : null;
  const key = `${built.signature}|${built.color}|${box}|${tone || 'screen'}|${built.body}`, url = roomGlowBitmap(slot, key, built.body, width, height, box, onReady, tone);
  if (url) Object.assign(built, { signature: `img|${key}`, html: `<img class="room-layer room-glow${tone ? ' flat' : ''}" data-room-id="${escapeHtml(room.id)}" src="${url}" alt="" draggable="false" style="left:${box[0]}%;top:${box[1]}%;width:${box[2]}%;height:${box[3]}%;opacity:${built.opacity.toFixed(3)};mix-blend-mode:${tone ? 'normal' : 'screen'}">` });
  return built;
}
function roomLayerMarkup(room, prefix, width, height, preview = '') {
  const r = { ...ROOM_DEFAULTS, ...room }, light = roomLight(r), on = preview ? preview === 'on' : light.on, level = light.on ? light.level : 1;
  const id = `${prefix}-${String(r.id).replace(/[^a-z0-9_-]/gi, '')}`, fx = Math.max(0, Number(r.feather) || 0) * 100 / Math.max(1, width), fy = Math.max(0, Number(r.feather) || 0) * 100 / Math.max(1, height);
  const blur = `<filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${fx.toFixed(3)} ${fy.toFixed(3)}"/></filter>`;
  // Without "Kolor zależny ON/OFF" an off room is invisible; with it, OFF has its own colour and intensity.
  const dual = Boolean(r.stateEnabled), color = on || !dual ? r.color : r.offColor;
  const opacity = on ? clamp(Number(r.opacity) || 0, 0, 1) * level : dual ? clamp(Number(r.offOpacity) || 0, 0, 1) : 0, points = roomPointsAttr(r.points);
  const image = false; // the "lit image" effect was removed; rooms always use the colour glow
  const body = image
    ? `<defs>${blur}<mask id="${id}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><polygon points="${points}" fill="#fff" filter="url(#${id}-blur)"/></mask></defs><image href="${escapeHtml(roomBackgroundUrl(r.litImage))}" x="0" y="0" width="100" height="100" preserveAspectRatio="none" mask="url(#${id}-mask)"/>`
    : roomEffectBody(r, id, blur, points, color);
  return { html: `<svg class="room-layer" data-room-id="${escapeHtml(r.id)}" viewBox="0 0 100 100" preserveAspectRatio="none" style="opacity:${opacity.toFixed(3)};mix-blend-mode:screen">${body}</svg>`, body, feather: Math.max(0, Number(r.feather) || 0),
    signature: [r.mode, r.litImage, r.blend, r.feather, points, width, height, ...ROOM_LIGHT_KEYS.map(key => r[key])].join('|'), opacity, color };
}
// ---- Room label: icon, name and state drawn as part of the room (not a separate marker) --------------------
const ROOM_TOGGLE_DOMAINS = ['light', 'switch', 'fan', 'input_boolean'];
// Area centroid of the outline (falls back to the vertex average for a degenerate shape).
// An "icon" element is a room without a drawn shape: only its label group, anchored at its own point.
function isIconRoom(room) { return room?.kind === 'icon'; }
// "Tekst": a label (same look, group, dots, snapping) without an entity — its name is the text, the state part is an
// optional caption, and a tap runs its own action (go to a view, open a Home Assistant page or a link).
function isTextRoom(room) { return isIconRoom(room) && !!room?.textEl; }
function isThermoRoom(room) { return isIconRoom(room) && !!room?.thermo; }
// "Rozmiar" in the Group section is shown relative to the default: for an icon 1.0× is the size of a new icon.
const ICON_LABEL_SCALE = .6;
function labelScaleBase(room) { return isIconRoom(room) ? ICON_LABEL_SCALE : 1; }
// The plan area an icon's label covers (in scene %), used to centre it like a room; falls back to its point.
function iconFocusBox(room) {
  const scene = els.scene.getBoundingClientRect(), nodes = $$(`#room-labels [data-room-id="${CSS.escape(room.id)}"]`).map(node => node.getBoundingClientRect()).filter(r => r.width);
  if (!nodes.length || !scene.width) return [roomAnchor(room)];
  const toX = v => (v - scene.left) / scene.width * 100, toY = v => (v - scene.top) / scene.height * 100;
  const l = toX(Math.min(...nodes.map(r => r.left))), r = toX(Math.max(...nodes.map(r => r.right))), t = toY(Math.min(...nodes.map(r => r.top))), b = toY(Math.max(...nodes.map(r => r.bottom)));
  // A little room around it, so a small icon is not zoomed in as far as it would go.
  const padX = Math.max((r - l) * .25, 3), padY = Math.max((b - t) * .25, 3);
  return [[l - padX, t - padY], [r + padX, t - padY], [r + padX, b + padY], [l - padX, b + padY]];
}
// The plan box (scene %) of one part of a label / thermostat, grouped or not, with a little margin.
function partFocusBox(room, part) {
  const id = CSS.escape(room.id), node = $(`#room-labels .room-label-part[data-room-id="${id}"][data-label-part="${part}"], #room-labels .room-label-card[data-room-id="${id}"] .room-card-part[data-label-part="${part}"]`);
  const scene = els.scene.getBoundingClientRect(), r = node?.getBoundingClientRect(); if (!r?.width || !scene.width) return null;
  const l = (r.left - scene.left) / scene.width * 100, rr = (r.right - scene.left) / scene.width * 100, t = (r.top - scene.top) / scene.height * 100, b = (r.bottom - scene.top) / scene.height * 100;
  const padX = Math.max((rr - l) * .3, 2), padY = Math.max((b - t) * .3, 2);
  return [[l - padX, t - padY], [rr + padX, t - padY], [rr + padX, b + padY], [l - padX, b + padY]];
}
function roomAnchor(room) { const pin = isIconRoom(room) && dashSpan(room); return pin ? [pin.x + pin.w / 2, pin.y + pin.h / 2] : isIconRoom(room) ? [Number(room.x) || 50, Number(room.y) || 50] : roomLabelAnchor(room.points || []); }
// ---- Dashboard grid ("Siatka dashboardu"): a per-view grid of cols × rows cells (gap in plan px), shown in edit
// mode; a grouped label dropped on it snaps to whole cells and its group fills them (room.dash = {c, r, w, h}).
const DASH_GRID_ENABLED = false; // the dashboard grid is switched off for now (its menu entry was removed)
function dashGrid(view = activeSceneView()) { const g = view?.dashGrid || {}; return { on: DASH_GRID_ENABLED && !!g.on, cols: clamp(Math.round(Number(g.cols) || 3), 1, 24), rows: clamp(Math.round(Number(g.rows) || 8), 1, 24), gap: clamp(Number(g.gap ?? 8), 0, 80) }; }
function dashGeom(view = activeSceneView()) {
  const g = dashGrid(view), W = els.scene?.offsetWidth || 1, H = els.scene?.offsetHeight || 1, k = sceneScale || 1;
  const gx = g.gap * k / W * 100, gy = g.gap * k / H * 100;
  return { ...g, gx, gy, cw: (100 - gx * (g.cols + 1)) / g.cols, ch: (100 - gy * (g.rows + 1)) / g.rows };
}
// The scene-% box of a pinned label (null when the grid is off or the label is not pinned).
function dashSpan(room, view = activeSceneView()) {
  const d = room?.dash; if (!d || !room.labelLinked) return null; const g = dashGeom(view); if (!g.on) return null;
  const c = clamp(Math.round(d.c) || 0, 0, g.cols - 1), r = clamp(Math.round(d.r) || 0, 0, g.rows - 1), w = clamp(Math.round(d.w) || 1, 1, g.cols - c), h = clamp(Math.round(d.h) || 1, 1, g.rows - r);
  return { x: g.gx + c * (g.cw + g.gx), y: g.gy + r * (g.ch + g.gy), w: w * g.cw + (w - 1) * g.gx, h: h * g.ch + (h - 1) * g.gy, c, r, cw: w, ch: h };
}
// Cells a box (scene %) lands on: its size in whole cells (kept when already pinned) and the nearest start cell.
function dashTarget(box, keep, view = activeSceneView()) {
  const g = dashGeom(view), stepX = g.cw + g.gx, stepY = g.ch + g.gy;
  const w = clamp(keep?.w || Math.round((box.w + g.gx) / stepX) || 1, 1, g.cols), h = clamp(keep?.h || Math.round((box.h + g.gy) / stepY) || 1, 1, g.rows);
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const c = clamp(Math.round((cx - g.gx - (w * g.cw + (w - 1) * g.gx) / 2) / stepX), 0, g.cols - w), r = clamp(Math.round((cy - g.gy - (h * g.ch + (h - 1) * g.gy) / 2) / stepY), 0, g.rows - h);
  return { c, r, w, h };
}
function cardBoxPct(room) {
  const card = $(`.room-label-card[data-room-id="${CSS.escape(room.id)}"]`), s = els.scene.getBoundingClientRect(); if (!card || !s.width) return null;
  const r = card.getBoundingClientRect(); return { x: (r.left - s.left) / s.width * 100, y: (r.top - s.top) / s.height * 100, w: r.width / s.width * 100, h: r.height / s.height * 100 };
}
function pinToDash(room) {
  const box = cardBoxPct(room); if (!box) return false;
  room.dash = dashTarget(box, null); const span = dashSpan(room); if (!span) return false;
  room.x = Math.round((span.x + span.w / 2) * 100) / 100; room.y = Math.round((span.y + span.h / 2) * 100) / 100; room.labelCardX = 0; room.labelCardY = 0; return true;
}
function applyDashUi() {
  const g = dashGrid(), button = $('#dash-toggle'); if (!button) return;
  button.classList.toggle('active', g.on); const status = $('#dash-status'); if (status) status.textContent = g.on ? 'ON' : 'OFF';
  $('#dash-size-row')?.classList.toggle('off', !g.on);
  [['#dash-cols', g.cols], ['#dash-rows', g.rows], ['#dash-gap', g.gap]].forEach(([sel, v]) => { const input = $(sel); if (input && document.activeElement !== input) input.value = v; });
}
function setDashGrid(change) {
  const view = activeSceneView(); if (!view) return; view.dashGrid = { ...dashGrid(view), ...change };
  applyDashUi(); renderRooms(); if (selectedRoomId) openRoomEditor(selectedRoomId, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true);
}
function renderDashGrid(target = null) {
  applyDashUi();
  const view = activeSceneView(), g = dashGeom(view); let layer = $('#dash-grid');
  if (!editMode || !g.on || !els.scene) { layer?.remove(); return; }
  if (!layer) { layer = document.createElement('div'); layer.id = 'dash-grid'; layer.setAttribute('aria-hidden', 'true'); els.scene.insertBefore(layer, $('#rooms') || null); }
  const key = [g.cols, g.rows, g.gx.toFixed(3), g.gy.toFixed(3)].join('|');
  if (layer.__key !== key) {
    layer.__key = key;
    layer.innerHTML = Array.from({ length: g.cols * g.rows }, (_, i) => { const c = i % g.cols, r = Math.floor(i / g.cols); return `<span class="dash-cell" style="left:${g.gx + c * (g.cw + g.gx)}%;top:${g.gy + r * (g.ch + g.gy)}%;width:${g.cw}%;height:${g.ch}%"></span>`; }).join('') + '<span class="dash-target"></span>';
  }
  const t = layer.querySelector('.dash-target');
  if (t) { t.style.display = target ? 'block' : 'none'; if (target) Object.assign(t.style, { left:`${g.gx + target.c * (g.cw + g.gx)}%`, top:`${g.gy + target.r * (g.ch + g.gy)}%`, width:`${target.w * g.cw + (target.w - 1) * g.gx}%`, height:`${target.h * g.ch + (target.h - 1) * g.gy}%` }); }
}
function roomLabelAnchor(points) {
  let a = 0, cx = 0, cy = 0;
  points.forEach(([x1, y1], i) => { const [x2, y2] = points[(i + 1) % points.length], f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f; });
  return Math.abs(a) < 1e-6 ? roomCentroid(points) : [cx / (3 * a), cy / (3 * a)];
}
// The state text: own words for ON / OFF, and for a number its unit and decimals (empty / auto = from the entity).
function roomOnOffWord(room, on) { const own = String((on ? room.labelStateOnText : room.labelStateOffText) || '').trim(); return own || translateValue(on ? 'Wł.' : 'Wył.'); }
function roomNumber(room) { const st = stateCache[(room.entityIds || [])[0]]; const n = Number(String(st?.state ?? '').replace(',', '.')); return st && String(st.state).trim() !== '' && Number.isFinite(n) ? n : null; }
function withExtraPartDefaults(d) {
  // Each extra part starts with the "Stan" part's look (size, colours, frames…), hidden until an entity is added.
  [1, 2, 3, 4].forEach(i => Object.keys(d).filter(k => k.startsWith('labelState') && k !== 'labelState' && !/^labelState(X|Y|FX|FY|DX|DY|OnText|OffText|Unit|Decimals)$/.test(k)).forEach(k => { d[`labelX${i}${k.slice(10)}`] = d[k]; }));
  [1, 2, 3, 4].forEach(i => Object.assign(d, { [`labelX${i}`]: false, [`labelX${i}Size`]: 18, [`labelX${i}X`]: 0, [`labelX${i}Y`]: 0 }));
  return d;
}
function roomLabelState(room) {
  if (isTextRoom(room)) return String(room.textCaption || '');
  if (isThermoRoom(room)) { const info = climateInfo({ entityId: (room.entityIds || [])[0] || '' }); return info.unavailable ? translateValue('Niedostępny') : thermoModeText(room, info.mode); }
  const ids = room.entityIds || []; if (!ids.length) return '';
  const toggles = ids.filter(id => ROOM_TOGGLE_DOMAINS.includes(id.split('.')[0]));
  if (toggles.length) {
    const lit = toggles.filter(id => ROOM_ON_STATES.has(String(stateCache[id]?.state ?? '').toLowerCase()));
    if (toggles.length > 1) return lit.length ? `${roomOnOffWord(room, true)} ${lit.length}/${toggles.length}` : roomOnOffWord(room, false);
    if (!lit.length) return roomOnOffWord(room, false);
    const brightness = Number(stateCache[lit[0]]?.attributes?.brightness);
    return Number.isFinite(brightness) && brightness > 0 ? `${roomOnOffWord(room, true)} · ${Math.round(brightness / 2.55)}%` : roomOnOffWord(room, true);
  }
  const st = stateCache[ids[0]]; if (!st) return '';
  // Other ON / OFF entities (cover, lock, binary sensor…): their own ON / OFF texts replace the HA state (open → ON, closed → OFF).
  if (roomSwitchable(room) && roomNumber(room) === null) { const on = ROOM_ON_STATES.has(String(st.state ?? '').toLowerCase()), own = String((on ? room.labelStateOnText : room.labelStateOffText) || '').trim(); if (own) return own; }
  const ownUnit = String(room.labelStateUnit ?? '').trim(), unit = ownUnit === '-' ? '' : ownUnit || st.attributes?.unit_of_measurement || '', n = roomNumber(room);
  if (n === null) return String(st.state ?? '');
  const decimals = ['0','1','2','3'].includes(String(room.labelStateDecimals)) ? Number(room.labelStateDecimals) : null;
  return `${decimals === null ? Math.round(n * 10) / 10 : n.toFixed(decimals)}${unit ? ` ${unit}` : ''}`;
}
// Icon source like a marker: from the entity (default, as Home Assistant shows it), the integration logo, or any MDI icon.
function roomLabelIconSource(room) { return ['entity','integration','mdi'].includes(room.labelIconSource) ? room.labelIconSource : 'entity'; }
function roomEntityPlatform(id) {
  const known = entityCatalog?.entities?.find(entity => entity.entity_id === id)?.platform || markersForEntity(id)[0]?.sourceDomain;
  if (!known && !entityCatalog && !entityCatalogLoading) loadEntityCatalog().then(() => renderRoomLabels()).catch(() => {});
  return known || String(id).split('.')[0];
}
function roomLabelIconSpec(room, on) {
  const id = (room.entityIds || [])[0] || '', source = roomLabelIconSource(room);
  if (source === 'integration' && id) return { domain: roomEntityPlatform(id) };
  if (source === 'mdi') { const own = String((room.labelIconVariant ? sv(room, 'labelIconNameOn', 'labelIconNameOff', on) : room.labelIconName) || '').trim(); if (own) return { cls: own.replace(/^mdi:/, 'mdi-') }; }
  return { cls: String((id && automaticIcon({ entityId: id })) || 'mdi:home-outline').replace(/^mdi:/, 'mdi-') };
}
// Background and frame of the icon share one shape: square, circle or a free corner radius.
function roomIconFrameStyle(r, on = false) {
  if (!r.labelIconBg && !r.labelIconBorder) return '';
  const pick = (stateKey, base, field) => r[stateKey] ? sv(r, `${base}On${field}`, `${base}Off${field}`, on) : r[`${base}${field}`];
  const shape = ['square','circle','custom'].includes(r.labelIconShape) ? r.labelIconShape : 'circle';
  const radius = shape === 'circle' ? '50%' : shape === 'square' ? '0' : `${clamp(Number(r.labelIconRadius) || 0, 0, 200)}px`;
  return `;padding:${clamp(Number(r.labelIconPadding ?? 6), 0, 120)}px;border-radius:${radius}`
    + (r.labelIconBg ? `;background:${rgba(pick('labelIconBgState', 'labelIconBg', 'Color') || '#081822', clamp(Number(pick('labelIconBgState', 'labelIconBg', 'Opacity') ?? .55), 0, 1))}` : '')
    + (r.labelIconBg && r.labelIconBlur ? ';-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)' : '')
    + (r.labelIconBorder ? `;box-shadow:inset 0 0 0 ${clamp(Number(pick('labelIconBorderState', 'labelIconBorder', 'Width')) || 1.5, .5, 12)}px ${rgba(pick('labelIconBorderState', 'labelIconBorder', 'Color') || '#FFFFFF', clamp(Number(pick('labelIconBorderState', 'labelIconBorder', 'Opacity') ?? .6), 0, 1))}` : '');
}
// beta.256 had one label block (shared colour, size, layout, offset); it becomes three parts placed the same way.
function migrateRoomLabel(room) {
  // beta.258–260: a typed icon name meant "own icon"; it is now the explicit "Własna ikona MDI" source.
  let changed = false;
  if (room && room.labelIconSource === undefined && (room.labelIconName || room.labelIconNameOn || room.labelIconNameOff)) { room.labelIconSource = 'mdi'; changed = true; }
  // beta.261: new rooms get bigger label defaults; labels shown before keep their old size and place.
  if (room && (room.labelIcon || room.labelName || room.labelState)) [['labelIconSize',38],['labelNameSize',19],['labelStateSize',15],['labelIconY',-30],['labelNameY',6],['labelStateY',30]].forEach(([key, value]) => { if (!(key in room)) { room[key] = value; changed = true; } });
  if (!room || !['labelLayout','labelScale','labelX','labelY','labelColor','labelBg','labelBgOpacity'].some(key => key in room)) return changed;
  const k = clamp(Number(room.labelScale) || 1, .4, 4), dx = Number(room.labelX) || 0, dy = Number(room.labelY) || 0, row = room.labelLayout === 'row';
  const at = row ? { icon:[-46, 0], name:[30, -10], state:[30, 12] } : { icon:[0, -30], name:[0, 6], state:[0, 30] };
  ROOM_LABEL_PARTS.slice(0, 3).forEach(([part, key]) => { room[`${key}X`] = Math.round(at[part][0] * k + dx); room[`${key}Y`] = Math.round(at[part][1] * k + dy); room[`${key}Size`] = Math.round(ROOM_DEFAULTS[`${key}Size`] * k); });
  if (room.labelColor) { room.labelNameColor = room.labelColor; room.labelStateColor = room.labelColor; }
  if (room.labelBg !== false && (room.labelName || room.labelState)) { room.labelNameBg = true; room.labelStateBg = true; room.labelNameBgOpacity = room.labelStateBgOpacity = clamp(Number(room.labelBgOpacity ?? .55), 0, 1); }
  ['labelLayout','labelScale','labelX','labelY','labelColor','labelBg','labelBgOpacity'].forEach(key => delete room[key]);
  return true;
}
// One-element label: a card with a shared background; parts are laid out by a preset and can be nudged inside it.
const ROOM_CARD_LAYOUTS = [['column','Jedno pod drugim','mdi-view-agenda-outline'],['row','Obok siebie','mdi-view-column-outline'],['iconLeft','Ikona z lewej','mdi-page-layout-sidebar-left'],['iconRight','Ikona z prawej','mdi-page-layout-sidebar-right']];
const ROOM_CARD_STYLES = [
  ['dark','Ciemne', () => ({ labelCardBg:true, labelCardBgColor:'#081822', labelCardBgOpacity:.68, labelCardBorder:false, labelCardBlur:false, labelNameColor:'#FFFFFF', labelStateColor:'#DCE8EF' })],
  ['light','Jasne', () => ({ labelCardBg:true, labelCardBgColor:'#FFFFFF', labelCardBgOpacity:.86, labelCardBorder:false, labelCardBlur:false, labelNameColor:'#10222E', labelStateColor:'#3B5566', labelIconOff:'#6B8594' })],
  ['glass','Szkło', () => ({ labelCardBg:true, labelCardBgColor:'#FFFFFF', labelCardBgOpacity:.14, labelCardBlur:true, labelCardBorder:true, labelCardBorderColor:'#FFFFFF', labelCardBorderOpacity:.35, labelCardBorderWidth:1, labelNameColor:'#FFFFFF', labelStateColor:'#E8F4FA' })],
  ['room','Kolor pokoju', room => ({ labelCardBg:true, labelCardBgColor: room.color || '#FFD27A', labelCardBgOpacity:.3, labelCardBlur:false, labelCardBorder:true, labelCardBorderColor: room.color || '#FFD27A', labelCardBorderOpacity:.65, labelCardBorderWidth:1.5, labelNameColor:'#FFFFFF', labelStateColor:'#FFFFFF' })]];
// Background and frame of the name / state part (the frame is drawn inside, like the icon's); each can follow ON / OFF.
function roomTextPartStyle(r, key, on = false) {
  const pick = (field, base) => r[`${key}${base}State`] ? sv(r, `${key}${base}On${field}`, `${key}${base}Off${field}`, on) : r[`${key}${base}${field}`];
  const bg = r[`${key}Bg`] ? `;background:${rgba(pick('Color', 'Bg') || '#081822', clamp(Number(pick('Opacity', 'Bg') ?? .55), 0, 1))}` + (r[`${key}Blur`] ? ';-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)' : '') : '';
  const border = r[`${key}Border`] ? `;box-shadow:inset 0 0 0 ${clamp(Number(pick('Width', 'Border')) || 1.5, .5, 12)}px ${rgba(pick('Color', 'Border') || '#FFFFFF', clamp(Number(pick('Opacity', 'Border') ?? .6), 0, 1))}` : '';
  // Corners and inner margin (px); unset = the default, which grows with the text size.
  const shape = (r[`${key}Bg`] || r[`${key}Border`]) ? (Number.isFinite(Number(r[`${key}Radius`])) && r[`${key}Radius`] !== '' && r[`${key}Radius`] != null ? `;border-radius:${clamp(Number(r[`${key}Radius`]), 0, 200)}px` : '')
    + (Number.isFinite(Number(r[`${key}Padding`])) && r[`${key}Padding`] !== '' && r[`${key}Padding`] != null ? `;padding:${clamp(Number(r[`${key}Padding`]), 0, 120)}px ${Math.round(clamp(Number(r[`${key}Padding`]), 0, 120) * 2)}px` : '') : '';
  return bg + border + shape;
}
const TEXT_WEIGHTS = { normal:400, medium:600, bold:700 };
// Colour (fixed or ON / OFF), opacity and weight of the name / state text.
function roomTextStyle(r, key, on = false) {
  const state = !!r[`${key}ColorState`], color = state ? sv(r, `${key}ColorOn`, `${key}ColorOff`, on) : r[`${key}Color`];
  const opacity = clamp(Number(state ? sv(r, `${key}OpacityOn`, `${key}OpacityOff`, on) : r[`${key}Opacity`]) ?? 1, 0, 1);
  return `color:${rgba(color || '#FFFFFF', Number.isFinite(opacity) ? opacity : 1)};font-weight:${TEXT_WEIGHTS[r[`${key}Weight`]] || (key === 'labelName' ? 700 : 400)}`;
}
// Ungrouped, the name and state get their own background and frame (like the icon) when they had none;
// grouping again keeps the look they have.
function togglePartFrames(room, grouping) {
  if (grouping) return;
  ['labelName','labelState'].filter(key => !room[`${key}Bg`] && !room[`${key}Border`]).forEach(key => { room[`${key}Bg`] = true; room[`${key}Border`] = true; });
}
// Switching grouping on / off keeps everything where it is on the plan: ungrouped parts take the places they had
// inside the group; a new group is centred where the separate parts were.
function keepLabelPlaceOnRegroup(room) {
  const scene = els.scene.getBoundingClientRect(), k = sceneScale || 1, w = els.scene.offsetWidth || 1, h = els.scene.offsetHeight || 1; if (!scene.width) return;
  const [ax, ay] = roomAnchor(room), anchorX = scene.left + ax / 100 * scene.width, anchorY = scene.top + ay / 100 * scene.height;
  const toOffsetX = px => Math.round((px - anchorX) * w / (scene.width * k)), toOffsetY = py => Math.round((py - anchorY) * h / (scene.height * k));
  const id = CSS.escape(room.id), centre = node => { const r = node.getBoundingClientRect(); return [(r.left + r.right) / 2, (r.top + r.bottom) / 2, r]; };
  if (room.labelLinked) {
    ROOM_LABEL_PARTS.forEach(([part, key]) => { const node = document.querySelector(`.room-label-card[data-room-id="${id}"] .room-card-part.${part}`); if (!node) return; const [cx, cy] = centre(node); room[`${key}X`] = toOffsetX(cx); room[`${key}Y`] = toOffsetY(cy); });
  } else {
    const nodes = $$(`.room-label-part[data-room-id="${id}"]`).filter(node => node.getBoundingClientRect().width); if (!nodes.length) return;
    const rects = nodes.map(node => node.getBoundingClientRect());
    const cx = (Math.min(...rects.map(r => r.left)) + Math.max(...rects.map(r => r.right))) / 2, cy = (Math.min(...rects.map(r => r.top)) + Math.max(...rects.map(r => r.bottom))) / 2;
    room.labelCardX = toOffsetX(cx); room.labelCardY = toOffsetY(cy);
    // Grouping again keeps the arrangement: each part's place inside the group (group-local px).
    const local = (scene.width / w) * k * clamp(Number(room.labelCardScale) || 1, .3, 4.5);
    nodes.forEach(node => { const key = partKey(node), r = node.getBoundingClientRect(); room[`${key}FX`] = Math.round(((r.left + r.right) / 2 - cx) / local * 10) / 10; room[`${key}FY`] = Math.round(((r.top + r.bottom) / 2 - cy) / local * 10) / 10; });
    room.labelCardFree = true;
  }
}
// A group left with one visible part is ungrouped (so that part has resize handles), remembering it was a group;
// showing a second part again rebuilds that group with its arrangement, around where the visible part stands now.
function autoUngroupLabel(room) {
  keepLabelPlaceOnRegroup(room); togglePartFrames(room, false);
  room.labelAutoUngrouped = { free: !!room.labelCardFree }; room.labelLinked = false;
}
function regroupAutoLabel(room) {
  const auto = room.labelAutoUngrouped || {}, shown = ROOM_LABEL_PARTS.find(([, k]) => room[k])?.[1], scale = clamp(Number(room.labelCardScale) || 1, .3, 4.5);
  if (shown) {
    const px = Number(room[`${shown}X`]) || 0, py = Number(room[`${shown}Y`]) || 0;
    room.labelCardX = Math.round(px - (auto.free ? (Number(room[`${shown}FX`]) || 0) * scale : 0)); room.labelCardY = Math.round(py - (auto.free ? (Number(room[`${shown}FY`]) || 0) * scale : 0));
  }
  room.labelCardFree = !!auto.free; room.labelLinked = true; delete room.labelAutoUngrouped;
}
// "Equal frames" (ungrouped parts): icon, name and state get the same box — the size of the largest of them.
function equalizeLabelFrames(room, group) {
  const parts = [...group.querySelectorAll('.room-label-part, .room-label-card.free > .room-card-part')];
  const base = node => { const key = partKey(node), free = key !== 'labelDial'; node.style.minWidth = free && Number(room[`${key}W`]) ? `${room[`${key}W`]}px` : ''; node.style.minHeight = free && Number(room[`${key}H`]) ? `${room[`${key}H`]}px` : ''; };
  parts.forEach(base);
  fitFreeCard(room, group); fitLabelBackdrop(room, group);
  // A selected part or label whose width equals its height is marked (green outline): a round icon stays a circle.
  // The edit outline is drawn magnified 4x and scaled down (sub-pixel exact), so it needs the element's corner radius.
  group.querySelectorAll('.room-label-part.editable, .room-label-card.editable').forEach(node => {
    const rad = String(getComputedStyle(node).borderTopLeftRadius || '0').split(' ')[0];
    if (rad.endsWith('%') || !(parseFloat(rad) > 0)) { node.style.setProperty('--orad', rad.endsWith('%') ? rad : '0px'); node.style.removeProperty('--prx'); }
    else { node.style.removeProperty('--orad'); node.style.setProperty('--prx', `${parseFloat(rad)}px`); }
  });
  group.querySelectorAll('.room-label-part, .room-label-card').forEach(node => node.classList.toggle('square', !!node.querySelector(':scope > .card-handle') && Math.abs(node.offsetWidth - node.offsetHeight) < .5));
}
// The backdrop of ungrouped parts covers all of them (plus the group's margin), however far apart they are.
function fitLabelBackdrop(room, group) {
  const backdrop = group.querySelector('.room-label-backdrop'); if (!backdrop) return;
  const rects = [...group.querySelectorAll('.room-label-part')].map(node => node.getBoundingClientRect()).filter(r => r.width);
  const scene = els.scene.getBoundingClientRect(), w = els.scene.offsetWidth || 1, k = sceneScale || 1; if (!rects.length || !scene.width) return;
  const [ax, ay] = roomAnchor(room), toPlan = (scene.width / w) * k, local = toPlan * clamp(Number(room.labelCardScale) || 1, .3, 4.5), pad = clamp(Number(room.labelCardPadding ?? ROOM_DEFAULTS.labelCardPadding) || 0, 0, 60);
  const left = Math.min(...rects.map(r => r.left)), right = Math.max(...rects.map(r => r.right)), top = Math.min(...rects.map(r => r.top)), bottom = Math.max(...rects.map(r => r.bottom));
  backdrop.style.setProperty('--lx', `${((left + right) / 2 - scene.left - ax / 100 * scene.width) / toPlan}px`);
  backdrop.style.setProperty('--ly', `${((top + bottom) / 2 - scene.top - ay / 100 * scene.height) / toPlan}px`);
  backdrop.style.width = `${(right - left) / local + pad * 2.7}px`; backdrop.style.height = `${(bottom - top) / local + pad * 2}px`;
}
// Frame size set with the side dots (box-local px; never smaller than the content).
function partBoxSize(r, key) {
  if (key === 'labelDial') return ''; // the dial's box is its drawing (no extra width / height = no margin)
  const w = Number(r[`${key}W`]) || 0, h = Number(r[`${key}H`]) || 0;
  return (w ? `;min-width:${w}px` : '') + (h ? `;min-height:${h}px` : '') + (w || h ? ';box-sizing:border-box' : '');
}
function partKey(node) { return ROOM_LABEL_PARTS.find(([part]) => part === node.dataset.labelPart)?.[1]; }
// A free group is sized around its parts (symmetric around the group's point, plus the padding).
function fitFreeCard(room, group) {
  const card = group.querySelector('.room-label-card.free'); if (!card) return;
  // The group hugs the parts that are shown (a hidden part leaves no empty space): sized to their box, and the box's
  // centre offset is moved onto the card, so the shown parts stay exactly where they are on the plan.
  const parts = [...card.children].map(node => [node, partKey(node)]).filter(([, key]) => key); if (!parts.length) return;
  const pad = parts.length > 1 ? clamp(Number(room.labelCardPadding ?? ROOM_DEFAULTS.labelCardPadding) || 0, 0, 60) : 0;
  const box = parts.map(([node, key]) => { const fx = Number(room[`${key}FX`]) || 0, fy = Number(room[`${key}FY`]) || 0; return [fx - node.offsetWidth / 2, fx + node.offsetWidth / 2, fy - node.offsetHeight / 2, fy + node.offsetHeight / 2]; });
  const minX = Math.min(...box.map(b => b[0])), maxX = Math.max(...box.map(b => b[1])), minY = Math.min(...box.map(b => b[2])), maxY = Math.max(...box.map(b => b[3]));
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  card.style.width = `${Math.round(maxX - minX + pad * 2.7)}px`; card.style.height = `${Math.round(maxY - minY + pad * 2)}px`;
  card.style.setProperty('--fsx', `${cx}px`); card.style.setProperty('--fsy', `${cy}px`);
  parts.forEach(([node, key]) => { node.style.transform = `translate(-50%,-50%) translate(${(Number(room[`${key}FX`]) || 0) - cx}px,${(Number(room[`${key}FY`]) || 0) - cy}px)`; });
}
// Background, frame and corners of the group (the grouped card, or the backdrop behind ungrouped parts).
function cardLook(r, on) {
  const cardPick = (stateKey, base, field) => r[stateKey] ? sv(r, `${base}On${field}`, `${base}Off${field}`, on) : r[`${base}${field}`];
  return [`border-radius:${clamp(Number(r.labelCardRadius) || 0, 0, 80)}px`,
    r.labelCardBg ? `background:${rgba(cardPick('labelCardBgState', 'labelCardBg', 'Color') || '#081822', clamp(Number(cardPick('labelCardBgState', 'labelCardBg', 'Opacity') ?? .62), 0, 1))}` : '',
    // The frame is drawn inside the card (inset shadow), so a thicker ON / OFF frame never changes the card's size.
    `box-shadow:${[r.labelCardBorder ? `inset 0 0 0 ${clamp(Number(cardPick('labelCardBorderState', 'labelCardBorder', 'Width')) || 1, .5, 12)}px ${rgba(cardPick('labelCardBorderState', 'labelCardBorder', 'Color') || '#FFFFFF', clamp(Number(cardPick('labelCardBorderState', 'labelCardBorder', 'Opacity') ?? .3), 0, 1))}` : '', r.labelCardBg && r.labelCardShadow !== false ? '0 6px 18px rgba(0,0,0,.25)' : ''].filter(Boolean).join(',') || 'none'}`].filter(Boolean).join(';');
}
// Only entities that switch on and off (lights, switches, binary sensors…) have ON / OFF look options;
// for the others (a temperature sensor…) the label always uses the plain colours.
function roomSwitchable(r) { return (r.entityIds || []).some(id => /^(light|switch|input_boolean|fan|binary_sensor|cover|lock|climate|media_player|vacuum|siren|humidifier|valve|water_heater|alarm_control_panel|automation|script|group)\./.test(id)); }
// A thermostat's look follows its work state instead of ON / OFF: every "…On…" setting has a version per state
// ("…_heating…", "…_idle…"); a state without its own value takes the ON value while working, else the OFF one.
const actPath = (onPath, act) => onPath.replace(/On(?=[A-Z]|$)/, `_${act}`);
const actWorking = act => !['idle','off'].includes(act);
function sv(r, onKey, offKey, on) {
  if (r?.__act) { const v = r[actPath(onKey, r.__act)]; return v !== undefined && v !== '' && v !== null ? v : actWorking(r.__act) ? r[onKey] : r[offKey]; }
  return on ? r[onKey] : r[offKey];
}
const LABEL_STATE_FLAGS = ['labelIconColorState','labelIconVariant','labelIconOutlineState','labelIconBgState','labelIconBorderState','labelCardBgState','labelCardBorderState','labelNameColorState','labelStateColorState','labelNameBgState','labelStateBgState','labelNameBorderState','labelStateBorderState'];
function withoutOnOff(r) { if (!roomSwitchable(r)) LABEL_STATE_FLAGS.forEach(key => { r[key] = false; }); return r; }
function roomRuleColor(r) {
  return ''; // colours by value are switched off for now (their section was removed)
  if (!r.labelRules || roomSwitchable(r)) return ''; const n = roomNumber(r); if (n === null) return '';
  const low = Math.min(Number(r.labelRulesLow), Number(r.labelRulesHigh)), high = Math.max(Number(r.labelRulesLow), Number(r.labelRulesHigh));
  if (!r.labelRulesSmooth) return n < low ? r.labelRulesColorLow : n >= high ? r.labelRulesColorHigh : r.labelRulesColorMid;
  const mid = (low + high) / 2; return n <= mid ? mixHex(r.labelRulesColorLow, r.labelRulesColorMid, clamp((n - low) / Math.max(1e-9, mid - low), 0, 1)) : mixHex(r.labelRulesColorMid, r.labelRulesColorHigh, clamp((n - mid) / Math.max(1e-9, high - mid), 0, 1));
}
// The icon glyph's visible shape is centred in its square on every device: its ink box is measured once per icon with
// this browser's own font rendering (phones lay the icon font out differently) and the glyph is nudged by the difference.
// Label icons are drawn as inline SVG paths (MDI, 24x24 box): centred exactly on every device, unlike the icon font whose
// metrics differ per WebView. Until a path is fetched the font glyph is shown and swapped in place once it arrives.
const MDI_SVG_PATHS = new Map();
function mdiSvgPath(cls) {
  const name = String(cls || '').replace(/^mdi-/, ''); if (!/^[a-z0-9-]+$/.test(name)) return null;
  const known = MDI_SVG_PATHS.get(name); if (typeof known === 'string' || known === null) return known;
  if (!known) MDI_SVG_PATHS.set(name, fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/svg/${name}.svg`).then(res => res.ok ? res.text() : '').then(text => {
    const d = (String(text).match(/\sd="([^"]+)"/) || [])[1] || null; MDI_SVG_PATHS.set(name, d); if (!d) return;
    document.querySelectorAll(`i.mdi[data-svg-icon="${name}"]`).forEach(el => el.replaceWith(Object.assign(document.createElement('template'), { innerHTML: mdiSvgMarkup(d, decodeURIComponent(el.dataset.svgStyle || '')) }).content));
  }).catch(() => MDI_SVG_PATHS.set(name, null)));
  return undefined;
}
// Icon animation (label / room icon): spin (a fan), pulse, blink or swing; optionally only while ON, and for a fan
// at the speed of its percentage. Returns the class and CSS variables for the icon element, or null.
const ICON_ANIMATIONS = ['spin','pulse','blink','swing'];
// A thermostat's animations (icon, dial fill and glow, work state text) can share one rhythm: the same cycle, counted
// from the same clock, every effect at its strongest in the middle of the cycle - they pulse / blink together.
function thermoSyncPeriod(r) { return isThermoRoom(r) ? 1.5 : 0; } // always together, one fixed cycle
function syncAnimStyle(r) { const d = thermoSyncPeriod(r); return d ? `animation-duration:${d}s;animation-delay:-${((performance.now() / 1000) % d).toFixed(3)}s` : ''; }
function roomIconAnimation(r, on) {
  if (!r.labelIconAnim) return null;
  // A thermostat: an animation (or none) per work state; by default only while working.
  const perAct = r.__act ? (r[`labelIconAnim_${r.__act}`] ?? (actWorking(r.__act) ? r.labelIconAnimType : 'none')) : null;
  if (perAct === 'none' || (!r.__act && r.labelIconAnimOnlyOn !== false && roomSwitchable(r) && !on)) return null;
  const type = ICON_ANIMATIONS.includes(perAct || r.labelIconAnimType) ? (perAct || r.labelIconAnimType) : 'spin';
  let seconds = thermoSyncPeriod(r) || clamp(Number(r.labelIconAnimSpeed) || 1.5, .2, 10);
  if (r.labelIconAnimEntitySpeed) {
    const percent = Number((r.entityIds || []).map(id => stateCache[id]?.attributes?.percentage).find(v => Number.isFinite(Number(v)) && Number(v) > 0));
    if (percent > 0) seconds = clamp(seconds * 100 / percent, .2, 20);
  }
  // Labels are re-drawn on every state update: a negative delay from the clock keeps the turn's phase continuous.
  const phase = (performance.now() / 1000) % seconds;
  return { cls: `icon-anim-${type}`, style: `--icon-anim-dur:${seconds.toFixed(2)}s;--icon-anim-dir:${r.labelIconAnimDir === 'ccw' ? 'reverse' : 'normal'};animation-delay:-${phase.toFixed(3)}s` };
}
function mdiSvgMarkup(d, svg) {
  const o = JSON.parse(svg || '{}');
  return `<svg class="mdi-svg${o.anim ? ' ' + escapeHtml(o.anim) : ''}" viewBox="0 0 24 24" aria-hidden="true" style="color:${escapeHtml(o.color || 'currentColor')}${o.animStyle ? ';' + escapeHtml(o.animStyle) : ''}"><path d="${String(d).replace(/[^MmLlHhVvCcSsQqTtAaZz0-9.,\s-]/g, '')}" fill="${escapeHtml(o.fill || 'currentColor')}"${o.stroke ? ` stroke="${escapeHtml(o.stroke)}" stroke-width="${Number(o.width) || 1.5}" vector-effect="non-scaling-stroke" stroke-linejoin="round"` : ''}/></svg>`;
}
const GLYPH_SHIFTS = new Map();
function glyphShiftStyle(cls) {
  if (GLYPH_SHIFTS.has(cls)) return GLYPH_SHIFTS.get(cls);
  try {
    if (!document.fonts?.check?.('100px "Material Design Icons"')) return '';
    const probe = document.createElement('i'); probe.className = `mdi ${cls}`; probe.style.cssText = 'position:absolute;visibility:hidden;left:-999px'; document.body.append(probe);
    const glyph = String(getComputedStyle(probe, '::before').content || '').replace(/^["']|["']$/g, ''); probe.remove(); if (!glyph || glyph === 'none') return '';
    const ctx = (glyphShiftStyle.canvas ||= document.createElement('canvas')).getContext('2d'); ctx.font = '100px "Material Design Icons"';
    const m = ctx.measureText(glyph); if (!m.width) return '';
    const inkX = (-m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 2, baseline = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    const inkY = baseline + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2, dx = (50 - inkX) / 100, dy = (50 - inkY) / 100;
    const style = Math.abs(dx) < .004 && Math.abs(dy) < .004 ? '' : `;--gx:${dx.toFixed(3)}em;--gy:${dy.toFixed(3)}em`;
    GLYPH_SHIFTS.set(cls, style); return style;
  } catch { return ''; }
}
// Parts of a thermostat label: the dial, the set and current temperatures, what it is doing, − / + and the modes.
// Colours follow the mode (grzanie / chłodzenie / auto…); each part keeps the label's own size, colour and frame options.
// Own texts: for each activity (hvac_action) and each mode (the main state); empty = the built-in text.
// Work state text can be animated per state (e.g. blinking while heating water).
const THERMO_FILL_FX = [['none','Brak'],['solid','Stałe'],['pulse','Pulsowanie'],['breathe','Oddychanie']];
const THERMO_ACT_ANIMS = [['none','Brak'],['blink','Mruganie'],['pulse','Pulsowanie'],['fade','Przygasanie'],['shake','Drganie']];
// Work states used by this thermostat (chosen in "Ogólne"); not chosen yet = guessed from its modes.
function thermoActsUsed(r) {
  const all = Object.keys(THERMO_ACTIONS);
  const modes = climateInfo({ entityId: (r?.entityIds || [])[0] || '' }).modes, has = m => modes.includes(m);
  const guess = new Set(['idle','off']);
  if (!modes.length || has('heat') || has('heat_cool') || has('auto')) { guess.add('heating'); guess.add('preheating'); }
  if (has('cool') || has('heat_cool')) guess.add('cooling');
  if (has('dry')) guess.add('drying');
  if (has('fan_only')) guess.add('fan');
  // A state ticked / unticked by hand keeps that choice; the rest follow the guess.
  return all.filter(a => typeof r?.[`thermoActUse_${a}`] === 'boolean' ? r[`thermoActUse_${a}`] : guess.has(a));
}
const THERMO_PRESETS = { none:'Brak', eco:'Eko', comfort:'Komfort', boost:'Boost', away:'Poza domem', home:'Dom', sleep:'Sen', activity:'Aktywność', manual:'Ręczny', auto:'Auto', program:'Program', holiday:'Urlop', frost_protection:'Ochrona przed mrozem', green:'Eko', normal:'Normalny' };
function thermoPresetText(r, p) { return String(r?.[`thermoPresetText_${p}`] || '').trim() || translateValue(THERMO_PRESETS[p] || String(p).replace(/_/g, ' ')); }
// Modes in the order chosen in the panel (the device's own order for the rest); hidden ones left out when asked.
function thermoModesOrdered(r, modes, shownOnly = true) {
  const order = Array.isArray(r?.thermoModesOrder) ? r.thermoModesOrder : [], idx = m => { const i = order.indexOf(m); return i < 0 ? 1000 + modes.indexOf(m) : i; };
  return [...modes].sort((a, b) => idx(a) - idx(b)).filter(m => !shownOnly || r?.[`thermoModeShow_${m}`] !== false);
}
// Does this change ask first? Per mode / preset as chosen; by default only turning on / off (when that was switched on).
function thermoNeedsConfirm(r, info, mode, preset) {
  if (!r) return false;
  if (preset) return !!r[`thermoConfirmP_${preset}`];
  // Once modes are ticked one by one, only they ask (switching to that mode); before that the old on / off switch counts.
  return thermoConfirmPerMode(r) ? !!r[`thermoConfirm_${mode}`] : !!r.thermoConfirm && (mode === 'off' || info.mode === 'off');
}
function thermoConfirmPerMode(r) { return Object.keys(r || {}).some(k => /^thermoConfirm_/.test(k) && typeof r[k] === 'boolean'); }
function thermoActionText(r, action) { return String(r?.[`thermoActText_${action}`] || '').trim() || translateValue(THERMO_ACTIONS[action]?.[0] || action); }
function thermoModeText(r, mode) { return String(r?.[`thermoModeText_${mode}`] || '').trim() || translateValue(mode === 'off' ? 'Wyłączony' : THERMO_MODES[mode]?.[0] || mode); }
// Set / current temperature with its own rounding ("auto": the entity's step, 0,1 for the current one) and unit.
function thermoFormat(v, decimals, autoStep) { const d = decimals === 'auto' || decimals === undefined || decimals === null || decimals === '' ? (String(autoStep).includes('.') ? 1 : 0) : clamp(Number(decimals) || 0, 0, 3); return Number(v).toFixed(d).replace('.', ','); }
function thermoContent(r, on, previewMode = null, previewAct = '') {
  const marker = { entityId: (r.entityIds || [])[0] || '' }, info = climateInfo(marker, previewMode); if (previewAct) info.action = previewAct;
  const accent = thermoAccent(r, info), esc = escapeHtml, tr = translateValue;
  const text = (key, inner, cls = '') => `<span class="thermo-part ${cls}" data-no-i18n style="${r[`${key}Accent`] ? `color:var(--accent);font-weight:${TEXT_WEIGHTS[r[`${key}Weight`]] || 600}` : roomTextStyle(r, key, on)}">${inner}</span>`;
  // Like Home Assistant's own card: a thermostat that is off still shows (and lets you change) its set temperature.
  const value = info.target ?? info.high ?? null, active = !info.unavailable && value !== null;
  const working = info.mode !== 'off' && ['heating','cooling','preheating','drying','fan','defrosting'].includes(info.action);
  const parts = {};
  if (r.labelDial) {
    const cx = 100, cy = 92, rad = 74, start = 135, sweep = 270, angle = v => start + sweep * clamp((v - info.min) / (info.max - info.min), 0, 1), w = clamp(Number(r.thermoDialWidth) || 9, 2, 30);
    const arc = active ? gaugeArcPath(cx, cy, rad, start, Math.max(start + .5, angle(value))) : '', knob = active ? gaugePoint(cx, cy, rad, angle(value)) : null, cur = info.current !== null ? gaugePoint(cx, cy, rad, angle(info.current)) : null;
    const p0 = gaugePoint(cx, cy, rad, start), p1 = gaugePoint(cx, cy, rad, start + sweep);
    const range = r.thermoDialRange ? `<text class="thermo-range" x="${p0.x.toFixed(1)}" y="${(p0.y + 17).toFixed(1)}">${esc(thermoNumber(info.min, info.step))}</text><text class="thermo-range" x="${p1.x.toFixed(1)}" y="${(p1.y + 17).toFixed(1)}">${esc(thermoNumber(info.max, info.step))}</text>` : '';
    // The space inside the dial can light up per work state: steady, pulsing or breathing, in the state's colour.
    const act = thermoActivity(info), fx = THERMO_FILL_FX.some(([v]) => v === r[`thermoFill_${act}`]) ? r[`thermoFill_${act}`] : 'none';
    const fillColor = esc(r[`thermoFillColor_${act}`] || thermoActColor(r, act)), fillOp = clamp(Number(r.thermoFillOpacity ?? .45), 0, 1), gid = `tf-${String(r.id || 'x').replace(/[^\w-]/g, '')}`;
    const fill = fx === 'none' ? '' : `<defs><radialGradient id="${gid}"><stop offset="0%" stop-color="${fillColor}" stop-opacity="${fillOp}"/><stop offset="70%" stop-color="${fillColor}" stop-opacity="${(fillOp * .55).toFixed(3)}"/><stop offset="100%" stop-color="${fillColor}" stop-opacity="${(fillOp * .15).toFixed(3)}"/></radialGradient></defs><circle class="thermo-fill fx-${fx}" cx="${cx}" cy="${cy}" r="${Math.max(4, rad - w / 2 - 2)}" fill="url(#${gid})" style="${syncAnimStyle(r)}"/>`;
    // The dial's box hugs the drawing (arc with its thickness, the dots, the min / max numbers): practically no margin.
    const pad = w / 2 + .5; // the dots may stick out a little (the drawing is not clipped)
    const vbX = cx - rad - pad, vbY = cy - rad - pad, vbW = (rad + pad) * 2, vbB = Math.max(cy + rad * Math.SQRT1_2 + pad, r.thermoDialRange ? p0.y + 17 + 3 : 0), vbH = vbB - vbY;
    parts.dial = `<svg class="thermo-dial-svg${working && r.thermoGlow ? ' working' : ''}" viewBox="${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}" style="width:${(vbW * .03).toFixed(3)}em;height:${(vbH * .03).toFixed(3)}em" aria-hidden="true">${fill}<path class="thermo-track" d="${gaugeArcPath(cx, cy, rad, start, start + sweep)}" style="stroke:${esc(r.thermoTrackColor)};stroke-width:${w}"/>${arc ? `<path class="thermo-arc${r.thermoGlow ? ' glow' : ''}" d="${arc}" style="stroke:var(--accent);stroke-width:${w};${syncAnimStyle(r)}"/>` : ''}${cur ? `<circle class="thermo-cur" cx="${cur.x.toFixed(1)}" cy="${cur.y.toFixed(1)}" r="${((w * .45 + .5) * clamp(Number(r.thermoDotSize ?? 100), 0, 400) / 100).toFixed(1)}"/>` : ''}${knob ? `<circle class="thermo-knob" cx="${knob.x.toFixed(1)}" cy="${knob.y.toFixed(1)}" r="${((w * .8 + .5) * clamp(Number(r.thermoKnobSize ?? 100), 0, 400) / 100).toFixed(1)}" style="stroke:var(--accent)"/>` : ''}${range}</svg>`;
  }
  if (r.labelTarget) parts.target = text('labelTarget', info.unavailable ? esc(tr('Niedostępny')) : value === null ? (info.mode === 'off' ? esc(String(r.thermoModeText_off || '').trim() || tr('Wył.')) : '–') : info.target === null && info.low !== null ? `${esc(thermoNumber(info.low, info.step))}–${esc(thermoNumber(info.high, info.step))}°` : `${esc(thermoFormat(value, r.labelTargetDecimals, info.step))}${String(r.labelTargetUnit ?? '°C') ? `<span class="thermo-deg">${esc(String(r.labelTargetUnit ?? '°C'))}</span>` : ''}`, 'thermo-target-text');
  if (r.labelCurrent && info.current !== null) parts.current = text('labelCurrent', `${esc(thermoFormat(info.current, r.labelCurrentDecimals, .1))}${esc(String(r.labelCurrentUnit ?? '°C'))}`);
  const act = info.mode === 'off' ? THERMO_ACTIONS.off : THERMO_ACTIONS[info.action];
  if (r.labelAction && act) { const a = info.mode === 'off' ? 'off' : info.action, anim = THERMO_ACT_ANIMS.some(([v]) => v === r[`thermoActAnim_${a}`]) ? r[`thermoActAnim_${a}`] : 'none';
    parts.action = text('labelAction', anim === 'none' ? esc(thermoActionText(r, a)) : `<span class="thermo-anim ${anim}" style="${syncAnimStyle(r)}">${esc(thermoActionText(r, a))}</span>`); }
  const canSet = info.target !== null && !info.unavailable;
  if (r.labelMinus) parts.minus = `<button type="button" class="thermo-step" data-thermo="down"${canSet ? '' : ' disabled'} aria-label="−" style="${roomTextStyle(r, 'labelMinus', on)}"><i class="mdi mdi-minus"></i></button>`;
  if (r.labelPlus) parts.plus = `<button type="button" class="thermo-step" data-thermo="up"${canSet ? '' : ' disabled'} aria-label="+" style="${roomTextStyle(r, 'labelPlus', on)}"><i class="mdi mdi-plus"></i></button>`;
  // Mode buttons: own icon per mode, the active one in the mode's colour (or a chosen one), with or without frames; only the
  // modes chosen in the panel, in its order. "Jeden przycisk": the current mode only, a tap goes to the next one.
  // A change not yet confirmed by the device pulses; presets (eco, comfort, boost…) can follow as a second row.
  const tp = thermoPending.get(marker.entityId) || {};
  if (r.labelModes && (info.modes.length || (r.thermoPresets && info.presets.length))) {
    const shown = thermoModesOrdered(r, info.modes), cycle = r.thermoModeLayout === 'cycle';
    const modeBtn = (m, target = m) => { const d = THERMO_MODES[m] || [m, 'mdi-thermostat'], own = String(r[`thermoModeIcon_${m}`] || '').trim().replace(/^mdi:/, 'mdi-'), icon = own ? (own.startsWith('mdi-') ? own : `mdi-${own}`) : d[1];
      const c = m === info.mode ? (r[`thermoModeActive_${m}`] || (r.thermoModeAccent === false && r.thermoModeActiveColor ? r.thermoModeActiveColor : accent)) : thermoActColor(r, ({ heat:'heating', cool:'cooling', dry:'drying', fan_only:'fan', off:'off' })[m] || 'idle');
      const ownColor = r[`thermoModeColor_${m}`] ? `;color:${esc(r[`thermoModeColor_${m}`])}` : ''; // this mode's icon colour (else the part's colour)
      const pend = tp.hvac_mode === m && info.realMode !== m ? ' pending' : '', label = cycle && target !== m ? `${thermoModeText(r, m)} → ${thermoModeText(r, target)}` : thermoModeText(r, m);
      return `<button type="button" class="thermo-mode-btn${m === info.mode ? ' on' : ''}${pend}${cycle ? ' cycle' : ''}" data-thermo-mode="${esc(target)}" title="${esc(label)}" aria-label="${esc(label)}" style="--mode:${esc(c)};${roomTextStyle(r, 'labelModes', on)}${ownColor}"><i class="mdi ${esc(icon)}"></i></button>`; };
    let row = '';
    if (info.modes.length) {
      if (cycle) { const list = shown.length ? shown : info.modes, cur = info.mode, next = list[(list.indexOf(cur) + 1) % list.length] || list[0]; row = modeBtn(cur, next === cur ? (list.find(m => m !== cur) || cur) : next); }
      else row = shown.map(m => modeBtn(m)).join('');
    }
    const presets = r.thermoPresets && !info.water ? info.presets.filter(p => r[`thermoPresetShow_${p}`] !== false) : [];
    const presetRow = presets.length ? `<span class="thermo-preset-row">${presets.map(p => `<button type="button" class="thermo-preset-btn${p === info.preset ? ' on' : ''}${tp.preset_mode === p && info.realPreset !== p ? ' pending' : ''}" data-thermo-preset="${esc(p)}" style="--mode:${esc(accent)};${roomTextStyle(r, 'labelModes', on)}">${esc(thermoPresetText(r, p))}</button>`).join('')}</span>` : '';
    parts.modes = `<span class="thermo-modes-wrap">${row ? `<span class="thermo-mode-row${r.thermoModeFrame === false ? ' no-frame' : ''}" style="gap:${clamp(Number(r.thermoModeGap ?? 40), 0, 300) / 100}em;--mode-radius:${clamp(Number(r.thermoModeRadius ?? 30), 0, 50)}%">${row}</span>` : ''}${presetRow}</span>`;
  }
  return { accent, parts };
}
function roomLabelMarkup(room, preview = '', interactive = false) {
  const r = withoutOnOff({ ...ROOM_DEFAULTS, ...room });
  // One visible part: no group background, frame or margin (it would be a second frame around the part's own).
  if (ROOM_LABEL_PARTS.filter(([, k]) => r[k]).length <= 1) Object.assign(r, { labelCardBg:false, labelCardBorder:false, labelCardPadding:0 }); if (r.draft || !ROOM_LABEL_PARTS.some(([, k]) => r[k]) || (!isIconRoom(r) && (r.points || []).length < 3)) return '';
  // A thermostat's preview shows one of its work states ("act:heating"); its look follows the work state.
  const previewAct = isThermoRoom(r) && String(preview).startsWith('act:') ? String(preview).slice(4) : '';
  if (isThermoRoom(r)) r.__act = previewAct || thermoActivity(climateInfo({ entityId: (r.entityIds || [])[0] || '' }));
  if (previewAct) preview = previewAct === 'off' ? 'off' : 'on'; // idle is still a mode that is on (just not working)
  const realOn = roomLight(r).on, on = preview ? preview === 'on' : realOn, [x, y] = roomAnchor(r), tap = (isIconRoom(r) ? ' tappable' : '') + (interactive && r.id === selectedRoomId ? ' selected' : '');
  // The ON / OFF preview simulates the state text too.
  // A thermostat's ON / OFF preview shows its mode texts: "off", or the mode it would be in when on.
  const thermoPreview = isThermoRoom(r) && preview ? (() => { if (preview === 'off') return 'off'; const i = climateInfo({ entityId: (r.entityIds || [])[0] || '' }); return i.mode && i.mode !== 'off' ? i.mode : i.modes.find(m => m !== 'off') || 'heat'; })() : null;
  const state = !r.labelState ? '' : thermoPreview ? thermoModeText(r, thermoPreview) : preview === 'off' ? roomOnOffWord(r, false) : preview === 'on' && !realOn ? roomOnOffWord(r, true) : roomLabelState(r);
  // Colours by value (a number entity): below / between / above two thresholds, for the icon and / or the state text.
  const ruleColor = roomRuleColor(r);
  const iconColor = ruleColor && r.labelRulesIcon ? ruleColor : r.labelIconColorState === false ? r.labelIconColor : sv(r, 'labelIconOn', 'labelIconOff', on), iconOpacity = clamp(Number(r.labelIconColorState === false ? r.labelIconOpacity : sv(r, 'labelIconOpacityOn', 'labelIconOpacityOff', on)) ?? 1, 0, 1);
  const outlineColor = r.labelIconOutlineState ? sv(r, 'labelIconOutlineOnColor', 'labelIconOutlineOffColor', on) : r.labelIconOutlineColor, outlineWidth = r.labelIconOutlineState ? sv(r, 'labelIconOutlineOnWidth', 'labelIconOutlineOffWidth', on) : r.labelIconOutlineWidth;
  const outlineOpacity = clamp(Number(r.labelIconOutlineState ? sv(r, 'labelIconOutlineOnOpacity', 'labelIconOutlineOffOpacity', on) : r.labelIconOutlineOpacity) ?? 1, 0, 1);
  const iconStyle = `text-shadow:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));color:${escapeHtml(iconColor)};-webkit-text-fill-color:${r.labelIconFill !== false ? rgba(iconColor, iconOpacity) : 'transparent'};-webkit-text-stroke:${r.labelIconOutline ? `${clamp(Number(outlineWidth) || 1.5, .5, 8)}px ${rgba(outlineColor || '#FFFFFF', outlineOpacity)}` : '0 transparent'}`;
  const spec = r.labelIcon ? roomLabelIconSpec(r, on) : null;
  const anim = roomIconAnimation(r, on), animAttr = anim ? { cls: ` ${anim.cls}`, style: `;${anim.style}` } : { cls: '', style: '' };
  const iconHtml = !spec ? '' : spec.domain ? `<img class="room-label-brand${animAttr.cls}" src="api/integration_icon?domain=${encodeURIComponent(spec.domain)}" data-icon-fallback="${escapeHtml(`https://brands.home-assistant.io/_/${encodeURIComponent(spec.domain)}/dark_icon.png`)}" alt="" style="opacity:${iconOpacity}${animAttr.style}">` : (() => {
    const svg = JSON.stringify({ color: iconColor, fill: r.labelIconFill !== false ? rgba(iconColor, iconOpacity) : 'none', stroke: r.labelIconOutline ? rgba(outlineColor || '#FFFFFF', outlineOpacity) : '', width: clamp(Number(outlineWidth) || 1.5, .5, 8), anim: anim?.cls || '', animStyle: anim?.style || '' });
    const d = mdiSvgPath(spec.cls);
    return d ? mdiSvgMarkup(d, svg) : `<i class="mdi ${escapeHtml(spec.cls)}${animAttr.cls}" data-svg-icon="${escapeHtml(String(spec.cls).replace(/^mdi-/, ''))}" data-svg-style="${encodeURIComponent(svg)}" style="${iconStyle}${glyphShiftStyle(spec.cls)}${animAttr.style}"></i>`;
  })();
  const content = { icon: iconHtml, name: r.labelName && r.name ? `<b data-no-i18n style="${roomTextStyle(r, 'labelName', on)}">${escapeHtml(r.name)}</b>` : '', state: state ? `<small data-no-i18n style="${roomTextStyle(r, 'labelState', on)}${ruleColor && r.labelRulesState ? `;color:${escapeHtml(ruleColor)}` : ''}">${escapeHtml(state)}</small>` : '' };
  const thermo = isThermoRoom(r) ? thermoContent(r, on, thermoPreview, previewAct) : null; if (thermo) Object.assign(content, thermo.parts);
  EXTRA_PARTS.forEach(([part, key]) => { if (r[key] && r[`${key}Entity`]) content[part] = `<small data-no-i18n style="${roomTextStyle(r, key, on)}">${escapeHtml(extraEntityText(r, key))}</small>`; });
  const accentVar = thermo ? `;--accent:${escapeHtml(thermo.accent)}` : '';
  if (r.labelLinked) {
    // A "free" group keeps the parts where they were placed when it was grouped again (card-local positions).
    const free = !!r.labelCardFree;
    const inner = (free ? layeredParts : list => list)(ROOM_LABEL_PARTS.filter(([part]) => content[part])).map(([part, key]) => {
      const bg = part === 'icon' ? roomIconFrameStyle(r, on) : roomTextPartStyle(r, key, on);
      const place = free ? `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) translate(${Number(r[`${key}FX`]) || 0}px,${Number(r[`${key}FY`]) || 0}px)` : `transform:translate(${Number(r[`${key}DX`]) || 0}px,${Number(r[`${key}DY`]) || 0}px)`;
      return `<div class="room-card-part ${part}${interactive && panelPart?.roomId === r.id && panelPart.part === part ? ' panel-part' : ''}${(r[`${key}Bg`] || r[`${key}Border`]) && part !== 'icon' ? ' bg' : ''}" data-label-part="${part}" style="font-size:${clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420)}px;${place}${partBoxSize(r, key)}${bg}">${content[part]}</div>`;
    }).join('');
    if (!inner) return '';
    const layout = ROOM_CARD_LAYOUTS.some(([v]) => v === r.labelCardLayout) ? r.labelCardLayout : 'column', align = ['left','center','right'].includes(r.labelCardAlign) ? r.labelCardAlign : 'center';
    const pin = isIconRoom(r) && dashSpan(r), lscale = clamp(Number(r.labelCardScale) || 1, .3, 4.5), toLocal = (els.scene?.offsetWidth || 1) / 100 / (lscale * (sceneScale || 1)), toLocalY = (els.scene?.offsetHeight || 1) / 100 / (lscale * (sceneScale || 1));
    const style = [`left:${x.toFixed(3)}%`, `top:${y.toFixed(3)}%`, `--ax:${x.toFixed(3)}%`, `--ay:${y.toFixed(3)}%`, `--lx:${Number(r.labelCardX) || 0}px`, `--ly:${Number(r.labelCardY) || 0}px`, `--lscale:${lscale}`,
      pin ? `min-width:${(pin.w * toLocal).toFixed(2)}px;min-height:${(pin.h * toLocalY).toFixed(2)}px` : `${Number(r.labelCardW) > 0 ? `min-width:${Number(r.labelCardW)}px;` : ''}${Number(r.labelCardH) > 0 ? `min-height:${Number(r.labelCardH)}px;` : ''}box-sizing:border-box`,
      free ? 'padding:0' : `padding:${clamp(Number(r.labelCardPadding) || 0, 0, 60)}px ${Math.round(clamp(Number(r.labelCardPadding) || 0, 0, 60) * 1.35)}px`, 'gap:0', cardLook(r, on)].join(';') + accentVar;
    // Selected: a dot on each corner changes the label's width and height (Shift: scales the whole label).
    const corners = interactive && r.id === selectedRoomId ? ['nw','ne','sw','se'].map(c => `<i class="card-handle ${c}" data-corner="${c}"></i>`).join('') : '';
    return `<div class="room-label-card layout-${layout} align-${align}${free ? ' free' : ''}${r.labelCardBg ? ' bg' : ''}${r.labelCardBlur ? ' blur' : ''}${interactive ? ' editable' : ''}${tap}" data-room-id="${escapeHtml(r.id)}" data-label-part="card" style="${style}">${inner}${corners}</div>`;
  }
  // Ungrouped, the group's background (when on) stays behind the parts and is sized around them (fitLabelBackdrop).
  const backdrop = r.labelCardBg || r.labelCardBorder ? `<div class="room-label-backdrop${r.labelCardBlur ? ' blur' : ''}" data-room-id="${escapeHtml(r.id)}" style="left:${x.toFixed(3)}%;top:${y.toFixed(3)}%;--ax:${x.toFixed(3)}%;--ay:${y.toFixed(3)}%;--lscale:${clamp(Number(r.labelCardScale) || 1, .3, 4.5)};${cardLook(r, on)}"></div>` : '';
  // Only the part last touched shows its corner dots (the others keep a plain outline), so the dots never pile up.
  const shownParts = ROOM_LABEL_PARTS.filter(([part]) => content[part]).map(([part]) => part), activePart = shownParts.includes(selectedLabelPart) ? selectedLabelPart : shownParts[0];
  return backdrop + layeredParts(ROOM_LABEL_PARTS.filter(([part]) => content[part])).map(([part, key]) => {
    const bg = part === 'icon' ? roomIconFrameStyle(r, on) : roomTextPartStyle(r, key, on);
    const style = `left:${x.toFixed(3)}%;top:${y.toFixed(3)}%;--ax:${x.toFixed(3)}%;--ay:${y.toFixed(3)}%;--lx:${Number(r[`${key}X`]) || 0}px;--ly:${Number(r[`${key}Y`]) || 0}px;--lscale:${clamp(Number(r.labelCardScale) || 1, .3, 4.5)};--lsize:${clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420)}px${partBoxSize(r, key)}${bg}${accentVar}`;
    // Selected and ungrouped: a dot on each corner changes the part's width and height (Shift: proportionally).
    const handles = interactive && r.id === selectedRoomId ? ['nw','ne','sw','se'].map(c => `<i class="card-handle ${c}" data-corner="${c}"></i>`).join('') : '';
    return `<div class="room-label-part ${part}${(r[`${key}Bg`] || r[`${key}Border`]) && part !== 'icon' ? ' bg' : ''}${interactive ? ' editable' : ''}${r.labelLinked ? ' linked' : ''}${tap}${part === activePart ? ' active-part' : ''}" data-room-id="${escapeHtml(r.id)}" data-label-part="${part}" style="${style}">${content[part]}${handles}</div>`;
  }).join('');
}
function renderRoomLabels(view = activeSceneView()) {
  const layer = $('#room-labels'); if (!layer) return;
  const preview = id => editMode && id === selectedRoomId ? roomPreviewOn : '';
  // Each room's label sits in its own wrapper (display:contents) and is rebuilt only when its markup changed,
  // so dragging one room never re-creates (and flashes) the labels and icons of the others.
  const kept = new Set();
  Object.values(roomsOf(view)).forEach(room => {
    const html = roomLabelMarkup(room, preview(room.id), editMode && !room.geometryLocked && !roomDraft); kept.add(room.id);
    let group = [...layer.children].find(node => node.dataset.labelGroup === room.id);
    if (!group) { group = document.createElement('div'); group.className = 'room-label-group'; group.dataset.labelGroup = room.id; layer.append(group); }
    if (group.__html === html) return equalizeLabelFrames(room, group);
    // Only the position changed (the room or the label is being dragged): the existing nodes get the new
    // position styles instead of being re-created, so the icon is never rebuilt mid-drag.
    const key = html.replace(/left:[-\d.]+%;top:[-\d.]+%/g, '').replace(/--l[xy]:[-\d.]+px/g, '').replace(/min-(width|height):[\d.]+px/g, '');
    if (group.__key === key && group.children.length) {
      const fresh = document.createElement('template'); fresh.innerHTML = html;
      [...fresh.content.children].forEach((node, index) => { const live = group.children[index]; if (live && live.getAttribute('style') !== node.getAttribute('style')) live.setAttribute('style', node.getAttribute('style')); });
    } else group.innerHTML = html;
    group.__html = html; group.__key = key;
    equalizeLabelFrames(room, group);
  });
  [...layer.children].forEach(node => { if (!kept.has(node.dataset.labelGroup)) node.remove(); });
  renderDashGrid(); fitCardHandles();
}
// Corner dots stay exactly on the element's corners and are always whole: the plan clips what sticks out of it, so
// the dots are drawn in a layer above the plan card (not clipped) - a dot on the plan's edge shows past it.
function fitCardHandles() {
  const card = els.sceneCard; if (!card || !els.scene) return;
  let layer = $('#handle-overlay'); const handles = $$('#room-labels .card-handle');
  if (!handles.length) { layer?.replaceChildren(); return; }
  if (!layer) { layer = document.createElement('div'); layer.id = 'handle-overlay'; layer.setAttribute('aria-hidden', 'true'); card.append(layer); }
  // Placed against the layer's own box (whatever box it is laid out in on a computer or a phone).
  const base = layer.getBoundingClientRect(), kx = base.width / Math.max(1, layer.offsetWidth) || 1, ky = base.height / Math.max(1, layer.offsetHeight) || 1, keep = new Set();
  handles.forEach(h => {
    const owner = h.parentElement, key = `${owner?.dataset.roomId}|${owner?.dataset.labelPart}|${h.dataset.corner}`, r = h.getBoundingClientRect(); keep.add(key);
    let proxy = [...layer.children].find(n => n.dataset.key === key);
    if (!proxy) {
      proxy = document.createElement('i'); proxy.className = 'card-handle-proxy'; proxy.dataset.key = key; layer.append(proxy);
      proxy.addEventListener('pointerdown', event => { if (secondFingerToZoom(event)) return; const real = proxy.__real; if (real?.isConnected && editMode) startFreeResize(event, real); });
    }
    proxy.__real = h; proxy.dataset.corner = h.dataset.corner;
    proxy.classList.toggle('square', !!owner?.classList.contains('square')); proxy.hidden = !r.width || getComputedStyle(h).display === 'none';
    proxy.style.left = `${((r.left + r.width / 2 - base.left) / kx).toFixed(1)}px`; proxy.style.top = `${((r.top + r.height / 2 - base.top) / ky).toFixed(1)}px`;
  });
  [...layer.children].forEach(n => { if (!keep.has(n.dataset.key)) n.remove(); });
  // Panels opening / docking, the window or the plan changing size move the plan without a re-render: while dots are
  // shown they follow it every frame.
  if (!fitCardHandles.frame) fitCardHandles.frame = requestAnimationFrame(() => { fitCardHandles.frame = 0; fitCardHandles(); });
}
// In edit mode a label part is dragged with the finger or mouse; it follows the grid (when on) and the camera follows it.
// A corner dot of a label or of an ungrouped part: width and height change freely (the opposite corner stays put; Shift
// scales proportionally). A part's content shrinks with its frame below its own size; a label's frame never gets smaller
// than its content. Each moving side snaps to the lines of other elements on screen and to the width / height of another
// label or part; with nothing else in reach the frame snaps to width = height (1:1).
function startFreeResize(event, handle) {
  // The dial keeps its shape: its dots always scale it (a free width / height would only add empty margin).
  if (event.shiftKey || handle.closest('.room-label-part')?.dataset.labelPart === 'dial') return startCardResize(event, handle);
  const gridHold = { x: null, y: null };
  const node = handle.closest('.room-label-card, .room-label-part'), room = roomsOf()[node?.dataset.roomId]; if (!room) return;
  const isCard = node.classList.contains('room-label-card'), key = isCard ? 'labelCard' : partKey(node); if (!key) return;
  event.preventDefault(); event.stopPropagation(); try { els.scene.setPointerCapture(event.pointerId); } catch {}
  const c = handle.dataset.corner, sx = c.includes('w') ? -1 : 1, sy = c.includes('n') ? -1 : 1, id = CSS.escape(room.id);
  const scene = els.scene.getBoundingClientRect(), planToScreen = scene.width / (els.scene.offsetWidth || 1) * (sceneScale || 1);
  const rect0 = node.getBoundingClientRect(), k = rect0.width / Math.max(1, node.offsetWidth);
  const keep = [node.style.minWidth, node.style.minHeight]; node.style.minWidth = ''; node.style.minHeight = '';
  const natW = node.offsetWidth, natH = node.offsetHeight; [node.style.minWidth, node.style.minHeight] = keep;
  const cs = getComputedStyle(node), hasPad = room[`${key}Padding`] !== undefined && room[`${key}Padding`] !== null && room[`${key}Padding`] !== '';
  const fixedPad = !isCard && (node.dataset.labelPart === 'icon' || hasPad), padX = fixedPad ? (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)) || 0 : 0, padY = fixedPad ? (parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) || 0 : 0;
  const startSize = isCard ? 1 : Number(room[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`];
  const fx = sx > 0 ? rect0.left : rect0.right, fy = sy > 0 ? rect0.top : rect0.bottom, cx0 = (rect0.left + rect0.right) / 2, cy0 = (rect0.top + rect0.bottom) / 2;
  const posX = `${key}X`, posY = `${key}Y`, startX = Number(room[posX]) || 0, startY = Number(room[posY]) || 0;
  const sel = isCard ? `.room-label-card[data-room-id="${id}"]` : `.room-label-part[data-room-id="${id}"][data-label-part="${node.dataset.labelPart}"]`;
  const groupMode = !isCard && !room.labelLinked, gctx = groupMode ? groupSnap(room, [node]) : null;
  const st = groupMode ? { ...snapTargets(), edges: true, centers: true, labels: true } : snapTargets(), view = visibleSceneRect(), useSnap = st.guides;
  const g = groupMode ? { xs: [...gctx.xs], ys: [...gctx.ys] } : useSnap ? guideTargets({ roomId: room.id }) : { xs: [], ys: [] };
  if (groupMode && useSnap) showGroupGrid(gctx);
  const boxOf = r => ({ l: r.left - scene.left, r: r.right - scene.left, t: r.top - scene.top, b: r.bottom - scene.top, radius: r.radius });
  const own = isCard ? [] : $$(`.room-label-part[data-room-id="${id}"]`).filter(n => n !== node).map(shapedRect).filter(r => r.width);
  if (useSnap && !groupMode) own.forEach(r => { const pts = (a, b) => [...(st.edges ? [a, b] : []), ...(st.centers ? [(a + b) / 2] : [])]; pts(r.left, r.right).forEach(v => g.xs.push({ v: v - scene.left, kind: 'label', box: boxOf(r) })); pts(r.top, r.bottom).forEach(v => g.ys.push({ v: v - scene.top, kind: 'label', box: boxOf(r) })); });
  const sizes = useSnap && groupMode ? own : useSnap && st.labels ? [...own, ...$$('#room-labels .room-label-card, #room-labels .room-label-part').filter(n => n.dataset.roomId !== room.id && n.offsetParent !== null).map(shapedRect).filter(r => r.width && rectOnScreen(r, view))] : [];
  let moved = false;
  const move = e => {
    if (e.pointerId !== event.pointerId) return; moved = true;
    let ex = (sx > 0 ? rect0.right : rect0.left) + e.clientX - event.clientX, ey = (sy > 0 ? rect0.bottom : rect0.top) + e.clientY - event.clientY;
    let bx = null, by = null, square = false;
    if (useSnap && !e.altKey) {
      const reach = mobileView() ? 10 : 7;
      // One snap per moving side: a line of another element, or the width / height of another label or part.
      const pick = (edge, fixed, sign, lines, horizontal) => { let best = null;
        lines.forEach(t => { const v = (horizontal ? scene.left : scene.top) + t.v, d = Math.abs(edge - v); if (sign * (v - fixed) > 4 && d <= reach && (!best || d < best.d)) best = { d, edge: v, t }; });
        sizes.forEach(r => { const size = horizontal ? r.width : r.height, v = fixed + sign * size, d = Math.abs(edge - v); if (d <= reach && (!best || d < best.d)) best = { d, edge: v, r, size: true }; });
        // The grid holds a little longer than it catches (a firmer grip): a caught line is kept while the pointer stays near.
        const held = gridHold[horizontal ? 'x' : 'y'], gl = groupMode ? null : held !== null && Math.abs(edge - held) <= (mobileView() ? 26 : 20) ? held : gridLineNear(edge, horizontal);
        gridHold[horizontal ? 'x' : 'y'] = null;
        if (gl !== null && sign * (gl - fixed) > 4) { const d = Math.abs(edge - gl); if (!best || d < best.d || best.d > 3) { best = { d, edge: gl, grid: true }; gridHold[horizontal ? 'x' : 'y'] = gl; } }
        return best; };
      bx = pick(ex, fx, sx, g.xs, true); by = pick(ey, fy, sy, g.ys, false);
      if (bx) ex = bx.edge; if (by) ey = by.edge;
      // 1:1 - only the side that caught nothing follows the other one.
      const W = Math.abs(ex - fx), H = Math.abs(ey - fy);
      // A group's grid line gives way to 1:1 (only a real line - a part, an axis - holds against it).
      const hard = b => b && !b.t?.grid;
      if (Math.abs(W - H) <= reach && !(hard(bx) && hard(by)) && !(bx && by && !groupMode)) { square = true; if (hard(bx) || (!hard(by) && bx && !by) || (!hard(by) && !by && W >= H) || (!hard(by) && bx && by && W >= H)) ey = fy + sy * W; else ex = fx + sx * H; }
    }
    // The moving corner never leaves the plan.
    ex = clamp(ex, scene.left, scene.right); ey = clamp(ey, scene.top, scene.bottom);
    let lw = Math.abs(ex - fx) / k, lh = Math.abs(ey - fy) / k;
    if (isCard) {
      lw = Math.max(natW, lw); lh = Math.max(natH, lh);
      room.labelCardW = lw <= natW + .5 ? 0 : Math.round(lw * 10) / 10; room.labelCardH = lh <= natH + .5 ? 0 : Math.round(lh * 10) / 10;
    } else {
      // Below its own size the content shrinks (to the tighter side); a frame larger than the content is kept.
      const cw = Math.max(1, natW - padX), ch = Math.max(1, natH - padY), minScale = 6 / startSize;
      lw = Math.max(padX + cw * minScale, lw); lh = Math.max(padY + ch * minScale, lh);
      const scale = Math.min(1, (lw - padX) / cw, (lh - padY) / ch);
      room[`${key}Size`] = Math.max(6, Math.round(startSize * scale * 10) / 10);
      room[`${key}W`] = lw > padX + cw * scale + .5 ? Math.round(lw * 10) / 10 : 0; room[`${key}H`] = lh > padY + ch * scale + .5 ? Math.round(lh * 10) / 10 : 0;
    }
    ex = fx + sx * lw * k; ey = fy + sy * lh * k;
    room[posX] = Math.round((startX + ((fx + ex) / 2 - cx0) / planToScreen) * 100) / 100; room[posY] = Math.round((startY + ((fy + ey) / 2 - cy0) / planToScreen) * 100) / 100;
    renderRoomLabels();
    const r = $(sel)?.getBoundingClientRect() || rect0, Ws = scene.width || 1, Hs = scene.height || 1, px = v => (v - scene.left) / Ws * 100, py = v => (v - scene.top) / Hs * 100;
    const vertical = [], horizontal = [], marks = [], hits = [];
    const add = (b, isX) => {
      if (!b || b.grid) return; const t = b.r || (b.t?.box ? { left: b.t.box.l + scene.left, right: b.t.box.r + scene.left, top: b.t.box.t + scene.top, bottom: b.t.box.b + scene.top } : null);
      if (t) hits.push({ l: t.left - scene.left, r: t.right - scene.left, t: t.top - scene.top, b: t.bottom - scene.top, radius: t.radius ?? b.t?.box?.radius, kind: b.t?.kind || 'label' });
      if (b.size && t) { if (isX) marks.push({ axis: 'x', from: px(r.left), to: px(r.right), at: py(r.bottom + 6) }, { axis: 'x', from: px(t.left), to: px(t.right), at: py(t.bottom + 6) }); else marks.push({ axis: 'y', from: py(r.top), to: py(r.bottom), at: px(r.right + 6) }, { axis: 'y', from: py(t.top), to: py(t.bottom), at: px(t.right + 6) }); return; }
      const kind = b.t?.kind || 'label';
      if (isX) vertical.push({ at: px(b.edge), kind, ...(t ? { from: py(Math.min(r.top, t.top)), to: py(Math.max(r.bottom, t.bottom)) } : {}) });
      else horizontal.push({ at: py(b.edge), kind, ...(t ? { from: px(Math.min(r.left, t.left)), to: px(Math.max(r.right, t.right)) } : {}) });
    };
    add(bx, true); add(by, false);
    showAlignGuides(vertical, horizontal, marks, hits);
    $(sel)?.classList.toggle('square', square || Math.abs(r.width - r.height) < .5);
  };
  const up = e => {
    if (e.pointerId !== event.pointerId) return;
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); showAlignGuides([], []); hideGroupGrid();
    const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 250);
    if (moved) { room.updatedAt = new Date().toISOString(); scheduleSave(true); if (selectedRoomId === room.id) openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); }
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
}
// Icon, name and state never overlap: a dragged part that runs into another one stops touching it
// (it is pushed out the shortest way, so it slides along the other part's side).
function keepApart(room, key, part) {
  if (part === 'dial') return; // a thermostat's dial may carry other parts (its centre is free space)
  const id = CSS.escape(room.id), scene = els.scene.getBoundingClientRect(), toPlan = scene.width / (els.scene.offsetWidth || 1) * (sceneScale || 1);
  for (let pass = 0; pass < 3; pass++) {
    const node = $(`.room-label-part[data-room-id="${id}"][data-label-part="${part}"]`); if (!node) return;
    const a = node.getBoundingClientRect(); let push = null;
    $$(`.room-label-part[data-room-id="${id}"]`).filter(other => other !== node && other.dataset.labelPart !== 'dial').forEach(other => {
      const b = other.getBoundingClientRect(); if (!b.width || a.right <= b.left + .5 || a.left >= b.right - .5 || a.bottom <= b.top + .5 || a.top >= b.bottom - .5) return;
      const moves = [[b.left - a.right, 0], [b.right - a.left, 0], [0, b.top - a.bottom], [0, b.bottom - a.top]].sort((p, q) => Math.abs(p[0] + p[1]) - Math.abs(q[0] + q[1]));
      if (!push || Math.abs(moves[0][0] + moves[0][1]) > Math.abs(push[0] + push[1])) push = moves[0];
    });
    if (!push) return;
    room[`${key}X`] = Math.round(((Number(room[`${key}X`]) || 0) + push[0] / toPlan) * 100) / 100; room[`${key}Y`] = Math.round(((Number(room[`${key}Y`]) || 0) + push[1] / toPlan) * 100) / 100;
    renderRoomLabels();
  }
}
// A corner dot of a grouped label or of an ungrouped part (icon / name / state): the element scales proportionally with
// the pointer and the opposite corner keeps its place on screen. The moving corner snaps to the lines of other elements on
// screen and the element to the width / height of another label or part (as set in the snap menu; Alt disables).
function startCardResize(event, handle) {
  const node = handle.closest('.room-label-card, .room-label-part'), room = roomsOf()[node?.dataset.roomId]; if (!room) return;
  const isCard = node.classList.contains('room-label-card'), key = isCard ? '' : partKey(node); if (!isCard && !key) return;
  event.preventDefault(); event.stopPropagation(); try { els.scene.setPointerCapture(event.pointerId); } catch {}
  const c = handle.dataset.corner, r0 = node.getBoundingClientRect(), sx = c.includes('w') ? -1 : 1, sy = c.includes('n') ? -1 : 1;
  const fixed = { x: sx > 0 ? r0.left : r0.right, y: sy > 0 ? r0.top : r0.bottom }, diag = Math.hypot(r0.width, r0.height) || 1, ux = sx * r0.width / diag, uy = sy * r0.height / diag;
  const sceneRect = els.scene.getBoundingClientRect(), planToScreen = sceneRect.width / (els.scene.offsetWidth || 1) * (sceneScale || 1);
  const along0 = Math.max(1, (event.clientX - fixed.x) * ux + (event.clientY - fixed.y) * uy);
  const id = CSS.escape(room.id), sel = isCard ? `.room-label-card[data-room-id="${id}"]` : `.room-label-part[data-room-id="${id}"][data-label-part="${node.dataset.labelPart}"]`;
  const posX = isCard ? 'labelCardX' : `${key}X`, posY = isCard ? 'labelCardY' : `${key}Y`;
  // What one scale step changes: the group's scale, or the part's text / icon size, its frame and its own margin.
  const num = k => { const v = room[k]; return v === undefined || v === null || v === '' ? null : Number(v); };
  const start = isCard ? { scale: clamp(Number(room.labelCardScale) || 1, .3, 4.5) } : { size: Number(room[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], w: Number(room[`${key}W`]) || 0, h: Number(room[`${key}H`]) || 0, pad: num(`${key}Padding`) };
  const apply = f => {
    if (isCard) { room.labelCardScale = Math.round(clamp(start.scale * f, .3, 4.5) * 1000) / 1000; return; }
    room[`${key}Size`] = Math.round(clamp(start.size * f, 6, 420) * 10) / 10;
    room[`${key}W`] = start.w ? Math.round(start.w * f * 10) / 10 : 0; room[`${key}H`] = start.h ? Math.round(start.h * f * 10) / 10 : 0;
    if (start.pad !== null && Number.isFinite(start.pad)) room[`${key}Padding`] = Math.round(start.pad * f * 10) / 10;
  };
  const st = snapTargets(), useSnap = st.guides, view = visibleSceneRect();
  const targets = useSnap ? guideTargets({ roomId: room.id }) : { xs: [], ys: [] };
  const boxOf = r => ({ l: r.left - sceneRect.left, r: r.right - sceneRect.left, t: r.top - sceneRect.top, b: r.bottom - sceneRect.top });
  // A part also lines up with the other parts of its own label.
  const own = isCard ? [] : $$(`.room-label-part[data-room-id="${id}"]`).filter(n => n !== node).map(shapedRect).filter(r => r.width);
  if (useSnap) own.forEach(r => { const pts = (a, b) => [...(st.edges ? [a, b] : []), ...(st.centers ? [(a + b) / 2] : [])]; pts(r.left, r.right).forEach(v => targets.xs.push({ v: v - sceneRect.left, kind: 'label', box: boxOf(r) })); pts(r.top, r.bottom).forEach(v => targets.ys.push({ v: v - sceneRect.top, kind: 'label', box: boxOf(r) })); });
  const sizes = useSnap && st.labels ? [...own, ...$$('#room-labels .room-label-card, #room-labels .room-label-part').filter(n => n.dataset.roomId !== room.id && n.offsetParent !== null).map(shapedRect).filter(r => r.width && rectOnScreen(r, view))] : [];
  let moved = false;
  const render = () => { renderRoomLabels(); return $(sel)?.getBoundingClientRect(); };
  const move = e => {
    if (e.pointerId !== event.pointerId) return; moved = true;
    const along = (e.clientX - fixed.x) * ux + (e.clientY - fixed.y) * uy;
    let f = Math.max(.05, along) / along0, snap = null;
    if (useSnap && !e.altKey) {
      const reach = mobileView() ? 10 : 7, W = r0.width * f, H = r0.height * f, cx = fixed.x + sx * W, cy = fixed.y + sy * H;
      const take = (d, info) => { if (d <= reach && (!snap || d < snap.d)) snap = { d, ...info }; };
      targets.xs.forEach(g => { const v = sceneRect.left + g.v; if (sx * (v - fixed.x) > 4) take(Math.abs(cx - v), { want: 'w', size: sx * (v - fixed.x), at: g.v, axis: 'x', g }); });
      targets.ys.forEach(g => { const v = sceneRect.top + g.v; if (sy * (v - fixed.y) > 4) take(Math.abs(cy - v), { want: 'h', size: sy * (v - fixed.y), at: g.v, axis: 'y', g }); });
      sizes.forEach(r => { take(Math.abs(W - r.width), { want: 'w', size: r.width, r, match: true }); take(Math.abs(H - r.height), { want: 'h', size: r.height, r, match: true }); });
      if (snap) f = snap.size / (snap.want === 'w' ? r0.width : r0.height);
    }
    { const room_ = els.scene.getBoundingClientRect(), maxX = (sx > 0 ? room_.right - fixed.x : fixed.x - room_.left) / Math.max(1, r0.width), maxY = (sy > 0 ? room_.bottom - fixed.y : fixed.y - room_.top) / Math.max(1, r0.height); f = Math.min(f, maxX, maxY); }
    apply(f); let r = render(); if (!r) return;
    // Text and margins do not scale exactly linearly: one correction lands a snapped size on the pixel.
    if (snap) { const got = snap.want === 'w' ? r.width : r.height; if (got > 1 && Math.abs(got - snap.size) > .3) { f *= snap.size / got; apply(f); r = render() || r; } }
    // Keep the opposite corner where it was: move the element by what the scaling shifted it.
    const dx = fixed.x - (sx > 0 ? r.left : r.right), dy = fixed.y - (sy > 0 ? r.top : r.bottom);
    if (Math.abs(dx) > .1 || Math.abs(dy) > .1) { room[posX] = Math.round(((Number(room[posX]) || 0) + dx / planToScreen) * 100) / 100; room[posY] = Math.round(((Number(room[posY]) || 0) + dy / planToScreen) * 100) / 100; r = render() || r; }
    if (!snap) return showAlignGuides([], []);
    const Ws = sceneRect.width || 1, Hs = sceneRect.height || 1, px = v => (v - sceneRect.left) / Ws * 100, py = v => (v - sceneRect.top) / Hs * 100;
    const box = snap.r ? boxOf(snap.r) : snap.g.box, hit = box ? [{ ...box, kind: snap.g?.kind || 'label' }] : [];
    if (snap.match) {
      const marks = snap.want === 'w'
        ? [{ axis: 'x', from: px(r.left), to: px(r.right), at: py(r.bottom + 6) }, { axis: 'x', from: px(snap.r.left), to: px(snap.r.right), at: py(snap.r.bottom + 6) }]
        : [{ axis: 'y', from: py(r.top), to: py(r.bottom), at: px(r.right + 6) }, { axis: 'y', from: py(snap.r.top), to: py(snap.r.bottom), at: px(snap.r.right + 6) }];
      return showAlignGuides([], [], marks, hit);
    }
    const mine = boxOf(r), kind = snap.g.kind || 'label';
    if (snap.axis === 'x') showAlignGuides([{ at: snap.at / Ws * 100, kind, from: Math.min(mine.t, box?.t ?? mine.t) / Hs * 100, to: Math.max(mine.b, box?.b ?? mine.b) / Hs * 100 }], [], [], hit);
    else showAlignGuides([], [{ at: snap.at / Hs * 100, kind, from: Math.min(mine.l, box?.l ?? mine.l) / Ws * 100, to: Math.max(mine.r, box?.r ?? mine.r) / Ws * 100 }], [], hit);
  };
  const up = e => {
    if (e.pointerId !== event.pointerId) return;
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); showAlignGuides([], []);
    const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 250);
    if (moved) { room.updatedAt = new Date().toISOString(); scheduleSave(true); if (selectedRoomId === room.id) openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); }
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
}
let pendingPartFocus = null;
// In the label / thermostat panel, the section of the part being edited is opened, marked and scrolled into view.
function markPartSection(part) { const content = $('#room-editor-content'); if (!content) return null; $$('.part-section.current', content).forEach(d => d.classList.remove('current')); const target = part && content.querySelector(`details.part-section.part-${CSS.escape(part)}`); target?.classList.add('current'); return target; }
function focusPartSection(part) {
  const target = markPartSection(part); if (!target) return;
  if (!target.open) target.open = true;
  requestAnimationFrame(() => target.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
}
// Editing the parts of an ungrouped label / thermostat is its own little world: a part snaps only to the other parts
// of the same group, to the group's centre axes and outer edges, and to the group's own fine grid (shown while moving or
// resizing) - not to the plan's grid or other elements, whatever "Przyciągaj do" says (only switching the guides off stops it).
const GROUP_GRID = 10; // group grid step, in the label's own px (grows and shrinks with the label)
function groupSnap(room, exclude = []) {
  const scene = els.scene.getBoundingClientRect(), id = CSS.escape(room.id);
  const parts = $$(`.room-label-part[data-room-id="${id}"]`).filter(n => n.offsetParent !== null), others = parts.filter(n => !exclude.includes(n));
  const ref = parts[0], k = ref ? ref.getBoundingClientRect().width / Math.max(1, ref.offsetWidth) : 1;
  let step = GROUP_GRID * k; while (step < 8) step *= 2; // zoomed out, the grid gets coarser (never denser than ~8 screen px)
  const [axp, ayp] = roomAnchor(room), anchor = { x: scene.left + axp / 100 * scene.width, y: scene.top + ayp / 100 * scene.height };
  const rects = parts.map(n => n.getBoundingClientRect()), orects = others.map(n => n.getBoundingClientRect());
  const union = rs => rs.length ? { l: Math.min(...rs.map(r => r.left)), r: Math.max(...rs.map(r => r.right)), t: Math.min(...rs.map(r => r.top)), b: Math.max(...rs.map(r => r.bottom)) } : { l: anchor.x, r: anchor.x, t: anchor.y, b: anchor.y };
  const u = union(rects), frame = union(orects), rel = b => ({ l: b.l - scene.left, r: b.r - scene.left, t: b.t - scene.top, b: b.b - scene.top });
  const xs = [], ys = [];
  orects.forEach(r => { const box = rel({ l: r.left, r: r.right, t: r.top, b: r.bottom }); [r.left, (r.left + r.right) / 2, r.right].forEach((v, i) => xs.push({ v: v - scene.left, kind: 'label', own: true, center: i === 1, box })); [r.top, (r.top + r.bottom) / 2, r.bottom].forEach((v, i) => ys.push({ v: v - scene.top, kind: 'label', own: true, center: i === 1, box })); });
  xs.push({ v: anchor.x - scene.left, kind: 'group', own: true, center: true }); ys.push({ v: anchor.y - scene.top, kind: 'group', own: true, center: true });
  if (orects.length) { const fb = rel(frame); [frame.l, frame.r].forEach(v => xs.push({ v: v - scene.left, kind: 'group', own: true, box: fb })); [frame.t, frame.b].forEach(v => ys.push({ v: v - scene.top, kind: 'group', own: true, box: fb })); }
  const pad = step * 6, area = { l: u.l - pad, r: u.r + pad, t: u.t - pad, b: u.b + pad };
  // Snap lines over the whole visible screen (a part may be moved far from the others); the drawing stays near the parts.
  const v = visibleSceneRect(), lines = { l: Math.min(area.l, v.left), r: Math.max(area.r, v.right), t: Math.min(area.t, v.top), b: Math.max(area.b, v.bottom) };
  for (let n = Math.ceil((lines.l - anchor.x) / step); anchor.x + n * step <= lines.r; n++) if (n) xs.push({ v: anchor.x + n * step - scene.left, kind: 'group', own: true, grid: true });
  for (let n = Math.ceil((lines.t - anchor.y) / step); anchor.y + n * step <= lines.b; n++) if (n) ys.push({ v: anchor.y + n * step - scene.top, kind: 'group', own: true, grid: true });
  return { scene, xs, ys, step, anchor, area, others };
}
// The group's grid drawn under the parts while one is moved / resized: fine lines every step, the centre axes stronger.
function showGroupGrid(ctx) {
  if (!ctx || !snapTargets().guides) return hideGroupGrid();
  let el = $('#group-grid'); if (!el) { el = document.createElement('div'); el.id = 'group-grid'; el.setAttribute('aria-hidden', 'true'); els.scene.append(el); }
  const z = ctx.scene.width / Math.max(1, els.scene.offsetWidth), a = ctx.area, L = (a.l - ctx.scene.left) / z, T = (a.t - ctx.scene.top) / z, W = (a.r - a.l) / z, H = (a.b - a.t) / z, st = ctx.step / z;
  const ax = (ctx.anchor.x - a.l) / z, ay = (ctx.anchor.y - a.t) / z;
  Object.assign(el.style, { left: `${L}px`, top: `${T}px`, width: `${W}px`, height: `${H}px` });
  els.scene.classList.add('group-editing');
  el.style.setProperty('--gax', `${ax}px`); el.style.setProperty('--gay', `${ay}px`); el.style.setProperty('--gst', `${st}px`);
  el.style.setProperty('--gox', `${((ax % st) + st) % st}px`); el.style.setProperty('--goy', `${((ay % st) + st) % st}px`);
}
function hideGroupGrid() { $('#group-grid')?.remove(); els.scene?.classList.remove('group-editing'); }
// Two fingers are a zoom, never a move: fingers on the screen are counted; a finger landing while one label is being
// moved cancels that move (the label goes back where it was) and both fingers zoom / pan the plan instead.
const touchesDown = new Map(); let activeLabelDrag = null;
function trackTouchDown(event) {
  if (event.pointerType !== 'touch') return; touchesDown.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const drag = activeLabelDrag; if (!drag || drag.id === event.pointerId) return;
  drag.cancel(); const p = touchesDown.get(drag.id) || { x: drag.x, y: drag.y };
  viewportPointerDown({ pointerId: drag.id, pointerType: 'touch', isPrimary: true, clientX: p.x, clientY: p.y, button: 0, target: els.scene, preventDefault() {}, stopPropagation() {} });
}
function trackTouchMove(event) { if (touchesDown.has(event.pointerId)) touchesDown.set(event.pointerId, { x: event.clientX, y: event.clientY }); }
function trackTouchUp(event) { touchesDown.delete(event.pointerId); }
// A second finger on a label / dot / marker goes to the plan's zoom (true when it was handed over).
function secondFingerToZoom(event) {
  if (event.pointerType !== 'touch' || touchesDown.size < 2 || !editMode) return false;
  event.preventDefault(); event.stopPropagation(); viewportPointerDown(event); return true;
}
function startRoomLabelDrag(event) {
  if (secondFingerToZoom(event)) return;
  const corner = event.target.closest?.('.card-handle'); if (corner && editMode) return startFreeResize(event, corner);
  const node = event.target.closest('.room-label-part.editable, .room-label-card.editable'); if (!node || !editMode || event.button > 0) return;
  const room = roomsOf()[node.dataset.roomId], part = node.dataset.labelPart === 'card' ? ['card','labelCard','Grupa'] : ROOM_LABEL_PARTS.find(([p]) => p === node.dataset.labelPart); if (!room || !part) return;
  // Ungrouped, on a phone: only the active part moves at once. A finger landing on another part does not grab it - a
  // tap makes it the active one (then it can be moved), a drag moves the plan - so passing fingers move nothing by mistake.
  if (event.pointerType === 'touch' && selectedRoomId === room.id && !room.labelLinked && node.dataset.labelPart !== 'card' && !node.classList.contains('active-part')) {
    event.preventDefault(); event.stopPropagation(); viewportPointerDown(event);
    const sx = event.clientX, sy = event.clientY, t0 = performance.now(), id = event.pointerId, partName = node.dataset.labelPart;
    const end = e => {
      if (e.pointerId !== id) return; window.removeEventListener('pointerup', end, true); window.removeEventListener('pointercancel', end, true);
      if (e.type !== 'pointerup' || Math.hypot(e.clientX - sx, e.clientY - sy) >= 10 || performance.now() - t0 > 700 || touchesDown.size > 1) return;
      const swallow = c => { c.stopPropagation(); c.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 400);
      selectedLabelPart = partName; panelPart = null; $$(`.room-label-part[data-room-id="${CSS.escape(room.id)}"]`).forEach(n => n.classList.toggle('active-part', n.dataset.labelPart === partName));
      renderRoomLabels(); if ($('#room-editor')?.classList.contains('visible')) focusPartSection(partName);
      requestAnimationFrame(() => requestAnimationFrame(() => { const box = partFocusBox(room, partName); if (box) focusSceneBoxOnMobile(box); }));
    };
    window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true);
    return;
  }
  if (node.dataset.labelPart !== 'card') {
    selectedLabelPart = node.dataset.labelPart; panelPart = null; $$(`.room-label-part[data-room-id="${CSS.escape(room.id)}"]`).forEach(n => n.classList.toggle('active-part', n === node));
    // The panel follows the touched part: its section opens and is marked (now, or when the panel opens).
    if (!room.labelLinked) { if (selectedRoomId === room.id && $('#room-editor')?.classList.contains('visible')) focusPartSection(selectedLabelPart); else pendingPartFocus = { roomId: room.id, part: selectedLabelPart }; }
  }
  // Ungrouped: a tapped part is brought into view on its own (like picking its section in the panel), else the whole label.
  const focusBox = () => (!room.labelLinked && node.dataset.labelPart !== 'card' && partFocusBox(room, node.dataset.labelPart)) || (isIconRoom(room) ? iconFocusBox(room) : room.points || []);
  if (touchSelectFirst(event, selectedRoomId === room.id, () => { openRoomEditor(room.id); requestAnimationFrame(() => requestAnimationFrame(() => focusSceneBoxOnMobile(focusBox()))); })) return;
  event.preventDefault(); event.stopPropagation();
  // The editor opens on a tap only (release without moving); grabbing and dragging right away just moves the label.
  const newlySelected = selectedRoomId !== room.id;
  const key = part[1], [ax, ay] = roomAnchor(room), w = els.scene.offsetWidth || 1, h = els.scene.offsetHeight || 1, k = sceneScale || 1;
  // "One element": every visible part moves by the same amount as the one held.
  const moving = key === 'labelCard' ? [key] : room.labelLinked ? ROOM_LABEL_PARTS.filter(([, kk]) => room[kk]).map(([, kk]) => kk) : [key];
  const startOffsets = Object.fromEntries(moving.map(kk => [kk, [Number(room[`${kk}X`] ?? ROOM_DEFAULTS[`${kk}X`]) || 0, Number(room[`${kk}Y`] ?? ROOM_DEFAULTS[`${kk}Y`]) || 0]]));
  // Everything a move may change (also parts pushed apart), to put back if a second finger turns it into a zoom.
  const before = Object.fromEntries([...ROOM_LABEL_PARTS.map(([, kk]) => kk), 'labelCard'].flatMap(kk => [`${kk}X`, `${kk}Y`]).map(kk => [kk, room[kk]]));
  const partPct = kk => [ax + (Number(room[`${kk}X`] ?? ROOM_DEFAULTS[`${kk}X`]) || 0) * k / w * 100, ay + (Number(room[`${kk}Y`] ?? ROOM_DEFAULTS[`${kk}Y`]) || 0) * k / h * 100];
  const [sx, sy] = scenePercentAt(event), [px, py] = partPct(key), grab = [sx - px, sy - py];
  // Guides only of this room: its outline edges and centre, the label anchor, and its label parts that stay in place.
  let guides = null;
  const groupMode = key !== 'labelCard' && !room.labelLinked;
  const roomGuides = () => {
    if (groupMode) {
      const ctx = groupSnap(room, [node]), own = node.getBoundingClientRect(), [qx, qy] = partPct(key); showGroupGrid(ctx);
      const boxes = ctx.others.map(o => { const r = o.getBoundingClientRect(); return { l: r.left - ctx.scene.left, r: r.right - ctx.scene.left, t: r.top - ctx.scene.top, b: r.bottom - ctx.scene.top, radius: shapedRect(o).radius, own: true }; });
      return { group: true, scene: ctx.scene, xs: ctx.xs, ys: ctx.ys, boxes, roomBox: null, offsets: [0, -1, 1], halfW: own.width / 2, halfH: own.height / 2, precise: true,
        shiftX: (own.left + own.width / 2 - ctx.scene.left) - qx / 100 * ctx.scene.width, shiftY: (own.top + own.height / 2 - ctx.scene.top) - qy / 100 * ctx.scene.height };
    }
    const scene = els.scene.getBoundingClientRect(), xs = isIconRoom(room) ? [ax] : room.points.map(p => p[0]), ys = isIconRoom(room) ? [ay] : room.points.map(p => p[1]), toX = v => v / 100 * scene.width, toY = v => v / 100 * scene.height;
    // Its own room's outline / anchor (room colour; an etykieta has only its point), its own parts that stay put
    // (label colour), and every other element: wskaźniki, Flow, other labels, rooms and the background.
    // Its own room's lines only with "Pomieszczenia" switched on in the snap menu, and only across that room.
    const ownRoom = !isIconRoom(room) && snapTargets().rooms, rb = ownRoom ? { l: toX(Math.min(...xs)), r: toX(Math.max(...xs)), t: toY(Math.min(...ys)), b: toY(Math.max(...ys)) } : null;
    const st = snapTargets(), pick = (lo, hi, anchor) => [...(st.edges ? [lo, hi] : []), ...(st.centers ? [(lo + hi) / 2, anchor] : [])];
    const gx = (ownRoom ? pick(Math.min(...xs), Math.max(...xs), ax) : []).map((v, i, all) => ({ v: toX(v), room:true, kind:'room', box: rb, span: rb && [rb.t, rb.b], own: true, center: !st.edges || i >= 2 }));
    const gy = (ownRoom ? pick(Math.min(...ys), Math.max(...ys), ay) : []).map((v, i, all) => ({ v: toY(v), room:true, kind:'room', box: rb, span: rb && [rb.l, rb.r], own: true, center: !st.edges || i >= 2 }));
    $$(`.room-label-part[data-room-id="${CSS.escape(room.id)}"]`).filter(other => !moving.includes(ROOM_LABEL_PARTS.find(([p]) => p === other.dataset.labelPart)?.[1])).forEach(other => { const r = other.getBoundingClientRect(); [r.left, r.left + r.width / 2, r.right].forEach((v, i) => { if (i === 1 ? st.centers : st.edges) gx.push({ v: v - scene.left, kind:'label', own: true, center: i === 1 }); }); [r.top, r.top + r.height / 2, r.bottom].forEach((v, i) => { if (i === 1 ? st.centers : st.edges) gy.push({ v: v - scene.top, kind:'label', own: true, center: i === 1 }); }); });
    if (snapTargets().guides) { const all = guideTargets({ roomId: room.id }); gx.push(...all.xs); gy.push(...all.ys); }
    // Label boxes for label-to-label snapping (alignLabel): other labels (a group as a whole or ungrouped parts) and this
    // label's own parts that stay in place.
    const boxOf = other => { const r = other.getBoundingClientRect(); return { l: r.left - scene.left, r: r.right - scene.left, t: r.top - scene.top, b: r.bottom - scene.top }; };
    const ownPart = other => other.dataset.roomId === room.id;
    const boxes = [
      ...(snapTargets().guides && snapTargets().labels ? $$('#room-labels .room-label-card, #room-labels .room-label-part').filter(other => other.dataset.roomId !== room.id && other.offsetParent !== null) : []),
      ...$$(`.room-label-part[data-room-id="${CSS.escape(room.id)}"]`).filter(other => !moving.includes(ROOM_LABEL_PARTS.find(([p]) => p === other.dataset.labelPart)?.[1]))
    ].filter(other => ownPart(other) || rectOnScreen(other.getBoundingClientRect())).map(other => ({ ...boxOf(other), radius: shapedRect(other).radius, own: ownPart(other) })).filter(b => b.r - b.l > 1);
    const own = node.getBoundingClientRect(), [qx, qy] = partPct(key);
    // Centre and both edges of the dragged part line up with the edges and centres of the others. The visible box need
    // not be centred on the label's point (a free group is shifted to cover its parts): its offset is kept (shiftX/Y).
    return { scene, xs: gx, ys: gy, boxes, roomBox: rb, offsets: [0, -1, 1], halfW: own.width / 2, halfH: own.height / 2, precise: true,
      shiftX: (own.left + own.width / 2 - scene.left) - qx / 100 * scene.width, shiftY: (own.top + own.height / 2 - scene.top) - qy / 100 * scene.height };
  };
  let moved = false, alive = true; const camera = dragCamera(e => { clearTimeout(guides?.motion?.timer); guides = null; place(e); });
  try { els.scene.setPointerCapture(event.pointerId); } catch {}
  const place = e => {
    const [x, y] = scenePercentAt(e); if (!cameraPanning) { guides ||= roomGuides(); guides.onSettle = () => place(e); }
    const gp = v => groupMode ? v : snapPercent(v); // the plan's grid does not apply inside a group
    if (groupMode && guides) requestAnimationFrame(() => { if (alive) showGroupGrid(groupSnap(room)); }); // the drawn grid follows the part
    const snapped = guides?.boxes ? alignLabel(guides, gp(x - grab[0]), gp(y - grab[1]), e) : alignToGuides(guides, gp(x - grab[0]), gp(y - grab[1]), e);
    const dx = Math.round((snapped.xPercent - ax) / 100 * w / k * 100) / 100 - startOffsets[key][0], dy = Math.round((snapped.yPercent - ay) / 100 * h / k * 100) / 100 - startOffsets[key][1];
    moving.forEach(kk => { room[`${kk}X`] = startOffsets[kk][0] + dx; room[`${kk}Y`] = startOffsets[kk][1] + dy; });
    renderRoomLabels();
    if (key !== 'labelCard' && !room.labelLinked) keepApart(room, key, node.dataset.labelPart);
    if (isIconRoom(room) && key === 'labelCard' && room.labelLinked && dashGrid().on) { const box = cardBoxPct(room); if (box) renderDashGrid(dashTarget(box, room.dash && dashSpan(room) ? room.dash : null)); }
    // "Granice tła": the label (the whole group, or the one part being moved) stays inside the background.
    if (keepInBounds()) {
      const id = CSS.escape(room.id), held = room.labelLinked || key === 'labelCard' ? $(`.room-label-card[data-room-id="${id}"]`) : $(`.room-label-part[data-room-id="${id}"][data-label-part="${node.dataset.labelPart}"]`);
      const fix = held && boundsShift(held);
      if (fix) { moving.forEach(kk => { room[`${kk}X`] = Math.round(((Number(room[`${kk}X`]) || 0) + fix.x / 100 * w / k) * 100) / 100; room[`${kk}Y`] = Math.round(((Number(room[`${kk}Y`]) || 0) + fix.y / 100 * h / k) * 100) / 100; }); renderRoomLabels(); }
    }
  };
  const move = e => { if (e.pointerId !== event.pointerId) return; if (!moved && Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY) < 4) return; moved = true; place(e); camera.track(e); };
  const up = e => {
    if (e.pointerId !== event.pointerId) return; alive = false; camera.stop(); clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; showAlignGuides([], []); hideGroupGrid();
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    // The scene holds the finger, so the following click would land on the scene and select the room under the
    // label (e.g. the room an icon stands in); the label was already selected on press, so the click is dropped.
    const swallow = c => { c.stopPropagation(); c.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 250);
    // A tap (no move) always brings the room / icon into view, also when it was already selected.
    if (!moved) {
      if (newlySelected) { skipRoomFocus = true; try { openRoomEditor(room.id); } finally { skipRoomFocus = false; } }
      requestAnimationFrame(() => requestAnimationFrame(() => focusSceneBoxOnMobile(focusBox()))); return;
    }
    let [fx, fy] = partPct(key);
    // An icon has no shape: a moved group becomes its new position, so later centring, guides and copies use it.
    if (isIconRoom(room) && key === 'labelCard') {
      // On the dashboard grid the group snaps to whole cells (keeping its size in cells once pinned).
      const box = dashGrid().on && room.labelLinked ? cardBoxPct(room) : null;
      if (box) { const keep = room.dash; room.dash = dashTarget(box, keep && dashSpan(room) ? keep : null); const span = dashSpan(room); room.x = Math.round((span.x + span.w / 2) * 100) / 100; room.y = Math.round((span.y + span.h / 2) * 100) / 100; room.labelCardX = 0; room.labelCardY = 0; }
      else { room.x = Math.round(clamp(fx, 0, 100) * 100) / 100; room.y = Math.round(clamp(fy, 0, 100) * 100) / 100; room.labelCardX = 0; room.labelCardY = 0; }
      [fx, fy] = [room.x, room.y]; renderDashGrid(); renderRoomLabels();
    }
    room.updatedAt = new Date().toISOString(); scheduleSave(true);
    if (selectedRoomId === room.id) openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); else renderRooms();
    centerAfterDrag(fx, fy);
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  activeLabelDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, cancel() {
    activeLabelDrag = null; alive = false; camera.stop(); clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; showAlignGuides([], []); hideGroupGrid();
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    try { els.scene.releasePointerCapture(event.pointerId); } catch {}
    Object.entries(before).forEach(([kk, v]) => { if (v === undefined) delete room[kk]; else room[kk] = v; }); renderRoomLabels();
  } };
  const clearActive = e => { if (e.pointerId !== event.pointerId) return; if (activeLabelDrag?.id === event.pointerId) activeLabelDrag = null; window.removeEventListener('pointerup', clearActive, true); window.removeEventListener('pointercancel', clearActive, true); };
  window.addEventListener('pointerup', clearActive, true); window.addEventListener('pointercancel', clearActive, true);
}
function renderRooms() {
  syncRoomIconStates();
  const layer = $('#rooms'); if (!layer) return;
  // A room being moved shows only its outline and label (no light / state effect), so nothing flickers while it
  // is rebuilt on every step; the effect fades back in when the room is dropped.
  const view = activeSceneView(), rooms = Object.values(roomsOf(view)).filter(room => (room.points || []).length >= 3 && room.id !== movingRoomId);
  const width = els.scene.offsetWidth || 1, height = els.scene.offsetHeight || 1, kept = new Set();
  const backdrop = sceneBackdrop();
  rooms.forEach(room => {
    const preview = editMode && room.id === selectedRoomId ? roomPreviewOn : '', built = roomLayerMarkup(room, 'room', width, height, preview);
    roomGlowApply(room, built, width, height, room.id, undefined, backdrop);

    let node = layer.querySelector(`.room-layer[data-room-id="${CSS.escape(room.id)}"]`);
    // Unchanged geometry keeps its node, so switching the light on/off fades (CSS transition on opacity).
    const glowNode = node?.matches('img.room-glow') ? node : null, glowReady = built.signature.startsWith('img|');
    // A glow image already shown stays (same element, same GPU layer) while its new bitmap is drawn, then only its
    // picture / box changes: replacing the element (image -> live SVG -> image) rebuilt the plan's layers each switch.
    if (glowNode && !glowReady && node.dataset.signature !== built.signature && built.feather >= 2 && ROOM_GLOW_PENDING.has(room.id) && !(editMode && room.id === selectedRoomId)) { node.style.opacity = built.opacity.toFixed(3); kept.add(room.id); return; }
    if (glowNode && glowReady && node.dataset.signature !== built.signature) {
      const fresh = Object.assign(document.createElement('div'), { innerHTML: built.html }).firstElementChild;
      if (fresh && fresh.className === node.className) { node.src = fresh.src; node.style.cssText = fresh.style.cssText; node.dataset.signature = built.signature; kept.add(room.id); return; }
    }
    if (node && node.dataset.signature === built.signature) { node.style.opacity = built.opacity.toFixed(3); const fill = node.querySelector('.room-fill'); if (fill) fill.setAttribute('fill', built.color); node.querySelectorAll('.room-stop').forEach(stop => stop.setAttribute('stop-color', built.color)); }
    else { const holder = document.createElement('div'); holder.innerHTML = built.html; const fresh = holder.firstElementChild; fresh.dataset.signature = built.signature; if (node) node.replaceWith(fresh); else layer.append(fresh); node = fresh; }
    kept.add(room.id);
  });
  $$('.room-layer', layer).forEach(node => { if (!kept.has(node.dataset.roomId)) node.remove(); });
  // Outlines go above all the lights; rebuilt only when their markup changes.
  const outlines = Object.values(roomsOf(view)).map(room => roomOutlineMarkup(room, editMode && room.id === selectedRoomId ? roomPreviewOn : '')).join('');
  let outlineBox = layer.querySelector('.room-outlines'); if (!outlineBox) { outlineBox = document.createElement('div'); outlineBox.className = 'room-outlines'; }
  if (outlineBox.__html !== outlines) { outlineBox.innerHTML = outlines; outlineBox.__html = outlines; }
  if (layer.lastElementChild !== outlineBox) layer.append(outlineBox);
  renderRoomLabels(view);
  if (els.addedList && $('#view-integrations')?.classList.contains('active')) renderAdded();
  renderRoomEditLayer();
}
// Outlines, vertex handles and the drawing preview (edit mode only), above the markers.
function roomAngleMarks(points, closed) {
  const w = els.scene.offsetWidth || 1, h = els.scene.offsetHeight || 1, n = points.length, zoom = sceneCameraActive() ? viewZoom : 1;
  if (n < 3) return { svg:'', html:'' };
  const px = points.map(([x, y]) => [x / 100 * w, y / 100 * h]), pct = ([x, y]) => `${(x / w * 100).toFixed(3)},${(y / h * 100).toFixed(3)}`;
  let svg = '', html = '';
  for (let i = 0; i < n; i++) {
    if (!closed && (i === 0 || i === n - 1)) continue;
    const c = px[i], a = px[(i - 1 + n) % n], b = px[(i + 1) % n];
    const ua = [a[0] - c[0], a[1] - c[1]], ub = [b[0] - c[0], b[1] - c[1]], la = Math.hypot(...ua), lb = Math.hypot(...ub);
    if (la < 2 || lb < 2) continue;
    const da = [ua[0] / la, ua[1] / la], db = [ub[0] / lb, ub[1] / lb], angle = Math.acos(clamp(da[0] * db[0] + da[1] * db[1], -1, 1)) * 180 / Math.PI;
    const kind = Math.abs(angle - 90) <= 1.5 ? 90 : Math.abs(angle - 45) <= 1.5 ? 45 : Math.abs(angle - 135) <= 1.5 ? 135 : 0; if (!kind) continue;
    const size = Math.min(22 / zoom, la * .4, lb * .4), at = (d, k) => [c[0] + d[0] * k, c[1] + d[1] * k];
    if (kind === 90) svg += `<polyline class="room-angle right" points="${pct(at(da, size))} ${pct([c[0] + (da[0] + db[0]) * size, c[1] + (da[1] + db[1]) * size])} ${pct(at(db, size))}"/>`;
    else {
      const r = size * 1.3, start = Math.atan2(da[1], da[0]); let sweep = Math.atan2(db[1], db[0]) - start;
      while (sweep > Math.PI) sweep -= 2 * Math.PI; while (sweep < -Math.PI) sweep += 2 * Math.PI;
      svg += `<polyline class="room-angle" points="${Array.from({ length: 9 }, (_, k) => pct([c[0] + Math.cos(start + sweep * k / 8) * r, c[1] + Math.sin(start + sweep * k / 8) * r])).join(' ')}"/>`;
      const mid = start + sweep / 2, label = [c[0] + Math.cos(mid) * r * 1.9, c[1] + Math.sin(mid) * r * 1.9];
      html += `<span class="room-angle-label" style="left:${label[0] / w * 100}%;top:${label[1] / h * 100}%">${kind}°</span>`;
    }
  }
  return { svg, html };
}
function renderRoomEditLayer() {
  const layer = $('#room-edit-layer'); if (!layer) return;
  if (!editMode) { layer.innerHTML = ''; return; }
  const rooms = Object.values(roomsOf()).filter(room => (room.points || []).length >= 3);
  let svg = rooms.map(room => `<polygon class="room-outline${room.id === selectedRoomId ? ' selected' : ''}" points="${roomPointsAttr(room.points)}"/>`).join('');
  if (roomDraft?.points.length) {
    const pts = roomDraft.cursor ? [...roomDraft.points, roomDraft.cursor] : roomDraft.points;
    svg += `<polyline class="room-draft" points="${roomPointsAttr(pts)}"/>`;
  }
  let handles = '';
  const room = selectedRoomId && roomsOf()[selectedRoomId];
  if (room && !roomDraft && !room.geometryLocked) {
    const pts = room.points || [];
    const picked = pickedCorner();
    handles += pts.map(([x, y], index) => `<i class="room-handle${index === picked ? ' picked' : ''}" data-room-point="${index}" style="left:${x}%;top:${y}%"></i>`).join('');
    handles += pts.map(([x, y], index) => { const [nx, ny] = pts[(index + 1) % pts.length]; return `<i class="room-handle mid" data-room-mid="${index}" style="left:${(x + nx) / 2}%;top:${(y + ny) / 2}%"></i>`; }).join('');
  }
  if (roomDraft) handles += roomDraft.points.map(([x, y], index) => `<i class="room-handle draft${index === 0 && roomDraft.points.length >= 3 ? ' closable' : ''}" style="left:${x}%;top:${y}%"></i>`).join('');
  // Right angles and 45° / 135° corners are marked: of the selected room, and of the room being drawn.
  const angleShapes = room && !roomDraft ? roomAngleMarks(room.points || [], true) : roomDraft ? roomAngleMarks(roomDraft.cursor ? [...roomDraft.points, roomDraft.cursor] : roomDraft.points, false) : { svg:'', html:'' };
  layer.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${svg}${angleShapes.svg}</svg>${angleShapes.html}${handles}`;
}
function scenePercentAt(event) {
  const r = els.scene.getBoundingClientRect();
  return [clamp((event.clientX - r.left) / Math.max(1, r.width) * 100, 0, 100), clamp((event.clientY - r.top) / Math.max(1, r.height) * 100, 0, 100)];
}
// Snaps a point to the corners/axes of the room outlines (walls line up), otherwise to the grid.
function snapRoomPoint([x, y], skip = null, event = null) {
  if (event?.altKey) return [x, y];
  const r = els.scene.getBoundingClientRect(), tx = 7 / Math.max(1, r.width) * 100, ty = 7 / Math.max(1, r.height) * 100;
  const others = [];
  Object.values(roomsOf()).forEach(room => (room.points || []).forEach((p, index) => { if (!(skip && skip.roomId === room.id && skip.index === index)) others.push(p); }));
  (roomDraft?.points || []).forEach(p => others.push(p));
  let bx = null, by = null, gx = null, gy = null;
  others.forEach(([ox, oy]) => { if (Math.abs(ox - x) <= tx && (bx === null || Math.abs(ox - x) < Math.abs(bx - x))) { bx = ox; gx = { room:true }; } if (Math.abs(oy - y) <= ty && (by === null || Math.abs(oy - y) < Math.abs(by - y))) { by = oy; gy = { room:true }; } });
  // Corners also line up with markers, Flows and the background (same targets as dragging an element).
  if (snapTargets().guides) {
    const g = guideTargets({ roomId: skip?.roomId || '__draft' });
    g.xs.forEach(c => { const v = c.v / Math.max(1, r.width) * 100; if (Math.abs(v - x) <= tx && (bx === null || Math.abs(v - x) < Math.abs(bx - x) - .01)) { bx = v; gx = c; } });
    g.ys.forEach(c => { const v = c.v / Math.max(1, r.height) * 100; if (Math.abs(v - y) <= ty && (by === null || Math.abs(v - y) < Math.abs(by - y) - .01)) { by = v; gy = c; } });
    showAlignGuides(bx !== null ? [{ at: bx, room: gx.room, bg: gx.bg, kind: gx.kind || (gx.room ? 'room' : '') }] : [], by !== null ? [{ at: by, room: gy.room, bg: gy.bg, kind: gy.kind || (gy.room ? 'room' : '') }] : []);
  }
  return [bx ?? snapPercent(x), by ?? snapPercent(y)];
}
function pointInPolygon([x, y], points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi) inside = !inside;
  }
  return inside;
}
function roomAt(point) { return Object.values(roomsOf()).reverse().find(room => (room.points || []).length >= 3 && pointInPolygon(point, room.points)); }
// ---- Drawing a new room
function startRoomDrawing() {
  if (!editMode) return;
  closeCompactMenus(); closeEditor(); closeFlowEditor(); closeRoomEditor();
  roomDraft = { points: [], cursor: null }; els.body.classList.add('room-drawing'); $('#room-draw-bar')?.classList.add('visible'); placeRoomDrawBar(false);
  updateRoomDrawBar(); renderRoomEditLayer();
}
function updateRoomDrawBar() {
  const count = roomDraft?.points.length || 0, text = $('#room-draw-text');
  if (text) text.textContent = translateValue(count < 3 ? 'Klikaj kolejne narożniki pomieszczenia' : 'Kliknij pierwszy punkt albo „Gotowe”, aby zamknąć kształt');
  const done = $('#room-draw-done'), undo = $('#room-draw-undo'); if (done) done.disabled = count < 3; if (undo) undo.disabled = !count;
}
function cancelRoomDrawing() { showAlignGuides([], []); roomDraft = null; els.body.classList.remove('room-drawing'); $('#room-draw-bar')?.classList.remove('visible'); renderRoomEditLayer(); }
function finishRoomDrawing() {
  if (!roomDraft || roomDraft.points.length < 3) return;
  const view = activeSceneView(); if (!view) return cancelRoomDrawing();
  view.rooms ||= {};
  const id = 'room_' + uid(), now = new Date().toISOString(), count = Object.values(view.rooms).filter(room => !isIconRoom(room)).length + 1;
  view.rooms[id] = { ...clone(ROOM_DEFAULTS), ...NEW_ROOM_LABEL, id, name: roomDraft.name || `${translateValue('Pomieszczenie')} ${count}`, entityIds: [...(roomDraft.entityIds || [])], points: roomDraft.points.map(p => p.map(v => Math.round(v * 1000) / 1000)), createdAt: now, updatedAt: now };
  const withEntities = view.rooms[id].entityIds.length > 0; cancelRoomDrawing(); renderRooms(); fitRoomLabel(id); scheduleSave(true); if (withEntities) refreshStates();
  openRoomWizard(id);
}
// After drawing, a small two-step popup asks for the name (empty = the generated one) and the entities that
// light the room. Both steps can be skipped; closing it opens the room panel on its Room section.
let roomWizard = null;
// Parts an icon can show; the icon wizard asks for them in its last step.
const WIZARD_PARTS = [['labelIcon','Ikona','mdi-lightbulb-outline'],['labelName','Nazwa','mdi-format-text'],['labelState','Stan','mdi-toggle-switch-outline']];
// A thermostat asks for its own parts (− and + are one tile).
const THERMO_WIZARD_PARTS = [['labelName','Nazwa','mdi-format-text'],['labelDial','Tarcza','mdi-gauge'],['labelTarget','Temperatura ustawiona','mdi-thermometer-lines'],['labelCurrent','Temperatura aktualna','mdi-thermometer'],['labelAction','Stan pracy','mdi-fire'],['labelMinus','Przyciski − / +','mdi-plus-minus-variant',['labelPlus']],['labelModes','Tryby','mdi-power-settings'],['labelState','Tryb (stan)','mdi-thermostat'],['labelIcon','Ikona','mdi-radiator']];
function wizardPartsFor(room) { return isThermoRoom(room) ? THERMO_WIZARD_PARTS : WIZARD_PARTS; }
function wizardSteps() { const room = roomsOf()[roomWizard?.id]; if (isTextRoom(room)) return ['name','action','parts']; const steps = isIconRoom(room) ? ['name','entities','parts'] : ['name','entities']; return roomWizard?.skipEntities ? steps.filter(step => step !== 'entities') : steps; }
function showWizardPin(room) {
  $('#wizard-pin')?.remove(); if (!room || !isIconRoom(room)) return;
  const pin = document.createElement('div'); pin.id = 'wizard-pin'; pin.className = 'wizard-pin';
  const [x, y] = roomAnchor(room); pin.style.left = `${x}%`; pin.style.top = `${y}%`; pin.innerHTML = '<i class="mdi mdi-map-marker"></i>';
  els.scene.append(pin);
}
function openRoomWizard(id, { skipEntities = false } = {}) {
  const room = roomsOf()[id], box = $('#room-wizard'); if (!room || !box) return openRoomEditor(id, -1, 0);
  roomWizard = { id, step:'name', generated: room.name, query:'', picked: new Set(room.entityIds || []), parts: new Set(isThermoRoom(room) ? THERMO_WIZARD_PARTS.map(([key]) => key).filter(key => room[key]) : WIZARD_PARTS.map(([key]) => key).filter(key => !(isTextRoom(room) && key === 'labelState'))), skipEntities };
  // On a phone it sits under the top bar so the on-screen keyboard cannot cover it.
  box.style.top = mobileView() ? `${Math.round(($('.topbar')?.getBoundingClientRect().bottom || 0) + 8)}px` : '';
  box.classList.add('visible'); box.setAttribute('aria-hidden', 'false'); renderRoomWizard();
  showWizardPin(room);
  requestAnimationFrame(() => requestAnimationFrame(focusWizardTarget));
  loadEntityCatalog().then(() => { if (roomWizard?.step === 'entities') renderRoomWizard('list'); });
}
function closeRoomWizard() {
  const box = $('#room-wizard'); if (!roomWizard || !box) return;
  const { id, picked, parts, generated: roomWizard_generated } = roomWizard, room = roomsOf()[id]; roomWizard = null;
  box.classList.remove('visible'); box.setAttribute('aria-hidden', 'true'); showWizardPin(null);
  if (!room) return;
  const before = (room.entityIds || []).join('|'); room.entityIds = [...picked];
  // An icon left without a typed name takes the name of its first entity.
  if (isIconRoom(room) && !isThermoRoom(room) && room.name === roomWizard_generated && room.entityIds.length) room.name = (entityCatalog?.entities || []).find(entity => entity.entity_id === room.entityIds[0])?.name || roomEntityName(room.entityIds[0]);
  // An icon is generated only now, with the parts chosen in the last step.
  if (isIconRoom(room)) { wizardPartsFor(room).forEach(([key, , , also = []]) => { [key, ...also].forEach(k => { room[k] = parts.has(key); }); }); delete room.draft; }
  if (room.entityIds.join('|') !== before) { room.updatedAt = new Date().toISOString(); refreshStates(); }
  renderRooms(); fitRoomLabel(id); scheduleSave(true);
  // With entities picked there is nothing left to do in the Room section, so the panel opens collapsed.
  openRoomEditor(id, -1, room.entityIds.length ? -1 : 0);
  notify(isThermoRoom(room) ? 'Dodano termostat' : isTextRoom(room) ? 'Dodano tekst' : isIconRoom(room) ? 'Dodano etykietę' : room.entityIds.length ? 'Dodano pomieszczenie' : 'Dodano pomieszczenie — encje możesz dodać w panelu');
}
function roomWizardName() {
  const input = $('#room-wizard-name'), room = roomsOf()[roomWizard?.id]; if (!room || !input) return;
  const name = input.value.trim(); room.name = name || roomWizard.generated; room.updatedAt = new Date().toISOString(); renderRooms();
}
function roomWizardMatches() {
  const all = (entityCatalog?.entities || []).filter(entity => entity.entity_id), room = roomsOf()[roomWizard.id], query = searchText(roomWizard.query);
  const area = searchText(room?.name), useful = entity => /^(light|switch|input_boolean|fan|binary_sensor|cover|climate|media_player|lock|vacuum)\./.test(entity.entity_id);
  const suggested = () => all.filter(entity => area && searchText(entity.area) === area || useful(entity));
  let list = query.length >= 2 ? all.filter(entity => looseMatch([entity.entity_id, entity.name, entity.area].join(' '), query)) : suggested();
  // A name carried over from the first step that matches nothing still shows the usual suggestions.
  if (!list.length && query.length >= 2 && roomWizard.queryFromName) list = suggested();
  return list.sort((a, b) => Number(searchText(b.area) === area) - Number(searchText(a.area) === area) || roomEntityRank(a.entity_id) - roomEntityRank(b.entity_id) || String(a.name || a.entity_id).localeCompare(String(b.name || b.entity_id))).slice(0, 30);
}
// The entity list takes only the room left above the on-screen keyboard (its buttons always stay visible); with the
// keyboard open the step's description is hidden so the popup is lower.
function fitWizardList() {
  const box = $('#room-wizard'), list = $('#room-wizard-list'), foot = $('.room-wizard-foot'); if (!roomWizard || !box || !list) return;
  box.classList.toggle('kb-open', keyboardOpen());
  if (roomWizard.step !== 'entities') return;
  const screenBottom = window.visualViewport ? window.visualViewport.offsetTop + window.visualViewport.height : innerHeight;
  const space = screenBottom - list.getBoundingClientRect().top - (foot?.offsetHeight || 44) - 26;
  list.style.maxHeight = `${Math.round(clamp(space, 84, 200))}px`;
}
function renderRoomWizardButton() {
  const button = $('#room-wizard-next'), w = roomWizard; if (!button || !w) return;
  const steps = wizardSteps(), last = steps.indexOf(w.step) === steps.length - 1;
  button.disabled = w.step === 'parts' && !w.parts.size;
  button.innerHTML = !last ? `<span>${escapeHtml(translateValue('Dalej'))}</span><i class="mdi mdi-arrow-right"></i>`
    : `<i class="mdi mdi-check"></i><span>${escapeHtml(translateValue(isThermoRoom(roomsOf()[w.id]) ? 'Utwórz termostat' : isTextRoom(roomsOf()[w.id]) ? 'Utwórz tekst' : isIconRoom(roomsOf()[w.id]) ? 'Utwórz etykietę' : 'Gotowe'))}${w.step === 'entities' && w.picked.size ? ` (${w.picked.size})` : ''}</span>`;
}
function renderRoomWizard(part = 'all') {
  const box = $('#room-wizard'); if (!roomWizard || !box) return;
  const w = roomWizard, room = roomsOf()[w.id], steps = wizardSteps();
  if (part === 'all') {
    box.dataset.step = w.step;
    $('#room-wizard-step', box).textContent = `${steps.indexOf(w.step) + 1} / ${steps.length}`;
    const icon = isIconRoom(room), text = isTextRoom(room);
    $('#room-wizard-title', box).textContent = translateValue(w.step === 'name' ? (isThermoRoom(room) ? 'Nazwa termostatu' : text ? 'Tekst' : icon ? 'Nazwa etykiety' : 'Nazwa pomieszczenia') : w.step === 'parts' ? 'Co ma być widać?' : w.step === 'action' ? 'Akcja po dotknięciu' : (icon ? 'Encja etykiety' : 'Encja pomieszczenia'));
    if (w.step === 'action') renderWizardAction(room);
    $('.room-wizard-entity-step > small', box).textContent = translateValue(icon ? 'Wybierz encję, od której zależy stan etykiety — światło, włącznik, czujnik…' : 'Wybierz encję, od której zależy stan pomieszczenia — światło, włącznik, czujnik…');
    const name = $('#room-wizard-name', box); name.placeholder = w.generated;
    if (w.step === 'name') { name.value = room?.name === w.generated ? '' : room?.name || ''; setTimeout(() => name.focus(), 60); }
    else if (w.step === 'entities') { const search = $('#room-wizard-search', box); search.value = w.query; if (!mobileView()) setTimeout(() => search.focus(), 60); }
    // Name → entities: the search field takes the focus right away (in the same tap / Enter), so the on-screen
    // keyboard stays open between the two steps instead of closing and opening again.
    if (w.step === 'entities' && document.activeElement?.id === 'room-wizard-name') $('#room-wizard-search', box).focus();
    $('#room-wizard-parts', box).innerHTML = wizardPartsFor(room).map(([key, label, mdi]) => [key, text && key === 'labelState' ? 'Podpis' : label, mdi]).map(([key, label, mdi]) => `<button type="button" class="room-wizard-part${w.parts.has(key) ? ' on' : ''}" data-wizard-part="${key}" aria-pressed="${w.parts.has(key)}"><i class="mdi ${mdi}"></i><span>${escapeHtml(translateValue(label))}</span><i class="mdi ${w.parts.has(key) ? 'mdi-check-circle' : 'mdi-circle-outline'} room-wizard-part-check"></i></button>`).join('');
    renderRoomWizardButton();
  }
  if (w.step !== 'entities') return;
  $('#room-wizard-picked', box).innerHTML = [...w.picked].map(id => `<button type="button" class="room-wizard-chip" data-wizard-toggle="${escapeHtml(id)}" data-no-i18n>${escapeHtml((entityCatalog?.entities || []).find(entity => entity.entity_id === id)?.name || roomEntityName(id))}<i class="mdi mdi-close"></i></button>`).join('');
  const rows = entityCatalog ? roomWizardMatches() : null;
  $('#room-wizard-list', box).innerHTML = !rows ? `<div class="room-wizard-empty">${escapeHtml(translateValue('Wczytywanie encji…'))}</div>`
    : rows.length ? rows.map(entity => { const on = w.picked.has(entity.entity_id), value = `${entity.state ?? ''}${entity.unit ? ` ${entity.unit}` : ''}`;
      return `<button type="button" class="room-wizard-row${on ? ' on' : ''}" data-wizard-toggle="${escapeHtml(entity.entity_id)}"><i class="mdi ${on ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}"></i><i class="mdi ${addEntityIcon(entity)} room-wizard-icon"></i><span><b data-no-i18n>${escapeHtml(entity.name || entity.entity_id)}</b><small data-no-i18n>${escapeHtml(entity.entity_id)}${entity.area ? ` · ${escapeHtml(entity.area)}` : ''}</small></span><em data-no-i18n>${escapeHtml(value)}</em></button>`; }).join('')
    : `<div class="room-wizard-empty">${escapeHtml(translateValue(w.query.trim().length >= 2 ? 'Brak pasujących encji.' : 'Wpisz nazwę, obszar albo entity_id.'))}</div>`;
  fitWizardList();
}
// Step "Akcja" of a text: what a tap does in view and where it goes (the same choices as in its panel).
function renderWizardAction(room) {
  const box = $('#room-wizard-action'); if (!box || !room) return;
  const action = LINK_ACTIONS.some(([v]) => v === room.linkAction) ? room.linkAction : 'none', esc = v => escapeHtml(String(v ?? ''));
  const field = action === 'view' ? `<label class="room-wizard-field"><span>${esc(translateValue('Widok'))}</span><select data-wizard-link="linkView"><option value="">—</option>${model.viewOrder.filter(id => model.views[id]).map(id => `<option value="${esc(id)}"${room.linkView === id ? ' selected' : ''}>${esc(model.views[id].name || id)}</option>`).join('')}</select></label>`
    : action === 'ha' ? `<label class="room-wizard-field"><span>${esc(translateValue('Adres w HA'))}</span><input type="text" data-wizard-link="linkPath" value="${esc(room.linkPath)}" placeholder="/lovelace/0" autocomplete="off" spellcheck="false"></label>`
    : action === 'url' ? `<label class="room-wizard-field"><span>${esc(translateValue('Link'))}</span><input type="text" data-wizard-link="linkUrl" value="${esc(room.linkUrl)}" placeholder="https://" autocomplete="off" spellcheck="false"></label><label class="room-wizard-check"><input type="checkbox" data-wizard-link="linkNewTab"${room.linkNewTab !== false ? ' checked' : ''}><span>${esc(translateValue('W nowej karcie'))}</span></label>` : '';
  box.innerHTML = `<div class="room-wizard-actions">${LINK_ACTIONS.map(([v, t]) => `<button type="button" class="room-wizard-action${v === action ? ' on' : ''}" data-wizard-action="${v}"><i class="mdi ${({ none:'mdi-cancel', view:'mdi-view-carousel-outline', ha:'mdi-home-assistant', url:'mdi-link-variant' })[v]}"></i><span>${esc(translateValue(t))}</span></button>`).join('')}</div>${field}`;
}
function roomWizardNext() {
  if (!roomWizard) return;
  const steps = wizardSteps(), next = steps[steps.indexOf(roomWizard.step) + 1];
  if (roomWizard.step === 'name') {
    roomWizardName();
    // The typed name goes on into the entity search (editable there), so the list right away offers entities that
    // belong to it; a search the user typed himself is kept.
    const typed = $('#room-wizard-name')?.value.trim();
    if (next === 'entities' && typed && (!roomWizard.query || roomWizard.queryFromName)) { roomWizard.query = typed; roomWizard.queryFromName = true; }
  }
  if (roomWizard.step === 'parts' && !roomWizard.parts.size) return;
  if (next) { roomWizard.step = next; renderRoomWizard(); return requestAnimationFrame(focusWizardTarget); }
  closeRoomWizard();
}
function onRoomWizardClick(event) {
  if (!roomWizard) return;
  const actionButton = event.target.closest('[data-wizard-action]');
  if (actionButton) { const room = roomsOf()[roomWizard.id]; if (room) { room.linkAction = actionButton.dataset.wizardAction; renderWizardAction(room); } return; }
  const toggle = event.target.closest('[data-wizard-toggle]');
  if (toggle) {
    const id = toggle.dataset.wizardToggle, single = true; // a label / room has one entity: picking it moves on
    if (roomWizard.picked.has(id)) roomWizard.picked.delete(id); else { if (single) roomWizard.picked.clear(); roomWizard.picked.add(id); }
    // A label takes one entity: picking it moves straight on to the next step.
    if (single && roomWizard.picked.size) { if (document.activeElement?.blur) document.activeElement.blur(); return roomWizardNext(); }
    renderRoomWizard('list'); return renderRoomWizardButton();
  }
  const partButton = event.target.closest('[data-wizard-part]');
  if (partButton) { const key = partButton.dataset.wizardPart; if (roomWizard.parts.has(key)) roomWizard.parts.delete(key); else roomWizard.parts.add(key); return renderRoomWizard(); }
  if (event.target.closest('#room-wizard-next')) return roomWizardNext();
  if (event.target.closest('[data-wizard-skip]')) {
    if (roomWizard.step === 'name') { const input = $('#room-wizard-name'); if (input) input.value = ''; return roomWizardNext(); }
    // Skipping entities keeps none; skipping the parts keeps all three.
    if (roomWizard.step === 'entities') roomWizard.picked = new Set(roomsOf()[roomWizard.id]?.entityIds || []);
    if (roomWizard.step === 'parts') { const wr = roomsOf()[roomWizard.id]; roomWizard.parts = new Set(isThermoRoom(wr) ? THERMO_WIZARD_PARTS.map(([key]) => key).filter(key => wr[key]) : WIZARD_PARTS.map(([key]) => key).filter(key => !(isTextRoom(wr) && key === 'labelState'))); }
    const steps = wizardSteps(), next = steps[steps.indexOf(roomWizard.step) + 1];
    if (next) { roomWizard.step = next; renderRoomWizard(); return requestAnimationFrame(focusWizardTarget); }
    return closeRoomWizard();
  }
}
function onRoomDrawClick(event) {
  if (!roomDraft) return;
  event.preventDefault(); event.stopPropagation();
  const r = els.scene.getBoundingClientRect(), point = snapRoomPoint(scenePercentAt(event), null, event), first = roomDraft.points[0];
  if (first && roomDraft.points.length >= 3 && Math.hypot((first[0] - point[0]) / 100 * r.width, (first[1] - point[1]) / 100 * r.height) <= 14) return finishRoomDrawing();
  roomDraft.points.push(point); roomDraft.cursor = null; if (event.pointerType !== 'mouse') showAlignGuides([], []); updateRoomDrawBar(); renderRoomEditLayer(); avoidRoomDrawBar(event.clientY);
}
// The drawing bar keeps out of the way: it sits at the bottom, jumps under the top bar when corners are placed
// in the lower part of the screen (and back), and a tap on its free area moves it to the other edge.
function placeRoomDrawBar(atTop) {
  const bar = $('#room-draw-bar'); if (!bar) return;
  bar.classList.toggle('top', atTop);
  bar.style.top = atTop ? `${Math.round(($('.topbar')?.getBoundingClientRect().bottom || 0) + 8)}px` : '';
}
function avoidRoomDrawBar(clientY) {
  const bar = $('#room-draw-bar'); if (!bar?.classList.contains('visible')) return;
  const atTop = bar.classList.contains('top'), h = window.innerHeight;
  if (!atTop && clientY > h * .55) placeRoomDrawBar(true); else if (atTop && clientY < h * .45) placeRoomDrawBar(false);
}
function onRoomDrawMove(event) {
  if (roomDraft && event.pointerType === 'mouse') avoidRoomDrawBar(event.clientY);
  if (!roomDraft?.points.length || event.pointerType !== 'mouse') return;
  roomDraft.cursor = snapRoomPoint(scenePercentAt(event), null, event); renderRoomEditLayer();
}
// ---- Editing the shape (vertex drag, insert on an edge midpoint, double-click removes, drag inside moves)
function startRoomHandleDrag(event) {
  const handle = event.target.closest('.room-handle'); if (!handle || !editMode || !selectedRoomId || roomDraft) return;
  const room = roomsOf()[selectedRoomId]; if (!room) return;
  event.preventDefault(); event.stopPropagation(); handleTapAt = performance.now();
  if (event.button === 2) {
    // The corner is gone before the browser opens its context menu, so block that menu wherever it lands.
    const noMenu = e => e.preventDefault(); window.addEventListener('contextmenu', noMenu, { capture:true, once:true }); setTimeout(() => window.removeEventListener('contextmenu', noMenu, true), 1000);
    if (handle.dataset.roomPoint !== undefined) removeRoomCorner(Number(handle.dataset.roomPoint)); return;
  }
  if (event.button > 0) return;
  // The handle is redrawn on every move; the finger is captured by the scene, which stays, so the drag never stalls.
  try { els.scene.setPointerCapture(event.pointerId); } catch {}
  // The click that follows the tap must not reach the scene (the handle may already be redrawn or removed, and a
  // click on the plan there would deselect the room).
  const swallowClick = e => { e.stopPropagation(); e.preventDefault(); };
  window.addEventListener('click', swallowClick, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallowClick, true), 700);
  let index = Number(handle.dataset.roomPoint);
  if (handle.dataset.roomMid !== undefined) { const at = Number(handle.dataset.roomMid), [x, y] = room.points[at], [nx, ny] = room.points[(at + 1) % room.points.length]; room.points.splice(at + 1, 0, [(x + nx) / 2, (y + ny) / 2]); index = at + 1; renderRoomEditLayer(); }
  let moved = false;
  const move = e => { if (e.pointerId !== event.pointerId) return; moved = true; room.points[index] = snapRoomPoint(scenePercentAt(e), { roomId: room.id, index }, e); renderRooms(); };
  const up = e => { if (e.pointerId !== event.pointerId) return; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); showAlignGuides([], []);
    if (!moved && handle.dataset.roomMid === undefined) {
      const t = performance.now();
      if (lastCornerTap && lastCornerTap.roomId === room.id && lastCornerTap.index === index && t - lastCornerTap.t < 450) { lastCornerTap = null; removeRoomCorner(index); }
      else { lastCornerTap = { roomId: room.id, index, t }; selectedCorner = { roomId: room.id, index }; renderRoomEditLayer(); }
      return;
    } selectedCorner = { roomId: room.id, index }; room.points = room.points.map(p => p.map(v => Math.round(v * 1000) / 1000)); room.updatedAt = new Date().toISOString(); scheduleSave(true); renderRooms(); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
}
function removeRoomCorner(index) {
  const room = selectedRoomId && roomsOf()[selectedRoomId]; if (!room || !editMode || !Number.isInteger(index)) return;
  if (room.points.length <= 3) return notify('Pomieszczenie musi mieć co najmniej 3 narożniki');
  room.points.splice(index, 1); room.updatedAt = new Date().toISOString(); selectedCorner = null; renderRooms(); scheduleSave(true);
}
// Removing a corner: click/tap it to select it, then the × next to it or Delete / Backspace; right-click removes it
// at once; a quick double click / double tap also works. (A handle holds the pointer through the scene for smooth
// dragging, so the browser's own dblclick never reaches it — the double click is detected here.)
let lastCornerTap = null, selectedCorner = null, handleTapAt = 0;
function pickedCorner() { const room = selectedRoomId && roomsOf()[selectedRoomId]; return room && selectedCorner?.roomId === room.id && selectedCorner.index < (room.points || []).length ? selectedCorner.index : -1; }
function startRoomMove(event, held = false) {
  if (!editMode || roomDraft || event.button > 0 || !selectedRoomId || (event.target !== els.markers && event.target !== els.scene && event.target !== els.image)) return false;
  const room = roomsOf()[selectedRoomId], start = scenePercentAt(event); if (!room || room.geometryLocked || !pointInPolygon(start, room.points)) return false;
  // Touch: the selected room moves only after the finger rests ~0.35 s on it (short buzz); a quick drag pans the plan.
  if (!held && event.pointerType && event.pointerType !== 'mouse') {
    const id = event.pointerId, sx = event.clientX, sy = event.clientY; let last = event;
    const cancel = () => { clearTimeout(timer); window.removeEventListener('pointermove', track, true); window.removeEventListener('pointerup', stop, true); window.removeEventListener('pointercancel', stop, true); };
    const track = e => { if (e.pointerId !== id) return; last = e; if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) cancel(); };
    const stop = e => { if (e.pointerId === id) cancel(); };
    const timer = setTimeout(() => {
      cancel(); if (viewPointers.size > 1 || selectedRoomId !== room.id) return;
      resetViewportPointers(); try { navigator.vibrate?.(15); } catch {}
      startRoomMove({ pointerId: id, clientX: last.clientX, clientY: last.clientY, button: 0, target: els.scene, pointerType: 'touch' }, true);
    }, 350);
    window.addEventListener('pointermove', track, true); window.addEventListener('pointerup', stop, true); window.addEventListener('pointercancel', stop, true);
    return false;
  }
  const original = clone(room.points); let moved = false, guides = null;
  try { els.scene.setPointerCapture(event.pointerId); } catch {}
  // The camera follows a room dragged to the edge of the screen, like markers and labels.
  const camera = dragCamera(e => { clearTimeout(guides?.motion?.timer); guides = null; move(e); });
  const move = e => {
    if (e.pointerId !== event.pointerId) return; const [x, y] = scenePercentAt(e); let dx = x - start[0], dy = y - start[1];
    if (!moved && Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY) < 4) return;
    if (!moved) { moved = true; movingRoomId = room.id; }
    camera.track(e);
    const minX = Math.min(...original.map(p => p[0])), maxX = Math.max(...original.map(p => p[0])), minY = Math.min(...original.map(p => p[1])), maxY = Math.max(...original.map(p => p[1]));
    let snapped = { xPercent: (minX + maxX) / 2 + dx, yPercent: (minY + maxY) / 2 + dy };
    if (!cameraPanning) {
      guides ||= guideTargets({ roomId: room.id });
      const w = guides.scene.width || 1, h = guides.scene.height || 1;
      guides.halfW = (maxX - minX) / 200 * w; guides.halfH = (maxY - minY) / 200 * h; guides.onSettle = () => move(e);
      snapped = alignToGuides(guides, snapped.xPercent, snapped.yPercent, e);
    }
    dx = snapped.xPercent - (minX + maxX) / 2; dy = snapped.yPercent - (minY + maxY) / 2;
    dx = clamp(dx, -minX, 100 - maxX); dy = clamp(dy, -minY, 100 - maxY);
    room.points = original.map(([px, py]) => [px + dx, py + dy]); renderRooms();
  };
  const up = e => { if (e.pointerId !== event.pointerId) return; camera.stop(); clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); showAlignGuides([], []); if (moved) { movingRoomId = null; room.points = room.points.map(p => p.map(v => Math.round(v * 1000) / 1000)); room.updatedAt = new Date().toISOString(); renderRooms(); scheduleSave(true); els.markers.dataset.roomMoved = '1'; } };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  return true;
}
// ---- Room editor panel
// ---- Room entities: added list + dynamic search over all HA entities (like Integrations)
async function loadAllEntities() {
  if (allEntitiesCache) return allEntitiesCache;
  allEntitiesLoading ||= (async () => {
    if (!integrations.length) { try { const data = await api('integrations'); integrations = data.integrations || []; } catch {} }
    const titles = new Map(integrations.map(item => [item.entry_id, item.title || item.domain || '']));
    let list = [];
    try { const data = await api('integration_entities_all'); Object.entries(data.entities_by_entry || {}).forEach(([entry, entities]) => (entities || []).forEach(entity => list.push({ id: entity.entity_id, name: entity.name || entity.entity_id, integration: titles.get(entry) || '', enabled: entity.enabled !== false }))); } catch {}
    const seen = new Set(); allEntitiesCache = list.filter(entity => entity.id && !seen.has(entity.id) && seen.add(entity.id));
    return allEntitiesCache;
  })();
  return allEntitiesLoading;
}
function roomEntityName(id) {
  const view = activeSceneView(), marker = markerForEntity(id, view?.entities), flow = Object.values(view?.flows || {}).find(item => item.entityId === id);
  return marker?.displayName || flow?.displayName || allEntitiesCache?.find(entity => entity.id === id)?.name || stateCache[id]?.attributes?.friendly_name || id;
}
function roomEntityRank(id) { return /^(light|switch)\./.test(id) ? 0 : /^(binary_sensor|input_boolean|fan)\./.test(id) ? 1 : 2; }
function roomEntityRow(id, action) {
  const state = String(stateCache[id]?.state ?? '');
  const button = action === 'remove' ? `<button type="button" class="room-entity-action" data-room-remove="${escapeHtml(id)}" title="${escapeHtml(translateValue('Usuń encję'))}"><i class="mdi mdi-close"></i></button>` : `<button type="button" class="room-entity-action add" data-room-add="${escapeHtml(id)}" title="${escapeHtml(translateValue('Dodaj do pomieszczenia'))}"><i class="mdi mdi-plus"></i></button>`;
  return `<div class="room-entity${action === 'remove' ? ' added' : ''}"${action === 'add' ? ` data-room-add="${escapeHtml(id)}"` : ''}><div><strong data-no-i18n>${escapeHtml(roomEntityName(id))}</strong><code data-no-i18n>${escapeHtml(id)}${state ? ' · ' + escapeHtml(state) : ''}</code></div>${button}</div>`;
}
function renderExtraEntityResults() {
  const box = $('#extra-entity-results'), input = $('#extra-entity-search'), room = roomsOf()[selectedRoomId]; if (!box || !input || !room) return;
  const query = searchText(input.value), added = new Set([...(room.entityIds || []), ...EXTRA_PARTS.filter(([, k]) => room[k]).map(([, k]) => room[`${k}Entity`])]);
  if (query.length < 2) { box.innerHTML = ''; return; }
  if (!allEntitiesCache) { box.innerHTML = `<div class="room-entity-heading">${escapeHtml(translateValue('Wyszukiwanie encji…'))}</div>`; loadAllEntities().then(() => { if ($('#extra-entity-search') === input) renderExtraEntityResults(); }); return; }
  const matches = allEntitiesCache.filter(entity => !added.has(entity.id) && (searchText(entity.id).includes(query) || searchText(entity.name).includes(query) || searchText(entity.integration).includes(query)))
    .sort((a, b) => Number(b.enabled) - Number(a.enabled) || a.name.localeCompare(b.name)).slice(0, 40);
  box.innerHTML = matches.length ? matches.map(entity => roomEntityRow(entity.id, 'add').replace(/data-room-add=/g, 'data-extra-add=')).join('') : `<div class="room-entity-heading">${escapeHtml(translateValue('Brak pasujących encji.'))}</div>`;
}
// A new extra entity: the first free slot, placed under the lowest part (in the group's layout and when ungrouped).
function addExtraEntity(room, id) {
  const slot = EXTRA_PARTS.find(([, k]) => !(room[k] && room[`${k}Entity`])); if (!slot || !id) return; const k = slot[1];
  const shown = ROOM_LABEL_PARTS.filter(([, kk]) => room[kk] && kk !== k), low = suffix => Math.max(0, ...shown.map(([, kk]) => Number(room[`${kk}${suffix}`] ?? ROOM_DEFAULTS[`${kk}${suffix}`]) || 0));
  Object.assign(room, { [k]: true, [`${k}Entity`]: id, [`${k}Y`]: Math.round(low('Y') + 40), [`${k}X`]: Number(room.labelNameX ?? 0) || 0, [`${k}FY`]: Math.round(low('FY') + 40), [`${k}FX`]: 0 });
  room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true);
  // Its state right away (from now on it is refreshed with the others).
  api('selected_states', jsonOptions({ entity_ids: [id] })).then(data => { Object.entries(data.states || {}).forEach(([eid, st]) => { if (st) stateCache[eid] = { ...stateCache[eid], ...st }; }); renderRooms(); if (selectedRoomId === room.id) openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); }).catch(() => {});
}
function renderRoomEntityResults() {
  const box = $('#room-entity-results'), input = $('#room-entity-search'), room = roomsOf()[selectedRoomId]; if (!box || !input || !room) return;
  const query = searchText(input.value), added = new Set(room.entityIds || []);
  if (query.length < 2) { box.innerHTML = ''; return; }
  if (!allEntitiesCache) { box.innerHTML = `<div class="room-entity-heading">${escapeHtml(translateValue('Wyszukiwanie encji…'))}</div>`; loadAllEntities().then(() => { if ($('#room-entity-search') === input) renderRoomEntityResults(); }); return; }
  const matches = allEntitiesCache.filter(entity => !added.has(entity.id) && (searchText(entity.id).includes(query) || searchText(entity.name).includes(query) || searchText(entity.integration).includes(query)))
    .sort((a, b) => roomEntityRank(a.id) - roomEntityRank(b.id) || Number(b.enabled) - Number(a.enabled) || a.name.localeCompare(b.name)).slice(0, 40);
  box.innerHTML = matches.length ? matches.map(entity => roomEntityRow(entity.id, 'add')).join('') : `<div class="room-entity-heading">${escapeHtml(translateValue('Brak pasujących encji.'))}</div>`;
}
function roomEditorMarkup(room) {
  const r = withoutOnOff({ ...ROOM_DEFAULTS, ...room }), light = roomLight({ ...ROOM_DEFAULTS, ...room }), refresh = { refresh:true }, onOff = roomSwitchable(r);
  // No ON / OFF choices for entities that do not switch on and off.
  const baseControl = (label, path, ...rest) => !onOff && path !== 'stateEnabled' && /zależn[aeyi] ON\/OFF/i.test(label) ? '' : plainControl(label, path, ...rest);
  // A thermostat follows its work states: each "… ON" / "… OFF" pair becomes one setting per used state.
  const thermoR = isThermoRoom(r), acts = thermoR ? thermoActsUsed(r) : [], actName = a => translateValue(THERMO_ACTIONS[a]?.[0] || a);
  const actValue = (onPath, a) => { const v = r[actPath(onPath, a)]; return v !== undefined && v !== '' && v !== null ? v : actWorking(a) ? r[onPath] : r[onPath.replace(/On(?=[A-Z]|$)/, 'Off')]; };
  const control = (label, path, type, value, opts, ...rest) => {
    if (!thermoR) return baseControl(label, path, type, value, opts, ...rest);
    if (path === 'labelIconAnimOnlyOn') return acts.map(a => plainControl(`${translateValue('Animacja')} · ${actName(a)}`, `labelIconAnim_${a}`, 'select', r[`labelIconAnim_${a}`] ?? (actWorking(a) ? (ICON_ANIMATIONS.includes(r.labelIconAnimType) ? r.labelIconAnimType : 'spin') : 'none'), { items:[['none','Brak'],['spin','Obrót'],['pulse','Pulsowanie'],['blink','Miganie'],['swing','Kołysanie']], dropdown:true })).join('');
    if (/ OFF$/.test(label) && /Off(?=[A-Z]|$)/.test(path)) return '';
    if (/ ON$/.test(label) && /On(?=[A-Z]|$)/.test(path)) return acts.map(a => { const raw = actValue(path, a), v = type === 'range' ? (opts?.suffix === '%' ? pct(raw) : (Number(raw) || value)) : (raw ?? value);
      return plainControl(`${translateValue(label.replace(/ ON$/, ''))} · ${actName(a)}`, actPath(path, a), type, v, opts, ...rest); }).join('');
    if (path === 'labelIconAnimType') return '';
    return baseControl(label.replace(/(z)ależn([aeyi]) ON\/OFF/i, '$1ależn$2 od stanu pracy'), path, type, value, opts, ...rest);
  };
  const note = text => `<p class="flow-section-note">${text}</p>`, canToggle = r.entityIds.some(id => isToggleableMarker({ entityId:id }));
  const addedList = r.entityIds.map(id => roomEntityRow(id, 'remove')).join('');
  const icon = isIconRoom(r);
  const entities = isTextRoom(r) ? section('Ogólne', control('Tekst','name','text',r.name) + control('Podpis','textCaption','text',r.textCaption || '') + linkControls(r)) : section('Ogólne', control('Nazwa','name','text',r.name)
    + (icon ? '' : `<div class="control room-state-row"><label>Stan</label><strong class="flow-live-value">${translateValue(light.on ? 'Włączone' : r.entityIds.length ? 'Wyłączone' : 'Brak encji')}</strong><span></span></div>`)
    + tapActionControl(canToggle ? r.tapAction : (r.tapAction === 'toggle' ? 'more_info' : r.tapAction), canToggle)
    + (isThermoRoom(r) ? gaugeSubsection(escapeHtml(translateValue('Dodatkowe encje')), `<p class="flow-section-note">${escapeHtml(translateValue('Inne encje związane z urządzeniem (np. ciśnienie, temperatura wody). Każda dostaje swoją sekcję i można ją ustawić jak rozgrupowaną część.'))}</p>`
        + `<div class="control room-entities-control"><div class="room-entity-list">${EXTRA_PARTS.filter(([, k]) => r[k] && r[`${k}Entity`]).map(([, k]) => roomEntityRow(r[`${k}Entity`], 'remove').replace(/data-room-remove="[^"]*"/, `data-extra-remove="${k}"`)).join('')}</div>`
        + (EXTRA_PARTS.some(([, k]) => !(r[k] && r[`${k}Entity`])) ? `<label class="room-entity-search"><i class="mdi mdi-magnify"></i><input id="extra-entity-search" type="search" autocomplete="off" placeholder="${escapeHtml(translateValue('Szukaj nazwy lub encji…'))}"></label><div id="extra-entity-results" class="room-entity-results"></div>` : '') + `</div>`) : '')
    + (isThermoRoom(r) ? gaugeSubsection(escapeHtml(translateValue('Stany pracy')), `<p class="flow-section-note">${escapeHtml(translateValue('Zaznacz stany, których używa to urządzenie — tylko one pojawią się w ustawieniach stanu pracy.'))}</p>` + (() => { const used = thermoActsUsed(r); return Object.keys(THERMO_ACTIONS).map(a => plainControl(THERMO_ACTIONS[a][0], `thermoActUse_${a}`, 'checkbox', used.includes(a), { refresh:true })).join(''); })()) : '')
    + `<div class="control room-entities-control label-entity"><div class="room-entity-list">${addedList}</div>`
    // A label has one entity: the search shows only while it has none.
    + (r.entityIds.length ? '</div>' : `<label class="room-entity-search"><i class="mdi mdi-magnify"></i><input id="room-entity-search" type="search" autocomplete="off" placeholder="${escapeHtml(translateValue('Szukaj nazwy lub encji…'))}"></label><div id="room-entity-results" class="room-entity-list room-entity-results"></div></div>`)
    + (isThermoRoom(r) ? thermoTemplatesRow() : '')
    );
  // Room look: colour, light and (switched on from the section bar) the outline of the shape.
  const lookSection = () => partBar('room', 'Wygląd', sub('Kolor', control('Kolor zależny ON/OFF','stateEnabled','checkbox',!!r.stateEnabled,refresh)
    + (r.stateEnabled
      ? control('Kolor ON','color','color',r.color) + control('Kolor OFF','offColor','color',r.offColor)
        + control('Intensywność ON','opacity','range',Math.round(clamp(Number(r.opacity) || 0, 0, 1) * 100),{ min:5, max:100, step:1, suffix:'%', integer:true })
        + control('Intensywność OFF','offOpacity','range',Math.round(clamp(Number(r.offOpacity) || 0, 0, 1) * 100),{ min:0, max:100, step:1, suffix:'%', integer:true })
      : control('Kolor','color','color',r.color)
        + control('Intensywność','opacity','range',Math.round(clamp(Number(r.opacity) || 0, 0, 1) * 100),{ min:5, max:100, step:1, suffix:'%', integer:true })))
    + sub('Światło', control('Miękkość krawędzi','feather','range',Number(r.feather) || 0,{ min:0, max:80, step:1, suffix:'px', integer:true })
    + control('Efekt światła','lightEffect','select',r.lightEffect || 'none',{ items:[['none','Jednolity'],['center','Centralny'],['corner','Róg'],['wall','Od ściany'],['ambient','Ambient']], refresh:true })
    + (r.lightEffect && r.lightEffect !== 'none' ? (r.lightEffect === 'wall'
        ? control('Kierunek','lightDirection','select',r.lightDirection || 'left',{ items:[['left','Lewa'],['right','Prawa'],['top','Góra'],['bottom','Dół']] }) + control('Pozycja na ścianie','lightWallPos','range',Number(r.lightWallPos ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true })
        : control('Pozycja pozioma','lightX','range',Number(r.lightX ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Pozycja pionowa','lightY','range',Number(r.lightY ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true }))
      + control('Rozproszenie','lightSpread','range',clamp(Number(r.lightSpread) || .6, .15, 1),{ min:.15, max:1, step:.01 })
      + control('Wypełnienie','lightFill','range',clamp(Number(r.lightFill) || 0, 0, 1),{ min:0, max:1, step:.01 }) : ''))
    + (r.outline ? sub('Obrys', control('Linia','outlineStyle','select',r.outlineStyle || 'solid',{ items:[['solid','Ciągła'],['dashed','Kreskowana'],['dotted','Kropkowana']] })
        + control('Zależne ON/OFF','outlineState','checkbox',!!r.outlineState,refresh)
        + (r.outlineState && onOff
          ? control('Kolor ON','outlineOnColor','color',r.outlineOnColor) + control('Kolor OFF','outlineOffColor','color',r.outlineOffColor)
            + control('Przezrocz. ON','outlineOnOpacity','range',pct100(r.outlineOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','outlineOffOpacity','range',pct100(r.outlineOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość ON','outlineOnWidth','range',clamp(Number(r.outlineOnWidth) || 2.5, .5, 20),{ min:.5, max:12, step:.5, suffix:'px' }) + control('Grubość OFF','outlineOffWidth','range',clamp(Number(r.outlineOffWidth) || 1.5, .5, 20),{ min:.5, max:12, step:.5, suffix:'px' })
          : control('Kolor obrysu','outlineColor','color',r.outlineColor) + control('Przezrocz. obrysu','outlineOpacity','range',pct100(r.outlineOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość obrysu','outlineWidth','range',clamp(Number(r.outlineWidth) || 2, .5, 20),{ min:.5, max:12, step:.5, suffix:'px' }))) : ''),
    [['outline','Obrys','mdi-vector-square']]);
  const iconList = `<datalist id="room-mdi-icon-list">${ICON_CHOICES.slice(1).map(([name, text]) => `<option value="${name}">${iconChoiceLabel(text)}</option>`).join('')}</datalist>`;
  const pct = value => Math.round(clamp(Number(value ?? 1), 0, 1) * 100);
  const iconInput = (path, title, value) => `<div class="control"><label>${escapeHtml(translateValue(title))}</label><input type="text" list="room-mdi-icon-list" value="${escapeHtml(value || '')}" data-path="${path}" data-value-type="text" placeholder="${escapeHtml(translateValue('automatyczna'))}"><span></span></div>`;
  const source = roomLabelIconSource(r), sub = (title, body) => gaugeSubsection(escapeHtml(translateValue(title)), body);
  const iconOptions = () => sub('Źródło', control('Źródło','labelIconSource','select',source,{ items:[['entity','Z encji'],['integration','Logo integracji'],['mdi','Własna ikona MDI']], refresh:true })
      + (source === 'mdi' ? control('Ikona zależna ON/OFF','labelIconVariant','checkbox',!!r.labelIconVariant,refresh)
        + (r.labelIconVariant ? (thermoR ? acts.map(a => iconInput(actPath('labelIconNameOn', a), `${translateValue('Ikona')} · ${actName(a)}`, actValue('labelIconNameOn', a))).join('') : iconInput('labelIconNameOn','Ikona ON',r.labelIconNameOn) + iconInput('labelIconNameOff','Ikona OFF',r.labelIconNameOff)) : iconInput('labelIconName','Ikona',r.labelIconName)) + iconList : ''))
    + sub('Kolor', control('Wypełnienie','labelIconFill','checkbox',r.labelIconFill !== false,refresh)
      + (r.labelIconFill !== false ? control('Zależne ON/OFF','labelIconColorState','checkbox',r.labelIconColorState !== false,refresh)
        + (r.labelIconColorState !== false
          ? (source !== 'integration' ? control('Kolor ON','labelIconOn','color',r.labelIconOn) + control('Kolor OFF','labelIconOff','color',r.labelIconOff) : '')
            + control('Przezrocz. ON','labelIconOpacityOn','range',pct(r.labelIconOpacityOn),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconOpacityOff','range',pct(r.labelIconOpacityOff),{ min:0, max:100, step:1, suffix:'%', integer:true })
          : (source !== 'integration' ? control('Kolor','labelIconColor','color',r.labelIconColor || '#FFC46B') : '') + control('Przezroczystość','labelIconOpacity','range',pct(r.labelIconOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })) : ''))
    + (source !== 'integration' && r.labelIconOutline ? sub('Obrys', (r.labelIconOutline ? control('Zależne ON/OFF','labelIconOutlineState','checkbox',!!r.labelIconOutlineState,refresh)
        + (r.labelIconOutlineState
          ? control('Kolor ON','labelIconOutlineOnColor','color',r.labelIconOutlineOnColor) + control('Kolor OFF','labelIconOutlineOffColor','color',r.labelIconOutlineOffColor)
            + control('Przezrocz. ON','labelIconOutlineOnOpacity','range',pct(r.labelIconOutlineOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconOutlineOffOpacity','range',pct(r.labelIconOutlineOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość ON','labelIconOutlineOnWidth','range',clamp(Number(r.labelIconOutlineOnWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' }) + control('Grubość OFF','labelIconOutlineOffWidth','range',clamp(Number(r.labelIconOutlineOffWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' })
          : control('Kolor obrysu','labelIconOutlineColor','color',r.labelIconOutlineColor) + control('Przezrocz. obrysu','labelIconOutlineOpacity','range',pct(r.labelIconOutlineOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Grubość obrysu','labelIconOutlineWidth','range',clamp(Number(r.labelIconOutlineWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' })) : '')) : '')
    ;
  // Background and frame of any part (icon, name, state): the same options, each can follow ON / OFF.
  const range = (label, path, value, min, max, step, suffix) => control(label, path, 'range', value, { min, max, step, suffix, integer: step >= 1 });
  const stateColours = (key, base, field, fallbackColor, fallbackOpacity, width) => r[`${key}${base}State`]
    ? control('Kolor ON',`${key}${base}OnColor`,'color',r[`${key}${base}OnColor`]) + control('Kolor OFF',`${key}${base}OffColor`,'color',r[`${key}${base}OffColor`])
      + range('Przezrocz. ON',`${key}${base}OnOpacity`,pct(r[`${key}${base}OnOpacity`]),0,100,1,'%') + range('Przezrocz. OFF',`${key}${base}OffOpacity`,pct(r[`${key}${base}OffOpacity`]),0,100,1,'%')
      + (width ? range('Grubość ON',`${key}${base}OnWidth`,clamp(Number(r[`${key}${base}OnWidth`]) || 2, .5, 12),.5,12,.5,'px') + range('Grubość OFF',`${key}${base}OffWidth`,clamp(Number(r[`${key}${base}OffWidth`]) || 1.5, .5, 12),.5,12,.5,'px') : '')
    : control(`Kolor ${field}`,`${key}${base}Color`,'color',r[`${key}${base}Color`] || fallbackColor) + range(`Przezrocz. ${field}`,`${key}${base}Opacity`,pct(r[`${key}${base}Opacity`] ?? fallbackOpacity),0,100,1,'%')
      + (width ? range('Grubość ramki',`${key}${base}Width`,clamp(Number(r[`${key}${base}Width`]) || 1.5, .5, 12),.5,12,.5,'px') : '');
  // Background / frame are switched on with the buttons on the section bar; a switched-off one has no sub-section.
  // The frame's shape (corners, margin) sits in Ramka, or in Tło when there is no frame.
  const frameSubs = (key, shape) => (r[`${key}Bg`] ? sub('Tło', control('Zależne ON/OFF',`${key}BgState`,'checkbox',!!r[`${key}BgState`],refresh) + stateColours(key, 'Bg', 'tła', '#081822', .55) + control('Rozmycie',`${key}Blur`,'checkbox',!!r[`${key}Blur`]) + (r[`${key}Border`] ? '' : shape)) : '')
    + (r[`${key}Border`] ? sub('Ramka', control('Zależne ON/OFF',`${key}BorderState`,'checkbox',!!r[`${key}BorderState`],refresh) + stateColours(key, 'Border', 'ramki', '#FFFFFF', .6, true) + shape) : '');
  // Section with its own colour and on / off buttons on its bar (outline, background, frame).
  const partBar = (part, title, body, toggles) => `<details class="editor-section part-section part-${part}"><summary><span>${escapeHtml(translateValue(title))}</span><span class="section-tools">${toggles.map(([k, t, mdi]) => k === '|' ? '<span class="section-sep" aria-hidden="true"></span>' : `<button type="button" class="section-toggle${r[k] ? ' active' : ''}" data-part-toggle="${k}" aria-pressed="${!!r[k]}" title="${escapeHtml(translateValue(t))}" aria-label="${escapeHtml(translateValue(t))}"><i class="mdi ${mdi}"></i></button>`).join('')}</span></summary><div class="editor-section-body">${body}</div></details>`;
  const frameToggles = key => [[`${key}Bg`,'Tło','mdi-format-color-fill'],[`${key}Border`,'Ramka','mdi-border-all-variant']];
  const partSection = ([part, key, title]) => {
    if (isTextRoom(r) && part === 'state') title = 'Podpis';
    if (isExtraPart(part)) { if (!r[`${key}Entity`]) return ''; title = String(r[`${key}Prefix`] || '').trim() || extraEntityName(r[`${key}Entity`]); }
    if (!r[key]) return '';
    const size = range('Rozmiar',`${key}Size`,clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420),6,420,1,'px');
    const animType = ICON_ANIMATIONS.includes(r.labelIconAnimType) ? r.labelIconAnimType : 'spin', fanLike = (r.entityIds || []).some(id => /^fan\./.test(id) || Number.isFinite(Number(stateCache[id]?.attributes?.percentage)));
    const animSub = !r.labelIconAnim ? '' : sub('Animacja', control('Rodzaj','labelIconAnimType','select',animType,{ items:[['spin','Obrót'],['pulse','Pulsowanie'],['blink','Miganie'],['swing','Kołysanie']], refresh:true })
      + range('Czas cyklu','labelIconAnimSpeed',clamp(Number(r.labelIconAnimSpeed) || 1.5, .2, 10),.2,10,.1,' s')
      + (animType === 'spin' ? control('Kierunek','labelIconAnimDir','select',r.labelIconAnimDir === 'ccw' ? 'ccw' : 'cw',{ items:[['cw','W prawo'],['ccw','W lewo']] }) : '')
      + (onOff ? control('Tylko gdy ON','labelIconAnimOnlyOn','checkbox',r.labelIconAnimOnlyOn !== false,refresh) : '')
      + (fanLike ? control('Prędkość z encji (%)','labelIconAnimEntitySpeed','checkbox',!!r.labelIconAnimEntitySpeed,refresh) : ''));
    if (part === 'dial') return partBar(part, title, sub('Rozmiar', size + range('Grubość łuku','thermoDialWidth',clamp(Number(r.thermoDialWidth) || 9, 2, 30),2,30,1,'px')
        + range('Kropka temperatury aktualnej','thermoDotSize',clamp(Number(r.thermoDotSize ?? 100), 0, 400),0,400,5,'%') + range('Uchwyt temperatury ustawionej','thermoKnobSize',clamp(Number(r.thermoKnobSize ?? 100), 0, 400),0,400,5,'%'))
      + sub('Wypełnienie środka', thermoActsUsed(r).map(a => control(`${translateValue('Efekt')} · ${translateValue(THERMO_ACTIONS[a]?.[0] || a)}`, `thermoFill_${a}`, 'select', r[`thermoFill_${a}`] || 'none', { items: THERMO_FILL_FX, dropdown:true, refresh:true })
          + (r[`thermoFill_${a}`] && r[`thermoFill_${a}`] !== 'none' ? control(`${translateValue('Kolor')} · ${translateValue(THERMO_ACTIONS[a]?.[0] || a)}`, `thermoFillColor_${a}`, 'color', r[`thermoFillColor_${a}`] || thermoActColor(r, a)) : '')).join('')
        + range('Intensywność','thermoFillOpacity',Math.round(clamp(Number(r.thermoFillOpacity ?? .45), 0, 1) * 100),0,100,1,'%'))
      + sub('Kolory stanu pracy', thermoActsUsed(r).filter(k => THERMO_ACT_COLORS[k]).map(k => control(THERMO_ACTIONS[k]?.[0] || k, `thermoActColor_${k}`, 'color', thermoActColor(r, k))).join('') + control('Tor tarczy','thermoTrackColor','color',r.thermoTrackColor))
      + frameSubs(key, range('Zaokrąglenie',`${key}Radius`,Number.isFinite(Number(r[`${key}Radius`])) && r[`${key}Radius`] !== '' && r[`${key}Radius`] != null ? clamp(Number(r[`${key}Radius`]), 0, 200) : 20,0,200,1,'px')),
      [['thermoDialRange','Zakres min / max','mdi-arrow-expand-horizontal'],['thermoGlow','Poświata podczas pracy','mdi-blur'], ...frameToggles(key)]);
    if (part === 'icon') return partBar(part, title, sub('Rozmiar', size) + animSub + iconOptions() + frameSubs(key,
      control('Kształt','labelIconShape','select',['square','circle','custom'].includes(r.labelIconShape) ? r.labelIconShape : 'circle',{ items:[['square','Kwadrat'],['circle','Koło'],['custom','Dowolny']], refresh:true })
      + (r.labelIconShape === 'custom' ? range('Zaokrąglenie','labelIconRadius',clamp(Number(r.labelIconRadius) || 0, 0, 200),0,120,1,'px') : '')
      + range('Margines','labelIconPadding',clamp(Number(r.labelIconPadding ?? 6), 0, 120),0,80,1,'px')),
      [['labelIconAnim','Animacja','mdi-rotate-right'], ...(source !== 'integration' ? [['labelIconOutline','Obrys','mdi-vector-circle-variant']] : []), ...frameToggles(key)]);
    const fontPx = clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420), has = v => v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v));
    const number = part === 'state' && !onOff && roomNumber(r) !== null;
    const decimalsItems = [['auto','Automatycznie'],['0','0'],['1','0,1'],['2','0,01']];
    const thermoTexts = !isThermoRoom(r) ? '' : part === 'target' || part === 'current'
      ? sub('Format', control('Zaokrąglenie',`${key}Decimals`,'select',String(r[`${key}Decimals`] ?? 'auto'),{ items: decimalsItems, dropdown:true }) + control('Jednostka',`${key}Unit`,'text',String(r[`${key}Unit`] ?? '°C'),{ placeholder:'°C' }))
      : part === 'action'
      ? sub('Teksty', thermoActsUsed(r).map(a => control(THERMO_ACTIONS[a][0], `thermoActText_${a}`, 'text', r[`thermoActText_${a}`] || '', { placeholder: translateValue(THERMO_ACTIONS[a][0]) })).join(''))
        + sub('Animacja', thermoActsUsed(r).map(a => control(THERMO_ACTIONS[a][0], `thermoActAnim_${a}`, 'select', r[`thermoActAnim_${a}`] || 'none', { items: THERMO_ACT_ANIMS, dropdown:true })).join(''))
      : isExtraPart(part) ? sub('Wartość', control('Tekst przed wartością', `${key}Prefix`, 'text', r[`${key}Prefix`] || '', { placeholder: translateValue('np. Ciśnienie:') })
          + control('Jednostka', `${key}Unit`, 'text', r[`${key}Unit`] || '', { placeholder: stateCache[r[`${key}Entity`]]?.attributes?.unit_of_measurement || '' })
          + control('Zaokrąglenie', `${key}Decimals`, 'select', String(r[`${key}Decimals`] ?? 'auto'), { items: [['auto','Automatycznie'],['0','0'],['1','0,1'],['2','0,01']], dropdown: true }))
      : part === 'modes' ? (() => {
        const info = climateInfo({ entityId: (r.entityIds || [])[0] || '' }), all = thermoModesOrdered(r, info.modes, false), name = m => translateValue(THERMO_MODES[m]?.[0] || m);
        const orderRows = all.map((m, i) => `<div class="control mode-order-row"><label>${escapeHtml(name(m))}</label><span class="mode-order-tools"><input type="checkbox" data-path="thermoModeShow_${escapeHtml(m)}" data-value-type="checkbox"${r[`thermoModeShow_${m}`] !== false ? ' checked' : ''} title="${escapeHtml(translateValue('Pokaż'))}"><button type="button" class="room-card-preset" data-mode-move="${escapeHtml(m)}|-1"${i ? '' : ' disabled'} title="${escapeHtml(translateValue('Wyżej'))}"><i class="mdi mdi-chevron-up"></i></button><button type="button" class="room-card-preset" data-mode-move="${escapeHtml(m)}|1"${i < all.length - 1 ? '' : ' disabled'} title="${escapeHtml(translateValue('Niżej'))}"><i class="mdi mdi-chevron-down"></i></button></span></div>`).join('');
        const modesSection = info.modes.length ? sub('Tryby', control('Układ','thermoModeLayout','select',r.thermoModeLayout === 'cycle' ? 'cycle' : 'row',{ items:[['row','Wszystkie przyciski'],['cycle','Jeden przycisk (następny tryb)']], dropdown:true, refresh:true }) + orderRows) : '';
        const presetsSection = info.presets.length && !info.water ? sub('Presety', control('Pokaż presety','thermoPresets','checkbox',!!r.thermoPresets,refresh)
          + (r.thermoPresets ? info.presets.map(p => control(`${translateValue('Pokaż')} · ${thermoPresetText({}, p)}`, `thermoPresetShow_${p}`, 'checkbox', r[`thermoPresetShow_${p}`] !== false) + control(`${translateValue('Nazwa')} · ${thermoPresetText({}, p)}`, `thermoPresetText_${p}`, 'text', r[`thermoPresetText_${p}`] || '', { placeholder: thermoPresetText({}, p) })).join('') : '')) : '';
        const confirmSection = sub('Potwierdzenie', `<p class="flow-section-note">${escapeHtml(translateValue('Zaznacz, przy których zmianach zapytać przed wysłaniem.'))}</p>`
          + all.map(m => control(`${translateValue('Pytaj')} · ${name(m)}`, `thermoConfirm_${m}`, 'checkbox', thermoConfirmPerMode(r) ? !!r[`thermoConfirm_${m}`] : !!r.thermoConfirm && m === 'off')).join('')
          + (r.thermoPresets && !info.water ? info.presets.map(p => control(`${translateValue('Pytaj')} · ${thermoPresetText(r, p)}`, `thermoConfirmP_${p}`, 'checkbox', !!r[`thermoConfirmP_${p}`])).join('') : ''));
        return modesSection + presetsSection + confirmSection;
      })()
      : part === 'state' ? sub('Teksty trybów', [...new Set([...climateInfo({ entityId: (r.entityIds || [])[0] || '' }).modes, ...Object.keys(THERMO_MODES)])].map(m => control(THERMO_MODES[m]?.[0] || m, `thermoModeText_${m}`, 'text', r[`thermoModeText_${m}`] || '', { placeholder: thermoModeText({}, m) })).join('')) : '';
    const contentSub = isThermoRoom(r) ? thermoTexts : part !== 'state' ? '' : onOff
      ? sub('Format', control('Tekst ON','labelStateOnText','text',r.labelStateOnText || '',{ placeholder: translateValue('Wł.') }) + control('Tekst OFF','labelStateOffText','text',r.labelStateOffText || '',{ placeholder: translateValue('Wył.') }))
      : number ? sub('Format', control('Jednostka','labelStateUnit','text',r.labelStateUnit || '',{ placeholder: stateCache[r.entityIds[0]]?.attributes?.unit_of_measurement || '' })
        + control('Zaokrąglenie','labelStateDecimals','select',String(r.labelStateDecimals ?? 'auto'),{ items:[['auto','Automatycznie'],['0','0'],['1','0,1'],['2','0,01'],['3','0,001']], dropdown:true })) : '';
    const iconParts = isThermoRoom(r) && ['modes','minus','plus'].includes(part);
    const modeList = part === 'modes' ? thermoModesOrdered(r, climateInfo({ entityId: (r.entityIds || [])[0] || '' }).modes, false) : [];
    const modeName = m => translateValue(THERMO_MODES[m]?.[0] || m);
    const modesSub = part !== 'modes' ? '' : sub('Ikony trybów', modeList.map(m => iconInput(`thermoModeIcon_${m}`, `${translateValue('Ikona')} · ${modeName(m)}`, r[`thermoModeIcon_${m}`] || (THERMO_MODES[m]?.[1] || '').replace(/^mdi-/, 'mdi:'))
        + control(`${translateValue('Kolor ikony')} · ${modeName(m)}`, `thermoModeColor_${m}`, 'color', r[`thermoModeColor_${m}`] || r.labelModesColor || '#8FA9B7')
        + control(`${translateValue('Kolor aktywnego')} · ${modeName(m)}`, `thermoModeActive_${m}`, 'color', r[`thermoModeActive_${m}`] || (r.thermoModeAccent === false && r.thermoModeActiveColor ? r.thermoModeActiveColor : thermoActColor(r, ({ heat:'heating', cool:'cooling', dry:'drying', fan_only:'fan', off:'off' })[m] || 'idle')))).join('') + iconList)
      + sub('Przyciski', control('Kolor aktywnego wg trybu','thermoModeAccent','checkbox',r.thermoModeAccent !== false,refresh)
        + (r.thermoModeAccent === false ? control('Kolor aktywnego','thermoModeActiveColor','color',r.thermoModeActiveColor || '#FF7A2F') : '')
        + control('Ramki przycisków','thermoModeFrame','checkbox',r.thermoModeFrame !== false)
        + range('Odstęp','thermoModeGap',clamp(Number(r.thermoModeGap ?? 40), 0, 300),0,300,5,'%') + range('Zaokrąglenie','thermoModeRadius',clamp(Number(r.thermoModeRadius ?? 30), 0, 50),0,50,1,'%'));
    const sizeSub = iconParts ? sub('Rozmiar', size) : sub('Rozmiar', size + control('Grubość czcionki',`${key}Weight`,'select',TEXT_WEIGHTS[r[`${key}Weight`]] ? r[`${key}Weight`] : (key === 'labelName' ? 'bold' : 'normal'),{ items:[['normal','Normalna'],['medium','Średnia'],['bold','Pogrubiona']] }));
    const accentable = ['labelTarget','labelCurrent','labelAction'].includes(key);
    if (accentable && r[`${key}Accent`]) return partBar(part, title, sizeSub + contentSub + modesSub + sub('Kolor', control('Kolor wg trybu',`${key}Accent`,'checkbox',true,refresh))
      + frameSubs(key, range('Zaokrąglenie',`${key}Radius`,has(r[`${key}Radius`]) ? clamp(Number(r[`${key}Radius`]), 0, 200) : Math.round(fontPx * .7),0,200,1,'px')
        + range('Margines',`${key}Padding`,has(r[`${key}Padding`]) ? clamp(Number(r[`${key}Padding`]), 0, 120) : Math.round(fontPx * .28),0,120,1,'px')), frameToggles(key));
    return partBar(part, title, sizeSub + contentSub + modesSub + sub('Kolor', (accentable ? control('Kolor wg trybu',`${key}Accent`,'checkbox',false,refresh) : '') + control('Zależne ON/OFF',`${key}ColorState`,'checkbox',!!r[`${key}ColorState`],refresh)
        + (r[`${key}ColorState`]
          ? control('Kolor ON',`${key}ColorOn`,'color',r[`${key}ColorOn`]) + control('Kolor OFF',`${key}ColorOff`,'color',r[`${key}ColorOff`])
            + range('Przezrocz. ON',`${key}OpacityOn`,pct(r[`${key}OpacityOn`]),0,100,1,'%') + range('Przezrocz. OFF',`${key}OpacityOff`,pct(r[`${key}OpacityOff`]),0,100,1,'%')
          : control('Kolor',`${key}Color`,'color',r[`${key}Color`]) + range('Przezroczystość',`${key}Opacity`,pct(r[`${key}Opacity`]),0,100,1,'%')))
      + frameSubs(key, range('Zaokrąglenie',`${key}Radius`,has(r[`${key}Radius`]) ? clamp(Number(r[`${key}Radius`]), 0, 200) : Math.round(fontPx * .7),0,200,1,'px')
        + range('Margines',`${key}Padding`,has(r[`${key}Padding`]) ? clamp(Number(r[`${key}Padding`]), 0, 120) : Math.round(fontPx * .28),0,120,1,'px')), frameToggles(key));
  };
  const presetRow = (attr, items, active) => `<div class="room-card-presets">${items.map(([value, title, icon]) => `<button type="button" class="room-card-preset${active === value ? ' active' : ''}" ${attr}="${value}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}">${icon ? `<i class="mdi ${icon}"></i>` : `<span class="room-card-swatch ${value}"></span>`}</button>`).join('')}</div>`;
  // Group section. With only one part shown there is nothing to group: the group's background / frame are not drawn
  // (stored settings stay and come back with a second part) and their options are hidden.
  const solo = ROOM_LABEL_PARTS.filter(([, k]) => r[k]).length <= 1;
  const toggleButton = (key, title, mdi, extra = '') => `<button type="button" class="room-card-preset${extra}${r[key] ? ' active' : ''}" data-part-toggle="${key}" aria-pressed="${!!r[key]}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}"><i class="mdi ${mdi}"></i></button>`;
  const row = (title, body) => `<div class="control room-card-row"><label>${escapeHtml(translateValue(title))}</label><div class="room-card-presets">${body}</div></div>`;
  const radius = control('Zaokrąglenie','labelCardRadius','range',clamp(Number(r.labelCardRadius) || 0, 0, 80),{ min:0, max:60, step:1, suffix:'px', integer:true });
  const bgSub = !r.labelCardBg ? '' : sub('Tło', control('Zależne ON/OFF','labelCardBgState','checkbox',!!r.labelCardBgState,refresh)
      + (r.labelCardBgState
        ? control('Kolor ON','labelCardBgOnColor','color',r.labelCardBgOnColor) + control('Kolor OFF','labelCardBgOffColor','color',r.labelCardBgOffColor)
          + control('Przezrocz. ON','labelCardBgOnOpacity','range',pct(r.labelCardBgOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelCardBgOffOpacity','range',pct(r.labelCardBgOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
        : control('Kolor tła','labelCardBgColor','color',r.labelCardBgColor || '#081822') + control('Przezrocz. tła','labelCardBgOpacity','range',pct(r.labelCardBgOpacity ?? .62),{ min:0, max:100, step:1, suffix:'%', integer:true }))
      + control('Rozmycie','labelCardBlur','checkbox',!!r.labelCardBlur) + control('Cień','labelCardShadow','checkbox',r.labelCardShadow !== false) + (r.labelCardBorder ? '' : radius));
  const borderSub = !r.labelCardBorder ? '' : sub('Ramka', control('Zależne ON/OFF','labelCardBorderState','checkbox',!!r.labelCardBorderState,refresh)
      + (r.labelCardBorderState
        ? control('Kolor ON','labelCardBorderOnColor','color',r.labelCardBorderOnColor) + control('Kolor OFF','labelCardBorderOffColor','color',r.labelCardBorderOffColor)
          + control('Przezrocz. ON','labelCardBorderOnOpacity','range',pct(r.labelCardBorderOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelCardBorderOffOpacity','range',pct(r.labelCardBorderOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
          + control('Grubość ON','labelCardBorderOnWidth','range',clamp(Number(r.labelCardBorderOnWidth) || 1.5, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' }) + control('Grubość OFF','labelCardBorderOffWidth','range',clamp(Number(r.labelCardBorderOffWidth) || 1, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' })
        : control('Kolor ramki','labelCardBorderColor','color',r.labelCardBorderColor || '#FFFFFF') + control('Przezrocz. ramki','labelCardBorderOpacity','range',pct(r.labelCardBorderOpacity ?? .3),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Grubość ramki','labelCardBorderWidth','range',clamp(Number(r.labelCardBorderWidth) || 1, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' }))
      + radius);
  const group = partBar('group', 'Grupa', `<div class="group-tight">`
    + (isThermoRoom(r) ? row('Pokaż', THERMO_WIZARD_PARTS.map(([key, title, mdi]) => toggleButton(key, title, mdi)).join('')) : '')
    + control('Rozmiar','labelSizeUi','range',Math.round(clamp(Number(r.labelCardScale) || 1, .2, 4.5) / labelScaleBase(r) * 100) / 100,{ min:.3, max:4.5, step:.05, suffix:'×' })
    + (solo ? note(translateValue('Widoczna jest jedna część — tło i ramka grupy nie są rysowane. Wrócą, gdy pokażesz drugą część.'))
      : (r.labelLinked ? row('Układ', ROOM_CARD_LAYOUTS.map(([value, title, icon]) => `<button type="button" class="room-card-preset${(r.labelCardLayout || 'column') === value ? ' active' : ''}" data-card-layout="${value}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}"><i class="mdi ${icon}"></i></button>`).join('')) : '')
        + (icon && r.labelLinked && dashGrid().on ? (dashSpan(r)
          ? control('Szerokość (kratki)','dashW','range',dashSpan(r).cw,{ min:1, max:dashGrid().cols, step:1, integer:true }) + control('Wysokość (kratki)','dashH','range',dashSpan(r).ch,{ min:1, max:dashGrid().rows, step:1, integer:true })
            + row('Siatka', `<button type="button" class="room-card-preset active" data-dash-unpin title="${escapeHtml(translateValue('Odepnij od siatki'))}" aria-label="${escapeHtml(translateValue('Odepnij od siatki'))}"><i class="mdi mdi-pin-off-outline"></i></button>`)
          : row('Siatka', `<button type="button" class="room-card-preset" data-dash-pin title="${escapeHtml(translateValue('Przypnij do siatki'))}" aria-label="${escapeHtml(translateValue('Przypnij do siatki'))}"><i class="mdi mdi-pin-outline"></i></button>`)) : '')
        + row('Styl', ROOM_CARD_STYLES.map(([value, title]) => `<button type="button" class="room-card-preset" data-card-style="${value}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}"><span class="room-card-swatch ${value}"></span></button>`).join(''))
        + control('Margines','labelCardPadding','range',clamp(Number(r.labelCardPadding ?? ROOM_DEFAULTS.labelCardPadding) || 0, 0, 60),{ min:0, max:40, step:1, suffix:'px', integer:true })
        + bgSub + borderSub)
    + `</div>`, [
      // On the group's bar: grouping and which parts are shown, then (apart, so they do not blend) background and frame.
      ...(isThermoRoom(r) ? [] : [['labelIcon','Ikona','mdi-lightbulb-outline'],['labelName','Nazwa','mdi-format-text'],['labelState', isTextRoom(r) ? 'Podpis' : 'Stan', isTextRoom(r) ? 'mdi-text-short' : 'mdi-toggle-switch-outline']]),
      ...(solo ? [] : [['|'],['labelCardBg','Tło','mdi-format-color-fill'],['labelCardBorder','Ramka','mdi-border-all-variant']])]);
  const label = group + ROOM_LABEL_PARTS.map(partSection).join('');
  // The ON / OFF preview only makes sense for entities that switch on and off (not e.g. a temperature sensor).
  const switchable = roomSwitchable(r);
  return (switchable || isThermoRoom(r) ? previewRow('previewOn', roomPreviewOn, isThermoRoom(r) ? { acts: thermoActsUsed(r).join(','), current: thermoActivity(climateInfo({ entityId: r.entityIds[0] || '' })) } : null) : '') + entities + (icon ? '' : lookSection()) + label;
}
function openRoomEditor(id, preserveSection = roomEditorOpenSectionIndex, forceSection = null) {
  const room = roomsOf()[id], panel = $('#room-editor'); if (!room || !panel) return closeRoomEditor();
  const newlySelected = selectedRoomId !== id;
  if (newlySelected) { preserveSection = roomEditorOpenSectionIndex = -1; roomPreviewOn = ''; }
  // A group left with a single visible part (made before parts ungrouped themselves) is ungrouped in place.
  if (room.labelLinked && ROOM_LABEL_PARTS.filter(([, k]) => room[k]).length === 1) { autoUngroupLabel(room); room.updatedAt = new Date().toISOString(); scheduleSave(true); }
  if (forceSection !== null) preserveSection = roomEditorOpenSectionIndex = forceSection;
  closeEditor(); closeFlowEditor(); selectedRoomId = id;
  $('#room-editor-title').textContent = room.name || translateValue(isTextRoom(room) ? 'Tekst' : isIconRoom(room) ? 'Etykieta' : 'Pomieszczenie');
  const kind = $('#room-editor .editor-meta code'); if (kind) kind.textContent = translateValue(isThermoRoom(room) ? 'Termostat' : isTextRoom(room) ? 'Tekst' : isIconRoom(room) ? 'Etykieta' : 'Pomieszczenie');
  const lbl = isIconRoom(room); [['#room-duplicate', lbl ? 'Duplikuj etykietę' : 'Duplikuj pomieszczenie'], ['#room-copy-style', lbl ? 'Kopiuj styl etykiety' : 'Kopiuj styl pomieszczenia'], ['#room-paste-style', lbl ? 'Wklej styl etykiety' : 'Wklej styl pomieszczenia'], ['#room-remove', lbl ? 'Usuń etykietę' : 'Usuń pomieszczenie']].forEach(([sel, title]) => { const b = $(sel); if (b) { b.title = translateValue(title); b.setAttribute('aria-label', translateValue(title)); } });
  const kindIcon = $('#room-editor .room-editor-icon .mdi'); if (kindIcon) kindIcon.className = `mdi ${isIconRoom(room) ? 'mdi-lightbulb-group' : 'mdi-floor-plan'}`;
  const entityInfo = $('#room-editor-entities'); if (entityInfo) entityInfo.textContent = (room.entityIds || []).join(', ') || '—';
  syncLockButton($('#room-geometry-lock'), room.geometryLocked); const paste = $('#room-paste-style'); if (paste) paste.disabled = !roomStyleClipboard;
  const content = $('#room-editor-content'), scroll = content.scrollTop;
  const openSubs = new Set($$('.gauge-subsection[open] > summary', content).map(node => node.textContent.trim()));
  content.innerHTML = roomEditorMarkup(room); syncHeadPreview(panel, roomLight({ ...ROOM_DEFAULTS, ...room }).on);
  // Grouping sits on the panel's head, next to "default style" (only for a label with more than one part shown).
  const groupButton = $('#room-group-toggle');
  if (groupButton) { const shown = ROOM_LABEL_PARTS.filter(([, k]) => ({ ...ROOM_DEFAULTS, ...room })[k]).length; groupButton.hidden = shown <= 1; groupButton.classList.toggle('active', !!room.labelLinked); groupButton.setAttribute('aria-pressed', String(!!room.labelLinked)); groupButton.title = translateValue(room.labelLinked ? 'Rozgrupuj' : 'Grupuj'); groupButton.setAttribute('aria-label', groupButton.title); }
  if (!newlySelected) $$('.gauge-subsection > summary', content).forEach(node => { if (openSubs.has(node.textContent.trim())) node.parentElement.open = true; });
  const sections = $$('.editor-section', content);
  if (Number.isInteger(preserveSection) && preserveSection >= 0 && sections[preserveSection]) sections[preserveSection].open = true;
  sections.forEach((details, index) => details.addEventListener('toggle', () => {
    if (details.open) { roomEditorOpenSectionIndex = index; sections.forEach(other => { if (other !== details) other.removeAttribute('open'); }); }
    else if (roomEditorOpenSectionIndex === index) roomEditorOpenSectionIndex = -1;
  }));
  // A part's section name picked in the panel: that part is marked on the plan and (phone) zoomed to; closing it
  // goes back to the whole element.
  if (newlySelected) panelPart = null;
  sections.filter(d => d.classList.contains('part-section')).forEach(details => details.querySelector(':scope > summary')?.addEventListener('click', event => {
    if (event.target.closest('.section-tools')) return;
    const part = [...details.classList].find(c => c.startsWith('part-') && ROOM_LABEL_PARTS.some(([p]) => `part-${p}` === c))?.slice(5); if (!part) return;
    const opening = !details.open;
    if (opening) {
      panelPart = { roomId: room.id, part }; selectedLabelPart = part; renderRoomLabels(); markPartSection(part);
      requestAnimationFrame(() => { const box = partFocusBox(room, part); if (box) focusSceneBoxOnMobile(box); });
    } else {
      panelPart = null; renderRoomLabels();
      requestAnimationFrame(() => focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []));
    }
  }));
  $$('input,select', content).forEach(input => {
    if (input.type === 'range' || input.type === 'color') { input.addEventListener('input', onRoomEditorInput); input.addEventListener('change', onRoomEditorInput); }
    else if (input.id !== 'room-entity-search' && input.id !== 'extra-entity-search') input.addEventListener('change', onRoomEditorInput);
  });
  $('#room-entity-search')?.addEventListener('input', renderRoomEntityResults); renderRoomEntityResults();
  $('#extra-entity-search')?.addEventListener('input', renderExtraEntityResults);
  content.scrollTop = scroll;
  panel.classList.add('visible'); panel.setAttribute('aria-hidden', 'false'); renderRooms();
  if (pendingPartFocus?.roomId === room.id) { const part = pendingPartFocus.part; pendingPartFocus = null; requestAnimationFrame(() => focusPartSection(part)); }
  else if (!room.labelLinked) markPartSection(selectedLabelPart);
  if (newlySelected && !skipRoomFocus) requestAnimationFrame(() => requestAnimationFrame(() => { focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []); renderRoomEditLayer(); }));
  requestAnimationFrame(() => { const outline = $('#room-edit-layer .room-outline.selected'); if (outline && !mobileView() && !panel.dataset.dragged) placeEditorNear(panel, outline); });
}
function closeRoomEditor() {
  selectedCorner = null;
  const panel = $('#room-editor'); if (!panel) return;
  if (mobileView() && editMode && panel.classList.contains('visible')) requestAnimationFrame(applyViewTransform);
  const had = selectedRoomId; selectedRoomId = null; panelPart = null; roomPreviewOn = ''; delete panel.dataset.dragged;
  panel.classList.remove('visible'); panel.setAttribute('aria-hidden', 'true'); if (had) renderRooms();
}
function onRoomEditorInput(event) {
  const room = roomsOf()[selectedRoomId], input = event.target; if (!room) return;
  const path = input.dataset.path; if (!path) return;
  let value = input.type === 'checkbox' ? input.checked : input.value;
  if (input.dataset.valueType === 'range' || input.dataset.valueType === 'number') { value = Number(value); if (!Number.isFinite(value)) return; }
  if (input.type === 'color') { value = String(value).toUpperCase(); const preview = input.closest('.color-picker')?.querySelector('.color-current'); if (preview) preview.style.background = value; }
  if (path === 'previewOn') { roomPreviewOn = String(value); renderRooms(); return; }
  if (path === 'dashW' || path === 'dashH') {
    const span = dashSpan(room), g = dashGrid(); if (!span) return;
    const d = room.dash, w = clamp(Math.round(path === 'dashW' ? value : d.w), 1, g.cols), h = clamp(Math.round(path === 'dashH' ? value : d.h), 1, g.rows);
    room.dash = { c: clamp(d.c, 0, g.cols - w), r: clamp(d.r, 0, g.rows - h), w, h }; const s2 = dashSpan(room);
    room.x = Math.round((s2.x + s2.w / 2) * 100) / 100; room.y = Math.round((s2.y + s2.h / 2) * 100) / 100; room.updatedAt = new Date().toISOString();
    const output = input.closest('.control')?.querySelector('output'); if (output) output.textContent = input.value;
    renderRooms(); if (event.type === 'change') scheduleSave(true); return;
  }
  if (path === 'labelSizeUi') {
    // The group's frame keeps its size on the plan: only the icon, name and state inside get smaller / bigger
    // (the frame grows only when the content no longer fits). Its size is taken once, when the slider is grabbed.
    const card = room.labelLinked && !(isIconRoom(room) && dashSpan(room)) ? document.querySelector(`.room-label-card[data-room-id="${CSS.escape(room.id)}"]`) : null, oldScale = clamp(Number(room.labelCardScale) || 1, .3, 4.5);
    if (card && !input._frame) { input._frame = { w: card.offsetWidth * oldScale, h: card.offsetHeight * oldScale }; input.addEventListener('change', () => { delete input._frame; }, { once:true }); }
    room.labelCardScale = Math.round(clamp(value * labelScaleBase(room), .2, 4.5) * 1000) / 1000; room.updatedAt = new Date().toISOString();
    if (input._frame) { const k = clamp(room.labelCardScale, .3, 4.5); room.labelCardW = Math.round(input._frame.w / k * 10) / 10; room.labelCardH = Math.round(input._frame.h / k * 10) / 10; }
    const output = input.closest('.control')?.querySelector('output'); if (output) output.textContent = input.value + (output.dataset.suffix || '');
    renderRooms(); if (event.type === 'change') scheduleSave(true); return;
  }
  if (path === 'opacity') value = clamp(value / 100, .05, 1);
  if (path === 'thermoFillOpacity') value = clamp(value / 100, 0, 1);
  if (path === 'offOpacity') value = clamp(value / 100, 0, 1);
  if (/^label\w*Opacity(On|Off|_[a-z]+)?$|^outline\w*Opacity$/.test(path)) value = clamp(value / 100, 0, 1);
  if (/^labelIconName(On|Off)?$/.test(path)) value = String(value).trim();
  if (path === 'labelIconName') value = String(value).trim();
  if (path === 'name') { value = String(value).trim() || translateValue(isTextRoom(room) ? 'Tekst' : isIconRoom(room) ? 'Etykieta' : 'Pomieszczenie'); $('#room-editor-title').textContent = value; const icon = model.entities[roomIconId(room.id)]; if (icon) { icon.displayName = value; renderMarkers(); } }
  if (path === 'textCaption' && String(value).trim() && !room.labelState) { room.labelState = true; if (room.labelAutoUngrouped) regroupAutoLabel(room); input.dataset.editorRefresh = 'true'; }
  room[path] = value; room.updatedAt = new Date().toISOString();
  const output = input.closest('.control')?.querySelector('output'); if (output) output.textContent = input.value + (output.dataset.suffix || '');
  renderRooms();
  if (input.dataset.editorRefresh === 'true') { openRoomEditor(room.id); scheduleSave(true); return; }
  scheduleSave(event.type === 'change');
}
// Thermostat templates (up to 5, shared by all views): the whole look and arrangement of a thermostat, saved from one and
// loaded into another with one tap. The trash button switches the slots to "delete" for one tap.
const THERMO_TEMPLATE_MAX = 5;
let thermoTemplateDelete = false;
const isThermoLookKey = key => /^(label|thermo[A-Z_])/.test(key) && !['labelCardX','labelCardY','labelAutoUngrouped'].includes(key);
function thermoTemplates() { return Array.isArray(model.settings?.thermoTemplates) ? model.settings.thermoTemplates.slice(0, THERMO_TEMPLATE_MAX) : []; }
function thermoTemplatesRow() {
  const list = thermoTemplates(), esc = v => escapeHtml(translateValue(v));
  const slots = Array.from({ length: THERMO_TEMPLATE_MAX }, (_, i) => { const has = !!list[i]; return `<button type="button" class="room-card-preset thermo-tpl${has ? ' filled' : ''}${thermoTemplateDelete && has ? ' deleting' : ''}" data-thermo-template="${i}"${has ? '' : ' disabled'} title="${esc(has ? (thermoTemplateDelete ? 'Usuń szablon' : 'Wczytaj szablon') : 'Pusty')} ${i + 1}" aria-label="${esc('Szablon')} ${i + 1}"><i class="mdi mdi-numeric-${i + 1}-box${has ? '' : '-outline'}"></i></button>`; }).join('');
  return `<div class="control room-card-row thermo-templates"><label>${esc('Szablony')}</label><div class="room-card-presets"><button type="button" class="room-card-preset" data-thermo-template-save title="${esc('Zapisz aktualny układ jako szablon')}" aria-label="${esc('Zapisz aktualny układ jako szablon')}"><i class="mdi mdi-content-save-outline"></i></button>${slots}<button type="button" class="room-card-preset${thermoTemplateDelete ? ' active' : ''}" data-thermo-template-trash${list.length ? '' : ' disabled'} title="${esc('Usuń szablon')}" aria-label="${esc('Usuń szablon')}"><i class="mdi mdi-delete-outline"></i></button></div></div>`;
}
function onThermoTemplateClick(event) {
  const save = event.target.closest('[data-thermo-template-save]'), trash = event.target.closest('[data-thermo-template-trash]'), slot = event.target.closest('[data-thermo-template]');
  if (!save && !trash && !slot) return false;
  event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room || !isThermoRoom(room)) return true;
  model.settings ||= {}; const list = thermoTemplates();
  if (trash) { thermoTemplateDelete = !thermoTemplateDelete; }
  else if (save) {
    if (list.length >= THERMO_TEMPLATE_MAX) { notify('Maks. 5 szablonów — usuń któryś koszem', true); return true; }
    list.push(Object.fromEntries(Object.entries(clone(room)).filter(([key]) => isThermoLookKey(key)))); model.settings.thermoTemplates = list; thermoTemplateDelete = false;
    scheduleSave(true); notify(`${translateValue('Zapisano szablon')} ${list.length}`);
  } else {
    const i = Number(slot.dataset.thermoTemplate), tpl = list[i]; if (!tpl) return true;
    if (thermoTemplateDelete) { list.splice(i, 1); model.settings.thermoTemplates = list; thermoTemplateDelete = false; scheduleSave(true); notify(`${translateValue('Usunięto szablon')} ${i + 1}`); }
    else {
      Object.keys(room).filter(isThermoLookKey).forEach(key => delete room[key]);
      Object.assign(room, Object.fromEntries(Object.keys(ROOM_DEFAULTS).filter(isThermoLookKey).map(key => [key, clone(ROOM_DEFAULTS[key])])), clone(tpl));
      delete room.labelAutoUngrouped; room.updatedAt = new Date().toISOString(); renderRooms(); scheduleSave(true); notify(`${translateValue('Wczytano szablon')} ${i + 1}`);
    }
  }
  openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); return true;
}
function onRoomEditorClick(event) {
  if (onThermoTemplateClick(event)) return;
  const extraAdd = event.target.closest('[data-extra-add]');
  if (extraAdd) { event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (room) addExtraEntity(room, extraAdd.dataset.extraAdd); return; }
  const extraRemove = event.target.closest('[data-extra-remove]');
  if (extraRemove) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return; const k = extraRemove.dataset.extraRemove;
    room[k] = false; delete room[`${k}Entity`]; room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); return;
  }
  // Thermostat modes: move one up / down in the order shown.
  const modeMove = event.target.closest('[data-mode-move]');
  if (modeMove) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    const [m, dir] = modeMove.dataset.modeMove.split('|'), list = thermoModesOrdered(room, climateInfo({ entityId: (room.entityIds || [])[0] || '' }).modes, false), i = list.indexOf(m), j = i + Number(dir);
    if (i < 0 || j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]];
    room.thermoModesOrder = list; room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); return;
  }
  const dashPin = event.target.closest('[data-dash-pin]'), dashUnpin = event.target.closest('[data-dash-unpin]');
  if (dashPin || dashUnpin) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    if (dashPin) pinToDash(room); else { const [x, y] = roomAnchor(room); room.x = Math.round(x * 100) / 100; room.y = Math.round(y * 100) / 100; delete room.dash; }
    room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); return;
  }
  const partToggle = event.target.closest('[data-part-toggle]');
  if (partToggle) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return; const key = partToggle.dataset.partToggle;
    // At least one of icon / name / state stays visible.
    const partKeys = ROOM_LABEL_PARTS.map(([, k]) => k);
    if (key === 'labelMinus' && isThermoRoom(room) && partToggle.closest('.group-tight')) room.labelPlus = !room.labelMinus;
    if (partKeys.includes(key) && room[key] && partKeys.filter(k => room[k]).length <= 1) return notify('Co najmniej jedna część musi być widoczna');
    if (key === 'labelLinked') { keepLabelPlaceOnRegroup(room); togglePartFrames(room, !room.labelLinked); delete room.labelAutoUngrouped; }
    // Hiding all but one part ungroups it, so the remaining part gets its own resize handles (a one-part group has none).
    const parts = partKeys;
    if (parts.includes(key) && room[key] && room.labelLinked && parts.filter(k => room[k]).length === 2) autoUngroupLabel(room);
    // Showing a part again: an automatically ungrouped label becomes the group it was; otherwise the shown part is
    // moved off the parts it would cover.
    const showing = parts.includes(key) && !room[key];
    if (showing && !room.labelLinked && room.labelAutoUngrouped) regroupAutoLabel(room);
    room[key] = !room[key]; room.updatedAt = new Date().toISOString(); renderRooms();
    if (showing && !room.labelLinked) { const part = ROOM_LABEL_PARTS.find(([, k]) => k === key)?.[0]; if (part) keepApart(room, key, part); }
    openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); return;
  }
  const layoutButton = event.target.closest('[data-card-layout]'), styleButton = event.target.closest('[data-card-style]'), alignButton = event.target.closest('[data-card-align]');
  if (layoutButton || styleButton || alignButton) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    if (layoutButton) { room.labelCardLayout = layoutButton.dataset.cardLayout; room.labelCardFree = false; } // a chosen layout replaces the free arrangement
    else if (alignButton) room.labelCardAlign = alignButton.dataset.cardAlign;
    else Object.assign(room, ROOM_CARD_STYLES.find(([value]) => value === styleButton.dataset.cardStyle)?.[2](room) || {});
    room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); return;
  }
  const previewButton = event.target.closest('[data-preview-path="previewOn"]');
  if (previewButton) { event.preventDefault(); const value = previewButton.dataset.previewValue; roomPreviewOn = roomPreviewOn === value ? '' : value; renderRooms(); if (selectedRoomId) openRoomEditor(selectedRoomId, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); return; }
  const iconAction = event.target.closest('[data-room-icon]')?.dataset.roomIcon;
  if (iconAction) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    if (iconAction === 'add') addRoomIcon(room);
    else if (iconAction === 'edit') editRoomIcon(room);
    else if (iconAction === 'remove' && removeRoomIcon(activeSceneView(), room.id)) { renderMarkers(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); notify('Usunięto ikonę pomieszczenia'); }
    return;
  }
  const addId = event.target.closest('[data-room-add]')?.dataset.roomAdd, removeId = event.target.closest('[data-room-remove]')?.dataset.roomRemove;
  if (addId || removeId) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    const ids = new Set(addId ? [] : room.entityIds || []); if (addId) ids.add(addId); if (removeId) ids.delete(removeId);
    room.entityIds = [...ids]; room.updatedAt = new Date().toISOString();
    refreshStates(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true);
    return;
  }
  const toggle = event.target.closest('[data-color-toggle]'), swatch = event.target.closest('[data-palette-color]'), rgb = event.target.closest('[data-rgb-color]'), content = $('#room-editor-content');
  const reset = event.target.closest('[data-reset-path]');
  if (reset) { event.preventDefault(); const input = content.querySelector(`input[data-path="${CSS.escape(reset.dataset.resetPath)}"]`), defaults = { opacity: ROOM_DEFAULTS.opacity * 100, offOpacity: ROOM_DEFAULTS.offOpacity * 100, feather: ROOM_DEFAULTS.feather, ...Object.fromEntries(ROOM_LABEL_PARTS.flatMap(([, k]) => [[`${k}Size`, ROOM_DEFAULTS[`${k}Size`]], [`${k}X`, ROOM_DEFAULTS[`${k}X`]], [`${k}Y`, ROOM_DEFAULTS[`${k}Y`]], [`${k}BgOpacity`, ROOM_DEFAULTS[`${k}BgOpacity`] * 100]])), labelIconOpacityOn: 100, labelIconOpacityOff: 100, labelIconOutlineWidth: 1.5, labelCardBgOpacity: 62, labelCardBorderOpacity: 30, labelCardBgOnOpacity: 62, labelCardBgOffOpacity: 62, labelCardBorderOnOpacity: 70, labelCardBorderOffOpacity: 30, labelCardBorderOnWidth: 1.5, labelCardBorderOffWidth: 1, labelIconBorderOpacity: 60, labelIconBorderWidth: 1.5, labelIconOpacity: 100, labelIconBgOnOpacity: 60, labelIconBgOffOpacity: 55, labelIconBorderOnOpacity: 80, labelIconBorderOffOpacity: 50, labelIconBorderOnWidth: 2, labelIconBorderOffWidth: 1.5, labelIconOutlineOnWidth: 1.5, labelIconOutlineOffWidth: 1.5, labelIconOutlineOpacity: 100, labelIconOutlineOnOpacity: 100, labelIconOutlineOffOpacity: 100, labelIconRadius: 10, labelIconPadding: 6, labelCardBorderWidth: 1, labelCardRadius: 14, labelCardPadding: 10, labelCardGap: 4, labelCardScale: 1, labelCardX: 0, labelCardY: 0, labelIconDX: 0, labelIconDY: 0, labelNameDX: 0, labelNameDY: 0, labelStateDX: 0, labelStateDY: 0, lightX: 50, lightY: 50, lightWallPos: 50, lightSpread: ROOM_DEFAULTS.lightSpread, lightFill: ROOM_DEFAULTS.lightFill }; const path = reset.dataset.resetPath, room = roomsOf()[selectedRoomId];
    if (input && path in defaults) { input.value = defaults[path]; input.dispatchEvent(new Event('change', { bubbles:true })); return; }
    if (room && path === 'labelSizeUi' && input) { input.value = 1; input.dispatchEvent(new Event('change', { bubbles:true })); return; }
    // Text frame corners / margin have no fixed default (they grow with the text): reset = back to automatic.
    if (room && /^label(Name|State)(Radius|Padding)$/.test(path)) { delete room[path]; room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id, openSectionIndex(content, roomEditorOpenSectionIndex)); scheduleSave(true); return; }
    // Any other slider goes back to its default (opacities are shown in %).
    if (input && path in ROOM_DEFAULTS) { const base = Number(ROOM_DEFAULTS[path]); input.value = /Opacity/.test(path) ? Math.round(base * 100) : base; input.dispatchEvent(new Event('change', { bubbles:true })); }
    return; }
  if (toggle) { event.preventDefault(); const menu = toggle.closest('.color-picker').querySelector('.color-menu'), open = menu.classList.contains('visible'); $$('.color-menu', content).forEach(x => x.classList.remove('visible')); menu.classList.toggle('visible', !open); return; }
  if (swatch) { event.preventDefault(); const picker = swatch.closest('.color-picker'), input = $('.color-native', picker); input.value = swatch.dataset.paletteColor; $('.color-current', picker).style.background = input.value; $('.color-menu', picker).classList.remove('visible'); input.dispatchEvent(new Event('change', { bubbles:true })); return; }
  if (rgb) { event.preventDefault(); rgb.closest('.color-picker').querySelector('.color-native').click(); }
}
async function removeRoom() {
  const view = activeSceneView(), room = view?.rooms?.[selectedRoomId]; if (!room) return;
  const label = isIconRoom(room);
  if (!await appConfirm(label ? { title:'Usunąć etykietę?', message:`Etykieta „${room.name}” zostanie usunięta z tego widoku. Encja zostaje.`, confirmText:'Usuń', danger:true }
    : { title:'Usunąć pomieszczenie?', message:`Pomieszczenie „${room.name}” zostanie usunięte z tego widoku. Encje i markery zostają.`, confirmText:'Usuń', danger:true })) return;
  delete view.rooms[room.id]; closeRoomEditor(); if (removeRoomIcon(view, room.id)) renderMarkers(); renderRooms(); scheduleSave(true); notify(label ? 'Usunięto etykietę' : 'Usunięto pomieszczenie');
}
// Tapping a room in view mode: toggles its lights/switches (all off when any is on, otherwise all on),
// or opens More Info of its first entity.
const roomTogglesInFlight = new Set();
let lastLabelTap = 0;
async function onRoomTap(room, action = null) {
  if (isTextRoom(room)) return runLinkAction(room);
  const r = { ...ROOM_DEFAULTS, ...room, ...(action ? { tapAction: action } : {}) }, ids = r.entityIds || [];
  if (!ids.length) { if (!isViewer()) notify(isIconRoom(room) ? 'Ta etykieta nie ma jeszcze encji — wybierz ją w trybie edycji' : 'To pomieszczenie nie ma jeszcze encji — wybierz je w trybie edycji'); return; }
  const toggleable = ids.filter(id => isToggleableMarker({ entityId: id }));
  if (r.tapAction === 'none') return;
  if (r.tapAction === 'more_info' || !toggleable.length) return openMoreInfo(toggleable[0] || ids[0]);
  if (roomTogglesInFlight.has(r.id)) return;
  const anyOn = toggleable.some(id => String(stateCache[id]?.state || '').toLowerCase() === 'on'), expected = anyOn ? 'off' : 'on';
  roomTogglesInFlight.add(r.id);
  toggleable.forEach(id => { pendingToggleStates.set(id, expected); stateCache[id] = { ...(stateCache[id] || { entity_id:id, attributes:{} }), state:expected }; });
  renderRooms(); toggleable.forEach(id => { if (markersForEntity(id).length) renderMarkerState(id, stateCache[id]); });
  try { await Promise.all(toggleable.map(id => api('control', jsonOptions({ entity_id:id, action: expected === 'on' ? 'turn_on' : 'turn_off' })))); }
  catch (error) { notify(`Błąd przełączania: ${error.message}`, true); }
  // The room accepts the next tap as soon as the command is sent; the expected state is kept a moment longer
  // so a late, stale update does not flip it back.
  roomTogglesInFlight.delete(r.id);
  await delay(700); toggleable.forEach(id => { if (pendingToggleStates.get(id) === expected) pendingToggleStates.delete(id); }); refreshStates();
}
function toggleRoomLock() { const room = roomsOf()[selectedRoomId]; if (!room) return; room.geometryLocked = !room.geometryLocked; room.updatedAt = new Date().toISOString(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true); notify(room.geometryLocked ? 'Zablokowano geometrię' : 'Odblokowano geometrię'); }
// Every look setting of a room / label / thermostat: the style list plus every label part and thermostat option.
const roomLookKey = key => ROOM_STYLE_KEYS.includes(key) || (/^(label|thermo[A-Z_])/.test(key) && !/^labelX\d(Entity)?$/.test(key) && !['labelCardX','labelCardY','labelAutoUngrouped'].includes(key));
function copyRoomStyle() { const room = roomsOf()[selectedRoomId]; if (!room) return; roomStyleClipboard = Object.fromEntries(Object.keys(room).filter(roomLookKey).map(key => [key, clone(room[key])])); roomStyleClipboard.__thermo = isThermoRoom(room); const paste = $('#room-paste-style'); if (paste) paste.disabled = false; notify('Skopiowano styl pomieszczenia — wklej go w innym pomieszczeniu'); }
// Pasting a style keeps where the target stands: the label / part offsets from its point are its own (a room's label
// offsets would move a plain label away); only looks (and the group's inner arrangement) are taken over.
const isLabelPositionKey = key => key.startsWith('label') && /[XY]$/.test(key) && !/F[XY]$/.test(key);
function pasteRoomStyle() {
  const room = roomsOf()[selectedRoomId]; if (!room || !roomStyleClipboard) return;
  // Thermostat → thermostat is 1:1 (the parts' places too); otherwise the target keeps its own label / part offsets.
  const exact = roomStyleClipboard.__thermo && isThermoRoom(room), keep = key => exact ? false : isLabelPositionKey(key);
  Object.keys(room).filter(key => roomLookKey(key) && !keep(key)).forEach(key => delete room[key]);
  if (exact) Object.assign(room, Object.fromEntries(Object.keys(ROOM_DEFAULTS).filter(roomLookKey).map(key => [key, clone(ROOM_DEFAULTS[key])])));
  Object.assign(room, Object.fromEntries(Object.entries(clone(roomStyleClipboard)).filter(([key]) => key !== '__thermo' && !keep(key))), { updatedAt:new Date().toISOString() });
  delete room.labelAutoUngrouped; renderRooms(); openRoomEditor(room.id); scheduleSave(true); notify('Wklejono styl pomieszczenia');
}
// "Default look" is the look of a freshly added room / icon (label visible, grouped, icon with outline and frame),
// not the bare defaults of the data model, in which every label part is hidden.
async function resetRoomStyle() {
  const room = roomsOf()[selectedRoomId]; if (!room) return; const icon = isIconRoom(room);
  if (!await appConfirm({ title:'Przywrócić domyślny wygląd?', message: icon ? 'Wygląd i akcja dotknięcia etykiety wrócą do domyślnych. Położenie, nazwa i encja zostaną.' : 'Wygląd i akcja dotknięcia pomieszczenia wrócą do domyślnych. Kształt, nazwa i encje zostaną.', confirmText:'Przywróć', danger:true })) return;
  ROOM_STYLE_KEYS.forEach(key => delete room[key]);
  Object.assign(room, Object.fromEntries(ROOM_STYLE_KEYS.filter(key => key in ROOM_DEFAULTS).map(key => [key, clone(ROOM_DEFAULTS[key])])), NEW_ROOM_LABEL, icon ? { labelCardScale:ICON_LABEL_SCALE } : {}, isThermoRoom(room) ? thermoLook() : {});
  // A thermostat gets its whole look back: every part's colours, frames, sizes and places, the mode colours and the dial.
  if (isThermoRoom(room)) { const extras = Object.fromEntries(Object.keys(room).filter(k => /^labelX\d(Entity)?$/.test(k)).map(k => [k, room[k]])); Object.keys(room).filter(k => /^(label|thermo[A-Z_])/.test(k)).forEach(k => delete room[k]); Object.assign(room, extras); Object.assign(room, Object.fromEntries(Object.keys(ROOM_DEFAULTS).filter(k => /^(label|thermo[A-Z_])/.test(k)).map(k => [k, clone(ROOM_DEFAULTS[k])])), thermoLook()); }
  room.updatedAt = new Date().toISOString(); renderRooms(); if (!icon) fitRoomLabel(room.id); openRoomEditor(room.id); scheduleSave(true);
  notify(isThermoRoom(room) ? 'Przywrócono domyślny wygląd termostatu' : icon ? 'Przywrócono domyślny wygląd etykiety' : 'Przywrócono domyślny wygląd pomieszczenia');
}
function duplicateRoom() {
  const view = activeSceneView(), room = view?.rooms?.[selectedRoomId]; if (!room) return;
  const id = 'room_' + uid(), now = new Date().toISOString(), copy = clone(room);
  if (isIconRoom(room)) { Object.assign(copy, { id, name: `${room.name} (${translateValue('kopia')})`, x: clamp((Number(room.x) || 50) + 3, 0, 100), y: clamp((Number(room.y) || 50) + 3, 0, 100), geometryLocked:false, createdAt:now, updatedAt:now }); view.rooms[id] = copy; renderRooms(); openRoomEditor(id); scheduleSave(true); return notify('Utworzono kopię etykiety'); }
  const xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
  const dx = Math.max(...xs) + 3 <= 100 ? 3 : -3, dy = Math.max(...ys) + 3 <= 100 ? 3 : -3;
  Object.assign(copy, { id, name: `${room.name} (${translateValue('kopia')})`, points: room.points.map(([x, y]) => [clamp(x + dx, 0, 100), clamp(y + dy, 0, 100)]), geometryLocked:false, createdAt:now, updatedAt:now });
  view.rooms[id] = copy; renderRooms(); openRoomEditor(id); scheduleSave(true); notify(isIconRoom(copy) ? 'Utworzono kopię etykiety' : 'Utworzono kopię pomieszczenia — przeciągnij ją w wybrane miejsce');
}
// ---- Room icon: a regular "icon" marker bound to the room (full marker editor, drag, lock, styles).
// Its entity is virtual ("room.<room id>"): ON while the room is lit, OFF otherwise; tapping it runs the room action.
const ROOM_ICON_DOMAIN = 'room';
function roomIconId(roomId) { return `${ROOM_ICON_DOMAIN}.${roomId}`; }
function isRoomIconId(entityId) { return String(entityId || '').startsWith(`${ROOM_ICON_DOMAIN}.`); }
// ---- Text / button elements (no Home Assistant entity) -------------------------------------------
// A marker with a virtual id "hav_text.<uid>": a Badge or Icon that shows its own text and, when tapped in view,
// goes to another HA Views view, opens a Home Assistant page (same-origin navigation) or opens a link.
const TEXT_DOMAIN = 'hav_text';
const LINK_ACTIONS = [['none','Brak akcji'],['view','Przejdź do widoku'],['ha','Otwórz stronę Home Assistant'],['url','Otwórz link']];
function isTextId(entityId) { return String(entityId || '').startsWith(`${TEXT_DOMAIN}.`); }
function isVirtualId(entityId) { return isRoomIconId(entityId) || isTextId(entityId); }
function linkControls(marker) {
  const action = LINK_ACTIONS.some(([v]) => v === marker.linkAction) ? marker.linkAction : 'none';
  let target = '';
  if (action === 'view') target = control('Widok','linkView','select',marker.linkView || '',{ items:[['','—'], ...model.viewOrder.filter(id => model.views[id]).map(id => [id, escapeHtml(model.views[id].name || id)])] });
  if (action === 'ha') target = control('Adres w HA','linkPath','text',marker.linkPath || '');
  if (action === 'url') target = control('Link','linkUrl','text',marker.linkUrl || '') + control('W nowej karcie','linkNewTab','checkbox',marker.linkNewTab !== false);
  return control('Dotknięcie w widoku','linkAction','select',action,{ items:LINK_ACTIONS, refresh:true }) + target;
}
function addTextElement(at = null) {
  if (!editMode) return;
  closeCompactMenus(); closeFlowEditor(); closeRoomEditor();
  const id = `${TEXT_DOMAIN}.${uid()}`, now = new Date().toISOString();
  model.entities[id] = { id, entityId:id, integrationId:'', integrationName: translateValue('Tekst / przycisk'), sourceDomain: TEXT_DOMAIN, displayName:'', textValue: translateValue('Tekst'),
    unitOverride:'', decimals:'auto', stateOnLabel:'', stateOffLabel:'', iconMode:'manual', iconName:'mdi:gesture-tap-button', iconOn:'mdi:gesture-tap-button', iconOff:'mdi:gesture-tap-button', iconVariantEnabled:false,
    tapAction:'none', linkAction:'none', xPercent: at?.[0] ?? 50, yPercent: at?.[1] ?? 50, type:'badge', style: normalizedStyle('badge', { width:200, height:76, showLabel:false, showIcon:false }), createdAt:now, updatedAt:now };
  renderMarkers(); renderAdded(); scheduleSave(true); selectMarker(id); notify('Dodano tekst — przeciągnij go w wybrane miejsce');
}
// Navigates the Home Assistant window this page is embedded in (same origin), like a dashboard "navigate" action.
function navigateHomeAssistant(path) {
  path = String(path || '').trim(); if (!path.startsWith('/')) path = `/${path}`;
  try { const top = window.top; if (top && top !== window && top.location.origin === location.origin) { top.history.pushState(null, '', path); top.dispatchEvent(new CustomEvent('location-changed', { detail:{ replace:false } })); return; } } catch {}
  window.location.assign(path);
}
function runLinkAction(marker) {
  const action = marker.linkAction || 'none';
  if (action === 'view' && model.views[marker.linkView]) { showMainView('overview'); return switchSceneView(marker.linkView); }
  if (action === 'ha' && marker.linkPath) return navigateHomeAssistant(marker.linkPath);
  if (action === 'url' && /^https?:\/\//i.test(String(marker.linkUrl || '').trim())) {
    const url = String(marker.linkUrl).trim();
    if (marker.linkNewTab !== false) return window.open(url, '_blank', 'noopener');
    try { window.top.location.href = url; } catch { window.location.href = url; }
  }
}
// ---- Link to a view ------------------------------------------------------------------------------
// "?view=<name or id>" in the Home Assistant address (e.g. /app/<slug>?view=parter) opens HA Views on that view.
function viewSlug(name) { return String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function hostLocation() { try { if (window.top && window.top !== window && window.top.location.origin === location.origin) return window.top.location; } catch {} return window.location; }
function viewFromLink() {
  let wanted = ''; try { const loc = hostLocation(); wanted = new URLSearchParams(loc.search).get('view') || new URLSearchParams(String(loc.hash || '').replace(/^#/, '')).get('view') || ''; } catch {}
  wanted = wanted.trim(); if (!wanted) return '';
  if (model.views?.[wanted]) return wanted;
  const slug = viewSlug(wanted); return (model.viewOrder || []).find(id => model.views[id] && viewSlug(model.views[id].name) === slug) || '';
}
function viewLink(id = model.activeViewId) {
  const view = model.views[id], loc = hostLocation(), slug = viewSlug(view?.name);
  const unique = slug && (model.viewOrder || []).filter(other => viewSlug(model.views[other]?.name) === slug).length === 1;
  return `${loc.origin}${loc.pathname}?view=${encodeURIComponent(unique ? slug : id)}`;
}
async function copyViewLink() {
  const link = viewLink(); let copied = false;
  try { await navigator.clipboard.writeText(link); copied = true; } catch {}
  if (!copied) { try { const area = document.createElement('textarea'); area.value = link; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); copied = document.execCommand('copy'); area.remove(); } catch {} }
  els.confirmInput.maxLength = 500;
  await appPrompt({ title:'Link do tego widoku', message: translateValue(copied ? 'Skopiowano do schowka. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.' : 'Skopiuj link. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.'), value: link, confirmText:'OK' });
  els.confirmInput.maxLength = 60;
}
function syncRoomIconStates() {
  Object.values(model.views || {}).forEach(view => Object.values(view.rooms || {}).forEach(room => {
    const id = roomIconId(room.id); if (!view.entities?.[id]) return;
    const light = roomLight({ ...ROOM_DEFAULTS, ...room }), state = light.on ? 'on' : 'off', previous = stateCache[id]?.state;
    stateCache[id] = { entity_id:id, state, attributes:{ friendly_name: room.name || id }, last_changed: previous === state ? stateCache[id]?.last_changed : new Date().toISOString() };
    if (previous !== state && view === activeSceneView()) renderMarkerState(id, stateCache[id]);
  }));
}
function roomCentroid(points) { const n = Math.max(1, points.length); return [points.reduce((sum, p) => sum + p[0], 0) / n, points.reduce((sum, p) => sum + p[1], 0) / n]; }
function addRoomIcon(room) {
  const id = roomIconId(room.id); if (model.entities[id]) return editRoomIcon(room);
  const [x, y] = roomCentroid(room.points || [[50, 50]]), now = new Date().toISOString();
  model.entities[id] = { id, entityId:id, roomId: room.id, integrationId:'', integrationName: translateValue('Pomieszczenie'), sourceDomain: ROOM_ICON_DOMAIN, displayName: room.name || translateValue('Pomieszczenie'),
    unitOverride:'', decimals:'auto', stateOnLabel:'', stateOffLabel:'', iconMode:'manual', iconName:'mdi:lightbulb-group', iconOn:'mdi:lightbulb-group', iconOff:'mdi:lightbulb-group-off', iconVariantEnabled:true,
    tapAction: room.tapAction || 'toggle', xPercent: Math.round(x * 100) / 100, yPercent: Math.round(y * 100) / 100, type:'icon', style: normalizedStyle('icon', {}), createdAt:now, updatedAt:now };
  syncRoomIconStates(); renderMarkers(); scheduleSave(true); editRoomIcon(room); notify('Dodano ikonę pomieszczenia — przeciągnij ją w wybrane miejsce');
}
function editRoomIcon(room) { const id = roomIconId(room.id); if (!model.entities[id]) return; closeRoomEditor(); selectedId = id; renderMarkers(); openEditor(-1); }
function removeRoomIcon(view, roomId) { const id = roomIconId(roomId); if (!view?.entities?.[id]) return false; delete view.entities[id]; delete stateCache[id]; if (selectedId === id) closeEditor(); return true; }
function roomUsesEntity(entityId) { return Object.values(roomsOf()).some(room => (room.entityIds || []).includes(entityId) || EXTRA_PARTS.some(([, k]) => room[k] && room[`${k}Entity`] === entityId)); }
// ---- HA default panel -------------------------------------------------------------------
// Home Assistant opens: the user's default panel (Profile → "Panel", stored in frontend user data "core"),
// then the system default, then the per-device localStorage "defaultPanel", then Overview. Its picker lists
// only dashboards, but any panel is accepted — also this add-on's ingress panel. The page runs on the same
// origin as HA, so it can set either value through the HA frontend around it.
function haPanelContext() {
  try {
    const top = window.top; if (!top || top === window) return null;
    const hass = top.document.querySelector('home-assistant')?.hass, panels = hass?.panels || {};
    const pathname = decodeURIComponent(top.location.pathname), segments = pathname.split('/').filter(Boolean);
    // The panel is taken from HA's own panel list (never guessed from the URL shape: add-on panels live at
    // /<slug>, /app/<slug> or /hassio/ingress/<slug> depending on the HA version).
    const keys = Object.keys(panels);
    const appKeys = keys.filter(key => isAppPanel(panels[key]));
    const panel = appKeys.filter(key => pathname === `/${key}` || pathname.startsWith(`/${key}/`)).sort((a, b) => b.length - a.length)[0] || appKeys.find(key => segments.includes(key)) || '';
    if (!panel) return null;
    return { panel, hass, storage: top.localStorage };
  } catch { return null; }
}
// An add-on (app) panel as HA registers it: url_path = add-on slug, config.addon (older HA: config.ingress).
function isAppPanel(entry) { return Boolean(entry && (entry.config?.addon || entry.config?.ingress)); }
function haStartMode(context = haPanelContext()) {
  if (!context) return 'off';
  if (context.hass?.userData?.default_panel === context.panel) return 'user';
  try { if (JSON.parse(context.storage.getItem('defaultPanel') || 'null') === context.panel) return 'device'; } catch {}
  return 'off';
}
function syncHaStartSelect() {
  const row = $('#ha-start-row'), select = $('#ha-start-select'), context = haPanelContext();
  if (!row || !select) return; row.hidden = !context; if (context) select.value = haStartMode(context);
}
// A default panel that does not exist leaves HA on an endless spinner; beta.207 could write such a value.
async function repairBrokenDefaultPanel() {
  const context = haPanelContext(), hass = context?.hass, current = hass?.userData?.default_panel, panels = hass?.panels || {};
  if (!context || !current || !Object.keys(panels).length || panels[current] || !hass.connection) return;
  const userData = { ...hass.userData }; delete userData.default_panel;
  try { await hass.connection.sendMessagePromise({ type:'frontend/set_user_data', key:'core', value:userData }); notify('Naprawiono błędny domyślny panel HA — ustaw go ponownie w menu widoku'); } catch {}
  setTimeout(syncHaStartSelect, 300);
}
async function setHaStart(mode) {
  const context = haPanelContext(); if (!context) return notify('Ta opcja działa tylko w HA Views otwartym z panelu Home Assistant', true);
  const hass = context.hass, userData = { ...(hass?.userData || {}) };
  try {
    // Account level (all devices of this user): the same value HA's own Profile → Panel picker writes.
    if (mode === 'user' || userData.default_panel === context.panel) {
      if (!hass?.connection) throw new Error('brak połączenia z Home Assistant');
      if (mode === 'user') userData.default_panel = context.panel; else delete userData.default_panel;
      await hass.connection.sendMessagePromise({ type:'frontend/set_user_data', key:'core', value:userData });
    }
    if (mode === 'device') context.storage.setItem('defaultPanel', JSON.stringify(context.panel));
    else if (JSON.parse(context.storage.getItem('defaultPanel') || 'null') === context.panel) context.storage.removeItem('defaultPanel');
  } catch (error) { notify(`Nie udało się zapisać: ${error.message}`, true); return setTimeout(syncHaStartSelect, 300); }
  const other = mode === 'device' && ([hass?.userData?.default_panel, hass?.systemData?.default_panel].find(value => value && value !== context.panel));
  if (other) notify(`Zapisano, ale ustawiony jest też domyślny panel „${other}”, który ma pierwszeństwo — wybierz „HA Views (konto)” albo zmień Panel w profilu HA.`, true);
  else notify(mode === 'user' ? 'HA Views jest teraz domyślnym panelem na Twoim koncie' : mode === 'device' ? 'HA Views jest domyślnym panelem na tym urządzeniu' : 'Przywrócono domyślny panel z ustawień Home Assistant');
  setTimeout(syncHaStartSelect, 300);
}
// ---- Alignment guides while dragging (edit mode) --------------------------------------
// The dragged marker/Flow snaps to the edges and centres of the other elements of the view; a blue line
// shows what it is aligned with. Holding Alt (desktop) drags freely.
// Rooms add their own guides (centre and edges of the room's bounding box) in a different colour, for the
// room the dragged element sits in (and the room of a room icon), e.g. to put an icon right in the middle.
const SNAP_DEFAULTS = Object.freeze({ guides:true, visibleOnly:false, markers:true, labels:true, flows:true, rooms:true, centers:true, edges:true, spacing:true });
function snapTargets() { return { ...SNAP_DEFAULTS, ...(model.settings?.snapTargets || {}) }; }
function syncSnapMenu() {
  const t = snapTargets(); $$('[data-snap-key]').forEach(button => { const on = !!t[button.dataset.snapKey]; button.classList.toggle('active', on); button.setAttribute('aria-pressed', String(on)); });
  const selected = Boolean((selectedId && model.entities[selectedId]) || (selectedFlowId && activeSceneView()?.flows?.[selectedFlowId]) || (selectedRoomId && roomsOf()[selectedRoomId]));
  $$('[data-align]').forEach(button => { button.disabled = !selected; });
  syncRotateControls();
}
// ---- Rotation of the selected marker / Flow (snap menu) ---------------------------------------
// Buttons turn in steps (15° / 90°), the slider turns smoothly by 1°. Markers keep the angle in marker.rotation,
// Flows in flow.rotation (the same value as the Flow editor's Rotation slider). Rooms are not rotated.
function rotationTarget() {
  if (selectedId && model.entities[selectedId]) return model.entities[selectedId];
  if (selectedFlowId && !selectedId) return activeSceneView()?.flows?.[selectedFlowId] || null;
  return null;
}
const normalizeAngle = angle => { let a = Math.round(Number(angle) || 0) % 360; if (a > 180) a -= 360; if (a <= -180) a += 360; return a; };
function syncRotateControls() {
  const item = rotationTarget(), usable = Boolean(item && !item.geometryLocked), angle = Number(item?.rotation) || 0;
  $$('[data-rotate]').forEach(button => { button.disabled = !usable; });
  const range = $('#rotate-range'); if (range) { range.disabled = !usable; if (document.activeElement !== range) range.value = angle; }
  const out = $('#rotate-value'); if (out) out.textContent = `${angle}°`;
}
function setSelectedRotation(angle, save = true) {
  const item = rotationTarget(); if (!item || item.geometryLocked) return;
  item.rotation = normalizeAngle(angle); item.updatedAt = new Date().toISOString();
  if (selectedId) { const node = markerNode(selectedId); if (node) applyMarkerStyle(node, item); syncSelection(); } else { renderMarkers(); syncFlowSelection(); }
  const editorRoot = selectedId ? els.editorContent : els.flowEditorContent, input = editorRoot?.querySelector('input[data-path="rotation"]');
  if (input) { input.value = item.rotation; const output = input.parentElement.querySelector('output'); if (output) output.textContent = `${item.rotation}°`; }
  syncRotateControls(); scheduleSave(save);
}
// Moves the selected marker / Flow / room so its box touches an edge of the background or sits in its middle.
function alignSelectedToBackground(where) {
  const s = els.scene.getBoundingClientRect(); if (!s.width || !s.height) return;
  const shift = r => ({ x: where === 'left' ? s.left - r.left : where === 'right' ? s.right - r.right : where === 'hcenter' ? (s.left + s.right) / 2 - (r.left + r.right) / 2 : 0,
    y: where === 'top' ? s.top - r.top : where === 'bottom' ? s.bottom - r.bottom : where === 'vcenter' ? (s.top + s.bottom) / 2 - (r.top + r.bottom) / 2 : 0 });
  if (selectedRoomId && isIconRoom(roomsOf()[selectedRoomId])) {
    // An icon moves its point by the distance its label box has to travel.
    const room = roomsOf()[selectedRoomId], rects = $$(`#room-labels [data-room-id="${CSS.escape(room.id)}"]`).map(node => node.getBoundingClientRect()).filter(r => r.width); if (!rects.length) return;
    const d = shift({ left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), top: Math.min(...rects.map(r => r.top)), bottom: Math.max(...rects.map(r => r.bottom)) });
    room.x = Math.round(clamp((Number(room.x) || 50) + d.x / s.width * 100, 0, 100) * 1000) / 1000; room.y = Math.round(clamp((Number(room.y) || 50) + d.y / s.height * 100, 0, 100) * 1000) / 1000;
    room.updatedAt = new Date().toISOString(); renderRooms(); scheduleSave(true); return;
  }
  if (selectedRoomId && roomsOf()[selectedRoomId] && !isIconRoom(roomsOf()[selectedRoomId])) {
    const room = roomsOf()[selectedRoomId], xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
    const box = { left: s.left + Math.min(...xs) / 100 * s.width, right: s.left + Math.max(...xs) / 100 * s.width, top: s.top + Math.min(...ys) / 100 * s.height, bottom: s.top + Math.max(...ys) / 100 * s.height };
    const d = shift(box); room.points = room.points.map(([x, y]) => [Math.round(clamp(x + d.x / s.width * 100, 0, 100) * 1000) / 1000, Math.round(clamp(y + d.y / s.height * 100, 0, 100) * 1000) / 1000]); room.updatedAt = new Date().toISOString(); renderRooms(); scheduleSave(true); return;
  }
  const item = selectedId ? model.entities[selectedId] : activeSceneView()?.flows?.[selectedFlowId];
  const node = selectedId ? markerNode(selectedId) : $(`.flow-marker[data-flow-id="${CSS.escape(selectedFlowId || '')}"]`);
  if (!item || !node) return;
  const d = shift(node.getBoundingClientRect());
  item.xPercent = clamp(Number(item.xPercent) + d.x / s.width * 100, 0, 100); item.yPercent = clamp(Number(item.yPercent) + d.y / s.height * 100, 0, 100); item.updatedAt = new Date().toISOString();
  renderMarkers(); if (selectedId) syncSelection(); else syncFlowSelection(); scheduleSave(true);
}
// Snap targets shared by markers, Flows and rooms: every other marker / Flow, every room (its bounding box and
// its corners, so irregular walls line up too) and the background. Nothing depends on where the drag starts.
// Snapping uses only what is on screen (partly visible objects count): the window below the top bar, within the area
// the plan's card shows - a zoomed portrait plan may use the screen beyond the card (its clip margin).
function visibleSceneRect() {
  if (deskZoomExpanded()) return deskZoomRegion();
  const card = (els.sceneCard || els.viewport || els.scene).getBoundingClientRect(), margin = parseFloat(els.sceneCard?.style.getPropertyValue('--card-clip')) || 0;
  const expanded = !!els.sceneCard?.classList.contains('portrait-zoom-expanded'), m = expanded ? margin : 0, bar = $('.topbar')?.getBoundingClientRect().bottom || 0;
  return { left: Math.max(card.left - m, 0), top: Math.max(card.top - m, bar, 0), right: Math.min(card.right + m, innerWidth), bottom: Math.min(card.bottom + m, innerHeight) };
}
// An element's box with its corner radius (screen px), so a highlighted snap target has exactly the element's shape.
function shapedRect(node) { const r = node.getBoundingClientRect(), k = r.width / Math.max(1, node.offsetWidth), cs = getComputedStyle(node); const radius = node.classList.contains('marker') && node.style.borderRadius ? parseFloat(node.style.borderRadius) : parseFloat(cs.borderTopLeftRadius); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height, radius: /%$/.test(cs.borderTopLeftRadius) || /%$/.test(node.style.borderRadius || '') ? Math.min(r.width, r.height) / 2 : (radius || 0) * k }; }
// On screen or near it: elements just outside a zoomed view (half the view's size around it) still give guides.
function rectOnScreen(r, view = visibleSceneRect()) { const mx = (view.right - view.left) / 2, my = (view.bottom - view.top) / 2; return r.right > view.left - mx && r.left < view.right + mx && r.bottom > view.top - my && r.top < view.bottom + my; }
function guideTargets({ node = null, roomId = '' } = {}) {
  const scene = els.scene.getBoundingClientRect();
  const t = snapTargets(), points = (a, b) => [...(t.edges ? [a, b] : []), ...(t.centers ? [(a + b) / 2] : [])];
  // "Only visible": on a zoomed phone view the element snaps only to what is on screen, not to markers far outside it.
  // Every guide knows what it comes from, so its line has that kind's colour (wskaźnik / Flow / etykieta / pomieszczenie / tło).
  const view = visibleSceneRect(), onScreen = r => rectOnScreen(r, view);
  const elements = [];
  if (t.markers) $$('.marker', els.markers).forEach(other => elements.push([other, 'marker']));
  if (t.flows) $$('.flow-marker', els.markers).forEach(other => elements.push([other, 'flow']));
  // Labels: a group as a whole, or each ungrouped part (not the label of the room / label being moved).
  if (t.labels) $$('#room-labels .room-label-card, #room-labels .room-label-part').filter(other => other.dataset.roomId !== roomId).forEach(other => elements.push([other, 'label']));
  const targets = elements.filter(([other]) => other !== node && !other.contains(node) && other.offsetParent !== null && !(roomId && model.entities[other.dataset?.markerId]?.roomId === roomId)).map(([other, kind]) => [shapedRect(other), kind]).filter(([r]) => onScreen(r)).filter(([r]) => r.width);
  // Every guide carries the box it comes from (the snapped-to object is highlighted).
  const boxOf = r => ({ l: r.left - scene.left, r: r.right - scene.left, t: r.top - scene.top, b: r.bottom - scene.top, radius: r.radius });
  const xs = targets.flatMap(([r, kind]) => points(r.left, r.right).map(v => ({ v: v - scene.left, kind, box: boxOf(r), center: v === (r.left + r.right) / 2 })));
  const ys = targets.flatMap(([r, kind]) => points(r.top, r.bottom).map(v => ({ v: v - scene.top, kind, box: boxOf(r), center: v === (r.top + r.bottom) / 2 })));
  if (t.rooms) Object.values(roomsOf()).filter(room => room.id !== roomId && (room.points || []).length >= 3).forEach(room => {
    const px = room.points.map(p => p[0] / 100 * scene.width), py = room.points.map(p => p[1] / 100 * scene.height);
    const [minX, maxX, minY, maxY] = [Math.min(...px), Math.max(...px), Math.min(...py), Math.max(...py)];
    if (!onScreen({ left: scene.left + minX, right: scene.left + maxX, top: scene.top + minY, bottom: scene.top + maxY })) return;
    // A room's lines reach only across that room (span), not over the whole background.
    const box = { l: minX, r: maxX, t: minY, b: maxY }, gx = v => ({ v, room:true, kind:'room', box, span: [minY, maxY], center: v === (minX + maxX) / 2 }), gy = v => ({ v, room:true, kind:'room', box, span: [minX, maxX], center: v === (minY + maxY) / 2 });
    xs.push(...points(minX, maxX).map(gx)); ys.push(...points(minY, maxY).map(gy));
    if (t.edges) { px.forEach(v => { if (v > minX + .5 && v < maxX - .5) xs.push(gx(v)); }); py.forEach(v => { if (v > minY + .5 && v < maxY - .5) ys.push(gy(v)); }); }
  });
  // The visible edit grid: moved elements line up their edges / centres with its lines too.
  if (model.settings?.snapEnabled !== false && editMode) {
    const step = scene.width * gridVisual() / 100, cx = scene.width / 2, cy = scene.height / 2;
    if (step > 0) {
      for (let v = cx - Math.floor(cx / step) * step; v <= scene.width + .5; v += step) if (scene.left + v >= view.left - 1 && scene.left + v <= view.right + 1) xs.push({ v, kind: 'grid' });
      for (let v = cy - Math.floor(cy / step) * step; v <= scene.height + .5; v += step) if (scene.top + v >= view.top - 1 && scene.top + v <= view.bottom + 1) ys.push({ v, kind: 'grid' });
    }
  }
  return { scene, xs, ys, offsets: [...(t.centers ? [0] : []), ...(t.edges ? [-1, 1] : [])] };
}
function alignmentContext(node) {
  const own = node.getBoundingClientRect();
  return { ...guideTargets({ node }), halfW: own.width / 2, halfH: own.height / 2 };
}
function alignToGuides(context, xPercent, yPercent, event) {
  if (cameraPanning || !context || event?.altKey || !snapTargets().guides || !context.scene.width || !context.scene.height) { showAlignGuides([], []); return { xPercent, yPercent }; }
  // Fewer flashing lines with many elements: while the element is dragged fast nothing snaps (no lines); they appear once
  // the movement slows down near a line, and a caught line holds until the element is moved clearly away from it.
  const motion = context.motion ||= { t: 0, x: 0, y: 0, speed: 0, stick: { x: null, y: null } };
  if (event && Number.isFinite(event.clientX)) {
    const now = event.timeStamp || performance.now();
    if (motion.t) { const instant = Math.hypot(event.clientX - motion.x, event.clientY - motion.y) / Math.max(8, now - motion.t); motion.speed = motion.speed * .55 + instant * .45; }
    motion.t = now; motion.x = event.clientX; motion.y = event.clientY;
  }
  // Precise mode (label parts): lines are offered at any speed and let go sooner, so sliding a part past another
  // catches its left edge, centre and right edge one after another in a single movement.
  const precise = !!context.precise, slow = precise || motion.speed < (mobileView() ? .5 : .4), threshold = precise ? (mobileView() ? 10 : 7) : 6, release = precise ? (mobileView() ? 12 : 8) : 11, match = (axis, centre, half, values) => {
    const stuck = motion.stick[axis];
    if (stuck && Math.abs(centre + stuck.offset - stuck.line) <= release) return { ...stuck, centre: stuck.line - stuck.offset };
    motion.stick[axis] = null; if (!slow) return null;
    let best = null;
    (context.offsets || [0, -1, 1]).map(k => k * half).forEach(offset => values.forEach(({ v, room, bg, kind, box, span, center }) => { const distance = Math.abs(centre + offset - v); if (distance <= (center && !offset ? threshold * 1.7 : threshold) && (!best || distance < best.distance - .01 || (Math.abs(distance - best.distance) <= .01 && (room || bg) && !best.room && !best.bg))) best = { distance, centre: v - offset, line: v, offset, room, bg, kind, box, span }; }));
    motion.stick[axis] = best; return best;
  };
  // A fast drag that stops right on a line: ~0.12 s without movement counts as slow, so the line is offered then.
  clearTimeout(motion.timer);
  if (!slow && context.onSettle) motion.timer = setTimeout(() => { motion.speed = 0; context.onSettle?.(); }, 120);
  const { width, height } = context.scene, sx = context.shiftX || 0, sy = context.shiftY || 0;
  const bx = match('x', xPercent / 100 * width + sx, context.halfW, context.xs), by = match('y', yPercent / 100 * height + sy, context.halfH, context.ys);
  if (bx) xPercent = clamp((bx.centre - sx) / width * 100, 0, 100);
  if (by) yPercent = clamp((by.centre - sy) / height * 100, 0, 100);
  const seg = (g, size) => g.span ? { from: g.span[0] / size * 100, to: g.span[1] / size * 100 } : {};
  showAlignGuides(bx ? [{ at: bx.line / width * 100, room: bx.room, bg: bx.bg, kind: bx.kind, ...seg(bx, height) }] : [], by ? [{ at: by.line / height * 100, room: by.room, bg: by.bg, kind: by.kind, ...seg(by, width) }] : [], [], [bx, by].filter(g => g?.box).map(g => ({ ...g.box, kind: g.kind })));
  return { xPercent, yPercent };
}
// ---- Label-to-label snapping (dragging an etykieta / pomieszczenie label) ----------------------------------------
// Candidates per axis, best (lowest score) wins: the same edge of another label (top to top, centre to centre) first,
// then edge to edge (touching), and equal spacing (the gap two labels in a row already have, or exactly between two
// of them). Labels in the same row / column count more than far ones. Other guides
// (markers, rooms, background) still take part with a lower priority. Lines are drawn between the labels involved,
// gaps get small markers.
function alignLabel(context, xPercent, yPercent, event) {
  if (cameraPanning || !context || event?.altKey || !snapTargets().guides || !context.scene.width) { showAlignGuides([], []); return { xPercent, yPercent }; }
  const W = context.scene.width, H = context.scene.height, hw = context.halfW, hh = context.halfH;
  const cx = xPercent / 100 * W + (context.shiftX || 0), cy = yPercent / 100 * H + (context.shiftY || 0);
  const threshold = mobileView() ? 10 : 7, release = mobileView() ? 13 : 9, motion = context.motion ||= { stick: {} };
  // A room's label lying wholly inside its room (with "Pomieszczenia" on) snaps to that room, its own parts and other
  // labels (with "Etykiety" on) - not to other rooms, markers, Flow or the background. Out of the room: to everything.
  const rb = context.roomBox, inside = !!rb && snapTargets().rooms && cx - hw >= rb.l - 1 && cx + hw <= rb.r + 1 && cy - hh >= rb.t - 1 && cy + hh <= rb.b + 1;
  const boxes = context.boxes.map(b => ({ ...b, cx: (b.l + b.r) / 2, cy: (b.t + b.b) / 2 }));
  // Other labels come in as boxes (segment lines, highlight); their copies among the general guides are skipped.
  const guideValues = values => values.filter(item => item.own || item.kind !== 'label' || !item.box).filter(item => !inside || item.own || item.kind === 'label');
  // axis 'x': position along x, rows are found on y; axis 'y' the other way round.
  const solve = (axis, c, half, oc, ohalf) => {
    const [lo, hi, mid, plo, phi] = axis === 'x' ? ['l','r','cx','t','b'] : ['t','b','cy','l','r'];
    const near = b => { const gapAcross = Math.max(b[plo] - (oc + ohalf), (oc - ohalf) - b[phi], 0); return gapAcross <= Math.max(3 * ohalf * 2, 160); };
    const inRow = b => b[phi] > oc - ohalf * 1.5 && b[plo] < oc + ohalf * 1.5;
    const list = [];
    const add = (target, score, guide, marks = [], hits = [], reach = threshold) => { const d = Math.abs(c - target); if (d <= reach) list.push({ target, score: d + score, guide, marks, hits }); };
    // Inside a group (ungrouped parts) everything of the group counts, whatever the plan's snap menu says.
    const edges = context.group || snapTargets().edges, centers = context.group || snapTargets().centers, spacing = !context.group && snapTargets().spacing, centreReach = threshold * 1.7;
    boxes.forEach(b => {
      const far = context.group || near(b) ? 0 : 3, span = [b[plo], b[phi]];
      if (centers) add(b[mid], far + .2, { at: b[mid], span }, [], [b], centreReach);
      if (!edges) return;
      add(b[lo] + half, far, { at: b[lo], span }, [], [b]); add(b[hi] - half, far, { at: b[hi], span }, [], [b]);
      add(b[hi] + half, far + 1.5, { at: b[hi], span }, [], [b]); add(b[lo] - half, far + 1.5, { at: b[lo], span }, [], [b]);
    });
    // "Odstępy" (own switch in the snap menu, own colour): repeat the gap of two neighbours in a row, or sit exactly
    // between two of them (equal gaps on both sides).
    const row = spacing ? boxes.filter(inRow).sort((p, q) => p[lo] - q[lo]) : [];
    for (let i = 0; i + 1 < row.length; i++) {
      const a = row[i], b = row[i + 1], g = b[lo] - a[hi]; if (g <= 0) continue;
      add(b[hi] + g + half, .5, null, [[a[hi], b[lo], 'spacing'], [b[hi], b[hi] + g, 'spacing']], [{ ...a, kind: 'spacing' }, { ...b, kind: 'spacing' }]);
      add(a[lo] - g - half, .5, null, [[a[hi], b[lo], 'spacing'], [a[lo] - g, a[lo], 'spacing']], [{ ...a, kind: 'spacing' }, { ...b, kind: 'spacing' }]);
      if (g > half * 2 + 2) { const free = (g - half * 2) / 2; add(a[hi] + free + half, .3, null, [[a[hi], a[hi] + free, 'spacing'], [b[lo] - free, b[lo], 'spacing']], [{ ...a, kind: 'spacing' }, { ...b, kind: 'spacing' }]); }
    }
    // Other guides (markers, Flow, rooms, background): lower priority, full-length lines as before.
    const offsets = [...(centers ? [0] : []), ...(edges ? [-half, half] : [])];
    guideValues(axis === 'x' ? context.xs : context.ys).forEach(({ v, kind, room, bg, box, span, center, grid }) => offsets.forEach(o => add(v - o, grid ? 3.5 : 2, { at: v, kind: kind || (room ? 'room' : bg ? 'bg' : 'label'), full: !span, span, grid: !!grid }, [], box ? [{ ...box, kind: kind || (room ? 'room' : 'label') }] : [], center && !o ? centreReach : threshold)));
    const stuck = motion.stick[axis];
    // A caught line holds until the label is moved clearly away from it, or another candidate is clearly closer to the
    // finger (e.g. sliding from "8 px next to it" on to touching).
    const held = stuck && Math.abs(c - stuck.target);
    // A group's grid line never holds against a part of the group within reach (parts first, the grid fills the gaps).
    if (stuck && held <= release && !(stuck.guide?.grid && list.some(item => !item.guide?.grid)) && !list.some(item => Math.abs(c - item.target) < held - 1.5)) return stuck;
    const best = list.sort((p, q) => p.score - q.score)[0] || null; motion.stick[axis] = best; return best;
  };
  const bx = solve('x', cx, hw, cy, hh), fx = bx ? bx.target : cx, by = solve('y', cy, hh, fx, hw), fy = by ? by.target : cy;
  if (bx) xPercent = clamp((bx.target - (context.shiftX || 0)) / W * 100, 0, 100);
  if (by) yPercent = clamp((by.target - (context.shiftY || 0)) / H * 100, 0, 100);
  // Lines span from the dragged label to the label it lines up with; gap markers sit across the middle of the label.
  const vertical = [], horizontal = [], marks = [];
  if (bx?.guide) vertical.push(bx.guide.full ? { at: bx.guide.at / W * 100, kind: bx.guide.kind } : { at: bx.guide.at / W * 100, kind: bx.guide.kind || 'label', from: Math.min(bx.guide.span[0], fy - hh) / H * 100, to: Math.max(bx.guide.span[1], fy + hh) / H * 100 });
  if (by?.guide) horizontal.push(by.guide.full ? { at: by.guide.at / H * 100, kind: by.guide.kind } : { at: by.guide.at / H * 100, kind: by.guide.kind || 'label', from: Math.min(by.guide.span[0], fx - hw) / W * 100, to: Math.max(by.guide.span[1], fx + hw) / W * 100 });
  (bx?.marks || []).forEach(([a, b, kind]) => marks.push({ axis: 'x', from: a / W * 100, to: b / W * 100, at: fy / H * 100, kind }));
  (by?.marks || []).forEach(([a, b, kind]) => marks.push({ axis: 'y', from: a / H * 100, to: b / H * 100, at: fx / W * 100, kind }));
  const hits = [...(bx?.hits || []), ...(by?.hits || [])].filter((b, i, all) => all.findIndex(o => o.l === b.l && o.t === b.t && o.r === b.r) === i);
  showAlignGuides(vertical, horizontal, marks, hits);
  return { xPercent, yPercent };
}
// A guide may be a full line or a segment (from / to, %), gap markers are short segments with end ticks.
function showAlignGuides(vertical, horizontal, marks = [], hits = []) {
  // While a guide line shows in one direction, the group grid's drawn centre axis in that direction steps back
  // (never two lines side by side; the guide is the one that counts).
  const gg = $('#group-grid'); if (gg) { gg.style.setProperty('--gaxa', vertical.length ? '0' : '.5'); gg.style.setProperty('--gaya', horizontal.length ? '0' : '.5'); }
  // No double measuring lines (equal size / equal gap): the highlighted elements already show what was caught.
  marks = [];
  let layer = $('#align-guides');
  if (!vertical.length && !horizontal.length && !marks.length && !hits.length) { if (layer) layer.innerHTML = ''; return; }
  if (!layer) { layer = document.createElement('div'); layer.id = 'align-guides'; layer.setAttribute('aria-hidden', 'true'); els.scene.append(layer); }
  // Kind classes carry a prefix: a plain "marker" class would also get the markers' own styles (a thick line).
  const kind = g => g.kind ? ` k-${g.kind}` : g.room ? ' k-room' : g.bg ? ' k-bg' : '';
  const spanV = g => g.from != null ? `;top:${g.from}%;bottom:auto;height:${g.to - g.from}%` : '', spanH = g => g.from != null ? `;left:${g.from}%;right:auto;width:${g.to - g.from}%` : '';
  layer.innerHTML = vertical.map(g => `<span class="align-guide vertical${kind(g)}" style="left:${g.at}%${spanV(g)}"></span>`).join('') + horizontal.map(g => `<span class="align-guide horizontal${kind(g)}" style="top:${g.at}%${spanH(g)}"></span>`).join('')
    // The object snapped to gets a soft frame (in its kind's colour); boxes are px from the scene's top left.
    + hits.map(b => { const sc = els.scene.getBoundingClientRect(), W = sc.width || 1, H = sc.height || 1; return `<span class="snap-target k-${b.kind || 'label'}" style="left:${b.l / W * 100}%;top:${b.t / H * 100}%;width:${(b.r - b.l) / W * 100}%;height:${(b.b - b.t) / H * 100}%${Number.isFinite(b.radius) ? `;border-radius:calc(${b.radius.toFixed(2)}px / var(--view-zoom,1))` : ''}"></span>`; }).join('')
    + marks.map(m => m.axis === 'x' ? `<span class="gap-mark x${m.kind ? ' k-' + m.kind : ''}" style="left:${m.from}%;width:${m.to - m.from}%;top:${m.at}%"></span>` : `<span class="gap-mark y${m.kind ? ' k-' + m.kind : ''}" style="top:${m.from}%;height:${m.to - m.from}%;left:${m.at}%"></span>`).join('');
}
// ---- Keep elements inside the background ("Granice tła", on by default) -------------------
// Markers and Flows are kept with their whole box inside the scene while dragging or resizing
// (rooms already cannot leave it: their corners are limited to 0–100 %).
function keepInBounds() { return true; } // "Granice tła" is always on (its switch was removed)
function boundsShift(node) {
  const s = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect(); if (!s.width || !s.height || !r.width) return null;
  const dx = r.width >= s.width ? s.left - r.left : r.left < s.left ? s.left - r.left : r.right > s.right ? s.right - r.right : 0;
  const dy = r.height >= s.height ? s.top - r.top : r.top < s.top ? s.top - r.top : r.bottom > s.bottom ? s.bottom - r.bottom : 0;
  return Math.abs(dx) > .5 || Math.abs(dy) > .5 ? { x: dx / s.width * 100, y: dy / s.height * 100 } : null;
}
function nodeOutsideScene(node) {
  const s = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect();
  return r.left < s.left - 1 || r.top < s.top - 1 || r.right > s.right + 1 || r.bottom > s.bottom + 1;
}
function applyBoundsUi() {
  const on = keepInBounds(), button = $('#bounds-toggle'), status = $('#bounds-status');
  if (button) button.classList.toggle('active', on); if (status) status.textContent = on ? 'ON' : 'OFF';
}
function mobileView() { return matchMedia('(max-width: 900px) and (pointer: coarse), (max-width: 768px)').matches; }
// Zoom can be switched off outside editing (Options → "Zoom poza edycją"): pinch, wheel and double tap keep the view at 100%.
function viewZoomLocked() { return !editMode && !!activeSceneView()?.viewZoomLock; }
// The "Zoom poza edycją" switch shows the current view's own setting.
function syncZoomToggle() { const button = $('#view-zoom-toggle'); if (!button) return; const on = !activeSceneView()?.viewZoomLock; button.classList.toggle('active', on); button.setAttribute('aria-pressed', String(on)); button.innerHTML = `<i class="mdi ${on ? 'mdi-magnify-plus-outline' : 'mdi-magnify-remove-outline'}"></i>`; }
function sceneCameraActive() { return mobileView() || editMode || viewZoom > 1.001; }
function mobileWidePanorama() {
  return mobileView() && layoutViewportHeight() > innerWidth && els.image.naturalWidth > els.image.naturalHeight;
}
// Mobile keeps the readable marker scale. Only markers which truly collide
// are moved apart temporarily on the Y axis; saved desktop positions stay intact.
function updateMobileMarkerLayout(renderedWidth, renderedHeight) {
  mobileLayoutY.clear();
  if (!mobileView() || editMode || !renderedWidth || !renderedHeight) return;
  const placed = [];
  const markers = Object.values(model.entities || {}).map(marker => {
    const style = marker.style || {};
    return {
      marker,
      x: Number(marker.xPercent || 0) * renderedWidth / 100,
      y: Number(marker.yPercent || 0) * renderedHeight / 100,
      width: Number(style.width || 112) * sceneScale,
      height: Number(style.height || 62) * sceneScale
    };
  }).sort((a, b) => a.y - b.y);

  for (const item of markers) {
    let y = item.y;
    for (const previous of placed) {
      const overlapsHorizontally = Math.abs(item.x - previous.x) < (item.width + previous.width) / 2;
      if (!overlapsHorizontally) continue;
      const minimumY = previous.y + previous.height / 2 + item.height / 2 + 5;
      if (y < minimumY) y = minimumY;
    }
    y = Math.min(y, renderedHeight - item.height / 2 - 4);
    mobileLayoutY.set(item.marker.id, y * 100 / renderedHeight);
    placed.push({ ...item, y });
  }
}
// While typing on a phone the keyboard pushes the editor up; the selected element is centred again in what is left
// between the top bar and the editor (after the keyboard has settled).
let refocusTypingTimer = 0, keyboardWasOpen = false;
// The spot being added (icon point / drawn room) stays centred in the band below the wizard on a phone.
function focusWizardTarget() {
  const room = roomWizard && roomsOf()[roomWizard.id]; if (!room || !mobileView()) return;
  focusSceneBoxOnMobile(isIconRoom(room) ? [roomAnchor(room)] : room.points || []);
}
function focusSelectedOnMobile() {
  if (roomWizard) return focusWizardTarget();
  const room = selectedRoomId && roomsOf()[selectedRoomId];
  if (room) focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []); else focusSelectedMarkerOnMobile();
}
// Typing in an editor field on a phone: the camera stays where it is and the panel shrinks to the one line being
// edited, right above the on-screen keyboard; afterwards the panel comes back as it was (same place, same scroll).
let editorTyping = null, editorTypingEnd = 0;
function placeTypingPanel() {
  if (!editorTyping) return; const vv = window.visualViewport;
  const bottom = vv ? Math.max(0, innerHeight - (vv.offsetTop + vv.height)) : 0; editorTyping.panel.style.setProperty('--kb-bottom', `${bottom}px`);
}
function startEditorTyping(input) {
  const panel = input.closest('aside.editor.visible'), content = panel?.querySelector('.editor-content'); if (!panel || !content) return;
  if (editorTyping) endEditorTyping(true);
  const cover = editSheetCover();
  editorTyping = { panel, content, input, scroll: content.scrollTop, cover };
  input.closest('.control, .room-entity-search, label')?.classList.add('typing-row'); input.classList.add('typing-input');
  panel.classList.add('typing'); document.body.classList.add('editor-typing'); placeTypingPanel();
}
function endEditorTyping(now = false) {
  const t = editorTyping; if (!t) return; editorTyping = null; editorTypingEnd = performance.now(); keyboardWasOpen = false;
  t.panel.classList.remove('typing'); t.panel.style.removeProperty('--kb-bottom'); document.body.classList.remove('editor-typing');
  $$('.typing-row', t.panel).forEach(n => n.classList.remove('typing-row')); $$('.typing-input', t.panel).forEach(n => n.classList.remove('typing-input'));
  const restore = () => { t.content.scrollTop = t.scroll; }; restore(); if (!now) requestAnimationFrame(() => requestAnimationFrame(restore));
}
function refocusWhileTyping() {
  if (!mobileView() || !editMode) return;
  // While (and just after) a field in the editor is typed into, the camera does not move.
  if (editorTyping || performance.now() - editorTypingEnd < 900) { placeTypingPanel(); keyboardWasOpen = false; clearTimeout(refocusTypingTimer); return; }
  const open = keyboardOpen();
  // Keyboard opening / open: centre at once on every size change (no waiting), and once more when it has settled.
  if (open) { keyboardWasOpen = true; focusSelectedOnMobile(); }
  else if (roomWizard) focusWizardTarget();
  clearTimeout(refocusTypingTimer);
  refocusTypingTimer = setTimeout(() => {
    const nowOpen = keyboardOpen();
    // Keyboard closed: one clean centring above the editor.
    if (nowOpen || keyboardWasOpen) focusSelectedOnMobile();
    keyboardWasOpen = nowOpen;
  }, 140);
}
// Height used to lay out the plan. While a text field is being edited on a phone the on-screen keyboard shrinks the
// window; the plan keeps the height from before the keyboard, so its size, zoom and camera do not jump.
let stableViewportHeight = 0;
function typingOnPhone() { const el = document.activeElement; return mobileView() && !!el?.matches?.('input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]),textarea,[contenteditable="true"]'); }
let stableViewportWidth = 0;
function keyboardOpen() { const h = window.visualViewport?.height || innerHeight; return mobileView() && stableViewportHeight > 0 && innerWidth === stableViewportWidth && h < stableViewportHeight - 90; }
function layoutViewportHeight() {
  const h = window.visualViewport?.height || innerHeight;
  // A rotation (new width) or an ordinary small change (browser bars) is taken over; a keyboard-sized shrink while the
  // width stays is ignored — also while the keyboard is still opening or closing.
  if (!stableViewportHeight || innerWidth !== stableViewportWidth || (!keyboardOpen() && !typingOnPhone())) { stableViewportHeight = h; stableViewportWidth = innerWidth; }
  return keyboardOpen() || typingOnPhone() ? stableViewportHeight : h;
}
function updateSceneGeometry() {
  const hasImage = !els.image.hidden && els.image.naturalWidth > 0 && els.image.naturalHeight > 0;
  // A new background is still loading: keep the current geometry instead of briefly collapsing to the colour ratio.
  if (!hasImage && currentBackground && !els.image.hidden && !els.image.complete) return;
  const solidRatio = clamp(activeSceneView()?.solidCanvasRatio || 16 / 9, .25, 4);
  const width = hasImage ? els.image.naturalWidth : solidRatio * 100, height = hasImage ? els.image.naturalHeight : 100, ratio = width / height;
  const panorama = mobileWidePanorama();
  let renderedWidth;
  if (panorama) {
    const viewportHeight = layoutViewportHeight();
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
  sceneScale = Math.max(.01, physicalScale);
  updateMobileMarkerLayout(renderedWidth, els.scene.clientHeight);
  els.scene.style.setProperty('--scene-scale', sceneScale); syncGridGeometry();
  applyViewTransform();
  requestAnimationFrame(() => {
    $$('.marker', els.markers).forEach(node => {
      const marker = model.entities[node.dataset.markerId];
      if (marker) applyMarkerStyle(node, marker);
    });
    syncSelection(); positionEditor(); syncFlowSelection(); positionFlowEditor(); renderRooms(); if ($('#snap-menu')?.classList.contains('open')) syncSnapMenu();
  });
}
// A portrait plan may overflow its card when zoomed (it can use the whole screen). The card is set up for that whenever
// the plan is portrait, not only above 100%: switching it while a pinch crossed 100% rebuilt the plan's GPU layers
// mid-gesture and the phone showed the plan without its background for a few frames. At 100% nothing overflows anyway.
// A zoomed portrait plan may overflow its card up to the screen's edges, never further: the card always clips at the
// screen (overflow: clip + a margin). Constant, so nothing is switched while zooming or when the card turns as a cube
// (a turning card holding the whole zoomed plan, several screens large, was drawn only partly on a phone).
function syncCardClip() {
  const card = els.sceneCard; if (!card || card.style.transform) return;
  const r = card.getBoundingClientRect(), w = document.documentElement.clientWidth || innerWidth, h = innerHeight;
  const margin = `${Math.ceil(Math.max(0, r.left, w - r.right, r.top, h - r.bottom))}px`;
  if (card.style.getPropertyValue('--card-clip') !== margin) card.style.setProperty('--card-clip', margin);
}
// On a computer a zoomed plan (any format, image or colour) uses the whole free screen - from the top bar down, between
// the window edge and the edit panel - not only its card, so there is more room to work.
function deskZoomExpanded() { return !mobileView() && viewZoom > 1.001; }
function deskZoomRegion() {
  const bar = $('.topbar')?.getBoundingClientRect().bottom || 0, dock = $('#edit-dock');
  let left = 0, right = document.documentElement.clientWidth || innerWidth;
  if (els.body.classList.contains('dock-mode') && els.body.classList.contains('editing') && dock) { const d = dock.getBoundingClientRect(); if (d.width) { if (d.left > right / 2) right = Math.min(right, d.left); else left = Math.max(left, d.right); } }
  return { left, top: bar, right, bottom: innerHeight };
}
function syncDeskZoom() {
  const on = deskZoomExpanded(), card = els.sceneCard;
  els.viewport.classList.toggle('desk-zoom-expanded', on); card?.classList.toggle('desk-zoom-expanded', on);
  if (!on || !card) { card?.style.removeProperty('--desk-clip'); return; }
  const c = card.getBoundingClientRect(), r = deskZoomRegion();
  card.style.setProperty('--desk-clip', `inset(${r.top - c.top}px ${c.right - r.right}px ${c.bottom - r.bottom}px ${r.left - c.left}px)`);
}
function portraitZoomExpansion() {
  return !mobileWidePanorama() && els.image.naturalHeight > els.image.naturalWidth;
}
// While editing on a phone the plan may be zoomed out below its fitted size (e.g. to see a big thermostat whole).
function zoomFloor() { return minViewZoom() * (editMode && mobileView() ? .4 : 1); }
function minViewZoom() {
  if (!mobileWidePanorama()) return 1;
  return clamp(els.viewport.clientWidth / Math.max(1, els.scene.offsetWidth), .08, 1);
}
function editSheetCover() {
  if (!mobileView() || !editMode) return 0;
  if (editorTyping) return editorTyping.cover; // the panel shrunk for typing must not move the camera
  const sheets = [els.editor, els.flowEditor, $('#room-editor')].filter(panel => panel?.classList.contains('visible'));
  if (!sheets.length) return 0;
  // offsetHeight ignores the slide-in transform, so the value is final even while the sheet animates.
  const sheetTop = Math.min(...sheets.map(panel => innerHeight - panel.offsetHeight)), viewportBottom = els.viewport.getBoundingClientRect().bottom;
  return Math.max(0, viewportBottom - sheetTop);
}
function clampViewPan() {
  if (!sceneCameraActive()) { viewPanX = 0; viewPanY = 0; return; }
  const panorama = mobileWidePanorama();
  if (viewZoom < minViewZoom() - .001) {
    // Zoomed out below the fitted size (editing on a phone): the smaller plan may be moved within the viewport.
    const freeX = els.viewport.clientWidth - els.scene.offsetWidth * viewZoom, freeY = els.viewport.clientHeight - els.scene.offsetHeight * viewZoom;
    viewPanX = clamp(viewPanX, Math.min(0, freeX), Math.max(0, freeX)); viewPanY = clamp(viewPanY, Math.min(0, freeY) - editSheetCover(), Math.max(0, freeY));
    return;
  }
  if (viewZoom <= minViewZoom() && !panorama) { viewPanX = 0; viewPanY = 0; return; }
  if (deskZoomExpanded()) {
    // The plan may move anywhere inside the free screen; larger than it, it always covers that area.
    // While editing, it may also go past its edges by half the free screen, so an element at the plan's edge can be
    // brought to the middle of the screen.
    const R = deskZoomRegion(), vp = els.viewport.getBoundingClientRect(), fit = (size, lo, hi) => { const e = editMode ? (hi - lo) / 2 : 0; return size >= hi - lo ? [hi - size - e, lo + e] : [lo - e, hi - size + e]; };
    viewPanX = clamp(viewPanX, ...fit(els.scene.offsetWidth * viewZoom, R.left - vp.left, R.right - vp.left));
    viewPanY = clamp(viewPanY, ...fit(els.scene.offsetHeight * viewZoom, R.top - vp.top, R.bottom - vp.top));
    return;
  }
  const maxX = Math.max(0, els.scene.offsetWidth * viewZoom - els.viewport.clientWidth);
  const maxY = Math.max(0, els.scene.offsetHeight * viewZoom - els.viewport.clientHeight);
  // While editing on a phone, the camera may go past the lower scene edge only by the part of the viewport
  // the bottom editor covers: the empty area then stays hidden under the editor, never shown as a bare frame.
  const editBottomAllowance = editSheetCover();
  if (editBottomAllowance) {
    // An element being edited near a plan edge can still be centred in the free band above the editor (the camera
    // may go past the plan's edges by as much as that needs).
    const band = editorFreeBand(), mid = band.top + band.height / 2, halfW = els.viewport.clientWidth / 2;
    viewPanX = clamp(viewPanX, -maxX - halfW, halfW);
    viewPanY = clamp(viewPanY, -(maxY + Math.max(editBottomAllowance, els.viewport.clientHeight - mid)), Math.max(0, mid - band.top));
    return;
  }
  viewPanX = clamp(viewPanX, -maxX, 0); viewPanY = clamp(viewPanY, -(maxY + editBottomAllowance), 0);
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
  els.viewport.classList.toggle('view-zoomed', viewZoom > 1.01); // hides the edit grid (a pseudo-element, cheap)
  syncCardClip(); syncDeskZoom();
  if (!sceneCameraActive()) { els.scene.style.transform = ''; updatePanoramaIndicator(); return; }
  if (viewZoom < zoomFloor()) viewZoom = minViewZoom(); // e.g. edit mode left while zoomed out
  clampViewPan();
  els.scene.style.transformOrigin = '0 0';
  els.scene.style.transform = `translate(${viewPanX}px,${viewPanY}px) scale(${viewZoom})`;
  els.scene.style.setProperty('--view-zoom', viewZoom); // room handles keep their on-screen size when zoomed
  // Zoom buttons / wheel / camera glide: the layer (drawn at the old scale) is dropped once the zoom settles.
  if (!viewPointers.size && gestureLayerZoom != null && Math.abs(viewZoom - gestureLayerZoom) > .001) setGestureLayer(false);
  if (els.zoomValue) els.zoomValue.textContent = `${Math.round(viewZoom * 100)}%`;
  if (els.zoomOut) els.zoomOut.disabled = viewZoom <= zoomFloor() + .001;
  if (els.zoomIn) els.zoomIn.disabled = viewZoom >= 4;
  updatePanoramaIndicator();
  requestAnimationFrame(syncSelection);
}
function setViewZoom(next, clientX = null, clientY = null) {
  // In desktop viewing mode, wheel-down must land exactly on the fitted 100% view.
  if (!mobileView() && !editMode && next <= 1) next = 1;
  const old = viewZoom, zoom = clamp(next, zoomFloor(), 4); if (zoom === old) return;
  const r = els.viewport.getBoundingClientRect(), x = clientX == null ? r.width / 2 : clientX - r.left, y = clientY == null ? r.height / 2 : clientY - r.top;
  viewPanX = x - (x - viewPanX) * zoom / old; viewPanY = y - (y - viewPanY) * zoom / old; viewZoom = zoom; applyViewTransform();
}
function resetViewZoom() {
  stopCameraGlide();
  // Normal scenes start fully visible; wide scenes on a portrait phone start at the saved panorama focus.
  viewZoom = 1; viewPanY = 0;
  const t = currentBackgroundTransform(), maxX = Math.max(0, els.scene.offsetWidth - els.viewport.clientWidth);
  viewPanX = mobileWidePanorama() ? -maxX * clamp(t.mobilePanStart ?? .5, 0, 1) : 0;
  applyViewTransform();
}
function syncMobileOrientation() {
  const next = mobileView() ? (layoutViewportHeight() > innerWidth ? 'portrait' : 'landscape') : 'desktop';
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
  const hasImage = !els.image.hidden && els.image.naturalWidth > 0 && els.image.naturalHeight > 0;
  if (!hasImage) {
    if (currentBackground) { card.style.width = '100%'; card.style.marginLeft = '0'; card.style.marginRight = '0'; }
    else {
      // Colour background: largest whole canvas of the chosen size that fits the workspace (like an image).
      const ratio = clamp(activeSceneView()?.solidCanvasRatio || 16 / 9, .25, 4), parentWidth = Math.max(1, card.parentElement?.clientWidth || innerWidth);
      // The card's place on the page, not on screen: a scrolled page must not make the fitted card taller (and scroll more).
      if (!mobileView() && window.scrollY) window.scrollTo(0, 0);
      const availableHeight = Math.max(160, layoutViewportHeight() - (card.getBoundingClientRect().top + (window.scrollY || 0)) - 10);
      card.style.width = `${(Math.min(parentWidth, availableHeight * ratio) / parentWidth) * 100}%`; card.style.marginLeft = 'auto'; card.style.marginRight = 'auto';
    }
    els.image.style.objectFit = 'fill'; els.image.style.transform = '';
    requestAnimationFrame(updateSceneGeometry);
    return;
  }
  const ratio = els.image.naturalWidth / Math.max(1, els.image.naturalHeight);
  const panorama = mobileWidePanorama();

  if (panorama) {
    // Wide image on a portrait phone: use full height and expose the extra width as a panorama.
    card.style.width = '100%'; card.style.marginLeft = '0'; card.style.marginRight = '0';
  } else {
    // Every other combination: largest whole image that still fits in the visible workspace.
    const parentWidth = Math.max(1, card.parentElement?.clientWidth || innerWidth);
    if (!mobileView() && window.scrollY) window.scrollTo(0, 0);
    const top = card.getBoundingClientRect().top + (window.scrollY || 0);
    const viewportHeight = layoutViewportHeight();
    const availableHeight = Math.max(160, viewportHeight - top - (mobileView() ? 8 : 10));
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
// ---- Layout sync between devices -------------------------------------------------
// The layout is stored on the server with a revision. Saves send the revision they are based on
// (the server rejects stale ones), and an open page checks for newer revisions.
// syncBase is the layout as the server holds it at serverRevision. When another device saved in
// between, the changes are merged per field: what this device changed since syncBase wins, everything
// else comes from the server — so a colour set on the phone and a move made on the PC both survive.
let serverRevision = 0, lastLocalChangeAt = 0, syncBase = null;
const RELOAD_VIEW_KEY = 'ha-views:reload-view', RELOAD_MESSAGE_KEY = 'ha-views:reload-message';
const SYNC_LOCAL_KEYS = new Set(['entities', 'revision', 'baseRevision']);
function layoutSnapshot(source) { const data = clone(source || {}); SYNC_LOCAL_KEYS.forEach(key => delete data[key]); return data; }
const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function layoutDiff(before, after, path = [], ops = []) {
  if (isPlainObject(before) && isPlainObject(after)) {
    new Set([...Object.keys(before), ...Object.keys(after)]).forEach(key => {
      if (!(key in after)) ops.push({ path:[...path, key], remove:true });
      else if (!(key in before)) ops.push({ path:[...path, key], value:after[key] });
      else layoutDiff(before[key], after[key], [...path, key], ops);
    });
  } else if (JSON.stringify(before) !== JSON.stringify(after)) ops.push({ path, value:after });
  return ops;
}
function applyLayoutOps(target, ops) {
  ops.forEach(({ path, value, remove }) => {
    let node = target;
    for (const key of path.slice(0, -1)) { if (!isPlainObject(node[key])) node[key] = {}; node = node[key]; }
    const last = path[path.length - 1];
    if (remove) delete node[last]; else node[last] = clone(value);
  });
}
const pathsOverlap = (a, b) => a.slice(0, Math.min(a.length, b.length)).every((key, index) => key === b[index]);
// Pulls the newest server layout into the open page without a reload; returns false when it cannot merge.
async function mergeRemoteLayout() {
  if (!syncBase) return false;
  const latest = await api('rewrite_state'), server = latest?.data;
  if (!latest?.exists || !isPlainObject(server) || !isPlainObject(server.views)) return false;
  const serverData = layoutSnapshot(server), local = layoutDiff(syncBase, layoutSnapshot(model));
  // The open view is chosen per device, so another device's activeViewId is not taken over.
  const remote = layoutDiff(syncBase, serverData).filter(op => op.path[0] !== 'activeViewId' && !local.some(mine => pathsOverlap(mine.path, op.path)));
  const activeId = model.activeViewId, backgroundKeys = ['background','backgroundColor','backgroundTransforms','solidCanvasRatio','solidCanvasSize','nightBackground','nightMode','nightEntity','backgroundBrightness','nightBrightness'];
  const backgroundChanged = remote.some(op => op.path[0] === 'views' && op.path[1] === activeId && (op.path.length === 2 || backgroundKeys.includes(op.path[2])));
  applyLayoutOps(model, remote);
  syncBase = serverData; serverRevision = model.revision = Number(server.revision) || 0;
  if (!model.views[model.activeViewId]) model.activeViewId = model.viewOrder.find(id => model.views[id]) || Object.keys(model.views)[0];
  model.viewOrder = (model.viewOrder || []).filter(id => model.views[id]); Object.keys(model.views).forEach(id => { if (!model.viewOrder.includes(id)) model.viewOrder.push(id); });
  attachActiveEntities(); renderViewSelector();
  if (backgroundChanged || model.activeViewId !== activeId) { currentBackground = ''; await loadBackgrounds(true, false, null, 2500); if (currentBackground) applyBackgroundTransform(); }
  updateSceneGeometry(); renderMarkers(); renderAdded();
  if (selectedFlowId) { if (activeSceneView()?.flows?.[selectedFlowId] && els.flowEditor.classList.contains('visible')) openFlowEditor(selectedFlowId); else if (!activeSceneView()?.flows?.[selectedFlowId]) closeFlowEditor(); }
  if (selectedId) { if (!model.entities[selectedId]) closeEditor(); else if (els.editor.classList.contains('visible')) openEditor(); }
  prebuildSwipePreviews(60);
  return { remote:remote.length, local:local.length };
}
function reloadLayout(message = '') {
  try { sessionStorage.setItem(RELOAD_VIEW_KEY, model.activeViewId || ''); if (message) sessionStorage.setItem(RELOAD_MESSAGE_KEY, message); } catch {}
  location.reload();
}
let remoteCheckRunning = false;
async function checkRemoteLayout() {
  if (document.hidden || remoteCheckRunning || !appRevealed || saveRunning || savePending || Date.now() - lastLocalChangeAt < 3000) return;
  remoteCheckRunning = true;
  try {
    const { revision } = await api('rewrite_state_revision');
    if (!(Number(revision) > serverRevision) || saveRunning || savePending) return;
    if (!editMode) return reloadLayout('Wczytano zmiany z innego urządzenia');
    // In edit mode the page stays open: the newer layout is merged in place.
    const merged = await mergeRemoteLayout().catch(() => false);
    if (!merged) { notifyWithAction('Układ zmieniono na innym urządzeniu', 'Wczytaj', () => reloadLayout(), 15000); return; }
    if (merged.local) scheduleSave(true);
    notify('Wczytano zmiany z innego urządzenia');
  } catch {} finally { remoteCheckRunning = false; }
}
async function queueSave() {
  if (isViewer()) return;
  clearTimeout(saveTimer); savePending = true;
  if (saveRunning) return;
  saveRunning = true; let conflicts = 0;
  while (savePending) {
    savePending = false; const snapshot = clone(model); delete snapshot.entities; snapshot.baseRevision = serverRevision;
    try {
      const result = await api('rewrite_state', jsonOptions(snapshot));
      if (Number.isFinite(Number(result?.revision))) { serverRevision = model.revision = Number(result.revision); snapshot.revision = serverRevision; syncBase = layoutSnapshot(snapshot); }
      els.editorStatus.textContent = 'Zapisano';
    }
    catch (error) {
      if (error.status === 409) {
        // Another device saved first: merge its layout with this device's changes and save again.
        const merged = ++conflicts <= 3 ? await mergeRemoteLayout().catch(() => false) : false;
        if (merged) { if (merged.local) savePending = true; notify('Połączono z nowszymi zmianami z innego urządzenia'); continue; }
        savePending = false; saveRunning = false; reloadLayout('Układ został zmieniony na innym urządzeniu — wczytano najnowszą wersję. Ostatnia zmiana z tego urządzenia nie została zapisana.'); return;
      }
      savePending = true; els.editorStatus.textContent = 'Błąd zapisu'; notify(`Błąd zapisu: ${error.message}`, true); await new Promise(r => setTimeout(r, 900)); }
  }
  saveRunning = false;
}

function hexKey(entityId) { return `dyn_${[...entityId].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`; }
function numberOr(value, fallback) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function normalizedStyle(type, raw = {}) {
  const base = markerStyleDefaults(type);
  const aliases = {
    borderEnabled: 'showBorder', backgroundEnabled: 'showBackground', radiusPx: 'radius', borderWidthPx: 'borderWidth',
    bgColor: 'backgroundColor', bgOpacity: 'backgroundOpacity', nameColor: 'labelColor', stateColor: 'valueColor',
    nameScale: 'labelScale', stateScale: 'valueScale', gaugeMin: 'min', gaugeMax: 'max'
  };
  Object.entries(raw || {}).forEach(([key, value]) => { const target = aliases[key] || key; if (target in base && value !== undefined && value !== null) base[target] = value; });
  const legacyContentScale = Number(raw?.contentScale);
  if (!Object.prototype.hasOwnProperty.call(raw || {}, 'baseContentScale')) {
    base.baseContentScale = 1;
    if ([1.3, 1.69, 2.2].some(value => Math.abs(legacyContentScale - value) < .001)) {
      base.baseContentScale = legacyContentScale;
      base.contentScale = 1;
    }
  }
  if (!Object.prototype.hasOwnProperty.call(raw || {}, 'iconOpacityStateEnabled')) base.iconOpacityStateEnabled = Boolean(raw?.iconStateEnabled);
  ['width','height','contentScale','baseContentScale','borderWidth','radius','labelScale','valueScale','labelX','labelY','valueX','valueY','iconSize','iconX','iconY','iconOpacity','iconOutlineWidth','backgroundOnOpacity','backgroundOffOpacity','borderOnOpacity','borderOffOpacity','borderOnWidth','borderOffWidth','iconOnOpacity','iconOffOpacity','backgroundGradientX','backgroundGradientY','backgroundGradientSpread','backgroundGradientFill','iconOutlineOpacity','iconOutlineOnOpacity','iconOutlineOffOpacity','iconOutlineOnWidth','iconOutlineOffWidth'].forEach(k => base[k] = numberOr(base[k], markerStyleDefaults(type)[k]));
  if (isGaugeType(type)) ['min','max','thickness','percentScale','percentY'].forEach(k => base[k] = numberOr(base[k], gaugeDefaults()[k]));
  return base;
}
function migrateHorseshoeBaseline() {
  if (model.settings?.horseshoeBaselineV1) return false;
  let changed = false;
  Object.values(model.views || {}).flatMap(view => Object.values(view.entities || {})).forEach(marker => {
    if (marker.type !== 'horseshoe') return;
    marker.style.gaugeY = numberOr(marker.style.gaugeY, 0) + 35;
    marker.style.gaugeScale = numberOr(marker.style.gaugeScale, 1) / .92;
    changed = true;
  });
  model.settings.horseshoeBaselineV1 = true;
  return changed;
}
function migrateIconHorizontalBaseline() {
  if (model.settings?.iconHorizontalBaselineV1) return false;
  let changed = false;
  Object.values(model.views || {}).flatMap(view => Object.values(view.entities || {})).forEach(marker => {
    if (!['badge','icon'].includes(marker.type) || Number(marker.style?.iconX) !== -38) return;
    marker.style.iconX = 0;
    changed = true;
  });
  model.settings.iconHorizontalBaselineV1 = true;
  return changed;
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
      id: entityId, entityId, integrationId: '', integrationName: 'Home Assistant', sourceDomain: entityId.split('.')[0],
      displayName: data.name || raw.displayName || entityId, unitOverride: raw.unitOverride ?? '', decimals: raw.decimals ?? 'auto',
      stateOnLabel: '', stateOffLabel: '', iconMode: 'auto', iconName: '', iconOn: '', iconOff: '',
      xPercent: clamp(pos.x ?? pos.left ?? 50, 0, 100), yPercent: clamp(pos.y ?? pos.top ?? 50, 0, 100),
      type, style: normalizedStyle(type, raw), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
  }
  return true;
}

function previewStateFor(marker) {
  return editMode && marker && selectedId === marker.id && editorPreview.entityId === marker.entityId ? editorPreview.state : '';
}
function formatState(marker) {
  if (isTextId(marker.entityId)) return { value: String(marker.textValue ?? ''), unit:'' };
  const obj = stateCache[marker.entityId] || {}; const raw = previewStateFor(marker) || obj.state, kind = stateKind(marker); let value = raw;
  if (kind === 'on' && marker.stateOnLabel) value = marker.stateOnLabel;
  if (kind === 'off' && marker.stateOffLabel) value = marker.stateOffLabel;
  if (value === undefined || value === null || value === 'unknown' || value === 'unavailable') value = '—';
  const numeric = Number(value);
  if (Number.isFinite(numeric) && marker.decimals !== 'auto') value = numeric.toFixed(clamp(marker.decimals, 0, 3));
  const unit = kind === 'on' || kind === 'off' ? '' : (marker.unitOverride !== '' ? marker.unitOverride : (obj.attributes?.unit_of_measurement || ''));
  return { value: String(value), unit: String(unit || '') };
}
function stateKind(marker) {
  if (isTextId(marker.entityId)) return 'normal';
  const raw = previewStateFor(marker) || stateCache[marker.entityId]?.state, state = String(raw || '').toLowerCase();
  if (state === 'on') return 'on';
  if (state === 'off') return 'off';
  if (['closed','close','inactive','false'].includes(state)) return 'off';
  if (['open','opened','active','true'].includes(state)) return 'on';
  if (raw == null || state === 'unknown' || state === 'unavailable') return 'unavailable';
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
// ---- Colours / icons by value (optional per marker) -------------------------------
// Two thresholds split the numeric state into three bands (below / between / above); each band has a colour
// and optionally its own icon. "Smooth" blends the colours across the range instead of hard steps.
const VALUE_RULE_DEFAULTS = Object.freeze({ enabled:false, low:20, high:25, colorLow:'#20B9E7', colorMid:'#35D07F', colorHigh:'#FF6374', smooth:false, icon:true, value:false, background:false, border:false, arc:true, iconLow:'', iconMid:'', iconHigh:'' });
function valueRulesOf(marker) { return { ...VALUE_RULE_DEFAULTS, ...(marker.valueRules || {}) }; }
function mixHex(a, b, t) {
  const p = hex => { const h = String(hex || '#000000').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) || 0); };
  const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * clamp(t, 0, 1)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function valueRuleResult(marker) {
  const rules = marker.valueRules; if (!rules?.enabled) return null;
  const r = valueRulesOf(marker), n = Number(String(stateCache[marker.entityId]?.state ?? '').replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  const low = Math.min(Number(r.low), Number(r.high)), high = Math.max(Number(r.low), Number(r.high));
  const band = n < low ? 'Low' : n >= high ? 'High' : 'Mid';
  let color = r['color' + band];
  if (r.smooth) { const mid = (low + high) / 2; color = n <= mid ? mixHex(r.colorLow, r.colorMid, (n - low) / Math.max(1e-9, mid - low)) : mixHex(r.colorMid, r.colorHigh, (n - mid) / Math.max(1e-9, high - mid)); }
  return { band, color, icon: r['icon' + band] || '', apply: { icon:!!r.icon, value:!!r.value, background:!!r.background, border:!!r.border, arc:!!r.arc } };
}
function valueRulesSection(marker) {
  const r = valueRulesOf(marker), refresh = { refresh:true }, result = valueRuleResult(marker);
  const bandName = { Low:'Teraz: poniżej dolnego progu.', Mid:'Teraz: pomiędzy progami.', High:'Teraz: od górnego progu.' };
  let body = control('Włącz','valueRules.enabled','checkbox',r.enabled,refresh);
  if (r.enabled) {
    body += (result ? `<p class="flow-section-note">${bandName[result.band]}</p>` : '<p class="flow-section-note">Stan encji nie jest liczbą — kolory wg wartości nie działają dla tej encji.</p>')
      + control('Dolny próg','valueRules.low','number',r.low,{ valueType:'number' }) + control('Górny próg','valueRules.high','number',r.high,{ valueType:'number' })
      + control('Kolor poniżej','valueRules.colorLow','color',r.colorLow) + control('Kolor pomiędzy','valueRules.colorMid','color',r.colorMid) + control('Kolor od górnego','valueRules.colorHigh','color',r.colorHigh)
      + control('Płynne przejście','valueRules.smooth','checkbox',r.smooth)
      + (marker.type === 'icon' || marker.style?.showIcon ? control('Koloruj ikonę','valueRules.icon','checkbox',r.icon) : '')
      + (marker.type !== 'icon' ? control('Koloruj wartość','valueRules.value','checkbox',r.value) : '')
      + (isGaugeType(marker.type) ? control('Koloruj łuk','valueRules.arc','checkbox',r.arc) : '')
      + control('Koloruj tło','valueRules.background','checkbox',r.background) + control('Koloruj ramkę','valueRules.border','checkbox',r.border)
      + (marker.iconMode !== 'integration' ? mdiControl('Ikona poniżej','valueRules.iconLow',r.iconLow) + mdiControl('Ikona pomiędzy','valueRules.iconMid',r.iconMid) + mdiControl('Ikona od górnego','valueRules.iconHigh',r.iconHigh) + '<p class="flow-section-note">Puste pole ikony = zwykła ikona markera.</p>' : '');
  }
  return section('Kolory wg wartości', body);
}
function resolvedIcon(marker) {
  const ruleIcon = valueRuleResult(marker)?.icon; if (ruleIcon) return ruleIcon;
  if (marker.iconMode !== 'manual') return automaticIcon(marker);
  if (marker.iconVariantEnabled && markerHasOnOff(marker)) {
    const kind = stateKind(marker);
    if (kind === 'on' && marker.iconOn) return marker.iconOn;
    if (kind === 'off' && marker.iconOff) return marker.iconOff;
  }
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
  if (marker.type === 'thermostat') return thermostatMarkup(marker);
  const s = marker.style, formatted = formatState(marker), fullValue = `${formatted.value}${formatted.unit ? ` ${formatted.unit}` : ''}`, icon = iconMarkup(marker), outline = '<span class="marker-outline"></span>';
  if (isGaugeType(marker.type)) {
    const n = Number(stateCache[marker.entityId]?.state), span = Number(s.max) - Number(s.min) || 1;
    const percent = Number.isFinite(n) ? clamp(((n - Number(s.min)) / span) * 100, 0, 100) : 0;
    const cx = 100, cy = 90, radius = 70, start = Number(s.startAngle), rawSweep = Number(s.endAngle) - start;
    let sweep = rawSweep; while (sweep <= 0) sweep += 360; sweep = Math.min(sweep, 359.9);
    const path = gaugeArcPath(cx, cy, radius, start, start + sweep), gradientId = `gauge-gradient-${String(marker.id).replace(/[^a-z0-9_-]/gi, '')}`;
    const stroke = s.useGradient ? `url(#${gradientId})` : s.progressColor;
    return `${outline}<svg class="gauge-svg" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${escapeHtml(s.gradientStart)}"/><stop offset="100%" stop-color="${escapeHtml(s.gradientEnd)}"/></linearGradient></defs><g class="gauge-visual" style="transform:${gaugeVisualTransform(marker, s)};transform-origin:${cx}px ${cy}px"><path class="gauge-track" pathLength="100" d="${path}"/><path class="gauge-value" pathLength="100" d="${path}" style="stroke:${escapeHtml(stroke)};stroke-dasharray:${percent} 100"/>${gaugeScaleMarkup(marker,s,cx,cy,radius,start,sweep)}</g></svg>${icon}${s.showLabel ? `<span class="label">${escapeHtml(marker.displayName)}</span>` : ''}${s.showValue ? `<span class="value">${escapeHtml(fullValue)}</span>` : ''}${s.showPercent ? `<span class="percent">${Math.round(percent)}%</span>` : ''}`;
  }
  return `${outline}${icon}${s.showLabel ? `<span class="label">${escapeHtml(marker.displayName)}</span>` : ''}${s.showValue ? `<span class="value">${escapeHtml(fullValue)}</span>` : ''}`;
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
const MARKER_WEIGHTS = { normal:'400', medium:'600', bold:'850' };
const markerWeightControl = (path, value) => control('Grubość czcionki', path, 'select', MARKER_WEIGHTS[value] ? value : '', { items:[['','Domyślna'],['normal','Normalna'],['medium','Średnia'],['bold','Pogrubiona']] });
// Background, frame and shape around a marker's icon.
function markerIconFrameControls(s) {
  const refresh = { refresh:true };
  return control('Tło ikony','style.iconBg','checkbox',!!s.iconBg,refresh)
    + (s.iconBg ? control('Kolor tła','style.iconBgColor','color',s.iconBgColor || '#081822') + control('Przezrocz. tła','style.iconBgOpacity','range',s.iconBgOpacity ?? .55,{min:0,max:1,step:.01}) : '')
    + control('Ramka ikony','style.iconBorder','checkbox',!!s.iconBorder,refresh)
    + (s.iconBorder ? control('Kolor ramki','style.iconBorderColor','color',s.iconBorderColor || '#FFFFFF') + control('Przezrocz. ramki','style.iconBorderOpacity','range',s.iconBorderOpacity ?? .6,{min:0,max:1,step:.01}) + control('Grubość ramki','style.iconBorderWidth','range',s.iconBorderWidth ?? 1.5,{min:.5,max:12,step:.5,suffix:'px'}) : '')
    + (s.iconBg || s.iconBorder ? control('Kształt','style.iconShape','select',['square','circle','custom'].includes(s.iconShape) ? s.iconShape : 'circle',{ items:[['square','Kwadrat'],['circle','Koło'],['custom','Dowolny']], refresh:true })
      + (s.iconShape === 'custom' ? control('Zaokrąglenie','style.iconRadius','range',s.iconRadius ?? 10,{min:0,max:120,step:1,suffix:'px',integer:true}) : '')
      + control('Margines','style.iconPadding','range',s.iconPadding ?? 6,{min:0,max:80,step:1,suffix:'px',integer:true}) : '');
}
const THERMO_MODES = { eco:['Eko','mdi-leaf','Eco'], electric:['Elektryczny','mdi-flash','Electric'], gas:['Gazowy','mdi-fire-circle','Gas'], heat_pump:['Pompa ciepła','mdi-heat-pump-outline','Heat pump'], high_demand:['Duże zużycie','mdi-water-boiler-alert','High demand'], performance:['Wydajny','mdi-rocket-launch-outline','Performance'], heat:['Grzanie','mdi-fire','Heat'], cool:['Chłodzenie','mdi-snowflake','Cool'], heat_cool:['Grzanie / chłodzenie','mdi-sun-snowflake-variant','Heat'], auto:['Auto','mdi-thermostat-auto','Auto'], dry:['Osuszanie','mdi-water-percent','Dry'], fan_only:['Wentylator','mdi-fan','Fan'], off:['Wyłączony','mdi-power','Off'] };
const THERMO_ACTIONS = { heating:['Grzeje','mdi-fire'], preheating:['Nagrzewa','mdi-fire'], cooling:['Chłodzi','mdi-snowflake'], drying:['Osusza','mdi-water-percent'], fan:['Wentyluje','mdi-fan'], defrosting:['Odmraża','mdi-snowflake-melt'], idle:['Bezczynny','mdi-pause-circle-outline'], off:['Wyłączony','mdi-power'] };
// Known attributes are drawn by the dial; the rest of a climate entity's attributes can be added as small rows.
const THERMO_KNOWN_ATTRS = new Set(['hvac_modes','min_temp','max_temp','target_temp_step','current_temperature','temperature','target_temp_low','target_temp_high','hvac_action','current_humidity','humidity','min_humidity','max_humidity','preset_mode','preset_modes','fan_mode','fan_modes','swing_mode','swing_modes','icon','friendly_name','supported_features','entity_picture','device_class','attribution','assumed_state','restored','editable','unit_of_measurement']);
const thermoPending = new Map();
function climateInfo(marker, previewMode = null) {
  const st = stateCache[marker.entityId] || {}, a = st.attributes || {}, num = v => { const n = Number(v); return v === null || v === undefined || v === '' || !Number.isFinite(n) ? null : n; };
  const pending = thermoPending.get(marker.entityId) || {};
  const min = num(a.min_temp) ?? 7, max = Math.max(min + 1, num(a.max_temp) ?? 35), step = num(a.target_temp_step) || .5;
  // A water heater has "operation modes" (eco, electric, performance, off…) in place of a thermostat's HVAC modes.
  const water = String(marker.entityId || '').startsWith('water_heater.'), realMode = water ? String(a.operation_mode ?? st.state ?? '') : String(st.state || '');
  return { a, water, realMode, realPreset: String(a.preset_mode ?? ''), mode: previewMode ?? pending.hvac_mode ?? realMode, modes: water ? (Array.isArray(a.operation_list) ? a.operation_list : []) : Array.isArray(a.hvac_modes) ? a.hvac_modes : [], action: String(a.hvac_action || ''), current: num(a.current_temperature),
    target: pending.temperature ?? num(a.temperature), low: num(a.target_temp_low), high: num(a.target_temp_high), min, max, step,
    humidity: num(a.current_humidity), preset: String(pending.preset_mode ?? a.preset_mode ?? ''), presets: Array.isArray(a.preset_modes) ? a.preset_modes : [], fan: String(a.fan_mode || ''), unavailable: !st.state || st.state === 'unavailable' };
}
// Colours follow the activity (hvac_action): heating, cooling, idle… — each one has its own colour in the dial's section.
// An entity without hvac_action takes it from its mode (heat → heating, cool → cooling, off → off, others → idle).
const THERMO_ACT_COLORS = { heating:'#FF7A2F', preheating:'#FFA24A', cooling:'#38BDF8', drying:'#FBBF24', fan:'#A78BFA', defrosting:'#7DD3FC', idle:'#7C93A5', off:'#4B5D6B' };
function thermoActivity(info) {
  if (info.unavailable || info.mode === 'off') return 'off';
  if (THERMO_ACT_COLORS[info.action]) return info.action;
  return ({ heat:'heating', cool:'cooling', dry:'drying', fan_only:'fan' })[info.mode] || 'idle';
}
function thermoActColor(s, activity) { return s?.[`thermoActColor_${activity}`] || THERMO_ACT_COLORS[activity] || THERMO_ACT_COLORS.idle; }
function thermoAccent(s, info) { return thermoActColor(s, thermoActivity(info)); }
function thermoNumber(v, step = .5) { if (v === null || v === undefined) return '–'; const d = String(step).includes('.') ? 1 : 0; return Number(v).toFixed(d).replace('.', ','); }
function thermostatMarkup(marker) {
  const s = marker.style, info = climateInfo(marker), accent = thermoAccent(s, info), esc = escapeHtml, tr = translateValue;
  const cx = 100, cy = 92, r = 74, start = 135, sweep = 270, angle = v => start + sweep * clamp((v - info.min) / (info.max - info.min), 0, 1);
  const track = gaugeArcPath(cx, cy, r, start, start + sweep);
  const value = info.target ?? info.high ?? null, active = !info.unavailable && value !== null;
  const arc = active ? gaugeArcPath(cx, cy, r, start, Math.max(start + .5, angle(value))) : '';
  const knob = active ? gaugePoint(cx, cy, r, angle(value)) : null, cur = info.current !== null ? gaugePoint(cx, cy, r, angle(info.current)) : null;
  const working = info.mode !== 'off' && ['heating','cooling','preheating','drying','fan','defrosting'].includes(info.action);
  const range = s.thermoShowRange ? `<text class="thermo-range" x="${gaugePoint(cx, cy, r, start).x.toFixed(1)}" y="${(gaugePoint(cx, cy, r, start).y + 16).toFixed(1)}">${esc(thermoNumber(info.min, info.step))}</text><text class="thermo-range" x="${gaugePoint(cx, cy, r, start + sweep).x.toFixed(1)}" y="${(gaugePoint(cx, cy, r, start + sweep).y + 16).toFixed(1)}">${esc(thermoNumber(info.max, info.step))}</text>` : '';
  const svg = `<svg class="thermo-dial" viewBox="0 0 200 172" preserveAspectRatio="xMidYMid meet"><path class="thermo-track" d="${track}" style="stroke:${esc(s.thermoTrackColor)}"/>${arc ? `<path class="thermo-arc${working ? ' working' : ''}" d="${arc}" style="stroke:${esc(accent)}"/>` : ''}${cur && s.thermoShowCurrent ? `<circle class="thermo-cur" cx="${cur.x.toFixed(1)}" cy="${cur.y.toFixed(1)}" r="4.2"/>` : ''}${knob ? `<circle class="thermo-knob" cx="${knob.x.toFixed(1)}" cy="${knob.y.toFixed(1)}" r="7.5" style="stroke:${esc(accent)}"/>` : ''}${range}</svg>`;
  const actInfo = info.mode === 'off' ? THERMO_ACTIONS.off : THERMO_ACTIONS[info.action] || null;
  const action = s.thermoShowAction && actInfo ? `<span class="thermo-action${working ? ' working' : ''}" style="--accent:${esc(accent)}"><i class="mdi ${actInfo[1]}"></i>${esc(tr(actInfo[0]))}</span>` : '';
  const big = info.unavailable ? tr('Niedostępny') : value === null ? (info.mode === 'off' ? tr('Wył.') : '–') : info.target === null && info.low !== null ? `${thermoNumber(info.low, info.step)}–${thermoNumber(info.high, info.step)}` : thermoNumber(value, info.step);
  const centre = `<div class="thermo-centre"><small>${esc(tr(value === null && info.mode === 'off' ? 'Termostat' : 'Ustawiona'))}</small><b class="thermo-target${value === null || info.unavailable ? ' off' : ''}">${esc(big)}${!info.unavailable && value !== null ? '<sup>°</sup>' : ''}</b>${s.thermoShowCurrent && info.current !== null ? `<span class="thermo-now"><i class="mdi mdi-thermometer"></i>${esc(thermoNumber(info.current, .1))}°</span>` : ''}</div>`;
  const chips = [
    s.thermoShowHumidity && info.humidity !== null ? `<span class="thermo-chip"><i class="mdi mdi-water-percent"></i>${esc(String(Math.round(info.humidity)))}%</span>` : '',
    s.thermoShowPreset && info.preset && info.preset !== 'none' ? `<span class="thermo-chip"><i class="mdi mdi-tune-variant"></i>${esc(info.preset)}</span>` : '',
    s.thermoShowFan && info.fan ? `<span class="thermo-chip"><i class="mdi mdi-fan"></i>${esc(info.fan)}</span>` : '',
    ...Object.keys(marker.thermoExtra || {}).filter(k => marker.thermoExtra[k] && info.a[k] !== undefined).map(k => `<span class="thermo-chip" title="${esc(k)}"><b>${esc(k.replace(/_/g, ' '))}</b>${esc(readableAttribute(info.a[k]))}</span>`)].join('');
  const canSet = info.target !== null && !info.unavailable;
  const controls = s.thermoShowControls ? `<div class="thermo-controls"><button type="button" class="thermo-btn" data-thermo="down"${canSet ? '' : ' disabled'} aria-label="−"><i class="mdi mdi-minus"></i></button><div class="thermo-chips">${chips}</div><button type="button" class="thermo-btn" data-thermo="up"${canSet ? '' : ' disabled'} aria-label="+"><i class="mdi mdi-plus"></i></button></div>` : chips ? `<div class="thermo-controls"><div class="thermo-chips">${chips}</div></div>` : '';
  const modes = s.thermoShowModes && info.modes.length ? `<div class="thermo-modes">${info.modes.map(m => { const d = THERMO_MODES[m] || [m, 'mdi-thermostat']; return `<button type="button" class="thermo-mode${m === info.mode ? ' on' : ''}" data-thermo-mode="${esc(m)}" title="${esc(tr(d[0]))}" aria-label="${esc(tr(d[0]))}" style="--accent:${esc(m === 'off' ? s.thermoOffColor : m === 'cool' ? s.thermoCoolColor : m === 'heat' ? s.thermoHeatColor : m === 'dry' ? s.thermoDryColor : m === 'fan_only' ? s.thermoFanColor : s.thermoAutoColor)}"><i class="mdi ${d[1]}"></i></button>`; }).join('')}</div>` : '';
  const head = s.showLabel || action ? `<div class="thermo-head">${s.showLabel ? `<span class="thermo-name">${esc(marker.displayName || '')}</span>` : ''}${action}</div>` : '';
  return `<span class="marker-outline"></span><div class="thermo${working ? ' working' : ''}" style="--accent:${esc(accent)}">${head}<div class="thermo-body">${svg}${centre}</div>${controls}${modes}</div>`;
}
// − / + and the modes, in viewing mode: the dial follows at once, Home Assistant gets the value when the taps stop.
const thermoTimers = new Map();
function thermoSend(marker, action, value) {
  const id = marker.entityId; return api('control', jsonOptions({ entity_id: id, action, value })).catch(error => { thermoPending.delete(id); renderMarkerState(id, stateCache[id] || {}); notify(`${translateValue('Błąd termostatu')}: ${error.message}`, true); });
}
// A change still not reported back by the device after a while did not go through: it is undone on screen, with a word.
function thermoClearLater(id) { clearTimeout(thermoTimers.get(`${id}:clear`)); thermoTimers.set(`${id}:clear`, setTimeout(() => { if (thermoPending.has(id)) { thermoPending.delete(id); notify(translateValue('Urządzenie nie przyjęło zmiany'), true); } renderMarkerState(id, stateCache[id] || {}); if (roomUsesEntity(id)) renderRooms(); }, 15000)); }
function thermoTap(marker, button) {
  const id = marker.entityId, info = climateInfo(marker), pending = thermoPending.get(id) || {}, room = marker.room || null;
  const preset = button.dataset.thermoPreset, mode = button.dataset.thermoMode;
  if (preset || mode) {
    if (preset ? preset === info.preset : mode === info.mode) return;
    // Optional: asking first (per mode / preset; by default turning on / off).
    const ask = room ? thermoNeedsConfirm(room, info, mode, preset) : marker.confirm && (mode === 'off' || info.mode === 'off');
    if (ask) {
      const off = mode === 'off', on = !preset && info.mode === 'off', name = String(marker.name || '').trim(), what = preset ? thermoPresetText(room, preset) : thermoModeText(room, mode);
      appConfirm({ title: off ? 'Wyłączyć?' : on ? 'Włączyć?' : 'Zmienić tryb?', message: `${name ? `${name}: ` : ''}${off ? translateValue('urządzenie zostanie wyłączone.') : on ? translateValue('urządzenie zostanie włączone.') : what}`, confirmText: off ? 'Wyłącz' : on ? 'Włącz' : 'Zmień', danger: off })
        .then(ok => { if (ok) thermoTap({ ...marker, confirm: false, room: room ? { ...room, thermoConfirm: false, ...Object.fromEntries(Object.keys(room).filter(k => /^thermoConfirm/.test(k)).map(k => [k, false])) } : null }, button); });
      return;
    }
    thermoPending.set(id, preset ? { ...pending, preset_mode: preset } : { ...pending, hvac_mode: mode }); renderMarkerState(id, stateCache[id] || {}); if (roomUsesEntity(id)) renderRooms();
    thermoSend(marker, preset ? 'set_preset_mode' : info.water ? 'set_operation_mode' : 'set_hvac_mode', preset || mode); thermoClearLater(id); return;
  }
  if (info.target === null) return;
  const dir = button.dataset.thermo === 'up' ? 1 : -1, next = clamp(Math.round((info.target + dir * info.step) / info.step) * info.step, info.min, info.max);
  thermoPending.set(id, { ...pending, temperature: Math.round(next * 100) / 100 }); renderMarkerState(id, stateCache[id] || {}); if (roomUsesEntity(id)) renderRooms();
  clearTimeout(thermoTimers.get(id)); thermoTimers.set(id, setTimeout(() => { const value = thermoPending.get(id)?.temperature; if (value === undefined) return; thermoSend(marker, 'set_temperature', value); thermoClearLater(id); }, 700));
}
function applyMarkerStyle(node, marker) {
  const s = marker.style, baseContentScale = Number(s.baseContentScale) || 1, contentScale = clamp(baseContentScale * (Number(s.contentScale) || 1), .4, Math.max(5.5, baseContentScale * 5));
  const displayY = marker.yPercent, kind = stateKind(marker), stateSuffix = kind === 'on' ? 'On' : kind === 'off' ? 'Off' : '', rule = valueRuleResult(marker);
  const backgroundColor = rule?.apply.background ? rule.color : s.backgroundStateEnabled && stateSuffix ? s[`background${stateSuffix}Color`] : s.backgroundColor;
  const backgroundOpacity = s.backgroundStateEnabled && stateSuffix ? s[`background${stateSuffix}Opacity`] : s.backgroundOpacity;
  const borderColor = rule?.apply.border ? rule.color : s.borderStateEnabled && stateSuffix ? s[`border${stateSuffix}Color`] : s.borderColor;
  const borderOpacity = s.borderStateEnabled && stateSuffix ? s[`border${stateSuffix}Opacity`] : s.borderOpacity;
  const borderWidth = s.borderStateEnabled && stateSuffix ? s[`border${stateSuffix}Width`] : s.borderWidth;
  const rotation = Number(marker.rotation) || 0;
  node.style.transform = rotation ? `translate(-50%,-50%) rotate(${rotation}deg) scale(var(--scene-scale,1))` : '';
  Object.assign(node.style, {
    left: `${marker.xPercent}%`, top: `${displayY}%`, width: `${s.width}px`, height: `${s.height}px`,
    background: s.showBackground ? markerBackgroundFill(backgroundColor, backgroundOpacity, s.backgroundGradient, s) : 'transparent',
    border: '0 solid transparent',
    borderRadius: s.shape === 'circle' ? '50%' : s.shape === 'square' ? '0px' : `${s.radius}px`
  });
  if (marker.type === 'thermostat') node.style.setProperty('--thermo-k', String(contentScale));
  const outlineNode = $('.marker-outline', node);
  const outlineRadius = s.shape === 'circle' ? '50%' : s.shape === 'square' ? '0px' : `${Math.max(0, Number(s.radius) || 0) + Math.max(0, Number(borderWidth) || 0)}px`;
  if (outlineNode) Object.assign(outlineNode.style, { inset: `-${borderWidth}px`, border: s.showBorder && borderWidth > 0 ? `${borderWidth}px solid ${rgba(borderColor, borderOpacity)}` : '0 solid transparent', borderRadius: outlineRadius });
  const label = $('.label', node), value = $('.value', node);
  if (label) Object.assign(label.style, { color: s.labelColor, opacity: clamp(s.labelOpacity, 0, 1), fontSize: `${12 * s.labelScale * contentScale}px`, fontWeight: MARKER_WEIGHTS[s.labelWeight] || '' });
  if (value) Object.assign(value.style, { color: rule?.apply.value ? rule.color : s.valueColor, opacity: clamp(s.valueOpacity, 0, 1), fontSize: `${22 * s.valueScale * contentScale}px`, fontWeight: MARKER_WEIGHTS[s.valueWeight] || '' });
  if (marker.type === 'badge' || marker.type === 'icon') {
    if (label) label.style.transform = `translate(${(Number(s.labelX) || 0) * contentScale}px, ${s.labelY * contentScale}px)`;
    if (value) value.style.transform = `translate(${(Number(s.valueX) || 0) * contentScale}px, ${s.valueY * contentScale}px)`;
  }
  const icon = $('.marker-icon', node);
  if (icon) {
    const iconColor = kind === 'unavailable' ? s.iconUnavailableColor : rule?.apply.icon ? rule.color : s.iconStateEnabled !== false && stateSuffix ? s[`icon${stateSuffix}Color`] : s.iconColor;
    const iconOpacity = s.iconOpacityStateEnabled && stateSuffix ? s[`icon${stateSuffix}Opacity`] : s.iconOpacity;
    const outlineColor = s.iconOutlineStateEnabled && stateSuffix ? s[`iconOutline${stateSuffix}Color`] : s.iconOutlineColor;
    const outlineOpacity = s.iconOutlineStateEnabled && stateSuffix ? s[`iconOutline${stateSuffix}Opacity`] : s.iconOutlineOpacity;
    const outlineWidth = s.iconOutlineStateEnabled && stateSuffix ? s[`iconOutline${stateSuffix}Width`] : s.iconOutlineWidth;
    const brandIcon = icon.classList.contains('marker-brand-icon');
    Object.assign(icon.style, { color: iconColor, opacity: brandIcon ? clamp(iconOpacity, 0, 1) : 1, fontSize: `${s.iconSize * contentScale}px`, left: `calc(50% + ${s.iconX * contentScale}px)`, top: `calc(50% + ${s.iconY * contentScale}px)`, transform: 'translate(-50%, -50%)' });
    // Background, frame and shape around the icon (like an icon's label frame).
    const framed = s.iconBg || s.iconBorder, shape = ['square','circle','custom'].includes(s.iconShape) ? s.iconShape : 'circle';
    Object.assign(icon.style, framed ? { padding: `${clamp(Number(s.iconPadding ?? 6), 0, 120) * contentScale}px`, borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : `${clamp(Number(s.iconRadius ?? 10), 0, 200) * contentScale}px`,
      background: s.iconBg ? rgba(s.iconBgColor || '#081822', clamp(Number(s.iconBgOpacity ?? .55), 0, 1)) : 'transparent',
      boxShadow: s.iconBorder ? `inset 0 0 0 ${clamp(Number(s.iconBorderWidth ?? 1.5), .5, 12) * contentScale}px ${rgba(s.iconBorderColor || '#FFFFFF', clamp(Number(s.iconBorderOpacity ?? .6), 0, 1))}` : 'none', boxSizing: 'content-box' }
      : { padding: '', borderRadius: '', background: '', boxShadow: '', boxSizing: '' });
    if (!brandIcon) Object.assign(icon.style, framed ? { display: 'grid', placeItems: 'center', width: '1em', height: '1em' } : { display: '', placeItems: '', width: '', height: '' });
    if (!brandIcon) Object.assign(icon.style, { WebkitTextFillColor: s.iconFillEnabled !== false ? rgba(iconColor, iconOpacity) : 'transparent', WebkitTextStroke: s.iconOutlineEnabled ? `${Math.max(1, Number(outlineWidth) || 1) * contentScale}px ${rgba(outlineColor, outlineOpacity)}` : '0 transparent', paintOrder: 'stroke fill' });
    if (brandIcon) Object.assign(icon.style, { width:`${s.iconSize * contentScale}px`, height:`${s.iconSize * contentScale}px`, objectFit:'contain' });
  }
  if (isGaugeType(marker.type)) {
    // Anchor labels to the marker centre: resizing the Gauge changes neither their
    // horizontal nor vertical screen position. The Position sliders stay additive.
    if (label) Object.assign(label.style, { left: `calc(50% + ${Number(s.labelX || 0) * contentScale}px)`, top: `calc(50% + ${(37 + Number(s.labelY || 0)) * contentScale}px)` });
    if (value) Object.assign(value.style, { left: `calc(50% + ${Number(s.valueX || 0) * contentScale}px)`, top: `calc(50% + ${(10 + Number(s.valueY || 0)) * contentScale}px)` });
    const percent = $('.percent', node); if (percent) Object.assign(percent.style, { left: '50%', top: `calc(50% + ${(-18 + Number(s.percentY || 0)) * contentScale}px)`, color: rgba(s.percentColor, s.percentOpacity), fontSize: `${11 * s.percentScale * contentScale}px` });
    const svg = $('.gauge-svg', node); if (svg) Object.assign(svg.style, { inset: 'auto', left: '50%', top: '50%', width: marker.type === 'horseshoe' ? '136px' : '', height: marker.type === 'horseshoe' ? '118px' : '', transform: `translate(-50%, -50%) scale(${contentScale})`, transformOrigin: '50% 50%' });
    const visual = $('.gauge-visual', node); if (visual) Object.assign(visual.style, { transform: gaugeVisualTransform(marker, s), transformOrigin: '100px 90px' });
    const track = $('.gauge-track', node), progress = $('.gauge-value', node), n = Number(stateCache[marker.entityId]?.state), span = Number(s.max) - Number(s.min) || 1;
    const pct = Number.isFinite(n) ? clamp(((n - Number(s.min)) / span) * 100, 0, 100) : 0;
    const gradientId = `gauge-gradient-${String(marker.id).replace(/[^a-z0-9_-]/gi, '')}`;
    Object.assign(track.style, { stroke: s.trackColor, strokeWidth: s.thickness });
    Object.assign(progress.style, { stroke: rule?.apply.arc ? rule.color : s.useGradient ? `url(#${gradientId})` : s.progressColor, strokeWidth: s.thickness, strokeDasharray: `${pct} 100` });
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
  if (!moreInfoEntityId) return; const marker = moreInfoSubject(moreInfoEntityId);
  const state = stateCache[moreInfoEntityId] || {}, formatted = formatState(marker), icon = String(resolvedIcon(marker) || 'mdi:cube-outline').replace(/^mdi:/,'mdi-');
  els.moreInfoIcon.innerHTML = `<i class="mdi ${escapeHtml(icon)}"></i>`; els.moreInfoTitle.textContent = marker.displayName; els.moreInfoEntity.textContent = marker.entityId;
  els.moreInfoState.textContent = `${formatted.value}${formatted.unit ? ` ${formatted.unit}` : ''}`;
  const changed = state.last_changed || state.last_updated; els.moreInfoUpdated.textContent = changed ? `${translateValue('Ostatnia zmiana')}: ${new Date(changed).toLocaleString(model.settings?.language === 'en' ? 'en-GB' : 'pl-PL')}` : '';
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
// Entities of rooms and icons need not have a marker on the plan; More Info then describes the entity itself.
function moreInfoSubject(entityId) {
  return markerForEntity(entityId) || { id:'', entityId, type:'icon', displayName: stateCache[entityId]?.attributes?.friendly_name || roomEntityName(entityId) || entityId,
    iconMode:'auto', iconName:'', iconOn:'', iconOff:'', iconVariantEnabled:false, unitOverride:'', decimals:'auto', stateOnLabel:'', stateOffLabel:'', style: normalizedStyle('icon', {}) };
}
function openMoreInfo(entityId) {
  if (!entityId) return;
  if (openNativeHaMoreInfo(entityId)) return;
  moreInfoEntityId=entityId; refreshMoreInfoState(); els.moreInfo.classList.add('visible'); els.moreInfoBackdrop.classList.add('visible');
  els.moreInfo.setAttribute('aria-hidden','false'); els.moreInfoBackdrop.setAttribute('aria-hidden','false'); loadMoreInfoHistory(24);
}

function renderMarkers() {
  const previous = selectedId;
  // Flow nodes are reconciled in place by renderFlows() so running animations are not restarted.
  [...els.markers.children].forEach(node => { if (!node.classList.contains('flow-marker')) node.remove(); });
  Object.values(model.entities).forEach(marker => {
    const node = document.createElement('div'); node.className = `marker ${marker.type}${marker.id === selectedId ? ' selected' : ''}`;
    node.dataset.markerId = marker.id; node.dataset.entityId = marker.entityId; node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker);
    node.addEventListener('pointerdown', startDrag); node.addEventListener('click', onMarkerClick); els.markers.append(node);
  });
  renderFlows();
  if (previous && model.entities[previous]) syncSelection(); else hideSelection();
  if (selectedFlowId && activeSceneView()?.flows?.[selectedFlowId]) syncFlowSelection(); else hideFlowSelection();
  if (selectedRoomId && !roomsOf()[selectedRoomId]) closeRoomEditor();
  updateEmptyState(); renderAdded(); renderRooms();
}
function flowSideOf(flow, numericState) { return flow.directionMode === 'auto' && numericState !== null && numericState < 0 ? 'negative' : 'positive'; }
function flowSeparateStyles(flow) { return flow.directionMode === 'auto' && Boolean(flow.negativeStyleEnabled); }
function flowEffective(flow, side) {
  const style = { ...FLOW_DEFAULTS, ...flow };
  if (side === 'negative' && flowSeparateStyles(flow)) Object.assign(style, flow.negativeStyle || {});
  style.activeColor = flow.directionMode === 'auto' ? (side === 'negative' ? (flow.negativeColor || FLOW_DEFAULTS.negativeColor) : (flow.positiveColor || flow.color || FLOW_DEFAULTS.positiveColor)) : (flow.color || FLOW_DEFAULTS.color);
  style.activeDirection = flow.directionMode === 'auto' ? (side === 'negative' ? (flow.negativeDirection || 'left') : (flow.positiveDirection || 'right')) : (flow.direction || 'right');
  return style;
}
// sharpness (10–100 %) is the depth of the point as a share of the item length: lower = flatter, more open V.
// The flattened shape stays centred in its item slot, so item size, spacing and frame do not change.
function flowShapePath(shape, w, h, t, sharpness = 100) {
  const cy = h / 2, f = n => Math.round(n * 100) / 100, poly = points => 'M ' + points.map(p => f(p[0]) + ' ' + f(p[1])).join(' L ') + ' Z';
  // Above 100 % the point is deeper than the item is long; it stays centred and simply reaches past the item box.
  const k = clamp(Number(sharpness) || 100, 10, 300) / 100;
  if (shape === 'segment') { const r = Math.min(w, h) / 2; return 'M ' + f(r) + ' 0 H ' + f(w - r) + ' A ' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(w) + ' ' + f(r) + ' V ' + f(h - r) + ' A ' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(w - r) + ' ' + f(h) + ' H ' + f(r) + ' A ' + f(r) + ' ' + f(r) + ' 0 0 1 0 ' + f(h - r) + ' V ' + f(r) + ' A ' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(r) + ' 0 Z'; }
  if (shape === 'arrow') {
    const head = Math.min(Math.min(w * .55, h * .95) * k, w * .95), shaft = clamp(t, 1, h * .8), neck = w - head * .78;
    return poly([[0,cy - shaft / 2],[neck,cy - shaft / 2],[w - head,0],[w,cy],[w - head,h],[neck,cy + shaft / 2],[0,cy + shaft / 2]]);
  }
  const depth = w * k, x0 = (w - depth) / 2, tip = x0 + depth;
  if (shape === 'triangle') return poly([[x0,0],[tip,cy],[x0,h]]);
  if (shape === 'dart') return poly([[x0,0],[tip,cy],[x0,h],[x0 + depth * .32,cy]]);
  const d = Math.min(depth * .85, clamp(t, 1, 200) * Math.hypot(depth, cy) / Math.max(1, cy));
  return poly([[x0,0],[x0 + d,0],[tip,cy],[x0 + d,h],[x0,h],[tip - d,cy]]);
}
function retimeFlowAnimations(node, duration) {
  $$('.flow-train,.flow-chevron', node).forEach(element => element.getAnimations?.().forEach(animation => {
    const progress = Number(animation.effect?.getComputedTiming?.().progress);
    animation.effect?.updateTiming?.({ duration: duration * 1000, delay: 0 });
    if (Number.isFinite(progress)) animation.currentTime = progress * duration * 1000;
  }));
}
// Builds the DOM node of one Flow (no listeners, no position/tempo); null when hidden.
function buildFlowNode(flow) {
    const numericState = flowNumericState(flow.entityId), autoDirection = flow.directionMode === 'auto';
    const deadband = Math.max(0, Number(flow.deadband) || 0);
    const isActive = numericState === null || Math.abs(numericState) > deadband;
    if (!isActive && flow.hideInactive && !editMode) return null;
    const previewSide = editMode && selectedFlowId === flow.id && autoDirection ? flowEditorSide : null;
    const side = previewSide || flowSideOf(flow, numericState), style = flowEffective(flow, side);
    const shape = FLOW_SHAPES.some(([key]) => key === style.shape) ? style.shape : 'chevron';
    const itemCount = clamp(Math.round(Number(style.flowCount) || 3), 1, FLOW_LIMITS.count);
    const frameLength = clamp(Number(style.flowLength) || 84, 8, FLOW_LIMITS.length), itemHeight = clamp(Number(style.chevronHeight) || 22, FLOW_LIMITS.min, FLOW_LIMITS.size);
    const itemWidth = clamp(Number(style.chevronWidth) || 22, 2, FLOW_LIMITS.size);
    // A negative spacing nests the arrows into each other (denser than touching); at most down to a 2 px pitch.
    const gap = clamp(Number(style.gap) || 0, -(itemWidth - 2), FLOW_LIMITS.gap);
    const thickness = clamp(Number(style.chevronThickness) || 5, 1, FLOW_LIMITS.thickness);
    const outlineWidth = clamp(Number(style.outlineWidth) || 0, 0, 20), glow = clamp(Number(style.glow) || 0, 0, 40), opacity = clamp(Number(style.opacity) || 100, 10, 100);
    const color = style.activeColor, glowColor = style.glowCustom ? (style.glowColor || color) : color, outlineColor = style.outlineColor || '#FFFFFF';
    const pathData = flowShapePath(shape, itemWidth, itemHeight, thickness, style.shapeSharpness);
    const item = '<svg class="flow-chevron" width="' + itemWidth + '" height="' + itemHeight + '" style="width:' + itemWidth + 'px;height:' + itemHeight + 'px" preserveAspectRatio="none" viewBox="0 0 ' + itemWidth + ' ' + itemHeight + '" aria-hidden="true"><path d="' + pathData + '" fill="' + escapeHtml(color) + '"' + (outlineWidth ? ' stroke="' + escapeHtml(outlineColor) + '" stroke-width="' + outlineWidth + '" stroke-linejoin="round" paint-order="stroke fill"' : ' stroke="none"') + '></path></svg>';
    const items = item.repeat(itemCount), animation = style.animation || 'none';
    const node = document.createElement('div');
    node.className = 'flow-marker'; node.dataset.flowId = flow.id; node.dataset.side = side;
    // Items keep their own size; count and spacing only change how many there are and how far apart.
    // A streaming train repeats the group until it covers the frame plus one period (seamless loop).
    // The train moves by one item pitch per loop (items are identical, so the loop is seamless) and fills the frame.
    const streaming = isActive && animation === 'flow', period = itemWidth + gap, contentLength = itemCount * itemWidth + (itemCount - 1) * gap;
    node.innerHTML = '<div class="flow-train">' + (streaming ? item.repeat(Math.max(2, Math.ceil(frameLength / Math.max(1, period)) + 1)) : items) + '</div>';
    node.classList.toggle('flow-overflow', !streaming && contentLength > frameLength + .5);
    const contentWidth = frameLength;
    const angle = ({ right:0, down:90, left:180, up:-90 }[style.activeDirection] ?? 0) + Number(flow.rotation || 0);
    node.dataset.angle = String(angle);
    const speedFactor = style.speedByValue && numericState !== null ? Math.max(.2, Math.min(1, Math.abs(numericState) / Math.max(1, Number(style.speedValueMax) || 1000))) : 1;
    const tempo = Math.max(.05, (Number(style.animationSpeed) || FLOW_DEFAULTS.animationSpeed) * speedFactor);
    const duration = streaming ? Math.max(1, period) / (FLOW_SPEED_PX * tempo) : 1.2 / tempo;
    Object.assign(node.style, { width: contentWidth + 'px', height: itemHeight + 'px', opacity: opacity / 100, transform: 'translate(-50%,-50%) rotate(' + angle + 'deg) scale(var(--scene-scale,1))' });
    node.style.setProperty('--flow-color', color); node.style.setProperty('--flow-gap', gap + 'px');
    if (glow) node.style.setProperty('--flow-glow', 'drop-shadow(0 0 ' + glow + 'px ' + glowColor + ')');
    if (streaming) node.style.setProperty('--flow-period', period.toFixed(2) + 'px');
    node.classList.toggle('flow-inactive', !isActive); node.classList.toggle('flow-hidden-preview', !isActive && Boolean(flow.hideInactive));
    node.classList.toggle('flow-animate-pulse', isActive && animation === 'pulse'); node.classList.toggle('flow-animate-flow', isActive && animation === 'flow');
    node.classList.toggle('flow-locked', Boolean(flow.geometryLocked));
    return { node, signature: node.outerHTML, duration, durationKey: duration.toFixed(3) };
}
function placeFlowNode(node, flow, duration) {
  node.style.left = Number(flow.xPercent) + '%'; node.style.top = Number(flow.yPercent) + '%';
  node.style.setProperty('--flow-duration', duration.toFixed(3) + 's'); node.style.setProperty('--flow-delay', (-((Date.now() / 1000) % duration)).toFixed(3) + 's');
}
function renderFlows() {
  const flows = Object.values(activeSceneView()?.flows || {}), existing = new Map($$('.flow-marker', els.markers).map(node => [node.dataset.flowId, node])), kept = new Set();
  flows.forEach(flow => {
    const built = buildFlowNode(flow); if (!built) return;
    const { node, signature, duration, durationKey } = built;
    // Unchanged Flow keeps its DOM node (and its running animation); only position and tempo are updated.
    const previous = existing.get(flow.id);
    if (previous && previous.dataset.signature === signature) {
      previous.style.left = Number(flow.xPercent) + '%'; previous.style.top = Number(flow.yPercent) + '%';
      if (previous.dataset.duration !== durationKey) { retimeFlowAnimations(previous, duration); previous.dataset.duration = durationKey; }
      kept.add(previous); return;
    }
    node.dataset.signature = signature; node.dataset.duration = durationKey; placeFlowNode(node, flow, duration);
    node.addEventListener('pointerdown', startFlowDrag);
    node.addEventListener('click', event => { event.stopPropagation(); if (event.currentTarget.dataset.dragged === '1') { event.currentTarget.dataset.dragged = '0'; return; } if (editMode) openFlowEditor(flow.id); });
    if (previous) previous.replaceWith(node); else els.markers.append(node);
    kept.add(node);
  });
  existing.forEach(node => { if (!kept.has(node)) node.remove(); });
}
function startFlowDrag(event) {
  if (!editMode || event.button !== 0) return;
  closeCompactMenus();
  const flow = activeSceneView()?.flows?.[event.currentTarget.dataset.flowId]; if (!flow || flow.geometryLocked) return;
  if (touchSelectFirst(event, selectedFlowId === flow.id)) return; // a tap selects it (click)
  event.preventDefault(); event.stopPropagation();
  const node = event.currentTarget, start = { x:event.clientX, y:event.clientY, px:Number(flow.xPercent), py:Number(flow.yPercent) };
  let moved = false, guides = null; node.setPointerCapture(event.pointerId);
  const r0 = els.scene.getBoundingClientRect(), grab = [(event.clientX - r0.left) / Math.max(1, r0.width) * 100 - start.px, (event.clientY - r0.top) / Math.max(1, r0.height) * 100 - start.py];
  const dropGuides = () => { clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; guides = null; };
  const camera = dragCamera(e => { dropGuides(); move(e); });
  const move = current => {
    const rect = els.scene.getBoundingClientRect(), dx=current.clientX-start.x, dy=current.clientY-start.y;
    if (Math.hypot(dx,dy) > 3) moved = true;
    if (!moved) return;
    guides ||= alignmentContext(node); guides.onSettle = () => move(current);
    ({ xPercent: flow.xPercent, yPercent: flow.yPercent } = alignToGuides(guides, snapPercent((current.clientX - rect.left) / Math.max(1, rect.width) * 100 - grab[0]), snapPercent((current.clientY - rect.top) / Math.max(1, rect.height) * 100 - grab[1]), current));
    camera.track(current);
    node.style.left = flow.xPercent + '%'; node.style.top = flow.yPercent + '%';
    const fix = keepInBounds() && boundsShift(node); if (fix) { flow.xPercent = clamp(flow.xPercent + fix.x, 0, 100); flow.yPercent = clamp(flow.yPercent + fix.y, 0, 100); node.style.left = flow.xPercent + '%'; node.style.top = flow.yPercent + '%'; }
    if (selectedFlowId === flow.id) syncFlowSelection();
  };
  const finish = () => {
    camera.stop(); dropGuides(); node.removeEventListener('pointermove',move); node.removeEventListener('pointerup',finish); node.removeEventListener('pointercancel',finish); showAlignGuides([], []);
    try { if (node.hasPointerCapture?.(event.pointerId)) node.releasePointerCapture(event.pointerId); } catch {}
    node.dataset.dragged = moved ? '1' : '0';
    if (moved) { flow.updatedAt = new Date().toISOString(); scheduleSave(true); renderAdded(); positionFlowEditor(); centerAfterDrag(flow.xPercent, flow.yPercent); }
  };
  node.addEventListener('pointermove',move); node.addEventListener('pointerup',finish,{once:true}); node.addEventListener('pointercancel',finish,{once:true});
}
function closeFlowEditor() {
  if (mobileView() && editMode) requestAnimationFrame(applyViewTransform);
  selectedFlowId = null; flowEditorDragged = false; flowEditorOpenSectionIndex = -1;
  hideFlowSelection();
  els.flowEditor?.classList.remove('visible'); els.flowEditor?.setAttribute('aria-hidden','true');
}
function flowNumericState(entityId) {
  const raw = stateCache?.[entityId]?.state;
  const value = Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}
let flowEditorOpenSectionIndex = -1, flowEditorSide = 'positive';
function flowEditorMarkup(flow) {
  const dirs = { items:[['right','Prawo'],['left','Lewo'],['up','Góra'],['down','Dół']] }, refresh = { refresh:true };
  const auto = flow.directionMode === 'auto', locked = !!flow.geometryLocked, side = auto ? flowEditorSide : 'positive', s = flowEffective(flow, side);
  const separate = flowSeparateStyles(flow), styleNote = auto ? (separate ? 'Styl dla ' + (side === 'negative' ? '−' : '+') : 'Styl wspólny dla + i −') : '';
  const value = flowNumericState(flow.entityId), unit = stateCache?.[flow.entityId]?.attributes?.unit_of_measurement || '';
  const sideSwitch = auto ? '<div class="flow-side-switch" role="tablist"><button type="button" data-flow-side="positive" class="' + (side === 'positive' ? 'active' : '') + '">Wartość +</button><button type="button" data-flow-side="negative" class="' + (side === 'negative' ? 'active' : '') + '">Wartość −</button></div><p class="flow-side-note"><span>' + (side === 'negative' ? 'Podgląd i edycja dla wartości ujemnej.' : 'Podgląd i edycja dla wartości dodatniej.') + '</span> <span>' + (separate ? 'Każda strona ma własny styl.' : 'Kształt, rozmiar i animacja są wspólne — kolor jest osobny.') + '</span></p>' : '';
  const note = text => text ? '<p class="flow-section-note">' + text + '</p>' : '';
  const entityPicker = `<div class="control room-entities-control"><label>Encja</label><div class="room-entity-list">${flow.entityId ? flowEntityRow(flow.entityId, 'clear') : ''}</div><label class="room-entity-search"><i class="mdi mdi-magnify"></i><input id="flow-entity-search" type="search" autocomplete="off" placeholder="${escapeHtml(translateValue('Szukaj nazwy lub encji…'))}"></label><div id="flow-entity-results" class="room-entity-list room-entity-results"></div></div>`;
  const steering = section('Encja i kierunek', control('Nazwa','displayName','text',flow.displayName || '') + entityPicker + '<div class="control"><label>Aktualna wartość</label><strong class="flow-live-value">' + (value === null ? '—' : escapeHtml(String(value)) + (unit ? ' ' + escapeHtml(unit) : '')) + '</strong><span></span></div>'
    + control('Sterowanie','directionMode','select',auto ? 'auto' : 'manual',{ items:[['manual','Stały kierunek'],['auto','Kierunek wg znaku + / −']], refresh:true })
    + (auto ? control('Kierunek dla +','positiveDirection','select',flow.positiveDirection || 'right',dirs) + control('Kierunek dla −','negativeDirection','select',flow.negativeDirection || 'left',dirs) + control('Osobny styl dla −','negativeStyleEnabled','checkbox',!!flow.negativeStyleEnabled,refresh) : control('Kierunek','direction','select',flow.direction || 'right',dirs))
    + control('Próg aktywności','deadband','number',Number(flow.deadband) || 0,{ valueType:'number', min:0 }) + control('Ukryj poniżej progu','hideInactive','checkbox',!!flow.hideInactive)
    + note('Flow jest nieaktywny, gdy |wartość| ≤ próg — np. próg 0 wyłącza strzałki fotowoltaiki przy 0 W w nocy. Nieaktywny Flow jest przygaszony i bez animacji albo, z opcją ukrywania, całkiem niewidoczny. W trybie edycji ukryty Flow ma tylko przerywaną ramkę, żeby dało się go kliknąć.'));
  const shapeKey = FLOW_SHAPES.some(([key]) => key === s.shape) ? s.shape : 'chevron';
  const streamingAnim = (s.animation || 'none') === 'flow';
  const frame = section('Ramka i pozycja', note(styleNote)
    + linkedSizeControl('Oba wymiary','flowLength','chevronHeight',[8,FLOW_LIMITS.length,FLOW_LIMITS.min,FLOW_LIMITS.size],locked)
    + control('Długość ramki','flowLength','range',Number(s.flowLength) || 84,{ min:8, max:FLOW_LIMITS.length, step:1, suffix:'px', integer:true, disabled:locked })
    + control('Szerokość ramki','chevronHeight','range',Number(s.chevronHeight) || 22,{ min:FLOW_LIMITS.min, max:FLOW_LIMITS.size, step:1, suffix:'px', integer:true, disabled:locked })
    + control('Obrót','rotation','range',Number(flow.rotation) || 0,{ min:-180, max:180, step:1, suffix:'°', integer:true, disabled:locked })
    + note('Ramka to obszar Flow na planie, liczony wzdłuż kierunku strzałek. Szerokość ramki jest też wysokością strzałek. Uchwyty zaznaczenia zmieniają to samo.'));
  const shape = section('Strzałki', note(styleNote) + control('Rodzaj','shape','select',shapeKey,{ items:FLOW_SHAPES, refresh:true })
    + (shapeKey === 'segment' ? '' : control('Ostrość','shapeSharpness','range',clamp(Number(s.shapeSharpness) || 100,10,300),{ min:10, max:300, step:1, suffix:'%', integer:true }))
    + (shapeKey === 'chevron' || shapeKey === 'arrow' ? control(shapeKey === 'arrow' ? 'Grubość trzonu' : 'Grubość','chevronThickness','range',Number(s.chevronThickness) || 5,{ min:1, max:FLOW_LIMITS.thickness, step:1, suffix:'px', integer:true }) : '')
    + control('Długość strzałki','chevronWidth','range',Number(s.chevronWidth) || 22,{ min:2, max:FLOW_LIMITS.size, step:1, suffix:'px', integer:true, disabled:locked })
    + control('Odstęp','gap','range',Number(s.gap) || 0,{ min:-(Math.max(2, Number(s.chevronWidth) || 22) - 2), max:FLOW_LIMITS.gap, step:1, suffix:'px', integer:true, disabled:locked })
    + (streamingAnim ? note('W animacji „Przepływ” strzałki wypełniają całą ramkę, więc liczba nie ma znaczenia.') : control('Liczba','flowCount','range',clamp(Number(s.flowCount) || 3,1,FLOW_LIMITS.count),{ min:1, max:FLOW_LIMITS.count, step:1, integer:true }) + note('Strzałki są wyśrodkowane w ramce; to, co się nie mieści, jest przycinane. Liczba i odstęp nie zmieniają ramki. Ujemny odstęp wsuwa strzałki jedna w drugą (gęściej).')));
  const colorProp = auto ? (side === 'negative' ? 'negativeColor' : 'positiveColor') : 'color';
  const colors = section('Kolory i wygląd', note(styleNote) + control(auto ? (side === 'negative' ? 'Kolor dla −' : 'Kolor dla +') : 'Kolor','' + colorProp,'color',s.activeColor)
    + control('Obrys','outlineWidth','range',Number(s.outlineWidth) || 0,{ min:0, max:20, step:.5, suffix:'px', refresh:true }) + (Number(s.outlineWidth) > 0 ? control('Kolor obrysu','outlineColor','color',s.outlineColor || '#FFFFFF') : '')
    + control('Poświata','glow','range',Number(s.glow) || 0,{ min:0, max:40, step:1, suffix:'px', integer:true }) + control('Osobny kolor poświaty','glowCustom','checkbox',!!s.glowCustom,refresh) + (s.glowCustom ? control('Kolor poświaty','glowColor','color',s.glowColor || s.activeColor) : '')
    + control('Krycie','opacity','range',clamp(Number(s.opacity) || 100,10,100),{ min:10, max:100, step:1, suffix:'%', integer:true }));
  const animated = s.animation && s.animation !== 'none';
  const siblings = Object.values(activeSceneView()?.flows || {}).filter(other => other.id !== flow.id && other.entityId === flow.entityId);
  const animation = section('Animacja', note(styleNote) + control('Typ','animation','select',s.animation || 'none',{ items:[['none','Brak'],['pulse','Pulsowanie'],['flow','Przepływ']], refresh:true }) + (animated
    ? control('Tempo','animationSpeed','range',Number(s.animationSpeed) || FLOW_DEFAULTS.animationSpeed,{ min:.2, max:6, step:.1, suffix:'×' }) + control('Tempo od wartości','speedByValue','checkbox',!!s.speedByValue,refresh) + (s.speedByValue ? control('Pełne tempo przy','speedValueMax','number',Number(s.speedValueMax) || FLOW_DEFAULTS.speedValueMax,{ valueType:'number', min:1 }) : '')
      + note(streamingAnim ? 'Tempo to stała prędkość strzałek (1× = 150 px/s) — nie zależy od rozmiaru, odstępu ani liczby, więc Flow z tym samym tempem jadą identycznie.' : 'Tempo pulsowania nie zależy od rozmiaru Flow.')
    : '')
    + (siblings.length ? '<div class="room-icon-actions"><button type="button" data-flow-sync-animation><i class="mdi mdi-sync"></i><span>' + escapeHtml(translateValue('Ustaw tę animację w pozostałych Flow tej encji')) + ' (' + siblings.length + ')</span></button></div>' : ''));
  return sideSwitch + steering + frame + shape + colors + animation;
}
function openFlowEditor(id, preserveSection = flowEditorOpenSectionIndex) {
  const flow = activeSceneView()?.flows?.[id]; if (!flow) return closeFlowEditor();
  const newlySelected = selectedFlowId !== id;
  if (newlySelected) { preserveSection = flowEditorOpenSectionIndex = -1; flowEditorSide = flowSideOf(flow, flowNumericState(flow.entityId)); }
  closeEditor(); closeRoomEditor(); selectedFlowId = id;
  els.flowEditorTitle.textContent = flow.displayName || flow.entityId || 'Flow'; els.flowEditorEntity.textContent = flow.entityId || '—'; els.flowEditorIntegration.textContent = 'Flow' + (flow.integrationName ? ' · ' + flow.integrationName : '');
  if (els.flowEditorIcon) els.flowEditorIcon.innerHTML = flow.entityId ? integrationIconMarkupFor(flow.sourceDomain || flow.entityId.split('.')[0], flow.integrationName || flow.sourceDomain, 'editor-brand-icon') : '<span class="integration-icon room-editor-icon"><i class="mdi mdi-chevron-triple-right"></i></span>';
  const scroll = els.flowEditorContent.scrollTop;
  els.flowEditorContent.innerHTML = flowEditorMarkup(flow); syncLinkedSizes(els.flowEditorContent);
  const sections = $$('.editor-section', els.flowEditorContent);
  if (Number.isInteger(preserveSection) && preserveSection >= 0 && sections[preserveSection]) sections[preserveSection].open = true;
  sections.forEach((details, index) => details.addEventListener('toggle', () => {
    if (details.open) { flowEditorOpenSectionIndex = index; sections.forEach(other => { if (other !== details) other.removeAttribute('open'); }); }
    else if (flowEditorOpenSectionIndex === index) flowEditorOpenSectionIndex = -1;
    requestAnimationFrame(() => requestAnimationFrame(() => { if (details.open) details.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(els.flowEditor); }));
  }));
  $('#flow-entity-search')?.addEventListener('input', renderFlowEntityResults);
  $$('input,select', els.flowEditorContent).forEach(input => {
    if (input.id === 'flow-entity-search') return;
    if (input.type === 'checkbox' || input.tagName === 'SELECT' || input.type === 'number' || input.type === 'text') input.addEventListener('change', onFlowEditorInput);
    else { input.addEventListener('input', onFlowEditorInput); input.addEventListener('change', onFlowEditorInput); }
  });
  els.flowEditorContent.scrollTop = scroll;
  $('#flow-paste-style').disabled = !flowStyleClipboard; syncLockButton($('#flow-geometry-lock'), flow.geometryLocked);
  els.flowEditor.classList.add('visible'); els.flowEditor.setAttribute('aria-hidden','false'); renderMarkers();
  if (newlySelected) requestAnimationFrame(() => requestAnimationFrame(() => { focusScenePointOnMobile(flow.xPercent, flow.yPercent); syncFlowSelection(); }));
  requestAnimationFrame(positionFlowEditor);
}
function flowStyleTarget(flow, prop, side = flowEditorSide) {
  if (side === 'negative' && flowSeparateStyles(flow) && FLOW_STYLE_KEYS.includes(prop)) return (flow.negativeStyle ||= {});
  return flow;
}
function onFlowEditorInput(event) {
  const flow = activeSceneView()?.flows?.[selectedFlowId], input = event.target, prop = input.dataset.path; if (!flow || !prop) return;
  let value = input.type === 'checkbox' ? input.checked : input.value;
  if (input.dataset.valueType === 'range' || input.dataset.valueType === 'number') { value = Number(value); if (!Number.isFinite(value)) return; }
  if (input.dataset.integer === 'true') value = Math.round(value);
  if (input.type === 'color') value = String(value).toUpperCase();
  if (prop === 'displayName') value = String(value).trim() || flow.entityId;
  if (prop === 'negativeStyleEnabled' && value && !flow.negativeStyle) flow.negativeStyle = Object.fromEntries(FLOW_STYLE_KEYS.map(key => [key, clone(flow[key] ?? FLOW_DEFAULTS[key])]));
  flowStyleTarget(flow, prop)[prop] = value; flow.updatedAt = new Date().toISOString();
  if (prop === 'displayName') { els.flowEditorTitle.textContent = value; renderAdded(); }
  const output = input.closest('.control')?.querySelector('output');
  if (output) output.textContent = input.value + (output.dataset.suffix || '');
  renderMarkers();
  if (input.dataset.editorRefresh === 'true' && event.type === 'change') { openFlowEditor(flow.id); scheduleSave(true); return; }
  scheduleSave(event.type === 'change');
}
function onFlowEditorClick(event) {
  const setId = event.target.closest('[data-flow-entity-set]')?.dataset.flowEntitySet, clear = event.target.closest('[data-flow-entity-clear]');
  if (setId || clear) { event.preventDefault(); const flow = activeSceneView()?.flows?.[selectedFlowId]; if (flow) setFlowEntity(flow, setId || ''); return; }
  if (event.target.closest('[data-flow-sync-animation]')) {
    event.preventDefault(); const view = activeSceneView(), flow = view?.flows?.[selectedFlowId]; if (!flow) return;
    const source = flowEffective(flow, flowEditorSide), values = Object.fromEntries(FLOW_ANIMATION_KEYS.map(key => [key, source[key]])), now = new Date().toISOString();
    const others = Object.values(view.flows).filter(other => other.id !== flow.id && other.entityId === flow.entityId);
    others.forEach(other => { Object.assign(other, clone(values), { updatedAt:now }); if (other.negativeStyle) Object.assign(other.negativeStyle, clone(values)); });
    renderMarkers(); scheduleSave(true); notify(`${translateValue('Ustawiono tę samą animację w innych Flow tej encji')}: ${others.length}`); return;
  }
  const sideButton = event.target.closest('[data-flow-side]');
  if (sideButton) { event.preventDefault(); flowEditorSide = sideButton.dataset.flowSide === 'negative' ? 'negative' : 'positive'; openFlowEditor(selectedFlowId); return; }
  const reset = event.target.closest('[data-reset-path]');
  if (reset) {
    event.preventDefault(); const input = els.flowEditorContent.querySelector('input[data-path="' + CSS.escape(reset.dataset.resetPath) + '"]');
    if (!input || input.disabled || !(reset.dataset.resetPath in FLOW_DEFAULTS)) return;
    input.value = FLOW_DEFAULTS[reset.dataset.resetPath]; input.dispatchEvent(new Event('change', { bubbles:true })); return;
  }
  const toggle = event.target.closest('[data-color-toggle]'), swatch = event.target.closest('[data-palette-color]'), rgb = event.target.closest('[data-rgb-color]');
  if (toggle) { event.preventDefault(); const menu = toggle.closest('.color-picker').querySelector('.color-menu'), open = menu.classList.contains('visible'); $$('.color-menu', els.flowEditorContent).forEach(x => x.classList.remove('visible')); menu.classList.toggle('visible', !open); if (!open) requestAnimationFrame(() => menu.scrollIntoView({ block:'nearest' })); return; }
  if (swatch) { event.preventDefault(); const picker = swatch.closest('.color-picker'), input = $('.color-native', picker); input.value = swatch.dataset.paletteColor; $('.color-current', picker).style.background = input.value; $('.color-menu', picker).classList.remove('visible'); input.dispatchEvent(new Event('change', { bubbles:true })); return; }
  if (rgb) { event.preventDefault(); rgb.closest('.color-picker').querySelector('.color-native').click(); }
}
function flowStyleOf(flow) {
  const excluded = new Set(['id','entityId','integrationId','integrationName','sourceDomain','displayName','xPercent','yPercent','createdAt','updatedAt','geometryLocked']);
  return clone(Object.fromEntries(Object.entries(flow).filter(([key]) => !excluded.has(key))));
}
function copyFlowStyle() {
  const flow = activeSceneView()?.flows?.[selectedFlowId]; if (!flow) return;
  flowStyleClipboard = flowStyleOf(flow); $('#flow-paste-style').disabled = false; notify('Skopiowano styl Flow — wklej go w innym Flow');
}
function pasteFlowStyle() {
  const flow = activeSceneView()?.flows?.[selectedFlowId]; if (!flow || !flowStyleClipboard) return;
  Object.assign(flow, clone(flowStyleClipboard), { updatedAt:new Date().toISOString() }); if (!flowStyleClipboard.negativeStyle) delete flow.negativeStyle;
  openFlowEditor(flow.id); scheduleSave(true); notify('Wklejono styl Flow');
}
async function resetFlowStyle() {
  const flow = activeSceneView()?.flows?.[selectedFlowId]; if (!flow || !await appConfirm({ title:'Przywrócić domyślny Flow?', message:'Obecne ustawienia wyglądu i działania Flow zostaną zastąpione domyślnymi. Pozycja i nazwa zostaną zachowane.', confirmText:'Przywróć', danger:true })) return;
  Object.assign(flow, clone(FLOW_DEFAULTS), { updatedAt:new Date().toISOString() }); delete flow.negativeStyle; flowEditorSide = 'positive';
  openFlowEditor(flow.id); scheduleSave(true); notify('Przywrócono domyślny Flow');
}
// A marker copy keeps the whole look and gets its own id; a text element also gets its own virtual entity id.
function duplicateMarker() {
  const marker = model.entities[selectedId]; if (!marker || marker.roomId) return;
  const now = new Date().toISOString(), copy = clone(marker), text = isTextId(marker.entityId), id = text ? `${TEXT_DOMAIN}.${uid()}` : uid();
  Object.assign(copy, { id, entityId: text ? id : marker.entityId, xPercent: clamp(Number(marker.xPercent) + 4, 0, 100), yPercent: clamp(Number(marker.yPercent) + 4, 0, 100), geometryLocked: false, createdAt: now, updatedAt: now });
  model.entities[id] = copy; renderMarkers(); renderAdded(); scheduleSave(true); selectMarker(id); notify('Utworzono kopię markera — przeciągnij ją w wybrane miejsce');
}
// Several Flow objects may use the same entity; a duplicate keeps the whole style and gets its own id.
function duplicateFlow() {
  const view = activeSceneView(), flow = view?.flows?.[selectedFlowId]; if (!flow) return;
  const id = 'flow_' + uid(), now = new Date().toISOString(), copy = clone(flow);
  Object.assign(copy, { id, xPercent: clamp(Number(flow.xPercent) + 4, 0, 100), yPercent: clamp(Number(flow.yPercent) + 4, 0, 100), geometryLocked: false, createdAt: now, updatedAt: now });
  view.flows[id] = copy; renderAdded(); openFlowEditor(id); scheduleSave(true); notify('Utworzono kopię Flow — przeciągnij ją w wybrane miejsce');
}
async function confirmRemoveFlow() {
  const flow = activeSceneView()?.flows?.[selectedFlowId]; if (!flow || !await appConfirm({ title:'Usunąć Flow?', message:'„' + (flow.displayName || flow.entityId) + '” zniknie z tego widoku. Zwykły marker tej encji zostanie.', confirmText:'Usuń', danger:true })) return;
  closeFlowEditor(); removeFlow(flow.id);
}
function isToggleableMarker(marker) {
  const toggleable = id => ['switch', 'light', 'fan', 'input_boolean'].includes(String(id || '').split('.', 1)[0]);
  if (marker?.roomId) return (roomsOf()[marker.roomId]?.entityIds || []).some(toggleable);
  return toggleable(marker?.entityId);
}
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
// While a finger is on the scene, marker/Flow nodes are not rebuilt: replacing the node under the finger
// makes the browser send the rest of that touch to the removed node, so the page never sees it move or
// lift (the view swipe then stops half-way). Deferred updates are drawn right after the gesture.
const deferredMarkerIds = new Set(); let deferredFlows = false, deferredFullRender = false, lastPointerActivity = 0;
function touchGestureActive() { return Boolean(viewSwipe) || swipeBusy || (viewPointers.size > 0 && performance.now() - lastPointerActivity < 3000); }
function flushDeferredRenders() {
  if (touchGestureActive() || (!deferredMarkerIds.size && !deferredFlows && !deferredFullRender)) return;
  if (deferredFullRender) { deferredFullRender = false; deferredFlows = false; deferredMarkerIds.clear(); renderMarkers(); if (selectedFlowId) syncFlowSelection(); return; }
  const ids = [...deferredMarkerIds]; deferredMarkerIds.clear();
  ids.forEach(entityId => markersForEntity(entityId).forEach(marker => { const node = markerNode(marker.id); if (node) { node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker); } }));
  if (deferredFlows) { deferredFlows = false; renderFlows(); if (selectedFlowId) syncFlowSelection(); }
}
function renderMarkerState(entityId, nextState) {
  if (!nextState) return;
  stateCache[entityId] = { ...stateCache[entityId], ...nextState };
  // A thermostat's own change is shown until Home Assistant reports the same values.
  const tp = thermoPending.get(entityId), st = stateCache[entityId];
  const realMode = String(entityId).startsWith('water_heater.') ? String(st?.attributes?.operation_mode ?? st?.state ?? '') : st?.state;
  if (tp && (tp.temperature === undefined || Number(st?.attributes?.temperature) === tp.temperature) && (tp.hvac_mode === undefined || realMode === tp.hvac_mode) && (tp.preset_mode === undefined || st?.attributes?.preset_mode === tp.preset_mode)) thermoPending.delete(entityId);
  if (touchGestureActive()) { deferredMarkerIds.add(entityId); if (moreInfoEntityId === entityId) refreshMoreInfoState(); return; }
  markersForEntity(entityId).forEach(marker => { const node = markerNode(marker.id); if (node) { node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker); } });
  if (moreInfoEntityId === entityId) refreshMoreInfoState();
}
async function confirmToggleState(marker, expectedState) {
  for (const wait of [0, 180, 420, 800]) {
    if (wait) await delay(wait);
    // A newer tap on the same entity takes over; this check is no longer needed.
    if (pendingToggleStates.get(marker.entityId) !== expectedState) return true;
    const data = await api('selected_states', jsonOptions({ entity_ids: [marker.entityId] }));
    const current = data.states?.[marker.entityId];
    const state = String(current?.state || '').toLowerCase();
    if (state !== expectedState) continue;
    pendingToggleStates.delete(marker.entityId);
    renderMarkerState(marker.entityId, current);
    return true;
  }
  return false;
}
// The marker flips at once (optimistic) and Home Assistant's answer confirms or reverts it. Taps are only held
// back while the command itself is being sent, not while the new state is being confirmed.
async function toggleMarker(marker) {
  const id = marker.entityId;
  if (!isToggleableMarker(marker) || markerTogglesInFlight.has(id)) return;
  const state = String(stateCache[id]?.state || '').toLowerCase();
  if (!['on', 'off'].includes(state)) return notify('Nie można przełączyć encji w tym stanie.', true);
  const expectedState = state === 'on' ? 'off' : 'on', previous = stateCache[id];
  markerTogglesInFlight.add(id);
  pendingToggleStates.set(id, expectedState);
  renderMarkerState(id, { ...previous, state: expectedState }); if (roomUsesEntity(id)) renderRooms();
  try {
    await api('control', jsonOptions({ entity_id: id, action: expectedState === 'on' ? 'turn_on' : 'turn_off' }));
  } catch (error) {
    markerTogglesInFlight.delete(id);
    if (pendingToggleStates.get(id) === expectedState) { pendingToggleStates.delete(id); renderMarkerState(id, previous); if (roomUsesEntity(id)) renderRooms(); }
    return notify(`Błąd przełączania: ${error.message}`, true);
  }
  markerTogglesInFlight.delete(id);
  if (!await confirmToggleState(marker, expectedState) && pendingToggleStates.get(id) === expectedState) {
    pendingToggleStates.delete(id);
    await refreshStates();
    notify('Stan encji nie został jeszcze potwierdzony.', true);
  }
}
function onMarkerClick(event) {
  if (event.currentTarget.dataset.dragged === '1') { event.currentTarget.dataset.dragged = '0'; return; }
  event.stopPropagation();
  const marker = model.entities[event.currentTarget.dataset.markerId];
  if (!marker) return;
  if (!editMode && isTextId(marker.entityId)) return runLinkAction(marker);
  if (!editMode && marker.type === 'thermostat') { const button = event.target.closest?.('[data-thermo], [data-thermo-mode], [data-thermo-preset]'); if (button) { if (!button.disabled) thermoTap(marker, button); return; } }
  if (!editMode && marker.roomId) { const room = roomsOf()[marker.roomId]; if (marker.tapAction === 'none' || !room) return; return onRoomTap(room, marker.tapAction); }
  if (!editMode) { if (marker.tapAction === 'none') return; return (marker.tapAction === 'toggle' && isToggleableMarker(marker) ? toggleMarker(marker) : openMoreInfo(marker.entityId)); }
  selectMarker(marker.id);
}
function focusSelectedMarkerOnMobile() {
  if (!mobileView() || !editMode || !selectedId) return;
  const marker = model.entities[selectedId]; if (!marker) return;
  focusScenePointOnMobile(marker.xPercent, marker.yPercent);
}
// Like a marker, a selected room is brought into view on phones: zoomed so the whole room fits above the
// bottom editor (never closer than a marker gets), centred at the same spot.
// The free band of the scene viewport on a phone (viewport coordinates): from under the top bar to the top of the
// open bottom editor — its final top, above the on-screen keyboard when that is open, even while it still slides in —
// with a small margin. Selected elements are centred in it.
function editorFreeBand() {
  const vr = els.viewport.getBoundingClientRect();
  const panel = ['#room-editor', '#editor', '#flow-editor'].map(sel => $(sel)).find(node => node?.classList.contains('visible'));
  const screenBottom = window.visualViewport ? window.visualViewport.offsetTop + window.visualViewport.height : innerHeight;
  const editorTop = panel ? Math.min(panel.getBoundingClientRect().top, screenBottom - panel.offsetHeight) : Math.min(vr.bottom, screenBottom);
  // While the add wizard is open (under the top bar on a phone) the free band starts below it.
  const wizard = roomWizard && $('#room-wizard.visible');
  const topEdge = Math.max($('.topbar')?.getBoundingClientRect().bottom || 0, wizard ? wizard.getBoundingClientRect().bottom : 0);
  const top = Math.max(topEdge - vr.top, 0) + 14;
  const bottom = Math.min(editorTop, vr.bottom) - vr.top - 14;
  return { top, bottom, height: Math.max(60, bottom - top) };
}
// On a computer, zoomed in while editing: the selected element glides to the middle of the free screen (same zoom).
function focusSceneBoxOnDesktop(points) {
  if (mobileView() || !editMode || !points.length || !deskZoomExpanded()) return;
  const W = els.scene.offsetWidth || 1, H = els.scene.offsetHeight || 1, xs = points.map(p => Number(p[0]) / 100 * W), ys = points.map(p => Number(p[1]) / 100 * H);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, R = deskZoomRegion(), vp = els.viewport.getBoundingClientRect();
  glideCamera(viewZoom, (R.left + R.right) / 2 - vp.left - cx * viewZoom, (R.top + R.bottom) / 2 - vp.top - cy * viewZoom);
}
function focusSceneBoxOnMobile(points) {
  if (!mobileView()) return focusSceneBoxOnDesktop(points);
  if (!editMode || !points.length) return;
  const sceneWidth = els.scene.offsetWidth || 1, sceneHeight = els.scene.offsetHeight || 1;
  const xs = points.map(p => Number(p[0]) / 100 * sceneWidth), ys = points.map(p => Number(p[1]) / 100 * sceneHeight);
  const boxW = Math.max(1, Math.max(...xs) - Math.min(...xs)), boxH = Math.max(1, Math.max(...ys) - Math.min(...ys));
  const viewW = els.viewport.clientWidth || 1, viewH = els.viewport.clientHeight || 1;
  const { top: freeTop, height: freeH } = editorFreeBand();
  // Just above the smallest zoom at least: at the smallest one the camera does not move, so a big element (e.g. a
  // thermostat) low on the plan would stay under the editor instead of being centred.
  const nextZoom = clamp(Math.min(viewW * .86 / boxW, freeH / boxH), Math.min(minViewZoom() + .001, Math.max(zoomFloor(), Math.min(viewW * .86 / boxW, freeH / boxH))), 2.35);
  const centreX = (Math.min(...xs) + Math.max(...xs)) / 2, centreY = (Math.min(...ys) + Math.max(...ys)) / 2;
  const targetY = freeTop + freeH / 2;
  glideCamera(nextZoom, viewW / 2 - centreX * nextZoom, targetY - centreY * nextZoom);
}
function focusScenePointOnMobile(xPercent, yPercent) {
  if (!mobileView()) return focusSceneBoxOnDesktop([[xPercent, yPercent]]);
  if (!editMode) return;
  const marker = { xPercent, yPercent };
  // Deliberately closer than beta.52: selected markers remain clear of the
  // bottom editor even on the lowest part of a portrait background.
  const nextZoom = clamp(Math.max(viewZoom, 2.1), minViewZoom(), 2.35);
  const sceneWidth = els.scene.offsetWidth || 1, sceneHeight = els.scene.offsetHeight || 1;
  const markerX = Number(marker.xPercent || 50) / 100 * sceneWidth;
  const markerY = Number(marker.yPercent || 50) / 100 * sceneHeight;
  const targetX = els.viewport.clientWidth / 2, band = editorFreeBand();
  const targetY = band.top + band.height / 2;
  glideCamera(nextZoom, targetX - markerX * nextZoom, targetY - markerY * nextZoom);
}
// Centring glides instead of jumping: the camera eases towards its target every frame, and a new target (e.g. each
// size step of the on-screen keyboard) only moves the goal, so nothing jumps. A finger on the plan stops it.
let cameraGoal = null, cameraGlideFrame = 0;
function glideCamera(zoom, panX, panY) {
  const from = [viewZoom, viewPanX, viewPanY];
  viewZoom = zoom; viewPanX = panX; viewPanY = panY; applyViewTransform(); // the target, kept within the camera limits
  cameraGoal = [viewZoom, viewPanX, viewPanY];
  [viewZoom, viewPanX, viewPanY] = from; applyViewTransform();
  if (!cameraGlideFrame) cameraGlideFrame = requestAnimationFrame(glideStep);
}
function stopCameraGlide() { cancelAnimationFrame(cameraGlideFrame); cameraGlideFrame = 0; cameraGoal = null; }
function glideStep() {
  cameraGlideFrame = 0; if (!cameraGoal || viewPointers.size) { cameraGoal = null; return; }
  const [z, x, y] = cameraGoal, k = .25;
  viewZoom += (z - viewZoom) * k; viewPanX += (x - viewPanX) * k; viewPanY += (y - viewPanY) * k;
  if (Math.abs(z - viewZoom) < .002 && Math.abs(x - viewPanX) < .5 && Math.abs(y - viewPanY) < .5) { viewZoom = z; viewPanX = x; viewPanY = y; cameraGoal = null; }
  applyViewTransform();
  if (cameraGoal) cameraGlideFrame = requestAnimationFrame(glideStep);
}
function selectMarker(key) {
  editorOpenSectionIndex = -1; if (selectedId !== key) editorPreview = { entityId:'', state:'' }; selectedId = key; renderMarkers(); openEditor();
  requestAnimationFrame(() => requestAnimationFrame(focusSelectedMarkerOnMobile));
}
function hideSelection() { els.selection.classList.remove('visible','geometry-locked'); }
function syncSelection() {
  fitCardHandles();
  const node = markerNode(selectedId); if (!node) return hideSelection();
  const sr = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect(), zoom = sceneCameraActive() ? viewZoom : 1;
  Object.assign(els.selection.style, { left: `${(r.left - sr.left) / zoom}px`, top: `${(r.top - sr.top) / zoom}px`, width: `${r.width / zoom}px`, height: `${r.height / zoom}px` });
  els.selection.classList.toggle('geometry-locked', Boolean(model.entities[selectedId]?.geometryLocked));
  els.selection.classList.add('visible');
}
function hideFlowSelection() { els.flowSelection?.classList.remove('visible','geometry-locked'); }
function syncFlowSelection() {
  const flow = activeSceneView()?.flows?.[selectedFlowId], node = flow && $('.flow-marker[data-flow-id="' + CSS.escape(flow.id) + '"]');
  if (!flow || !node || !els.flowSelection) return hideFlowSelection();
  const sr = els.scene.getBoundingClientRect(), r = node.getBoundingClientRect(), zoom = sceneCameraActive() ? viewZoom : 1;
  Object.assign(els.flowSelection.style, { left: `${(r.left - sr.left) / zoom}px`, top: `${(r.top - sr.top) / zoom}px`, width: `${r.width / zoom}px`, height: `${r.height / zoom}px` });
  els.flowSelection.classList.toggle('geometry-locked', Boolean(flow.geometryLocked));
  els.flowSelection.classList.add('visible');
}
function startFlowResize(event) {
  const flow = activeSceneView()?.flows?.[selectedFlowId], node = flow && $('.flow-marker[data-flow-id="' + CSS.escape(flow.id) + '"]');
  if (!editMode || !flow || !node || flow.geometryLocked || event.button !== 0) return;
  event.preventDefault(); event.stopPropagation();
  const handle = event.currentTarget.dataset.flowHandle, side = node.dataset.side || 'positive', style = flowEffective(flow, side);
  const target = flowStyleTarget(flow, 'flowLength', side);
  const angle = (Number(node.dataset.angle) || 0) * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
  const k = (sceneScale || 1) * (sceneCameraActive() ? viewZoom : 1), sceneRect = els.scene.getBoundingClientRect();
  const hx = handle.includes('w') ? -1 : 1, hy = handle.includes('n') ? -1 : 1;
  const lsx = Math.sign(hx * cos + hy * sin) || 1, lsy = Math.sign(-hx * sin + hy * cos) || 1;
  const start = { x:event.clientX, y:event.clientY, w:Number(style.flowLength) || 84, h:Number(style.chevronHeight) || 22, item:Number(style.chevronWidth) || 22, gap:(Number(style.gap) || 0), px:Number(flow.xPercent), py:Number(flow.yPercent) };
  let changed = false, lastValid = null;
  const move = current => {
    if ((current.buttons & 1) !== 1) return finish();
    lastValid ||= { flowLength:target.flowLength, chevronHeight:target.chevronHeight, chevronWidth:target.chevronWidth, gap:target.gap, x:flow.xPercent, y:flow.yPercent };
    const dx = current.clientX - start.x, dy = current.clientY - start.y, lx = (dx * cos + dy * sin) / k, ly = (-dx * sin + dy * cos) / k;
    const w = clamp(Math.round(start.w + lsx * lx), 8, FLOW_LIMITS.length), h = clamp(Math.round(start.h + lsy * ly), FLOW_LIMITS.min, FLOW_LIMITS.size);
    const ratio = w / Math.max(1, start.w);
    target.flowLength = w; target.chevronHeight = h; target.chevronWidth = clamp(Math.round(start.item * ratio), 2, FLOW_LIMITS.size); target.gap = Math.round(start.gap * ratio);
    const shiftX = lsx * (w - start.w) / 2 * k, shiftY = lsy * (h - start.h) / 2 * k;
    flow.xPercent = start.px + (shiftX * cos - shiftY * sin) / sceneRect.width * 100; flow.yPercent = start.py + (shiftX * sin + shiftY * cos) / sceneRect.height * 100;
    changed = true; renderMarkers();
    const drawn = $('.flow-marker[data-flow-id="' + CSS.escape(flow.id) + '"]');
    if (keepInBounds() && drawn && nodeOutsideScene(drawn)) { Object.assign(target, { flowLength:lastValid.flowLength, chevronHeight:lastValid.chevronHeight, chevronWidth:lastValid.chevronWidth, gap:lastValid.gap }); flow.xPercent = lastValid.x; flow.yPercent = lastValid.y; renderMarkers(); }
    else lastValid = { flowLength:target.flowLength, chevronHeight:target.chevronHeight, chevronWidth:target.chevronWidth, gap:target.gap, x:flow.xPercent, y:flow.yPercent };
  };
  const finish = () => { window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',finish); window.removeEventListener('pointercancel',finish); if (changed) { flow.updatedAt = new Date().toISOString(); scheduleSave(true); openFlowEditor(flow.id); } };
  window.addEventListener('pointermove',move); window.addEventListener('pointerup',finish); window.addEventListener('pointercancel',finish);
}
// Desktop editors open next to the edited element (markers and Flow share this placement).
// ---- Desktop editing dock ----------------------------------------------------------------------
// On a computer, edit mode keeps a fixed side panel (right by default, left on request): the marker, Flow and room
// editors open in it and the scene is narrowed by its width, so an editor never covers the element being edited.
// Phones keep the bottom sheet.
const DOCK_SIDE_KEY = 'ha-views-dock-side';
function dockMode() { return editMode && !mobileView(); }
function dockSide() { try { return localStorage.getItem(DOCK_SIDE_KEY) === 'left' ? 'left' : 'right'; } catch { return 'right'; } }
function syncDock() {
  const on = dockMode(), was = els.body.classList.contains('dock-mode'), left = dockSide() === 'left';
  els.body.classList.toggle('dock-mode', on); els.body.classList.toggle('dock-left', on && left);
  $('#edit-dock')?.setAttribute('aria-hidden', String(!on));
  $$('[data-dock-side] i').forEach(icon => { icon.className = `mdi ${left ? 'mdi-dock-right' : 'mdi-dock-left'}`; });
  if (on !== was) requestAnimationFrame(() => { applyBackgroundTransform(); updateSceneGeometry(); });
}
function toggleDockSide() {
  try { localStorage.setItem(DOCK_SIDE_KEY, dockSide() === 'left' ? 'right' : 'left'); } catch {}
  els.body.classList.add('dock-switching'); syncDock(); requestAnimationFrame(() => { applyBackgroundTransform(); updateSceneGeometry(); requestAnimationFrame(() => els.body.classList.remove('dock-switching')); });
}
function placeEditorNear(panel, node) {
  if (dockMode()) return;
  const r = node.getBoundingClientRect(), width = panel.offsetWidth || 390, height = panel.offsetHeight || 500, gap = 14;
  let left = r.left + r.width / 2 < innerWidth / 2 ? r.right + gap : r.left - width - gap;
  if (left + width > innerWidth - 8) left = r.left - width - gap;
  if (left < 8) left = r.right + gap;
  left = clamp(left, 8, Math.max(8, innerWidth - width - 8));
  const top = clamp(r.top - 18, 80, Math.max(80, innerHeight - height - 8));
  Object.assign(panel.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
}
function positionEditor() {
  if (mobileView() || editorDragged || !selectedId || !els.editor.classList.contains('visible')) return;
  const node = markerNode(selectedId); if (!node) return;
  placeEditorNear(els.editor, node);
}
function positionFlowEditor() {
  if (mobileView() || flowEditorDragged || !selectedFlowId || !els.flowEditor.classList.contains('visible')) return;
  const node = $('.flow-marker[data-flow-id="' + CSS.escape(selectedFlowId) + '"]'); if (!node) return;
  placeEditorNear(els.flowEditor, node);
}
function keepEditorInViewport(panel = els.editor) {
  if (mobileView() || dockMode() || !panel.classList.contains('visible')) return;
  const r = panel.getBoundingClientRect(), left = clamp(r.left, 8, Math.max(8, innerWidth - r.width - 8)), top = clamp(r.top, 8, Math.max(8, innerHeight - r.height - 8));
  Object.assign(panel.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
}
// While a marker or Flow is dragged near the edge of the view, the camera follows it (the element keeps sitting
// under the finger, so it moves deeper with the camera). On phones the element is centred above the editor on release.
// The part of the scene viewport really visible: below the top bar and, on phones, above an open bottom editor.
// Edge zones that move the camera are measured from this band, not from the whole screen.
function visibleSceneBand() {
  const v = els.viewport.getBoundingClientRect(), topbar = $('.topbar')?.getBoundingClientRect().bottom || 0;
  let bottom = v.bottom;
  if (mobileView()) ['#editor', '#flow-editor', '#room-editor'].forEach(sel => { const panel = $(sel); if (panel?.classList.contains('visible')) bottom = Math.min(bottom, panel.getBoundingClientRect().top); });
  const top = Math.max(v.top, topbar);
  return { left: v.left, right: v.right, top, bottom: Math.max(bottom, top + 80) };
}
let cameraPanning = false;
function dragCamera(onPan) {
  let last = null, frame = 0, since = 0;
  const step = now => {
    frame = 0; if (!last || !sceneCameraActive()) return;
    // Gentle: speed grows with the depth into the edge zone (squared) and ramps up over ~0.6 s after reaching it.
    const v = visibleSceneBand(), zone = mobileView() ? 64 : 48, push = d => d < zone ? Math.pow((zone - Math.max(0, d)) / zone, 2) * 6.5 : 0;
    let vx = push(last.clientX - v.left) - push(v.right - last.clientX), vy = push(last.clientY - v.top) - push(v.bottom - last.clientY);
    if (!vx && !vy) { since = 0; return; }
    since ||= now; const ramp = Math.min(1, .25 + (now - since) / 800); vx *= ramp; vy *= ramp;
    stopCameraGlide(); const beforeX = viewPanX, beforeY = viewPanY; viewPanX += vx; viewPanY += vy; applyViewTransform();
    if (Math.abs(viewPanX - beforeX) < .01 && Math.abs(viewPanY - beforeY) < .01) return; // the camera is at its limit
    // While the camera carries the element nothing snaps to guides (they would hold it back in jerks).
    cameraPanning = true; try { onPan(last); } finally { cameraPanning = false; }
    // Keeps going on its own while the finger rests at the edge (a still finger sends no move events).
    if (!frame) frame = requestAnimationFrame(step);
  };
  return { track(event) { last = event; if (!frame) frame = requestAnimationFrame(step); }, stop() { cancelAnimationFrame(frame); frame = 0; last = null; since = 0; } };
}
function animateViewPan(toX, toY, ms = 280) {
  cancelAnimationFrame(animateViewPan.frame); stopCameraGlide();
  const fromX = viewPanX, fromY = viewPanY, t0 = performance.now();
  const tick = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); viewPanX = fromX + (toX - fromX) * e; viewPanY = fromY + (toY - fromY) * e; applyViewTransform(); if (k < 1) animateViewPan.frame = requestAnimationFrame(tick); };
  animateViewPan.frame = requestAnimationFrame(tick);
}
function centerAfterDrag(xPercent, yPercent) {
  if (!mobileView() || !editMode) return;
  // Two frames: the editor sheet is shown again first, so the part it covers is known.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const visible = els.viewport.clientHeight - editSheetCover();
    animateViewPan(els.viewport.clientWidth / 2 - Number(xPercent) / 100 * els.scene.offsetWidth * viewZoom, Math.max(74, visible / 2) - Number(yPercent) / 100 * els.scene.offsetHeight * viewZoom);
  }));
}
// Touch editing ("select first, then move"): on a phone a finger on an element that is not selected does not move
// it — dragging pans the plan as usual and a tap selects the element. Only the selected element can be dragged.
function touchSelectFirst(event, selected, select = null) {
  if (!event.pointerType || event.pointerType === 'mouse' || selected) return false;
  const sx = event.clientX, sy = event.clientY, t0 = performance.now(), id = event.pointerId;
  const end = e => {
    if (e.pointerId !== id) return; window.removeEventListener('pointerup', end, true); window.removeEventListener('pointercancel', end, true);
    if (select && e.type === 'pointerup' && Math.hypot(e.clientX - sx, e.clientY - sy) < 10 && performance.now() - t0 < 700) select();
  };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true);
  return true;
}
function startDrag(event) {
  if (!editMode || event.button !== 0) return;
  if (secondFingerToZoom(event)) return;
  if (touchSelectFirst(event, selectedId === event.currentTarget.dataset.markerId)) return; // a tap selects it (click)
  event.preventDefault(); const node = event.currentTarget, key = node.dataset.markerId, marker = model.entities[key];
  if (marker?.geometryLocked) return;
  const start = { x: event.clientX, y: event.clientY, px: marker.xPercent, py: marker.yPercent }; let moved = false, guides = null;
  const r0 = els.scene.getBoundingClientRect(), grab = [(event.clientX - r0.left) / Math.max(1, r0.width) * 100 - Number(start.px), (event.clientY - r0.top) / Math.max(1, r0.height) * 100 - Number(start.py)];
  const dropGuides = () => { clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; guides = null; };
  const camera = dragCamera(e => { dropGuides(); move(e); });
  node.setPointerCapture(event.pointerId);
  const move = e => {
    const r = els.scene.getBoundingClientRect(), dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) > 3 && !moved) { moved = true; els.editor.classList.add('marker-moving'); }
    if (!moved) return;
    guides ||= alignmentContext(node); guides.onSettle = () => move(e);
    ({ xPercent: marker.xPercent, yPercent: marker.yPercent } = alignToGuides(guides, snapPercent((e.clientX - r.left) / Math.max(1, r.width) * 100 - grab[0]), snapPercent((e.clientY - r.top) / Math.max(1, r.height) * 100 - grab[1]), e));
    camera.track(e);
    const live = node.isConnected ? node : markerNode(key);
    if (live) { live.style.left = `${marker.xPercent}%`; live.style.top = `${marker.yPercent}%`; const fix = keepInBounds() && boundsShift(live); if (fix) { marker.xPercent = clamp(marker.xPercent + fix.x, 0, 100); marker.yPercent = clamp(marker.yPercent + fix.y, 0, 100); live.style.left = `${marker.xPercent}%`; live.style.top = `${marker.yPercent}%`; } } if (selectedId === key) syncSelection();
  };
  const up = () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up); try { if (node.hasPointerCapture?.(event.pointerId)) node.releasePointerCapture(event.pointerId); } catch {} camera.stop(); dropGuides(); els.editor.classList.remove('marker-moving'); showAlignGuides([], []); node.dataset.dragged = moved ? '1' : '0'; if (moved) { marker.updatedAt = new Date().toISOString(); scheduleSave(true); positionEditor(); centerAfterDrag(marker.xPercent, marker.yPercent); } };
  node.addEventListener('pointermove', move); node.addEventListener('pointerup', up, { once: true }); node.addEventListener('pointercancel', up, { once: true });
}

const CHOICE_ICONS = {
  any: { none:'mdi-cancel', left:'mdi-arrow-left', right:'mdi-arrow-right', top:'mdi-arrow-up', bottom:'mdi-arrow-down', up:'mdi-arrow-up', down:'mdi-arrow-down',
    more_info:'mdi-information-outline', toggle:'mdi-toggle-switch-outline', rounded:'mdi-square-rounded-outline', circle:'mdi-circle-outline', square:'mdi-square-outline', custom:'mdi-vector-square-edit',
    column:'mdi-view-agenda-outline', row:'mdi-view-column-outline', view:'mdi-view-dashboard-outline', ha:'mdi-home-assistant', url:'mdi-link-variant',
    manual:'mdi-arrow-right-bold-outline', auto:'mdi-plus-minus-variant', pulse:'mdi-heart-pulse', flow:'mdi-chevron-triple-right',
    chevron:'mdi-chevron-right', arrow:'mdi-arrow-right-thin', dart:'mdi-navigation-variant', triangle:'mdi-triangle-outline', segment:'mdi-minus-thick',
    center:'mdi-brightness-7', corner:'mdi-arrow-top-left-bold-box-outline', wall:'mdi-wall-sconce-flat-outline', ambient:'mdi-weather-sunset', entity:'mdi-home-assistant', integration:'mdi-puzzle-outline', mdi:'mdi-pencil-outline' },
  lightEffect: { none:'mdi-square' }, 'style.backgroundGradient': { none:'mdi-square' }, iconMode: { auto:'mdi-home-assistant', integration:'mdi-puzzle-outline', manual:'mdi-pencil-outline' },
  directionMode: { manual:'mdi-arrow-right-bold-outline', auto:'mdi-plus-minus-variant' }, labelNameWeight: { '':'mdi-format-font', normal:'mdi-format-letter-case', medium:'mdi-format-text', bold:'mdi-format-bold' }, labelStateWeight: { '':'mdi-format-font', normal:'mdi-format-letter-case', medium:'mdi-format-text', bold:'mdi-format-bold' }, 'style.labelWeight': { '':'mdi-format-font', normal:'mdi-format-letter-case', medium:'mdi-format-text', bold:'mdi-format-bold' }, 'style.valueWeight': { '':'mdi-format-font', normal:'mdi-format-letter-case', medium:'mdi-format-text', bold:'mdi-format-bold' },
  labelIconAnimType: { spin:'mdi-fan', pulse:'mdi-heart-pulse', blink:'mdi-flash-outline', swing:'mdi-arrow-left-right' }, labelIconAnimDir: { cw:'mdi-rotate-right', ccw:'mdi-rotate-left' },
  outlineStyle: { solid:'mdi-minus-thick', dashed:'mdi-dots-horizontal', dotted:'mdi-circle-small' }, labelStateDecimals: { auto:'', 0:'', 1:'', 2:'', 3:'' }, decimals: { auto:'', 0:'', 1:'', 2:'', 3:'' }, 'style.tickFontFamily': {}, linkView: {}
};
function choiceIcon(path, value) {
  const own = CHOICE_ICONS[path]; if (own && String(value) in own) return own[String(value)];
  if (own && !Object.keys(own).length) return '';
  return CHOICE_ICONS.any[String(value)] || '';
}
// Sub-sections work like an accordion: opening one closes the others of the same section, and a section opened
// by hand starts with all its sub-sections folded.
document.addEventListener('click', event => {
  const summary = event.target.closest('summary'); if (!summary) return;
  const details = summary.parentElement;
  if (details.classList.contains('gauge-subsection')) {
    if (!details.open) $$(':scope > .gauge-subsection, :scope > * > .gauge-subsection', details.parentElement).forEach(other => { if (other !== details) other.open = false; });
  } else if (details.classList.contains('editor-section') && !details.open) $$('.gauge-subsection', details).forEach(sub => { sub.open = false; });
}, true);
document.addEventListener('click', event => {
  const button = event.target.closest('.seg-btn'); if (!button || button.disabled) return;
  const control = button.closest('.control'), input = control?.querySelector('input[type="hidden"][data-path]'); if (!input) return;
  event.preventDefault(); if (input.value === button.dataset.segValue) return;
  input.value = button.dataset.segValue;
  control.querySelectorAll('.seg-btn').forEach(other => { const on = other === button; other.classList.toggle('active', on); other.setAttribute('aria-pressed', String(on)); });
  input.dispatchEvent(new Event('change', { bubbles:true }));
});
function plainControl(...args) { return control(...args); }
function control(label, path, type, value, options = {}) {
  const rounded = Boolean(options.integer);
  // Slider values are shown with as many decimals as their step (no 1.0869565217…).
  const decimals = String(options.step ?? '').split('.')[1]?.length || 0;
  const displayValue = rounded ? Math.round(Number(value) || 0) : type === 'range' && Number.isFinite(Number(value)) ? Number(Number(value).toFixed(decimals)) : value;
  const attrs = [`data-path="${path}"`, `data-value-type="${options.valueType || type}"`];
  if (rounded) attrs.push('data-integer="true"');
  if (options.placeholder) attrs.push(`placeholder="${escapeHtml(options.placeholder)}"`);
  if (options.min !== undefined) attrs.push(`min="${options.min}"`); if (options.max !== undefined) attrs.push(`max="${options.max}"`); if (options.step !== undefined) attrs.push(`step="${options.step}"`); if (options.refresh) attrs.push('data-editor-refresh="true"'); if (options.disabled) attrs.push('disabled');
  let input;
  if (type === 'checkbox') input = `<input type="checkbox" ${attrs.join(' ')} ${value ? 'checked' : ''}>`;
  else if (type === 'select' && options.items.length <= 8 && !options.dropdown) {
    // Choices are buttons (icon when one fits, otherwise a short text); a hidden input keeps the editors' input flow.
    input = `<input type="hidden" value="${escapeHtml(value)}" ${attrs.join(' ')}><div class="seg-choice" role="radiogroup">${options.items.map(([v, t]) => { const icon = choiceIcon(path, v), title = translateValue(String(t).replace(/<[^>]*>/g, '')); return `<button type="button" class="seg-btn${String(v) === String(value) ? ' active' : ''}${icon ? '' : ' text'}" data-seg-value="${escapeHtml(v)}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}" aria-pressed="${String(v) === String(value)}"${options.disabled ? ' disabled' : ''}>${icon ? `<i class="mdi ${icon}"></i>` : `<span>${t}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (type === 'select') input = `<select ${attrs.join(' ')}>${options.items.map(([v,t]) => `<option value="${v}" ${String(v) === String(value) ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  else if (type === 'color') input = `<div class="color-picker"><button type="button" class="color-current" data-color-toggle style="background:${escapeHtml(value)}" aria-label="Wybierz kolor"></button><input class="color-native" type="color" value="${escapeHtml(value)}" ${attrs.join(' ')}><div class="color-menu"><div class="color-palette">${COLOR_PALETTE.map(color => `<button type="button" data-palette-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join('')}</div><button type="button" class="rgb-button" data-rgb-color>Własny kolor RGB…</button></div></div>`;
  else input = `<input type="${type}" value="${escapeHtml(value)}" ${attrs.join(' ')}>`;
  const reset = type === 'range' ? `<button type="button" class="slider-reset" data-reset-path="${path}" title="Przywróć domyślną wartość" aria-label="Przywróć domyślną wartość"><i class="mdi mdi-restore"></i></button>` : '';
  const output = type === 'range' ? `<output data-suffix="${escapeHtml(options.suffix || '')}">${displayValue}${options.suffix || ''}</output>` : '<span></span>';
  return `<div class="control ${type === 'checkbox' ? 'checkbox' : ''} ${type === 'range' ? 'range-control' : ''}"><label>${label}</label>${input}${reset}${output}</div>`;
}
// One "Both dimensions" slider above a width/height pair: it moves both sliders together and keeps their proportion.
function linkedSizeControl(label, widthPath, heightPath, limits, disabled = false) {
  return `<div class="control range-control linked-size" data-link-w="${widthPath}" data-link-h="${heightPath}" data-limits="${limits.join(',')}"><label>${label}</label><input type="range" step="1" data-linked-size ${disabled ? 'disabled' : ''}><i class="mdi mdi-link-variant linked-size-icon" aria-hidden="true"></i><output></output></div>`;
}
function linkedSizeInputs(row) {
  const root = row.closest('.editor-section-body') || row.parentElement;
  return [root.querySelector(`input[data-path="${CSS.escape(row.dataset.linkW)}"]`), root.querySelector(`input[data-path="${CSS.escape(row.dataset.linkH)}"]`)];
}
function syncLinkedSizes(root = document) {
  $$('.linked-size', root).forEach(row => {
    const input = $('[data-linked-size]', row), [wi, hi] = linkedSizeInputs(row); if (!input || !wi || !hi || input.dataset.ratio) return;
    const w = Math.max(1, Number(wi.value) || 1), h = Math.max(1, Number(hi.value) || 1), ratio = w / h, [minW, maxW, minH, maxH] = row.dataset.limits.split(',').map(Number);
    // Logarithmic travel (0–1000), so small markers get as much slider room as big ones.
    const lo = Math.ceil(Math.max(minW, minH * ratio)), top = Math.floor(Math.max(lo + 1, Math.min(maxW, maxH * ratio)));
    input.min = 0; input.max = 1000; input.dataset.lo = lo; input.dataset.hi = top; input.value = Math.round(1000 * Math.log(clamp(w, lo, top) / lo) / Math.log(top / lo));
    const out = $('output', row); if (out) out.textContent = `${Math.round(w)}×${Math.round(h)}`;
  });
}
function onLinkedSizeInput(event) {
  const input = event.target; if (!input.matches?.('[data-linked-size]')) { if (input.dataset?.path && event.target.closest('.editor-section-body')?.querySelector('.linked-size')) syncLinkedSizes(event.target.closest('.editor-section-body')); return; }
  const row = input.closest('.linked-size'), [wi, hi] = linkedSizeInputs(row); if (!wi || !hi) return;
  if (!input.dataset.ratio) input.dataset.ratio = String(Math.max(1, Number(wi.value) || 1) / Math.max(1, Number(hi.value) || 1));
  const [, , minH, maxH] = row.dataset.limits.split(',').map(Number), lo = Number(input.dataset.lo) || 1, top = Number(input.dataset.hi) || lo + 1, w = Math.round(lo * Math.pow(top / lo, Number(input.value) / 1000)), h = Math.round(clamp(w / Number(input.dataset.ratio), minH, maxH));
  const type = event.type === 'change' ? 'change' : 'input';
  wi.value = w; wi.dispatchEvent(new Event(type, { bubbles:true })); hi.value = h; hi.dispatchEvent(new Event(type, { bubbles:true }));
  const out = $('output', row); if (out) out.textContent = `${w}×${h}`;
  if (type === 'change') { delete input.dataset.ratio; syncLinkedSizes(row.parentElement); }
}
function mdiControl(label, path, value) {
  return `<div class="control"><label>${label}</label><input type="text" list="mdi-icon-list" value="${escapeHtml(value)}" data-path="${path}" data-value-type="text" placeholder="np. mdi:weather-rainy"><span></span></div>`;
}
function section(title, body, open = false) { return `<details class="editor-section" ${open ? 'open' : ''}><summary>${title}</summary><div class="editor-section-body">${body}</div></details>`; }
function gaugeSubsection(title, body) { return `<details class="gauge-subsection"><summary>${title}</summary><div class="gauge-subsection-body">${body}</div></details>`; }
function backgroundGradientControls(s) {
  const variant = s.backgroundGradient || 'none', select = control('Efekt światła','style.backgroundGradient','select',variant,{items:[['none','Jednolity'],['center','Centralny'],['corner','Róg'],['wall','Od ściany'],['ambient','Ambient']],refresh:true});
  if (variant === 'none') return select;
  const position = variant === 'wall' ? '' : control('Pozycja pozioma','style.backgroundGradientX','range',s.backgroundGradientX,{min:0,max:100,step:1,suffix:'%'}) + control('Pozycja pionowa','style.backgroundGradientY','range',s.backgroundGradientY,{min:0,max:100,step:1,suffix:'%'});
  const wall = variant === 'wall' ? control('Kierunek','style.backgroundGradientDirection','select',s.backgroundGradientDirection || 'left',{items:[['left','Lewa'],['right','Prawa'],['top','Góra'],['bottom','Dół']]}) + control('Pozycja na ścianie','style.backgroundGradientY','range',s.backgroundGradientY,{min:0,max:100,step:1,suffix:'%'}) : '';
  return select + position + wall + control('Rozproszenie','style.backgroundGradientSpread','range',s.backgroundGradientSpread,{min:.15,max:1,step:.01}) + control('Wypełnienie','style.backgroundGradientFill','range',s.backgroundGradientFill,{min:0,max:1,step:.01});
}
function iconEditorMarkup(marker) {
  const s = marker.style;
  const refresh = { refresh:true };
  const tapAction = tapActionControl(marker.tapAction || 'more_info', isToggleableMarker(marker));
  const entity = isTextId(marker.entityId) ? section('Tekst i akcja', control('Podpis','displayName','text',marker.displayName) + linkControls(marker)) : section('Encja', control('Nazwa','displayName','text',marker.displayName) + tapAction);
  const size = section('Rozmiar', linkedSizeControl('Oba wymiary','style.width','style.height',[24,2400,24,1800],!!marker.geometryLocked) + control('Szerokość','style.width','range',s.width,{min:24,max:2400,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Wysokość','style.height','range',s.height,{min:24,max:1800,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Obrót','rotation','range',Number(marker.rotation) || 0,{min:-180,max:180,step:1,suffix:'°',integer:true,disabled:!!marker.geometryLocked}));
  const mdiList = `<datalist id="mdi-icon-list">${ICON_CHOICES.slice(1).map(([name,label]) => `<option value="${name}">${iconChoiceLabel(label)}</option>`).join('')}</datalist>`;
  const manual = marker.iconMode === 'manual';
  const integrationLogo = marker.iconMode === 'integration';
  const manualIcons = manual ? control('Ikona zależna ON/OFF','iconVariantEnabled','checkbox',!!marker.iconVariantEnabled,refresh) + (marker.iconVariantEnabled && markerHasOnOff(marker) ? mdiControl('Ikona ON','iconOn',marker.iconOn) + mdiControl('Ikona OFF','iconOff',marker.iconOff) : mdiControl('Ikona podstawowa','iconName',marker.iconName)) : '';
  const fill = s.iconFillEnabled !== false ? control('Kolor zależny ON/OFF','style.iconStateEnabled','checkbox',s.iconStateEnabled,refresh) + (s.iconStateEnabled ? control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) : control('Kolor','style.iconColor','color',s.iconColor)) + control('Przezroczystość zależna ON/OFF','style.iconOpacityStateEnabled','checkbox',!!s.iconOpacityStateEnabled,refresh) + (s.iconOpacityStateEnabled ? control('Przezroczystość ON','style.iconOnOpacity','range',s.iconOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.iconOffOpacity','range',s.iconOffOpacity,{min:0,max:1,step:.01}) : control('Przezroczystość','style.iconOpacity','range',s.iconOpacity,{min:0,max:1,step:.01})) : '';
  const outline = s.iconOutlineEnabled ? control('Obrys zależny ON/OFF','style.iconOutlineStateEnabled','checkbox',s.iconOutlineStateEnabled,refresh) + (s.iconOutlineStateEnabled ? control('Kolor obrysu ON','style.iconOutlineOnColor','color',s.iconOutlineOnColor) + control('Kolor obrysu OFF','style.iconOutlineOffColor','color',s.iconOutlineOffColor) + control('Przezroczystość obrysu ON','style.iconOutlineOnOpacity','range',s.iconOutlineOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość obrysu OFF','style.iconOutlineOffOpacity','range',s.iconOutlineOffOpacity,{min:0,max:1,step:.01}) + control('Grubość obrysu ON','style.iconOutlineOnWidth','range',s.iconOutlineOnWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość obrysu OFF','style.iconOutlineOffWidth','range',s.iconOutlineOffWidth,{min:1,max:8,step:.5,suffix:'px'}) : control('Kolor obrysu','style.iconOutlineColor','color',s.iconOutlineColor) + control('Przezroczystość obrysu','style.iconOutlineOpacity','range',s.iconOutlineOpacity,{min:0,max:1,step:.01}) + control('Grubość obrysu','style.iconOutlineWidth','range',s.iconOutlineWidth,{min:1,max:8,step:.5,suffix:'px'})) : '';
  const iconBody = control('Pokaż','style.showIcon','checkbox',s.showIcon,refresh) + (s.showIcon ? control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']],...refresh}) + manualIcons + mdiList + (!integrationLogo ? control('Wypełnienie','style.iconFillEnabled','checkbox',s.iconFillEnabled,refresh) + fill + control('Obrys','style.iconOutlineEnabled','checkbox',s.iconOutlineEnabled,refresh) + outline : '') + control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + control('Lewo / prawo','style.iconX','range',s.iconX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.iconY','range',s.iconY,{min:-100,max:100,step:1,suffix:'px'}) : '');
  const icon = section('Ikona', iconBody + (s.showIcon ? markerIconFrameControls(s) : ''));
  const bgBody = control('Pokaż','style.showBackground','checkbox',s.showBackground,refresh) + (s.showBackground ? backgroundGradientControls(s) + (s.backgroundStateEnabled ? control('Kolor ON','style.backgroundOnColor','color',s.backgroundOnColor) + control('Kolor OFF','style.backgroundOffColor','color',s.backgroundOffColor) + control('Przezroczystość ON','style.backgroundOnOpacity','range',s.backgroundOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.backgroundOffOpacity','range',s.backgroundOffOpacity,{min:0,max:1,step:.01}) : control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezroczystość','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01})) + control('Tło zależne ON/OFF','style.backgroundStateEnabled','checkbox',s.backgroundStateEnabled,refresh) : '');
  const background = section('Tło', bgBody);
  const borderBody = control('Pokaż','style.showBorder','checkbox',s.showBorder,refresh) + (s.showBorder ? control('Kształt','style.shape','select',s.shape,{items:[['rounded','Zaokrąglony'],['circle','Koło / owal']],...refresh}) + (s.shape === 'rounded' ? control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}) : '') + (s.borderStateEnabled ? control('Kolor ON','style.borderOnColor','color',s.borderOnColor) + control('Kolor OFF','style.borderOffColor','color',s.borderOffColor) + control('Przezroczystość ON','style.borderOnOpacity','range',s.borderOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.borderOffOpacity','range',s.borderOffOpacity,{min:0,max:1,step:.01}) + control('Grubość ON','style.borderOnWidth','range',s.borderOnWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Grubość OFF','style.borderOffWidth','range',s.borderOffWidth,{min:0,max:12,step:1,suffix:'px'}) : control('Kolor','style.borderColor','color',s.borderColor) + control('Przezroczystość','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'})) + control('Ramka zależna ON/OFF','style.borderStateEnabled','checkbox',s.borderStateEnabled,refresh) : '');
  const border = section('Ramka', borderBody);
  if (isTextId(marker.entityId)) return entity + size + icon + background + border;
  return withStatePreview(entity + size + icon + valueRulesSection(marker) + background + border, marker, ['Encja','Ikona','Tło','Ramka']);
}


function compactBadgeEditor(root, marker) {
  const onOff = markerHasOnOff(marker), s = onOff ? marker.style : { ...marker.style, backgroundStateEnabled:false, borderStateEnabled:false, iconStateEnabled:false, iconOpacityStateEnabled:false, iconOutlineStateEnabled:false };
  const hide = paths => paths.forEach(path => {
    const input = root.querySelector(`[data-path="${path}"]`);
    if (input) input.closest('.control').style.display = 'none';
  });
  const refresh = paths => paths.forEach(path => {
    const input = root.querySelector(`[data-path="${path}"]`);
    if (input) input.dataset.editorRefresh = 'true';
  });
  refresh(['style.showLabel','style.showValue','style.showBackground','style.backgroundStateEnabled','style.showBorder','style.shape','style.borderStateEnabled','style.showIcon','iconMode','iconVariantEnabled','style.iconFillEnabled','style.iconStateEnabled','style.iconOpacityStateEnabled','style.iconOutlineEnabled','style.iconOutlineStateEnabled']);
  if (!s.showLabel) hide(['style.labelWeight','style.labelColor','style.labelOpacity','style.labelScale','style.labelX','style.labelY']);
  if (!s.showValue) hide(['style.valueWeight','style.valueColor','style.valueOpacity','style.valueScale','style.valueX','style.valueY']);
  if (!s.showBackground) hide(['style.backgroundGradient','style.backgroundGradientX','style.backgroundGradientY','style.backgroundGradientDirection','style.backgroundGradientSpread','style.backgroundGradientFill','style.backgroundColor','style.backgroundOpacity','style.backgroundStateEnabled','style.backgroundOnColor','style.backgroundOffColor','style.backgroundOnOpacity','style.backgroundOffOpacity']);
  else {
    if ((s.backgroundGradient || 'none') === 'none') hide(['style.backgroundGradientX','style.backgroundGradientY','style.backgroundGradientDirection','style.backgroundGradientSpread','style.backgroundGradientFill']);
    else if (s.backgroundGradient === 'wall') hide(['style.backgroundGradientX']);
    else hide(['style.backgroundGradientDirection']);
    if (s.backgroundStateEnabled) hide(['style.backgroundColor','style.backgroundOpacity']);
    else hide(['style.backgroundOnColor','style.backgroundOffColor','style.backgroundOnOpacity','style.backgroundOffOpacity']);
  }
  if (!s.showBorder) hide(['style.shape','style.borderColor','style.borderOpacity','style.borderWidth','style.radius','style.borderStateEnabled','style.borderOnColor','style.borderOffColor','style.borderOnOpacity','style.borderOffOpacity','style.borderOnWidth','style.borderOffWidth']);
  else {
    if (s.shape !== 'rounded') hide(['style.radius']);
    if (s.borderStateEnabled) hide(['style.borderColor','style.borderOpacity','style.borderWidth']);
    else hide(['style.borderOnColor','style.borderOffColor','style.borderOnOpacity','style.borderOffOpacity','style.borderOnWidth','style.borderOffWidth']);
  }
  if (!s.showIcon) hide(['iconMode','iconName','iconOn','iconOff','style.iconFillEnabled','style.iconStateEnabled','style.iconColor','style.iconOnColor','style.iconOffColor','style.iconUnavailableColor','style.iconOpacity','style.iconOnOpacity','style.iconOffOpacity','style.iconOutlineEnabled','style.iconOutlineStateEnabled','style.iconOutlineColor','style.iconOutlineOnColor','style.iconOutlineOffColor','style.iconOutlineOpacity','style.iconOutlineOnOpacity','style.iconOutlineOffOpacity','style.iconOutlineWidth','style.iconOutlineOnWidth','style.iconOutlineOffWidth','style.iconSize','style.iconX','style.iconY']);
  else {
    const manual = marker.iconMode === 'manual', integration = marker.iconMode === 'integration';
    if (!manual) hide(['iconName','iconOn','iconOff','iconVariantEnabled']);
    else if (marker.iconVariantEnabled && onOff) hide(['iconName']);
    else hide(['iconOn','iconOff']);
    if (integration) hide(['style.iconFillEnabled','style.iconStateEnabled','style.iconColor','style.iconOnColor','style.iconOffColor','style.iconUnavailableColor','style.iconOpacity','style.iconOnOpacity','style.iconOffOpacity','style.iconOutlineEnabled','style.iconOutlineStateEnabled','style.iconOutlineColor','style.iconOutlineOnColor','style.iconOutlineOffColor','style.iconOutlineOpacity','style.iconOutlineOnOpacity','style.iconOutlineOffOpacity','style.iconOutlineWidth','style.iconOutlineOnWidth','style.iconOutlineOffWidth']);
    else {
      if (!s.iconFillEnabled) hide(['style.iconStateEnabled','style.iconColor','style.iconOnColor','style.iconOffColor','style.iconUnavailableColor','style.iconOpacity','style.iconOnOpacity','style.iconOffOpacity']);
      else {
        if (s.iconStateEnabled) hide(['style.iconColor']); else hide(['style.iconOnColor','style.iconOffColor']);
        if (s.iconOpacityStateEnabled) hide(['style.iconOpacity']); else hide(['style.iconOnOpacity','style.iconOffOpacity']);
      }
      if (!s.iconOutlineEnabled) hide(['style.iconOutlineStateEnabled','style.iconOutlineColor','style.iconOutlineOnColor','style.iconOutlineOffColor','style.iconOutlineOpacity','style.iconOutlineOnOpacity','style.iconOutlineOffOpacity','style.iconOutlineWidth','style.iconOutlineOnWidth','style.iconOutlineOffWidth']);
      else if (s.iconOutlineStateEnabled) hide(['style.iconOutlineColor','style.iconOutlineOpacity','style.iconOutlineWidth']);
      else hide(['style.iconOutlineOnColor','style.iconOutlineOffColor','style.iconOutlineOnOpacity','style.iconOutlineOffOpacity','style.iconOutlineOnWidth','style.iconOutlineOffWidth']);
    }
  }
}

// ---- Wskaźnik (gauge / podkowa) panel: laid out like the etykieta panel — coloured sections with on / off buttons
// on their bars, Rozmiar first, sub-sections only for what is switched on, ON / OFF options only for ON / OFF entities.
const GAUGE_SWEEPS = { gauge: [180, 240, 270, 300], horseshoe: [240, 270, 300, 320] };
function gaugeSweepAngles(sweep) { return [-90 - sweep / 2, -90 + sweep / 2]; } // symmetric around the top
function markerBar(part, title, body, toggles = []) {
  const buttons = toggles.map(([path, label, mdi, on]) => `<button type="button" class="section-toggle${on ? ' active' : ''}" data-mtoggle="${path}" aria-pressed="${!!on}" title="${escapeHtml(translateValue(label))}" aria-label="${escapeHtml(translateValue(label))}"><i class="mdi ${mdi}"></i></button>`).join('');
  return `<details class="editor-section part-section part-${part}"><summary><span>${escapeHtml(translateValue(title))}</span><span class="section-tools">${buttons}</span></summary><div class="editor-section-body">${body}</div></details>`;
}
function gaugePanelMarkup(marker) {
  const s = marker.style, onOff = markerHasOnOff(marker), refresh = { refresh:true }, sub = (title, body) => gaugeSubsection(escapeHtml(translateValue(title)), body);
  const st = key => onOff && !!s[key], range01 = (label, path, value) => control(label, path, 'range', value, { min:0, max:1, step:.01 });
  const pos = (prefix) => control('Lewo / prawo',`style.${prefix}X`,'range',s[`${prefix}X`],{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół',`style.${prefix}Y`,'range',s[`${prefix}Y`],{min:-100,max:100,step:1,suffix:'px'});
  const row = (title, body) => `<div class="control room-card-row"><label>${escapeHtml(translateValue(title))}</label><div class="room-card-presets">${body}</div></div>`;
  const kindButton = (type, title, mdi) => `<button type="button" class="room-card-preset${marker.type === type ? ' active' : ''}" data-mtype="${type}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}"><i class="mdi ${mdi}"></i></button>`;
  const state = String(stateCache[marker.entityId]?.state ?? '');
  // Ogólne
  const general = section('Ogólne', control('Nazwa','displayName','text',marker.displayName)
    + row('Typ', kindButton('gauge','Gauge','mdi-gauge') + kindButton('horseshoe','Podkowa','mdi-horseshoe'))
    + tapActionControl(marker.tapAction || 'more_info', isToggleableMarker(marker))
    + `<div class="control room-entities-control label-entity"><div class="room-entity-list"><div class="room-entity added"><div><strong data-no-i18n>${escapeHtml(stateCache[marker.entityId]?.attributes?.friendly_name || marker.displayName || marker.entityId)}</strong><code data-no-i18n>${escapeHtml(marker.entityId)}${state ? ' · ' + escapeHtml(state) : ''}</code></div></div></div></div>`);
  // Wskaźnik: size, range, arc, angle (+ ticks, scale numbers, percent when switched on)
  const sweep = Math.round(Number(s.endAngle) - Number(s.startAngle));
  const presets = (GAUGE_SWEEPS[marker.type] || GAUGE_SWEEPS.gauge).map(v => { const [a, b] = gaugeSweepAngles(v), on = Math.abs(Number(s.startAngle) - a) < .5 && Math.abs(Number(s.endAngle) - b) < .5 || (Math.abs(Number(s.startAngle) - a - 360) < .5 && Math.abs(Number(s.endAngle) - b - 360) < .5); return `<button type="button" class="room-card-preset text${on ? ' active' : ''}" data-angle-preset="${v}" title="${v}°" aria-label="${v}°">${v}°</button>`; }).join('');
  const minimumSize = { width: 44, height: 28 }, maximumSize = { width: 2400, height: 1800 };
  const gauge = markerBar('gauge', 'Wskaźnik',
    sub('Rozmiar', linkedSizeControl('Oba wymiary','style.width','style.height',[minimumSize.width,maximumSize.width,minimumSize.height,maximumSize.height],!!marker.geometryLocked) + control('Szerokość','style.width','range',s.width,{min:minimumSize.width,max:maximumSize.width,step:1,suffix:'px',integer:true}) + control('Wysokość','style.height','range',s.height,{min:minimumSize.height,max:maximumSize.height,step:1,suffix:'px',integer:true}) + control('Skala elementów','style.contentScale','range',s.contentScale,{min:.4,max:5,step:.05,suffix:'×'}) + control('Obrót','rotation','range',Number(marker.rotation) || 0,{min:-180,max:180,step:1,suffix:'°',integer:true}))
    + sub('Zakres', control('Minimum','style.min','number',s.min,{valueType:'number'}) + control('Maksimum','style.max','number',s.max,{valueType:'number'}))
    + sub('Łuk', control('Grubość','style.thickness','range',s.thickness,{min:2,max:30,step:1,suffix:'px'}) + control('Tor','style.trackColor','color',s.trackColor)
      + (s.useGradient ? control('Gradient: start','style.gradientStart','color',s.gradientStart) + control('Gradient: koniec','style.gradientEnd','color',s.gradientEnd) : control('Wartość','style.progressColor','color',s.progressColor)))
    + sub('Kąt', row('Łuk', presets) + control('Kąt start','style.startAngle','range',s.startAngle,{min:-270,max:270,step:1,suffix:'°'}) + control('Kąt koniec','style.endAngle','range',s.endAngle,{min:-270,max:450,step:1,suffix:'°'}) + control('Skala','style.gaugeScale','range',s.gaugeScale,{min:.35,max:1.8,step:.01}) + control('Pozycja','style.gaugeY','range',s.gaugeY,{min:-80,max:80,step:1,suffix:'px'}))
    + (s.showTicks ? sub('Podziałka', control('Co ile','style.tickStep','number',s.tickStep,{valueType:'number',min:0}) + control('Offset','style.tickOffset','range',s.tickOffset,{min:0,max:40,step:1,suffix:'px'}) + control('Długość','style.tickLength','range',s.tickLength,{min:2,max:24,step:1,suffix:'px'}) + control('Grubość','style.tickWidth','range',s.tickWidth,{min:.5,max:6,step:.5,suffix:'px'}) + control('Kolor','style.tickColor','color',s.tickColor) + range01('Przezrocz.','style.tickOpacity',s.tickOpacity)) : '')
    + (s.showTickLabels ? sub('Liczby skali', control('Co ile','style.tickLabelStep','number',s.tickLabelStep,{valueType:'number',min:0}) + control('Rozmiar','style.tickFontSize','range',s.tickFontSize,{min:5,max:24,step:1,suffix:'px'}) + control('Czcionka','style.tickFontFamily','select',s.tickFontFamily,{items:[['Inter','Inter'],['Segoe UI','Segoe UI'],['Arial','Arial'],['monospace','Monospace']],dropdown:true}) + control('Kolor','style.tickLabelColor','color',s.tickLabelColor) + control('Odsunięcie','style.tickLabelOffset','range',s.tickLabelOffset,{min:-8,max:36,step:1,suffix:'px'})) : '')
    + (s.showPercent ? sub('Procent', control('Kolor','style.percentColor','color',s.percentColor) + range01('Przezrocz.','style.percentOpacity',s.percentOpacity) + control('Rozmiar','style.percentScale','range',s.percentScale,{min:.5,max:3,step:.05}) + control('Pozycja','style.percentY','range',s.percentY,{min:-100,max:100,step:1,suffix:'px'})) : ''),
    [['style.useGradient','Gradient','mdi-gradient-horizontal',s.useGradient],['style.showTicks','Podziałka','mdi-ruler',s.showTicks],['style.showTickLabels','Liczby skali','mdi-numeric',s.showTickLabels],['style.showPercent','Procent','mdi-percent-outline',s.showPercent]]);
  // Ikona
  const mdiList = `<datalist id="mdi-icon-list">${ICON_CHOICES.slice(1).map(([name,label]) => `<option value="${name}">${iconChoiceLabel(label)}</option>`).join('')}</datalist>`;
  const manual = marker.iconMode === 'manual', integration = marker.iconMode === 'integration';
  const iconFill = s.iconFillEnabled !== false ? (st('iconStateEnabled') ? control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) : control('Kolor','style.iconColor','color',s.iconColor))
    + (st('iconOpacityStateEnabled') ? range01('Przezrocz. ON','style.iconOnOpacity',s.iconOnOpacity) + range01('Przezrocz. OFF','style.iconOffOpacity',s.iconOffOpacity) : range01('Przezroczystość','style.iconOpacity',s.iconOpacity)) + control('Brak danych','style.iconUnavailableColor','color',s.iconUnavailableColor) : '';
  const icon = markerBar('icon', 'Ikona', !s.showIcon ? '' : sub('Rozmiar', control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + pos('icon'))
      + sub('Źródło', control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']],refresh:true})
        + (manual ? control('Ikona zależna ON/OFF','iconVariantEnabled','checkbox',!!marker.iconVariantEnabled,refresh) + (marker.iconVariantEnabled && onOff ? mdiControl('Ikona ON','iconOn',marker.iconOn) + mdiControl('Ikona OFF','iconOff',marker.iconOff) : mdiControl('Ikona','iconName',marker.iconName)) + mdiList : ''))
      + (integration ? '' : sub('Kolor', control('Wypełnienie','style.iconFillEnabled','checkbox',s.iconFillEnabled !== false,refresh) + (s.iconFillEnabled !== false ? control('Kolor zależny ON/OFF','style.iconStateEnabled','checkbox',!!s.iconStateEnabled,refresh) + control('Przezroczystość zależna ON/OFF','style.iconOpacityStateEnabled','checkbox',!!s.iconOpacityStateEnabled,refresh) : '') + iconFill))
      + (!integration && s.iconOutlineEnabled ? sub('Obrys', control('Obrys zależny ON/OFF','style.iconOutlineStateEnabled','checkbox',!!s.iconOutlineStateEnabled,refresh)
        + (st('iconOutlineStateEnabled') ? control('Kolor obrysu ON','style.iconOutlineOnColor','color',s.iconOutlineOnColor) + control('Kolor obrysu OFF','style.iconOutlineOffColor','color',s.iconOutlineOffColor) + control('Grubość ON','style.iconOutlineOnWidth','range',s.iconOutlineOnWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość OFF','style.iconOutlineOffWidth','range',s.iconOutlineOffWidth,{min:1,max:8,step:.5,suffix:'px'})
          : control('Kolor obrysu','style.iconOutlineColor','color',s.iconOutlineColor) + control('Grubość obrysu','style.iconOutlineWidth','range',s.iconOutlineWidth,{min:1,max:8,step:.5,suffix:'px'}))) : '')
      + (s.iconBg ? sub('Tło', control('Kolor tła','style.iconBgColor','color',s.iconBgColor || '#081822') + range01('Przezrocz. tła','style.iconBgOpacity',s.iconBgOpacity ?? .55)) : '')
      + (s.iconBorder ? sub('Ramka', control('Kolor ramki','style.iconBorderColor','color',s.iconBorderColor || '#FFFFFF') + range01('Przezrocz. ramki','style.iconBorderOpacity',s.iconBorderOpacity ?? .6) + control('Grubość ramki','style.iconBorderWidth','range',s.iconBorderWidth ?? 1.5,{min:.5,max:12,step:.5,suffix:'px'})) : '')
      + (s.iconBg || s.iconBorder ? sub('Kształt', control('Kształt','style.iconShape','select',['square','circle','custom'].includes(s.iconShape) ? s.iconShape : 'circle',{ items:[['square','Kwadrat'],['circle','Koło'],['custom','Dowolny']], refresh:true }) + (s.iconShape === 'custom' ? control('Zaokrąglenie','style.iconRadius','range',s.iconRadius ?? 10,{min:0,max:120,step:1,suffix:'px',integer:true}) : '') + control('Margines','style.iconPadding','range',s.iconPadding ?? 6,{min:0,max:80,step:1,suffix:'px',integer:true})) : ''),
    [['style.showIcon','Pokaż','mdi-eye-outline',s.showIcon], ...(s.showIcon && !integration ? [['style.iconOutlineEnabled','Obrys','mdi-vector-circle-variant',s.iconOutlineEnabled]] : []), ...(s.showIcon ? [['style.iconBg','Tło','mdi-format-color-fill',s.iconBg],['style.iconBorder','Ramka','mdi-border-all-variant',s.iconBorder]] : [])]);
  // Nazwa, Stan
  const name = markerBar('name', 'Nazwa', !s.showLabel ? '' : sub('Rozmiar', control('Rozmiar','style.labelScale','range',s.labelScale,{min:.5,max:3,step:.05}) + markerWeightControl('style.labelWeight', s.labelWeight) + pos('label'))
      + sub('Kolor', control('Kolor','style.labelColor','color',s.labelColor) + range01('Przezroczystość','style.labelOpacity',s.labelOpacity)),
    [['style.showLabel','Pokaż','mdi-eye-outline',s.showLabel]]);
  const value = markerBar('state', 'Stan', !s.showValue ? '' : sub('Rozmiar', control('Rozmiar','style.valueScale','range',s.valueScale,{min:.5,max:3,step:.05}) + markerWeightControl('style.valueWeight', s.valueWeight) + pos('value'))
      + sub('Format', control('Jednostka','unitOverride','text',marker.unitOverride) + control('Zaokrąglenie','decimals','select',marker.decimals,{items:[['auto','Automatycznie'],[0,'0'],[1,'0,1'],[2,'0,01'],[3,'0,001']],dropdown:true}) + (onOff ? control('Tekst ON','stateOnLabel','text',marker.stateOnLabel) + control('Tekst OFF','stateOffLabel','text',marker.stateOffLabel) : ''))
      + sub('Kolor', control('Kolor','style.valueColor','color',s.valueColor) + range01('Przezroczystość','style.valueOpacity',s.valueOpacity)),
    [['style.showValue','Pokaż','mdi-eye-outline',s.showValue]]);
  // Grupa: the tile's background and frame
  const group = markerBar('group', 'Grupa', (s.showBackground ? sub('Tło', backgroundGradientControls(s) + (st('backgroundStateEnabled') ? '' : control('Kolor','style.backgroundColor','color',s.backgroundColor) + range01('Przezroczystość','style.backgroundOpacity',s.backgroundOpacity))
        + control('Zależne ON/OFF','style.backgroundStateEnabled','checkbox',!!s.backgroundStateEnabled,refresh) + (st('backgroundStateEnabled') ? control('Kolor ON','style.backgroundOnColor','color',s.backgroundOnColor) + control('Kolor OFF','style.backgroundOffColor','color',s.backgroundOffColor) + range01('Przezrocz. ON','style.backgroundOnOpacity',s.backgroundOnOpacity) + range01('Przezrocz. OFF','style.backgroundOffOpacity',s.backgroundOffOpacity) : '')) : '')
      + (s.showBorder ? sub('Ramka', control('Zależne ON/OFF','style.borderStateEnabled','checkbox',!!s.borderStateEnabled,refresh)
        + (st('borderStateEnabled') ? control('Kolor ON','style.borderOnColor','color',s.borderOnColor) + control('Kolor OFF','style.borderOffColor','color',s.borderOffColor) + range01('Przezrocz. ON','style.borderOnOpacity',s.borderOnOpacity) + range01('Przezrocz. OFF','style.borderOffOpacity',s.borderOffOpacity) + control('Grubość ON','style.borderOnWidth','range',s.borderOnWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Grubość OFF','style.borderOffWidth','range',s.borderOffWidth,{min:0,max:12,step:1,suffix:'px'})
          : control('Kolor','style.borderColor','color',s.borderColor) + range01('Przezroczystość','style.borderOpacity',s.borderOpacity) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'}))) : '')
      + sub('Kształt', control('Kształt','style.shape','select',s.shape,{items:[['square','Prostokąt'],['rounded','Zaokrąglony'],['circle','Koło / owal']],refresh:true}) + (s.shape === 'rounded' ? control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}) : '')),
    [['style.showBackground','Tło','mdi-format-color-fill',s.showBackground],['style.showBorder','Ramka','mdi-border-all-variant',s.showBorder]]);
  return (onOff ? previewRow('__preview', editorPreview.entityId === marker.entityId ? editorPreview.state : '') : '') + general + gauge + icon + name + value + group + valueRulesSection(marker);
}
function editorMarkup(marker) {
  if (marker.type === 'thermostat') return thermostatEditorMarkup(marker);
  if (marker.type === 'icon') return iconEditorMarkup(marker);
  if (isGaugeType(marker.type) && !isTextId(marker.entityId)) return gaugePanelMarkup(marker);
  const s = marker.style;
  const tapAction = tapActionControl(marker.tapAction || 'more_info', isToggleableMarker(marker));
  const textEl = isTextId(marker.entityId);
  const entity = textEl ? section('Tekst i akcja', control('Tekst','textValue','text',marker.textValue ?? '') + control('Podpis','displayName','text',marker.displayName) + linkControls(marker)) : section('Encja', control('Nazwa','displayName','text',marker.displayName) + control('Jednostka','unitOverride','text',marker.unitOverride) + control('Zaokrąglenie','decimals','select',marker.decimals,{items:[['auto','Auto'],[0,'0'],[1,'1'],[2,'2'],[3,'3']]}) + control('Tekst ON','stateOnLabel','text',marker.stateOnLabel) + control('Tekst OFF','stateOffLabel','text',marker.stateOffLabel) + tapAction);
  const label = section('Nazwa', control('Pokaż','style.showLabel','checkbox',s.showLabel) + control('Kolor','style.labelColor','color',s.labelColor) + markerWeightControl('style.labelWeight', s.labelWeight) + control('Przezrocz.','style.labelOpacity','range',s.labelOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.labelScale','range',s.labelScale,{min:.5,max:3,step:.05}) + control('Lewo / prawo','style.labelX','range',s.labelX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.labelY','range',s.labelY,{min:-100,max:100,step:1,suffix:'px'}));
  const value = section('Stan', control('Pokaż','style.showValue','checkbox',s.showValue) + control('Kolor','style.valueColor','color',s.valueColor) + markerWeightControl('style.valueWeight', s.valueWeight) + control('Przezrocz.','style.valueOpacity','range',s.valueOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.valueScale','range',s.valueScale,{min:.5,max:3,step:.05}) + control('Lewo / prawo','style.valueX','range',s.valueX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.valueY','range',s.valueY,{min:-100,max:100,step:1,suffix:'px'}));
  const minimumSize = isGaugeType(marker.type) ? { width: 44, height: 28 } : marker.type === 'icon' ? { width: 24, height: 24 } : { width: 36, height: 24 };
  const maximumSize = { width: 2400, height: 1800 };
  const size = section('Rozmiar', linkedSizeControl('Oba wymiary','style.width','style.height',[minimumSize.width,maximumSize.width,minimumSize.height,maximumSize.height],!!marker.geometryLocked) + control('Szerokość','style.width','range',s.width,{min:minimumSize.width,max:maximumSize.width,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Wysokość','style.height','range',s.height,{min:minimumSize.height,max:maximumSize.height,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Skala elementów','style.contentScale','range',s.contentScale,{min:.4,max:5,step:.05,suffix:'×'}) + control('Obrót','rotation','range',Number(marker.rotation) || 0,{min:-180,max:180,step:1,suffix:'°',integer:true,disabled:!!marker.geometryLocked}));
  const background = section('Tło', control('Pokaż','style.showBackground','checkbox',s.showBackground) + backgroundGradientControls(s) + control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezrocz.','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01}) + control('Zależne ON/OFF','style.backgroundStateEnabled','checkbox',s.backgroundStateEnabled) + control('Kolor ON','style.backgroundOnColor','color',s.backgroundOnColor) + control('Kolor OFF','style.backgroundOffColor','color',s.backgroundOffColor) + control('Przezrocz. ON','style.backgroundOnOpacity','range',s.backgroundOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.backgroundOffOpacity','range',s.backgroundOffOpacity,{min:0,max:1,step:.01}));
  const border = section('Ramka', control('Kształt','style.shape','select',s.shape,{items:[['square','Prostokąt'],['rounded','Zaokrąglony'],['circle','Koło / owal']]}) + control('Pokaż','style.showBorder','checkbox',s.showBorder) + control('Kolor','style.borderColor','color',s.borderColor) + control('Przezrocz.','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}) + control('Zależne ON/OFF','style.borderStateEnabled','checkbox',s.borderStateEnabled) + control('Kolor ON','style.borderOnColor','color',s.borderOnColor) + control('Kolor OFF','style.borderOffColor','color',s.borderOffColor) + control('Przezrocz. ON','style.borderOnOpacity','range',s.borderOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.borderOffOpacity','range',s.borderOffOpacity,{min:0,max:1,step:.01}) + control('Grubość ON','style.borderOnWidth','range',s.borderOnWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Grubość OFF','style.borderOffWidth','range',s.borderOffWidth,{min:0,max:12,step:1,suffix:'px'}));
  const mdiList = `<datalist id="mdi-icon-list">${ICON_CHOICES.slice(1).map(([name,label]) => `<option value="${name}">${iconChoiceLabel(label)}</option>`).join('')}</datalist>`;
  const manualIcons = marker.type === 'badge'
    ? (marker.iconMode === 'manual' ? control('Ikona zależna ON/OFF','iconVariantEnabled','checkbox',!!marker.iconVariantEnabled,{refresh:true}) + `<div data-manual-icons>${marker.iconVariantEnabled && markerHasOnOff(marker) ? mdiControl('Ikona ON','iconOn',marker.iconOn) + mdiControl('Ikona OFF','iconOff',marker.iconOff) : mdiControl('Ikona podstawowa','iconName',marker.iconName)}</div>` : '')
    : `<div data-manual-icons ${marker.iconMode === 'manual' ? '' : 'hidden'}>${mdiControl('Podstawowa','iconName',marker.iconName)}${mdiControl('Dla ON','iconOn',marker.iconOn)}${mdiControl('Dla OFF','iconOff',marker.iconOff)}</div>`;
  const icon = section('Ikona', control('Pokaż','style.showIcon','checkbox',s.showIcon) + control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']]}) + manualIcons + mdiList + control('Wypełnienie','style.iconFillEnabled','checkbox',s.iconFillEnabled) + control('Kolor zależny ON/OFF','style.iconStateEnabled','checkbox',s.iconStateEnabled) + control('Kolor','style.iconColor','color',s.iconColor) + control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) + control('Brak danych','style.iconUnavailableColor','color',s.iconUnavailableColor) + control('Przezrocz.','style.iconOpacity','range',s.iconOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. ON','style.iconOnOpacity','range',s.iconOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.iconOffOpacity','range',s.iconOffOpacity,{min:0,max:1,step:.01}) + control('Obrys','style.iconOutlineEnabled','checkbox',s.iconOutlineEnabled) + control('Obrys zależny ON/OFF','style.iconOutlineStateEnabled','checkbox',s.iconOutlineStateEnabled) + control('Kolor obrysu','style.iconOutlineColor','color',s.iconOutlineColor) + control('Kolor obrysu ON','style.iconOutlineOnColor','color',s.iconOutlineOnColor) + control('Kolor obrysu OFF','style.iconOutlineOffColor','color',s.iconOutlineOffColor) + control('Grubość obrysu','style.iconOutlineWidth','range',s.iconOutlineWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość ON','style.iconOutlineOnWidth','range',s.iconOutlineOnWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość OFF','style.iconOutlineOffWidth','range',s.iconOutlineOffWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + control('Lewo / prawo','style.iconX','range',s.iconX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.iconY','range',s.iconY,{min:-100,max:100,step:1,suffix:'px'}) + (s.showIcon ? markerIconFrameControls(s) : ''));
  let gauge = '';
  if (isGaugeType(marker.type)) {
    const range = gaugeSubsection('Zakres i wartość', control('Minimum','style.min','number',s.min,{valueType:'number'}) + control('Maksimum','style.max','number',s.max,{valueType:'number'}) + control('Grubość','style.thickness','range',s.thickness,{min:2,max:30,step:1,suffix:'px'}) + control('Tor','style.trackColor','color',s.trackColor) + control('Wartość','style.progressColor','color',s.progressColor));
    const geometry = gaugeSubsection('Geometria wskaźnika', control('Skala','style.gaugeScale','range',s.gaugeScale,{min:.35,max:1.8,step:.01}) + control('Pozycja','style.gaugeY','range',s.gaugeY,{min:-80,max:80,step:1,suffix:'px'}) + control('Kąt start','style.startAngle','range',s.startAngle,{min:-270,max:270,step:1,suffix:'°'}) + control('Kąt koniec','style.endAngle','range',s.endAngle,{min:-270,max:450,step:1,suffix:'°'}));
    const ticks = gaugeSubsection('Podziałka', control('Pokaż ticki','style.showTicks','checkbox',s.showTicks) + control('Co ile','style.tickStep','number',s.tickStep,{valueType:'number',min:0}) + control('Offset','style.tickOffset','range',s.tickOffset,{min:0,max:40,step:1,suffix:'px'}) + control('Długość','style.tickLength','range',s.tickLength,{min:2,max:24,step:1,suffix:'px'}) + control('Grubość','style.tickWidth','range',s.tickWidth,{min:.5,max:6,step:.5,suffix:'px'}) + control('Kolor','style.tickColor','color',s.tickColor) + control('Przezrocz.','style.tickOpacity','range',s.tickOpacity,{min:0,max:1,step:.01}));
    const tickLabels = gaugeSubsection('Liczby skali', control('Pokaż','style.showTickLabels','checkbox',s.showTickLabels) + control('Co ile','style.tickLabelStep','number',s.tickLabelStep,{valueType:'number',min:0}) + control('Rozmiar','style.tickFontSize','range',s.tickFontSize,{min:5,max:24,step:1,suffix:'px'}) + control('Czcionka','style.tickFontFamily','select',s.tickFontFamily,{items:[['Inter','Inter'],['Segoe UI','Segoe UI'],['Arial','Arial'],['monospace','Monospace']]}) + control('Kolor','style.tickLabelColor','color',s.tickLabelColor) + control('Odsunięcie','style.tickLabelOffset','range',s.tickLabelOffset,{min:-8,max:36,step:1,suffix:'px'}));
    const gradient = gaugeSubsection('Gradient', control('Włącz','style.useGradient','checkbox',s.useGradient) + control('Start','style.gradientStart','color',s.gradientStart) + control('Koniec','style.gradientEnd','color',s.gradientEnd));
    const percent = gaugeSubsection('Procent', control('Pokaż','style.showPercent','checkbox',s.showPercent) + control('Kolor','style.percentColor','color',s.percentColor) + control('Przezrocz.','style.percentOpacity','range',s.percentOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.percentScale','range',s.percentScale,{min:.5,max:3,step:.05}) + control('Pozycja','style.percentY','range',s.percentY,{min:-100,max:100,step:1,suffix:'px'}));
    gauge = section(marker.type === 'horseshoe' ? 'Podkowa' : 'Gauge', range + geometry + ticks + tickLabels + gradient + percent);
  }
  if (textEl) return entity + size + value.replace('>Stan<', `>${translateValue('Tekst')}<`) + label.replace('>Nazwa<', `>${translateValue('Podpis')}<`) + icon + background + border;
  return withStatePreview(entity + size + value + label + icon + gauge + valueRulesSection(marker) + background + border, marker, ['Encja','Stan','Ikona','Tło','Ramka']);
}
function thermostatEditorMarkup(marker) {
  const s = marker.style, info = climateInfo(marker), a = info.a, has = k => a[k] !== undefined && a[k] !== null;
  const show = (label, path, value, available = true, note = '') => available ? control(label, path, 'checkbox', !!value) : `<div class="control thermo-missing"><label>${escapeHtml(translateValue(label))}</label><small>${escapeHtml(translateValue(note || 'Encja nie ma tego atrybutu'))}</small></div>`;
  const entity = section('Encja', control('Nazwa','displayName','text',marker.displayName) + `<div class="control thermo-attrs"><label>${escapeHtml(translateValue('Atrybuty'))}</label><code data-no-i18n>${escapeHtml(marker.entityId)} · ${escapeHtml(String(stateCache[marker.entityId]?.state ?? '—'))}</code></div>` + tapActionControl(marker.tapAction || 'more_info', false));
  const parts = section('Pokaż', show('Nazwa','style.showLabel',s.showLabel) + show('Stan pracy (grzeje / bezczynny)','style.thermoShowAction',s.thermoShowAction, has('hvac_action'))
    + show('Temperatura aktualna','style.thermoShowCurrent',s.thermoShowCurrent, has('current_temperature')) + show('Przyciski − / +','style.thermoShowControls',s.thermoShowControls, has('temperature') || has('target_temp_high'))
    + show('Tryby','style.thermoShowModes',s.thermoShowModes, info.modes.length > 0) + show('Zakres min / max','style.thermoShowRange',s.thermoShowRange)
    + show('Wilgotność','style.thermoShowHumidity',s.thermoShowHumidity, has('current_humidity')) + show('Preset','style.thermoShowPreset',s.thermoShowPreset, has('preset_mode')) + show('Wentylator','style.thermoShowFan',s.thermoShowFan, has('fan_mode')));
  const extraKeys = Object.keys(a).filter(k => !THERMO_KNOWN_ATTRS.has(k)).sort();
  const extra = extraKeys.length ? section('Inne atrybuty', extraKeys.map(k => `<div class="control thermo-extra"><label data-no-i18n>${escapeHtml(k.replace(/_/g, ' '))}</label><input type="checkbox" data-path="thermoExtra.${escapeHtml(k)}"${marker.thermoExtra?.[k] ? ' checked' : ''}><small data-no-i18n>${escapeHtml(readableAttribute(a[k]))}</small></div>`).join('')) : '';
  const colours = section('Kolory', control('Grzanie','style.thermoHeatColor','color',s.thermoHeatColor) + control('Chłodzenie','style.thermoCoolColor','color',s.thermoCoolColor) + control('Auto','style.thermoAutoColor','color',s.thermoAutoColor)
    + control('Osuszanie','style.thermoDryColor','color',s.thermoDryColor) + control('Wentylator','style.thermoFanColor','color',s.thermoFanColor) + control('Wyłączony','style.thermoOffColor','color',s.thermoOffColor) + control('Tor tarczy','style.thermoTrackColor','color',s.thermoTrackColor));
  const size = section('Rozmiar', linkedSizeControl('Oba wymiary','style.width','style.height',[120,1200,120,1200],!!marker.geometryLocked) + control('Szerokość','style.width','range',s.width,{min:120,max:1200,step:1,suffix:'px'}) + control('Wysokość','style.height','range',s.height,{min:120,max:1200,step:1,suffix:'px'}) + control('Skala zawartości','style.contentScale','range',s.contentScale,{min:.4,max:3,step:.01}));
  const background = section('Tło', control('Pokaż','style.showBackground','checkbox',s.showBackground) + control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezrocz.','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01}));
  const border = section('Ramka', control('Pokaż','style.showBorder','checkbox',s.showBorder) + control('Kolor','style.borderColor','color',s.borderColor) + control('Przezrocz.','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:.5,suffix:'px'}) + control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:120,step:1,suffix:'px'}));
  return entity + parts + extra + colours + size + background + border;
}
function bindEditorInputs(root) {
  $$('input,select', root).forEach(input => {
    if (input.type === 'checkbox' || input.tagName === 'SELECT') input.addEventListener('change', onEditorInput);
    else { input.addEventListener('input', onEditorInput); input.addEventListener('change', onEditorInput); }
  });
}
function refreshIconEditorSection(marker, sourceInput) {
  const current = sourceInput.closest('.editor-section'), sections = $$('.editor-section', els.editorContent), index = sections.indexOf(current);
  if (index < 0) return false;
  const draft = document.createElement('div'); draft.innerHTML = iconEditorMarkup(marker);
  const replacement = $$('.editor-section', draft)[index];
  if (!replacement) return false;
  current.replaceWith(replacement); replacement.open = true; editorOpenSectionIndex = index;
  bindEditorInputs(replacement);
  replacement.addEventListener('toggle', () => {
    if (replacement.open) { editorOpenSectionIndex = index; $$('.editor-section', els.editorContent).forEach(other => { if (other !== replacement) other.removeAttribute('open'); }); }
    requestAnimationFrame(() => requestAnimationFrame(() => { if (replacement.open) replacement.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(); }));
  });
  requestAnimationFrame(keepEditorInViewport);
  return true;
}
function openEditor(preserveSection = editorOpenSectionIndex) {
  closeFlowEditor(); closeRoomEditor();
  const marker = model.entities[selectedId]; if (!marker) return closeEditor();
  const textEl = isTextId(marker.entityId);
  els.editorTitle.textContent = textEl ? (marker.textValue || marker.displayName || translateValue('Tekst / przycisk')) : marker.displayName; els.editorEntity.textContent = textEl ? translateValue('Tekst / przycisk') : marker.entityId; els.editorIntegration.textContent = `Integracja: ${marker.integrationName || 'Home Assistant'}`;
  if (els.editorIntegrationIcon) els.editorIntegrationIcon.innerHTML = integrationIconMarkupFor(marker.sourceDomain || marker.entityId.split('.')[0], marker.integrationName || marker.sourceDomain, 'editor-brand-icon');
  els.editorContent.innerHTML = editorMarkup(marker); syncLinkedSizes(els.editorContent); syncHeadPreview(els.editor, stateKind(marker) === 'on');
  if (marker.type === 'badge') compactBadgeEditor(els.editorContent, marker);
  // No ON / OFF choices (state-dependent colours, ON / OFF texts and icons) for entities that do not switch on and off.
  if (!markerHasOnOff(marker)) $$('[data-path]', els.editorContent).forEach(input => { if (/StateEnabled$|(On|Off)(Color|Opacity|Width)$|^state(On|Off)Label$|^icon(On|Off)$|^iconVariantEnabled$/.test(input.dataset.path)) { const row = input.closest('.control'); if (row) row.style.display = 'none'; } });
  if (Number.isInteger(preserveSection) && preserveSection >= 0) {
    const section = $$('.editor-section', els.editorContent)[preserveSection];
    if (section) section.open = true;
  }
  $$('[data-editor-tab]').forEach(b => { b.classList.toggle('active', b.dataset.editorTab === marker.type); b.hidden = textEl && isGaugeType(b.dataset.editorTab); });
  $('#editor .editor-tabs')?.toggleAttribute('hidden', isGaugeType(marker.type) && !textEl);
  $('#paste-style').disabled = !styleClipboard; els.editor.classList.add('visible'); els.editor.setAttribute('aria-hidden','false');
  bindEditorInputs(els.editorContent);
  $$('.editor-section', els.editorContent).forEach((details, index) => details.addEventListener('toggle', () => {
    if (details.open) { editorOpenSectionIndex = index; $$('.editor-section', els.editorContent).forEach(other => { if (other !== details) other.removeAttribute('open'); }); }
    requestAnimationFrame(() => requestAnimationFrame(() => { if (details.open) details.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(); }));
  }));
  $$('.gauge-subsection', els.editorContent).forEach(details => details.addEventListener('toggle', () => {
    if (details.open) $$('.gauge-subsection', els.editorContent).forEach(other => { if (other !== details) other.removeAttribute('open'); });
    requestAnimationFrame(() => { if (details.open) details.scrollIntoView({ block: 'nearest' }); });
  }));
  syncPreviewStateButton(); syncLockButton($('#geometry-lock'), marker.geometryLocked); requestAnimationFrame(positionEditor);
}
// Geometry lock lives in every popup's header (marker, Flow, room), next to "Set default".
function syncLockButton(button, locked) {
  if (!button) return; button.classList.toggle('active', !!locked);
  const icon = button.querySelector('i'); if (icon) icon.className = `mdi ${locked ? 'mdi-lock' : 'mdi-lock-open-variant-outline'}`;
  const label = translateValue(locked ? 'Geometria zablokowana — kliknij, aby odblokować' : 'Zablokuj geometrię'); button.title = label; button.setAttribute('aria-label', label);
}
// Re-render the marker panel keeping the open section and its open sub-section (by title).
function reopenMarkerEditor(sectionIndex) {
  const sub = $('.editor-section[open] .gauge-subsection[open] > summary', els.editorContent)?.textContent;
  openEditor(sectionIndex);
  if (sub) { const again = $$('.editor-section[open] .gauge-subsection > summary', els.editorContent).find(n => n.textContent === sub); if (again) again.parentElement.open = true; }
}
function openSectionIndex(content, fallback) { const index = $$('.editor-section', content).findIndex(section => section.open); return index >= 0 ? index : fallback; }
// ON/OFF preview inside the sections whose look depends on the state (instead of a header button).
function markerHasOnOff(marker) { const raw = String(stateCache[marker.entityId]?.state || '').toLowerCase(); return isToggleableMarker(marker) || ['on','off','open','closed','opened','close','active','inactive','true','false'].includes(raw); }
function stateButtons(path, value) {
  const button = (state, icon, label) => `<button type="button" class="preview-state-button${value === state ? ' active' : ''}" data-preview-path="${path}" data-preview-value="${state}" title="${escapeHtml(translateValue(label))}" aria-pressed="${value === state}"><i class="mdi ${icon}"></i><span>${state.toUpperCase()}</span></button>`;
  return `<div class="control preview-control"><label>Podgląd</label><div class="preview-state-buttons">${button('on', 'mdi-lightbulb-on-outline', 'Podgląd: włączony')}${button('off', 'mdi-lightbulb-off-outline', 'Podgląd: wyłączony')}</div><span></span></div>`;
}
function previewControl(marker) { return stateButtons('__preview', editorPreview.entityId === marker.entityId ? editorPreview.state : ''); }
// A small ON / OFF pair right under the editor header buttons simulates the state while styling (not saved).
// The ON / OFF preview is one toggle in the header row (only for things that switch on and off); the content
// only carries where it applies — syncHeadPreview puts it on the button.
function previewRow(path, value, thermo = null) { return `<i class="head-preview-src" hidden data-path="${path}" data-value="${value}"${thermo ? ` data-acts="${escapeHtml(thermo.acts)}" data-current="${escapeHtml(thermo.current)}"` : ''}></i>`; }
function syncHeadPreview(panel, actualOn) {
  const button = panel?.querySelector('.head-preview'), src = panel?.querySelector('.head-preview-src'); if (!button) return;
  button.hidden = !src; if (!src) return;
  const preview = src.dataset.value;
  // A thermostat: the button steps through its work states (the real one first), each previewed in turn.
  if (src.dataset.acts) {
    const acts = src.dataset.acts.split(',').filter(Boolean), shown = preview.startsWith('act:') ? preview.slice(4) : src.dataset.current, i = acts.indexOf(shown);
    const next = acts[(i + 1) % Math.max(1, acts.length)] || shown;
    button.dataset.previewPath = src.dataset.path; button.dataset.previewValue = next === src.dataset.current && preview ? '' : `act:${next}`;
    button.classList.toggle('active', !!preview); button.querySelector('i').className = `mdi ${THERMO_ACTIONS[shown]?.[1] || 'mdi-thermostat'}`;
    const label = `${translateValue('Podgląd')}: ${translateValue(THERMO_ACTIONS[shown]?.[0] || shown)}`; button.title = label; button.setAttribute('aria-label', label);
    // The previewed work state is named next to the icon.
    let text = button.querySelector('.head-preview-text'); if (!text) { text = document.createElement('span'); text.className = 'head-preview-text'; button.append(text); }
    text.textContent = translateValue(THERMO_ACTIONS[shown]?.[0] || shown); button.classList.add('with-text');
    return;
  }
  button.querySelector('.head-preview-text')?.remove(); button.classList.remove('with-text');
  const shown = preview || (actualOn ? 'on' : 'off');
  button.dataset.previewPath = src.dataset.path; button.dataset.previewValue = shown === 'on' ? 'off' : 'on';
  button.classList.toggle('active', !!preview); button.querySelector('i').className = `mdi ${shown === 'on' ? 'mdi-lightbulb-on' : 'mdi-lightbulb-off-outline'}`;
  const label = translateValue(shown === 'on' ? 'Podgląd: włączony' : 'Podgląd: wyłączony'); button.title = label; button.setAttribute('aria-label', label);
}
function onHeadPreview(event) {
  const button = event.currentTarget, value = button.dataset.previewValue; event.stopPropagation();
  if (button.dataset.previewPath === 'previewOn') { roomPreviewOn = value; renderRooms(); if (selectedRoomId) openRoomEditor(selectedRoomId, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); return; }
  const marker = model.entities[selectedId]; if (!marker) return;
  editorPreview = { entityId: marker.entityId, state: value }; renderMarkers(); openEditor(openSectionIndex(els.editorContent, editorOpenSectionIndex));
}
function withStatePreview(markup, marker) {
  return (markerHasOnOff(marker) ? previewRow('__preview', editorPreview.entityId === marker.entityId ? editorPreview.state : '') : '') + markup;
}
function syncPreviewStateButton() {
  const button = $('#preview-state-toggle'), marker = model.entities[selectedId]; if (!button) return;
  const preview = marker ? previewStateFor(marker) : '', actual = marker ? stateKind(marker) : 'off', shown = preview || actual;
  button.classList.toggle('active', shown === 'on'); button.dataset.previewing = preview ? 'true' : 'false';
  const label = preview ? `Testowany stan: ${shown.toUpperCase()}` : `Testuj stan: ${shown.toUpperCase()}`;
  button.title = label; button.setAttribute('aria-label', label);
}
function onColorPickerClick(event) {
  const toggle = event.target.closest('[data-color-toggle]'), swatch = event.target.closest('[data-palette-color]'), rgb = event.target.closest('[data-rgb-color]');
  if (toggle) { event.preventDefault(); const menu = toggle.closest('.color-picker').querySelector('.color-menu'), open = menu.classList.contains('visible'); $$('.color-menu', els.editorContent).forEach(x => x.classList.remove('visible')); menu.classList.toggle('visible', !open); requestAnimationFrame(() => { if (!open) menu.scrollIntoView({ block: 'nearest' }); keepEditorInViewport(); }); return; }
  if (swatch) { event.preventDefault(); const picker = swatch.closest('.color-picker'), input = $('.color-native', picker); input.value = swatch.dataset.paletteColor; $('.color-current', picker).style.background = input.value; input.dispatchEvent(new Event('input', { bubbles: true })); $('.color-menu', picker).classList.remove('visible'); return; }
  if (rgb) { event.preventDefault(); rgb.closest('.color-picker').querySelector('.color-native').click(); }
}
function closeEditor() { if (mobileView() && editMode) requestAnimationFrame(applyViewTransform); selectedId = null; editorDragged = false; editorOpenSectionIndex = -1; els.editor.classList.remove('visible'); els.editor.setAttribute('aria-hidden','true'); hideSelection(); $$('.marker.selected').forEach(n => n.classList.remove('selected')); }
function startEditorDrag(event) {
  if (mobileView() || dockMode() || event.button !== 0 || (event.buttons & 1) !== 1 || event.target.closest('button,input,select')) return;
  const panel = event.currentTarget?.closest?.('.editor') || els.editor;
  event.preventDefault(); if (panel === els.editor) editorDragged = true; else flowEditorDragged = true;
  const r = panel.getBoundingClientRect(), startX = event.clientX, startY = event.clientY, startLeft = r.left, startTop = r.top;
  const move = e => {
    if ((e.buttons & 1) !== 1) return finish();
    const left = clamp(startLeft + e.clientX - startX, 8, Math.max(8, innerWidth - panel.offsetWidth - 8));
    const top = clamp(startTop + e.clientY - startY, 8, Math.max(8, innerHeight - panel.offsetHeight - 8));
    Object.assign(panel.style, { left: `${left}px`, right: 'auto', top: `${top}px` });
  };
  const finish = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
}
function setPath(object, path, value) { const parts = path.split('.'); let target = object; while (parts.length > 1) { const key = parts.shift(); if (target[key] === undefined || target[key] === null) target[key] = key === 'valueRules' ? { ...VALUE_RULE_DEFAULTS } : {}; target = target[key]; } target[parts[0]] = value; }
function resetEditorRange(path) {
  const marker = model.entities[selectedId]; if (!marker) return;
  if (path === 'rotation') { const input = els.editorContent.querySelector('input[data-path="rotation"]'); if (input) { input.value = 0; input.dispatchEvent(new Event('change', { bubbles: true })); } return; }
  if (!path.startsWith('style.')) return;
  const defaults = markerStyleDefaults(marker.type), key = path.slice('style.'.length);
  if (!(key in defaults)) return;
  const input = els.editorContent.querySelector(`input[data-path="${CSS.escape(path)}"]`);
  if (!input) return;
  input.value = defaults[key];
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
function onEditorInput(event) {
  const marker = model.entities[selectedId], input = event.target; if (!marker || !input.dataset.path) return;
  if (input.dataset.path === '__preview') { editorPreview = input.value ? { entityId: marker.entityId, state: input.value } : { entityId:'', state:'' }; renderMarkers(); openEditor(openSectionIndex(els.editorContent, editorOpenSectionIndex)); return; }
  let value = input.type === 'checkbox' ? input.checked : input.value;
  if (input.dataset.valueType === 'range' || input.dataset.valueType === 'number') value = Number(value); if (input.dataset.integer === 'true') value = Math.round(value);
  setPath(marker, input.dataset.path, value); marker.updatedAt = new Date().toISOString();
  if (input.dataset.editorRefresh === 'true') {
    renderMarkers();
    if (marker.type === 'icon' && refreshIconEditorSection(marker, input)) { scheduleSave(true); return; }
    const openIndex = editorOpenSectionIndex >= 0 ? editorOpenSectionIndex : $$('.editor-section', els.editorContent).findIndex(section => section.open);
    reopenMarkerEditor(openIndex); scheduleSave(true); return;
  }
  if (input.dataset.path === 'iconMode') { const manual = $('[data-manual-icons]', els.editorContent); if (manual) manual.hidden = value !== 'manual'; }
  if (input.type === 'color') { const preview = input.closest('.color-picker')?.querySelector('.color-current'); if (preview) preview.style.background = value; }
  const output = input.parentElement.querySelector('output'); if (output) { const d = String(input.step || '').split('.')[1]?.length || 0; output.textContent = `${typeof value === 'number' && input.type === 'range' ? Number(value.toFixed(d)) : value}${output.dataset.suffix || ''}`; }
  const node = markerNode(marker.id);
  if (input.dataset.path === 'displayName' || input.dataset.path === 'textValue') { els.editorTitle.textContent = isTextId(marker.entityId) ? (marker.textValue || marker.displayName || translateValue('Tekst / przycisk')) : value; if (node) node.innerHTML = markerHtml(marker); }
  const needsMarkup = input.dataset.path === 'unitOverride' || input.dataset.path === 'decimals' || input.dataset.path === 'stateOnLabel' || input.dataset.path === 'stateOffLabel' || input.dataset.path.startsWith('icon') || input.dataset.path.startsWith('valueRules.') || input.dataset.path.startsWith('style.show') || isGaugeType(marker.type) && input.dataset.path.startsWith('style.') || marker.type === 'thermostat';
  // A range input keeps pointer capture only while its DOM node remains intact.
  // Rebuild Gauge/Horseshoe SVG after the finger is released, never while dragging.
  if (needsMarkup && (input.type !== 'range' || event.type === 'change')) { if (node) node.innerHTML = markerHtml(marker); }
  if (node) applyMarkerStyle(node, marker); syncSelection(); renderAdded(); scheduleSave();
}
async function changeType(type) {
  const marker = model.entities[selectedId]; if (!marker || marker.type === type) return;
  const targetLabel = markerTypeLabel(type);
  const confirmed = await appConfirm({
    title: `Zmienić na ${targetLabel}?`,
    message: 'Typ markera i jego ustawienia wyglądu zostaną zastąpione domyślnymi.',
    confirmText: 'Zmień'
  });
  if (!confirmed) return;
  marker.type = type; marker.style = markerStyleDefaults(type); marker.updatedAt = new Date().toISOString();
  renderMarkers(); openEditor(); scheduleSave(true); notify(`Zmieniono na ${targetLabel}`);
}

function renderAdded() {
  const view = activeSceneView(), markers = Object.values(model.entities), flows = Object.values(view?.flows || {}), rooms = Object.values(view?.rooms || {});
  const actions = (kind, id) => `<div class="entity-actions"><button data-added-show="${kind}" data-id="${escapeHtml(id)}">Pokaż</button><button class="danger" data-added-remove="${kind}" data-id="${escapeHtml(id)}">Usuń z widoku</button></div>`;
  const markerRows = markers.map(m => isTextId(m.entityId) ? `<div class="entity-row added-row"><div class="added-identity"><span class="added-kind-icon"><i class="mdi mdi-format-text"></i></span><div><strong data-no-i18n>${escapeHtml(m.textValue || m.displayName || translateValue('Tekst'))}</strong><small>${escapeHtml(translateValue('Tekst / przycisk'))}${m.linkAction && m.linkAction !== 'none' ? ' · ' + escapeHtml(translateValue(LINK_ACTIONS.find(([v]) => v === m.linkAction)?.[1] || '')) : ''}</small></div></div>${actions('marker', m.entityId)}</div>` : `<div class="entity-row added-row"><div class="added-identity">${integrationIconMarkupFor(m.sourceDomain || m.entityId.split('.')[0], m.integrationName || m.sourceDomain, 'added-icon')}<div><strong data-no-i18n>${escapeHtml(m.displayName)}</strong><small>${escapeHtml(m.entityId)} · ${escapeHtml(m.integrationName || 'Home Assistant')} · ${markerTypeLabel(m.type)}</small></div></div>${actions('marker', m.entityId)}</div>`);
  const flowRows = flows.map(flow => `<div class="entity-row added-row flow-row"><div class="added-identity"><span class="added-kind-icon"><i class="mdi mdi-chevron-triple-right"></i></span><div><strong data-no-i18n>${escapeHtml(flow.displayName || flow.entityId)}</strong><small>${escapeHtml(flow.entityId || '—')}${flow.integrationName ? ' · ' + escapeHtml(flow.integrationName) : ''}</small></div></div>${actions('flow', flow.id)}</div>`);
  const roomRow = room => `<div class="entity-row added-row room-row"><div class="added-identity"><span class="added-kind-icon"><i class="mdi ${isIconRoom(room) ? 'mdi-label-outline' : 'mdi-floor-plan'}"></i></span><div><strong data-no-i18n>${escapeHtml(room.name || translateValue(isIconRoom(room) ? 'Etykieta' : 'Pomieszczenie'))}</strong><small data-no-i18n>${escapeHtml((room.entityIds || []).join(', ') || '—')}</small></div></div>${actions('room', room.id)}</div>`;
  const labelRows = rooms.filter(isIconRoom).map(roomRow), roomRows = rooms.filter(room => !isIconRoom(room)).map(roomRow);
  const group = (title, rows) => rows.length ? `<div class="added-group"><div class="added-group-title"><span data-no-i18n>${title === 'Flow' ? 'Flow' : translateValue(title)}</span><b>${rows.length}</b></div>${rows.join('')}</div>` : '';
  const total = markerRows.length + flowRows.length + labelRows.length + roomRows.length; els.addedCount.textContent = total;
  els.addedList.innerHTML = total ? group('Etykiety', labelRows) + group('Pomieszczenia', roomRows) + group('Markery', markerRows) + group('Flow', flowRows) : '<div class="empty-row">Nie dodano jeszcze żadnych elementów.</div>';
}
async function loadIntegrations(force = false) {
  if (integrations.length && !force) return renderIntegrations();
  els.integrationList.innerHTML = '<div class="empty-row">Wczytywanie integracji…</div>';
  try { const data = await api('integrations'); integrations = data.integrations || []; renderIntegrations(); }
  catch (error) { els.integrationList.innerHTML = `<div class="empty-row">Błąd: ${escapeHtml(error.message)}</div>`; }
}
function searchText(value) { return String(value || '').toLocaleLowerCase('pl').trim(); }
// Search by words, in any order, without Polish diacritics and tolerant of endings ("wyspa" finds "Lampa nad wyspą",
// "kuchnia" finds "kuchni"): every typed word must appear in the entity's id / name / area.
function plainText(value) { return searchText(value).replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[_.]/g, ' '); }
function looseMatch(haystack, query) {
  const hay = plainText(haystack);
  return plainText(query).split(/\s+/).filter(Boolean).every(word => hay.includes(word) || (word.length >= 5 && hay.includes(word.slice(0, -1))) || (word.length >= 6 && hay.includes(word.slice(0, -2))));
}
function searchResultMarkup(entity, integration) {
  const added = markersForEntity(entity.entity_id).length > 0;
  return `<div class="entity-row search-result ${entity.enabled ? '' : 'disabled-entity'}"><div><strong data-no-i18n>${escapeHtml(entity.name || entity.entity_id)}</strong><small>${escapeHtml(entity.entity_id)} · ${escapeHtml(integration.title || integration.domain || 'Home Assistant')}${entity.state != null ? ` · ${escapeHtml(entity.state)}${entity.unit ? ` ${escapeHtml(entity.unit)}` : ''}` : ''}</small></div><div class="entity-actions">${enabledIcon(entity.enabled)}<button class="add-entity" data-add="${escapeHtml(entity.entity_id)}" data-entry="${escapeHtml(integration.entry_id)}" ${added || !entity.enabled ? 'disabled' : ''} title="${added ? 'Dodano do widoku' : 'Dodaj wskaźnik'}">${added ? '✓' : '+'}</button></div></div>`;
}
function renderIntegrationSearch() {
  const query = searchText(integrationSearchText);
  if (!query) return false;
  if (query.length < 2) { els.integrationList.innerHTML = '<div class="empty-row">Wpisz co najmniej 2 znaki.</div>'; return true; }
  const matches = integrations.flatMap(integration => (integrationEntities.get(integration.entry_id) || []).filter(entity => searchText(entity.entity_id).includes(query) || searchText(entity.name).includes(query)).map(entity => ({ entity, integration }))).sort((a,b) => String(a.entity.name || a.entity.entity_id).localeCompare(String(b.entity.name || b.entity.entity_id), 'pl', { sensitivity:'base' }));
  const status = integrationSearchLoading ? '<div class="search-status">Wyszukiwanie encji…</div>' : '';
  els.integrationList.innerHTML = status + (matches.length ? matches.map(({entity,integration}) => searchResultMarkup(entity,integration)).join('') : '<div class="empty-row">Brak pasujących encji.</div>');
  return true;
}
async function loadEntitiesForSearch(request) {
  const missing = integrations.filter(item => !integrationEntities.has(item.entry_id));
  if (!missing.length) return;
  try {
    // One server request reads HA registries once, instead of once per integration.
    const data = await api('integration_entities_all');
    if (request !== integrationSearchRequest) return;
    const byEntry = data.entities_by_entry || {};
    missing.forEach(item => {
      integrationEntities.set(item.entry_id, Array.isArray(byEntry[item.entry_id]) ? byEntry[item.entry_id] : []);
      updateIntegrationMetadata(item.entry_id);
    });
  } catch {
    if (request !== integrationSearchRequest) return;
    missing.forEach(item => integrationEntities.set(item.entry_id, []));
  }
  if (request === integrationSearchRequest) renderIntegrations();
}
async function runIntegrationSearch() {
  const query = searchText(integrationSearchText);
  if (!query || query.length < 2) { integrationSearchLoading = false; renderIntegrations(); return; }
  const request = ++integrationSearchRequest;
  if (!integrations.length) await loadIntegrations();
  if (request !== integrationSearchRequest) return;
  integrationSearchLoading = integrations.some(item => !integrationEntities.has(item.entry_id));
  renderIntegrations();
  await loadEntitiesForSearch(request);
  if (request !== integrationSearchRequest) return;
  integrationSearchLoading = false; renderIntegrations();
}
function renderIntegrations() {
  if (renderIntegrationSearch()) return;
  const groups = getIntegrationGroups();
  if (!groups.length) { els.integrationList.innerHTML = '<div class="empty-row">Brak aktywnych integracji.</div>'; return; }
  const used = groups.filter(group => group.used), unused = groups.filter(group => !group.used);
  const usedHtml = used.map(integrationMarkup).join('');
  const unusedHtml = unused.length ? `<details class="unused-integrations" ${unusedIntegrationsOpen ? 'open' : ''}><summary><span>Pozostałe integracje</span><b>${unused.length}</b></summary><div class="unused-integrations-body">${unused.map(integrationMarkup).join('')}</div></details>` : '';
  els.integrationList.innerHTML = usedHtml + unusedHtml;
}
function integrationMarkup(group) {
  return `<div class="integration ${group.used ? 'used' : ''} ${openIntegrations.has(group.key) ? 'open' : ''}" data-integration="${escapeHtml(group.key)}"><button class="integration-summary">${integrationIconMarkup(group)}<span class="integration-name"><strong data-no-i18n>${escapeHtml(group.title)}</strong><small>${escapeHtml([...new Set(group.entries.map(x => x.domain))].join(', '))}${group.entries.length > 1 ? ` · ${group.entries.length} połączone` : ''}</small></span>${group.used ? `<span class="used-count">${group.used} używane</span>` : ''}</button><div class="integration-body">${integrationBody(group)}</div></div>`;
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
  return entities.map(e => { const added = markersForEntity(e.entity_id).length > 0 || Object.values(activeSceneView()?.rooms || {}).some(room => isIconRoom(room) && (room.entityIds || []).includes(e.entity_id)); return `<div class="entity-row ${e.enabled ? '' : 'disabled-entity'}"><div><strong data-no-i18n>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.entity_id)}${e.state != null ? ` · ${escapeHtml(e.state)}${e.unit ? ` ${escapeHtml(e.unit)}` : ''}` : ''}</small></div><div class="entity-actions">${enabledIcon(e.enabled)}<button class="add-entity" data-add="${escapeHtml(e.entity_id)}" data-entry="${escapeHtml(e._entryId)}" ${added || !e.enabled ? 'disabled' : ''} title="${added ? 'Dodano do widoku' : e.enabled ? 'Dodaj do widoku' : 'Encja jest wyłączona'}">${added ? '✓' : '+'}</button></div></div>`; }).join('');
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
  entities.forEach(e => markersForEntity(e.entity_id).forEach(marker => { if (integration && (!marker.integrationId || marker.integrationName === 'Home Assistant')) { marker.integrationId = entryId; marker.integrationName = integration.title; marker.sourceDomain = integration.domain; changed = true; } }));
  if (changed) { renderAdded(); scheduleSave(); }
}
// ---- Add window ------------------------------------------------------------------------------
// One place to add anything: element type tiles with live thumbnails + a search over every HA entity (also YAML/template
// ones without an integration). Type first or entity first; the thumbnails redraw with the chosen entity's real state.
const ADD_TYPES = [
  { key:'icon', label:'Etykieta', hint:'Ikona, nazwa i stan w dowolnym miejscu', entity:'optional' },
  { key:'room', label:'Pomieszczenie', hint:'Obszar ze stanem encji', entity:'optional' },
  // Gauge and horseshoe are one tile; which one is chosen in its panel (Badge is no longer added).
  { key:'gauge', label:'Wskaźnik', hint:'Gauge albo podkowa — moc, poziom, procent', entity:'required', numeric:true },
  { key:'flow', label:'Flow', hint:'Przepływ energii, wody', entity:'optional', numeric:true },
  { key:'thermostat', label:'Termostat', hint:'Ogrzewanie / klimatyzacja — temperatura, tryby, sterowanie', entity:'required', domains:['climate'] },
  { key:'text', label:'Tekst', hint:'Napis z akcją — widok, strona HA, link', entity:'none' },
];
const ADD_SAMPLES = {
  badge: { entity_id:'sensor.hav_sample_temperature', name:'Salon', state:'21.8', unit:'°C', device_class:'temperature' },
  gauge: { entity_id:'sensor.hav_sample_level', name:'Poziom', state:'64', unit:'%' },
  thermostat: { entity_id:'climate.hav_sample_heating', name:'Ogrzewanie', state:'heat', attributes:{ hvac_modes:['heat','off'], min_temp:10, max_temp:30, target_temp_step:.5, current_temperature:21.5, temperature:22, hvac_action:'heating' } },
  horseshoe: { entity_id:'sensor.hav_sample_battery', name:'Bateria', state:'72', unit:'%', device_class:'battery' },
};
const ADD_TYPE_GROUPS = [['light','Światła',['light']],['switch','Przełączniki',['switch','input_boolean','fan']],['sensor','Czujniki',['sensor']],['binary_sensor','Czujniki binarne',['binary_sensor']],['cover','Rolety',['cover']],['climate','Klimat',['climate','water_heater']],['media','Media',['media_player']]];
const ADD_DOMAIN_ICONS = { light:'mdi-lightbulb', switch:'mdi-toggle-switch-variant', input_boolean:'mdi-toggle-switch-outline', fan:'mdi-fan', binary_sensor:'mdi-radiobox-marked', cover:'mdi-window-shutter', climate:'mdi-thermostat', water_heater:'mdi-water-boiler', media_player:'mdi-cast', camera:'mdi-cctv', lock:'mdi-lock', person:'mdi-account', device_tracker:'mdi-map-marker', weather:'mdi-weather-partly-cloudy', sun:'mdi-white-balance-sunny', scene:'mdi-palette', script:'mdi-script-text', automation:'mdi-robot', button:'mdi-gesture-tap-button', number:'mdi-ray-vertex', select:'mdi-format-list-bulleted', input_number:'mdi-ray-vertex', input_select:'mdi-format-list-bulleted', update:'mdi-package-up', vacuum:'mdi-robot-vacuum', alarm_control_panel:'mdi-shield-home' };
const ADD_SENSOR_ICONS = { temperature:'mdi-thermometer', humidity:'mdi-water-percent', power:'mdi-flash', energy:'mdi-lightning-bolt', battery:'mdi-battery', illuminance:'mdi-brightness-5', pressure:'mdi-gauge', voltage:'mdi-sine-wave', current:'mdi-current-ac', carbon_dioxide:'mdi-molecule-co2' };
const RECENT_ADD_KEY = 'ha-views-recent-entities', ADD_PICK_KEY = 'ha-views-add-pick';
const TOGGLE_DOMAINS = ['switch', 'light', 'fan', 'input_boolean'];
let addState = null, entityCatalog = null, entityCatalogLoading = null, addPicking = null;

async function loadEntityCatalog() {
  if (entityCatalog) return entityCatalog;
  entityCatalogLoading ||= (async () => {
    if (!integrations.length) { try { integrations = (await api('integrations')).integrations || []; } catch {} }
    try { const data = await api('entity_catalog'); if (data.ok === false || !Array.isArray(data.entities)) throw new Error(data.error || 'catalog'); entityCatalog = { entities: data.entities || [], areas: data.areas || [] }; }
    catch {
      // Older server or HA error: fall back to the per-integration list the room editor already uses.
      const list = await loadAllEntities();
      entityCatalog = { entities: list.map(item => ({ entity_id: item.id, name: item.name, domain: item.id.split('.')[0], state: stateCache[item.id]?.state ?? null, unit: stateCache[item.id]?.attributes?.unit_of_measurement || '', device_class: stateCache[item.id]?.attributes?.device_class || '', area:'', entry_id:'', integration: item.integration || '' })), areas: [] };
    }
    return entityCatalog;
  })().finally(() => { entityCatalogLoading = null; });
  return entityCatalogLoading;
}
function catalogIntegration(entity) { const item = integrations.find(x => x.entry_id === entity?.entry_id); return { entry_id: entity?.entry_id || '', title: item?.title || entity?.integration || '', domain: item?.domain || entity?.platform || entity?.domain || '' }; }
function addRecent() { try { return JSON.parse(localStorage.getItem(RECENT_ADD_KEY) || '[]').filter(id => typeof id === 'string'); } catch { return []; } }
function rememberAdded(entityId) { if (!entityId) return; try { localStorage.setItem(RECENT_ADD_KEY, JSON.stringify([entityId, ...addRecent().filter(id => id !== entityId)].slice(0, 12))); } catch {} }
function addEntityNumeric(entity) { const raw = entity?.state; if (raw === null || raw === undefined || raw === '') return false; return Number.isFinite(Number(String(raw).replace(',', '.'))); }
function addTypeAllowed(type, entity) {
  if (!entity) return true;
  if (type.entity === 'none') return true;
  if (type.domains) return type.domains.includes(String(entity.domain || entity.entity_id?.split('.')[0]));
  return !type.numeric || addEntityNumeric(entity);
}
function addRecommendedType(entity) {
  if (!entity) return '';
  const domain = entity.domain || entity.entity_id.split('.')[0], unit = String(entity.unit || '').toLowerCase(), dc = String(entity.device_class || '').toLowerCase();
  if (TOGGLE_DOMAINS.includes(domain) || ['binary_sensor','cover','lock','media_player','vacuum'].includes(domain)) return 'icon';
  if (addEntityNumeric(entity) && (['power','energy','battery'].includes(dc) || ['w','kw','kwh','wh','%'].includes(unit))) return 'gauge';
  return 'icon'; // a sensor (temperature, humidity…) is shown best as an etykieta
}
function addEntityIcon(entity) {
  const own = String(entity?.icon || ''); if (own.startsWith('mdi:')) return own.replace(/^mdi:/, 'mdi-');
  const domain = entity?.domain || String(entity?.entity_id || '').split('.')[0];
  if (domain === 'sensor') return ADD_SENSOR_ICONS[String(entity?.device_class || '')] || 'mdi-eye-outline';
  return ADD_DOMAIN_ICONS[domain] || 'mdi-shape-outline';
}
// What already shows this entity on the current view: "Ikona, Flow, Pomieszczenie".
function addUsageLabel(entityId) {
  const view = activeSceneView(), parts = [];
  markersForEntity(entityId).forEach(marker => parts.push(markerTypeLabel(marker.type)));
  if (Object.values(view?.flows || {}).some(flow => flow.entityId === entityId)) parts.push('Flow');
  Object.values(view?.rooms || {}).filter(room => (room.entityIds || []).includes(entityId)).forEach(room => parts.push(isIconRoom(room) ? 'Etykieta' : 'Pomieszczenie'));
  return [...new Set(parts)].map(translateValue).join(', ');
}
function viewCenterPercent() {
  const s = els.scene.getBoundingClientRect(), v = els.viewport.getBoundingClientRect();
  const x = s.width ? clamp(((Math.max(s.left, v.left) + Math.min(s.right, v.right)) / 2 - s.left) / s.width * 100, 5, 95) : 50;
  const y = s.height ? clamp(((Math.max(s.top, v.top) + Math.min(s.bottom, v.bottom)) / 2 - s.top) / s.height * 100, 5, 95) : 50;
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}
function addThumbMarker(type, entity) {
  const sample = ADD_SAMPLES[type], source = entity || sample;
  if (!entity || !stateCache[source.entity_id]) stateCache[source.entity_id] = { entity_id: source.entity_id, state: String(source.state ?? ''), attributes: { ...(source.attributes || {}), friendly_name: source.name, unit_of_measurement: source.unit || undefined, device_class: source.device_class || undefined, icon: source.icon || undefined } };
  return { id:`__add_thumb_${type}`, entityId: source.entity_id, displayName: entity ? (source.name || source.entity_id) : translateValue(source.name), type, style: markerStyleDefaults(type), unitOverride: source.unit || '', decimals:'auto', stateOnLabel:'', stateOffLabel:'', iconMode:'auto', iconName:'', iconOn:'', iconOff:'', iconVariantEnabled:false, tapAction:'more_info', xPercent:50, yPercent:50 };
}
function addThumbStatic(type, entity) {
  // Etykieta: a small group with the icon, name and state.
  if (type === 'icon') return `<div class="add-thumb-label"><span class="add-thumb-label-icon"><i class="mdi ${entity ? addEntityIcon(entity) : 'mdi-lightbulb-on'}"></i></span><b data-no-i18n>${escapeHtml(entity?.name || translateValue('Salon'))}</b><small data-no-i18n>${escapeHtml(entity ? `${entity.state ?? ''}${entity.unit ? ` ${entity.unit}` : ''}` : translateValue('Wł.'))}</small></div>`;
  if (type === 'room') return `<svg class="add-thumb-room" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M12 10H62V30H88V52H12Z" fill="#FFD27A" opacity=".6"/><path d="M12 10H62V30H88V52H12Z" fill="none" stroke="#e39a3a" stroke-width=".8" stroke-dasharray="2 1.5"/></svg>${entity ? `<span class="add-thumb-caption" data-no-i18n>${escapeHtml(entity.area || entity.name)}</span>` : ''}`;
  if (type === 'flow') return `<div class="add-thumb-flow"><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i></div>${entity ? `<span class="add-thumb-caption" data-no-i18n>${escapeHtml(`${entity.state ?? ''} ${entity.unit || ''}`.trim())}</span>` : ''}`;
  // Tekst: a label with the tap icon and its text.
  return `<div class="add-thumb-label"><span class="add-thumb-label-icon"><i class="mdi mdi-gesture-tap-button"></i></span><b>${escapeHtml(translateValue('Tekst'))}</b></div>`;
}
function renderAddThumbs() {
  $$('.add-thumb[data-thumb]', els.addDialog).forEach(thumb => {
    const type = thumb.dataset.thumb, entity = addState.entity && addTypeAllowed(ADD_TYPES.find(t => t.key === type), addState.entity) ? addState.entity : null;
    if (!ADD_SAMPLES[type]) { thumb.innerHTML = addThumbStatic(type, entity); return; }
    const marker = addThumbMarker(type, entity), node = document.createElement('div');
    node.className = `marker ${type}`; node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker);
    const w = Number(marker.style.width) || 120, h = Number(marker.style.height) || 70, box = thumb.getBoundingClientRect();
    node.style.setProperty('--scene-scale', String(Math.min(1, (box.width || 160) * .86 / w, (box.height || 86) * .9 / h)));
    thumb.replaceChildren(node);
  });
}
function addFilteredEntities() {
  const all = entityCatalog?.entities || [], state = addState, type = ADD_TYPES.find(t => t.key === state.type);
  const words = searchText(state.query).split(/\s+/).filter(Boolean);
  let list = all.filter(entity => !entity.hidden || words.length);
  if (type?.numeric && !state.entity) list = list.filter(addEntityNumeric);
  if (type?.domains) list = list.filter(entity => type.domains.includes(String(entity.domain || entity.entity_id?.split('.')[0])));
  if (type?.entity === 'none') list = [];
  if (words.length) list = list.filter(entity => { const hay = searchText(`${entity.name} ${entity.entity_id} ${entity.area || ''} ${catalogIntegration(entity).title}`); return words.every(word => hay.includes(word)); });
  else if (state.filter === 'recent') { const recent = addRecent(); list = recent.map(id => list.find(entity => entity.entity_id === id)).filter(Boolean); }
  if (!words.length && state.filter.startsWith('area:')) { const area = state.filter.slice(5); list = list.filter(entity => (entity.area || '') === area); }
  if (!words.length && state.filter.startsWith('type:')) { const group = ADD_TYPE_GROUPS.find(([key]) => `type:${key}` === state.filter); list = group ? list.filter(entity => group[2].includes(entity.domain)) : list.filter(entity => !ADD_TYPE_GROUPS.some(([, , domains]) => domains.includes(entity.domain))); }
  return list;
}
function addChipsMarkup() {
  const state = addState, chip = (value, label, raw = false) => `<button type="button" class="add-chip${state.filter === value ? ' on' : ''}" data-add-filter="${escapeHtml(value)}"${raw ? ' data-no-i18n' : ''}>${escapeHtml(raw ? label : translateValue(label))}</button>`;
  const chips = [chip('all', 'Wszystkie')];
  if (addRecent().length) chips.push(chip('recent', 'Ostatnie'));
  if (state.group === 'areas') { (entityCatalog?.areas || []).forEach(area => chips.push(chip(`area:${area}`, area, true))); if (entityCatalog?.areas?.length) chips.push(chip('area:', 'Bez obszaru')); }
  else { ADD_TYPE_GROUPS.forEach(([key, label]) => chips.push(chip(`type:${key}`, label))); chips.push(chip('type:other', 'Inne')); }
  return chips.join('') + `<button type="button" class="add-chip seg" data-add-group><i class="mdi mdi-${state.group === 'areas' ? 'home-group' : 'shape-outline'}"></i>${escapeHtml(translateValue(state.group === 'areas' ? 'Obszary' : 'Typy'))}</button>`;
}
function addRowsMarkup() {
  if (!entityCatalog) return `<div class="add-empty">${escapeHtml(translateValue('Wczytywanie encji…'))}</div>`;
  const type = ADD_TYPES.find(t => t.key === addState.type);
  if (type?.entity === 'none') return `<div class="add-empty">${escapeHtml(translateValue('Ten element nie potrzebuje encji.'))}</div>`;
  const list = addFilteredEntities(), shown = list.slice(0, 120);
  if (!shown.length) return `<div class="add-empty">${escapeHtml(translateValue(addState.filter === 'recent' && !addState.query ? 'Brak ostatnio dodanych encji.' : 'Brak pasujących encji.'))}</div>`;
  const rows = shown.map(entity => {
    const used = addUsageLabel(entity.entity_id), integration = catalogIntegration(entity).title, meta = [entity.area, integration].filter(Boolean).join(' · ');
    const value = `${entity.state ?? ''}${entity.unit ? ` ${entity.unit}` : ''}`;
    return `<button type="button" class="add-row${addState.entity?.entity_id === entity.entity_id ? ' sel' : ''}" data-add-entity="${escapeHtml(entity.entity_id)}"><span class="add-row-icon"><i class="mdi ${addEntityIcon(entity)}"></i></span><span class="add-row-name"><b data-no-i18n>${escapeHtml(entity.name || entity.entity_id)}</b><small data-no-i18n>${escapeHtml(entity.entity_id)}${meta ? ` · ${escapeHtml(meta)}` : ''}</small></span>${used ? `<span class="add-row-used">${escapeHtml(translateValue('na widoku'))}: ${escapeHtml(used)}</span>` : ''}<span class="add-row-state${String(entity.state) === 'on' ? ' on' : ''}" data-no-i18n>${escapeHtml(value)}</span></button>`;
  }).join('');
  const more = list.length > shown.length ? `<div class="add-empty">${escapeHtml(translateValue('Pokazano'))} ${shown.length} / ${list.length} — ${escapeHtml(translateValue('zawęż wyszukiwanie'))}</div>` : '';
  return rows + more;
}
function addGoLabel() {
  const type = ADD_TYPES.find(t => t.key === addState.type);
  if (!type) return { text: addState.entity ? 'Wybierz, co dodać' : 'Wybierz typ', ok: false };
  if (type.entity === 'required' && !addState.entity) return { text: 'Wybierz encję', ok: false };
  return { text: `${translateValue('Dodaj')}: ${translateValue(type.label)}`, ok: true };
}
function renderAddDialog(part = 'all') {
  if (!addState || !els.addDialog) return;
  const state = addState, entity = state.entity, recommended = addRecommendedType(entity);
  els.addDialog.classList.toggle('step-type', state.step === 'type'); els.addDialog.classList.toggle('step-entity', state.step === 'entity');
  if (part === 'all') {
    const chosen = ADD_TYPES.find(t => t.key === state.type);
    $('#add-sub', els.addDialog).textContent = translateValue(state.step === 'type' ? 'Wybierz, co chcesz dodać' : 'Wybierz encję dla tego elementu');
    $('#add-step-type', els.addDialog).innerHTML = chosen ? `<button type="button" class="add-back" data-add-back><i class="mdi mdi-arrow-left"></i><span>${escapeHtml(translateValue('Zmień typ'))}</span></button><span class="add-step-chip"><span class="add-thumb" data-thumb="${chosen.key}"></span><b>${escapeHtml(translateValue(chosen.label))}</b></span>` : '';
    $('#add-selected', els.addDialog).innerHTML = entity ? `<div class="add-selected"><span class="add-row-icon"><i class="mdi ${addEntityIcon(entity)}"></i></span><div><b data-no-i18n>${escapeHtml(entity.name || entity.entity_id)}</b><small data-no-i18n>${escapeHtml(entity.entity_id)} · ${escapeHtml(`${entity.state ?? ''}${entity.unit ? ` ${entity.unit}` : ''}`)}${addUsageLabel(entity.entity_id) ? ` · ${escapeHtml(translateValue('na widoku'))}: ${escapeHtml(addUsageLabel(entity.entity_id))}` : ''}</small></div><button type="button" class="add-link" data-add-clear>${escapeHtml(translateValue('Zmień'))}</button></div>` : '';
    $('#add-types', els.addDialog).innerHTML = ADD_TYPES.map(type => {
      const allowed = addTypeAllowed(type, entity), hint = !allowed ? 'Dla wartości liczbowych' : entity && type.entity === 'none' ? 'Bez encji' : type.hint;
      return `<button type="button" class="add-card${state.type === type.key ? ' sel' : ''}${allowed ? '' : ' off'}" data-add-type="${type.key}" ${allowed ? '' : 'disabled'}>${entity && recommended === type.key ? `<span class="add-tag">★ ${escapeHtml(translateValue('Polecane'))}</span>` : ''}<span class="add-thumb" data-thumb="${type.key}"></span><b>${escapeHtml(translateValue(type.label))}</b><i>${escapeHtml(translateValue(hint))}</i></button>`;
    }).join('');
    requestAnimationFrame(renderAddThumbs);
    $('#add-chips', els.addDialog).innerHTML = addChipsMarkup();
    const numericNote = ADD_TYPES.find(t => t.key === state.type)?.numeric && !entity;
    $('#add-entity-note', els.addDialog).textContent = numericNote ? translateValue('— tylko encje liczbowe') : '';
  }
  $('#add-list', els.addDialog).innerHTML = addRowsMarkup();
  const go = addGoLabel(), button = $('#add-go', els.addDialog);
  button.hidden = state.step === 'type'; button.disabled = !go.ok; button.innerHTML = `<i class="mdi mdi-plus"></i><span>${escapeHtml(translateValue(go.text))}</span>`;
}
// presetEntity: opened from an entity's "+" in Integrations - the entity is already chosen, only the kind is asked.
async function openAddDialog(presetEntity = null) {
  if (!editMode || !els.addDialog) return;
  closeCompactMenus(); closeEditor(); closeFlowEditor(); closeRoomEditor(); cancelRoomDrawing(); cancelAddPicking();
  let pick = false; try { pick = localStorage.getItem(ADD_PICK_KEY) === '1'; } catch {}
  addState = { step:'type', type:'', entity:presetEntity, preset:!!presetEntity, query:'', filter: addRecent().length ? 'recent' : 'all', group:'areas', pick };
  const search = $('#add-search', els.addDialog); search.value = ''; $('#add-pick', els.addDialog).checked = pick;
  els.addDialog.classList.add('visible'); els.addDialog.setAttribute('aria-hidden', 'false'); renderAddDialog();
  await loadEntityCatalog();
  if (addState) { if (!entityCatalog.areas.length) addState.group = 'types'; renderAddDialog(); }
}
// Step one is only the kind of element. A room goes straight to drawing (its entities are picked in the room
// panel afterwards), text and Flow are placed without an entity; markers move on to the entity step.
function chooseAddType(key) {
  const type = ADD_TYPES.find(t => t.key === key); if (!type || !addState) return;
  addState.type = key; if (!addState.preset || type.entity === 'none') addState.entity = null;
  if (type.entity !== 'required' || addState.entity) return confirmAddDialog();
  addState.step = 'entity'; addState.query = ''; const search = $('#add-search', els.addDialog); search.value = '';
  renderAddDialog(); $('.add-body', els.addDialog)?.scrollTo({ top: 0 });
  if (!mobileView()) setTimeout(() => search.focus(), 60);
}
function closeAddDialog() { if (!els.addDialog) return; els.addDialog.classList.remove('visible'); els.addDialog.setAttribute('aria-hidden', 'true'); addState = null; }
function cancelAddPicking() { if (!addPicking) return; addPicking = null; els.body.classList.remove('add-picking'); }
function confirmAddDialog() {
  if (!addState || !addGoLabel().ok) return;
  const { type, entity, pick } = addState; closeAddDialog();
  if (type === 'room') return addRoomFromDialog(entity);
  if (pick) { addPicking = { type, entity }; els.body.classList.add('add-picking'); notify('Dotknij plan w miejscu, gdzie ma stanąć element'); return; }
  createAddedElement(type, entity, viewCenterPercent());
}
function addRoomFromDialog(entity) {
  startRoomDrawing(); if (!roomDraft) return;
  if (entity) { roomDraft.entityIds = [entity.entity_id]; roomDraft.name = entity.area || ''; rememberAdded(entity.entity_id); }
}
// "Etykieta" (label) from the Add dialog: a room without a shape, with the same group / icon / name / state options.
// With an entity (the "+" of an entity in Integrations) the label starts with it and the wizard skips the entity step.
function addIconElement([x, y], entity = null) {
  const view = activeSceneView(); if (!view || !editMode) return; view.rooms ||= {};
  const id = 'room_' + uid(), now = new Date().toISOString(), count = Object.values(view.rooms).filter(isIconRoom).length + 1;
  view.rooms[id] = { ...clone(ROOM_DEFAULTS), ...NEW_ROOM_LABEL, labelCardScale:ICON_LABEL_SCALE, kind:'icon', draft:true, id, name: entity?.name || `${translateValue('Etykieta')} ${count}`, entityIds: entity ? [entity.entity_id] : [], points: [], x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, createdAt: now, updatedAt: now };
  if (entity) { rememberAdded(entity.entity_id); refreshStates(); }
  closeEditor(); closeFlowEditor(); closeRoomEditor(); openRoomWizard(id, { skipEntities: !!entity });
}
// Termostat: a label on a climate entity, laid out freely (each part can be moved inside the group or ungrouped).
const THERMO_LAYOUT = { labelIcon:[0,-177], labelName:[0,-131], labelAction:[0,-96], labelDial:[0,0], labelTarget:[0,-18], labelCurrent:[0,25], labelMinus:[-70,90], labelPlus:[70,90], labelModes:[0,146], labelState:[0,184] };
// The default look of a thermostat (a new one, and "Ustaw domyślny" on an existing one).
function thermoLook() {
  const place = Object.fromEntries(Object.entries(THERMO_LAYOUT).flatMap(([k, [fx, fy]]) => [[`${k}FX`, fx], [`${k}FY`, fy]]));
  return { ...NEW_ROOM_LABEL, labelCardScale:.8, labelCardFree:true, labelLinked:true,
    labelIcon:true, labelState:false, labelName:true, labelDial:true, labelTarget:true, labelCurrent:true, labelAction:true, labelMinus:true, labelPlus:true, labelModes:true,
    labelStateBg:false, labelStateBorder:false, labelIconSize:32, labelNameSize:19, labelDialSize:33, labelTargetSize:46, labelTargetWeight:'bold', labelCurrentSize:18, labelActionSize:15, labelModesSize:19,
    labelMinusSize:24, labelMinusBg:true, labelMinusBgColor:'#FFFFFF', labelMinusBgOpacity:.08, labelMinusBorder:true, labelMinusBorderOpacity:.25, labelMinusRadius:40, labelMinusPadding:5,
    labelPlusSize:24, labelPlusBg:true, labelPlusBgColor:'#FFFFFF', labelPlusBgOpacity:.08, labelPlusBorder:true, labelPlusBorderOpacity:.25, labelPlusRadius:40, labelPlusPadding:5,
    labelActionBg:true, labelActionBgOpacity:.4, labelActionRadius:20, labelActionPadding:3, labelCardRadius:26, labelCardPadding:14, tapAction:'more_info', ...place };
}
function addThermostatLabel([x, y], entity) {
  const view = activeSceneView(); if (!view || !editMode || !entity) return; view.rooms ||= {};
  const id = 'room_' + uid(), now = new Date().toISOString();
  view.rooms[id] = { ...clone(ROOM_DEFAULTS), ...thermoLook(), kind:'icon', thermo:true, draft:true, id, name: entity.name || entity.entity_id, entityIds:[entity.entity_id], points:[],
    x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, createdAt: now, updatedAt: now };
  rememberAdded(entity.entity_id); refreshStates();
  closeEditor(); closeFlowEditor(); closeRoomEditor(); openRoomWizard(id, { skipEntities: true });
}
function addTextLabel([x, y]) {
  const view = activeSceneView(); if (!view || !editMode) return; view.rooms ||= {};
  const id = 'room_' + uid(), now = new Date().toISOString(), count = Object.values(view.rooms).filter(isTextRoom).length + 1;
  view.rooms[id] = { ...clone(ROOM_DEFAULTS), ...NEW_ROOM_LABEL, labelCardScale:ICON_LABEL_SCALE, kind:'icon', textEl:true, draft:true, id, name: `${translateValue('Tekst')} ${count}`, entityIds: [], points: [],
    labelIconSource:'mdi', labelIconName:'mdi:gesture-tap-button', labelState:false, textCaption:'', linkAction:'none', tapAction:'none', x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, createdAt: now, updatedAt: now };
  closeEditor(); closeFlowEditor(); closeRoomEditor(); openRoomWizard(id);
}
function createAddedElement(type, entity, [x, y]) {
  const view = activeSceneView(); if (!view || !editMode) return;
  if (type === 'icon') return addIconElement([x, y], entity);
  const now = new Date().toISOString(); if (entity) rememberAdded(entity.entity_id);
  if (type === 'text') { addTextLabel([x, y]); return; }
  if (type === 'thermostat') { addThermostatLabel([x, y], entity); return; }
  if (type === 'flow') {
    const id = 'flow_' + uid(), integration = catalogIntegration(entity); view.flows ||= {};
    view.flows[id] = { id, entityId: entity?.entity_id || '', integrationId: integration.entry_id, integrationName: entity ? integration.title : '', sourceDomain: entity ? (integration.domain || entity.domain) : '', displayName: entity?.name || 'Flow', xPercent:x, yPercent:y, ...clone(FLOW_DEFAULTS), itemSizeV2:true, geometryLocked:false, createdAt:now, updatedAt:now };
    renderMarkers(); renderAdded(); openFlowEditor(id); scheduleSave(true); if (entity) refreshStates();
    notify(entity ? 'Dodano Flow' : 'Dodano Flow — wybierz encję albo zostaw bez encji'); return;
  }
  const integration = catalogIntegration(entity), marker = freshMarker({ entity_id: entity.entity_id, name: entity.name, unit: entity.unit || '' }, { entry_id: integration.entry_id, title: integration.title || 'Home Assistant', domain: integration.domain || entity.domain });
  marker.type = type; marker.style = markerStyleDefaults(type); marker.xPercent = x; marker.yPercent = y;
  if (type === 'icon' && TOGGLE_DOMAINS.includes(entity.domain)) marker.tapAction = 'toggle';
  bringIntoScene(marker); model.entities[marker.id] = marker;
  if (!stateCache[entity.entity_id] && entity.state !== null && entity.state !== undefined) stateCache[entity.entity_id] = { entity_id: entity.entity_id, state: String(entity.state), attributes: { friendly_name: entity.name, unit_of_measurement: entity.unit || undefined, device_class: entity.device_class || undefined } };
  renderMarkers(); renderAdded(); scheduleSave(true); refreshStates(); selectMarker(marker.id);
  notify(`${translateValue('Dodano')}: ${translateValue(ADD_TYPES.find(t => t.key === type)?.label || type)}`);
}
function onAddPickPointer(event) {
  if (!addPicking || !editMode) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const { type, entity } = addPicking, [x, y] = scenePercentAt(event); cancelAddPicking();
  clearTimeout(notify.timer); els.toast.classList.remove('visible'); // the "tap the plan" hint is done
  window.addEventListener('click', swallow => { swallow.preventDefault(); swallow.stopPropagation(); }, { capture:true, once:true });
  createAddedElement(type, entity, [Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
}
function onAddDialogClick(event) {
  const target = event.target;
  if (target === els.addDialog || target.closest('[data-add-close]')) return closeAddDialog();
  const typeButton = target.closest('[data-add-type]');
  if (typeButton && !typeButton.disabled) return chooseAddType(typeButton.dataset.addType);
  if (target.closest('[data-add-back]')) { addState.step = 'type'; addState.entity = null; return renderAddDialog(); }
  const row = target.closest('[data-add-entity]');
  if (row) {
    const id = row.dataset.addEntity; addState.entity = addState.entity?.entity_id === id ? null : (entityCatalog?.entities || []).find(entity => entity.entity_id === id) || null;
    renderAddDialog(); $('.add-body', els.addDialog)?.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }
  if (target.closest('[data-add-clear]')) { addState.entity = null; return renderAddDialog(); }
  const chip = target.closest('[data-add-filter]'); if (chip) { addState.filter = chip.dataset.addFilter; addState.query = ''; $('#add-search', els.addDialog).value = ''; return renderAddDialog(); }
  if (target.closest('[data-add-group]')) { addState.group = addState.group === 'areas' ? 'types' : 'areas'; addState.filter = 'all'; return renderAddDialog(); }
  if (target.closest('#add-go')) return confirmAddDialog();
}
function flowEntityRow(id, action) {
  const name = allEntitiesCache?.find(entity => entity.id === id)?.name || stateCache[id]?.attributes?.friendly_name || id, state = String(stateCache[id]?.state ?? '');
  const button = action === 'clear' ? `<button type="button" class="room-entity-action" data-flow-entity-clear title="${escapeHtml(translateValue('Usuń encję'))}"><i class="mdi mdi-close"></i></button>` : `<button type="button" class="room-entity-action add" data-flow-entity-set="${escapeHtml(id)}"><i class="mdi mdi-check"></i></button>`;
  return `<div class="room-entity${action === 'clear' ? ' added' : ''}"${action === 'set' ? ` data-flow-entity-set="${escapeHtml(id)}"` : ''}><div><strong data-no-i18n>${escapeHtml(name)}</strong><code data-no-i18n>${escapeHtml(id)}${state ? ' · ' + escapeHtml(state) : ''}</code></div>${button}</div>`;
}
function renderFlowEntityResults() {
  const box = $('#flow-entity-results'), input = $('#flow-entity-search'), flow = activeSceneView()?.flows?.[selectedFlowId]; if (!box || !input || !flow) return;
  const query = searchText(input.value); if (query.length < 2) { box.innerHTML = ''; return; }
  if (!allEntitiesCache) { box.innerHTML = ''; loadAllEntities().then(() => { if ($('#flow-entity-search') === input) renderFlowEntityResults(); }); return; }
  const matches = allEntitiesCache.filter(entity => entity.id !== flow.entityId && (searchText(entity.id).includes(query) || searchText(entity.name).includes(query) || searchText(entity.integration).includes(query)))
    .sort((a, b) => Number(/^sensor\./.test(b.id)) - Number(/^sensor\./.test(a.id)) || a.name.localeCompare(b.name)).slice(0, 40);
  box.innerHTML = matches.map(entity => flowEntityRow(entity.id, 'set')).join('');
}
function setFlowEntity(flow, entityId) {
  const previousName = flow.entityId ? (allEntitiesCache?.find(entity => entity.id === flow.entityId)?.name || flow.entityId) : 'Flow';
  const entry = entityId ? allEntitiesCache?.find(entity => entity.id === entityId) : null;
  if (!flow.displayName || flow.displayName === previousName || flow.displayName === 'Flow' || flow.displayName === flow.entityId) flow.displayName = entry?.name || entityId || 'Flow';
  flow.entityId = entityId; flow.integrationName = entry?.integration || ''; flow.sourceDomain = entityId ? entityId.split('.')[0] : ''; flow.integrationId = ''; flow.updatedAt = new Date().toISOString();
  refreshStates(); renderMarkers(); renderAdded(); openFlowEditor(flow.id, openSectionIndex(els.flowEditorContent, flowEditorOpenSectionIndex)); scheduleSave(true);
}
async function addFlow(entityId, entryId) {
  const view = activeSceneView(), integration = integrations.find(x => x.entry_id === entryId), entity = (integrationEntities.get(entryId) || []).find(x => x.entity_id === entityId);
  if (!view || !integration || !entity) return;
  view.flows ||= {};
  const id = 'flow_' + uid();
  const flowOffset = Object.keys(view.flows).length % 5;
  view.flows[id] = { id, entityId, integrationId: integration.entry_id || '', integrationName: integration.title || integration.domain || 'Home Assistant', sourceDomain: integration.domain || entityId.split('.')[0], displayName: entity.name || entityId, xPercent:50 + flowOffset * 3, yPercent:50 + flowOffset * 3, ...clone(FLOW_DEFAULTS), geometryLocked:false, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
  renderMarkers(); renderAdded(); renderIntegrations(); await queueSave(); notify('Dodano Flow — przeciągnij go w trybie edycji');
}
async function removeFlow(id) {
  const view = activeSceneView(); if (!view?.flows?.[id]) return;
  delete view.flows[id]; renderMarkers(); renderAdded(); renderIntegrations(); await queueSave(); notify('Usunięto Flow');
}
// "+" next to an entity in Integrations opens "Add to view" on the plan (edit mode) with that entity already chosen:
// only the kind is picked; a label's wizard then skips its entity step.
async function addEntity(entityId, entryId) {
  const entity = (integrationEntities.get(entryId) || []).find(x => x.entity_id === entityId); if (!entity) return;
  showMainView('overview'); if (!editMode) els.editToggle.click();
  await loadEntityCatalog();
  const known = entityCatalog?.entities?.find(item => item.entity_id === entity.entity_id);
  openAddDialog(known || { entity_id: entity.entity_id, name: entity.name || entity.entity_id, domain: entity.domain || entity.entity_id.split('.')[0], state: entity.state, unit: entity.unit || '' });
}
async function removeMarker(key) {
  const marker = model.entities[key]; if (!marker) return; delete model.entities[key];
  if (!allViewEntityIds().includes(marker.entityId)) delete stateCache[marker.entityId]; if (selectedId === key) closeEditor();
  renderMarkers(); renderIntegrations(); await queueSave(); notify('Usunięto marker i wszystkie jego ustawienia');
}
// Entities of every view: states of neighbouring views are kept fresh for the swipe preview.
function allViewEntityIds() {
  const ids = new Set(Object.values(model.entities || {}).map(marker => marker.entityId).filter(Boolean));
  Object.values(model.views || {}).forEach(view => { Object.values(view.entities || {}).forEach(marker => { if (marker.entityId) ids.add(marker.entityId); }); Object.values(view.flows || {}).forEach(flow => { if (flow.entityId) ids.add(flow.entityId); }); Object.values(view.rooms || {}).forEach(room => { (room.entityIds || []).forEach(id => ids.add(id)); EXTRA_PARTS.forEach(([, k]) => { if (room[k] && room[`${k}Entity`]) ids.add(room[`${k}Entity`]); }); }); if (view.nightBackground || view.sunDim) ids.add(nightEntityOf(view)); });
  return [...ids];
}
async function refreshStates() {
  const ids = allViewEntityIds().filter(id => !isVirtualId(id)); if (!ids.length) return renderMarkers();
  try {
    const data = await api('selected_states', jsonOptions({ entity_ids: ids }));
    Object.entries(data.states || {}).forEach(([entityId, nextState]) => {
      const expected = pendingToggleStates.get(entityId);
      const received = String(nextState?.state || '').toLowerCase();
      if (expected && received !== expected) return;
      if (expected) pendingToggleStates.delete(entityId);
      stateCache[entityId] = { ...stateCache[entityId], ...nextState };
    });
    if (touchGestureActive()) deferredFullRender = true; else renderMarkers();
    applyNightBackground();
    prebuildSwipePreviews();
    if (els.connection) { els.connection.textContent = 'Połączono'; els.connection.className = 'connection live'; }
  } catch (error) { if (els.connection) { els.connection.textContent = 'Błąd danych'; els.connection.className = 'connection error'; } }
}
function connectEvents() {
  entityEvents?.close();
  entityEvents = new EventSource('api/entity_events');
  entityEvents.onopen = () => { if (els.connection) { els.connection.textContent = 'Na żywo'; els.connection.className = 'connection live'; } };
  entityEvents.onmessage = event => { try { const data = JSON.parse(event.data), marker = markerForEntity(data.entity_id), flowUsesEntity = Object.values(activeSceneView()?.flows || {}).some(flow => flow.entityId === data.entity_id); if (!marker && !flowUsesEntity && !allViewEntityIds().includes(data.entity_id)) return; const expected = pendingToggleStates.get(data.entity_id), received = String(data.state || '').toLowerCase(); if (expected && received !== expected) return; if (expected) pendingToggleStates.delete(data.entity_id); renderMarkerState(data.entity_id, { entity_id: data.entity_id, state: data.state, attributes: data.attributes || {}, last_changed: data.last_changed || new Date().toISOString() }); if (flowUsesEntity) { if (touchGestureActive()) deferredFlows = true; else { renderFlows(); if (selectedFlowId) syncFlowSelection(); } } if (roomUsesEntity(data.entity_id)) renderRooms(); if (activeSceneView()?.nightBackground && data.entity_id === nightEntityOf(activeSceneView())) applyNightBackground(); if (sunDimOn(activeSceneView()) && data.entity_id === nightEntityOf(activeSceneView())) { applyBackgroundBrightness(true); syncNightControls(); } } catch {} };
  entityEvents.onerror = () => { if (els.connection) { els.connection.textContent = 'Ponowne łączenie…'; els.connection.className = 'connection error'; } };
  entityEvents.addEventListener('open', refreshStates);
}
function resumeLiveConnection() {
  if (document.hidden || !appRevealed) return;
  checkRemoteLayout();
  clearTimeout(resumeTimer); resumeTimer = setTimeout(() => {
    refreshStates();
    if (!entityEvents || entityEvents.readyState === EventSource.CLOSED) connectEvents();
  }, 120);
}
// ---- Night background -----------------------------------------------------------------------
// A view may have a second image for the night. It lies exactly over the day image (same size and fit: the
// geometry always comes from the day image) and fades in when the chosen entity says it is night:
// sun.sun below_horizon by default, or any on/off entity (input_boolean, binary_sensor …) that is on.
// view.nightMode: 'auto' (entity, default), 'day' (always day) or 'night' (always night); saved with the view.
const NIGHT_STATES = new Set(['below_horizon','on','true','night']);
function nightEntityOf(view) { return String(view?.nightEntity || '').trim() || 'sun.sun'; }
function nightModeOf(view) { return ['day','night'].includes(view?.nightMode) ? view.nightMode : 'auto'; }
function nightByEntity(view) { return NIGHT_STATES.has(String(stateCache[nightEntityOf(view)]?.state ?? '').toLowerCase()); }
function viewIsNight(view) {
  if (!view?.nightBackground || !view.background) return false;
  const mode = nightModeOf(view); if (mode !== 'auto') return mode === 'night';
  return nightByEntity(view);
}
// instant: entering a view (tab, swipe, start) shows the right image at once; the crossfade is only for
// day <-> night changes while the view is open.
function applyNightBackground(instant = false) {
  const view = activeSceneView(), img = els.nightImage; if (!img) return;
  if (instant) { img.classList.add('instant'); clearTimeout(img.__instantTimer); img.__instantTimer = setTimeout(() => img.classList.remove('instant'), 120); }
  const name = view?.nightBackground && currentBackground ? view.nightBackground : '';
  if (!name) { img.classList.remove('visible'); img.hidden = true; img.removeAttribute('src'); delete img.dataset.name; }
  else {
    if (img.dataset.name !== name) { img.dataset.name = name; img.src = `api/background/file?name=${encodeURIComponent(name)}`; }
    if (img.hidden) { img.hidden = false; void img.offsetWidth; }
    img.classList.toggle('visible', viewIsNight(view));
  }
  syncNightControls(); applyBackgroundBrightness();
}
// Resolves once a visible night image is decoded (at most 1.5 s), so a view never shows its day image first.
function nightImageReady() {
  const img = els.nightImage; if (!img || img.hidden || !img.classList.contains('visible') || !img.getAttribute('src')) return Promise.resolve();
  return withTimeout(img.decode ? img.decode() : new Promise(resolve => { if (img.complete) resolve(); else img.addEventListener('load', resolve, { once:true }); }), 1500);
}
function syncNightControls() {
  const view = activeSceneView(), block = $('.night-bg-block'); if (!block || !view) return;
  const has = Boolean((view.nightBackground || sunDimOn(view)) && currentBackground), entity = nightEntityOf(view), state = stateCache[entity]?.state;
  block.classList.toggle('off', !has);
  const input = $('#night-entity'); if (input && document.activeElement !== input) input.value = view.nightEntity || '';
  const mode = nightModeOf(view); $$('[data-night-mode]').forEach(button => { button.disabled = !has; button.classList.toggle('active', has && button.dataset.nightMode === mode); button.setAttribute('aria-pressed', String(has && button.dataset.nightMode === mode)); });
  const entityRow = $('.night-bg-entity'); if (entityRow) entityRow.classList.toggle('muted', mode !== 'auto');
  const elevation = sunElevation(view), dimText = sunDimOn(view) && mode === 'auto' ? `${translateValue('Ściemnienie')}: ${Math.round(dimFactor(view) * 100)}%${elevation !== null ? ` · ${translateValue('słońce')} ${elevation.toFixed(1)}°` : ` · ${entity}: ${state ?? '—'}`}` : '';
  const status = $('#night-status'); if (status) status.textContent = !currentBackground ? translateValue('Najpierw ustaw tło dzienne') : !has ? '' : dimText ? dimText : (mode === 'auto' ? `${translateValue(nightByEntity(view) ? 'Teraz: noc' : 'Teraz: dzień')} · ${entity}: ${state ?? '—'}` : translateValue(mode === 'night' ? 'Zawsze noc — encja nie jest używana' : 'Zawsze dzień — encja nie jest używana'));
}
function setNightMode(mode) { const view = activeSceneView(); if (!view) return; if (mode === 'auto') delete view.nightMode; else view.nightMode = mode; applyNightBackground(); scheduleSave(true); prebuildSwipePreviews(); }
async function uploadNightBackground(file) {
  if (!file) return; const status = $('#night-status'); if (status) status.textContent = translateValue('Wgrywanie…'); const form = new FormData(); form.append('file', file);
  try { const result = await api('background/upload', { method: 'POST', body: form }); activeSceneView().nightBackground = result.name || ''; await loadBackgrounds(); scheduleSave(true); refreshStates(); notify('Ustawiono tło nocne'); }
  catch (error) { if (status) status.textContent = `${translateValue('Błąd')}: ${error.message}`; } finally { const input = $('#night-background-file'); if (input) input.value = ''; }
}
// ---- Background files manager -------------------------------------------------------------------
// Lists every uploaded image with where it is used (day / night background of beta views, and the stable
// add-on, which shares the folder). Unused files can be removed one by one or all at once. Files the stable
// add-on uses cannot be removed here (the server refuses it too).
// bgStableUsage = backgrounds of the OTHER add-on (stable for the beta, beta for the stable), bgOtherChannel says which.
let bgManagerItems = [], bgStableUsage = {}, bgOtherChannel = 'stable';
const otherVersionName = () => translateValue(bgOtherChannel === 'beta' ? 'HA Views Beta' : 'stabilna wersja HA Views');
function filesWord(n) { const tens = n % 100, ones = n % 10; return n === 1 ? 'plik' : ones >= 2 && ones <= 4 && !(tens >= 12 && tens <= 14) ? 'pliki' : 'plików'; }
function formatBytes(bytes) { const n = Number(bytes) || 0; return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`; }
function backgroundUses(name) {
  const uses = [];
  Object.values(model.views || {}).forEach(view => { const label = view.name || view.id; if (view.background === name) uses.push({ kind:'day', label }); if (view.nightBackground === name) uses.push({ kind:'night', label }); });
  (bgStableUsage[name] || []).forEach(label => uses.push({ kind:'stable', label }));
  return uses;
}
function renderBackgroundManager() {
  const list = $('#bg-manager-list'); if (!list) return;
  const unused = bgManagerItems.filter(item => !backgroundUses(item.name).length), total = bgManagerItems.reduce((sum, item) => sum + (Number(item.size) || 0), 0);
  $('#bg-manager-summary').textContent = `${bgManagerItems.length} ${translateValue(filesWord(bgManagerItems.length))} · ${formatBytes(total)} · ${translateValue('nieużywane')}: ${unused.length}`;
  const clean = $('#bg-manager-clean'); if (clean) clean.disabled = !unused.length;
  const chip = use => `<span class="${use.kind}">${escapeHtml(use.kind === 'stable' ? `${translateValue(bgOtherChannel === 'beta' ? 'Beta' : 'Stabilna')}: ${use.label}` : `${use.label} · ${translateValue(use.kind === 'night' ? 'noc' : 'dzień')}`)}</span>`;
  list.innerHTML = bgManagerItems.length ? bgManagerItems.map(item => {
    const uses = backgroundUses(item.name), stable = uses.some(use => use.kind === 'stable');
    const view = activeSceneView(), isDay = view?.background === item.name, isNight = view?.nightBackground === item.name, n = escapeHtml(item.name);
    const action = (kind, icon, title, extra = '') => `<button type="button" data-bg-action="${kind}" data-name="${n}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}" ${extra}><i class="mdi ${icon}"></i></button>`;
    return `<div class="bg-file${uses.length ? '' : ' unused'}"><div class="bg-thumb"><img loading="lazy" alt="" src="api/background/file?name=${encodeURIComponent(item.name)}"></div><div class="bg-info"><strong data-no-i18n title="${n}">${n}</strong><small>${formatBytes(item.size)}</small><div class="bg-uses" data-no-i18n>${uses.length ? uses.map(chip).join('') : `<span class="none">${escapeHtml(translateValue('Nieużywane'))}</span>`}</div></div>`
      + `<div class="bg-actions">${action('day', 'mdi-image-check-outline', isDay ? 'Tło tego widoku' : 'Ustaw jako tło tego widoku', isDay ? 'class="current" disabled' : '')}${action('night', 'mdi-weather-night', isNight ? 'Tło nocne tego widoku' : 'Ustaw jako tło nocne tego widoku', isNight || isDay || !view?.background ? `${isNight ? 'class="current"' : ''} disabled` : '')}${action('rename', 'mdi-rename-outline', 'Zmień nazwę')}${action('download', 'mdi-download-outline', 'Pobierz')}`
      + `<button type="button" class="${stable ? 'stable-delete' : ''}" data-bg-delete="${n}" title="${escapeHtml((stable ? `${translateValue('Używane przez')}: ${otherVersionName()}` : translateValue('Usuń plik')))}" aria-label="${escapeHtml(translateValue('Usuń plik'))}"><i class="mdi mdi-delete-outline"></i></button></div></div>`;
  }).join('') : `<small>${escapeHtml(translateValue('Brak wgranych teł.'))}</small>`;
}
async function openBackgroundManager() {
  const box = $('#bg-manager'); if (!box) return;
  box.classList.add('visible'); box.setAttribute('aria-hidden', 'false'); $('#bg-manager-list').innerHTML = `<small>${escapeHtml(translateValue('Wczytywanie…'))}</small>`;
  try { const [list, usage] = await Promise.all([api('backgrounds'), api('background/usage').catch(() => ({}))]); bgManagerItems = list.items || []; bgStableUsage = usage.other || usage.stable || {}; bgOtherChannel = usage.otherChannel || 'stable'; renderBackgroundManager(); }
  catch (error) { $('#bg-manager-list').innerHTML = `<small>${escapeHtml(error.message)}</small>`; }
}
function closeBackgroundManager() { const box = $('#bg-manager'); if (!box) return; box.classList.remove('visible'); box.setAttribute('aria-hidden', 'true'); }
async function deleteBackgroundFiles(names, onlyUnused = false) {
  // Bulk clean-up never touches files of the stable add-on; a single file may be removed after a warning.
  if (onlyUnused) names = names.filter(name => !(bgStableUsage[name] || []).length); if (!names.length) return;
  const usedIn = [...new Set(names.flatMap(name => backgroundUses(name).filter(use => use.kind !== 'stable').map(use => use.label)))];
  const stableIn = [...new Set(names.flatMap(name => bgStableUsage[name] || []))], force = stableIn.length > 0;
  const message = names.length === 1
    ? [force ? `Plik „${names[0]}” jest tłem w innej wersji dodatku: ${otherVersionName()} (widoki: ${stableIn.join(', ')}). Po usunięciu te widoki zostaną tam bez tła.` : '', usedIn.length ? `W becie jest ustawiony w widokach: ${usedIn.join(', ')}. Te widoki zostaną bez tego tła.` : '', !force && !usedIn.length ? `Plik „${names[0]}” zostanie trwale usunięty.` : 'Tego nie da się cofnąć.'].filter(Boolean).join(' ')
    : `${names.length} nieużywanych plików zostanie trwale usuniętych.`;
  if (!await appConfirm({ title: force ? 'Usunąć tło używane przez drugą wersję?' : names.length === 1 ? 'Usunąć plik tła?' : 'Usunąć nieużywane tła?', message, confirmText: force ? 'Usuń mimo to' : 'Usuń', danger:true })) return;
  let removed = 0; const errors = [];
  for (const name of names) {
    try { await api('background/delete', jsonOptions(force ? { name, force:true } : { name })); removed++; delete bgStableUsage[name]; bgManagerItems = bgManagerItems.filter(item => item.name !== name);
      Object.values(model.views || {}).forEach(view => { if (view.background === name) view.background = ''; if (view.nightBackground === name) view.nightBackground = ''; if (view.backgroundTransforms) delete view.backgroundTransforms[name]; }); }
    catch (error) { errors.push(`${name}: ${error.message}`); }
  }
  if (removed) { currentBackground = ''; scheduleSave(true); await loadBackgrounds(); }
  renderBackgroundManager();
  notify(errors.length ? errors[0] : removed === 1 ? 'Usunięto plik tła' : `Usunięto pliki tła: ${removed}`, Boolean(errors.length));
}
function downloadBackgroundFile(name) { if (!name) return; const link = document.createElement('a'); link.href = `api/background/download?name=${encodeURIComponent(name)}`; link.download = name; document.body.appendChild(link); link.click(); link.remove(); }
async function backgroundFileAction(kind, name) {
  const view = activeSceneView(); if (!view || !name) return;
  if (kind === 'download') return downloadBackgroundFile(name);
  if (kind === 'rename') return renameBackgroundFile(name);
  if (kind === 'day') { view.background = name; view.backgroundColor = ''; view.onboardingDone = true; if (view.nightBackground === name) view.nightBackground = ''; }
  if (kind === 'night') { if (!view.background || view.background === name) return; view.nightBackground = name; }
  scheduleSave(true); await loadBackgrounds(true); refreshStates(); renderBackgroundManager(); notify(kind === 'day' ? 'Ustawiono tło widoku' : 'Ustawiono tło nocne');
}
// Renames the image file on the server and every reference to it in the beta views (day / night / fit).
async function renameBackgroundFile(name) {
  if (!name) return;
  if (!Object.keys(bgStableUsage).length) { try { const usage = await api('background/usage'); bgStableUsage = usage.other || usage.stable || {}; bgOtherChannel = usage.otherChannel || 'stable'; } catch {} }
  const stem = name.replace(/\.[^.]+$/, ''), stableIn = bgStableUsage[name] || [];
  els.confirmInput.maxLength = 150;
  const value = await appPrompt({ title:'Zmień nazwę pliku tła', message:`${name} — rozszerzenie pliku zostaje bez zmian.`, value:stem, confirmText:'Zmień' });
  els.confirmInput.maxLength = 60;
  const wanted = String(value || '').trim(); if (!wanted || wanted === stem) return;
  if (stableIn.length && !await appConfirm({ title:'Zmienić nazwę tła używanego przez drugą wersję?', message:`Plik „${name}” jest tłem w innej wersji dodatku: ${otherVersionName()} (widoki: ${stableIn.join(', ')}). Po zmianie nazwy te widoki zostaną tam bez tła.`, confirmText:'Zmień mimo to', danger:true })) return;
  try {
    const result = await api('background/rename', jsonOptions(stableIn.length ? { name, newName:wanted, force:true } : { name, newName:wanted })), next = result.name;
    Object.values(model.views || {}).forEach(view => {
      if (view.background === name) view.background = next; if (view.nightBackground === name) view.nightBackground = next;
      if (view.backgroundTransforms?.[name]) { view.backgroundTransforms[next] = view.backgroundTransforms[name]; delete view.backgroundTransforms[name]; }
    });
    bgManagerItems = bgManagerItems.map(item => item.name === name ? { ...item, name:next } : item); delete bgStableUsage[name];
    scheduleSave(true); await loadBackgrounds(); renderBackgroundManager(); notify('Zmieniono nazwę tła');
  } catch (error) { notify(error.message, true); }
}
// ---- Background brightness (day / night image) ----------------------------------------------------
// A CSS brightness filter on the <img> only: the browser rasterises the image once on the GPU, so markers,
// Flows and animations above it are not slowed down. 100 % = unchanged (no filter at all).
function brightnessOf(view, key) { return clamp(Math.round(Number(view?.[key]) || 100), 30, 200); }
function brightnessFilter(value) { return value === 100 ? '' : `brightness(${value / 100})`; }
// ---- Dimming one background by the sun ---------------------------------------------------------
// Without a night image, a view can darken its background with the sun: full brightness while the sun is above
// "dimFrom" degrees, the night level below "dimTo" degrees, linear in between (dusk / dawn), from sun.sun's
// "elevation" (Home Assistant updates it every few minutes). Optional cool tint at night. The mode buttons work as
// for a night image: Auto follows the sun, Always day / Always night fix it. Another entity (on = night) dims fully.
const SUN_DIM_DEFAULTS = Object.freeze({ dimNight:45, dimFrom:6, dimTo:-6 });
function sunDimValue(view, key) { const v = Number(view?.[key]); return Number.isFinite(v) ? v : SUN_DIM_DEFAULTS[key]; }
function sunDimTint(view, f = dimFactor(view)) { return sunDimOn(view) && view.dimCool !== false ? (.38 * f).toFixed(3) : '0'; }
function sunDimOn(view) { return Boolean(view?.sunDim && view.background && !view.nightBackground); }
function sunElevation(view) { const v = Number(stateCache[nightEntityOf(view)]?.attributes?.elevation); return Number.isFinite(v) ? v : null; }
function dimFactor(view) {
  if (!sunDimOn(view)) return 0;
  const mode = nightModeOf(view); if (mode === 'night') return 1; if (mode === 'day') return 0;
  const elevation = sunElevation(view), from = sunDimValue(view, 'dimFrom'), to = sunDimValue(view, 'dimTo');
  if (elevation === null) return nightByEntity(view) ? 1 : 0;
  if (from <= to) return elevation <= to ? 1 : 0;
  return clamp((from - elevation) / (from - to), 0, 1);
}
function dayImageFilter(view) {
  const base = brightnessOf(view, 'backgroundBrightness'), f = dimFactor(view);
  if (!f) return brightnessFilter(base);
  const value = base + (sunDimValue(view, 'dimNight') - base) * f, cool = view.dimCool !== false;
  return `brightness(${(value / 100).toFixed(3)})${cool ? ` saturate(${(1 - .35 * f).toFixed(3)})` : ''}`;
}
function applyBackgroundBrightness(animate = false) {
  const view = activeSceneView();
  // Only a live sun change fades; entering a view or moving a slider sets the final look at once (no fade from full brightness).
  const tint = $('#scene-dim-tint'), f = dimFactor(view);
  if (els.image) { els.image.style.transition = animate ? 'filter 2.5s linear' : 'none'; els.image.style.filter = dayImageFilter(view); }
  if (tint) { tint.style.transition = animate ? 'opacity 2.5s linear' : 'none'; tint.style.opacity = sunDimTint(view, f); }
  if (!animate && els.image) { void els.image.offsetWidth; els.image.style.transition = ''; }
  syncSunDimControls(view, f);
  if (els.nightImage) els.nightImage.style.filter = brightnessFilter(brightnessOf(view, 'nightBrightness'));
  [['backgroundBrightness', Boolean(currentBackground)], ['nightBrightness', Boolean(view?.nightBackground && currentBackground)]].forEach(([key, enabled]) => {
    const input = $(`[data-brightness="${key}"]`); if (!input) return;
    const value = brightnessOf(view, key); if (document.activeElement !== input) input.value = value;
    input.disabled = !enabled; const row = input.closest('.vm-range'); row?.classList.toggle('disabled', !enabled);
    const out = row?.querySelector('output'); if (out) out.textContent = `${value}%`;
  });
}
function syncSunDimControls(view = activeSceneView(), f = dimFactor(view)) {
  const block = $('.sun-dim-block'); if (!block || !view) return;
  block.hidden = Boolean(view.nightBackground) || !currentBackground;
  const toggle = $('#sun-dim-toggle'); if (toggle) toggle.checked = Boolean(view.sunDim);
  block.classList.toggle('on', Boolean(view.sunDim));
  $$('[data-sundim]', block).forEach(input => { const key = input.dataset.sundim, value = sunDimValue(view, key); if (document.activeElement !== input) input.value = value; const out = $(`[data-sundim-out="${key}"]`, block); if (out) out.textContent = key === 'dimNight' ? `${value}%` : `${value}°`; });
  const cool = $('[data-sundim-cool]', block); if (cool) cool.checked = view.dimCool !== false;
}
function setSunDim(key, value, save) {
  const view = activeSceneView(); if (!view) return;
  if (key === 'sunDim') { if (value) view.sunDim = true; else delete view.sunDim; }
  else if (key === 'dimCool') { if (value) delete view.dimCool; else view.dimCool = false; }
  else {
    value = Math.round(Number(value)); if (!Number.isFinite(value)) return;
    const put = (k, v) => { if (v === SUN_DIM_DEFAULTS[k]) delete view[k]; else view[k] = v; };
    // The start of dimming must stay above full night: moving one slider past the other pushes the other one along.
    if (key === 'dimFrom' && value <= sunDimValue(view, 'dimTo')) put('dimTo', value - 1);
    if (key === 'dimTo' && value >= sunDimValue(view, 'dimFrom')) put('dimFrom', value + 1);
    put(key, value);
  }
  applyBackgroundBrightness(); syncNightControls();
  if (save) { scheduleSave(true); refreshStates(); prebuildSwipePreviews(); }
}
function setBackgroundBrightness(key, value, save) {
  const view = activeSceneView(); if (!view) return;
  value = clamp(Math.round(Number(value) || 100), 30, 200);
  if (value === 100) delete view[key]; else view[key] = value;
  applyBackgroundBrightness(); if (save) { scheduleSave(true); prebuildSwipePreviews(); }
}
// ---- Colour background size -------------------------------------------------------------------
// A colour background has its own size (W × H, only the proportion matters on screen): typical presets,
// own numbers, or dragging the circles on the scene edges. An image background always uses the image size.
function canvasSizeOf(view = activeSceneView()) {
  const size = view?.solidCanvasSize, ratio = clamp(view?.solidCanvasRatio || 16 / 9, .25, 4);
  if (size && Number(size.w) > 0 && Number(size.h) > 0 && Math.abs(size.w / size.h - ratio) < .01) return { w: Math.round(size.w), h: Math.round(size.h) };
  return ratio >= 1 ? { w: Math.round(1080 * ratio), h: 1080 } : { w: 1080, h: Math.round(1080 / ratio) };
}
function syncCanvasControls() {
  const view = activeSceneView(); if (!view) return;
  const { w, h } = canvasSizeOf(view), image = Boolean(currentBackground), zone = $('.vm-colour-zone');
  zone?.classList.toggle('image-active', image);
  const note = $('.vm-colour-note'); if (note) note.textContent = translateValue(image ? 'Wybór koloru zastąpi obraz' : 'Tło w kolorze');
  $$('[data-canvas-size]').forEach(button => { const [pw, ph] = button.dataset.canvasSize.split('x').map(Number); button.classList.toggle('active', !image && Math.abs(w / h - pw / ph) < .005); button.disabled = image; });
  const wi = $('#canvas-width'), hi = $('#canvas-height');
  if (wi && document.activeElement !== wi) wi.value = w; if (hi && document.activeElement !== hi) hi.value = h;
  [wi, hi, $('#canvas-resize-start')].forEach(control => { if (control) control.disabled = image; });
  const value = $('#canvas-resize-value'); if (value) value.textContent = `${w} × ${h}`;
}
function setCanvasSize(w, h, save = true) {
  const view = activeSceneView(); if (!view || currentBackground) return;
  w = clamp(Math.round(Number(w) || 0), 100, 10000); h = clamp(Math.round(Number(h) || 0), 100, 10000);
  if (w / h > 4) w = h * 4; if (w / h < .25) h = w * 4;
  view.solidCanvasSize = { w, h }; view.solidCanvasRatio = w / h;
  applyBackgroundTransform(); updateSceneGeometry(); syncCanvasControls(); renderCanvasHandles();
  if (save) scheduleSave(true);
}
let canvasResizing = false;
function renderCanvasHandles() {
  let layer = $('#canvas-handles');
  if (!canvasResizing) { layer?.remove(); return; }
  if (!layer) { layer = document.createElement('div'); layer.id = 'canvas-handles'; layer.innerHTML = ['e','s','se'].map(k => `<i class="canvas-handle ${k}" data-canvas-handle="${k}"></i>`).join(''); els.scene.append(layer); layer.addEventListener('pointerdown', startCanvasHandleDrag); }
}
function startCanvasResize() {
  if (currentBackground) return;
  closeCompactMenus(); resetViewZoom(); canvasResizing = true; els.body.classList.add('canvas-resizing');
  $('#canvas-resize-bar')?.classList.add('visible'); renderCanvasHandles(); syncCanvasControls();
}
function finishCanvasResize() {
  canvasResizing = false; els.body.classList.remove('canvas-resizing'); $('#canvas-resize-bar')?.classList.remove('visible'); renderCanvasHandles(); scheduleSave(true);
  placeViewSheet(); els.viewSwitcher?.classList.add('open'); els.viewManage?.classList.add('active'); setViewMenuPage('background');
}
function startCanvasHandleDrag(event) {
  const handle = event.target.closest('[data-canvas-handle]'); if (!handle) return;
  event.preventDefault(); event.stopPropagation(); try { els.scene.setPointerCapture(event.pointerId); } catch {}
  // Measured from the moment the circle is grabbed (a refit scene never feeds back into the drag).
  // The canvas is centred, so dragging the right edge by d px widens it by 2·d; the top edge stays.
  const kind = handle.dataset.canvasHandle, start = canvasSizeOf(), rect = els.scene.getBoundingClientRect();
  const move = e => {
    if (e.pointerId !== event.pointerId) return;
    const w = kind === 's' ? start.w : start.w * Math.max(40, rect.width + 2 * (e.clientX - event.clientX)) / Math.max(1, rect.width);
    const h = kind === 'e' ? start.h : start.h * Math.max(40, rect.height + (e.clientY - event.clientY)) / Math.max(1, rect.height);
    setCanvasSize(Math.round(w / 10) * 10, Math.round(h / 10) * 10, false);
  };
  const up = e => { if (e.pointerId !== event.pointerId) return; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); scheduleSave(true); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
}
async function loadBackgrounds(waitForImage = false, bustCache = false, prefetched = null, imageTimeout = 0) {
  try {
    const data = prefetched ? await prefetched : await api('backgrounds');
    if (data instanceof Error) throw data;
    const items = data.items || [], names = new Set(items.map(item => item.name)), view = activeSceneView();
    if (view.background === undefined || view.background === null) { view.background = data.current || ''; scheduleSave(); }
    if (view.background && !names.has(view.background)) view.background = '';
    currentBackground = view.background || '';
    // Each view loads its own named file; no global background selection is needed.
    els.bgSelect.innerHTML = '<option value="">Bez tła</option>' + items.map(x => `<option value="${escapeHtml(x.name)}" ${x.name === currentBackground ? 'selected' : ''}>${escapeHtml(x.name)}</option>`).join('');
    els.bgSelect.value = currentBackground; els.bgSelect.disabled = false; els.bgDownload.disabled = !currentBackground; const renameButton = $('#background-rename'); if (renameButton) renameButton.disabled = !currentBackground;
    if (view.nightBackground && !names.has(view.nightBackground)) view.nightBackground = '';
    const nightSelect = $('#night-background-select');
    if (nightSelect) { nightSelect.innerHTML = `<option value="">${escapeHtml(translateValue('Bez tła nocnego'))}</option>` + items.filter(x => x.name !== currentBackground).map(x => `<option value="${escapeHtml(x.name)}">${escapeHtml(x.name)}</option>`).join(''); nightSelect.value = view.nightBackground || ''; }
    if (els.emptyBackgroundSelect) {
      els.emptyBackgroundSelect.innerHTML = '<option value="">Wybierz istniejące tło…</option>' + items.map(x => `<option value="${escapeHtml(x.name)}">${escapeHtml(x.name)}</option>`).join('');
      els.emptyBackgroundSelect.disabled = !items.length;
    }
    view.solidCanvasRatio ||= mobileView() ? 9 / 16 : 16 / 9; syncCanvasControls();
    if (els.solidCanvasRatio) els.solidCanvasRatio.value = String([1.7777777778,1.3333333333,1,.5625].reduce((best, ratio) => Math.abs(ratio - view.solidCanvasRatio) < Math.abs(best - view.solidCanvasRatio) ? ratio : best, 1.7777777778));
    applyBackgroundColour(); updateEmptyState(); els.image.hidden = !currentBackground; syncBackgroundTransformControls();
    if (currentBackground) {
      applyBackgroundTransform(); applyBackgroundBrightness();
      const cacheKey = bustCache ? `&v=${Date.now()}` : '', src = `api/background/file?name=${encodeURIComponent(currentBackground)}${cacheKey}`;
      const ready = els.image.dataset.backgroundName === currentBackground && els.image.complete && els.image.naturalWidth > 0 && !bustCache;
      if (!ready) {
        const loaded = new Promise(resolve => {
          const done = () => { els.image.removeEventListener('load', done); els.image.removeEventListener('error', done); resolve(); };
          els.image.addEventListener('load', done, { once:true }); els.image.addEventListener('error', done, { once:true });
        });
        els.image.dataset.backgroundName = currentBackground; els.image.src = src;
        if (waitForImage) await (imageTimeout > 0 ? Promise.race([loaded, new Promise(resolve => setTimeout(resolve, imageTimeout))]) : loaded);
      }
    } else { els.image.removeAttribute('src'); delete els.image.dataset.backgroundName; applyBackgroundTransform(); updateSceneGeometry(); }
    applyNightBackground(true); applyBackgroundBrightness();
  } catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; }
}
async function uploadBackground(file) {
  if (!file) return; els.bgStatus.textContent = 'Wgrywanie…'; els.bgUploadProgress?.classList.add('visible'); const form = new FormData(); form.append('file', file);
  try { const result = await api('background/upload', { method: 'POST', body: form }); const view = activeSceneView(); view.background = result.name || null; view.backgroundColor = ''; view.onboardingDone = true; els.bgStatus.textContent = 'Wgrano'; await loadBackgrounds(true, true); scheduleSave(true); }
  catch (error) { els.bgStatus.textContent = `Błąd: ${error.message}`; } finally { els.bgFile.value = ''; els.bgUploadProgress?.classList.remove('visible'); }
}

function resetViewportPointers() {
  for (const pointerId of viewPointers.keys()) {
    try { if (els.scene?.hasPointerCapture?.(pointerId)) els.scene.releasePointerCapture(pointerId); } catch {}
  }
  viewPointers.clear(); panGesture = null; pinchGesture = null; setGestureLayer(false);
}
// The plan becomes a separate GPU layer (will-change) when a finger touches it. Every switch on / off re-draws the
// whole plan and can blink for a frame, so after a plain pan (same zoom) the layer is kept. It is dropped only when
// it would be stale: the zoom changed (the layer is drawn at the old scale, i.e. blurred), the window was resized or
// a text field took the on-screen keyboard (a huge layer is re-drawn late then, showing blank tiles).
let gestureLayerTimer = 0, gestureLayerZoom = null;
const TEXT_FIELD = 'input:not([type=range]):not([type=checkbox]):not([type=color]),textarea,[contenteditable]';
function textFieldFocused() { return !!document.activeElement?.matches?.(TEXT_FIELD); }
function dropGestureLayer() { clearTimeout(gestureLayerTimer); if (!viewPointers.size) { els.scene?.classList.remove('gesture-layer'); gestureLayerZoom = null; } }
function setGestureLayer(on) {
  clearTimeout(gestureLayerTimer);
  if (on) {
    // A new touch on a card standing still ends a pending cube-turn state now (still frame) rather than mid-pan.
    if (els.sceneCard && !els.sceneCard.style.transform && els.sceneCard.classList.contains('cube-turning')) { clearTimeout(positionSwipe.calm); els.sceneCard.classList.remove('cube-turning'); }
    if (!els.scene.classList.contains('gesture-layer')) gestureLayerZoom = viewZoom; els.scene.classList.add('gesture-layer');
  }
  else gestureLayerTimer = setTimeout(() => { if (!viewPointers.size && (gestureLayerZoom == null || Math.abs(viewZoom - gestureLayerZoom) > .001)) dropGestureLayer(); }, 350);
}
function viewportPointerDown(event) {
  // Desktop uses a dedicated mouse drag below. Pointer gestures are touch-only there.
  if (!sceneCameraActive() || (!mobileView() && event.pointerType === 'mouse') || (event.pointerType === 'mouse' && event.button !== 0)) return;
  // A new primary touch after an interrupted WebView gesture means every remembered pointer is stale.
  // A gesture whose release never arrived (card left between two views) is taken over by the new finger.
  const hanging = viewSwipe && viewSwipe.id !== event.pointerId && viewSwipe.tracking && !viewSwipe.fromPan && !swipeBusy ? viewSwipe : null;
  if (hanging) { cancelAnimationFrame(hanging.frame); viewSwipe = null; }
  if ((event.pointerType === 'mouse') || (event.pointerType === 'touch' && event.isPrimary && viewPointers.size && !viewPointers.has(event.pointerId))) resetViewportPointers();
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY }); lastPointerActivity = performance.now();
  // The plan's own GPU layer only when the touch can move it (pan / pinch). At 100% a single finger cannot pan, and a
  // layer created at the touch was dropped again by the cube turn's first frame (the card showed one tile of the plan).
  if ((viewPointers.size > 1 && !viewZoomLocked()) || Math.abs(viewZoom - minViewZoom()) > .001 || mobileWidePanorama()) setGestureLayer(true);
  if (!swipeBusy && !viewSwipe && !hanging) resetStuckSwipe(false);
  viewSwipe = mobileView() && !editMode && viewTransitionMode() !== 'off' && event.pointerType !== 'mouse' && viewPointers.size === 1 && model.viewOrder.length > 1 ? { id:event.pointerId, x:event.clientX, y:event.clientY, t:Date.now(), panX:viewPanX, target:event.target, start:performance.now(), lastMove:performance.now() } : null;
  if (hanging && viewSwipe && swipePreview) { const carry = hanging.lastDx || 0; Object.assign(viewSwipe, { x:event.clientX - carry, tracking:true, direction:hanging.direction, lastDx:carry, maxDx:Math.abs(carry) }); swipeLog(`przejęcie zawieszonego gestu (${Math.round(carry)} px)`); }
  else if (hanging && !viewSwipe) settleBack(hanging.direction || 1, 180);
  if (viewPointers.size === 2 && viewZoomLocked()) { panGesture = null; event.preventDefault(); }
  else if (viewPointers.size === 2) {
    const [a,b] = [...viewPointers.values()], r = els.viewport.getBoundingClientRect();
    pinchGesture = { distance:Math.hypot(a.x-b.x,a.y-b.y), zoom:viewZoom, panX:viewPanX, panY:viewPanY, x:(a.x+b.x)/2-r.left, y:(a.y+b.y)/2-r.top };
    panGesture = null; event.preventDefault();
  } else {
    const marker = event.target.closest('.marker');
    const canPan = Math.abs(viewZoom - minViewZoom()) > .001 || mobileWidePanorama();
    // In viewing mode a drag beginning on a marker is still a panorama; only a short tap opens More Info.
    if (canPan && (!editMode || !marker)) {
      panGesture = { id:event.pointerId, x:event.clientX, y:event.clientY, panX:viewPanX, panY:viewPanY, marker, moved:false };
      try { els.scene.setPointerCapture?.(event.pointerId); } catch {}
    }
  }
}
function viewportPointerMove(event) {
  lastPointerActivity = performance.now();
  // The view swipe follows its own pointer even if the pan/pinch pointer list was reset meanwhile.
  if (viewSwipe?.id === event.pointerId && !viewPointers.has(event.pointerId)) { viewSwipe.lastX = event.clientX; viewSwipe.lastY = event.clientY; viewSwipe.lastMove = performance.now(); trackViewSwipe(event); return; }
  if (!viewPointers.has(event.pointerId)) return;
  if (viewPointers.size > 1 && viewSwipe) { if (viewSwipe.tracking) { const d = viewSwipe.direction || 1; viewSwipe = null; settleBack(d); } viewSwipe = null; }
  if (viewSwipe?.id === event.pointerId) { viewSwipe.lastX = event.clientX; viewSwipe.lastY = event.clientY; viewSwipe.lastMove = performance.now(); }
  if (viewSwipe?.id === event.pointerId && !panGesture && !pinchGesture) trackViewSwipe(event);
  viewPointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
  if (viewPointers.size === 2 && pinchGesture) {
    const [a,b] = [...viewPointers.values()], distance = Math.hypot(a.x-b.x,a.y-b.y), next = clamp(pinchGesture.zoom * distance / Math.max(1,pinchGesture.distance),zoomFloor(),4), ratio = next / pinchGesture.zoom;
    viewZoom = next; viewPanX = pinchGesture.x - (pinchGesture.x-pinchGesture.panX)*ratio; viewPanY = pinchGesture.y - (pinchGesture.y-pinchGesture.panY)*ratio; applyViewTransform(); event.preventDefault();
  } else if (panGesture?.id === event.pointerId) {
    const dx = event.clientX - panGesture.x, dy = event.clientY - panGesture.y;
    if (Math.hypot(dx, dy) > 6) { panGesture.moved = true; if (panGesture.marker) panGesture.marker.dataset.dragged = '1'; }
    const wantedPanX = panGesture.panX + dx;
    viewPanX = wantedPanX; viewPanY = panGesture.panY + dy; applyViewTransform();
    // A panorama scrolled to its edge hands the rest of the horizontal drag over to the view swipe.
    const overscroll = wantedPanX - viewPanX;
    if (viewSwipe?.id === event.pointerId && !pinchGesture && (Math.abs(overscroll) > 1 || viewSwipe.tracking)) { viewSwipe.fromPan = true; trackViewSwipe(event, overscroll); }
    if (panGesture.moved) event.preventDefault();
  }
}
function viewportPointerUp(event) {
  if (event.type === 'pointerup' && viewSwipe?.id === event.pointerId && !viewPointers.has(event.pointerId)) { finishViewSwipe(event); return; }
  if (event.type === 'lostpointercapture' && event.target !== els.scene) return;
  if (event.type === 'pointercancel' || event.type === 'lostpointercapture') {
    const cancelled = viewSwipe; viewSwipe = null;
    if (cancelled?.tracking) { cancelAnimationFrame(cancelled.frame); settleBack(cancelled.direction || 1); }
    resetViewportPointers();
    return;
  }
  viewPointers.delete(event.pointerId); if (!viewPointers.size) setGestureLayer(false);
  if (viewSwipe?.id === event.pointerId) finishViewSwipe(event);
  if (panGesture?.id === event.pointerId) panGesture = null;
  if (viewPointers.size < 2) pinchGesture = null;
}
// One-finger horizontal swipe switches to the neighbouring view (view mode, phone), but only
// when the gesture was not used to pan a zoomed-in or panoramic scene.
// Swiping between views works like the phone gallery: the current scene card follows the finger and a
// ready-made preview of the neighbouring view (same geometry as the real view) slides in next to it.
// Previews are prepared ahead of time (image decoded first, markers added afterwards), so a swipe only moves them.
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const nextFrames = (count = 1) => new Promise(resolve => { const step = left => left ? requestAnimationFrame(() => step(left - 1)) : resolve(); step(count); });
const swipeImages = new Map(), swipePreviews = new Map();
let swipePreview = null, swipePrebuildTimer = null, swipeBusy = false, pendingSwipe = 0;
function swipeNeighbour(dx) { const index = model.viewOrder.indexOf(model.activeViewId); return model.viewOrder[index + (dx < 0 ? 1 : -1)]; }
// Transition between views on phones: 'off' (tabs only), 'slide' (pager) or 'cube' (3D cube).
function viewTransitionMode() { const mode = model.settings?.viewTransition; return mode === 'off' || mode === 'cube' ? mode : 'slide'; }
// The motion of one swipe, locked for the whole swipe (the next view takes over before the motion ends).
let swipeMotionLock = null;
function swipeMotion() { return swipeMotionLock || viewTransitionMode(); }
function swipePageDistance() { if (swipeMotion() === 'cube') return els.sceneCard?.offsetWidth || innerWidth; return (els.sceneCard?.parentElement?.clientWidth || innerWidth) + 16; }
const withTimeout = (promise, ms) => Promise.race([Promise.resolve(promise).catch(() => {}), new Promise(resolve => setTimeout(resolve, ms))]);
// Cancels a swipe in progress (lost touch, app sent to background) and puts both cards back.
// Safety net: cards may never stay between two views without a gesture or an animation running.
let activeTouches = 0, touchEventsSeen = false;
function swipeStuck() { return Boolean(swipePreview && !swipePreview.element.hidden) || Boolean(els.sceneCard?.style.transform); }
function resetStuckSwipe(animate = true) {
  if (swipeBusy || viewSwipe || !swipeStuck()) return;
  if (!animate) { removeSwipePreview(); positionSwipe(0, 1); return; }
  settleViewSwipe(0, 1, 180).then(() => { if (!viewSwipe && !swipeBusy) { removeSwipePreview(); positionSwipe(0, 1); } });
}
function swipeWatchdog() {
  flushDeferredRenders();
  // "Finger gone" is only trusted when the page really receives touch events; otherwise wait for a long idle.
  const idle = viewSwipe ? performance.now() - (viewSwipe.lastMove || viewSwipe.start || 0) : 0;
  if (viewSwipe && !swipeBusy && ((touchEventsSeen && activeTouches === 0 && idle > 250) || idle > (viewSwipe.tracking ? 1500 : 4000))) {
    // The finger is gone but no pointerup/cancel arrived: finish the gesture with its last known position.
    swipeLog(`STRAŻNIK: brak puszczenia (bezczynność ${Math.round(idle)} ms)`);
    const swipe = viewSwipe; viewPointers.delete(swipe.id); finishViewSwipe({ clientX: swipe.lastX ?? swipe.x, clientY: swipe.lastY ?? swipe.y });
    return;
  }
  if (!viewSwipe && !swipeBusy && swipeStuck() && performance.now() - (swipeWatchdog.lastEnd || 0) > 600) { swipeLog('STRAŻNIK: karty w połowie → powrót'); resetStuckSwipe(true); }
}
// Optional on-screen swipe diagnostics (per device): shows what the page receives during a swipe.
const SWIPE_DEBUG_KEY = 'ha-views:swipe-debug';
let swipeDebug = false, swipeDebugLines = [], swipeDebugT0 = 0;
try { localStorage.removeItem(SWIPE_DEBUG_KEY); } catch {}
function swipeLog(text) {
  if (!swipeDebug) return;
  const now = performance.now(); if (!swipeDebugT0 || now - swipeDebugT0 > 4000) swipeDebugT0 = now;
  swipeDebugLines.push(`${String(Math.round(now - swipeDebugT0)).padStart(5)} ${text}`); swipeDebugLines = swipeDebugLines.slice(-14);
  let box = $('#swipe-debug');
  if (!box) { box = document.createElement('pre'); box.id = 'swipe-debug'; box.setAttribute('data-no-i18n', ''); document.body.append(box); }
  box.textContent = swipeDebugLines.join('\n') + `\n— busy:${swipeBusy ? 1 : 0} swipe:${viewSwipe ? (viewSwipe.tracking ? 'track' : 'wait') : '-'} touches:${activeTouches}${touchEventsSeen ? '' : '?'} card:${els.sceneCard?.style.transform ? 'moved' : 'home'}`;
}
function setSwipeDebug(on) {
  swipeDebug = on; try { localStorage.setItem(SWIPE_DEBUG_KEY, on ? '1' : '0'); } catch {}
  if (!on) { $('#swipe-debug')?.remove(); swipeDebugLines = []; } else swipeLog('diagnostyka włączona');
}
function abortViewSwipe() {
  if (viewSwipe) swipeLog('ABORT (utrata dotyku / tło / fokus)');
  const swipe = viewSwipe; viewSwipe = null; if (!swipe) return;
  cancelAnimationFrame(swipe.frame);
  if (swipe.tracking && !swipeBusy) settleBack(swipe.direction || 1, 180);
}
function swipeImage(name) {
  if (!swipeImages.has(name)) {
    const image = new Image(); image.decoding = 'async'; image.src = `api/background/file?name=${encodeURIComponent(name)}`;
    const ready = (image.decode ? image.decode() : new Promise(resolve => { image.onload = resolve; })).catch(() => {}).then(() => image);
    swipeImages.set(name, { image, ready });
  }
  return swipeImages.get(name);
}
// Mirrors applyBackgroundTransform()/updateSceneGeometry()/resetViewZoom() for a view that is not active yet.
function swipeGeometry(view, image) {
  const card = els.sceneCard, parentWidth = Math.max(1, card.parentElement?.clientWidth || innerWidth), cardTop = card.getBoundingClientRect().top;
  const screenHeight = layoutViewportHeight(), border = 2, designWidth = Number(model.settings?.designWidth) || DESIGN_WIDTH;
  const hasImage = Boolean(image?.naturalWidth && image?.naturalHeight), ratio = hasImage ? image.naturalWidth / image.naturalHeight : clamp(view.solidCanvasRatio || 16 / 9, .25, 4);
  if (hasImage && mobileView() && layoutViewportHeight() > innerWidth && image.naturalWidth > image.naturalHeight) {
    const viewportHeight = Math.max(180, screenHeight - cardTop - 1 - 8), sceneWidth = Math.round(viewportHeight * ratio), viewportWidth = parentWidth - border;
    const panStart = clamp(view.backgroundTransforms?.[view.background]?.mobilePanStart ?? .5, 0, 1);
    return { cardWidth: parentWidth, cardLeft: 0, viewportHeight, viewportWidth, sceneWidth, sceneHeight: viewportHeight, panX: -Math.max(0, sceneWidth - viewportWidth) * panStart, scale: sceneWidth / designWidth, panorama: sceneWidth - viewportWidth > 1 };
  }
  const cardWidth = Math.min(parentWidth, Math.max(160, screenHeight - cardTop - 8) * ratio), sceneWidth = cardWidth - border, sceneHeight = sceneWidth / ratio;
  return { cardWidth, cardLeft: (parentWidth - cardWidth) / 2, viewportHeight: sceneHeight, sceneWidth, sceneHeight, panX: 0, scale: sceneWidth / designWidth };
}
function buildSwipePreview(targetId) {
  const view = model.views[targetId]; if (!view || !els.sceneCard) return null;
  const imageEntry = view.background ? swipeImage(viewIsNight(view) ? view.nightBackground : view.background) : null;
  const wrap = document.createElement('div'); wrap.className = 'scene-card swipe-preview'; wrap.setAttribute('data-no-i18n', ''); wrap.setAttribute('aria-hidden', 'true'); wrap.hidden = true;
  const viewport = document.createElement('div'); viewport.className = 'swipe-preview-viewport';
  const scene = document.createElement('div'); scene.className = 'scene swipe-preview-scene';
  scene.style.background = view.backgroundColor || 'linear-gradient(145deg,#0d2838,#0a1c27)';
  viewport.append(scene); wrap.append(viewport); els.sceneCard.parentElement.append(wrap);
  const preview = { element: wrap, targetId, viewport, scene, geometry: null };
  const layout = image => {
    const g = preview.geometry = swipeGeometry(view, image);
    Object.assign(wrap.style, { top: els.sceneCard.offsetTop + 'px', left: g.cardLeft + 'px', width: g.cardWidth + 'px' });
    viewport.style.height = g.viewportHeight + 'px';
    Object.assign(scene.style, { width: g.sceneWidth + 'px', height: g.sceneHeight + 'px', transform: `translateX(${g.panX}px)` });
    scene.style.setProperty('--scene-scale', g.scale);
    wrap.querySelector('.panorama-indicator')?.remove();
    if (g.panorama) {
      const indicator = document.createElement('div'), thumb = document.createElement('i'), maxX = g.sceneWidth - g.viewportWidth, size = clamp(g.viewportWidth / g.sceneWidth * 100, 12, 92);
      indicator.className = 'panorama-indicator visible'; thumb.style.width = `${size}%`; thumb.style.transform = `translateX(${(-g.panX / maxX) * (100 - size)}%)`;
      indicator.append(thumb); wrap.append(indicator);
    }
  };
  const addMarkers = () => {
    if (!wrap.isConnected) return;
    const layer = document.createElement('div'); layer.className = 'markers';
    Object.values(view.entities || {}).forEach(marker => { const node = document.createElement('div'); node.className = `marker ${marker.type}`; node.innerHTML = markerHtml(marker); applyMarkerStyle(node, marker); layer.append(node); });
    Object.values(view.flows || {}).forEach(flow => { const built = buildFlowNode(flow); if (built) { placeFlowNode(built.node, flow, built.duration); layer.append(built.node); } });
    const rooms = Object.values(view.rooms || {}).filter(room => (room.points || []).length >= 3);
    if (rooms.length) { const roomLayer = document.createElement('div'); roomLayer.className = 'rooms'; const w = preview.geometry?.sceneWidth || 1, h = preview.geometry?.sceneHeight || 1;
      // The cube turn cannot keep up with live SVG blurs (the glows popped in only at its end): cached bitmaps, the same
      // ones the view itself uses; the live markup (own ids) only until they are ready.
      const fill = () => { if (!wrap.isConnected) return; roomLayer.innerHTML = rooms.map(room => { const pvImg = scene.querySelector('.swipe-preview-image'), backdrop = { img: pvImg, filter: pvImg?.style.filter || '', tint: Number(scene.querySelector('.scene-dim-tint')?.style.opacity) || 0, color: view.backgroundColor }; const glow = roomGlowApply(room, roomLayerMarkup(room, 'room', w, h), w, h, `pv:${targetId}:${room.id}`, fill, backdrop); return glow.signature.startsWith('img|') ? glow.html : roomLayerMarkup(room, `pv-${targetId}`, w, h).html; }).join(''); };
      fill(); scene.append(roomLayer); const labels = document.createElement('div'); labels.className = 'room-labels'; labels.innerHTML = rooms.map(room => roomLabelMarkup(room)).join(''); scene.append(labels); }
    scene.append(layer);
  };
  if (imageEntry) {
    layout(null);
    imageEntry.ready.then(image => { if (!wrap.isConnected) return; const clone = image.cloneNode(); clone.style.filter = viewIsNight(view) ? brightnessFilter(brightnessOf(view, 'nightBrightness')) : dayImageFilter(view); clone.className = 'swipe-preview-image'; clone.alt = ''; clone.draggable = false; const tint = Number(viewIsNight(view) ? 0 : sunDimTint(view)); if (tint) { const shade = document.createElement('div'); shade.className = 'scene-dim-tint'; shade.style.opacity = tint; scene.prepend(shade); } scene.prepend(clone); layout(image); addMarkers(); });
  } else { layout(null); addMarkers(); }
  return preview;
}
function clearSwipePreviews() { swipePreviews.forEach(preview => preview.element.remove()); swipePreviews.clear(); }
function prebuildSwipePreviews(delay = 400) {
  clearTimeout(swipePrebuildTimer);
  swipePrebuildTimer = setTimeout(() => {
    if (viewSwipe?.tracking || swipePreview || swipeBusy) return prebuildSwipePreviews(300);
    clearSwipePreviews();
    if (!mobileView() || editMode || model.viewOrder.length < 2 || !els.sceneCard) return;
    const index = model.viewOrder.indexOf(model.activeViewId);
    [model.viewOrder[index - 1], model.viewOrder[index + 1]].filter(Boolean).forEach(id => { const preview = buildSwipePreview(id); if (preview) swipePreviews.set(id, preview); });
  }, delay);
}
function setSwipeClip(on) {
  const section = els.sceneCard?.parentElement; if (!section) return;
  if (on && !section.classList.contains('view-swiping')) section.style.minHeight = `${Math.max(section.offsetHeight, ...[...swipePreviews.values()].map(preview => preview.element.offsetTop + preview.element.offsetHeight))}px`;
  if (!on) section.style.minHeight = '';
  section.classList.toggle('view-swiping', on);
}
function removeSwipePreview() { if (swipePreview) swipePreview.element.hidden = true; swipePreview = null; setSwipeClip(false); }
function positionSwipe(offset, direction, animate = 0) {
  const distance = swipePageDistance(), transition = animate ? `transform ${animate}ms cubic-bezier(.22,.61,.36,1)` : 'none';
  if (offset && !swipeMotionLock) swipeMotionLock = swipeMotion();
  const cube = swipeMotion() === 'cube', section = els.sceneCard?.parentElement;
  if (!offset) swipeMotionLock = null;
  // Nothing is switched when a turn starts: the plan keeps its layer (dropping it re-drew the whole card in the first
  // frame), the card always clips the plan at the screen (syncCardClip) and labels have no blur on touch devices.
  // Back to the normal layers only once the card has stood still for a moment: switching them in the same frame as the
  // card snapped back (a turn started at the panorama's edge but not finished) re-drew the plan mid-motion (a blink).
  clearTimeout(positionSwipe.calm);
  if (cube && offset) els.sceneCard?.classList.add('cube-turning');
  else if (els.sceneCard?.classList.contains('cube-turning')) positionSwipe.calm = setTimeout(() => { if (!els.sceneCard.style.transform) els.sceneCard.classList.remove('cube-turning'); }, animate + 300);
  if (cube) {
    // Two faces of one cube rotating about the cube's centre: the current view turns away, the next one turns in.
    const progress = clamp(offset / distance, -1, 1), angle = 90 * progress, half = distance / 2;
    const face = a => `translateZ(${-half}px) rotateY(${a}deg) translateZ(${half}px)`;
    if (els.sceneCard) Object.assign(els.sceneCard.style, { transition, transformOrigin: '50% 50%', transform: offset ? face(angle) : '' });
    if (swipePreview) Object.assign(swipePreview.element.style, { transition, transformOrigin: '50% 50%', transform: face(angle - direction * 90) });
    if (!offset && els.sceneCard) els.sceneCard.style.transformOrigin = '';
    return;
  }
  if (els.sceneCard) { els.sceneCard.style.transition = transition; els.sceneCard.style.transformOrigin = ''; els.sceneCard.style.transform = offset ? `translateX(${offset}px)` : ''; }
  if (swipePreview) { swipePreview.element.style.transition = transition; swipePreview.element.style.transformOrigin = ''; swipePreview.element.style.transform = `translateX(${offset - direction * distance}px)`; }
}
function trackViewSwipe(event, forcedDx = null) {
  const swipe = viewSwipe;
  // While the previous page is still settling, remember the gesture; once it is done, continue from the finger's current position.
  // While the previous page is still settling, only remember the gesture; afterwards it continues with its full distance.
  if (swipeBusy) { swipe.busyDx = event.clientX - swipe.x; swipe.caughtUp = false; swipe.panX = viewPanX; return; }
  const dx = forcedDx ?? event.clientX - swipe.x, dy = forcedDx === null ? event.clientY - swipe.y : 0;
  swipe.lastDx = dx; swipe.maxDx = Math.max(swipe.maxDx || 0, Math.abs(dx));
  swipe.samples = (swipe.samples || []).concat([[event.clientX, performance.now()]]).slice(-6);
  if (!swipe.tracking) { if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.3) return; swipe.tracking = true; swipeLog(`śledzenie start${swipe.fromPan ? ' (z panoramy)' : ''}`); try { if (!els.scene.hasPointerCapture(swipe.id)) els.scene.setPointerCapture(swipe.id); } catch {} $$('.swipe-preview.swipe-fading').forEach(node => node.remove()); }
  if (swipe.fromPan && Math.abs(dx) < .5) { removeSwipePreview(); positionSwipe(0, swipe.direction || 1); return; }
  const target = swipeNeighbour(dx), direction = dx < 0 ? -1 : 1; swipe.direction = direction;
  if (swipePreview?.targetId !== target) {
    removeSwipePreview();
    if (target) { swipePreview = swipePreviews.get(target) || null; if (!swipePreview) { swipePreview = buildSwipePreview(target); if (swipePreview) swipePreviews.set(target, swipePreview); } if (swipePreview) { swipePreview.element.hidden = false; setSwipeClip(true); } }
  }
  const offset = target ? dx : dx * .25;
  cancelAnimationFrame(swipe.frame);
  // First frame after catching up with a busy transition glides to the finger instead of jumping.
  if (swipe.caughtUp === false) { swipe.caughtUp = true; positionSwipe(offset, direction, 90); }
  else swipe.frame = requestAnimationFrame(() => positionSwipe(offset, direction));
  event.preventDefault();
}
// Puts the cards back after a cancelled gesture. The final reset is skipped when a newer gesture or a view
// transition has started in the meantime; resetting then would snap that gesture's cards back mid-way.
function settleBack(direction = 1, duration = 200) {
  return settleViewSwipe(0, direction, duration).then(() => { if (!viewSwipe?.tracking && !swipeBusy) { removeSwipePreview(); positionSwipe(0, direction); } });
}
function settleViewSwipe(offset = 0, direction = 1, duration = 220) {
  return new Promise(resolve => {
    if (reducedMotion()) { positionSwipe(offset, direction); return resolve(); }
    positionSwipe(offset, direction, duration);
    setTimeout(resolve, duration + 30);
  });
}
async function finishViewSwipe(event) {
  const swipe = viewSwipe; viewSwipe = null; if (!swipe) return; swipeLog(`koniec gestu${event?.type ? ' (' + event.type + ')' : ' (awaryjny)'}${swipeBusy ? ' w trakcie przejścia → kolejka' : ''}`); cancelAnimationFrame(swipe.frame); swipeWatchdog.lastEnd = performance.now();
  if (swipeBusy) { const queued = swipe.busyDx ?? event.clientX - swipe.x; if (Math.abs(queued) >= 40) pendingSwipe = Math.sign(queued); return; }
  const dx = swipe.fromPan ? (swipe.lastDx || 0) : event.clientX - swipe.x, dy = swipe.fromPan ? 0 : event.clientY - swipe.y, distance = swipePageDistance(), direction = dx < 0 ? -1 : 1;
  // Gallery-like decision. The finger's recent speed (last ~100 ms, ignoring the few pixels of jitter when it is
  // lifted) projects where the page is heading; only a clear pull-back of the finger cancels the switch.
  if (!swipe.fromPan) swipe.samples = (swipe.samples || []).concat([[event.clientX, performance.now()]]);
  const samples = (swipe.samples || []).filter(([, t]) => performance.now() - t < 100), first = samples[0], last = samples[samples.length - 1];
  let velocity = first && last && last[1] - first[1] >= 8 ? (last[0] - first[0]) / (last[1] - first[1]) : 0;
  if (Math.sign(velocity) !== Math.sign(dx) && Math.abs(velocity) < .35) velocity = 0;
  const pulledBack = (swipe.maxDx || Math.abs(dx)) - Math.abs(dx) > Math.max(30, distance * .08) && Math.sign(velocity) !== Math.sign(dx);
  const horizontal = Math.abs(dx) >= Math.abs(dy) * (swipe.tracking ? .7 : 1.3) && (swipe.fromPan || Math.abs(viewPanX - swipe.panX) <= 12);
  const projected = dx + velocity * 200;
  let go = !pulledBack && (Math.abs(projected) > distance * .5 || (Math.abs(velocity) > .25 && Math.abs(dx) > 30) || Math.abs(dx) > distance * .4);
  if (pulledBack && Math.abs(dx) > distance * .6) go = true;
  // A short, quick flick (few move events) also counts.
  if (!swipe.fromPan && !pulledBack && Date.now() - swipe.t <= 300 && Math.abs(dx) >= 50 && !(Math.abs(velocity) > .35 && Math.sign(velocity) !== Math.sign(dx))) go = true;
  lastSwipeDecision = { dx: Math.round(dx), dy: Math.round(dy), velocity: +velocity.toFixed(2), pulledBack, horizontal, go };
  swipeLog(`decyzja dx=${Math.round(dx)} dy=${Math.round(dy)} v=${velocity.toFixed(2)}${pulledBack ? ' cofnięty' : ''}${horizontal ? '' : ' nie-poziomy'} → ${go && horizontal ? 'PRZEŁĄCZ' : 'ZOSTAŃ'}`);
  const target = go && horizontal ? swipeNeighbour(dx) : null;
  if (!target) { if (swipe.tracking) await settleBack(direction, 200); return; }
  const marker = swipe.target?.closest?.('.marker,.flow-marker'); if (marker) marker.dataset.dragged = '1';
  await completeViewSwipe(target, direction, dx, velocity);
}
async function completeViewSwipe(target, direction, dx = 0, velocity = 0) {
  const distance = swipePageDistance();
  if (!swipePreview || swipePreview.targetId !== target) { removeSwipePreview(); swipePreview = swipePreviews.get(target) || buildSwipePreview(target); if (swipePreview) { swipePreview.element.hidden = false; setSwipeClip(true); positionSwipe(dx, direction); void els.sceneCard.offsetWidth; } }
  const remaining = Math.max(0, distance - Math.abs(dx)), speed = Math.max(Math.abs(velocity), 1.4);
  swipeBusy = true; let preview = null; swipeLog('przejście…');
  try {
    await settleViewSwipe(direction * distance, direction, Math.round(clamp(remaining / speed, 110, 240)));
    // The preview now sits exactly where the real view will be: swap the real view in underneath and fade it out.
    preview = swipePreview; swipePreview = null; swipePreviews.delete(target);
    await withTimeout(switchSceneView(target), 4000);
    // Make the real view final (decoded image, final card/scene geometry) and painted under the still opaque
    // preview before the preview fades; otherwise one intermediate frame can blink on slower phones.
    if (currentBackground && els.image.decode) await withTimeout(els.image.decode(), 800);
    await nightImageReady();
    applyBackgroundTransform(); updateSceneGeometry();
    await nextFrames(2);
    positionSwipe(0, direction);
    await nextFrames(2);
    setSwipeClip(false);
  } catch (error) {
    // Never leave the cards between two views, whatever failed.
    console.warn('HA Views swipe', error); removeSwipePreview(); positionSwipe(0, direction);
  } finally { swipeBusy = false; swipeWatchdog.lastEnd = performance.now(); swipeLog('przejście gotowe'); }
  if (preview) { preview.element.classList.add('swipe-fading'); preview.element.style.transition = 'opacity 140ms ease'; preview.element.style.opacity = '0'; setTimeout(() => preview.element.remove(), 170); }
  // A flick made during this transition continues straight to the next view.
  if (pendingSwipe && !viewSwipe?.tracking) {
    const queued = pendingSwipe, next = swipeNeighbour(queued); pendingSwipe = 0;
    if (next) { removeSwipePreview(); swipePreview = swipePreviews.get(next) || buildSwipePreview(next); if (swipePreview) { swipePreview.element.hidden = false; setSwipeClip(true); positionSwipe(0, queued < 0 ? -1 : 1); void els.sceneCard.offsetWidth; } await completeViewSwipe(next, queued < 0 ? -1 : 1, 0, 1.6); }
  }
  pendingSwipe = 0;
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
    uiLanguage = els.language.value === 'pl' ? 'pl' : 'en'; try { localStorage.setItem(LANGUAGE_CACHE_KEY, uiLanguage); } catch {}
    model.settings ||= {}; model.settings.language = uiLanguage;
    applyLanguage(); scheduleSave(true);
  });
  els.sceneTabs?.addEventListener('pointerdown', startTabDrag);
  els.sceneTabs?.addEventListener('touchmove', event => { if (tabDrag?.active) event.preventDefault(); }, { passive:false });
  els.sceneTabs?.addEventListener('contextmenu', event => { if (tabDrag) event.preventDefault(); });
  els.sceneTabs?.addEventListener('click', event => { if (suppressTabClick) { suppressTabClick = false; event.preventDefault(); event.stopPropagation(); return; } const tab=event.target.closest('[data-scene-view]'); if(!tab)return; showMainView('overview'); switchSceneView(tab.dataset.sceneView); });
  els.settingsToggle?.addEventListener('click', () => { const open = !els.settingsMenu?.classList.contains('open'); closeCompactMenus(); els.settingsMenu?.classList.toggle('open', open); els.settingsToggle?.classList.toggle('active', open); });
  els.integrationsButton?.addEventListener('click', () => { if (els.integrationsButton.classList.contains('active')) { showMainView('overview'); return; } closeEditor(); closeFlowEditor(); closeRoomEditor(); cancelRoomDrawing(); closeMoreInfo(); openIntegrations.clear(); unusedIntegrationsOpen = false; closeCompactMenus(); showMainView('integrations'); });
  els.viewManage?.addEventListener('click', () => { placeViewSheet(); const open = !els.viewSwitcher.classList.contains('open'); closeCompactMenus(); els.viewSwitcher.classList.toggle('open', open); els.viewManage.classList.toggle('active', open); });
  els.viewAdd?.addEventListener('click', addSceneView); els.viewRename?.addEventListener('click', renameSceneView);
  els.viewDuplicate?.addEventListener('click', duplicateSceneView); els.viewDefault?.addEventListener('click', setDefaultSceneView); els.viewMoveLeft?.addEventListener('click', () => moveSceneView(-1)); els.viewMoveRight?.addEventListener('click', () => moveSceneView(1)); els.viewDelete?.addEventListener('click', deleteSceneView);
  els.confirmInput?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); closeAppConfirm(true); } });
  els.flowEditorClose?.addEventListener('click', closeFlowEditor);
  $('#flow-default-style')?.addEventListener('click', resetFlowStyle); $('#flow-copy-style')?.addEventListener('click', copyFlowStyle); $('#flow-duplicate')?.addEventListener('click', duplicateFlow); $('#flow-paste-style')?.addEventListener('click', pasteFlowStyle); $('#flow-remove')?.addEventListener('click', confirmRemoveFlow);
  els.flowEditorContent?.addEventListener('click', onFlowEditorClick);
  els.flowEditorContent?.addEventListener('pointerdown', event => { if (event.target.closest('input[type="checkbox"],select')) event.stopPropagation(); });
  $('.flow-editor .editor-head')?.addEventListener('pointerdown', startEditorDrag);
  els.editToggle.addEventListener('click', () => { if (isViewer()) return; closeMoreInfo(); editMode = !editMode; els.body.classList.toggle('editing', editMode); els.editToggle.classList.toggle('active', editMode); els.editToggle.setAttribute('aria-pressed', String(editMode)); syncDock(); els.editToggle.title = translateValue('Edytuj widok'); els.editToggle.setAttribute('aria-label', els.editToggle.title); if (editMode) { closeCompactMenus(); renderMarkers(); } else { editorPreview = { entityId:'', state:'' }; roomPreviewOn = ''; resetViewZoom(); if (!mobileView()) window.scrollTo(0, 0); closeEditor(); closeFlowEditor(); cancelRoomDrawing(); closeRoomEditor(); renderRoomEditLayer(); closeCompactMenus(); els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); renderMarkers(); } requestAnimationFrame(() => { applyBackgroundTransform(); updateSceneGeometry(); }); });
  $('#snap-menu-button')?.addEventListener('click', event => { event.stopPropagation(); const menu = $('#snap-menu'), open = !menu.classList.contains('open'); closeCompactMenus(); menu.classList.toggle('open', open); $('#snap-menu-button').classList.toggle('active', open); syncSnapMenu(); });
  $('#snap-menu')?.addEventListener('click', event => {
    event.stopPropagation();
    const key = event.target.closest('[data-snap-key]')?.dataset.snapKey, align = event.target.closest('[data-align]')?.dataset.align;
    if (key) { model.settings ||= {}; model.settings.snapTargets = { ...snapTargets(), [key]: !snapTargets()[key] }; syncSnapMenu(); scheduleSave(true); }
    if (align) alignSelectedToBackground(align);
    const rotate = event.target.closest('[data-rotate]')?.dataset.rotate;
    if (rotate !== undefined) { const item = rotationTarget(); if (item) setSelectedRotation(rotate === 'reset' ? 0 : (Number(item.rotation) || 0) + Number(rotate), true); }
  });
  $('#rotate-range')?.addEventListener('input', event => setSelectedRotation(event.target.value, false));
  $('#rotate-range')?.addEventListener('change', event => setSelectedRotation(event.target.value, true));
  $('#snap-menu')?.addEventListener('pointerdown', event => { if (event.target.closest('#rotate-range')) event.stopPropagation(); });
  $('#add-button')?.addEventListener('click', event => { event.stopPropagation(); openAddDialog(); });
  els.addDialog?.addEventListener('click', onAddDialogClick);
  $('#add-search')?.addEventListener('input', event => { if (!addState) return; addState.query = event.target.value; renderAddDialog('list'); });
  $('#add-search')?.addEventListener('keydown', event => { if (event.key === 'Enter' && addState && addGoLabel().ok) { event.preventDefault(); confirmAddDialog(); } });
  $('#add-pick')?.addEventListener('change', event => { if (!addState) return; addState.pick = event.target.checked; try { localStorage.setItem(ADD_PICK_KEY, addState.pick ? '1' : '0'); } catch {} });
  els.scene?.addEventListener('pointerdown', onAddPickPointer, true);
  $('#room-wizard')?.addEventListener('click', onRoomWizardClick);
  // Fields of a text's action step write straight into the text.
  ['input','change'].forEach(type => $('#room-wizard')?.addEventListener(type, event => { const field = event.target.closest?.('[data-wizard-link]'), room = roomWizard && roomsOf()[roomWizard.id]; if (!field || !room) return; room[field.dataset.wizardLink] = field.type === 'checkbox' ? field.checked : field.value.trim(); room.updatedAt = new Date().toISOString(); }));
  // Buttons in the wizard never take the focus from its text field (that would close the keyboard).
  ['pointerdown','mousedown'].forEach(type => $('#room-wizard')?.addEventListener(type, event => { if (event.target.closest('button') && document.activeElement?.closest?.('#room-wizard') && document.activeElement.matches('input')) event.preventDefault(); }));
  $('#room-wizard-name')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); roomWizardNext(); } });
  $('#room-wizard-search')?.addEventListener('input', event => { if (!roomWizard) return; roomWizard.query = event.target.value; roomWizard.queryFromName = false; renderRoomWizard('list'); });
  $('#room-wizard-search')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); roomWizardNext(); } });
  window.addEventListener('keydown', event => { if (event.key !== 'Escape') return; if (roomWizard) { if (roomWizard.step === 'name') roomWizardName(); closeRoomWizard(); } else if (addState) closeAddDialog(); else if (addPicking) { cancelAddPicking(); notify('Anulowano dodawanie'); } });
  $('#view-link')?.addEventListener('click', copyViewLink);
  const followLink = () => { const linked = viewFromLink(); if (linked && linked !== model.activeViewId) switchSceneView(linked, false); };
  try { if (window.top !== window) { window.top.addEventListener('location-changed', followLink); window.top.addEventListener('popstate', followLink); } } catch {}
  window.addEventListener('hashchange', followLink);
  $('#night-background-select')?.addEventListener('change', event => { const view = activeSceneView(); if (!view) return; view.nightBackground = event.target.value; applyNightBackground(); scheduleSave(true); refreshStates(); });
  $('#night-background-upload')?.addEventListener('click', () => $('#night-background-file')?.click());
  $('#night-background-file')?.addEventListener('change', event => uploadNightBackground(event.target.files?.[0]));
  $('#night-entity')?.addEventListener('change', event => { const view = activeSceneView(); if (!view) return; view.nightEntity = event.target.value.trim(); if (!view.nightEntity) delete view.nightEntity; scheduleSave(true); refreshStates(); applyNightBackground(); });
  $('.night-mode')?.addEventListener('click', event => { const mode = event.target.closest('[data-night-mode]')?.dataset.nightMode; if (mode) setNightMode(mode); });
  $('#background-files')?.addEventListener('click', openBackgroundManager);
  $('#bg-manager-close')?.addEventListener('click', closeBackgroundManager);
  $('#bg-manager')?.addEventListener('click', event => { if (event.target.id === 'bg-manager') closeBackgroundManager(); const name = event.target.closest('[data-bg-delete]')?.dataset.bgDelete; if (name) deleteBackgroundFiles([name]); const act = event.target.closest('[data-bg-action]'); if (act) backgroundFileAction(act.dataset.bgAction, act.dataset.name); });
  document.addEventListener('keydown', event => { if (event.key !== 'Escape') return; if ($('#bg-manager')?.classList.contains('visible') && !els.confirmBox.classList.contains('visible')) closeBackgroundManager(); });
  $('#bg-manager-clean')?.addEventListener('click', () => deleteBackgroundFiles(bgManagerItems.filter(item => !backgroundUses(item.name).length).map(item => item.name), true));
  $('#dash-toggle')?.addEventListener('click', () => { setDashGrid({ on: !dashGrid().on }); notify(dashGrid().on ? 'Siatka dashboardu włączona — upuść grupę etykiety na kratki' : 'Siatka dashboardu wyłączona'); });
  [['#dash-cols','cols'],['#dash-rows','rows'],['#dash-gap','gap']].forEach(([sel, key]) => $(sel)?.addEventListener('change', event => { const v = Number(event.target.value); if (Number.isFinite(v)) setDashGrid({ [key]: v }); }));
  $('#bounds-toggle')?.addEventListener('click', () => { model.settings ||= {}; model.settings.keepInBounds = !keepInBounds(); applyBoundsUi(); scheduleSave(true); notify(keepInBounds() ? 'Elementy nie wyjdą poza tło' : 'Elementy mogą wychodzić poza tło'); });
  applyBoundsUi();
  els.snapToggle.addEventListener('click', () => { model.settings.snapEnabled = !model.settings.snapEnabled; applySnapUi(); scheduleSave(true); notify(model.settings.snapEnabled ? 'Przyciąganie do siatki włączone' : 'Przyciąganie do siatki wyłączone'); });
  els.gridPresets.forEach(button => button.addEventListener('click', () => {
    model.settings.snapStep = Number(button.dataset.gridStep);
    applySnapUi(); scheduleSave(true);
  }));
  els.solidCanvasRatio?.addEventListener('change', () => { const view = activeSceneView(); if (!view) return; view.solidCanvasRatio = clamp(els.solidCanvasRatio.value, .25, 4); updateSceneGeometry(); scheduleSave(true); });
  els.bgManage.addEventListener('click', () => { closeEditor(); closeMoreInfo(); openBackgroundMenu(); });
  $('#view-options')?.addEventListener('click', () => setViewMenuPage('options'));
  $('#vm-back')?.addEventListener('click', () => setViewMenuPage('main'));
  $('#vm-close')?.addEventListener('click', closeCompactMenus);
  $('#background-rename')?.addEventListener('click', () => renameBackgroundFile(currentBackground));
  $$('[data-canvas-size]').forEach(button => button.addEventListener('click', () => { const [w, h] = button.dataset.canvasSize.split('x').map(Number); setCanvasSize(w, h); }));
  document.addEventListener('input', onLinkedSizeInput); document.addEventListener('change', onLinkedSizeInput);
  ['#canvas-width','#canvas-height'].forEach(id => $(id)?.addEventListener('change', () => setCanvasSize(Number($('#canvas-width').value), Number($('#canvas-height').value))));
  $('#canvas-resize-start')?.addEventListener('click', startCanvasResize);
  $$('[data-brightness]').forEach(input => { input.addEventListener('input', () => setBackgroundBrightness(input.dataset.brightness, input.value, false)); input.addEventListener('change', () => setBackgroundBrightness(input.dataset.brightness, input.value, true)); });
  $('#sun-dim-toggle')?.addEventListener('change', event => setSunDim('sunDim', event.target.checked, true));
  $$('[data-sundim]').forEach(input => { input.addEventListener('input', () => setSunDim(input.dataset.sundim, input.value, false)); input.addEventListener('change', () => setSunDim(input.dataset.sundim, input.value, true)); });
  $('[data-sundim-cool]')?.addEventListener('change', event => setSunDim('dimCool', event.target.checked, true));
  $$('[data-brightness-reset]').forEach(button => button.addEventListener('click', () => setBackgroundBrightness(button.dataset.brightnessReset, 100, true)));
  $('#canvas-resize-done')?.addEventListener('click', finishCanvasResize);
  $('#view-transition')?.addEventListener('change', event => { model.settings ||= {}; model.settings.viewTransition = event.target.value; renderViewSelector(); prebuildSwipePreviews(60); scheduleSave(true); notify('Zapisano sposób przełączania widoków'); });
  $('#background-preview-cancel')?.addEventListener('click', () => hideBackgroundPreview(true));
  $('#background-preview-apply')?.addEventListener('click', async () => { try { const view = activeSceneView(); view.background = els.bgSelect.value; if (view.background) view.onboardingDone = true; hideBackgroundPreview(); await loadBackgrounds(); scheduleSave(true); } catch (error) { notify(error.message, true); } });
  els.bgTransformToggle?.addEventListener('click', () => { els.bgTransformPanel.classList.toggle('open'); els.bgTransformToggle.classList.toggle('active', els.bgTransformPanel.classList.contains('open')); syncBackgroundTransformControls(); });
  [els.bgScale].forEach(control => { control?.addEventListener('input', updateBackgroundTransform); control?.addEventListener('change', updateBackgroundTransform); });
  els.mobilePanStart?.addEventListener('change', updateMobilePanStart);
  els.bgTransformPanel?.addEventListener('click', event => { const x = event.target.closest('[data-bg-align-x]'); if (!currentBackground || !x) return; const t = currentBackgroundTransform(); t.x = Number(x.dataset.bgAlignX); applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave(true); });
  $('#background-transform-reset')?.addEventListener('click', async () => { if (!currentBackground || !await appConfirm({ title:'Zresetować dopasowanie tła?', message:'Skala, pozycja i tryb dopasowania tego tła wrócą do wartości domyślnych.', confirmText:'Resetuj', danger:true })) return; activeSceneView().backgroundTransforms[currentBackground] = defaultBackgroundTransform(); applyBackgroundTransform(); syncBackgroundTransformControls(); scheduleSave(true); notify('Przywrócono domyślne dopasowanie tła'); });
  els.scene.addEventListener('click', onRoomDrawClick, true);
  $('#room-labels')?.addEventListener('pointerdown', startRoomLabelDrag);
  // No browser context menu (copy / share / save image) on a long press anywhere on the plan.
  els.scene.addEventListener('contextmenu', event => event.preventDefault());
  // Every new press starts clean: a pan or swipe that ended without a click must not swallow the next tap.
  document.addEventListener('pointerdown', event => { const node = event.target.closest?.('.marker,.flow-marker'); if (node) node.dataset.dragged = '0'; }, true);
  // Icons are tapped by press + release on the label itself. On phones the scene may capture the finger for
  // panning / swiping, and the browser then sends the click to the scene instead of the label.
  let labelTap = null;
  document.addEventListener('pointerdown', event => { const node = event.target.closest?.('.tappable'); labelTap = node && !editMode ? { id: node.dataset.roomId, pid: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now(), thermo: event.target.closest?.('[data-thermo], [data-thermo-mode], [data-thermo-preset]') || null } : null; }, true);
  window.addEventListener('pointercancel', event => { if (labelTap?.pid === event.pointerId) labelTap = null; }, true);
  window.addEventListener('pointerup', event => {
    const tap = labelTap; if (!tap || tap.pid !== event.pointerId) return; labelTap = null;
    if (editMode || Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 12 || performance.now() - tap.t > 1200) return;
    const room = roomsOf()[tap.id]; if (!room) return;
    // On a phone the release lands on the plan's gesture layer (it captures the touch), so the button is the one pressed.
    const thermoButton = isThermoRoom(room) && (event.target.closest?.('[data-thermo], [data-thermo-mode], [data-thermo-preset]') || (tap.thermo?.isConnected ? tap.thermo : null));
    if (thermoButton) {
      // The click that follows the release must not close the confirmation that may open now.
      const swallow = e => { e.stopPropagation(); e.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 600);
      if (!thermoButton.disabled) thermoTap({ entityId: room.entityIds?.[0] || '', confirm: !!room.thermoConfirm, name: room.name, room }, thermoButton); return;
    }
    // The click that follows this release is not needed any more (it could land on the sheet just opened).
    lastLabelTap = performance.now(); const swallow = e => { e.stopPropagation(); e.preventDefault(); };
    window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 600);
    onRoomTap(room);
  }, true);
  $('#room-labels')?.addEventListener('click', event => { if (event.target.closest('.tappable') && !editMode) event.stopPropagation(); });
  els.scene.addEventListener('pointerdown', event => { els.scene.__tapStart = { x:event.clientX, y:event.clientY, t:performance.now() }; }, true);
  els.scene.addEventListener('pointermove', onRoomDrawMove);
  els.scene.addEventListener('pointerdown', event => { if (startRoomMove(event)) { event.preventDefault(); event.stopImmediatePropagation(); } });
  els.scene.addEventListener('click', event => {
    if (!(event.target === els.scene || event.target === els.markers || event.target === els.image)) return;
    if (els.markers.dataset.roomMoved === '1') { els.markers.dataset.roomMoved = '0'; return; }
    if (!editMode && performance.now() - lastLabelTap < 700) return;
    const room = roomAt(scenePercentAt(event));
    if (!editMode) { const start = els.scene.__tapStart; if (room && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 12 && performance.now() - start.t < 1200) onRoomTap(room); return; }
    closeEditor(); closeFlowEditor(); closeMoreInfo();
    if (room && room.id === selectedRoomId) focusSceneBoxOnMobile(room.points || []); // a tap on the selected room brings it back into view
    else if (room) openRoomEditor(room.id); else closeRoomEditor();
  });
  $('#room-edit-layer')?.addEventListener('pointerdown', event => {
    if (event.target.closest('[data-corner-del]')) {
      event.preventDefault(); event.stopPropagation();
      const swallowClick = e => { e.stopPropagation(); e.preventDefault(); };
      window.addEventListener('click', swallowClick, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallowClick, true), 700);
      const index = pickedCorner(); if (index >= 0) removeRoomCorner(index); return;
    }
    startRoomHandleDrag(event);
  });
  $('#room-edit-layer')?.addEventListener('contextmenu', event => { if (event.target.closest('.room-handle,[data-corner-del]')) event.preventDefault(); });
  document.addEventListener('keydown', event => {
    if (!editMode || (event.key !== 'Delete' && event.key !== 'Backspace') || event.target.closest?.('input,textarea,select,[contenteditable]')) return;
    const index = pickedCorner(); if (index < 0) return;
    event.preventDefault(); removeRoomCorner(index);
  });
  $('#room-draw-done')?.addEventListener('click', finishRoomDrawing);
  $('#room-draw-bar')?.addEventListener('click', event => { if (event.target.closest('button')) return; const bar = event.currentTarget; placeRoomDrawBar(!bar.classList.contains('top')); });
  $('#room-draw-undo')?.addEventListener('click', () => { if (!roomDraft) return; roomDraft.points.pop(); roomDraft.cursor = null; updateRoomDrawBar(); renderRoomEditLayer(); });
  $('#room-draw-cancel')?.addEventListener('click', cancelRoomDrawing);
  $('#room-editor-close')?.addEventListener('click', closeRoomEditor);
  $('#room-remove')?.addEventListener('click', removeRoom); $('#room-geometry-lock')?.addEventListener('click', toggleRoomLock); $('#room-copy-style')?.addEventListener('click', copyRoomStyle); $('#room-paste-style')?.addEventListener('click', pasteRoomStyle); $('#room-default-style')?.addEventListener('click', resetRoomStyle); $('#room-duplicate')?.addEventListener('click', duplicateRoom);
  $('#room-editor-content')?.addEventListener('click', onRoomEditorClick); $('#room-group-toggle')?.addEventListener('click', onRoomEditorClick);
  $('.room-editor .editor-head')?.addEventListener('pointerdown', event => { const panel = $('#room-editor'); if (panel && !mobileView() && !event.target.closest('button,input,select')) panel.dataset.dragged = '1'; startEditorDrag(event); });
  $('#editor-close').addEventListener('click', closeEditor); document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (els.confirmBox.classList.contains('visible')) closeAppConfirm(false); else if (els.moreInfo.classList.contains('visible')) closeMoreInfo(); else if (roomDraft) cancelRoomDrawing(); else { closeEditor(); closeFlowEditor(); closeRoomEditor(); } });
  els.confirmCancel.addEventListener('click', () => closeAppConfirm(false)); els.confirmOk.addEventListener('click', () => closeAppConfirm(true));
  els.confirmBox.addEventListener('click', event => { if (event.target === els.confirmBox) closeAppConfirm(false); });
  $('#more-info-close')?.addEventListener('click', closeMoreInfo); els.moreInfoBackdrop?.addEventListener('click', closeMoreInfo);
  $('.history-ranges')?.addEventListener('click', event => { const button=event.target.closest('[data-history-hours]'); if(button) loadMoreInfoHistory(Number(button.dataset.historyHours)); });
  $('.editor-head').addEventListener('pointerdown', startEditorDrag);
  els.editorContent.addEventListener('pointerdown', event => { if (event.target.closest('input[type="checkbox"],select')) event.stopPropagation(); });
  els.editorContent.addEventListener('click', event => {
    const mtoggle = event.target.closest('[data-mtoggle]'), mtype = event.target.closest('[data-mtype]'), preset = event.target.closest('[data-angle-preset]');
    if (mtoggle || mtype || preset) {
      event.preventDefault(); event.stopPropagation(); const marker = model.entities[selectedId]; if (!marker) return;
      if (mtype) return changeType(mtype.dataset.mtype);
      if (mtoggle) { const path = mtoggle.dataset.mtoggle, current = path.split('.').reduce((o, k) => o?.[k], marker); setPath(marker, path, !current); }
      if (preset) { const [a, b] = gaugeSweepAngles(Number(preset.dataset.anglePreset)); marker.style.startAngle = a; marker.style.endAngle = b; }
      marker.updatedAt = new Date().toISOString(); renderMarkers(); reopenMarkerEditor(openSectionIndex(els.editorContent, editorOpenSectionIndex)); scheduleSave(true); return;
    }
    const previewButton = event.target.closest('[data-preview-path="__preview"]');
    if (previewButton) { event.preventDefault(); const marker = model.entities[selectedId]; if (!marker) return; const value = previewButton.dataset.previewValue, current = editorPreview.entityId === marker.entityId ? editorPreview.state : ''; editorPreview = current === value ? { entityId:'', state:'' } : { entityId: marker.entityId, state: value }; renderMarkers(); openEditor(openSectionIndex(els.editorContent, editorOpenSectionIndex)); return; }
    const reset = event.target.closest('[data-reset-path]');
    if (reset) { event.preventDefault(); resetEditorRange(reset.dataset.resetPath); return; }
    onColorPickerClick(event);
  });
  $$('[data-editor-tab]').forEach(button => button.addEventListener('click', () => changeType(button.dataset.editorTab)));
  $('#geometry-lock')?.addEventListener('click', () => { const m = model.entities[selectedId]; if (!m) return; m.geometryLocked = !m.geometryLocked; m.updatedAt = new Date().toISOString(); renderMarkers(); openEditor(openSectionIndex(els.editorContent, editorOpenSectionIndex)); scheduleSave(true); notify(m.geometryLocked ? 'Zablokowano geometrię' : 'Odblokowano geometrię'); });
  $('#flow-geometry-lock')?.addEventListener('click', () => { const flow = activeSceneView()?.flows?.[selectedFlowId]; if (!flow) return; flow.geometryLocked = !flow.geometryLocked; flow.updatedAt = new Date().toISOString(); renderMarkers(); openFlowEditor(flow.id, openSectionIndex(els.flowEditorContent, flowEditorOpenSectionIndex)); scheduleSave(true); notify(flow.geometryLocked ? 'Zablokowano geometrię' : 'Odblokowano geometrię'); });
  $('#preview-state-toggle')?.addEventListener('click', () => {
    const marker = model.entities[selectedId]; if (!marker || !editMode) return;
    const current = previewStateFor(marker) || stateKind(marker);
    editorPreview = { entityId: marker.entityId, state: current === 'on' ? 'off' : 'on' };
    renderMarkers(); syncPreviewStateButton();
  });
  $('#default-style').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Przywrócić styl domyślny?', message: 'Obecne ustawienia wyglądu markera zostaną zastąpione.', confirmText: 'Przywróć', danger: true })) return; m.style = markerStyleDefaults(m.type); renderMarkers(); openEditor(); scheduleSave(true); notify('Przywrócono styl domyślny'); });
  $('#copy-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m) return; styleClipboard = { type: m.type, style: clone(m.style), valueRules: m.valueRules ? clone(m.valueRules) : null, icon: Object.fromEntries(MARKER_ICON_KEYS.map(key => [key, clone(m[key] ?? '')])), tapAction: m.tapAction || 'more_info' }; $('#paste-style').disabled = false; notify(`Skopiowano styl ${markerTypeLabel(m.type)}`); });
  $('#paste-style').addEventListener('click', () => { const m = model.entities[selectedId]; if (!m || !styleClipboard) return; m.type = styleClipboard.type; m.style = clone(styleClipboard.style); if (styleClipboard.valueRules) m.valueRules = clone(styleClipboard.valueRules); else delete m.valueRules;
    if (styleClipboard.icon) Object.assign(m, clone(styleClipboard.icon));
    if (styleClipboard.tapAction) m.tapAction = styleClipboard.tapAction === 'toggle' && !isToggleableMarker(m) ? 'more_info' : styleClipboard.tapAction; m.updatedAt = new Date().toISOString(); renderMarkers(); openEditor(); scheduleSave(true); notify('Wklejono kompletny styl 1:1'); });
  $('#marker-duplicate')?.addEventListener('click', duplicateMarker);
  $('#remove-marker').addEventListener('click', async () => { const m = model.entities[selectedId]; if (!m || !await appConfirm({ title: 'Usunąć marker?', message: `„${m.displayName}” zniknie z tego widoku razem ze swoimi ustawieniami.`, confirmText: 'Usuń', danger: true })) return; removeMarker(selectedId); });
  $('#background-upload').addEventListener('click', () => els.bgFile.click()); $('#empty-upload').addEventListener('click', () => els.bgFile.click()); els.bgFile.addEventListener('change', () => uploadBackground(els.bgFile.files[0]));
  els.emptyBackgroundSelect?.addEventListener('change', () => {
    const name = els.emptyBackgroundSelect.value, preview = els.emptyBackgroundPreview;
    if (!name || !preview) { if (els.emptyBackgroundPreviewWrap) els.emptyBackgroundPreviewWrap.hidden = true; return; }
    preview.src = `api/background/file?name=${encodeURIComponent(name)}`;
    els.emptyBackgroundPreviewWrap.hidden = false;
  });
  els.emptyBackgroundConfirm?.addEventListener('click', async () => {
    const name = els.emptyBackgroundSelect?.value, view = activeSceneView(); if (!name || !view) return;
    try {
      view.background = name; view.backgroundColor = ''; view.onboardingDone = true;
      await loadBackgrounds(true); scheduleSave(true);
    } catch (error) { notify(error.message, true); }
  });
  const setBackgroundMenuColour = colour => { if (!/^#[0-9a-f]{6}$/i.test(colour || '')) return; els.backgroundBar.classList.remove('onboarding'); els.bgStatus.textContent = ''; setBackgroundColour(colour); };
  els.bgColor?.addEventListener('input', () => setBackgroundMenuColour(els.bgColor.value));
  els.bgColorToggle?.addEventListener('click', () => els.backgroundBar.querySelector('.color-menu')?.classList.toggle('visible'));
  els.bgRgbOpen?.addEventListener('click', async () => { const value = await appPrompt({ title:'Własny kolor RGB', message:'Podaj kolor w formacie #RRGGBB.', value:activeSceneView()?.backgroundColor || '#0D2838', confirmText:'Ustaw' }); if (value) setBackgroundMenuColour(value.trim()); });
  els.backgroundBar?.addEventListener('click', event => { const swatch = event.target.closest('[data-bg-colour]'); if (swatch) { setBackgroundMenuColour(swatch.dataset.bgColour); els.backgroundBar.querySelector('.color-menu')?.classList.remove('visible'); } });
  const setEmptyColourPreview = value => {
    const colour = String(value || '').trim();
    if (!/^#[0-9a-f]{6}$/i.test(colour)) return;
    els.emptyColor.value = colour.toUpperCase();
    els.emptyColorToggle.style.background = colour.toUpperCase();
    els.emptyColorMenu?.classList.remove('visible');
  };
  els.emptyColorToggle?.addEventListener('click', event => {
    event.preventDefault();
    els.emptyColorMenu?.classList.toggle('visible');
  });
  document.querySelectorAll('[data-empty-palette-color]').forEach(button => button.addEventListener('click', () => setEmptyColourPreview(button.dataset.emptyPaletteColor)));
  els.emptyRgb?.addEventListener('click', async () => {
    const value = await appPrompt({ title:'Własny kolor RGB', message:'Podaj kolor w formacie #RRGGBB.', value:els.emptyColor.value || '#0D2838', confirmText:'Ustaw' });
    if (value) setEmptyColourPreview(value);
  });
  els.emptyColorStart?.addEventListener('click', () => setBackgroundColour(els.emptyColor.value));
  els.bgSelect.addEventListener('change', async () => {
    if (els.bgSelect.value && els.bgSelect.value !== currentBackground) { showBackgroundPreview(els.bgSelect.value); return; }
    hideBackgroundPreview();
    try { const view = activeSceneView(); view.background = els.bgSelect.value; if (view.background) view.onboardingDone = true; await loadBackgrounds(); scheduleSave(true); } catch (error) { notify(error.message, true); }
  });
  els.bgDownload.addEventListener('click', () => downloadBackgroundFile(els.bgSelect.value));
  els.bgDelete?.addEventListener('click', async () => { const name = els.bgSelect.value; if (!name || !await appConfirm({ title: 'Usunąć tło?', message: `Tło „${name}” zostanie trwale usunięte ze wszystkich widoków.`, confirmText: 'Usuń', danger: true })) return; try { await api('background/delete', jsonOptions({ name })); Object.values(model.views).forEach(view => { if (view.background === name) view.background = ''; if (view.nightBackground === name) view.nightBackground = ''; if (view.backgroundTransforms) delete view.backgroundTransforms[name]; }); currentBackground = ''; scheduleSave(true); await loadBackgrounds(); notify('Usunięto tło'); } catch (error) { notify(error.message, true); } });
  $('#reload-integrations').addEventListener('click', () => { integrations = []; integrationEntities.clear(); openIntegrations.clear(); loadIntegrations(true); });
  els.integrationSearch?.addEventListener('input', () => {
    integrationSearchText = els.integrationSearch.value;
    clearTimeout(integrationSearchTimer);
    integrationSearchTimer = setTimeout(runIntegrationSearch, 220);
  });
  els.integrationList.addEventListener('click', event => {
    const unusedSummary = event.target.closest('.unused-integrations > summary'), flow = event.target.closest('[data-add-flow]'), add = event.target.closest('[data-add]'), summary = event.target.closest('.integration-summary');
    if (unusedSummary) { event.preventDefault(); unusedIntegrationsOpen = !unusedIntegrationsOpen; renderIntegrations(); }
    else if (flow) addFlow(flow.dataset.addFlow, flow.dataset.entry);
    else if (add) addEntity(add.dataset.add, add.dataset.entry);
    else if (summary) toggleIntegration(summary.closest('.integration').dataset.integration);
  });
  els.addedList.addEventListener('click', async event => {
    const show = event.target.closest('[data-added-show]'), remove = event.target.closest('[data-added-remove]');
    if (show) {
      const kind = show.dataset.addedShow, id = show.dataset.id; showMainView('overview'); if (!editMode) els.editToggle.click();
      if (kind === 'marker') { if (bringIntoScene(model.entities[id])) scheduleSave(true); selectMarker(id); }
      else if (kind === 'flow') openFlowEditor(id);
      else if (kind === 'room') openRoomEditor(id);
      return;
    }
    if (!remove) return;
    const kind = remove.dataset.addedRemove, id = remove.dataset.id, view = activeSceneView();
    const name = kind === 'marker' ? model.entities[id]?.displayName : kind === 'flow' ? view?.flows?.[id]?.displayName : view?.rooms?.[id]?.name;
    const titles = { marker:'Usunąć marker?', flow:'Usunąć Flow?', room: isIconRoom(view?.rooms?.[id]) ? 'Usunąć etykietę?' : 'Usunąć pomieszczenie?' };
    if (!await appConfirm({ title: titles[kind], message: `„${name || id}” zniknie z tego widoku razem ze swoimi ustawieniami.`, confirmText:'Usuń', danger:true })) return;
    if (kind === 'marker') removeMarker(id);
    else if (kind === 'flow') { if (selectedFlowId === id) closeFlowEditor(); removeFlow(id); }
    else if (kind === 'room' && view?.rooms?.[id]) { if (selectedRoomId === id) closeRoomEditor(); delete view.rooms[id]; if (removeRoomIcon(view, id)) renderMarkers(); renderRooms(); renderAdded(); updateEmptyState(); scheduleSave(true); notify(titles.room === 'Usunąć etykietę?' ? 'Usunięto etykietę' : 'Usunięto pomieszczenie'); }
  });
  document.querySelectorAll('.selection i').forEach(handle => handle.addEventListener('pointerdown', startResize));
  document.querySelectorAll('.flow-selection i').forEach(handle => handle.addEventListener('pointerdown', startFlowResize));
  els.image.addEventListener('load', () => { updateSceneGeometry(); applyBackgroundTransform(); });
  window.addEventListener('resize', dropGestureLayer);
  document.addEventListener('focusin', event => { if (event.target?.matches?.(TEXT_FIELD)) dropGestureLayer(); });
  window.addEventListener('resize', () => { syncDock(); applyBackgroundTransform(); syncMobileOrientation(); });
  $$('[data-dock-side]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); toggleDockSide(); }));
  $$('.head-preview').forEach(button => button.addEventListener('click', onHeadPreview));
  const zoomToggle = $('#view-zoom-toggle');
  if (zoomToggle) { syncZoomToggle(); zoomToggle.addEventListener('click', () => { const view = activeSceneView(); if (!view) return; view.viewZoomLock = !view.viewZoomLock; view.updatedAt = new Date().toISOString(); syncZoomToggle(); scheduleSave(true); }); }
  const glowSelect = $('#glow-blend-select'); if (glowSelect) { glowSelect.value = ['normal', 'screen'].includes(model.settings?.glowBlend) ? model.settings.glowBlend : 'auto'; glowSelect.addEventListener('change', () => { model.settings ||= {}; model.settings.glowBlend = glowSelect.value; scheduleSave(true); renderRooms(); }); }
  const dockSelect = $('#dock-side-select'); if (dockSelect) { dockSelect.value = dockSide(); dockSelect.addEventListener('change', () => { if (dockSelect.value !== dockSide()) toggleDockSide(); }); }
  window.visualViewport?.addEventListener('resize', () => { if (mobileView()) applyBackgroundTransform(); fitWizardList(); refocusWhileTyping(); });
  document.addEventListener('focusin', event => {
    const t = event.target;
    if (mobileView() && editMode && t?.matches?.('input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]),textarea') && t.closest('aside.editor.visible')) startEditorTyping(t);
    if (t?.matches?.('input,textarea')) refocusWhileTyping();
  });
  document.addEventListener('focusout', event => { if (!editorTyping || event.target !== editorTyping.input) return; setTimeout(() => { if (editorTyping && document.activeElement !== editorTyping.input) endEditorTyping(); }, 0); });
  // Enter in an editor field closes the on-screen keyboard instead of jumping to the next field.
  document.addEventListener('focusin', event => { const el = event.target; if (el?.matches?.('.editor input:not([type=range]):not([type=checkbox]):not([type=color])')) el.enterKeyHint = 'done'; });
  document.addEventListener('keydown', event => { const el = event.target; if (event.key === 'Enter' && !event.isComposing && el?.matches?.('.editor input:not([type=range]):not([type=checkbox]):not([type=color])')) { event.preventDefault(); el.blur(); } });
  if ('ResizeObserver' in window) new ResizeObserver(updateSceneGeometry).observe(els.scene);
  els.zoomOut?.addEventListener('click', () => setViewZoom(viewZoom-.5)); els.zoomIn?.addEventListener('click', () => setViewZoom(viewZoom+.5)); els.zoomReset?.addEventListener('click', resetViewZoom);
  // A double tap on a room corner removes the corner; the browser also turns those two taps into a dblclick,
  // which must not toggle the zoom (on a phone the view used to jump back to 100 %).
  els.viewport?.addEventListener('dblclick', event => { if (roomDraft || performance.now() - handleTapAt < 800 || event.target.closest?.('.room-handle, #room-edit-layer') || viewZoomLocked()) return; if (sceneCameraActive()) setViewZoom(viewZoom > 1 ? 1 : 2, event.clientX, event.clientY); });
  els.viewport?.addEventListener('wheel', event => {
    if (mobileView()) return;
    event.preventDefault(); if (viewZoomLocked()) return;
    setViewZoom(viewZoom * Math.exp(-event.deltaY * .0015), event.clientX, event.clientY);
  }, { passive: false });
  // Touch gestures and desktop mouse dragging are deliberately separate.
  els.editorContent?.addEventListener('focusin', resetViewportPointers);
  els.scene?.addEventListener('mousedown', startDesktopPan);
  window.addEventListener('pointerdown', trackTouchDown, true); window.addEventListener('pointermove', trackTouchMove, true); window.addEventListener('pointerup', trackTouchUp, true); window.addEventListener('pointercancel', trackTouchUp, true);
  els.scene?.addEventListener('pointerdown', viewportPointerDown);
  // Zoomed out below the plan's size (editing on a phone) the fingers may also land on the empty space around it.
  els.viewport?.addEventListener('pointerdown', event => { if (!els.scene?.contains(event.target)) viewportPointerDown(event); });
  els.sceneCard?.parentElement?.addEventListener('pointerdown', event => { if (event.target.closest?.('.swipe-preview')) viewportPointerDown(event); }); els.scene?.addEventListener('pointermove', viewportPointerMove);
  els.scene?.addEventListener('pointerup', viewportPointerUp); els.scene?.addEventListener('pointercancel', viewportPointerUp); els.scene?.addEventListener('lostpointercapture', viewportPointerUp);
  window.addEventListener('pointermove', viewportPointerMove); window.addEventListener('pointerup', viewportPointerUp); window.addEventListener('pointercancel', viewportPointerUp);
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('.compact-menu,.vm,#settings-toggle,#edit-toggle,#view-manage,#snap-menu-button,.editor,.app-confirm,.bg-manager,#canvas-resize-bar,.canvas-handle')) return;
    closeCompactMenus();
  });
  // Only a real return to the page resets gestures; a window 'focus' can arrive right after touching the screen in the HA app.
  const resumeApp = event => { if (event?.type !== 'focus') { abortViewSwipe(); resetViewportPointers(); } resumeLiveConnection(); };
  // Fallback if the WebView swallows pointerup/pointercancel of a swipe.
  window.addEventListener('touchend', event => { if (viewSwipe && !event.touches.length) { viewPointers.delete(viewSwipe.id); finishViewSwipe({ clientX: viewSwipe.lastX ?? viewSwipe.x, clientY: viewSwipe.lastY ?? viewSwipe.y }); } }, { passive:true });
  window.addEventListener('touchcancel', event => { activeTouches = event.touches.length; if (viewSwipe) { abortViewSwipe(); resetViewportPointers(); } }, { passive:true });
  window.addEventListener('touchstart', event => { touchEventsSeen = true; activeTouches = event.touches.length; }, { passive:true, capture:true });
  window.addEventListener('touchend', event => { activeTouches = event.touches.length; }, { passive:true, capture:true });
  setInterval(swipeWatchdog, 300);
  ['pointerdown','pointerup','pointercancel','lostpointercapture'].forEach(type => window.addEventListener(type, event => { if (swipeDebug && event.pointerType !== 'mouse') swipeLog(`${type} #${event.pointerId}${viewSwipe?.id === event.pointerId ? ' (gest)' : ''}`); }, { capture:true, passive:true }));
  ['touchstart','touchend','touchcancel'].forEach(type => window.addEventListener(type, event => { if (swipeDebug) swipeLog(`${type} palce=${event.touches.length}`); }, { capture:true, passive:true }));
  ['focus','blur','pageshow'].forEach(type => window.addEventListener(type, () => { if (swipeDebug) swipeLog(`okno: ${type}`); }));
  document.addEventListener('visibilitychange', () => { if (swipeDebug) swipeLog(`widoczność: ${document.visibilityState}`); });
  $('#swipe-debug-toggle')?.addEventListener('change', event => setSwipeDebug(event.target.checked));
  $('#ha-start-select')?.addEventListener('change', event => setHaStart(event.target.value)); syncHaStartSelect(); repairBrokenDefaultPanel();
  if ($('#swipe-debug-toggle')) $('#swipe-debug-toggle').checked = swipeDebug;
  if (swipeDebug) swipeLog('diagnostyka włączona');
  document.addEventListener('visibilitychange', resumeApp);
  window.addEventListener('pageshow', resumeApp); window.addEventListener('focus', resumeApp); window.addEventListener('blur', () => { abortViewSwipe(); resetViewportPointers(); });
}
function startResize(event) {
  const marker = model.entities[selectedId];
  if (!editMode || !marker || marker.geometryLocked || event.button !== 0 || (event.buttons & 1) !== 1) return;
  event.preventDefault(); event.stopPropagation();
  const handle = event.currentTarget.dataset.handle, scale = sceneScale || 1, node = markerNode(marker.id);
  if (!node) return;
  const initialRect = node.getBoundingClientRect(), fixed = { x:handle.includes('w') ? initialRect.right : initialRect.left, y:handle.includes('n') ? initialRect.bottom : initialRect.top };
  const start = { x:event.clientX, y:event.clientY, w:Number(marker.style.width), h:Number(marker.style.height), px:marker.xPercent, py:marker.yPercent }; let changed = false, lastValid = { w:start.w, h:start.h, x:start.px, y:start.py };
  const move = e => {
    if ((e.buttons & 1) !== 1) return finish();
    const sx = handle.includes('w') ? -1 : 1, sy = handle.includes('n') ? -1 : 1; changed = true;
    const minWidth = isGaugeType(marker.type) ? 44 : marker.type === 'icon' ? 24 : 36, minHeight = isGaugeType(marker.type) ? 28 : marker.type === 'icon' ? 24 : 24;
    // The moving edges snap to the visible grid lines (screen px per style px from the size when grabbed).
    const kx = initialRect.width / Math.max(1, start.w), ky = initialRect.height / Math.max(1, start.h), toGrid = (size, k, fixedAt, sign, horizontal) => { const edge = fixedAt + sign * size * k, line = gridLineNear(edge, horizontal); return line === null ? size : Math.abs(line - fixedAt) / k; };
    marker.style.width = clamp(Math.round(toGrid(clamp(start.w + (e.clientX-start.x)*sx/scale, 1, 2400), kx, fixed.x, sx, true)),minWidth,2400);
    marker.style.height = clamp(Math.round(toGrid(clamp(start.h + (e.clientY-start.y)*sy/scale, 1, 1800), ky, fixed.y, sy, false)),minHeight,1800);
    // The scene may be re-rendered during the gesture (live states); always measure the node that is on screen.
    const live = node.isConnected ? node : markerNode(marker.id);
    if (!live) return;
    marker.xPercent = start.px; marker.yPercent = start.py; applyMarkerStyle(live, marker);
    const sceneRect = els.scene.getBoundingClientRect(), current = live.getBoundingClientRect();
    if (!sceneRect.width || !sceneRect.height || !current.width || !current.height) return;
    marker.xPercent = clamp(marker.xPercent + (fixed.x - (handle.includes('w') ? current.right : current.left)) / sceneRect.width * 100, 0, 100);
    marker.yPercent = clamp(marker.yPercent + (fixed.y - (handle.includes('n') ? current.bottom : current.top)) / sceneRect.height * 100, 0, 100);
    applyMarkerStyle(live, marker);
    if (keepInBounds() && nodeOutsideScene(live)) {
      // Keep growing along the axis that still fits: first new width with the last good height, then the reverse.
      const wanted = { w:marker.style.width, h:marker.style.height }, placeAt = (w, h) => {
        Object.assign(marker.style, { width:w, height:h }); marker.xPercent = start.px; marker.yPercent = start.py; applyMarkerStyle(live, marker);
        const rect = live.getBoundingClientRect();
        marker.xPercent = clamp(marker.xPercent + (fixed.x - (handle.includes('w') ? rect.right : rect.left)) / sceneRect.width * 100, 0, 100);
        marker.yPercent = clamp(marker.yPercent + (fixed.y - (handle.includes('n') ? rect.bottom : rect.top)) / sceneRect.height * 100, 0, 100);
        applyMarkerStyle(live, marker); return !nodeOutsideScene(live);
      };
      if (!placeAt(wanted.w, lastValid.h) && !placeAt(lastValid.w, wanted.h)) { Object.assign(marker.style, { width:lastValid.w, height:lastValid.h }); marker.xPercent = lastValid.x; marker.yPercent = lastValid.y; applyMarkerStyle(live, marker); }
    }
    lastValid = { w:marker.style.width, h:marker.style.height, x:marker.xPercent, y:marker.yPercent };
    syncSelection();
  };
  const finish = () => {
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
    if (changed) { marker.updatedAt = new Date().toISOString(); scheduleSave(true); openEditor(); }
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
}

function isViewer() { return access?.viewer === true; }
function applyViewerMode() {
  if (!isViewer()) return;
  editMode = false; selectedId = null; closeEditor?.();
  els.body.classList.remove('editing'); els.body.classList.add('viewer-mode');
  [els.editToggle, els.viewManage, els.settingsToggle, els.integrationsButton].forEach(el => {
    if (!el) return;
    el.hidden = true;
    el.style.display = 'none';
  });
  els.viewSwitcher?.remove();
  els.settingsMenu?.remove();
}

const LANGUAGE_CACHE_KEY = 'ha_views_language';
let appRevealed = false;
// Scene content stays hidden (CSS: .app-booting) until the saved layout, the
// background list and the first entity states are known, so the start view
// never flashes onboarding panels or "unavailable" marker colours.
function revealApp() {
  if (appRevealed) return; appRevealed = true;
  document.documentElement.classList.remove('app-booting');
}
const settleWithin = (promise, ms) => Promise.race([Promise.resolve(promise).catch(() => {}), new Promise(resolve => setTimeout(resolve, ms))]);
async function boot() {
  const revealFallback = setTimeout(revealApp, 5000);
  bindEvents();
  bindLanguageObserver();
  try { const cachedLanguage = localStorage.getItem(LANGUAGE_CACHE_KEY); if (cachedLanguage === 'pl' || cachedLanguage === 'en') { uiLanguage = cachedLanguage; applyLanguage(); } } catch {}
  // Independent start-up requests run in parallel instead of one after another.
  const accessRequest = api('access').catch(() => ({ viewer: true }));
  const layoutRequest = api('rewrite_state').then(data => ({ data }), error => ({ error }));
  const backgroundsRequest = api('backgrounds').catch(error => error instanceof Error ? error : new Error(String(error)));
  const iconsReady = new Promise(resolve => { const link = document.getElementById('mdi-stylesheet'); if (!link || link.sheet) return resolve(); link.addEventListener('load', resolve, { once:true }); link.addEventListener('error', resolve, { once:true }); });
  access = await accessRequest;
  applyViewerMode();
  let legacyMigrated = false;
  try { const layout = await layoutRequest; if (layout.error) throw layout.error; const saved = layout.data; if (saved.exists && (saved.data?.entities || saved.data?.views)) { model = saved.data; if (saved.data.views) syncBase = layoutSnapshot(saved.data); } else legacyMigrated = await migrateLegacy(); }
  catch (error) { notify(`Nie udało się wczytać układu: ${error.message}`, true); }
  model.settings = { snapEnabled: true, snapStep: .25, designWidth: DESIGN_WIDTH, language: 'en', ...(model.settings || {}) };
  serverRevision = model.revision = Number(model.revision) || 0;
  uiLanguage = model.settings.language === 'pl' ? 'pl' : 'en';
  try { localStorage.setItem(LANGUAGE_CACHE_KEY, uiLanguage); } catch {}
  applyLanguage();
  const roomLabelsMigrated = Object.values(model.views || {}).flatMap(view => Object.values(view.rooms || {})).map(migrateRoomLabel).some(Boolean);
  const multiMigrated = ensureMultiViewModel() || roomLabelsMigrated; const gridPresetMigrated = migrateGridPresetSteps(); applySnapUi(); applyBoundsUi(); renderViewSelector();
  Object.values(model.views).flatMap(view => Object.values(view.entities || {})).forEach(m => {
    m.type = ['badge','gauge','icon','horseshoe','thermostat'].includes(m.type) ? m.type : 'badge'; m.style = normalizedStyle(m.type, m.style);
    m.stateOnLabel ??= ''; m.stateOffLabel ??= ''; m.iconMode ||= 'auto'; m.iconName ??= ''; m.iconOn ??= ''; m.iconOff ??= ''; m.iconVariantEnabled ??= Boolean(m.iconOn || m.iconOff);
  });
  const iconHorizontalMigrated = migrateIconHorizontalBaseline();
  const gaugeMigrated = migrateGaugeZeroOffsets();
  const horseshoeMigrated = migrateHorseshoeBaseline();
  if (legacyMigrated || multiMigrated || gridPresetMigrated || iconHorizontalMigrated || gaugeMigrated || horseshoeMigrated) scheduleSave(true);
  attachActiveEntities(); updateSceneGeometry(); renderMarkers(); resetViewZoom();
  mobileOrientation = mobileView() ? (layoutViewportHeight() > innerWidth ? 'portrait' : 'landscape') : 'desktop';
  // Live states are requested now, in parallel with the background image.
  const statesReady = refreshStates();
  await loadBackgrounds(true, false, backgroundsRequest, 2500);
  attachActiveEntities(); updateSceneGeometry(); renderMarkers();
  await settleWithin(Promise.all([statesReady, iconsReady]), 1500);
  clearTimeout(revealFallback); revealApp();
  connectEvents();
  try { const message = sessionStorage.getItem(RELOAD_MESSAGE_KEY); sessionStorage.removeItem(RELOAD_MESSAGE_KEY); if (message) notify(message); } catch {}
  setInterval(checkRemoteLayout, 20000);
  prebuildSwipePreviews(); window.addEventListener('resize', prebuildSwipePreviews); window.addEventListener('resize', placeViewSheet); placeViewSheet();
}

boot();
