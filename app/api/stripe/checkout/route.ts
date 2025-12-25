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

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Premium Access - Unlimited Applications',
                            description: 'One-time payment for unlimited job application tracking',
                        },
                        unit_amount: 600, // $6.00 in cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/dashboard/applications`,
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
