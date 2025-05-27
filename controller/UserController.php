<?php
// Importa la classe User (modello) e la classe Logger per la gestione degli utenti e del logging
require_once 'model/User.php';
require_once 'config/logger.php';

// Definizione della classe UserController che gestisce le richieste relative agli utenti
class UserController {
    private $db;           // Connessione al database (oggetto PDO)
    private $userModel;    // Istanza del modello User per accedere ai metodi legati agli utenti
    private $logger;       // Logger per scrivere informazioni e errori su file
    //--------------------------------------------------------------------------------------------------------------
    /**
     * Metodo: __construct  
     * Scopo: Inizializza il controller con il modello User e il logger  
     * Parametri:  
     *  - PDO $dbConnection: connessione al database  
     * Ritorno: Nessuno  
     */
    public function __construct($dbConnection) {
        $this->db = $dbConnection;                              // Salva la connessione PDO in una proprietà
        $this->userModel = new User($dbConnection);             // Inizializza il modello User con la connessione
        $this->logger = new Logger("log/userController.log");   // Inizializza il logger specifico per il controller utente
    }
    //--------------------------------------------------------------------------------------------------------------
    /**
     * Metodo: loginUser  
     * Scopo: Gestisce il login dell'utente e imposta la sessione  
     * Parametri: Nessuno (usa $_POST)  
     * Ritorno: array con esito e messaggio  
     */
    public function login() {
        try {
            // Verifica se la richiesta HTTP è di tipo POST
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                
                $data = json_decode(file_get_contents("php://input"), true) ?? [];
                $email = $data['email'] ?? null;
                $password = $data['password'] ?? null;
                // Sanifica l’email e la password ricevute tramite POST
                $email = filter_var($email, FILTER_SANITIZE_EMAIL);
                $password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');

                // Controlla che l’email sia valida e che la password non sia vuota
                if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
                    throw new Exception("Credenziali non valide.");
                }
                // Tenta il login con il modello utente
                if ($this->userModel->login($email, $password)) {
                    // Registra nel log un messaggio di successo
                    $this->logger->info("$email Login Success");
                    
                    //return ['success' => true, 'message' => 'Login effettuato con successo'];
                    echo json_encode(["success" => true, "message" => "Login Success", "data" => ["user_id" => $_SESSION["user_id"]]]);
                    
                    exit;
                } else {
                    // Se il login fallisce, lancia un'eccezione
                    throw new Exception("Tentativo di login fallito per $email");
                }
            } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
                // Se si tratta di una richiesta GET, ritorna messaggio generico per la pagina login
                
                // return ['success' => false, 'message' => 'Visualizzazione pagina login'];
                echo json_encode(['success' => false, 'message' => 'Login Page']);
                
                exit; 
            }
        } catch (Exception $e) {
            // Registra l'errore nel file di log
            $this->logger->error($e->getMessage());
            // Imposta un messaggio d’errore di sessione
            $_SESSION['error'] = 'Errore interno del server';
            // Ritorna un array con messaggio d’errore generico
            
            //return ['success' => false, 'message' => 'Errore durante il login.'];
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            
            exit;
        }
    }
    //--------------------------------------------------------------------------------------------------------------
    /**
     * Metodo: registerUser  
     * Scopo: Registra un nuovo utente nel sistema  
     * Parametri: Nessuno (usa $_POST)  
     * Ritorno: array con esito e messaggio  
     */
    public function register() {
    try {
        // Verifica se la richiesta HTTP è di tipo POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $data = json_decode(file_get_contents("php://input"), true) ?? [];
            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;
            $username = $data['username'] ?? null;

            // Sanifica l’email e la password ricevute da form POST
            $email = filter_var($email, FILTER_SANITIZE_EMAIL);
            $password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');
            $username = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');

            // Verifica che l'email sia valida e la password sia lunga almeno 6 caratteri
            if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
                throw new Exception("Email o password non validi.");
            }

            // Validazione del nome utente
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
                throw new Exception("Nome utente non valido. Sono ammessi solo lettere, numeri e underscore.");
            }

            // Prova a creare un nuovo utente
            if ($this->userModel->createUser($email, $password, $username)) {
                // Se la registrazione ha successo, registra l’evento
                $this->logger->info("$email Register Success");
                echo json_encode(['success' => true, 'message' => 'Register Success']);
                exit;
            } else {
                // In caso di errore, lancia un'eccezione
                throw new Exception("Registrazione fallita per $email");
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Se è una GET, presumibilmente visualizzazione pagina registrazione
            echo json_encode(['success' => false, 'message' => 'Register Page']);
            exit;
        }
    } catch (Exception $e) {
        // Log dell’errore e gestione sessione
        $this->logger->error($e->getMessage());
        $_SESSION['error'] = 'Errore interno del server';
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

    //--------------------------------------------------------------------------------------------------------------
    public function logout() {
        session_unset(); // svuota $_SESSION
        session_destroy(); // distrugge la sessione
    
        echo json_encode([
            'success' => true,
            'message' => 'Logout effettuato correttamente'
        ]);
    }
}
