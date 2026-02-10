/**
 * Braga Bazaar – Checkout Service
 *
 * Handles both Stripe (Online) and Cash on Delivery (COD),
 * following the SPAR / Pingo Doce standard for payment flexibility.
 *
 * NOTE: Supabase client is imported lazily so the module doesn't
 * crash when the backend isn't configured yet (mock-friendly).
 */

import { CartItem, FulfillmentType, PaymentMethod } from "../types";

/* ── Types ─────────────────────────────────────────────── */
export type OrderPayload = {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  fulfillment: FulfillmentType;
  pickupSlotId?: string;
};

export type CheckoutResult = {
  status: "PAID" | "CONFIRMED" | "ERROR";
  message: string;
  orderId?: string;
};

/* ── Main checkout handler ─────────────────────────────── */
export async function processBragaBazaarOrder(
  orderData: OrderPayload,
  paymentMethod: PaymentMethod,
): Promise<CheckoutResult> {
  /* ── Online (Stripe / MB Way / Visa) ─────────────────── */
  if (paymentMethod === "stripe") {
    // In production: useStripe().confirmPayment(...)
    // For now we do an optimistic mock:
    return {
      status: "PAID",
      message: "Pagamento processado! Redirecionando para o gateway seguro…",
      orderId: `bzo-${Date.now()}`,
    };
  }

  /* ── MB WAY ───────────────────────────────────────────── */
  if (paymentMethod === "mbway") {
    // The actual MB WAY flow (phone input → poll → authorize) is handled
    // by MBWayCheckout + mbway service before we reach this point.
    return {
      status: "PAID",
      message: "Pagamento autorizado via MB WAY!",
      orderId: `bzo-${Date.now()}`,
    };
  }

  /* ── Multibanco reference ────────────────────────────── */
  if (paymentMethod === "multibanco") {
    // In production: generate entity/reference via Stripe PT or Easypay
    return {
      status: "CONFIRMED",
      message:
        "Referência Multibanco gerada. Entidade: 21 312 — Ref: 123 456 789. Pague em 48h.",
      orderId: `bzo-${Date.now()}`,
    };
  }

  /* ── Cash on Delivery (COD) ──────────────────────────── */
  if (paymentMethod === "cash_on_delivery") {
    // In production: insert into Supabase with pending_payment status
    // const { data, error } = await supabase
    //   .from("orders")
    //   .insert([{
    //     user_id: orderData.userId,
    //     status: "pending_payment",
    //     total_price: orderData.totalPrice,
    //     payment_type: "CASH_ON_DELIVERY",
    //     fulfillment: orderData.fulfillment,
    //     pickup_slot_id: orderData.pickupSlotId,
    //   }]);

    return {
      status: "CONFIRMED",
      message: "Encomenda confirmada! Pague na entrega / recolha.",
      orderId: `bzo-${Date.now()}`,
    };
  }

  return { status: "ERROR", message: "Método de pagamento desconhecido." };
}

/* ── Loyalty points calculator ─────────────────────────── */
export function calculateLoyaltyPoints(
  items: CartItem[],
  pointsPerProduct: Record<string, number>,
): number {
  return items.reduce((total, item) => {
    const pts = pointsPerProduct[item.productId] ?? 5;
    return total + pts * item.quantity;
  }, 0);
}
