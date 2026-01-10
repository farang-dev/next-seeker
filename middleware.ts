import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';
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
    return await updateSession(request, response);
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
