# DATABRUDD-RUTINE
## Nintendo Switch 2 Konkurranse - Spillexpo
### Høgskolen i Østfold

---

## 📋 FORMÅL

Dette dokumentet beskriver prosedyrer for håndtering av databrudd i henhold til GDPR Artikkel 33 og 34.

**Definisjon av databrudd:** Enhver hendelse som fører til utilsiktet eller ulovlig tilintetgjørelse, tap, endring, uautorisert utlevering av eller tilgang til personopplysninger.

---

## 🚨 VARSLING TIL DATATILSYNET (Art. 33)

### Når må vi varsle?

**Datatilsynet må varsles innen 72 timer hvis databrudd medfører risiko for personers rettigheter og friheter.**

### Eksempler på databrudd som MÅ varsles:
- ✅ Laptop med deltakere.txt blir stjålet/tapt (UTEN disk-kryptering)
- ✅ Deltakere.txt sendes ved en feil til feil person via e-post
- ✅ Uautorisert person får tilgang til deltakere.txt
- ✅ Ransomware-angrep som krypterer/ødelegger data
- ✅ USB-minnepinne med backup blir mistet

### Eksempler som IKKE må varsles:
- ❌ Laptop stjålet MED disk-kryptering (BitLocker/FileVault) aktivert
- ❌ Teknisk feil som kun påvirker tilgjengelighet (ikke personvern)
- ❌ Hendelser uten risiko for personopplysninger

---

## ⏱️ PROSEDYRE VED DATABRUDD

### FASE 1: OPPDAGELSE (0-2 timer)

**Handlinger umiddelbart:**

1. **Stopp brudd** (hvis mulig)
   - Koble fra nettverket hvis nødvendig
   - Endre passord
   - Sperre tilgang til kompromitterte systemer

2. **Dokumenter hendelsen**
   - Tidspunkt for oppdagelse
   - Type brudd (tyveri, tap, hacking, feilutsending)
   - Omfang: Hvor mange deltakere er berørt?
   - Hvilke data er kompromittert?

3. **Kontakt ansvarlig**
   - **Daniel Nerjordet-Jensen**
   - E-post: danielnj@hiof.no
   - Telefon: 47756498

---

### FASE 2: VURDERING (2-24 timer)

**Vurder risiko:**

| Faktor | Lav risiko | Høy risiko |
|--------|------------|------------|
| **Data beskyttet?** | Disk-kryptering på | Ingen kryptering |
| **Sensitiv info?** | Kun navn/e-post | Også helseopplysninger |
| **Antall berørte** | < 10 personer | > 50 personer |
| **Mulighet for misbruk** | Liten | Stor (identitetstyveri) |

**Beslutning:**
- **Lav risiko:** Logg hendelsen internt, IKKE varsle Datatilsynet
- **Høy risiko:** Fortsett til Fase 3 (varsling)

---

### FASE 3: VARSLING TIL DATATILSYNET (innen 72 timer)

**Hvis høy risiko - varsle Datatilsynet:**

**Varslingskanal:**
- **Portal:** https://meldeskjema.datatilsynet.no
- **E-post:** postkasse@datatilsynet.no
- **Telefon:** 22 39 69 00

**Informasjon som må oppgis:**

1. **Beskrivelse av bruddet**
   - Hva skjedde?
   - Når ble det oppdaget?
   - Type personopplysninger berørt

2. **Omfang**
   - Antall berørte personer: [ca. X deltakere]
   - Type data: Navn, telefon, e-post, spillresultat, samtykke-info

3. **Konsekvenser**
   - Vurdering av risiko for de registrerte
   - Mulige konsekvenser (spam, identitetstyveri, etc.)

4. **Tiltak**
   - Hva har vi gjort for å stoppe bruddet?
   - Hva gjør vi for å begrense skaden?
   - Tiltak for å forhindre fremtidige brudd

5. **Kontaktinformasjon**
   - Navn: Daniel Nerjordet-Jensen
   - Organisasjon: Høgskolen i Østfold
   - E-post: danielnj@hiof.no
   - Telefon: 47756498

**Frist:** Varsling må skje senest 72 timer etter oppdagelse.

---

### FASE 4: VARSLING TIL BERØRTE (Art. 34)

**Når må de registrerte varsles?**

Berørte personer må varsles **uten unødig opphold** hvis bruddet medfører **høy risiko** for deres rettigheter og friheter.

**Eksempler:**
- ✅ Risiko for identitetstyveri
- ✅ Økonomisk tap
- ✅ Omdømmeskade
- ✅ Diskriminering

**Varslingsmetode:**

**E-post til alle berørte deltakere:**

