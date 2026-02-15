# ECHOES OF TIME - REGISTRERINGSSYSTEM

## Hva er dette?
Dette er registreringssystemet for Nintendo Switch 2-konkurransen med Echoes of Time-spillet.

## 📁 FILER I DENNE MAPPEN:

### Hovedfiler:
- **registrering.py** - Hovedprogrammet for registrering (Desktop-versjon)
- **deltakere.txt** - JSON-fil som lagrer alle deltakere med samtykke-informasjon
- **Start_Registrering.bat** - Dobbeltklikk denne for å starte programmet

### GDPR og Personvern:
- **GDPR_RUTINER.md** - Komplett dokumentasjon for GDPR-compliance
- **DATABRUDD_RUTINE.md** - Prosedyrer ved databrudd (72-timers varslingsplikt)
- **ROS_ANALYSE.md** - Risiko- og sårbarhetsanalyse (alle risikoer vurdert som lave)
- **slett_gamle_deltakere.py** - Automatisk sletting av data eldre enn 30 dager
- **sletting_log.txt** - Logg over alle slettinger (opprettes automatisk)

### Design og bilder:
- **hiof_logo.png** - HiØF logo som vises i UI
- Diverse Pokemon og spill-bilder for animasjoner

### Web-versjon:
- **web/** - Mappe med Flask web-applikasjon (samme funksjonalitet som desktop)

## 🎮 SLIK BRUKER DU DET:

### Desktop-versjon:
1. Dobbeltklikk på "Start_Registrering.bat"
2. Fyll inn deltakers informasjon (navn, telefon, e-post)
3. Les og godkjenn GDPR-samtykke
4. Klikk "Start ECHOES OF TIME"
5. Spilleren spiller Echoes of Time
6. Når ferdig, klikk "REGISTRER DEG"
7. Deltakeren er nå registrert!

### Web-versjon:
1. Gå til mappen `web/`
2. Kjør `python app.py`
3. Åpne http://localhost:5000 i nettleser
4. Følg samme prosess som desktop

## 📊 HVOR LAGRES DATAENE?

### Score:
Scoren leses fra Echoes of Time sin egen score-fil:
`C:\Users\ape00\AppData\LocalLow\DefaultCompany\EchoesOfTime\scoreEntries.txt`

### Deltakere:
Alle deltakere lagres i "deltakere.txt" i denne mappen som JSON-format.

**Ny informasjon lagres for GDPR-compliance:**
- Samtykke-tidspunkt
- Samtykke-metode (desktop eller web)
- GDPR-versjon

## 🔒 GDPR COMPLIANCE:

### Automatisk sletting:
Kjør dette scriptet regelmessig (anbefalt ukentlig):
```bash
python slett_gamle_deltakere.py
```

Dette sletter automatisk deltakere eldre enn 30 dager og logger alle slettinger.

### Sette opp Windows Task Scheduler:
Se GDPR_RUTINER.md for steg-for-steg guide.

### Håndtere henvendelser:
Alle henvendelser om personvern sendes til: **danielnj@hiof.no**

Se GDPR_RUTINER.md for detaljerte prosedyrer for:
- Innsyn i data
- Retting av feil
- Sletting av data
- Trekke tilbake samtykke
- Klage til Datatilsynet

## 🎯 SPILLETS PLASSERING:
Spillet ligger i mappen over:
`..\echoesOfTime_kjellmagne_build\EchoesOfTime.exe`

## 📧 KONTAKT:
**E-post:** danielnj@hiof.no  
**Organisasjon:** Høgskolen i Østfold

---

## 📝 VERSJONHISTORIKK:

### Versjon 2.1 (2025-11-05) - FULL GDPR COMPLIANCE
- ✅ Lagt til aldersbekreftelse (13+) i web-versjon
- ✅ Obligatorisk checkbox for aldersbekreftelse
- ✅ Popup-advarsel ved manglende aldersbekreftelse
- ✅ Databrudd-rutine dokument (DATABRUDD_RUTINE.md)
- ✅ ROS-analyse dokument (ROS_ANALYSE.md)
- ✅ Backup-policy dokumentert (ingen cloud-backuper)
- ✅ Behandlingsprotokoll oppdatert med alle sikkerhetstiltak
- ✅ 100% GDPR-compliant for web-versjon

### Versjon 2.0 (2025-11-05)
- ✅ Lagt til full GDPR-compliance
- ✅ Samtykke-popup før spillet starter
- ✅ Logging av samtykke i deltakere.txt
- ✅ Automatisk sletting-script
- ✅ Komplett GDPR-dokumentasjon

### Versjon 1.0
- Grunnleggende registreringssystem
- Duplikatkontroll
- Score-tracking

---

Laget for Høgskolen i Østfold - Spillexpo
