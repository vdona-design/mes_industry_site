export interface SiteInfo {
  name: string;
  oee: string;
  status: string;
  lines: number;
  runningMachines: number;
  network: string;
}

export interface LogItem {
  ts: string;
  type: string;
  msg: string;
}

export interface SlideItem {
  title: string;
  analogy: string;
  desc: string;
  points: string[];
  actionLabel?: string;
  actionType?: 'lock_toggle' | 'network_toggle' | 'recipe_trigger' | 'ghost_trigger';
}

export const sitesData: Record<string, SiteInfo> = {
  MILANO: { name: 'Sito Milano (IT-042)', oee: '84.5%', status: 'In Produzione', lines: 3, runningMachines: 8, network: 'ONLINE' },
  TORINO: { name: 'Sito Torino (IT-089)', oee: '79.2%', status: 'In Manutenzione', lines: 2, runningMachines: 4, network: 'ONLINE' },
  BOLOGNA: { name: 'Sito Bologna (IT-112)', oee: '91.1%', status: 'Ottimale', lines: 4, runningMachines: 11, network: 'OFFLINE' }
};

export const slides: SlideItem[] = [
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
