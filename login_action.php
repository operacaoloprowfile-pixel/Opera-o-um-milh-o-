<?php
session_start();
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $login = $_POST['login'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($login) || empty($password)) {
        die("Por favor, preencha todos os campos.");
    }

    try {
        // Busca por e-mail ou CPF
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR cpf = ?");
        $stmt->execute([$login, $login]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            header("Location: dashboard.php");
            exit();
        } else {
            echo "<script>alert('E-mail/CPF ou senha incorretos.'); window.location.href='index.php';</script>";
        }
    } catch (PDOException $e) {
        die("Erro ao fazer login: " . $e->getMessage());
    }
}
?>
