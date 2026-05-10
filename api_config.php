<?php
/**
 * CONFIGURAÇÃO DE API - AGRO FUND CLONE
 * 
 * Edite os campos abaixo para configurar sua API de recebimento e saque.
 */

$api_config = [
    'api_key' => 'SUA_CHAVE_API_AQUI',
    'api_secret' => 'SEU_SECRET_API_AQUI',
    'endpoint_recebimento' => 'https://api.exemplo.com/v1/receber',
    'endpoint_saque' => 'https://api.exemplo.com/v1/sacar',
    'callback_url' => 'https://seusite.com/callback.php'
];

// Função global para facilitar o uso da API em outras partes do site
function call_agro_api($method, $data) {
    global $api_config;
    // Lógica de chamada da API aqui
    return "API chamada com sucesso";
}
?>
