import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/settings';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export async function proxy(request: NextRequest) {
    // 1. Run intl middleware first
    const response = intlMiddleware(request);

    // 2. Pass the response from intl to updateSession to preserve its headers/cookies
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
