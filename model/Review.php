<?php
    require_once 'config/logger.php';
    class Review{
        //this is the data schema
        /*
            # 	Name 	            Type 	         	        Null 	Default 	
            1   id Primary 	        int(11) identity(1,1) 	    No 	    None 		 	
            2 	id_utente           Index 	int(11) 	        No 	    None 			 	
            3 	id_gioco            Index 	int(11) 	        No 	    None 			 	
            4 	voto 	            tinyint(4) 			        Yes 	NULL
            5 	commento 	        text(utf8mb4_general_ci) 	    Yes 	NULL 			 	
            6 	data_recensione 	timestamp 			        No 	    current_timestamp() 	
        */
        private $db;
        private $logger;
        public function __construct($_db){
            $this->db = $_db;
            $this->logger = new Logger("log/Review.log");
        }
        public function log($message){
            $this->logger->info($message);
        }
        public function create($id_utente, $id_gioco, $voto, $commento){
            try {
                $stmt = $this->db->prepare("INSERT INTO recensioni (id_utente, id_gioco, voto, commento) VALUES (?, ?, ?, ?)");
                $stmt->execute([$id_utente, $id_gioco, $voto, $commento]);
                return true;
            } catch (PDOException $e) {
                $this->log("Errore DB in create: " . $e->getMessage());
                return false;
            }
        }
        public function read($id){
            try {
                $stmt = $this->db->prepare("SELECT * FROM recensioni WHERE id = ?");
                $stmt->execute([$id]);
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                $this->log("Errore DB in read: " . $e->getMessage());
                return null;
            }
        }
        public function read_all(){
            try {
                $stmt = $this->db->query("SELECT * FROM recensioni");
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                $this->log("Errore DB in read_all: " . $e->getMessage());
                return null;
            }
        }
        public function update($id, $voto, $commento){
            try {
                $stmt = $this->db->prepare("UPDATE recensioni SET voto = ?, commento = ? WHERE id = ?");
                $stmt->execute([$voto,$commento, $id]);
                return true;
            } catch (PDOException $e) {
                $this->log("Errore DB in update: " . $e->getMessage());
                return false;
            }
        }
        public function delete($id){
            try {
                $stmt = $this->db->prepare("DELETE FROM recensioni WHERE id = ?");
                $stmt->execute([$id]);
                return true;
            } catch (PDOException $e) {
                $this->log("Errore DB in delete: " . $e->getMessage());
                return false;
            }
        }
    }


?>


