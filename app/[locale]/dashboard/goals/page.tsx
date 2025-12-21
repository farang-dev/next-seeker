import { createClient } from '@/lib/supabase/server';
import { GoalEditor } from '@/components/goals/goal-editor';
import { CareerGoal } from '@/lib/types';
import { getTranslations } from 'next-intl/server';

export default async function GoalsPage() {
    const supabase = await createClient();
    const t = await getTranslations('Goals');

    const { data: goals } = await supabase
        .from('career_goals')
        .select('*') as { data: CareerGoal[] | null };

    const getGoal = (type: string) => goals?.find(g => g.type === type) || null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                    {t('title')}
                </h2>
                <p className="text-muted-foreground mt-1">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <GoalEditor type="3-year" initialGoal={getGoal('3-year')} />
                <GoalEditor type="5-year" initialGoal={getGoal('5-year')} />
                <GoalEditor type="10-year" initialGoal={getGoal('10-year')} />
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">{t('whyTitle')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('whyDesc')}
                </p>
            </div>
        </div>
    );
}
