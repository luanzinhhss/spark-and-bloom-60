import { createFileRoute } from "@tanstack/react-router";
import albumCover from "@/assets/album-cover.png";
import albumEmpty from "@/assets/album-empty.png";
import albumFilled from "@/assets/album-filled.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Memory Album 2026 — Casal de Ouro | Edição Especial" },
      {
        name: "description",
        content:
          "Memory Album 2026 Casal de Ouro: o álbum de figurinhas personalizado para celebrar a história do casal. Edição especial limitada.",
      },
      { property: "og:title", content: "Memory Album 2026 — Casal de Ouro" },
      {
        property: "og:description",
        content:
          "Transforme sua história de amor em um álbum de figurinhas personalizado. Edição especial limitada 2026.",
      },
    ],
  }),
});

const NAVY = "#0e1f6b";
const RED = "#c81f3a";
const GOLD = "#e6b73a";
const CREAM = "#f6efe1";

function Index() {
  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: NAVY }}>
      {/* Top stripe */}
      <div className="flex h-3 w-full">
        <div className="flex-1" style={{ backgroundColor: RED }} />
        <div className="flex-1" style={{ backgroundColor: NAVY }} />
        <div className="flex-1" style={{ backgroundColor: GOLD }} />
        <div className="flex-1" style={{ backgroundColor: "#f08aa5" }} />
        <div className="flex-1" style={{ backgroundColor: RED }} />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase"
            style={{ backgroundColor: NAVY, color: GOLD }}
          >
            Edição Especial Limitada
          </span>
          <h1
            className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight"
            style={{ color: NAVY }}
          >
            MEMORY ALBUM <span style={{ color: GOLD }}>2026</span>
            <br />
            <span style={{ color: RED }}>CASAL DE OURO</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed max-w-md" style={{ color: NAVY }}>
            O álbum de figurinhas personalizado que transforma a história do seu
            casal em uma <strong>edição de colecionador</strong>. Cada página, um
            momento. Cada figurinha, uma memória pra sempre.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#comprar"
              className="rounded-full px-10 py-4 font-display text-base tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: RED }}
            >
              GARANTIR O MEU
            </a>
            <div className="text-sm">
              <div className="font-bold" style={{ color: NAVY }}>+2.500 álbuns criados</div>
              <div className="opacity-70">Entrega para todo o Brasil</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-3xl -z-0"
            style={{
              background: `linear-gradient(135deg, ${RED} 0%, ${NAVY} 60%, ${GOLD} 100%)`,
              opacity: 0.15,
            }}
          />
          <img
            src={albumCover}
            alt="Capa do Memory Album 2026 Casal de Ouro"
            className="relative w-full rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Stripe divider */}
      <div className="flex h-2 w-full">
        <div className="flex-1" style={{ backgroundColor: NAVY }} />
        <div className="flex-1" style={{ backgroundColor: GOLD }} />
        <div className="flex-1" style={{ backgroundColor: RED }} />
      </div>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          className="font-display text-3xl sm:text-4xl text-center"
          style={{ color: NAVY }}
        >
          UM ÁLBUM DIGNO DA SUA HISTÓRIA
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "100% PERSONALIZADO",
              desc: "Nomes, fotos e datas do casal impressos em cada figurinha exclusiva.",
            },
            {
              title: "ACABAMENTO PREMIUM",
              desc: "Capa dourada com hot stamping, miolo couché e figurinhas com verniz.",
            },
            {
              title: "EDIÇÃO LIMITADA",
              desc: "Apenas 2.026 álbuns serão produzidos. Cada um numerado a mão.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl p-8 border-2"
              style={{ borderColor: NAVY, backgroundColor: "white" }}
            >
              <div
                className="font-display text-2xl mb-3"
                style={{ color: RED }}
              >
                {b.title}
              </div>
              <p style={{ color: NAVY }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALBUM PREVIEW */}
      <section className="px-6 py-20" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-6xl">
          <h2
            className="font-display text-3xl sm:text-4xl text-center"
            style={{ color: GOLD }}
          >
            VEJA POR DENTRO DO ÁLBUM
          </h2>
          <p
            className="mt-4 text-center max-w-xl mx-auto"
            style={{ color: CREAM }}
          >
            Páginas pensadas para receber as memórias do casal. Comece com os
            espaços vazios e complete com suas figurinhas personalizadas.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure>
              <img
                src={albumEmpty}
                alt="Páginas internas do álbum em branco"
                className="w-full rounded-2xl shadow-xl"
                loading="lazy"
              />
              <figcaption
                className="mt-3 text-center text-sm uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                Antes — espaços para colar
              </figcaption>
            </figure>
            <figure>
              <img
                src={albumFilled}
                alt="Páginas internas do álbum completo com figurinhas personalizadas"
                className="w-full rounded-2xl shadow-xl"
                loading="lazy"
              />
              <figcaption
                className="mt-3 text-center text-sm uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                Depois — história completa
              </figcaption>
            </figure>
          </div>

          <p
            className="mt-10 text-center font-display text-2xl"
            style={{ color: GOLD }}
          >
            "EU TE AMO EM TODAS AS LÍNGUAS DO MUNDO"
          </p>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2
          className="font-display text-3xl sm:text-4xl text-center"
          style={{ color: NAVY }}
        >
          O QUE VEM NA EDIÇÃO
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {[
            "1 Álbum capa dura Memory Album 2026",
            "60 figurinhas personalizadas do casal",
            "4 figurinhas EXTRA SHINY douradas",
            "Embalagem presente exclusiva",
            "Certificado de edição numerada",
            "Acesso ao app para revisar as figurinhas",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ backgroundColor: "white", border: `2px solid ${NAVY}` }}
            >
              <span
                className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: RED }}
              >
                ♥
              </span>
              <span style={{ color: NAVY }}>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        id="comprar"
        className="px-6 py-24 text-center"
        style={{
          background: `linear-gradient(135deg, ${RED} 0%, ${NAVY} 100%)`,
        }}
      >
        <div className="mx-auto max-w-2xl">
          <h2
            className="font-display text-4xl sm:text-5xl text-white leading-tight"
          >
            GARANTA O SEU <span style={{ color: GOLD }}>CASAL DE OURO</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: CREAM }}>
            Edição limitada a 2.026 unidades. Quando acabar, acabou.
          </p>

          <div className="mt-10 inline-block rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-xs tracking-[0.25em] uppercase" style={{ color: RED }}>
              Memory Album 2026
            </div>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span className="text-sm line-through opacity-60" style={{ color: NAVY }}>
                R$ 297
              </span>
              <span className="font-display text-5xl" style={{ color: NAVY }}>
                R$ 197
              </span>
            </div>
            <div className="text-sm mt-1" style={{ color: NAVY }}>
              ou 12x de R$ 19,90
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-full px-10 py-4 font-display text-base tracking-widest text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: RED }}
            >
              COMPRAR AGORA
            </button>
            <div className="mt-3 text-xs opacity-70" style={{ color: NAVY }}>
              Compra 100% segura · Envio em 7 dias úteis
            </div>
          </div>
        </div>
      </section>

      <footer
        className="px-6 py-8 text-center text-xs"
        style={{ backgroundColor: NAVY, color: CREAM }}
      >
        © 2026 Memory Album · Edição Especial Casal de Ouro
      </footer>
    </main>
  );
}
