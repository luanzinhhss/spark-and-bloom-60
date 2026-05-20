import { createFileRoute } from "@tanstack/react-router";
import albumCover from "@/assets/album-cover.png";
import albumEmpty from "@/assets/album-empty.png";
import albumFilled from "@/assets/album-filled.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Memory Album Copa 2026 — Casal de Ouro" },
      {
        name: "description",
        content:
          "O álbum de figurinhas oficial do casal para a Copa do Mundo 2026. Personalize, colecione e guarde sua história.",
      },
      { property: "og:title", content: "Memory Album Copa 2026 — Casal de Ouro" },
      {
        property: "og:description",
        content:
          "Álbum de figurinhas personalizado estilo Copa do Mundo 2026 para casais.",
      },
    ],
  }),
});

// Brazil / Copa palette
const YELLOW = "#FFCE00";       // bright Brazil yellow
const YELLOW_DEEP = "#FFB400";
const GREEN = "#009B3A";        // Brazil green
const BLUE = "#002776";         // Brazil blue
const WHITE = "#FFFFFF";

function Index() {
  return (
    <main
      className="min-h-screen font-sans"
      style={{ backgroundColor: YELLOW, color: BLUE }}
    >
      {/* Header */}
      <header
        className="px-6 py-3 flex items-center justify-between border-b-4"
        style={{ backgroundColor: GREEN, borderColor: YELLOW }}
      >
        <div
          className="font-display text-xl tracking-widest"
          style={{ color: YELLOW }}
        >
          ★ COPA 2026 ALBUM
        </div>
        <a
          href="#comprar"
          className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider"
          style={{ backgroundColor: YELLOW, color: BLUE }}
        >
          Garantir o meu
        </a>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* decorative giant stars */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 text-[20rem] font-black opacity-10 select-none"
          style={{ color: GREEN }}
        >
          ★
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-10 text-[24rem] font-black opacity-10 select-none"
          style={{ color: BLUE }}
        >
          ★
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-xs font-extrabold tracking-[0.2em] uppercase"
              style={{ backgroundColor: BLUE, color: YELLOW }}
            >
              ★ Edição Oficial Copa 2026
            </span>
            <h1
              className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl leading-[1.05]"
              style={{ color: BLUE }}
            >
              SEU CASAL NA{" "}
              <span style={{ color: GREEN }}>COPA DO MUNDO</span>{" "}
              <span style={{ color: BLUE }}>2026</span>
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed max-w-md font-semibold"
              style={{ color: BLUE }}
            >
              O álbum oficial de figurinhas personalizado. Vocês entram em campo
              como uma seleção de verdade — com escudo, número e história.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#comprar"
                className="rounded-full px-10 py-4 font-display text-base tracking-widest uppercase shadow-lg transition-transform hover:scale-[1.03] border-4"
                style={{ backgroundColor: GREEN, color: YELLOW, borderColor: BLUE }}
              >
                Quero o meu
              </a>
              <div className="text-sm">
                <div className="font-extrabold" style={{ color: BLUE }}>
                  +2.500 casais convocados
                </div>
                <div style={{ color: BLUE }} className="opacity-80">
                  Entrega para todo o Brasil
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl"
              style={{
                background: `repeating-linear-gradient(45deg, ${GREEN} 0 14px, ${YELLOW_DEEP} 14px 28px)`,
              }}
            />
            <img
              src={albumCover}
              alt="Capa do álbum oficial Copa 2026 Casal de Ouro"
              className="relative w-full rounded-2xl shadow-2xl border-8"
              style={{ borderColor: WHITE }}
            />
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div className="flex h-4 w-full">
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: BLUE }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
      </div>

      {/* BENEFITS */}
      <section style={{ backgroundColor: WHITE }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="font-display text-3xl sm:text-4xl text-center"
            style={{ color: BLUE }}
          >
            CHEGOU A SUA CONVOCAÇÃO ⚽
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "10",
                title: "TOTALMENTE PERSONALIZADO",
                desc: "Foto, nome, número e data do casal em cada figurinha.",
              },
              {
                n: "9",
                title: "QUALIDADE PANINI",
                desc: "Impressão premium, papel couché e figurinhas com brilho.",
              },
              {
                n: "7",
                title: "EDIÇÃO LIMITADA",
                desc: "Apenas 2.026 unidades numeradas para a Copa do Mundo.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="relative rounded-2xl p-8 border-4 shadow-md"
                style={{ borderColor: BLUE, backgroundColor: YELLOW }}
              >
                <div
                  className="absolute -top-6 -left-4 flex h-14 w-14 items-center justify-center rounded-full font-display text-xl border-4"
                  style={{
                    backgroundColor: GREEN,
                    color: YELLOW,
                    borderColor: BLUE,
                  }}
                >
                  {b.n}
                </div>
                <div
                  className="font-display text-xl mb-2 mt-2"
                  style={{ color: BLUE }}
                >
                  {b.title}
                </div>
                <p className="font-medium" style={{ color: BLUE }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALBUM PREVIEW */}
      <section className="px-6 py-20" style={{ backgroundColor: GREEN }}>
        <div className="mx-auto max-w-6xl">
          <h2
            className="font-display text-3xl sm:text-4xl text-center"
            style={{ color: YELLOW }}
          >
            ENTRE EM CAMPO ⚽ VEJA O ÁLBUM
          </h2>
          <p
            className="mt-4 text-center max-w-xl mx-auto font-semibold"
            style={{ color: WHITE }}
          >
            Cole as figurinhas, complete as páginas e levante a taça do amor.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure>
              <img
                src={albumEmpty}
                alt="Páginas do álbum em branco"
                className="w-full rounded-2xl shadow-xl border-8"
                style={{ borderColor: YELLOW }}
                loading="lazy"
              />
              <figcaption
                className="mt-3 text-center text-sm uppercase tracking-widest font-bold"
                style={{ color: YELLOW }}
              >
                1º Tempo — espaços para colar
              </figcaption>
            </figure>
            <figure>
              <img
                src={albumFilled}
                alt="Páginas do álbum completas com figurinhas"
                className="w-full rounded-2xl shadow-xl border-8"
                style={{ borderColor: YELLOW }}
                loading="lazy"
              />
              <figcaption
                className="mt-3 text-center text-sm uppercase tracking-widest font-bold"
                style={{ color: YELLOW }}
              >
                2º Tempo — álbum completo
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ backgroundColor: YELLOW }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="font-display text-3xl sm:text-4xl text-center"
            style={{ color: BLUE }}
          >
            O KIT DO CRAQUE INCLUI
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
            {[
              "1 Álbum oficial capa dura Copa 2026",
              "60 figurinhas personalizadas do casal",
              "4 figurinhas EXTRA SHINY douradas",
              "Pôster da seleção do casal",
              "Embalagem oficial estilo Panini",
              "Certificado numerado da edição",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl p-4 border-4"
                style={{ backgroundColor: WHITE, borderColor: GREEN }}
              >
                <span
                  className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-black"
                  style={{ backgroundColor: GREEN, color: YELLOW }}
                >
                  ★
                </span>
                <span className="font-semibold" style={{ color: BLUE }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section
        id="comprar"
        className="px-6 py-24 text-center relative overflow-hidden"
        style={{ backgroundColor: BLUE }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${YELLOW} 0 20px, transparent 20px 40px)`,
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl sm:text-5xl leading-tight" style={{ color: YELLOW }}>
            CONVOQUE SEU <span style={{ color: GREEN }}>CASAL DE OURO</span> ⚽
          </h2>
          <p className="mt-4 text-lg font-semibold" style={{ color: WHITE }}>
            Edição limitada a 2.026 unidades. Acabou, acabou.
          </p>

          <div
            className="mt-10 inline-block rounded-3xl p-8 shadow-2xl border-8"
            style={{ backgroundColor: WHITE, borderColor: YELLOW }}
          >
            <div
              className="text-xs tracking-[0.25em] uppercase font-bold"
              style={{ color: GREEN }}
            >
              ★ Memory Album Copa 2026 ★
            </div>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span
                className="text-sm line-through opacity-60"
                style={{ color: BLUE }}
              >
                R$ 297
              </span>
              <span className="font-display text-5xl" style={{ color: BLUE }}>
                R$ 197
              </span>
            </div>
            <div className="text-sm mt-1" style={{ color: BLUE }}>
              ou 12x de R$ 19,90
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-full px-10 py-4 font-display text-base tracking-widest uppercase border-4 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: GREEN, color: YELLOW, borderColor: BLUE }}
            >
              Comprar agora
            </button>
            <div className="mt-3 text-xs" style={{ color: BLUE }}>
              Compra 100% segura · Envio em 7 dias úteis
            </div>
          </div>
        </div>
      </section>

      <footer
        className="px-6 py-8 text-center text-xs font-semibold"
        style={{ backgroundColor: GREEN, color: YELLOW }}
      >
        © 2026 Memory Album Copa · Edição Oficial Casal de Ouro
      </footer>
    </main>
  );
}
