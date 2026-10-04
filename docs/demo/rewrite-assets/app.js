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
    "Encja i kierunek":"Entity and direction","Aktualna wartość":"Current value","Sterowanie":"Control","Stały kierunek":"Fixed direction","Kierunek wg znaku + / −":"Direction by sign + / −","Kierunek dla +":"Direction for +","Kierunek dla −":"Direction for −","Osobny styl dla −":"Separate style for −","Prawo":"Right","Lewo":"Left","Próg aktywności":"Activity threshold","Ukryj poniżej progu":"Hide below threshold","Flow jest nieaktywny, gdy |wartość| ≤ próg — np. próg 0 wyłącza strzałki fotowoltaiki przy 0 W w nocy. Nieaktywny Flow jest przygaszony i bez animacji albo, z opcją ukrywania, całkiem niewidoczny. W trybie edycji ukryty Flow ma tylko przerywaną ramkę, żeby dało się go kliknąć.":"Flow is inactive when |value| ≤ threshold — e.g. a threshold of 0 turns off the solar arrows at 0 W at night. An inactive Flow is dimmed without animation or, with hiding enabled, fully invisible. In edit mode a hidden Flow shows only a dashed frame so it can still be clicked.","Kształt":"Shape","Rodzaj":"Type","Chevron":"Chevron","Strzałka":"Arrow","Grot":"Arrowhead","Trójkąt":"Triangle","Segment":"Segment","Liczba":"Count","Grubość trzonu":"Shaft thickness","Rozmiar i pozycja":"Size and position","Odstęp":"Spacing","Korekta obrotu":"Rotation offset","Długość i szerokość to rozmiar ramki liczony względem kierunku strzałki. Liczba i odstęp rozkładają elementy wewnątrz ramki i nie zmieniają jej rozmiaru.":"Length and width are the frame size, measured along the arrow direction. Count and spacing arrange the items inside the frame and do not change its size.","Kolory i wygląd":"Colours and appearance","Kolor dla +":"Colour for +","Kolor dla −":"Colour for −","Obrys":"Outline","Kolor obrysu":"Outline colour","Poświata":"Glow","Osobny kolor poświaty":"Separate glow colour","Kolor poświaty":"Glow colour","Krycie":"Opacity","Animacja":"Animation","Typ":"Type","Brak":"None","Pulsowanie":"Pulse","Przepływ":"Flow","Tempo":"Speed","Tempo od wartości":"Speed follows value","Pełne tempo przy":"Full speed at","Wartość +":"Value +","Wartość −":"Value −","Styl dla +":"Style for +","Styl dla −":"Style for −","Styl wspólny dla + i −":"Shared style for + and −","Podgląd i edycja dla wartości dodatniej.":"Preview and editing for a positive value.","Podgląd i edycja dla wartości ujemnej.":"Preview and editing for a negative value.","Każda strona ma własny styl.":"Each side has its own style.","Kształt, rozmiar i animacja są wspólne — kolor jest osobny.":"Shape, size and animation are shared — only the colour is separate.","Kopiuj styl Flow":"Copy Flow style","Wklej styl Flow":"Paste Flow style","Usuń Flow":"Delete Flow","Dodaj Flow testowy":"Add Flow","Skopiowano styl Flow — wklej go w innym Flow":"Flow style copied — paste it into another Flow","Wklejono styl Flow":"Flow style pasted","Przywrócono domyślny Flow":"Flow defaults restored","Dodano Flow — przeciągnij go w trybie edycji":"Flow added — drag it in edit mode","Usunięto Flow":"Flow removed","Przywrócić domyślny Flow?":"Restore Flow defaults?","Obecne ustawienia wyglądu i działania Flow zostaną zastąpione domyślnymi. Pozycja i nazwa zostaną zachowane.":"The current Flow appearance and behaviour settings will be replaced with defaults. Position and name are kept.","Usunąć Flow?":"Delete Flow?","Kolor ON":"ON colour","Kolor OFF":"OFF colour","Kolor obrysu ON":"ON outline colour","Kolor obrysu OFF":"OFF outline colour","Grubość obrysu":"Outline thickness","Grubość obrysu ON":"ON outline thickness","Grubość obrysu OFF":"OFF outline thickness","Grubość ON":"ON thickness","Grubość OFF":"OFF thickness","Zależne ON/OFF":"Depends on ON/OFF","Przezrocz. ON":"ON opacity","Przezrocz. OFF":"OFF opacity","Lewo / prawo":"Left / right","Góra / dół":"Up / down","Prostokąt":"Rectangle","Zaokrąglony":"Rounded","Koło / owal":"Circle / oval","Gradient":"Gradient","Auto":"Auto","Monospace":"Monospace","Przywróć domyślną wartość":"Restore default value","Wybierz kolor":"Choose colour","Własny kolor":"Custom colour","Własny kolor RGB":"Custom RGB colour","Podaj kolor w formacie #RRGGBB.":"Enter a colour in #RRGGBB format.","Ustaw":"Set","Typ markera i jego ustawienia wyglądu zostaną zastąpione domyślnymi.":"The marker type and its appearance settings will be replaced with defaults.","Zmień":"Change","Nie można przełączyć encji w tym stanie.":"This entity cannot be toggled in its current state.","Stan encji nie został jeszcze potwierdzony.":"The entity state has not been confirmed yet.","Błąd encji":"Entity error","Błąd przełączania":"Toggle error","Nie udało się pobrać historii":"Could not load history","Pobierz tło":"Download background","Wybierz tło widoku":"Choose view background","Wgraj nowy obraz":"Upload a new image","Wybierz istniejące tło":"Choose an existing background","Wybierz istniejące tło…":"Choose an existing background…","Załaduj wybrane tło":"Load selected background","Wybierz kolor tła":"Choose background colour","Format kolorowego tła":"Colour background format","Usunąć tło?":"Delete background?","Zresetować dopasowanie tła?":"Reset background fit?","Skala, pozycja i tryb dopasowania tego tła wrócą do wartości domyślnych.":"Scale, position and fit mode of this background will return to defaults.","Resetuj":"Reset","Brak aktywnych integracji.":"No active integrations.","Brak encji.":"No entities.","Brak historii w wybranym okresie.":"No history in the selected period.","Brak pasujących encji.":"No matching entities.","Nie dodano jeszcze żadnych elementów.":"Nothing has been added yet.","Widok ogólny":"Overview",
    "Brak entity_id":"Missing entity_id","Brak entry_id":"Missing entry_id","Brak listy encji":"Missing entity list","Brak pliku":"No file","Dane muszą być obiektem JSON":"Data must be a JSON object","Dozwolone: PNG, JPG, JPEG, WEBP":"Allowed: PNG, JPG, JPEG, WEBP","Layout jest za duży":"Layout is too large","Layout musi być obiektem JSON":"Layout must be a JSON object","Nie znaleziono tła":"Background not found","Nieprawidlowa encja":"Invalid entity","Nieprawidłowy JSON":"Invalid JSON","Plik stylów jest za duży":"Style file is too large","Stan jest za duży":"State is too large","Stan musi być obiektem JSON":"State must be a JSON object",
    "Cofnij":"Undo","Przywrócono widok":"View restored","Usunięto widok":"View deleted","Widok jest pusty.":"The view is empty.","Usuń widok":"Delete view","Usunąć widok?":"Delete view?",
    "Długość ramki":"Frame length","Długość elementu":"Item length","Długość ramki i szerokość to rozmiar ramki liczony względem kierunku strzałki. Długość elementu to rozmiar jednej strzałki. Liczba i odstęp nie zmieniają ani ramki, ani kształtu strzałek — elementy są wyśrodkowane w ramce, a to, co się nie mieści, jest przycinane.":"Frame length and width are the frame size, measured along the arrow direction. Item length is the size of a single arrow. Count and spacing change neither the frame nor the arrow shape — items are centred in the frame and anything that does not fit is clipped.",
    "Duplikuj Flow":"Duplicate Flow","Utworzono kopię Flow — przeciągnij ją w wybrane miejsce":"Flow copy created — drag it where you want","Utworzono kopię markera — przeciągnij ją w wybrane miejsce":"Marker copy created — drag it where you want","Duplikuj marker":"Duplicate marker","Grupa":"Group","Wymiary":"Dimensions","Położenie":"Position","Przezrocz. obrysu":"Outline opacity","Zależne ON/OFF":"Depends on ON/OFF","Grubość ON":"Width ON","Grubość OFF":"Width OFF","Źródło":"Source","Z encji":"From entity","Logo integracji":"Integration logo","Własna ikona MDI":"Custom MDI icon","Kształt":"Shape","Kwadrat":"Square","Koło":"Circle","Dowolny":"Custom","Ramka":"Border","Podgląd stanu":"State preview","Grupuj ikonę, nazwę i stan":"Group icon, name and state","Ikona, nazwa i stan są jedną grupą ze wspólnym tłem. Układ i styl ustawiasz niżej, a położenie części w grupie — w sekcjach Nazwa i Stan.":"Icon, name and state are one group with a shared background. Set the layout and style below, and the position of the parts inside the group in the Name and State sections.","Na planie w trybie edycji możesz przeciągać grupę albo jej części palcem lub myszą.":"In edit mode you can drag the group or its parts on the plan with a finger or the mouse.","Jedno pod drugim":"Stacked","Obok siebie":"Side by side","Ikona z lewej":"Icon on the left","Ikona z prawej":"Icon on the right","Styl":"Style","Bez tła":"No background","Ciemne":"Dark","Jasne":"Light","Szkło":"Glass","Kolor pokoju":"Room colour","Wyrównanie":"Alignment","Do lewej":"Left","Do środka":"Centre","Do prawej":"Right","Rozmycie pod spodem":"Blur behind","Kolor ramki":"Border colour","Przezrocz. ramki":"Border opacity","Grubość ramki":"Border width","Margines":"Padding","Odstęp":"Gap","Rozmiar całości":"Overall size","Przesunięcie w grupie: poziomo":"Offset in group: horizontal","Przesunięcie w grupie: pionowo":"Offset in group: vertical","Ikona, nazwa i stan jako jeden element":"Icon, name and state as one element","Przeciągnięcie dowolnej części przesuwa całą etykietę.":"Dragging any part moves the whole label.","Ikona, nazwa i stan są osobno — każdą część przesuwasz oddzielnie. Włącz „Grupuj ikonę, nazwę i stan”, aby połączyć je w jedną grupę.":"Icon, name and state are separate — each part is moved on its own. Turn on “Group icon, name and state” to join them into one group.","Efekt światła":"Light effect","Pozycja na ścianie":"Position on the wall","Kolor tła":"Background colour","Przezrocz. ON":"Opacity ON","Przezrocz. OFF":"Opacity OFF","Na planie w trybie edycji możesz przeciągać ikonę, nazwę i stan palcem albo myszą.":"In edit mode you can drag the icon, name and state on the plan with a finger or the mouse.","Pokaż ikonę":"Show icon","Pokaż nazwę":"Show name","Pokaż stan":"Show state","Kolor ikony ON":"Icon colour ON","Kolor ikony OFF":"Icon colour OFF","Kolor tekstu":"Text colour","Tło etykiety":"Label background","Przezrocz. tła":"Background opacity","Układ":"Layout","Pionowo":"Vertical","Poziomo":"Horizontal","Wł.":"On","Wył.":"Off","automatyczna":"automatic","Ikona, nazwa i stan rysowane na środku pomieszczenia. Dotknięcie etykiety działa jak dotknięcie pomieszczenia.":"Icon, name and state drawn in the middle of the room. Tapping the label works like tapping the room.","Dodaj do widoku":"Add to view","Wybierz wygląd dla tej encji":"Choose a look for this entity","Wybierz, co chcesz dodać":"Choose what you want to add","Dodano pomieszczenie":"Room added","Nazwa ikony":"Icon name","Encje ikony":"Icon entities","Zaznacz encje, od których zależy stan ikony — światło, włącznik, czujnik… Możesz wybrać kilka.":"Tick the entities the icon state depends on — a light, a switch, a sensor… You can pick several.","Wyszukaj i wybierz encje, od których zależy stan ikony (światło, włącznik, czujnik…).":"Search and pick the entities the icon state depends on (a light, a switch, a sensor…).","Ogólne":"General","Encje":"Entities","Dodano ikonę":"Icon added","Co ma być widać?":"What should be shown?","Utwórz ikonę":"Create icon","Wybierz, co pokazać. Resztę zmienisz potem w panelu.":"Choose what to show. You can change the rest later in the panel.","Ta ikona nie ma jeszcze encji — wybierz je w trybie edycji":"This icon has no entities yet — pick them in edit mode","Utworzono kopię ikony":"Icon copy created","Encje pomieszczenia":"Room entities","Zaznacz encje, od których zależy stan pomieszczenia — światło, włącznik, czujnik… Możesz wybrać kilka.":"Tick the entities the room state depends on — a light, a switch, a sensor… You can pick several.","Wyszukaj i wybierz encje, od których zależy stan pomieszczenia (światło, włącznik, czujnik…).":"Search and pick the entities the room state depends on (a light, a switch, a sensor…).","Obszar ze stanem encji":"Area showing entity state","Nazwa pomieszczenia":"Room name","Co zapala to pomieszczenie?":"What lights up this room?","Dalej":"Next","Pomiń":"Skip","Wpisz nazwę, obszar albo entity_id.":"Type a name, area or entity_id.","Dodano pomieszczenie — encje możesz dodać w panelu":"Room added — you can add entities in the panel","Puste = nazwa automatyczna":"Empty = automatic name","Zaznacz encje (np. światła). Możesz wybrać kilka.":"Tick the entities (e.g. lights). You can pick several.","Szukaj encji":"Search entities","Wybierz encję dla tego elementu":"Choose an entity for this element","Zmień typ":"Change type","Wyszukaj i wybierz encje (np. światła), które zapalają to pomieszczenie.":"Search and pick the entities (e.g. lights) that light up this room.","Wybierz typ albo encję — kolejność dowolna":"Pick a type or an entity — in any order","Co dodać?":"What to add?","Encja":"Entity","— tylko encje liczbowe":"— numeric entities only","— opcjonalnie dla Pomieszczenia, Flow i Tekstu":"— optional for Room, Flow and Text","Szukaj: nazwa, obszar, entity_id…":"Search: name, area, entity_id…","Szukaj encji":"Search entities","Wszystkie":"All","Ostatnie":"Recent","Bez obszaru":"No area","Obszary":"Areas","Typy":"Types","Światła":"Lights","Przełączniki":"Switches","Czujniki":"Sensors","Czujniki binarne":"Binary sensors","Rolety":"Covers","Klimat":"Climate","Media":"Media","Inne":"Other","Wczytywanie encji…":"Loading entities…","Ten element nie potrzebuje encji.":"This element needs no entity.","Brak ostatnio dodanych encji.":"No recently added entities.","Brak pasujących encji.":"No matching entities.","na widoku":"on view","Pokazano":"Showing","zawęż wyszukiwanie":"narrow the search","Wybierz, co dodać":"Choose what to add","Wybierz typ":"Choose a type","Wybierz encję":"Choose an entity","Dodaj":"Add","Polecane":"Suggested","Zmień":"Change","Dla wartości liczbowych":"For numeric values","Bez encji":"No entity","Ikona":"Icon","Tekst / przycisk":"Text / button","Pomieszczenie":"Room","Światło, gniazdko, przełącznik":"Light, socket, switch","Temperatura, wilgotność, stan":"Temperature, humidity, state","Moc, poziom, procent":"Power, level, percent","Moc, bateria, zużycie":"Power, battery, usage","Obszar świeci od encji":"Area lit by an entity","Przepływ energii, wody":"Energy or water flow","Podpis, link do widoku, akcja":"Label, view link, action","Podpis":"Label","Przycisk":"Button","Wskaż miejsce na planie":"Pick the spot on the plan","Anuluj":"Cancel","Zamknij":"Close","Dotknij plan w miejscu, gdzie ma stanąć element":"Tap the plan where the element should go","Anulowano dodawanie":"Adding cancelled","Dodano":"Added","Dodano Flow":"Flow added","Poziom":"Level","Bateria":"Battery","Salon":"Living room",
    "Ostrość":"Sharpness",
    "Układ został zmieniony na innym urządzeniu — wczytano najnowszą wersję. Ostatnia zmiana z tego urządzenia nie została zapisana.":"The layout was changed on another device — the latest version was loaded. The last change from this device was not saved.","Układ zmieniono na innym urządzeniu":"Layout changed on another device","Wczytaj":"Load","Wczytano zmiany z innego urządzenia":"Loaded changes from another device","Ściemniaj tło wg słońca":"Dim the background with the sun","Jasność w nocy":"Night brightness","Zaczyna ściemniać, gdy słońce na":"Starts dimming with the sun at","Pełna noc, gdy słońce na":"Full night with the sun at","Chłodny odcień nocą":"Cool tint at night","Ściemnienie":"Dimming","słońce":"sun","Edycja":"Editing","Przenieś panel na drugą stronę":"Move the panel to the other side","Kliknij marker, Flow albo pomieszczenie, żeby je edytować.":"Click a marker, Flow or room to edit it.","Nowe elementy dodasz z menu edycji (ołówek), a przyciąganie i wyrównanie z menu magnesu.":"Add new elements from the edit menu (pencil); snapping and alignment are in the magnet menu.","Usuń narożnik":"Remove corner","Ostatnia zmiana":"Last changed","7 dni":"7 days","Tekst / przycisk":"Text / button","Tekst":"Text","Tekst i akcja":"Text and action","Podpis":"Caption","Przejdź do widoku":"Go to view","Otwórz stronę Home Assistant":"Open a Home Assistant page","Otwórz link":"Open a link","Adres w HA":"HA path","Link":"Link","W nowej karcie":"In a new tab","Dodano tekst — przeciągnij go w wybrane miejsce":"Text added — drag it into place","Link do tego widoku":"Link to this view","Kopiuj link do widoku":"Copy link to this view","Skopiowano do schowka. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.":"Copied to the clipboard. It opens HA Views directly on this view — in a browser, a bookmark or a “navigate” action of another dashboard.","Skopiuj link. Otwiera HA Views od razu na tym widoku — w przeglądarce, w zakładce albo w akcji „navigate” innego dashboardu.":"Copy the link. It opens HA Views directly on this view — in a browser, a bookmark or a “navigate” action of another dashboard.","OK":"OK","HA Views Beta":"HA Views Beta","stabilna wersja HA Views":"the stable HA Views","Beta":"Beta","Używane przez":"Used by","Usunąć tło używane przez drugą wersję?":"Delete a background used by the other version?","Zmienić nazwę tła używanego przez drugą wersję?":"Rename a background used by the other version?","Jasność":"Brightness","Przywróć 100%":"Reset to 100%","Widok":"View","Opcje":"Options","Obraz":"Image","Wgraj tło":"Upload background","Zmień nazwę pliku tła":"Rename background file","Auto — przełącza encja":"Auto — switched by the entity","Kolor zamiast obrazu":"Colour instead of an image","Wybór koloru zastąpi obraz":"Choosing a colour replaces the image","Tło w kolorze":"Colour background","Szerokość":"Width","Wysokość":"Height","Ustaw rozmiar na ekranie":"Set the size on screen","Przeciągnij kółka, aby ustawić rozmiar":"Drag the circles to set the size","Tło tego widoku":"This view's background","Ustaw jako tło tego widoku":"Use as this view's background","Tło nocne tego widoku":"This view's night background","Ustaw jako tło nocne tego widoku":"Use as this view's night background","Zmień nazwę":"Rename","Pobierz":"Download","Ustawiono tło widoku":"View background set","Zmień nazwę pliku tła?":"Rename background file?","Zmienić nazwę tła wersji stabilnej?":"Rename a stable-version background?","Zmień mimo to":"Rename anyway","Zmieniono nazwę tła":"Background renamed","Zmień":"Change","Używane w stabilnej wersji — usunięcie wymaga potwierdzenia":"Used by the stable version — deleting needs confirmation","Usunąć tło wersji stabilnej?":"Delete a stable-version background?","Usuń mimo to":"Delete anyway","Tego nie da się cofnąć.":"This cannot be undone.","Tryb tła":"Background mode","Automatycznie wg encji":"Automatic by entity","Zawsze dzień":"Always day","Zawsze noc":"Always night","Zawsze noc — encja nie jest używana":"Always night — the entity is not used","Zawsze dzień — encja nie jest używana":"Always day — the entity is not used","Pliki tła":"Background files","Usuń nieużywane":"Remove unused","plików":"files","plik":"file","pliki":"files","nieużywane":"unused","Nieużywane":"Unused","Stabilna":"Stable","noc":"night","dzień":"day","Używane w stabilnej wersji — usuń je tam":"Used by the stable version — remove it there","Usuń plik":"Delete file","Brak wgranych teł.":"No uploaded backgrounds.","Wczytywanie…":"Loading…","Usunąć plik tła?":"Delete background file?","Usunąć nieużywane tła?":"Remove unused backgrounds?","Usunięto plik tła":"Background file deleted","Tło nocne":"Night background","Bez tła nocnego":"No night background","Wgraj tło nocne":"Upload night background","Przełącza encja":"Switched by entity","Encja przełączająca tło nocne":"Entity that switches the night background","Dzień":"Day","Noc":"Night","Podgląd: dzień":"Preview: day","Podgląd: noc":"Preview: night","Podgląd tła":"Background preview","Teraz: noc":"Now: night","Teraz: dzień":"Now: day","podgląd":"preview","Najpierw ustaw tło dzienne":"Set the day background first","Ustawiono tło nocne":"Night background set","Wgrywanie…":"Uploading…","Intensywność ON":"ON intensity","Intensywność OFF":"OFF intensity","Obrót":"Rotation","Obróć zaznaczony":"Rotate selected","Obróć o 90° w lewo":"Rotate 90° left","Obróć o 15° w lewo":"Rotate 15° left","Obróć o 15° w prawo":"Rotate 15° right","Obróć o 90° w prawo":"Rotate 90° right","Bez obrotu":"No rotation","Obrót płynny":"Smooth rotation","Przyciąganie i siatka":"Snapping and grid","Linie pomocnicze":"Guides","Tylko elementy widoczne na ekranie":"Only elements visible on screen","Przyciągaj do":"Snap to","Tło (środek i krawędzie)":"Background (centre and edges)","Punkty":"Points","Środki":"Centres","Krawędzie":"Edges","Wyrównaj zaznaczony do tła":"Align selected to background","Do lewej krawędzi tła":"To the left edge","Wyśrodkuj w poziomie":"Centre horizontally","Do prawej krawędzi tła":"To the right edge","Do górnej krawędzi tła":"To the top edge","Wyśrodkuj w pionie":"Centre vertically","Do dolnej krawędzi tła":"To the bottom edge","Dodaj Flow":"Add Flow","Dodano Flow — wybierz encję albo zostaw bez encji":"Flow added — choose an entity or leave it without one","Usuń encję":"Remove entity","Podgląd: włączony":"Preview: on","Podgląd: wyłączony":"Preview: off","Tempo to stała prędkość strzałek (1× = 150 px/s) — nie zależy od rozmiaru, odstępu ani liczby, więc Flow z tym samym tempem jadą identycznie.":"Tempo is a constant arrow speed (1\u00d7 = 75 px/s) \u2014 it does not depend on size, spacing or count, so Flows with the same tempo move identically.","Ramka i pozycja":"Frame and position","Szerokość ramki":"Frame width","Strzałki":"Arrows","Długość strzałki":"Arrow length","Ramka to obszar Flow na planie, liczony wzdłuż kierunku strzałek. Szerokość ramki jest też wysokością strzałek. Uchwyty zaznaczenia zmieniają to samo.":"The frame is the Flow area on the plan, measured along the arrow direction. The frame width is also the arrow height. The selection handles change the same values.","W animacji „Przepływ” strzałki wypełniają całą ramkę, więc liczba nie ma znaczenia.":"With the “Flow” animation the arrows fill the whole frame, so the count does not matter.","Strzałki są wyśrodkowane w ramce; to, co się nie mieści, jest przycinane. Liczba i odstęp nie zmieniają ramki. Ujemny odstęp wsuwa strzałki jedna w drugą (gęściej).":"Arrows are centred in the frame; what does not fit is clipped. Count and spacing do not change the frame. A negative spacing nests the arrows into each other (denser).","Tempo pulsowania nie zależy od rozmiaru Flow.":"The pulse tempo does not depend on the Flow size.","Ustaw tę animację w pozostałych Flow tej encji":"Apply this animation to the other Flows of this entity","Ustawiono tę samą animację w innych Flow tej encji":"Same animation applied to other Flows of this entity","Granice tła":"Background bounds","Elementy nie wychodzą poza tło":"Elements stay inside the background","Elementy nie wyjdą poza tło":"Elements will stay inside the background","Elementy mogą wychodzić poza tło":"Elements may go outside the background","Edytuj ikonę":"Edit icon","Usuń ikonę":"Remove icon","Dodaj ikonę":"Add icon","Ikona pomieszczenia to zwykły marker typu Ikona z pełnym edytorem (kolory ON/OFF, obrys, tło, ramka, rozmiar, kolory wg wartości). Świeci, gdy pomieszczenie jest zapalone, a dotknięcie wykonuje akcję pomieszczenia.":"The room icon is a regular Icon marker with the full editor (ON/OFF colours, outline, background, border, size, colours by value). It is lit while the room is on, and tapping it runs the room action.","Dodano ikonę pomieszczenia — przeciągnij ją w wybrane miejsce":"Room icon added — drag it where you want it","Usunięto ikonę pomieszczenia":"Room icon removed","Markery":"Markers","Pomieszczenia":"Rooms","Markery, Flow i pomieszczenia tego widoku":"Markers, Flows and rooms of this view","Rozjaśnij — jak światło lampy: plan jaśnieje w kolorze poświaty, ciemne miejsca najmocniej.":"Lighten — like lamp light: the plan brightens in the glow colour, dark areas the most.","Miękkie światło — delikatne ocieplenie, plan zachowuje swoje kolory i kontrast.":"Soft light — a gentle tint, the plan keeps its colours and contrast.","Nakładka — mocniejszy efekt: jasne miejsca jaśnieją, ciemne ciemnieją, kolor jest wyraźny.":"Overlay — a stronger effect: light areas get lighter, dark areas darker, the colour is clear.","Zwykłe — płaski, półprzezroczysty kolor położony na plan.":"Normal — a flat, semi-transparent colour laid over the plan.","Geometria zablokowana — kliknij, aby odblokować":"Geometry locked — click to unlock","Zablokuj geometrię":"Lock geometry","Zablokowano geometrię":"Geometry locked","Odblokowano geometrię":"Geometry unlocked","Podgląd":"Preview","Rzeczywisty stan":"Actual state","Włączony":"On","Wyłączony":"Off","Usuń z pomieszczenia":"Remove from room","Dodaj do pomieszczenia":"Add to room","Z tego widoku":"From this view","Wpisz co najmniej 2 znaki.":"Type at least 2 characters.","Wyszukiwanie encji…":"Searching entities…","Brak — wyszukaj encję poniżej.":"None — search for an entity below.","Szukaj nazwy lub encji…":"Search name or entity…","Geometria jest zablokowana (kłódka u góry).":"The geometry is locked (padlock at the top).","Duplikuj pomieszczenie":"Duplicate room","Kopiuj styl pomieszczenia":"Copy room style","Wklej styl pomieszczenia":"Paste room style","Skopiowano styl pomieszczenia — wklej go w innym pomieszczeniu":"Room style copied — paste it into another room","Wklejono styl pomieszczenia":"Room style pasted","Przywrócić domyślny wygląd?":"Restore the default look?","Wygląd i akcja dotknięcia pomieszczenia wrócą do domyślnych. Kształt, nazwa i encje zostaną.":"The room look and tap action return to defaults. Shape, name and entities stay.","Przywrócono domyślny wygląd pomieszczenia":"Room look restored to default","kopia":"copy","Utworzono kopię pomieszczenia — przeciągnij ją w wybrane miejsce":"Room copied — drag it where you want it","Naprawiono błędny domyślny panel HA — ustaw go ponownie w menu widoku":"Fixed an invalid HA default panel — set it again in the view menu","Domyślny panel Home Assistant":"Home Assistant default panel","Bez zmian (ustawienia HA)":"Unchanged (HA settings)","HA Views — moje konto":"HA Views — my account","HA Views — tylko to urządzenie":"HA Views — this device only","HA Views jest teraz domyślnym panelem na Twoim koncie":"HA Views is now the default panel for your account","HA Views jest domyślnym panelem na tym urządzeniu":"HA Views is the default panel on this device","Przywrócono domyślny panel z ustawień Home Assistant":"Restored the default panel from Home Assistant settings","Otwieraj HA Views po starcie Home Assistant (to urządzenie)":"Open HA Views when Home Assistant starts (this device)","Ta opcja działa tylko w HA Views otwartym z panelu Home Assistant":"This option only works when HA Views is opened from the Home Assistant sidebar","HA Views będzie otwierać się po starcie Home Assistant na tym urządzeniu":"HA Views will open when Home Assistant starts on this device","Po starcie Home Assistant znów otworzy się domyślny dashboard":"Home Assistant will open its default dashboard again","Brak akcji":"No action","Przełącz światło":"Toggle the light","Nic":"Nothing","To pomieszczenie nie ma jeszcze encji — wybierz je w trybie edycji":"This room has no entities yet — choose them in edit mode","Błąd przełączania: ":"Toggle error: ","Pomieszczenie":"Room","Dodaj pomieszczenie":"Add room","Klikaj kolejne narożniki pomieszczenia":"Click the corners of the room one by one","Kliknij pierwszy punkt albo „Gotowe”, aby zamknąć kształt":"Click the first point or “Done” to close the shape","Cofnij punkt":"Undo point","Gotowe":"Done","Usuń pomieszczenie":"Delete room","Dodano pomieszczenie — wybierz encje, które je zapalają":"Room added — choose the entities that light it up","Pomieszczenie musi mieć co najmniej 3 narożniki":"A room needs at least 3 corners","Ten widok nie ma jeszcze encji — dodaj np. światło przez Integracje albo wpisz encję poniżej.":"This view has no entities yet — add e.g. a light via Integrations or type an entity below.","Brak encji":"No entities","Zapalają je encje":"Lit by entities","Inne encje":"Other entities","Pomieszczenie świeci, gdy włączona jest dowolna z wybranych encji (światło, gniazdko, ruch, otwarte drzwi…).":"The room lights up when any of the selected entities is on (light, plug, motion, open door…).","Wygląd":"Appearance","Efekt":"Effect","Poświata kolorem":"Colour glow","Zapalony obraz":"Lit image","Obraz zapalony":"Lit image","— wybierz —":"— choose —","Wgraj jako tło drugą wersję planu (np. render z włączonymi światłami) i wybierz ją tutaj — pomieszczenie odsłoni ją tylko w swoim kształcie. Obraz powinien mieć ten sam kadr co plan.":"Upload a second version of the plan as a background (e.g. a render with the lights on) and choose it here — the room reveals it only inside its shape. The image should have the same framing as the plan.","Kolor ze światła":"Colour from the light","Mieszanie":"Blending","Rozjaśnij":"Lighten","Miękkie światło":"Soft light","Nakładka":"Overlay","Zwykłe":"Normal","Jasność ze światła":"Brightness from the light","Intensywność":"Intensity","Miękkość krawędzi":"Edge softness","Podgląd włączonego":"Preview as on","Przeciągnij narożnik, aby go przesunąć. Mały punkt na krawędzi dodaje nowy narożnik. Dwuklik na narożniku go usuwa. Przeciągnij wnętrze, aby przesunąć całe pomieszczenie. Narożniki przyciągają się do ścian innych pomieszczeń (Alt wyłącza).":"Drag a corner to move it. The small dot on an edge adds a corner. Double-click a corner to remove it. Drag the inside to move the whole room. Corners snap to the walls of other rooms (Alt disables).","Usunąć pomieszczenie?":"Delete room?","Usunięto pomieszczenie":"Room deleted","Kolory wg wartości":"Colours by value","Dolny próg":"Lower threshold","Górny próg":"Upper threshold","Kolor poniżej":"Colour below","Kolor pomiędzy":"Colour between","Kolor od górnego":"Colour from upper","Płynne przejście":"Smooth blend","Koloruj ikonę":"Colour the icon","Koloruj wartość":"Colour the value","Koloruj łuk":"Colour the arc","Koloruj tło":"Colour the background","Koloruj ramkę":"Colour the border","Ikona poniżej":"Icon below","Ikona pomiędzy":"Icon between","Ikona od górnego":"Icon from upper","Puste pole ikony = zwykła ikona markera.":"Empty icon field = the marker’s normal icon.","Stan encji nie jest liczbą — kolory wg wartości nie działają dla tej encji.":"The entity state is not a number — colours by value do not apply to this entity.","Teraz: poniżej dolnego progu.":"Now: below the lower threshold.","Teraz: pomiędzy progami.":"Now: between the thresholds.","Teraz: od górnego progu.":"Now: at or above the upper threshold.","Połączono z nowszymi zmianami z innego urządzenia":"Merged with newer changes from another device","Układ został zmieniony na innym urządzeniu":"The layout was changed on another device",
    "Zarządzaj widokiem":"Manage view","Tło widoku":"View background","Ustaw tło":"Set background","Wstecz":"Back","Podgląd wybranego tła":"Selected background preview",
    "Przełączanie palcem":"Swipe between views","Wyłączone (tylko zakładki)":"Off (tabs only)","Przesunięcie":"Slide","Kostka":"Cube","Zapisano sposób przełączania widoków":"View switching saved",
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
  editToggle: $('#edit-toggle'), editMenu: $('#edit-menu'), addDialog: $('#add-dialog'), settingsToggle: $('#settings-toggle'), settingsMenu: $('#settings-menu'), gridStatus: $('#grid-status'), gridPresets: Array.from(document.querySelectorAll('.grid-preset')), bgUploadProgress: $('#background-upload-progress'), solidCanvasRatio: $('#solid-canvas-ratio'), bgColorToggle: $('#background-color-toggle'), bgRgbOpen: $('#background-rgb-open'), bgSelect: $('#background-select'), bgColor: $('#background-color'), bgDownload: $('#background-download'), bgDelete: $('#background-delete'),
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
const markerStyleDefaults = type => type === 'icon' ? iconDefaults() : type === 'horseshoe' ? horseshoeDefaults() : type === 'gauge' ? gaugeDefaults() : badgeDefaults();
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
      flow.geometryLocked ??= false;
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
  const activePreset = [.25, 1, 4].reduce((best, value) => Math.abs(value - step) < Math.abs(best - step) ? value : best, .25);
  els.gridPresets.forEach(button => button.classList.toggle('active', Number(button.dataset.gridStep) === activePreset));
}
function closeCompactMenus() {
  els.settingsMenu?.classList.remove('open'); els.settingsToggle?.classList.remove('active');
  els.editMenu?.classList.remove('open'); $('#snap-menu')?.classList.remove('open'); $('#snap-menu-button')?.classList.remove('active'); els.viewSwitcher?.classList.remove('open'); els.viewManage?.classList.remove('active'); setBackgroundPage(false);
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
const ROOM_DEFAULTS = Object.freeze({ name:'Pomieszczenie', points:[], entityIds:[], tapAction:'toggle', mode:'glow', color:'#FFD27A', useLightColor:true, useBrightness:true, opacity:.45, feather:14, blend:'screen', litImage:'', stateEnabled:false, offColor:'#20B9E7', offOpacity:.2,
  lightEffect:'none', lightX:50, lightY:50, lightDirection:'left', lightWallPos:50, lightSpread:.6, lightFill:.15, labelLinked:false,
  labelCardX:0, labelCardY:0, labelCardLayout:'column', labelCardAlign:'center', labelCardBg:true, labelCardBgColor:'#081822', labelCardBgOpacity:.62, labelCardBlur:false, labelCardRadius:14, labelCardPadding:10, labelCardGap:4,
  labelCardBorder:false, labelCardBorderColor:'#FFFFFF', labelCardBorderOpacity:.3, labelCardBorderWidth:1,
  labelCardBgState:false, labelCardBgOnColor:'#3A2A08', labelCardBgOffColor:'#081822', labelCardBgOnOpacity:.62, labelCardBgOffOpacity:.62,
  labelCardBorderState:false, labelCardBorderOnColor:'#FFC46B', labelCardBorderOffColor:'#FFFFFF', labelCardBorderOnOpacity:.7, labelCardBorderOffOpacity:.3, labelCardBorderOnWidth:1.5, labelCardBorderOffWidth:1, labelCardScale:1, labelIconDX:0, labelIconDY:0, labelNameDX:0, labelNameDY:0, labelStateDX:0, labelStateDY:0,
  labelIcon:false, labelIconName:'', labelIconOn:'#FFC46B', labelIconOff:'#9FB6C3', labelIconSize:120, labelIconX:0, labelIconY:-80, labelIconBg:false, labelIconBgOpacity:.55, labelIconBgColor:'#081822',
  labelIconVariant:false, labelIconNameOn:'', labelIconNameOff:'', labelIconOpacityOn:1, labelIconOpacityOff:1, labelIconFill:true, labelIconOutline:false, labelIconOutlineColor:'#FFFFFF', labelIconOutlineWidth:1.5,
  labelIconSource:'entity', labelIconColorState:true, labelIconColor:'#FFC46B', labelIconOpacity:1,
  labelIconOutlineState:false, labelIconOutlineOnColor:'#FFFFFF', labelIconOutlineOffColor:'#9FB6C3', labelIconOutlineOnWidth:1.5, labelIconOutlineOffWidth:1.5, labelIconOutlineOpacity:1, labelIconOutlineOnOpacity:1, labelIconOutlineOffOpacity:1,
  labelIconBgState:false, labelIconBgOnColor:'#3A2A08', labelIconBgOffColor:'#081822', labelIconBgOnOpacity:.6, labelIconBgOffOpacity:.55,
  labelIconBorderState:false, labelIconBorderOnColor:'#FFC46B', labelIconBorderOffColor:'#9FB6C3', labelIconBorderOnOpacity:.8, labelIconBorderOffOpacity:.5, labelIconBorderOnWidth:2, labelIconBorderOffWidth:1.5,
  labelIconBorder:false, labelIconBlur:false, labelIconBorderColor:'#FFFFFF', labelIconBorderOpacity:.6, labelIconBorderWidth:1.5, labelIconShape:'circle', labelIconRadius:10, labelIconPadding:6,
  labelName:false, labelNameColor:'#FFFFFF', labelNameSize:60, labelNameX:0, labelNameY:28, labelNameBg:false, labelNameBgOpacity:.55, labelNameBgColor:'#081822',
  labelState:false, labelStateColor:'#DCE8EF', labelStateSize:50, labelStateX:0, labelStateY:84, labelStateBg:false, labelStateBgOpacity:.55, labelStateBgColor:'#081822' });
// A freshly drawn room starts with its icon, name and state visible and the usual extras switched on
// (icon outline, backgrounds, icon border), so every option is visible and can be tuned or turned off.
const NEW_ROOM_LABEL = Object.freeze({ labelIcon:true, labelName:true, labelState:true, labelLinked:true, labelCardBg:true, labelCardBorder:true,
  labelIconOutline:true, labelIconBg:true, labelIconBorder:true, labelIconY:-97, labelNameY:26, labelStateY:123 });
// Scales a new room's group so it fits inside the drawn shape (at most 70 % of its width and 60 % of its height, never above the default size).
function fitRoomLabel(id) {
  const room = roomsOf()[id], card = document.querySelector(`.room-label-card[data-room-id="${CSS.escape(id)}"]`), scene = els.scene?.getBoundingClientRect();
  if (!room?.labelLinked || !card || !scene?.width || !room.points?.length) return;
  const box = card.getBoundingClientRect(), scale = clamp(Number(room.labelCardScale) || 1, .3, 4); if (!box.width || !box.height) return;
  const xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
  const roomW = (Math.max(...xs) - Math.min(...xs)) / 100 * scene.width, roomH = (Math.max(...ys) - Math.min(...ys)) / 100 * scene.height;
  const fit = Math.min(roomW * .7 / (box.width / scale), roomH * .6 / (box.height / scale));
  const next = Math.round(clamp(fit, .3, 1) * 20) / 20; if (next === room.labelCardScale) return;
  room.labelCardScale = next; renderRooms();
}
// Room label parts: each is shown, styled and placed on its own (offsets in plan pixels from the room centre).
const ROOM_LABEL_PARTS = [['icon','labelIcon','Ikona'],['name','labelName','Nazwa'],['state','labelState','Stan']];
const ROOM_LABEL_KEYS = ROOM_LABEL_PARTS.flatMap(([, k]) => [k, `${k}Size`, `${k}X`, `${k}Y`, `${k}Bg`, `${k}BgOpacity`, `${k}BgColor`]).concat(['labelCardX','labelCardY','labelCardLayout','labelCardAlign','labelCardBg','labelCardBgColor','labelCardBgOpacity','labelCardBlur','labelCardRadius','labelCardPadding','labelCardGap','labelCardBorder','labelCardBorderColor','labelCardBorderOpacity','labelCardBorderWidth','labelCardBgState','labelCardBgOnColor','labelCardBgOffColor','labelCardBgOnOpacity','labelCardBgOffOpacity','labelCardBorderState','labelCardBorderOnColor','labelCardBorderOffColor','labelCardBorderOnOpacity','labelCardBorderOffOpacity','labelCardBorderOnWidth','labelCardBorderOffWidth','labelCardScale','labelIconDX','labelIconDY','labelNameDX','labelNameDY','labelStateDX','labelStateDY']).concat(['labelLinked','labelIconName','labelIconOn','labelIconOff','labelNameColor','labelStateColor','labelIconVariant','labelIconNameOn','labelIconNameOff','labelIconOpacityOn','labelIconOpacityOff','labelIconFill','labelIconOutline','labelIconOutlineColor','labelIconOutlineWidth','labelIconSource','labelIconBorder','labelIconBorderColor','labelIconBorderOpacity','labelIconBorderWidth','labelIconShape','labelIconRadius','labelIconPadding','labelIconBlur','labelIconColorState','labelIconColor','labelIconOpacity','labelIconOutlineState','labelIconOutlineOnColor','labelIconOutlineOffColor','labelIconOutlineOnWidth','labelIconOutlineOffWidth','labelIconOutlineOpacity','labelIconOutlineOnOpacity','labelIconOutlineOffOpacity','labelIconBgState','labelIconBgOnColor','labelIconBgOffColor','labelIconBgOnOpacity','labelIconBgOffOpacity','labelIconBorderState','labelIconBorderOnColor','labelIconBorderOffColor','labelIconBorderOnOpacity','labelIconBorderOffOpacity','labelIconBorderOnWidth','labelIconBorderOffWidth']);
const ROOM_LIGHT_KEYS = ['lightEffect','lightX','lightY','lightDirection','lightWallPos','lightSpread','lightFill'];
const ROOM_ON_STATES = new Set(['on','open','opening','home','playing','heat','heating','cool','cooling','detected','unlocked','active','true']);
let skipRoomFocus = false, movingRoomId = null, selectedRoomId = null, roomDraft = null, roomPreviewOn = '', roomEditorOpenSectionIndex = -1, roomStyleClipboard = null, allEntitiesCache = null, allEntitiesLoading = null;
const ROOM_STYLE_KEYS = ['tapAction','color','opacity','feather','stateEnabled','offColor','offOpacity', ...ROOM_LIGHT_KEYS, ...ROOM_LABEL_KEYS];
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
  return { html: `<svg class="room-layer" data-room-id="${escapeHtml(r.id)}" viewBox="0 0 100 100" preserveAspectRatio="none" style="opacity:${opacity.toFixed(3)};mix-blend-mode:screen">${body}</svg>`,
    signature: [r.mode, r.litImage, r.blend, r.feather, points, width, height, ...ROOM_LIGHT_KEYS.map(key => r[key])].join('|'), opacity, color };
}
// ---- Room label: icon, name and state drawn as part of the room (not a separate marker) --------------------
const ROOM_TOGGLE_DOMAINS = ['light', 'switch', 'fan', 'input_boolean'];
// Area centroid of the outline (falls back to the vertex average for a degenerate shape).
// An "icon" element is a room without a drawn shape: only its label group, anchored at its own point.
function isIconRoom(room) { return room?.kind === 'icon'; }
// The plan area an icon's label covers (in scene %), used to centre it like a room; falls back to its point.
function iconFocusBox(room) {
  const scene = els.scene.getBoundingClientRect(), nodes = $$(`#room-labels [data-room-id="${CSS.escape(room.id)}"]`).map(node => node.getBoundingClientRect()).filter(r => r.width);
  if (!nodes.length || !scene.width) return [roomAnchor(room)];
  const toX = v => (v - scene.left) / scene.width * 100, toY = v => (v - scene.top) / scene.height * 100;
  const l = toX(Math.min(...nodes.map(r => r.left))), r = toX(Math.max(...nodes.map(r => r.right))), t = toY(Math.min(...nodes.map(r => r.top))), b = toY(Math.max(...nodes.map(r => r.bottom)));
  // A little room around it, so a small icon is not zoomed in as far as it would go.
  const padX = Math.max((r - l) * .6, 4), padY = Math.max((b - t) * .6, 4);
  return [[l - padX, t - padY], [r + padX, t - padY], [r + padX, b + padY], [l - padX, b + padY]];
}
function roomAnchor(room) { return isIconRoom(room) ? [Number(room.x) || 50, Number(room.y) || 50] : roomLabelAnchor(room.points || []); }
function roomLabelAnchor(points) {
  let a = 0, cx = 0, cy = 0;
  points.forEach(([x1, y1], i) => { const [x2, y2] = points[(i + 1) % points.length], f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f; });
  return Math.abs(a) < 1e-6 ? roomCentroid(points) : [cx / (3 * a), cy / (3 * a)];
}
function roomLabelState(room) {
  const ids = room.entityIds || []; if (!ids.length) return '';
  const toggles = ids.filter(id => ROOM_TOGGLE_DOMAINS.includes(id.split('.')[0]));
  if (toggles.length) {
    const lit = toggles.filter(id => ROOM_ON_STATES.has(String(stateCache[id]?.state ?? '').toLowerCase()));
    if (toggles.length > 1) return lit.length ? `${translateValue('Wł.')} ${lit.length}/${toggles.length}` : translateValue('Wył.');
    if (!lit.length) return translateValue('Wył.');
    const brightness = Number(stateCache[lit[0]]?.attributes?.brightness);
    return Number.isFinite(brightness) && brightness > 0 ? `${translateValue('Wł.')} · ${Math.round(brightness / 2.55)}%` : translateValue('Wł.');
  }
  const st = stateCache[ids[0]]; if (!st) return '';
  const unit = st.attributes?.unit_of_measurement || '', n = Number(st.state);
  return Number.isFinite(n) && String(st.state).trim() !== '' ? `${Math.round(n * 10) / 10}${unit ? ` ${unit}` : ''}` : String(st.state ?? '');
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
  if (source === 'mdi') { const own = String((room.labelIconVariant ? (on ? room.labelIconNameOn : room.labelIconNameOff) : room.labelIconName) || '').trim(); if (own) return { cls: own.replace(/^mdi:/, 'mdi-') }; }
  return { cls: String((id && automaticIcon({ entityId: id })) || 'mdi:home-outline').replace(/^mdi:/, 'mdi-') };
}
// Background and frame of the icon share one shape: square, circle or a free corner radius.
function roomIconFrameStyle(r, on = false) {
  if (!r.labelIconBg && !r.labelIconBorder) return '';
  const pick = (stateKey, base, field) => r[stateKey] ? r[`${base}${on ? 'On' : 'Off'}${field}`] : r[`${base}${field}`];
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
  ROOM_LABEL_PARTS.forEach(([part, key]) => { room[`${key}X`] = Math.round(at[part][0] * k + dx); room[`${key}Y`] = Math.round(at[part][1] * k + dy); room[`${key}Size`] = Math.round(ROOM_DEFAULTS[`${key}Size`] * k); });
  if (room.labelColor) { room.labelNameColor = room.labelColor; room.labelStateColor = room.labelColor; }
  if (room.labelBg !== false && (room.labelName || room.labelState)) { room.labelNameBg = true; room.labelStateBg = true; room.labelNameBgOpacity = room.labelStateBgOpacity = clamp(Number(room.labelBgOpacity ?? .55), 0, 1); }
  ['labelLayout','labelScale','labelX','labelY','labelColor','labelBg','labelBgOpacity'].forEach(key => delete room[key]);
  return true;
}
// One-element label: a card with a shared background; parts are laid out by a preset and can be nudged inside it.
const ROOM_CARD_LAYOUTS = [['column','Jedno pod drugim','mdi-view-agenda-outline'],['row','Obok siebie','mdi-view-column-outline'],['iconLeft','Ikona z lewej','mdi-page-layout-sidebar-left'],['iconRight','Ikona z prawej','mdi-page-layout-sidebar-right']];
const ROOM_CARD_STYLES = [
  ['none','Bez tła', () => ({ labelCardBg:false, labelCardBorder:false, labelCardBlur:false })],
  ['dark','Ciemne', () => ({ labelCardBg:true, labelCardBgColor:'#081822', labelCardBgOpacity:.68, labelCardBorder:false, labelCardBlur:false, labelNameColor:'#FFFFFF', labelStateColor:'#DCE8EF' })],
  ['light','Jasne', () => ({ labelCardBg:true, labelCardBgColor:'#FFFFFF', labelCardBgOpacity:.86, labelCardBorder:false, labelCardBlur:false, labelNameColor:'#10222E', labelStateColor:'#3B5566', labelIconOff:'#6B8594' })],
  ['glass','Szkło', () => ({ labelCardBg:true, labelCardBgColor:'#FFFFFF', labelCardBgOpacity:.14, labelCardBlur:true, labelCardBorder:true, labelCardBorderColor:'#FFFFFF', labelCardBorderOpacity:.35, labelCardBorderWidth:1, labelNameColor:'#FFFFFF', labelStateColor:'#E8F4FA' })],
  ['room','Kolor pokoju', room => ({ labelCardBg:true, labelCardBgColor: room.color || '#FFD27A', labelCardBgOpacity:.3, labelCardBlur:false, labelCardBorder:true, labelCardBorderColor: room.color || '#FFD27A', labelCardBorderOpacity:.65, labelCardBorderWidth:1.5, labelNameColor:'#FFFFFF', labelStateColor:'#FFFFFF' })]];
