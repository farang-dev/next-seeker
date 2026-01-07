'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PaywallDialog } from './paywall-dialog';
import { useTranslations } from 'next-intl';
import { ApplicationStatus, ApplicationPriority } from '@/lib/types';

export function AddApplicationDialog() {
    const t = useTranslations('Applications');
    const tStatus = useTranslations('Statuses');
    const tPriority = useTranslations('Priorities');

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [hasPremium, setHasPremium] = useState(false);
    const [applicationCount, setApplicationCount] = useState(0);
    const router = useRouter();
    const supabase = createClient();

    // Form state
    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<ApplicationStatus>('Draft');
    const [priority, setPriority] = useState<ApplicationPriority>('Medium');

    // Check premium status and application count
    useEffect(() => {
        const checkPremiumStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get premium status
            const { data: profile } = await supabase
                .from('profiles')
                .select('has_premium')
                .eq('id', user.id)
                .single();

            setHasPremium(profile?.has_premium || false);

            // Get application count
            const { count } = await supabase
                .from('job_applications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            setApplicationCount(count || 0);
        };

        if (open) {
            checkPremiumStatus();
        }
    }, [open, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Check if user has reached the limit
            if (!hasPremium && applicationCount >= 10) {
                setOpen(false);
                setShowPaywall(true);
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('job_applications').insert([
                {
                    user_id: user.id,
                    company_name: company,
                    job_title: title,
                    application_url: url,
                    status,
                    priority,
                    application_date: new Date().toISOString().split('T')[0],
                },
            ]);

            if (error) throw error;

            toast.success(t('addSuccess'));
            setOpen(false);
            router.refresh();

            // Reset form
            setCompany('');
            setTitle('');
            setUrl('');
            setStatus('Draft');
            setPriority('Medium');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const statuses: ApplicationStatus[] = ['Draft', 'Applied', 'Interview', 'Offer', 'Rejected', 'Archived'];
    const priorities: ApplicationPriority[] = ['High', 'Medium', 'Low'];

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        {t('addNew')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{t('addTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('addDesc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="company">{t('companyLabel')}</Label>
                                <Input
                                    id="company"
                                    required
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">{t('jobTitleLabel')}</Label>
                                <Input
                                    id="title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="url">{t('jobUrlLabel')}</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">{t('statusLabel')}</Label>
                                    <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map(s => (
                                                <SelectItem key={s} value={s}>{tStatus(s)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">{t('priorityLabel')}</Label>
                                    <Select value={priority} onValueChange={(v) => setPriority(v as ApplicationPriority)}>
                                        <SelectTrigger id="priority">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map(p => (
                                                <SelectItem key={p} value={p}>{tPriority(p)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? t('adding') : t('addNew')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
        </>
    );
}
