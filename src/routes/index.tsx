import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import albumCover from "@/assets/album-cover.png";
import albumFront from "@/assets/album-front.png";
import albumInterior from "@/assets/album-interior.png";
import cardMiguel from "@/assets/card-miguel.png";
import cardArthur from "@/assets/card-arthur.png";
import cardHelena from "@/assets/card-helena.png";
import pack10Figurinhas from "@/assets/pack-10-figurinhas.jpg";
import miniTacaPortaFoto from "@/assets/mini-taca-porta-foto.jpg";
import figurinhaCanvaMain from "@/assets/figurinha-canva-main.png";
import figurinhaCanvaFolha from "@/assets/figurinha-canva-folha.png";
import figurinhaCanvaCards from "@/assets/figurinha-canva-cards.png";
import figurinhaCanvaTemplate from "@/assets/figurinha-canva-template.png";
import albumCasalMain from "@/assets/album-casal-main.png";
import albumCasalInterior from "@/assets/album-casal-interior.png";
import capinhaNeymar from "@/assets/capinha-neymar.png";
import capinhaNeymarJ2 from "@/assets/capinha-neymar-j2.png";
import portaFigurinhas1 from "@/assets/porta-figurinhas-1.jpg";
import portaFigurinhas2 from "@/assets/porta-figurinhas-2.jpg";
import portaFigurinhas3 from "@/assets/porta-figurinhas-3.jpg";
import portaFigurinhas4 from "@/assets/porta-figurinhas-4.jpg";
import portaFigurinhas5 from "@/assets/porta-figurinhas-5.jpg";
import portaFigurinhas6 from "@/assets/porta-figurinhas-6.jpg";
import portaFigurinhas7 from "@/assets/porta-figurinhas-7.jpg";
import portaFigurinhas8 from "@/assets/porta-figurinhas-8.jpg";
import fifaBackdrop from "@/assets/fifa-backdrop.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Copa Album 2026 — Álbum e Figurinhas Personalizadas" },
      {
        name: "description",
        content:
          "Catálogo oficial: álbum da Copa 2026 e figurinhas personalizadas com a foto da pessoa que você ama. Pagamento via PIX.",
      },
    ],
  }),
});

// Refined Copa palette — dark base with measured accents
const YELLOW = "#F4C430";
const GREEN = "#00A859";
const BLUE = "#1B3FB5";
const WHITE = "#FFFFFF";
const INK = "#0B0B10";
const SURFACE = "#14141C";
const SURFACE_2 = "#1E1E29";
const LINE = "#2A2A38";
const MUTED = "#9CA0AE";

type Product = {
  id: string;
  name: string;
  tag: string;
  price: number;
  oldPrice?: number;
  installments: string;
  desc: string;
  image: string;
  badge?: string;
  gallery: { src: string; label: string }[];
  details: string[];
  variants?: {
    colors?: string[];
    models?: string[];
  };
  options?: { name: string; values: string[]; default?: string }[];
  specs?: { group: string; items: { label: string; value: string }[] }[];
};

