'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import {
  Package, ChevronRight, MessageCircle, Truck, CheckCircle2,
  Clock, MapPin, RotateCcw, ShieldCheck, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const ORDER_STEPS = [
  { key: 'PENDING',           label: 'Pending',           desc: 'آرڈر موصول ہوا',                   icon: '🕐' },
  { key: 'CONFIRMED',         label: 'Confirmed',         desc: 'Vendor نے confirm کیا',             icon: '✅' },
  { key: 'PACKED',            label: 'Packed',            desc: 'Product pack ہو گئی',              icon: '📦' },
  { key: 'DISPATCHED',        label: 'Dispatched',        desc: 'Courier کو دے دیا گیا',            icon: '🚚' },
  { key: 'OUT_FOR_DELIVERY',  label: 'Out for Delivery',  desc: 'Rider آپ کی طرف آ رہا ہے',        icon: '🏍' },
  { key: 'DELIVERED',         label: 'Delivered',         desc: 'کامیابی سے deliver ہو گیا! 🎉',   icon: '✨' },
];

function OrderTracker({ status }: { status: string }) {
  const currentIdx = ORDER_STEPS.findIndex(s => s.key === status);

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 mx-8" />
      <div
        className="absolute top-4 left-0 h-0.5 transition-all duration-700 mx-8"
        style={{
          background: 'linear-gradient(90deg, #f97316, #ea580c)',
          width: `${Math.max(0, (currentIdx / (ORDER_STEPS.length - 1)) * 100)}%`
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        {ORDER_STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isActive = i === currentIdx;
          const isPending = i > currentIdx;
          return (
            <div key={step.key} className="flex flex-col items-center text-center w-1/6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2 transition-all ${
                isDone ? 'track-step-done' : isActive ? 'track-step-active bg-white border-2 border-orange-500' : 'track-step-pending'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : step.icon}
              </div>
              <p className={`text-[10px] font-bold leading-tight ${isDone || isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                {step.label}
              </p>
              {isActive && (
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight max-w-[60px]">{step.desc}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, isAuthenticated, openAuthModal, currentUser } = useMarketplaceStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-orange-300 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-900">My Orders</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">Orders دیکھنے کے لیے login کریں</p>
        <button onClick={() => openAuthModal('login')} className="btn-primary px-6 py-3">Login کریں</button>
      </div>
    );
  }

  // Filter orders for current user (admin sees all)
  const myOrders = currentUser?.role === 'ADMIN'
    ? orders
    : orders.filter(o => o.customerId === currentUser?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">🛍 My Orders</h1>
          <p className="text-xs text-slate-500">{myOrders.length} آرڈرز ملے</p>
        </div>
        <Link href="/products" className="btn-outline-orange text-xs px-4 py-2">مزید خریدیں</Link>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-orange-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">ابھی کوئی آرڈر نہیں</h3>
          <p className="text-sm text-slate-500 mt-1">پہلا آرڈر دیں اور tracking شروع کریں</p>
          <Link href="/products" className="btn-primary mt-4 inline-flex items-center gap-2 px-6 py-3">
            Shopping کریں <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {myOrders.map(order => (
            <div key={order.id}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              {/* Order Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-orange-50/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-sm">#{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700'
                        : order.orderStatus === 'DISPATCHED' || order.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-sky-100 text-sky-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>{order.orderStatus}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('ur-PK')} •
                      {order.subOrders.length} vendor(s) •
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-orange-600">{formatPKR(order.totalAmount)}</p>
                  <p className={`text-[10px] font-semibold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-orange-100 p-5 space-y-6">
                  {/* Delivery Address */}
                  <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-700">{order.shippingAddress.fullName}</p>
                      <p className="text-slate-500">
                        {order.shippingAddress.houseNo}, {order.shippingAddress.street}, {order.shippingAddress.area && order.shippingAddress.area + ','} {order.shippingAddress.city}, {order.shippingAddress.province}
                      </p>
                      <p className="text-slate-500 mt-0.5">{order.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* WhatsApp Status */}
                  {order.whatsappNotifiedAt && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp notification بھیجی گئی: {new Date(order.whatsappNotifiedAt).toLocaleString()}
                    </div>
                  )}

                  {/* Sub-Orders with Tracking */}
                  {order.subOrders.map((sub, idx) => (
                    <div key={sub.id} className="border border-orange-100 rounded-2xl overflow-hidden">
                      {/* Sub-order Header */}
                      <div className="flex items-center justify-between p-3 bg-orange-50">
                        <div className="flex items-center gap-2">
                          <span className="badge-orange text-[10px]">Sub-Order {idx + 1}</span>
                          <span className="text-xs font-bold text-slate-700">{sub.vendorName}</span>
                          <span className="text-[10px] text-slate-400">({sub.vendorCity})</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700'
                          : sub.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-700'
                          : sub.status === 'OUT_FOR_DELIVERY' ? 'bg-sky-100 text-sky-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>{sub.status}</span>
                      </div>

                      {/* 6-Step Order Tracker */}
                      <div className="p-4 pb-2">
                        <OrderTracker status={sub.status} />
                      </div>

                      {/* Courier Info */}
                      {(sub.trackingNumber || sub.riderName) && (
                        <div className="px-4 pb-3">
                          <div className="flex items-center gap-2 p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs">
                            <Truck className="w-4 h-4 text-sky-500" />
                            {sub.courierPartner && <span className="font-bold text-sky-700">{sub.courierPartner}</span>}
                            {sub.trackingNumber && <span className="font-mono text-slate-600">{sub.trackingNumber}</span>}
                            {sub.riderName && (
                              <span className="ml-auto text-slate-600">
                                🏍 {sub.riderName}: {sub.riderPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div className="px-4 pb-4 space-y-2">
                        {sub.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 text-xs">
                            <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{item.product.title}</p>
                              <p className="text-slate-400">{item.quantity}x {formatPKR(item.unitPrice)}</p>
                            </div>
                            <span className="font-bold text-slate-700">{formatPKR(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Escrow / Payout info */}
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between text-[10px] p-2 bg-slate-50 rounded-lg text-slate-500">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            7-day escrow protection
                          </span>
                          <span>Payout: {formatPKR(sub.payoutAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Return Window */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span>Return window: Order کے 7 دن کے اندر return request کر سکتے ہیں</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
