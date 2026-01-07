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
    const footerT = await getTranslations("Footer");
    const landingT = await getTranslations("Landing");
    const commonT = await getTranslations("Common");

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <Link className="flex items-center justify-center gap-2" href={`/${locale}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Target className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight leading-none">Next Seeker</span>
                        <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
                            {commonT('subtitle')}
                        </span>
                    </div>
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
                            <h2 className="text-2xl font-semibold text-foreground">{t("section1")}</h2>
                            <p>{t("section1Content")}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">{t("section2")}</h2>
                            <p>{t("section2Content")}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">{t("section3")}</h2>
                            <p>{t("section3Content")}</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">{t("section4")}</h2>
                            <p>{t("section4Content")}</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t">
                <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2025 Next Seeker. {landingT('footer.builtFor')}</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="hover:underline" href={`/${locale}/pricing`}>{footerT('pricing')}</Link>
                        <Link className="hover:underline" href={`/${locale}/terms-and-conditions`}>{footerT('terms')}</Link>
                        <Link className="hover:underline" href={`/${locale}/privacy-policy`}>{footerT('privacy')}</Link>
                        <Link className="hover:underline" href={`/${locale}/refund-policy`}>{footerT('refund')}</Link>
                        <Link className="hover:underline" href={`/${locale}/specified-commercial-transactions`}>{footerT('commercial')}</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
