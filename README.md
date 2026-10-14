# Das Nötigste

**Eine kleine Zeitung für den Bluetooth-Thermodrucker** (Phomemo T02 und ähnliche, 58-mm-Papier).
Eine Webseite, die Wetter, Termine, Schlagzeilen und anderes als Zeitungsblatt setzt und per Bluetooth direkt aus dem Browser druckt: als einzelnes Blatt auf Knopfdruck oder als Ticker, der laufend Neues auf die Rolle schreibt.

> **Experimentell und nicht kommerziell.** Das Nötigste ist ein privates Bastelprojekt. Es wird nicht verkauft, enthält keine Werbung, sammelt keine Daten und ist nicht für den produktiven Einsatz gedacht. Es gibt keine Gewähr, dass es funktioniert, und keinen Support. Das Projekt steht in keiner Verbindung zu Phomemo, Google, Open-Meteo, Cloudflare oder den genannten Redaktionen und Diensten.

**Seite:** https://lepettre.github.io/t02briefing/

## Aufbau der Seite

Die Seite hat drei Reiter.

### 1. Blatt drucken
Von links nach rechts beziehungsweise von oben nach unten:

1. **Vorlage wählen.** Fertige Vorschläge:

   | Vorlage | Inhalt |
   |---|---|
   | Morgenzeitung | Zeitungskopf, Unwetterwarnungen, Wetter heute, Termine heute, Schlagzeilen, Zitat |
   | Abendausgabe | Schlagzeilen des Tages, Wetter und Termine morgen, Sonne und Mond, Gedicht |
   | Wochenblatt | die nächsten sieben Tage mit Wetter und Terminen |
   | Unterwegs | Warnungen, Abfahrten an der eigenen Haltestelle, Wetter |
   | Fußball | Spieltag und Tabelle |
   | Rätselblatt | Heute vor … Jahren, Sudoku |
   | Tagesbon | die Termine des Tages als Kassenzettel, Rückgeld in freier Zeit |
   | Notiz | freier Text als Zettel |
   | Eigene | leer, selbst zusammenstellen |

2. **Inhalt anpassen.** Jede Vorlage ist eine Liste von Rubriken. Rubriken lassen sich verschieben, entfernen und aus allen verfügbaren ergänzen; manche haben Optionen (Titel, Anzahl der Meldungen, Ausblick, Tabelle). Änderungen bleiben je Vorlage gespeichert, „Vorlage zurücksetzen“ stellt den Vorschlag wieder her. Braucht eine Rubrik noch eine Einstellung (Kalender, Haltestelle, Pegel), steht das dabei, mit Sprung an die richtige Stelle.
3. **Vorschau und Druck.** Die Vorschau aktualisiert sich bei jeder Änderung. Erst hier wird gedruckt oder als Bild gesichert.

Verfügbare Rubriken: Zeitungskopf, Unwetterwarnungen, Wetter heute, Wetter morgen, Sieben Tage, Termine heute, Termine morgen, Schlagzeilen, Abfahrten, Wasserstand, Sonne und Mond, Fußball, Erdbeben, Bundestag, Heute vor … Jahren, Zitat, Gedicht, Sudoku, Tagesbon, Notiz.

Die Adresse `https://lepettre.github.io/t02briefing/?notiz=Text` öffnet direkt die Vorlage Notiz mit diesem Text, zum Beispiel aus einem Kurzbefehl auf dem Handy.

### 2. Ticker
Die Rolle wird zum Fernschreiber. Jede angehakte Quelle wird in ihrem Abstand abgefragt, gedruckt wird nur Neues. Das Fenster muss offen bleiben; der Bildschirm bleibt per Wake Lock an. Ein Probestreifen zeigt vorher, wie es aussieht.

| Quelle | Was gedruckt wird |
|---|---|
| Schlagzeilen | neue Meldungen aus den gewählten Nachrichtenquellen, Doppelte ausgelassen |
| Unwetterwarnungen | neue Warnungen des Deutschen Wetterdienstes für den Ort (nur Deutschland) |
| Fußball live | jedes Tor mit Minute und Schütze, dann der Endstand; auf Wunsch nur ein Verein |
| Erdbeben | neue Beben weltweit ab der eingestellten Stärke |
| Hoch- und Niedrigwasser | Gezeiten am gewählten Pegel, nur an Tidepegeln, etwa 1½ Stunden danach |
| Sonnenlauf | Dämmerung, Sonnenauf- und -untergang, Mittag, Mondphase, jeweils zur Zeit |
| Temperaturkurve | jede Stunde eine schmale Zeile; über den Tag entsteht eine Kurve |
| Bundestag | neue Drucksachen (API-Schlüssel nötig) |

