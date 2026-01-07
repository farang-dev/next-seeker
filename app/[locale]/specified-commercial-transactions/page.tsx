import { Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function CommercialTransactionsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Commercial");
    const tFooter = await getTranslations("Footer");

    const landingT = await getTranslations("Landing");
    const commonT = await getTranslations("Common");

    const fields = [
        { label: t("distributor"), value: t("distributorValue") },
        { label: t("representative"), value: t("representativeValue") },
        { label: t("address"), value: t("addressValue") },
        { label: t("phone"), value: t("phoneValue") },
        { label: t("email"), value: t("emailValue") },
        { label: t("price"), value: t("priceValue") },
        { label: t("fees"), value: t("feesValue") },
        { label: t("paymentMethod"), value: t("paymentMethodValue") },
        { label: t("paymentTiming"), value: t("paymentTimingValue") },
        { label: t("deliveryTiming"), value: t("deliveryTimingValue") },
        { label: t("returns"), value: t("returnsValue") },
    ];

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
                    </div>

                    <div className="space-y-8">
                        {fields.map((field, index) => (
                            <section key={index} className="space-y-2 border-b pb-4 last:border-0">
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    {field.label}
                                </h2>
                                <p className="text-lg text-foreground whitespace-pre-wrap">
                                    {field.value}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t">
                <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2025 Next Seeker. {landingT('footer.builtFor')}</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="hover:underline" href={`/${locale}/pricing`}>{tFooter('pricing')}</Link>
                        <Link className="hover:underline" href={`/${locale}/terms-and-conditions`}>{tFooter('terms')}</Link>
                        <Link className="hover:underline" href={`/${locale}/privacy-policy`}>{tFooter('privacy')}</Link>
                        <Link className="hover:underline" href={`/${locale}/refund-policy`}>{tFooter('refund')}</Link>
                        <Link className="hover:underline" href={`/${locale}/specified-commercial-transactions`}>{tFooter('commercial')}</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
