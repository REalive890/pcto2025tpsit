<?php
require_once 'model/Game.php';
class GameController {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getAllGames() {
        $stmt = $this->pdo->query('SELECT id, titolo, genere, immagine, piattaforma, data_inserimento FROM giochi');
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
    public function createGame($genere,$immagine,$piattaforma,$titolo){
        $stmt = $this->pdo->prepare('INSERT INTO GIOCHI (genere,immagine,piattaforma,titolo) VALUES(?,?,?,?);');
        $success=$stmt->execute([$genere,$immagine,$piattaforma,$titolo]);
        return[
            'success'=> $success,
            "message" => $success ? "Game added successfully." : "Failed to add Game."
        ];
    }
public function updateGame($id, $data_inserimento, $genere, $immagine, $piattaforma, $titolo) {
    $stmt = $this->pdo->prepare('UPDATE giochi SET data_inserimento = ?, genere = ?, immagine = ?, piattaforma = ?, titolo = ? WHERE id = ?');
    $success = $stmt->execute([$data_inserimento, $genere, $immagine, $piattaforma, $titolo, $id]);
    return [
        "success" => $success,
        "message" => $success ? "Game updated successfully." : "Failed to update game."
    ];
}
public function create_game($data) {
    $gameModel = new Game($this->pdo);
    $success = $gameModel->create_user(
        $data['titolo'],
        $data['piattaforma'],
        $data['genere'],
        $data['immagine'] ?? null
    );
    return [
        'success' => $success,
        'message' => $success ? "Game created successfully." : "Failed to create game."
    ];
}
}
?>
