import { Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function RefundPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Refund");

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
                            <h2 className="text-2xl font-semibold text-foreground">1. Refund Eligibility</h2>
                            <p>We offer a 14-day money-back guarantee for our Unlimited Premium plan if you are not satisfied with the service. To be eligible for a refund, you must submit your request within 14 days of your purchase.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">2. Process for Refunds</h2>
                            <p>To request a refund, please email us at support@nextseeker.com with your account details and the reason for your request. We will process your refund within 5-10 business days.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">3. Non-refundable Situations</h2>
                            <p>Requests made after the 14-day window are generally not eligible for a refund. Additionally, accounts that have violated our Terms of Service are not eligible for refunds.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">4. Changes to This Policy</h2>
                            <p>We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to this page.</p>
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
