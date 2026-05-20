import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import albumCover from "@/assets/album-cover.png";
import cardMiguel from "@/assets/card-miguel.png";
import cardArthur from "@/assets/card-arthur.png";
import cardHelena from "@/assets/card-helena.png";
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
};

const PRODUCTS: Product[] = [
  {
    id: "album",
    name: "Álbum Oficial Copa 2026",
    tag: "Álbum",
    price: 197,
    oldPrice: 297,
    installments: "ou 12x de R$ 19,90 sem juros",
    desc: "Capa dura, 60 espaços numerados para colar suas figurinhas personalizadas.",
    image: albumCover,
    badge: "Mais vendido",
  },
  {
    id: "fig-individual",
    name: "Figurinha Personalizada",
    tag: "Figurinha",
    price: 9.9,
    installments: "Envio em até 7 dias úteis",
    desc: "Sua foto, nome e número impressos no estilo oficial da Copa.",
    image: cardMiguel,
  },
  {
    id: "fig-pack-10",
    name: "Pack 10 Figurinhas",
    tag: "Pack",
    price: 79,
    oldPrice: 99,
    installments: "R$ 7,90 cada — economize 20%",
    desc: "Monte sua seleção do casal, da família ou do time.",
    image: cardArthur,
    badge: "Economia",
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
  },
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
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmBuy, setConfirmBuy] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<{ items: CartLine[]; nonce?: number } | null>(null);
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
  const handleBuyClick = (id: string) => setConfirmBuy(id);

  const buyOnly = (id: string) => {
    setConfirmBuy(null);
    setCheckout({ items: [{ id, qty: 1 }] });
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
    setCheckout({ items });
  };

  const checkoutCart = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setCheckout({ items: cart });
  };

  const regeneratePix = () => {
    if (!checkout) return;
    setCheckout({ items: checkout.items, nonce: Date.now() });
  };


  // Generate PIX when checkout opens
  useEffect(() => {
    if (!checkout) return;
    const total = checkout.items.reduce(
      (a, l) => a + PRODUCT_MAP[l.id].price * l.qty,
      0,
    );
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
  }, [checkout]);

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
    setPix({ kind: "idle" });
    setCopied(false);
    setPaid(false);
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
      {/* INTRO SPLASH */}
      {intro && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: INK }}
          onClick={() => setIntro(false)}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${fifaBackdrop})`,
              backgroundSize: "500px",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="relative text-center px-6 animate-intro">
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
            <p className="mt-6 text-sm sm:text-base" style={{ color: MUTED }}>
              Álbum oficial e figurinhas personalizadas.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase" style={{ color: MUTED }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
              Entrando no estádio
            </div>
          </div>
        </div>
      )}

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
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                Ver catálogo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:bg-white/5"
                style={{ color: WHITE, border: `1px solid ${LINE}` }}
              >
                Como funciona
              </a>
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
              alt=""
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl animate-floaty"
              style={{ transform: "rotate(-10deg)", left: "4%", top: "18%", ["--r" as any]: "-10deg" }}
            />
            <img
              src={albumCover}
              alt="Álbum Copa 2026"
              className="relative w-48 sm:w-72 rounded-xl shadow-2xl animate-floaty z-10"
              style={{ ["--r" as any]: "0deg", animationDelay: "0.3s" }}
            />
            <img
              src={cardHelena}
              alt=""
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl animate-floaty"
              style={{ transform: "rotate(10deg)", right: "4%", top: "22%", ["--r" as any]: "10deg", animationDelay: "0.6s" }}
            />
          </div>
        </div>
      </section>

      {/* CATALOG */}
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

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
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
                      onClick={() => addToCart(p.id)}
                      className="rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5"
                      style={{ color: WHITE, border: `1px solid ${LINE}` }}
                    >
                      Carrinho
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
            className="w-full max-w-md h-full overflow-y-auto flex flex-col animate-slide-in-right"
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

            <div className="flex-1 p-5 space-y-3">
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
                className="p-5 space-y-4 sticky bottom-0"
                style={{ borderTop: `1px solid ${LINE}`, backgroundColor: INK }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                    Total
                  </span>
                  <span className="font-display text-3xl" style={{ color: WHITE }}>
                    {fmt(cartTotal)}
                  </span>
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

      {/* CHECKOUT / PIX MODAL */}
      {checkout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeCheckout}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
            style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${LINE}` }}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-base" style={{ color: WHITE }}>Pagamento via PIX</span>
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                className="h-8 w-8 rounded-full flex items-center justify-center text-base transition-colors hover:bg-white/5"
                style={{ color: WHITE, border: `1px solid ${LINE}` }}
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {pix.kind === "loading" && (
                <div className="text-center py-14">
                  <div className="mx-auto h-10 w-10 rounded-full border-2 animate-spin" style={{ borderColor: `${YELLOW}40`, borderTopColor: YELLOW }} />
                  <p className="mt-5 text-sm" style={{ color: MUTED }}>
                    Gerando QR Code...
                  </p>
                </div>
              )}
              {pix.kind === "error" && (
                <div className="text-center py-8">
                  <p className="font-display text-lg" style={{ color: WHITE }}>
                    Não foi possível gerar o PIX
                  </p>
                  <p className="mt-2 text-sm" style={{ color: MUTED }}>
                    {pix.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const c = checkout;
                      setCheckout(null);
                      setTimeout(() => setCheckout(c), 50);
                    }}
                    className="mt-6 rounded-full px-6 py-2.5 text-xs font-semibold"
                    style={{ backgroundColor: YELLOW, color: INK }}
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
              {pix.kind === "ok" && (
                <div>
                  {paid ? (
                    <div className="text-center py-6 animate-pop-in">
                      <div
                        className="mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: GREEN }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div className="font-display text-2xl" style={{ color: WHITE }}>
                        Pagamento confirmado
                      </div>
                      <p className="mt-2 text-sm" style={{ color: MUTED }}>
                        Em instantes você receberá um e-mail com as instruções para enviar a foto.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-between mb-5">
                        <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                          Total a pagar
                        </span>
                        <span className="font-display text-3xl" style={{ color: WHITE }}>
                          {fmt(pix.total)}
                        </span>
                      </div>

                      {pix.qr_code_image && (
                        <div className="flex justify-center">
                          <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: WHITE }}
                          >
                            <img
                              src={qrSrc(pix.qr_code_image)}
                              alt="QR Code PIX"
                              className="w-56 h-56 object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <p className="mt-5 text-center text-xs" style={{ color: MUTED }}>
                        Aponte a câmera do seu app do banco para o QR Code
                      </p>

                      <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
                        <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                          Ou copie o código PIX
                        </label>
                        <div
                          className="mt-2 rounded-lg p-3 text-xs break-all font-mono max-h-20 overflow-y-auto"
                          style={{ backgroundColor: INK, border: `1px solid ${LINE}`, color: MUTED }}
                        >
                          {pix.copy_paste}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(pix.copy_paste);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="mt-3 w-full rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.01]"
                          style={{
                            backgroundColor: copied ? GREEN : YELLOW,
                            color: copied ? WHITE : INK,
                          }}
                        >
                          {copied ? "Código copiado" : "Copiar código PIX"}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-[11px]" style={{ color: MUTED }}>
                          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
                          Aguardando confirmação automática
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
