import { createClient } from '@/lib/supabase/server';
import { DetailWorkspace } from '@/components/applications/detail-workspace';
import { notFound } from 'next/navigation';
import { JobApplication, ApplicationQuestion, ApplicationNote, ApplicationInterview } from '@/lib/types';

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Application
    const { data: application } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .single() as { data: JobApplication | null };

    if (!application) {
        notFound();
    }

    // Fetch Questions
    const { data: questions } = await supabase
        .from('application_questions')
        .select('*')
        .eq('application_id', id)
        .order('sort_order', { ascending: true }) as { data: ApplicationQuestion[] | null };

    // Fetch Notes
    const { data: notes } = await supabase
        .from('application_notes')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false }) as { data: ApplicationNote[] | null };

    // Fetch Interviews
    const { data: interviews } = await supabase
        .from('application_interviews')
        .select('*')
        .eq('application_id', id)
        .order('round_number', { ascending: true }) as { data: ApplicationInterview[] | null };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <DetailWorkspace
                application={application}
                initialQuestions={questions || []}
                initialNotes={notes || []}
                initialInterviews={interviews || []}
            />
        </div>
    );
}