const PRODUCTS: Product[] = [
  {
    id: "album",
    name: "Álbum Oficial Copa Namorados 2026",
    tag: "Álbum",
    price: 197,
    oldPrice: 297,
    installments: "ou 12x de R$ 19,90 sem juros",
    desc: "Capa dura, 60 espaços numerados para colar suas figurinhas personalizadas.",
    image: albumFront,
    badge: "Mais vendido",
    gallery: [
      { src: albumFront, label: "Capa" },
      { src: albumInterior, label: "Interior" },
    ],
    details: [
      "Formato A4 — 60 espaços numerados",
      "Capa dura com acabamento foil dourado",
      "Páginas internas em papel couché 170g",
      "Inclui adesivos de identificação por jogador",
    ],
  },
  {
    id: "fig-individual",
    name: "Figurinha Personalizada",
    tag: "Figurinha",
    price: 9.9,
    installments: "Envio em até 7 dias úteis",
    desc: "Sua foto, nome e número impressos no estilo oficial da Copa.",
    image: cardMiguel,
    gallery: [
      { src: cardMiguel, label: "Frente" },
    ],
    details: [
      "Impressão em alta resolução, papel adesivo já cortado",
      "Nome, posição e número personalizados",
      "Verso com escudo e número de coleção",
    ],
  },
  {
    id: "fig-pack-10",
    name: "Pack 10 Figurinhas",
    tag: "Pack",
    price: 79,
    oldPrice: 99,
    installments: "R$ 7,90 cada — economize 20%",
    desc: "Monte sua seleção do casal, da família ou do time.",
    image: pack10Figurinhas,
    badge: "Economia",
    gallery: [
      { src: pack10Figurinhas, label: "Pack completo" },
      { src: cardMiguel, label: "Variações" },
    ],
    details: [
      "10 figurinhas personalizadas no mesmo pedido",
      "Misture pessoas, fotos e números",
      "Embalagem premium em estilo coleção",
    ],
  },
  {
    id: "fig-shiny",
    name: "Figurinha Dourada Shiny",
    tag: "Edição rara",
    price: 24.9,
    installments: "Acabamento holográfico premium",
    desc: "Edição limitada com brilho dourado. A craque do seu álbum.",
    image: cardHelena,
    badge: "Limitada",
    gallery: [
      { src: cardHelena, label: "Frente Shiny" },
    ],
    details: [
      "Acabamento holográfico foil dourado",
      "Numeração limitada por edição",
      "Embalagem individual em sleeve protetor",
    ],
  },
  {
    id: "mini-taca-porta-foto",
    name: "Mini Taça Porta Foto",
    tag: "Decoração 3D",
    price: 49.9,
    installments: "Acompanha uma MiniPic pronta para encaixe",
    desc: "Mini taça em 3D que transforma uma foto especial em destaque na sua mesa ou estante.",
    image: miniTacaPortaFoto,
    gallery: [
      { src: miniTacaPortaFoto, label: "Mini Taça" },
    ],
    details: [
      "Impressão 3D — altura aproximada 7,5 cm",
      "Base entre 2,5 e 3 cm",
      "Funciona como porta-foto, acompanha 1 MiniPic no tamanho ideal",
      "Foto totalmente personalizável — escolha a sua na hora do pedido",
      "MiniPics e tamanhos adicionais podem ser pedidos separadamente",
    ],
  },
  {
    id: "figurinha-canva-editavel",
    name: "Figurinha Copa 2026 Editável no Canva",
    tag: "Digital · Canva",
    price: 19.9,
    oldPrice: 39.9,
    installments: "Entrega digital imediata após o pagamento",
    desc: "Crie sua figurinha da Seleção Brasileira no Canva: troque a foto, edite os dados e exporte pronto para imprimir.",
    image: figurinhaCanvaMain,
    badge: "Faça você mesmo",
    gallery: [
      { src: figurinhaCanvaMain, label: "Apresentação" },
      { src: figurinhaCanvaTemplate, label: "Modelo no Canva" },
      { src: figurinhaCanvaFolha, label: "Folha pronta para impressão" },
      { src: figurinhaCanvaCards, label: "Variações de seleções" },
    ],
    details: [
      "Arquivo editável da figurinha da Seleção Brasileira",
      "Acesso direto ao modelo no Canva (sem precisar instalar nada)",
      "Estrutura pronta no tamanho ideal de figurinha",
      "Tutorial passo a passo para edição",
      "Indicação de ferramenta gratuita para remoção de fundo",
      "Você mesmo personaliza foto e dados — pronto em minutos",
    ],
  },
  {
    id: "album-casal-50",
    name: "Álbum do Casal — 50 Figurinhas em 3 Tamanhos",
    tag: "Edição Casal",
    price: 247,
    oldPrice: 347,
    installments: "ou 12x de R$ 24,90 sem juros",
    desc: "Memory Album Copa 2026: álbum personalizado para casal com 50 figurinhas em 3 tamanhos diferentes.",
    image: albumCasalMain,
    badge: "Novo",
    gallery: [
      { src: albumCasalMain, label: "Kit completo" },
      { src: albumCasalInterior, label: "Páginas internas" },
    ],
    details: [
      "Álbum capa dura no estilo Memory Album 2026",
      "50 figurinhas personalizadas em 3 tamanhos diferentes",
      "Páginas internas temáticas: 'Sobre o casal', 'I Love You' e mais",
      "Detalhes em vermelho, azul e amarelo da Copa",
      "Espaço para texto personalizado e fotos do casal",
      "Acabamento Limited Edition com selo exclusivo",
    ],
  },
  {
    id: "capinha-neymar",
    name: "Capinha Neymar Anti-impacto — Samsung & iPhone",
    tag: "Capinha · Edição Copa",
    price: 79.9,
    oldPrice: 119.9,
    installments: "ou 6x de R$ 13,32 sem juros",
    desc: "Capa de silicone fosco anti-impacto com estampa exclusiva do Neymar Jr. Compatível com Samsung Galaxy A/S e iPhone 7 ao 17 Pro Max.",
    image: capinhaNeymar,
    badge: "Lançamento",
    gallery: [
      { src: capinhaNeymar, label: "Estampa J1 — Neymar Jr" },
      { src: capinhaNeymarJ2, label: "Estampa J2 — Neymar Jr Amarelo" },
    ],
    details: [
      "Material: silicone fosco premium com tecnologia anti-impacto",
      "Estampa exclusiva oficial estilo Onside Original",
      "Bordas reforçadas e proteção elevada para câmera",
      "Toque sedoso, antiderrapante e resistente a manchas",
      "Compatível com mais de 40 modelos Samsung e iPhone",
      "Escolha cor (J1 / J2) e modelo do aparelho no pedido",
    ],
    variants: {
      colors: ["J1", "J2"],
      models: [
        "Samsung A03", "Samsung A04", "Samsung A04E", "Samsung A04S/A13 5G",
        "Samsung A05", "Samsung A05S", "Samsung A10", "Samsung A10S",
        "Samsung A11 / M11", "Samsung A12", "Samsung A13 4G", "Samsung A14",
        "Samsung A15", "Samsung A16", "Samsung A17", "Samsung A20 / A30",
        "Samsung A23", "Samsung A32", "Samsung A34", "Samsung A54",
        "Samsung A72", "Samsung S23", "Samsung S23 FE", "Samsung S23 Ultra",
        "Samsung S24", "Samsung S24 FE", "Samsung S24 Ultra",
        "Samsung S25", "Samsung S25 Ultra",
        "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus",
        "iPhone X / XS", "iPhone XR", "iPhone XS Max",
        "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
        "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
        "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
        "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
        "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
        "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
        "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
      ],
    },
  },
  {
    id: "porta-figurinhas-copa",
    name: "Case Porta Figurinhas Copa 2026 — Maleta + Chaveiro Troféu",
    tag: "Estojo Organizador · Gurumania",
    price: 89.9,
    oldPrice: 139.9,
    installments: "ou 6x de R$ 14,98 sem juros",
    desc: "Maleta organizadora oficial estilo Copa 2026 com até 200 figurinhas, travas reforçadas e chaveiro mini troféu de brinde exclusivo.",
    image: portaFigurinhas1,
    badge: "Lançamento exclusivo",
    gallery: [
      { src: portaFigurinhas1, label: "Apresentação" },
      { src: portaFigurinhas2, label: "Detalhes da tampa" },
      { src: portaFigurinhas3, label: "Alta capacidade — 200 figurinhas" },
      { src: portaFigurinhas4, label: "Fechamento seguro" },
      { src: portaFigurinhas5, label: "Dimensões compactas" },
      { src: portaFigurinhas6, label: "Chaveiro mini troféu" },
      { src: portaFigurinhas7, label: "Proteção total" },
      { src: portaFigurinhas8, label: "Entre no clima da Copa" },
    ],
    details: [
      "Comporta até 200 figurinhas com divisórias inteligentes (1 e 2)",
      "Travas verdes reforçadas — proteção contra abertura acidental",
      "Material durável: ABS branco com estampa FIFA Copa 2026",
      "Dimensões compactas: 11,5 × 9,5 × 4,5 cm — cabe na mochila ou no bolso",
      "Brinde exclusivo: chaveiro mini troféu da Copa com argola italiana",
      "Ideal para colecionadores e perfeito para presentear",
    ],
    options: [
      { name: "Personagem", values: ["Branco", "Jogadores Copa do Mundo"], default: "Branco" },
      { name: "Nome do desenho", values: ["Porta Figurinhas", "Figurinhas Copa"], default: "Porta Figurinhas" },
      { name: "Tipo de embalagem", values: ["Maleta", "Envelope"], default: "Maleta" },
      { name: "Formato de venda", values: ["Unidade", "Kit"], default: "Unidade" },
      { name: "Unidades por kit", values: ["1", "105"], default: "1" },
    ],
    specs: [
      {
        group: "Características principais",
        items: [
          { label: "Marca", value: "Gurumania" },
          { label: "Nome do álbum", value: "Copa do Mundo 2026 FIFA" },
          { label: "Personagem", value: "Branco" },
          { label: "Nome do desenho", value: "Porta Figurinhas" },
          { label: "Tipo de embalagem", value: "Maleta" },
        ],
      },
      {
        group: "Características de venda",
        items: [
          { label: "Formato de venda", value: "Unidade" },
        ],
      },
      {
        group: "Outros",
        items: [
          { label: "Time", value: "Brasil" },
          { label: "Ano do álbum", value: "2026" },
          { label: "Temática", value: "Futebol Copa do Mundo World Cup 2026" },
          { label: "Sem figurinhas repetidas", value: "Não" },
          { label: "É uma figurinha holográfica", value: "Não" },
          { label: "É uma figurinha especial", value: "Não" },
          { label: "Idade mínima recomendada", value: "5 anos" },
          { label: "Idade recomendada", value: "8-13 anos" },
        ],
      },
    ],
  },
];

const CATEGORY_MAP: Record<string, string> = {
  album: "albuns",
  "album-casal-50": "albuns",
  "fig-individual": "figurinhas",
  "fig-pack-10": "figurinhas",
  "fig-shiny": "figurinhas",
  "figurinha-canva-editavel": "digital",
  "mini-taca-porta-foto": "decoracao",
  "porta-figurinhas-copa": "decoracao",
  "capinha-neymar": "acessorios",
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "albuns", label: "Álbuns" },
  { id: "figurinhas", label: "Figurinhas" },
  { id: "acessorios", label: "Acessórios" },
  { id: "decoracao", label: "Decoração" },
  { id: "digital", label: "Digital" },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type CartLine = { id: string; qty: number };

type PixState =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "ok";
      copy_paste: string;
      qr_code_image: string;
      total: number;
      transaction_id: string;
    }
  | { kind: "error"; message: string };

