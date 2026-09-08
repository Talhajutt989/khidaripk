'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplaceStore } from '@/lib/store';
import { PAKISTAN_CITIES } from '@/lib/geo';
import { INITIAL_CATEGORIES } from '@/lib/data';
import {
  ShoppingBag, Search, MapPin, ChevronDown, Menu, X,
  User, LogOut, LayoutDashboard, ShieldCheck, Package,
  MessageCircle, Bell, Store, ChevronRight, Smartphone,
  Shirt, Star, Sparkles, Truck
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'cat_electronics': <Smartphone className="w-4 h-4" />,
  'cat_apparel': <Shirt className="w-4 h-4" />,
  'cat_footwear': <span className="text-sm">👟</span>,
  'cat_groceries': <span className="text-sm">🍎</span>,
  'cat_watches': <span className="text-sm">⌚</span>,
  'cat_jewelry': <span className="text-sm">💍</span>,
  'cat_fragrances': <span className="text-sm">🌸</span>,
  'cat_vehicles': <span className="text-sm">🚗</span>,
};

export function Navbar() {
  const router = useRouter();
  const {
    currentUser, isAuthenticated, logout, openAuthModal,
    openCart, getCartCount, currentCity, setCurrentCity,
  } = useMarketplaceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const cartCount = getCartCount();

  useEffect(() => {
    const handler = () => {
      setIsCityOpen(false);
      setIsUserMenuOpen(false);
      setIsCategoryMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      {/* ── Top Announcement Bar ────────────────── */}
      <div
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        className="text-white text-xs py-2 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Ticker */}
          <div className="ticker-wrap flex-1 hidden sm:block">
            <div className="ticker-content text-orange-100">
              🚚 PKR 2,000+ orders پر free delivery &nbsp;&nbsp;|&nbsp;&nbsp; 📦 TCS, Leopard, Trax se fast shipping &nbsp;&nbsp;|&nbsp;&nbsp; ✅ 7-din return guarantee &nbsp;&nbsp;|&nbsp;&nbsp; 💳 JazzCash, Easypaisa, COD accepted &nbsp;&nbsp;|&nbsp;&nbsp; 🌟 Pakistan ka sabse bada online bazaar &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 PKR 2,000+ orders پر free delivery &nbsp;&nbsp;|&nbsp;&nbsp; 📦 TCS, Leopard, Trax se fast shipping
            </div>
          </div>
          <div className="sm:hidden text-orange-100 text-[11px] font-medium">
            🚚 PKR 2,000+ پر free delivery
          </div>

          {/* City Selector */}
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 text-xs text-white font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>{currentCity}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isCityOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-orange-100 py-2 z-50 max-h-60 overflow-y-auto">
                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Delivery City منتخب کریں
                </p>
                {PAKISTAN_CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrentCity(c); setIsCityOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-orange-50 ${
                      c === currentCity ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700'
                    }`}
                  >
                    {c === currentCity && '📍 '}
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-white/90 hover:text-white text-[11px] font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-300" />
            <span>Support</span>
          </a>
        </div>
      </div>

      {/* ── Main Nav ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-orange-glow group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              Kharidari<span className="text-orange-500">.pk</span>
            </span>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-sky-500 -mt-0.5">
              پاکستان کا آن لائن بازار
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl relative items-center"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="موبائل، کپڑے، آم، گھڑیاں... تلاش کریں"
            className="w-full pl-4 pr-12 py-2.5 text-sm rounded-xl border-2 border-orange-200 bg-orange-50/50 focus:outline-none focus:border-orange-400 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* User Menu */}
          {isAuthenticated && currentUser ? (
            <div className="relative hidden lg:block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-100 hover:border-orange-300 hover:bg-orange-50 transition-all"
              >
                {currentUser.image ? (
                  <img src={currentUser.image} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name[0]}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-700 max-w-24 truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-orange-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                      currentUser.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                      currentUser.role === 'VENDOR' ? 'bg-sky-100 text-sky-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>{currentUser.role}</span>
                  </div>
                  <Link href="/orders" onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  {currentUser.role === 'VENDOR' && (
                    <Link href="/vendor" onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-600">
                      <LayoutDashboard className="w-4 h-4" /> Vendor Dashboard
                    </Link>
                  )}
                  {currentUser.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-red-600">
                      <ShieldCheck className="w-4 h-4" /> Admin Console
                    </Link>
                  )}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="btn-primary px-4 py-2 text-xs"
              >
                Register
              </button>
            </div>
          )}

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-600 transition-all flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-white text-[11px] font-black flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-orange-50 border border-orange-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Category Nav Bar ─────────────────────── */}
      <div className="hidden lg:block border-t border-orange-100 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10">
            {/* All Categories Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1.5 px-3 h-10 text-xs font-bold text-white rounded-b-0 transition-colors"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                <Menu className="w-3.5 h-3.5" />
                <span>تمام Categories</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full mt-0 w-56 bg-white rounded-b-2xl shadow-2xl border border-orange-100 py-2 z-50">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <div>
                        <span className="font-medium">{cat.name}</span>
                        {cat.deliveryType === 'HYPER_LOCAL' && (
                          <span className="ml-2 badge-green text-[9px]">Local</span>
                        )}
                      </div>
                      <ChevronRight className="w-3 h-3 ml-auto text-slate-300" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Category Links */}
            {INITIAL_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex items-center gap-1.5 px-3 h-10 text-xs font-medium text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0"
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}

            <div className="ml-auto flex items-center gap-3 text-xs">
              <Link href="/vendor" className="flex items-center gap-1 text-sky-600 font-semibold hover:underline">
                <Store className="w-3.5 h-3.5" />
                Sell on Kharidari
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ───────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-orange-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-orange-200 bg-orange-50"
            />
          </form>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}
                className="py-2 text-sm font-semibold border-2 border-orange-400 text-orange-600 rounded-xl">
                Sign In
              </button>
              <button onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
                className="btn-primary py-2 text-sm">
                Register
              </button>
            </div>
          )}

          {isAuthenticated && currentUser && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              {currentUser.image && (
                <img src={currentUser.image} alt="" className="w-8 h-8 rounded-full object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-orange-600 font-semibold">{currentUser.role}</p>
              </div>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="text-xs text-red-500 font-semibold">Logout</button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {INITIAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-xs font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 border-t border-slate-100 pt-4">
            <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 hover:text-orange-600">
              <Package className="w-4 h-4" /> My Orders
            </Link>
            <Link href="/stores" onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 hover:text-orange-600">
              <Store className="w-4 h-4" /> All Stores
            </Link>
            {currentUser?.role === 'VENDOR' && (
              <Link href="/vendor" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-sky-50 text-sky-700 font-semibold">
                <LayoutDashboard className="w-4 h-4" /> Vendor Dashboard
              </Link>
            )}
            {currentUser?.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Admin Console
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
