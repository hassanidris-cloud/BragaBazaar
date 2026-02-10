/**
 * Braga Bazaar — Supabase Edge Function: MB WAY Payment
 *
 * Interfaces with the SIBS Gateway API to:
 *   1. Trigger a purchase notification via /payments/mbway/purchase
 *   2. Handle known error codes (10002 = user not registered)
 *   3. Return a clean JSON response to the app
 *
 * Deploy:  supabase functions deploy mbway-payment
 * Invoke:  POST /functions/v1/mbway-payment
 *          Body: { amount, phoneNumber, orderId }
 *
 * Environment variables required:
 *   SIBS_API_KEY        – SIBS Gateway bearer token
 *   SIBS_TERMINAL_ID    – Terminal/merchant identifier
 *   SIBS_BASE_URL       – e.g. https://api.sibsgateway.com/api/v1
 */

// @ts-nocheck – Deno imports for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

/* ── Types ─────────────────────────────────────────────── */

interface MBWayRequest {
  amount: number;
  phoneNumber: string;
  orderId: string;
}

interface SIBSPurchaseResponse {
  transactionID: string;
  returnStatus: {
    statusCode: string;
    statusMsg: string;
    statusDescription: string;
  };
}

/* ── Known SIBS error codes ────────────────────────────── */

const SIBS_ERRORS: Record<string, string> = {
  "10002": "O número de telemóvel não está registado no MB WAY.",
  "10003": "Transação expirada. O utilizador não autorizou a tempo.",
  "10005": "Montante inválido ou acima do limite permitido.",
  "10010": "Serviço MB WAY temporariamente indisponível.",
};

/* ── Validation ────────────────────────────────────────── */

const PT_MOBILE_RE = /^9[1236][0-9]{7}$/;

function validateRequest(body: MBWayRequest): string | null {
  if (!body.amount || body.amount <= 0) return "Montante inválido.";
  if (!body.phoneNumber) return "Número de telemóvel em falta.";
  if (!PT_MOBILE_RE.test(body.phoneNumber.replace(/\s/g, "")))
    return "Número de telemóvel inválido. Use o formato 9xxxxxxxx.";
  if (!body.orderId) return "ID da encomenda em falta.";
  return null;
}

/* ── Edge Function ─────────────────────────────────────── */

serve(async (req: Request) => {
  // CORS headers for Expo web
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Método não permitido." }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const body: MBWayRequest = await req.json();

    /* ── Validate ── */
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ ok: false, error: validationError }),
        { status: 400, headers: corsHeaders },
      );
    }

    /* ── Environment ── */
    const SIBS_API_KEY = Deno.env.get("SIBS_API_KEY");
    const SIBS_TERMINAL_ID = Deno.env.get("SIBS_TERMINAL_ID");
    const SIBS_BASE_URL =
      Deno.env.get("SIBS_BASE_URL") ?? "https://api.sibsgateway.com/api/v1";

    if (!SIBS_API_KEY || !SIBS_TERMINAL_ID) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Configuração do gateway em falta. Contacte o suporte.",
        }),
        { status: 500, headers: corsHeaders },
      );
    }

    /* ── Call SIBS /payments/mbway/purchase ── */
    const sibsPayload = {
      merchant: {
        terminalId: SIBS_TERMINAL_ID,
      },
      transaction: {
        transactionTimestamp: new Date().toISOString(),
        description: `Braga Bazaar — Encomenda ${body.orderId}`,
        moto: false,
        paymentType: "PURS",
        amount: {
          value: Math.round(body.amount * 100), // cents
          currency: "EUR",
        },
        paymentMethod: ["MBWY"],
      },
      customer: {
        phone: `+351${body.phoneNumber.replace(/\s/g, "")}`,
      },
    };

    const sibsRes = await fetch(
      `${SIBS_BASE_URL}/payments/mbway/purchase`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SIBS_API_KEY}`,
          "Content-Type": "application/json",
          "X-IBM-Client-Id": SIBS_TERMINAL_ID,
        },
        body: JSON.stringify(sibsPayload),
      },
    );

    const sibsData: SIBSPurchaseResponse = await sibsRes.json();

    /* ── Handle SIBS errors ── */
    const statusCode = sibsData.returnStatus?.statusCode;
    if (statusCode && statusCode !== "000") {
      const friendlyMsg =
        SIBS_ERRORS[statusCode] ??
        sibsData.returnStatus.statusDescription ??
        "Erro desconhecido no gateway.";

      return new Response(
        JSON.stringify({
          ok: false,
          errorCode: statusCode,
          error: friendlyMsg,
        }),
        { status: 422, headers: corsHeaders },
      );
    }

    /* ── Success: purchase notification sent ── */
    return new Response(
      JSON.stringify({
        ok: true,
        transactionId: sibsData.transactionID,
        message:
          "Notificação MB WAY enviada. Aguardando autorização do utilizador.",
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error("mbway-payment error:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Erro interno do servidor. Tente novamente.",
      }),
      { status: 500, headers: corsHeaders },
    );
  }
});
