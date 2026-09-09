'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import {
  Store, ShieldCheck, Package, TrendingUp, Clock, Wallet,
  Upload, CheckCircle2, AlertCircle, Plus, Edit2, Trash2,
  ChevronRight, Phone, Mail, MapPin, Star, ArrowUpRight,
  Banknote, LayoutDashboard, X, MessageCircle
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data';
import { PAKISTAN_CITIES } from '@/lib/geo';
import Link from 'next/link';

// ── KYC Onboarding Form ─────────────────────
function KycForm({ vendorId }: { vendorId: string }) {
  const { submitKyc, addToast } = useMarketplaceStore();
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [bankIban, setBankIban] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bWA, setBWA] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [province, setProvince] = useState('Sindh');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKyc({
      vendorId,
      storeName,
      ownerName,
      cnicNumber,
      cnicFrontUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      cnicBackUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      bankIban,
      bankName,
      accountTitle,
      businessWhatsApp: bWA,
      businessEmail: bEmail,
      city,
      province,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-black text-slate-800">KYC جمع ہو گئی! ✓</h3>
        <p className="text-sm text-slate-500 mt-2">Admin 24-48 گھنٹے میں review کرے گا۔ آپ کو WhatsApp پر جواب ملے گا۔</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Business Info', 'CNIC Docs', 'Bank Details'].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-orange-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center border-2 ${
                i + 1 < step ? 'bg-orange-500 border-orange-500 text-white'
                : i + 1 === step ? 'border-orange-500 text-orange-600'
                : 'border-slate-200 text-slate-400'
              }`}>{i + 1 < step ? '✓' : i + 1}</div>
              <span className="text-xs font-semibold hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-orange-400' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 text-lg">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Store / Business Name *</label>
                <input required value={storeName} onChange={e => setStoreName(e.target.value)}
                  className="input-field" placeholder="My Awesome Store" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Owner Full Name *</label>
                <input required value={ownerName} onChange={e => setOwnerName(e.target.value)}
                  className="input-field" placeholder="Muhammad Asad" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-green-500" /> Business WhatsApp *
                </label>
                <input required type="tel" value={bWA} onChange={e => setBWA(e.target.value)}
                  className="input-field" placeholder="03XX-XXXXXXX" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Business Email *</label>
                <input required type="email" value={bEmail} onChange={e => setBEmail(e.target.value)}
                  className="input-field" placeholder="store@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City *</label>
                <select required value={city} onChange={e => setCity(e.target.value)} className="input-field">
                  {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Province *</label>
                <select required value={province} onChange={e => setProvince(e.target.value)} className="input-field">
                  {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'ICT', 'AJK', 'GB'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="button" onClick={() => setStep(2)} disabled={!storeName || !ownerName || !bWA || !bEmail}
              className="btn-primary w-full py-3 disabled:opacity-50">
              اگلا مرحلہ — CNIC Documents →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 text-lg">CNIC Verification</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">CNIC Number *</label>
              <input required value={cnicNumber} onChange={e => setCnicNumber(e.target.value)}
                className="input-field font-mono" placeholder="XXXXX-XXXXXXX-X" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">CNIC Front *</label>
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
                  <Upload className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <span className="text-xs text-orange-600 font-semibold">Front side upload</span>
                  <p className="text-[10px] text-slate-400 mt-1">JPG / PNG max 5MB</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">CNIC Back *</label>
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
                  <Upload className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <span className="text-xs text-orange-600 font-semibold">Back side upload</span>
                  <p className="text-[10px] text-slate-400 mt-1">JPG / PNG max 5MB</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-700">
              🔒 آپ کی CNIC معلومات محفوظ ہیں اور صرف admin verification کے لیے استعمال ہوتی ہے
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-orange-200 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-50">← واپس</button>
              <button type="button" onClick={() => setStep(3)} disabled={!cnicNumber}
                className="btn-primary flex-1 py-3 disabled:opacity-50">Bank Details →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-800 text-lg">Bank Account Details</h3>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              💰 Payouts اسی account میں جائیں گے — 7-day escrow کے بعد
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">IBAN Number *</label>
              <input required value={bankIban} onChange={e => setBankIban(e.target.value)}
                className="input-field font-mono" placeholder="PK36SCBL0000001123456702" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank Name *</label>
                <select required value={bankName} onChange={e => setBankName(e.target.value)} className="input-field">
                  <option value="">Select...</option>
                  {['HBL', 'MCB', 'UBL', 'Meezan Bank', 'Bank Al-Habib', 'Standard Chartered', 'NBP', 'Faysal Bank', 'Askari Bank', 'Allied Bank', 'JS Bank', 'Silk Bank', 'Soneri Bank'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Account Title *</label>
                <input required value={accountTitle} onChange={e => setAccountTitle(e.target.value)}
                  className="input-field" placeholder="Muhammad Asad" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-orange-200 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-50">← واپس</button>
              <button type="submit" disabled={!bankIban || !bankName || !accountTitle}
                className="btn-primary flex-1 py-3 disabled:opacity-50 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> KYC جمع کریں
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ── Add Product Modal ───────────────────────
function AddProductModal({ vendorId, vendorName, vendorCity, onClose }: {
  vendorId: string; vendorName: string; vendorCity: string; onClose: () => void;
}) {
  const { addProduct } = useMarketplaceStore();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [origPrice, setOrigPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('cat_electronics');
  const [deliveryType, setDeliveryType] = useState<'STANDARD' | 'HYPER_LOCAL'>('STANDARD');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      vendorId, vendorName, vendorSlug: vendorId,
      vendorLogo: '', vendorCity,
      categoryId,
      categoryName: INITIAL_CATEGORIES.find(c => c.id === categoryId)?.name || '',
      title, slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      description,
      price: Number(price),
      originalPrice: origPrice ? Number(origPrice) : undefined,
      stock: Number(stock),
      images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
      isActive: true,
      tags: [],
      deliveryType,
      sameDay: deliveryType === 'HYPER_LOCAL',
      courierPartner: deliveryType === 'STANDARD' ? 'TCS' : 'RIDER',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-orange-100"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
          <h3 className="font-black text-white">نیا Product شامل کریں</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Product Title *</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="Product ka naam" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="input-field h-20 resize-none" placeholder="Product ki details..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Price (₨) *</label>
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" placeholder="5000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Original ₨</label>
              <input type="number" value={origPrice} onChange={e => setOrigPrice(e.target.value)} className="input-field" placeholder="6000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Stock *</label>
              <input required type="number" value={stock} onChange={e => setStock(e.target.value)} className="input-field" placeholder="50" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category *</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-field">
              {INITIAL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Delivery Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: 'STANDARD', label: '📦 Standard Courier', desc: 'TCS / Leopard / Trax' },
                { v: 'HYPER_LOCAL', label: '⚡ Hyper-Local', desc: 'Same-day local delivery' },
              ].map(opt => (
                <label key={opt.v}
                  className={`payment-card cursor-pointer ${deliveryType === opt.v ? 'selected' : ''}`}>
                  <input type="radio" value={opt.v} checked={deliveryType === opt.v as any}
                    onChange={() => setDeliveryType(opt.v as any)} className="accent-orange-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Product شامل کریں
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Vendor Page ──────────────────────────
export default function VendorPage() {
  const { currentUser, isAuthenticated, vendors, products, orders, escrowTransactions, openAuthModal } = useMarketplaceStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'kyc' | 'payouts'>('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // ── Not logged in ──
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Store className="w-16 h-16 text-orange-300 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-900">Vendor Portal</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">Vendor dashboard access کے لیے login کریں</p>
        <button onClick={() => openAuthModal('login')} className="btn-primary px-6 py-3">Login کریں</button>
      </div>
    );
  }

  // ── Admin should use /admin portal, not vendor portal ──
  if (currentUser.role === 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-orange-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Admin Account</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Admin کے لیے Vendor portal نہیں ہے۔<br />
          براہ کرم Admin Console استعمال کریں۔
        </p>
        <Link href="/admin" className="btn-primary px-6 py-3 inline-block">
          Admin Console کھولیں →
        </Link>
      </div>
    );
  }

  // ── Find THIS seller's own vendor profile (no other seller's data) ──
  // currentUser.vendorProfileId links user to vendor profile
  const vendorProfile = vendors.find(v => v.userId === currentUser.id);

  // ── Customer: show KYC signup ──
  if (currentUser.role === 'CUSTOMER') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Kharidari.pk پر Sell کریں</h1>
          <p className="text-sm text-slate-500 mt-2">KYC complete کریں اور پورے Pakistan میں بیچیں</p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <KycForm vendorId={currentUser.id} />
        </div>
      </div>
    );
  }

  // ── VENDOR DASHBOARD — strictly filtered to THIS vendor only ──
  // All data is filtered by vendorProfile.id — other sellers' data is NEVER shown
  const myVendorId = vendorProfile?.id;
  const myProducts = products.filter(p => p.vendorId === myVendorId);
  const myOrders = orders.filter(o => o.subOrders.some(s => s.vendorId === myVendorId));
  const myEscrow = escrowTransactions.filter(e => e.vendorId === myVendorId);
  const pendingEscrow = myEscrow.filter(e => e.status === 'HELD').reduce((s, e) => s + e.amount, 0);
  const eligiblePayout = myEscrow.filter(e => e.status === 'ELIGIBLE').reduce((s, e) => s + e.amount, 0);
  // My own sales total only
  const myTotalSales = myOrders.flatMap(o => o.subOrders.filter(s => s.vendorId === myVendorId)).reduce((sum, sub) => sum + sub.subtotal, 0);

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: `Products (${myProducts.length})`, icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: `Orders (${myOrders.length})`, icon: <Store className="w-4 h-4" /> },
    { id: 'payouts', label: 'Payouts', icon: <Wallet className="w-4 h-4" /> },
    { id: 'kyc', label: 'KYC Status', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {vendorProfile?.logo && (
            <img src={vendorProfile.logo} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{vendorProfile?.storeName || 'My Store'}</h1>
              {vendorProfile?.isApproved && (
                <span title="KYC Approved">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3 h-3" /> {vendorProfile?.city}
              <span>•</span>
              <Star className="w-3 h-3 text-amber-400" /> {vendorProfile?.rating}
              <span>•</span>
              <span>Commission: {vendorProfile?.commissionRate}%</span>
            </div>
          </div>
        </div>
        <div className={vendorProfile?.isApproved ? 'kyc-approved' : 'kyc-pending'}>
          {vendorProfile?.isApproved ? '✓ Approved' : '⏳ Pending Review'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-orange-100 mb-6 overflow-x-auto pb-0 scrollbar-none">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KYC Alert */}
          {!vendorProfile?.isApproved && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">KYC Pending — Products visible نہیں ہیں</p>
                <p className="text-xs text-amber-600">Admin approval کے بعد آپ کی listings public ہوں گی</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sales', value: formatPKR(myTotalSales || vendorProfile?.totalSales || 0), icon: <TrendingUp className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
              { label: 'Escrow (Held)', value: formatPKR(pendingEscrow), icon: <Clock className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50' },
              { label: 'Eligible Payout', value: formatPKR(eligiblePayout), icon: <Banknote className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
              { label: 'Total Withdrawn', value: formatPKR(vendorProfile?.totalWithdrawn || 0), icon: <Wallet className="w-5 h-5 text-sky-500" />, bg: 'bg-sky-50' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  {stat.icon}
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Commission Explainer */}
          <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-orange-500" /> Commission Structure
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1 p-3 bg-orange-50 rounded-xl text-center">
                <p className="text-xl font-black text-orange-600">{vendorProfile?.commissionRate || 10}%</p>
                <p className="text-xs text-slate-500">Platform Commission</p>
              </div>
              <span className="text-2xl text-slate-300">+</span>
              <div className="flex-1 p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-xl font-black text-emerald-600">{100 - (vendorProfile?.commissionRate || 10)}%</p>
                <p className="text-xs text-slate-500">آپ کا حصہ (Payout)</p>
              </div>
              <span className="text-2xl text-slate-300">=</span>
              <div className="flex-1 p-3 bg-sky-50 rounded-xl text-center">
                <p className="text-xs font-black text-sky-600">7 Days</p>
                <p className="text-xs text-slate-500">Escrow Window</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-800">میری Products</h2>
            <button onClick={() => setShowAddProduct(true)}
              className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Product شامل کریں
            </button>
          </div>
          {myProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">کوئی product نہیں ملا</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {myProducts.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
                  <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-orange-600 font-black text-sm">{formatPKR(p.price)}</span>
                      {p.originalPrice && <span className="text-xs text-slate-400 line-through">{formatPKR(p.originalPrice)}</span>}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {p.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Stock: {p.stock} • {p.deliveryType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">آرڈرز</h2>
          {myOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Store className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">ابھی کوئی آرڈر نہیں</p>
            </div>
          ) : (
            myOrders.map(order => {
              const mySubOrders = order.subOrders.filter(s => s.vendorId === vendorProfile?.id);
              return mySubOrders.map(sub => (
                <div key={sub.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-black text-slate-800">#{sub.id}</span>
                      <span className="text-xs text-slate-400 ml-2">{new Date(sub.createdAt).toLocaleDateString('ur-PK')}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      sub.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700'
                      : sub.status === 'DISPATCHED' || sub.status === 'OUT_FOR_DELIVERY' ? 'bg-sky-100 text-sky-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>{sub.status}</span>
                  </div>
                  {sub.items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-slate-600 py-1 border-t border-slate-50">
                      <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="flex-1 truncate">{item.quantity}x {item.product.title}</span>
                      <span className="font-bold">{formatPKR(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500">Payout: </span>
                      <span className="font-black text-emerald-600">{formatPKR(sub.payoutAmount)}</span>
                      <span className="text-slate-400 ml-1">(Commission: {formatPKR(sub.commissionAmount)} deducted)</span>
                    </div>
                    {sub.payoutEligible && (
                      <span className="badge-green">Payout Ready</span>
                    )}
                  </div>
                </div>
              ));
            })
          )}
        </div>
      )}

      {/* ── PAYOUTS TAB ── */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">Escrow & Payouts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Held (7-day window)', value: formatPKR(pendingEscrow), color: 'bg-amber-50 border-amber-200', badge: 'escrow-held' },
              { label: 'Eligible for Withdrawal', value: formatPKR(eligiblePayout), color: 'bg-emerald-50 border-emerald-200', badge: 'escrow-eligible' },
              { label: 'Total Withdrawn', value: formatPKR(vendorProfile?.totalWithdrawn || 0), color: 'bg-sky-50 border-sky-200', badge: 'escrow-released' },
            ].map(item => (
              <div key={item.label} className={`p-5 rounded-2xl border ${item.color}`}>
                <p className="text-xl font-black text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          {eligiblePayout > 0 && (
            <button className="btn-primary px-6 py-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Payout Request کریں ({formatPKR(eligiblePayout)})
            </button>
          )}
          <div className="space-y-3">
            {myEscrow.map(e => (
              <div key={e.id} className={`flex items-center justify-between p-4 rounded-2xl border text-sm ${
                e.status === 'HELD' ? 'escrow-held' : e.status === 'ELIGIBLE' ? 'escrow-eligible' : 'escrow-released'
              }`}>
                <div>
                  <span className="font-bold">#{e.orderId}</span>
                  <span className="text-xs ml-2">Eligible: {new Date(e.eligibleAfter).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="font-black">{formatPKR(e.amount)}</span>
                  <span className={`block text-[10px] font-bold ${e.status === 'HELD' ? 'text-amber-700' : e.status === 'ELIGIBLE' ? 'text-emerald-700' : 'text-sky-700'}`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KYC TAB ── */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">KYC Status</h2>
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
            vendorProfile?.kycStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-200'
            : vendorProfile?.kycStatus === 'REJECTED' ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
          }`}>
            {vendorProfile?.kycStatus === 'APPROVED' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              : vendorProfile?.kycStatus === 'REJECTED' ? <AlertCircle className="w-6 h-6 text-red-500" />
              : <Clock className="w-6 h-6 text-amber-500" />}
            <div>
              <p className="font-bold text-slate-800">
                {vendorProfile?.kycStatus === 'APPROVED' ? 'KYC Approved — آپ کا store active ہے'
                : vendorProfile?.kycStatus === 'REJECTED' ? 'KYC Rejected — دوبارہ submit کریں'
                : 'KYC Review میں ہے — 24-48 گھنٹے انتظار کریں'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">CNIC: {vendorProfile?.cnicNumber || 'Pending'} • Bank: {vendorProfile?.bankName || 'Pending'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && vendorProfile && (
        <AddProductModal
          vendorId={vendorProfile.id}
          vendorName={vendorProfile.storeName}
          vendorCity={vendorProfile.city}
          onClose={() => setShowAddProduct(false)}
        />
      )}
    </div>
  );
}
