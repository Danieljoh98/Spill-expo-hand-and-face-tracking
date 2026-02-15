// Globale variabler
let currentNavn = '';
let currentTelefon = '';
let currentEpost = '';
let autoResetTimer = null; // Timer for automatisk tilbakestilling
let countdownInterval = null; // Interval for countdown-oppdatering
let popupTimer = null; // Timer for å automatisk lukke popup
let popupCountdownInterval = null; // Interval for popup countdown
let errorPopupTimer = null; // Timer for error popup auto-close
let gdprAlreadyAccepted = false; // Track om GDPR allerede er godkjent
let samtykkeTidspunktLokal = null; // Tidspunkt når bruker huket av samtykke-checkbox
let aldersbekreftelseTidspunkt = null; // ✅ NYTT: Tidspunkt når bruker bekreftet alder 13+
let markedsforingSamtykke = false; // ✅ NYTT: Om bruker samtykket til markedsføring
let markedsforingSamtykkeTidspunkt = null; // ✅ NYTT: Tidspunkt når bruker samtykket til markedsføring
let neiTakkMarkedsforing = false; // ✅ NYTT: Om bruker sa NEI TAKK til markedsføring (men vil ha 3x vinnersjanse)
let neiTakkMarkedsforingTidspunkt = null; // ✅ NYTT: Tidspunkt når bruker sa NEI TAKK

// Variabler for UI-elementer (cachet for ytelse)
const appContainer = document.getElementById('app-container');
const registreringsSkjerm = document.getElementById('registrering-skjerm');
const venteSkjerm = document.getElementById('vente-skjerm');
const resultatSkjerm = document.getElementById('resultat-skjerm');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');

// Når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    // Legg til event listeners
    document.getElementById('start-knapp').addEventListener('click', startSpill);
    document.getElementById('registrer-knapp').addEventListener('click', registrerDeg);
    document.getElementById('ny-deltaker-knapp').addEventListener('click', tilbakestillSkjerm);
    document.getElementById('popup-ok-btn').addEventListener('click', lukkPopup);
    document.getElementById('error-ok-btn').addEventListener('click', lukkErrorPopup);
    
    // ✅ NYTT: Sjekk validering ved input i felt
    document.getElementById('navn').addEventListener('input', sjekkReadyStatus);
    document.getElementById('telefon').addEventListener('input', sjekkReadyStatus);
    document.getElementById('epost').addEventListener('input', sjekkReadyStatus);
    document.getElementById('age-confirmation-checkbox').addEventListener('change', sjekkReadyStatus);
    
    // GDPR popup event listeners
    document.getElementById('gdpr-godkjenn-btn').addEventListener('click', godkjennGDPR);
    document.getElementById('gdpr-avbryt-btn').addEventListener('click', avbrytGDPR);
    
    // GDPR Les Personvernerklæring knapp
    document.getElementById('les-gdpr-knapp').addEventListener('click', visGDPRPopupDirekte);
    
    // GDPR checkbox - logg tidspunkt når bruker huker av
    document.getElementById('gdpr-consent-checkbox').addEventListener('change', function(e) {
        if (e.target.checked) {
            // Logg tidspunkt når bruker huker av (brukes ved registrering)
            samtykkeTidspunktLokal = new Date().toISOString();
        } else {
            // Hvis bruker fjerner haken, nullstill tidspunkt
            samtykkeTidspunktLokal = null;
        }
    });
    
    // ✅ MARKEDSFØRING checkbox - logg tidspunkt og status
    document.getElementById('gdpr-marketing-checkbox').addEventListener('change', function(e) {
        if (e.target.checked) {
            // Hvis JA til markedsføring, fjern NEI TAKK
            document.getElementById('gdpr-no-marketing-checkbox').checked = false;
            neiTakkMarkedsforing = false;
            neiTakkMarkedsforingTidspunkt = null;
            
            // Logg at bruker samtykker til markedsføring
            markedsforingSamtykke = true;
            markedsforingSamtykkeTidspunkt = new Date().toISOString();
            console.log('✅ Markedsføringssamtykke gitt:', markedsforingSamtykkeTidspunkt);
        } else {
            // Hvis bruker fjerner haken
            markedsforingSamtykke = false;
            markedsforingSamtykkeTidspunkt = null;
            console.log('⚠️ Markedsføringssamtykke fjernet');
        }
    });
    
    // ✅ NYTT: NEI TAKK til markedsføring checkbox - gir også 3x vinnersjanse
    document.getElementById('gdpr-no-marketing-checkbox').addEventListener('change', function(e) {
        if (e.target.checked) {
            // Hvis NEI TAKK til markedsføring, fjern JA til markedsføring
            document.getElementById('gdpr-marketing-checkbox').checked = false;
            markedsforingSamtykke = false;
            markedsforingSamtykkeTidspunkt = null;
            
            // Logg at bruker sa NEI TAKK til markedsføring
            neiTakkMarkedsforing = true;
            neiTakkMarkedsforingTidspunkt = new Date().toISOString();
            console.log('✅ NEI TAKK til markedsføring registrert:', neiTakkMarkedsforingTidspunkt);
        } else {
            // Hvis bruker fjerner haken
            neiTakkMarkedsforing = false;
            neiTakkMarkedsforingTidspunkt = null;
            console.log('⚠️ NEI TAKK til markedsføring fjernet');
        }
    });
    
    // ✅ ALDERSBEKREFTELSE checkbox - logg tidspunkt når bruker huker av
    document.getElementById('age-confirmation-checkbox').addEventListener('change', function(e) {
        if (e.target.checked) {
            // Logg tidspunkt når bruker bekrefter alder 13+
            aldersbekreftelseTidspunkt = new Date().toISOString();
            console.log('✅ Aldersbekreftelse registrert:', aldersbekreftelseTidspunkt);
        } else {
            // Hvis bruker fjerner haken, nullstill tidspunkt
            aldersbekreftelseTidspunkt = null;
            console.log('⚠️ Aldersbekreftelse fjernet');
        }
    });

    // Sørg for at kun registreringsskjermen vises ved oppstart
    visSkjerm('registrering');

    // Kjør Lucide ikon-rendering etter at DOM er lastet.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialiser fallende bananer
    initFallingBananas();
});

