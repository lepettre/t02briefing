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
3. **Drucker verbinden.** „Drucker verbinden“ tippen, T02 auswählen. Danach „Testdruck“ (unter „Dauerlauf-Test“).
4. **Nachrichten.** Direktaufrufe der Feeds scheitern meist an CORS. Zwei Wege:
   - Standard: Die Seite probiert direkt und dann zwei öffentliche Proxys (unzuverlässig, nur für öffentliche Feeds).
   - Besser: `worker.js` in einen eigenen Cloudflare Worker kopieren, dann in den Einstellungen bei „Eigener Proxy“ eintragen: `https://DEIN-WORKER.workers.dev/?url={url}`
5. **Kalender.** Google Cloud Console: Projekt anlegen, „Google Calendar API“ aktivieren, OAuth-Zustimmungsbildschirm (extern, Status „Testing“, sich selbst als Testnutzer eintragen), Zugangsdaten > OAuth-Client-ID > Webanwendung, bei „Autorisierte JavaScript-Quellen“ die Pages-Adresse eintragen (z. B. `https://lepettre.github.io`). Die Client-ID in die Einstellungen eintragen, dann „Kalender laden“ und die gewünschten Kalender anhaken. Scope: nur Lesen (`calendar.readonly`). Beim ersten Mal warnt Google vor einer ungeprüften App; das ist bei eigenen Testnutzern normal.
6. **Täglich.** Seite öffnen, „Briefing drucken“. Ist der Drucker nicht verbunden, fragt die Seite zuerst nach ihm. Blockiert der Browser beim ersten Druck des Tages das Google-Fenster, einfach noch einmal tippen.

## Was gedruckt wird

384 Punkte breit (48 mm bei 203 dpi), 1 Bit, Länge nach Inhalt. Titel werden nie gekürzt. Alles vor dem ersten Doppelpunkt einer Schlagzeile kommt als kleine Dachzeile darüber. Die Spruchfolge wird erst nach einem erfolgreichen Druck weitergeschaltet.

## Noch nicht an echter Hardware geprüft

Die Druckbefehle folgen dem öffentlich beschriebenen Protokoll der Phomemo-Drucker (Bluetooth-Dienst 0xFF00, Schreibmerkmal 0xFF02, ESC/POS-Raster `GS v 0`, Blöcke zu je 256 Zeilen). Getestet ist alles nur gegen einen simulierten Drucker. Erst mit einem Testdruck prüfen, dann das Briefing. Ist Schwarz zu blass oder zu dunkel: „Druckdichte“ in den Einstellungen.

## Dauerlauf und Ticker

- **Dauerlauf-Test:** sendet alle N Minuten ein Lebenszeichen (nur Initialisierung, 1 Punkt Vorschub oder eine Leerzeile). Ob der T02 davon wach bleibt, ist offen; deshalb zuerst mit „Nur Initialisierung“ testen und nach der Zeit nachsehen.
- **Ticker:** druckt in festem Abstand nur neue Meldungen. Das Fenster muss offen bleiben; der Bildschirm bleibt dafür per Wake Lock an.
- Nach einem Verbindungsabbruch versucht die Seite, sich ohne neuen Dialog wieder zu verbinden; klappt das nicht, hilft ein Tipp auf „Drucker verbinden“.

## Quellen, Dienste und Lizenzen

Das Projekt bindet keine fremden Bibliotheken ein und kopiert keinen fremden Code. Es nutzt aber Daten und Dienste Dritter. Deren Rechte und Bedingungen gelten unverändert.

### Wetterdaten: Open-Meteo

