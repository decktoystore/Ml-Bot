# 🛒 MLBot — Bot de Promoções Mercado Livre

Bot Node.js que envia promoções automaticamente para **Telegram** e **WhatsApp** nos horários que você configurar.

---

## 📁 Estrutura de Arquivos

```
mlbot/
├── bot.js          ← Arquivo principal (agendamento + envio)
├── products.js     ← Lista de produtos para divulgar
├── utils.js        ← Geração de links e mensagens
├── .env            ← Suas credenciais (NÃO compartilhe!)
├── .env.example    ← Modelo do .env
└── package.json    ← Dependências
```

---

## 🚀 Instalação

### Pré-requisito
- Node.js 18+ instalado ([nodejs.org](https://nodejs.org))

### Passo a passo

```bash
# 1. Entre na pasta do projeto
cd mlbot

# 2. Instale as dependências
npm install

# 3. Crie seu arquivo .env
cp .env.example .env

# 4. Edite o .env com suas credenciais (veja abaixo)
nano .env   # ou abra no editor de sua preferência

# 5. Inicie o bot
npm start
```

---

## ⚙️ Configuração do .env

### ID de Afiliado (obrigatório)
1. Acesse [afiliados.mercadolivre.com.br](https://afiliados.mercadolivre.com.br)
2. Gere um link de qualquer produto
3. Copie o valor do parâmetro `deal_print_id=XXXXX` da URL gerada
4. Cole em `AFFILIATE_ID=XXXXX`

### Telegram
1. Abra o Telegram → fale com **@BotFather**
2. Digite `/newbot` → escolha um nome → copie o **Token**
3. Adicione o bot ao seu grupo ou canal
4. Use **@userinfobot** para descobrir o **Chat ID** do grupo
5. Cole token e chat ID no `.env`

### WhatsApp (Z-API)
1. Crie conta em [app.z-api.io](https://app.z-api.io) (tem plano grátis)
2. Crie uma instância → escaneie o QR Code com seu WhatsApp
3. Copie a **URL da instância** e o **Client-Token**
4. Cole no `.env` e defina `SEND_WHATSAPP=true`

---

## 📦 Adicionando Produtos

Edite o arquivo `products.js`:

```javascript
{
  id: 10,
  title: "Nome do Produto",
  emoji: "📱",
  price: 599.90,
  originalPrice: 899.90,
  discount: 33,
  rating: 4.7,
  sales: 1200,
  seller: "Nome do Vendedor",
  mlUrl: "https://www.mercadolivre.com.br/p/MLB...",
  active: true,  // false = produto pausado
}
```

**Dica:** Para usar um link de afiliado já pronto (sem o ID automático), coloque a URL completa em `mlUrl` que ela será usada diretamente.

---

## ⏰ Agendamento

Configure os horários no `.env`:
```
SCHEDULE_TIMES=08:00,12:00,18:00,21:00
MAX_PRODUCTS_PER_SEND=2
```
O bot vai enviar `MAX_PRODUCTS_PER_SEND` produtos em cada horário, rotacionando a lista automaticamente. Usa o fuso **America/Sao_Paulo**.

---

## ☁️ Rodando em Servidor (Produção)

### Opção 1 — Railway (recomendado, grátis)
1. Crie conta em [railway.app](https://railway.app)
2. Novo projeto → Deploy from GitHub (suba o código no GitHub primeiro)
3. Configure as variáveis de ambiente no painel do Railway
4. Deploy automático!

### Opção 2 — VPS com PM2
```bash
# Instale PM2 globalmente
npm install -g pm2

# Inicie o bot com PM2
pm2 start bot.js --name mlbot

# Configure para reiniciar automaticamente com o servidor
pm2 startup
pm2 save

# Comandos úteis
pm2 logs mlbot       # ver logs em tempo real
pm2 restart mlbot    # reiniciar
pm2 stop mlbot       # parar
```

### Opção 3 — Render.com (grátis)
1. Crie conta em [render.com](https://render.com)
2. New → Background Worker
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Adicione as variáveis de ambiente no painel

---

## 🧪 Teste Rápido

Para testar o envio imediatamente sem esperar o agendamento, descomente a linha no `bot.js`:

```javascript
// Descomente esta linha em main():
await runScheduledSend();
```

Rode `npm start` e veja o disparo acontecer na hora.

---

## 📊 Relatório Diário

Todo dia às **23h** o bot envia automaticamente um resumo para o Telegram com:
- Número de produtos ativos
- Total de disparos do dia
- Status dos canais

---

## ❓ Dúvidas Frequentes

**O bot para quando fecho o terminal?**
Sim, em desenvolvimento. Use PM2 ou Railway em produção para rodar 24/7.

**Como descubro o Chat ID do meu grupo Telegram?**
Adicione **@userinfobot** ou **@RawDataBot** ao grupo e ele vai mostrar o ID.

**O WhatsApp desconecta às vezes?**
Isso é normal com Z-API. Mantenha o celular conectado à internet. O plano pago do Z-API oferece mais estabilidade.

**Posso usar Evolution API em vez de Z-API?**
Sim! A Evolution API é gratuita e self-hosted. Altere `ZAPI_INSTANCE_URL` para a URL da sua instância Evolution. O endpoint `/send-text` é compatível.
