'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Attempt Supabase Auth login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Invalid administrator credentials');
      }

      if (data?.session) {
        window.location.href = '/admin';
      } else {
        throw new Error('Authentication session error');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Administrator login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgWarm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-gray-200/80 max-w-md w-full space-y-6">
        
        {/* Primary Branding Image using favicon.png */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-primary/5 p-2.5 mx-auto flex items-center justify-center border border-primary/10">
            <Image
              src="/favicon.png"
              alt="Handy Maison Logo"
              width={56}
              height={56}
              priority
              className="object-contain"
            />
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-primary text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Secure Admin Portal
            </span>
            <h1 className="font-heading text-2xl font-bold text-primary mt-2">
              Administrator Login
            </h1>
            <p className="text-xs text-charcoal-muted">
              Handy Maison Île-de-France • Authentication Required
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="handymaison.idf@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-primary text-white font-heading font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 pt-4"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-accent-light" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-charcoal-muted">
            Restricted access for authorized Handy Maison administrative personnel only.
          </p>
        </div>

      </div>
    </div>
  );
}
