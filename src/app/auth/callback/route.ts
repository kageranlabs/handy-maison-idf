export const runtime = 'edge';

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin/set-password';

  if (code) {
    const cookiesToSetStore: Array<{ name: string; value: string; options?: any }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach((cookie) => cookiesToSetStore.push(cookie));
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(next, request.url);
      const response = NextResponse.redirect(redirectUrl);

      cookiesToSetStore.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    }
  }

  // Fallback error redirect if code exchange fails or code is missing
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
