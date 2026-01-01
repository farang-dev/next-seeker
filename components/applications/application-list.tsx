'use client';

import { useState } from 'react';
import { JobApplication, ApplicationStatus, ApplicationPriority } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Badge
} from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, Download, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { EditApplicationDialog } from './edit-application-dialog';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function ApplicationList({ applications, locale }: { applications: JobApplication[], locale: string }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
    const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const router = useRouter();
    const t = useTranslations('Applications');
    const supabase = createClient();

    const filteredApps = applications.filter((app) => {
        const matchesSearch = app.company_name.toLowerCase().includes(search.toLowerCase()) ||
            app.job_title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'Draft': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            case 'Applied': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Interview': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Offer': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getPriorityColor = (priority: ApplicationPriority) => {
        switch (priority) {
            case 'High': return 'text-rose-600 font-bold';
            case 'Medium': return 'text-amber-600';
            case 'Low': return 'text-slate-500';
        }
    };

    const downloadCSV = () => {
        const headers = ['Company', 'Role', 'Status', 'Priority', 'Applied Date', 'URL'];
        const rows = filteredApps.map(app => [
            app.company_name,
            app.job_title,
            app.status,
            app.priority,
            new Date(app.application_date).toLocaleDateString(),
            app.application_url || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            setSelectedApps(new Set());
        }
        setIsSelectionMode(!isSelectionMode);
    };

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedApps);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedApps(newSelected);
    };

    const toggleAll = () => {
        if (selectedApps.size === filteredApps.length && filteredApps.length > 0) {
            setSelectedApps(new Set());
        } else {
            const newSelected = new Set(filteredApps.map(app => app.id));
            setSelectedApps(newSelected);
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm('Are you sure you want to delete the selected application(s)?')) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .in('id', ids);

            if (error) throw error;

            toast.success(`Successfully deleted ${ids.length} application(s)`);
            setSelectedApps(new Set());
            setIsSelectionMode(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete applications');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('searchPlaceholder')}
                        className="pl-8"
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 items-center">
                    {selectedApps.size > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(Array.from(selectedApps))}
                            disabled={isDeleting}
                            className="gap-2 mr-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete ({selectedApps.size})
                        </Button>
                    )}
                    <Button
                        variant={isSelectionMode ? "secondary" : "outline"}
                        size="sm"
                        onClick={toggleSelectionMode}
                        className="gap-2"
                    >
                        {isSelectionMode ? 'Cancel Selection' : 'Select'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
                        <Download className="h-4 w-4" />
                        {t('downloadCSV')}
                    </Button>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={t('status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allStatus')}</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Interview">Interview</SelectItem>
                            <SelectItem value="Offer">Offer</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={t('priority')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allPriority')}</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {isSelectionMode && (
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={filteredApps.length > 0 && selectedApps.size === filteredApps.length}
                                        onCheckedChange={toggleAll}
                                    />
                                </TableHead>
                            )}
                            <TableHead className="w-[250px]">{t('company')} & {t('role')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead>{t('priority')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map((app) => (
                                <TableRow
                                    key={app.id}
                                    className="cursor-pointer group"
                                    onClick={() => router.push(`/${locale}/dashboard/applications/${app.id}`)}
                                    data-state={selectedApps.has(app.id) ? "selected" : undefined}
                                >
                                    {isSelectionMode && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedApps.has(app.id)}
                                                onCheckedChange={() => toggleSelection(app.id)}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold group-hover:text-primary transition-colors">{app.company_name}</span>
                                            <span className="text-sm text-muted-foreground">{app.job_title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(app.status)}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={getPriorityColor(app.priority)}>{app.priority}</span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(app.application_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/applications/${app.id}`)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setEditingApp(app)}>
                                                        Edit Application
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete([app.id])}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={isSelectionMode ? 6 : 5} className="h-24 text-center text-muted-foreground">
                                    {t('empty')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {editingApp && (
                <EditApplicationDialog
                    application={editingApp}
                    open={!!editingApp}
                    onOpenChange={(open) => !open && setEditingApp(null)}
                />
            )}
        </div>
    );
}