// Hjelpefunksjon for å bytte mellom skjermer
function visSkjerm(skjermNavn) {
    // Lukk error popup når vi bytter skjerm
    lukkErrorPopup();
    
    // FIKS: Bruk den korrekt definerte variabelen 'registreringsSkjerm' (med 's')
    registreringsSkjerm.style.display = 'none';
    venteSkjerm.style.display = 'none';
    resultatSkjerm.style.display = 'none';

    if (skjermNavn === 'registrering') {
        // FIKS: Bruk den korrekt definerte variabelen 'registreringsSkjerm' (med 's')
        registreringsSkjerm.style.display = 'block';
    } else if (skjermNavn === 'vente') {
        venteSkjerm.style.display = 'block';
    } else if (skjermNavn === 'resultat') {
        resultatSkjerm.style.display = 'block';
    }
}

// Vis laste-overlay
function visLaster(tekst = 'Laster...') {
    loadingText.textContent = tekst;
    loadingOverlay.classList.remove('hidden');
}

// Skjul laste-overlay
function skjulLaster() {
    loadingOverlay.classList.add('hidden');
}

// Vis notifikasjon
function visNotifikasjon(melding, type) {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = ` ${type === 'success' ? '✔' : '❌'} ${melding} `;
    notificationArea.appendChild(notification);

    // Fjern notifikasjonen etter 5 sekunder
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 5000);
}

// Vis error popup med highlighting av felt
function visErrorPopup(melding, feltId = null) {
    const errorPopup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-message');
    
    // Sett feilmelding
    errorMessage.textContent = melding;
    
    // Vis popup
    errorPopup.classList.remove('hidden');
    
    // Highlight felt hvis spesifisert
    if (feltId) {
        const feltElement = document.getElementById(feltId);
        if (feltElement) {
            feltElement.classList.add('input-error');
            // Fjern highlight etter 3 sekunder
            setTimeout(() => {
                feltElement.classList.remove('input-error');
            }, 3000);
        }
    }
    
    // Auto-lukk etter 10 sekunder
    if (errorPopupTimer) {
        clearTimeout(errorPopupTimer);
    }
    errorPopupTimer = setTimeout(() => {
        lukkErrorPopup();
    }, 10000);
}

// Lukk error popup
function lukkErrorPopup() {
    const errorPopup = document.getElementById('error-popup');
    errorPopup.classList.add('hidden');
    
    // Fjern alle error highlights
    document.querySelectorAll('.input-error').forEach(el => {
        el.classList.remove('input-error');
    });
    
    // Stopp timer
    if (errorPopupTimer) {
        clearTimeout(errorPopupTimer);
        errorPopupTimer = null;
    }
}

// ✅ NYTT: Sjekk om alle felt er fylt ut og vis indikator
function sjekkReadyStatus() {
    const navn = document.getElementById('navn').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const epost = document.getElementById('epost').value.trim();
    const ageConfirmed = document.getElementById('age-confirmation-checkbox').checked;
    const readyIndikator = document.getElementById('ready-indikator');
    const pilIndikator = document.getElementById('pil-indikator'); // ✅ Venstre pil
    const pilIndikatorHoyre = document.getElementById('pil-indikator-hoyre'); // ✅ NYTT: Høyre pil
    
    // Sjekk om alt er fylt ut OG validert
    const navnOk = navn.length > 0;
    const telefonOk = telefon.length >= 8 && /^\d+$/.test(telefon);
    const epostOk = epost.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost);
    const ageOk = ageConfirmed;
    
    const alleFeltValidert = navnOk && telefonOk && epostOk && ageOk;
    
    console.log('Ready status:', { navnOk, telefonOk, epostOk, ageOk, alleFeltValidert }); // Debug
    
    // Vis/skjul indikatorer basert på status
    if (alleFeltValidert) {
        readyIndikator.style.display = 'inline-block';
        pilIndikator.style.display = 'block'; // ✅ Vis venstre pil
        pilIndikatorHoyre.style.display = 'block'; // ✅ NYTT: Vis høyre pil
        console.log('Viser begge piler og ready indikator'); // Debug
    } else {
        readyIndikator.style.display = 'none';
        pilIndikator.style.display = 'none'; // ✅ Skjul venstre pil
        pilIndikatorHoyre.style.display = 'none'; // ✅ NYTT: Skjul høyre pil
    }
}

