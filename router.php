<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'config/db.php'; // Assuming you have a database connection file
require_once 'controller/gameController.php'; // Assuming you have a GameController
require_once 'controller/ReviewController.php'; // Assuming you have a GameController
require_once 'controller/UserController.php'; // Assuming you have a GameController
require_once 'config/logger.php';

header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

switch ($action) {
      // ==== USER ====
    case 'login':
        $controller = new UserController($pdo);
        $controller->login();
        break;
    case 'register':
        $controller = new UserController($pdo);
        $controller->register();
        break;

    case 'logout':
        $controller = new UserController($pdo);
        $controller->logout();
        break;
    // ==== GAME & REVIEWS ====
    case 'getGames':
        $controller = new GameController($pdo); // Assuming you have a GameController
        $controller->getAllGames();
        break;
    case 'review_read_all':
        $controller = new ReviewController($pdo); // Assuming you have a GameController
        $controller->read_all();
        break;
    case 'deleteReviewAdmin':
        $controller = new ReviewController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        // id_review comes from the JS
        echo json_encode($controller->deleteReview($data['id_review'], $data['id_utente']));
        break;
    case 'editReviewAdmin':
        require_once 'config/auth.php'; // Ensure user is authenticated
        $controller = new ReviewController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        // id_review, comment, rating come from the JS
        echo json_encode($controller->editReview($data['id_review'], $data['comment'], $data['rating'], $data['user_id']));
        break;
    case 'review_read_game':
        $controller = new ReviewController($pdo); // Assuming you have a GameController
        $controller->read_game($_GET['id_game']);
        break;
    case 'getMyReviews':
        $controller = new ReviewController($pdo); // Assuming you have a GameController
        echo json_encode(['success' => true, 'data' => $controller->getUserReviewsById($_SESSION['user_id'])]);
        break;
    case 'addReview':
        require_once 'config/auth.php'; // Ensure user is authenticated
        $controller = new ReviewController($pdo);
        $logger = new Logger('log/test.log');
        $data = json_decode(file_get_contents('php://input'), true);
        $logger->info("Adding review ". $data['review'] ." for game ID: " . $data['id_game'] . " with rating: " . $data['rating']);
        echo json_encode($controller->addReview($data['id_game'], $data['review'], $data['rating'], $_SESSION['user_id']));
        break;
    case 'editReview':
        require_once 'config/auth.php'; // Ensure user is authenticated
        $controller = new ReviewController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        // id_review, comment, rating come from the JS
        echo json_encode($controller->editReview($data['id_review'], $data['comment'], $data['rating'], $_SESSION['user_id']));
        break;
    case 'deleteReview':
        require_once 'config/auth.php'; // Ensure user is authenticated
        $controller = new ReviewController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        // id_review comes from the JS
        echo json_encode($controller->deleteReview($data['id_review'], $_SESSION['user_id']));
        break;
    case 'admin_update_game':
        require_once 'config/auth.php';
        $controller= new GameController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($controller->updateGame($data['idGame'],$data['data_inserimento'],$data['genere'],$data['immagine'],$data['piattaforma'],$data['titolo']));
        break;

}
?>
