"use client";
import React, { useState } from 'react';
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
  Check,
  FileText,
  Menu,
  X
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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  // Multi-Site Supervisor Context Switcher
  const [selectedSite, setSelectedSite] = useState<string>('ALL');
  
  const sitesData: Record<string, SiteInfo> = {
    MILANO: { name: 'Sito Milano (IT-042)', oee: '84.5%', status: 'In Produzione', lines: 3, runningMachines: 8, network: 'ONLINE' },
    TORINO: { name: 'Sito Torino (IT-089)', oee: '79.2%', status: 'In Manutenzione', lines: 2, runningMachines: 4, network: 'ONLINE' },
    BOLOGNA: { name: 'Sito Bologna (IT-112)', oee: '91.1%', status: 'Ottimale', lines: 4, runningMachines: 11, network: 'OFFLINE' }
  };

  const addLog = (type: string, msg: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSimulationLogs(prev => [{ ts: timeStr, type, msg }, ...prev.slice(0, 7)]);
  };

  const handleSetRecipe = (recipeName: string) => {
    addLog('info', `Richiesta di invio Ricetta "${recipeName}" avviata da Frontend Angular...`);
    
    if (networkState === 'OFFLINE') {
      setPendingLocalRecords(prev => prev + 1);
      addLog('warn', 'OFFLINE DETECTED: Impossibile raggiungere il Cloud. Nginx reindirizza la scrittura sul Database Locale (Edge).');
      addLog('success', 'Continuity OK: I dati sono salvati localmente. Stato UI: "Icona Cloud Rossa - Sync in sospeso".');
      return;
    }

    if (machineState === 'RUNNING') {
      addLog('error', 'HTTP 409 CONFLICT: Operational Lock Attivo! Impossibile modificare parametri o inviare ricette mentre la macchina è in RUNNING.');
      addLog('info', 'Sicurezza Garantita: La verità operativa risiede nel sito fisico fino a conclusione ciclo.');
    } else {
      addLog('success', `HTTP 201 Created: Ricetta "${recipeName}" validata e inviata al MES Grabber. PLC aggiornato.`);
    }
  };

  const handleDeclarePart = () => {
    addLog('info', 'Rilevamento nuovo pezzo con codice anagrafico sconosciuto...');
    addLog('warn', 'Auto-Generation: MES Grabber ha creato un record Placeholder provvisorio.');
    addLog('info', 'Integrità Dati: Record inserito con "is_validated = false" (Stato Pending in UI).');
  };

  const handleNetworkToggle = () => {
    const newState = networkState === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    setNetworkState(newState);
    if (newState === 'OFFLINE') {
      addLog('warn', 'Rete disconnessa! Modalità "Edge Only" attivata. Business continuity garantita dal database locale.');
    } else {
      addLog('success', 'Rete ripristinata! Modalità "Full Hybrid" attiva. Avvio riconciliazione automatica.');
      triggerSync();
    }
  };

  const triggerSync = () => {
    if (pendingLocalRecords === 0) {
      addLog('info', 'Rete online. Nessun dato locale in attesa di sincronizzazione.');
      return;
    }
    setIsSyncing(true);
    addLog('info', 'Smart Sync Manager: Compressione batch di telemetria e calcolo delta anagrafici...');
    setTimeout(() => {
      addLog('success', `Sincronizzazione completata con successo! ${pendingLocalRecords} record trasferiti al Cloud Hub.`);
      setPendingLocalRecords(0);
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu className="h-6 w-6 text-white animate-pulse" />
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
            {['overview', 'architecture', 'sandbox', 'multisite'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-emerald-400 shadow-inner border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab === 'overview' ? "Visione d'Insieme" : tab === 'architecture' ? 'Architettura 4.0' : tab === 'sandbox' ? 'Simulatore Live' : 'Governance Multi-Sito'}
              </button>
            ))}
          </nav>

          {/* Right Actions & Hamburger Button */}
          <div className="flex items-center space-x-4">
            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Pronto 4.0
            </span>
            <button 
              onClick={() => {
                setActiveTab('sandbox');
                setIsMobileMenuOpen(false);
              }}
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/20 items-center gap-2"
            >
              Testa Sistema <ArrowRight className="h-4 w-4" />
            </button>

            {/* Hamburger Button */}
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
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-2 animate-fadeIn">
            {['overview', 'architecture', 'sandbox', 'multisite'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {tab === 'overview' ? "Visione d'Insieme" : tab === 'architecture' ? 'Architettura 4.0' : tab === 'sandbox' ? 'Simulatore Live' : 'Governance Multi-Sito'}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-900">
              <button 
                onClick={() => {
                  setActiveTab('sandbox');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                Testa il Sistema <ArrowRight className="h-4 w-4" />
              </button>
            </div>
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
                    onClick={() => setActiveTab('sandbox')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl text-base font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    Vedi l'Operational Lock in Azione <Zap className="h-5 w-5" />
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

            {/* General Flow Diagram */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 space-y-8">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-bold text-white">Flusso Semplificato delle Operazioni</h3>
                <p className="text-slate-400 text-sm mt-1">Dalla lettura sensoriale in officina alla visualizzazione decisionale del CEO</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/20 via-emerald-500/20 to-indigo-500/20 -translate-y-1/2 z-0"></div>
                
                <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-xl z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-400 font-bold">FASE 1</span>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded">Fabbrica</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Estrazione Dati</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Il <strong>MES Grabber</strong> si collega a PLC e CNC leggendo i registri macchina ad altissima frequenza.</p>
                </div>

                <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-xl z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-400 font-bold">FASE 2</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded">Sicurezza</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Orchestra e Proteggi</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">L'<strong>API Gateway (Nginx)</strong> verifica lo stato di Lock ed elabora la transazione garantendo la sicurezza fisica.</p>
                </div>

                <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-xl z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 font-bold">FASE 3</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-mono rounded">Persistenza</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Dual-Storage</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Persistenza sul database locale di sito per latenza zero e sincronizzazione asincrona protetta verso il Cloud Hub.</p>
                </div>

                <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-xl z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400 font-bold">FASE 4</span>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono rounded">Analisi</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Dashboard Unica</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">L'interfaccia <strong>Dynamic UI</strong> mostra grafici OEE, allarmi e permette l'invio di ricette in modo agnostico e trasparente.</p>
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
                    <span><strong>Discovery e Topologia:</strong> All'avvio, trasmette in cloud la mappa fisica delle linee. L'interfaccia Angular si modella dinamicamente basandosi su questa mappatura.</span>
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
                    <span><strong>Check dello Stato di Lock:</strong> Inibisce in tempo reale comandi di scrittura provenienti da cloud se la macchina è registrata in stato "RUNNING".</span>
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
                    <span><strong>Purging Automatico:</strong> I dati storici superiori a 6 mesi vengono spostati automaticamente in "Cold Storage" preservando le performance del DB principale.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">4. Frontend (MES Dynamic Angular)</h3>
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

            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Standardizzazione degli Errori di Rete e di Business
              </h3>
              <p className="text-slate-400 text-sm">
                Per garantire che l'operatore non si trovi mai davanti a un blocco inspiegabile del software, l'API Gateway adotta una rigida classificazione HTTP:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/15 space-y-2">
                  <span className="text-emerald-400 font-bold font-mono">2xx - Successo Operativo</span>
                  <p className="text-slate-400"><strong>200 OK:</strong> Lettura corretta dello stato macchina.<br /><strong>201 Created:</strong> Nuova ricetta inviata e caricata sul PLC.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/15 space-y-2">
                  <span className="text-amber-400 font-bold font-mono">4xx - Errori Client / Validazione</span>
                  <p className="text-slate-400"><strong>400 Bad Request:</strong> Payload non valido.<br /><strong>409 Conflict:</strong> Tentativo di modifica parametri su macchina in RUNNING (Blocco di sicurezza).</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-red-500/15 space-y-2">
                  <span className="text-red-400 font-bold font-mono">5xx - Errori Infrastruttura Edge</span>
                  <p className="text-slate-400"><strong>502 Bad Gateway:</strong> Il Gateway e il nodo locale non comunicano.<br /><strong>503 Service Unavailable:</strong> Il database locale di sito è offline.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Sandbox Operativo Interattivo</h2>
              <p className="text-slate-400">
                Verifica in prima persona il comportamento della logica di <strong>Operational Lock</strong>, della <strong>Business Continuity (Offline)</strong> e dello <strong>Smart Sync Manager</strong>. Usa i pulsanti di controllo per testare la solidità del sistema.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-400" /> Pannello di Controllo
                </h3>
                
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium block">1. STATO DELLA MACCHINA (PLC)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setMachineState('RUNNING');
                        addLog('info', 'Macchina M01 impostata in stato RUNNING. Blocco Operativo Attivo.');
                      }}
                      className={`py-2.5 px-3 rounded-lg font-semibold text-xs transition ${
                        machineState === 'RUNNING' 
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      🟢 RUNNING (In Lavoro)
                    </button>
                    <button 
                      onClick={() => {
                        setMachineState('IDLE');
                        addLog('info', 'Macchina M01 impostata in stato IDLE (In Attesa). Blocco rimosso.');
                      }}
                      className={`py-2.5 px-3 rounded-lg font-semibold text-xs transition ${
                        machineState === 'IDLE' 
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      ⚪ IDLE (In Attesa)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium block">2. CONNETTIVITÀ CLOUD (NGINX PROXY)</label>
                  <button 
                    onClick={handleNetworkToggle}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                      networkState === 'ONLINE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {networkState === 'ONLINE' ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-400" /> ONLINE (Modalità Hybrid)
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-400" /> OFFLINE (Edge Only)
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="text-xs text-slate-400 font-medium block">3. AZIONI OPERATORI (INTERFACCIA ANGULAR)</label>
                  
                  <button 
                    onClick={() => handleSetRecipe('Ricetta_Fusione_V2')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-between"
                  >
                    <span>Invia Comando "Set Ricetta V2"</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={handleDeclarePart}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-between border border-slate-700"
                  >
                    <span>Dichiara Avanzamento Pezzo</span>
                    <Check className="h-4 w-4" />
                  </button>
                </div>

                {pendingLocalRecords > 0 && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Buffer Locale</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] rounded">{pendingLocalRecords}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Dati salvati localmente. In attesa di sincronizzazione appena la rete tornerà ONLINE.</p>
                    {networkState === 'ONLINE' && (
                      <button 
                        onClick={triggerSync}
                        disabled={isSyncing}
                        className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> Sincronizza Ora
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-400" /> Telemetria Macchina M01
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      machineState === 'RUNNING' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {machineState === 'RUNNING' ? 'IN ESECUZIONE' : 'IDLE (PRONTA)'}
                    </span>
                  </div>

                  <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full ${
                      machineState === 'RUNNING' ? 'bg-red-500 animate-ping' : 'bg-amber-500'
                    }`}></div>

                    <svg className={`w-32 h-32 text-slate-700 transition ${machineState === 'RUNNING' ? 'text-indigo-400' : 'text-slate-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.68-.34-1.44-.08-1.78.6l-1.11 2.22c-.34.68-.08 1.44.6 1.78l1.11.56c.68.34 1.44.08 1.78-.6l1.11-2.22c.34-.68.08-1.44-.6-1.78l-1.11-.56zM4.5 10.5h15M9 3v4.5M15 3v4.5M12 12v3M12 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <div className="mt-4 text-center">
                      <span className="text-slate-500 text-xs font-mono">PLC ID: IT-042-M01</span>
                      <p className="text-lg font-bold text-white">Centro di Lavoro 5 Assi</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Controllo Connessione:</span>
                    <span className={`inline-flex items-center font-bold font-mono ${
                      networkState === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      <span className={`w-2 h-2 mr-1.5 rounded-full ${
                        networkState === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                      }`}></span>
                      {networkState === 'ONLINE' ? '🟢 LIVE (Certificato)' : '🔴 NO-SYNC'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Come richiesto dalla normativa 4.0, se la connessione si interrompe per più di 10 secondi, l'interfaccia Angular evidenzia visivamente l'interruzione.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" /> Console Log dell'API Gateway
                  </h3>
                  <p className="text-[11px] text-slate-500">Log in tempo reale dei messaggi di rete e risposte HTTP.</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 font-mono text-xs overflow-y-auto max-h-[300px] space-y-2">
                  {simulationLogs.map((log, index) => (
                    <div key={index} className="border-b border-slate-900 pb-2">
                      <span className="text-slate-600 mr-2">[{log.ts}]</span>
                      <span className={`font-bold mr-2 ${
                        log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
                      }`}>
                        {log.type.toUpperCase()}:
                      </span>
                      <span className="text-slate-300">{log.msg}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setSimulationLogs([])}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-slate-400 font-semibold text-xs py-2 rounded-lg transition"
                >
                  Pulisci Console Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: MULTI-SITE */}
        {activeTab === 'multisite' && (
          <div className="space-y-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Governance Multi-Sito per Amministratori di Gruppo</h2>
              <p className="text-slate-400">
                La dashboard supporta ruoli di supervisione globale. Il management può effettuare uno **Switch di Contesto** immediato per visualizzare o comparare dashboard di stabilimenti differenti.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSite('ALL')}
                className={`py-2.5 px-5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedSite === 'ALL' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Building className="h-4 w-4" /> Tutti gli Stabilimenti (Aggregato)
              </button>
              
              {Object.keys(sitesData).map((key) => (
                <button 
                  key={key}
                  onClick={() => setSelectedSite(key)}
                  className={`py-2.5 px-5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedSite === key 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
                >
                  <Globe className="h-4 w-4" /> {sitesData[key].name}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedSite === 'ALL' ? 'Analisi Aggregata di Gruppo' : `Monitor: ${sitesData[selectedSite].name}`}
                  </h3>
                  <p className="text-xs text-slate-500">I dati sono filtrati dinamicamente via JWT in base al perimetro autorizzativo.</p>
                </div>
                
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-mono rounded-lg border border-indigo-500/20">
                  Ruolo Utente: Amministratore di Gruppo (CEO)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">OEE Medio</span>
                  <p className="text-3xl font-extrabold text-emerald-400">
                    {selectedSite === 'ALL' ? '84.9%' : sitesData[selectedSite].oee}
                  </p>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +1.2% rispetto a ieri
                  </span>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Linee</span>
                  <p className="text-3xl font-extrabold text-white">
                    {selectedSite === 'ALL' ? '9 Linee' : `${sitesData[selectedSite].lines} Linee`}
                  </p>
                  <span className="text-[10px] text-slate-500">Distribuzione controllata</span>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Macchine Connesse</span>
                  <p className="text-3xl font-extrabold text-white">
                    {selectedSite === 'ALL' ? '23 Macchine' : `${sitesData[selectedSite].runningMachines} Macchine`}
                  </p>
                  <span className="text-[10px] text-emerald-500">Watchdog attivo (30s)</span>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Infrastruttura</span>
                  <p className="text-3xl font-extrabold text-indigo-400">
                    Ibrida
                  </p>
                  <span className={`text-[10px] font-bold ${
                    selectedSite === 'ALL' || sitesData[selectedSite].network === 'ONLINE' ? 'text-emerald-500' : 'text-red-400'
                  }`}>
                    {selectedSite === 'ALL' ? 'Tutti i nodi sincronizzati' : `Sito in modalità ${sitesData[selectedSite].network}`}
                  </span>
                </div>
              </div>

              {selectedSite === 'ALL' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-300">Benchmarking di Stabilimento</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                          <th className="p-4">ID Stabilimento</th>
                          <th className="p-4">Nome Sito</th>
                          <th className="p-4 text-center">OEE Attuale</th>
                          <th className="p-4 text-center">Linee Attive</th>
                          <th className="p-4">Stato Connessione</th>
                          <th className="p-4">Azione</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-900/20">
                        {Object.keys(sitesData).map((key) => (
                          <tr key={key} className="hover:bg-slate-900/40 transition">
                            <td className="p-4 font-mono font-bold text-indigo-400">{key === 'MILANO' ? 'IT-042' : key === 'TORINO' ? 'IT-089' : 'IT-112'}</td>
                            <td className="p-4 text-white font-semibold">{sitesData[key].name}</td>
                            <td className="p-4 text-center text-emerald-400 font-bold text-sm">{sitesData[key].oee}</td>
                            <td className="p-4 text-center text-white">{sitesData[key].lines}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                sitesData[key].network === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {sitesData[key].network}
                              </span>
                            </td>
                            <td className="p-4">
                              <button 
                                onClick={() => setSelectedSite(key)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-md transition font-bold"
                              >
                                Switch
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
          <p className="text-xs text-slate-600">&copy; 2026 NexusMES. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}