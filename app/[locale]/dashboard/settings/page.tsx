import { SettingsForm } from '@/components/settings/settings-form';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Common');
    const settingsT = await getTranslations('Settings');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('has_premium, stripe_customer_id')
        .eq('id', user?.id || '')
        .single();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                    {t('settings')}
                </h2>
                <p className="text-muted-foreground mt-1">
                    {settingsT('settingsDesc')}
                </p>
            </div>

            <div className="max-w-2xl">
                <SettingsForm
                    locale={locale}
                    hasPremium={profile?.has_premium || false}
                    hasStripeCustomer={!!profile?.stripe_customer_id}
                />
            </div>
        </div>
    );
}
