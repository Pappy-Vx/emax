'use client';
import { useState, useEffect, useCallback } from 'react';

const ALLOWED_NETWORKS   = ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'];
const ALLOWED_AUTH       = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

/**
 * Loads the Google Pay JS SDK and gives you:
 *   ready          — true once isReadyToPay() returns true
 *   requestPayment — call with { amountCents } to open the Google Pay sheet
 *                    resolves with the payment token string (Stripe-compatible)
 *                    rejects with { statusCode: 'CANCELED' } if user closes the sheet
 */
export function useGooglePay() {
  const [ready, setReady]   = useState(false);
  const [client, setClient] = useState(null);

  const isLive = process.env.STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live');
  const environment = isLive ? 'PRODUCTION' : 'TEST';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function init() {
      const c = new window.google.payments.api.PaymentsClient({ environment });
      setClient(c);
      c.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedAuthMethods: ALLOWED_AUTH, allowedCardNetworks: ALLOWED_NETWORKS } }],
      })
        .then((r) => setReady(!!r.result))
        .catch(() => setReady(false));
    }

    if (window.google?.payments?.api?.PaymentsClient) {
      init();
      return;
    }

    const s = document.createElement('script');
    s.src  = 'https://pay.google.com/gp/p/js/pay.js';
    s.async = true;
    s.onload  = init;
    s.onerror = () => console.warn('[GooglePay] Failed to load SDK');
    document.head.appendChild(s);
  }, [environment]);

  const requestPayment = useCallback(
    async ({ amountCents }) => {
      if (!client) throw new Error('Google Pay not ready');

      const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error(
          'STRIPE_PUBLISHABLE_KEY is not set. ' +
          'Add your Stripe test key (pk_test_...) to .env.local and restart the dev server.',
        );
      }

      // merchantId is required even in TEST; use the env var in production.
      const merchantId =
        environment === 'PRODUCTION'
          ? process.env.GOOGLE_PAY_MERCHANT_ID
          : 'TEST';

      const paymentDataRequest = {
        apiVersion:      2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods:  ALLOWED_AUTH,
              allowedCardNetworks: ALLOWED_NETWORKS,
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway:                 'stripe',
                'stripe:version':        '2023-10-16',
                'stripe:publishableKey': stripeKey,
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice:       (amountCents / 100).toFixed(2),
          currencyCode:     'USD',
          countryCode:      'US',
        },
        merchantInfo: {
          merchantName: 'eMax Errands & More',
          merchantId,
          // For PRODUCTION register your merchant ID at pay.google.com/business/console
          // and set GOOGLE_PAY_MERCHANT_ID in Vercel env vars.
        },
      };

      const paymentData = await client.loadPaymentData(paymentDataRequest);
      // Returns the Stripe-compatible payment token
      return paymentData.paymentMethodData.tokenizationData.token;
    },
    [client],
  );

  return { ready, requestPayment };
}
