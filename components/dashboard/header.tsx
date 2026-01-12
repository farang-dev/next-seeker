'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, LogOut, Moon, Sun, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PaywallDialog } from '@/components/applications/paywall-dialog';

export function Header({
    user,
    locale,
    hasPremium = false
}: {
    user: User,
    locale: string,
    hasPremium?: boolean
}) {
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Common');
    const [paywallOpen, setPaywallOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <header className="h-16 border-b flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
            <Link href={`/${locale}/dashboard`} className="md:hidden font-bold text-primary hover:opacity-80 transition-opacity">
                Next Seeker
            </Link>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
                {!hasPremium && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPaywallOpen(true)}
                        className="hidden sm:flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">{t('upgrade')}</span>
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <UserIcon className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.email}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-muted-foreground">{t('userProfile')}</span>
                                    {hasPremium && (
                                        <span className="flex items-center gap-0.5 px-1.5 py-0 rounded-full bg-amber-100 dark:bg-amber-900/30 text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            PRO
                                        </span>
                                    )}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/${locale}/dashboard/settings`} className="w-full flex items-center">
                                {t('settings')}
                            </Link>
                        </DropdownMenuItem>
                        {!hasPremium && (
                            <DropdownMenuItem
                                onClick={() => setPaywallOpen(true)}
                                className="text-amber-600 focus:text-amber-600 font-medium"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                {t('upgrade')}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            {t('signOut')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <PaywallDialog
                open={paywallOpen}
                onOpenChange={setPaywallOpen}
            />
        </header>
    );
}
