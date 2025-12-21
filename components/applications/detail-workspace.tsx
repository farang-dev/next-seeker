'use client';

import { useState } from 'react';
import {
    JobApplication,
    ApplicationQuestion,
    ApplicationNote,
    ApplicationInterview
} from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Trash2,
    Save,
    ExternalLink,
    Calendar,
    MapPin,
    FileText,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface DetailWorkspaceProps {
    application: JobApplication;
    initialQuestions: ApplicationQuestion[];
    initialNotes: ApplicationNote[];
    initialInterviews: ApplicationInterview[];
}

export function DetailWorkspace({
    application,
    initialQuestions,
    initialNotes,
    initialInterviews
}: DetailWorkspaceProps) {
    const supabase = createClient();
    const router = useRouter();
    const t = useTranslations('Detail');
    const [loading, setLoading] = useState(false);

    // Form states
    const [motivation, setMotivation] = useState(application.motivation || '');
    const [fitNotes, setFitNotes] = useState(application.fit_notes || '');
    const [pitchText, setPitchText] = useState(application.pitch_text || '');
    const [companyResearch, setCompanyResearch] = useState(application.company_research || '');

    // Questions
    const [questions, setQuestions] = useState<ApplicationQuestion[]>(initialQuestions);

    // Interviews (fixed 5 rounds)
    const [interviews, setInterviews] = useState<ApplicationInterview[]>(() => {
        const rounds = [...initialInterviews];
        for (let i = 1; i <= 5; i++) {
            if (!rounds.find(r => r.round_number === i)) {
                rounds.push({
                    id: `temp-${i}`,
                    application_id: application.id,
                    round_number: i,
                    interview_date: null,
                    location: '',
                    notes: '',
                    feedback: '',
                    created_at: '',
                    updated_at: ''
                });
            }
        }
        return rounds.sort((a, b) => a.round_number - b.round_number);
    });

    const handleSaveInterviews = async (roundNum: number) => {
        const interview = interviews.find(i => i.round_number === roundNum);
        if (!interview) return;

        setLoading(true);
        try {
            const dataToSave = {
                application_id: application.id,
                round_number: roundNum,
                interview_date: interview.interview_date,
                location: interview.location,
                notes: interview.notes,
                feedback: interview.feedback,
            };

            const { error } = await supabase
                .from('application_interviews')
                .upsert(dataToSave, { onConflict: 'application_id,round_number' });

            if (error) throw error;
            toast.success(`Round ${roundNum} updated`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveApplicationInfo = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({
                    motivation,
                    fit_notes: fitNotes,
                    pitch_text: pitchText,
                    company_research: companyResearch
                })
                .eq('id', application.id);

            if (error) throw error;
            toast.success('Information saved');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async () => {
        const { data, error } = await supabase
            .from('application_questions')
            .insert({
                application_id: application.id,
                question: 'New Question',
                sort_order: questions.length
            })
            .select()
            .single();

        if (error) {
            toast.error(error.message);
        } else if (data) {
            setQuestions([...questions, data]);
        }
    };

    const handleUpdateQuestion = async (id: string, updates: Partial<ApplicationQuestion>) => {
        const { error } = await supabase
            .from('application_questions')
            .update(updates)
            .eq('id', id);

        if (error) {
            toast.error(error.message);
        } else {
            setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">{application.company_name}</h2>
                    <p className="text-muted-foreground">{application.job_title}</p>
                </div>
                <div className="flex gap-2">
                    {application.application_url && (
                        <Button variant="outline" asChild>
                            <a href={application.application_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                {t('viewListing')}
                            </a>
                        </Button>
                    )}
                    <Button onClick={handleSaveApplicationInfo} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {t('saveChanges')}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="interviews" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                    <TabsTrigger value="motivation">{t('motivation')}</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    <TabsTrigger value="prep">{t('interviewPrep')}</TabsTrigger>
                    <TabsTrigger value="questions">{t('questions')}</TabsTrigger>
                    <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
                </TabsList>

                <TabsContent value="motivation">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('whyApplied')}</CardTitle>
                            <CardDescription>{t('whyAppliedDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('motivationLabel')}</Label>
                                <Textarea
                                    placeholder="I've always admired..."
                                    className="min-h-[150px]"
                                    value={motivation}
                                    onChange={(e) => setMotivation(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('fitLabel')}</Label>
                                <Textarea
                                    placeholder="This role bridges the gap..."
                                    className="min-h-[100px]"
                                    value={fitNotes}
                                    onChange={(e) => setFitNotes(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="interviews">
                    <div className="grid gap-6">
                        {interviews.map((interview) => (
                            <Card key={interview.round_number}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Interview {interview.round_number}</CardTitle>
                                        <CardDescription>Details and feedback for this round.</CardDescription>
                                    </div>
                                    <Button size="sm" onClick={() => handleSaveInterviews(interview.round_number)} disabled={loading}>
                                        <Save className="h-3.5 w-3.5 mr-1" />
                                        Save Round
                                    </Button>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Date & Time
                                            </Label>
                                            <Input
                                                type="datetime-local"
                                                value={interview.interview_date ? interview.interview_date.substring(0, 16) : ''}
                                                onChange={(e) => {
                                                    setInterviews(interviews.map(i =>
                                                        i.round_number === interview.round_number
                                                            ? { ...i, interview_date: e.target.value }
                                                            : i
                                                    ));
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Location / Link
                                            </Label>
                                            <Input
                                                placeholder="Zoom link or office address"
                                                value={interview.location || ''}
                                                onChange={(e) => {
                                                    setInterviews(interviews.map(i =>
                                                        i.round_number === interview.round_number
                                                            ? { ...i, location: e.target.value }
                                                            : i
                                                    ));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Preparation & Notes
                                        </Label>
                                        <Textarea
                                            placeholder="What they mentioned in the invite..."
                                            value={interview.notes || ''}
                                            onChange={(e) => {
                                                setInterviews(interviews.map(i =>
                                                    i.round_number === interview.round_number
                                                        ? { ...i, notes: e.target.value }
                                                        : i
                                                ));
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Post-Interview Feedback
                                        </Label>
                                        <Textarea
                                            placeholder="How did it go? Any tricky questions?"
                                            value={interview.feedback || ''}
                                            onChange={(e) => {
                                                setInterviews(interviews.map(i =>
                                                    i.round_number === interview.round_number
                                                        ? { ...i, feedback: e.target.value }
                                                        : i
                                                ));
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="prep">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('prepMaterial')}</CardTitle>
                            <CardDescription>{t('prepDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('pitchLabel')}</Label>
                                <Textarea
                                    className="min-h-[150px]"
                                    value={pitchText}
                                    onChange={(e) => setPitchText(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('researchLabel')}</Label>
                                <Textarea
                                    className="min-h-[150px]"
                                    value={companyResearch}
                                    onChange={(e) => setCompanyResearch(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="questions">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('questionsTitle')}</CardTitle>
                                <CardDescription>{t('questionsDesc')}</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2" onClick={handleAddQuestion}>
                                <Plus className="h-4 w-4" />
                                {t('addQuestion')}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {questions.map((q) => (
                                <div key={q.id} className="grid p-4 border rounded-lg gap-4 bg-muted/20">
                                    <Input
                                        value={q.question}
                                        className="font-medium bg-background"
                                        onChange={(e) => handleUpdateQuestion(q.id, { question: e.target.value })}
                                        onBlur={(e) => handleUpdateQuestion(q.id, { question: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="Answer or research..."
                                        value={q.answer || ''}
                                        onChange={(e) => handleUpdateQuestion(q.id, { answer: e.target.value })}
                                        onBlur={(e) => handleUpdateQuestion(q.id, { answer: e.target.value })}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    {/* Simplified for now, just a list of notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('freeNotes')}</CardTitle>
                            <CardDescription>{t('freeNotesDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 opacity-70">
                                <p className="text-sm">Free notes and interview logs will appear here. Currently managed via global updates.</p>
                                {/* Add note implementation could go here */}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
