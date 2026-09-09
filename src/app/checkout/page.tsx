'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '@/lib/geo';
import {
  ArrowLeft, ShieldCheck, Store, Truck, Lock, CheckCircle2,
  MessageCircle, Smartphone, CreditCard, Banknote, ChevronRight,
  MapPin, Phone, User, Home, Package
} from 'lucide-react';
import { PaymentMethod, ShippingAddress } from '@/types';

// Payment method options
const PAYMENT_OPTIONS = [
  {
    id: 'COD' as PaymentMethod,
    label: 'Cash on Delivery',
    desc: 'گھر پر delivery کے وقت نقد ادائیگی',
    icon: <Banknote className="w-5 h-5 text-emerald-600" />,
    badge: 'سب سے مقبول',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'JAZZCASH' as PaymentMethod,
    label: 'JazzCash',
    desc: 'Mobile account سے فوری ادائیگی',
    icon: <Smartphone className="w-5 h-5 text-red-600" />,
    badge: null,
    badgeColor: '',
  },
  {
    id: 'EASYPAISA' as PaymentMethod,
    label: 'Easypaisa',
    desc: 'Telenor mobile wallet',
    icon: <Smartphone className="w-5 h-5 text-green-600" />,
    badge: null,
    badgeColor: '',
  },
  {
    id: 'SADAPAY' as PaymentMethod,
    label: 'SadaPay',
    desc: 'Digital bank instant transfer',
    icon: <CreditCard className="w-5 h-5 text-purple-600" />,
    badge: 'No Card Fee',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'BANK_CARD' as PaymentMethod,
    label: 'Bank Card / 1Link',
    desc: 'Visa, MasterCard, 1Link',
    icon: <CreditCard className="w-5 h-5 text-sky-600" />,
    badge: null,
    badgeColor: '',
  },
];

