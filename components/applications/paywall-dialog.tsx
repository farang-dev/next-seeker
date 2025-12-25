'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaywallDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaywallDialog({ open, onOpenChange }: PaywallDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Upgrade error:', error);
            toast.error(error.message || 'Failed to start checkout');
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-4">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        Unlock Unlimited Applications
                    </DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        You've reached the free limit of 10 applications. Upgrade to premium for unlimited tracking!
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="h-6 w-6 text-amber-600" />
                            <div>
                                <h3 className="font-bold text-lg">Premium Access</h3>
                                <p className="text-3xl font-bold text-amber-600">$6</p>
                                <p className="text-sm text-muted-foreground">One-time payment</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">
                                    <strong>Unlimited applications</strong> - Track as many job opportunities as you need
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">
                                    <strong>All features unlocked</strong> - Full access to notes, interviews, and tracking
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">
                                    <strong>Lifetime access</strong> - Pay once, use forever
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">
                                    <strong>Priority support</strong> - Get help when you need it
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Secure payment powered by Stripe. Your data is safe and encrypted.
                    </p>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                        size="lg"
                    >
                        {loading ? 'Redirecting to checkout...' : 'Upgrade to Premium'}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="ghost"
                        className="w-full"
                        disabled={loading}
                    >
                        Maybe later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
