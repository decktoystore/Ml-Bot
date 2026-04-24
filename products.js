// ═══════════════════════════════════════════════════════════
//  products.js — Lista de produtos para divulgação
//  Adicione, remova ou edite produtos aqui.
//  Defina active: false para pausar um produto sem removê-lo.
// ═══════════════════════════════════════════════════════════

module.exports = [
  {
    id: 1,
    title: "Fone Bluetooth JBL Tune 510BT",
    emoji: "🎧",
    price: 189.90,
    originalPrice: 279.90,
    discount: 32,
    rating: 4.8,
    sales: 1420,
    seller: "JBL Oficial",
    // Cole aqui a URL real do produto no Mercado Livre
    mlUrl: "https://www.mercadolivre.com.br/p/MLB123456",
    // Ou cole diretamente seu link de afiliado já pronto:
    // affiliateUrl: "https://mercadolivre.com/link-afiliado-aqui",
    active: true,
  },
  {
    id: 2,
    title: "Tênis Nike Air Max 270 Masculino",
    emoji: "👟",
    price: 349.99,
    originalPrice: 599.99,
    discount: 42,
    rating: 4.9,
    sales: 890,
    seller: "Nike Store BR",
    mlUrl: "https://www.mercadolivre.com.br/p/MLB234567",
    active: true,
  },
  {
    id: 3,
    title: "Cafeteira Nespresso Essenza Mini",
    emoji: "☕",
    price: 399.00,
    originalPrice: 649.00,
    discount: 38,
    rating: 4.7,
    sales: 2100,
    seller: "Nespresso Oficial",
    mlUrl: "https://www.mercadolivre.com.br/p/MLB345678",
    active: true,
  },
  {
    id: 4,
    title: "Smartwatch Samsung Galaxy Watch 6",
    emoji: "⌚",
    price: 1199.00,
    originalPrice: 1899.00,
    discount: 37,
    rating: 4.8,
    sales: 3200,
    seller: "Samsung Oficial",
    mlUrl: "https://www.mercadolivre.com.br/p/MLB456789",
    active: true,
  },
  {
    id: 5,
    title: "Mochila Samsonite Urbana 20L",
    emoji: "🎒",
    price: 219.90,
    originalPrice: 389.90,
    discount: 44,
    rating: 4.6,
    sales: 560,
    seller: "Samsonite BR",
    mlUrl: "https://www.mercadolivre.com.br/p/MLB567890",
    active: false, // desativado — não será enviado
  },

  // ── Adicione novos produtos abaixo ──────────────────────
  // {
  //   id: 6,
  //   title: "Nome do Produto",
  //   emoji: "📦",
  //   price: 99.90,
  //   originalPrice: 149.90,
  //   discount: 33,
  //   rating: 4.5,
  //   sales: 300,
  //   seller: "Nome do Vendedor",
  //   mlUrl: "https://www.mercadolivre.com.br/p/MLB...",
  //   active: true,
  // },
];
