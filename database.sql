-- Script Completo de Banco de Dados
CREATE DATABASE IF NOT EXISTS projeto_milhao;
USE projeto_milhao;

-- Usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    bonus_balance DECIMAL(10, 2) DEFAULT 0.00,
    referred_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planos de Investimento (Commodities)
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    daily_profit DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    image_url VARCHAR(255)
);

-- Investimentos Ativos
CREATE TABLE IF NOT EXISTS user_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plan_id INT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_profit_claim TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'expired') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Transações (Histórico)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('deposit', 'withdraw', 'profit', 'bonus', 'purchase') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'completed',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Inserir alguns planos iniciais (Exemplos baseados no site original)
INSERT INTO plans (name, price, daily_profit, duration_days) VALUES 
('Milho Premium', 60.00, 2.40, 30),
('Soja Exportação', 150.00, 6.75, 30),
('Café Arábica', 500.00, 25.00, 30);