```
Emne: VIKTIG - Sikkerhetshendelse hos HiØF

Kjære [Navn],

Vi må dessverre informere deg om en sikkerhetshendelse som har påvirket dine personopplysninger registrert i forbindelse med Nintendo Switch 2-konkurransen på Spillexpo.

HVA SKJEDDE:
[Beskriv hendelsen]

HVILKE OPPLYSNINGER ER BERØRT:
- Navn: [Navn]
- E-post: [E-post]
- Telefon: [Telefon]
- Registreringstidspunkt og spillresultat

HVA ER RISIKOEN:
[Beskriv konkret risiko]

HVA HAR VI GJORT:
[Beskriv tiltak]

HVA KAN DU GJØRE:
[Anbefalinger til mottaker, f.eks. være obs på phishing]

KONTAKT OSS:
Hvis du har spørsmål, kontakt oss på:
- E-post: danielnj@hiof.no
- Telefon: 47756498

Vi beklager denne hendelsen.

Med vennlig hilsen,
Daniel Nerjordet-Jensen
Høgskolen i Østfold
```

**Dokumentasjon:**
- Logg tidspunkt for utsendelse
- Lagre kopi av e-post
- Dokumenter eventuelle henvendelser fra berørte

---

## 📝 LOGGING AV DATABRUDD

**Alle databrudd (også små hendelser) skal logges i:**

**Fil:** `databrudd_log.txt`

**Format:**
```
============================================================
DATABRUDD LOGGFØRT: [YYYY-MM-DD HH:MM:SS]
============================================================
Type hendelse: [Tyveri/Tap/Hacking/Feilutsending/Annet]
Oppdaget: [YYYY-MM-DD HH:MM:SS]
Oppdaget av: [Navn]

OMFANG:
- Antall berørte: [X personer]
- Data berørt: [Navn, e-post, telefon, etc.]

RISIKO:
- Vurdering: [Lav/Middels/Høy]
- Begrunnelse: [Tekst]

TILTAK:
- Umiddelbare: [Hva ble gjort umiddelbart?]
- Langsiktige: [Hva gjøres for å forhindre gjentagelse?]

VARSLING:
- Datatilsynet varslet: [JA/NEI]
- Hvis ja, tidspunkt: [YYYY-MM-DD HH:MM:SS]
- Berørte varslet: [JA/NEI]
- Hvis ja, tidspunkt: [YYYY-MM-DD HH:MM:SS]

OPPFØLGING:
[Beskrivelse av videre tiltak]

============================================================
```

---

## 🔒 FOREBYGGING AV DATABRUDD

### Sikkerhetstiltak som MÅ være på plass:

1. **Disk-kryptering**
   - ✅ BitLocker (Windows) eller FileVault (Mac) aktivert
   - ✅ Sterkt passord på laptop

2. **Tilgangskontroll**
   - ✅ Kun autorisert personell (Daniel) har tilgang til deltakere.txt
   - ✅ Laptop ikke forlatt uten lås

3. **Backup-håndtering**
   - ✅ Ingen backuper i skyen (OneDrive/Google Drive/Dropbox)
   - ✅ Lokal backup kun hvis absolutt nødvendig
   - ✅ Backup slettes samtidig med hovedfil (30 dager)

4. **E-post sikkerhet**
   - ✅ ALDRI send deltakere.txt på e-post
   - ✅ Dobbeltsjekk mottaker før sending av sensitive data

5. **Etter arrangementet**
   - ✅ Kjør automatisk sletting etter 30 dager
   - ✅ Verifiser at alle kopier er slettet

---

## 📞 KONTAKTINFORMASJON

**Ansvarlig for databehandling:**
- **Navn:** Daniel Nerjordet-Jensen
- **E-post:** danielnj@hiof.no
- **Telefon:** 47756498
- **Organisasjon:** Høgskolen i Østfold

**Datatilsynet:**
- **Portal:** https://meldeskjema.datatilsynet.no
- **E-post:** postkasse@datatilsynet.no
- **Telefon:** 22 39 69 00
- **Nettside:** https://www.datatilsynet.no

**HiØF IT-støtte (hvis aktuelt):**
- **E-post:** (Legg til hvis tilgjengelig)
- **Telefon:** (Legg til hvis tilgjengelig)

---

## ✅ SJEKKLISTE VED DATABRUDD

- [ ] Stopp brudd umiddelbart (hvis mulig)
- [ ] Dokumenter hendelsen detaljert
- [ ] Kontakt Daniel (danielnj@hiof.no)
- [ ] Vurder risiko (lav/høy)
- [ ] Hvis høy risiko: Varsle Datatilsynet innen 72 timer
- [ ] Hvis høy risiko: Varsle berørte personer
- [ ] Logg hendelsen i databrudd_log.txt
- [ ] Implementer tiltak for å forhindre gjentagelse
- [ ] Følg opp med Datatilsynet hvis nødvendig

---

**Dokumentet er godkjent av:**  
Daniel Nerjordet-Jensen  
Høgskolen i Østfold  

**Dato:** 2025-11-05  
**Versjon:** 1.0  
**Neste gjennomgang:** Etter Spillexpo eller ved endringer
