import { createFileRoute } from "@tanstack/react-router";
import stickerCard from "@/assets/sticker-card.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Transforme seu filho em uma figurinha da Copa do Mundo" },
      {
        name: "description",
        content:
          "Crie uma figurinha personalizada da Copa do Mundo com nome, foto e estilo do seu pequeno craque.",
      },
    ],
  }),
});

function Index() {
  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{ backgroundColor: "#a78f10" }}
    >
      <h1
        className="font-display text-center text-3xl sm:text-4xl md:text-5xl leading-tight max-w-4xl tracking-wide"
        style={{ color: "#f5efe0" }}
      >
        TRANSFORME SEU FILHO EM UMA{" "}
        <span style={{ color: "#7ec5ff" }}>FIGURINHA PERSONALIZADA</span> DA COPA
        DO MUNDO
      </h1>

      <div className="relative my-10 h-[360px] w-[280px] sm:h-[420px] sm:w-[320px]">
        <img
          src={stickerCard}
          alt=""
          aria-hidden
          className="absolute left-12 top-4 h-full w-full object-contain rotate-6 opacity-90"
        />
        <img
          src={stickerCard}
          alt=""
          aria-hidden
          className="absolute -left-12 top-4 h-full w-full object-contain -rotate-6 opacity-90"
        />
        <img
          src={stickerCard}
          alt="Figurinha personalizada Copa do Mundo"
          className="relative h-full w-full object-contain drop-shadow-2xl"
        />
      </div>

      <p
        className="text-center max-w-md text-base sm:text-lg leading-relaxed font-sans"
        style={{ color: "#f5efe0" }}
      >
        Responda algumas perguntas rápidas e veja como criar uma figurinha
        exclusiva, com o nome, foto e estilo do seu pequeno craque.
      </p>

      <button
        type="button"
        className="mt-8 w-full max-w-md rounded-full px-10 py-5 font-display text-xl tracking-widest text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: "#101a5c" }}
      >
        INICIAR
      </button>

      <div className="mt-10 flex gap-3">
        {["BR", "AR", "FR", "DE", "ES"].map((code) => (
          <span
            key={code}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white/80"
          >
            {code}
          </span>
        ))}
      </div>
      <p
        className="mt-3 text-sm font-sans"
        style={{ color: "#f5efe0" }}
      >
        +2.500 figurinhas já criadas!
      </p>
    </main>
  );
}
