import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales } from './i18n/settings';

const intlMiddleware = createMiddleware({
    locales: locales,
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
    // 1. Skip middleware for API routes and static assets
    if (
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/images') ||
        request.nextUrl.pathname.startsWith('/favicon.ico')
    ) {
        return;
    }

    // 2. Run next-intl middleware for internationalization
    const response = intlMiddleware(request);

    // 3. Update Supabase session
    // We pass the response from intlMiddleware so that both i18n cookies and auth cookies are preserved
    const supabaseResponse = await updateSession(request, response);

    // 4. Handle Redirections
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;
    const pathParts = pathname.split('/');
    const locale = locales.includes(pathParts[1] as any) ? pathParts[1] : 'en';

    // Check if the current page is login or signup
    const isLoginPage = pathname.endsWith('/login') || pathname.endsWith('/signup');
    const isDashboardPage = pathname.includes('/dashboard');

    // Redirect logged-in users away from login/signup page to dashboard
    if (user && isLoginPage) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // Redirect logged-out users away from dashboard to login page
    if (!user && isDashboardPage) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        // Match all pathnames except for:
        // - /api/keystatic (Keystatic API)
        // - /keystatic (Keystatic Admin)
        // - /_next (Next.js internals)
        // - /_static (inside /public)
        // - /_vercel (Vercel internals)
        // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
        '/((?!api/keystatic|keystatic|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
