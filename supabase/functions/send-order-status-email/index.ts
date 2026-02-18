/**
 * Braga Bazaar — Supabase Edge Function: Send order status email
 *
 * When admin sets order to "shipped" or "delivered", call this to email the customer.
 * Deploy:  supabase functions deploy send-order-status-email
 * Secrets: RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY (or use default from invoke)
 *
 * Invoke:  POST /functions/v1/send-order-status-email
 *          Body: { order_id: number, status: "shipped" | "delivered" }
 */

// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Braga Bazaar <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const orderId = body.order_id;
    const status = (body.status || "").toLowerCase();

    if (!orderId || !["shipped", "delivered"].includes(status)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing order_id or invalid status (use shipped or delivered)" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set; skipping email.");
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "Email not configured" }), { status: 200, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, client_order_id, email, full_name, total")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ ok: false, error: "Order not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const to = order.email?.trim();
    if (!to) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "No email on order" }), { status: 200, headers: corsHeaders });
    }

    const orderRef = order.client_order_id || order.id;
    const name = order.full_name || "Cliente";
    const total = order.total != null ? Number(order.total).toFixed(2) : "—";

    const subject = status === "shipped"
      ? `A sua encomenda #${orderRef} foi enviada — Braga Bazaar`
      : `A sua encomenda #${orderRef} foi entregue — Braga Bazaar`;

    const html = status === "shipped"
      ? `<p>Olá ${name},</p><p>A sua encomenda <strong>#${orderRef}</strong> foi enviada e está a caminho.</p><p>Total: €${total}</p><p>Obrigado,<br>Braga Bazaar</p>`
      : `<p>Olá ${name},</p><p>A sua encomenda <strong>#${orderRef}</strong> foi entregue.</p><p>Total: €${total}</p><p>Obrigado por comprar connosco!<br>Braga Bazaar</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to send email" }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: true, sent: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("send-order-status-email error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "Internal error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
