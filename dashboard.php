<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}
require_once 'db_config.php';

// Buscar dados do usuário
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Projeto Milhão</title>
    <link rel="stylesheet" href="static/agrofund.css">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .balance-card { background: #16A34A; color: white; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center; }
        .balance-card h2 { margin: 0; font-size: 2rem; }
        .actions { margin-top: 20px; display: flex; gap: 10px; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; color: white; font-weight: bold; }
        .btn-deposit { background: #16A34A; }
        .btn-withdraw { background: #DC2626; }
        .btn-logout { background: #64748B; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Olá, <?php echo htmlspecialchars($user['name']); ?>!</h1>
            <a href="logout.php" class="btn btn-logout">Sair</a>
        </div>

        <div class="balance-card">
            <p>Saldo Disponível</p>
            <h2>R$ <?php echo number_format($user['balance'], 2, ',', '.'); ?></h2>
        </div>

        <div class="actions">
            <a href="pagamento.php" class="btn btn-deposit">Depositar</a>
            <a href="#" class="btn btn-withdraw">Sacar</a>
        </div>

        <div style="margin-top: 30px;">
            <h3>Seus Investimentos</h3>
            <p>Você ainda não possui investimentos ativos.</p>
        </div>
    </div>
</body>
</html>
