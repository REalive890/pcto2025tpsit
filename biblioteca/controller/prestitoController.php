<?php
require_once 'model/prestito.php';

class PrestitoController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getByStudente($id) {
        $model = new Prestito($this->pdo);
        return $model->getByStudente($id);
    }

    public function update($data) {
        $model = new Prestito($this->pdo);
        return $model->update($data);
    }

    public function countNonRestituiti($id) {
        $model = new Prestito($this->pdo);
        return $model->countNonRestituiti($id);
    }
}
?>