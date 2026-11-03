# Zeitverteilung – Workshop Unternehmensentwicklung (encoviva)

Anonyme Web-Umfrage ohne Anmeldung. Teilnehmende öffnen den Link, wählen Position, Geschäftsfeld und Gruppe
(Pflicht) und verteilen 100 % ihrer Arbeitszeit. Unter „Was muss passieren?“ wird der heutige Anteil des
gewählten Bereichs automatisch übernommen; man trägt das persönliche Ziel in % ein.

- `/` – Eingabe
- `/#gruppe` – Gruppenauswertung (ab 3 Antworten, für alle sichtbar)
- `/#gesamt` – Gesamtauswertung, CSV-Export, Löschen (nur mit Admin-Schlüssel)

## Einrichten (ca. 15 Minuten)

1. **GitHub**: neues privates Repository anlegen (z. B. `zeitverteilung`), dann „uploading an existing file“ und
   alle Dateien und Ordner aus diesem Paket hineinziehen (`api`, `lib`, `public`, `dev`, `package.json`, `vercel.json`, `README.md`). Commit.
2. **Vercel** → *Add New… → Project* → das Repository importieren. Einstellungen unverändert lassen → *Deploy*.
   (Der erste Aufruf zeigt noch einen Fehler, weil die Datenbank fehlt – das ist normal.)
3. **Datenbank**: im Projekt → *Storage* → *Create Database* → **Upstash for Redis** (Marketplace) →
   Region **Frankfurt (eu-central-1)**, Free-Plan → mit dem Projekt verbinden. Die Zugangsdaten
   (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) trägt Vercel automatisch ein.
4. **Admin-Schlüssel**: *Settings → Environment Variables* → `ADMIN_KEY` = ein langes Passwort (mind. 8 Zeichen).
5. *Deployments* → beim letzten Deployment *Redeploy*. Fertig.

Optional: eigene Domain unter *Settings → Domains*, z. B. `umfrage.encoviva.de`. Ein QR-Code auf der Folie hilft.

## Vor dem Workshop

- Link einmal testen, eine Probeantwort abschicken, unter `/#gesamt` mit dem Schlüssel prüfen, danach **„Alle Antworten löschen“**.
- Gruppenbezeichnungen und Gesellschaften stehen oben im Skript in `public/index.html` (`GROUP_LABEL`, `COMPANIES`)
  und in `lib/schema.js` – bei Änderungen beide anpassen.

## Datenschutz

Gespeichert werden nur die Antworten (Position, Geschäftsfeld, Gruppe, optional Gesellschaft, Prozentwerte, Texte, Zeitpunkt).
Keine Namen, E-Mails oder IP-Adressen. Die Gruppenansicht zeigt weder Position noch Gesellschaft und erst ab 3 Antworten.
Hinweis: Der kostenlose Vercel-Hobby-Plan ist laut Vercel nur für nicht-kommerzielle Nutzung gedacht.

## Lokal testen

`npm install` und `npm run dev` → http://localhost:3000 (Speicher im Arbeitsspeicher, Admin-Schlüssel `test`).