const STEP_LABELS = ['Shipping', 'Payment', 'Review', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, getDeliveryFee, createOrder, currentUser, isAuthenticated, openAuthModal } = useMarketplaceStore();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  // Shipping fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [jazzCashPhone, setJazzCashPhone] = useState('');
  const [mpin, setMpin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const total = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = total + deliveryFee;

  // Group by vendor
  const vendorGroups = new Map<string, typeof cart>();
  cart.forEach((item) => {
    const vId = item.product.vendorId || 'general';
    const existing = vendorGroups.get(vId) || [];
    existing.push(item);
    vendorGroups.set(vId, existing);
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Login ضروری ہے</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Checkout کے لیے پہلے login کریں یا نیا account بنائیں
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => openAuthModal('login')}
            className="btn-primary px-6 py-3">Login کریں</button>
          <button onClick={() => openAuthModal('signup')}
            className="btn-sky px-6 py-3">Register کریں</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-black text-slate-900">Cart خالی ہے</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">پہلے products cart میں ڈالیں</p>
        <Link href="/products" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
          Shopping کریں <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Order Success
  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-float">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">آرڈر مکمل! 🎉</h2>
        <p className="text-sm text-slate-600 mt-2 mb-1">
          Order ID: <strong className="text-orange-600">#{orderPlaced}</strong>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-sm text-green-600 font-semibold mb-6">
          <MessageCircle className="w-4 h-4" />
          WhatsApp تصدیق {currentUser?.phone} پر بھیجی گئی
        </div>
        <p className="text-xs text-slate-500 mb-8">
          آپ کا آرڈر vendors کو بھیج دیا گیا ہے۔ 7 دن کا dispute window active ہے۔
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/orders" className="btn-primary px-6 py-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Order Track کریں
          </Link>
          <Link href="/products" className="btn-sky px-5 py-3">
            مزید خریدیں
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const address: ShippingAddress = { fullName, phone, whatsapp: phone, houseNo, street, area, city, province, postalCode };
    const order = createOrder(address, paymentMethod);
    setIsProcessing(false);
    if (order) setOrderPlaced(order.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-600 mb-5">
        <ArrowLeft className="w-3.5 h-3.5" /> Shopping جاری رکھیں
      </Link>

      <h1 className="text-2xl font-black text-slate-900 mb-1">🛒 Secure Checkout</h1>
      <p className="text-xs text-slate-500 mb-6">
        {vendorGroups.size} vendor(s) — payment ایک بار، delivery الگ الگ
      </p>

      {/* Step Indicator */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 shrink-0 ${i + 1 <= step ? 'text-orange-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                i + 1 < step ? 'bg-orange-500 border-orange-500 text-white'
                : i + 1 === step ? 'border-orange-500 text-orange-600'
                : 'border-slate-200 text-slate-400'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 min-w-6 ${i + 1 < step ? 'bg-orange-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT: Form Steps ─────────────────── */}
        <div className="lg:col-span-7 space-y-5">

          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-orange-100">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="font-bold text-slate-800">Delivery Address</h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><User className="w-3 h-3" /> Full Name *</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Muhammad Ali" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp / Phone *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={`input-field ${phone.length > 0 && !/^[0-9+\s-]+$/.test(phone) ? '!border-red-500 !border-2 !text-red-500 !bg-red-50 focus:!border-red-500 focus:!ring-red-500' : ''}`} placeholder="03XX-XXXXXXX" />
                  {phone.length > 0 && !/^[0-9+\s-]+$/.test(phone) ? (
                    <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">❌ برائے مہربانی صرف نمبرز لکھیں (Alphabets منع ہیں)</p>
                  ) : (
                    <p className="text-[10px] text-slate-400">Order updates اس نمبر پر WhatsApp کیے جائیں گے</p>
                  )}
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Home className="w-3 h-3" /> House / Flat # *</label>
                  <input type="text" required value={houseNo} onChange={(e) => setHouseNo(e.target.value)} className="input-field" placeholder="House 45, Block D" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Street / Mohalla *</label>
                  <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="input-field" placeholder="Gulberg III, Main Boulevard" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Area / Sector</label>
                  <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="input-field" placeholder="DHA Phase 5" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City *</label>
                  <select required value={city} onChange={(e) => setCity(e.target.value)} className="input-field">
                    {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Province *</label>
                  <select required value={province} onChange={(e) => setProvince(e.target.value)} className="input-field">
                    {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Postal Code</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input-field" placeholder="54000" />
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => setStep(2)}
                  disabled={!fullName || !phone || !/^[0-9+\s-]+$/.test(phone) || !houseNo || !street}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Payment Method منتخب کریں <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-orange-100">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                </div>
                <h2 className="font-bold text-slate-800">Payment Method</h2>
                <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <Lock className="w-3 h-3" /> Secure & Encrypted
                </span>
              </div>
              <div className="p-5 space-y-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`payment-card cursor-pointer ${paymentMethod === option.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id)}
                      className="accent-orange-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{option.label}</span>
                          {option.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${option.badgeColor}`}>
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{option.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}

                {/* JazzCash Fields */}
                {paymentMethod === 'JAZZCASH' && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">JazzCash Number</label>
                      <input type="tel" value={jazzCashPhone} onChange={(e) => setJazzCashPhone(e.target.value)}
                        className="input-field" placeholder="03XX-XXXXXXX" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">MPIN (4-digit)</label>
                      <input type="password" maxLength={4} value={mpin} onChange={(e) => setMpin(e.target.value)}
                        className="input-field" placeholder="••••" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'EASYPAISA' && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Easypaisa Number</label>
                      <input type="tel" value={jazzCashPhone} onChange={(e) => setJazzCashPhone(e.target.value)}
                        className="input-field" placeholder="03XX-XXXXXXX" />
                    </div>
                    <p className="text-xs text-green-700">OTP آپ کے Easypaisa number پر آئے گا</p>
                  </div>
                )}

                {paymentMethod === 'BANK_CARD' && (
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Card Number</label>
                      <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field font-mono" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Expiry</label>
                        <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                          className="input-field font-mono" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">CVV</label>
                        <input type="password" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)}
                          className="input-field font-mono" placeholder="•••" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 pt-0 flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3 text-sm font-semibold border-2 border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50">
                  ← واپس
                </button>
                <button onClick={() => setStep(3)}
                  className="btn-primary flex-2 flex-1 py-3 flex items-center justify-center gap-2">
                  Order دیکھیں <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-orange-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="font-bold text-slate-800">Order Review کریں</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Shipping Summary */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-500" /> Delivery Address
                  </p>
                  <p className="text-slate-600">{fullName} • {phone}</p>
                  <p className="text-slate-600">{houseNo}, {street}, {area && area + ','} {city}, {province}</p>
                </div>

                {/* Payment Summary */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-slate-700">Payment:</span>
                  <span className="text-slate-600">{PAYMENT_OPTIONS.find(p => p.id === paymentMethod)?.label}</span>
                </div>

                {/* Vendor Sub-orders */}
                <div className="space-y-3">
                  {Array.from(vendorGroups.entries()).map(([vendorId, items], idx) => {
                    const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0);
                    const commission = (subtotal * 10) / 100;
                    return (
                      <div key={vendorId} className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-orange-500" />
                            Sub-Order {idx + 1}: {items[0].product.vendorName}
                          </span>
                          <span className="font-bold text-orange-600">{formatPKR(subtotal)}</span>
                        </div>
                        {items.map((it) => (
                          <div key={it.product.id} className="flex items-center gap-2 text-xs text-slate-500">
                            <img src={it.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="flex-1 truncate">{it.quantity}x {it.product.title}</span>
                            <span>{formatPKR(it.product.price * it.quantity)}</span>
                          </div>
                        ))}
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          7-day escrow hold • Commission: {formatPKR(commission)} (10%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-3 text-sm font-semibold border-2 border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50">
                  ← واپس
                </button>
                <button onClick={handlePlaceOrder} disabled={isProcessing}
                  className="btn-primary flex-2 flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                  {isProcessing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> آرڈر Confirm کریں</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Order Summary ──────────────── */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm sticky top-28 overflow-hidden">
            <div className="p-4 border-b border-orange-100" style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)' }}>
              <h3 className="font-bold text-slate-800">Order Summary</h3>
              <p className="text-xs text-slate-500">{cart.reduce((s, i) => s + i.quantity, 0)} items • {vendorGroups.size} vendor(s)</p>
            </div>
            <div className="p-4 space-y-3">
              {/* Cart items */}
              {cart.slice(0, 3).map((item) => (
                <div key={item.product.id} className="flex items-center gap-2.5">
                  <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{item.product.title}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity}x {formatPKR(item.product.price)}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{formatPKR(item.product.price * item.quantity)}</span>
                </div>
              ))}
              {cart.length > 3 && (
                <p className="text-xs text-slate-400 text-center">+ {cart.length - 3} مزید items</p>
              )}

              {/* Totals */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span className="font-semibold">{formatPKR(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0
                    ? <span className="font-semibold text-emerald-600">FREE 🎉</span>
                    : <span className="font-semibold">{formatPKR(deliveryFee)}</span>
                  }
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-orange-100">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-2 space-y-1.5">
                {[
                  { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />, text: '7-day return guarantee' },
                  { icon: <Truck className="w-3.5 h-3.5 text-sky-500" />, text: 'TCS / Leopard / Trax delivery' },
                  { icon: <MessageCircle className="w-3.5 h-3.5 text-green-500" />, text: 'WhatsApp updates' },
                ].map((g) => (
                  <div key={g.text} className="flex items-center gap-2 text-[10px] text-slate-500">
                    {g.icon} {g.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
