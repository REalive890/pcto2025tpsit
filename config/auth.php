<?php
    // Importa la classe Logger per la gestione dei log
    require_once 'config/logger.php';

    // Verifica se la sessione non è già attiva, e nel caso la avvia
    if (session_status() === PHP_SESSION_NONE) {
        session_start(); // Avvia la sessione PHP per accedere a $_SESSION
    }

    // Inizializza un logger per scrivere nel file "auth.log"
    $logger = new Logger("log/auth.log");

    // Verifica se l'utente è autenticato (cioè se esiste 'user_id' nella sessione)
    if (!isset($_SESSION['user_id'])) {
        // Scrive un avviso nel log in caso di accesso non autorizzato
        $logger->warning('Access not allowed without login');

        // Imposta un messaggio di errore da mostrare all’utente nella prossima pagina
        $_SESSION['error'] = 'Devi essere autenticato per accedere.';

        // Reindirizza l’utente alla pagina di login
        header("Location: router.php?action=login");

        // Termina l’esecuzione dello script per prevenire ulteriori output
        exit();
    }
?>