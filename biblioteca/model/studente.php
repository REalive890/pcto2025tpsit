<?php
class Studente {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAll() {
        $stmt = $this->pdo->query('SELECT * FROM studenti');
        return $stmt->fetchAll();
    }
}
?>