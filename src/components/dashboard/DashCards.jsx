'use client';
import { useState, useEffect, useCallback } from 'react';
import Icons from '@/components/icons';
import { useDashCtx } from '@/lib/dash-context';
import { Card, CardTitle, Field, cardBrand, fmtCard, fmtExp } from './DashUI';
import { useGooglePay } from '@/lib/use-google-pay';
import { api } from '@/lib/api';

// ── Wallet row ────────────────────────────────────────────────────
function WalletRow({ logo, alt, bg, name, subtitle, connected, busy, onConnect, onDisconnect }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
      connected ? 'border-gold bg-gold/5' : 'border-navy/10'
    }`}>
      <div className={`w-14 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 overflow-hidden border border-navy/8`}>
        <img src={logo} alt={alt} className="w-11 h-auto object-contain" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-navy text-sm flex items-center gap-2">
          {name}
          {connected && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
              Connected
            </span>
          )}
        </div>
        <div className="text-xs text-navy/45">{subtitle}</div>
      </div>
      {connected ? (
        <button
          type="button"
          onClick={onDisconnect}
          className="text-xs border border-navy/12 text-navy/50 hover:text-red-500 hover:border-red-200 rounded-lg px-3 py-1.5 transition"
        >
          Disconnect
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          disabled={busy}
          className="text-xs border border-navy/12 text-navy/50 hover:text-navy rounded-lg px-3 py-1.5 transition disabled:opacity-50"
        >
          {busy ? 'Opening…' : 'Connect'}
        </button>
      )}
    </div>
  );
}

export default function DashCards() {
  const { notify } = useDashCtx();
  const [wallets, setWallets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [form, setForm]           = useState({ name: '', number: '', exp: '', cvc: '', zip: '' });
  const [gpayBusy, setGpayBusy]   = useState(false);
  const [walletErr, setWalletErr] = useState('');

  const { ready: gpayReady, requestPayment: gpayRequest } = useGooglePay();

  const reload = useCallback(() => {
    return api.wallet.list()
      .then(setWallets)
      .catch(() => setWallets([]));
  }, []);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  // Derive display state from the live wallet list
  const cards        = wallets.filter((w) => w.type === 'card');
  const googleWallet = wallets.find((w) => w.type === 'google_pay');
  const appleWallet  = wallets.find((w) => w.type === 'apple_pay');

  const setC      = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setNumber = (e) => setForm((s) => ({ ...s, number: fmtCard(e.target.value) }));
  const setExp    = (e) => setForm((s) => ({ ...s, exp: fmtExp(e.target.value) }));

  const addCard = async (e) => {
    e.preventDefault();
    const raw   = form.number.replace(/\s/g, '');
    const last4 = raw.slice(-4);
    const brand = cardBrand(raw) || 'Card';
    const parts = form.exp.split('/');
    const month = parseInt(parts[0]?.trim(), 10);
    const year  = 2000 + parseInt(parts[1]?.trim(), 10);
    try {
      await api.wallet.save({ type: 'card', last4, brand, cardholderName: form.name, expiryMonth: month, expiryYear: year });
      await reload();
      notify('Card added!');
      setAdding(false);
      setForm({ name: '', number: '', exp: '', cvc: '', zip: '' });
    } catch (err) {
      setWalletErr(err.message);
    }
  };

  const makePrimary = async (id) => {
    try {
      await api.wallet.setDefault(id);
      await reload();
      notify('Default payment updated.');
    } catch (err) {
      notify(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.wallet.remove(id);
      setWallets((s) => s.filter((w) => w.id !== id));
      notify('Payment method removed.');
    } catch (err) {
      notify(err.message);
    }
  };

  // ── Google Pay connect ─────────────────────────────────────────
  const connectGooglePay = async () => {
    if (!gpayReady) {
      setWalletErr('Google Pay is not available on this device or browser.');
      return;
    }
    setWalletErr('');
    setGpayBusy(true);
    try {
      const token = await gpayRequest({ amountCents: 0 });
      await api.wallet.save({ type: 'google_pay', stripePaymentMethodId: token });
      await reload();
      notify('Google Pay connected.');
    } catch (ex) {
      if (ex?.statusCode === 'CANCELED') { setGpayBusy(false); return; }
      setWalletErr(ex.message ?? 'Could not connect Google Pay.');
    } finally {
      setGpayBusy(false);
    }
  };

  const disconnectGooglePay = async () => {
    if (!googleWallet) return;
    try {
      await api.wallet.remove(googleWallet.id);
      setWallets((s) => s.filter((w) => w.id !== googleWallet.id));
      notify('Google Pay disconnected.');
    } catch (err) {
      notify(err.message);
    }
  };

  const connectApplePay = () => {
    notify('Apple Pay setup coming soon — requires Safari.');
  };

  const disconnectApplePay = async () => {
    if (!appleWallet) return;
    try {
      await api.wallet.remove(appleWallet.id);
      setWallets((s) => s.filter((w) => w.id !== appleWallet.id));
      notify('Apple Pay disconnected.');
    } catch (err) {
      notify(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-navy/40 text-sm">
        Loading payment methods…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-navy text-2xl">Payment Methods</h1>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition"
          type="button"
        >
          <Icons.Plus size={15} stroke={2.5} />
          Add card
        </button>
      </div>

      {/* Saved cards */}
      <Card>
        {cards.length === 0 ? (
          <div className="py-10 text-center">
            <Icons.CreditCard size={32} stroke={1.5} className="text-navy/20 mx-auto mb-3" />
            <div className="text-navy/50 text-sm">No payment methods saved</div>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((c) => (
              <div key={c.id} className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 ${c.isDefault ? 'border-gold bg-gold/5' : 'border-navy/10'}`}>
                <div className="relative w-14 h-9 rounded-lg bg-navy overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 hex-pattern opacity-30" />
                  <div className="absolute bottom-1.5 left-2 text-[9px] text-white font-bold">{c.brand}</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-navy text-sm">{c.brand} •••• {c.last4}</div>
                  <div className="text-xs text-navy/45">
                    Expires {c.expiryMonth?.toString().padStart(2, '0')} / {c.expiryYear?.toString().slice(-2)}
                  </div>
                  {c.isDefault && <span className="text-[10px] text-amber-700 font-semibold">Default</span>}
                </div>
                <div className="flex items-center gap-2">
                  {!c.isDefault && (
                    <button type="button" onClick={() => makePrimary(c.id)} className="text-xs border border-navy/12 text-navy/50 hover:text-navy rounded-lg px-2.5 py-1.5 transition">
                      Set default
                    </button>
                  )}
                  <button type="button" onClick={() => remove(c.id)} className="text-navy/30 hover:text-red-500 transition">
                    <Icons.X size={16} stroke={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Digital Wallets */}
      <Card>
        <CardTitle>Digital Wallets</CardTitle>
        <div className="space-y-3">
          {walletErr && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {walletErr}
            </div>
          )}

          <WalletRow
            logo="/applepay.png"
            alt="Apple Pay"
            bg="bg-black"
            name="Apple Pay"
            subtitle="Tap to pay with Face ID or Touch ID"
            connected={!!appleWallet}
            busy={false}
            onConnect={connectApplePay}
            onDisconnect={disconnectApplePay}
          />

          <WalletRow
            logo="/googlepay.png"
            alt="Google Pay"
            bg="bg-white"
            name="Google Pay"
            subtitle={gpayReady ? 'Pay with your Google account' : 'Not available on this browser'}
            connected={!!googleWallet}
            busy={gpayBusy}
            onConnect={connectGooglePay}
            onDisconnect={disconnectGooglePay}
          />
        </div>
      </Card>

      {/* Add card form */}
      {adding && (
        <Card>
          <CardTitle>Add New Card</CardTitle>
          <form onSubmit={addCard} className="space-y-4">
            <Field label="Name on card">
              <input type="text" placeholder="Jane Smith" value={form.name} onChange={setC('name')} required className="field" />
            </Field>
            <Field label="Card number">
              <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={form.number} onChange={setNumber} required maxLength={19} className="field font-mono" />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Expiry">
                <input type="text" inputMode="numeric" placeholder="MM / YY" value={form.exp} onChange={setExp} required maxLength={7} className="field" />
              </Field>
              <Field label="CVC">
                <input type="text" inputMode="numeric" placeholder="000" value={form.cvc} onChange={setC('cvc')} required maxLength={4} className="field" />
              </Field>
              <Field label="ZIP">
                <input type="text" inputMode="numeric" placeholder="47201" value={form.zip} onChange={setC('zip')} required maxLength={5} className="field" />
              </Field>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gold text-navy text-sm font-semibold hover:bg-gold-deep transition">Add card</button>
              <button type="button" onClick={() => setAdding(false)} className="px-5 py-2.5 rounded-xl border border-navy/15 text-navy/60 text-sm hover:bg-navy/5 transition">Cancel</button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
