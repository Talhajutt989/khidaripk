'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { PAKISTAN_CITIES } from '@/lib/geo';
import {
  X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff,
  ShoppingBag, CheckCircle2, MessageCircle, ArrowRight, AlertCircle
} from 'lucide-react';

// ── Password strength validator ──────────────────
// Must be 8+ chars AND have at least one special char OR one digit+letter mix
function validatePassword(pw: string): { valid: boolean; message: string } {
  if (pw.length === 0) return { valid: false, message: '' };
  if (pw.length < 8) return { valid: false, message: 'Password کم از کم 8 حروف کا ہونا ضروری ہے' };
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasDigitOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pw);
  if (!hasLetter || !hasDigitOrSpecial) {
    return { valid: false, message: 'Password میں کم از کم ایک حرف اور ایک نمبر/special character ہونا ضروری ہے (مثال: $%Talhaj8)' };
  }
  return { valid: true, message: '' };
}

// ── Phone validator: exactly 11 digits starting with 03 ──
function validatePhone(raw: string): { valid: boolean; message: string; digits: string } {
  // Remove spaces, dashes, +92, 0092 prefixes
  let digits = raw.replace(/[\s\-]/g, '');
  if (digits.startsWith('+92')) digits = '0' + digits.slice(3);
  else if (digits.startsWith('0092')) digits = '0' + digits.slice(4);

  if (digits.length === 0) return { valid: false, message: '', digits };
  if (!/^\d+$/.test(digits)) return { valid: false, message: 'برائے مہربانی صرف نمبرز لکھیں', digits };
  if (!digits.startsWith('03')) return { valid: false, message: 'نمبر 03 سے شروع ہونا چاہیے (مثال: 03215242744)', digits };
  if (digits.length !== 11) return { valid: false, message: `پاکستانی نمبر 11 ہندسوں کا ہوتا ہے — آپ نے ${digits.length} لکھے (مثال: 03215242744)`, digits };
  return { valid: true, message: '', digits };
}

export function AuthModal() {
  const router = useRouter();
  const { authModal, closeAuthModal, loginUser, registerUser } = useMarketplaceStore();
  const [mode, setMode] = useState<'login' | 'signup'>(authModal.mode);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');

  // Derived validations
  const pwValidation = validatePassword(regPassword);
  const phoneValidation = validatePhone(phone);

  if (!authModal.isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = loginUser(email, password);
    setIsLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        closeAuthModal();
        if (email.toLowerCase() === 'admin@kharidari.pk') {
          router.push('/admin');
        }
      }, 1000);
    } else {
      setLoginError('Email یا Password غلط ہے۔ دوبارہ کوشش کریں یا نیچے دی گئی demo emails استعمال کریں۔');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwValidation.valid || !phoneValidation.valid) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const ok = registerUser({
      name: fullName,
      email: regEmail,
      phone: phoneValidation.digits,
      whatsappNumber: phoneValidation.digits,
      city,
      deliveryAddress: address,
      password: regPassword,
    });
    setIsLoading(false);
    if (ok) { setSuccess(true); setTimeout(() => closeAuthModal(), 1200); }
  };

  const isRegisterDisabled =
    isLoading ||
    !fullName ||
    !regEmail ||
    !phoneValidation.valid ||
    !pwValidation.valid;

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
                onClick={() => { setMode('login'); setLoginError(''); }}
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

        {/* ── Login Form ── */}
        {!success && mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-4 text-center">
                Demo: <strong>sana@gmail.com</strong> / <strong>bilal@techzone.pk</strong> / <strong>admin@kharidari.pk</strong>
              </p>
            </div>

            {/* Login Error Banner */}
            {loginError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-semibold">{loginError}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
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
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
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

        {/* ── Register Form ── */}
        {!success && mode === 'signup' && (
          <form onSubmit={handleRegister} className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">
            {/* Full Name */}
            <div className="space-y-1">
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

            {/* Email */}
            <div className="space-y-1">
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

            {/* WhatsApp / Phone — Pakistan only, 11 digits */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                WhatsApp / Phone * (Pakistan 🇵🇰)
              </label>
              <div className="flex gap-0">
                {/* Locked country code badge */}
                <div className="flex items-center gap-1 px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-sm font-bold text-slate-600 shrink-0 select-none">
                  🇵🇰 +92
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    // Allow only digits, spaces, dashes
                    const val = e.target.value.replace(/[^0-9\s\-]/g, '');
                    setPhone(val);
                  }}
                  placeholder="03215242744"
                  maxLength={13}
                  className={`input-field flex-1 rounded-l-none border-l-0 ${
                    phone.length > 0 && !phoneValidation.valid
                      ? '!border-red-400 !bg-red-50 !text-red-700 focus:!border-red-500 focus:!ring-red-500'
                      : phone.length > 0 && phoneValidation.valid
                      ? '!border-emerald-400 !bg-emerald-50 focus:!border-emerald-500'
                      : ''
                  }`}
                />
              </div>
              {phone.length > 0 && !phoneValidation.valid && (
                <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {phoneValidation.message}
                </p>
              )}
              {phone.length > 0 && phoneValidation.valid && (
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  ✅ نمبر درست ہے — WhatsApp updates اس نمبر پر آئیں گی
                </p>
              )}
              {phone.length === 0 && (
                <p className="text-[10px] text-slate-400">صرف 11 ہندسے (مثال: 03215242744)</p>
              )}
            </div>

            {/* City + Password in a row */}
            <div className="grid grid-cols-2 gap-3">
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
                    placeholder="$%Talhaj8"
                    className={`input-field pl-10 pr-8 ${
                      regPassword.length > 0 && !pwValidation.valid
                        ? '!border-red-400 !bg-red-50 focus:!border-red-500'
                        : regPassword.length > 0 && pwValidation.valid
                        ? '!border-emerald-400 !bg-emerald-50 focus:!border-emerald-500'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-3 text-slate-400"
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {/* Password strength hint */}
                {regPassword.length > 0 && !pwValidation.valid && (
                  <p className="text-[9px] text-red-500 font-semibold leading-tight">{pwValidation.message}</p>
                )}
                {regPassword.length > 0 && pwValidation.valid && (
                  <p className="text-[9px] text-emerald-600 font-semibold">✅ مضبوط Password</p>
                )}
                {regPassword.length === 0 && (
                  <p className="text-[9px] text-slate-400">8+ حروف + نمبر/special char</p>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House#, Street, Area"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isRegisterDisabled}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              Register کر کے آپ ہماری Terms &amp; Privacy Policy سے متفق ہیں
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
