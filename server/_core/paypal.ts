import { ENV } from "./env";

function requireConfig() {
  if (!ENV.paypalClientId || !ENV.paypalClientSecret) {
    throw new Error("PayPal is not configured: set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET");
  }
}

async function accessToken() {
  requireConfig();
  const response = await fetch(`${ENV.paypalBaseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${ENV.paypalClientId}:${ENV.paypalClientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`PayPal authentication failed (${response.status})`);
  return ((await response.json()) as { access_token: string }).access_token;
}

export async function createPaypalOrder(input: { orderReference: string; amountCents: number; currency: string }) {
  const token = await accessToken();
  const response = await fetch(`${ENV.paypalBaseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ reference_id: input.orderReference, amount: { currency_code: input.currency, value: (input.amountCents / 100).toFixed(2) } }],
    }),
  });
  if (!response.ok) throw new Error(`PayPal order creation failed (${response.status})`);
  return (await response.json()) as { id: string; status: string; links?: Array<{ rel: string; href: string }> };
}

export async function capturePaypalOrder(paypalOrderId: string) {
  const token = await accessToken();
  const response = await fetch(`${ENV.paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`PayPal capture failed (${response.status})`);
  return (await response.json()) as { id: string; status: string; purchase_units?: unknown[] };
}
