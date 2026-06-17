"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Shield, 
  Zap, 
  Database, 
  LayoutDashboard, 
  Globe, 
  Sliders, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  Lock, 
  Wifi, 
  WifiOff, 
  Building,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  Menu,
  X,
  Layers,
  Terminal,
  Presentation
} from 'lucide-react';


// DEFINIZIONE DEI TIPI PER TYPESCRIPT
interface SiteInfo {
  name: string;
  oee: string;
  status: string;
  lines: number;
  runningMachines: number;
  network: string;
}

interface LogItem {
  ts: string;
  type: string;
  msg: string;
}

interface SlideItem {
  title: string;
  analogy: string;
  desc: string;
  points: string[];
  actionLabel?: string;
  actionType?: 'lock_toggle' | 'network_toggle' | 'recipe_trigger' | 'ghost_trigger';
}

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSlideFullScreen, setIsSlideFullScreen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Interactive Simulation States
  const [machineState, setMachineState] = useState<string>('RUNNING');
  const [networkState, setNetworkState] = useState<string>('ONLINE');
  const [simulationLogs, setSimulationLogs] = useState<LogItem[]>([
    { ts: '11:10:02', type: 'info', msg: 'Sistema avviato. Connessione stabilita con il Cloud Hub.' },
    { ts: '11:10:05', type: 'success', msg: 'MES Grabber: Connesso con successo al PLC Macchina M01 (Protocollo OPC-UA).' },
    { ts: '11:10:15', type: 'info', msg: 'Heartbeat Watchdog attivo (Intervallo 30s).' }
  ]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingLocalRecords, setPendingLocalRecords] = useState<number>(0);

  // Slide State (Per la nuova tab Presentazione)
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Multi-Site Supervisor Context Switcher
  const [selectedSite, setSelectedSite] = useState<string>('ALL');
  
  const sitesData: Record<string, SiteInfo> = {
    MILANO: { name: 'Sito Milano (IT-042)', oee: '84.5%', status: 'In Produzione', lines: 3, runningMachines: 8, network: 'ONLINE' },
    TORINO: { name: 'Sito Torino (IT-089)', oee: '79.2%', status: 'In Manutenzione', lines: 2, runningMachines: 4, network: 'ONLINE' },
    BOLOGNA: { name: 'Sito Bologna (IT-112)', oee: '91.1%', status: 'Ottimale', lines: 4, runningMachines: 11, network: 'OFFLINE' }
  };

  // DATI DELLE SLIDE CON METAFORE PER NON-INFORMATICI
  const slides: SlideItem[] = [
    {
      title: "1. Il Problema: Il Caos in Fabbrica",
      analogy: "La Metafora della Cucina di un Ristorante",
      desc: "Immaginate una grande fabbrica come la cucina di un ristorante stellato. Se il capo chef (direzione aziendale) non sa quale forno è acceso, quale ricetta si sta preparando o se un ingrediente si è bruciato, regna il caos totale. Il nostro software risolve questo isolamento.",
      points: [
        "Gli uffici non sanno cosa fanno i macchinari in tempo reale.",
        "Rischio di produrre pezzi con ricette vecchie o errate.",
        "Mancanza di dati matematici per capire dove si perde denaro."
      ]
    },
    {
      title: "2. La Soluzione: Cos'è un Sistema MES?",
      analogy: "Il Direttore d'Orchestra Digitale",
      desc: "Il MES (Manufacturing Execution System) è l'anello di congiunzione mancante: un software che parla la lingua dei computer degli uffici e, contemporaneamente, la lingua elettrica delle macchine utensili in reparto.",
      points: [
        "Monitora i secondi di lavoro e i millisecondi di fermo macchina.",
        "Invia digitalmente le 'ricette' di produzione senza fogli di carta.",
        "Calcola l'OEE, ovvero la percentuale di efficienza reale della fabbrica."
      ]
    },
    {
      title: "3. Come è fatto dentro? I Componenti",
      analogy: "L'Anatomia del Nostro Software",
      desc: "Per spiegarlo in parole semplici, abbiamo diviso il sistema in quattro assistenti specializzati che lavorano insieme in totale armonia:",
      points: [
        "Il Grabber (L'Inviato): Sta vicino alla macchina e conta i pezzi fisici prodotti.",
        "L'API Gateway (Il Vigile Urbano): Smista le informazioni e dice chi può passare.",
        "Il Database (La Cassaforte): Custodisce le ricette e lo storico aziendale.",
        "L'Interfaccia Web (Il Cruscotto): Schermate chiare e colorate per gli operai."
      ]
    },
    {
      title: "4. Sicurezza Fisica: L'Operational Lock",
      analogy: "Vietato cambiare marcia mentre l'auto corre!",
      desc: "Cosa succede se un manager dall'ufficio o da casa prova a cambiare la ricetta di un macchinario mentre questo sta lavorando ad altissima velocità? Sarebbe pericolosissimo. Il nostro sistema integra un blocco di sicurezza hardware/software nativo.",
      points: [
        "Se la macchina è in stato RUNNING, il sistema rifiuta modifiche remote.",
        "Restituisce un errore standardizzato (HTTP 409 Conflict).",
        "La verità protettiva risiede nel reparto, non nei computer degli uffici."
      ],
      actionLabel: "Simula Cambio Stato Macchina (IDLE/RUNNING)",
      actionType: "lock_toggle"
    },
    {
      title: "5. Cosa succede se salta Internet? L'Architettura Ibrida",
      analogy: "Il blocco degli appunti di emergenza",
      desc: "Molti software moderni smettono di funzionare se si disconnette la rete Wi-Fi. In una fabbrica questo causerebbe danni per migliaia di euro. La nostra architettura è 'Ibrida' (Edge + Cloud) proprio per evitare questo scenario.",
      points: [
        "In caso di blackout (Offline), i dati si salvano su un server locale (Edge).",
        "La produzione continua senza un solo secondo di interruzione.",
        "Appena torna internet, lo Smart Sync manager spedisce i dati accumulati nel cloud."
      ],
      actionLabel: "Simula Blackout Internet (Stacca la Rete)",
      actionType: "network_toggle"
    },
    {
      title: "6. Gestione Imprevisti: I Pezzi Fantasma",
      analogy: "Meglio un ospite senza invito che bloccare la festa",
      desc: "Se l'operaio monta sulla macchina un materiale con un codice totalmente nuovo non ancora registrato nei computer centrali, il sistema non deve bloccarsi. Il Grabber genera un record provvisorio di sicurezza.",
      points: [
        "Viene creato un pezzo 'Ghost' temporaneo (is_validated = false).",
        "La linea continua a girare e produrre valore.",
        "Il manager convaliderà il codice a fine turno con calma."
      ],
      actionLabel: "Simula Lettura Codice Sconosciuto (Ghost)",
      actionType: "ghost_trigger"
    }
  ];

  const addLog = (type: string, msg: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSimulationLogs(prev => [{ ts: timeStr, type, msg }, ...prev.slice(0, 6)]);
  };

  const handleSetRecipe = (recipeName: string) => {
    addLog('info', `Richiesta di invio Ricetta "${recipeName}" avviata da Frontend...`);
    
    if (networkState === 'OFFLINE') {
      setPendingLocalRecords(prev => prev + 1);
      addLog('warn', 'OFFLINE DETECTED: Impossibile raggiungere il Cloud. Scrittura reindirizzata sul Database Locale (Edge).');
      return;
    }

    if (machineState === 'RUNNING') {
      addLog('error', 'HTTP 409 CONFLICT: Operational Lock Attivo! Impossibile modificare parametri mentre la macchina è in RUNNING.');
    } else {
      addLog('success', `HTTP 201 Created: Ricetta "${recipeName}" inviata al PLC con successo.`);
    }
  };

  const handleDeclarePart = () => {
    addLog('info', 'Rilevamento nuovo pezzo con codice anagrafico sconosciuto...');
    addLog('warn', 'Auto-Generation: MES Grabber ha creato un record Placeholder provvisorio.');
    addLog('info', 'Integrità Dati: Record inserito con "is_validated = false" in attesa di approvazione.');
  };

  const handleNetworkToggle = () => {
    const newState = networkState === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    setNetworkState(newState);
    if (newState === 'OFFLINE') {
      addLog('warn', 'Rete disconnessa! Modalità "Edge Only" attivata. Business continuity garantita.');
    } else {
      addLog('success', 'Rete ripristinata! Avvio riconciliazione automatica verso il Cloud...');
      triggerSync();
    }
  };

  const triggerSync = () => {
    setIsSyncing(true);
    addLog('info', 'Smart Sync Manager: Compressione batch di telemetria e calcolo delta...');
    setTimeout(() => {
      addLog('success', `Sincronizzazione completata! Record locali trasferiti all'Hub Cloud.`);
      setPendingLocalRecords(0);
      setIsSyncing(false);
    }, 1500);
  };

  // Esecuzione comandi rapidi direttamente dalle slide
  const executeSlideAction = (type: string) => {
    if (type === 'lock_toggle') {
      const nextState = machineState === 'RUNNING' ? 'IDLE' : 'RUNNING';
      setMachineState(nextState);
      addLog('info', `Stato macchina cambiato manualmente in: ${nextState}`);
    } else if (type === 'network_toggle') {
      handleNetworkToggle();
    } else if (type === 'ghost_trigger') {
      handleDeclarePart();
    } else if (type === 'recipe_trigger') {
      handleSetRecipe('Ricetta_Fusione_V2');
    }
  };

  // Fullscreen handling for slides
  const slideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onFsChange = () => {
      setIsSlideFullScreen(document.fullscreenElement === slideRef.current);
    };

    const onKey = (e: KeyboardEvent) => {
      if (activeTab !== 'slides') return;
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleSlideFullscreen();
      }
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide(p => Math.min(slides.length - 1, p + 1));
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(p => Math.max(0, p - 1));
      }
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('keydown', onKey as any);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('keydown', onKey as any);
    };
  }, [activeTab]);

  const toggleSlideFullscreen = async () => {
    if (!slideRef.current) return;
    try {
      if (document.fullscreenElement === slideRef.current) {
        await document.exitFullscreen();
      } else {
        // @ts-ignore
        await slideRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error', err);
    }
  };

  const handleSlideClick = (e: React.MouseEvent) => {
    if (!isSlideFullScreen || !slideRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    const rect = slideRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    if (ratio < 0.4) {
      setCurrentSlide(p => Math.max(0, p - 1));
    } else if (ratio > 0.6) {
      setCurrentSlide(p => Math.min(slides.length - 1, p + 1));
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Nexus<span className="text-emerald-400 font-semibold">MES</span>
              </span>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">Ecosistema Industriale 4.0</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {['overview', 'architecture', 'slides', 'multisite'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-emerald-400 shadow-inner border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab === 'overview' ? "Visione d'Insieme" : tab === 'architecture' ? 'Architettura 4.0' : tab === 'slides' ? 'Slide Presentazione ⏱️' : 'Governance Multi-Sito'}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-1">
            {['overview', 'architecture', 'slides', 'multisite'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium block ${
                  activeTab === tab ? 'bg-slate-900 text-emerald-400' : 'text-slate-400'
                }`}
              >
                {tab === 'overview' ? "Visione d'Insieme" : tab === 'architecture' ? 'Architettura 4.0' : tab === 'slides' ? 'Slide Presentazione' : 'Governance Multi-Sito'}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* SECTION 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-16">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative max-w-3xl space-y-6">
                <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase font-mono">
                  SISTEMA MES IBRIDO DI NUOVA GENERAZIONE
                </span>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  L'evoluzione del controllo di fabbrica: sicuro, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ibrido e multi-sito</span>.
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                  NexusMES unisce l'alta affidabilità della computazione locale (Edge) alla potenza analitica del Cloud Hub. Progettato per garantire la continuità dei processi industriali anche offline, con controlli di sicurezza fisici nativi e totale conformità ai requisiti dell'Industria 4.0.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('slides')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-base font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
                  >
                    Avvia Presentazione Esame <ArrowRight className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('architecture')}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition"
                  >
                    Esplora l'Architettura Tecnica
                  </button>
                </div>
              </div>
            </div>

            {/* Key Business Pillars */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-bold">I 4 Pilastri del Ritorno sull'Investimento (ROI)</h2>
                <p className="text-slate-400">Come la nostra tecnologia garantisce protezione del capitale, incremento dell'OEE e azzeramento dei rischi operativi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition duration-300 space-y-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl w-fit">
                    <Shield className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Business Continuity 100%</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    La fabbrica non si ferma mai. Se internet cade, il server locale **Edge** gestisce in autonomia l'avanzamento, memorizzando i dati per ricaricarli automaticamente al ripristino.
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/40 transition duration-300 space-y-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl w-fit">
                    <Lock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Operational Lock Nativo</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Nessun errore umano da remoto. Se la macchina è in stato **RUNNING**, qualsiasi tentativo di modifica parametri da remoto viene bloccato istantaneamente. La sicurezza fisica ha la priorità.
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 transition duration-300 space-y-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl w-fit">
                    <Globe className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Governance Multi-Sito</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Gestisci tutti gli stabilimenti del gruppo con un unico accesso. Confronta le metriche OEE, analizza i costi ed effettua switch di contesto sicuri e segregati tramite token JWT dedicati.
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/40 transition duration-300 space-y-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl w-fit">
                    <Coins className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Ottimizzazione TCO</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Strategia di archiviazione "Cold Storage" intelligente. I dati sensibili rimangono in database veloci per 30 giorni, poi compressi in cloud economici (S3) per abbattere i costi di storage del 90%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Architettura Ibrida ad Alta Resilienza</h2>
              <p className="text-slate-400">
                La combinazione ottimale tra velocità del sito locale e potenza aggregatrice del cloud. Di seguito trovi i componenti core e i due scenari operativi previsti dal capitolato.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">1. MES Grabber (Punto Zero)</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Il software "Grabber" opera direttamente su server locali del cliente a stretto contatto con PLC e CNC. 
                </p>
                <ul className="text-xs text-slate-400 space-y-2 border-t border-slate-800/80 pt-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Discovery e Topologia:</strong> All'avvio, trasmette in cloud la mappa fisica delle linee. L'interfaccia si modella dinamicamente basandosi su questa mappatura.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Ghost Auto-generation:</strong> Se intercetta codici sconosciuti (es. nuova ricetta sul PLC), crea un record temporaneo contrassegnato con <code>is_validated = false</code> per non bloccare la linea.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">2. MES API (Core Orchestrator)</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  L'orchestrazione logica è duplicata sia in locale (per Business Continuity) sia in Cloud (per l'amministrazione aggregata).
                </p>
                <ul className="text-xs text-slate-400 space-y-2 border-t border-slate-800/80 pt-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Isolamento Multi-Tenant:</strong> Accesso controllato e protetto da JWT contenente il <code>Tenant_ID</code>. Nessun sito può vedere i dati di un altro.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Check dello Stato di Lock:</strong> Inibisce in tempo reale comandi di scrittura provenienti da cloud se la macchina è registrata in stato RUNNING.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">3. Hybrid Database Layer</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Gestione bilanciata dello storage. Database locale snello contenente solo i dati operativi, sincronizzato con un Mega-Hub Cloud centrale.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 border-t border-slate-800/80 pt-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Modello Site-Based:</strong> Database normalizzato per anagrafiche partizionato rigidamente per <code>Tenant_ID</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Purging Automatico:</strong> I dati storici superiori a 6 mesi vengono spostati automaticamente in Cold Storage preservando le performance del DB principale.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">4. Frontend (Dynamic UI)</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  L'interfaccia utente finale unica, che contatta un solo endpoint logico. Nginx si occupa di indirizzare la chiamata al nodo locale o cloud in totale trasparenza.
                </p>
                <ul className="text-xs text-slate-400 space-y-2 border-t border-slate-800/80 pt-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Dynamic UI:</strong> L'interfaccia si modella autonomamente a partire dall'oggetto <code>UI_Config</code> originato dalle macchine locali.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Gestione Errori Standardizzata:</strong> Un Global Interceptor intercetta i codici di errore HTTP specifici mostrando banner esplicativi all'operatore.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* NEW SECTION 3: SLIDES PRESENTAZIONE (Sostituisce completamente la vecchia Sandbox) */}
        {activeTab === 'slides' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
                  <Presentation className="h-7 w-7 text-indigo-400" /> Supporto Visivo Esame 30 Minuti
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Usa questa scheda come slide interattiva durante il colloquio. Spiega i concetti con le metafore a sinistra e mostra gli effetti sul codice a destra.
                </p>
              </div>
              
              {/* Indicatori di Stato Software Integrati nell'Header Slide */}

            </div>

            {/* Layout a due colonne: A sinistra le Slide e i pulsanti narrativi, a destra la Console e i Log del software reale */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* COLONNA SINISTRA (2/3): LA SLIDE ATTUALE */}
              <div ref={slideRef} onClick={handleSlideClick} className={`lg:col-span-full flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 rounded-2xl p-8 shadow-xl relative min-h-[460px] ${isSlideFullScreen ? 'cursor-pointer' : ''}`}>
                <div className="absolute top-4 right-6 flex items-center gap-3">
                  <div className="text-xs text-slate-600 font-mono font-bold">SLIDE {currentSlide + 1} / {slides.length}</div>
                  <button
                    onClick={toggleSlideFullscreen}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                    aria-label={isSlideFullScreen ? 'Esci Fullscreen' : 'Apri Fullscreen'}
                    title={isSlideFullScreen ? 'Esci Fullscreen (Esc)' : 'Apri Fullscreen (F)'}
                  >
                    <Presentation className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-900/40">
                    💡 {slides[currentSlide].analogy}
                  </span>
                  
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {slides[currentSlide].title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed text-base">
                    {slides[currentSlide].desc}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {slides[currentSlide].points.map((pt, index) => (
                      <li key={index} className="flex items-start text-sm text-slate-400">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 mr-3" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pulsante di Azione incorporato nella slide per mostrare l'effetto live nei Log */}
                <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {slides[currentSlide].actionType ? (
                    <button
                      onClick={() => executeSlideAction(slides[currentSlide].actionType!)}
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-indigo-900/20"
                    >
                      <Sliders className="h-4 w-4" /> {slides[currentSlide].actionLabel}
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500 italic">Usa i controlli in basso per scorrere la presentazione.</div>
                  )}

                  {/* Pulsanti Avanti / Indietro della Slide */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setCurrentSlide(p => Math.max(0, p - 1))}
                      disabled={currentSlide === 0}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-white transition border border-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide(p => Math.min(slides.length - 1, p + 1))}
                      disabled={currentSlide === slides.length - 1}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-white transition flex items-center gap-2 font-bold text-xs px-4"
                    >
                      Avanti <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* COLONNA DESTRA (1/3): IL SIMULATORE DI CODICE REALE */}
              

            </div>
          </div>
        )}

        {/* SECTION 4: MULTI-SITE GOVERNANCE */}
        {activeTab === 'multisite' && (
          <div className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Supervisore Multi-Sito Corporativo</h2>
              <p className="text-slate-400">
                Dimostrazione dello switch di contesto isolato tramite claims multi-tenant. Seleziona uno stabilimento specifico per simulare il caricamento del JWT token crittografato associato.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contesto Attivo Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Token JWT Decodificato Corrente</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedSite === 'ALL' ? 'Tutti i Siti Attivi (Gruppo Global)' : sitesData[selectedSite].name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 font-mono block">Efficienza OEE</span>
                    <span className="text-2xl font-bold text-white block mt-1">
                      {selectedSite === 'ALL' ? '84.9%' : sitesData[selectedSite].oee}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 font-mono block">Stato Rete Edge</span>
                    <span className={`text-sm font-bold block mt-2 ${
                      selectedSite === 'ALL' || sitesData[selectedSite].network === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedSite === 'ALL' ? '🟢 3 Nodi OK' : sitesData[selectedSite].network === 'ONLINE' ? '🌐 ONLINE' : '⚠️ OFFLINE'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 block">Segregazione Dati di Sicurezza:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedSite === 'ALL' 
                      ? 'Il tuo account possiede il ruolo "Super_Admin". Le chiamate API iniettano automaticamente una clausola di visibilità globale.' 
                      : `Iniezione della clausola SQL: 'WHERE Tenant_ID = "${selectedSite}"'. Impossibile accedere ad asset al di fuori di questo perimetro.`
                    }
                  </p>
                </div>
              </div>

              {/* Tabella degli Stabilimenti */}
              <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-white text-base">Stabilimenti di Produzione nel Gruppo</h4>
                  {selectedSite !== 'ALL' && (
                    <button 
                      onClick={() => setSelectedSite('ALL')}
                      className="text-xs text-indigo-400 font-semibold hover:underline"
                    >
                      Azzera Filtro Multi-Tenant
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm text-slate-300">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                        <th className="p-4">Codice Identificativo</th>
                        <th className="p-4">Stato Operativo</th>
                        <th className="p-4">Linee / Macchine</th>
                        <th className="p-4">OEE Totale</th>
                        <th className="p-4">Azione</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {Object.entries(sitesData).map(([key, site]) => (
                        <tr 
                          key={key} 
                          className={`transition ${selectedSite === key ? 'bg-indigo-600/10' : 'hover:bg-slate-900/30'}`}
                        >
                          <td className="p-4 font-mono font-bold text-white">{site.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              site.status === 'Ottimale' || site.status === 'In Produzione' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {site.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{site.lines} Linee / {site.runningMachines} Macchine</td>
                          <td className="p-4 font-bold text-white">{site.oee}</td>
                          <td className="p-4">
                            <button 
                              onClick={() => setSelectedSite(key)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-md transition font-bold text-xs"
                            >
                              Simula Switch Context
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 p-2 rounded-xl">
              <Cpu className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-base font-bold text-white">NexusMES</span>
              <p className="text-xs text-slate-500">Piattaforma di Controllo Industriale Integrata 4.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">&copy; 2026 NexusMES. Progetto di presentazione per esame finale.</p>
        </div>
      </footer>
    </div>
  );
}