import { createClient } from '@/lib/supabase/server';
import { GoalsOverview } from '@/components/dashboard/goals-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle2, Send } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CareerGoal, JobApplication } from '@/lib/types';

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Dashboard');
    const tStatus = await getTranslations('Statuses');
    const supabase = await createClient();

    // Fetch Goals
    const { data: goals } = await supabase
        .from('career_goals')
        .select('*') as { data: CareerGoal[] | null };

    // Fetch Applications summary
    const { data: apps } = await supabase
        .from('job_applications')
        .select('*')
        .order('updated_at', { ascending: false }) as { data: JobApplication[] | null };

    const stats = [
        {
            label: t('stats.total'),
            value: apps?.length || 0,
            icon: Briefcase,
            color: 'text-blue-500',
        },
        {
            label: t('stats.interviews'),
            value: apps?.filter((a) => a.status === 'Interview').length || 0,
            icon: Send,
            color: 'text-amber-500',
        },
        {
            label: t('stats.offers'),
            value: apps?.filter((a) => a.status === 'Offer').length || 0,
            icon: CheckCircle2,
            color: 'text-primary',
        },
    ];

    // Fetch User Profile for name
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

    const hour = new Date().getHours();
    let greetingKey = 'welcome';
    if (hour < 12) greetingKey = 'greeting.morning';
    else if (hour < 18) greetingKey = 'greeting.afternoon';
    else greetingKey = 'greeting.evening';

    const greetingValue = t(greetingKey);
    const greeting = profile?.full_name
        ? `${greetingValue}, ${profile.full_name}`
        : t('welcome');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                    {greeting}
                </h2>
                <p className="text-muted-foreground mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <GoalsOverview goals={goals || []} />

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t('recentApps')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {apps?.slice(0, 5).map((app) => (
                                <Link
                                    key={app.id}
                                    href={`/${locale}/dashboard/applications/${app.id}`}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                                >
                                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {app.company_name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{app.job_title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{app.company_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground border">
                                            {tStatus(app.status)}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {new Date(app.updated_at).toLocaleDateString(locale)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {(!apps || apps.length === 0) && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>{t('noApps')}</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link href={`/${locale}/dashboard/applications`}>{t('addFirst')}</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('prepTip')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-sm italic">
                                    {t('tipText')}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold">{t('readyQuestion')}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {t('readyDesc')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