// Valider input
function validerInput() {
    const navn = document.getElementById('navn').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const epost = document.getElementById('epost').value.trim();
    const ageConfirmed = document.getElementById('age-confirmation-checkbox').checked;

    // ✅ TEST-MODUS: Hvis navn er "test", hopp over alle valideringer
    if (navn.toLowerCase() === "test") {
        console.log('TEST-MODUS: Hopper over alle valideringer');
        return true;
    }

    if (!navn) {
        visErrorPopup('Vennligst fyll inn navn', 'navn');
        return false;
    }
    if (!telefon) {
        visErrorPopup('Vennligst fyll inn telefonnummer', 'telefon');
        return false;
    }
    // Sjekk at telefonnummer kun inneholder tall
    if (!/^\d+$/.test(telefon)) {
        visErrorPopup('Telefonnummer må kun inneholde tall', 'telefon');
        return false;
    }
    // Sjekk at telefonnummer er mellom 8 og 15 siffer
    if (telefon.length < 8) {
        visErrorPopup('Telefonnummer må være minst 8 siffer', 'telefon');
        return false;
    }
    if (telefon.length > 15) {
        visErrorPopup('Telefonnummer kan ikke være mer enn 15 siffer. Du har skrevet ' + telefon.length + ' siffer.', 'telefon');
        return false;
    }
    // ✅ FORBEDRET E-POSTVALIDERING med TLD-sjekk
    if (!epost) {
        visErrorPopup('Vennligst fyll inn e-postadresse', 'epost');
        return false;
    }
    
    // Basis regex-sjekk
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
        visErrorPopup('Ugyldig e-postformat. Må inneholde @ og domene med punktum.\n\nEksempel: navn@hiof.no', 'epost');
        return false;
    }
    
    // ✅ KRITISK: Valider at TLD (etter siste punktum) har minst 2 bokstaver
    const epostParts = epost.split('.');
    const tld = epostParts[epostParts.length - 1];
    
    // Sjekk at TLD har minst 2 tegn
    if (tld.length < 2) {
        visErrorPopup(
            'Ugyldig e-postadresse.\n\n' +
            'E-postadressen må ha minst 2 bokstaver etter siste punktum.\n\n' +
            'Eksempel: navn@example.com eller navn@hiof.no', 
            'epost'
        );
        return false;
    }
    
    // Sjekk at TLD kun inneholder bokstaver (a-z, A-Z)
    if (!/^[a-zA-Z]+$/.test(tld)) {
        visErrorPopup(
            'Ugyldig e-postadresse.\n\n' +
            'E-postadressen må ha kun bokstaver etter siste punktum (ingen tall).\n\n' +
            'Eksempel: navn@hiof.no (ikke navn@hiof.33)', 
            'epost'
        );
        return false;
    }
    
    // GDPR Art. 8 - Aldersbekreftelse
    if (!ageConfirmed) {
        // Highlight aldersbekreftelse-boksen
        const ageBox = document.querySelector('.age-confirmation');
        ageBox.classList.add('error');
        setTimeout(() => {
            ageBox.classList.remove('error');
        }, 3000);
        
        visErrorPopup(
            'Du må bekrefte at du er 13 år eller eldre for å delta.\n\n' +
            'Er du under 13 år, må en foresatt gi samtykke her sammen med en av oss som jobber her.\n\n' +
            'Vi lagrer ikke opplysninger før foresatt har bekreftet.'
        );
        return false;
    }
    
    return true;
}

// Sjekk om allerede registrert
async function sjekkRegistrert(navn, telefon, epost) {
    visLaster('Sjekker registrering...');
    try {
        const response = await fetch('/api/sjekk_registrert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ navn, telefon, epost })
        });
        const data = await response.json();
        skjulLaster();
        
        // Flask returnerer 'registrert', ikke 'isRegistered'
        if (data.registrert) {
            // Finn hvilket felt som er duplikat og highlight det
            let feltId = null;
            if (data.melding.toLowerCase().includes('e-post')) {
                feltId = 'epost';
            } else if (data.melding.toLowerCase().includes('telefon')) {
                feltId = 'telefon';
            } else if (data.melding.toLowerCase().includes('navn')) {
                feltId = 'navn';
            }
            visErrorPopup(data.melding, feltId);
            return { isRegistered: true, message: data.melding };
        }
        return { isRegistered: false };
    } catch (error) {
        console.error('Feil ved sjekk av registrering:', error);
        skjulLaster();
        visNotifikasjon('En feil oppstod ved sjekk av tidligere registrering.', 'error');
        return { isRegistered: true, error: 'Klarte ikke å kontakte serveren.' };
    }
}

// Vis GDPR popup
function visGDPRPopup() {
    const gdprPopup = document.getElementById('gdpr-popup');
    const checkbox = document.getElementById('gdpr-consent-checkbox');
    
    // Fjern hake fra checkbox
    checkbox.checked = false;
    
    // Vis popup
    gdprPopup.classList.remove('hidden');
}

// Vis GDPR popup direkte (fra "Les personvernerklæring" knapp)
function visGDPRPopupDirekte() {
    // Ingen validering nødvendig - brukeren kan lese når som helst
    visGDPRPopup();
}

// Skjul GDPR popup
function skjulGDPRPopup() {
    const gdprPopup = document.getElementById('gdpr-popup');
    gdprPopup.classList.add('hidden');
}

