"use client";
import { useEffect, useRef, useState } from 'react';
import { Cpu } from 'lucide-react';
import { TopNav } from './components/TopNav';
import { OverviewSection } from './components/OverviewSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { SlidesSection } from './components/SlidesSection';
import { MultiSiteSection } from './components/MultiSiteSection';
import { LogItem, sitesData, slides } from './components/data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSlideFullScreen, setIsSlideFullScreen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [machineState, setMachineState] = useState<string>('RUNNING');
  const [networkState, setNetworkState] = useState<string>('ONLINE');
  const [simulationLogs, setSimulationLogs] = useState<LogItem[]>([ 
    { ts: '11:10:02', type: 'info', msg: 'Sistema avviato. Connessione stabilita con il Cloud Hub.' },
    { ts: '11:10:05', type: 'success', msg: 'MES Grabber: Connesso con successo al PLC Macchina M01 (Protocollo OPC-UA).' },
    { ts: '11:10:15', type: 'info', msg: 'Heartbeat Watchdog attivo (Intervallo 30s).' }
  ]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingLocalRecords, setPendingLocalRecords] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedSite, setSelectedSite] = useState<string>('ALL');
  const slideRef = useRef<HTMLDivElement | null>(null);

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

  const triggerSync = () => {
    setIsSyncing(true);
    addLog('info', 'Smart Sync Manager: Compressione batch di telemetria e calcolo delta...');
    setTimeout(() => {
      addLog('success', `Sincronizzazione completata! Record locali trasferiti all'Hub Cloud.`);
      setPendingLocalRecords(0);
      setIsSyncing(false);
    }, 1500);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'overview' && <OverviewSection setActiveTab={setActiveTab} />}
        {activeTab === 'architecture' && <ArchitectureSection />}
        {activeTab === 'slides' && (
          <SlidesSection
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            executeSlideAction={executeSlideAction}
            isSlideFullScreen={isSlideFullScreen}
            toggleSlideFullscreen={toggleSlideFullscreen}
            handleSlideClick={handleSlideClick}
            slideRef={slideRef}
          />
        )}
        {activeTab === 'multisite' && (
          <MultiSiteSection
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
            sitesData={sitesData}
          />
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 p-2 rounded-xl">
              <Cpu className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-base font-bold text-white">MesIndustry</span>
              <p className="text-xs text-slate-500">Piattaforma di Controllo Industriale Integrata 4.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">&copy; 2026 MesIndustry. Progetto di presentazione per esame finale.</p>
        </div>
      </footer>
    </div>
  );
}
