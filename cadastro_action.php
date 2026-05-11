<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $cpf = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
    $phone = $_POST['phone'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($email) || empty($cpf) || empty($password)) {
        die("Por favor, preencha todos os campos obrigatórios.");
    }

    // Hash da senha para segurança
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, cpf, phone, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $cpf, $phone, $hashed_password]);
        
        echo "<script>alert('Cadastro realizado com sucesso!'); window.location.href='index.php';</script>";
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            die("Erro: E-mail ou CPF já cadastrado.");
        }
        die("Erro ao cadastrar: " . $e->getMessage());
    }
}
?>
