# GDPR RUTINER - Nintendo Switch 2 Konkurranse
## Høgskolen i Østfold

---

## 📋 INNHOLDSFORTEGNELSE
1. [Oversikt](#oversikt)
2. [Behandlingsansvarlig](#behandlingsansvarlig)
3. [Rutiner for å utøve rettigheter](#rutiner-for-å-utøve-rettigheter)
4. [Automatisk sletting](#automatisk-sletting)
5. [Behandlingsprotokoll](#behandlingsprotokoll)

---

## 📌 OVERSIKT

Dette dokumentet beskriver rutiner for håndtering av personopplysninger i forbindelse med Nintendo Switch 2-konkurransen på Spillexpo, i henhold til GDPR (General Data Protection Regulation).

**Formål:** Gjennomføring av Nintendo Switch 2-konkurranse  
**Rettslig grunnlag:** Samtykke (GDPR Artikkel 6.1.a)  
**Lagringstid:** Maksimalt 30 dager etter vinnertrekning

---

## 🏢 BEHANDLINGSANSVARLIG

**Organisasjon:** Høgskolen i Østfold (HiØF)  
**Kontaktperson:** Daniel Nerjordet-Jensen  
**E-post:** danielnj@hiof.no  
**Ansvar:** Sikre GDPR-compliance og håndtere henvendelser om personvern

---

## ✅ RUTINER FOR Å UTØVE RETTIGHETER

### 1️⃣ INNSYN (Artikkel 15)

**Hva:** Deltaker kan be om kopi av alle data vi har lagret om dem.

**Rutine:**
1. Deltaker sender e-post til **danielnj@hiof.no** med emne: "Innsyn i personopplysninger"
2. Verifiser identitet:
   - Be om samme e-postadresse som ble brukt ved registrering
   - Bekreft navn og telefonnummer
3. Søk i `deltakere.txt` etter deltakerens data
4. Send kopi av lagrede data innen **30 dager**
5. Format: JSON eller lesbar tekst

**Eksempel på svar:**
```
Hei [Navn],

Her er dine lagrede personopplysninger:
- Navn: [Navn]
- E-post: [E-post]
- Telefon: [Telefon]
- Registrert: [Tidspunkt]
- Score: [Score]
- Samtykke gitt: [Ja/Nei]
- Samtykke tidspunkt: [Tidspunkt]

Mvh,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

---

### 2️⃣ RETTING (Artikkel 16)

**Hva:** Deltaker kan be om å rette feil i sine data.

**Rutine:**
1. Deltaker sender e-post til **danielnj@hiof.no** med emne: "Retting av personopplysninger"
2. Verifiser identitet (som ved innsyn)
3. Åpne `deltakere.txt`
4. Finn deltakerens data
5. Oppdater med korrekt informasjon
6. Lagre endringer
7. Bekreft retting til deltaker innen **14 dager**

**Eksempel på svar:**
```
Hei [Navn],

Dine personopplysninger er nå rettet som forespurt:
- [Felt]: Endret fra "[Gammel verdi]" til "[Ny verdi]"

Mvh,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

---

### 3️⃣ SLETTING (Artikkel 17 - "Retten til å bli glemt")

**Hva:** Deltaker kan be om at alle sine data slettes umiddelbart.

**Rutine:**
1. Deltaker sender e-post til **danielnj@hiof.no** med emne: "Slett mine personopplysninger"
2. Verifiser identitet (som ved innsyn)
3. Åpne `deltakere.txt`
4. Finn og fjern deltakerens data
5. Lagre endringer
6. Logg slettingen i `sletting_log.txt` med:
   - Tidspunkt
   - Grunn: "Forespørsel fra bruker (Art. 17)"
   - Hvem som utførte slettingen
7. Bekreft sletting til deltaker innen **14 dager**

**Eksempel på svar:**
```
Hei [Navn],

Alle dine personopplysninger er nå permanent slettet fra våre systemer.
Du er ikke lenger med i konkurransen.

Mvh,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

**VIKTIG:** Hvis sletting skjer etter vinnertrekning, informer deltaker om at de ikke kan vinne.

---

### 4️⃣ TREKKE TILBAKE SAMTYKKE (Artikkel 7.3)

**Hva:** Deltaker kan når som helst trekke tilbake sitt samtykke.

**Rutine:**
1. Deltaker sender e-post til **danielnj@hiof.no** med emne: "Trekk tilbake samtykke"
2. Verifiser identitet (som ved innsyn)
3. Følg samme prosedyre som for SLETTING (pkt. 3)
4. Logg med grunn: "Samtykke trukket tilbake (Art. 7.3)"

**Eksempel på svar:**
```
Hei [Navn],

Ditt samtykke er nå trukket tilbake, og alle dine personopplysninger er slettet.
Du er ikke lenger med i konkurransen.

Mvh,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

---

### 5️⃣ KLAGE TIL DATATILSYNET (Artikkel 77)

**Hva:** Deltaker kan klage til Datatilsynet hvis de mener vi ikke følger GDPR.

**Rutine:**
1. Informer deltaker om deres rett til å klage
2. Gi kontaktinformasjon til Datatilsynet:
   - **Nettside:** https://www.datatilsynet.no
   - **E-post:** postkasse@datatilsynet.no
   - **Telefon:** 22 39 69 00

**Eksempel på svar:**
```
Hei [Navn],

Vi beklager at du ikke er fornøyd med vår håndtering av dine personopplysninger.

Du har rett til å klage til Datatilsynet:
- Nettside: https://www.datatilsynet.no
- E-post: postkasse@datatilsynet.no
- Telefon: 22 39 69 00

Mvh,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

---

## 🗑️ AUTOMATISK SLETTING

### Kjøre sletting manuelt:

```bash
cd "C:\Users\ape00\Downloads\spill launcher ferdig\spill og launcher spillexpo\registrering"
python slett_gamle_deltakere.py
```

### Sette opp automatisk ukentlig sletting (Windows Task Scheduler):

1. Åpne Task Scheduler (søk i Start-menyen)
2. Klikk "Create Basic Task"
3. Navn: "GDPR - Slett gamle deltakere"
4. Trigger: Weekly (hver mandag kl. 09:00)
5. Action: Start a program
6. Program: `python`
7. Arguments: `"C:\Users\ape00\Downloads\spill launcher ferdig\spill og launcher spillexpo\registrering\slett_gamle_deltakere.py"`
8. Finish

**Logg:** Alle slettinger logges automatisk i `sletting_log.txt`

### Backup-policy og sletting i backuper:

**POLICY: INGEN CLOUD-BACKUPER**

Vi tar **IKKE** backuper av `deltakere.txt` til cloud-tjenester som:
- ❌ OneDrive
- ❌ Google Drive
- ❌ Dropbox
- ❌ iCloud

**Begrunnelse:** Reduserer risiko for databrudd og forenkler sletting.

**Hvis lokal backup er absolutt nødvendig:**
1. Backup må lagres på samme krypterte enhet (laptop)
2. Backup må slettes samtidig med `deltakere.txt` (etter 30 dager)
3. Logg backup-sletting i `sletting_log.txt`

**Prosedyre for sletting av backuper:**
1. Kjør `slett_gamle_deltakere.py`
2. Søk etter eventuelle kopier:
   - Eksterne USB-disker
   - Backup-mapper på laptop
   - E-post (vedlegg)
3. Slett alle kopier manuelt
4. Dokumenter i `sletting_log.txt`

---

## 🚨 DATABRUDD-HÅNDTERING

**Se separat dokument:** `DATABRUDD_RUTINE.md`

Dette dokumentet inneholder:
- Prosedyre ved databrudd (laptop tapt/stjålet)
- Varslingsrutiner til Datatilsynet (72-timers frist)
- Varslingsrutiner til berørte personer
- Logging av databrudd
- Forebyggende tiltak

**Ved databrudd:** Følg prosedyren i `DATABRUDD_RUTINE.md`

---

## 📊 RISIKO- OG SÅRBARHETSANALYSE (ROS)

**Se separat dokument:** `ROS_ANALYSE.md`

Dette dokumentet inneholder:
- Identifiserte risikoer (laptop-tap, uautorisert tilgang, etc.)
- Sannsynlighet og konsekvens for hver risiko
- Implementerte sikkerhetstiltak
- Risikomatrise
- Samlet vurdering: **LAV RISIKO** ✅

**Konklusjon:** Behandlingen kan gjennomføres med implementerte tiltak.

---

## 📊 BEHANDLINGSPROTOKOLL (Artikkel 30)

| Felt | Verdi |
|------|-------|
| **Behandlingsansvarlig** | Høgskolen i Østfold |
| **Kontaktperson** | Daniel Nerjordet-Jensen (danielnj@hiof.no) |
| **Formål med behandling** | Gjennomføring av Nintendo Switch 2-konkurranse |
| **Kategorier av personopplysninger** | Navn, e-post, telefonnummer, spillresultat, samtykke-informasjon, aldersbekreftelse (13+) |
| **Kategorier av registrerte** | Spillexpo-deltakere som ønsker å delta i konkurranse (13+ eller med foreldresamtykke) |
| **Mottakere av personopplysninger** | Kun autorisert personell ved HiØF (Daniel Nerjordet-Jensen) |
| **Overføring til tredjeland** | Nei |
| **Lagringstid** | Maksimalt 30 dager etter vinnertrekning (automatisk sletting) |
| **Tekniske og organisatoriske sikkerhetstiltak** | Disk-kryptering (BitLocker/FileVault), lokal lagring, begrenset tilgang (kun Daniel), automatisk sletting, ingen cloud-backuper, aldersverifisering |
| **Rettslig grunnlag** | Samtykke (GDPR Art. 6.1.a) |
| **Alderskrav** | 13+ eller foreldresamtykke (GDPR Art. 8) |
| **Databehandlere** | Ingen eksterne databehandlere |
| **Databrudd-rutine** | Dokumentert i DATABRUDD_RUTINE.md |
| **ROS-analyse** | Dokumentert i ROS_ANALYSE.md - vurdering: Lav risiko |

---

## 📞 KONTAKTINFORMASJON

**Ved spørsmål om GDPR eller personvern:**

**E-post:** danielnj@hiof.no  
**Organisasjon:** Høgskolen i Østfold  
**Kontaktperson:** Daniel Nerjordet-Jensen

---

## 📝 VERSJONHISTORIKK

| Versjon | Dato | Endringer |
|---------|------|-----------|
| 1.0 | 2025-11-05 | Opprettet initial dokumentasjon |

---

**Sist oppdatert:** 2025-11-05  
**Neste gjennomgang:** Etter Spillexpo (eller ved endringer i GDPR-krav)
