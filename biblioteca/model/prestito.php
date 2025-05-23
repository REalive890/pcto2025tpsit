<?php
class Prestito {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getByStudente($id) {
        $stmt = $this->pdo->prepare('SELECT * FROM prestiti WHERE idStudente = ?');
        $stmt->execute([$id]);
        return $stmt->fetchAll();
    }

    public function update($data) {
        $stmt = $this->pdo->prepare('UPDATE prestiti SET dataRestituzione = ?, restituito = ? WHERE idPrestito = ?');
        return $stmt->execute([$data['dataRestituzione'], $data['restituito'], $data['idPrestito']]);
    }

    public function countNonRestituiti($id) {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS totale FROM prestiti WHERE idStudente = ? AND restituito = 0');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}
?>