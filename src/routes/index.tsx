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
          "Catálogo oficial: álbum da Copa 2026 e figurinhas personalizadas com a foto da sua pessoa favorita. Pagamento via PIX.",
      },
    ],
  }),
});

// SUPER bright Copa palette
const YELLOW = "#FFE600";
const YELLOW_DEEP = "#FFB400";
const GREEN = "#00E558";
const GREEN_DEEP = "#00A53E";
const BLUE = "#003BB5";
const BLUE_DEEP = "#001E73";
const WHITE = "#FFFFFF";
const DARK = "#08080d";
const DARK2 = "#13131b";
const DARK3 = "#1d1d28";

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
    tag: "ÁLBUM",
    price: 197,
    oldPrice: 297,
    installments: "ou 12x de R$ 19,90",
    desc: "Capa dura, 60 espaços para colar suas figurinhas personalizadas.",
    image: albumCover,
    badge: "MAIS VENDIDO",
  },
  {
    id: "fig-individual",
    name: "Figurinha Personalizada",
    tag: "FIGURINHA",
    price: 9.9,
    installments: "envie a foto · entrega em 7 dias",
    desc: "Sua foto, nome e número como uma figurinha oficial estilo Copa.",
    image: cardMiguel,
  },
  {
    id: "fig-pack-10",
    name: "Pack 10 Figurinhas",
    tag: "PACK",
    price: 79,
    oldPrice: 99,
    installments: "R$ 7,90 cada · economize 20%",
    desc: "10 figurinhas personalizadas. Monte sua seleção do casal.",
    image: cardArthur,
    badge: "ECONOMIA",
  },
  {
    id: "fig-shiny",
    name: "Figurinha Dourada SHINY",
    tag: "RARA",
    price: 24.9,
    installments: "edição especial brilhante",
    desc: "Acabamento dourado holográfico. A craque do seu álbum.",
    image: cardHelena,
    badge: "RARÍSSIMA",
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
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState<{ items: CartLine[] } | null>(null);
  const [pix, setPix] = useState<PixState>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  const cartTotal = useMemo(
    () => cart.reduce((a, l) => a + PRODUCT_MAP[l.id].price * l.qty, 0),
    [cart],
  );

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

  const buyNow = (id: string) => {
    setCheckout({ items: [{ id, qty: 1 }] });
  };
  const checkoutCart = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setCheckout({ items: cart });
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

  // Poll for payment confirmation
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


  return (
    <main
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ backgroundColor: DARK, color: WHITE }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between border-b-4 shadow-lg backdrop-blur-md"
        style={{ backgroundColor: `${DARK2}ee`, borderColor: YELLOW }}
      >
        <div
          className="font-display text-sm sm:text-xl tracking-widest flex items-center gap-2"
          style={{ color: YELLOW }}
        >
          <span className="animate-spin-slow inline-block">★</span>
          COPA 2026
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: YELLOW, color: BLUE, boxShadow: `0 4px 0 ${YELLOW_DEEP}` }}
        >
          🛒 Carrinho
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black animate-bounce-soft"
              style={{
                backgroundColor: "#FF1744",
                color: WHITE,
                border: `2px solid ${WHITE}`,
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Marquee */}
      <div
        className="overflow-hidden border-b-4 py-2"
        style={{ backgroundColor: BLUE, borderColor: YELLOW }}
      >
        <div
          className="flex animate-marquee whitespace-nowrap font-display text-sm tracking-widest"
          style={{ color: YELLOW }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                "⚽ PAGAMENTO VIA PIX",
                "★ ENTREGA EM 7 DIAS",
                "⚽ EDIÇÃO LIMITADA 2026",
                "★ FAÇA SUA FIGURINHA",
                "⚽ 100% SEGURO",
              ].map((t) => (
                <span key={t} className="px-8">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${DARK}f2, ${DARK2}e6, ${BLUE_DEEP}cc), url(${fifaBackdrop})`,
          backgroundSize: "cover, 600px auto",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, repeat",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 text-[14rem] sm:text-[20rem] font-black opacity-[0.06] select-none animate-spin-slow"
          style={{ color: YELLOW }}
        >
          ★
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-10 text-[16rem] sm:text-[24rem] font-black opacity-[0.06] select-none animate-spin-slow"
          style={{ color: GREEN, animationDirection: "reverse" }}
        >
          ★
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16 sm:pt-14 sm:pb-20 grid gap-10 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <span
              className="inline-block rounded-full px-4 py-1 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase animate-bounce-soft"
              style={{ backgroundColor: BLUE, color: YELLOW, border: `2px solid ${YELLOW}` }}
            >
              ★ Catálogo Oficial 2026 ⚽
            </span>
            <h1
              className="font-display mt-5 text-3xl sm:text-5xl md:text-6xl leading-[1.05] drop-shadow-[3px_3px_0_rgba(0,0,0,0.25)]"
              style={{ color: WHITE }}
            >
              VIRE <span className="shimmer-text">CRAQUE</span>
              <br />
              <span style={{ color: YELLOW }}>DA COPA 2026</span>
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-md font-semibold mx-auto md:mx-0"
              style={{ color: WHITE }}
            >
              Compre o álbum oficial e figurinhas personalizadas com a foto de quem você ama. Monte sua seleção.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <a
                href="#catalogo"
                className="rounded-full px-8 sm:px-10 py-3 sm:py-4 font-display text-sm sm:text-base tracking-widest uppercase border-4 animate-pulse-glow"
                style={{ backgroundColor: YELLOW, color: BLUE, borderColor: WHITE }}
              >
                Ver catálogo ⚽
              </a>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[420px] flex items-center justify-center">
            <img
              src={cardArthur}
              alt=""
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl border-4 animate-floaty"
              style={{ borderColor: WHITE, transform: "rotate(-12deg)", left: "8%", ["--r" as any]: "-12deg", animationDelay: "0s" }}
            />
            <img
              src={albumCover}
              alt="Álbum Copa 2026"
              className="relative w-44 sm:w-64 rounded-xl shadow-2xl border-4 animate-floaty z-10"
              style={{ borderColor: YELLOW, ["--r" as any]: "0deg", animationDelay: "0.4s" }}
            />
            <img
              src={cardHelena}
              alt=""
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl border-4 animate-floaty"
              style={{ borderColor: WHITE, transform: "rotate(12deg)", right: "8%", ["--r" as any]: "12deg", animationDelay: "0.8s" }}
            />
          </div>
        </div>
      </section>

      {/* stripe divider */}
      <div className="flex h-3 sm:h-4 w-full">
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: BLUE }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
      </div>

      {/* CATALOG */}
      <section id="catalogo" style={{ backgroundColor: DARK }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center">
            <span
              className="inline-block rounded-full px-4 py-1 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase"
              style={{ backgroundColor: GREEN, color: DARK }}
            >
              ⚽ Catálogo Oficial
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-4" style={{ color: WHITE }}>
              ESCOLHA SUA <span style={{ color: YELLOW }}>JOGADA</span>
            </h2>
            <p className="mt-3 font-semibold max-w-xl mx-auto" style={{ color: "#cfd2dc" }}>
              Álbum, figurinhas individuais, pacotes e a rara dourada. Tudo personalizado.
            </p>
          </div>

          <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <article
                key={p.id}
                className="group relative rounded-2xl border-4 shadow-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                style={{
                  backgroundColor: DARK2,
                  borderColor: YELLOW,
                  animation: `pop-in 0.6s cubic-bezier(.5,1.7,.5,1) ${i * 0.1}s both`,
                }}
              >
                {p.badge && (
                  <div
                    className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider animate-bounce-soft"
                    style={{
                      backgroundColor: "#FF1744",
                      color: WHITE,
                      border: `2px solid ${WHITE}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${DARK}cc, ${DARK2}aa), url(${fifaBackdrop})`,
                    backgroundSize: "cover, cover",
                    backgroundPosition: "center, center",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-[85%] w-auto drop-shadow-[0_10px_30px_rgba(255,230,0,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1" style={{ backgroundColor: DARK2 }}>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GREEN }}>
                    ★ {p.tag}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl mt-1 leading-tight" style={{ color: WHITE }}>
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium flex-1" style={{ color: "#b8bcc8" }}>
                    {p.desc}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    {p.oldPrice && (
                      <span className="text-xs line-through opacity-60" style={{ color: "#b8bcc8" }}>
                        {fmt(p.oldPrice)}
                      </span>
                    )}
                    <span className="font-display text-2xl" style={{ color: YELLOW }}>
                      {fmt(p.price)}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80" style={{ color: "#b8bcc8" }}>
                    {p.installments}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(p.id)}
                      className="rounded-full px-3 py-2.5 font-display text-[11px] sm:text-xs tracking-widest uppercase transition-transform active:scale-95 hover:scale-[1.03]"
                      style={{
                        backgroundColor: "transparent",
                        color: YELLOW,
                        border: `3px solid ${YELLOW}`,
                      }}
                    >
                      + Carrinho
                    </button>
                    <button
                      type="button"
                      onClick={() => buyNow(p.id)}
                      className="rounded-full px-3 py-2.5 font-display text-[11px] sm:text-xs tracking-widest uppercase transition-transform active:scale-95 hover:scale-[1.03]"
                      style={{
                        backgroundColor: GREEN,
                        color: DARK,
                        border: `3px solid ${YELLOW}`,
                        boxShadow: `0 3px 0 ${GREEN_DEEP}`,
                      }}
                    >
                      Comprar ⚡
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, ${DARK2}, ${DARK})`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url(${fifaBackdrop})`,
            backgroundSize: "500px auto",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <h2 className="font-display text-3xl sm:text-4xl text-center" style={{ color: YELLOW }}>
            COMO FUNCIONA ⚽
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { n: "1", t: "ESCOLHA", d: "Selecione álbum e figurinhas no catálogo." },
              { n: "2", t: "ENVIE A FOTO", d: "Após o PIX, mande a foto da pessoa." },
              { n: "3", t: "RECEBA EM CASA", d: "Em 7 dias úteis seu kit chega impresso." },
            ].map((s, i) => (
              <div
                key={s.n}
                className="rounded-2xl p-6 border-4 text-center backdrop-blur-sm"
                style={{
                  backgroundColor: `${DARK3}cc`,
                  borderColor: YELLOW,
                  animation: `pop-in 0.6s cubic-bezier(.5,1.7,.5,1) ${i * 0.15}s both`,
                }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl border-4 animate-bounce-soft"
                  style={{ backgroundColor: YELLOW, color: DARK, borderColor: GREEN }}
                >
                  {s.n}
                </div>
                <div className="font-display text-xl mt-4" style={{ color: WHITE }}>
                  {s.t}
                </div>
                <p className="mt-2 font-semibold text-sm" style={{ color: "#b8bcc8" }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="px-4 sm:px-6 py-6 sm:py-8 text-center text-xs font-semibold border-t-4"
        style={{ backgroundColor: DARK, color: YELLOW, borderColor: YELLOW }}
      >
        © 2026 Copa Album · Edição Oficial · Pagamento via PIX
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setCartOpen(false)}>
          <div className="flex-1 bg-black/50 backdrop-blur-sm animate-pop-in" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full overflow-y-auto flex flex-col animate-slide-in-right border-l-4"
            style={{ backgroundColor: DARK, borderColor: YELLOW }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between border-b-4"
              style={{ backgroundColor: DARK2, borderColor: YELLOW, color: YELLOW }}
            >
              <div className="font-display text-xl tracking-widest flex items-center gap-2">
                🛒 SEU CARRINHO
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full h-9 w-9 flex items-center justify-center text-lg font-black"
                style={{ backgroundColor: YELLOW, color: DARK }}
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-5 space-y-3">
              {cart.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl animate-bounce-soft">⚽</div>
                  <p className="mt-4 font-display text-xl" style={{ color: YELLOW }}>
                    Carrinho vazio
                  </p>
                  <p className="mt-2 font-semibold text-sm" style={{ color: "#b8bcc8" }}>
                    Convoque suas figurinhas!
                  </p>
                </div>
              )}
              {cart.map((line) => {
                const p = PRODUCT_MAP[line.id];
                return (
                  <div
                    key={line.id}
                    className="flex gap-3 rounded-xl border-4 p-3 animate-slide-up"
                    style={{ backgroundColor: DARK2, borderColor: YELLOW }}
                  >
                    <img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover border-2" style={{ borderColor: GREEN }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm leading-tight" style={{ color: WHITE }}>
                        {p.name}
                      </div>
                      <div className="font-bold text-sm mt-1" style={{ color: GREEN }}>
                        {fmt(p.price)}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty - 1)}
                          className="h-7 w-7 rounded-full font-black border-2"
                          style={{ backgroundColor: DARK3, color: YELLOW, borderColor: YELLOW }}
                        >
                          −
                        </button>
                        <span className="font-display text-base w-6 text-center" style={{ color: WHITE }}>
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty + 1)}
                          className="h-7 w-7 rounded-full font-black border-2"
                          style={{ backgroundColor: GREEN, color: DARK, borderColor: YELLOW }}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="ml-auto text-xs font-bold underline"
                          style={{ color: "#FF6B6B" }}
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {cart.length > 0 && (
              <div
                className="border-t-4 p-5 space-y-3"
                style={{ borderColor: YELLOW, backgroundColor: DARK2 }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm tracking-widest uppercase" style={{ color: "#b8bcc8" }}>
                    Total
                  </span>
                  <span className="font-display text-3xl" style={{ color: YELLOW }}>
                    {fmt(cartTotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={checkoutCart}
                  className="w-full rounded-full px-5 py-4 font-display text-sm tracking-widest uppercase border-4 transition-transform active:scale-95 hover:scale-[1.02] animate-pulse-glow"
                  style={{ backgroundColor: GREEN, color: DARK, borderColor: YELLOW }}
                >
                  Finalizar com PIX ⚡
                </button>
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border-8 shadow-2xl overflow-hidden animate-slide-up"
            style={{ backgroundColor: DARK, borderColor: YELLOW }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between border-b-4"
              style={{ backgroundColor: DARK2, borderColor: YELLOW, color: YELLOW }}
            >
              <div className="font-display text-lg tracking-widest">PAGAR COM PIX ⚡</div>
              <button
                type="button"
                onClick={closeCheckout}
                className="rounded-full h-9 w-9 flex items-center justify-center text-lg font-black"
                style={{ backgroundColor: YELLOW, color: DARK }}
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {pix.kind === "loading" && (
                <div className="text-center py-10">
                  <div className="text-5xl animate-ball-kick inline-block">⚽</div>
                  <p className="mt-4 font-display text-lg" style={{ color: YELLOW }}>
                    Gerando seu PIX...
                  </p>
                </div>
              )}
              {pix.kind === "error" && (
                <div className="text-center py-8">
                  <div className="text-5xl">😞</div>
                  <p className="mt-3 font-display text-lg" style={{ color: WHITE }}>
                    Não rolou
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "#b8bcc8" }}>
                    {pix.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const c = checkout;
                      setCheckout(null);
                      setTimeout(() => setCheckout(c), 50);
                    }}
                    className="mt-5 rounded-full px-6 py-2 font-display text-xs tracking-widest uppercase border-4"
                    style={{ backgroundColor: GREEN, color: DARK, borderColor: YELLOW }}
                  >
                    Tentar de novo
                  </button>
                </div>
              )}
              {pix.kind === "ok" && (
                <div>
                  {paid && (
                    <div
                      className="mb-4 rounded-xl border-4 p-4 text-center animate-pop-in"
                      style={{ backgroundColor: GREEN, color: DARK, borderColor: YELLOW }}
                    >
                      <div className="text-4xl">⚽ 🎉</div>
                      <div className="font-display text-lg mt-2 tracking-widest">
                        PAGAMENTO CONFIRMADO!
                      </div>
                      <p className="text-xs font-bold mt-1">
                        Em breve entraremos em contato para a foto.
                      </p>
                    </div>
                  )}
                  <div className="text-center">

                    <div className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GREEN }}>
                      ★ Total
                    </div>
                    <div className="font-display text-4xl mt-1" style={{ color: YELLOW }}>
                      {fmt(pix.total)}
                    </div>
                  </div>

                  {pix.qr_code_image && (
                    <div className="mt-5 flex justify-center">
                      <div
                        className="p-3 rounded-2xl border-4"
                        style={{ borderColor: YELLOW, backgroundColor: WHITE }}
                      >
                        <img
                          src={
                            pix.qr_code_image.startsWith("http") || pix.qr_code_image.startsWith("data:")
                              ? pix.qr_code_image
                              : `data:image/png;base64,${pix.qr_code_image}`
                          }
                          alt="QR Code PIX"
                          className="w-56 h-56 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <label className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: YELLOW }}>
                      PIX Copia e Cola
                    </label>
                    <div
                      className="mt-1 rounded-lg p-3 text-xs break-all font-mono border-2 max-h-24 overflow-y-auto"
                      style={{ backgroundColor: DARK2, borderColor: YELLOW, color: "#b8bcc8" }}
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
                      className="mt-3 w-full rounded-full px-5 py-3 font-display text-sm tracking-widest uppercase border-4 transition-transform active:scale-95 hover:scale-[1.02]"
                      style={{
                        backgroundColor: copied ? YELLOW : GREEN,
                        color: DARK,
                        borderColor: YELLOW,
                      }}
                    >
                      {copied ? "✓ Copiado!" : "Copiar código PIX"}
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[11px] font-semibold opacity-80" style={{ color: "#b8bcc8" }}>
                    Abra seu app do banco e pague com PIX. A confirmação é automática.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
