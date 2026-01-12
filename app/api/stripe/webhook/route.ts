import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature' },
            { status: 400 }
        );
    }

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('Stripe environment variables not configured');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Create a Supabase client with service role for webhook operations
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Supabase environment variables not configured');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id;

            if (!userId) {
                console.error('No user_id in session metadata');
                return NextResponse.json(
                    { error: 'No user_id in metadata' },
                    { status: 400 }
                );
            }

            // Update user's premium status
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({ has_premium: true })
                .eq('id', userId);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                return NextResponse.json(
                    { error: 'Failed to update profile' },
                    { status: 500 }
                );
            }

            // Record the payment
            const paymentId = (session.payment_intent as string) || (session.subscription as string);
            if (paymentId) {
                const { error: paymentError } = await supabaseAdmin
                    .from('payments')
                    .insert({
                        user_id: userId,
                        stripe_payment_intent_id: paymentId,
                        amount: session.amount_total || 0,
                        currency: session.currency || 'usd',
                        status: 'completed',
                    });

                if (paymentError) {
                    console.error('Error recording payment:', paymentError);
                }
            }

            console.log(`Premium access granted to user ${userId}`);
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Find user by customer ID
            const { data: profile, error: findError } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('stripe_customer_id', customerId)
                .single();

            if (profile) {
                await supabaseAdmin
                    .from('profiles')
                    .update({ has_premium: false })
                    .eq('id', profile.id);
                console.log(`Premium access revoked for user ${profile.id} (subscription deleted)`);
            }
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;

            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('stripe_customer_id', customerId)
                .single();

            if (profile) {
                await supabaseAdmin
                    .from('profiles')
                    .update({ has_premium: false })
                    .eq('id', profile.id);
                console.log(`Premium access revoked for user ${profile.id} (payment failed)`);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks
export const runtime = 'nodejs';
