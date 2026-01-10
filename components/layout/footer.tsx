import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface FooterProps {
    locale: string;
}

export default async function Footer({ locale }: FooterProps) {
    const t = await getTranslations("Footer");
    const common = await getTranslations("Common");
    const landing = await getTranslations("Landing");

    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-12 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted/20">
            <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">© 2025 Next Seeker. {landing('footer.builtFor')}</p>
            </div>
            <nav className="sm:ml-auto flex flex-wrap gap-4 sm:gap-6 justify-center">
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/blog`}>
                    {common('blog')}
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/pricing`}>
                    {t('pricing')}
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/terms-and-conditions`}>
                    {t('terms')}
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/privacy-policy`}>
                    {t('privacy')}
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/refund-policy`}>
                    {t('refund')}
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href={`/${locale}/specified-commercial-transactions`}>
                    {t('commercial')}
                </Link>
            </nav>
        </footer>
    );
}
