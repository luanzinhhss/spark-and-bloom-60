import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY_URL =
  "https://bqckqgmorberurjolzmq.supabase.co/functions/v1/api-generate-pix-qr";
const STATUS_URL =
  "https://bqckqgmorberurjolzmq.supabase.co/functions/v1/api-check-pix-status";

const Schema = z.object({
  amount: z.number().min(0.5).max(100000),
  description: z.string().min(1).max(255),
  external_id: z.string().min(1).max(120),
  expiration_minutes: z.number().int().min(5).max(1440).optional(),
  email: z.string().email().max(255).optional(),
  items: z.array(z.unknown()).max(50).optional(),
  customer: z.unknown().optional(),
  shipping: z.unknown().optional(),
});

export const Route = createFileRoute("/api/pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.BLACKNOSE_API_KEY;
        if (!apiKey) {
          return Response.json(
            { success: false, error: "Gateway não configurado" },
            { status: 500 },
          );
        }
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { success: false, error: "Corpo inválido" },
            { status: 400 },
          );
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { success: false, error: "Dados inválidos" },
            { status: 400 },
          );
        }
        const data = parsed.data;
        try {
          const res = await fetch(GATEWAY_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": apiKey,
            },
            body: JSON.stringify({
              amount: data.amount,
              description: data.description,
              external_id: data.external_id,
              expiration_minutes: data.expiration_minutes ?? 30,
            }),
          });
          const json = (await res.json()) as any;
          if (!res.ok || !json?.success) {
            return Response.json(
              {
                success: false,
                error: json?.error ?? `Erro ${res.status}`,
              },
              { status: 502 },
            );
          }

          // Persist order in DB (best-effort)
          try {
            await supabaseAdmin.from("orders").upsert(
              {
                id: data.external_id,
                email: data.email ?? null,
                status: "pending",
                total: data.amount,
                items: (data.items ?? []) as any,
                customer: (data.customer ?? null) as any,
                shipping: (data.shipping ?? null) as any,
                transaction_id: json.transaction_id,
                pix: {
                  copy_paste: json.pix?.copy_paste,
                  qr_code_image: json.pix?.qr_code_image,
                },
              },
              { onConflict: "id" },
            );
          } catch (e) {
            console.error("orders persist error", e);
          }

          return Response.json({
            success: true,
            transaction_id: json.transaction_id,
            copy_paste: json.pix?.copy_paste,
            qr_code_image: json.pix?.qr_code_image,
            total: json.amount?.total ?? data.amount,
          });
        } catch (e) {
          console.error("pix gateway error", e);
          return Response.json(
            { success: false, error: "Falha ao conectar ao gateway" },
            { status: 502 },
          );
        }
      },
      GET: async ({ request }) => {
        const apiKey = process.env.BLACKNOSE_API_KEY;
        if (!apiKey) {
          return Response.json({ success: false, status: "unknown" });
        }
        const url = new URL(request.url);
        const id = url.searchParams.get("transaction_id");
        if (!id) {
          return Response.json(
            { success: false, error: "transaction_id requerido" },
            { status: 400 },
          );
        }
        try {
          const res = await fetch(
            `${STATUS_URL}?transaction_id=${encodeURIComponent(id)}`,
            { headers: { "X-API-Key": apiKey } },
          );
          const json = (await res.json()) as any;
          const status = (json?.status ?? "pending") as string;

          if (status === "paid" || status === "approved" || status === "completed") {
            try {
              await supabaseAdmin
                .from("orders")
                .update({ status: "paid", paid_at: new Date().toISOString() })
                .eq("transaction_id", id)
                .neq("status", "paid");
            } catch (e) {
              console.error("orders mark paid error", e);
            }
          }

          return Response.json({
            success: !!json?.success,
            status,
          });
        } catch {
          return Response.json({ success: false, status: "unknown" });
        }
      },
    },
  },
});
