<?php

require_once 'config/db.php'; // Assuming you have a database connection file
require_once 'controller/gameController.php'; // Assuming you have a GameController
require_once 'controller/ReviewController.php'; // Assuming you have a GameController

header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getGames':
        $controller = new GameController($pdo); // Assuming you have a GameController
        echo json_encode($controller->getAllGames());
        break;
    case 'getReviews':
        $controller = new ReviewController($pdo); // Assuming you have a GameController
        echo json_encode($controller->getReviewsById($_GET['id_game']));
        break;
}
?>
