<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

/**
 * CONFIGURAÇÃO DA API DE PAGAMENTO
 * Altere as funções abaixo para integrar com o seu gateway (SuitPay, DigitoPay, etc.)
 */

function gerarPix($valor, $userId) {
    // AQUI VOCÊ COLOCA A LÓGICA DA SUA API
    // Exemplo de retorno fictício:
    return [
        'qrcode' => '00020126580014BR.GOV.BCB.PIX0136suachavepixaqui...',
        'copia_cola' => '00020126580014BR.GOV.BCB.PIX0136suachavepixaqui...',
        'txid' => 'TX' . time()
    ];
}

$pix = null;
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $valor = $_POST['valor'] ?? 0;
    if ($valor >= 20) {
        $pix = gerarPix($valor, $_SESSION['user_id']);
    } else {
        $erro = "O valor mínimo para depósito é R$ 20,00";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Depósito PIX - Projeto Milhão</title>
    <link rel="stylesheet" href="static/agrofund.css">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        .container { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .btn { width: 100%; padding: 12px; background: #16A34A; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
        .pix-box { background: #f9f9f9; padding: 15px; border: 1px dashed #16A34A; margin-top: 20px; text-align: center; }
        .qrcode { width: 200px; height: 200px; background: #eee; margin: 10px auto; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Depositar via PIX</h2>
        <p>Informe o valor que deseja depositar (Mínimo R$ 20,00)</p>
        
        <?php if (isset($erro)): ?>
            <p style="color: red;"><?php echo $erro; ?></p>
        <?php endif; ?>

        <form method="POST">
            <input type="number" name="valor" placeholder="Valor R$" min="20" step="0.01" required>
            <button type="submit" class="btn">GERAR PIX</button>
        </form>

        <?php if ($pix): ?>
            <div class="pix-box">
                <h3>PIX Gerado com Sucesso!</h3>
                <div class="qrcode">
                    <!-- Aqui você pode usar uma API de QR Code ou mostrar o texto -->
                    <p>QR Code aqui</p>
                </div>
                <p><strong>Copia e Cola:</strong></p>
                <textarea style="width: 100%; height: 60px; font-size: 12px;" readonly><?php echo $pix['copia_cola']; ?></textarea>
                <button class="btn" onclick="alert('Copiado!')">COPIAR CÓDIGO</button>
            </div>
        <?php endif; ?>

        <br>
        <a href="dashboard.php" style="display: block; text-align: center; color: #666;">Voltar ao Dashboard</a>
    </div>
</body>
</html>
