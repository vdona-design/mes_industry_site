import { ArrowRight, ArrowLeft, Shield, Lock, Globe, Coins } from 'lucide-react';

interface OverviewSectionProps {
  setActiveTab: (tab: string) => void;
}

export function OverviewSection({ setActiveTab }: OverviewSectionProps) {
  return (
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
  );
}
