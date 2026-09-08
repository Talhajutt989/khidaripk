'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMarketplaceStore } from '@/lib/store';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_VENDORS, formatPKR, getFlashSaleEnd } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import {
  ArrowRight, MapPin, Shield, Star, ChevronRight,
  Zap, TrendingUp, Store, Clock, Package, Truck, CheckCircle2
} from 'lucide-react';

// ─── Flash Sale Timer ─────────────────────────
function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calcTime() {
      const end = getFlashSaleEnd();
      const diff = Math.max(0, end.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {[
        { val: timeLeft.h, label: 'گھنٹے' },
        { val: timeLeft.m, label: 'منٹ' },
        { val: timeLeft.s, label: 'سیکنڈ' },
      ].map((t, i) => (
        <React.Fragment key={t.label}>
          {i > 0 && <span className="text-white/60 font-black text-lg">:</span>}
          <div className="timer-block">
            <span>{String(t.val).padStart(2, '0')}</span>
            <span className="timer-label">{t.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Hero Slides ──────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    tag: '🔥 Mega Sale — آج کا بہترین موقع',
    title: 'پاکستان کا سب سے بڑا',
    highlight: 'آن لائن بازار',
    subtitle: 'Lahore, Karachi, Islamabad — ہر شہر میں تیز ترین delivery',
    cta: 'ابھی خریدیں',
    ctaHref: '/products',
    bg: 'from-orange-600 via-orange-500 to-amber-400',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: '✅ KYC Verified Sellers',
    title: 'Verified Sellers سے',
    highlight: 'محفوظ خریداری',
    subtitle: 'CNIC verified vendors, 7-day return guarantee, escrow protected payments',
    cta: 'Stores دیکھیں',
    ctaHref: '/stores',
    bg: 'from-sky-600 via-sky-500 to-blue-400',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    tag: '🚀 Seller بنیں',
    title: 'اپنا Online Store',
    highlight: 'آج شروع کریں',
    subtitle: 'KYC complete کریں، products list کریں، اور کمانا شروع کریں',
    cta: 'Seller بنیں',
    ctaHref: '/vendor',
    bg: 'from-emerald-600 via-emerald-500 to-teal-400',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
  },
];

export default function HomePage() {
  const { currentCity, vendors } = useMarketplaceStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCat, setActiveCat] = useState('all');

  // Auto-advance hero
  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const approvedVendors = INITIAL_VENDORS.filter((v) => v.isApproved);
  const slide = HERO_SLIDES[activeSlide];

  const filteredProducts = activeCat === 'all'
    ? INITIAL_PRODUCTS.slice(0, 8)
    : INITIAL_PRODUCTS.filter((p) => p.categoryId === activeCat).slice(0, 8);

  const localProducts = INITIAL_PRODUCTS.filter(
    (p) => p.vendorCity.toLowerCase() === currentCity.toLowerCase()
  );
  const flashProducts = INITIAL_PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  const PLATFORM_STATS = [
    { value: '500+', label: 'Verified Sellers', icon: '🏪' },
    { value: '50,000+', label: 'Products', icon: '📦' },
    { value: '1 Lakh+', label: 'Happy Customers', icon: '😊' },
    { value: '4.8★', label: 'Average Rating', icon: '⭐' },
  ];

  return (
    <div className="space-y-0">

      {/* ── Hero Section ────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-r ${slide.bg} transition-all duration-700`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  {slide.tag}
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  {slide.title}{' '}
                  <span className="text-yellow-200">{slide.highlight}</span>
                </h1>

                <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md">
                  {slide.subtitle}
                </p>

                {/* Location Badge */}
                <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 w-fit">
                  <MapPin className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">{currentCity} میں delivery available</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={slide.ctaHref}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-black text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/stores"
                    className="px-5 py-3 border-2 border-white/50 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors">
                    Stores دیکھیں
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-3 -left-3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">KYC Verified</span>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-bold text-slate-700">7-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 mt-8">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Stats ───────────────────────── */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-black text-orange-400">{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Sale ───────────────────────────── */}
      {flashProducts.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Flash Sale Header */}
            <div className="flex items-center justify-between mb-5 p-4 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-lg font-black">⚡ Flash Sale</h2>
                  <p className="text-orange-100 text-xs">آج کے خاص offers — محدود وقت!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FlashSaleTimer />
                <Link href="/products" className="hidden sm:flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                  سب دیکھیں <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Flash Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flashProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content: Sidebar + Products ───── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">

            {/* Left Category Sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-32 bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-orange-100"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                  <h3 className="text-xs font-black text-white flex items-center gap-2">
                    <span>📂</span> تمام Categories
                  </h3>
                </div>
                <div className="py-2">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cat.icon}</span>
                        <div>
                          <span className="font-medium">{cat.name}</span>
                          {cat.deliveryType === 'HYPER_LOCAL' && (
                            <div className="text-[9px] text-emerald-600 font-bold">📍 Local</div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Products Area */}
            <div className="flex-1 min-w-0">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Trending Products</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">مقبول مصنوعات</h2>
                </div>
                <Link href="/products" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1">
                  سب دیکھیں <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setActiveCat('all')}
                  className={`cat-pill ${activeCat === 'all' ? 'active' : ''} shrink-0`}
                >
                  🛍 سب
                </button>
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`cat-pill ${activeCat === cat.id ? 'active' : ''} shrink-0`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/products"
                  className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                  <span>تمام Products دیکھیں</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Geo-Local Products ───────────────────── */}
      {localProducts.length > 0 && (
        <section className="py-10 bg-gradient-to-br from-orange-50 to-sky-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">آپ کے قریب</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {currentCity} کی مصنوعات 📍
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">آپ کے شہر کے vendors سے — faster delivery, local support</p>
              </div>
              <Link href={`/products?city=${currentCity}`}
                className="btn-outline-orange text-xs flex items-center gap-1">
                سب دیکھیں <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {localProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Verified Vendors ─────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Verified Sellers</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">ہمارے Top Vendors 🏆</h2>
            <p className="text-sm text-slate-500 mt-2">
              CNIC verified, bank verified، اور admin approved sellers — آپ کی خریداری 100% محفوظ ہے
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedVendors.slice(0, 3).map((vendor) => (
              <div key={vendor.id}
                className="rounded-2xl border border-orange-100 bg-white overflow-hidden shadow-sm card-hover">
                {/* Banner */}
                <div className="relative h-28 bg-slate-200 overflow-hidden">
                  <img src={vendor.banner} alt={vendor.storeName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="p-4 -mt-6 relative">
                  {/* Logo + Rating */}
                  <div className="flex items-end justify-between mb-3">
                    <img src={vendor.logo} alt={vendor.storeName}
                      className="w-14 h-14 rounded-2xl border-4 border-white object-cover shadow-md bg-white" />
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-full text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {vendor.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-black text-slate-900">{vendor.storeName}</h3>
                    <span title="KYC Verified">
                      <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                    <MapPin className="w-3 h-3" /> {vendor.city}, {vendor.province}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{vendor.bio}</p>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-slate-400">Total Sales: </span>
                      <span className="font-bold text-emerald-600">{formatPKR(vendor.totalSales)}</span>
                    </div>
                    <Link href={`/stores/${vendor.slug}`}
                      className="font-bold text-orange-500 hover:underline flex items-center gap-1">
                      Visit Store <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Kharidari.pk ─────────────────────── */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black">Kharidari.pk کیوں؟</h2>
            <p className="text-slate-400 text-sm mt-1">Pakistan ka sabse trusted multi-vendor marketplace</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'KYC Verified', desc: 'ہر seller CNIC verified', color: 'text-emerald-400' },
              { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'TCS, Leopard, Trax', color: 'text-sky-400' },
              { icon: <CheckCircle2 className="w-6 h-6" />, title: '7-Day Return', desc: 'آسان واپسی', color: 'text-orange-400' },
              { icon: <Package className="w-6 h-6" />, title: 'Escrow Safe', desc: 'محفوظ ادائیگی', color: 'text-purple-400' },
              { icon: <Clock className="w-6 h-6" />, title: 'Same Day', desc: 'Local vendors', color: 'text-yellow-400' },
              { icon: <Store className="w-6 h-6" />, title: 'Sell Online', desc: 'آسان onboarding', color: 'text-pink-400' },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seller CTA ───────────────────────────── */}
      <section className="py-12"
        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            🛒 آپ کا Store Kharidari.pk پر کھولیں
          </h2>
          <p className="text-sky-100 text-sm mb-6 max-w-xl mx-auto">
            KYC complete کریں، products list کریں اور پورے Pakistan میں sell کریں۔
            Commission صرف 8-12% — اور 7-day escrow سے پیسے محفوظ ہیں۔
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/vendor"
              className="flex items-center gap-2 px-8 py-3 bg-white text-sky-700 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-xl">
              Seller Registration
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              WhatsApp پر پوچھیں
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
