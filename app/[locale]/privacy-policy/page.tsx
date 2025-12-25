import { Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Privacy");

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <Link className="flex items-center justify-center gap-2" href={`/${locale}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Next Seeker</span>
                </Link>
            </header>

            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                    <div className="space-y-4 mb-12 border-b pb-8">
                        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
                        <p className="text-muted-foreground">{t("lastUpdated")}</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <p>{t("intro")}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us when you create an account, such as your name and email address. We also collect data regarding your job applications and career goals to provide our service.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                            <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Next Seeker and our users.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To manage your job applications and dashboard.</li>
                                <li>To synchronize your data across devices.</li>
                                <li>To send you important notifications about your account.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">3. Data Security</h2>
                            <p>We work hard to protect Next Seeker and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">4. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at support@nextseeker.com.</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t">
                <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2025 Next Seeker. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="hover:underline" href={`/${locale}/pricing`}>Pricing</Link>
                        <Link className="hover:underline" href={`/${locale}/terms-and-conditions`}>Terms</Link>
                        <Link className="hover:underline" href={`/${locale}/privacy-policy`}>Privacy</Link>
                        <Link className="hover:underline" href={`/${locale}/refund-policy`}>Refund</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