// Godkjenn GDPR og start spillet
function godkjennGDPR() {
    const checkbox = document.getElementById('gdpr-consent-checkbox');
    
    if (!checkbox.checked) {
        visErrorPopup('Du må godkjenne personvernerklæringen for å delta i konkurransen.');
        return;
    }
    
    // Marker at GDPR er godkjent
    gdprAlreadyAccepted = true;
    
    // Lukk GDPR popup
    skjulGDPRPopup();
    
    // Hvis brukeren kom fra "Les personvernerklæring" knappen, bare lukk popup
    // Hvis brukeren kom fra "Start ECHOES OF TIME", start spillet
    if (currentNavn && currentTelefon && currentEpost) {
        // Start spillet
        startSpillEtterSamtykke();
    } else {
        // Vis notifikasjon at de har godkjent
        visNotifikasjon('Personvernerklæring godkjent. Du kan nå fylle ut skjemaet og starte spillet.', 'success');
    }
}

// Avbryt GDPR
function avbrytGDPR() {
    // Lukk popup
    skjulGDPRPopup();
    
    // Vis melding
    visErrorPopup('Du må godkjenne personvernerklæringen for å delta i konkurransen.\n\nDine opplysninger er IKKE lagret.');
}

// Starter spillet og bytter til venteskjerm
async function startSpill() {
    if (!validerInput()) {
        return;
    }
    // Hent input-verdier
    const navn = document.getElementById('navn').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const epost = document.getElementById('epost').value.trim();

    // ✅ TEST-MODUS: Hvis navn er "test", hopp over GDPR og gå rett til spill
    if (navn.toLowerCase() === "test") {
        console.log('TEST-MODUS: Hopper over GDPR-popup og starter spillet direkte');
        currentNavn = navn;
        currentTelefon = telefon;
        currentEpost = epost;
        startSpillEtterSamtykke();
        return;
    }

    // Sjekk for duplikat
    const sjekkResultat = await sjekkRegistrert(navn, telefon, epost);
    if (sjekkResultat.isRegistered) {
        // Error popup er allerede vist av sjekkRegistrert
        return;
    }

    // Lagre data midlertidig
    currentNavn = navn;
    currentTelefon = telefon;
    currentEpost = epost;
    
    // Sjekk om GDPR allerede er godkjent
    if (gdprAlreadyAccepted) {
        // Gå direkte til spillet
        startSpillEtterSamtykke();
    } else {
        // Vis GDPR popup
        visGDPRPopup();
    }
}

// Start spillet etter GDPR samtykke
async function startSpillEtterSamtykke() {
    visLaster('Starter spillet...');
    try {
        // Send data til serveren for å starte spillet
        const response = await fetch('/api/start_spill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                navn: currentNavn, 
                telefon: currentTelefon, 
                epost: currentEpost
            })
        });
        const data = await response.json();
        skjulLaster();

        if (data.success) {
            // Oppdater venteskjermen
            document.getElementById('vente-navn').value = currentNavn;
            document.getElementById('vente-telefon').value = currentTelefon;
            document.getElementById('vente-epost').value = currentEpost;

            // Bytt til venteskjermen
            visSkjerm('vente');
            visStatusMelding('', ''); // Nullstill registreringsskjermstatus
            visNotifikasjon('Spillet er startet! Lukk spillet for å registrere score.', 'success');
        } else {
            visNotifikasjon('Klarte ikke å starte spillet: ' + (data.error || 'Ukjent feil'), 'error');
        }
    } catch (error) {
        console.error('Feil ved spillstart:', error);
        skjulLaster();
        visNotifikasjon('En feil oppstod ved start av spill.', 'error');
    }
}

// Redigeringsfunksjonalitet for venteskjermen
function toggleEdit(feltNavn) {
    const inputId = `vente-${feltNavn}`;
    const inputElement = document.getElementById(inputId);
    const editButton = inputElement.nextElementSibling;
    const statusElement = document.getElementById('rediger-status');

    if (inputElement.readOnly) {
        // Gå til redigeringsmodus
        inputElement.readOnly = false;
        inputElement.classList.add('editing');
        inputElement.focus();
        editButton.textContent = 'Lagre';
        editButton.classList.add('saving');
        statusElement.textContent = `Redigerer ${feltNavn}...`;
        statusElement.classList.remove('error', 'success');
    } else {
        // Forsøk å lagre endringer
        const nyttVerdi = inputElement.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (feltNavn === 'navn' && !nyttVerdi) {
            isValid = false;
            errorMessage = 'Navn kan ikke være tomt.';
        } else if (feltNavn === 'telefon') {
            if (!nyttVerdi || !/^\d+$/.test(nyttVerdi) || nyttVerdi.length < 8) {
                isValid = false;
                errorMessage = 'Telefonnummer må være minst 8 siffer og kun tall.';
            }
        } else if (feltNavn === 'epost') {
            if (!nyttVerdi || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nyttVerdi)) {
                isValid = false;
                errorMessage = 'Ugyldig e-postadresse.';
            }
        }

        if (isValid) {
            // Oppdater global variabel (kun lokalt, da vi registrerer alt samlet senere)
            if (feltNavn === 'navn') currentNavn = nyttVerdi;
            if (feltNavn === 'telefon') currentTelefon = nyttVerdi;
            if (feltNavn === 'epost') currentEpost = nyttVerdi;

            inputElement.readOnly = true;
            inputElement.classList.remove('editing');
            editButton.textContent = 'Rediger';
            editButton.classList.remove('saving');
            statusElement.textContent = `${feltNavn} oppdatert.`;
            statusElement.className = 'rediger-status success';
        } else {
            // Vis error popup og highlight feltet
            visErrorPopup(errorMessage, inputId);
            statusElement.textContent = '';
            statusElement.className = 'rediger-status error';
        }
    }
}

