// Globale variabler
let currentNavn = '';
let currentTelefon = '';
let currentEpost = '';

// Når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    // Legg til event listeners
    document.getElementById('start-knapp').addEventListener('click', startSpill);
    document.getElementById('registrer-knapp').addEventListener('click', registrerDeg);
});

// Valider input
function validerInput() {
    const navn = document.getElementById('navn').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const epost = document.getElementById('epost').value.trim();
    
    if (!navn) {
        visStatusMelding('Vennligst fyll inn navn', 'error');
        return false;
    }
    
    if (!telefon) {
        visStatusMelding('Vennligst fyll inn telefonnummer', 'error');
        return false;
    }
    
    // Sjekk at telefonnummer er gyldig (kun tall, minst 8 siffer)
    if (!/^\d+$/.test(telefon) || telefon.length < 8) {
        visStatusMelding('Telefonnummer må være minst 8 siffer og kun inneholde tall', 'error');
        return false;
    }
    
    if (!epost || !epost.includes('@') || !epost.includes('.')) {
        visStatusMelding('Vennligst fyll inn en gyldig e-postadresse', 'error');
        return false;
    }
    
    return true;
}

// Sjekk om allerede registrert
async function sjekkAlleredeRegistrert(epost, telefon) {
    try {
        const response = await fetch('/api/sjekk_registrert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ epost, telefon })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Feil ved sjekk:', error);
        return { error: 'Kunne ikke sjekke registrering' };
    }
}

// Start spillet
async function startSpill() {
    if (!validerInput()) {
        return;
    }
    
    // Lagre gjeldende brukerdata
    currentNavn = document.getElementById('navn').value.trim();
    currentTelefon = document.getElementById('telefon').value.trim();
    currentEpost = document.getElementById('epost').value.trim();
    
    // Sjekk om allerede registrert
    const sjekkResultat = await sjekkAlleredeRegistrert(currentEpost, currentTelefon);
    
    if (sjekkResultat.registrert) {
        alert(sjekkResultat.melding);
        return;
    }
    
    try {
        // Start spillet via API
        const response = await fetch('/api/start_spill', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Bytt til venteskjerm
            byttTilVenteskjerm();
        } else {
            visStatusMelding('Kunne ikke starte spillet: ' + (data.error || 'Ukjent feil'), 'error');
        }
    } catch (error) {
        console.error('Feil ved start av spill:', error);
        visStatusMelding('En feil oppstod ved start av spillet', 'error');
    }
}

// Bytt til venteskjerm
function byttTilVenteskjerm() {
    // Skjul registreringsskjerm
    document.getElementById('registrering-skjerm').style.display = 'none';
    
    // Vis venteskjerm
    document.getElementById('vente-skjerm').style.display = 'block';
    
    // Fyll inn data i venteskjerm
    document.getElementById('vente-navn').value = currentNavn;
    document.getElementById('vente-telefon').value = currentTelefon;
    document.getElementById('vente-epost').value = currentEpost;
}

// Toggle redigering av felt
function toggleEdit(feltNavn) {
    const input = document.getElementById(`vente-${feltNavn}`);
    const knapp = event.target;
    const statusDiv = document.getElementById('rediger-status');
    
    if (input.readOnly) {
        // Aktiver redigering
        input.readOnly = false;
        input.style.backgroundColor = 'var(--hiof-hvit)';
        input.style.borderColor = 'var(--hiof-aquabla)';
        knapp.textContent = 'Lagre';
        knapp.classList.add('lagre');
        statusDiv.textContent = `Du kan nå redigere ${feltNavn}`;
        statusDiv.className = 'rediger-status';
    } else {
        // Lagre endringer
        const nyVerdi = input.value.trim();
        
        // Valider basert på felt
        if (feltNavn === 'navn') {
            if (!nyVerdi) {
                statusDiv.textContent = 'Vennligst fyll inn navn';
                statusDiv.className = 'rediger-status error';
                return;
            }
        } else if (feltNavn === 'telefon') {
            if (!/^\d+$/.test(nyVerdi) || nyVerdi.length < 8) {
                statusDiv.textContent = 'Telefonnummer må være minst 8 siffer og kun inneholde tall';
                statusDiv.className = 'rediger-status error';
                return;
            }
        } else if (feltNavn === 'epost') {
            if (!nyVerdi || !nyVerdi.includes('@') || !nyVerdi.includes('.')) {
                statusDiv.textContent = 'Vennligst fyll inn en gyldig e-postadresse';
                statusDiv.className = 'rediger-status error';
                return;
            }
        }
        
        // Sjekk duplikater hvis verdien er endret
        const gammelVerdi = feltNavn === 'navn' ? currentNavn : 
                          feltNavn === 'telefon' ? currentTelefon : currentEpost;
        
        if (nyVerdi !== gammelVerdi) {
            // Oppdater verdi
            if (feltNavn === 'navn') {
                currentNavn = nyVerdi;
            } else if (feltNavn === 'telefon') {
                currentTelefon = nyVerdi;
            } else {
                currentEpost = nyVerdi;
            }
        }
        
        // Deaktiver redigering
        input.readOnly = true;
        input.style.backgroundColor = 'var(--hiof-lys-varmgra)';
        input.style.borderColor = 'var(--hiof-varmgra)';
        knapp.textContent = 'Rediger';
        knapp.classList.remove('lagre');
        statusDiv.textContent = `${feltNavn.charAt(0).toUpperCase() + feltNavn.slice(1)} oppdatert!`;
        statusDiv.className = 'rediger-status success';
    }
}

// Registrer deltakelsen
async function registrerDeg() {
    try {
        const response = await fetch('/api/registrer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                navn: currentNavn,
                telefon: currentTelefon,
                epost: currentEpost
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`Takk for deltakelsen, ${currentNavn}!\n\n` +
                  `Din tier: ${data.tier}\n\n` +
                  `Du er nå med i trekningen om en Nintendo Switch 2!\n` +
                  `Vi kontakter vinneren på e-post eller telefon.`);
            
            // Tilbakestill til registreringsskjermen
            tilbakestillSkjerm();
        } else {
            alert('Kunne ikke registrere deltakelse: ' + (data.error || 'Ukjent feil'));
        }
    } catch (error) {
        console.error('Feil ved registrering:', error);
        alert('En feil oppstod ved registrering');
    }
}

// Tilbakestill skjermen
function tilbakestillSkjerm() {
    // Nullstill variabler
    currentNavn = '';
    currentTelefon = '';
    currentEpost = '';
    
    // Nullstill input-felt
    document.getElementById('navn').value = '';
    document.getElementById('telefon').value = '';
    document.getElementById('epost').value = '';
    
    // Skjul venteskjerm
    document.getElementById('vente-skjerm').style.display = 'none';
    
    // Vis registreringsskjerm
    document.getElementById('registrering-skjerm').style.display = 'block';
    
    // Nullstill status
    visStatusMelding('', '');
}

// Vis status melding
function visStatusMelding(melding, type) {
    const statusDiv = document.getElementById('status-melding');
    statusDiv.textContent = melding;
    statusDiv.className = 'status-melding ' + type;
}
