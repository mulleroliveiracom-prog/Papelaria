import crypto from 'node:crypto';
import type { PackageInfo } from '../src/types/studio.ts';
import type { StoredOrder } from './db.ts';
import { getRuntimeConfig } from './db.ts';

export interface CreatePaymentResult {
  providerConfigured: boolean;
  paymentProvider: string;
  checkoutUrl?: string;
  pixCopyPaste?: string;
  externalPaymentId?: string;
  errorMessage?: string;
}

/**
 * Creates a real checkout session / PIX charge when PAYMENT_PROVIDER and PAYMENT_API_KEY
 * are configured on the server. Never fabricates fake checkouts or unlocks orders without
 * true webhook confirmation.
 */
export async function createCheckoutForOrder(
  order: StoredOrder,
  pkg: PackageInfo,
  appBaseUrl: string
): Promise<CreatePaymentResult> {
  const cfg = getRuntimeConfig();
  const provider = (process.env.PAYMENT_PROVIDER || cfg.paymentProvider || '').trim().toLowerCase();
  const apiKey = process.env.PAYMENT_API_KEY?.trim();

  if (!provider || !apiKey) {
    return {
      providerConfigured: false,
      paymentProvider: provider || 'não_configurado',
    };
  }

  // Real Mercado Pago Checkout Pro integration
  if (provider === 'mercadopago') {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_reference: order.orderId,
        items: [
          {
            id: pkg.id,
            title: `Meu Bebê em um Sonho — ${pkg.name} (${pkg.photoCount} fotos)`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number((pkg.priceCents / 100).toFixed(2)),
          },
        ],
        notification_url: `${appBaseUrl}/api/webhooks/payment`,
        back_urls: {
          success: `${appBaseUrl}/?orderId=${order.orderId}`,
          pending: `${appBaseUrl}/?orderId=${order.orderId}`,
          failure: `${appBaseUrl}/?orderId=${order.orderId}`,
        },
        auto_return: 'approved',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        providerConfigured: true,
        paymentProvider: 'mercadopago',
        errorMessage: `Falha ao criar preferência Mercado Pago (${response.status}): ${text}`,
      };
    }

    const data = (await response.json()) as { id?: string; init_point?: string };
    return {
      providerConfigured: true,
      paymentProvider: 'mercadopago',
      externalPaymentId: data.id,
      checkoutUrl: data.init_point,
    };
  }

  // Real Stripe Checkout integration (PIX / Card)
  if (provider === 'stripe') {
    const params = new URLSearchParams({
      mode: 'payment',
      success_url: `${appBaseUrl}/?orderId=${order.orderId}`,
      cancel_url: `${appBaseUrl}/?orderId=${order.orderId}`,
      client_reference_id: order.orderId,
      'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][product_data][name]': `Meu Bebê em um Sonho — ${pkg.name}`,
      'line_items[0][price_data][unit_amount]': String(pkg.priceCents),
      'line_items[0][quantity]': '1',
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        providerConfigured: true,
        paymentProvider: 'stripe',
        errorMessage: `Falha ao criar sessão Stripe (${response.status}): ${text}`,
      };
    }

    const data = (await response.json()) as { id?: string; url?: string };
    return {
      providerConfigured: true,
      paymentProvider: 'stripe',
      externalPaymentId: data.id,
      checkoutUrl: data.url,
    };
  }

  return {
    providerConfigured: false,
    paymentProvider: provider,
    errorMessage: `Provedor "${provider}" não reconhecido. Use mercadopago ou stripe.`,
  };
}

export function verifyWebhookSignature(providedSecret: string | undefined): boolean {
  const expectedSecret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
  if (!expectedSecret || !providedSecret) return false;
  if (expectedSecret.length !== providedSecret.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expectedSecret),
    Buffer.from(providedSecret)
  );
}
