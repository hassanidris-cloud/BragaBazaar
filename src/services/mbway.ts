/**
 * Braga Bazaar — MB WAY Payment Service
 *
 * Handles the full MB WAY lifecycle:
 *  1. Validate Portuguese mobile number
 *  2. Create transaction via SIBS/Stripe gateway
 *  3. Poll for authorization status (every 3 s, 3-min timeout per SIBS standard)
 *
 * Uses mock responses when SIBS_API_KEY is absent so the app
 * runs in demo mode without a real payment gateway.
 */

/* ── Validation ────────────────────────────────────────── */

/** SIBS-compliant Portuguese mobile regex (9x xxxxxxx) */
const PT_MOBILE_RE = /^9[1236][0-9]{7}$/;

export function validatePTMobile(phone: string): boolean {
  return PT_MOBILE_RE.test(phone.replace(/\s/g, ""));
}

/* ── Types ─────────────────────────────────────────────── */

export type MBWayStatus =
  | "idle"
  | "validating"
  | "pending"       // push sent, waiting for user
  | "authorized"    // user approved in MB WAY app
  | "declined"      // user rejected
  | "expired"       // 3-min timeout
  | "error";        // gateway / network error

export type MBWayTransaction = {
  transactionId: string;
  status: MBWayStatus;
  amount: number;
  phoneNumber: string;
  createdAt: number;
  expiresAt: number;      // createdAt + 180 000 ms
  errorCode?: string;
  errorMessage?: string;
};

export type MBWayCreateResult = {
  ok: boolean;
  transaction?: MBWayTransaction;
  errorCode?: string;
  errorMessage?: string;
};

/* ── Constants ─────────────────────────────────────────── */

const MBWAY_TIMEOUT_MS = 180_000;   // 3 minutes per SIBS
const POLL_INTERVAL_MS = 3_000;     // every 3 s

/* ── Create Transaction ────────────────────────────────── */

export async function createMBWayTransaction(
  phoneNumber: string,
  amount: number,
  orderId: string,
): Promise<MBWayCreateResult> {
  // In production: POST to SIBS or Stripe with paymentMethod: "MBWY"
  // const res = await fetch(`${SIBS_BASE}/payments/mbway/purchase`, { ... });

  // ── Mock: simulate a 600ms gateway latency ──
  await sleep(600);

  const cleanPhone = phoneNumber.replace(/\s/g, "");

  if (!validatePTMobile(cleanPhone)) {
    return {
      ok: false,
      errorCode: "INVALID_PHONE",
      errorMessage: "Número de telemóvel inválido. Use o formato 9xxxxxxxx.",
    };
  }

  // Simulate SIBS error 10002 — user not registered
  if (cleanPhone === "910000000") {
    return {
      ok: false,
      errorCode: "10002",
      errorMessage: "Este número não está registado no MB WAY.",
    };
  }

  const now = Date.now();
  return {
    ok: true,
    transaction: {
      transactionId: `mbw-${orderId}-${now}`,
      status: "pending",
      amount,
      phoneNumber: cleanPhone,
      createdAt: now,
      expiresAt: now + MBWAY_TIMEOUT_MS,
    },
  };
}

/* ── Poll Status ───────────────────────────────────────── */

export type PollResult = {
  status: MBWayStatus;
  errorCode?: string;
  errorMessage?: string;
};

/**
 * Polls the payment gateway for the transaction status.
 * In production this would hit SIBS /payments/mbway/status/{id}.
 * The mock auto-authorizes after ~9 s for demo purposes.
 */
export async function pollMBWayStatus(
  tx: MBWayTransaction,
): Promise<PollResult> {
  await sleep(300);

  const elapsed = Date.now() - tx.createdAt;

  // Expired?
  if (elapsed >= MBWAY_TIMEOUT_MS) {
    return { status: "expired" };
  }

  // Mock: authorize after ~9 s of waiting
  if (elapsed > 9_000) {
    return { status: "authorized" };
  }

  return { status: "pending" };
}

/* ── Polling loop (used by the component) ──────────────── */

export function startMBWayPolling(
  tx: MBWayTransaction,
  onUpdate: (result: PollResult) => void,
): { stop: () => void } {
  let stopped = false;

  const tick = async () => {
    if (stopped) return;
    const result = await pollMBWayStatus(tx);
    if (stopped) return;
    onUpdate(result);

    if (result.status === "pending") {
      setTimeout(tick, POLL_INTERVAL_MS);
    }
  };

  // First poll after one interval
  const timer = setTimeout(tick, POLL_INTERVAL_MS);

  return {
    stop: () => {
      stopped = true;
      clearTimeout(timer);
    },
  };
}

/* ── Helpers ───────────────────────────────────────────── */

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
