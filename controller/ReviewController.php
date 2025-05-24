<?php
class ReviewController {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getReviewsById($id) {
        $stmt = $this->pdo->prepare('SELECT * FROM recensioni WHERE id_gioco = ?');
        $stmt->execute([$id]);
        // Fetch all reviews for the specified game ID
        return $stmt->fetchAll();

    }
}
?>
