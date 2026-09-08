'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import { Star, ShoppingCart, Zap, MapPin, Shield, Clock } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useMarketplaceStore();

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card group relative flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-slate-100 aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPct > 0 && (
            <span className="badge-orange text-[10px]">{discountPct}% OFF</span>
          )}
          {product.sameDay && (
            <span className="badge-green text-[10px]">⚡ Same Day</span>
          )}
          {product.deliveryType === 'HYPER_LOCAL' && (
            <span className="badge-sky text-[10px]">🏠 Hyper-Local</span>
          )}
          {product.tags.includes('New Arrival') && (
            <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
          )}
        </div>

        {/* Low Stock Warning */}
        {isLowStock && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="w-full flex justify-center bg-red-500/90 text-white text-[10px] font-bold py-1 rounded-lg backdrop-blur-sm">
              ⚠ صرف {product.stock} باقی!
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-white text-slate-800 text-xs font-black px-4 py-2 rounded-xl">Stock ختم</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Vendor */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {product.vendorLogo && (
            <img src={product.vendorLogo} alt={product.vendorName}
              className="w-4 h-4 rounded-full object-cover border border-slate-100" />
          )}
          <span className="text-[10px] text-sky-600 font-semibold truncate">{product.vendorName}</span>
          <span title="KYC Verified">
            <Shield className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-orange-600 transition-colors leading-tight mb-1.5">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-base font-black text-orange-600">{formatPKR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">{formatPKR(product.originalPrice)}</span>
          )}
        </div>

        {/* Delivery info */}
        <div className="flex items-center gap-1 mb-2.5 text-[10px] text-slate-500">
          {product.sameDay ? (
            <>
              <Clock className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">Same-day delivery ({product.vendorCity})</span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{product.vendorCity} • {product.courierPartner || 'Courier'}</span>
            </>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-auto grid grid-cols-2 gap-1.5">
          <button
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
              isOutOfStock
                ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                : 'border-orange-400 text-orange-600 hover:bg-orange-50'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Cart
          </button>
          <Link
            href={!isOutOfStock ? `/products/${product.id}` : '#'}
            className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-white transition-all ${
              isOutOfStock ? 'opacity-50 pointer-events-none' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
