<?php
require_once 'db_config.php';

function getUserData($userId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getBalance($userId) {
    $user = getUserData($userId);
    return $user['balance'] ?? 0;
}

function addTransaction($userId, $type, $amount, $status, $description) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, ?, ?, ?, ?)");
    return $stmt->execute([$userId, $type, $amount, $status, $description]);
}

// Placeholder para futura integração de API de Pagamento
function processarPagamento($valor, $metodo) {
    // Aqui você integrará sua SuitPay, DigitoPay, etc.
    return [
        'success' => true,
        'message' => 'Integração pendente',
        'qr_code' => 'LINK_DO_QRCODE_AQUI',
        'pix_copia_cola' => 'PIX_COPIA_COLA_AQUI'
    ];
}
?>
