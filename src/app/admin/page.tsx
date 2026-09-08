'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, TrendingUp,
  Banknote, Users, Package, Store, AlertCircle, Eye,
  Wallet, ChevronRight, BarChart2, Settings, LayoutDashboard
} from 'lucide-react';

export default function AdminPage() {
  const {
    currentUser, isAuthenticated, vendors, products, orders,
    escrowTransactions, kycApplications, approveKyc, rejectKyc,
    releaseEscrow, updateCommissionRate, openAuthModal
  } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'escrow' | 'orders' | 'vendors' | 'commission'>('overview');
  const [commissionInputs, setCommissionInputs] = useState<Record<string, string>>({});

  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShieldCheck className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-900">Admin Console</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Admin access کے لیے admin account سے login کریں:<br />
          <strong>admin@kharidari.pk</strong>
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-primary px-6 py-3">Login کریں</button>
      </div>
    );
  }

  const approvedVendors = vendors.filter(v => v.isApproved);
  const pendingKyc = kycApplications.filter(k => k.status === 'PENDING');
  const totalRevenue = escrowTransactions.reduce((s, e) => s + e.amount, 0);
  const totalCommission = orders.reduce((sum, o) => sum + o.subOrders.reduce((ss, sub) => ss + sub.commissionAmount, 0), 0);
  const heldEscrow = escrowTransactions.filter(e => e.status === 'HELD').reduce((s, e) => s + e.amount, 0);
  const eligibleEscrow = escrowTransactions.filter(e => e.status === 'ELIGIBLE').reduce((s, e) => s + e.amount, 0);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'kyc', label: `KYC Queue (${pendingKyc.length})`, icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'escrow', label: 'Escrow', icon: <Wallet className="w-4 h-4" /> },
    { id: 'orders', label: `Orders (${orders.length})`, icon: <Package className="w-4 h-4" /> },
    { id: 'vendors', label: `Vendors (${approvedVendors.length})`, icon: <Store className="w-4 h-4" /> },
    { id: 'commission', label: 'Commission', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900">Admin Console — Kharidari.pk</h1>
          <p className="text-xs text-slate-500">مرحبا {currentUser?.name} • Super Admin</p>
        </div>
        {pendingKyc.length > 0 && (
          <div className="ml-auto flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            {pendingKyc.length} KYC Pending!
          </div>
        )}
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

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Platform Commission', value: formatPKR(totalCommission), icon: <Banknote className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
              { label: 'Approved Vendors', value: approvedVendors.length.toString(), icon: <Users className="w-5 h-5 text-sky-500" />, bg: 'bg-sky-50' },
              { label: 'Total Products', value: products.filter(p => p.isActive).length.toString(), icon: <Package className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
              { label: 'Total Orders', value: orders.length.toString(), icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <div className="flex items-center justify-between mb-2">{stat.icon}<BarChart2 className="w-3.5 h-3.5 text-slate-300" /></div>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Escrow Summary */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-500" /> Platform Escrow Overview
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Held (7-day)', value: formatPKR(heldEscrow), color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Eligible Release', value: formatPKR(eligibleEscrow), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Total Processed', value: formatPKR(totalRevenue), color: 'text-sky-600', bg: 'bg-sky-50' },
              ].map(item => (
                <div key={item.label} className={`${item.bg} rounded-xl p-3`}>
                  <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <h3 className="font-bold text-slate-800">Recent Orders</h3>
              <button onClick={() => setActiveTab('orders')}
                className="text-xs text-orange-500 font-semibold flex items-center gap-1">
                سب دیکھیں <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center gap-4 p-4 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">#{order.id}</p>
                    <p className="text-slate-500">{order.customerName} • {order.shippingAddress.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-600">{formatPKR(order.totalAmount)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── KYC QUEUE ── */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">KYC Review Queue</h2>
          {kycApplications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>کوئی KYC application نہیں</p>
            </div>
          ) : kycApplications.map(kyc => (
            <div key={kyc.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-50">
                <div>
                  <h3 className="font-bold text-slate-800">{kyc.storeName}</h3>
                  <p className="text-xs text-slate-500">{kyc.ownerName} • {kyc.city} • {kyc.businessWhatsApp}</p>
                </div>
                <span className={kyc.status === 'PENDING' ? 'kyc-pending' : kyc.status === 'APPROVED' ? 'kyc-approved' : 'kyc-rejected'}>
                  {kyc.status}
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">CNIC:</span>
                  <span className="ml-1 font-mono font-semibold text-slate-700">{kyc.cnicNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400">Bank:</span>
                  <span className="ml-1 font-semibold text-slate-700">{kyc.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400">IBAN:</span>
                  <span className="ml-1 font-mono text-slate-700 text-[10px]">{kyc.bankIban}</span>
                </div>
                <div>
                  <span className="text-slate-400">Account:</span>
                  <span className="ml-1 font-semibold text-slate-700">{kyc.accountTitle}</span>
                </div>
              </div>
              {/* CNIC Preview */}
              <div className="px-4 pb-4 flex gap-3">
                <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 h-24 bg-slate-50">
                  <img src={kyc.cnicFrontUrl} alt="CNIC Front" className="w-full h-full object-cover" />
                  <div className="text-center text-[10px] text-slate-400 py-1">CNIC Front</div>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 h-24 bg-slate-50">
                  <img src={kyc.cnicBackUrl} alt="CNIC Back" className="w-full h-full object-cover" />
                  <div className="text-center text-[10px] text-slate-400 py-1">CNIC Back</div>
                </div>
              </div>
              {kyc.status === 'PENDING' && (
                <div className="flex gap-3 p-4 pt-0">
                  <button
                    onClick={() => approveKyc(kyc.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => rejectKyc(kyc.id, 'Documents unclear')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── ESCROW ── */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">Escrow Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Held', value: formatPKR(heldEscrow), cls: 'escrow-held' },
              { label: 'Eligible', value: formatPKR(eligibleEscrow), cls: 'escrow-eligible' },
              { label: 'Released', value: formatPKR(escrowTransactions.filter(e => e.status === 'RELEASED').reduce((s, e) => s + e.amount, 0)), cls: 'escrow-released' },
            ].map(item => (
              <div key={item.label} className={`p-4 rounded-2xl border text-sm ${item.cls}`}>
                <p className="text-lg font-black">{item.value}</p>
                <p className="text-xs opacity-70">{item.label}</p>
              </div>
            ))}
          </div>
          {escrowTransactions.map(e => (
            <div key={e.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{e.vendorName}</p>
                <p className="text-xs text-slate-500">Order #{e.orderId} • Eligible: {new Date(e.eligibleAfter).toLocaleDateString()}</p>
              </div>
              <span className="font-black text-slate-800">{formatPKR(e.amount)}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                e.status === 'HELD' ? 'bg-amber-50 border-amber-200 text-amber-700'
                : e.status === 'ELIGIBLE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-sky-50 border-sky-200 text-sky-700'
              }`}>{e.status}</span>
              {e.status === 'ELIGIBLE' && (
                <button onClick={() => releaseEscrow(e.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors">
                  Release
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── ORDERS ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">تمام آرڈرز</h2>
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-black text-slate-800">#{order.id}</span>
                  <span className="text-xs text-slate-400 ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-orange-600">{formatPKR(order.totalAmount)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{order.orderStatus}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5">
                <p><span className="font-semibold text-slate-700">Customer:</span> {order.customerName} • {order.customerPhone}</p>
                <p><span className="font-semibold text-slate-700">Address:</span> {order.shippingAddress.city}, {order.shippingAddress.province}</p>
                <p><span className="font-semibold text-slate-700">Payment:</span> {order.paymentMethod} — <span className={order.paymentStatus === 'PAID' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{order.paymentStatus}</span></p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                {order.subOrders.map(sub => (
                  <div key={sub.id} className="text-[10px] p-2 bg-slate-50 rounded-lg">
                    <p className="font-bold text-slate-700">{sub.vendorName}</p>
                    <p className="text-slate-500">{sub.status} • {formatPKR(sub.payoutAmount)} payout</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── VENDORS ── */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">Vendor Management</h2>
          {vendors.map(vendor => (
            <div key={vendor.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
              {vendor.logo && <img src={vendor.logo} alt={vendor.storeName} className="w-12 h-12 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">{vendor.storeName}</h3>
                  {vendor.isApproved && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <p className="text-xs text-slate-500">{vendor.city} • {vendor.businessEmail} • Sales: {formatPKR(vendor.totalSales)}</p>
              </div>
              <div className="text-right">
                <span className={vendor.kycStatus === 'APPROVED' ? 'kyc-approved' : vendor.kycStatus === 'REJECTED' ? 'kyc-rejected' : 'kyc-pending'}>
                  {vendor.kycStatus}
                </span>
                <p className="text-xs text-slate-400 mt-1">Commission: {vendor.commissionRate}%</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COMMISSION ── */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          <h2 className="font-black text-slate-800">Commission Management</h2>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-700">
            ℹ Commission automatically deduct ہوتا ہے ہر order پر — payout = subtotal - commission
          </div>
          {vendors.map(vendor => (
            <div key={vendor.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800">{vendor.storeName}</h3>
                <p className="text-xs text-slate-500">{vendor.city} • Current: {vendor.commissionRate}%</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1" max="30"
                  value={commissionInputs[vendor.id] ?? vendor.commissionRate}
                  onChange={e => setCommissionInputs(prev => ({ ...prev, [vendor.id]: e.target.value }))}
                  className="input-field w-20 text-sm text-center py-1.5"
                />
                <span className="text-sm font-semibold text-slate-600">%</span>
                <button
                  onClick={() => updateCommissionRate(vendor.id, Number(commissionInputs[vendor.id] ?? vendor.commissionRate))}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
