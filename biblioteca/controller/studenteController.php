<?php
require_once 'model/studente.php';
require_once 'config/db.php';

class StudenteController {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAll() {
        $model = new Studente($this->pdo);
        return $model->getAll();
    }
}
?>