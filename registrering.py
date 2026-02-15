import tkinter as tk
from tkinter import messagebox, ttk
import subprocess
import json
import os
from datetime import datetime
from PIL import Image, ImageTk

# HiØF Fargepalett (fra designguiden)
HIOF_SORT = "#23201F"
HIOF_KORALL = "#D78669"
HIOF_SJOGRONN = "#6FC2B4"
HIOF_LYS_VARMGRA = "#ECEAE5"
HIOF_LAVENDEL = "#A398A3"
HIOF_AQUABLA = "#347E84"
HIOF_VARMGRA = "#C8C2BE"
HIOF_HVIT = "#FFFFFF"

class KonkurranseApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Nintendo Switch 2 Konkurranse - Høgskolen i Østfold")
        
        # Fullskjerm 1080p
        self.root.geometry("1920x1080")
        self.root.state('zoomed')  # Maksimer vinduet
        self.root.configure(bg=HIOF_LYS_VARMGRA)
        
        # Få mappen hvor dette scriptet ligger
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Filstier (relative til script-mappen)
        self.score_file = r"C:\Users\ape00\AppData\LocalLow\DefaultCompany\EchoesOfTime\scoreEntries.txt"
        self.deltakere_file = os.path.join(self.script_dir, "deltagelse.txt")  # ✅ ENDRET: Bruker deltagelse.txt nå
        self.snake_exe = r"C:\Users\ape00\Music\echoesOfTime_kjellmagne_build\EchoesOfTime.exe"
        self.logo_file = os.path.join(self.script_dir, "hiof_logo.png")
        
        # Initialiser filer hvis de ikke eksisterer
        self.init_files()
        
        # Variabler
        self.current_navn = ""
        self.current_telefon = ""
        self.current_epost = ""
        
        # Frames
        self.registrering_frame = None
        self.vente_frame = None
        
        # Last logo
        self.logo_image = None
        self.load_logo()
        
        self.setup_registrering_ui()
    
    def load_logo(self):
        """Last HiØF logo og gjør den hvit"""
        try:
            if os.path.exists(self.logo_file):
                image = Image.open(self.logo_file)
                # Konverter til RGBA for å kunne endre farger
                image = image.convert("RGBA")
                
                # Gjør logoen hvit (inverter sort til hvit)
                pixels = image.load()
                for i in range(image.size[0]):
                    for j in range(image.size[1]):
                        r, g, b, a = pixels[i, j]
                        # Hvis pikselen er mørk (sort), gjør den hvit
                        if r < 128 and g < 128 and b < 128:
                            pixels[i, j] = (255, 255, 255, a)
                
                # Skaler til større størrelse (120x120)
                image = image.resize((120, 120), Image.Resampling.LANCZOS)
                self.logo_image = ImageTk.PhotoImage(image)
        except Exception as e:
            print(f"Kunne ikke laste logo: {e}")
            self.logo_image = None
    
    def init_files(self):
        """Initialiser nødvendige filer"""
        if not os.path.exists(self.score_file):
            with open(self.score_file, 'w', encoding='utf-8') as f:
                json.dump({"entryScore": 0}, f)
        
        if not os.path.exists(self.deltakere_file):
            with open(self.deltakere_file, 'w', encoding='utf-8') as f:
                json.dump([], f)
    
    def sjekk_allerede_registrert(self, epost, telefon):
        """Sjekk om e-post eller telefon allerede er registrert"""
        if not os.path.exists(self.deltakere_file):
            return False, None
        
        try:
            with open(self.deltakere_file, 'r', encoding='utf-8') as f:
                deltakere = json.load(f)
                
                for deltaker in deltakere:
                    if deltaker.get("epost") == epost:
                        return True, "E-postadressen er allerede registrert!"
                    if deltaker.get("telefon") == telefon:
                        return True, "Telefonnummeret er allerede registrert!"
                
                return False, None
        except Exception as e:
            print(f"Feil ved sjekk av registrering: {e}")
            return False, None
    
    def setup_registrering_ui(self):
        """Sett opp registreringsskjermen med HiØF design"""
        # Fjern eksisterende frame hvis det finnes
        if self.registrering_frame:
            self.registrering_frame.destroy()
        if self.vente_frame:
            self.vente_frame.destroy()
        
        self.registrering_frame = tk.Frame(self.root, bg=HIOF_LYS_VARMGRA)
        self.registrering_frame.pack(fill=tk.BOTH, expand=True)
        
        # Tittel frame med HiØF farger - STØRRE for fullskjerm
        title_frame = tk.Frame(self.registrering_frame, bg=HIOF_AQUABLA, height=140)
        title_frame.pack(fill=tk.X, pady=(0, 25))
        title_frame.pack_propagate(False)
        
        # Container for logo - tekst - logo
        content_frame = tk.Frame(title_frame, bg=HIOF_AQUABLA)
        content_frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)
        
        # Logo til venstre
        if self.logo_image:
            logo_left = tk.Label(content_frame, image=self.logo_image, bg=HIOF_AQUABLA)
            logo_left.pack(side=tk.LEFT, padx=(0, 30))
        
        # Tekst i midten - INGEN EMOJIER
        title_label = tk.Label(
            content_frame,
            text="VINN EN NINTENDO SWITCH 2",
            font=("Arial", 36, "bold"),
            bg=HIOF_AQUABLA,
            fg=HIOF_HVIT
        )
        title_label.pack(side=tk.LEFT)
        
        # Logo til høyre
        if self.logo_image:
            logo_right = tk.Label(content_frame, image=self.logo_image, bg=HIOF_AQUABLA)
            logo_right.pack(side=tk.LEFT, padx=(30, 0))
        
        # Info tekst - STØRRE FONT
        info_frame = tk.Frame(self.registrering_frame, bg=HIOF_LYS_VARMGRA)
        info_frame.pack(pady=20, padx=60)
        
        info_text = """Delta i konkurransen ved å prøve spill laget av studenter
på Høgskolen i Østfold og få sjansen til å vinne en Nintendo Switch 2!

Fyll ut informasjonen din nedenfor, spill spillet,
og registrer resultatet ditt for å delta i trekningen."""
        
        info_label = tk.Label(
            info_frame,
            text=info_text,
            font=("Arial", 14),
            bg=HIOF_LYS_VARMGRA,
            fg=HIOF_SORT,
            justify=tk.CENTER
        )
        info_label.pack()
        
        # Input felt frame med HiØF styling - STØRRE
        input_container = tk.Frame(self.registrering_frame, bg=HIOF_HVIT, relief=tk.FLAT, borderwidth=0)
        input_container.pack(pady=25, padx=250, fill=tk.X)
        
        # Indre padding
        input_frame = tk.Frame(input_container, bg=HIOF_HVIT)
        input_frame.pack(pady=30, padx=40)
        
        # Navn - STØRRE
        tk.Label(
            input_frame, 
            text="Navn:", 
            font=("Arial", 16, "bold"), 
            bg=HIOF_HVIT,
            fg=HIOF_SORT
        ).grid(row=0, column=0, sticky="w", pady=15, padx=15)
        
        self.navn_entry = tk.Entry(
            input_frame, 
            font=("Arial", 14), 
            width=45,
            relief=tk.SOLID,
            borderwidth=2,
            highlightthickness=2,
            highlightcolor=HIOF_AQUABLA,
            highlightbackground=HIOF_VARMGRA
        )
        self.navn_entry.grid(row=0, column=1, pady=15, padx=15)
        
        # Telefonnummer - STØRRE
        tk.Label(
            input_frame, 
            text="Telefonnummer:", 
            font=("Arial", 16, "bold"), 
            bg=HIOF_HVIT,
            fg=HIOF_SORT
        ).grid(row=1, column=0, sticky="w", pady=15, padx=15)
        
        self.telefon_entry = tk.Entry(
            input_frame, 
            font=("Arial", 14), 
            width=45,
            relief=tk.SOLID,
            borderwidth=2,
            highlightthickness=2,
            highlightcolor=HIOF_AQUABLA,
            highlightbackground=HIOF_VARMGRA
        )
        self.telefon_entry.grid(row=1, column=1, pady=15, padx=15)
        
        # E-post - STØRRE
        tk.Label(
            input_frame, 
            text="E-post:", 
            font=("Arial", 16, "bold"), 
            bg=HIOF_HVIT,
            fg=HIOF_SORT
        ).grid(row=2, column=0, sticky="w", pady=15, padx=15)
        
        self.epost_entry = tk.Entry(
            input_frame, 
            font=("Arial", 14), 
            width=45,
            relief=tk.SOLID,
            borderwidth=2,
            highlightthickness=2,
            highlightcolor=HIOF_AQUABLA,
            highlightbackground=HIOF_VARMGRA
        )
        self.epost_entry.grid(row=2, column=1, pady=15, padx=15)
        
        # Knapper frame
        button_frame = tk.Frame(self.registrering_frame, bg=HIOF_LYS_VARMGRA)
        button_frame.pack(pady=30)
        
        # Start spill knapp med HiØF styling - STØRRE
        self.start_knapp = tk.Button(
            button_frame,
            text="Start ECHOES OF TIME",
            font=("Arial", 20, "bold"),
            bg=HIOF_SJOGRONN,
            fg=HIOF_HVIT,
            activebackground=HIOF_AQUABLA,
            activeforeground=HIOF_HVIT,
            padx=60,
            pady=25,
            command=self.start_spill,
            cursor="hand2",
            relief=tk.FLAT,
            borderwidth=0
        )
        self.start_knapp.pack()
        
        # Status label - STØRRE
        self.status_label = tk.Label(
            self.registrering_frame,
            text="",
            font=("Arial", 12),
            bg=HIOF_LYS_VARMGRA,
            fg=HIOF_SORT
        )
        self.status_label.pack(pady=15)
    
    def setup_vente_ui(self):
        """Sett opp venteskjermen med kontaktinfo, rediger-knapp og registrer-knapp"""
        # Fjern registreringsframe
        if self.registrering_frame:
            self.registrering_frame.destroy()
        
        self.vente_frame = tk.Frame(self.root, bg=HIOF_LYS_VARMGRA)
        self.vente_frame.pack(fill=tk.BOTH, expand=True)
        
        # Tittel header med logo på begge sider
        title_header = tk.Frame(self.vente_frame, bg=HIOF_AQUABLA, height=120)
        title_header.pack(fill=tk.X, pady=(0, 20))
        title_header.pack_propagate(False)
        
        # Container for logo - tekst - logo
        content_frame = tk.Frame(title_header, bg=HIOF_AQUABLA)
        content_frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)
        
        # Logo til venstre
        if self.logo_image:
            logo_left = tk.Label(content_frame, image=self.logo_image, bg=HIOF_AQUABLA)
            logo_left.pack(side=tk.LEFT, padx=(0, 30))
        
        # Tekst i midten
        title_label = tk.Label(
            content_frame,
            text="SPILL OG REGISTRER",
            font=("Arial", 32, "bold"),
            bg=HIOF_AQUABLA,
            fg=HIOF_HVIT
        )
        title_label.pack(side=tk.LEFT)
        
        # Logo til høyre
        if self.logo_image:
            logo_right = tk.Label(content_frame, image=self.logo_image, bg=HIOF_AQUABLA)
            logo_right.pack(side=tk.LEFT, padx=(30, 0))
        
        # Informasjon om deltaker - KOMPAKT
        info_frame = tk.Frame(self.vente_frame, bg=HIOF_HVIT, relief=tk.FLAT, borderwidth=0)
        info_frame.pack(pady=15, padx=200, fill=tk.X)
        
        # Indre padding
        info_inner = tk.Frame(info_frame, bg=HIOF_HVIT)
        info_inner.pack(pady=20, padx=40)
        
        tk.Label(
            info_inner,
            text="Din Kontaktinformasjon",
            font=("Arial", 20, "bold"),
            bg=HIOF_HVIT,
            fg=HIOF_AQUABLA
        ).pack(pady=(0, 15))
        
        # NAVN RAD med rediger-knapp
        navn_frame = tk.Frame(info_inner, bg=HIOF_HVIT)
        navn_frame.pack(pady=8, fill=tk.X)
        
        tk.Label(
            navn_frame,
            text="Navn:",
            font=("Arial", 14, "bold"),
            bg=HIOF_HVIT,
            fg=HIOF_SORT,
            width=12,
            anchor="w"
        ).pack(side=tk.LEFT, padx=(0, 10))
        
        self.vente_navn_entry = tk.Entry(
            navn_frame,
            font=("Arial", 14),
            width=35,
            relief=tk.SOLID,
            borderwidth=1
        )
        self.vente_navn_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.vente_navn_entry.insert(0, self.current_navn)
        self.vente_navn_entry.config(state="readonly", readonlybackground=HIOF_LYS_VARMGRA)
        
        # Rediger-knapp for navn
        self.navn_rediger_btn = tk.Button(
            navn_frame,
            text="Rediger",
            font=("Arial", 11),
            bg=HIOF_KORALL,
            fg=HIOF_HVIT,
            activebackground=HIOF_SJOGRONN,
            activeforeground=HIOF_HVIT,
            command=lambda: self.toggle_rediger_felt("navn"),
            cursor="hand2",
            relief=tk.FLAT,
            padx=12,
            pady=4
        )
        self.navn_rediger_btn.pack(side=tk.LEFT)
        
        # TELEFON RAD med rediger-knapp
        telefon_frame = tk.Frame(info_inner, bg=HIOF_HVIT)
        telefon_frame.pack(pady=8, fill=tk.X)
        
        tk.Label(
            telefon_frame,
            text="Telefon:",
            font=("Arial", 14, "bold"),
            bg=HIOF_HVIT,
            fg=HIOF_SORT,
            width=12,
            anchor="w"
        ).pack(side=tk.LEFT, padx=(0, 10))
        
        self.vente_telefon_entry = tk.Entry(
            telefon_frame,
            font=("Arial", 14),
            width=35,
            relief=tk.SOLID,
            borderwidth=1
        )
        self.vente_telefon_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.vente_telefon_entry.insert(0, self.current_telefon)
        self.vente_telefon_entry.config(state="readonly", readonlybackground=HIOF_LYS_VARMGRA)
        
        # Rediger-knapp for telefon
        self.telefon_rediger_btn = tk.Button(
            telefon_frame,
            text="Rediger",
            font=("Arial", 11),
            bg=HIOF_KORALL,
            fg=HIOF_HVIT,
            activebackground=HIOF_SJOGRONN,
            activeforeground=HIOF_HVIT,
            command=lambda: self.toggle_rediger_felt("telefon"),
            cursor="hand2",
            relief=tk.FLAT,
            padx=12,
            pady=4
        )
        self.telefon_rediger_btn.pack(side=tk.LEFT)
        
        # EPOST RAD med rediger-knapp
        epost_frame = tk.Frame(info_inner, bg=HIOF_HVIT)
        epost_frame.pack(pady=8, fill=tk.X)
        
        tk.Label(
            epost_frame,
            text="E-post:",
            font=("Arial", 14, "bold"),
            bg=HIOF_HVIT,
            fg=HIOF_SORT,
            width=12,
            anchor="w"
        ).pack(side=tk.LEFT, padx=(0, 10))
        
        self.vente_epost_entry = tk.Entry(
            epost_frame,
            font=("Arial", 14),
            width=35,
            relief=tk.SOLID,
            borderwidth=1
        )
        self.vente_epost_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.vente_epost_entry.insert(0, self.current_epost)
        self.vente_epost_entry.config(state="readonly", readonlybackground=HIOF_LYS_VARMGRA)
        
        # Rediger-knapp for epost
        self.epost_rediger_btn = tk.Button(
            epost_frame,
            text="Rediger",
            font=("Arial", 11),
            bg=HIOF_KORALL,
            fg=HIOF_HVIT,
            activebackground=HIOF_SJOGRONN,
            activeforeground=HIOF_HVIT,
            command=lambda: self.toggle_rediger_felt("epost"),
            cursor="hand2",
            relief=tk.FLAT,
            padx=12,
            pady=4
        )
        self.epost_rediger_btn.pack(side=tk.LEFT)
        
        # Status label for feilmeldinger
        self.rediger_status_label = tk.Label(
            info_inner,
            text="",
            font=("Arial", 11),
            bg=HIOF_HVIT,
            fg="red"
        )
        self.rediger_status_label.pack(pady=10)
        
        # Melding - KOMPAKT
        melding_frame = tk.Frame(self.vente_frame, bg=HIOF_LYS_VARMGRA)
        melding_frame.pack(pady=20)
        
        tk.Label(
            melding_frame,
            text="Snake-spillet er startet!",
            font=("Arial", 20, "bold"),
            bg=HIOF_LYS_VARMGRA,
            fg=HIOF_SJOGRONN
        ).pack(pady=8)
        
        tk.Label(
            melding_frame,
            text="Spill Snake-spillet og få poeng!\nNår du er ferdig, lukk spillvinduet og klikk knappen nedenfor.",
            font=("Arial", 14),
            bg=HIOF_LYS_VARMGRA,
            fg=HIOF_SORT,
            justify=tk.CENTER
        ).pack(pady=5)
        
        # Registrer deg knapp - SYNLIG!
        button_frame = tk.Frame(self.vente_frame, bg=HIOF_LYS_VARMGRA)
        button_frame.pack(pady=25)
        
        self.registrer_knapp = tk.Button(
            button_frame,
            text="REGISTRER DEG",
            font=("Arial", 24, "bold"),
            bg=HIOF_AQUABLA,
            fg=HIOF_HVIT,
            activebackground=HIOF_SJOGRONN,
            activeforeground=HIOF_HVIT,
            padx=80,
            pady=30,
            command=self.registrer_deg,
            cursor="hand2",
            relief=tk.FLAT,
            borderwidth=0
        )
        self.registrer_knapp.pack()
    
    def toggle_rediger_felt(self, felt_navn):
        """Toggle redigering av individuelt felt"""
        if felt_navn == "navn":
            entry = self.vente_navn_entry
            btn = self.navn_rediger_btn
            verdi_key = "current_navn"
        elif felt_navn == "telefon":
            entry = self.vente_telefon_entry
            btn = self.telefon_rediger_btn
            verdi_key = "current_telefon"
        else:  # epost
            entry = self.vente_epost_entry
            btn = self.epost_rediger_btn
            verdi_key = "current_epost"
        
        # Sjekk om feltet er i redigeringsmodus
        if entry["state"] == "readonly":
            # Aktiver redigering
            entry.config(state="normal", bg=HIOF_HVIT)
            btn.config(text="Lagre", bg=HIOF_SJOGRONN)
            self.rediger_status_label.config(text=f"Du kan nå redigere {felt_navn}", fg=HIOF_AQUABLA)
        else:
            # Lagre endringer
            ny_verdi = entry.get().strip()
            
            # Valider basert på felt
            if felt_navn == "navn":
                if not ny_verdi:
                    self.rediger_status_label.config(text="Vennligst fyll inn navn", fg="red")
                    return
            elif felt_navn == "telefon":
                if not ny_verdi or not ny_verdi.isdigit() or len(ny_verdi) < 8:
                    self.rediger_status_label.config(
                        text="Telefonnummer må være minst 8 siffer og kun inneholde tall",
                        fg="red"
                    )
                    return
            else:  # epost
                if not ny_verdi or '@' not in ny_verdi or '.' not in ny_verdi:
                    self.rediger_status_label.config(text="Vennligst fyll inn en gyldig e-postadresse", fg="red")
                    return
            
            # Sjekk duplikater hvis verdien er endret
            gammel_verdi = getattr(self, verdi_key)
            if ny_verdi != gammel_verdi:
                if felt_navn == "telefon":
                    allerede_registrert, melding = self.sjekk_allerede_registrert(self.current_epost, ny_verdi)
                elif felt_navn == "epost":
                    allerede_registrert, melding = self.sjekk_allerede_registrert(ny_verdi, self.current_telefon)
                else:
                    allerede_registrert = False
                
                if allerede_registrert:
                    self.rediger_status_label.config(text=melding, fg="red")
                    return
            
            # Alt OK - oppdater verdi
            setattr(self, verdi_key, ny_verdi)
            
            # Deaktiver redigering
            entry.config(state="readonly", readonlybackground=HIOF_LYS_VARMGRA)
            btn.config(text="Rediger", bg=HIOF_KORALL)
            self.rediger_status_label.config(text=f"{felt_navn.capitalize()} oppdatert!", fg=HIOF_SJOGRONN)
    
    def rediger_informasjon(self):
        """Gammel funksjon - ikke i bruk lenger"""
        pass
    
    def valider_input(self):
        """Valider brukerens input"""
        navn = self.navn_entry.get().strip()
        telefon = self.telefon_entry.get().strip()
        epost = self.epost_entry.get().strip()
        
        if not navn:
            messagebox.showerror("Feil", "Vennligst fyll inn navn")
            return False
        
        if not telefon:
            messagebox.showerror("Feil", "Vennligst fyll inn telefonnummer")
            return False
        
        # Sjekk at telefonnummer er gyldig (kun tall)
        if not telefon.isdigit() or len(telefon) < 8:
            messagebox.showerror("Feil", "Telefonnummer må være minst 8 siffer og kun inneholde tall")
            return False
        
        if not epost or '@' not in epost or '.' not in epost:
            messagebox.showerror("Feil", "Vennligst fyll inn en gyldig e-postadresse")
            return False
        
        # Sjekk om allerede registrert (unntatt hvis det er samme person som redigerer)
        if navn != self.current_navn or telefon != self.current_telefon or epost != self.current_epost:
            allerede_registrert, melding = self.sjekk_allerede_registrert(epost, telefon)
            if allerede_registrert:
                messagebox.showerror("Allerede Registrert!", melding)
                return False
        
        return True
    
    def vis_gdpr_popup(self):
        """Vis GDPR samtykke-popup før spillet starter"""
        # Opprett popup-vindu
        popup = tk.Toplevel(self.root)
        popup.title("Personvernerklæring og Samtykke")
        popup.geometry("900x700")
        popup.configure(bg=HIOF_HVIT)
        popup.resizable(False, False)
        
        # Sentrer vinduet
        popup.transient(self.root)
        popup.grab_set()
        
        # Header
        header_frame = tk.Frame(popup, bg=HIOF_AQUABLA, height=80)
        header_frame.pack(fill=tk.X)
        header_frame.pack_propagate(False)
        
        tk.Label(
            header_frame,
            text="📋 PERSONVERNERKLÆRING OG SAMTYKKE",
            font=("Arial", 18, "bold"),
            bg=HIOF_AQUABLA,
            fg=HIOF_HVIT
        ).place(relx=0.5, rely=0.5, anchor=tk.CENTER)
        
        # Scrollbar container
        scroll_container = tk.Frame(popup, bg=HIOF_HVIT)
        scroll_container.pack(fill=tk.BOTH, expand=True, padx=30, pady=20)
        
        # Canvas og Scrollbar
        canvas = tk.Canvas(scroll_container, bg=HIOF_HVIT, highlightthickness=0)
        scrollbar = tk.Scrollbar(scroll_container, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg=HIOF_HVIT)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # GDPR Innhold
        gdpr_sections = [
            ("🏢 Behandlingsansvarlig", "Høgskolen i Østfold (HiØF)"),
            ("🎯 Formål", "Gjennomføring av Nintendo Switch 2-konkurranse på Spillexpo"),
            ("⚖️ Rettslig grunnlag", "Ditt samtykke (GDPR Artikkel 6.1.a)"),
            ("📝 Hvilke opplysninger samler vi?", 
             "• Navn\n• Telefonnummer\n• E-postadresse\n• Spillresultat (antall fullførte nivåer)"),
            ("🗄️ Hvordan lagres dataene?",
             "Dine opplysninger lagres lokalt og trygt på HiØF sine systemer.\nKun autorisert personell har tilgang til dataene."),
            ("⏱️ Lagringstid",
             "Dine opplysninger slettes automatisk senest 30 dager etter at vinneren\ner trukket og kontaktet."),
            ("✅ Dine rettigheter",
             "Du har følgende rettigheter under GDPR:\n\n"
             "• Rett til innsyn i dine personopplysninger\n"
             "• Rett til retting av feil informasjon\n"
             "• Rett til sletting (\"retten til å bli glemt\")\n"
             "• Rett til å trekke tilbake samtykke når som helst\n"
             "• Rett til å klage til Datatilsynet\n\n"
             "For å utøve dine rettigheter, send e-post til danielnj@hiof.no"),
            ("📧 Kontakt oss", 
             "Ved spørsmål om personvern eller for å utøve dine rettigheter:\n\n"
             "E-post: danielnj@hiof.no\n"
             "Organisasjon: Høgskolen i Østfold\n\n"
             "For å trekke tilbake samtykke: Send e-post til danielnj@hiof.no\n"
             "med emne 'Trekk tilbake samtykke' og oppgi navn og e-postadresse.")
        ]
        
        for tittel, innhold in gdpr_sections:
            # Tittel
            tk.Label(
                scrollable_frame,
                text=tittel,
                font=("Arial", 13, "bold"),
                bg=HIOF_HVIT,
                fg=HIOF_AQUABLA,
                anchor="w",
                justify=tk.LEFT
            ).pack(fill=tk.X, pady=(15, 5))
            
            # Innhold
            tk.Label(
                scrollable_frame,
                text=innhold,
                font=("Arial", 11),
                bg=HIOF_HVIT,
                fg=HIOF_SORT,
                anchor="w",
                justify=tk.LEFT,
                wraplength=800
            ).pack(fill=tk.X, pady=(0, 10))
        
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Samtykke checkbox
        samtykke_frame = tk.Frame(popup, bg=HIOF_LYS_VARMGRA, relief=tk.SOLID, borderwidth=2)
        samtykke_frame.pack(fill=tk.X, padx=30, pady=(10, 15))
        
        samtykke_var = tk.BooleanVar()
        
        checkbox = tk.Checkbutton(
            samtykke_frame,
            text="Jeg har lest informasjonen over og samtykker til at mine opplysninger\n"
                 "behandles for gjennomføring av konkurransen i henhold til GDPR.",
            variable=samtykke_var,
            font=("Arial", 11, "bold"),
            bg=HIOF_LYS_VARMGRA,
            fg=HIOF_SORT,
            activebackground=HIOF_LYS_VARMGRA,
            selectcolor=HIOF_HVIT,
            wraplength=800,
            justify=tk.LEFT
        )
        checkbox.pack(pady=15, padx=20, anchor="w")
        
        # Knapper
        button_frame = tk.Frame(popup, bg=HIOF_HVIT)
        button_frame.pack(fill=tk.X, padx=30, pady=(0, 20))
        
        def godkjenn_og_start():
            if not samtykke_var.get():
                messagebox.showwarning(
                    "Samtykke påkrevd",
                    "Du må godkjenne personvernerklæringen for å delta i konkurransen.",
                    parent=popup
                )
                return
            
            popup.destroy()
            self.start_spill_etter_samtykke()
        
        def avbryt():
            popup.destroy()
            messagebox.showinfo(
                "Avbrutt",
                "Du må godkjenne personvernerklæringen for å delta i konkurransen.\n\n"
                "Dine opplysninger er IKKE lagret."
            )
        
        # Godkjenn-knapp
        godkjenn_btn = tk.Button(
            button_frame,
            text="✓ JEG GODKJENNER OG VIL STARTE SPILLET",
            font=("Arial", 14, "bold"),
            bg=HIOF_SJOGRONN,
            fg=HIOF_HVIT,
            activebackground=HIOF_AQUABLA,
            activeforeground=HIOF_HVIT,
            padx=30,
            pady=15,
            command=godkjenn_og_start,
            cursor="hand2",
            relief=tk.FLAT
        )
        godkjenn_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(0, 10))
        
        # Avbryt-knapp
        avbryt_btn = tk.Button(
            button_frame,
            text="✗ Avbryt",
            font=("Arial", 14, "bold"),
            bg=HIOF_KORALL,
            fg=HIOF_HVIT,
            activebackground="#B86857",
            activeforeground=HIOF_HVIT,
            padx=30,
            pady=15,
            command=avbryt,
            cursor="hand2",
            relief=tk.FLAT
        )
        avbryt_btn.pack(side=tk.RIGHT, expand=True, fill=tk.X, padx=(10, 0))
    
    def start_spill(self):
        """Valider input og vis GDPR-popup"""
        if not self.valider_input():
            return
        
        # Lagre gjeldende brukerdata
        self.current_navn = self.navn_entry.get().strip()
        self.current_telefon = self.telefon_entry.get().strip()
        self.current_epost = self.epost_entry.get().strip()
        
        # Vis GDPR-popup først
        self.vis_gdpr_popup()
    
    def start_spill_etter_samtykke(self):
        """Start spillet etter at brukeren har godkjent GDPR"""
        try:
            # Nullstill score før spillet starter
            with open(self.score_file, 'w', encoding='utf-8') as f:
                json.dump({"entryScore": 0}, f)
            
            # Bytt til venteskjerm
            self.setup_vente_ui()
            
            # Start snake spillet (EXE-fil) i bakgrunnen
            subprocess.Popen([self.snake_exe])
            
        except FileNotFoundError:
            messagebox.showerror(
                "Feil",
                f"Finner ikke spillet '{self.snake_exe}'. Kontroller at filen eksisterer."
            )
        except Exception as e:
            messagebox.showerror("Feil", f"En feil oppstod: {str(e)}")
    
    def registrer_deg(self):
        """Registrer deltakelsen - hent score og lagre i JSON format"""
        # Sjekk om noen felt er under redigering
        if (hasattr(self, 'vente_navn_entry') and self.vente_navn_entry["state"] == "normal" or
            hasattr(self, 'vente_telefon_entry') and self.vente_telefon_entry["state"] == "normal" or
            hasattr(self, 'vente_epost_entry') and self.vente_epost_entry["state"] == "normal"):
            
            messagebox.showwarning(
                "Lagre endringer først",
                "Du holder på å redigere informasjon!\n\n"
                "Vennligst klikk 'Lagre'-knappen for feltet du redigerer\n"
                "før du registrerer deg."
            )
            return
        
        try:
            # Les score fra score.txt
            with open(self.score_file, 'r', encoding='utf-8') as f:
                score_data = json.load(f)
                score = score_data.get("entryScore", 0)
            
            # Les eksisterende deltakere
            with open(self.deltakere_file, 'r', encoding='utf-8') as f:
                deltakere = json.load(f)
            
            # Lag ny deltaker-objekt med samtykke-informasjon
            ny_deltaker = {
                "tidspunkt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "navn": self.current_navn,
                "telefon": self.current_telefon,
                "epost": self.current_epost,
                "score": score,
                # GDPR Samtykke-logging
                "samtykke_gitt": True,
                "samtykke_tidspunkt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "samtykke_metode": "gdpr_popup_desktop",
                "gdpr_versjon": "1.0"
            }
            
            # Legg til ny deltaker
            deltakere.append(ny_deltaker)
            
            # Lagre tilbake til filen med pen formatering
            with open(self.deltakere_file, 'w', encoding='utf-8') as f:
                json.dump(deltakere, f, ensure_ascii=False, indent=2)
            
            # Nullstill score.txt til 0
            with open(self.score_file, 'w', encoding='utf-8') as f:
                json.dump({"entryScore": 0}, f)
            
            # Konverter tier til tekst
            tier_tekst = {
                0: "Tier 0",
                1: "Tier 1 🥉",
                2: "Tier 2 🥈",
                3: "Tier 3 🥇"
            }.get(score, f"Tier {score}")
            
            # Vis suksessmelding
            messagebox.showinfo(
                "Suksess! 🎉",
                f"Takk for deltakelsen, {self.current_navn}!\n\n"
                f"Din tier: {tier_tekst}\n\n"
                f"Du er nå med i trekningen om en Nintendo Switch 2!\n"
                f"Vi kontakter vinneren på e-post eller telefon."
            )
            
            # Tilbakestill til registreringsskjermen
            self.current_navn = ""
            self.current_telefon = ""
            self.current_epost = ""
            self.setup_registrering_ui()
            
        except Exception as e:
            messagebox.showerror("Feil", f"Kunne ikke registrere deltakelse: {str(e)}")

def main():
    root = tk.Tk()
    app = KonkurranseApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
