export type Profile = {
    id: string;
    updated_at: string | null;
    full_name: string | null;
    avatar_url: string | null;
    preferred_language: 'en' | 'ja';
    theme_preference: 'light' | 'dark' | 'system';
    has_premium: boolean;
    stripe_customer_id: string | null;
};


export type CareerGoalType = '3-year' | '5-year' | '10-year';

export type CareerGoal = {
    id: string;
    user_id: string;
    type: CareerGoalType;
    title: string;
    description: string | null;
    notes: string | null;
    updated_at: string;
};

export type ApplicationStatus = 'Draft' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Archived';
export type ApplicationPriority = 'High' | 'Medium' | 'Low';

export type JobApplication = {
    id: string;
    user_id: string;
    company_name: string;
    job_title: string;
    application_url: string | null;
    status: ApplicationStatus;
    priority: ApplicationPriority;
    application_date: string;
    location: string | null;
    notes: string | null;
    motivation: string | null;
    fit_notes: string | null;
    pitch_text: string | null;
    company_research: string | null;
    created_at: string;
    updated_at: string;
};

export type ApplicationQuestion = {
    id: string;
    application_id: string;
    question: string;
    answer: string | null;
    sort_order: number;
    created_at: string;
};

export type ApplicationNote = {
    id: string;
    application_id: string;
    content: string;
    created_at: string;
    updated_at: string;
};

export type ApplicationInterview = {
    id: string;
    application_id: string;
    round_number: number;
    interview_date: string | null;
    location: string | null;
    notes: string | null;
    feedback: string | null;
    created_at: string;
    updated_at: string;
};
