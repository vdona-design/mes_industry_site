import { Check } from 'lucide-react';
import { SiteInfo } from './data';

interface MultiSiteSectionProps {
  selectedSite: string;
  setSelectedSite: (site: string) => void;
  sitesData: Record<string, SiteInfo>;
}

export function MultiSiteSection({ selectedSite, setSelectedSite, sitesData }: MultiSiteSectionProps) {
  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-3xl font-extrabold text-white">Supervisore Multi-Sito Corporativo</h2>
        <p className="text-slate-400">
          Dimostrazione dello switch di contesto isolato tramite claims multi-tenant. Seleziona uno stabilimento specifico per simulare il caricamento del JWT token crittografato associato.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <span
                className={`text-sm font-bold block mt-2 ${
                  selectedSite === 'ALL' || sitesData[selectedSite].network === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {selectedSite === 'ALL'
                  ? '🟢 3 Nodi OK'
                  : sitesData[selectedSite].network === 'ONLINE'
                  ? '🌐 ONLINE'
                  : '⚠️ OFFLINE'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-indigo-400 block">Segregazione Dati di Sicurezza:</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedSite === 'ALL'
                ? 'Il tuo account possiede il ruolo "Super_Admin". Le chiamate API iniettano automaticamente una clausola di visibilità globale.'
                : `Iniezione della clausola SQL: 'WHERE Tenant_ID = "${selectedSite}"'. Impossibile accedere ad asset al di fuori di questo perimetro.`}
            </p>
          </div>
        </div>

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
                  <tr key={key} className={`transition ${selectedSite === key ? 'bg-indigo-600/10' : 'hover:bg-slate-900/30'}`}>
                    <td className="p-4 font-mono font-bold text-white">{site.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        site.status === 'Ottimale' || site.status === 'In Produzione'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
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
  );
}
