'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { INITIAL_VENDORS, formatPKR, INITIAL_PRODUCTS } from '@/lib/data';
import { Store, Star, MapPin, ShieldCheck, ChevronRight, Search, Package } from 'lucide-react';
import Link from 'next/link';

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const vendorCities = Array.from(new Set(INITIAL_VENDORS.map(v => v.city)));

  const filtered = INITIAL_VENDORS
    .filter(v => v.isApproved)
    .filter(v => {
      if (searchQuery && !v.storeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCity !== 'all' && v.city !== selectedCity) return false;
      return true;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">🏪 تمام Verified Stores</h1>
        <p className="text-sm text-slate-500 mt-1">KYC verified، CNIC confirmed — {filtered.length} active stores</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Store نام تلاش کریں..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="input-field w-auto text-sm">
          <option value="all">تمام شہر</option>
          {vendorCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(vendor => {
          const vendorProductCount = INITIAL_PRODUCTS.filter(p => p.vendorId === vendor.id && p.isActive).length;

          return (
            <div key={vendor.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden card-hover">
              {/* Banner */}
              <div className="relative h-32 bg-slate-200 overflow-hidden">
                <img src={vendor.banner} alt={vendor.storeName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-4 -mt-8 relative">
                <div className="flex items-end justify-between mb-3">
                  <img src={vendor.logo} alt={vendor.storeName}
                    className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-md bg-white" />
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full text-amber-700 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {vendor.rating}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h2 className="font-black text-slate-900 text-base">{vendor.storeName}</h2>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3 h-3" /> {vendor.city}, {vendor.province}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{vendor.bio}</p>

                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Package className="w-3.5 h-3.5 text-orange-400" />
                      {vendorProductCount} products
                    </div>
                    <div className="text-emerald-600 font-bold">
                      {formatPKR(vendor.totalSales)} sold
                    </div>
                  </div>
                  <Link href={`/products?vendor=${vendor.id}`}
                    className="font-bold text-orange-500 hover:underline flex items-center gap-1">
                    Visit <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">کوئی store نہیں ملا</p>
          <p className="text-xs mt-1">Filters تبدیل کریں</p>
        </div>
      )}

      {/* Vendor CTA */}
      <div className="mt-10 rounded-2xl p-8 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
        <h3 className="text-xl font-black mb-2">آپ کا store بھی یہاں آ سکتا ہے!</h3>
        <p className="text-sky-100 text-sm mb-5">KYC complete کریں اور پورے Pakistan میں بیچیں</p>
        <Link href="/vendor" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
          Seller بنیں <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
