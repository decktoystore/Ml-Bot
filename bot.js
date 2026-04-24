// ═══════════════════════════════════════════════════════════
//  MLBot — Bot de Promoções Mercado Livre
//  Envio real para Telegram e WhatsApp com agendamento
// ═══════════════════════════════════════════════════════════

require("dotenv").config();
const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const products = require("./products");
const { buildAffiliateLink, buildMessage } = require("./utils");

// ── Configurações (via .env) ─────────────────────────────────
const {
  TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID,
  ZAPI_INSTANCE_URL,
  ZAPI_TOKEN,
  ZAPI_PHONE,           // número ou ID do grupo WhatsApp
  AFFILIATE_ID,
  SEND_TELEGRAM,        // "true" ou "false"
  SEND_WHATSAPP,        // "true" ou "false"
  SCHEDULE_TIMES,       // ex: "08:00,12:00,18:00,21:00"
  MAX_PRODUCTS_PER_SEND, // quantos produtos por disparo (default: 3)
} = process.env;

// ── Inicializar Telegram Bot ──────────────────────────────────
let tgBot = null;
if (SEND_TELEGRAM === "true" && TELEGRAM_TOKEN) {
  tgBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
  console.log("✅ Telegram Bot inicializado.");
}

// ── Estado interno ────────────────────────────────────────────
let productIndex = 0; // controle de rotação dos produtos

// ═══════════════════════════════════════════════════════════
//  FUNÇÕES DE ENVIO
// ═══════════════════════════════════════════════════════════

/**
 * Envia mensagem para o Telegram
 */
async function sendTelegram(message) {
  if (!tgBot || !TELEGRAM_CHAT_ID) {
    console.warn("⚠️  Telegram não configurado.");
    return false;
  }
  try {
    await tgBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    });
    console.log(`✅ [Telegram] Mensagem enviada para ${TELEGRAM_CHAT_ID}`);
    return true;
  } catch (err) {
    console.error("❌ [Telegram] Erro:", err.message);
    return false;
  }
}

/**
 * Envia mensagem para o WhatsApp via Z-API
 */
async function sendWhatsApp(message) {
  if (!ZAPI_INSTANCE_URL || !ZAPI_TOKEN || !ZAPI_PHONE) {
    console.warn("⚠️  WhatsApp (Z-API) não configurado.");
    return false;
  }
  try {
    const response = await axios.post(
      `${ZAPI_INSTANCE_URL}/send-text`,
      { phone: ZAPI_PHONE, message },
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Token": ZAPI_TOKEN,
        },
        timeout: 10000,
      }
    );
    console.log(`✅ [WhatsApp] Mensagem enviada para ${ZAPI_PHONE}`, response.data);
    return true;
  } catch (err) {
    console.error("❌ [WhatsApp] Erro:", err.response?.data || err.message);
    return false;
  }
}

/**
 * Envia um produto para todos os canais ativos
 */
async function sendProduct(product) {
  const affiliateLink = buildAffiliateLink(product.mlUrl, AFFILIATE_ID);
  const message = buildMessage(product, affiliateLink);

  console.log(`\n📦 Enviando: ${product.title}`);
  console.log(`🔗 Link: ${affiliateLink}`);

  const results = await Promise.allSettled([
    SEND_TELEGRAM === "true" ? sendTelegram(message) : Promise.resolve(null),
    SEND_WHATSAPP === "true" ? sendWhatsApp(message) : Promise.resolve(null),
  ]);

  return results;
}

/**
 * Dispara N produtos em rotação
 */
async function runScheduledSend() {
  const max = parseInt(MAX_PRODUCTS_PER_SEND) || 3;
  const activeProducts = products.filter((p) => p.active !== false);

  if (activeProducts.length === 0) {
    console.warn("⚠️  Nenhum produto ativo para enviar.");
    return;
  }

  console.log(`\n🚀 [${new Date().toLocaleString("pt-BR")}] Iniciando disparo de ${max} produto(s)...`);

  for (let i = 0; i < max; i++) {
    const product = activeProducts[productIndex % activeProducts.length];
    productIndex++;

    await sendProduct(product);

    // Aguarda 3 segundos entre cada produto para não spammar
    if (i < max - 1) await sleep(3000);
  }

  console.log(`✅ Disparo concluído. Próximo índice: ${productIndex}`);
}

// ═══════════════════════════════════════════════════════════
//  AGENDAMENTO
// ═══════════════════════════════════════════════════════════

function parseSchedules(scheduleString) {
  if (!scheduleString) return ["08:00", "18:00"];
  return scheduleString.split(",").map((s) => s.trim());
}

function timeToCron(time) {
  const [hour, minute] = time.split(":").map(Number);
  return `${minute} ${hour} * * *`; // min hora * * *
}

function setupSchedules() {
  const times = parseSchedules(SCHEDULE_TIMES);
  console.log(`\n⏰ Agendamentos configurados: ${times.join(", ")}`);

  times.forEach((time) => {
    const cronExp = timeToCron(time);
    cron.schedule(cronExp, () => {
      runScheduledSend();
    }, {
      timezone: "America/Sao_Paulo",
    });
    console.log(`   📅 ${time} → cron: "${cronExp}"`);
  });
}

// ═══════════════════════════════════════════════════════════
//  RELATÓRIO DIÁRIO (23h)
// ═══════════════════════════════════════════════════════════

cron.schedule("0 23 * * *", async () => {
  const activeProducts = products.filter((p) => p.active !== false);
  const report =
    `📊 *Relatório MLBot — ${new Date().toLocaleDateString("pt-BR")}*\n\n` +
    `📦 Produtos ativos: ${activeProducts.length}\n` +
    `🔄 Total de disparos hoje: ${productIndex}\n` +
    `📡 Telegram: ${SEND_TELEGRAM === "true" ? "✅ Ativo" : "❌ Inativo"}\n` +
    `💬 WhatsApp: ${SEND_WHATSAPP === "true" ? "✅ Ativo" : "❌ Inativo"}\n\n` +
    `_Bot funcionando normalmente._`;

  if (SEND_TELEGRAM === "true") await sendTelegram(report);
}, { timezone: "America/Sao_Paulo" });

// ═══════════════════════════════════════════════════════════
//  UTILITÁRIO
// ═══════════════════════════════════════════════════════════

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════
//  INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("   🛒 MLBot — Iniciando...");
  console.log("═══════════════════════════════════════");
  console.log(`   Telegram : ${SEND_TELEGRAM === "true" ? "✅" : "❌"}`);
  console.log(`   WhatsApp : ${SEND_WHATSAPP === "true" ? "✅" : "❌"}`);
  console.log(`   Afiliado : ${AFFILIATE_ID || "⚠️  NÃO CONFIGURADO"}`);
  console.log(`   Produtos : ${products.length} cadastrados`);
  console.log("═══════════════════════════════════════\n");

  setupSchedules();

  // Disparo de teste imediato ao iniciar (descomente se quiser testar)
  // console.log("🧪 Executando disparo de teste...");
  // await runScheduledSend();

  console.log("✅ Bot rodando. Aguardando horários agendados...\n");
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
