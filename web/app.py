from flask import Flask, render_template, request, jsonify
import subprocess
import json
import os
import re
from datetime import datetime

app = Flask(__name__)

# HiØF Fargepalett
HIOF_COLORS = {
    'sort': '#23201F',
    'korall': '#D78669',
    'sjogronn': '#6FC2B4',
    'lys_varmgra': '#ECEAE5',
    'lavendel': '#A398A3',
    'aquabla': '#347E84',
    'varmgra': '#C8C2BE',
    'hvit': '#FFFFFF'
}

# Filstier
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCORE_FILE = r"C:\Users\ape00\AppData\LocalLow\DefaultCompany\EchoesOfTime\scoreEntries.txt"
DELTAKERE_FILE = os.path.join(os.path.dirname(SCRIPT_DIR), "deltagelse.txt")  # ✅ ENDRET: Bruker deltagelse.txt nå
GAME_EXE = r"C:\Users\ape00\Downloads\spill og launcher spillexpo med reklame\spill og launcher spillexpo\echoesOfTime_kjellmagne_build\EchoesOfTime.exe"

# ✅ VALIDERINGSFUNKSJONER
def valider_epost(epost):
    """
    Valider e-postadresse med TLD-sjekk
    
    Returns:
        tuple: (bool, str) - (is_valid, error_message)
    """
    if not epost:
        return False, "E-postadresse kan ikke være tom"
    
    # Basis regex-sjekk
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', epost):
        return False, "Ugyldig e-postformat. Må inneholde @ og domene med punktum."
    
    # ✅ KRITISK: Valider at TLD har minst 2 bokstaver
    parts = epost.split('.')
    tld = parts[-1]  # Siste del etter punktum
    
    # Sjekk at TLD har minst 2 tegn
    if len(tld) < 2:
        return False, "E-postadressen må ha minst 2 bokstaver etter siste punktum"
    
    # Sjekk at TLD kun inneholder bokstaver (a-z, A-Z)
    if not tld.isalpha():
        return False, "E-postadressen må ha kun bokstaver etter siste punktum (ingen tall)"
    
    return True, ""

def valider_telefon(telefon):
    """
    Valider telefonnummer
    
    Returns:
        tuple: (bool, str) - (is_valid, error_message)
    """
    if not telefon:
        return False, "Telefonnummer kan ikke være tomt"
    
    # Sjekk at det kun er tall
    if not telefon.isdigit():
        return False, "Telefonnummer må kun inneholde tall"
    
    # Sjekk lengde
    if len(telefon) < 8:
        return False, "Telefonnummer må være minst 8 siffer"
    
    if len(telefon) > 15:
        return False, f"Telefonnummer kan ikke være mer enn 15 siffer (du skrev {len(telefon)} siffer)"
    
    return True, ""

# Initialiser filer
def init_files():
    """Initialiser nødvendige filer"""
    if not os.path.exists(SCORE_FILE):
        os.makedirs(os.path.dirname(SCORE_FILE), exist_ok=True)
        with open(SCORE_FILE, 'w', encoding='utf-8') as f:
            json.dump({"entryScore": 0}, f)
    
    if not os.path.exists(DELTAKERE_FILE):
        with open(DELTAKERE_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)

init_files()

@app.route('/')
def index():
    """Hovedside - registreringsskjerm"""
    return render_template('index.html', colors=HIOF_COLORS)

