// ═══════════════════════════════════════════════════════════
//  utils.js — Funções utilitárias do MLBot
// ═══════════════════════════════════════════════════════════

/**
 * Formata valor em Real Brasileiro
 */
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Constrói link de afiliado do Mercado Livre.
 * Se o produto já tiver affiliateUrl definida, usa ela diretamente.
 * Caso contrário, anexa o AFFILIATE_ID como parâmetro na URL.
 */
function buildAffiliateLink(baseUrl, affiliateId) {
  if (!baseUrl) return "";

  // Se a URL já é um link de afiliado completo, retorna direto
  if (baseUrl.includes("deal_print_id") || baseUrl.includes("utm_source=mlbot")) {
    return baseUrl;
  }

  if (!affiliateId) return baseUrl;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("deal_print_id", affiliateId);
    url.searchParams.set("utm_source", "mlbot");
    url.searchParams.set("utm_medium", "bot");
    url.searchParams.set("utm_campaign", "promocao");
    return url.toString();
  } catch {
    // URL inválida — retorna com query string simples
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}deal_print_id=${affiliateId}&utm_source=mlbot`;
  }
}

/**
 * Template da mensagem de promoção.
 * Personalize o texto aqui conforme o estilo do seu canal.
 */
function buildMessage(product, affiliateLink) {
  const economy = product.originalPrice - product.price;
  const economyFmt = formatCurrency(economy);

  // ── Escolhe um dos emojis de abertura aleatoriamente (mais orgânico) ──
  const openings = ["🔥", "🚨", "💥", "⚡", "🎯"];
  const opener = openings[Math.floor(Math.random() * openings.length)];

  return (
    `${opener} *OFERTA IMPERDÍVEL!*\n\n` +
    `${product.emoji} *${product.title}*\n\n` +
    `~~${formatCurrency(product.originalPrice)}~~\n` +
    `💰 *POR APENAS ${formatCurrency(product.price)}*\n` +
    `🏷️ *${product.discount}% OFF* — Economia de ${economyFmt}\n\n` +
    `⭐ ${product.rating} · 📦 ${product.sales.toLocaleString("pt-BR")} vendidos\n` +
    `🏪 ${product.seller}\n\n` +
    `🛒 *Comprar agora* 👉 ${affiliateLink}\n\n` +
    `_⏳ Promoção por tempo limitado!_`
  );
}

/**
 * Gera relatório resumido dos produtos
 */
function buildProductSummary(products) {
  const active = products.filter((p) => p.active !== false);
  const lines = active.map(
    (p) =>
      `${p.emoji} ${p.title} — ${formatCurrency(p.price)} (-${p.discount}%)`
  );
  return lines.join("\n");
}

module.exports = { formatCurrency, buildAffiliateLink, buildMessage, buildProductSummary };
