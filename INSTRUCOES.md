# Instruções de Instalação - Projeto Milhão

Este projeto foi tornado independente e está pronto para ser instalado no seu servidor Linux.

## 1. Requisitos
- Servidor Linux (Ubuntu/Debian recomendado)
- Servidor Web (Apache ou Nginx)
- PHP 7.4 ou superior
- MySQL ou MariaDB

## 2. Configuração do Banco de Dados
1. Acesse o seu gerenciador de banco de dados (phpMyAdmin ou terminal).
2. Crie um banco de dados chamado `projeto_milhao`.
3. Importe o arquivo `database.sql` que está na raiz do projeto.

## 3. Configuração do Projeto
1. Abra o arquivo `db_config.php`.
2. Altere as variáveis `$username` e `$password` com as credenciais do seu banco de dados.

## 4. API de Pagamento
1. O arquivo `pagamento.php` contém uma estrutura simplificada.
2. Procure pela função `gerarPix` e insira a lógica da sua API de pagamento (SuitPay, DigitoPay, etc.).

## 5. Subindo os Arquivos
1. Copie todos os arquivos desta pasta para o diretório público do seu servidor (geralmente `/var/www/html`).
2. Certifique-se de que as permissões de pasta estão corretas para o PHP ler e escrever.

## Estrutura de Arquivos Criada:
- `database.sql`: Script para criar as tabelas.
- `db_config.php`: Conexão com o banco de dados.
- `cadastro_action.php`: Processa novos cadastros.
- `login_action.php`: Processa o login.
- `dashboard.php`: Área logada do usuário.
- `pagamento.php`: Local para configurar sua API de PIX.
- `logout.php`: Encerra a sessão.
