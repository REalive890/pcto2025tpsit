<?php
// Include la classe Logger per registrare eventi e errori nel sistema
require_once 'config/logger.php';
//-----------------------------------------------------------------------------------
/**
 * Classe User
 * 
 * Gestisce la registrazione, l'autenticazione e la lettura degli utenti dal database.
 */
class User {
    // Attributo privato che contiene l'oggetto PDO per la connessione al database
    private $db;

    // Attributo privato per gestire la scrittura dei log
    private $logger;

    /**
     * Costruttore della classe User
     * 
     * @param PDO $db Connessione PDO al database
     */
    public function __construct($db) {
        // Salva l'oggetto PDO nella proprietà privata per uso interno
        $this->db = $db;

        // Crea un nuovo oggetto Logger per registrare eventi relativi agli utenti
        $this->logger = new Logger("log/User.log");
    }
//-----------------------------------------------------------------------------------
    /**
     * Metodo: getAllUsers
     * Scopo: Restituisce tutti gli utenti registrati (solo ID ed email)
     * Parametri: Nessuno
     * Ritorno: array associativo contenente gli utenti oppure array vuoto in caso di errore
     */
    public function getAllUsers() {
        try {
            // Prepara la query SQL per ottenere ID ed email di tutti gli utenti
            $stmt = $this->db->prepare("SELECT id, email FROM users");
            // Esegue la query sul database
            $stmt->execute();
            // Restituisce i risultati come array associativo
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Registra l'errore nel file di log in caso di eccezione PDO
            $this->logger->error("Errore DB in getAllUsers: " . $e->getMessage());

            // Ritorna un array vuoto in caso di errore
            return [];
        }
    }
//-----------------------------------------------------------------------------------
    /**
     * Metodo: createUser
     * Scopo: Registra un nuovo utente nel database dopo averne verificato la validità
     * Parametri:
     *  - string $email: Email dell’utente
     *  - string $password: Password in chiaro da cifrare
     * Ritorno: true se la creazione va a buon fine, false altrimenti
     */
    public function createUser($email, $password,$username) {
        try {
            // Controlla che l'email sia in un formato valido
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                // Genera un'eccezione se l'email è malformata
                throw new Exception("Email non valida.");
            }

            // Verifica che la password sia lunga almeno 6 caratteri
            if (strlen($password) < 6) {
                // Lancia un'eccezione se la password è troppo corta
                throw new Exception("Password troppo corta (minimo 6 caratteri).");
            }

            // Prepara la query per controllare se l'email è già presente nel database
            $checkStmt = $this->db->prepare("SELECT id FROM utenti WHERE email = ?");

            // Esegue la query con l'email fornita come parametro
            $checkStmt->execute([$email]);

            // Se esiste già almeno un record con quell'email, solleva un'eccezione
            if ($checkStmt->rowCount() > 0) {
                throw new Exception("Email già registrata.");
            }

            // Prepara la query per inserire un nuovo utente con email e password
            $stmt = $this->db->prepare("INSERT INTO utenti (email, password_hash,username) VALUES (?, ?,?)");

            // Cifra la password in chiaro usando l'algoritmo predefinito
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Esegue l'inserimento del nuovo utente nel database
            $stmt->execute([$email, $hashedPassword, $username]);

            // Scrive un messaggio nel log per indicare il successo della registrazione
            $this->logger->info("Utente registrato con successo: $email");

            // Ritorna true per indicare il buon esito dell'operazione
            return true;
        } catch (PDOException $e) {
            // Registra nel log un errore specifico del database
            $this->logger->error("Errore DB in createUser: " . $e->getMessage());

            // Ritorna false in caso di errore del database
            return false;
        } catch (Exception $e) {
            // Registra nel log un errore generico (es. email o password non valide)
            $this->logger->error("Errore in createUser: " . $e->getMessage());

            // Ritorna false in caso di errore
            return false;
        }
    }
//-----------------------------------------------------------------------------------
    /**
     * Metodo: login
     * Scopo: Autentica un utente confrontando email e password
     * Parametri:
     *  - string $email: Email dell’utente
     *  - string $password: Password in chiaro
     * Ritorno: true se il login ha successo, false altrimenti
     */
    public function login($email, $password) {
        try {
            // Verifica che il formato dell'email sia valido
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                // Lancia eccezione se il formato è errato
                throw new Exception("Formato email non valido.");
            }

            // Prepara la query per cercare un utente con l'email fornita
            $stmt = $this->db->prepare("SELECT id, password_hash FROM utenti WHERE email = ?");

            // Esegue la query
            $stmt->execute([$email]);

            // Se non ci sono utenti con quell'email, registra il tentativo fallito e ritorna false
            if ($stmt->rowCount() === 0) {
                $this->logger->info("Tentativo di login fallito (email non esistente): $email");
                return false;
            }

            // Recupera l’utente come array associativo
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Confronta la password inserita con quella salvata nel database
            if (password_verify($password, $user['password_hash'])) {
                // Se la sessione non è già attiva, la avvia
                if (session_status() !== PHP_SESSION_ACTIVE) {
                    session_start();
                }

                // Salva l'ID e l'email dell'utente nella sessione
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $email;

                // Registra nel log il successo del login
                $this->logger->info("Login effettuato con successo: $email");

                // Ritorna true per indicare il successo del login
                return true;
            } else {
                // Se la password è errata, registra il tentativo fallito nel log
                $this->logger->info("Tentativo di login fallito (password errata): $email");
                return false;
            }
        } catch (PDOException $e) {
            // Registra un errore del database
            $this->logger->error("Errore DB in login: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            // Registra un errore generico
            $this->logger->error("Errore in login: " . $e->getMessage());
            return false;
        }
    }
}
?>