Wetterdaten von [Open-Meteo.com](https://open-meteo.com/), lizenziert unter [Creative Commons Namensnennung 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.de). Open-Meteo bezieht seine Daten von nationalen Wetterdiensten (u. a. Deutscher Wetterdienst); siehe [Open-Meteo: Lizenz und Quellen](https://open-meteo.com/en/license). Die Daten werden für die Anzeige gerundet und in Text übersetzt (Wettercodes nach WMO), sonst nicht verändert. Die kostenlose API von Open-Meteo ist nur für nicht kommerzielle Nutzung freigegeben ([Nutzungsbedingungen](https://open-meteo.com/en/terms)). Die Namensnennung steht auf der Webseite und auf jedem Ausdruck.

### Nachrichten: RSS-Feeds

Die Schlagzeilen gehören den jeweiligen Redaktionen; alle Rechte liegen bei ihnen. Angezeigt werden nur Titel und Name der Quelle, für den privaten Gebrauch.

- Tagesschau, © ARD / Norddeutscher Rundfunk: Feed [tagesschau.de/index~rss2.xml](https://www.tagesschau.de/index~rss2.xml), es gelten die Nutzungsbedingungen von tagesschau.de
- SPIEGEL, © DER SPIEGEL GmbH & Co. KG: Feed [spiegel.de/schlagzeilen/index.rss](https://www.spiegel.de/schlagzeilen/index.rss), es gelten die Nutzungsbedingungen von spiegel.de
- Weitere Feeds, die man selbst einträgt, gelten nach den Bedingungen ihrer Anbieter. `worker.js` lässt nur einige vorab genannte Nachrichtenseiten durch.

### Die Gestirne: Zitate

Die 32 Zitate stammen aus Werken von Theodor W. Adorno, Max Horkheimer, Walter Benjamin und Herbert Marcuse; die Auswahl ist aus dem Projekt „Halbbildung“ übernommen. Jedes Zitat steht mit Autor und Werk (Titel, Jahr, Stelle) in `index.html` und auf dem Ausdruck. Die Texte von Walter Benjamin († 1940) sind gemeinfrei. Die Werke von Adorno († 1969), Horkheimer († 1973) und Marcuse († 1979) sind urheberrechtlich geschützt; die Rechte liegen bei den Erben und Verlagen (u. a. Suhrkamp Verlag, S. Fischer Verlag). Die Zitate sind kurz, mit Quelle versehen und werden nicht kommerziell genutzt. Der Satz „Was wir Sinn nennen, wird verschwinden“ ist der Titel eines Gesprächs mit Max Horkheimer im SPIEGEL (1970). Rechteinhaber, die eine Entfernung wünschen, können ein Issue in diesem Repo anlegen.

### Google Kalender

Die Kalenderanbindung nutzt die [Google Calendar API](https://developers.google.com/calendar) und lädt dafür die Bibliothek [Google Identity Services](https://developers.google.com/identity/oauth2/web) direkt von `accounts.google.com`. Es gelten die [Nutzungsbedingungen für Google-APIs](https://developers.google.com/terms) und die [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy). Die Seite fragt nur Lesezugriff an (`calendar.readonly`). Termine werden im Browser verarbeitet, nicht gespeichert und an niemanden weitergegeben. Jede Nutzerin und jeder Nutzer braucht eine eigene OAuth-Client-ID.

### CORS-Proxys

- Ohne eigenen Proxy laufen Feed-Abrufe über die öffentlichen Dienste [AllOrigins](https://allorigins.win/) ([Quellcode, MIT-Lizenz](https://github.com/gnuns/allorigins)) und [corsproxy.io](https://corsproxy.io/). Diese Dienste sehen, welche Feed-Adresse abgerufen wird. Es gelten deren Bedingungen.
- `worker.js` ist für [Cloudflare Workers](https://workers.cloudflare.com/) geschrieben und läuft im eigenen Cloudflare-Konto nach den Bedingungen von Cloudflare.

### Phomemo

„Phomemo“ und „T02“ sind Marken ihrer Inhaber. Dieses Projekt ist kein Produkt von Phomemo und wird von Phomemo weder unterstützt noch geprüft. Die Druckbefehle wurden anhand öffentlich dokumentierter ESC/POS-Befehle und frei verfügbarer Beschreibungen des Phomemo-Bluetooth-Protokolls selbst geschrieben.

### Browser-Schnittstellen und Schriften

Web Bluetooth, Screen Wake Lock, Geolocation und Web Share sind Standard-Schnittstellen des Browsers. Die Seite liefert keine Schriften aus, sondern nutzt die im System vorhandenen (Georgia, Times New Roman, System-UI).

## Datenschutz

Die Seite selbst speichert nichts außerhalb des Browsers. Beim Benutzen werden aber Anfragen an Dritte geschickt: an Open-Meteo (Koordinaten des eingestellten Orts), an die Feed-Anbieter oder Proxys (Feed-Adressen) und, wenn eingerichtet, an Google (Anmeldung, Kalenderabruf). Die Standortabfrage des Browsers wird nur auf Knopfdruck genutzt; die Koordinaten bleiben im Browser.
