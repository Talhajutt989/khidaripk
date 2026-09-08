'use client';

import React from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, MessageCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const {
    cart, isCartOpen, closeCart, removeFromCart, updateQuantity,
    getCartTotal, getCartCount, getDeliveryFee, isAuthenticated, openAuthModal
  } = useMarketplaceStore();

  const total = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const grandTotal = total + deliveryFee;
  const cartCount = getCartCount();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      closeCart();
      openAuthModal('login', '/checkout');
      return;
    }
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-slate-800">Cart</span>
              <span className="text-xs text-slate-500 ml-2">({cartCount} items)</span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-orange-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Cart خالی ہے</h3>
              <p className="text-sm text-slate-500 mt-1">کچھ اچھی چیزیں cart میں ڈالیں!</p>
            </div>
            <button
              onClick={closeCart}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              Shopping شروع کریں
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                    {item.product.sameDay && (
                      <div className="absolute top-0 left-0 badge-green text-[8px] px-1 py-0.5 rounded-none rounded-br-lg">
                        Same Day
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                      {item.product.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.product.vendorName}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-orange-600">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:border-orange-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3 text-slate-600" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:border-orange-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3 text-slate-600" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center ml-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-orange-100 p-4 space-y-4">
              {/* Delivery Fee Banner */}
              <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                deliveryFee === 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
                <Truck className="w-4 h-4 shrink-0" />
                {deliveryFee === 0
                  ? '🎉 مبارک ہو! آپ کو free delivery مل گئی'
                  : `₨ ${2000 - total} مزید خریدیں اور free delivery حاصل کریں`
                }
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-slate-800">{formatPKR(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0
                    ? <span className="font-semibold text-emerald-600">FREE</span>
                    : <span className="font-semibold text-slate-800">{formatPKR(deliveryFee)}</span>
                  }
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100 mt-2">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Payment Methods Mini */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['💵 COD', '🟣 JazzCash', '🟢 Easypaisa', '🔵 SadaPay'].map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-medium text-slate-600">{p}</span>
                ))}
              </div>

              {/* CTA */}
              {isAuthenticated ? (
                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure Checkout ({formatPKR(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login کریں اور Checkout کریں</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3 text-green-500" />
                Order confirm ہونے پر WhatsApp notification آئے گی
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
