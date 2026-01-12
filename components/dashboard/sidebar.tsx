'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Briefcase,
    Target,
    Settings,
    LogOut,
    Newspaper,
    Sparkles
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PaywallDialog } from '@/components/applications/paywall-dialog';

const navItems = [
    { icon: LayoutDashboard, label: 'dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'applications', href: '/dashboard/applications' },
    { icon: Target, label: 'goals', href: '/dashboard/goals' },
    { icon: Newspaper, label: 'blog', href: '/blog' },
    { icon: Settings, label: 'settings', href: '/dashboard/settings' },
];

export function Sidebar({ locale, hasPremium = false }: { locale: string, hasPremium?: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Common');
    const [paywallOpen, setPaywallOpen] = useState(false);
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <aside className="w-64 border-r bg-muted/20 hidden md:flex flex-col">
            <div className="p-6">
                <Link href={`/${locale}/dashboard`} className="hover:opacity-80 transition-opacity">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Target className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-none">Next Seeker</span>
                            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
                                {t('subtitle')}
                            </span>
                        </div>
                    </h1>
                </Link>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => {
                    const href = `/${locale}${item.href}`;
                    const isActive = pathname === href || (item.href !== '/dashboard' && pathname.startsWith(href));

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {t(item.label)}
                        </Link>
                    );
                })}

                {!hasPremium && (
                    <div className="mt-8 px-2">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                {t('premium')}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                                {t('sidebarUpgradeDesc')}
                            </p>
                            <button
                                onClick={() => setPaywallOpen(true)}
                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                            >
                                {t('upgradeNow')}
                            </button>
                        </div>
                    </div>
                )}
            </nav>
            <div className="p-4 border-t flex flex-col gap-2">
                {hasPremium && (
                    <div className="px-3 py-1 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-500">
                        <Sparkles className="w-3 h-3" />
                        PREMIUM ACCOUNT
                    </div>
                )}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                </button>
            </div>

            <PaywallDialog
                open={paywallOpen}
                onOpenChange={setPaywallOpen}
            />
        </aside>
    );
}
