import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar locale={locale} />
            <div className="flex-1 flex flex-col">
                <Header user={user} locale={locale} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
