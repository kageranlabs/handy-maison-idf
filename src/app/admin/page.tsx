export const runtime = 'edge';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import { BookingRecord } from '@/lib/types';

export default async function AdminPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cookie set fallback
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Strict server-side authorization gate at the top of the main server component
  if (!session || !user || user.email !== 'handymaison.idf@gmail.com') {
    redirect('/admin/login');
  }

  // Server-side initial data query
  const { data } = await supabase
    .from('bookings')
    .select('*, slots:booking_slots(*)')
    .order('created_at', { ascending: false });

  const initialBookings = (data as BookingRecord[]) || [];

  return <AdminDashboardClient initialBookings={initialBookings} />;
}
