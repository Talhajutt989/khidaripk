'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { PAKISTAN_CITIES } from '@/lib/geo';
import {
  X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff,
  ShoppingBag, CheckCircle2, MessageCircle, ArrowRight
} from 'lucide-react';

export function AuthModal() {
  const { authModal, closeAuthModal, loginUser, registerUser } = useMarketplaceStore();
  const [mode, setMode] = useState<'login' | 'signup'>(authModal.mode);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');

  if (!authModal.isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = loginUser(email, password);
    setIsLoading(false);
    if (ok) { setSuccess(true); setTimeout(() => closeAuthModal(), 1000); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const ok = registerUser({
      name: fullName,
      email: regEmail,
      phone,
      whatsappNumber: phone,
      city,
      deliveryAddress: address,
      password: regPassword,
    });
    setIsLoading(false);
    if (ok) { setSuccess(true); setTimeout(() => closeAuthModal(), 1200); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="bg-orange-gradient p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-black text-lg">Kharidari<span className="text-orange-200">.pk</span></span>
                  <p className="text-orange-100 text-[10px] -mt-0.5">Pakistan's Online Bazaar</p>
                </div>
              </div>
              <button
                onClick={closeAuthModal}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white/15 rounded-xl p-1">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login' ? 'bg-white text-orange-600' : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'signup' ? 'bg-white text-orange-600' : 'text-white/80 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sky-400/20 rounded-full" />
        </div>

        {/* Success State */}
        {success && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">خوش آمدید! 🎉</h3>
            <p className="text-sm text-slate-500 mt-1">آپ کامیابی سے login ہو گئے</p>
          </div>
        )}

        {/* Login Form */}
        {!success && mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-4 text-center">
                Demo: <strong>sana@gmail.com</strong> / <strong>bilal@techzone.pk</strong> / <strong>admin@kharidari.pk</strong>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login کریں</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Account نہیں ہے؟{' '}
              <button type="button" onClick={() => setMode('signup')} className="text-orange-500 font-semibold hover:underline">
                ابھی Register کریں
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {!success && mode === 'signup' && (
          <form onSubmit={handleRegister} className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name / پورا نام *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                  WhatsApp / Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="input-field pl-10"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Order updates WhatsApp پر آئیں گی</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field pl-10 appearance-none"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="input-field pl-10 pr-8"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House#, Street, Area"
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Account بنائیں</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              Register کر کے آپ ہماری Terms & Privacy Policy سے متفق ہیں
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
