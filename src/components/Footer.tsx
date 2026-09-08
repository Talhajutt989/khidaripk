'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Phone, Mail, MapPin, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data';

const PAYMENT_BADGES = [
  { name: 'COD', label: 'Cash on Delivery', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'JazzCash', label: 'JazzCash', color: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'Easypaisa', label: 'Easypaisa', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'SadaPay', label: 'SadaPay', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: '1Link', label: '1Link / Visa', color: 'bg-sky-100 text-sky-700 border-sky-200' },
];

const COURIERS = [
  { name: 'TCS', color: 'bg-red-500' },
  { name: 'Leopard', color: 'bg-yellow-500' },
  { name: 'Trax', color: 'bg-blue-500' },
];

const TRUST_BADGES = [
  { icon: <Shield className="w-4 h-4" />, text: '100% Secure Payments' },
  { icon: <Truck className="w-4 h-4" />, text: 'Nationwide Delivery' },
  { icon: <RotateCcw className="w-4 h-4" />, text: '7-Day Easy Returns' },
  { icon: <Star className="w-4 h-4" />, text: 'Verified Sellers Only' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Trust Bar */}
      <div className="border-b border-slate-800" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-400"
                  style={{ background: 'rgba(249,115,22,0.15)' }}>
                  {badge.icon}
                </div>
                <span className="text-xs font-semibold text-slate-300">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl">Kharidari<span className="text-orange-400">.pk</span></span>
                <span className="block text-[9px] uppercase tracking-widest text-sky-400 -mt-0.5">Pakistan ka Online Bazaar</span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              پاکستان کا سب سے بڑا multi-vendor marketplace — verified sellers, secure payments، اور nationwide delivery۔
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-green-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                WhatsApp: +92 300 1234567
              </a>
              <a href="tel:+920213456789"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-orange-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                UAN: 021-111-KHARIDARI
              </a>
              <a href="mailto:support@kharidari.pk"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-sky-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                support@kharidari.pk
              </a>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>Suite 404, Tower A, Dolmen City,<br />Clifton, Karachi — 75600</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-orange-500 inline-block" />
              Categories
            </h4>
            <ul className="space-y-2">
              {INITIAL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`}
                    className="text-xs text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.name}
                    {cat.deliveryType === 'HYPER_LOCAL' && (
                      <span className="badge-green text-[9px]">Local</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyer Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-sky-500 inline-block" />
              Buyer Help
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/orders', label: 'Track My Order' },
                { href: '/checkout', label: 'Checkout' },
                { href: '/stores', label: 'All Stores' },
                { href: '#', label: 'Return & Refund Policy' },
                { href: '#', label: 'Delivery Info' },
                { href: '#', label: 'FAQs' },
                { href: '#', label: 'Contact Support' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href}
                    className="text-xs text-slate-400 hover:text-sky-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Links + Payments */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block" />
              Sell on Kharidari
            </h4>
            <ul className="space-y-2 mb-6">
              {[
                { href: '/vendor', label: 'Seller Registration' },
                { href: '/vendor', label: 'KYC Verification' },
                { href: '/vendor', label: 'Seller Dashboard' },
                { href: '#', label: 'Commission Structure' },
                { href: '#', label: 'Payout Policy (7-Day Escrow)' },
                { href: '#', label: 'Courier Integration' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <h5 className="text-xs font-bold text-slate-300 mb-2">Accepted Payments</h5>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_BADGES.map((pm) => (
                <span key={pm.name}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${pm.color}`}>
                  {pm.name}
                </span>
              ))}
            </div>

            {/* Courier Partners */}
            <h5 className="text-xs font-bold text-slate-300 mb-2 mt-4">Courier Partners</h5>
            <div className="flex gap-2">
              {COURIERS.map((c) => (
                <div key={c.name}
                  className={`${c.color} px-2 py-0.5 rounded-md text-[10px] font-black text-white`}>
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2024 Kharidari.pk Pvt. Ltd. — SECP Registered | NTN: 1234567-8</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-300">Seller Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
