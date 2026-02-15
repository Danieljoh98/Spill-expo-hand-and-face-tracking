#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GDPR - Automatisk sletting av gamle deltakere
==============================================
Dette scriptet sletter deltakere som er eldre enn 30 dager
i henhold til GDPR Artikkel 5.1.e (Lagringsminimering)

Bruk:
    python slett_gamle_deltakere.py

Eller sett opp Windows Task Scheduler til å kjøre dette automatisk hver uke.
"""

import json
import os
from datetime import datetime, timedelta

# Filstier
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DELTAKERE_FILE = os.path.join(SCRIPT_DIR, "deltagelse.txt")  # ✅ ENDRET: Bruker deltagelse.txt nå
LOG_FILE = os.path.join(SCRIPT_DIR, "sletting_log.txt")

def slett_gamle_deltakere():
    """
    Slett deltakere som er eldre enn 30 dager
    Logger alle slettinger for sporbarhet
    """
    
    # Sjekk om deltakere-filen eksisterer
    if not os.path.exists(DELTAKERE_FILE):
        print(f"[FEIL] Finner ikke {DELTAKERE_FILE}")
        return
    
    try:
        # Les eksisterende deltakere
        with open(DELTAKERE_FILE, 'r', encoding='utf-8') as f:
            deltakere = json.load(f)
        
        print(f"[INFO] Totalt antall deltakere før sletting: {len(deltakere)}")
        
        # Beregn grense (30 dager siden)
        grense = datetime.now() - timedelta(days=30)
        print(f"[INFO] Sletter deltakere eldre enn: {grense.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Filtrer bort gamle deltakere
        nye_deltakere = []
        slettede_deltakere = []
        
        for deltaker in deltakere:
            try:
                tidspunkt = datetime.strptime(deltaker['tidspunkt'], "%Y-%m-%d %H:%M:%S")
                
                if tidspunkt > grense:
                    # Behold deltaker
                    nye_deltakere.append(deltaker)
                else:
                    # Slett deltaker
                    slettede_deltakere.append({
                        "navn": deltaker.get("navn", "Ukjent"),
                        "epost": deltaker.get("epost", "Ukjent"),
                        "tidspunkt": deltaker.get("tidspunkt", "Ukjent")
                    })
            except Exception as e:
                print(f"[ADVARSEL] Feil ved parsing av deltaker: {e}")
                # Behold deltaker hvis vi ikke kan parse tidspunkt
                nye_deltakere.append(deltaker)
        
        # Skriv tilbake til filen
        with open(DELTAKERE_FILE, 'w', encoding='utf-8') as f:
            json.dump(nye_deltakere, f, ensure_ascii=False, indent=2)
        
        # Logg slettingen
        logg_sletting(slettede_deltakere)
        
        # Vis resultat
        antall_slettet = len(slettede_deltakere)
        antall_beholdt = len(nye_deltakere)
        
        print(f"\n[FERDIG]")
        print(f"   Slettet: {antall_slettet} deltakere")
        print(f"   Beholdt: {antall_beholdt} deltakere")
        
        if antall_slettet > 0:
            print(f"\n[LOG] Sletting loggfort i: {LOG_FILE}")
        
    except Exception as e:
        print(f"[FEIL] Feil ved sletting: {e}")

def logg_sletting(slettede_deltakere):
    """
    Logg slettede deltakere for GDPR-sporbarhet
    """
    if len(slettede_deltakere) == 0:
        return
    
    try:
        logg_tid = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f"\n{'='*60}\n")
            f.write(f"SLETTING UTFØRT: {logg_tid}\n")
            f.write(f"{'='*60}\n")
            f.write(f"Antall slettet: {len(slettede_deltakere)}\n\n")
            
            for deltaker in slettede_deltakere:
                f.write(f"  - Navn: {deltaker['navn']}\n")
                f.write(f"    E-post: {deltaker['epost']}\n")
                f.write(f"    Registrert: {deltaker['tidspunkt']}\n")
                f.write(f"    Grunn: Eldre enn 30 dager (GDPR Art. 5.1.e)\n\n")
        
    except Exception as e:
        print(f"[ADVARSEL] Kunne ikke logge sletting: {e}")

if __name__ == "__main__":
    print("GDPR - Automatisk sletting av gamle deltakere\n")
    slett_gamle_deltakere()
    print("\nFerdig!")
