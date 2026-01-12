import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        // Initialize Stripe only when needed
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

        // Check if user already has premium
        const { data: profile } = await supabase
            .from('profiles')
            .select('has_premium, stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (profile?.has_premium) {
            return NextResponse.json(
                { error: 'You already have premium access' },
                { status: 400 }
            );
        }

        // Get or create Stripe customer
        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID to profile
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        // Parse request body for locale and return path
        let locale = 'en';
        let returnPath = '/dashboard/applications';

        try {
            const body = await req.json();
            if (body.locale) locale = body.locale;
            if (body.returnPath) returnPath = body.returnPath;
        } catch (e) {
            // Body might be empty, use defaults
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Next Seeker Premium Plan',
                            description: 'Monthly subscription for unlimited job application tracking and career goal insights',
                        },
                        unit_amount: 300, // $3.00 in cents
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/${locale}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}${returnPath}`,
            allow_promotion_codes: true,
            metadata: {
                user_id: user.id,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
