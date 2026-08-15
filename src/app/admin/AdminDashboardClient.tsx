'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Toast } from '@/components/ui/Toast';
import { BookingRecord, BookingStatus } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  FileText,
  User,
  Phone,
  Mail,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  Sparkles,
  LogOut,
} from 'lucide-react';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending_hold' | 'captured' | 'declined'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; action: 'accept' | 'decline' | null; targetId: string | null; isDestructive: boolean }>({ isOpen: false, title: '', message: '', action: null, targetId: null, isDestructive: false });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, slots:booking_slots(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings from Supabase:', error);
      } else if (data) {
        setBookings(data as BookingRecord[]);
      }
    } catch (e) {
      console.error('Failed to query bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    document.cookie = 'handy_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/admin/login');
    router.refresh();
  };

  const triggerAccept = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Capture Funds?',
      message: 'Are you sure you want to capture the payment hold for this booking?',
      action: 'accept',
      targetId: id,
      isDestructive: false
    });
  };

  const triggerDecline = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Decline Booking?',
      message: 'Are you sure you want to decline and release the payment hold?',
      action: 'decline',
      targetId: id,
      isDestructive: true
    });
  };

  const executeAction = async () => {
    const { action, targetId } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    if (!action || !targetId) return;

    setActionLoadingId(targetId);
    try {
      const res = await fetch(`/api/admin/bookings/${targetId}/${action}`, {
        method: 'POST',
      });
      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `Server error (${res.status})` };
      }

      if (res.ok && data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === targetId ? { ...b, status: action === 'accept' ? 'captured' : 'declined' } : b))
        );
        setToast({ message: `Booking successfully ${action}ed.`, type: 'success' });
      } else {
        setToast({ message: data.error || `Failed to ${action} booking hold.`, type: 'error' });
      }
    } catch (err: any) {
      setToast({ message: err.message || `Error occurred while processing action.`, type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics computation
  const pendingHoldCount = bookings.filter((b) => b.status === 'pending_hold').length;
  const capturedCount = bookings.filter((b) => b.status === 'captured').length;
  const declinedCount = bookings.filter((b) => b.status === 'declined').length;
  const totalPendingHoldAmount = bookings
    .filter((b) => b.status === 'pending_hold')
    .reduce((acc, b) => acc + Number(b.total_amount || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending_hold':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Approval
          </span>
        );
      case 'captured':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Captured & Paid
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Declined / Released
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-gray-100 text-gray-800 shrink-0">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bgWarm text-charcoal">
      {/* Responsive Top Header Bar */}
      <header className="bg-primary text-white border-b border-primary-dark sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0"
                title="Return to Public Site"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  <h1 className="font-heading text-base sm:text-xl font-bold leading-tight">
                    Admin Portal
                  </h1>
                </div>
                <p className="text-[11px] text-white/70 hidden sm:block">
                  Handy Maison Île-de-France • Reservation & Hold Operations
                </p>
              </div>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-rose-600 text-white"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* Metric Cards Grid - Fully Responsive 2-col or 4-col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-charcoal-muted font-medium block">
                Total Hold
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1 block">
                {totalPendingHoldAmount} €
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-charcoal-muted font-medium block">
                Pending Holds
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-amber-600 mt-0.5 sm:mt-1 block">
                {pendingHoldCount}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-charcoal-muted font-medium block">
                Captured
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-emerald-600 mt-0.5 sm:mt-1 block">
                {capturedCount}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-charcoal-muted font-medium block">
                Declined
              </span>
              <span className="font-heading text-lg sm:text-2xl font-bold text-rose-600 mt-0.5 sm:mt-1 block">
                {declinedCount}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <XCircle className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Tab Filters - Touch-Swipable Strip */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-charcoal-muted hover:text-primary border border-gray-200'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('pending_hold')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'pending_hold'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-charcoal-muted hover:text-primary border border-gray-200'
            }`}
          >
            Pending ({pendingHoldCount})
          </button>
          <button
            onClick={() => setActiveTab('captured')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'captured'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-charcoal-muted hover:text-primary border border-gray-200'
            }`}
          >
            Captured ({capturedCount})
          </button>
          <button
            onClick={() => setActiveTab('declined')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'declined'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-charcoal-muted hover:text-primary border border-gray-200'
            }`}
          >
            Declined ({declinedCount})
          </button>
        </div>

        {/* Bookings List - Responsive Mobile Cards */}
        {loading ? (
          <div className="p-8 sm:p-12 text-center text-charcoal-muted font-medium bg-white rounded-3xl border border-gray-100 text-sm">
            Loading bookings from Supabase...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-charcoal-muted font-medium bg-white rounded-3xl border border-gray-100 space-y-2 text-sm">
            <p>No booking requests recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-card border border-gray-200/80 hover:border-accent/40 transition-colors space-y-4 sm:space-y-6"
              >
                {/* Header Row: Client Info & Action Bar */}
                <div className="flex flex-col gap-3 pb-4 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-heading text-base sm:text-lg font-bold text-primary">
                        {b.customer_name}
                      </span>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  {/* Client Contact Info */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-charcoal-muted font-medium pt-0.5">
                    <span className="flex items-center gap-1.5 break-all">
                      <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                      {b.customer_email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                      {b.customer_phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      {b.service_address} ({b.city})
                    </span>
                  </div>

                  {/* Total Hold Amount & Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <span className="text-xs text-charcoal-muted">Total Hold Amount:</span>
                      <span className="font-heading text-xl sm:text-2xl font-bold text-primary">
                        {b.total_amount} €
                      </span>
                    </div>

                    {/* Binary Accept / Decline Buttons - Full Width Grid on Mobile */}
                    {b.status === 'pending_hold' && (
                      <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => triggerAccept(b.id)}
                          disabled={actionLoadingId === b.id}
                          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{actionLoadingId === b.id ? 'Processing...' : 'Accept'}</span>
                        </button>

                        <button
                          onClick={() => triggerDecline(b.id)}
                          disabled={actionLoadingId === b.id}
                          className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{actionLoadingId === b.id ? 'Processing...' : 'Decline'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Row: MANDATORY JOB DETAILS NOTES */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Job Notes & Special Instructions:</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed italic break-words">
                    "{b.job_details}"
                  </p>
                </div>

                {/* Bottom Row: Grouped Booking Slots */}
                <div>
                  <h4 className="text-xs font-semibold text-charcoal mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Booked Service Slots:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {b.slots && b.slots.length > 0 ? (
                      b.slots.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 rounded-xl bg-bgWarm border border-gray-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-semibold text-primary">
                            <span>{s.service_name}</span>
                            <span>{s.subtotal} €</span>
                          </div>
                          <div className="text-charcoal-muted text-[11px] flex items-center justify-between pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-accent shrink-0" />
                              {s.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent shrink-0" />
                              {s.start_time}-{s.end_time} ({s.duration_hours}h)
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-charcoal-muted italic">No detailed slots recorded.</span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Custom UI Feedback */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={executeAction}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isDestructive={confirmModal.isDestructive}
      />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
