import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import albumCover from "@/assets/album-cover.png";
import cardMiguel from "@/assets/card-miguel.png";
import cardArthur from "@/assets/card-arthur.png";
import cardHelena from "@/assets/card-helena.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Copa Album 2026 — Álbum e Figurinhas Personalizadas" },
      {
        name: "description",
        content:
          "Catálogo oficial: álbum da Copa 2026 e figurinhas personalizadas com a foto da sua pessoa favorita.",
      },
      { property: "og:title", content: "Copa Album 2026 — Catálogo" },
      {
        property: "og:description",
        content:
          "Compre o álbum oficial e figurinhas personalizadas com sua foto.",
      },
    ],
  }),
});

const YELLOW = "#FFCE00";
const YELLOW_DEEP = "#FFB400";
const GREEN = "#009B3A";
const BLUE = "#002776";
const WHITE = "#FFFFFF";

type Product = {
  id: string;
  name: string;
  tag: string;
  price: string;
  oldPrice?: string;
  installments: string;
  desc: string;
  image: string;
  color: string;
  badge?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "album",
    name: "Álbum Oficial Copa 2026",
    tag: "ÁLBUM",
    price: "R$ 197",
    oldPrice: "R$ 297",
    installments: "ou 12x de R$ 19,90",
    desc: "Capa dura, 60 espaços para colar suas figurinhas personalizadas. Edição limitada.",
    image: albumCover,
    color: BLUE,
    badge: "MAIS VENDIDO",
  },
  {
    id: "fig-individual",
    name: "Figurinha Personalizada",
    tag: "FIGURINHA",
    price: "R$ 9,90",
    installments: "envie a foto · entrega em 7 dias",
    desc: "Sua foto, seu nome e seu número como uma figurinha oficial estilo Copa.",
    image: cardMiguel,
    color: GREEN,
  },
  {
    id: "fig-pack-10",
    name: "Pack 10 Figurinhas",
    tag: "PACK",
    price: "R$ 79",
    oldPrice: "R$ 99",
    installments: "R$ 7,90 cada · economize 20%",
    desc: "10 figurinhas personalizadas com fotos diferentes. Monte sua seleção.",
    image: cardArthur,
    color: YELLOW_DEEP,
    badge: "ECONOMIA",
  },
  {
    id: "fig-shiny",
    name: "Figurinha Dourada SHINY",
    tag: "RARA",
    price: "R$ 24,90",
    installments: "edição especial brilhante",
    desc: "Acabamento dourado holográfico. A craque do seu álbum.",
    image: cardHelena,
    color: YELLOW,
    badge: "RARÍSSIMA",
  },
];

