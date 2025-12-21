'use client';

import { CareerGoal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GoalsOverview({ goals }: { goals: CareerGoal[] }) {
    const t = useTranslations('Goals');

    const goalTypes = [
        { type: '3-year', label: t('threeYear'), icon: Calendar },
        { type: '5-year', label: t('fiveYear'), icon: Target },
        { type: '10-year', label: t('tenYear'), icon: Clock },
    ] as const;

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {goalTypes.map((gt) => {
                const goal = goals.find((g) => g.type === gt.type);
                return (
                    <Card key={gt.type} className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{gt.label}</CardTitle>
                            <gt.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold truncate">
                                {goal?.title || "Not set yet"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {goal?.description || "Click to set your goal"}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
