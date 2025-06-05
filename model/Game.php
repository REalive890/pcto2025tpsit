<?php
/*
 *  # 	Name             	Type 	        Collation 	        Default 	    
 *	1 	id                  Primary int(11) No 	                AUTO_INCREMENT 	 	
 *	2 	titolo           	varchar(255) 	utf8mb4_general_ci  None 			 	
 *	3 	piattaforma         varchar(100) 	utf8mb4_general_ci  None 			 	
 *	4 	genere           	varchar(100) 	utf8mb4_general_ci  None 			 	
 *	5 	immagine            varchar(255) 	utf8mb4_general_ci  NULL 			 	
 *	6 	data_inserimento    timestamp 		No 	                current_timestamp() 	
 */

class Game {
    private $db;
    public function __construct($db) {
        $this->db = $db;
    }
    public function create_user($titolo, $piattaforma, $genere, $immagine = null) {
        try {
            $stmt = $this->db->prepare("INSERT INTO giochi (titolo, piattaforma, genere, immagine) VALUES (?, ?, ?, ?)");
            $stmt->execute([$titolo, $piattaforma, $genere, $immagine]);
            return true;
        } catch (PDOException $e) {
            // Optionally log error
            return false;
        }
    }
}

?>