function Index() {
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => {
    setCart((c) => [...c, id]);
  };

  return (
    <main
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ backgroundColor: YELLOW, color: BLUE }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between border-b-4"
        style={{ backgroundColor: GREEN, borderColor: YELLOW }}
      >
        <div
          className="font-display text-sm sm:text-xl tracking-widest flex items-center gap-2"
          style={{ color: YELLOW }}
        >
          <span className="animate-spin-slow inline-block">★</span>
          COPA 2026
        </div>
        <a
          href="#catalogo"
          className="relative rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105"
          style={{ backgroundColor: YELLOW, color: BLUE }}
        >
          🛒 Carrinho
          {cart.length > 0 && (
            <span
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black animate-bounce-soft"
              style={{ backgroundColor: GREEN, color: YELLOW, border: `2px solid ${BLUE}` }}
            >
              {cart.length}
            </span>
          )}
        </a>
      </header>

      {/* Marquee */}
      <div
        className="overflow-hidden border-b-4 py-2"
        style={{ backgroundColor: BLUE, borderColor: YELLOW }}
      >
        <div className="flex animate-marquee whitespace-nowrap font-display text-sm tracking-widest" style={{ color: YELLOW }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {["⚽ FRETE GRÁTIS ACIMA DE R$ 150", "★ ENTREGA EM 7 DIAS", "⚽ EDIÇÃO LIMITADA 2026", "★ FAÇA SUA FIGURINHA", "⚽ PAGAMENTO SEGURO"].map((t) => (
                <span key={t} className="px-8">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 text-[14rem] sm:text-[20rem] font-black opacity-10 select-none animate-spin-slow"
          style={{ color: GREEN }}
        >
          ★
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-10 text-[16rem] sm:text-[24rem] font-black opacity-10 select-none animate-spin-slow"
          style={{ color: BLUE, animationDirection: "reverse" }}
        >
          ★
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16 sm:pt-14 sm:pb-20 grid gap-10 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <span
              className="inline-block rounded-full px-4 py-1 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase animate-bounce-soft"
              style={{ backgroundColor: BLUE, color: YELLOW }}
            >
              ★ Catálogo Oficial 2026
            </span>
            <h1
              className="font-display mt-5 text-3xl sm:text-5xl md:text-6xl leading-[1.05]"
              style={{ color: BLUE }}
            >
              VIRE <span className="shimmer-text">CRAQUE</span>{" "}
              <span style={{ color: GREEN }}>DA COPA</span>
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-md font-semibold mx-auto md:mx-0"
              style={{ color: BLUE }}
            >
              Compre o álbum oficial e figurinhas personalizadas com a foto de quem você ama.
              Monte sua seleção.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <a
                href="#catalogo"
                className="rounded-full px-8 sm:px-10 py-3 sm:py-4 font-display text-sm sm:text-base tracking-widest uppercase shadow-lg transition-transform hover:scale-[1.05] border-4 animate-wiggle"
                style={{ backgroundColor: GREEN, color: YELLOW, borderColor: BLUE }}
              >
                Ver catálogo ⚽
              </a>
            </div>
          </div>

          {/* Animated stack of cards */}
          <div className="relative h-[320px] sm:h-[420px] flex items-center justify-center">
            <img
              src={cardArthur}
              alt=""
              className="absolute w-32 sm:w-44 rounded-xl shadow-2xl border-4 animate-floaty"
              style={{ borderColor: WHITE, transform: "rotate(-12deg)", left: "10%", ["--r" as any]: "-12deg", animationDelay: "0s" }}
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
              style={{ borderColor: WHITE, transform: "rotate(12deg)", right: "10%", ["--r" as any]: "12deg", animationDelay: "0.8s" }}
            />
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div className="flex h-3 sm:h-4 w-full">
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: BLUE }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
      </div>

      {/* CATALOG */}
      <section id="catalogo" style={{ backgroundColor: WHITE }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center">
            <span
              className="inline-block rounded-full px-4 py-1 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase"
              style={{ backgroundColor: GREEN, color: YELLOW }}
            >
              ⚽ Catálogo Oficial
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl mt-4"
              style={{ color: BLUE }}
            >
              ESCOLHA SUA <span style={{ color: GREEN }}>JOGADA</span>
            </h2>
            <p className="mt-3 font-semibold max-w-xl mx-auto" style={{ color: BLUE }}>
              Álbum, figurinhas individuais, pacotes e a rara dourada. Tudo personalizado.
            </p>
          </div>

          <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <article
                key={p.id}
                className="group relative rounded-2xl border-4 shadow-lg overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                style={{
                  backgroundColor: WHITE,
                  borderColor: BLUE,
                  animation: `pop-in 0.6s cubic-bezier(.5,1.7,.5,1) ${i * 0.1}s both`,
                }}
              >
                {p.badge && (
                  <div
                    className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider animate-bounce-soft"
                    style={{ backgroundColor: GREEN, color: YELLOW, border: `2px solid ${BLUE}` }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden"
                  style={{
                    background: `repeating-linear-gradient(45deg, ${p.color} 0 14px, ${YELLOW_DEEP} 14px 28px)`,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-[85%] w-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <span
                    className="text-[10px] font-black tracking-[0.2em] uppercase"
                    style={{ color: GREEN }}
                  >
                    ★ {p.tag}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl mt-1 leading-tight" style={{ color: BLUE }}>
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium flex-1" style={{ color: BLUE }}>
                    {p.desc}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    {p.oldPrice && (
                      <span className="text-xs line-through opacity-60" style={{ color: BLUE }}>
                        {p.oldPrice}
                      </span>
                    )}
                    <span className="font-display text-2xl" style={{ color: BLUE }}>
                      {p.price}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80" style={{ color: BLUE }}>
                    {p.installments}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(p.id)}
                    className="mt-4 w-full rounded-full px-5 py-3 font-display text-xs sm:text-sm tracking-widest uppercase border-4 transition-transform active:scale-95 hover:scale-[1.03]"
                    style={{ backgroundColor: GREEN, color: YELLOW, borderColor: BLUE }}
                  >
                    + Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ backgroundColor: GREEN }} className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${YELLOW} 0 20px, transparent 20px 40px)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <h2 className="font-display text-3xl sm:text-4xl text-center" style={{ color: YELLOW }}>
            COMO FUNCIONA ⚽
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { n: "1", t: "ESCOLHA", d: "Selecione álbum e figurinhas no catálogo." },
              { n: "2", t: "ENVIE A FOTO", d: "Após a compra, mande a foto da pessoa." },
              { n: "3", t: "RECEBA EM CASA", d: "Em 7 dias úteis seu kit chega impresso." },
            ].map((s, i) => (
              <div
                key={s.n}
                className="rounded-2xl p-6 border-4 text-center"
                style={{
                  backgroundColor: YELLOW,
                  borderColor: BLUE,
                  animation: `pop-in 0.6s cubic-bezier(.5,1.7,.5,1) ${i * 0.15}s both`,
                }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl border-4 animate-bounce-soft"
                  style={{ backgroundColor: BLUE, color: YELLOW, borderColor: GREEN }}
                >
                  {s.n}
                </div>
                <div className="font-display text-xl mt-4" style={{ color: BLUE }}>
                  {s.t}
                </div>
                <p className="mt-2 font-semibold text-sm" style={{ color: BLUE }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="px-4 sm:px-6 py-16 sm:py-20 text-center relative overflow-hidden"
        style={{ backgroundColor: BLUE }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${YELLOW} 0 20px, transparent 20px 40px)`,
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl sm:text-5xl leading-tight" style={{ color: YELLOW }}>
            ENTRE EM <span style={{ color: GREEN }}>CAMPO</span> ⚽
          </h2>
          <p className="mt-4 text-base sm:text-lg font-semibold" style={{ color: WHITE }}>
            Edição limitada. Não fique fora da Copa 2026.
          </p>
          <a
            href="#catalogo"
            className="inline-block mt-8 rounded-full px-10 py-4 font-display text-sm sm:text-base tracking-widest uppercase border-4 transition-transform hover:scale-105 animate-wiggle"
            style={{ backgroundColor: YELLOW, color: BLUE, borderColor: GREEN }}
          >
            Ver catálogo
          </a>
        </div>
      </section>

      <footer
        className="px-4 sm:px-6 py-6 sm:py-8 text-center text-xs font-semibold"
        style={{ backgroundColor: GREEN, color: YELLOW }}
      >
        © 2026 Copa Album · Edição Oficial Casal de Ouro
      </footer>
    </main>
  );
}
