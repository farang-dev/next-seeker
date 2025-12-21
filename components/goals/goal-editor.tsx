'use client';

import { useState } from 'react';
import { CareerGoal, CareerGoalType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Target, Calendar, Clock, Save, Loader2 } from 'lucide-react';

export function GoalEditor({
    type,
    initialGoal
}: {
    type: CareerGoalType;
    initialGoal: CareerGoal | null
}) {
    const [goal, setGoal] = useState<Partial<CareerGoal>>(initialGoal || { type, title: '', description: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const goalData = {
                user_id: user.id,
                type,
                title: goal.title || '',
                description: goal.description || '',
                notes: goal.notes || '',
                updated_at: new Date().toISOString(),
            };

            let error;
            if (initialGoal?.id) {
                ({ error } = await supabase
                    .from('career_goals')
                    .update(goalData)
                    .eq('id', initialGoal.id));
            } else {
                ({ error } = await supabase
                    .from('career_goals')
                    .insert([goalData]));
            }

            if (error) throw error;
            toast.success(`${type} goal updated!`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = () => {
        switch (type) {
            case '3-year': return Calendar;
            case '5-year': return Target;
            case '10-year': return Clock;
        }
    };
    const Icon = getIcon();

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{type} Goal</CardTitle>
                </div>
                <CardDescription>
                    Where do you see yourself in {type.split('-')[0]}s?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                    <Label>Goal Title</Label>
                    <Input
                        placeholder="e.g. Senior Full Stack Engineer"
                        value={goal.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoal({ ...goal, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="What does success look like?"
                        className="min-h-[100px]"
                        value={goal.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoal({ ...goal, description: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Notes / Roadmap</Label>
                    <Textarea
                        placeholder="Specific skills to learn or milestones..."
                        className="min-h-[100px]"
                        value={goal.notes || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoal({ ...goal, notes: e.target.value })}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} className="w-full" disabled={loading}>
                    {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Goal
                </Button>
            </CardFooter>
        </Card>
    );
}
