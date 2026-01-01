import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe is not configured' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
        });

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('has_premium, stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (profile?.has_premium) {
            return NextResponse.json({ hasPremium: true });
        }

        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ hasPremium: false, message: 'No customer ID found' });
        }

        // Check recent paid sessions for this customer
        const sessions = await stripe.checkout.sessions.list({
            customer: profile.stripe_customer_id,
            status: 'complete',
            expand: ['data.payment_intent'],
            limit: 5,
        });

        const paidSession = sessions.data.find(session =>
            session.payment_status === 'paid'
        );

        if (paidSession) {
            // Update profile
            await supabase
                .from('profiles')
                .update({ has_premium: true })
                .eq('id', user.id);

            // Optionally record payment if not exists (simplified here)

            return NextResponse.json({ hasPremium: true, recovered: true });
        }

        return NextResponse.json({ hasPremium: false });

    } catch (error: any) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
