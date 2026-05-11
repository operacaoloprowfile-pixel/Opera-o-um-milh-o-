<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}
require_once 'db_config.php';
require_once 'functions.php';

$user = getUserData($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel - Projeto Milhão</title>
    <link rel="stylesheet" href="static/agrofund.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: #F0FDF4; font-family: 'Inter', sans-serif; margin: 0; padding-bottom: 80px; }
        .top-bar { background: #16A34A; color: white; padding: 20px; text-align: center; border-radius: 0 0 20px 20px; }
        .balance-container { background: white; margin: -30px 20px 20px; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; }
        .balance-label { color: #64748B; font-size: 0.9rem; }
        .balance-value { font-size: 1.8rem; font-weight: 800; color: #0F172A; margin: 5px 0; }
        .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 0 20px; }
        .btn-action { padding: 15px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none; }
        .btn-deposit { background: #16A34A; color: white; }
        .btn-withdraw { background: white; color: #16A34A; border: 1px solid #16A34A; }
        .section-title { padding: 20px; font-weight: 800; color: #0F172A; }
        .plan-card { background: white; margin: 0 20px 15px; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .bottom-nav { position: fixed; bottom: 0; width: 100%; background: white; display: flex; justify-content: space-around; padding: 15px 0; border-top: 1px solid #E2E8F0; }
        .nav-item { color: #94A3B8; text-decoration: none; text-align: center; font-size: 0.7rem; }
        .nav-item.active { color: #16A34A; }
        .nav-item i { font-size: 1.2rem; display: block; margin-bottom: 4px; }
    </style>
</head>
<body>
    <div class="top-bar">
        <div style="font-weight: 800;">PROJETO MILHÃO</div>
    </div>

    <div class="balance-container">
        <div class="balance-label">Saldo Disponível</div>
        <div class="balance-value">R$ <?php echo number_format($user['balance'], 2, ',', '.'); ?></div>
        <div style="font-size: 0.8rem; color: #16A34A;">+ R$ <?php echo number_format($user['bonus_balance'], 2, ',', '.'); ?> bônus</div>
    </div>

    <div class="action-buttons">
        <a href="pagamento.php" class="btn-action btn-deposit">
            <i class="fa-solid fa-plus"></i> DEPOSITAR
        </a>
        <a href="#" class="btn-action btn-withdraw">
            <i class="fa-solid fa-wallet"></i> SACAR
        </a>
    </div>

    <div class="section-title">Mercado de Investimentos</div>
    
    <?php
    $stmt = $pdo->query("SELECT * FROM plans");
    while ($plan = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo '
        <div class="plan-card">
            <div>
                <div style="font-weight: 700;">'.$plan['name'].'</div>
                <div style="font-size: 0.8rem; color: #64748B;">Rendimento: R$ '.number_format($plan['daily_profit'], 2, ',', '.').'/dia</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 800; color: #16A34A;">R$ '.number_format($plan['price'], 2, ',', '.').'</div>
                <button style="background: #16A34A; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.7rem; margin-top: 5px;">INVESTIR</button>
            </div>
        </div>';
    }
    ?>

    <nav class="bottom-nav">
        <a href="dashboard.php" class="nav-item active"><i class="fa-solid fa-house"></i>Início</a>
        <a href="#" class="nav-item"><i class="fa-solid fa-chart-line"></i>Investir</a>
        <a href="#" class="nav-item"><i class="fa-solid fa-users"></i>Equipe</a>
        <a href="logout.php" class="nav-item"><i class="fa-solid fa-user"></i>Sair</a>
    </nav>
</body>
</html>
