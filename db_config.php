<?php
// Configurações do Banco de Dados
$host = 'localhost';
$dbname = 'projeto_milhao';
$username = 'root'; // Altere para o seu usuário do banco
$password = '';     // Altere para a sua senha do banco

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}
?>
