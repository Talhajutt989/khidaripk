'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMarketplaceStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import {
  ShieldCheck,
  Star,
  ArrowLeft,
  Layers,
  Percent
} from 'lucide-react';

export default function StorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { vendors, products } = useMarketplaceStore();

  const vendor = vendors.find((v) => v.slug === slug);
  const vendorProducts = products.filter((p) => p.vendorId === vendor?.id);

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Storefront Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The requested vendor profile could not be located.
        </p>
        <Link
          href="/stores"
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90"
        >
          View All Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Store Header Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={vendor.banner}
          alt={vendor.storeName}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/stores"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Vendors</span>
          </Link>
        </div>
      </div>

      {/* Store Identity & Bio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <img
              src={vendor.logo}
              alt={vendor.storeName}
              className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-950 object-cover shadow-2xl bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {vendor.storeName}
                </h1>
                {vendor.isApproved && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Atelier
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                {vendor.bio}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="flex items-center justify-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {vendor.rating}
              </span>
              <span className="text-[10px] text-slate-400">Store Score</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="block text-sm font-bold text-slate-900 dark:text-white">
                {vendorProducts.length}
              </span>
              <span className="text-[10px] text-slate-400">Active Listings</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="flex items-center justify-center gap-1 text-sm font-bold text-emerald-600">
                <Percent className="w-3.5 h-3.5" />
                {vendor.commissionRate}%
              </span>
              <span className="text-[10px] text-slate-400">Platform Rate</span>
            </div>
          </div>
        </div>

        {/* Store Catalog */}
        <div className="pt-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Storefront Catalog ({vendorProducts.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every item ships directly from {vendor.storeName} with dedicated sub-order tracking.
              </p>
            </div>
          </div>

          {vendorProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendorProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No active listings found for this store.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
