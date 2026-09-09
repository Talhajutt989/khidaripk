'use client';

import React, { useState, useMemo } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { formatPKR } from '@/lib/data';
import {
  ShieldCheck, CheckCircle2, XCircle, TrendingUp,
  Banknote, Users, Package, Store, AlertCircle,
  Wallet, ChevronRight, BarChart2, Settings, LayoutDashboard,
  ShoppingCart, ArrowUpRight, Trash2, Ban, Lock, Mail,
  Eye, EyeOff, LogOut
} from 'lucide-react';

// ── Helper: bucket orders by day/week/month ──────────────────
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });
}
function getLast4Weeks() {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (3 - i) * 7);
    const start = new Date(d);
    start.setDate(d.getDate() - 6);
    return { label: `W${4 - i}`, start: start.toISOString().split('T')[0], end: d.toISOString().split('T')[0] };
  });
}
function getLast6Months() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString('default', { month: 'short' }), month: d.getMonth(), year: d.getFullYear() };
  });
}

// ── SVG Bar Chart Component ──────────────────────────────────
function BarChart({ data, color = '#f97316' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const height = 120;
  const barWidth = Math.floor(220 / data.length) - 4;

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(data.length * (barWidth + 4) + 20, 260)} height={height + 40} className="block mx-auto">
        {data.map((d, i) => {
          const barH = Math.round((d.value / max) * height);
          const x = i * (barWidth + 4) + 10;
          const y = height - barH;
          return (
            <g key={i}>
              {/* Background bar */}
              <rect x={x} y={0} width={barWidth} height={height} rx={4} fill="#f1f5f9" />
              {/* Value bar */}
              <rect x={x} y={y} width={barWidth} height={barH} rx={4} fill={color}
                style={{ transition: 'all 0.4s ease' }} />
              {/* Label */}
              <text x={x + barWidth / 2} y={height + 16} textAnchor="middle"
                fontSize="9" fill="#94a3b8" fontWeight="600">
                {d.label}
              </text>
              {/* Value on top */}
              {d.value > 0 && (
                <text x={x + barWidth / 2} y={y - 4} textAnchor="middle"
                  fontSize="8" fill={color} fontWeight="700">
                  {d.value > 1000 ? `${(d.value / 1000).toFixed(0)}k` : d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Dedicated Admin Login Form ─────────────────────────────────
function AdminLoginForm({
  loginUser,
  isAuthenticated,
  currentUserRole,
}: {
  loginUser: (email: string, password: string) => boolean;
  isAuthenticated: boolean;
  currentUserRole?: string;
}) {
  const [email, setEmail] = useState('admin@kharidari.pk');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = loginUser(email, password);
    setLoading(false);
    if (!ok) setError('غلط email یا password ہے۔ دوبارہ کوشش کریں۔');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Kharidari.pk اداری صفحہ</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Wrong role warning */}
            {isAuthenticated && currentUserRole && currentUserRole !== 'ADMIN' && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-semibold">
                  آپ {currentUserRole} کے طور پر login ہیں۔ Admin access کے لیے admin account سے login کریں۔
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  className="input-field pl-10"
                  placeholder="admin@kharidari.pk"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="اپنا admin password دالیں"
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Admin Login
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          🔒 یہ صفحہ صرف سائٹ admin کے لیے ہے۔
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const {
    currentUser, isAuthenticated, vendors, products, orders, users,
    escrowTransactions, kycApplications, approveKyc, rejectKyc,
    releaseEscrow, updateCommissionRate, loginUser, logout,
    deleteUser, banUser
  } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'analytics' | 'kyc' | 'escrow' | 'orders' | 'vendors' | 'commission' | 'users'
  >('overview');
  const [commissionInputs, setCommissionInputs] = useState<Record<string, string>>({});
  const [chartMetric, setChartMetric] = useState<'orders' | 'revenue'>('orders');
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // ── ALL hooks MUST be before any early return (React rules) ──
  const approvedVendors = vendors.filter(v => v.isApproved);
  const pendingKyc = kycApplications.filter(k => k.status === 'PENDING');
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalCommission = orders.reduce((sum, o) => sum + o.subOrders.reduce((ss, sub) => ss + sub.commissionAmount, 0), 0);
  const heldEscrow = escrowTransactions.filter(e => e.status === 'HELD').reduce((s, e) => s + e.amount, 0);
  const eligibleEscrow = escrowTransactions.filter(e => e.status === 'ELIGIBLE').reduce((s, e) => s + e.amount, 0);
  const totalBuyers = users.filter(u => u.role === 'CUSTOMER').length;
  const totalSellers = vendors.length;

  const chartData = useMemo(() => {
    if (chartPeriod === 'daily') {
      const days = getLast7Days();
      return days.map(day => {
        const dayOrders = orders.filter(o => o.createdAt.startsWith(day));
        return {
          label: new Date(day).toLocaleDateString('en-PK', { weekday: 'short' }),
          value: chartMetric === 'orders' ? dayOrders.length : dayOrders.reduce((s, o) => s + o.totalAmount, 0),
        };
      });
    }
    if (chartPeriod === 'weekly') {
      const weeks = getLast4Weeks();
      return weeks.map(w => {
        const wOrders = orders.filter(o => {
          const d = o.createdAt.split('T')[0];
          return d >= w.start && d <= w.end;
        });
        return {
          label: w.label,
          value: chartMetric === 'orders' ? wOrders.length : wOrders.reduce((s, o) => s + o.totalAmount, 0),
        };
      });
    }
    const months = getLast6Months();
    return months.map(m => {
      const mOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === m.month && d.getFullYear() === m.year;
      });
      return {
        label: m.label,
        value: chartMetric === 'orders' ? mOrders.length : mOrders.reduce((s, o) => s + o.totalAmount, 0),
      };
    });
  }, [orders, chartPeriod, chartMetric]);

  const sellerStats = useMemo(() => {
    return vendors.map(vendor => {
      const vendorOrders = orders.filter(o => o.subOrders.some(s => s.vendorId === vendor.id));
      const vendorSubs = orders.flatMap(o => o.subOrders.filter(s => s.vendorId === vendor.id));
      const totalSales = vendorSubs.reduce((s, sub) => s + sub.subtotal, 0);
      const totalComm = vendorSubs.reduce((s, sub) => s + sub.commissionAmount, 0);
      const orderCount = vendorOrders.length;
      const avgOrder = orderCount > 0 ? totalSales / orderCount : 0;
      return { vendor, orderCount, totalSales, totalComm, avgOrder };
    }).sort((a, b) => b.totalSales - a.totalSales);
  }, [vendors, orders]);

  // ── ACCESS GUARD: ADMIN ONLY (after all hooks) ────────────────
  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    return <AdminLoginForm loginUser={loginUser} isAuthenticated={isAuthenticated} currentUserRole={currentUser?.role} />;
  }


  const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'users', label: `Users (${users.filter(u => u.role !== 'ADMIN').length})`, icon: <Users className="w-4 h-4" /> },
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
          <p className="text-xs text-slate-500">مرحبا {currentUser?.name} • Super Admin 🔐</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {pendingKyc.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              {pendingKyc.length} KYC Pending!
            </div>
          )}
          {/* Logout Button */}
          <button
            onClick={() => {
              if (confirm('کیا آپ Admin Portal سے logout کرنا چاہتے ہیں؟')) {
                logout();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
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

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Platform Commission', value: formatPKR(totalCommission), icon: <Banknote className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50', sub: 'کل commission' },
              { label: 'Total Sellers', value: totalSellers.toString(), icon: <Store className="w-5 h-5 text-sky-500" />, bg: 'bg-sky-50', sub: `${approvedVendors.length} approved` },
              { label: 'Total Buyers', value: totalBuyers.toString(), icon: <Users className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50', sub: 'registered customers' },
              { label: 'Total Orders', value: orders.length.toString(), icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50', sub: formatPKR(totalRevenue) + ' GMV' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <div className="flex items-center justify-between mb-2">{stat.icon}<ArrowUpRight className="w-3.5 h-3.5 text-slate-300" /></div>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
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

      {/* ── USERS MANAGEMENT ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-800 text-lg">Users Management</h2>
              <p className="text-xs text-slate-400 mt-0.5">تمام registered users — account delete یا ban کریں</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg font-semibold">
                👥 Buyers: {users.filter(u => u.role === 'CUSTOMER').length}
              </span>
              <span className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg font-semibold">
                🏪 Sellers: {users.filter(u => u.role === 'VENDOR').length}
              </span>
            </div>
          </div>

          {/* Users list — Admin excluded */}
          <div className="space-y-3">
            {users.filter(u => u.role !== 'ADMIN').length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>کوئی registered user نہیں ملا</p>
              </div>
            ) : (
              users.filter(u => u.role !== 'ADMIN').map(user => (
                <div key={user.id} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm transition-all ${
                  (user as any).isBanned ? 'border-red-200 bg-red-50/30' : 'border-orange-100'
                }`}>
                  {/* Avatar */}
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff`}
                    alt={user.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border-2 border-orange-100"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800">{user.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.role === 'VENDOR'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}>
                        {user.role === 'VENDOR' ? '🏪 Seller' : '🛒 Buyer'}
                      </span>
                      {(user as any).isBanned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          🚫 BANNED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                    <p className="text-[10px] text-slate-400">
                      📍 {user.city || '—'} • 📞 {user.phone || '—'} •
                      Joined: {new Date(user.createdAt).toLocaleDateString('en-PK')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Ban */}
                    {!(user as any).isBanned && (
                      <button
                        onClick={() => {
                          if (confirm(`کیا آپ ${user.name} کو ban کرنا چاہتے ہیں؟`)) {
                            banUser(user.id);
                          }
                        }}
                        title="Ban user"
                        className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    {/* Delete permanently */}
                    <button
                      onClick={() => {
                        if (confirm(`کیا آپ ${user.name} کا account مستقل طور پر delete کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا۔`)) {
                          deleteUser(user.id);
                        }
                      }}
                      title="Delete account permanently"
                      className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="font-black text-slate-800 text-lg">📊 Analytics Dashboard</h2>

          {/* Top summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'کل Sellers', value: totalSellers, sub: `${approvedVendors.length} approved`, icon: <Store className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
              { label: 'کل Buyers', value: totalBuyers, sub: 'registered customers', icon: <Users className="w-5 h-5 text-sky-500" />, bg: 'bg-sky-50' },
              { label: 'کل Orders', value: orders.length, sub: formatPKR(totalRevenue) + ' GMV', icon: <ShoppingCart className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
              { label: 'Platform Earnings', value: formatPKR(totalCommission), sub: 'total commission', icon: <Banknote className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <div className="flex items-center justify-between mb-2">{s.icon}</div>
                <p className="text-xl font-black text-slate-900">{typeof s.value === 'number' && s.value > 999 ? s.value : s.value}</p>
                <p className="text-xs font-semibold text-slate-700">{s.label}</p>
                <p className="text-[10px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart Controls */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h3 className="font-bold text-slate-800">Sales Chart</h3>
              <div className="flex gap-2">
                {/* Period Toggle */}
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                  {(['daily', 'weekly', 'monthly'] as const).map(p => (
                    <button key={p} onClick={() => setChartPeriod(p)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        chartPeriod === p ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
                      }`}>
                      {p === 'daily' ? 'روزانہ' : p === 'weekly' ? 'ہفتہ' : 'مہینہ'}
                    </button>
                  ))}
                </div>
                {/* Metric Toggle */}
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                  {(['orders', 'revenue'] as const).map(m => (
                    <button key={m} onClick={() => setChartMetric(m)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        chartMetric === m ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500'
                      }`}>
                      {m === 'orders' ? '📦 Orders' : '₨ Revenue'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <BarChart
              data={chartData}
              color={chartMetric === 'orders' ? '#f97316' : '#0ea5e9'}
            />

            {/* Chart summary row */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>کل {chartMetric === 'orders' ? 'Orders' : 'Revenue'}: <strong className="text-slate-800">
                {chartMetric === 'orders'
                  ? chartData.reduce((s, d) => s + d.value, 0)
                  : formatPKR(chartData.reduce((s, d) => s + d.value, 0))}
              </strong></span>
              <span>سب سے زیادہ: <strong className="text-orange-600">
                {chartMetric === 'orders'
                  ? Math.max(...chartData.map(d => d.value)) + ' orders'
                  : formatPKR(Math.max(...chartData.map(d => d.value)))}
              </strong></span>
            </div>
          </div>

          {/* Per-Seller Sales Table */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-orange-100">
              <h3 className="font-bold text-slate-800">Seller-wise Sales Data</h3>
              <p className="text-xs text-slate-400 mt-0.5">ہر seller کی individual sales — صرف Admin دیکھ سکتا ہے</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Seller / Store</th>
                    <th className="text-center px-3 py-3 font-bold text-slate-600">Orders</th>
                    <th className="text-right px-3 py-3 font-bold text-slate-600">Total Sales</th>
                    <th className="text-right px-3 py-3 font-bold text-slate-600">Commission</th>
                    <th className="text-right px-3 py-3 font-bold text-slate-600">Avg Order</th>
                    <th className="text-center px-3 py-3 font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sellerStats.map(({ vendor, orderCount, totalSales, totalComm, avgOrder }) => (
                    <tr key={vendor.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {vendor.logo && (
                            <img src={vendor.logo} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          )}
                          <div>
                            <p className="font-bold text-slate-800">{vendor.storeName}</p>
                            <p className="text-slate-400">{vendor.city} • {vendor.commissionRate}% commission</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-black text-slate-800">{orderCount}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-black text-orange-600">{formatPKR(totalSales)}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-bold text-emerald-600">{formatPKR(totalComm)}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-slate-600">{formatPKR(avgOrder)}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={vendor.kycStatus === 'APPROVED' ? 'kyc-approved' : vendor.kycStatus === 'REJECTED' ? 'kyc-rejected' : 'kyc-pending'}>
                          {vendor.kycStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-orange-50 border-t-2 border-orange-200">
                    <td className="px-4 py-3 font-black text-slate-800">کل (Total)</td>
                    <td className="px-3 py-3 text-center font-black text-slate-800">{orders.length}</td>
                    <td className="px-3 py-3 text-right font-black text-orange-600">{formatPKR(totalRevenue)}</td>
                    <td className="px-3 py-3 text-right font-black text-emerald-600">{formatPKR(totalCommission)}</td>
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Buyers & Sellers breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sellers */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" /> Sellers Overview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">کل Sellers</span>
                  <span className="font-black text-slate-800">{totalSellers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Approved</span>
                  <span className="font-black text-emerald-600">{approvedVendors.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">KYC Pending</span>
                  <span className="font-black text-amber-600">{pendingKyc.length}</span>
                </div>
                {/* Mini bar */}
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${(approvedVendors.length / Math.max(totalSellers, 1)) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">
                  {Math.round((approvedVendors.length / Math.max(totalSellers, 1)) * 100)}% sellers approved
                </p>
              </div>
            </div>

            {/* Buyers */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" /> Buyers Overview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Registered Buyers</span>
                  <span className="font-black text-slate-800">{totalBuyers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Orders placed</span>
                  <span className="font-black text-sky-600">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg order value</span>
                  <span className="font-black text-orange-600">
                    {formatPKR(orders.length > 0 ? totalRevenue / orders.length : 0)}
                  </span>
                </div>
                {/* All users list */}
                <div className="mt-3 space-y-1.5 max-h-24 overflow-y-auto">
                  {users.filter(u => u.role === 'CUSTOMER').map(u => (
                    <div key={u.id} className="flex items-center gap-2 text-xs">
                      <img src={u.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-slate-700 font-semibold">{u.name}</span>
                      <span className="text-slate-400">{u.city}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                <div><span className="text-slate-400">CNIC:</span><span className="ml-1 font-mono font-semibold text-slate-700">{kyc.cnicNumber}</span></div>
                <div><span className="text-slate-400">Bank:</span><span className="ml-1 font-semibold text-slate-700">{kyc.bankName}</span></div>
                <div><span className="text-slate-400">IBAN:</span><span className="ml-1 font-mono text-slate-700 text-[10px]">{kyc.bankIban}</span></div>
                <div><span className="text-slate-400">Account:</span><span className="ml-1 font-semibold text-slate-700">{kyc.accountTitle}</span></div>
              </div>
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
                  <button onClick={() => approveKyc(kyc.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => rejectKyc(kyc.id, 'Documents unclear')}
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
