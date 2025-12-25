import { Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function TermsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Terms");

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
                            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                            <p>By accessing or using Next Seeker, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">2. Use License</h2>
                            <p>Permission is granted to use Next Seeker for personal, non-commercial use. This is the grant of a license, not a transfer of title.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">3. User Content</h2>
                            <p>You are responsible for the content you post on Next Seeker. We do not claim ownership of your data, but you grant us a license to host it for the purpose of providing the service.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">4. Account Security</h2>
                            <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">5. Termination</h2>
                            <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>
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
