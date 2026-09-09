'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMarketplaceStore } from '@/lib/store';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, formatPKR } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { ChevronRight, SlidersHorizontal, Search, X, MapPin } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const { currentCity, products } = useMarketplaceStore();
  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [deliveryType, setDeliveryType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const q = (searchQuery || searchParam).trim().toLowerCase();

  const filtered = allProducts.filter((p) => {
    if (q) {
      const titleMatch = p.title.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const catMatch = p.categoryName?.toLowerCase().includes(q);
      const vendorMatch = p.vendorName?.toLowerCase().includes(q);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));

      // Intelligent Synonym Matching
      let synonymMatch = false;
      if (q.includes('watch') || q.includes('ghadi') || q.includes('ghari') || q.includes('gari') || q.includes('clock')) {
        synonymMatch = p.categoryId === 'cat_watches' || p.categoryName?.toLowerCase().includes('watch');
      } else if (q.includes('phone') || q.includes('mobile') || q.includes('cell') || q.includes('gadget')) {
        synonymMatch = p.categoryId === 'cat_electronics' || p.categoryName?.toLowerCase().includes('electronics');
      } else if (q.includes('shirt') || q.includes('cloth') || q.includes('kapra') || q.includes('suit') || q.includes('lawn') || q.includes('kameez')) {
        synonymMatch = p.categoryId === 'cat_apparel' || p.categoryName?.toLowerCase().includes('apparel');
      } else if (q.includes('shoe') || q.includes('chappal') || q.includes('footwear') || q.includes('joota')) {
        synonymMatch = p.categoryId === 'cat_footwear' || p.categoryName?.toLowerCase().includes('footwear');
      } else if (q.includes('mango') || q.includes('aam') || q.includes('fruit') || q.includes('sabzi') || q.includes('grocery')) {
        synonymMatch = p.categoryId === 'cat_groceries' || p.categoryName?.toLowerCase().includes('groceries');
      } else if (q.includes('perfume') || q.includes('attar') || q.includes('oud') || q.includes('khushboo')) {
        synonymMatch = p.categoryId === 'cat_fragrances' || p.categoryName?.toLowerCase().includes('fragrance');
      }

      if (q.includes('watch') || q.includes('ghadi') || q.includes('ghari') || q.includes('cloth') || q.includes('shirt') || q.includes('suit') || q.includes('mobile') || q.includes('phone') || q.includes('shoe')) {
        if (!titleMatch && !descMatch && !catMatch && !tagMatch && !synonymMatch) return false;
      } else {
        if (!titleMatch && !descMatch && !catMatch && !vendorMatch && !tagMatch && !synonymMatch) return false;
      }
    } else if (activeCategory !== 'all') {
      const cat = INITIAL_CATEGORIES.find((c) => c.id === activeCategory || c.slug === activeCategory);
      if (cat && p.categoryId !== cat.id) return false;
    }

    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (selectedCity !== 'all' && p.vendorCity.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (deliveryType !== 'all' && p.deliveryType !== deliveryType) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'nearest') {
      const aLocal = a.vendorCity.toLowerCase() === currentCity.toLowerCase() ? 0 : 1;
      const bLocal = b.vendorCity.toLowerCase() === currentCity.toLowerCase() ? 0 : 1;
      return aLocal - bLocal;
    }
    return 0;
  });

  const activecat = INITIAL_CATEGORIES.find((c) => c.id === activeCategory || c.slug === activeCategory);
  const vendorCities = Array.from(new Set(INITIAL_PRODUCTS.map((p) => p.vendorCity)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-700">
          {activecat ? activecat.name : 'All Products'}
        </span>
        {activecat?.deliveryType === 'HYPER_LOCAL' && (
          <span className="badge-green ml-2">📍 Hyper-Local</span>
        )}
      </div>

      <div className="flex gap-6">
        {/* ── LEFT SIDEBAR ─────────────────────── */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4' : 'hidden'} lg:block lg:static lg:z-auto lg:bg-transparent lg:p-0 w-full lg:w-56 shrink-0`}>
          {showFilters && (
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-bold text-slate-800">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-orange-100"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <h3 className="text-xs font-black text-white">📂 Categories</h3>
              </div>
              <div>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-4 py-2.5 text-xs border-b border-slate-50 transition-colors ${
                    activeCategory === 'all' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-orange-50'
                  }`}
                >
                  🛍 تمام Products
                </button>
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-2.5 text-xs border-b border-slate-50 flex items-center justify-between transition-colors ${
                      activeCategory === cat.id || activeCategory === cat.slug
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.icon} {cat.name}
                    </span>
                    {cat.deliveryType === 'HYPER_LOCAL' && (
                      <span className="text-[9px] text-emerald-600 font-bold">Local</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">💰 Price Range (PKR)</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₨"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field text-xs px-2 py-1.5 flex-1"
                />
                <input
                  type="number"
                  placeholder="Max ₨"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field text-xs px-2 py-1.5 flex-1"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  ['500', '2000', 'Under ₨2K'],
                  ['2000', '10000', '₨2K-10K'],
                  ['10000', '50000', '₨10K-50K'],
                  ['50000', '', 'Above ₨50K'],
                ].map(([mn, mx, label]) => (
                  <button key={label} onClick={() => { setMinPrice(mn); setMaxPrice(mx); }}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">📍 Vendor City</h3>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field text-xs"
              >
                <option value="all">تمام شہر</option>
                <option value={currentCity}>📍 {currentCity} (آپ کا شہر)</option>
                {vendorCities.filter(c => c !== currentCity).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Delivery Type */}
            <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-3">🚚 Delivery Type</h3>
              {[
                { value: 'all', label: 'تمام' },
                { value: 'STANDARD', label: '📦 Standard Courier' },
                { value: 'HYPER_LOCAL', label: '⚡ Same-Day Local' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value={opt.value}
                    checked={deliveryType === opt.value}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="accent-orange-500"
                  />
                  <span className="text-xs text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Reset */}
            {(activeCategory !== 'all' || minPrice || maxPrice || selectedCity !== 'all' || deliveryType !== 'all') && (
              <button
                onClick={() => { setActiveCategory('all'); setMinPrice(''); setMaxPrice(''); setSelectedCity('all'); setDeliveryType('all'); }}
                className="w-full py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                ✕ Filters Reset کریں
              </button>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Products میں تلاش کریں..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-xs py-2 w-auto"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="nearest">Nearest to {currentCity}</option>
              </select>

              <span className="text-xs text-slate-500 whitespace-nowrap">{filtered.length} products</span>
            </div>
          </div>

          {/* Hyper-local banner */}
          {activecat?.deliveryType === 'HYPER_LOCAL' && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <MapPin className="w-4 h-4 shrink-0" />
              <span><strong>Hyper-Local Category:</strong> یہ products صرف seller کے شہر میں same-day deliver ہوتے ہیں</span>
            </div>
          )}

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-700">کوئی product نہیں ملا</h3>
              <p className="text-sm text-slate-500 mt-1">Filters تبدیل کریں</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
