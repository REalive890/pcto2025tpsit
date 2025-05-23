<?php
$pdo = new PDO('mysql:host=localhost;dbname=pcto_videogiochi;charset=utf8', 'root', '', [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);


header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'showImmages':
        $stmt = $pdo->prepare('SELECT immagine FROM giochi');
        $stmt->execute();
        $images= $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($images);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
} ?>