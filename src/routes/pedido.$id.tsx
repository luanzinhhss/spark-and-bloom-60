import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const YELLOW = "#F4C430";
const GREEN = "#00A859";
const WHITE = "#FFFFFF";
const INK = "#0B0B10";
const SURFACE = "#14141C";
const SURFACE_2 = "#1E1E29";
const LINE = "#2A2A38";
const MUTED = "#9CA0AE";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      cep: string;
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  transactionId: string;
  paidAt: string | null;
  shipping?: {
    method?: string;
    label?: string;
    price?: number;
    eta?: string;
  } | null;
};

export const Route = createFileRoute("/pedido/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Pedido ${params.id} — Copa Album 2026` },
      { name: "description", content: `Confirmação do pedido ${params.id}.` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderPage,
});

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function StatusBadge({ status }: { status: Order["status"] }) {
  const map = {
    paid: { bg: GREEN, label: "Pagamento confirmado" },
    pending: { bg: YELLOW, label: "Aguardando pagamento" },
    cancelled: { bg: "#D62828", label: "Cancelado" },
  } as const;
  const cfg = map[status];
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase"
      style={{ backgroundColor: cfg.bg, color: status === "pending" ? INK : WHITE }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {cfg.label}
    </span>
  );
}

function OrderPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`copa.order.${id}`);
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [id]);

  // Poll for status updates in case user lands here while still pending
  useEffect(() => {
    if (!order || order.status !== "pending") return;
    const tick = async () => {
      try {
        const res = await fetch(`/api/pix?transaction_id=${encodeURIComponent(order.transactionId)}`);
        const r = (await res.json()) as { status?: string };
        if (r.status === "paid" || r.status === "approved" || r.status === "completed") {
          const updated: Order = { ...order, status: "paid", paidAt: new Date().toISOString() };
          localStorage.setItem(`copa.order.${id}`, JSON.stringify(updated));
          setOrder(updated);
        }
      } catch {
        // ignore
      }
    };
    const int = setInterval(tick, 5000);
    return () => clearInterval(int);
  }, [order, id]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: INK, color: WHITE }}>
        <div className="text-sm" style={{ color: MUTED }}>Carregando pedido…</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: INK, color: WHITE }}>
        <div className="max-w-md text-center">
          <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: GREEN }}>
            Pedido não encontrado
          </div>
          <h1 className="font-display text-3xl mb-3">Não localizamos o pedido <span style={{ color: YELLOW }}>{id}</span></h1>
          <p className="text-sm mb-6" style={{ color: MUTED }}>
            Os detalhes do pedido ficam salvos neste navegador. Se você fez a compra em outro dispositivo,
            verifique seu e-mail para o comprovante.
          </p>
          <Link
            to="/"
            className="inline-block rounded-full px-6 py-3 text-xs font-bold tracking-wide"
            style={{ backgroundColor: YELLOW, color: INK }}
          >
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleString("pt-BR");
  const paidDate = order.paidAt ? new Date(order.paidAt).toLocaleString("pt-BR") : null;

  return (
    <main className="min-h-screen px-4 sm:px-8 py-10 sm:py-14" style={{ backgroundColor: INK, color: WHITE }}>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide mb-8 hover:opacity-80"
          style={{ color: MUTED }}
        >
          ← Voltar para a loja
        </Link>

        <div
          className="rounded-3xl p-6 sm:p-10"
          style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: GREEN }}>
                Confirmação do pedido
              </div>
              <h1 className="font-display text-3xl sm:text-4xl leading-tight">
                Pedido <span style={{ color: YELLOW }}>{order.id}</span>
              </h1>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Realizado em {createdDate}
                {paidDate && <> · Pago em {paidDate}</>}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {order.status === "paid" && (
            <div
              className="mt-6 rounded-2xl p-4 flex items-start gap-3"
              style={{ backgroundColor: `${GREEN}15`, border: `1px solid ${GREEN}55` }}
            >
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: GREEN }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-sm">
                <div className="font-semibold" style={{ color: WHITE }}>Pagamento confirmado</div>
                <div className="mt-0.5" style={{ color: MUTED }}>
                  Em instantes você receberá um e-mail com as instruções para enviar suas fotos.
                </div>
              </div>
            </div>
          )}

          {order.status === "pending" && (
            <div
              className="mt-6 rounded-2xl p-4 flex items-start gap-3"
              style={{ backgroundColor: `${YELLOW}15`, border: `1px solid ${YELLOW}55` }}
            >
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="text-sm">
                <div className="font-semibold" style={{ color: WHITE }}>Aguardando pagamento PIX</div>
                <div className="mt-0.5" style={{ color: MUTED }}>
                  Esta página atualiza automaticamente assim que o pagamento for identificado.
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="mt-8">
            <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: MUTED }}>
              Itens do pedido
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}`, backgroundColor: SURFACE_2 }}>
              {order.items.map((it, i) => (
                <div
                  key={it.id + i}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: WHITE }}>{it.name}</div>
                    <div className="text-[11px]" style={{ color: MUTED }}>
                      {it.qty} × {fmt(it.price)}
                    </div>
                  </div>
                  <div className="font-display text-base shrink-0" style={{ color: WHITE }}>
                    {fmt(it.qty * it.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-1.5 text-sm">
            <div className="flex items-center justify-between" style={{ color: MUTED }}>
              <span>Subtotal</span>
              <span>{fmt(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between" style={{ color: GREEN }}>
                <span>Desconto {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>− {fmt(order.discount)}</span>
              </div>
            )}
            <div
              className="flex items-center justify-between pt-3 mt-2 text-base"
              style={{ borderTop: `1px solid ${LINE}`, color: WHITE }}
            >
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl" style={{ color: YELLOW }}>{fmt(order.total)}</span>
            </div>
          </div>

          {/* Customer + address */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-4" style={{ border: `1px solid ${LINE}`, backgroundColor: SURFACE_2 }}>
              <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: GREEN }}>
                Contato
              </div>
              <div className="text-sm space-y-1">
                <div style={{ color: WHITE }}>{order.customer.name}</div>
                <div style={{ color: MUTED }}>{order.customer.email}</div>
                <div style={{ color: MUTED }}>{order.customer.phone}</div>
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ border: `1px solid ${LINE}`, backgroundColor: SURFACE_2 }}>
              <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: GREEN }}>
                Endereço de entrega
              </div>
              <div className="text-sm" style={{ color: WHITE }}>
                {order.customer.address.street}, {order.customer.address.number}
              </div>
              <div className="text-sm" style={{ color: MUTED }}>
                {order.customer.address.neighborhood} · {order.customer.address.city}/{order.customer.address.state}
              </div>
              <div className="text-sm" style={{ color: MUTED }}>CEP {order.customer.address.cep}</div>
            </div>
          </div>

          {/* Shipping */}
          {order.shipping && (
            <div className="mt-4 rounded-2xl p-4" style={{ border: `1px solid ${LINE}`, backgroundColor: SURFACE_2 }}>
              <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: GREEN }}>
                Forma de envio
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div style={{ color: WHITE }}>{order.shipping.label ?? order.shipping.method ?? "—"}</div>
                  {order.shipping.eta && (
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                      Prazo estimado: {order.shipping.eta}
                    </div>
                  )}
                </div>
                <div className="font-display text-base" style={{ color: WHITE }}>
                  {order.shipping.price ? fmt(order.shipping.price) : "Grátis"}
                </div>
              </div>
            </div>
          )}

          {/* Timeline / payment history */}
          <div className="mt-8">
            <div className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: MUTED }}>
              Histórico do pagamento
            </div>
            <div className="rounded-2xl p-4 sm:p-5" style={{ border: `1px solid ${LINE}`, backgroundColor: SURFACE_2 }}>
              <TimelineItem
                done
                title="Pedido criado"
                meta={createdDate}
                desc={`Pedido ${order.id} registrado com sucesso.`}
              />
              <TimelineItem
                done
                title="QR Code PIX gerado"
                meta={createdDate}
                desc="Cobrança gerada via gateway BlackNosePay."
              />
              <TimelineItem
                done={order.status === "paid"}
                pulse={order.status === "pending"}
                title={order.status === "paid" ? "Pagamento confirmado" : "Aguardando pagamento"}
                meta={paidDate ?? "Em andamento"}
                desc={
                  order.status === "paid"
                    ? "Pagamento PIX identificado e compensado."
                    : "Assim que o PIX for compensado, o status muda automaticamente."
                }
              />
              <TimelineItem
                done={order.status === "paid"}
                title="Produção e envio"
                meta={order.status === "paid" ? "Em fila" : "Após confirmação"}
                desc="Personalização das peças e envio para o endereço cadastrado."
                last
              />
            </div>
          </div>

          <div className="mt-8 text-[11px]" style={{ color: MUTED }}>
            ID da transação: <span className="font-mono">{order.transactionId}</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 text-center rounded-full px-6 py-3.5 text-xs font-bold tracking-wide transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              Continuar comprando
            </Link>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(order.id);
              }}
              className="flex-1 rounded-full px-6 py-3.5 text-xs font-semibold tracking-wide transition-colors hover:bg-white/5"
              style={{ color: WHITE, border: `1px solid ${LINE}` }}
            >
              Copiar número do pedido
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
