import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const GATEWAY_URL =
  "https://bqckqgmorberurjolzmq.supabase.co/functions/v1/api-generate-pix-qr";
const STATUS_URL =
  "https://bqckqgmorberurjolzmq.supabase.co/functions/v1/api-check-pix-status";

const Schema = z.object({
  amount: z.number().min(0.5).max(100000),
  description: z.string().min(1).max(255),
  external_id: z.string().min(1).max(120),
  expiration_minutes: z.number().int().min(5).max(1440).optional(),
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
          return Response.json({
            success: !!json?.success,
            status: json?.status ?? "pending",
          });
        } catch {
          return Response.json({ success: false, status: "unknown" });
        }
      },
    },
  },
});