function roomLabelMarkup(room, preview = '', interactive = false) {
  const r = { ...ROOM_DEFAULTS, ...room }; if (r.draft || !(r.labelIcon || r.labelName || r.labelState) || (!isIconRoom(r) && (r.points || []).length < 3)) return '';
  const realOn = roomLight(r).on, on = preview ? preview === 'on' : realOn, [x, y] = roomAnchor(r), tap = (isIconRoom(r) ? ' tappable' : '') + (interactive && r.id === selectedRoomId ? ' selected' : '');
  // The ON / OFF preview simulates the state text too.
  const state = !r.labelState ? '' : preview === 'off' ? translateValue('Wył.') : preview === 'on' && !realOn ? translateValue('Wł.') : roomLabelState(r);
  const iconColor = r.labelIconColorState === false ? r.labelIconColor : on ? r.labelIconOn : r.labelIconOff, iconOpacity = clamp(Number(r.labelIconColorState === false ? r.labelIconOpacity : on ? r.labelIconOpacityOn : r.labelIconOpacityOff) ?? 1, 0, 1);
  const outlineColor = r.labelIconOutlineState ? (on ? r.labelIconOutlineOnColor : r.labelIconOutlineOffColor) : r.labelIconOutlineColor, outlineWidth = r.labelIconOutlineState ? (on ? r.labelIconOutlineOnWidth : r.labelIconOutlineOffWidth) : r.labelIconOutlineWidth;
  const outlineOpacity = clamp(Number(r.labelIconOutlineState ? (on ? r.labelIconOutlineOnOpacity : r.labelIconOutlineOffOpacity) : r.labelIconOutlineOpacity) ?? 1, 0, 1);
  const iconStyle = `text-shadow:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));color:${escapeHtml(iconColor)};-webkit-text-fill-color:${r.labelIconFill !== false ? rgba(iconColor, iconOpacity) : 'transparent'};-webkit-text-stroke:${r.labelIconOutline ? `${clamp(Number(outlineWidth) || 1.5, .5, 8)}px ${rgba(outlineColor || '#FFFFFF', outlineOpacity)}` : '0 transparent'}`;
  const spec = r.labelIcon ? roomLabelIconSpec(r, on) : null;
  const iconHtml = !spec ? '' : spec.domain ? `<img class="room-label-brand" src="api/integration_icon?domain=${encodeURIComponent(spec.domain)}" data-icon-fallback="${escapeHtml(`https://brands.home-assistant.io/_/${encodeURIComponent(spec.domain)}/dark_icon.png`)}" alt="" style="opacity:${iconOpacity}">` : `<i class="mdi ${escapeHtml(spec.cls)}" style="${iconStyle}"></i>`;
  const content = { icon: iconHtml, name: r.labelName && r.name ? `<b data-no-i18n style="color:${escapeHtml(r.labelNameColor)}">${escapeHtml(r.name)}</b>` : '', state: state ? `<small data-no-i18n style="color:${escapeHtml(r.labelStateColor)}">${escapeHtml(state)}</small>` : '' };
  if (r.labelLinked) {
    const inner = ROOM_LABEL_PARTS.filter(([part]) => content[part]).map(([part, key]) => {
      const bg = part === 'icon' ? roomIconFrameStyle(r, on) : r[`${key}Bg`] ? `;background:${rgba(r[`${key}BgColor`] || '#081822', clamp(Number(r[`${key}BgOpacity`] ?? .55), 0, 1))}` : '';
      return `<div class="room-card-part ${part}${r[`${key}Bg`] && part !== 'icon' ? ' bg' : ''}" style="font-size:${clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420)}px;transform:translate(${Number(r[`${key}DX`]) || 0}px,${Number(r[`${key}DY`]) || 0}px)${bg}">${content[part]}</div>`;
    }).join('');
    if (!inner) return '';
    const cardPick = (stateKey, base, field) => r[stateKey] ? r[`${base}${on ? 'On' : 'Off'}${field}`] : r[`${base}${field}`];
    const layout = ROOM_CARD_LAYOUTS.some(([v]) => v === r.labelCardLayout) ? r.labelCardLayout : 'column', align = ['left','center','right'].includes(r.labelCardAlign) ? r.labelCardAlign : 'center';
    const style = [`left:${x.toFixed(3)}%`, `top:${y.toFixed(3)}%`, `--lx:${Number(r.labelCardX) || 0}px`, `--ly:${Number(r.labelCardY) || 0}px`, `--lscale:${clamp(Number(r.labelCardScale) || 1, .3, 4)}`,
      `padding:${clamp(Number(r.labelCardPadding) || 0, 0, 60)}px ${Math.round(clamp(Number(r.labelCardPadding) || 0, 0, 60) * 1.35)}px`, `gap:${clamp(Number(r.labelCardGap) || 0, 0, 40)}px`, `border-radius:${clamp(Number(r.labelCardRadius) || 0, 0, 80)}px`,
      r.labelCardBg ? `background:${rgba(cardPick('labelCardBgState', 'labelCardBg', 'Color') || '#081822', clamp(Number(cardPick('labelCardBgState', 'labelCardBg', 'Opacity') ?? .62), 0, 1))}` : '',
      // The frame is drawn inside the card (inset shadow), so a thicker ON / OFF frame never changes the card's size.
      `box-shadow:${[r.labelCardBorder ? `inset 0 0 0 ${clamp(Number(cardPick('labelCardBorderState', 'labelCardBorder', 'Width')) || 1, .5, 12)}px ${rgba(cardPick('labelCardBorderState', 'labelCardBorder', 'Color') || '#FFFFFF', clamp(Number(cardPick('labelCardBorderState', 'labelCardBorder', 'Opacity') ?? .3), 0, 1))}` : '', r.labelCardBg ? '0 6px 18px rgba(0,0,0,.25)' : ''].filter(Boolean).join(',') || 'none'}`].filter(Boolean).join(';');
    return `<div class="room-label-card layout-${layout} align-${align}${r.labelCardBg ? ' bg' : ''}${r.labelCardBlur ? ' blur' : ''}${interactive ? ' editable' : ''}${tap}" data-room-id="${escapeHtml(r.id)}" data-label-part="card" style="${style}">${inner}</div>`;
  }
  return ROOM_LABEL_PARTS.filter(([part]) => content[part]).map(([part, key]) => {
    const bg = part === 'icon' ? roomIconFrameStyle(r, on) : r[`${key}Bg`] ? `;background:${rgba(r[`${key}BgColor`] || '#081822', clamp(Number(r[`${key}BgOpacity`] ?? .55), 0, 1))}` : '';
    const style = `left:${x.toFixed(3)}%;top:${y.toFixed(3)}%;--lx:${Number(r[`${key}X`]) || 0}px;--ly:${Number(r[`${key}Y`]) || 0}px;--lsize:${clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420)}px${bg}`;
    return `<div class="room-label-part ${part}${r[`${key}Bg`] && part !== 'icon' ? ' bg' : ''}${interactive ? ' editable' : ''}${r.labelLinked ? ' linked' : ''}${tap}" data-room-id="${escapeHtml(r.id)}" data-label-part="${part}" style="${style}">${content[part]}</div>`;
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
    if (group.__html === html) return;
    // Only the position changed (the room or the label is being dragged): the existing nodes get the new
    // position styles instead of being re-created, so the icon is never rebuilt mid-drag.
    const key = html.replace(/left:[-\d.]+%;top:[-\d.]+%/g, '').replace(/--l[xy]:[-\d.]+px/g, '');
    if (group.__key === key && group.children.length) {
      const fresh = document.createElement('template'); fresh.innerHTML = html;
      [...fresh.content.children].forEach((node, index) => { const live = group.children[index]; if (live && live.getAttribute('style') !== node.getAttribute('style')) live.setAttribute('style', node.getAttribute('style')); });
    } else group.innerHTML = html;
    group.__html = html; group.__key = key;
  });
  [...layer.children].forEach(node => { if (!kept.has(node.dataset.labelGroup)) node.remove(); });
}
// In edit mode a label part is dragged with the finger or mouse; it follows the grid (when on) and the camera follows it.
function startRoomLabelDrag(event) {
  const node = event.target.closest('.room-label-part.editable, .room-label-card.editable'); if (!node || !editMode || event.button > 0) return;
  const room = roomsOf()[node.dataset.roomId], part = node.dataset.labelPart === 'card' ? ['card','labelCard','Grupa'] : ROOM_LABEL_PARTS.find(([p]) => p === node.dataset.labelPart); if (!room || !part) return;
  event.preventDefault(); event.stopPropagation();
  const newlySelected = selectedRoomId !== room.id; if (newlySelected) { skipRoomFocus = true; try { openRoomEditor(room.id); } finally { skipRoomFocus = false; } }
  const key = part[1], [ax, ay] = roomAnchor(room), w = els.scene.offsetWidth || 1, h = els.scene.offsetHeight || 1, k = sceneScale || 1;
  // "One element": every visible part moves by the same amount as the one held.
  const moving = key === 'labelCard' ? [key] : room.labelLinked ? ROOM_LABEL_PARTS.filter(([, kk]) => room[kk]).map(([, kk]) => kk) : [key];
  const startOffsets = Object.fromEntries(moving.map(kk => [kk, [Number(room[`${kk}X`] ?? ROOM_DEFAULTS[`${kk}X`]) || 0, Number(room[`${kk}Y`] ?? ROOM_DEFAULTS[`${kk}Y`]) || 0]]));
  const partPct = kk => [ax + (Number(room[`${kk}X`] ?? ROOM_DEFAULTS[`${kk}X`]) || 0) * k / w * 100, ay + (Number(room[`${kk}Y`] ?? ROOM_DEFAULTS[`${kk}Y`]) || 0) * k / h * 100];
  const [sx, sy] = scenePercentAt(event), [px, py] = partPct(key), grab = [sx - px, sy - py];
  // Guides only of this room: its outline edges and centre, the label anchor, and its label parts that stay in place.
  let guides = null;
  const roomGuides = () => {
    const scene = els.scene.getBoundingClientRect(), xs = isIconRoom(room) ? [ax] : room.points.map(p => p[0]), ys = isIconRoom(room) ? [ay] : room.points.map(p => p[1]), toX = v => v / 100 * scene.width, toY = v => v / 100 * scene.height;
    const gx = [Math.min(...xs), Math.max(...xs), (Math.min(...xs) + Math.max(...xs)) / 2, ax].map(v => ({ v: toX(v), room:true }));
    const gy = [Math.min(...ys), Math.max(...ys), (Math.min(...ys) + Math.max(...ys)) / 2, ay].map(v => ({ v: toY(v), room:true }));
    $$(`.room-label-part[data-room-id="${CSS.escape(room.id)}"]`).filter(other => !moving.includes(ROOM_LABEL_PARTS.find(([p]) => p === other.dataset.labelPart)?.[1])).forEach(other => { const r = other.getBoundingClientRect(); gx.push({ v: r.left + r.width / 2 - scene.left }); gy.push({ v: r.top + r.height / 2 - scene.top }); });
    const own = node.getBoundingClientRect();
    return { scene, xs: gx, ys: gy, offsets: [0], halfW: own.width / 2, halfH: own.height / 2 };
  };
  let moved = false; const camera = dragCamera(e => { clearTimeout(guides?.motion?.timer); guides = null; place(e); });
  try { els.scene.setPointerCapture(event.pointerId); } catch {}
  const place = e => {
    const [x, y] = scenePercentAt(e); if (!cameraPanning) { guides ||= roomGuides(); guides.onSettle = () => place(e); }
    const snapped = alignToGuides(guides, snapPercent(x - grab[0]), snapPercent(y - grab[1]), e);
    const dx = Math.round((snapped.xPercent - ax) / 100 * w / k) - startOffsets[key][0], dy = Math.round((snapped.yPercent - ay) / 100 * h / k) - startOffsets[key][1];
    moving.forEach(kk => { room[`${kk}X`] = startOffsets[kk][0] + dx; room[`${kk}Y`] = startOffsets[kk][1] + dy; });
    renderRoomLabels();
  };
  const move = e => { if (e.pointerId !== event.pointerId) return; if (!moved && Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY) < 4) return; moved = true; place(e); camera.track(e); };
  const up = e => {
    if (e.pointerId !== event.pointerId) return; camera.stop(); clearTimeout(guides?.motion?.timer); if (guides) guides.onSettle = null; showAlignGuides([], []);
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    // The scene holds the finger, so the following click would land on the scene and select the room under the
    // label (e.g. the room an icon stands in); the label was already selected on press, so the click is dropped.
    const swallow = c => { c.stopPropagation(); c.preventDefault(); }; window.addEventListener('click', swallow, { capture:true, once:true }); setTimeout(() => window.removeEventListener('click', swallow, true), 500);
    // A tap (no move) always brings the room / icon into view, also when it was already selected.
    if (!moved) { requestAnimationFrame(() => requestAnimationFrame(() => focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []))); return; }
    let [fx, fy] = partPct(key);
    // An icon has no shape: a moved group becomes its new position, so later centring, guides and copies use it.
    if (isIconRoom(room) && key === 'labelCard') { room.x = Math.round(clamp(fx, 0, 100) * 100) / 100; room.y = Math.round(clamp(fy, 0, 100) * 100) / 100; room.labelCardX = 0; room.labelCardY = 0; [fx, fy] = [room.x, room.y]; renderRoomLabels(); }
    room.updatedAt = new Date().toISOString(); scheduleSave(true); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); centerAfterDrag(fx, fy);
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
}
function renderRooms() {
  syncRoomIconStates();
  const layer = $('#rooms'); if (!layer) return;
  // A room being moved shows only its outline and label (no light / state effect), so nothing flickers while it
  // is rebuilt on every step; the effect fades back in when the room is dropped.
  const view = activeSceneView(), rooms = Object.values(roomsOf(view)).filter(room => (room.points || []).length >= 3 && room.id !== movingRoomId);
  const width = els.scene.offsetWidth || 1, height = els.scene.offsetHeight || 1, kept = new Set();
  rooms.forEach(room => {
    const preview = editMode && room.id === selectedRoomId ? roomPreviewOn : '', built = roomLayerMarkup(room, 'room', width, height, preview);
    let node = layer.querySelector(`.room-layer[data-room-id="${CSS.escape(room.id)}"]`);
    // Unchanged geometry keeps its node, so switching the light on/off fades (CSS transition on opacity).
    if (node && node.dataset.signature === built.signature) { node.style.opacity = built.opacity.toFixed(3); const fill = node.querySelector('.room-fill'); if (fill) fill.setAttribute('fill', built.color); node.querySelectorAll('.room-stop').forEach(stop => stop.setAttribute('stop-color', built.color)); }
    else { const holder = document.createElement('div'); holder.innerHTML = built.html; const fresh = holder.firstElementChild; fresh.dataset.signature = built.signature; if (node) node.replaceWith(fresh); else layer.append(fresh); node = fresh; }
    kept.add(room.id);
  });
  $$('.room-layer', layer).forEach(node => { if (!kept.has(node.dataset.roomId)) node.remove(); });
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
    showAlignGuides(bx !== null ? [{ at: bx, room: gx.room, bg: gx.bg }] : [], by !== null ? [{ at: by, room: gy.room, bg: gy.bg }] : []);
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
function wizardSteps() { return isIconRoom(roomsOf()[roomWizard?.id]) ? ['name','entities','parts'] : ['name','entities']; }
function openRoomWizard(id) {
  const room = roomsOf()[id], box = $('#room-wizard'); if (!room || !box) return openRoomEditor(id, -1, 0);
  roomWizard = { id, step:'name', generated: room.name, query:'', picked: new Set(room.entityIds || []), parts: new Set(WIZARD_PARTS.map(([key]) => key)) };
  // On a phone it sits under the top bar so the on-screen keyboard cannot cover it.
  box.style.top = mobileView() ? `${Math.round(($('.topbar')?.getBoundingClientRect().bottom || 0) + 8)}px` : '';
  box.classList.add('visible'); box.setAttribute('aria-hidden', 'false'); renderRoomWizard();
  loadEntityCatalog().then(() => { if (roomWizard?.step === 'entities') renderRoomWizard('list'); });
}
function closeRoomWizard() {
  const box = $('#room-wizard'); if (!roomWizard || !box) return;
  const { id, picked, parts, generated: roomWizard_generated } = roomWizard, room = roomsOf()[id]; roomWizard = null;
  box.classList.remove('visible'); box.setAttribute('aria-hidden', 'true');
  if (!room) return;
  const before = (room.entityIds || []).join('|'); room.entityIds = [...picked];
  // An icon left without a typed name takes the name of its first entity.
  if (isIconRoom(room) && room.name === roomWizard_generated && room.entityIds.length) room.name = (entityCatalog?.entities || []).find(entity => entity.entity_id === room.entityIds[0])?.name || roomEntityName(room.entityIds[0]);
  // An icon is generated only now, with the parts chosen in the last step.
  if (isIconRoom(room)) { WIZARD_PARTS.forEach(([key]) => { room[key] = parts.has(key); }); delete room.draft; }
  if (room.entityIds.join('|') !== before) { room.updatedAt = new Date().toISOString(); refreshStates(); }
  renderRooms(); fitRoomLabel(id); scheduleSave(true);
  // With entities picked there is nothing left to do in the Room section, so the panel opens collapsed.
  openRoomEditor(id, -1, room.entityIds.length ? -1 : 0);
  notify(isIconRoom(room) ? 'Dodano ikonę' : room.entityIds.length ? 'Dodano pomieszczenie' : 'Dodano pomieszczenie — encje możesz dodać w panelu');
}
function roomWizardName() {
  const input = $('#room-wizard-name'), room = roomsOf()[roomWizard?.id]; if (!room || !input) return;
  const name = input.value.trim(); room.name = name || roomWizard.generated; room.updatedAt = new Date().toISOString(); renderRooms();
}
function roomWizardMatches() {
  const all = (entityCatalog?.entities || []).filter(entity => entity.entity_id), room = roomsOf()[roomWizard.id], query = searchText(roomWizard.query);
  const area = searchText(room?.name), useful = entity => /^(light|switch|input_boolean|fan|binary_sensor|cover|climate|media_player|lock|vacuum)\./.test(entity.entity_id);
  const list = query.length >= 2
    ? all.filter(entity => [entity.entity_id, entity.name, entity.area].some(value => searchText(value).includes(query)))
    : all.filter(entity => area && searchText(entity.area) === area || useful(entity));
  return list.sort((a, b) => Number(searchText(b.area) === area) - Number(searchText(a.area) === area) || roomEntityRank(a.entity_id) - roomEntityRank(b.entity_id) || String(a.name || a.entity_id).localeCompare(String(b.name || b.entity_id))).slice(0, 30);
}
function renderRoomWizardButton() {
  const button = $('#room-wizard-next'), w = roomWizard; if (!button || !w) return;
  const steps = wizardSteps(), last = steps.indexOf(w.step) === steps.length - 1;
  button.disabled = w.step === 'parts' && !w.parts.size;
  button.innerHTML = !last ? `<span>${escapeHtml(translateValue('Dalej'))}</span><i class="mdi mdi-arrow-right"></i>`
    : `<i class="mdi mdi-check"></i><span>${escapeHtml(translateValue(isIconRoom(roomsOf()[w.id]) ? 'Utwórz ikonę' : 'Gotowe'))}${w.step === 'entities' && w.picked.size ? ` (${w.picked.size})` : ''}</span>`;
}
function renderRoomWizard(part = 'all') {
  const box = $('#room-wizard'); if (!roomWizard || !box) return;
  const w = roomWizard, room = roomsOf()[w.id], steps = wizardSteps();
  if (part === 'all') {
    box.dataset.step = w.step;
    $('#room-wizard-step', box).textContent = `${steps.indexOf(w.step) + 1} / ${steps.length}`;
    const icon = isIconRoom(room);
    $('#room-wizard-title', box).textContent = translateValue(w.step === 'name' ? (icon ? 'Nazwa ikony' : 'Nazwa pomieszczenia') : w.step === 'parts' ? 'Co ma być widać?' : (icon ? 'Encje ikony' : 'Encje pomieszczenia'));
    $('.room-wizard-entity-step > small', box).textContent = translateValue(icon ? 'Zaznacz encje, od których zależy stan ikony — światło, włącznik, czujnik… Możesz wybrać kilka.' : 'Zaznacz encje, od których zależy stan pomieszczenia — światło, włącznik, czujnik… Możesz wybrać kilka.');
    const name = $('#room-wizard-name', box); name.placeholder = w.generated;
    if (w.step === 'name') { name.value = room?.name === w.generated ? '' : room?.name || ''; setTimeout(() => name.focus(), 60); }
    else if (w.step === 'entities') { const search = $('#room-wizard-search', box); search.value = w.query; if (!mobileView()) setTimeout(() => search.focus(), 60); }
    $('#room-wizard-parts', box).innerHTML = WIZARD_PARTS.map(([key, label, mdi]) => `<button type="button" class="room-wizard-part${w.parts.has(key) ? ' on' : ''}" data-wizard-part="${key}" aria-pressed="${w.parts.has(key)}"><i class="mdi ${mdi}"></i><span>${escapeHtml(translateValue(label))}</span><i class="mdi ${w.parts.has(key) ? 'mdi-check-circle' : 'mdi-circle-outline'} room-wizard-part-check"></i></button>`).join('');
    renderRoomWizardButton();
  }
  if (w.step !== 'entities') return;
  $('#room-wizard-picked', box).innerHTML = [...w.picked].map(id => `<button type="button" class="room-wizard-chip" data-wizard-toggle="${escapeHtml(id)}" data-no-i18n>${escapeHtml((entityCatalog?.entities || []).find(entity => entity.entity_id === id)?.name || roomEntityName(id))}<i class="mdi mdi-close"></i></button>`).join('');
  const rows = entityCatalog ? roomWizardMatches() : null;
  $('#room-wizard-list', box).innerHTML = !rows ? `<div class="room-wizard-empty">${escapeHtml(translateValue('Wczytywanie encji…'))}</div>`
    : rows.length ? rows.map(entity => { const on = w.picked.has(entity.entity_id), value = `${entity.state ?? ''}${entity.unit ? ` ${entity.unit}` : ''}`;
      return `<button type="button" class="room-wizard-row${on ? ' on' : ''}" data-wizard-toggle="${escapeHtml(entity.entity_id)}"><i class="mdi ${on ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}"></i><i class="mdi ${addEntityIcon(entity)} room-wizard-icon"></i><span><b data-no-i18n>${escapeHtml(entity.name || entity.entity_id)}</b><small data-no-i18n>${escapeHtml(entity.entity_id)}${entity.area ? ` · ${escapeHtml(entity.area)}` : ''}</small></span><em data-no-i18n>${escapeHtml(value)}</em></button>`; }).join('')
    : `<div class="room-wizard-empty">${escapeHtml(translateValue(w.query.trim().length >= 2 ? 'Brak pasujących encji.' : 'Wpisz nazwę, obszar albo entity_id.'))}</div>`;
}
function roomWizardNext() {
  if (!roomWizard) return;
  const steps = wizardSteps(), next = steps[steps.indexOf(roomWizard.step) + 1];
  if (roomWizard.step === 'name') roomWizardName();
  if (roomWizard.step === 'parts' && !roomWizard.parts.size) return;
  if (next) { roomWizard.step = next; return renderRoomWizard(); }
  closeRoomWizard();
}
function onRoomWizardClick(event) {
  if (!roomWizard) return;
  const toggle = event.target.closest('[data-wizard-toggle]');
  if (toggle) { const id = toggle.dataset.wizardToggle; if (roomWizard.picked.has(id)) roomWizard.picked.delete(id); else roomWizard.picked.add(id); renderRoomWizard('list'); return renderRoomWizardButton(); }
  const partButton = event.target.closest('[data-wizard-part]');
  if (partButton) { const key = partButton.dataset.wizardPart; if (roomWizard.parts.has(key)) roomWizard.parts.delete(key); else roomWizard.parts.add(key); return renderRoomWizard(); }
  if (event.target.closest('#room-wizard-next')) return roomWizardNext();
  if (event.target.closest('[data-wizard-skip]')) {
    if (roomWizard.step === 'name') { const input = $('#room-wizard-name'); if (input) input.value = ''; return roomWizardNext(); }
    // Skipping entities keeps none; skipping the parts keeps all three.
    if (roomWizard.step === 'entities') roomWizard.picked = new Set(roomsOf()[roomWizard.id]?.entityIds || []);
    if (roomWizard.step === 'parts') roomWizard.parts = new Set(WIZARD_PARTS.map(([key]) => key));
    const steps = wizardSteps(), next = steps[steps.indexOf(roomWizard.step) + 1];
    if (next) { roomWizard.step = next; return renderRoomWizard(); }
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
function startRoomMove(event) {
  if (!editMode || roomDraft || event.button > 0 || !selectedRoomId || (event.target !== els.markers && event.target !== els.scene && event.target !== els.image)) return false;
  const room = roomsOf()[selectedRoomId], start = scenePercentAt(event); if (!room || room.geometryLocked || !pointInPolygon(start, room.points)) return false;
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
  const button = action === 'remove' ? `<button type="button" class="room-entity-action" data-room-remove="${escapeHtml(id)}" title="${escapeHtml(translateValue('Usuń z pomieszczenia'))}"><i class="mdi mdi-close"></i></button>` : `<button type="button" class="room-entity-action add" data-room-add="${escapeHtml(id)}" title="${escapeHtml(translateValue('Dodaj do pomieszczenia'))}"><i class="mdi mdi-plus"></i></button>`;
  return `<div class="room-entity${action === 'remove' ? ' added' : ''}"${action === 'add' ? ` data-room-add="${escapeHtml(id)}"` : ''}><div><strong data-no-i18n>${escapeHtml(roomEntityName(id))}</strong><code data-no-i18n>${escapeHtml(id)}${state ? ' · ' + escapeHtml(state) : ''}</code></div>${button}</div>`;
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
  const r = { ...ROOM_DEFAULTS, ...room }, light = roomLight(r), refresh = { refresh:true };
  const note = text => `<p class="flow-section-note">${text}</p>`, canToggle = r.entityIds.some(id => isToggleableMarker({ entityId:id }));
  const addedList = r.entityIds.map(id => roomEntityRow(id, 'remove')).join('');
  const icon = isIconRoom(r);
  const entities = section(icon ? 'Ogólne' : 'Pomieszczenie', control('Nazwa','name','text',r.name)
    + `<div class="control"><label>Stan</label><strong class="flow-live-value">${translateValue(light.on ? 'Włączone' : r.entityIds.length ? 'Wyłączone' : 'Brak encji')}</strong><span></span></div>`
    + tapActionControl(canToggle ? r.tapAction : (r.tapAction === 'toggle' ? 'more_info' : r.tapAction), canToggle)
    + `<div class="control room-entities-control"><label>${translateValue(icon ? 'Encje' : 'Encje pomieszczenia')}</label>${r.entityIds.length ? '' : `<div class="room-entity-hint"><i class="mdi mdi-gesture-tap"></i><span>${escapeHtml(translateValue(icon ? 'Wyszukaj i wybierz encje, od których zależy stan ikony (światło, włącznik, czujnik…).' : 'Wyszukaj i wybierz encje, od których zależy stan pomieszczenia (światło, włącznik, czujnik…).'))}</span></div>`}<div class="room-entity-list">${addedList}</div>`
    + `<label class="room-entity-search"><i class="mdi mdi-magnify"></i><input id="room-entity-search" type="search" autocomplete="off" placeholder="${escapeHtml(translateValue('Szukaj nazwy lub encji…'))}"></label><div id="room-entity-results" class="room-entity-list room-entity-results"></div></div>`
    );
  const look = section('Wygląd', control('Kolor zależny ON/OFF','stateEnabled','checkbox',!!r.stateEnabled,refresh)
    + (r.stateEnabled
      ? control('Kolor ON','color','color',r.color) + control('Kolor OFF','offColor','color',r.offColor)
        + control('Intensywność ON','opacity','range',Math.round(clamp(Number(r.opacity) || 0, 0, 1) * 100),{ min:5, max:100, step:1, suffix:'%', integer:true })
        + control('Intensywność OFF','offOpacity','range',Math.round(clamp(Number(r.offOpacity) || 0, 0, 1) * 100),{ min:0, max:100, step:1, suffix:'%', integer:true })
      : control('Kolor','color','color',r.color)
        + control('Intensywność','opacity','range',Math.round(clamp(Number(r.opacity) || 0, 0, 1) * 100),{ min:5, max:100, step:1, suffix:'%', integer:true }))
    + control('Miękkość krawędzi','feather','range',Number(r.feather) || 0,{ min:0, max:80, step:1, suffix:'px', integer:true })
    + control('Efekt światła','lightEffect','select',r.lightEffect || 'none',{ items:[['none','Jednolity'],['center','Centralny'],['corner','Róg'],['wall','Od ściany'],['ambient','Ambient']], refresh:true })
    + (r.lightEffect && r.lightEffect !== 'none' ? (r.lightEffect === 'wall'
        ? control('Kierunek','lightDirection','select',r.lightDirection || 'left',{ items:[['left','Lewa'],['right','Prawa'],['top','Góra'],['bottom','Dół']] }) + control('Pozycja na ścianie','lightWallPos','range',Number(r.lightWallPos ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true })
        : control('Pozycja pozioma','lightX','range',Number(r.lightX ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Pozycja pionowa','lightY','range',Number(r.lightY ?? 50),{ min:0, max:100, step:1, suffix:'%', integer:true }))
      + control('Rozproszenie','lightSpread','range',clamp(Number(r.lightSpread) || .6, .15, 1),{ min:.15, max:1, step:.01 })
      + control('Wypełnienie','lightFill','range',clamp(Number(r.lightFill) || 0, 0, 1),{ min:0, max:1, step:.01 }) : ''));
  const iconList = `<datalist id="room-mdi-icon-list">${ICON_CHOICES.slice(1).map(([name, text]) => `<option value="${name}">${iconChoiceLabel(text)}</option>`).join('')}</datalist>`;
  const pct = value => Math.round(clamp(Number(value ?? 1), 0, 1) * 100);
  const iconInput = (path, title, value) => `<div class="control"><label>${escapeHtml(translateValue(title))}</label><input type="text" list="room-mdi-icon-list" value="${escapeHtml(value || '')}" data-path="${path}" data-value-type="text" placeholder="${escapeHtml(translateValue('automatyczna'))}"><span></span></div>`;
  const source = roomLabelIconSource(r), sub = (title, body) => gaugeSubsection(escapeHtml(translateValue(title)), body);
  const iconOptions = () => sub('Źródło', control('Źródło','labelIconSource','select',source,{ items:[['entity','Z encji'],['integration','Logo integracji'],['mdi','Własna ikona MDI']], refresh:true })
      + (source === 'mdi' ? control('Ikona zależna ON/OFF','labelIconVariant','checkbox',!!r.labelIconVariant,refresh)
        + (r.labelIconVariant ? iconInput('labelIconNameOn','Ikona ON',r.labelIconNameOn) + iconInput('labelIconNameOff','Ikona OFF',r.labelIconNameOff) : iconInput('labelIconName','Ikona',r.labelIconName)) + iconList : ''))
    + sub('Wypełnienie', control('Wypełnienie','labelIconFill','checkbox',r.labelIconFill !== false,refresh)
      + (r.labelIconFill !== false ? control('Zależne ON/OFF','labelIconColorState','checkbox',r.labelIconColorState !== false,refresh)
        + (r.labelIconColorState !== false
          ? (source !== 'integration' ? control('Kolor ON','labelIconOn','color',r.labelIconOn) + control('Kolor OFF','labelIconOff','color',r.labelIconOff) : '')
            + control('Przezrocz. ON','labelIconOpacityOn','range',pct(r.labelIconOpacityOn),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconOpacityOff','range',pct(r.labelIconOpacityOff),{ min:0, max:100, step:1, suffix:'%', integer:true })
          : (source !== 'integration' ? control('Kolor','labelIconColor','color',r.labelIconColor || '#FFC46B') : '') + control('Przezroczystość','labelIconOpacity','range',pct(r.labelIconOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })) : ''))
    + (source !== 'integration' ? sub('Obrys', control('Obrys','labelIconOutline','checkbox',!!r.labelIconOutline,refresh)
      + (r.labelIconOutline ? control('Zależne ON/OFF','labelIconOutlineState','checkbox',!!r.labelIconOutlineState,refresh)
        + (r.labelIconOutlineState
          ? control('Kolor ON','labelIconOutlineOnColor','color',r.labelIconOutlineOnColor) + control('Kolor OFF','labelIconOutlineOffColor','color',r.labelIconOutlineOffColor)
            + control('Przezrocz. ON','labelIconOutlineOnOpacity','range',pct(r.labelIconOutlineOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconOutlineOffOpacity','range',pct(r.labelIconOutlineOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość ON','labelIconOutlineOnWidth','range',clamp(Number(r.labelIconOutlineOnWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' }) + control('Grubość OFF','labelIconOutlineOffWidth','range',clamp(Number(r.labelIconOutlineOffWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' })
          : control('Kolor obrysu','labelIconOutlineColor','color',r.labelIconOutlineColor) + control('Przezrocz. obrysu','labelIconOutlineOpacity','range',pct(r.labelIconOutlineOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Grubość obrysu','labelIconOutlineWidth','range',clamp(Number(r.labelIconOutlineWidth) || 1.5, .5, 8),{ min:.5, max:8, step:.5, suffix:'px' })) : '')) : '')
    + sub('Tło', control('Tło','labelIconBg','checkbox',!!r.labelIconBg,refresh)
      + (r.labelIconBg ? control('Zależne ON/OFF','labelIconBgState','checkbox',!!r.labelIconBgState,refresh)
        + (r.labelIconBgState
          ? control('Kolor ON','labelIconBgOnColor','color',r.labelIconBgOnColor) + control('Kolor OFF','labelIconBgOffColor','color',r.labelIconBgOffColor)
            + control('Przezrocz. ON','labelIconBgOnOpacity','range',pct(r.labelIconBgOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconBgOffOpacity','range',pct(r.labelIconBgOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
          : control('Kolor tła','labelIconBgColor','color',r.labelIconBgColor || '#081822') + control('Przezrocz. tła','labelIconBgOpacity','range',pct(r.labelIconBgOpacity ?? .55),{ min:0, max:100, step:1, suffix:'%', integer:true }))
        + control('Rozmycie','labelIconBlur','checkbox',!!r.labelIconBlur) : ''))
    + sub('Ramka', control('Ramka','labelIconBorder','checkbox',!!r.labelIconBorder,refresh)
      + (r.labelIconBorder ? control('Zależne ON/OFF','labelIconBorderState','checkbox',!!r.labelIconBorderState,refresh)
        + (r.labelIconBorderState
          ? control('Kolor ON','labelIconBorderOnColor','color',r.labelIconBorderOnColor) + control('Kolor OFF','labelIconBorderOffColor','color',r.labelIconBorderOffColor)
            + control('Przezrocz. ON','labelIconBorderOnOpacity','range',pct(r.labelIconBorderOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelIconBorderOffOpacity','range',pct(r.labelIconBorderOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość ON','labelIconBorderOnWidth','range',clamp(Number(r.labelIconBorderOnWidth) || 2, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' }) + control('Grubość OFF','labelIconBorderOffWidth','range',clamp(Number(r.labelIconBorderOffWidth) || 1.5, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' })
          : control('Kolor ramki','labelIconBorderColor','color',r.labelIconBorderColor || '#FFFFFF') + control('Przezrocz. ramki','labelIconBorderOpacity','range',pct(r.labelIconBorderOpacity ?? .6),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Grubość ramki','labelIconBorderWidth','range',clamp(Number(r.labelIconBorderWidth) || 1.5, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' })) : ''))
    + (r.labelIconBg || r.labelIconBorder ? sub('Kształt', control('Kształt','labelIconShape','select',['square','circle','custom'].includes(r.labelIconShape) ? r.labelIconShape : 'circle',{ items:[['square','Kwadrat'],['circle','Koło'],['custom','Dowolny']], refresh:true })
      + (r.labelIconShape === 'custom' ? control('Zaokrąglenie','labelIconRadius','range',clamp(Number(r.labelIconRadius) || 0, 0, 200),{ min:0, max:120, step:1, suffix:'px', integer:true }) : '')
      + control('Margines','labelIconPadding','range',clamp(Number(r.labelIconPadding ?? 6), 0, 120),{ min:0, max:80, step:1, suffix:'px', integer:true })) : '');
  const partSection = ([part, key, title]) => section(title, control('Pokaż',key,'checkbox',!!r[key],refresh)
    + (r[key] ? (part === 'icon' ? '' : control('Kolor',`${key}Color`,'color',r[`${key}Color`]))
      + control('Rozmiar',`${key}Size`,'range',clamp(Number(r[`${key}Size`]) || ROOM_DEFAULTS[`${key}Size`], 6, 420),{ min:6, max:420, step:1, suffix:'px', integer:true })
      + (part === 'icon' ? '' : control('Tło',`${key}Bg`,'checkbox',!!r[`${key}Bg`],refresh)
        + (r[`${key}Bg`] ? control('Kolor tła',`${key}BgColor`,'color',r[`${key}BgColor`] || '#081822') + control('Przezrocz. tła',`${key}BgOpacity`,'range',pct(r[`${key}BgOpacity`] ?? .55),{ min:0, max:100, step:1, suffix:'%', integer:true }) : ''))
      + (part === 'icon' ? '' : r.labelLinked
        ? control('Przesunięcie w grupie: poziomo',`${key}DX`,'range',Number(r[`${key}DX`]) || 0,{ min:-120, max:120, step:1, suffix:'px', integer:true }) + control('Przesunięcie w grupie: pionowo',`${key}DY`,'range',Number(r[`${key}DY`]) || 0,{ min:-120, max:120, step:1, suffix:'px', integer:true })
        : control('Lewo / prawo',`${key}X`,'range',Number(r[`${key}X`]) || 0,{ min:-600, max:600, step:1, suffix:'px', integer:true }) + control('Góra / dół',`${key}Y`,'range',Number(r[`${key}Y`]) || 0,{ min:-600, max:600, step:1, suffix:'px', integer:true }))
      + (part === 'icon' ? iconOptions() : '') : ''));
  const presetRow = (attr, items, active) => `<div class="room-card-presets">${items.map(([value, title, icon]) => `<button type="button" class="room-card-preset${active === value ? ' active' : ''}" ${attr}="${value}" title="${escapeHtml(translateValue(title))}" aria-label="${escapeHtml(translateValue(title))}">${icon ? `<i class="mdi ${icon}"></i>` : `<span class="room-card-swatch ${value}"></span>`}</button>`).join('')}</div>`;
  const card = !r.labelLinked ? '' : `<div class="control room-card-row"><label>${escapeHtml(translateValue('Układ'))}</label>${presetRow('data-card-layout', ROOM_CARD_LAYOUTS, r.labelCardLayout || 'column')}</div>`
    + `<div class="control room-card-row"><label>${escapeHtml(translateValue('Styl'))}</label>${presetRow('data-card-style', ROOM_CARD_STYLES.map(([v, t]) => [v, t, '']), '')}</div>`
    + `<div class="control room-card-row"><label>${escapeHtml(translateValue('Wyrównanie'))}</label>${presetRow('data-card-align', [['left','Do lewej','mdi-format-align-left'],['center','Do środka','mdi-format-align-center'],['right','Do prawej','mdi-format-align-right']], r.labelCardAlign || 'center')}</div>`
    + sub('Tło', control('Tło','labelCardBg','checkbox',!!r.labelCardBg,refresh)
      + (r.labelCardBg ? control('Zależne ON/OFF','labelCardBgState','checkbox',!!r.labelCardBgState,refresh)
        + (r.labelCardBgState
          ? control('Kolor ON','labelCardBgOnColor','color',r.labelCardBgOnColor) + control('Kolor OFF','labelCardBgOffColor','color',r.labelCardBgOffColor)
            + control('Przezrocz. ON','labelCardBgOnOpacity','range',pct(r.labelCardBgOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelCardBgOffOpacity','range',pct(r.labelCardBgOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
          : control('Kolor tła','labelCardBgColor','color',r.labelCardBgColor || '#081822') + control('Przezrocz. tła','labelCardBgOpacity','range',pct(r.labelCardBgOpacity ?? .62),{ min:0, max:100, step:1, suffix:'%', integer:true }))
        + control('Rozmycie','labelCardBlur','checkbox',!!r.labelCardBlur) : ''))
    + sub('Ramka', control('Ramka','labelCardBorder','checkbox',!!r.labelCardBorder,refresh)
      + (r.labelCardBorder ? control('Zależne ON/OFF','labelCardBorderState','checkbox',!!r.labelCardBorderState,refresh)
        + (r.labelCardBorderState
          ? control('Kolor ON','labelCardBorderOnColor','color',r.labelCardBorderOnColor) + control('Kolor OFF','labelCardBorderOffColor','color',r.labelCardBorderOffColor)
            + control('Przezrocz. ON','labelCardBorderOnOpacity','range',pct(r.labelCardBorderOnOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Przezrocz. OFF','labelCardBorderOffOpacity','range',pct(r.labelCardBorderOffOpacity),{ min:0, max:100, step:1, suffix:'%', integer:true })
            + control('Grubość ON','labelCardBorderOnWidth','range',clamp(Number(r.labelCardBorderOnWidth) || 1.5, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' }) + control('Grubość OFF','labelCardBorderOffWidth','range',clamp(Number(r.labelCardBorderOffWidth) || 1, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' })
          : control('Kolor ramki','labelCardBorderColor','color',r.labelCardBorderColor || '#FFFFFF') + control('Przezrocz. ramki','labelCardBorderOpacity','range',pct(r.labelCardBorderOpacity ?? .3),{ min:0, max:100, step:1, suffix:'%', integer:true }) + control('Grubość ramki','labelCardBorderWidth','range',clamp(Number(r.labelCardBorderWidth) || 1, .5, 12),{ min:.5, max:12, step:.5, suffix:'px' })) : ''))
    + sub('Wymiary', control('Zaokrąglenie','labelCardRadius','range',clamp(Number(r.labelCardRadius) || 0, 0, 80),{ min:0, max:60, step:1, suffix:'px', integer:true })
      + control('Margines','labelCardPadding','range',clamp(Number(r.labelCardPadding) || 0, 0, 60),{ min:0, max:40, step:1, suffix:'px', integer:true })
      + control('Odstęp','labelCardGap','range',clamp(Number(r.labelCardGap) || 0, 0, 40),{ min:0, max:30, step:1, suffix:'px', integer:true })
      + control('Rozmiar całości','labelCardScale','range',clamp(Number(r.labelCardScale) || 1, .3, 4),{ min:.3, max:3, step:.05, suffix:'×' }))
    + sub('Położenie', control('Lewo / prawo','labelCardX','range',Number(r.labelCardX) || 0,{ min:-600, max:600, step:1, suffix:'px', integer:true })
      + control('Góra / dół','labelCardY','range',Number(r.labelCardY) || 0,{ min:-600, max:600, step:1, suffix:'px', integer:true }));
  const group = section('Grupa', note(translateValue('Na planie w trybie edycji możesz przeciągać grupę albo jej części palcem lub myszą.'))
    + control('Grupuj ikonę, nazwę i stan','labelLinked','checkbox',!!r.labelLinked,refresh)
    + note(translateValue(r.labelLinked ? 'Ikona, nazwa i stan są jedną grupą ze wspólnym tłem. Układ i styl ustawiasz niżej, a położenie części w grupie — w sekcjach Nazwa i Stan.' : 'Ikona, nazwa i stan są osobno — każdą część przesuwasz oddzielnie. Włącz „Grupuj ikonę, nazwę i stan”, aby połączyć je w jedną grupę.')) + card);
  const label = group + ROOM_LABEL_PARTS.map(partSection).join('');
  return previewRow('previewOn', roomPreviewOn) + entities + (icon ? '' : look) + label;
}
function openRoomEditor(id, preserveSection = roomEditorOpenSectionIndex, forceSection = null) {
  const room = roomsOf()[id], panel = $('#room-editor'); if (!room || !panel) return closeRoomEditor();
  const newlySelected = selectedRoomId !== id;
  if (newlySelected) { preserveSection = roomEditorOpenSectionIndex = -1; roomPreviewOn = ''; }
  if (forceSection !== null) preserveSection = roomEditorOpenSectionIndex = forceSection;
  closeEditor(); closeFlowEditor(); selectedRoomId = id;
  $('#room-editor-title').textContent = room.name || translateValue(isIconRoom(room) ? 'Ikona' : 'Pomieszczenie');
  const kind = $('#room-editor .editor-meta code'); if (kind) kind.textContent = translateValue(isIconRoom(room) ? 'Ikona' : 'Pomieszczenie');
  const kindIcon = $('#room-editor .room-editor-icon .mdi'); if (kindIcon) kindIcon.className = `mdi ${isIconRoom(room) ? 'mdi-lightbulb-group' : 'mdi-floor-plan'}`;
  const entityInfo = $('#room-editor-entities'); if (entityInfo) entityInfo.textContent = (room.entityIds || []).join(', ') || '—';
  syncLockButton($('#room-geometry-lock'), room.geometryLocked); const paste = $('#room-paste-style'); if (paste) paste.disabled = !roomStyleClipboard;
  const content = $('#room-editor-content'), scroll = content.scrollTop;
  const openSubs = new Set($$('.gauge-subsection[open] > summary', content).map(node => node.textContent.trim()));
  content.innerHTML = roomEditorMarkup(room);
  if (!newlySelected) $$('.gauge-subsection > summary', content).forEach(node => { if (openSubs.has(node.textContent.trim())) node.parentElement.open = true; });
  const sections = $$('.editor-section', content);
  if (Number.isInteger(preserveSection) && preserveSection >= 0 && sections[preserveSection]) sections[preserveSection].open = true;
  sections.forEach((details, index) => details.addEventListener('toggle', () => {
    if (details.open) { roomEditorOpenSectionIndex = index; sections.forEach(other => { if (other !== details) other.removeAttribute('open'); }); }
    else if (roomEditorOpenSectionIndex === index) roomEditorOpenSectionIndex = -1;
  }));
  $$('input,select', content).forEach(input => {
    if (input.type === 'range' || input.type === 'color') { input.addEventListener('input', onRoomEditorInput); input.addEventListener('change', onRoomEditorInput); }
    else if (input.id !== 'room-entity-search') input.addEventListener('change', onRoomEditorInput);
  });
  $('#room-entity-search')?.addEventListener('input', renderRoomEntityResults); renderRoomEntityResults();
  content.scrollTop = scroll;
  panel.classList.add('visible'); panel.setAttribute('aria-hidden', 'false'); renderRooms();
  if (newlySelected && !skipRoomFocus) requestAnimationFrame(() => requestAnimationFrame(() => { focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []); renderRoomEditLayer(); }));
  requestAnimationFrame(() => { const outline = $('#room-edit-layer .room-outline.selected'); if (outline && !mobileView() && !panel.dataset.dragged) placeEditorNear(panel, outline); });
}
function closeRoomEditor() {
  selectedCorner = null;
  const panel = $('#room-editor'); if (!panel) return;
  if (mobileView() && editMode && panel.classList.contains('visible')) requestAnimationFrame(applyViewTransform);
  const had = selectedRoomId; selectedRoomId = null; roomPreviewOn = ''; delete panel.dataset.dragged;
  panel.classList.remove('visible'); panel.setAttribute('aria-hidden', 'true'); if (had) renderRooms();
}
function onRoomEditorInput(event) {
  const room = roomsOf()[selectedRoomId], input = event.target; if (!room) return;
  const path = input.dataset.path; if (!path) return;
  let value = input.type === 'checkbox' ? input.checked : input.value;
  if (input.dataset.valueType === 'range' || input.dataset.valueType === 'number') { value = Number(value); if (!Number.isFinite(value)) return; }
  if (input.type === 'color') { value = String(value).toUpperCase(); const preview = input.closest('.color-picker')?.querySelector('.color-current'); if (preview) preview.style.background = value; }
  if (path === 'previewOn') { roomPreviewOn = String(value); renderRooms(); return; }
  if (path === 'opacity') value = clamp(value / 100, .05, 1);
  if (path === 'offOpacity') value = clamp(value / 100, 0, 1);
  if (/^label(Icon|Name|State|Card)BgOpacity$|^labelIconOpacity(On|Off)?$|^label(Card|Icon)BorderOpacity$|^labelIcon(Bg|Border|Outline)(On|Off)Opacity$|^labelCard(Bg|Border)(On|Off)Opacity$|^labelIconOutlineOpacity$/.test(path)) value = clamp(value / 100, 0, 1);
  if (/^labelIconName(On|Off)?$/.test(path)) value = String(value).trim();
  if (path === 'labelIconName') value = String(value).trim();
  if (path === 'name') { value = String(value).trim() || translateValue('Pomieszczenie'); $('#room-editor-title').textContent = value; const icon = model.entities[roomIconId(room.id)]; if (icon) { icon.displayName = value; renderMarkers(); } }
  room[path] = value; room.updatedAt = new Date().toISOString();
  const output = input.closest('.control')?.querySelector('output'); if (output) output.textContent = input.value + (output.dataset.suffix || '');
  renderRooms();
  if (input.dataset.editorRefresh === 'true') { openRoomEditor(room.id); scheduleSave(true); return; }
  scheduleSave(event.type === 'change');
}
function onRoomEditorClick(event) {
  const layoutButton = event.target.closest('[data-card-layout]'), styleButton = event.target.closest('[data-card-style]'), alignButton = event.target.closest('[data-card-align]');
  if (layoutButton || styleButton || alignButton) {
    event.preventDefault(); const room = roomsOf()[selectedRoomId]; if (!room) return;
    if (layoutButton) room.labelCardLayout = layoutButton.dataset.cardLayout;
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
    const ids = new Set(room.entityIds || []); if (addId) ids.add(addId); if (removeId) ids.delete(removeId);
    room.entityIds = [...ids]; room.updatedAt = new Date().toISOString();
    const query = $('#room-entity-search')?.value || ''; refreshStates(); openRoomEditor(room.id, openSectionIndex($('#room-editor-content'), roomEditorOpenSectionIndex)); scheduleSave(true);
    const search = $('#room-entity-search'); if (search && addId && query) { search.value = query; renderRoomEntityResults(); }
    return;
  }
  const toggle = event.target.closest('[data-color-toggle]'), swatch = event.target.closest('[data-palette-color]'), rgb = event.target.closest('[data-rgb-color]'), content = $('#room-editor-content');
  const reset = event.target.closest('[data-reset-path]');
  if (reset) { event.preventDefault(); const input = content.querySelector(`input[data-path="${CSS.escape(reset.dataset.resetPath)}"]`), defaults = { opacity: ROOM_DEFAULTS.opacity * 100, offOpacity: ROOM_DEFAULTS.offOpacity * 100, feather: ROOM_DEFAULTS.feather, ...Object.fromEntries(ROOM_LABEL_PARTS.flatMap(([, k]) => [[`${k}Size`, ROOM_DEFAULTS[`${k}Size`]], [`${k}X`, ROOM_DEFAULTS[`${k}X`]], [`${k}Y`, ROOM_DEFAULTS[`${k}Y`]], [`${k}BgOpacity`, ROOM_DEFAULTS[`${k}BgOpacity`] * 100]])), labelIconOpacityOn: 100, labelIconOpacityOff: 100, labelIconOutlineWidth: 1.5, labelCardBgOpacity: 62, labelCardBorderOpacity: 30, labelCardBgOnOpacity: 62, labelCardBgOffOpacity: 62, labelCardBorderOnOpacity: 70, labelCardBorderOffOpacity: 30, labelCardBorderOnWidth: 1.5, labelCardBorderOffWidth: 1, labelIconBorderOpacity: 60, labelIconBorderWidth: 1.5, labelIconOpacity: 100, labelIconBgOnOpacity: 60, labelIconBgOffOpacity: 55, labelIconBorderOnOpacity: 80, labelIconBorderOffOpacity: 50, labelIconBorderOnWidth: 2, labelIconBorderOffWidth: 1.5, labelIconOutlineOnWidth: 1.5, labelIconOutlineOffWidth: 1.5, labelIconOutlineOpacity: 100, labelIconOutlineOnOpacity: 100, labelIconOutlineOffOpacity: 100, labelIconRadius: 10, labelIconPadding: 6, labelCardBorderWidth: 1, labelCardRadius: 14, labelCardPadding: 10, labelCardGap: 4, labelCardScale: 1, labelCardX: 0, labelCardY: 0, labelIconDX: 0, labelIconDY: 0, labelNameDX: 0, labelNameDY: 0, labelStateDX: 0, labelStateDY: 0, lightX: 50, lightY: 50, lightWallPos: 50, lightSpread: ROOM_DEFAULTS.lightSpread, lightFill: ROOM_DEFAULTS.lightFill }; if (input && reset.dataset.resetPath in defaults) { input.value = defaults[reset.dataset.resetPath]; input.dispatchEvent(new Event('change', { bubbles:true })); } return; }
  if (toggle) { event.preventDefault(); const menu = toggle.closest('.color-picker').querySelector('.color-menu'), open = menu.classList.contains('visible'); $$('.color-menu', content).forEach(x => x.classList.remove('visible')); menu.classList.toggle('visible', !open); return; }
  if (swatch) { event.preventDefault(); const picker = swatch.closest('.color-picker'), input = $('.color-native', picker); input.value = swatch.dataset.paletteColor; $('.color-current', picker).style.background = input.value; $('.color-menu', picker).classList.remove('visible'); input.dispatchEvent(new Event('change', { bubbles:true })); return; }
  if (rgb) { event.preventDefault(); rgb.closest('.color-picker').querySelector('.color-native').click(); }
}
async function removeRoom() {
  const view = activeSceneView(), room = view?.rooms?.[selectedRoomId]; if (!room) return;
  if (!await appConfirm({ title:'Usunąć pomieszczenie?', message:`Pomieszczenie „${room.name}” zostanie usunięte z tego widoku. Encje i markery zostają.`, confirmText:'Usuń', danger:true })) return;
  delete view.rooms[room.id]; closeRoomEditor(); if (removeRoomIcon(view, room.id)) renderMarkers(); renderRooms(); scheduleSave(true); notify('Usunięto pomieszczenie');
}
// Tapping a room in view mode: toggles its lights/switches (all off when any is on, otherwise all on),
// or opens More Info of its first entity.
const roomTogglesInFlight = new Set();
let lastLabelTap = 0;
async function onRoomTap(room, action = null) {
  const r = { ...ROOM_DEFAULTS, ...room, ...(action ? { tapAction: action } : {}) }, ids = r.entityIds || [];
  if (!ids.length) { if (!isViewer()) notify(isIconRoom(room) ? 'Ta ikona nie ma jeszcze encji — wybierz je w trybie edycji' : 'To pomieszczenie nie ma jeszcze encji — wybierz je w trybie edycji'); return; }
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
function copyRoomStyle() { const room = roomsOf()[selectedRoomId]; if (!room) return; roomStyleClipboard = Object.fromEntries(ROOM_STYLE_KEYS.filter(key => key in room).map(key => [key, clone(room[key])])); const paste = $('#room-paste-style'); if (paste) paste.disabled = false; notify('Skopiowano styl pomieszczenia — wklej go w innym pomieszczeniu'); }
function pasteRoomStyle() { const room = roomsOf()[selectedRoomId]; if (!room || !roomStyleClipboard) return; ROOM_STYLE_KEYS.forEach(key => delete room[key]); Object.assign(room, clone(roomStyleClipboard), { updatedAt:new Date().toISOString() }); renderRooms(); openRoomEditor(room.id); scheduleSave(true); notify('Wklejono styl pomieszczenia'); }
async function resetRoomStyle() { const room = roomsOf()[selectedRoomId]; if (!room || !await appConfirm({ title:'Przywrócić domyślny wygląd?', message:'Wygląd i akcja dotknięcia pomieszczenia wrócą do domyślnych. Kształt, nazwa i encje zostaną.', confirmText:'Przywróć', danger:true })) return; ROOM_STYLE_KEYS.forEach(key => delete room[key]); room.updatedAt = new Date().toISOString(); renderRooms(); openRoomEditor(room.id); scheduleSave(true); notify('Przywrócono domyślny wygląd pomieszczenia'); }
function duplicateRoom() {
  const view = activeSceneView(), room = view?.rooms?.[selectedRoomId]; if (!room) return;
  const id = 'room_' + uid(), now = new Date().toISOString(), copy = clone(room);
  if (isIconRoom(room)) { Object.assign(copy, { id, name: `${room.name} (${translateValue('kopia')})`, x: clamp((Number(room.x) || 50) + 3, 0, 100), y: clamp((Number(room.y) || 50) + 3, 0, 100), geometryLocked:false, createdAt:now, updatedAt:now }); view.rooms[id] = copy; renderRooms(); openRoomEditor(id); scheduleSave(true); return notify('Utworzono kopię ikony'); }
  const xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
  const dx = Math.max(...xs) + 3 <= 100 ? 3 : -3, dy = Math.max(...ys) + 3 <= 100 ? 3 : -3;
  Object.assign(copy, { id, name: `${room.name} (${translateValue('kopia')})`, points: room.points.map(([x, y]) => [clamp(x + dx, 0, 100), clamp(y + dy, 0, 100)]), geometryLocked:false, createdAt:now, updatedAt:now });
  view.rooms[id] = copy; renderRooms(); openRoomEditor(id); scheduleSave(true); notify('Utworzono kopię pomieszczenia — przeciągnij ją w wybrane miejsce');
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
function roomUsesEntity(entityId) { return Object.values(roomsOf()).some(room => (room.entityIds || []).includes(entityId)); }
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
  if (other) notify(`Zapisano, ale ustawiony jest też domyślny panel „${other}”, który ma pierwszeństwo — wybierz „HA Views — moje konto” albo zmień Panel w profilu HA.`, true);
  else notify(mode === 'user' ? 'HA Views jest teraz domyślnym panelem na Twoim koncie' : mode === 'device' ? 'HA Views jest domyślnym panelem na tym urządzeniu' : 'Przywrócono domyślny panel z ustawień Home Assistant');
  setTimeout(syncHaStartSelect, 300);
}
// ---- Alignment guides while dragging (edit mode) --------------------------------------
// The dragged marker/Flow snaps to the edges and centres of the other elements of the view; a blue line
// shows what it is aligned with. Holding Alt (desktop) drags freely.
// Rooms add their own guides (centre and edges of the room's bounding box) in a different colour, for the
// room the dragged element sits in (and the room of a room icon), e.g. to put an icon right in the middle.
const SNAP_DEFAULTS = Object.freeze({ guides:true, visibleOnly:true, markers:true, flows:true, rooms:true, background:true, centers:true, edges:true });
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
function guideTargets({ node = null, roomId = '' } = {}) {
  const scene = els.scene.getBoundingClientRect();
  const t = snapTargets(), points = (a, b) => [...(t.edges ? [a, b] : []), ...(t.centers ? [(a + b) / 2] : [])];
  // "Only visible": on a zoomed phone view the element snaps only to what is on screen, not to markers far outside it.
  const view = els.viewport.getBoundingClientRect(), onScreen = r => !t.visibleOnly || (r.right > view.left && r.left < view.right && r.bottom > view.top && r.top < view.bottom);
  const selector = [t.markers ? '.marker' : '', t.flows ? '.flow-marker' : ''].filter(Boolean).join(', ');
  const targets = selector ? $$(selector, els.markers).filter(other => other !== node && other.offsetParent !== null && !(roomId && model.entities[other.dataset?.markerId]?.roomId === roomId)).map(other => other.getBoundingClientRect()).filter(onScreen) : [];
  const xs = targets.flatMap(r => points(r.left, r.right).map(v => ({ v: v - scene.left, room:false })));
  const ys = targets.flatMap(r => points(r.top, r.bottom).map(v => ({ v: v - scene.top, room:false })));
  if (t.background) { xs.push(...points(0, scene.width).map(v => ({ v, bg:true }))); ys.push(...points(0, scene.height).map(v => ({ v, bg:true }))); }
  if (t.rooms) Object.values(roomsOf()).filter(room => room.id !== roomId && (room.points || []).length >= 3).forEach(room => {
    const px = room.points.map(p => p[0] / 100 * scene.width), py = room.points.map(p => p[1] / 100 * scene.height);
    const [minX, maxX, minY, maxY] = [Math.min(...px), Math.max(...px), Math.min(...py), Math.max(...py)];
    if (!onScreen({ left: scene.left + minX, right: scene.left + maxX, top: scene.top + minY, bottom: scene.top + maxY })) return;
    xs.push(...points(minX, maxX).map(v => ({ v, room:true }))); ys.push(...points(minY, maxY).map(v => ({ v, room:true })));
    if (t.edges) { px.forEach(v => { if (v > minX + .5 && v < maxX - .5) xs.push({ v, room:true }); }); py.forEach(v => { if (v > minY + .5 && v < maxY - .5) ys.push({ v, room:true }); }); }
  });
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
  const slow = motion.speed < (mobileView() ? .5 : .4), threshold = 6, release = 11, match = (axis, centre, half, values) => {
    const stuck = motion.stick[axis];
    if (stuck && Math.abs(centre + stuck.offset - stuck.line) <= release) return { ...stuck, centre: stuck.line - stuck.offset };
    motion.stick[axis] = null; if (!slow) return null;
    let best = null;
    (context.offsets || [0, -1, 1]).map(k => k * half).forEach(offset => values.forEach(({ v, room, bg }) => { const distance = Math.abs(centre + offset - v); if (distance <= threshold && (!best || distance < best.distance - .01 || (Math.abs(distance - best.distance) <= .01 && (room || bg) && !best.room && !best.bg))) best = { distance, centre: v - offset, line: v, offset, room, bg }; }));
    motion.stick[axis] = best; return best;
  };
  // A fast drag that stops right on a line: ~0.12 s without movement counts as slow, so the line is offered then.
  clearTimeout(motion.timer);
  if (!slow && context.onSettle) motion.timer = setTimeout(() => { motion.speed = 0; context.onSettle?.(); }, 120);
  const { width, height } = context.scene, bx = match('x', xPercent / 100 * width, context.halfW, context.xs), by = match('y', yPercent / 100 * height, context.halfH, context.ys);
  if (bx) xPercent = clamp(bx.centre / width * 100, 0, 100);
  if (by) yPercent = clamp(by.centre / height * 100, 0, 100);
  showAlignGuides(bx ? [{ at: bx.line / width * 100, room: bx.room, bg: bx.bg }] : [], by ? [{ at: by.line / height * 100, room: by.room, bg: by.bg }] : []);
  return { xPercent, yPercent };
}
function showAlignGuides(vertical, horizontal) {
  let layer = $('#align-guides');
  if (!vertical.length && !horizontal.length) { if (layer) layer.innerHTML = ''; return; }
  if (!layer) { layer = document.createElement('div'); layer.id = 'align-guides'; layer.setAttribute('aria-hidden', 'true'); els.scene.append(layer); }
  const kind = g => g.room ? ' room' : g.bg ? ' bg' : '';
  layer.innerHTML = vertical.map(g => `<span class="align-guide vertical${kind(g)}" style="left:${g.at}%"></span>`).join('') + horizontal.map(g => `<span class="align-guide horizontal${kind(g)}" style="top:${g.at}%"></span>`).join('');
}
// ---- Keep elements inside the background ("Granice tła", on by default) -------------------
// Markers and Flows are kept with their whole box inside the scene while dragging or resizing
// (rooms already cannot leave it: their corners are limited to 0–100 %).
function keepInBounds() { return model.settings?.keepInBounds !== false; }
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
function focusSelectedOnMobile() {
  const room = selectedRoomId && roomsOf()[selectedRoomId];
  if (room) focusSceneBoxOnMobile(isIconRoom(room) ? iconFocusBox(room) : room.points || []); else focusSelectedMarkerOnMobile();
}
function refocusWhileTyping() {
  if (!mobileView() || !editMode) return;
  const open = keyboardOpen();
  // Keyboard opening / open: centre at once on every size change (no waiting), and once more when it has settled.
  if (open) { keyboardWasOpen = true; focusSelectedOnMobile(); }
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
  els.scene.style.setProperty('--scene-scale', sceneScale);
  applyViewTransform();
  requestAnimationFrame(() => {
    $$('.marker', els.markers).forEach(node => {
      const marker = model.entities[node.dataset.markerId];
      if (marker) applyMarkerStyle(node, marker);
    });
    syncSelection(); positionEditor(); syncFlowSelection(); positionFlowEditor(); renderRooms(); if ($('#snap-menu')?.classList.contains('open')) syncSnapMenu();
  });
}
function portraitZoomExpansion() {
  return !mobileWidePanorama() && els.image.naturalHeight > els.image.naturalWidth && viewZoom > 1.01;
}
function minViewZoom() {
  if (!mobileWidePanorama()) return 1;
  return clamp(els.viewport.clientWidth / Math.max(1, els.scene.offsetWidth), .08, 1);
}
function editSheetCover() {
  if (!mobileView() || !editMode) return 0;
  const sheets = [els.editor, els.flowEditor, $('#room-editor')].filter(panel => panel?.classList.contains('visible'));
  if (!sheets.length) return 0;
  // offsetHeight ignores the slide-in transform, so the value is final even while the sheet animates.
  const sheetTop = Math.min(...sheets.map(panel => innerHeight - panel.offsetHeight)), viewportBottom = els.viewport.getBoundingClientRect().bottom;
  return Math.max(0, viewportBottom - sheetTop);
}
function clampViewPan() {
  if (!sceneCameraActive()) { viewPanX = 0; viewPanY = 0; return; }
  const panorama = mobileWidePanorama();
  if (viewZoom <= minViewZoom() && !panorama) { viewPanX = 0; viewPanY = 0; return; }
  const maxX = Math.max(0, els.scene.offsetWidth * viewZoom - els.viewport.clientWidth);
  const maxY = Math.max(0, els.scene.offsetHeight * viewZoom - els.viewport.clientHeight);
  // While editing on a phone, the camera may go past the lower scene edge only by the part of the viewport
  // the bottom editor covers: the empty area then stays hidden under the editor, never shown as a bare frame.
  const editBottomAllowance = editSheetCover();
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
  if (!sceneCameraActive()) { els.scene.style.transform = ''; updatePanoramaIndicator(); return; }
  clampViewPan();
  els.scene.style.transformOrigin = '0 0';
  els.scene.style.transform = `translate(${viewPanX}px,${viewPanY}px) scale(${viewZoom})`;
  els.scene.style.setProperty('--view-zoom', viewZoom); // room handles keep their on-screen size when zoomed
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
      const availableHeight = Math.max(160, layoutViewportHeight() - card.getBoundingClientRect().top - 8);
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
    const top = card.getBoundingClientRect().top;
    const viewportHeight = layoutViewportHeight();
    const availableHeight = Math.max(160, viewportHeight - top - 8);
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
  if (marker.iconVariantEnabled) {
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
  const outlineNode = $('.marker-outline', node);
  const outlineRadius = s.shape === 'circle' ? '50%' : s.shape === 'square' ? '0px' : `${Math.max(0, Number(s.radius) || 0) + Math.max(0, Number(borderWidth) || 0)}px`;
  if (outlineNode) Object.assign(outlineNode.style, { inset: `-${borderWidth}px`, border: s.showBorder && borderWidth > 0 ? `${borderWidth}px solid ${rgba(borderColor, borderOpacity)}` : '0 solid transparent', borderRadius: outlineRadius });
  const label = $('.label', node), value = $('.value', node);
  if (label) Object.assign(label.style, { color: s.labelColor, opacity: clamp(s.labelOpacity, 0, 1), fontSize: `${12 * s.labelScale * contentScale}px` });
  if (value) Object.assign(value.style, { color: rule?.apply.value ? rule.color : s.valueColor, opacity: clamp(s.valueOpacity, 0, 1), fontSize: `${22 * s.valueScale * contentScale}px` });
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
  const top = Math.max(($('.topbar')?.getBoundingClientRect().bottom || 0) - vr.top, 0) + 14;
  const bottom = Math.min(editorTop, vr.bottom) - vr.top - 14;
  return { top, bottom, height: Math.max(60, bottom - top) };
}
function focusSceneBoxOnMobile(points) {
  if (!mobileView() || !editMode || !points.length) return;
  const sceneWidth = els.scene.offsetWidth || 1, sceneHeight = els.scene.offsetHeight || 1;
  const xs = points.map(p => Number(p[0]) / 100 * sceneWidth), ys = points.map(p => Number(p[1]) / 100 * sceneHeight);
  const boxW = Math.max(1, Math.max(...xs) - Math.min(...xs)), boxH = Math.max(1, Math.max(...ys) - Math.min(...ys));
  const viewW = els.viewport.clientWidth || 1, viewH = els.viewport.clientHeight || 1;
  const { top: freeTop, height: freeH } = editorFreeBand();
  const nextZoom = clamp(Math.min(viewW * .86 / boxW, freeH / boxH), minViewZoom(), 2.35);
  const centreX = (Math.min(...xs) + Math.max(...xs)) / 2, centreY = (Math.min(...ys) + Math.max(...ys)) / 2;
  const targetY = freeTop + freeH / 2;
  viewZoom = nextZoom; viewPanX = viewW / 2 - centreX * nextZoom; viewPanY = targetY - centreY * nextZoom;
  applyViewTransform();
}
function focusScenePointOnMobile(xPercent, yPercent) {
  if (!mobileView() || !editMode) return;
  const marker = { xPercent, yPercent };
  // Deliberately closer than beta.52: selected markers remain clear of the
  // bottom editor even on the lowest part of a portrait background.
  const nextZoom = clamp(Math.max(viewZoom, 2.1), minViewZoom(), 2.35);
  const sceneWidth = els.scene.offsetWidth || 1, sceneHeight = els.scene.offsetHeight || 1;
  const markerX = Number(marker.xPercent || 50) / 100 * sceneWidth;
  const markerY = Number(marker.yPercent || 50) / 100 * sceneHeight;
  const targetX = els.viewport.clientWidth / 2, band = editorFreeBand();
  const targetY = band.top + band.height / 2;
  viewZoom = nextZoom; viewPanX = targetX - markerX * nextZoom; viewPanY = targetY - markerY * nextZoom;
  applyViewTransform();
}
function selectMarker(key) {
  editorOpenSectionIndex = -1; if (selectedId !== key) editorPreview = { entityId:'', state:'' }; selectedId = key; renderMarkers(); openEditor();
  requestAnimationFrame(() => requestAnimationFrame(focusSelectedMarkerOnMobile));
}
function hideSelection() { els.selection.classList.remove('visible','geometry-locked'); }
function syncSelection() {
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
    const beforeX = viewPanX, beforeY = viewPanY; viewPanX += vx; viewPanY += vy; applyViewTransform();
    if (Math.abs(viewPanX - beforeX) < .01 && Math.abs(viewPanY - beforeY) < .01) return; // the camera is at its limit
    // While the camera carries the element nothing snaps to guides (they would hold it back in jerks).
    cameraPanning = true; try { onPan(last); } finally { cameraPanning = false; }
    // Keeps going on its own while the finger rests at the edge (a still finger sends no move events).
    if (!frame) frame = requestAnimationFrame(step);
  };
  return { track(event) { last = event; if (!frame) frame = requestAnimationFrame(step); }, stop() { cancelAnimationFrame(frame); frame = 0; last = null; since = 0; } };
}
function animateViewPan(toX, toY, ms = 280) {
  cancelAnimationFrame(animateViewPan.frame);
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
function startDrag(event) {
  if (!editMode || event.button !== 0) return;
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
  directionMode: { manual:'mdi-arrow-right-bold-outline', auto:'mdi-plus-minus-variant' }, decimals: { auto:'', 0:'', 1:'', 2:'', 3:'' }, 'style.tickFontFamily': {}, linkView: {}
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
function control(label, path, type, value, options = {}) {
  const rounded = Boolean(options.integer);
  const displayValue = rounded ? Math.round(Number(value) || 0) : value;
  const attrs = [`data-path="${path}"`, `data-value-type="${options.valueType || type}"`];
  if (rounded) attrs.push('data-integer="true"');
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
  const manualIcons = manual ? control('Ikona zależna ON/OFF','iconVariantEnabled','checkbox',!!marker.iconVariantEnabled,refresh) + (marker.iconVariantEnabled ? mdiControl('Ikona ON','iconOn',marker.iconOn) + mdiControl('Ikona OFF','iconOff',marker.iconOff) : mdiControl('Ikona podstawowa','iconName',marker.iconName)) : '';
  const fill = s.iconFillEnabled !== false ? control('Kolor zależny ON/OFF','style.iconStateEnabled','checkbox',s.iconStateEnabled,refresh) + (s.iconStateEnabled ? control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) : control('Kolor','style.iconColor','color',s.iconColor)) + control('Przezroczystość zależna ON/OFF','style.iconOpacityStateEnabled','checkbox',!!s.iconOpacityStateEnabled,refresh) + (s.iconOpacityStateEnabled ? control('Przezroczystość ON','style.iconOnOpacity','range',s.iconOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.iconOffOpacity','range',s.iconOffOpacity,{min:0,max:1,step:.01}) : control('Przezroczystość','style.iconOpacity','range',s.iconOpacity,{min:0,max:1,step:.01})) : '';
  const outline = s.iconOutlineEnabled ? control('Obrys zależny ON/OFF','style.iconOutlineStateEnabled','checkbox',s.iconOutlineStateEnabled,refresh) + (s.iconOutlineStateEnabled ? control('Kolor obrysu ON','style.iconOutlineOnColor','color',s.iconOutlineOnColor) + control('Kolor obrysu OFF','style.iconOutlineOffColor','color',s.iconOutlineOffColor) + control('Przezroczystość obrysu ON','style.iconOutlineOnOpacity','range',s.iconOutlineOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość obrysu OFF','style.iconOutlineOffOpacity','range',s.iconOutlineOffOpacity,{min:0,max:1,step:.01}) + control('Grubość obrysu ON','style.iconOutlineOnWidth','range',s.iconOutlineOnWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość obrysu OFF','style.iconOutlineOffWidth','range',s.iconOutlineOffWidth,{min:1,max:8,step:.5,suffix:'px'}) : control('Kolor obrysu','style.iconOutlineColor','color',s.iconOutlineColor) + control('Przezroczystość obrysu','style.iconOutlineOpacity','range',s.iconOutlineOpacity,{min:0,max:1,step:.01}) + control('Grubość obrysu','style.iconOutlineWidth','range',s.iconOutlineWidth,{min:1,max:8,step:.5,suffix:'px'})) : '';
  const iconBody = control('Pokaż','style.showIcon','checkbox',s.showIcon,refresh) + (s.showIcon ? control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']],...refresh}) + manualIcons + mdiList + (!integrationLogo ? control('Wypełnienie','style.iconFillEnabled','checkbox',s.iconFillEnabled,refresh) + fill + control('Obrys','style.iconOutlineEnabled','checkbox',s.iconOutlineEnabled,refresh) + outline : '') + control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + control('Lewo / prawo','style.iconX','range',s.iconX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.iconY','range',s.iconY,{min:-100,max:100,step:1,suffix:'px'}) : '');
  const icon = section('Ikona', iconBody);
  const bgBody = control('Pokaż','style.showBackground','checkbox',s.showBackground,refresh) + (s.showBackground ? backgroundGradientControls(s) + (s.backgroundStateEnabled ? control('Kolor ON','style.backgroundOnColor','color',s.backgroundOnColor) + control('Kolor OFF','style.backgroundOffColor','color',s.backgroundOffColor) + control('Przezroczystość ON','style.backgroundOnOpacity','range',s.backgroundOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.backgroundOffOpacity','range',s.backgroundOffOpacity,{min:0,max:1,step:.01}) : control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezroczystość','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01})) + control('Tło zależne ON/OFF','style.backgroundStateEnabled','checkbox',s.backgroundStateEnabled,refresh) : '');
  const background = section('Tło', bgBody);
  const borderBody = control('Pokaż','style.showBorder','checkbox',s.showBorder,refresh) + (s.showBorder ? control('Kształt','style.shape','select',s.shape,{items:[['rounded','Zaokrąglony'],['circle','Koło / owal']],...refresh}) + (s.shape === 'rounded' ? control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}) : '') + (s.borderStateEnabled ? control('Kolor ON','style.borderOnColor','color',s.borderOnColor) + control('Kolor OFF','style.borderOffColor','color',s.borderOffColor) + control('Przezroczystość ON','style.borderOnOpacity','range',s.borderOnOpacity,{min:0,max:1,step:.01}) + control('Przezroczystość OFF','style.borderOffOpacity','range',s.borderOffOpacity,{min:0,max:1,step:.01}) + control('Grubość ON','style.borderOnWidth','range',s.borderOnWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Grubość OFF','style.borderOffWidth','range',s.borderOffWidth,{min:0,max:12,step:1,suffix:'px'}) : control('Kolor','style.borderColor','color',s.borderColor) + control('Przezroczystość','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'})) + control('Ramka zależna ON/OFF','style.borderStateEnabled','checkbox',s.borderStateEnabled,refresh) : '');
  const border = section('Ramka', borderBody);
  if (isTextId(marker.entityId)) return entity + size + icon + background + border;
  return withStatePreview(entity + size + icon + valueRulesSection(marker) + background + border, marker, ['Encja','Ikona','Tło','Ramka']);
}


function compactBadgeEditor(root, marker) {
  const s = marker.style;
  const hide = paths => paths.forEach(path => {
    const input = root.querySelector(`[data-path="${path}"]`);
    if (input) input.closest('.control').style.display = 'none';
  });
  const refresh = paths => paths.forEach(path => {
    const input = root.querySelector(`[data-path="${path}"]`);
    if (input) input.dataset.editorRefresh = 'true';
  });
  refresh(['style.showLabel','style.showValue','style.showBackground','style.backgroundStateEnabled','style.showBorder','style.shape','style.borderStateEnabled','style.showIcon','iconMode','iconVariantEnabled','style.iconFillEnabled','style.iconStateEnabled','style.iconOpacityStateEnabled','style.iconOutlineEnabled','style.iconOutlineStateEnabled']);
  if (!s.showLabel) hide(['style.labelColor','style.labelOpacity','style.labelScale','style.labelX','style.labelY']);
  if (!s.showValue) hide(['style.valueColor','style.valueOpacity','style.valueScale','style.valueX','style.valueY']);
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
    else if (marker.iconVariantEnabled) hide(['iconName']);
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

function editorMarkup(marker) {
  if (marker.type === 'icon') return iconEditorMarkup(marker);
  const s = marker.style;
  const tapAction = tapActionControl(marker.tapAction || 'more_info', isToggleableMarker(marker));
  const textEl = isTextId(marker.entityId);
  const entity = textEl ? section('Tekst i akcja', control('Tekst','textValue','text',marker.textValue ?? '') + control('Podpis','displayName','text',marker.displayName) + linkControls(marker)) : section('Encja', control('Nazwa','displayName','text',marker.displayName) + control('Jednostka','unitOverride','text',marker.unitOverride) + control('Zaokrąglenie','decimals','select',marker.decimals,{items:[['auto','Auto'],[0,'0'],[1,'1'],[2,'2'],[3,'3']]}) + control('Tekst ON','stateOnLabel','text',marker.stateOnLabel) + control('Tekst OFF','stateOffLabel','text',marker.stateOffLabel) + tapAction);
  const label = section('Nazwa', control('Pokaż','style.showLabel','checkbox',s.showLabel) + control('Kolor','style.labelColor','color',s.labelColor) + control('Przezrocz.','style.labelOpacity','range',s.labelOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.labelScale','range',s.labelScale,{min:.5,max:3,step:.05}) + control('Lewo / prawo','style.labelX','range',s.labelX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.labelY','range',s.labelY,{min:-100,max:100,step:1,suffix:'px'}));
  const value = section('Stan', control('Pokaż','style.showValue','checkbox',s.showValue) + control('Kolor','style.valueColor','color',s.valueColor) + control('Przezrocz.','style.valueOpacity','range',s.valueOpacity,{min:0,max:1,step:.01}) + control('Rozmiar','style.valueScale','range',s.valueScale,{min:.5,max:3,step:.05}) + control('Lewo / prawo','style.valueX','range',s.valueX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.valueY','range',s.valueY,{min:-100,max:100,step:1,suffix:'px'}));
  const minimumSize = isGaugeType(marker.type) ? { width: 44, height: 28 } : marker.type === 'icon' ? { width: 24, height: 24 } : { width: 36, height: 24 };
  const maximumSize = { width: 2400, height: 1800 };
  const size = section('Rozmiar', linkedSizeControl('Oba wymiary','style.width','style.height',[minimumSize.width,maximumSize.width,minimumSize.height,maximumSize.height],!!marker.geometryLocked) + control('Szerokość','style.width','range',s.width,{min:minimumSize.width,max:maximumSize.width,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Wysokość','style.height','range',s.height,{min:minimumSize.height,max:maximumSize.height,step:1,suffix:'px',integer:true,disabled:!!marker.geometryLocked}) + control('Skala elementów','style.contentScale','range',s.contentScale,{min:.4,max:5,step:.05,suffix:'×'}) + control('Obrót','rotation','range',Number(marker.rotation) || 0,{min:-180,max:180,step:1,suffix:'°',integer:true,disabled:!!marker.geometryLocked}));
  const background = section('Tło', control('Pokaż','style.showBackground','checkbox',s.showBackground) + backgroundGradientControls(s) + control('Kolor','style.backgroundColor','color',s.backgroundColor) + control('Przezrocz.','style.backgroundOpacity','range',s.backgroundOpacity,{min:0,max:1,step:.01}) + control('Zależne ON/OFF','style.backgroundStateEnabled','checkbox',s.backgroundStateEnabled) + control('Kolor ON','style.backgroundOnColor','color',s.backgroundOnColor) + control('Kolor OFF','style.backgroundOffColor','color',s.backgroundOffColor) + control('Przezrocz. ON','style.backgroundOnOpacity','range',s.backgroundOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.backgroundOffOpacity','range',s.backgroundOffOpacity,{min:0,max:1,step:.01}));
  const border = section('Ramka', control('Kształt','style.shape','select',s.shape,{items:[['square','Prostokąt'],['rounded','Zaokrąglony'],['circle','Koło / owal']]}) + control('Pokaż','style.showBorder','checkbox',s.showBorder) + control('Kolor','style.borderColor','color',s.borderColor) + control('Przezrocz.','style.borderOpacity','range',s.borderOpacity,{min:0,max:1,step:.01}) + control('Grubość','style.borderWidth','range',s.borderWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Zaokrąglenie','style.radius','range',s.radius,{min:0,max:100,step:1,suffix:'px'}) + control('Zależne ON/OFF','style.borderStateEnabled','checkbox',s.borderStateEnabled) + control('Kolor ON','style.borderOnColor','color',s.borderOnColor) + control('Kolor OFF','style.borderOffColor','color',s.borderOffColor) + control('Przezrocz. ON','style.borderOnOpacity','range',s.borderOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.borderOffOpacity','range',s.borderOffOpacity,{min:0,max:1,step:.01}) + control('Grubość ON','style.borderOnWidth','range',s.borderOnWidth,{min:0,max:12,step:1,suffix:'px'}) + control('Grubość OFF','style.borderOffWidth','range',s.borderOffWidth,{min:0,max:12,step:1,suffix:'px'}));
  const mdiList = `<datalist id="mdi-icon-list">${ICON_CHOICES.slice(1).map(([name,label]) => `<option value="${name}">${iconChoiceLabel(label)}</option>`).join('')}</datalist>`;
  const manualIcons = marker.type === 'badge'
    ? (marker.iconMode === 'manual' ? control('Ikona zależna ON/OFF','iconVariantEnabled','checkbox',!!marker.iconVariantEnabled,{refresh:true}) + `<div data-manual-icons>${marker.iconVariantEnabled ? mdiControl('Ikona ON','iconOn',marker.iconOn) + mdiControl('Ikona OFF','iconOff',marker.iconOff) : mdiControl('Ikona podstawowa','iconName',marker.iconName)}</div>` : '')
    : `<div data-manual-icons ${marker.iconMode === 'manual' ? '' : 'hidden'}>${mdiControl('Podstawowa','iconName',marker.iconName)}${mdiControl('Dla ON','iconOn',marker.iconOn)}${mdiControl('Dla OFF','iconOff',marker.iconOff)}</div>`;
  const icon = section('Ikona', control('Pokaż','style.showIcon','checkbox',s.showIcon) + control('Źródło','iconMode','select',marker.iconMode,{items:[['auto','Z encji Home Assistant'],['integration','Logo integracji'],['manual','Własna ikona MDI']]}) + manualIcons + mdiList + control('Wypełnienie','style.iconFillEnabled','checkbox',s.iconFillEnabled) + control('Kolor zależny ON/OFF','style.iconStateEnabled','checkbox',s.iconStateEnabled) + control('Kolor','style.iconColor','color',s.iconColor) + control('Kolor ON','style.iconOnColor','color',s.iconOnColor) + control('Kolor OFF','style.iconOffColor','color',s.iconOffColor) + control('Brak danych','style.iconUnavailableColor','color',s.iconUnavailableColor) + control('Przezrocz.','style.iconOpacity','range',s.iconOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. ON','style.iconOnOpacity','range',s.iconOnOpacity,{min:0,max:1,step:.01}) + control('Przezrocz. OFF','style.iconOffOpacity','range',s.iconOffOpacity,{min:0,max:1,step:.01}) + control('Obrys','style.iconOutlineEnabled','checkbox',s.iconOutlineEnabled) + control('Obrys zależny ON/OFF','style.iconOutlineStateEnabled','checkbox',s.iconOutlineStateEnabled) + control('Kolor obrysu','style.iconOutlineColor','color',s.iconOutlineColor) + control('Kolor obrysu ON','style.iconOutlineOnColor','color',s.iconOutlineOnColor) + control('Kolor obrysu OFF','style.iconOutlineOffColor','color',s.iconOutlineOffColor) + control('Grubość obrysu','style.iconOutlineWidth','range',s.iconOutlineWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość ON','style.iconOutlineOnWidth','range',s.iconOutlineOnWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Grubość OFF','style.iconOutlineOffWidth','range',s.iconOutlineOffWidth,{min:1,max:8,step:.5,suffix:'px'}) + control('Rozmiar','style.iconSize','range',s.iconSize,{min:8,max:100,step:1,suffix:'px'}) + control('Lewo / prawo','style.iconX','range',s.iconX,{min:-100,max:100,step:1,suffix:'px'}) + control('Góra / dół','style.iconY','range',s.iconY,{min:-100,max:100,step:1,suffix:'px'}));
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
  els.editorContent.innerHTML = editorMarkup(marker); syncLinkedSizes(els.editorContent);
  if (marker.type === 'badge') compactBadgeEditor(els.editorContent, marker);
  if (Number.isInteger(preserveSection) && preserveSection >= 0) {
    const section = $$('.editor-section', els.editorContent)[preserveSection];
    if (section) section.open = true;
  }
  $$('[data-editor-tab]').forEach(b => { b.classList.toggle('active', b.dataset.editorTab === marker.type); b.hidden = textEl && isGaugeType(b.dataset.editorTab); });
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
function openSectionIndex(content, fallback) { const index = $$('.editor-section', content).findIndex(section => section.open); return index >= 0 ? index : fallback; }
// ON/OFF preview inside the sections whose look depends on the state (instead of a header button).
function markerHasOnOff(marker) { const raw = String(stateCache[marker.entityId]?.state || '').toLowerCase(); return isToggleableMarker(marker) || ['on','off','open','closed','opened','close','active','inactive','true','false'].includes(raw); }
function stateButtons(path, value) {
  const button = (state, icon, label) => `<button type="button" class="preview-state-button${value === state ? ' active' : ''}" data-preview-path="${path}" data-preview-value="${state}" title="${escapeHtml(translateValue(label))}" aria-pressed="${value === state}"><i class="mdi ${icon}"></i><span>${state.toUpperCase()}</span></button>`;
  return `<div class="control preview-control"><label>Podgląd</label><div class="preview-state-buttons">${button('on', 'mdi-lightbulb-on-outline', 'Podgląd: włączony')}${button('off', 'mdi-lightbulb-off-outline', 'Podgląd: wyłączony')}</div><span></span></div>`;
}
function previewControl(marker) { return stateButtons('__preview', editorPreview.entityId === marker.entityId ? editorPreview.state : ''); }
// A small ON / OFF pair right under the editor header buttons simulates the state while styling (not saved).
function previewRow(path, value) {
  const button = (state, icon, label) => `<button type="button" class="preview-mini${value === state ? ' active' : ''}" data-preview-path="${path}" data-preview-value="${state}" title="${escapeHtml(translateValue(label))}" aria-pressed="${value === state}"><i class="mdi ${icon}"></i><span>${state.toUpperCase()}</span></button>`;
  return `<div class="editor-preview-row"><span>${escapeHtml(translateValue('Podgląd stanu'))}</span>${button('on', 'mdi-lightbulb-on-outline', 'Podgląd: włączony')}${button('off', 'mdi-lightbulb-off-outline', 'Podgląd: wyłączony')}</div>`;
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
    openEditor(openIndex); scheduleSave(true); return;
  }
  if (input.dataset.path === 'iconMode') { const manual = $('[data-manual-icons]', els.editorContent); if (manual) manual.hidden = value !== 'manual'; }
  if (input.type === 'color') { const preview = input.closest('.color-picker')?.querySelector('.color-current'); if (preview) preview.style.background = value; }
  const output = input.parentElement.querySelector('output'); if (output) output.textContent = `${value}${output.dataset.suffix || ''}`;
  const node = markerNode(marker.id);
  if (input.dataset.path === 'displayName' || input.dataset.path === 'textValue') { els.editorTitle.textContent = isTextId(marker.entityId) ? (marker.textValue || marker.displayName || translateValue('Tekst / przycisk')) : value; if (node) node.innerHTML = markerHtml(marker); }
  const needsMarkup = input.dataset.path === 'unitOverride' || input.dataset.path === 'decimals' || input.dataset.path === 'stateOnLabel' || input.dataset.path === 'stateOffLabel' || input.dataset.path.startsWith('icon') || input.dataset.path.startsWith('valueRules.') || input.dataset.path.startsWith('style.show') || isGaugeType(marker.type) && input.dataset.path.startsWith('style.');
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
  const roomRows = rooms.map(room => `<div class="entity-row added-row room-row"><div class="added-identity"><span class="added-kind-icon"><i class="mdi mdi-floor-plan"></i></span><div><strong data-no-i18n>${escapeHtml(room.name || translateValue('Pomieszczenie'))}</strong><small data-no-i18n>${escapeHtml((room.entityIds || []).join(', ') || '—')}</small></div></div>${actions('room', room.id)}</div>`);
  const group = (title, rows) => rows.length ? `<div class="added-group"><div class="added-group-title"><span data-no-i18n>${title === 'Flow' ? 'Flow' : translateValue(title)}</span><b>${rows.length}</b></div>${rows.join('')}</div>` : '';
  const total = markerRows.length + flowRows.length + roomRows.length; els.addedCount.textContent = total;
  els.addedList.innerHTML = total ? group('Markery', markerRows) + group('Flow', flowRows) + group('Pomieszczenia', roomRows) : '<div class="empty-row">Nie dodano jeszcze żadnych elementów.</div>';
}
async function loadIntegrations(force = false) {
  if (integrations.length && !force) return renderIntegrations();
  els.integrationList.innerHTML = '<div class="empty-row">Wczytywanie integracji…</div>';
  try { const data = await api('integrations'); integrations = data.integrations || []; renderIntegrations(); }
  catch (error) { els.integrationList.innerHTML = `<div class="empty-row">Błąd: ${escapeHtml(error.message)}</div>`; }
}
function searchText(value) { return String(value || '').toLocaleLowerCase('pl').trim(); }
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
  return entities.map(e => { const added = markersForEntity(e.entity_id).length > 0; return `<div class="entity-row ${e.enabled ? '' : 'disabled-entity'}"><div><strong data-no-i18n>${escapeHtml(e.name)}</strong><small>${escapeHtml(e.entity_id)}${e.state != null ? ` · ${escapeHtml(e.state)}${e.unit ? ` ${escapeHtml(e.unit)}` : ''}` : ''}</small></div><div class="entity-actions">${enabledIcon(e.enabled)}<button class="add-entity" data-add="${escapeHtml(e.entity_id)}" data-entry="${escapeHtml(e._entryId)}" ${added || !e.enabled ? 'disabled' : ''} title="${added ? 'Dodano do widoku' : e.enabled ? 'Dodaj wskaźnik' : 'Encja jest wyłączona'}">${added ? '✓' : '+'}</button></div></div>`; }).join('');
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
  { key:'icon', label:'Ikona', hint:'Światło, gniazdko, przełącznik', entity:'optional' },
  { key:'badge', label:'Badge', hint:'Temperatura, wilgotność, stan', entity:'required' },
  { key:'gauge', label:'Gauge', hint:'Moc, poziom, procent', entity:'required', numeric:true },
  { key:'horseshoe', label:'Horseshoe', hint:'Moc, bateria, zużycie', entity:'required', numeric:true },
  { key:'room', label:'Pomieszczenie', hint:'Obszar ze stanem encji', entity:'optional' },
  { key:'flow', label:'Flow', hint:'Przepływ energii, wody', entity:'optional', numeric:true },
  { key:'text', label:'Tekst / przycisk', hint:'Podpis, link do widoku, akcja', entity:'none' },
];
const ADD_SAMPLES = {
  icon: { entity_id:'light.hav_sample', name:'Salon', state:'on', unit:'' },
  badge: { entity_id:'sensor.hav_sample_temperature', name:'Salon', state:'21.8', unit:'°C', device_class:'temperature' },
  gauge: { entity_id:'sensor.hav_sample_level', name:'Poziom', state:'64', unit:'%' },
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
  return !type.numeric || addEntityNumeric(entity);
}
function addRecommendedType(entity) {
  if (!entity) return '';
  const domain = entity.domain || entity.entity_id.split('.')[0], unit = String(entity.unit || '').toLowerCase(), dc = String(entity.device_class || '').toLowerCase();
  if (TOGGLE_DOMAINS.includes(domain) || ['binary_sensor','cover','lock','media_player','vacuum'].includes(domain)) return 'icon';
  if (addEntityNumeric(entity) && (['power','energy','battery'].includes(dc) || ['w','kw','kwh','wh','%'].includes(unit))) return 'gauge';
  return 'badge';
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
  markersForEntity(entityId).forEach(marker => parts.push(ADD_TYPES.find(type => type.key === marker.type)?.label || 'Marker'));
  if (Object.values(view?.flows || {}).some(flow => flow.entityId === entityId)) parts.push('Flow');
  if (Object.values(view?.rooms || {}).some(room => (room.entityIds || []).includes(entityId))) parts.push('Pomieszczenie');
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
  if (!entity || !stateCache[source.entity_id]) stateCache[source.entity_id] = { entity_id: source.entity_id, state: String(source.state ?? ''), attributes: { friendly_name: source.name, unit_of_measurement: source.unit || undefined, device_class: source.device_class || undefined, icon: source.icon || undefined } };
  return { id:`__add_thumb_${type}`, entityId: source.entity_id, displayName: entity ? (source.name || source.entity_id) : translateValue(source.name), type, style: markerStyleDefaults(type), unitOverride: source.unit || '', decimals:'auto', stateOnLabel:'', stateOffLabel:'', iconMode:'auto', iconName:'', iconOn:'', iconOff:'', iconVariantEnabled:false, tapAction:'more_info', xPercent:50, yPercent:50 };
}
function addThumbStatic(type, entity) {
  if (type === 'room') return `<svg class="add-thumb-room" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M12 10H62V30H88V52H12Z" fill="#FFD27A" opacity=".6"/><path d="M12 10H62V30H88V52H12Z" fill="none" stroke="#e39a3a" stroke-width=".8" stroke-dasharray="2 1.5"/></svg>${entity ? `<span class="add-thumb-caption" data-no-i18n>${escapeHtml(entity.area || entity.name)}</span>` : ''}`;
  if (type === 'flow') return `<div class="add-thumb-flow"><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i><i class="mdi mdi-chevron-right"></i></div>${entity ? `<span class="add-thumb-caption" data-no-i18n>${escapeHtml(`${entity.state ?? ''} ${entity.unit || ''}`.trim())}</span>` : ''}`;
  return `<span class="add-thumb-text">${escapeHtml(translateValue('Podpis'))}</span><span class="add-thumb-button"><i class="mdi mdi-arrow-right"></i>${escapeHtml(translateValue('Przycisk'))}</span>`;
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
async function openAddDialog() {
  if (!editMode || !els.addDialog) return;
  closeCompactMenus(); closeEditor(); closeFlowEditor(); closeRoomEditor(); cancelRoomDrawing(); cancelAddPicking();
  let pick = false; try { pick = localStorage.getItem(ADD_PICK_KEY) === '1'; } catch {}
  addState = { step:'type', type:'', entity:null, query:'', filter: addRecent().length ? 'recent' : 'all', group:'areas', pick };
  const search = $('#add-search', els.addDialog); search.value = ''; $('#add-pick', els.addDialog).checked = pick;
  els.addDialog.classList.add('visible'); els.addDialog.setAttribute('aria-hidden', 'false'); renderAddDialog();
  await loadEntityCatalog();
  if (addState) { if (!entityCatalog.areas.length) addState.group = 'types'; renderAddDialog(); }
}
// Step one is only the kind of element. A room goes straight to drawing (its entities are picked in the room
// panel afterwards), text and Flow are placed without an entity; markers move on to the entity step.
function chooseAddType(key) {
  const type = ADD_TYPES.find(t => t.key === key); if (!type || !addState) return;
  addState.type = key; addState.entity = null;
  if (type.entity !== 'required') return confirmAddDialog();
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
// "Ikona" from the Add dialog: a room without a shape, with the same group / icon / name / state options.
function addIconElement([x, y]) {
  const view = activeSceneView(); if (!view || !editMode) return; view.rooms ||= {};
  const id = 'room_' + uid(), now = new Date().toISOString(), count = Object.values(view.rooms).filter(isIconRoom).length + 1;
  view.rooms[id] = { ...clone(ROOM_DEFAULTS), ...NEW_ROOM_LABEL, labelCardScale:.5, kind:'icon', draft:true, id, name: `${translateValue('Ikona')} ${count}`, entityIds: [], points: [], x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, createdAt: now, updatedAt: now };
  closeEditor(); closeFlowEditor(); closeRoomEditor(); openRoomWizard(id);
}
function createAddedElement(type, entity, [x, y]) {
  const view = activeSceneView(); if (!view || !editMode) return;
  if (type === 'icon') return addIconElement([x, y]);
  const now = new Date().toISOString(); if (entity) rememberAdded(entity.entity_id);
  if (type === 'text') { addTextElement([x, y]); return; }
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
// A Flow is added like a room (edit menu), with or without an entity; the entity is picked in its popup.
function addBlankFlow() {
  const view = activeSceneView(); if (!view || !editMode) return; closeCompactMenus();
  const s = els.scene.getBoundingClientRect(), v = els.viewport.getBoundingClientRect(), now = new Date().toISOString();
  const x = s.width ? clamp(((Math.max(s.left, v.left) + Math.min(s.right, v.right)) / 2 - s.left) / s.width * 100, 5, 95) : 50;
  const y = s.height ? clamp(((Math.max(s.top, v.top) + Math.min(s.bottom, v.bottom)) / 2 - s.top) / s.height * 100, 5, 95) : 50;
  view.flows ||= {}; const id = 'flow_' + uid();
  view.flows[id] = { id, entityId:'', integrationId:'', integrationName:'', sourceDomain:'', displayName:'Flow', xPercent:Math.round(x * 100) / 100, yPercent:Math.round(y * 100) / 100, ...clone(FLOW_DEFAULTS), itemSizeV2:true, geometryLocked:false, createdAt:now, updatedAt:now };
  renderMarkers(); renderAdded(); openFlowEditor(id); scheduleSave(true); notify('Dodano Flow — wybierz encję albo zostaw bez encji');
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
async function addEntity(entityId, entryId) {
  const integration = integrations.find(x => x.entry_id === entryId), entity = (integrationEntities.get(entryId) || []).find(x => x.entity_id === entityId); if (!integration || !entity) return;
  let offset = Object.keys(model.entities).length % 7; const marker = freshMarker(entity, integration); marker.xPercent = 50 + offset * 2; marker.yPercent = 50 + offset * 2;
  model.entities[marker.id] = marker; renderMarkers(); renderIntegrations(); await queueSave(); await refreshStates(); notify('Dodano świeży Badge z ustawieniami domyślnymi');
}
async function removeMarker(key) {
  const marker = model.entities[key]; if (!marker) return; delete model.entities[key];
  if (!allViewEntityIds().includes(marker.entityId)) delete stateCache[marker.entityId]; if (selectedId === key) closeEditor();
  renderMarkers(); renderIntegrations(); await queueSave(); notify('Usunięto marker i wszystkie jego ustawienia');
}
// Entities of every view: states of neighbouring views are kept fresh for the swipe preview.
function allViewEntityIds() {
  const ids = new Set(Object.values(model.entities || {}).map(marker => marker.entityId).filter(Boolean));
  Object.values(model.views || {}).forEach(view => { Object.values(view.entities || {}).forEach(marker => { if (marker.entityId) ids.add(marker.entityId); }); Object.values(view.flows || {}).forEach(flow => { if (flow.entityId) ids.add(flow.entityId); }); Object.values(view.rooms || {}).forEach(room => (room.entityIds || []).forEach(id => ids.add(id))); if (view.nightBackground || view.sunDim) ids.add(nightEntityOf(view)); });
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
  viewPointers.clear(); panGesture = null; pinchGesture = null;
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
  if (!swipeBusy && !viewSwipe && !hanging) resetStuckSwipe(false);
  viewSwipe = mobileView() && !editMode && viewTransitionMode() !== 'off' && event.pointerType !== 'mouse' && viewPointers.size === 1 && model.viewOrder.length > 1 ? { id:event.pointerId, x:event.clientX, y:event.clientY, t:Date.now(), panX:viewPanX, target:event.target, start:performance.now(), lastMove:performance.now() } : null;
  if (hanging && viewSwipe && swipePreview) { const carry = hanging.lastDx || 0; Object.assign(viewSwipe, { x:event.clientX - carry, tracking:true, direction:hanging.direction, lastDx:carry, maxDx:Math.abs(carry) }); swipeLog(`przejęcie zawieszonego gestu (${Math.round(carry)} px)`); }
  else if (hanging && !viewSwipe) settleBack(hanging.direction || 1, 180);
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
    const [a,b] = [...viewPointers.values()], distance = Math.hypot(a.x-b.x,a.y-b.y), next = clamp(pinchGesture.zoom * distance / Math.max(1,pinchGesture.distance),minViewZoom(),4), ratio = next / pinchGesture.zoom;
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
  viewPointers.delete(event.pointerId);
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
function swipePageDistance() { if (viewTransitionMode() === 'cube') return els.sceneCard?.offsetWidth || innerWidth; return (els.sceneCard?.parentElement?.clientWidth || innerWidth) + 16; }
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
    if (rooms.length) { const roomLayer = document.createElement('div'); roomLayer.className = 'rooms'; roomLayer.innerHTML = rooms.map(room => roomLayerMarkup(room, `pv-${targetId}`, preview.geometry?.sceneWidth || 1, preview.geometry?.sceneHeight || 1).html).join(''); scene.append(roomLayer); const labels = document.createElement('div'); labels.className = 'room-labels'; labels.innerHTML = rooms.map(room => roomLabelMarkup(room)).join(''); scene.append(labels); }
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
  const cube = viewTransitionMode() === 'cube', section = els.sceneCard?.parentElement;
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
  els.editToggle.addEventListener('click', () => { if (isViewer()) return; closeMoreInfo(); editMode = !editMode; els.body.classList.toggle('editing', editMode); els.editToggle.classList.toggle('active', editMode); els.editToggle.setAttribute('aria-pressed', String(editMode)); syncDock(); els.editToggle.title = translateValue('Edytuj widok'); els.editToggle.setAttribute('aria-label', els.editToggle.title); if (editMode) { closeCompactMenus(); els.editMenu?.classList.add('open'); renderMarkers(); } else { editorPreview = { entityId:'', state:'' }; roomPreviewOn = ''; resetViewZoom(); closeEditor(); closeFlowEditor(); cancelRoomDrawing(); closeRoomEditor(); renderRoomEditLayer(); closeCompactMenus(); els.bgTransformPanel?.classList.remove('open'); els.bgTransformToggle?.classList.remove('active'); renderMarkers(); } requestAnimationFrame(() => { applyBackgroundTransform(); updateSceneGeometry(); }); });
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
  $('#flow-add')?.addEventListener('click', addBlankFlow);
  $('#text-add')?.addEventListener('click', () => addTextElement());
  $('#element-add')?.addEventListener('click', openAddDialog);
  $('#add-button')?.addEventListener('click', event => { event.stopPropagation(); openAddDialog(); });
  els.addDialog?.addEventListener('click', onAddDialogClick);
  $('#add-search')?.addEventListener('input', event => { if (!addState) return; addState.query = event.target.value; renderAddDialog('list'); });
  $('#add-search')?.addEventListener('keydown', event => { if (event.key === 'Enter' && addState && addGoLabel().ok) { event.preventDefault(); confirmAddDialog(); } });
  $('#add-pick')?.addEventListener('change', event => { if (!addState) return; addState.pick = event.target.checked; try { localStorage.setItem(ADD_PICK_KEY, addState.pick ? '1' : '0'); } catch {} });
  els.scene?.addEventListener('pointerdown', onAddPickPointer, true);
  $('#room-wizard')?.addEventListener('click', onRoomWizardClick);
  $('#room-wizard-name')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); roomWizardNext(); } });
  $('#room-wizard-search')?.addEventListener('input', event => { if (!roomWizard) return; roomWizard.query = event.target.value; renderRoomWizard('list'); });
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
  // Every new press starts clean: a pan or swipe that ended without a click must not swallow the next tap.
  document.addEventListener('pointerdown', event => { const node = event.target.closest?.('.marker,.flow-marker'); if (node) node.dataset.dragged = '0'; }, true);
  // Icons are tapped by press + release on the label itself. On phones the scene may capture the finger for
  // panning / swiping, and the browser then sends the click to the scene instead of the label.
  let labelTap = null;
  document.addEventListener('pointerdown', event => { const node = event.target.closest?.('.tappable'); labelTap = node && !editMode ? { id: node.dataset.roomId, pid: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now() } : null; }, true);
  window.addEventListener('pointercancel', event => { if (labelTap?.pid === event.pointerId) labelTap = null; }, true);
  window.addEventListener('pointerup', event => {
    const tap = labelTap; if (!tap || tap.pid !== event.pointerId) return; labelTap = null;
    if (editMode || Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 12 || performance.now() - tap.t > 1200) return;
    const room = roomsOf()[tap.id]; if (!room) return;
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
  $('#room-add')?.addEventListener('click', startRoomDrawing);
  $('#room-draw-done')?.addEventListener('click', finishRoomDrawing);
  $('#room-draw-bar')?.addEventListener('click', event => { if (event.target.closest('button')) return; const bar = event.currentTarget; placeRoomDrawBar(!bar.classList.contains('top')); });
  $('#room-draw-undo')?.addEventListener('click', () => { if (!roomDraft) return; roomDraft.points.pop(); roomDraft.cursor = null; updateRoomDrawBar(); renderRoomEditLayer(); });
  $('#room-draw-cancel')?.addEventListener('click', cancelRoomDrawing);
  $('#room-editor-close')?.addEventListener('click', closeRoomEditor);
  $('#room-remove')?.addEventListener('click', removeRoom); $('#room-geometry-lock')?.addEventListener('click', toggleRoomLock); $('#room-copy-style')?.addEventListener('click', copyRoomStyle); $('#room-paste-style')?.addEventListener('click', pasteRoomStyle); $('#room-default-style')?.addEventListener('click', resetRoomStyle); $('#room-duplicate')?.addEventListener('click', duplicateRoom);
  $('#room-editor-content')?.addEventListener('click', onRoomEditorClick);
  $('.room-editor .editor-head')?.addEventListener('pointerdown', event => { const panel = $('#room-editor'); if (panel && !mobileView() && !event.target.closest('button,input,select')) panel.dataset.dragged = '1'; startEditorDrag(event); });
  $('#editor-close').addEventListener('click', closeEditor); document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (els.confirmBox.classList.contains('visible')) closeAppConfirm(false); else if (els.moreInfo.classList.contains('visible')) closeMoreInfo(); else if (roomDraft) cancelRoomDrawing(); else { closeEditor(); closeFlowEditor(); closeRoomEditor(); } });
  els.confirmCancel.addEventListener('click', () => closeAppConfirm(false)); els.confirmOk.addEventListener('click', () => closeAppConfirm(true));
  els.confirmBox.addEventListener('click', event => { if (event.target === els.confirmBox) closeAppConfirm(false); });
  $('#more-info-close')?.addEventListener('click', closeMoreInfo); els.moreInfoBackdrop?.addEventListener('click', closeMoreInfo);
  $('.history-ranges')?.addEventListener('click', event => { const button=event.target.closest('[data-history-hours]'); if(button) loadMoreInfoHistory(Number(button.dataset.historyHours)); });
  $('.editor-head').addEventListener('pointerdown', startEditorDrag);
  els.editorContent.addEventListener('pointerdown', event => { if (event.target.closest('input[type="checkbox"],select')) event.stopPropagation(); });
  els.editorContent.addEventListener('click', event => {
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
    const titles = { marker:'Usunąć marker?', flow:'Usunąć Flow?', room:'Usunąć pomieszczenie?' };
    if (!await appConfirm({ title: titles[kind], message: `„${name || id}” zniknie z tego widoku razem ze swoimi ustawieniami.`, confirmText:'Usuń', danger:true })) return;
    if (kind === 'marker') removeMarker(id);
    else if (kind === 'flow') { if (selectedFlowId === id) closeFlowEditor(); removeFlow(id); }
    else if (kind === 'room' && view?.rooms?.[id]) { if (selectedRoomId === id) closeRoomEditor(); delete view.rooms[id]; if (removeRoomIcon(view, id)) renderMarkers(); renderRooms(); renderAdded(); updateEmptyState(); scheduleSave(true); notify('Usunięto pomieszczenie'); }
  });
  document.querySelectorAll('.selection i').forEach(handle => handle.addEventListener('pointerdown', startResize));
  document.querySelectorAll('.flow-selection i').forEach(handle => handle.addEventListener('pointerdown', startFlowResize));
  els.image.addEventListener('load', () => { updateSceneGeometry(); applyBackgroundTransform(); });
  window.addEventListener('resize', () => { syncDock(); applyBackgroundTransform(); syncMobileOrientation(); });
  $$('[data-dock-side]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); toggleDockSide(); }));
  window.visualViewport?.addEventListener('resize', () => { if (mobileView()) applyBackgroundTransform(); refocusWhileTyping(); });
  document.addEventListener('focusin', event => { if (event.target?.matches?.('input,textarea')) refocusWhileTyping(); });
  // Enter in an editor field closes the on-screen keyboard instead of jumping to the next field.
  document.addEventListener('focusin', event => { const el = event.target; if (el?.matches?.('.editor input:not([type=range]):not([type=checkbox]):not([type=color])')) el.enterKeyHint = 'done'; });
  document.addEventListener('keydown', event => { const el = event.target; if (event.key === 'Enter' && !event.isComposing && el?.matches?.('.editor input:not([type=range]):not([type=checkbox]):not([type=color])')) { event.preventDefault(); el.blur(); } });
  if ('ResizeObserver' in window) new ResizeObserver(updateSceneGeometry).observe(els.scene);
  els.zoomOut?.addEventListener('click', () => setViewZoom(viewZoom-.5)); els.zoomIn?.addEventListener('click', () => setViewZoom(viewZoom+.5)); els.zoomReset?.addEventListener('click', resetViewZoom);
  // A double tap on a room corner removes the corner; the browser also turns those two taps into a dblclick,
  // which must not toggle the zoom (on a phone the view used to jump back to 100 %).
  els.viewport?.addEventListener('dblclick', event => { if (roomDraft || performance.now() - handleTapAt < 800 || event.target.closest?.('.room-handle, #room-edit-layer')) return; if (sceneCameraActive()) setViewZoom(viewZoom > 1 ? 1 : 2, event.clientX, event.clientY); });
  els.viewport?.addEventListener('wheel', event => {
    if (mobileView()) return;
    event.preventDefault();
    setViewZoom(viewZoom * Math.exp(-event.deltaY * .0015), event.clientX, event.clientY);
  }, { passive: false });
  // Touch gestures and desktop mouse dragging are deliberately separate.
  els.editorContent?.addEventListener('focusin', resetViewportPointers);
  els.scene?.addEventListener('mousedown', startDesktopPan);
  els.scene?.addEventListener('pointerdown', viewportPointerDown);
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
    const snapSize = (value, maximum) => { const limited = clamp(value, 1, maximum); if (model.settings?.snapEnabled === false) return limited; const gridPx = Math.max(1, (Number(model.settings?.designWidth) || DESIGN_WIDTH) * (Number(model.settings?.snapStep) || 1) / 100); return Math.round(limited / gridPx) * gridPx; };
    const minWidth = isGaugeType(marker.type) ? 44 : marker.type === 'icon' ? 24 : 36, minHeight = isGaugeType(marker.type) ? 28 : marker.type === 'icon' ? 24 : 24;
    marker.style.width = clamp(snapSize(start.w + (e.clientX-start.x)*sx/scale, 2400),minWidth,2400);
    marker.style.height = clamp(snapSize(start.h + (e.clientY-start.y)*sy/scale, 1800),minHeight,1800);
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
  els.editMenu?.remove();
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
    m.type = ['badge','gauge','icon','horseshoe'].includes(m.type) ? m.type : 'badge'; m.style = normalizedStyle(m.type, m.style);
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
