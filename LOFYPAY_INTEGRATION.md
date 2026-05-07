# Integração LofyPay - Documentação

## Visão Geral

A plataforma agora integra com a LofyPay para controlar **depósitos** e **saques**. A integração funciona como um gateway de pagamentos, mantendo toda a lógica de pirâmide financeira intacta.

## Arquivos Adicionados

### `server/lofypay-gateway.ts`
Helper dedicado que gerencia a integração com LofyPay:
- `initiateDepositLofyPay()` - Inicia um depósito
- `initiateWithdrawalLofyPay()` - Inicia um saque
- `getTransactionStatusLofyPay()` - Verifica status da transação
- `handleLofyPayWebhook()` - Processa webhooks da LofyPay

### Modificações em `server/routers.ts`
Os procedimentos de depósito e saque foram atualizados:
- `financial.deposit` - Agora integrado com LofyPay
- `financial.withdraw` - Agora integrado com LofyPay
- `financial.getTransactionStatus` - Novo procedimento para verificar status

## Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# LofyPay Gateway
LOFYPAY_API_URL=https://api.lofypay.com
LOFYPAY_API_KEY=sua_chave_api_aqui
LOFYPAY_EMAIL=seu_email@example.com

# Application URL (para webhooks)
APP_URL=http://localhost:3000
```

## Modo Mock vs Produção

### Modo Mock (Desenvolvimento)
Se `LOFYPAY_API_KEY` não estiver configurado:
- Depósitos retornam um link de pagamento simulado
- Saques são processados localmente
- Transações são marcadas como "pending"
- Ideal para desenvolvimento e testes

### Modo Produção
Com `LOFYPAY_API_KEY` configurado:
- Integração real com API da LofyPay
- Processamento de pagamentos via PIX e Cartão
- Webhooks para confirmação de pagamentos
- Transações rastreáveis

## Fluxo de Depósito

```
1. Usuário chama: financial.deposit({ amount: 100, paymentMethod: "pix" })
2. Sistema valida o usuário e cria transação "pending"
3. LofyPay retorna link de pagamento
4. Usuário completa pagamento na LofyPay
5. LofyPay envia webhook confirmando pagamento
6. Sistema atualiza transação para "completed"
7. Saldo é creditado + lógica de pirâmide é aplicada
```

## Fluxo de Saque

```
1. Usuário chama: financial.withdraw({ amount: 50, pixKey: "email@example.com" })
2. Sistema valida saldo disponível
3. Saldo é debitado imediatamente
4. Transação é criada como "pending"
5. LofyPay processa a transferência PIX
6. LofyPay envia webhook confirmando saque
7. Sistema atualiza transação para "completed"
```

## Endpoints da API

### Depósito
```bash
POST /api/trpc/financial.deposit
{
  "amount": 100,
  "paymentMethod": "pix" | "card"
}

Response:
{
  "success": true,
  "transactionId": "MOCK_DEP_1234567890",
  "paymentLink": "https://lofypay.com/pay?...",
  "message": "Depósito iniciado com sucesso"
}
```

### Saque
```bash
POST /api/trpc/financial.withdraw
{
  "amount": 50,
  "pixKey": "email@example.com" // opcional
}

Response:
{
  "success": true,
  "transactionId": "MOCK_WD_1234567890",
  "newBalance": 950,
  "message": "Saque solicitado com sucesso"
}
```

### Verificar Status
```bash
POST /api/trpc/financial.getTransactionStatus
{
  "transactionId": "MOCK_DEP_1234567890"
}

Response:
{
  "status": "pending" | "completed" | "failed",
  "message": "Transação em processamento"
}
```

## Webhook Handler

Quando LofyPay confirma um pagamento, ela envia um webhook para:
```
POST {APP_URL}/api/webhooks/lofypay
```

O sistema processa:
- Confirmação de depósito → Credita saldo
- Confirmação de saque → Marca como concluído
- Falha de pagamento → Marca como falho

## Lógica de Pirâmide Integrada

A integração mantém toda a lógica de pirâmide:

### Depósito
- ✅ Aumenta taxa de rendimento diária
- ✅ Paga 10% de bônus ao indicador (referrer)
- ✅ Rastreia total depositado

### Saque
- ✅ Valida saldo disponível
- ✅ Deduz imediatamente (evita overdraft)
- ✅ Registra transação no histórico

## Testes

Para testar a integração em modo mock:

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm test

# Iniciar servidor
pnpm dev
```

## Configuração para Produção

1. Obter credenciais da LofyPay
2. Configurar variáveis de ambiente
3. Implementar webhook handler em `/api/webhooks/lofypay`
4. Testar fluxo completo com valores pequenos
5. Deploy

## Segurança

- ✅ Chaves de API nunca são expostas no frontend
- ✅ Validação de saldo antes de saques
- ✅ Transações rastreáveis no banco de dados
- ✅ Webhooks assinados (verificar signature da LofyPay)
- ✅ Senhas de usuário nunca são armazenadas em texto plano

## Suporte

Para dúvidas sobre a integração:
1. Consulte a documentação da LofyPay: https://lofypay.com/docs
2. Verifique os logs: `.manus-logs/`
3. Execute os testes: `pnpm test`
