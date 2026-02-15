# ECHOES OF TIME - WEB REGISTRERINGSSYSTEM

## Hva er dette?
Dette er web-basert versjon av registreringssystemet for Nintendo Switch 2-konkurransen.
Nettsiden ser identisk ut som desktop-versjonen og har samme funksjonalitet!

## Før du starter - Installer Flask:

1. Åpne kommandoprompt/terminal i denne mappen
2. Kjør: `pip install -r requirements.txt`

## Slik starter du web-serveren:

### Alternativ 1: Bruk bat-filen (enklest)
- Dobbeltklikk på **Start_Web.bat**

### Alternativ 2: Manuelt via terminal
1. Åpne terminal i denne mappen
2. Kjør: `python app.py`
3. Åpne nettleser og gå til: http://localhost:5000

## Hvordan det fungerer:

1. **Registreringsskjerm:**
   - Fyll inn deltakers informasjon (navn, telefon, e-post)
   - Klikk "Start ECHOES OF TIME"

2. **Spillstart:**
   - Echoes of Time starter automatisk
   - Nettsiden bytter til venteskjerm

3. **Venteskjerm:**
   - Viser deltakers info
   - Mulig å redigere info med "Rediger"-knappene
   - Klikk "REGISTRER DEG" når spilleren er ferdig

4. **Registrering:**
   - Leser score fra Echoes of Time sin score-fil
   - Lagrer deltaker med score i deltakere.txt
   - Tilbakestiller til start for neste deltaker

## Teknisk informasjon:

### Backend (Flask):
- **app.py** - Flask server med API endpoints
- Port: 5000
- Host: 0.0.0.0 (tilgjengelig på nettverket)

### Frontend:
- **templates/index.html** - Hovedside
- **static/css/style.css** - HiØF design
- **static/js/script.js** - Interaktivitet

### API Endpoints:
- `POST /api/sjekk_registrert` - Sjekk duplikater
- `POST /api/start_spill` - Start spillet
- `GET /api/hent_score` - Hent score fra Echoes of Time
- `POST /api/registrer` - Registrer deltaker

### Filstier:
- Score: `C:\Users\ape00\AppData\LocalLow\DefaultCompany\EchoesOfTime\scoreEntries.txt`
- Deltakere: `../deltakere.txt` (i registrering-mappen)
- Spill: `../../echoesOfTime_kjellmagne_build/EchoesOfTime.exe`

## Design:
- Identisk med Tkinter desktop-versjonen
- HiØF fargepalett
- Responsive design (fungerer på desktop og mobil)
- Samme funksjonalitet som desktop-versjonen

## Stoppe serveren:
- Trykk `Ctrl + C` i terminal/kommandoprompt

---
Laget for Høgskolen i Østfold
