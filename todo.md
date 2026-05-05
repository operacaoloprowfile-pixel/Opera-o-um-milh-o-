# WealthChain - TODO List

## Autenticação e Segurança
- [x] Implementar registro de usuário com validação de CPF, email e senha
- [x] Implementar login com CPF e senha
- [x] Gerar e validar JWT tokens para sessões
- [x] Implementar proteção de rotas (protectedProcedure)
- [x] Criptografar senhas com bcrypt
- [x] Implementar logout com limpeza de sessão

## Gestão de Saldo e Transações
- [x] Criar schema de usuários com campo de saldo
- [x] Criar schema de transações (depósitos, resgates, investimentos)
- [x] Implementar endpoint de consulta de saldo
- [x] Implementar endpoint de histórico de transações
- [x] Validar saldo antes de operações
- [x] Atualizar saldo em tempo real após operações

## Gestão de Investimentos
- [x] Criar schema de investimentos (nome, tipo, valor investido, valor atual)
- [x] Implementar endpoint de compra de investimento
- [x] Implementar endpoint de resgate de investimento
- [x] Implementar endpoint de listagem de investimentos do usuário
- [x] Calcular rentabilidade e ganho acumulado
- [x] Atualizar valor atual dos investimentos

## Integrações de API
- [x] Estruturar integração com Mercado Pago (depósitos via PIX)
- [x] Estruturar integração com API de mercado financeiro (atualização de preços)
- [x] Criar endpoints para sincronização de dados financeiros
- [x] Documentar como adicionar chaves de API

## Front-end - Landing Page
- [x] Replicar hero section do design original
- [x] Replicar seção de features/vantagens
- [x] Replicar seção de segurança
- [x] Implementar navegação responsiva
- [x] Implementar modal de login
- [x] Implementar modal de cadastro
- [x] Conectar formulários ao backend

## Front-end - Dashboard
- [x] Implementar layout do dashboard com sidebar
- [x] Exibir saldo disponível em tempo real
- [x] Exibir total investido
- [x] Exibir ganho acumulado
- [x] Implementar grid de investimentos
- [x] Implementar modal de investimento (compra)
- [x] Implementar modal de resgate
- [x] Implementar tabela de histórico de transações
- [x] Implementar logout

## Testes
- [x] Testar fluxo de registro e login
- [x] Testar proteção de rotas
- [x] Testar operações de saldo
- [x] Testar compra e resgate de investimentos
- [x] Testar validações de entrada
- [x] Testar segurança de autenticação

## Deployment
- [x] Configurar variáveis de ambiente
- [x] Validar banco de dados em produção
- [x] Criar checkpoint final
- [x] Publicar plataforma
