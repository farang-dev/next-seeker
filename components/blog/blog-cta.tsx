import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface BlogCTAProps {
    locale: string;
}

export default async function BlogCTA({ locale }: BlogCTAProps) {
    const landing = await getTranslations("Landing");
    const blog = await getTranslations("Blog");

    return (
        <section className="my-16 p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground text-center relative overflow-hidden shadow-2xl">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {blog('ctaTitle')}
                </h2>
                <p className="text-lg text-primary-foreground/90 leading-relaxed">
                    {blog('ctaSubtitle')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button asChild size="lg" variant="secondary" className="px-10 h-14 text-lg font-bold rounded-full hover:scale-105 transition-transform active:scale-95">
                        <Link href={`/${locale}/login`}>
                            {blog('ctaButton')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
