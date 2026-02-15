# SPILLEXPO SJEKKLISTE
## Nintendo Switch 2 Konkurranse
### Høgskolen i Østfold

---

## 🎯 FORMÅL

Denne sjekklisten sikrer at alt er klart før, under og etter Spillexpo, og at alle GDPR-krav er oppfylt.

---

## ✅ FØR SPILLEXPO (1-2 dager før)

### Teknisk oppsett:
- [ ] **Verifiser disk-kryptering på laptop**
  - Windows: Sjekk at BitLocker er aktivert
  - Mac: Sjekk at FileVault er aktivert
  - Slik sjekker du: [Beskriv hvordan]
  
- [ ] **Test web-applikasjonen**
  ```bash
  cd "C:\Users\ape00\Downloads\spill launcher ferdig\spill og launcher spillexpo\registrering\web"
  python app.py
  ```
  - Åpne http://localhost:5000
  - Test registrering med dummy-data
  - Test aldersbekreftelse-checkbox (skal være obligatorisk)
  - Test GDPR-popup (skal vises før spillet starter)
  - Slett testdata fra deltakere.txt

- [ ] **Test Echoes of Time-spillet**
  - Verifiser at spillet starter
  - Spill noen nivåer
  - Sjekk at score lagres i scoreEntries.txt
  
- [ ] **Klargjør laptop**
  - Fulladet batteri
  - Ekstra strømkabel med
  -Mus (hvis nødvendig)
  - Laptop-lås (fysisk sikkerhet)

### GDPR-dokumentasjon:
- [ ] **Print ut GDPR-dokumenter** (ha fysiske kopier tilgjengelig)
  - GDPR_RUTINER.md (håndtering av henvendelser)
  - DATABRUDD_RUTINE.md (hvis noe skjer)
  - ROS_ANALYSE.md (for referanse)
  
- [ ] **Verifiser kontaktinformasjon**
  - Bekreft at danielnj@hiof.no fungerer
  - Fyll inn telefonnummer i DATABRUDD_RUTINE.md
  - Test at du får e-post

### Sikkerhet:
- [ ] **Verifiser ingen cloud-backuper**
  - Sjekk at deltakere.txt IKKE synkroniseres til OneDrive/Google Drive
  - Skru av auto-backup hvis aktivert
  
- [ ] **Sett sterkt passord på laptop** (hvis ikke allerede gjort)

---

## 🎮 UNDER SPILLEXPO

### Sikkerhet og personvern:
- [ ] **Laptop aldri forlatt uten oppsyn**
  - Lås laptop når du forlater bordet
  - Bruk fysisk lås hvis mulig
  
- [ ] **ALDRI send deltakere.txt på e-post**
  - Hvis noen ber om data: Si nei
  - Hvis absolutt nødvendig: Kun kryptert USB eller fysisk overlevering

- [ ] **Overvåk registreringer**
  - Sjekk at aldersbekreftelse fungerer
  - Hjelp barn under 13 med å få foreldresamtykke
  
- [ ] **Ha DATABRUDD_RUTINE.md tilgjengelig**
  - Hvis laptop mistes/stjeles: Følg rutinen umiddelbart
  - Datatilsynet må varsles innen 72 timer

### Teknisk:
- [ ] **Start web-applikasjonen**
  ```bash
  python app.py
  ```
  - La den kjøre hele dagen
  - Ikke lukk terminalen
  
- [ ] **Overvåk for feil**
  - Sjekk terminalen for error-meldinger
  - Test registrering periodisk

---

## 📋 ETTER SPILLEXPO (samme dag)

### Sikkerhet:
- [ ] **Laptop hjem trygt**
  - Ikke forlat laptop i bil
  - Ta med hjem eller oppbevar på HiØF
  
- [ ] **Verifiser at deltakere.txt er intakt**
  - Åpne filen og sjekk at data er der
  - Tell antall deltakere

### Backup-policy (VIKTIG):
- [ ] **IKKE ta backup til cloud**
  - Ikke last opp til OneDrive/Google Drive
  - Lokal backup kun hvis absolutt nødvendig
  
- [ ] **Hvis lokal backup tas:**
  - Lagre på samme krypterte laptop
  - Dokumenter i GDPR_RUTINER.md
  - Husk å slette samtidig med hovedfil (30 dager)

---

## 🏆 ETTER SPILLEXPO (1-7 dager etter)

