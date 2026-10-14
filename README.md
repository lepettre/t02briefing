# Das Nötigste

**Morgenzeitung im Schmalformat für den Thermodrucker Phomemo T02.**
Eine Webseite, ein Knopf: Sie holt Wetter, Termine, Nachrichten und einen Spruch aus der Rubrik „Die Gestirne“, setzt alles als Zeitungsseite und druckt sie per Bluetooth direkt aus dem Browser auf einen 58-mm-Bon.

> **Experimentell und nicht kommerziell.** Das Nötigste ist ein privates Bastelprojekt. Es wird nicht verkauft, enthält keine Werbung, sammelt keine Daten und ist nicht für den produktiven Einsatz gedacht. Es gibt keine Gewähr, dass es funktioniert, und keinen Support. Das Projekt steht in keiner Verbindung zu Phomemo, Google, Open-Meteo, Cloudflare oder den genannten Redaktionen.

## Was das Projekt macht

- **Wetter:** Tagesprognose für einen frei wählbaren Ort mit Hoch, Tief, Regenrisiko je Tageszeit, Sonnenauf- und -untergang und einem Ausblick auf drei Tage.
- **Kalender:** Termine von heute und die nächsten Termine aus ausgewählten Google-Kalendern; Geburtstage und Feiertage erscheinen als Zeile im Kopf.
- **Nachrichten:** Schlagzeilen aus frei einstellbaren RSS-Feeds (vorbelegt: Tagesschau und SPIEGEL). Nur Titel und Quelle, keine Artikeltexte.
- **Die Gestirne:** ein kurzes Zitat aus der Kritischen Theorie mit Quellenangabe. Jedes der 32 Zitate kommt einmal, erst dann beginnt die Folge von vorn.
- **Drucken:** Die Seite zeichnet alles in ein 384 Punkte breites Schwarz-Weiß-Bild und schickt es per Web Bluetooth an den Drucker. Ohne Drucker geht die Vorschau, und das Bild lässt sich teilen.
- **Extras:** ein „Ticker“, der laufend nur neue Meldungen druckt, und ein „Dauerlauf-Test“, der prüft, ob sich der Drucker durch Lebenszeichen wachhalten lässt.

Alles läuft im Browser. Es gibt keinen eigenen Server und keine Datenbank; Einstellungen liegen nur im `localStorage` des jeweiligen Browsers.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die ganze Anwendung (HTML, CSS, JavaScript in einer Datei) |
| `worker.js` | optionaler Cloudflare Worker, der RSS-Feeds mit CORS-Header durchreicht |

## Einrichten

1. **Hosten.** `index.html` über GitHub Pages ausliefern (HTTPS ist Pflicht für Bluetooth). In der Datei stehen keine Kalender-IDs, Adressen oder Zugangsdaten; alles Persönliche bleibt im Browser.
2. **Browser.** Chrome oder Edge am Laptop, Chrome auf Android. Safari und iPhone können kein Web Bluetooth (dort nur „Als Bild teilen“ und über die Phomemo-App drucken).
3. **Drucker verbinden.** „Verbinden“ tippen, T02 auswählen. Danach „Testdruck“ (Reiter „Dauerlauf“).
4. **Nachrichten.** Direktaufrufe der Feeds scheitern meist an CORS. Zwei Wege:
   - Standard: Die Seite probiert direkt und dann zwei öffentliche Proxys (unzuverlässig, nur für öffentliche Feeds).
   - Besser: `worker.js` in einen eigenen Cloudflare Worker kopieren, dann in den Einstellungen bei „Eigener Proxy“ eintragen: `https://DEIN-WORKER.workers.dev/?url={url}`
