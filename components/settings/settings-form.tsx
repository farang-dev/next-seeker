'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Moon, Sun, Laptop, Languages, CreditCard, Sparkles, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function SettingsForm({
    locale,
    hasPremium = false,
    hasStripeCustomer = false
}: {
    locale: string,
    hasPremium?: boolean,
    hasStripeCustomer?: boolean
}) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Settings');
    const [loadingPortal, setLoadingPortal] = useState(false);

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale as any });
    };

    const handleManageSubscription = async () => {
        setLoadingPortal(true);
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    locale,
                    returnPath: '/dashboard/settings',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to open portal');
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Portal error:', error);
            toast.error(error.message || 'Failed to open subscription management');
            setLoadingPortal(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Subscription Section for Premium Users */}
            {hasPremium && hasStripeCustomer && (
                <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            {t('subscription')}
                        </CardTitle>
                        <CardDescription>{t('subscriptionDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-background border">
                            <div className="space-y-1">
                                <p className="font-medium flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Next Seeker Premium
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('activeSubscription')}
                                </p>
                            </div>
                            <Button
                                onClick={handleManageSubscription}
                                disabled={loadingPortal}
                                variant="outline"
                                className="gap-2"
                            >
                                {loadingPortal ? t('opening') : (
                                    <>
                                        {t('manageSubscription')}
                                        <ExternalLink className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-primary" />
                        {t('appearance')}
                    </CardTitle>
                    <CardDescription>{t('appearanceDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('theme')}</Label>
                            <p className="text-sm text-muted-foreground">{t('themeDesc')}</p>
                        </div>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('selectTheme')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" /> {t('light')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" /> {t('dark')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                        <Laptop className="h-4 w-4" /> {t('system')}
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" />
                        {t('language')}
                    </CardTitle>
                    <CardDescription>{t('languageDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('interfaceLanguage')}</Label>
                            <p className="text-sm text-muted-foreground">{t('interfaceLanguageDesc')}</p>
                        </div>
                        <Select value={locale} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('selectLanguage')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
                    <CardDescription>{t('dangerZoneDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">{t('deleteAccount')}</Button>
                </CardContent>
            </Card>
        </div>
    );
}
