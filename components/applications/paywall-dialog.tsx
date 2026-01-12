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
import { useLocale, useTranslations } from 'next-intl';

interface PaywallDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaywallDialog({ open, onOpenChange }: PaywallDialogProps) {
    const [loading, setLoading] = useState(false);

    const locale = useLocale();
    const t = useTranslations('Paywall');
    const tPricing = useTranslations('Pricing');

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    locale,
                    returnPath: window.location.pathname,
                }),
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
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="h-6 w-6 text-amber-600" />
                            <div>
                                <h3 className="font-bold text-lg">{tPricing('premium.name')}</h3>
                                <p className="text-3xl font-bold text-amber-600">{tPricing('premium.price')}</p>
                                <p className="text-sm text-muted-foreground">{tPricing('premium.period')}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {([0, 1, 2, 3] as const).map((i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm">
                                        {tPricing(`premium.features.${i}`)}
                                    </p>
                                </div>
                            ))}
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
                        {loading ? t('processing') : t('cta')}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="ghost"
                        className="w-full"
                        disabled={loading}
                    >
                        {t('maybeLater')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
