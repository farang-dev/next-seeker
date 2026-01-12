import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover' as any,
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get stripe customer id from profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'No stripe customer found' }, { status: 400 });
        }

        const { locale, returnPath } = await req.json();
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Prepare return URL with locale prefix if needed
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        const fullReturnPath = `${localePrefix}${returnPath || '/dashboard/settings'}`;

        // Create portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${origin}${fullReturnPath}`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error('Portal session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
