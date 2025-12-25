import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PaymentSuccessPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Verify premium status
    const { data: profile } = await supabase
        .from('profiles')
        .select('has_premium')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Welcome to Premium! 🎉
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Your payment was successful and premium access has been activated.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                        <h2 className="font-semibold text-lg">You now have access to:</h2>
                    </div>
                    <ul className="space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Unlimited job application tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>All premium features unlocked</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Priority customer support</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>Lifetime access - no recurring fees</span>
                        </li>
                    </ul>
                </div>

                <div className="pt-4 space-y-3">
                    <Link href="/dashboard/applications">
                        <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                        >
                            Start Adding Applications
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg" className="w-full">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-muted-foreground">
                    Thank you for your support! If you have any questions, feel free to reach out.
                </p>
            </div>
        </div>
    );
}
