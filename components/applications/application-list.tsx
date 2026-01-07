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
import { Search, MoreHorizontal, Download, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
import { cn } from '@/lib/utils';

export function ApplicationList({ applications, locale }: { applications: JobApplication[], locale: string }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
    const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: 'company' | 'status' | 'priority' | 'date' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    const router = useRouter();
    const t = useTranslations('Applications');
    const tStatus = useTranslations('Statuses');
    const tPriority = useTranslations('Priorities');
    const supabase = createClient();

    const statusOrder: Record<ApplicationStatus, number> = {
        'Draft': 1,
        'Applied': 2,
        'Interview': 3,
        'Offer': 4,
        'Rejected': 5,
        'Archived': 6
    };

    const priorityOrder: Record<ApplicationPriority, number> = {
        'High': 3,
        'Medium': 2,
        'Low': 1
    };

    const filteredApps = [...applications].filter((app) => {
        const matchesSearch = app.company_name.toLowerCase().includes(search.toLowerCase()) ||
            app.job_title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
        if (!sortConfig.key) return 0;

        const direction = sortConfig.direction === 'asc' ? 1 : -1;

        if (sortConfig.key === 'company') {
            return a.company_name.localeCompare(b.company_name) * direction;
        }
        if (sortConfig.key === 'status') {
            return (statusOrder[a.status] - statusOrder[b.status]) * direction;
        }
        if (sortConfig.key === 'priority') {
            return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
        }
        if (sortConfig.key === 'date') {
            return (new Date(a.application_date).getTime() - new Date(b.application_date).getTime()) * direction;
        }
        return 0;
    });

    const toggleSort = (key: 'company' | 'status' | 'priority' | 'date') => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

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
        if (!confirm(t('confirmDelete'))) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .in('id', ids);

            if (error) throw error;

            toast.success(t('deleteSuccess', { count: ids.length }));
            setSelectedApps(new Set());
            setIsSelectionMode(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || t('deleteError'));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<JobApplication>) => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            router.refresh();
            toast.success(t('updateSuccess'));
        } catch (error: any) {
            toast.error(error.message || t('updateError'));
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
                            {t('deleteSelected', { count: selectedApps.size })}
                        </Button>
                    )}
                    <Button
                        variant={isSelectionMode ? "secondary" : "outline"}
                        size="sm"
                        onClick={toggleSelectionMode}
                        className="gap-2"
                    >
                        {isSelectionMode ? t('cancelSelection') : t('select')}
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
                            {(Object.keys(statusOrder) as ApplicationStatus[]).map(s => (
                                <SelectItem key={s} value={s}>{tStatus(s)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={t('priority')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allPriority')}</SelectItem>
                            {(Object.keys(priorityOrder) as ApplicationPriority[]).map(p => (
                                <SelectItem key={p} value={p}>{tPriority(p)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <Table className="min-w-[900px] table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className={cn(
                                    "transition-all duration-300 ease-in-out p-0",
                                    isSelectionMode ? "w-12 px-4 opacity-100" : "w-0 opacity-0 overflow-hidden"
                                )}
                            >
                                <Checkbox
                                    checked={filteredApps.length > 0 && selectedApps.size === filteredApps.length}
                                    onCheckedChange={toggleAll}
                                    className={cn(!isSelectionMode && "hidden")}
                                />
                            </TableHead>
                            <TableHead
                                className="w-56 cursor-pointer hover:bg-muted/50 transition-colors group/head"
                                onClick={() => toggleSort('company')}
                            >
                                <div className="flex items-center gap-1">
                                    {t('company')}
                                    {sortConfig.key === 'company' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-50 transition-opacity" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="w-56">{t('role')}</TableHead>
                            <TableHead
                                className="w-28 cursor-pointer hover:bg-muted/50 transition-colors group/head"
                                onClick={() => toggleSort('status')}
                            >
                                <div className="flex items-center gap-1">
                                    {t('status')}
                                    {sortConfig.key === 'status' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-50 transition-opacity" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="w-28 cursor-pointer hover:bg-muted/50 transition-colors group/head"
                                onClick={() => toggleSort('priority')}
                            >
                                <div className="flex items-center gap-1">
                                    {t('priority')}
                                    {sortConfig.key === 'priority' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-50 transition-opacity" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="w-32 cursor-pointer hover:bg-muted/50 transition-colors group/head"
                                onClick={() => toggleSort('date')}
                            >
                                <div className="flex items-center gap-1">
                                    {t('date')}
                                    {sortConfig.key === 'date' ? (
                                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                                    ) : (
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/head:opacity-50 transition-opacity" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="w-20 text-right">{t('actions')}</TableHead>
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
                                    <TableCell
                                        onClick={(e) => e.stopPropagation()}
                                        className={cn(
                                            "transition-all duration-300 ease-in-out p-0",
                                            isSelectionMode ? "w-12 px-4 opacity-100" : "w-0 opacity-0 overflow-hidden"
                                        )}
                                    >
                                        <Checkbox
                                            checked={selectedApps.has(app.id)}
                                            onCheckedChange={() => toggleSelection(app.id)}
                                            className={cn(!isSelectionMode && "hidden")}
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold truncate">
                                        {app.company_name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground truncate">
                                        {app.job_title}
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="focus:outline-none">
                                                    <Badge variant="outline" className={cn("px-2 py-0 h-5 cursor-pointer hover:ring-2 hover:ring-primary/20", getStatusColor(app.status))}>
                                                        {tStatus(app.status)}
                                                    </Badge>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {(Object.keys(statusOrder) as ApplicationStatus[]).map((status) => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        onClick={() => handleUpdate(app.id, { status })}
                                                        className={cn(app.status === status && "bg-accent font-medium")}
                                                    >
                                                        <Badge variant="outline" className={cn("px-2 py-0 h-5 mr-2", getStatusColor(status))}>
                                                            {tStatus(status)}
                                                        </Badge>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className={cn("text-[14px] cursor-pointer hover:font-bold transition-all px-2 py-1 rounded-md hover:bg-accent", getPriorityColor(app.priority))}>
                                                    {tPriority(app.priority)}
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {(Object.keys(priorityOrder) as ApplicationPriority[]).map((priority) => (
                                                    <DropdownMenuItem
                                                        key={priority}
                                                        onClick={() => handleUpdate(app.id, { priority })}
                                                        className={cn(app.priority === priority && "bg-accent font-medium", getPriorityColor(priority))}
                                                    >
                                                        {tPriority(priority)}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {new Date(app.application_date).toLocaleDateString(locale)}
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
                                                        {t('viewDetails')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setEditingApp(app)}>
                                                        {t('editApplication')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete([app.id])}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        {t('delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