5. **Kalender.** Google Cloud Console: Projekt anlegen, „Google Calendar API“ aktivieren, OAuth-Zustimmungsbildschirm (extern, Status „Testing“, sich selbst als Testnutzer eintragen), Zugangsdaten > OAuth-Client-ID > Webanwendung, bei „Autorisierte JavaScript-Quellen“ die Pages-Adresse eintragen (z. B. `https://lepettre.github.io`). Die Client-ID in die Einstellungen eintragen, dann „Kalender laden“ und die gewünschten Kalender anhaken. Scope: nur Lesen (`calendar.readonly`). Beim ersten Mal warnt Google vor einer ungeprüften App; das ist bei eigenen Testnutzern normal.
6. **Täglich.** Seite öffnen, „Briefing drucken“. Ist der Drucker nicht verbunden, fragt die Seite zuerst nach ihm. Blockiert der Browser beim ersten Druck des Tages das Google-Fenster, einfach noch einmal tippen.

## Was gedruckt wird

384 Punkte breit (48 mm bei 203 dpi), 1 Bit, Länge nach Inhalt. Titel werden nie gekürzt. Alles vor dem ersten Doppelpunkt einer Schlagzeile kommt als kleine Dachzeile darüber. Die Spruchfolge wird erst nach einem erfolgreichen Druck weitergeschaltet.

## Noch nicht an echter Hardware geprüft

Die Druckbefehle folgen dem Protokoll, wie es das Projekt phomymo beschreibt (Bluetooth-Dienst 0xFF00, Schreibmerkmal 0xFF02, ESC/POS-Raster `GS v 0`, Blöcke zu je 256 Zeilen). Getestet ist alles nur gegen einen simulierten Drucker. Erst mit einem Testdruck prüfen, dann das Briefing. Ist Schwarz zu blass oder zu dunkel: „Druckdichte“ in den Einstellungen.

## Reiter

Oben auf der Seite gibt es vier Reiter; ein grüner Punkt zeigt, was gerade läuft.

### Briefing
Die Morgenzeitung wie oben beschrieben, mit Vorschau und allen Einstellungen.

### Ticker
Die Rolle wird zum Fernschreiber. Jede angehakte Quelle wird in ihrem eigenen Abstand abgefragt; gedruckt wird nur, was neu ist. Das Fenster muss offen bleiben, der Bildschirm bleibt dafür per Wake Lock an. Alle Druckaufträge laufen über eine Warteschlange, es druckt nie zweimal gleichzeitig.

| Quelle | Was gedruckt wird | Daten |
|---|---|---|
| Nachrichten | neue Schlagzeilen, Doppelte über Feeds hinweg ausgelassen | RSS-Feeds aus den Einstellungen |
| Wetter-Seismograf | jede Stunde eine schmale Zeile mit Temperatur und Regenrisiko; die Punkte ergeben über den Tag eine Kurve (ohne Vorschub dazwischen) | Open-Meteo |
| Sonnenlauf | Morgendämmerung, Sonnenaufgang mit Tageslänge, Mittag, Sonnenuntergang mit Mondphase, Ende der Dämmerung | eigene Berechnung |
| Warnungen | neue Warnungen und Entwarnungen für den eingestellten Kreis | NINA (enthält DWD-Unwetter, Hochwasser, MoWaS) |
| Pegel und Gezeiten | jedes Hoch- und Niedrigwasser mit Uhrzeit und Stand, etwa 1½ Stunden danach aus den Messwerten bestätigt | pegelonline, Standard: Hamburg St. Pauli |
| Abfahrten | Abfahrtstafel der gewählten Haltestelle mit Verspätungen und Ausfällen | transport.rest (Daten der Deutschen Bahn) |
| Erdbeben | Beben weltweit ab einstellbarer Stärke (Standard 5,0) | USGS |
| Bundestag | neue Drucksachen, filterbar nach Art (Standard: Gesetzentwürfe, Beschlussempfehlungen) | DIP des Bundestags, eigener API-Schlüssel nötig |
| Bundesliga | jedes Tor mit Minute und Schütze, dann der Endstand; auf Wunsch nur ein Verein | OpenLigaDB |

Beim Start wird Vorhandenes nur gedruckt, wenn „Beim Start auch schon Vorhandenes drucken“ angehakt ist. Seismograf, Sonnenlauf und Abfahrten drucken immer.

