<?php
class GameController {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getAllGames() {
        $stmt = $this->pdo->query('SELECT id, titolo, genere, immagine, piattaforma, data_inserimento FROM giochi');
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}
?>