@app.route('/api/sjekk_registrert', methods=['POST'])
def sjekk_registrert():
    """Sjekk om e-post eller telefon allerede er registrert"""
    data = request.json
    epost = data.get('epost', '').strip()
    telefon = data.get('telefon', '').strip()
    navn = data.get('navn', '').strip()
    
    # ✅ TEST-MODUS: Hvis navn er "test", hopp over alle valideringer
    if navn.lower() == "test":
        return jsonify({"registrert": False})
    
    # ✅ VALIDER INPUT FØR SJEKK
    if epost:
        epost_valid, epost_error = valider_epost(epost)
        if not epost_valid:
            return jsonify({"error": epost_error}), 400
    
    if telefon:
        telefon_valid, telefon_error = valider_telefon(telefon)
        if not telefon_valid:
            return jsonify({"error": telefon_error}), 400
    
    try:
        with open(DELTAKERE_FILE, 'r', encoding='utf-8') as f:
            deltakere = json.load(f)
            
        for deltaker in deltakere:
            if deltaker.get("epost") == epost:
                return jsonify({"registrert": True, "melding": "E-postadressen er allerede registrert!"})
            if deltaker.get("telefon") == telefon:
                return jsonify({"registrert": True, "melding": "Telefonnummeret er allerede registrert!"})
        
        return jsonify({"registrert": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/start_spill', methods=['POST'])
def start_spill():
    """Nullstill score og start spillet"""
    try:
        # Nullstill score før spillet starter
        with open(SCORE_FILE, 'w', encoding='utf-8') as f:
            json.dump({"entryScore": 0}, f)
        
        # Start spillet
        subprocess.Popen([GAME_EXE])
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/hent_score', methods=['GET'])
def hent_score():
    """Hent score fra Echoes of Time"""
    try:
        with open(SCORE_FILE, 'r', encoding='utf-8') as f:
            score_data = json.load(f)
            score = score_data.get("entryScore", 0)
        
        return jsonify({"score": score})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/registrer', methods=['POST'])
def registrer():
    """Registrer deltakelsen"""
    data = request.json
    
    try:
        # ✅ VALIDER INPUT FØR LAGRING
        navn = data.get("navn", "").strip()
        telefon = data.get("telefon", "").strip()
        epost = data.get("epost", "").strip()
        
        # ✅ TEST-MODUS: Hvis navn er "test", hopp over alt og returner success
        if navn.lower() == "test":
            print(f"\n{'='*60}")
            print(f"TEST-MODUS AKTIVERT - INGEN DATA LAGRET")
            print(f"{'='*60}")
            print(f"Navn: {navn}")
            print(f"E-post: {epost}")
            print(f"Telefon: {telefon}")
            print(f"TEST-KJØRING - Data blir IKKE lagret i deltagelse.txt")
            print(f"{'='*60}\n")
            
            # Returner success uten å lagre noe
            return jsonify({
                "success": True,
                "tier": 0,
                "score": 0
            })
        
        # Valider navn
        if not navn:
            return jsonify({"error": "Navn kan ikke være tomt"}), 400
        
        # ✅ Valider telefon
        telefon_valid, telefon_error = valider_telefon(telefon)
        if not telefon_valid:
            return jsonify({"error": telefon_error}), 400
        
        # ✅ Valider e-post MED TLD-SJEKK
        epost_valid, epost_error = valider_epost(epost)
        if not epost_valid:
            return jsonify({"error": epost_error}), 400
        
        # Les score fra score.txt
        with open(SCORE_FILE, 'r', encoding='utf-8') as f:
            score_data = json.load(f)
            score = score_data.get("entryScore", 0)
        
        # Les eksisterende deltakere
        with open(DELTAKERE_FILE, 'r', encoding='utf-8') as f:
            deltakere = json.load(f)
        
        # Lag tidspunkter
        registrering_tidspunkt = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        samtykke_tidspunkt = data.get("samtykke_tidspunkt_lokal")
        aldersbekreftelse_tidspunkt = data.get("aldersbekreftelse_tidspunkt")  # ✅ NYTT: Motta aldersbekreftelse-tidspunkt
        
        # Konverter samtykke-tidspunkt fra ISO format til ønsket format
        if samtykke_tidspunkt:
            try:
                # Parse ISO format (2025-11-05T14:30:45.123Z)
                from datetime import datetime as dt_parser
                dt_obj = dt_parser.fromisoformat(samtykke_tidspunkt.replace('Z', '+00:00'))
                samtykke_tidspunkt = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
            except:
                # Hvis parsing feiler, bruk registreringstidspunkt
                samtykke_tidspunkt = registrering_tidspunkt
        else:
            samtykke_tidspunkt = registrering_tidspunkt
        
        # ✅ NYTT: Konverter aldersbekreftelse-tidspunkt fra ISO format
        if aldersbekreftelse_tidspunkt:
            try:
                from datetime import datetime as dt_parser
                dt_obj = dt_parser.fromisoformat(aldersbekreftelse_tidspunkt.replace('Z', '+00:00'))
                aldersbekreftelse_tidspunkt = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
            except:
                # Hvis parsing feiler, bruk registreringstidspunkt
                aldersbekreftelse_tidspunkt = registrering_tidspunkt
        else:
            aldersbekreftelse_tidspunkt = registrering_tidspunkt
        
        # ✅ NYTT: Hent markedsføringssamtykke fra frontend
        markedsforing_samtykke = data.get("markedsforing_samtykke", False)
        markedsforing_samtykke_tidspunkt = data.get("markedsforing_samtykke_tidspunkt")
        
        # ✅ NYTT: Hent NEI TAKK markedsføring fra frontend
        nei_takk_markedsforing = data.get("nei_takk_markedsforing", False)
        nei_takk_markedsforing_tidspunkt = data.get("nei_takk_markedsforing_tidspunkt")
        
        # ✅ KRITISK: Bestem antall lodd basert på markedsføringssamtykke ELLER nei takk
        antall_lodd = 3 if (markedsforing_samtykke or nei_takk_markedsforing) else 1
        
        # Konverter markedsføringssamtykke-tidspunkt
        if markedsforing_samtykke and markedsforing_samtykke_tidspunkt:
            try:
                from datetime import datetime as dt_parser
                dt_obj = dt_parser.fromisoformat(markedsforing_samtykke_tidspunkt.replace('Z', '+00:00'))
                markedsforing_samtykke_tidspunkt = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
            except:
                # Hvis parsing feiler, bruk samtykke_tidspunkt
                markedsforing_samtykke_tidspunkt = samtykke_tidspunkt
        else:
            markedsforing_samtykke_tidspunkt = None
        
        # ✅ NYTT: Konverter NEI TAKK markedsføring-tidspunkt
        if nei_takk_markedsforing and nei_takk_markedsforing_tidspunkt:
            try:
                from datetime import datetime as dt_parser
                dt_obj = dt_parser.fromisoformat(nei_takk_markedsforing_tidspunkt.replace('Z', '+00:00'))
                nei_takk_markedsforing_tidspunkt = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
            except:
                # Hvis parsing feiler, bruk samtykke_tidspunkt
                nei_takk_markedsforing_tidspunkt = samtykke_tidspunkt
        else:
            nei_takk_markedsforing_tidspunkt = None
        
        # Lag ny deltaker-objekt med ENKEL struktur
        ny_deltaker = {
            "tidspunkt": registrering_tidspunkt,
            "navn": navn,
            "telefon": telefon,
            "epost": epost,
            "score": score,
            "antall_lodd": antall_lodd,  # ✅ NYTT: Antall lodd (1 eller 3)
            "samtykke_gitt": True,
            "samtykke_tidspunkt": samtykke_tidspunkt,
            "samtykke_metode": "gdpr_popup_web",
            "gdpr_versjon": "1.0",
            "aldersbekreftelse_tidspunkt": aldersbekreftelse_tidspunkt,
            "markedsforing_samtykke": markedsforing_samtykke,  # ✅ ENDRET: Bruker verdi fra frontend
            "markedsforing_samtykke_tidspunkt": markedsforing_samtykke_tidspunkt,  # ✅ ENDRET: Bruker tidspunkt fra frontend
            "nei_takk_markedsforing": nei_takk_markedsforing,  # ✅ NYTT: NEI TAKK status
            "nei_takk_markedsforing_tidspunkt": nei_takk_markedsforing_tidspunkt  # ✅ NYTT: NEI TAKK tidspunkt
        }
        
        # Legg til ny deltaker
        deltakere.append(ny_deltaker)
        
        # Lagre tilbake til filen
        with open(DELTAKERE_FILE, 'w', encoding='utf-8') as f:
            json.dump(deltakere, f, ensure_ascii=False, indent=2)
        
        # Logg til konsoll for debugging
        print(f"\n{'='*60}")
        print(f"NY DELTAKER REGISTRERT:")
        print(f"{'='*60}")
        print(f"Navn: {data.get('navn')}")
        print(f"E-post: {data.get('epost')}")
        print(f"Score: {score}")
        print(f"Antall lodd: {antall_lodd}")  # ✅ NYTT: Vis antall lodd
        print(f"Registreringstidspunkt: {registrering_tidspunkt}")
        print(f"Samtykke-tidspunkt: {samtykke_tidspunkt}")
        print(f"Aldersbekreftelse-tidspunkt: {aldersbekreftelse_tidspunkt}")
        print(f"Markedsføringssamtykke: {'Ja' if markedsforing_samtykke else 'Nei'}")  # ✅ ENDRET: Viser faktisk verdi
        if markedsforing_samtykke:
            print(f"Markedsføringssamtykke-tidspunkt: {markedsforing_samtykke_tidspunkt}")
        print(f"{'='*60}\n")
        
        # Nullstill score.txt til 0
        with open(SCORE_FILE, 'w', encoding='utf-8') as f:
            json.dump({"entryScore": 0}, f)
        
        # Send bare tier nummer (uten medalje - frontend håndterer dette)
        return jsonify({
            "success": True,
            "tier": score,  # Send bare nummeret
            "score": score
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
