import { createClient } from '@/lib/supabase/server';
import { ApplicationList } from '@/components/applications/application-list';
import { AddApplicationDialog } from '@/components/applications/add-application-dialog';
import { getTranslations } from 'next-intl/server';
import { JobApplication } from '@/lib/types';
import { Sparkles, Lock } from 'lucide-react';

export default async function ApplicationsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Applications');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Get premium status
    const { data: profile } = await supabase
        .from('profiles')
        .select('has_premium')
        .eq('id', user?.id || '')
        .single();

    const hasPremium = profile?.has_premium || false;

    const { data: applications } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false }) as { data: JobApplication[] | null };

    const statsT = await getTranslations('Dashboard.stats');

    const stats = {
        total: applications?.length || 0,
        applied: applications?.filter(a => a.status === 'Applied').length || 0,
        interview: applications?.filter(a => a.status === 'Interview').length || 0,
        offers: applications?.filter(a => a.status === 'Offer').length || 0
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-primary">
                            {t('title')}
                        </h2>
                        {hasPremium ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                                <Sparkles className="h-3 w-3" />
                                Premium
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                <Lock className="h-3 w-3" />
                                Free ({stats.total}/10)
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {t('subtitle')}
                    </p>
                </div>
                <AddApplicationDialog />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">{statsT('total')}</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">{statsT('applied')}</p>
                    <p className="text-2xl font-bold text-blue-500">{stats.applied}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">{statsT('interviews')}</p>
                    <p className="text-2xl font-bold text-amber-500">{stats.interview}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">{statsT('offers')}</p>
                    <p className="text-2xl font-bold text-emerald-500">{stats.offers}</p>
                </div>
            </div>

            <ApplicationList
                applications={applications || []}
                locale={locale}
            />
        </div>
    );
}