Einrichten:
- **Haltestelle:** Name eingeben, „Suchen“, die gefundene Haltestelle wird übernommen.
- **Warnungen:** Regionalschlüssel des Kreises; Hamburg ist `020000000000`.
- **Bundestag:** Den API-Schlüssel für das DIP gibt es kostenlos beim Bundestag (Anleitung auf [dip.bundestag.de](https://dip.bundestag.de/über-dip/hilfe/api)); einen allgemeinen Testschlüssel veröffentlicht der Bundestag dort ebenfalls, er wird regelmäßig gewechselt.
- Scheitern Abfragen an CORS, hilft der eigene Worker; `worker.js` lässt die Ticker-Dienste bereits zu.

### Blätter
Einzelne Blätter auf Knopfdruck, erst als Vorschau, dann zum Drucken:

- **Abendausgabe:** die Schlagzeilen des Tages, Wetter, Sonnenzeiten und Termine von morgen.
- **Wochenblatt:** die nächsten sieben Tage mit Wetter und Terminen, vorneweg Geburtstage und Feiertage. Am Wochenende beginnt es mit dem kommenden Montag.
- **Gedicht:** eins von zwölf gemeinfreien Gedichten (Goethe, Eichendorff, Rilke, Hölderlin, Mörike, Heine, Trakl, Morgenstern, Ringelnatz, Storm). Jedes kommt einmal, dann beginnt die Folge von vorn.
- **Heute vor … Jahren:** bis zu sechs Ereignisse des Tages aus der deutschen Wikipedia.
- **Sudoku:** jedes Mal neu erzeugt, eindeutig lösbar, die Lösung klein und kopfüber darunter.
- **Kassenbon des Tages:** die Termine von heute als Posten, Summe der verplanten Zeit, Rückgeld in freier Zeit.
- **Bundesliga:** aktueller Spieltag und Tabelle.
- **Abfahrten:** die Abfahrtstafel sofort.
- **Notiz:** freier Text als Zettel. Die Adresse `https://lepettre.github.io/t02briefing/?notiz=Text` öffnet die Seite gleich mit fertiger Notiz, zum Beispiel aus einem Kurzbefehl auf dem iPhone. Ist der Drucker in diesem Browser schon einmal verbunden gewesen, verbindet die Seite sich wenn möglich ohne Auswahlfenster.

### Dauerlauf
Prüft, ob der Drucker für den Dauerbetrieb taugt, also stundenlang bereitsteht, um den Ticker fortlaufend zu drucken. Er sendet alle N Minuten ein Lebenszeichen (nur Initialisierung, 1 Punkt Vorschub oder eine Leerzeile) und zieht beim Stopp Bilanz. Ob der T02 davon wach bleibt, ist offen; deshalb zuerst mit „Nur Initialisierung“ testen und nach der Zeit nachsehen.

Nach einem Verbindungsabbruch versucht die Seite, sich ohne neuen Dialog wieder zu verbinden; klappt das nicht, hilft ein Tipp auf „Verbinden“.

**Ungeprüft:** Die Ticker-Quellen und Blätter sind nur mit nachgebauten Antworten der Dienste getestet, nicht gegen die echten Schnittstellen und nicht am Drucker.

## Quellen, Dienste und Lizenzen

Das Projekt bindet keine fremden Bibliotheken ein und kopiert keinen fremden Code. Es nutzt aber Daten, Dienste und Vorarbeiten Dritter. Deren Rechte und Bedingungen gelten unverändert. Nichts davon ist anwaltlich geprüft; die Nutzungsbedingungen der RSS-Anbieter und Proxys wurden nicht im Einzelnen gelesen.

### Wetterdaten: Open-Meteo

Wetterdaten von [Open-Meteo.com](https://open-meteo.com/), lizenziert unter [Creative Commons Namensnennung 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.de). Open-Meteo bezieht seine Daten von nationalen Wetterdiensten (u. a. Deutscher Wetterdienst); siehe [Open-Meteo: Lizenz und Quellen](https://open-meteo.com/en/license). Die Daten werden für die Anzeige gerundet und in Text übersetzt (Wettercodes nach WMO), sonst nicht verändert. Die kostenlose API von Open-Meteo ist nur für nicht kommerzielle Nutzung freigegeben ([Nutzungsbedingungen](https://open-meteo.com/en/terms)). Die Namensnennung steht auf der Webseite und auf jedem Ausdruck.

### Nachrichten: RSS-Feeds

Die Schlagzeilen gehören den jeweiligen Redaktionen; alle Rechte liegen bei ihnen. Angezeigt werden nur Titel und Name der Quelle, für den privaten Gebrauch.

- Tagesschau, © ARD / Norddeutscher Rundfunk: Feed [tagesschau.de/index~rss2.xml](https://www.tagesschau.de/index~rss2.xml), es gelten die Nutzungsbedingungen von tagesschau.de
- SPIEGEL, © DER SPIEGEL GmbH & Co. KG: Feed [spiegel.de/schlagzeilen/index.rss](https://www.spiegel.de/schlagzeilen/index.rss), es gelten die Nutzungsbedingungen von spiegel.de
- Weitere Feeds, die man selbst einträgt, gelten nach den Bedingungen ihrer Anbieter. `worker.js` lässt nur einige vorab genannte Nachrichtenseiten durch.

### Die Gestirne: Zitate

Die 32 Zitate stammen aus Werken von Theodor W. Adorno, Max Horkheimer, Walter Benjamin und Herbert Marcuse; die Auswahl ist aus dem Projekt „Halbbildung“ übernommen. Jedes Zitat steht mit Autor und Werk (Titel, Jahr, Stelle) in `index.html` und auf dem Ausdruck. Die Texte von Walter Benjamin († 1940) sind gemeinfrei. Die Werke von Adorno († 1969), Horkheimer († 1973) und Marcuse († 1979) sind urheberrechtlich geschützt; die Rechte liegen bei den Erben und Verlagen (u. a. Suhrkamp Verlag, S. Fischer Verlag). Die Zitate sind kurz, mit Quelle versehen und werden nicht kommerziell genutzt. Ob das im Einzelfall vom Zitatrecht (§ 51 UrhG) gedeckt ist, ist nicht geprüft. Der Satz „Was wir Sinn nennen, wird verschwinden“ ist der Titel eines Gesprächs mit Max Horkheimer im SPIEGEL (1970). Rechteinhaber, die eine Entfernung wünschen, können ein Issue in diesem Repo anlegen.

### Ticker-Dienste und Blätter

- **Warnungen:** [NINA-Schnittstelle](https://warnung.bund.de) des Bundesamts für Bevölkerungsschutz und Katastrophenhilfe (BBK), dokumentiert bei [bund.dev](https://nina.api.bund.dev/). Wetterwarnungen darin stammen vom Deutschen Wetterdienst. Es gelten die Bedingungen des BBK und des DWD.
- **Pegel:** [pegelonline](https://www.pegelonline.wsv.de) der Wasserstraßen- und Schifffahrtsverwaltung des Bundes (WSV). Die Daten sind ungeprüfte Rohwerte; Quelle: WSV, pegelonline.
- **Abfahrten:** [transport.rest](https://transport.rest) von Jannis Redmann, eine inoffizielle, freie Schnittstelle zu den Fahrplandaten der Deutschen Bahn. Ohne Gewähr; der Dienst ist zeitweise nicht erreichbar.
- **Erdbeben:** [U.S. Geological Survey](https://earthquake.usgs.gov/earthquakes/feed/), gemeinfrei (US-Bundesbehörde).
- **Bundestag:** [DIP – Dokumentations- und Informationssystem für Parlamentsmaterialien](https://dip.bundestag.de), nach den Nutzungsbedingungen der DIP-API und nur mit eigenem Schlüssel.
- **Bundesliga:** [OpenLigaDB](https://www.openligadb.de), eine freie, von der Community gepflegte Datenbank. Auf dem Blatt steht „Daten: OpenLigaDB“. Vereinsnamen sind Marken ihrer Inhaber.
- **Heute vor … Jahren:** Texte aus der deutschsprachigen Wikipedia (Seite „Was geschah am …“ über die Wikimedia-Schnittstelle), lizenziert unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.de). Die Namensnennung steht auf jedem Blatt.
- **Gedichte:** alle gemeinfrei, die Verfasser sind mehr als 70 Jahre tot (zuletzt Ringelnatz, † 1934). Die Texte sind in alter Rechtschreibung nach verbreiteten Ausgaben gesetzt.
- **Sonne und Mond:** eigene Berechnung nach der bekannten Sonnenstandsformel (Näherung auf etwa eine Minute) und dem mittleren synodischen Monat.
- **Sudoku und Kassenbon:** eigene Arbeit.

### Google Kalender

Die Kalenderanbindung nutzt die [Google Calendar API](https://developers.google.com/calendar) und lädt dafür die Bibliothek [Google Identity Services](https://developers.google.com/identity/oauth2/web) direkt von `accounts.google.com`. Es gelten die [Nutzungsbedingungen für Google-APIs](https://developers.google.com/terms) und die [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy). Die Seite fragt nur Lesezugriff an (`calendar.readonly`). Termine werden im Browser verarbeitet, nicht gespeichert und an niemanden weitergegeben. Jede Nutzerin und jeder Nutzer braucht eine eigene OAuth-Client-ID.

### CORS-Proxys

- Ohne eigenen Proxy laufen Feed-Abrufe über die öffentlichen Dienste [AllOrigins](https://allorigins.win/) ([Quellcode, MIT-Lizenz](https://github.com/gnuns/allorigins)) und [corsproxy.io](https://corsproxy.io/). Diese Dienste sehen, welche Feed-Adresse abgerufen wird. Es gelten deren Bedingungen.
- `worker.js` ist für [Cloudflare Workers](https://workers.cloudflare.com/) geschrieben und läuft im eigenen Cloudflare-Konto nach den Bedingungen von Cloudflare.

### Phomemo

„Phomemo“ und „T02“ sind Marken ihrer Inhaber. Dieses Projekt ist kein Produkt von Phomemo und wird von Phomemo weder unterstützt noch geprüft.

**Dank an [phomymo](https://github.com/transcriptionstream/phomymo)** (transcriptionstream). Von dort stammen die Angaben zum T02: Bluetooth-Dienst und Schreibmerkmal, die Befehlsfolge zum Drucken, Paketgröße und Pausen sowie die Heiztabelle für die Druckdichte. Code wurde nicht kopiert; der Druckteil ist neu geschrieben, folgt bei Heiztabelle und Zeiten aber phomymo. Die README von phomymo nennt die MIT-Lizenz (eine LICENSE-Datei lag beim Nachsehen im Oktober 2026 nicht im Repo).

Nur gelesen, nichts übernommen: die Beschreibungen in [phomemo-tools](https://github.com/vivier/phomemo-tools), photoboot (MIT, © Marijn Van de Voorde), myphomemo, phogoprint, catlabel und zwei Forks von phomymo. Die Gerätedaten des T02 (203 dpi, 48 mm Druckbreite, 53 mm Papier) stammen von Händlerseiten.

### Wettercodes

Die Zuordnung der Wetterlagen folgt den öffentlichen WMO-Wettercodes (WMO Code Table 4677), die Open-Meteo liefert. Die deutschen Texte und alle Zeichnungen (Sonne, Wolken, Rahmen) sind eigene Arbeit.

### Browser-Schnittstellen und Schriften

Web Bluetooth, Screen Wake Lock, Geolocation und Web Share sind Standard-Schnittstellen des Browsers. Die Seite liefert keine Schriften aus, sondern nutzt die im System vorhandenen (Georgia, Times New Roman, System-UI).

## Datenschutz

Die Seite selbst speichert nichts außerhalb des Browsers. Beim Benutzen werden aber Anfragen an Dritte geschickt: an Open-Meteo (Koordinaten des eingestellten Orts), an die Feed-Anbieter oder Proxys (Feed-Adressen) und, wenn eingerichtet, an Google (Anmeldung, Kalenderabruf). Die Standortabfrage des Browsers wird nur auf Knopfdruck genutzt; die Koordinaten bleiben im Browser.