function Index() {
  const [intro, setIntro] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmBuy, setConfirmBuy] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [detailsImg, setDetailsImg] = useState(0);
  const [variantColor, setVariantColor] = useState<string | null>(null);
  const [variantSystem, setVariantSystem] = useState<"android" | "ios" | null>(null);
  const [variantModel, setVariantModel] = useState<string | null>(null);
  const [variantOptions, setVariantOptions] = useState<Record<string, string>>({});
  useEffect(() => {
    setVariantColor(null);
    setVariantSystem(null);
    setVariantModel(null);
    const prod = detailsId ? PRODUCTS.find((x) => x.id === detailsId) : null;
    if (prod?.options) {
      const init: Record<string, string> = {};
      prod.options.forEach((o) => { init[o.name] = o.default ?? o.values[0]; });
      setVariantOptions(init);
    } else {
      setVariantOptions({});
    }
  }, [detailsId]);
  const [checkout, setCheckout] = useState<{ items: CartLine[]; nonce?: number } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"contact" | "address" | "pix">("contact");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pix, setPix] = useState<PixState>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; pct: number } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  // Hydrate cart + coupon from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("copa_cart_v1");
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setCart(parsed.filter((l) => l && PRODUCT_MAP[l.id] && l.qty > 0));
        }
      }
      const couponRaw = localStorage.getItem("copa_coupon_v1");
      if (couponRaw) {
        const c = JSON.parse(couponRaw) as { code: string; pct: number };
        if (c?.code && typeof c.pct === "number") setCoupon(c);
      }
    } catch {
      // ignore
    }
    setCartHydrated(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem("copa_cart_v1", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, cartHydrated]);

  // Persist coupon
  useEffect(() => {
    if (!cartHydrated) return;
    try {
      if (coupon) localStorage.setItem("copa_coupon_v1", JSON.stringify(coupon));
      else localStorage.removeItem("copa_coupon_v1");
    } catch {
      // ignore
    }
  }, [coupon, cartHydrated]);

  // Auto-dismiss intro (no click required)
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll while any full-screen overlay is open
  useEffect(() => {
    const open = cartOpen || !!checkout || !!confirmBuy || !!detailsId;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [cartOpen, checkout, confirmBuy, detailsId]);

  // Welcome coupon w/ countdown (2-4 day random expiration, persisted)
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeExpiry, setWelcomeExpiry] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("copa_welcome_v1");
      if (raw) {
        const exp = Number(raw);
        if (Number.isFinite(exp) && exp > Date.now()) {
          setWelcomeExpiry(exp);
          return;
        }
      }
      // First visit: pick random 2-4 day window
      const days = 2 + Math.floor(Math.random() * 3); // 2, 3 or 4
      const exp = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem("copa_welcome_v1", String(exp));
      setWelcomeExpiry(exp);
      // Open welcome modal after intro
      const t = setTimeout(() => setWelcomeOpen(true), 2000);
      return () => clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const countdown = useMemo(() => {
    if (!welcomeExpiry) return null;
    const diff = Math.max(0, welcomeExpiry - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, expired: diff === 0 };
  }, [welcomeExpiry, now]);


  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  const cartSubtotal = useMemo(
    () => cart.reduce((a, l) => a + PRODUCT_MAP[l.id].price * l.qty, 0),
    [cart],
  );
  const cartDiscount = coupon ? cartSubtotal * coupon.pct : 0;
  const cartTotal = cartSubtotal - cartDiscount;

  const applyCoupon = (raw: string) => {
    const code = raw.trim().toUpperCase();
    setCouponError(null);
    if (!code) {
      setCoupon(null);
      return;
    }
    const map: Record<string, number> = {
      COPA10: 0.15,
      NEYVOLTOU26K: 0.25,
    };
    const pct = map[code];
    if (!pct) {
      setCouponError("Cupom inválido");
      setCoupon(null);
      return;
    }
    setCoupon({ code, pct });
    setCouponInput("");
  };

  const addToCart = (id: string) => {
    setCart((c) => {
      const existing = c.find((l) => l.id === id);
      if (existing)
        return c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { id, qty: 1 }];
    });
  };
  const removeLine = (id: string) =>
    setCart((c) => c.filter((l) => l.id !== id));
  const setQty = (id: string, qty: number) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => l.id !== id)
        : c.map((l) => (l.id === id ? { ...l, qty } : l)),
    );

  // Buy-now flow: open confirmation modal first
  const handleBuyClick = (id: string) => {
    const prod = PRODUCTS.find((x) => x.id === id);
    // If product requires variant/option selection, open details modal
    if (prod?.variants && (prod.variants.models || prod.variants.colors)) {
      setDetailsId(id);
      setDetailsImg(0);
      return;
    }
    if (prod?.options && prod.options.length > 0) {
      setDetailsId(id);
      setDetailsImg(0);
      return;
    }
    setConfirmBuy(id);
  };

  const openCheckout = (items: CartLine[]) => {
    setCheckoutStep("contact");
    setFormError(null);
    setCepError(null);
    setCheckout({ items });
  };

  const buyOnly = (id: string) => {
    setConfirmBuy(null);
    openCheckout([{ id, qty: 1 }]);
  };
  const addAndKeepShopping = (id: string) => {
    addToCart(id);
    setConfirmBuy(null);
  };
  const addAndCheckout = (id: string) => {
    addToCart(id);
    setConfirmBuy(null);
    const items = (() => {
      const map = new Map(cart.map((l) => [l.id, l.qty]));
      map.set(id, (map.get(id) ?? 0) + 1);
      return Array.from(map, ([id, qty]) => ({ id, qty }));
    })();
    openCheckout(items);
  };

  const checkoutCart = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    openCheckout(cart);
  };

  const regeneratePix = () => {
    if (!checkout) return;
    setCheckout({ items: checkout.items, nonce: Date.now() });
  };

  // CEP lookup via ViaCEP
  const lookupCep = async (rawCep: string) => {
    const cep = rawCep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    setCepError(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }
      setCustomer((c) => ({
        ...c,
        street: data.logradouro ?? c.street,
        neighborhood: data.bairro ?? c.neighborhood,
        city: data.localidade ?? c.city,
        state: data.uf ?? c.state,
      }));
    } catch {
      setCepError("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  };

  const submitContact = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim());
    const phoneDigits = customer.phone.replace(/\D/g, "");
    if (!customer.name.trim()) return setFormError("Informe seu nome");
    if (!emailOk) return setFormError("Informe um e-mail válido");
    if (phoneDigits.length < 10) return setFormError("Informe um telefone válido");
    setFormError(null);
    setCheckoutStep("address");
  };

  const submitAddress = () => {
    const cepOk = customer.cep.replace(/\D/g, "").length === 8;
    if (!cepOk) return setFormError("Informe um CEP válido");
    if (!customer.street.trim()) return setFormError("Informe a rua");
    if (!customer.number.trim()) return setFormError("Informe o número");
    if (!customer.city.trim() || !customer.state.trim())
      return setFormError("Endereço incompleto");
    setFormError(null);
    setCheckoutStep("pix");
  };



  // Generate PIX when checkout reaches pix step
  useEffect(() => {
    if (!checkout || checkoutStep !== "pix") return;
    const subtotal = checkout.items.reduce(
      (a, l) => a + PRODUCT_MAP[l.id].price * l.qty,
      0,
    );
    const total = coupon ? subtotal * (1 - coupon.pct) : subtotal;
    const desc = checkout.items
      .map((l) => `${l.qty}x ${PRODUCT_MAP[l.id].name}`)
      .join(", ")
      .slice(0, 200);
    setPix({ kind: "loading" });
    setPaid(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(total.toFixed(2)),
            description: desc || "Copa Album 2026",
            external_id: `order_${Date.now()}`,
            customer: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              address: {
                cep: customer.cep,
                street: customer.street,
                number: customer.number,
                neighborhood: customer.neighborhood,
                city: customer.city,
                state: customer.state,
              },
            },
          }),
        });
        const r = (await res.json()) as {
          success: boolean;
          error?: string;
          copy_paste?: string;
          qr_code_image?: string;
          total?: number;
          transaction_id?: string;
        };
        if (cancelled) return;
        if (r.success && r.copy_paste && r.qr_code_image && r.transaction_id) {
          setPix({
            kind: "ok",
            copy_paste: r.copy_paste,
            qr_code_image: r.qr_code_image,
            total: r.total ?? total,
            transaction_id: r.transaction_id,
          });
        } else {
          setPix({ kind: "error", message: r.error ?? "Erro desconhecido" });
        }
      } catch {
        if (!cancelled) setPix({ kind: "error", message: "Falha ao gerar PIX" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [checkout, checkoutStep]);

  // Poll payment confirmation
  useEffect(() => {
    if (pix.kind !== "ok" || paid) return;
    const txId = pix.transaction_id;
    let stopped = false;
    const tick = async () => {
      try {
        const res = await fetch(
          `/api/pix?transaction_id=${encodeURIComponent(txId)}`,
        );
        const r = (await res.json()) as { status?: string };
        if (stopped) return;
        if (r.status === "paid" || r.status === "approved" || r.status === "completed") {
          setPaid(true);
          setCart([]);
          setCoupon(null);
        }
      } catch {
        // ignore
      }
    };
    const interval = setInterval(tick, 4000);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [pix, paid]);

  const closeCheckout = () => {
    setCheckout(null);
    setCheckoutStep("contact");
    setPix({ kind: "idle" });
    setCopied(false);
    setPaid(false);
    setFormError(null);
    setCepError(null);
  };

  const qrSrc = (img: string) =>
    img.startsWith("http") || img.startsWith("data:")
      ? img
      : `data:image/png;base64,${img}`;

  return (
    <main
      className="min-h-screen font-sans overflow-x-hidden antialiased"
      style={{ backgroundColor: INK, color: WHITE }}
    >
      {/* INTRO FADE/BLUR REVEAL — auto-dismiss, no click required */}
      <div
        aria-hidden
        className="fixed inset-0 z-[100] pointer-events-none transition-all duration-[1100ms] ease-out"
        style={{
          backgroundColor: INK,
          opacity: intro ? 1 : 0,
          backdropFilter: intro ? "blur(20px)" : "blur(0px)",
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <div
            className="text-center px-6 transition-all duration-700"
            style={{
              opacity: intro ? 1 : 0,
              transform: intro ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.96)",
              filter: intro ? "blur(0px)" : "blur(8px)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="h-px w-10" style={{ backgroundColor: YELLOW }} />
              <span className="text-[11px] tracking-[0.4em] font-semibold" style={{ color: YELLOW }}>
                COPA ALBUM
              </span>
              <span className="h-px w-10" style={{ backgroundColor: YELLOW }} />
            </div>
            <h1
              className="font-display text-4xl sm:text-6xl md:text-7xl leading-[0.95]"
              style={{ color: WHITE }}
            >
              Bem-vindo à<br />
              <span style={{ color: YELLOW }}>edição 2026</span>
            </h1>
          </div>
        </div>
      </div>

      {/* WELCOME COUPON MODAL with countdown */}
      {welcomeOpen && countdown && !countdown.expired && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setWelcomeOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
            style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
          >
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg, ${YELLOW}, ${GREEN}, ${BLUE})`,
                backgroundSize: "200% 100%",
                animation: "gradient-flow 6s ease infinite",
              }}
            />
            <button
              type="button"
              onClick={() => setWelcomeOpen(false)}
              className="absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: MUTED }}
              aria-label="Fechar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <div className="p-7 text-center">
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase" style={{ color: YELLOW }}>
                Presente de boas-vindas
              </div>
              <h3 className="font-display text-3xl sm:text-4xl mt-3 leading-[1.05]" style={{ color: WHITE }}>
                25% OFF na sua<br />primeira compra
              </h3>
              <p className="mt-3 text-sm" style={{ color: MUTED }}>
                Use o cupom abaixo no carrinho. Oferta por tempo limitado.
              </p>

              <button
                type="button"
                onClick={() => { applyCoupon("NEYVOLTOU26K"); setWelcomeOpen(false); setCartOpen(true); }}
                className="mt-5 w-full rounded-xl px-4 py-4 font-mono font-bold text-lg tracking-wider transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                NEYVOLTOU26K
              </button>
              <div className="mt-2 text-[10px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                Toque para aplicar
              </div>

              <div className="mt-6">
                <div className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: MUTED }}>
                  Expira em
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { v: countdown.d, l: "Dias" },
                    { v: countdown.h, l: "Horas" },
                    { v: countdown.m, l: "Min" },
                    { v: countdown.s, l: "Seg" },
                  ].map((t) => (
                    <div key={t.l} className="rounded-lg py-2.5" style={{ backgroundColor: INK, border: `1px solid ${LINE}` }}>
                      <div className="font-display text-2xl tabular-nums" style={{ color: WHITE }}>
                        {String(t.v).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: MUTED }}>{t.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* PAGE CONTENT WRAPPER — fade-blur in on mount.
          IMPORTANT: only apply transform/filter while intro is active.
          Leaving them on after the intro creates a containing block that
          breaks `position: fixed` for the checkout/cart overlays. */}
      <div
        className="transition-all duration-[1100ms] ease-out"
        style={
          intro
            ? {
                opacity: 0,
                filter: "blur(14px)",
                transform: "scale(1.02)",
              }
            : { opacity: 1 }
        }
      >


      {/* DISCOUNT BANNER — marquee with both coupons */}
      <div
        className="relative overflow-hidden border-b"
        style={{
          background: `linear-gradient(90deg, ${YELLOW}, ${GREEN}, ${BLUE}, ${YELLOW})`,
          backgroundSize: "300% 100%",
          animation: "gradient-flow 10s ease infinite",
          borderColor: `${INK}`,
        }}
      >
        <div className="relative py-2">
          <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 text-[12px] sm:text-[13px] font-semibold" style={{ color: INK }}>
                <span className="inline-flex h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: INK }} />
                <span>Até <span className="font-extrabold">30% OFF</span> na primeira compra</span>
                <button
                  type="button"
                  onClick={() => { applyCoupon("NEYVOLTOU26K"); setCartOpen(true); }}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono font-bold transition-transform hover:scale-105"
                  style={{ backgroundColor: INK, color: YELLOW }}
                >
                  NEYVOLTOU26K · −25%
                </button>
                <span className="opacity-60">•</span>
                <span>Cupom de boas-vindas</span>
                <button
                  type="button"
                  onClick={() => { applyCoupon("COPA10"); setCartOpen(true); }}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono font-bold transition-transform hover:scale-105"
                  style={{ backgroundColor: INK, color: GREEN }}
                >
                  COPA10 · −15%
                </button>
                <span className="opacity-60 mr-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{ backgroundColor: `${INK}d9`, borderBottom: `1px solid ${LINE}` }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-md font-display text-xs"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              CA
            </span>
            <span className="font-semibold tracking-wide text-sm" style={{ color: WHITE }}>
              Copa Album <span style={{ color: MUTED }}>· 2026</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: MUTED }}>
            <a href="#catalogo" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: WHITE,
              color: INK,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            Carrinho
            {cartCount > 0 && (
              <span
                className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                style={{ backgroundColor: GREEN, color: WHITE }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url(${fifaBackdrop})`,
            backgroundSize: "560px",
            backgroundRepeat: "repeat",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${BLUE}33 0%, transparent 55%), linear-gradient(180deg, transparent 0%, ${INK} 90%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 grid gap-12 md:grid-cols-[1.05fr_1fr] items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ backgroundColor: `${YELLOW}1a`, color: YELLOW, border: `1px solid ${YELLOW}33` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: YELLOW }} />
                Edição oficial 2026
              </span>
            </div>
            <h1
              className="font-display text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight"
              style={{ color: WHITE }}
            >
              Seu álbum.<br />
              <span style={{ color: YELLOW }}>Sua seleção.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: MUTED }}>
              Álbum oficial da Copa 2026 com figurinhas personalizadas — sua foto, seu nome e o seu time. Impressão premium, entrega rápida, pagamento via PIX.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                Comprar agora
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:bg-white/5"
                style={{ color: WHITE, border: `1px solid ${LINE}` }}
              >
                Como funciona
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "60", l: "espaços no álbum" },
                { v: "7 dias", l: "para entrega" },
                { v: "100%", l: "personalizado" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl" style={{ color: YELLOW }}>{s.v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[460px] flex items-center justify-center">
            <img
              src={cardArthur}
              alt="Figurinha personalizada Arthur"
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl animate-floaty"
              style={{ transform: "rotate(-12deg)", left: "4%", top: "16%", ["--r" as any]: "-12deg" }}
            />
            <img
              src={cardMiguel}
              alt="Figurinha personalizada Miguel"
              className="relative w-40 sm:w-56 rounded-xl shadow-2xl animate-floaty z-10"
              style={{ ["--r" as any]: "0deg", animationDelay: "0.3s" }}
            />
            <img
              src={cardHelena}
              alt="Figurinha personalizada Helena"
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl animate-floaty"
              style={{ transform: "rotate(12deg)", right: "4%", top: "20%", ["--r" as any]: "12deg", animationDelay: "0.6s" }}
            />

          </div>
        </div>
      </section>

      {/* COUPONS SECTION */}
      <section id="cupons" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: YELLOW }}>
              Cupons ativos
            </div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight" style={{ color: WHITE }}>
              Aplique e economize
            </h2>
            <p className="mt-3 text-sm" style={{ color: MUTED }}>
              Clique no cupom para aplicar automaticamente ao seu carrinho.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
            {[
              { code: "COPA10", pct: 15, color: GREEN, desc: "Cupom geral · use em qualquer pedido" },
              { code: "NEYVOLTOU26K", pct: 25, color: YELLOW, desc: "Boas-vindas · primeira compra" },
            ].map((c) => (
              <div
                key={c.code}
                className="relative rounded-2xl overflow-hidden p-6 flex items-center gap-5 transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: INK,
                  border: `1px solid ${LINE}`,
                  boxShadow: `0 0 0 1px ${c.color}22 inset, 0 10px 30px ${c.color}14`,
                }}
              >
                {/* perforation */}
                <div className="absolute top-0 bottom-0 left-[110px] w-px" style={{ background: `repeating-linear-gradient(to bottom, ${LINE} 0 6px, transparent 6px 12px)` }} />
                <div className="flex flex-col items-center justify-center w-[90px] shrink-0">
                  <div className="font-display text-4xl leading-none" style={{ color: c.color }}>{c.pct}%</div>
                  <div className="text-[10px] mt-1 tracking-[0.25em] uppercase" style={{ color: MUTED }}>OFF</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-base font-bold truncate" style={{ color: WHITE }}>{c.code}</div>
                  <p className="text-xs mt-1" style={{ color: MUTED }}>{c.desc}</p>
                  <button
                    type="button"
                    onClick={() => { applyCoupon(c.code); setCartOpen(true); }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wide transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: c.color, color: INK }}
                  >
                    Aplicar cupom
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="catalogo" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: YELLOW }}>
                Catálogo
              </div>
              <h2 className="font-display text-3xl sm:text-5xl tracking-tight" style={{ color: WHITE }}>
                Escolha sua jogada
              </h2>
            </div>
            <p className="text-sm max-w-sm" style={{ color: MUTED }}>
              Álbum, figurinhas avulsas, packs e a rara dourada. Tudo impresso com qualidade premium.
            </p>
          </div>

          <div className="-mx-4 sm:mx-0 mb-8 sm:mb-10 overflow-x-auto">
            <div className="flex gap-2 px-4 sm:px-0 sm:flex-wrap min-w-max sm:min-w-0">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                const count = c.id === "all"
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => CATEGORY_MAP[p.id] === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap"
                    style={{
                      color: active ? INK : WHITE,
                      backgroundColor: active ? YELLOW : "transparent",
                      border: `1px solid ${active ? YELLOW : LINE}`,
                    }}
                  >
                    {c.label}
                    <span
                      className="ml-2 text-[10px] opacity-70"
                      style={{ color: active ? INK : MUTED }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.filter((p) => category === "all" || CATEGORY_MAP[p.id] === category).map((p) => (
              <article
                key={p.id}
                className="group relative rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${LINE}`,
                }}
              >
                {p.badge && (
                  <div
                    className="absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase"
                    style={{
                      backgroundColor: `${YELLOW}`,
                      color: INK,
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  className="relative h-52 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${SURFACE_2}, ${INK}), url(${fifaBackdrop})`,
                    backgroundSize: "cover, 320px",
                    backgroundBlendMode: "normal, overlay",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-[82%] w-auto transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: GREEN }}>
                    {p.tag}
                  </span>
                  <h3 className="font-display text-lg mt-1.5 leading-tight" style={{ color: WHITE }}>
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed flex-1" style={{ color: MUTED }}>
                    {p.desc}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    {p.oldPrice && (
                      <span className="text-xs line-through" style={{ color: MUTED }}>
                        {fmt(p.oldPrice)}
                      </span>
                    )}
                    <span className="font-display text-2xl" style={{ color: WHITE }}>
                      {fmt(p.price)}
                    </span>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: MUTED }}>
                    {p.installments}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setDetailsId(p.id); setDetailsImg(0); }}
                      className="rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5 inline-flex items-center justify-center gap-1.5"
                      style={{ color: WHITE, border: `1px solid ${LINE}` }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      Detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyClick(p.id)}
                      className="rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: YELLOW, color: INK }}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / BENEFITS */}
      <section style={{ backgroundColor: INK, borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
            {[
              {
                title: "Frete Grátis",
                sub: "Acima de R$ 199",
                icon: (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" />
                    <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
                  </svg>
                ),
              },
              {
                title: "Pagamento PIX",
                sub: "Confirmação na hora",
                icon: (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l9 9-9 9-9-9 9-9z" /><path d="M8 12l3 3 5-5" />
                  </svg>
                ),
              },
              {
                title: "Entrega Rápida",
                sub: "Para todo Brasil",
                icon: (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                  </svg>
                ),
              },
              {
                title: "4.9 de 5",
                sub: "avaliações reais",
                icon: (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ),
              },
            ].map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center py-8 sm:py-10 px-4 sm:px-6"
                style={{ backgroundColor: INK }}
              >
                <div style={{ color: YELLOW }}>{b.icon}</div>
                <div className="font-display text-base sm:text-lg mt-3 sm:mt-4" style={{ color: WHITE }}>{b.title}</div>
                <div className="text-[11px] sm:text-xs mt-1" style={{ color: MUTED }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section id="como-funciona" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: YELLOW }}>
              Processo
            </div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight" style={{ color: WHITE }}>
              Simples como um passe de gol
            </h2>
          </div>
          <div className="grid gap-px sm:grid-cols-3" style={{ backgroundColor: LINE }}>
            {[
              { n: "01", t: "Escolha", d: "Selecione o álbum e as figurinhas que quiser no catálogo." },
              { n: "02", t: "Pague via PIX", d: "Confirmação automática em segundos pelo QR Code." },
              { n: "03", t: "Envie a foto", d: "Em até 7 dias úteis seu kit chega impresso em casa." },
            ].map((s) => (
              <div key={s.n} className="p-8" style={{ backgroundColor: SURFACE }}>
                <div className="font-display text-4xl mb-4" style={{ color: YELLOW }}>{s.n}</div>
                <div className="font-display text-xl mb-2" style={{ color: WHITE }}>{s.t}</div>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: YELLOW }}>
            Perguntas frequentes
          </div>
          <h2 className="font-display text-3xl sm:text-4xl mb-10" style={{ color: WHITE }}>Tudo que você precisa saber</h2>
          <div className="space-y-3">
            {[
              { q: "Como envio a foto para a figurinha?", a: "Após o pagamento, você recebe um link por e-mail para enviar a foto em alta resolução." },
              { q: "Quanto tempo leva para chegar?", a: "Até 7 dias úteis após o envio da foto, para todo o Brasil." },
              { q: "Posso comprar só o álbum?", a: "Sim. Cada item do catálogo é vendido separadamente." },
              { q: "Quais são as formas de pagamento?", a: "Pagamento via PIX, com QR Code e confirmação automática." },
            ].map((f) => (
              <details
                key={f.q}
                className="group rounded-xl p-5 cursor-pointer transition-colors hover:bg-white/[0.02]"
                style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
              >
                <summary className="flex items-center justify-between list-none font-semibold text-sm" style={{ color: WHITE }}>
                  {f.q}
                  <span className="text-xl transition-transform group-open:rotate-45" style={{ color: YELLOW }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-10" style={{ backgroundColor: INK, borderTop: `1px solid ${LINE}` }}>
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: MUTED }}>
          <div>© 2026 Copa Album. Edição não oficial — produto colecionável personalizado.</div>
          <div className="flex items-center gap-4">
            <span>Pagamento via PIX</span>
            <span>·</span>
            <span>Envio para todo o Brasil</span>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL */}
      {detailsId && (() => {
        const p = PRODUCT_MAP[detailsId];
        if (!p) return null;
        const img = p.gallery[detailsImg] ?? p.gallery[0];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setDetailsId(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl animate-slide-up"
              style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
            >
              <button
                type="button"
                onClick={() => setDetailsId(null)}
                aria-label="Fechar"
                className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center text-lg transition-colors hover:bg-white/10"
                style={{ color: WHITE, backgroundColor: `${INK}CC`, border: `1px solid ${LINE}` }}
              >
                ×
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div
                  className="relative flex flex-col"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${SURFACE_2}, ${INK}), url(${fifaBackdrop})`,
                    backgroundSize: "cover, 360px",
                    backgroundBlendMode: "normal, overlay",
                    borderRight: `1px solid ${LINE}`,
                  }}
                >
                  <div className="relative flex-1 flex items-center justify-center min-h-[320px] sm:min-h-[440px] p-8">
                    <img
                      key={img.src}
                      src={img.src}
                      alt={`${p.name} — ${img.label}`}
                      className="max-h-[420px] w-auto object-contain drop-shadow-2xl animate-fade-in"
                    />
                    <span
                      className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.25em] uppercase"
                      style={{ backgroundColor: `${INK}E6`, color: YELLOW, border: `1px solid ${LINE}` }}
                    >
                      {img.label}
                    </span>
                    {p.gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setDetailsImg((i) => (i - 1 + p.gallery.length) % p.gallery.length)}
                          aria-label="Anterior"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ color: WHITE, backgroundColor: `${INK}CC`, border: `1px solid ${LINE}` }}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailsImg((i) => (i + 1) % p.gallery.length)}
                          aria-label="Próxima"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ color: WHITE, backgroundColor: `${INK}CC`, border: `1px solid ${LINE}` }}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 p-4" style={{ borderTop: `1px solid ${LINE}` }}>
                    {p.gallery.map((g, i) => (
                      <button
                        key={g.src + i}
                        type="button"
                        onClick={() => setDetailsImg(i)}
                        className="relative h-16 w-16 rounded-lg overflow-hidden transition-all"
                        style={{
                          border: `2px solid ${i === detailsImg ? YELLOW : LINE}`,
                          opacity: i === detailsImg ? 1 : 0.6,
                        }}
                      >
                        <img src={g.src} alt={g.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col">
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: GREEN }}>
                    {p.tag}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl mt-2 leading-tight" style={{ color: WHITE }}>
                    {p.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {p.desc}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {p.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm" style={{ color: WHITE }}>
                        <span
                          className="mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${YELLOW}22`, color: YELLOW }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  {p.variants && (
                    <div className="mt-6 space-y-4">
                      {p.variants.colors && (
                        <div>
                          <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: MUTED }}>
                            Cor
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {p.variants.colors.map((c) => {
                              const active = variantColor === c;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setVariantColor(c)}
                                  className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
                                  style={{
                                    color: active ? INK : WHITE,
                                    backgroundColor: active ? YELLOW : "transparent",
                                    border: `1px solid ${active ? YELLOW : LINE}`,
                                  }}
                                >
                                  {c}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {p.variants.models && (
                        <div>
                          <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: MUTED }}>
                            Sistema
                          </div>
                          <div className="flex gap-2 mb-4">
                            {([
                              { id: "android", label: "Android" },
                              { id: "ios", label: "iOS" },
                            ] as const).map((s) => {
                              const active = variantSystem === s.id;
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => { setVariantSystem(s.id); setVariantModel(null); }}
                                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all"
                                  style={{
                                    color: active ? INK : WHITE,
                                    backgroundColor: active ? YELLOW : "transparent",
                                    border: `1px solid ${active ? YELLOW : LINE}`,
                                  }}
                                >
                                  {s.label}
                                </button>
                              );
                            })}
                          </div>
                          {variantSystem && (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                                  Modelo
                                </div>
                                {variantModel && (
                                  <div className="text-[11px]" style={{ color: GREEN }}>{variantModel}</div>
                                )}
                              </div>
                              <div
                                className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-2 rounded-lg p-2"
                                style={{ border: `1px solid ${LINE}`, backgroundColor: `${INK}80` }}
                              >
                                {p.variants.models
                                  .filter((m) => variantSystem === "ios" ? m.toLowerCase().includes("iphone") : !m.toLowerCase().includes("iphone"))
                                  .map((m) => {
                                    const active = variantModel === m;
                                    return (
                                      <button
                                        key={m}
                                        type="button"
                                        onClick={() => setVariantModel(m)}
                                        className="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
                                        style={{
                                          color: active ? INK : WHITE,
                                          backgroundColor: active ? YELLOW : SURFACE_2,
                                          border: `1px solid ${active ? YELLOW : LINE}`,
                                        }}
                                      >
                                        {m}
                                      </button>
                                    );
                                  })}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {p.options && p.options.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {p.options.map((opt) => (
                        <div key={opt.name}>
                          <div className="text-[11px] mb-2" style={{ color: MUTED }}>
                            <span className="font-semibold tracking-[0.2em] uppercase" style={{ color: MUTED }}>{opt.name}:</span>{" "}
                            <span style={{ color: WHITE }}>{variantOptions[opt.name] ?? opt.values[0]}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {opt.values.map((v) => {
                              const active = (variantOptions[opt.name] ?? opt.default ?? opt.values[0]) === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setVariantOptions((prev) => ({ ...prev, [opt.name]: v }))}
                                  className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all leading-tight max-w-[140px]"
                                  style={{
                                    color: active ? INK : WHITE,
                                    backgroundColor: active ? YELLOW : "transparent",
                                    border: `1px solid ${active ? YELLOW : LINE}`,
                                  }}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {p.specs && p.specs.length > 0 && (
                    <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
                      <div className="font-display text-lg mb-4" style={{ color: WHITE }}>
                        Características do produto
                      </div>
                      <div className="space-y-5">
                        {p.specs.map((g) => (
                          <div key={g.group}>
                            <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: GREEN }}>
                              {g.group}
                            </div>
                            <div
                              className="rounded-lg overflow-hidden"
                              style={{ border: `1px solid ${LINE}`, backgroundColor: `${INK}80` }}
                            >
                              {g.items.map((it, i) => (
                                <div
                                  key={it.label}
                                  className="flex items-start justify-between gap-4 px-3.5 py-2.5 text-xs"
                                  style={{
                                    borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
                                  }}
                                >
                                  <span style={{ color: MUTED }}>{it.label}</span>
                                  <span className="text-right font-medium" style={{ color: WHITE }}>{it.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  <div className="mt-6 pt-5 flex items-baseline gap-3" style={{ borderTop: `1px solid ${LINE}` }}>
                    {p.oldPrice && (
                      <span className="text-sm line-through" style={{ color: MUTED }}>
                        {fmt(p.oldPrice)}
                      </span>
                    )}
                    <span className="font-display text-3xl sm:text-4xl" style={{ color: WHITE }}>
                      {fmt(p.price)}
                    </span>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: MUTED }}>
                    {p.installments}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { addToCart(p.id); setDetailsId(null); setCartOpen(true); }}
                      className="rounded-full px-4 py-3 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5"
                      style={{ color: WHITE, border: `1px solid ${LINE}` }}
                    >
                      Adicionar ao carrinho
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDetailsId(null); handleBuyClick(p.id); }}
                      className="rounded-full px-4 py-3 text-xs font-bold tracking-wide transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: YELLOW, color: INK }}
                    >
                      Comprar agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BUY-NOW CONFIRMATION MODAL */}
      {confirmBuy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmBuy(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
            style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={PRODUCT_MAP[confirmBuy].image}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover"
                  style={{ border: `1px solid ${LINE}` }}
                />
                <div className="flex-1">
                  <div className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: GREEN }}>
                    {PRODUCT_MAP[confirmBuy].tag}
                  </div>
                  <h3 className="font-display text-lg mt-0.5 leading-tight" style={{ color: WHITE }}>
                    {PRODUCT_MAP[confirmBuy].name}
                  </h3>
                  <div className="font-display text-xl mt-1" style={{ color: YELLOW }}>
                    {fmt(PRODUCT_MAP[confirmBuy].price)}
                  </div>
                </div>
              </div>

              <div className="mt-6 mb-2 text-sm font-semibold" style={{ color: WHITE }}>
                Deseja levar mais alguma coisa?
              </div>
              <p className="text-xs mb-5" style={{ color: MUTED }}>
                Aproveite o frete único e adicione outros itens ao seu pedido.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => buyOnly(confirmBuy)}
                  className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-left flex items-center justify-between transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  <span>Comprar apenas este produto</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => addAndKeepShopping(confirmBuy)}
                  className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-left flex items-center justify-between transition-colors hover:bg-white/5"
                  style={{ color: WHITE, border: `1px solid ${LINE}` }}
                >
                  <span>Adicionar e continuar vendo o catálogo</span>
                  <span style={{ color: MUTED }}>+</span>
                </button>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => addAndCheckout(confirmBuy)}
                    className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-left flex items-center justify-between transition-colors hover:bg-white/5"
                    style={{ color: WHITE, border: `1px solid ${LINE}` }}
                  >
                    <span>Adicionar e finalizar com o carrinho ({cartCount})</span>
                    <span style={{ color: MUTED }}>→</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setConfirmBuy(null)}
                className="mt-5 w-full text-xs font-semibold py-2"
                style={{ color: MUTED }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setCartOpen(false)}>
          <div className="flex-1 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full overflow-y-auto animate-slide-in-right"
            style={{ backgroundColor: INK, borderLeft: `1px solid ${LINE}` }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between sticky top-0"
              style={{ backgroundColor: INK, borderBottom: `1px solid ${LINE}` }}
            >
              <div className="font-display text-lg" style={{ color: WHITE }}>
                Carrinho <span style={{ color: MUTED }}>({cartCount})</span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-base transition-colors hover:bg-white/5"
                style={{ color: WHITE, border: `1px solid ${LINE}` }}
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              {cart.length === 0 && (
                <div className="text-center py-20">
                  <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
                  </div>
                  <p className="font-display text-lg" style={{ color: WHITE }}>
                    Seu carrinho está vazio
                  </p>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>
                    Adicione itens do catálogo para começar.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide"
                    style={{ backgroundColor: YELLOW, color: INK }}
                  >
                    Ver catálogo
                  </button>
                </div>
              )}
              {cart.map((line) => {
                const p = PRODUCT_MAP[line.id];
                return (
                  <div
                    key={line.id}
                    className="flex gap-3 rounded-xl p-3 animate-slide-up"
                    style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
                  >
                    <img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover" style={{ border: `1px solid ${LINE}` }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm leading-tight" style={{ color: WHITE }}>
                        {p.name}
                      </div>
                      <div className="text-sm mt-1" style={{ color: YELLOW }}>
                        {fmt(p.price * line.qty)}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-full" style={{ border: `1px solid ${LINE}` }}>
                          <button
                            type="button"
                            onClick={() => setQty(line.id, line.qty - 1)}
                            className="h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors hover:bg-white/5"
                            style={{ color: WHITE }}
                            aria-label="Diminuir"
                          >
                            −
                          </button>
                          <span className="text-sm w-7 text-center font-semibold" style={{ color: WHITE }}>
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(line.id, line.qty + 1)}
                            className="h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors hover:bg-white/5"
                            style={{ color: WHITE }}
                            aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="ml-auto text-xs transition-colors hover:text-white"
                          style={{ color: MUTED }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {cart.length > 0 && (
              <div
                className="p-5 space-y-4"
                style={{ borderTop: `1px solid ${LINE}`, backgroundColor: INK }}
              >
                {/* COUPON */}
                <div>
                  {coupon ? (
                    <div
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 animate-fade-in"
                      style={{ backgroundColor: `${GREEN}1a`, border: `1px solid ${GREEN}55` }}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        <span className="font-mono font-bold" style={{ color: WHITE }}>{coupon.code}</span>
                        <span style={{ color: GREEN }}>−{Math.round(coupon.pct * 100)}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoupon(null)}
                        className="text-[11px]"
                        style={{ color: MUTED }}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") applyCoupon(couponInput); }}
                          placeholder="Cupom de desconto"
                          className="flex-1 rounded-lg px-3 py-2.5 text-xs font-mono uppercase tracking-wider outline-none focus:border-white/30 transition-colors"
                          style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}`, color: WHITE }}
                        />
                        <button
                          type="button"
                          onClick={() => applyCoupon(couponInput)}
                          className="rounded-lg px-4 text-xs font-semibold transition-colors hover:bg-white/5"
                          style={{ color: WHITE, border: `1px solid ${LINE}` }}
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1.5 text-[11px]" style={{ color: "#ff6b6b" }}>{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs" style={{ color: MUTED }}>
                    <span>Subtotal</span>
                    <span>{fmt(cartSubtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex items-baseline justify-between text-xs" style={{ color: GREEN }}>
                      <span>Desconto ({coupon.code})</span>
                      <span>−{fmt(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between pt-2" style={{ borderTop: `1px solid ${LINE}` }}>
                    <span className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                      Total
                    </span>
                    <span className="font-display text-3xl" style={{ color: WHITE }}>
                      {fmt(cartTotal)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={checkoutCart}
                  className="w-full rounded-full px-5 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  Finalizar com PIX
                </button>
                <p className="text-[11px] text-center" style={{ color: MUTED }}>
                  Pagamento seguro · Confirmação automática
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* FULL-SCREEN CHECKOUT */}
      {checkout && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
          style={{ backgroundColor: INK }}
        >
          {/* Top bar */}
          <div
            className="sticky top-0 z-10 backdrop-blur-md"
            style={{
              backgroundColor: `${INK}E6`,
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GREEN }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: YELLOW }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BLUE }} />
                </div>
                <span className="font-display text-sm sm:text-base tracking-wide" style={{ color: WHITE }}>
                  Finalizar pedido
                </span>
              </div>
              {/* Step indicator */}
              <div className="hidden sm:flex items-center gap-2">
                {(["contact", "address", "pix"] as const).map((s, i) => {
                  const labels = ["Contato", "Endereço", "Pagamento"];
                  const active = checkoutStep === s;
                  const done =
                    (checkoutStep === "address" && i === 0) ||
                    (checkoutStep === "pix" && i < 2);
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                        style={{
                          backgroundColor: active ? YELLOW : done ? GREEN : "transparent",
                          color: active ? INK : done ? WHITE : MUTED,
                          border: active || done ? "none" : `1px solid ${LINE}`,
                        }}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{ color: active ? WHITE : MUTED }}
                      >
                        {labels[i]}
                      </span>
                      {i < 2 && (
                        <span className="h-px w-6" style={{ backgroundColor: LINE }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                className="h-9 px-4 rounded-full text-xs font-semibold tracking-wide transition-colors hover:bg-white/5 inline-flex items-center gap-1.5"
                style={{ color: WHITE, border: `1px solid ${LINE}` }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                Voltar à loja
              </button>
            </div>
          </div>

          {/* Mobile step indicator */}
          <div className="sm:hidden px-5 pt-5 max-w-6xl mx-auto">
            <div className="flex items-center gap-1.5">
              {(["contact", "address", "pix"] as const).map((s, i) => {
                const active = checkoutStep === s;
                const done =
                  (checkoutStep === "address" && i === 0) ||
                  (checkoutStep === "pix" && i < 2);
                return (
                  <span
                    key={s}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{ backgroundColor: active ? YELLOW : done ? GREEN : LINE }}
                  />
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10 lg:items-start">
            {/* Left: form */}
            <div>
              <div className="max-w-xl">
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: YELLOW }}>
                  Etapa {checkoutStep === "contact" ? "1" : checkoutStep === "address" ? "2" : "3"} de 3
                </p>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight" style={{ color: WHITE }}>
                  {checkoutStep === "contact"
                    ? "Seus dados de contato"
                    : checkoutStep === "address"
                      ? "Endereço de entrega"
                      : "Pague com PIX"}
                </h2>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>
                  {checkoutStep === "contact"
                    ? "Para enviar o comprovante e as instruções da sua figurinha."
                    : checkoutStep === "address"
                      ? "Digite seu CEP e completamos o resto pra você."
                      : "Escaneie o QR Code abaixo. A confirmação é automática."}
                </p>

                <div className="mt-7">
                  {checkoutStep === "contact" && (
                    <div className="space-y-4 animate-fade-in">
                      <FieldInput
                        label="Nome completo"
                        value={customer.name}
                        onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
                        placeholder="Maria Silva"
                      />
                      <EmailField
                        value={customer.email}
                        onChange={(v) => setCustomer((c) => ({ ...c, email: v }))}
                      />
                      <FieldInput
                        label="Telefone (WhatsApp)"
                        value={customer.phone}
                        onChange={(v) =>
                          setCustomer((c) => ({ ...c, phone: maskPhone(v) }))
                        }
                        placeholder="(11) 99999-9999"
                        inputMode="tel"
                      />
                      {formError && (
                        <p className="text-xs" style={{ color: "#ff6b6b" }}>{formError}</p>
                      )}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={submitContact}
                          className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-bold tracking-wide transition-transform hover:scale-[1.01]"
                          style={{ backgroundColor: YELLOW, color: INK }}
                        >
                          Continuar para endereço →
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === "address" && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                          CEP
                        </label>
                        <div className="mt-1 flex gap-2">
                          <input
                            value={customer.cep}
                            onChange={(e) => {
                              const v = maskCep(e.target.value);
                              setCustomer((c) => ({ ...c, cep: v }));
                              if (v.replace(/\D/g, "").length === 8) lookupCep(v);
                            }}
                            placeholder="00000-000"
                            inputMode="numeric"
                            className="flex-1 rounded-lg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400/40"
                            style={{ backgroundColor: "#08080d", border: `1px solid ${LINE}`, color: WHITE }}
                          />
                          {cepLoading && (
                            <div className="h-10 w-10 rounded-full border-2 animate-spin self-center"
                              style={{ borderColor: `${YELLOW}40`, borderTopColor: YELLOW }} />
                          )}
                        </div>
                        {cepError && (
                          <p className="mt-1 text-xs" style={{ color: "#ff6b6b" }}>{cepError}</p>
                        )}
                      </div>
                      <FieldInput
                        label="Rua"
                        value={customer.street}
                        onChange={(v) => setCustomer((c) => ({ ...c, street: v }))}
                        placeholder="preenchido pelo CEP"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FieldInput
                          label="Número"
                          value={customer.number}
                          onChange={(v) => setCustomer((c) => ({ ...c, number: v }))}
                          placeholder="123"
                          inputMode="numeric"
                        />
                        <FieldInput
                          label="Bairro"
                          value={customer.neighborhood}
                          onChange={(v) => setCustomer((c) => ({ ...c, neighborhood: v }))}
                          placeholder=""
                        />
                      </div>
                      <div className="grid grid-cols-[1fr_80px] gap-3">
                        <FieldInput
                          label="Cidade"
                          value={customer.city}
                          onChange={(v) => setCustomer((c) => ({ ...c, city: v }))}
                          placeholder=""
                        />
                        <FieldInput
                          label="UF"
                          value={customer.state}
                          onChange={(v) =>
                            setCustomer((c) => ({ ...c, state: v.toUpperCase().slice(0, 2) }))
                          }
                          placeholder=""
                        />
                      </div>
                      {formError && (
                        <p className="text-xs" style={{ color: "#ff6b6b" }}>{formError}</p>
                      )}
                      <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep("contact")}
                          className="rounded-full px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
                          style={{ color: WHITE, border: `1px solid ${LINE}` }}
                        >
                          ← Voltar
                        </button>
                        <button
                          type="button"
                          onClick={submitAddress}
                          className="flex-1 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-transform hover:scale-[1.01]"
                          style={{ backgroundColor: YELLOW, color: INK }}
                        >
                          Confirmar e gerar PIX →
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === "pix" && (
                    <div className="animate-fade-in">
                      {pix.kind === "loading" && (
                        <div className="text-center py-14">
                          <div className="mx-auto h-12 w-12 rounded-full border-2 animate-spin" style={{ borderColor: `${YELLOW}40`, borderTopColor: YELLOW }} />
                          <p className="mt-5 text-sm" style={{ color: MUTED }}>Gerando QR Code...</p>
                        </div>
                      )}
                      {pix.kind === "error" && (
                        <div className="text-center py-10">
                          <p className="font-display text-xl" style={{ color: WHITE }}>Não foi possível gerar o PIX</p>
                          <p className="mt-2 text-sm" style={{ color: MUTED }}>{pix.message}</p>
                          <button
                            type="button"
                            onClick={regeneratePix}
                            className="mt-6 rounded-full px-6 py-2.5 text-xs font-bold"
                            style={{ backgroundColor: YELLOW, color: INK }}
                          >
                            Tentar novamente
                          </button>
                        </div>
                      )}
                      {pix.kind === "ok" && (
                        <div>
                          {paid ? (
                            <div className="text-center py-10 animate-pop-in">
                              <div
                                className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-5"
                                style={{ backgroundColor: GREEN }}
                              >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              </div>
                              <div className="font-display text-3xl" style={{ color: WHITE }}>
                                Pagamento confirmado
                              </div>
                              <p className="mt-3 text-sm" style={{ color: MUTED }}>
                                Em instantes você receberá um e-mail com as instruções para enviar a foto.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                              <div
                                className="p-4 rounded-2xl mx-auto"
                                style={{ backgroundColor: WHITE }}
                              >
                                {pix.qr_code_image ? (
                                  <img
                                    src={qrSrc(pix.qr_code_image)}
                                    alt="QR Code PIX"
                                    className="w-60 h-60 object-contain"
                                  />
                                ) : (
                                  <div className="w-60 h-60" />
                                )}
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: MUTED }}>
                                  Como pagar
                                </p>
                                <ol className="mt-3 space-y-2 text-sm" style={{ color: WHITE }}>
                                  <li><span style={{ color: YELLOW }} className="font-bold">1.</span> Abra o app do seu banco</li>
                                  <li><span style={{ color: YELLOW }} className="font-bold">2.</span> Escolha pagar com PIX → QR Code</li>
                                  <li><span style={{ color: YELLOW }} className="font-bold">3.</span> Aponte a câmera para o código</li>
                                </ol>
                                <div className="mt-5">
                                  <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                                    Ou copie o código PIX
                                  </label>
                                  <div
                                    className="mt-2 rounded-lg p-3 text-xs break-all font-mono max-h-24 overflow-y-auto"
                                    style={{ backgroundColor: "#08080d", border: `1px solid ${LINE}`, color: MUTED }}
                                  >
                                    {pix.copy_paste}
                                  </div>
                                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(pix.copy_paste);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                      }}
                                      className="flex-1 rounded-full px-5 py-3 text-sm font-bold tracking-wide transition-transform hover:scale-[1.01]"
                                      style={{
                                        backgroundColor: copied ? GREEN : YELLOW,
                                        color: copied ? WHITE : INK,
                                      }}
                                    >
                                      {copied ? "✓ Código copiado" : "Copiar código PIX"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={regeneratePix}
                                      className="rounded-full px-5 py-3 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5 inline-flex items-center justify-center gap-2"
                                      style={{ color: WHITE, border: `1px solid ${LINE}` }}
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
                                      Novo QR
                                    </button>
                                  </div>
                                  <div className="mt-4 flex items-center gap-2 text-[11px]" style={{ color: MUTED }}>
                                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
                                    Aguardando confirmação automática
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: order summary */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
              >
                <div className="px-5 py-4" style={{ borderBottom: `1px solid ${LINE}` }}>
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: MUTED }}>
                    Resumo do pedido
                  </p>
                </div>
                <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
                  {checkout.items.map((line) => {
                    const p = PRODUCT_MAP[line.id];
                    if (!p) return null;
                    return (
                      <div key={line.id} className="flex items-center gap-3">
                        <div
                          className="h-14 w-14 rounded-lg overflow-hidden shrink-0"
                          style={{ backgroundColor: SURFACE_2 }}
                        >
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: WHITE }}>{p.name}</p>
                          <p className="text-[11px]" style={{ color: MUTED }}>Qtd: {line.qty}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ color: WHITE }}>
                          {fmt(p.price * line.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="px-5 py-4 space-y-2" style={{ borderTop: `1px solid ${LINE}` }}>
                  {(() => {
                    const subtotal = checkout.items.reduce(
                      (s, l) => s + (PRODUCT_MAP[l.id]?.price ?? 0) * l.qty,
                      0,
                    );
                    const discount = coupon ? subtotal * coupon.pct : 0;
                    const total = subtotal - discount;
                    return (
                      <>
                        <div className="flex justify-between text-xs" style={{ color: MUTED }}>
                          <span>Subtotal</span><span>{fmt(subtotal)}</span>
                        </div>
                        {coupon && (
                          <div className="flex justify-between text-xs" style={{ color: GREEN }}>
                            <span>Cupom {coupon.code}</span><span>−{fmt(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs" style={{ color: MUTED }}>
                          <span>Frete</span><span style={{ color: GREEN }}>Grátis</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2" style={{ borderTop: `1px solid ${LINE}` }}>
                          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Total</span>
                          <span className="font-display text-2xl" style={{ color: WHITE }}>{fmt(total)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px]" style={{ color: MUTED }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Pagamento seguro · Confirmação automática
              </div>
            </aside>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function EmailField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"];
  const [focused, setFocused] = useState(false);
  const atIdx = value.indexOf("@");
  const local = atIdx === -1 ? value : value.slice(0, atIdx);
  const typedDomain = atIdx === -1 ? "" : value.slice(atIdx + 1).toLowerCase();
  const suggestions =
    local.length === 0
      ? []
      : atIdx === -1
        ? DOMAINS.map((d) => `${local}@${d}`)
        : DOMAINS.filter((d) => d.startsWith(typedDomain) && d !== typedDomain)
            .map((d) => `${local}@${d}`);
  const showList = focused && suggestions.length > 0;
  return (
    <div className="relative">
      <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#7a7a85" }}>
        E-mail
      </label>
      <input
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="voce@gmail.com"
        className="mt-1 w-full rounded-lg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400/40"
        style={{ backgroundColor: "#08080d", border: "1px solid #1f1f28", color: "#fff" }}
      />
      {showList && (
        <div
          className="absolute left-0 right-0 mt-1 z-20 rounded-lg overflow-hidden shadow-2xl animate-fade-in"
          style={{ backgroundColor: "#0f0f17", border: "1px solid #2A2A38" }}
        >
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setFocused(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
              style={{ color: "#fff" }}
            >
              <span style={{ color: "#9CA0AE" }}>{s.split("@")[0]}</span>
              <span style={{ color: "#F4C430" }}>@{s.split("@")[1]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "search" | "url" | "none" | "decimal";
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#7a7a85" }}>
        {label}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400/40"
        style={{ backgroundColor: "#08080d", border: "1px solid #1f1f28", color: "#fff" }}
      />
    </div>
  );
}

