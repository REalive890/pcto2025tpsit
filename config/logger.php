<?php
/**
 * Classe Logger
 * Scopo: Gestione dei messaggi di log su file con livelli (info, warning, error), controllo sul percorso e supporto a directory dinamiche.
 */
class Logger {
    private $logFile;                            // Percorso del file di log da utilizzare
    private $validLevels = ['info', 'warning', 'error']; // Livelli di log ammessi

    /**
     * Metodo: __construct
     * Scopo: Imposta il file di log, crea la directory se non esiste
     * Parametri:
     *  - string $filename: percorso del file di log
     * Ritorno: Nessuno
     */
    public function __construct($filename = "log/default.log") {
        $this->logFile = $filename;     // Imposta il percorso del file di log
        $logDir = dirname($filename);  // Estrae il nome della directory dal percorso

        if (!file_exists($logDir)) {    // Verifica se la directory esiste
            mkdir($logDir, 0775, true); // La crea ricorsivamente con permessi 0775 se non esiste
        }

        if (!is_writable($logDir)) {              // Verifica che la directory sia scrivibile
            throw new RuntimeException("Directory non scrivibile: $logDir"); // Se non lo è, lancia eccezione
        }
    }

    /**
     * Metodo: log
     * Scopo: Scrive un messaggio di log con livello e timestamp
     * Parametri:
     *  - string $level: livello del messaggio (info, warning, error)
     *  - string $message: contenuto del messaggio
     * Ritorno: Nessuno
     */
    public function log($level, $message) {
        $level = strtolower($level); // Converte il livello in minuscolo per uniformità

        if (!in_array($level, $this->validLevels)) { // Verifica che il livello sia tra quelli validi
            throw new InvalidArgumentException("Livello di log non valido: $level"); // Altrimenti, lancia eccezione
        }

        $timeStamp = date("Y-m-d H:i:s"); // Ottiene il timestamp corrente
        // Prepara il messaggio di log con timestamp, livello e contenuto
        $logMessage = sprintf("[%s] %s: %s\n", $timeStamp, strtoupper($level), $message);
        // Scrive il messaggio nel file log (flag 3 = append)
        error_log($logMessage, 3, $this->logFile);
    }

    /**
     * Metodo: error
     * Scopo: Scrive un messaggio di errore
     * Parametri:
     *  - string $message: contenuto del messaggio
     * Ritorno: Nessuno
     */
    public function error($message) {
        $this->log('error', $message); // Inoltra la chiamata al metodo log con livello 'error'
    }

    /**
     * Metodo: warning
     * Scopo: Scrive un messaggio di warning
     * Parametri:
     *  - string $message: contenuto del messaggio
     * Ritorno: Nessuno
     */
    public function warning($message) {
        $this->log('warning', $message); // Inoltra la chiamata al metodo log con livello 'warning'
    }

    /**
     * Metodo: info
     * Scopo: Scrive un messaggio informativo
     * Parametri:
     *  - string $message: contenuto del messaggio
     * Ritorno: Nessuno
     */
    public function info($message) {
        $this->log('info', $message); // Inoltra la chiamata al metodo log con livello 'info'
    }
}
?>