Optional sendet der Ticker ein Lebenszeichen, wenn fünf Minuten nichts gedruckt wurde, damit sich der Drucker nicht abschaltet. Ob das beim eigenen Gerät reicht, zeigt das Protokoll.

### 3. Einstellungen
Alles, was Blätter und Ticker gemeinsam brauchen, an einem Ort; jede Gruppe zeigt zugeklappt ihren aktuellen Wert.

- **Ort:** Suche nach jedem Ort weltweit (Open-Meteo-Geocoding) oder der eigene Standort. Bestimmt Wetter, Sonne und Mond, Warnungen und die Suche „In der Nähe“.
- **Nachrichtenquellen:** Auswahl aus deutschen, regionalen, österreichischen, Schweizer und internationalen Redaktionen sowie beliebige eigene RSS-Feeds. Neben jeder Quelle steht nach dem ersten Abruf, ob sie erreichbar war.
- **Kalender:** Google Kalender, nur lesend, mit eigener Client-ID (siehe unten).
- **Haltestelle:** Suche nach Name oder in der Nähe des Orts; deutschlandweit, Fahrplandaten der Deutschen Bahn.
- **Pegel:** Suche nach Name oder Gewässer oder in der Nähe; rund 600 Messstellen an Bundeswasserstraßen.
- **Fußball:** 1., 2. oder 3. Liga, auf Wunsch ein Verein.
- **Erdbeben, Bundestag, Drucker** (Schwärze, Papier am Ende, Testdruck), **Erweitert** (eigener Vermittler, alles löschen) und das **Protokoll** für die Fehlersuche.

Was nur in Deutschland funktioniert (Unwetterwarnungen, Pegel), sagt die Seite; bei einem Ort außerhalb Deutschlands werden die Warnungen ausgeblendet.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die ganze Anwendung (HTML, CSS, JavaScript in einer Datei) |
| `worker.js` | optionaler Cloudflare Worker, der Feeds und Daten mit CORS-Header durchreicht |

Alles läuft im Browser. Es gibt keinen eigenen Server und keine Datenbank; Einstellungen liegen nur im `localStorage` des jeweiligen Browsers.

## Einrichten