// Registrerer deltaker etter spillet er avsluttet
async function registrerDeg() {
    // Sjekk om noen felt er i redigeringsmodus
    const navnInput = document.getElementById('vente-navn');
    const telefonInput = document.getElementById('vente-telefon');
    const epostInput = document.getElementById('vente-epost');
    
    if (!navnInput.readOnly || !telefonInput.readOnly || !epostInput.readOnly) {
        visErrorPopup('Du må lagre alle endringer før du kan registrere deg. Trykk "Lagre" på feltene du redigerer.');
        return;
    }
    
    visLaster('Registrerer score...');

    // Hent oppdaterte verdier fra venteskjermen (hvis de ble redigert)
    const navn = navnInput.value.trim();
    const telefon = telefonInput.value.trim();
    const epost = epostInput.value.trim();

    // ✅ TEST-MODUS: Hvis navn er "test", hopp over alle valideringer
    if (navn.toLowerCase() === "test") {
        console.log('TEST-MODUS: Hopper over valideringer i registrerDeg()');
        // Fortsett direkte til registrering (backend håndterer test-modus)
    } else {
        // Valider data grundig (kun hvis ikke test-modus)
        if (!navn) {
            skjulLaster();
            visErrorPopup('Navn kan ikke være tomt.', 'vente-navn');
            return;
        }
        
        if (!telefon) {
            skjulLaster();
            visErrorPopup('Telefonnummer kan ikke være tomt.', 'vente-telefon');
            return;
        }
        
        if (!/^\d+$/.test(telefon)) {
            skjulLaster();
            visErrorPopup('Telefonnummer må kun inneholde tall.', 'vente-telefon');
            return;
        }
        
        if (telefon.length < 8) {
            skjulLaster();
            visErrorPopup('Telefonnummer må være minst 8 siffer.', 'vente-telefon');
            return;
        }
        
        if (telefon.length > 15) {
            skjulLaster();
            visErrorPopup('Telefonnummer kan ikke være mer enn 15 siffer. Du har skrevet ' + telefon.length + ' siffer.', 'vente-telefon');
            return;
        }
        
        if (!epost || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
            skjulLaster();
            visErrorPopup('Vennligst fyll inn en gyldig e-postadresse.', 'vente-epost');
            return;
        }
        
        // Sjekk om allerede registrert før vi sender inn
        const sjekkResultat = await sjekkRegistrert(navn, telefon, epost);
        if (sjekkResultat.isRegistered) {
            // Error popup er allerede vist av sjekkRegistrert
            return;
        }
    }

    try {
        const response = await fetch('/api/registrer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                navn, 
                telefon, 
                epost,
                samtykke_tidspunkt_lokal: samtykkeTidspunktLokal,
                aldersbekreftelse_tidspunkt: aldersbekreftelseTidspunkt,  // ✅ Send aldersbekreftelse-tidspunkt
                markedsforing_samtykke: markedsforingSamtykke,  // ✅ NYTT: Send markedsføringssamtykke
                markedsforing_samtykke_tidspunkt: markedsforingSamtykkeTidspunkt,  // ✅ NYTT: Send tidspunkt
                nei_takk_markedsforing: neiTakkMarkedsforing,  // ✅ NYTT: Send NEI TAKK status
                nei_takk_markedsforing_tidspunkt: neiTakkMarkedsforingTidspunkt  // ✅ NYTT: Send NEI TAKK tidspunkt
            })
        });
        const data = await response.json();
        skjulLaster();

        if (data.success) {
            // Hent score og tier
            const score = parseInt(data.score);
            const tier = parseInt(data.tier);
            
            // Oppdater resultatskjermen med data
            document.getElementById('result-score').textContent = score;
            document.getElementById('result-tier').textContent = `Tier ${tier}`;

            // Bestem trofé-type basert på tier
            let trophyType = 'black'; // Standard for tier 0 og 1
            
            if (tier === 4) {
                trophyType = 'gold';
            } else if (tier === 3) {
                trophyType = 'silver';
            } else if (tier === 2) {
                trophyType = 'bronze';
            }
            
            // Håndter medalje ved siden av tier
            const tierMedal = document.getElementById('tier-medal');
            if (score >= 2 && score <= 4) {
                // Vis medalje for score 2, 3, 4
                tierMedal.style.display = 'inline';
                
                // Sett riktig medalje basert på tier
                if (tier === 4) {
                    tierMedal.textContent = '🥇'; // Gull
                } else if (tier === 3) {
                    tierMedal.textContent = '🥈'; // Sølv
                } else if (tier === 2) {
                    tierMedal.textContent = '🥉'; // Bronze
                }
            } else {
                // Skjul medalje for score 0 og 1
                tierMedal.style.display = 'none';
            }
            
            // Vis eller skjul trofé basert på score
            const trophyContainer = document.getElementById('result-icon-container');
            if (score >= 2) {
                // Vis trofé for score 2, 3, 4
                trophyContainer.style.display = 'block';
                
                // Oppdater trofé-styling
                const trophyIcon = document.querySelector('.trophy-icon');
                if (trophyIcon) {
                    // Fjern alle eksisterende trophy-klasser
                    trophyIcon.classList.remove('trophy-black', 'trophy-bronze', 'trophy-silver', 'trophy-gold');
                    // Legg til ny klasse
                    trophyIcon.classList.add(`trophy-${trophyType}`);
                }
            } else {
                // Skjul trofé for score 0 og 1
                trophyContainer.style.display = 'none';
            }
            
            // Re-initialiser ALLE Lucide ikoner (inkludert "Ny deltaker"-knappen)
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Bytt til resultatskjermen
            visSkjerm('resultat');
            
            // Start fyrverkeri-animasjon med riktig farge
            startFireworks(trophyType);

            // Send en suksessvarsel som varer litt kortere
            visNotifikasjon(`Registrering vellykket! Din score: ${score}`, 'success');
            
            // Vis countdown-tekst
            const countdownElement = document.getElementById('auto-reset-countdown');
            const secondsElement = document.getElementById('countdown-seconds');
            countdownElement.style.display = 'block';
            
            // Start nedtelling
            let secondsLeft = 60;
            secondsElement.textContent = secondsLeft;
            
            // Oppdater nedtellingen hvert sekund
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            countdownInterval = setInterval(() => {
                secondsLeft--;
                secondsElement.textContent = secondsLeft;
                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
            
            // Start automatisk tilbakestilling etter 1 minutt (60000 ms)
            if (autoResetTimer) {
                clearTimeout(autoResetTimer); // Fjern gammel timer hvis den finnes
            }
            autoResetTimer = setTimeout(() => {
                console.log('Automatisk tilbakestilling etter 1 minutt');
                tilbakestillSkjerm();
            }, 60000); // 60000 ms = 1 minutt
        } else {
            // Hvis det feiler, vis error popup
            visErrorPopup('Kunne ikke registrere deltakelse: ' + (data.error || 'Ukjent feil'));
            // Forbli på venteskjermen, slik at bruker kan prøve igjen eller dobbeltsjekke
            visSkjerm('vente');
        }
    } catch (error) {
        console.error('Feil ved registrering:', error);
        skjulLaster();
        visErrorPopup('En nettverksfeil oppstod ved registrering. Vennligst prøv igjen.');
        visSkjerm('vente');
    }
}

