<?php

require_once 'controller/studenteController.php';
require_once 'controller/prestitoController.php';

header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getStudenti':
        $controller = new StudenteController($pdo);
        echo json_encode($controller->getAll());
        break;

    case 'getPrestiti':
        $ctrl = new PrestitoController($pdo);
        echo json_encode($ctrl->getByStudente($_GET['id']));
        break;

    case 'updatePrestito':
        $ctrl = new PrestitoController($pdo);
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(['success' => $ctrl->update($data)]);
        break;

    case 'nonRestituiti':
        $ctrl = new PrestitoController($pdo);
        echo json_encode($ctrl->countNonRestituiti($_GET['id']));
        break;
} ?>