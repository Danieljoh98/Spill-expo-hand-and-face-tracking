# 🎭 MIMIKKMESTER - Din digitale tvilling

## 📖 OM APPLIKASJONEN

**MimikkMester** er en avansert nettbasert ansiktsgjenkjennings- og bevegelsesdeteksjonsapplikasjon utviklet for Høgskolen i Østfold (HiØF). Applikasjonen bruker AI og maskinlæring for å analysere ansiktsuttrykk, håndbevegelser og kroppsspråk i sanntid.

**Hovedfunksjoner:**
- ✨ Ansiktsgjenkjenning med uttrykksdeteksjon (glad, trist, sint, redd, avsky, overrasket, nøytral)
- ✋ Håndbevegelsesgjenkjenning (Stein, Saks, Papir, Tommel opp, OK, Rock, Peker)
- 🧍 Kroppssporing med skjelettvisualisering
- 🤖 Interaktiv tegnefilmavatar som speiler dine bevegelser
- 🎨 Animert bakgrunn med fallende emojier og bilder
- 🎯 Uttrykksbaserte bakgrunnsfarger for avataren

---

## 🚀 SLIK KOMMER DU I GANG

### 1. Åpne applikasjonen:
Dobbeltklikk på: **advanced-recognition.html**

Applikasjonen åpnes direkte i nettleseren din.

### 2. Gi kameratilgang:
Første gang må du godkjenne kameratilgang når nettleseren spør.

### 3. Start deteksjon:
Klikk på **"Start Kamera"** når AI-modellene er lastet.

### 4. Bruk funksjonene:
- 😊 **Ansikt: PÅ/AV** - Skru av/på ansiktsgjenkjenning
- ✋ **Hender: PÅ/AV** - Skru av/på håndgjenkjenning  
- 🧍 **Kropp: PÅ/AV** - Skru av/på kroppssporing
- 🤖 **Vis Avatar** - Vis din digitale tegnefilmavatar

---

## 🎮 FUNKSJONER I DETALJ

### 📸 Ansiktsgjenkjenning
Detekterer ansiktet ditt og viser:
- **Person oppdaget** - Hvor mange ansikter som er synlige
- **Uttrykk** - Hvilken følelse som vises (glad, trist, sint osv.)
- **Emoji** - Visuell representasjon av uttrykket
- **Konfidens** - Hvor sikker AI-en er (0-100%)

**Støttede uttrykk:**
- 😊 Glad (happy)
- 😢 Trist (sad)  
- 😡 Sint (angry)
- 😱 Redd (fearful)
- 🤮 Avsky (disgusted)
- 😮 Overrasket (surprised)
- 😐 Nøytral (neutral)

### ✋ Håndgjenkjenning
Gjenkjenner håndbevegelser:
- ✊ **Stein** - Knyttet neve
- ✋ **Papir** - Flate hender med alle fingre ut
- ✌️ **Saks** - Peke- og langfinger ut
- 👍 **Tommel opp** - Bare tommelen ut
- 👌 **OK** - Tommel og pekefinger danner sirkel
- 🤘 **Rock** - Peke- og lillefinger ut
- ☝️ **Peker** - Bare pekefingeren ut

**Spesiell funksjon:** Emojiene speilvender seg automatisk for høyre hånd!

### 🧍 Kroppssporing
Viser kroppens bevegelses skjelett med:
- Skulder-til-skulder kobling
- Arm-ledd (skulder-albue-håndledd)
- Torso (skulder-til-hofte)
- Nakke-kobling fra ansikt til skuldre
- Ben-ledd (hofte-kne-ankel)

### 🤖 Tegnefilmavatar
En interaktiv avatar som:
- **Speiler dine bevegelser** - Følger hodet, kroppen og hendene dine
- **Viser ditt uttrykk** - Endrer ansiktet basert på dine følelser
- **Bytter bakgrunnsfarge** - Hver følelse har sin egen farge:
  - 😊 Glad = Lys gul
  - 😢 Trist = Lys blå
  - 😡 Sint = Rosa
  - 😱 Redd = Lilla
  - 🤮 Avsky = Grønn
  - 😮 Overrasket = Lavendel
  - 😐 Nøytral = Lys blå
- **Blunker naturlig** - Tilfeldig blunking for realisme
- **Viser håndbevegelser** - Store emojier ved hendene dine