// Tilbakestill skjermen og start en ny deltaker (koblet til Ny Deltaker-knappen)
function tilbakestillSkjerm() {
    // Refresh hele siden for å starte på nytt (hard refresh)
    window.location.href = window.location.href;
}

// Vis status melding (brukes kun for form-validering på registreringsskjermen)
function visStatusMelding(melding, type) {
    const statusElement = document.getElementById('status-melding');
    statusElement.textContent = melding;
    statusElement.className = `status ${type}`;
}

// ============================================
// FALLENDE BANANER ANIMASJON
// ============================================

// Funksjon for å generere fallende emojier
function createFallingBanana() {
    const fallingBananasContainer = document.getElementById('fallingBananasContainer');
    const banana = document.createElement('span');
    
    // Array med gaming/party emojier
    const emojis = ['🎉', '🥳', '🎮', '🎁', '👾', '🕹️'];
    
    // Array med game character bilder
    const gameImages = [
        'Starmie.png',
        'pikachu.png',
        'Mario.png',
        'Luigi.png',
        'Gengar.png',
        'EchoesOfTime_iphoto.png',
        'Ditto.png',
        'Weezing.png'
    ];
    
    // Array med super rare bilder (2% sjanse)
    const rareImages = [
        'Bambu.png',
        'DanielNJ.png',
        'Easter_egg.png',
        'FFK.png',
        'Hoste.png',
        'mario2.png',
        'RA.png',
        'SandSlott.png'
    ];
    
    const randomValue = Math.random();
    let bananaSize;
    
    // 2% sjanse for super rare bilder
    if (randomValue < 0.02) {
        // Lag super rare element - skal ikke spinne!
        const rareImg = document.createElement('img');
        const randomRareImage = rareImages[Math.floor(Math.random() * rareImages.length)];
        rareImg.src = '/static/images/' + randomRareImage + '?v=' + Date.now();
        console.log('🌟 SUPER RARE SPAWN:', randomRareImage); // Debug log
        rareImg.onload = function() {
            const originalWidth = this.naturalWidth;
            const originalHeight = this.naturalHeight;
            console.log(randomRareImage, 'loaded - Original size:', originalWidth, 'x', originalHeight);
            // Rare bilder bruker 30% av original størrelse, men noen er mindre
            let scale = 0.30; // Standard for rare images
            if (randomRareImage === 'Bambu.png') {
                scale = 0.12; // 60% reduksjon: 30% * 0.4 = 12%
            } else if (randomRareImage === 'DanielNJ.png') {
                scale = 0.09; // 70% reduksjon: 30% * 0.3 = 9%
            } else if (randomRareImage === 'RA.png') {
                scale = 0.15; // 50% reduksjon: 30% * 0.5 = 15%
            } else if (randomRareImage === 'Easter_egg.png') {
                scale = 0.216; // 10% reduksjon fra 24%: 24% * 0.9 = 21.6%
            } else if (randomRareImage === 'FFK.png') {
                scale = 0.12; // 20% reduksjon fra 15%: 15% * 0.8 = 12%
            } else if (randomRareImage === 'SandSlott.png') {
                scale = 0.24; // 20% reduksjon: 30% * 0.8 = 24%
            }
            this.style.width = (originalWidth * scale) + 'px';
            this.style.height = (originalHeight * scale) + 'px';
        };
        rareImg.style.objectFit = 'contain';
        banana.appendChild(rareImg);
        banana.classList.add('no-rotate'); // Rare bilder spinner ikke!
        bananaSize = 1;
    // 10% sjanse for HiØF-merke
    } else if (randomValue < 0.12) {
        // Lag HiØF-merke element - 50% mindre (15% av original)
        const logoImg = document.createElement('img');
        logoImg.src = '/static/images/hiof_merke.png?v=' + Date.now();
        logoImg.onload = function() {
            const originalWidth = this.naturalWidth;
            const originalHeight = this.naturalHeight;
            this.style.width = (originalWidth * 0.15) + 'px';
            this.style.height = (originalHeight * 0.15) + 'px';
        };
        logoImg.style.objectFit = 'contain';
        banana.appendChild(logoImg);
        bananaSize = 1;
    } else if (randomValue < 0.4) {
        // Lag game character element - 28% sjanse
        const gameImg = document.createElement('img');
        const randomGameImage = gameImages[Math.floor(Math.random() * gameImages.length)];
        // Cache-busting: Legg til timestamp for å tvinge nettleseren til å laste nytt bilde
        gameImg.src = '/static/images/' + randomGameImage + '?v=' + Date.now();
        console.log('Spawning game character:', randomGameImage); // Debug log
        gameImg.onload = function() {
            const originalWidth = this.naturalWidth;
            const originalHeight = this.naturalHeight;
            console.log(randomGameImage, 'loaded - Original size:', originalWidth, 'x', originalHeight); // Debug log
            let scale = 0.50; // Standard 50%
            
            // Juster størrelse basert på hvilket bilde
            if (randomGameImage === 'Weezing.png') {
                scale = 0.30; // Perfekt størrelse - behold
            } else if (randomGameImage === 'Gengar.png') {
                scale = 0.10; // Test med mindre størrelse - 10%
            } else if (randomGameImage === 'Starmie.png') {
                scale = 0.125; // 50% mindre fra 25% = 12.5%
            } else if (randomGameImage === 'Luigi.png') {
                scale = 0.15; // Reduser med 70%
            } else if (randomGameImage === 'pikachu.png') {
                scale = 0.075; // Reduser med 85%
                // Pikachu spinner normalt igjen (no-rotate fjernet)
            } else if (randomGameImage === 'Mario.png') {
                scale = 0.30; // Reduser med 40%
            } else if (randomGameImage === 'EchoesOfTime_iphoto.png') {
                scale = 0.25; // 50% mindre fra 50% = 25%
            } else if (randomGameImage === 'Ditto.png') {
                scale = 0.10; // Redusert med 50% (fra 20% til 10%)
            } else {
                // Andre bilder
                scale = 0.50;
            }
            
            this.style.width = (originalWidth * scale) + 'px';
            this.style.height = (originalHeight * scale) + 'px';
        };
        gameImg.style.objectFit = 'contain';
        banana.appendChild(gameImg);
        bananaSize = 1;
    } else {
        // Velg en tilfeldig emoji - 60% sjanse
        banana.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        bananaSize = Math.random() * 2.8 + 1.4; // Dobbel størrelse: 1.4rem til 4.2rem
    }
    
    banana.classList.add('falling-banana');

    // Tilfeldig startposisjon - unngå midten (35%-65%) hvor containeren er
    let startLeft;
    if (Math.random() < 0.5) {
        // Venstre side: 0-35%
        startLeft = Math.random() * 35;
    } else {
        // Høyre side: 65-100%
        startLeft = 65 + Math.random() * 35;
    }
    
    // Mer variasjon i hastighet
    const animationDuration = Math.random() * 7 + 6; // 6 til 13 sekunder (tregere)
    const animationDelay = Math.random() * 15; // Forskjøvet start, 0 til 15 sekunder (mer spredt)

    banana.style.setProperty('--start-left', `${startLeft}vw`);
    banana.style.setProperty('--banana-size', `${bananaSize}rem`);
    banana.style.setProperty('--animation-duration', `${animationDuration}s`);
    banana.style.setProperty('--animation-delay', `-${animationDelay}s`); // Negative verdier starter animasjonen "midt i"

    fallingBananasContainer.appendChild(banana);

    // Fjern bananen når den er ferdig med å falle, for å spare minne
    banana.addEventListener('animationend', () => {
        banana.remove();
    });
}

