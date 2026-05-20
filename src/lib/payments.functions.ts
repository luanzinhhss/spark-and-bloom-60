import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_URL = "https://bqckqgmorberurjolzmq.supabase.co/functions/v1";

export const generatePix = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        amount: z.number().min(0.5).max(100000),
        description: z.string().min(1).max(255),
        external_id: z.string().min(1).max(120),
        expiration_minutes: z.number().int().min(5).max(1440).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.BLACKNOSE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Gateway não configurado" };
    }
    try {
      const res = await fetch(`${BASE_URL}/api-generate-pix-qr`, {
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
        return {
          success: false,
          error: json?.error ?? `Erro ${res.status}`,
        };
      }
      return {
        success: true as const,
        transaction_id: json.transaction_id as string,
        copy_paste: json.pix?.copy_paste as string,
        qr_code_image: json.pix?.qr_code_image as string,
        total: json.amount?.total ?? data.amount,
      };
    } catch (e) {
      console.error("generatePix error", e);
      return { success: false, error: "Falha ao conectar ao gateway" };
    }
  });

export const checkPixStatus = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ transaction_id: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.BLACKNOSE_API_KEY;
    if (!apiKey) return { success: false, status: "unknown" };
    try {
      const res = await fetch(
        `${BASE_URL}/api-check-pix-status?transaction_id=${encodeURIComponent(data.transaction_id)}`,
        { headers: { "X-API-Key": apiKey } },
      );
      const json = (await res.json()) as any;
      return {
        success: !!json?.success,
        status: (json?.status ?? "pending") as string,
      };
    } catch {
      return { success: false, status: "unknown" };
    }
  });
