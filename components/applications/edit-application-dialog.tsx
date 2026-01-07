'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { JobApplication, ApplicationStatus, ApplicationPriority } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface EditApplicationDialogProps {
    application: JobApplication;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditApplicationDialog({ application, open, onOpenChange }: EditApplicationDialogProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Applications');
    const tStatus = useTranslations('Statuses');
    const tPriority = useTranslations('Priorities');

    const [company, setCompany] = useState(application.company_name);
    const [title, setTitle] = useState(application.job_title);
    const [url, setUrl] = useState(application.application_url || '');
    const [status, setStatus] = useState<ApplicationStatus>(application.status);
    const [priority, setPriority] = useState<ApplicationPriority>(application.priority);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('job_applications')
                .update({
                    company_name: company,
                    job_title: title,
                    application_url: url,
                    status,
                    priority,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', application.id);

            if (error) throw error;

            toast.success(t('updateSuccess'));
            onOpenChange(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || t('updateError'));
        } finally {
            setLoading(false);
        }
    };

    const statuses: ApplicationStatus[] = ['Draft', 'Applied', 'Interview', 'Offer', 'Rejected', 'Archived'];
    const priorities: ApplicationPriority[] = ['High', 'Medium', 'Low'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('editApplication')}</DialogTitle>
                        <DialogDescription>
                            {t('editDialogSubtitle')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-company">{t('company')}</Label>
                            <Input
                                id="edit-company"
                                required
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">{t('role')}</Label>
                            <Input
                                id="edit-title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-url">{t('jobUrl')} ({t('optional')})</Label>
                            <Input
                                id="edit-url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">{t('status')}</Label>
                                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                    <SelectTrigger id="edit-status">
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
                                <Label htmlFor="edit-priority">{t('priority')}</Label>
                                <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                                    <SelectTrigger id="edit-priority">
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
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('saving') : t('saveChanges')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