// Initialiser fallende bananer
function initFallingBananas() {
    const numberOfFallingBananas = 21; // Redusert med 30% fra 30
    for (let i = 0; i < numberOfFallingBananas; i++) {
        // Legg til ekstra tilfeldig delay mellom hvert element
        setTimeout(() => {
            createFallingBanana();
        }, Math.random() * 2000); // Spread ut spawningen over 2 sekunder
    }
    
    // Hvis du vil at bananene skal fortsette å falle etter de første er generert (konstant strøm)
    // Uncomment linjen under for kontinuerlig generering:
    // setInterval(createFallingBanana, 500); // Legger til en ny banan hvert 0.5 sekund
}

// Spawn nye emojier når vi går tilbake til registrering
function spawnNewEmojiBurst() {
    const numberOfNewBananas = 15; // Spawn 15 nye emojier
    for (let i = 0; i < numberOfNewBananas; i++) {
        setTimeout(() => {
            createFallingBanana();
        }, Math.random() * 1500); // Spread over 1.5 sekunder
    }
}

// Vis auto-reset popup
function visAutoResetPopup() {
    const popup = document.getElementById('auto-reset-popup');
    const popupCountdown = document.getElementById('popup-countdown');
    
    // Vis popup
    popup.classList.remove('hidden');
    
    // Start nedtelling for popup (14 sekunder)
    let popupSecondsLeft = 14;
    popupCountdown.textContent = popupSecondsLeft;
    
    if (popupCountdownInterval) {
        clearInterval(popupCountdownInterval);
    }
    
    popupCountdownInterval = setInterval(() => {
        popupSecondsLeft--;
        popupCountdown.textContent = popupSecondsLeft;
        if (popupSecondsLeft <= 0) {
            clearInterval(popupCountdownInterval);
            lukkPopup();
        }
    }, 1000);
}