1. **Browser.** Chrome oder Edge am Computer, Chrome unter Android. Safari und iPhone können kein Web Bluetooth; dort „Als Bild sichern“ und mit der App des Herstellers drucken.
2. **Drucker.** Oben „Verbinden“, Drucker auswählen, dann in den Einstellungen „Testdruck“.
3. **Ort und Quellen** in den Einstellungen wählen.
4. **Feeds und CORS.** Viele Feeds lassen sich vom Browser aus nicht direkt abrufen. Die Seite probiert dann zwei öffentliche Vermittler (unzuverlässig). Besser: `worker.js` in einen eigenen Cloudflare Worker kopieren (Workers > Create > Code einfügen > Deploy) und unter Einstellungen > Erweitert eintragen: `https://DEIN-WORKER.workers.dev/?url={url}`
5. **Kalender.** Google Cloud Console: Projekt anlegen, „Google Calendar API“ aktivieren, unter „Google Auth Platform“ Zielgruppe „Extern“, Status „Testing“, sich selbst als Testnutzer eintragen. Dann eine OAuth-Client-ID vom Typ „Webanwendung“ anlegen und bei „Autorisierte JavaScript-Quellen“ die Adresse der Seite eintragen, ohne Pfad (z. B. `https://lepettre.github.io`). Die Client-ID unter Einstellungen > Kalender eintragen, anmelden, Kalender anhaken. Beim ersten Mal warnt Google vor einer ungeprüften App; bei eigenen Testnutzern ist das normal. Häufige Fehler: `access_denied` (nicht als Testnutzer eingetragen), „Google 403“ (Calendar API nicht aktiviert oder Kalenderzugriff im Anmeldefenster nicht angehakt).
6. **Bundestag.** Den API-Schlüssel für das DIP vergibt der Bundestag kostenlos, siehe [dip.bundestag.de](https://dip.bundestag.de/%C3%BCber-dip/hilfe/api).

## Was gedruckt wird

384 Punkte breit (48 mm bei 203 dpi), 1 Bit, Länge nach Inhalt. Titel werden nie gekürzt; alles vor dem ersten Doppelpunkt einer Schlagzeile kommt als Dachzeile darüber. Zitate und Gedichte laufen jeweils einmal durch, bevor sie sich wiederholen; weitergeschaltet wird erst nach einem erfolgreichen Druck.

## Noch nicht an echter Hardware geprüft

Die Druckbefehle folgen dem Protokoll, wie es das Projekt phomymo beschreibt (Bluetooth-Dienst 0xFF00, Schreibmerkmal 0xFF02, ESC/POS-Raster `GS v 0`, Blöcke zu je 256 Zeilen). Getestet ist alles gegen einen simulierten Drucker und mit nachgebauten Antworten der Dienste, nicht gegen alle echten Schnittstellen. Erst mit einem Testdruck prüfen. Ist Schwarz zu blass oder zu dunkel: „Schwärze“ in den Einstellungen.

## Quellen, Dienste und Lizenzen

Das Projekt bindet keine fremden Bibliotheken ein und kopiert keinen fremden Code. Es nutzt aber Daten, Dienste und Vorarbeiten Dritter. Deren Rechte und Bedingungen gelten unverändert. Nichts davon ist anwaltlich geprüft; die Nutzungsbedingungen der RSS-Anbieter und Proxys wurden nicht im Einzelnen gelesen.

### Wetterdaten: Open-Meteo

Wetterdaten von [Open-Meteo.com](https://open-meteo.com/), lizenziert unter [Creative Commons Namensnennung 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.de). Open-Meteo bezieht seine Daten von nationalen Wetterdiensten (u. a. Deutscher Wetterdienst); siehe [Open-Meteo: Lizenz und Quellen](https://open-meteo.com/en/license). Die Daten werden für die Anzeige gerundet und in Text übersetzt (Wettercodes nach WMO), sonst nicht verändert. Die kostenlose API von Open-Meteo ist nur für nicht kommerzielle Nutzung freigegeben ([Nutzungsbedingungen](https://open-meteo.com/en/terms)). Die Namensnennung steht auf der Webseite und auf jedem Ausdruck.

### Nachrichten: RSS-Feeds

Die Schlagzeilen gehören den jeweiligen Redaktionen; alle Rechte liegen bei ihnen. Angezeigt werden nur Titel und Name der Quelle, für den privaten Gebrauch.

Zur Auswahl stehen die öffentlichen RSS-Feeds von tagesschau.de (ARD/NDR), Deutschlandfunk, DER SPIEGEL, ZEIT ONLINE, Süddeutscher Zeitung, FAZ.NET, taz, Deutscher Welle, NDR Hamburg, rbb24, ORF Vorarlberg, ORF.at, DER STANDARD, SRF News, BBC News, The Guardian und heise online; die Adressen stehen in `index.html`. Für jede Quelle gelten die Nutzungsbedingungen ihres Anbieters. Eigene Feeds gelten nach den Bedingungen ihrer Anbieter. `worker.js` lässt nur die Quellen der Auswahl und die Datendienste der Seite durch.

### Die Gestirne: Zitate

Die 32 Zitate stammen aus Werken von Theodor W. Adorno, Max Horkheimer, Walter Benjamin und Herbert Marcuse; die Auswahl ist aus dem Projekt „Halbbildung“ übernommen. Jedes Zitat steht mit Autor und Werk (Titel, Jahr, Stelle) in `index.html` und auf dem Ausdruck. Die Texte von Walter Benjamin († 1940) sind gemeinfrei. Die Werke von Adorno († 1969), Horkheimer († 1973) und Marcuse († 1979) sind urheberrechtlich geschützt; die Rechte liegen bei den Erben und Verlagen (u. a. Suhrkamp Verlag, S. Fischer Verlag). Die Zitate sind kurz, mit Quelle versehen und werden nicht kommerziell genutzt. Ob das im Einzelfall vom Zitatrecht (§ 51 UrhG) gedeckt ist, ist nicht geprüft. Der Satz „Was wir Sinn nennen, wird verschwinden“ ist der Titel eines Gesprächs mit Max Horkheimer im SPIEGEL (1970). Rechteinhaber, die eine Entfernung wünschen, können ein Issue in diesem Repo anlegen.

### Weitere Dienste für Rubriken und Ticker

- **Unwetterwarnungen:** Warnungen des [Deutschen Wetterdienstes](https://www.dwd.de), abgerufen über die freie Schnittstelle [Bright Sky](https://brightsky.dev). Es gelten die Nutzungsbedingungen des DWD (Quellenangabe „Deutscher Wetterdienst“, steht auf dem Ausdruck).
- **Orte:** Ortssuche über die [Geocoding-Schnittstelle von Open-Meteo](https://open-meteo.com/en/docs/geocoding-api) (Daten von GeoNames, CC BY 4.0).
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

Die Seite selbst speichert nichts außerhalb des Browsers. Beim Benutzen werden aber Anfragen an Dritte geschickt: an Open-Meteo (Ortssuche und Koordinaten des eingestellten Orts), an die Feed-Anbieter oder Proxys (Feed-Adressen), je nach gewählten Rubriken an Bright Sky, pegelonline, transport.rest, OpenLigaDB, USGS, Wikimedia und das DIP und, wenn eingerichtet, an Google (Anmeldung, Kalenderabruf). Die Standortabfrage des Browsers wird nur auf Knopfdruck genutzt; die Koordinaten bleiben im Browser.
