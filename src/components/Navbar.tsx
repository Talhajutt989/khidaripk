'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplaceStore } from '@/lib/store';
import { PAKISTAN_CITIES } from '@/lib/geo';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, formatPKR } from '@/lib/data';
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
    openCart, getCartCount, currentCity, setCurrentCity, products
  } = useMarketplaceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
  const cartCount = getCartCount();

  const liveSearchMatches = searchQuery.trim()
    ? allProducts.filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const catMatch = p.categoryName?.toLowerCase().includes(q);
        const vendorMatch = p.vendorName?.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));

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
          return titleMatch || descMatch || catMatch || tagMatch || synonymMatch;
        }
        return titleMatch || descMatch || catMatch || vendorMatch || tagMatch || synonymMatch;
      }).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = () => {
      setIsCityOpen(false);
      setIsUserMenuOpen(false);
      setIsCategoryMenuOpen(false);
      setIsSearchFocused(false);
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
          onSubmit={(e) => {
            handleSearch(e);
            setIsSearchFocused(false);
          }}
          onClick={(e) => e.stopPropagation()}
          className="hidden md:flex flex-1 max-w-xl relative items-center"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
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

          {/* Instant Search Suggestions Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 py-2 z-50 overflow-hidden">
              {liveSearchMatches.length === 0 ? (
                <div className="px-4 py-4 text-xs text-slate-400 text-center">
                  🔍 کوئی پروڈکٹ نہیں ملا ("{searchQuery}")
                </div>
              ) : (
                <div>
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex justify-between bg-slate-50">
                    <span>Matching Products ({liveSearchMatches.length})</span>
                    <span className="text-orange-500 font-semibold">Live Results</span>
                  </div>
                  {liveSearchMatches.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.id}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <img src={prod.images[0]} alt={prod.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{prod.title}</p>
                        <p className="text-[10px] text-slate-400">{prod.categoryName} • 📍 {prod.vendorCity}</p>
                      </div>
                      <span className="text-xs font-black text-orange-600 shrink-0">{formatPKR(prod.price)}</span>
                    </Link>
                  ))}
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-600 border-t border-orange-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    تمام نتائج دیکھیں ("{searchQuery}") →
                  </button>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'ADMIN' ? (
                /* Admin: Direct Clickable Link to /admin + Logout Button */
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Admin</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    title="Logout Admin"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Customer / Vendor: Profile Dropdown */
                <div className="relative hidden lg:block" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen((prev) => !prev);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-100 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
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
                          currentUser.role === 'VENDOR' ? 'bg-sky-100 text-sky-600' : 'bg-orange-100 text-orange-600'
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
              {currentUser.role === 'ADMIN' ? (
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              ) : currentUser.image ? (
                <img src={currentUser.image} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {currentUser.name[0]}
                </div>
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