// Lukk popup
function lukkPopup() {
    const popup = document.getElementById('auto-reset-popup');
    popup.classList.add('hidden');
    
    // Stopp popup countdown
    if (popupCountdownInterval) {
        clearInterval(popupCountdownInterval);
        popupCountdownInterval = null;
    }
}

// ============================================
// FYRVERKERI ANIMASJON
// ============================================

let fireworksInterval = null;

// Start fyrverkeri-animasjon - starter fra trophy, deretter tilfeldig på skjermen
function startFireworks(trophyType = 'bronze') {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    
    // Tøm eksisterende fyrverkeri
    container.innerHTML = '';
    
    // Lag to store eksplosjoner fra trophy-posisjon først
    createTrophyFirework(0, trophyType); // Første umiddelbart
    setTimeout(() => {
        createTrophyFirework(1, trophyType); // Andre etter 300ms
    }, 300);
    
    // Deretter lag 6 tilfeldige eksplosjoner rundt på skjermen over 2 sekunder (mer fyrverkeri)
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 500);
    
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 800);
    
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 1100);
    
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 1400);
    
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 1700);
    
    setTimeout(() => {
        createRandomFirework(trophyType);
    }, 2000);
}

// Lag fyrverkeri fra trophy-posisjon
function createTrophyFirework(index, trophyType = 'bronze') {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    
    // Trophy er i senter (50%, ~20-25% fra toppen)
    const xPos = 50; // Senter
    const yPos = 22; // Ca. ved trophy
    
    // Antall partikler per fyrverkeri - mer for trophy-eksplosjoner
    const particleCount = 30 + Math.floor(Math.random() * 10); // 30-40 partikler
    
    // Velg farger basert på trofé-type
    let colors;
    if (trophyType === 'gold') {
        colors = ['gold-color1', 'gold-color2', 'gold-color3'];
    } else if (trophyType === 'silver') {
        colors = ['silver-color1', 'silver-color2', 'silver-color3'];
    } else if (trophyType === 'bronze') {
        colors = ['bronze-color1', 'bronze-color2', 'bronze-color3'];
    } else if (trophyType === 'black') {
        colors = ['black-color1', 'black-color2', 'black-color3'];
    } else {
        colors = ['bronze-color1', 'bronze-color2', 'bronze-color3'];
    }
    
    const mainColor = colors[index % colors.length];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework ${mainColor}`;
        
        // Jevnt fordelt i alle retninger (360 grader)
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 80 + Math.random() * 120; // 80-200px bevegelse - større eksplosjon
        
        // Beregn slutt-posisjon
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        // Sett CSS variabler
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Posisjon - fra trophy
        particle.style.left = `${xPos}%`;
        particle.style.top = `${yPos}%`;
        
        // Litt tilfeldig forsinkelse for mer naturlig effekt
        particle.style.animationDelay = `${Math.random() * 0.05}s`;
        
        container.appendChild(particle);
        
        // Fjern partikkel etter animasjon
        setTimeout(() => {
            particle.remove();
        }, 1600);
    }
}

// Lag tilfeldig fyrverkeri på skjermen
function createRandomFirework(trophyType = 'bronze') {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    
    // Tilfeldig posisjon på skjermen (unngå helt i kantene)
    const xPos = 20 + Math.random() * 60; // 20-80%
    const yPos = 20 + Math.random() * 60; // 20-80%
    
    // Mer partikler for bedre effekt (økt fra 15-25 til 20-35)
    const particleCount = 20 + Math.floor(Math.random() * 15); // 20-35 partikler
    
    // Velg farger basert på trofé-type
    let colors;
    if (trophyType === 'gold') {
        colors = ['gold-color1', 'gold-color2', 'gold-color3'];
    } else if (trophyType === 'silver') {
        colors = ['silver-color1', 'silver-color2', 'silver-color3'];
    } else if (trophyType === 'bronze') {
        colors = ['bronze-color1', 'bronze-color2', 'bronze-color3'];
    } else if (trophyType === 'black') {
        colors = ['black-color1', 'black-color2', 'black-color3'];
    } else {
        colors = ['bronze-color1', 'bronze-color2', 'bronze-color3'];
    }
    
    const mainColor = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework ${mainColor}`;
        
        // Jevnt fordelt i alle retninger (360 grader)
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 60 + Math.random() * 90; // 60-150px bevegelse - større eksplosjon
        
        // Beregn slutt-posisjon
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        // Sett CSS variabler
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Posisjon - tilfeldig på skjermen
        particle.style.left = `${xPos}%`;
        particle.style.top = `${yPos}%`;
        
        // Litt tilfeldig forsinkelse for mer naturlig effekt
        particle.style.animationDelay = `${Math.random() * 0.05}s`;
        
        container.appendChild(particle);
        
        // Fjern partikkel etter animasjon
        setTimeout(() => {
            particle.remove();
        }, 1600);
    }
}