**Avatardesign:**
- Glad: Stort smil med glade øyenbryn
- Trist: Hengende munn med tårer
- Sint: Rød farge med sinte øyenbryn
- Redd: Stor åpen munn med svettpedråper
- Avsky: Grønn farge med tunge som stikker ut
- Overrasket: Store øyne med O-munn
- Nøytral: Rolig ansikt med rett munn

---

## 🎨 ANIMERTE BAKGRUNNER

**Fallende elementer:**
- Emojier (😊, 😢, 😡, osv.) - 60% sjanse
- Vanlige bilder (Pokemon, Mario, HiØF-logo) - 28% sjanse
- **Super rare bilder** - 2% sjanse! (Easter eggs)

**Automatisk refresh:** Hver 3. minutt refreshes animasjonen automatisk (se countdown i nedre høyre hjørne).

---

## 🔧 TEKNISK INFORMASJON

### AI-Modeller brukt:
- **face-api.js** - Ansiktsgjenkjenning og uttrykksdeteksjon
- **MediaPipe Hands** - Håndgjenkjenning  
- **MediaPipe Pose** - Kroppssporing

### Ytelsesoptimalisering:
- Ansiktsdeteksjon hver 3. frame (reduserer CPU-bruk)
- Target 60 FPS for smooth animasjoner
- Intelligent blunking og animasjonsfaser
- Effektiv canvas-rendering

### Kompatibilitet:
- ✅ Chrome (anbefalt)
- ✅ Edge
- ✅ Firefox  
- ⚠️ Safari (begrenset støtte for noen funksjoner)

**Systemkrav:**
- Webkamera
- Moderne nettleser (Chrome/Edge anbefalt)
- Internettforbindelse (for å laste AI-modeller fra CDN)

---

## 📂 FILSTRUKTUR

```
smile/
├── advanced-recognition.html    ← HOVEDFIL (åpne denne!)
├── registrering.py             ← Eldre registreringssystem  
├── web/                        ← Web-versjon (Flask)
│   ├── app.py
│   ├── templates/
│   └── static/
│       └── images/             ← Bilder for fallende animasjon
│           ├── hiof_logo.png
│           ├── pikachu.png
│           ├── Mario.png
│           └── ... (flere Pokemon/karakterer)
├── super rare dropdowns/       ← SUPER RARE Easter eggs! 🎁
│   ├── DanielNJ.png
│   ├── Easter_egg.png
│   └── ... (8 hemmelige bilder)
└── README.txt                  ← DENNE FILEN
```

---

## 🎯 BRUKSSCENARIER

### Presentasjoner og Undervisning:
Ideell for å demonstrere:
- Ansiktsgjenkjenningsteknologi
- Computer Vision og AI
- MediaPipe og machine learning
- Interaktiv teknologi

### Underholdning:
- Teste ulike ansiktsuttrykk
- Leke med håndbevegelser
- Se deg selv som tegnefilmavatar
- Finne de rare Easter eggs!

### Forskning og Utvikling:
- Studere ansiktsdeteksjonsalgoritmer
- Teste håndgjenkjenning
- Eksperimentere med pose estimation

---

## 👨‍💻 UTVIKLER

**Laget av:**
Daniel Nilsen Johansen  
Avdelingsingeniør i Generativ AI  
Høgskolen i Østfold (HiØF)

**Kontakt:** danielnj@hiof.no

---

## 📝 KJENTE BEGRENSNINGER

- Fungerer best i godt opplyste rom
- Kun én person detekteres om gangen (første ansikt i bildet)
- Krever internettforbindelse for første lasting av AI-modeller
- Enkelte håndbevegelser kan være vanskelige å gjenkjenne
- Safari kan ha begrenset støtte for noen funksjoner

---

## 🔐 PERSONVERN

**OBS:** Applikasjonen kjører 100% lokalt i nettleseren din.  
Ingen video eller data sendes til servere. Alt skjer på din egen maskin.

---

## 🎁 EASTER EGGS

Prøv å finne de 8 super rare bildene! (2% sjanse hver)
- 🎋 Bambu
- 👨‍💻 Daniel NJ (utvikleren!)
- 🥚 Easter egg
- ⚽ FFK (Fredrikstad Fotballklubb)
- 🤧 Hoste
- 🍄 Mario 2
- 🎓 RA (Rektorassistenten?)
- 🏰 Sandslott

---

Laget med ❤️ for Høgskolen i Østfold
Versjon 1.0 - Februar 2025
