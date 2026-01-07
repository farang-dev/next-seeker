'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Briefcase,
    Target,
    Settings,
    LogOut
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
    { icon: LayoutDashboard, label: 'dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'applications', href: '/dashboard/applications' },
    { icon: Target, label: 'goals', href: '/dashboard/goals' },
    { icon: Settings, label: 'settings', href: '/dashboard/settings' },
];

export function Sidebar({ locale }: { locale: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Common');

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
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                </button>
            </div>
        </aside>
    );
}
