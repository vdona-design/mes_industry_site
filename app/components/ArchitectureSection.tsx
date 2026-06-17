import { Activity, Cpu, Database, LayoutDashboard, Check } from 'lucide-react';

export function ArchitectureSection() {
  return (
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
  );
}
