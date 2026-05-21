import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import fifaBackdrop from "@/assets/fifa-backdrop.png";

export const Route = createFileRoute("/meus-pedidos")({
  component: MeusPedidos,
  head: () => ({
    meta: [
      { title: "Meus Pedidos — Copa Album 2026" },
      {
        name: "description",
        content:
          "Acompanhe seus pedidos, pagamentos confirmados e em aberto. Entre com seu e-mail e um código de acesso.",
      },
    ],
  }),
});

const YELLOW = "#F4C430";
const GREEN = "#00A859";
const WHITE = "#FFFFFF";
const INK = "#0B0B10";
const SURFACE = "#14141C";
const LINE = "#2A2A38";
const MUTED = "#9CA0AE";

type Order = {
  id: string;
  email: string | null;
  status: string;
  total: number;
  items: Array<{ id?: string; name?: string; qty?: number; price?: number }> | null;
  customer: any;
  shipping: any;
  created_at: string;
  paid_at: string | null;
};

type Step = "email" | "code" | "logged";

function MeusPedidos() {
  const [session, setSession] = useState<Session | null>(null);
  const [bootDone, setBootDone] = useState(false);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Boot: get session
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) setStep("logged");
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) setStep("logged");
      setBootDone(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // After login: claim orders + load
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      setLoadingOrders(true);
      // Claim any guest orders matching this email
      const mail = session.user.email;
      if (mail) {
        await supabase
          .from("orders")
          .update({ user_id: session.user.id })
          .is("user_id", null)
          .ilike("email", mail);
      }
      const { data, error: e } = await supabase
        .from("orders")
        .select("id, email, status, total, items, customer, shipping, created_at, paid_at")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (e) setError("Não foi possível carregar seus pedidos.");
      else setOrders((data ?? []) as Order[]);
      setLoadingOrders(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const sendCode = async () => {
    setError(null);
    setInfo(null);
    const mail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError("Digite um e-mail válido.");
      return;
    }
    setBusy(true);
    const { error: e } = await supabase.auth.signInWithOtp({
      email: mail,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (e) {
      setError(e.message);
      return;
    }
    setEmail(mail);
    setStep("code");
    setInfo(`Enviamos um código de 6 dígitos para ${mail}.`);
    setResendIn(45);
  };

  const verify = async () => {
    setError(null);
    const token = code.trim();
    if (token.length < 6) {
      setError("Digite o código de 6 dígitos.");
      return;
    }
    setBusy(true);
    const { error: e } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setBusy(false);
    if (e) {
      setError("Código inválido ou expirado.");
      return;
    }
    // session set by listener → step "logged"
  };

  const resend = async () => {
    if (resendIn > 0) return;
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (e) setError(e.message);
    else {
      setInfo("Novo código enviado.");
      setResendIn(45);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setOrders([]);
    setStep("email");
    setEmail("");
    setCode("");
  };

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid");
    const pending = orders.filter((o) => o.status !== "paid");
    const total = paid.reduce((s, o) => s + Number(o.total ?? 0), 0);
    return { paid, pending, total };
  }, [orders]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: INK, color: WHITE }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-sm"
        style={{
          backgroundColor: `${INK}E0`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-display tracking-[0.18em] text-sm"
            style={{ color: YELLOW }}
          >
            ← COPA 2026
          </Link>
          {session && (
            <button
              onClick={signOut}
              className="text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full px-4 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: MUTED, border: `1px solid ${LINE}` }}
            >
              Sair
            </button>
          )}
        </div>
      </header>

      {!bootDone ? (
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div
            className="mx-auto h-10 w-10 rounded-full border-2 animate-spin"
            style={{ borderColor: `${YELLOW}40`, borderTopColor: YELLOW }}
          />
        </div>
      ) : !session ? (
        // LOGIN
        <main
          className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10"
          style={{
            backgroundImage: `linear-gradient(180deg, ${INK} 0%, #06060a 100%), url(${fifaBackdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-7 sm:p-8"
            style={{
              backgroundColor: SURFACE,
              border: `1px solid ${LINE}`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            <div className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: YELLOW }}>
              Área do torcedor
            </div>
            <h1 className="font-display text-3xl mt-1.5 leading-tight">Meus Pedidos</h1>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              {step === "email"
                ? "Entre com o e-mail usado na compra para acompanhar seus pedidos e pagamentos."
                : `Enviamos um código de 6 dígitos para ${email}.`}
            </p>

            {step === "email" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                    Seu e-mail
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCode()}
                    placeholder="voce@email.com"
                    className="mt-1 w-full rounded-lg px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400/40"
                    style={{ backgroundColor: "#08080d", border: `1px solid ${LINE}`, color: WHITE }}
                  />
                </div>
                {error && <p className="text-xs" style={{ color: "#ff6b6b" }}>{error}</p>}
                <button
                  onClick={sendCode}
                  disabled={busy}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  {busy ? "Enviando..." : "Receber código →"}
                </button>
                <p className="text-[11px] text-center" style={{ color: MUTED }}>
                  Sem cadastro nem senha. Login só com código por e-mail.
                </p>
              </div>
            )}

            {step === "code" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                    Código
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => e.key === "Enter" && verify()}
                    placeholder="000000"
                    className="mt-1 w-full rounded-lg px-3 py-4 text-center text-2xl tracking-[0.6em] outline-none focus:ring-2 focus:ring-yellow-400/40 font-mono"
                    style={{ backgroundColor: "#08080d", border: `1px solid ${LINE}`, color: WHITE }}
                  />
                </div>
                {info && <p className="text-xs" style={{ color: GREEN }}>{info}</p>}
                {error && <p className="text-xs" style={{ color: "#ff6b6b" }}>{error}</p>}
                <button
                  onClick={verify}
                  disabled={busy || code.length < 6}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-transform hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  {busy ? "Verificando..." : "Entrar"}
                </button>
                <div className="flex items-center justify-between text-[11px]" style={{ color: MUTED }}>
                  <button
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setError(null);
                      setInfo(null);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    ← Trocar e-mail
                  </button>
                  <button
                    onClick={resend}
                    disabled={resendIn > 0 || busy}
                    className="hover:text-white transition-colors disabled:opacity-50"
                  >
                    {resendIn > 0 ? `Reenviar em ${resendIn}s` : "Reenviar código"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        // LOGGED — DASHBOARD
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: YELLOW }}>
                Bem-vindo de volta
              </div>
              <h1 className="font-display text-4xl mt-1">Meus pedidos</h1>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                Logado como <span style={{ color: WHITE }}>{session.user.email}</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <StatCard label="Total" value={orders.length.toString()} accent={WHITE} />
            <StatCard label="Pagos" value={stats.paid.length.toString()} accent={GREEN} />
            <StatCard label="Em aberto" value={stats.pending.length.toString()} accent={YELLOW} />
          </div>

          {loadingOrders ? (
            <div className="text-center py-16">
              <div
                className="mx-auto h-10 w-10 rounded-full border-2 animate-spin"
                style={{ borderColor: `${YELLOW}40`, borderTopColor: YELLOW }}
              />
              <p className="mt-4 text-sm" style={{ color: MUTED }}>Carregando seus pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-2xl text-center py-16 px-6"
              style={{ backgroundColor: SURFACE, border: `1px dashed ${LINE}` }}
            >
              <div className="font-display text-2xl">Nenhum pedido ainda</div>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Quando você fizer uma compra, ela vai aparecer aqui.
              </p>
              <Link
                to="/"
                className="inline-block mt-5 rounded-full px-6 py-2.5 text-xs font-bold tracking-wide"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
    >
      <div className="text-[9px] font-semibold tracking-[0.25em] uppercase" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="mt-1 font-display text-3xl" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const paid = order.status === "paid";
  const date = new Date(order.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const itemsCount = (order.items ?? []).reduce(
    (s: number, it: any) => s + (Number(it?.qty) || 0),
    0,
  );

  return (
    <Link
      to="/pedido/$id"
      params={{ id: order.id }}
      className="block rounded-xl p-4 sm:p-5 transition-colors hover:bg-white/[0.02]"
      style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs" style={{ color: MUTED }}>
              #{order.id}
            </span>
            <StatusPill paid={paid} />
          </div>
          <div className="mt-1.5 text-sm font-semibold truncate">
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
            {order.items && order.items[0]?.name ? ` · ${order.items[0].name}` : ""}
            {order.items && order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
          </div>
          <div className="mt-0.5 text-xs" style={{ color: MUTED }}>
            {date}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-xl" style={{ color: paid ? GREEN : WHITE }}>
            R$ {Number(order.total).toFixed(2).replace(".", ",")}
          </div>
          <div className="text-[10px] mt-1" style={{ color: MUTED }}>
            Ver detalhes →
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusPill({ paid }: { paid: boolean }) {
  return (
    <span
      className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
      style={{
        color: paid ? GREEN : YELLOW,
        backgroundColor: paid ? `${GREEN}18` : `${YELLOW}18`,
        border: `1px solid ${paid ? GREEN : YELLOW}40`,
      }}
    >
      {paid ? "Pago" : "Aguardando"}
    </span>
  );
}