### Vinnertrekning:
- [ ] **Trekk vinner**
  - Åpne deltakere.txt
  - Bruk tilfeldig trekning (f.eks. Python-script eller manuell)
  - Dokumenter hvem som vant (separat fil)
  
- [ ] **Kontakt vinner**
  - E-post eller telefon
  - Bekreft mottakelse
  - Dokumenter at vinner er varslet

- [ ] **Varsle ikke-vinnere** (valgfritt)
  - Send e-post: "Takk for deltakelse, dessverre vant du ikke denne gangen"

---

## 🗑️ 30 DAGER ETTER VINNERTREKNING

### Automatisk sletting:
- [ ] **Kjør sletting-script**
  ```bash
  cd "C:\Users\ape00\Downloads\spill launcher ferdig\spill og launcher spillexpo\registrering"
  python slett_gamle_deltakere.py
  ```
  
- [ ] **Verifiser sletting**
  - Åpne deltakere.txt
  - Skal være tom: `[]`
  - Sjekk sletting_log.txt for bekreftelse

- [ ] **Slett eventuelle backuper**
  - Søk etter alle kopier (USB, backup-mapper, e-post)
  - Slett manuelt
  - Dokumenter i sletting_log.txt

- [ ] **Bekreft at data er borte**
  - Ingen kopier i cloud (OneDrive/Google Drive)
  - Ingen kopier på USB/eksterne disker
  - Ingen e-post med deltakere.txt som vedlegg

---

## 📞 VED HENVENDELSER FRA DELTAKERE

### Innsyn (Art. 15):
- [ ] Følg rutine i GDPR_RUTINER.md
- [ ] Verifiser identitet (samme e-post)
- [ ] Send data innen 30 dager

### Sletting (Art. 17):
- [ ] Følg rutine i GDPR_RUTINER.md
- [ ] Verifiser identitet
- [ ] Slett fra deltakere.txt
- [ ] Bekreft sletting til deltaker innen 14 dager

### Tilbaketrekking av samtykke:
- [ ] Følg samme prosedyre som sletting
- [ ] Informer at de ikke lenger er med i konkurransen

---

## 🚨 VED DATABRUDD (hvis noe skjer)

- [ ] **STANS brudd umiddelbart** (hvis mulig)
- [ ] **Kontakt Daniel** (danielnj@hiof.no)
- [ ] **Følg DATABRUDD_RUTINE.md** (detaljert prosedyre)
- [ ] **Vurder risiko** (lav/høy)
- [ ] **Hvis høy risiko:**
  - Varsle Datatilsynet innen 72 timer
  - Varsle berørte personer
- [ ] **Logg hendelsen** i databrudd_log.txt

---

## 📊 SETT OPP AUTOMATISK SLETTING (VALGFRITT)

Hvis du vil at sletting skal skje automatisk etter 30 dager:

**Windows Task Scheduler:**
1. Åpne Task Scheduler
2. Klikk "Create Basic Task"
3. Navn: "GDPR - Slett gamle deltakere"
4. Trigger: Weekly (hver mandag kl. 09:00)
5. Action: Start a program
6. Program: `python`
7. Arguments: `"C:\Users\ape00\Downloads\spill launcher ferdig\spill og launcher spillexpo\registrering\slett_gamle_deltakere.py"`
8. Finish

---

## 📞 KONTAKTINFORMASJON

**Ansvarlig:**
- **Navn:** Daniel Nerjordet-Jensen
- **E-post:** danielnj@hiof.no
- **Telefon:** 47756498
- **Organisasjon:** Høgskolen i Østfold

**Datatilsynet (ved databrudd):**
- **Portal:** https://meldeskjema.datatilsynet.no
- **E-post:** postkasse@datatilsynet.no
- **Telefon:** 22 39 69 00

**HiØF IT-støtte (hvis nødvendig):**
- **E-post:** (Legg til hvis tilgjengelig)
- **Telefon:** (Legg til hvis tilgjengelig)

---

## ✅ FERDIG!

**Lykke til med Spillexpo!** 🎮🎉

Ved å følge denne sjekklisten sikrer du at:
- ✅ Alt er teknisk klart
- ✅ Alle GDPR-krav er oppfylt
- ✅ Sikkerhet er ivaretatt
- ✅ Data slettes etter 30 dager

**Spørsmål?** Kontakt danielnj@hiof.no

---

**Sist oppdatert:** 2025-11-05  
**Versjon:** 1.0
