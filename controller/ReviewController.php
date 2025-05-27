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
    public function addReview($id_game, $review, $rating, $user_id) {
        // Prepare the SQL statement to insert a new review
        $stmt = $this->pdo->prepare('INSERT INTO recensioni (id_utente, id_gioco, voto, commento) VALUES (?, ?, ?, ?)');
        // Execute the statement with the provided parameters
        $success = $stmt->execute([$user_id, $id_game, $rating, $review]);
        return [
            "success" => $success,
            "message" => $success ? "Review added successfully." : "Failed to add review."
        ];
    }

    public function getUserReviewsById($user_id) {
        $stmt = $this->pdo->prepare('SELECT * FROM recensioni WHERE id_utente = ?');
        $stmt->execute([$user_id]);
        // Fetch all reviews for the specified user ID
        return $stmt->fetchAll();
    }
    public function editReview($id_review, $comment, $rating, $user_id) {
        // Only allow editing if the review belongs to the user
        $stmt = $this->pdo->prepare('UPDATE recensioni SET commento = ?, voto = ? WHERE id = ? AND id_utente = ?');
        $success = $stmt->execute([$comment, $rating, $id_review, $user_id]);
        return [
            "success" => $success,
            "message" => $success ? "Review updated successfully." : "Failed to update review."
        ];
    }
    public function deleteReview($id_review, $user_id) {
        // Only allow deleting if the review belongs to the user
        $stmt = $this->pdo->prepare('DELETE FROM recensioni WHERE id = ? AND id_utente = ?');
        $success = $stmt->execute([$id_review, $user_id]);
        return [
            "success" => $success,
            "message" => $success ? "Review deleted successfully." : "Failed to delete review."
        ];
    }
}
?>
