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
  analogy: string;
  title: string;
  desc: string;
  points: string[];
  speech: string; // Copione colloquiale pronto per la presentazione a voce!
  actionType?: string;
  actionLabel?: string;
  image?: string; // Percorso dell'immagine opzionale
  imageSizeClass?: string; // Classe Tailwind opzionale per dimensionare l'immagine
}

export const sitesData: Record<string, SiteInfo> = {
  MILANO: { name: 'Sito Milano (IT-042)', oee: '84.5%', status: 'In Produzione', lines: 3, runningMachines: 8, network: 'ONLINE' },
  TORINO: { name: 'Sito Torino (IT-089)', oee: '79.2%', status: 'In Manutenzione', lines: 2, runningMachines: 4, network: 'ONLINE' },
  BOLOGNA: { name: 'Sito Bologna (IT-112)', oee: '91.1%', status: 'Ottimale', lines: 4, runningMachines: 11, network: 'OFFLINE' }
};

export const slides: SlideItem[] = [
  // --- PARTE 1: IL CONTESTO ARCHITETTURALE E GLI OBIETTIVI DEL PROGETTO ---
  {
    analogy: "Il passaggio dalla vecchia mappa di carta stradale al navigatore satellitare in tempo reale.",
    title: "1. L'obiettivo del Progetto: Monitoraggio e Controllo in ottica 4.0",
    desc: "MesIndustry nasce per connettere i sistemi gestionali ai macchinari di produzione senza ritardi. Sostituiamo i vecchi moduli cartacei con dashboard digitali in tempo reale che gestiscono sia i dati in uscita dai macchinari sia l'invio delle configurazioni , abilitando un controllo bidirezionale e una reattività immediata su tutto lo stabilimento.",
    image: '/image_project.png',
    points: [
      "Addio ai fogli di carta: digitalizzazione totale delle schede operative (Paperless Architecture).",
      "Integrazione bidirezionale per soddisfare i requisiti dell'Industria 4.0.",
      "Raccolta automatica dei dati di produzione e tracciamento dei KPI (acronimo di Key Performance Indicator, in italiano Indicatore Chiave di Prestazione indica l'efficacia con cui un'azienda).",
      "Predisposizione all'invio remoto dei parametri alle linee (Recipe Deployment)."
    ],
    speech: "Immaginate di dover guidare un'azienda usando una vecchia mappa stradale di carta: è quello che succede quando si gestisce una fabbrica con i moduli cartacei. Con MesIndustry abbiamo creato un vero e proprio navigatore satellitare per la produzione. Eliminiamo i fogli di carta e colleghiamo direttamente i gestionali alle macchine. Questo significa due cose: primo, vediamo in tempo reale cosa succede sulle linee; secondo, possiamo mandare le istruzioni di lavoro direttamente ai PC di bordo senza che un operatore debba farlo a mano."
  },
  {
    analogy: "Un condominio blindato dove ognuno ha le chiavi solo ed esclusivamente del proprio appartamento.",
    title: "2. La Governance Multi-Sito: Isolamento logico dei Tenant",
    desc: "Il sistema gestisce più stabilimenti industriali e aziende usando un'unica infrastruttura centrale, ma isolando i dati in modo rigido attraverso un approccio Multi-Tenant. Ogni sito è un ecosistema indipendente: le linee, i log e le configurazioni del Sito A sono invisibili e inaccessibili per gli utenti del Sito B.",
    points: [
      "Unica infrastruttura software condivisa per abbattere i costi hardware complessivi.",
      "Isolamento blindato dei database per garantire la massima riservatezza industriale.",
      "Token JWT nativi con i permessi alle sezioni e alle aziende visibili.",
      "Vincolo rigido 1:1 tra un singolo sito e il rispettivo Edge Gateway per evitare collisioni."
    ],
    speech: "Quando un'azienda ha più stabilimenti, sorge un problema: come gestirli senza spendere un patrimonio in server e senza rischiare che i dati si mescolino? Abbiamo usato un approccio Multi-Tenant. È come un condominio super protetto: l'edificio è lo stesso per risparmiare sui costi, ma ogni stabilimento ha le sue chiavi digitali. Tramite token di sicurezza crittografati, chi lavora a Milano non può assolutamente vedere o modificare quello che succede sulle linee di Bologna."
  },
  {
    analogy: "Il direttore generale con il passpartout per controllare tutte le stanze dell'hotel.",
    title: "3. Gestione dei Ruoli",
    desc: "Il livello di utente 'Manager' offre una cabina di regia globale. Permette al management di monitorare l'efficienza complessiva (OEE), confrontare le performance di tutti i nodi della rete geografica e individuare al volo i colli di bottiglia.",
    points: [
      "Accesso con privilegi elevati (Manager) per la supervisione globale di tutti i nodi.",
      "Schermata di controllo centralizzata con metriche e KPI aggregati in un unico cruscotto.",
      "Confronto analitico delle prestazioni tra impianti gemelli dislocati in siti diversi.",
      "Individuazione immediata di anomalie di rete, cali di cadenza o blocchi diffusi."
    ],
    speech: "Mentre l'operatore a bordo macchina deve concentrarsi sulla sua linea, il manager o il direttore tecnico ha bisogno di una visione d'insieme. Abbiamo creato la 'Vista Supervisore'. È una mappa globale che aggrega i dati di tutti gli stabilimenti. Se c'è un calo di produzione o un blocco a Torino, il supervisore lo vede all'istante dalla sua dashboard centralizzata, potendo fare anche un confronto tra macchine identiche per capire quale sta rendendo meglio."
  },

  // --- PARTE 2: L'ARCHITETTURA DELLE INFORMAZIONI E IL ROUTING DEI DATI ---
  {
    analogy: "Il portinaio di un palazzo che controlla i documenti e smista i visitatori all'ingresso.",
    title: "4.Regolazione del Traffico Dati",
    desc: "Nessun browser o macchinario parla direttamente con lo strato di dati sensibile. Tutto il traffico attraversa Nginx configurato come Reverse Proxy e API Gateway . Questo componente valida l'identità digitale del mittente, smista le richieste verso il backend o il frontend e azzera i problemi di CORS(Cross-Origin Resource Sharing).",
    points: [
      "Punto di ingresso unico per tutto il traffico web e industriale.",
      "Validazione immediata dei token (JWT Authentication & Authorization) ad ogni richiesta.",
      "Smistamento automatico del traffico nascondendo gli IP reali dei database.",
      "Azzeramento dei problemi di CORS grazie alla gestione Same-Origin del proxy."
    ],
    speech: "Per rendere il sistema sicuro, non colleghiamo mai l'interfaccia utente direttamente ai database. In mezzo ci abbiamo messo Nginx, che fa da portinaio. Qualsiasi richiesta, che arrivi da un PC in ufficio o da un tablet in fabbrica, bussa alla sua porta. Nginx controlla le credenziali e smista il traffico: le richieste di dati vanno al backend, i grafici al frontend. Questo scherma l'infrastruttura e azzera i classici problemi di rete e permessi CORS."
  },
  {
    analogy: "Un interprete che traduce i dialetti stretti in un italiano chiaro e standard.",
    title: "5. Il MES Edge Gateway: Ingestione Dati e Dialogo con i macchinari",
    desc: "Il modulo gestisce l'integrazione hardware parlando il protocollo industriale OPC UA. Prende i flussi di dati binari dai macchinari, li traduce in oggetti JSON standardizzati per il cloud e, nel percorso inverso, converte i comandi web in impulsi elettronici per le macchine.",
    points: [
      "Integrazione nativa con l'hardware tramite protocollo industriale standard OPC UA.",
      "Parsing e normalizzazione dei segnali fisici dei macchinari in strutture dati JSON pulite.",
      "Live Tag Validation: controllo continuo sui NodeID per intercettare subito sensori errati.",
 ],
    speech: "I macchinari industriali parlano una lingua tutta loro, fatta di registri binari e protocolli complessi come l'OPC UA. La nostra applicazione web, invece, si aspetta del semplice testo in formato JSON. Per farli dialogare abbiamo sviluppato il MES Edge Gateway. Fa da interprete: traduce i dati della macchina in tempo reale per la dashboard e converte i nostri clic sullo schermo in comandi per il motore del macchinario. In più, controlla che i sensori siano configurati bene, segnalando subito se qualcosa non quadra."
  },
  {
    analogy: "Una scrivania con un cassetto per i documenti importanti e uno per gli scontrini quotidiani.",
    title: "6. Struttura del Database: Anagrafiche e Log Transazionali",
    desc: "La persistenza si basa su PostgreSQL 17. Le 'Anagrafiche' gestiscono i dati stabili come linee, gli utenti e i tenant. Le 'Transazioni' accolgono il flusso continuo della telemetria dei macchinari, sfruttando colonne JSONB ottimizzate per non rallentare le query.",
    points: [
      "Database relazionale robusto con PostgreSQL 17 integrato nello stack Docker.",
      "Campi JSONB per salvare parametri macchina variabili senza cambiare schema.",
    ],
    speech: "Una fabbrica produce una quantità enorme di dati ogni secondo. Se salvassimo tutto nello stesso modo, il database esploderebbe in pochi giorni. Abbiamo usato PostgreSQL 17 dividendo i dati in due cassetti. Nel primo mettiamo le cose importanti che cambiano raramente, come i nomi delle macchine e gli utenti. Nel secondo buttiamo il flusso continuo dei sensori. Per farlo in modo efficiente usiamo i campi JSONB: ci permettono di salvare dati diversi per ogni macchina senza rallentare il sistema e garantendo prestazioni altissime."
  },

  // --- PARTE 3: STATI OPERATIVI E TRASMISSIONE DELLE RICETTE ---
  
  {
    analogy: "Un computer che invia le istruzioni di stampa direttamente a una stampante di rete.",
    title: "7. Il Flusso di Controllo: Invio Remoto delle Ricette",
    desc: " Dall'applicazione web, un utente autorizzato può selezionare una 'Prodotto' e inviarla direttamente ai macchinari della linea le ricette da eseguire.",
    points: [
      "Repository centralizzato delle configurazioni e ricette tecniche nel database cloud.",
      "Iniezione diretta dei parametri nei registri del macchinari senza programmazione manuale a bordo macchina.",
      "Deep Configuration Sync: se cambiano i parametri lato API, l'edge gateway si reinizializza all'istante.",
      "Abbattimento drastico dei tempi di fermo macchina durante il cambio formato o prodotto."
    ],
    speech: "Questa è una delle parti più potenti del sistema: il controllo bidirezionale. Immaginate di dover cambiare la produzione da 'Bottiglie da 1 litro' a 'Bottiglie da mezzo litro'. Tradizionalmente, un operatore deve andare sulla console di ogni macchina e digitare a mano decine di parametri. Con il nostro software, basta selezionare la nuova ricetta dal cruscotto web e cliccare 'Invia'. I dati viaggiano via API, l'Edge Gateway scrive sul macchinari e la macchina si riconfigura da sola in un secondo."
  },

  // --- PARTE 4: TEMPO REALE E STRATO DI RETE CON SIGNALR ---
  {
    analogy: "Una telefonata sempre aperta rispetto all'invio di vecchie lettere cartacee.",
    title: "8. SignalR: Visualizzazione Dinamica in Tempo Reale",
    desc: "Per assicurare una visualizzazione immediata senza costringere l'utente a ricaricare continuamente la pagina, l'architettura sfrutta i WebSocket tramite SignalR. Viene stabilito un canale continuo e bidirezionale tra browser e backend: ogni pezzo prodotto o allarme termico viene 'spinto' istantaneamente sulla Dashboard.",
    points: [
      "Connessione persistente e asincrona full-duplex tra client e server.",
      "Aggiornamento reattivo dell'interfaccia utente (Angular 21) senza ricaricamento della pagina.",
      "Iniezione realtime delle righe di telemetria in cima alle tabelle di monitoraggio.",
      "Payload JSON ultraleggeri per non sovraccaricare la rete aziendale dello stabilimento."
    ],
    speech: "Se per vedere i dati aggiornati doveste cliccare continuamente su 'Aggiorna', questo non sarebbe un vero monitoraggio. Abbiamo usato SignalR per aprire una linea di comunicazione sempre attiva, come una telefonata. Non è il browser che chiede aggiornamenti, è il server che 'spinge' il dato appena la macchina si muove. Un millesimo di secondo dopo che un sensore rileva un pezzo prodotto, quel pezzo compare sul grafico del frontend."
  },
  {
    analogy: "Un negozio che spegne la cassa elettronica e accetta solo contanti quando salta la linea internet.",
    title: "9. Monitoraggio della Connessione: La Modalità Read-Only",
    desc: "In fabbrica la connettività può essere instabile. Se il canale SignalR perde colpi per problemi tecnici, l'applicazione entra in Read-Only Mode grazie a un AuthInterceptor. Tutte le operazioni di scrittura (POST, PUT, DELETE) vengono inibite a schermo e bloccate a livello HTTP per evitare l'invio di comandi corrotti.",
    points: [
      "Rilevamento istantaneo dello stato di connessione (connected, unstable, disconnected).",
      "Blocco preventivo automatico di tutte le chiamate HTTP di mutazione dati.",
      "Banner visivi di allerta ad alta visibilità inseriti in cima alla dashboard.",
      "Esenzione per gli utenti Administrator, che mantengono i permessi per gestioni di emergenza."
    ],
    speech: "Cosa succede se la rete wireless della fabbrica ha un calo improvviso mentre stiamo modificando una macchina? Potremmo fare danni. Per questo abbiamo implementato una modalità di protezione intelligente: la Read-Only Mode. Se la connessione diventa instabile, lo schermo mostra un banner di avviso e blocca istantaneamente tutti i pulsanti per inserire o modificare dati. Le chiamate HTTP vengono blindate all'origine per sicurezza. L'unica eccezione? L'Amministratore, che mantiene l'accesso per le emergenze."
  },
  {
    analogy: "Il blocco per appunti d'emergenza usato quando salta la corrente temporaneamente in ufficio.",
    title: "10. Resilienza Edge: Continuità logica in assenza di Rete",
    desc: "La robustezza dell'architettura si basa sull'Edge Computing. Se la rete esterna salta e il cloud diventa irraggiungibile, il modulo locale MES Edge Gateway (operante sulla rete LAN dell'azienda) isola la sessione ma non interrompe il monitoraggio, salvando la telemetria in un database aziendale protetto.",
    points: [
      "Decentramento dei processi di acquisizione (Edge Computing) vicini agli impianti fisici.",
      "Mantenimento attivo delle routine di acquisizione dati direttamente sulla rete aziendale.",
    ],
    speech: "Se internet si interrompe, la fabbrica deve continuare a produrre. Grazie all'Edge Computing, il nostro gateway posizionato fisicamente in stabilimento continua a lavorare anche se è completamente isolato dal server cloud centrale. Continua a parlare con i macchinari, raccoglie i dati dei pezzi e li mette al sicuro in un database aziendale. Zero perdite di dati, totale continuità operativa."
  },
  {
    analogy: "Prendere gli appunti presi al volo sul blocco note e ricopiarli con calma sul registro ufficiale.",
    title: "11. Lo Smart Sync: Riallineamento Post-Riconnessione",
    desc: "Al ripristino del collegamento, il modulo 'Smart Sync' gestisce la riconciliazione automatica. Rileva il ritorno online, riapre i canali SignalR e avvia un upload asincrono in background: preleva i record dal database aziendale , li organizza in pacchetti ottimizzati e li invia al cloud applicando un controllo di idempotenza.",
    points: [
      "Riconoscimento automatico del ripristino del collegamento di rete verso il cloud.",
      "Sincronizzazione asincrona e in background tramite pacchetti ottimizzati (Batch Upload).",
      "Rispetto rigoroso della marcatura temporale originale (Timestamp) generata a bordo macchina.",
      "Controllo di Idempotenza per evitare record duplicati o conflitti nel database centrale."
    ],
    speech: "E quando internet torna attivo? Nessun intervento umano richiesto. Il sistema se ne accorge da solo, ristabilisce la connessione con SignalR e avvia lo Smart Sync. Prende tutti i dati salvati nel database aziendale durante il blackout e li invia al database centrale in background, come se nulla fosse successo. Mantiene gli orari originali in cui i pezzi sono stati prodotti e usa un controllo di sicurezza per essere sicuro al 100% di non salvare due volte lo stesso dato."
  },

  // --- PARTE 5: PERSISTENZA E CRITERI DI EVOLUZIONE DEL SISTEMA ---
  {
    analogy: "Tenere gli attrezzi di oggi sul banco di lavoro e spostare i vecchi scatoloni in soffitta.",
    title: "12. Persistenza Ibrida: Strategia di Log",
    desc: "Il monitoraggio continuo produce milioni di record che rischiano di appesantire il database. Abbiamo implementato un servizio che elimina i dati storici oltre una data configurabile.",
    points: [
      "Esecuzione pianificata del worker negli orari morti (es. a mezzanotte) per non pesare sulla rete.",
      "Cancellazione ad alte prestazioni lato server tramite ExecuteDeleteAsync per azzerare l'uso di memoria.",
      "Retention dei log configurabile tramite appsettings.json (di default impostata a 7 giorni).",
      "Mantenimento costante della reattività e velocità di caricamento delle dashboard web."
    ],
    speech: "Milioni di righe di log al giorno possono mettere in ginocchio qualsiasi database, rallentando i grafici della nostra app. Per questo abbiamo sviluppato un addetto alle pulizie automatico: il Telemetry Cleanup Worker. Ogni notte, a mezzanotte, entra in azione in background. Prende tutti i dati vecchi, ad esempio quelli che hanno più di 7 giorni, e li cancella in modo ultrarapido direttamente sul server. In questo modo le tabelle restano leggere e i grafici del pannello si caricano sempre all'istante."
  },
  // --- PARTE 6: METODOLOGIA DI SVILUPPO (VIBECODING & AI AGENTS) ---
  {
    analogy: "Il direttore d'orchestra che esprime l'intenzione musicale e lascia ai musicisti professionisti l'esecuzione materiale delle note.",
    title: "13. Sviluppo Innovativo: L'Approccio Vibecoding",
    desc: "Per accelerare i cicli di prototipazione e rilascio di un'architettura complessa come MesIndustry, lo sviluppo è stato guidato tramite 'Vibecoding'. Questa metodologia sposta il focus del programmatore dalla scrittura manuale della singola riga di codice (sintassi, parentesi, boilerplate) alla direzione strategica di alto livello. Esprimendo i requisiti di business e i vincoli architetturali in linguaggio naturale, ci si concentra interamente sulla logica applicativa, sui flussi operativi e sulle interazioni tra sistemi.",
    points: [
      "Spostamento del focus dal 'come scrivere il codice' al 'cosa il software deve fare' (Intent-Driven Development).",
      "Abbattimento drastico dei tempi di boilerplate e configurazione iniziale dello stack.",
      "Validazione istantanea delle idee e feedback loop accelerato tra design e implementazione.",
      "Maggiore attenzione dedicata alla sicurezza, alla gestione dei guasti di rete e alle business logic."
    ],
    speech: "Durante questo progetto ho sperimentato un modo di sviluppare totalmente nuovo che sta rivoluzionando il settore: il Vibecoding. Invece di passare ore a scrivere manualmente codice ripetitivo o a impazzire dietro a una parentesi mancante, ho agito come un direttore d'orchestra. Io definivo la strategia, le regole di business e l'architettura a parole mie, descrivendo l'intenzione, mentre i modelli di IA generavano la struttura tecnica. Questo mi ha permesso di concentrarmi al 100% sulla logica di fabbrica, sulla sicurezza dei dati e sui flussi della telemetria, triplicando la velocità di sviluppo."
  },
  {
    analogy: "Un'agenzia di spedizioni dove ogni reparto (accettazione, logistica, dogana) ha un compito specifico e si scambia documenti standardizzati.",
    title: "14. Dietro le Quinte: Struttura ad Agenti e Workflow nel Vibecoding",
    desc: "Il Vibecoding non è una semplice chat sincrona, ma si basa su un'architettura a componenti specializzati (Agenti) guidati da flussi di lavoro (Workflow) rigidi. Ogni agente ha un ruolo verticale (es. esperto .NET 10, specialista Angular 21). Il workflow coordina le loro interazioni: un agente progetta le API, un secondo le implementa, un terzo scrive i test di carico e un supervisore valida il risultato finale prima del deployment.",
    image: '/slide14-workflow.jpg',
    imageSizeClass: 'max-h-[260px] sm:max-h-[320px]',
    points: [
      "Suddivisione dei compiti tra agenti software verticali e specializzati (Agentic Architecture).",
      "Workflow strutturati con passaggi sequenziali di revisione del codice (Chain of Thought).",
      "Isolamento degli errori grazie a micro-task focalizzati su singoli moduli dell'applicazione.",
      "Controllo umano costante (Human-in-the-Loop) per approvare o correggere le decisioni degli agenti."
    ],
    speech: "Ma come funziona davvero il Vibecoding dietro le quinte? Non è una bacchetta magica, si basa su un'architettura ad Agenti e Workflow. Immaginate un team di programmatori virtuali specializzati: c'è l'esperto di database PostgreSQL, lo specialista di Angular e l'auditor di sicurezza. Quando esprimevo un requisito, il Workflow orchestrata questi agenti in sequenza. Uno disegnava la struttura, l'altro scriveva il codice e il terzo lo testava per trovare bug. Il mio ruolo era quello di validare ogni passaggio, unendo la precisione metodologica dell'IA con la supervisione critica umana."
  },
  {
    analogy: "I progetti di espansione per una ferrovia che estende i propri binari verso nuove mete.",
    title: "15. Stato dello Sviluppo, Nuove Features e Conclusioni",
    desc: "L'architettura MesIndustry ha validato con successo lo scambio dati bidirezionale sicuro tra interfacce web e macchinari industriali su base .NET 10 e Angular 21. Con le fondamenta di monitoraggio e controllo ormai consolidate, lo sviluppo si sta concentrando sul tracciamento avanzato delle commesse e sull'ottimizzazione dei flussi di linea.",
    points: [
      "Validazione sul campo dei pattern scelti (Clean Architecture e approccio Multi-Tenant).",
      "Global Frontend Error Logging: un LogService intercetta i crash del browser e li salva nel DB centrale.",
      "Stabilità verificata dei canali realtime SignalR e della logica Edge di stabilimento.",
      "Studio di moduli futuri dedicati all'efficienza energetica e alla manutenzione predittiva degli impianti."
    ],
    speech: "Per concludere: dove siamo arrivati? Abbiamo sviluppato e validato un'architettura solida, moderna e reattiva. I test confermano che il dialogo bidirezionale tra il web e i macchinari industriali funziona egregiamente ed è sicuro. Inoltre abbiamo inserito un sistema che cattura gli errori del browser e li salva a database per facilitare la manutenzione. Ora che le fondamenta sono stabili, ci stiamo focalizzando sul tracciamento avanzato delle commesse e sulla produzione, pronti a estendere il sistema con moduli di manutenzione predittiva. Grazie per l'attenzione!"
  }
];