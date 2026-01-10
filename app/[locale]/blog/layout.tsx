import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function BlogLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="flex flex-col min-h-screen">
            <Header locale={locale} />
            <main className="flex-1">
                {children}
            </main>
            <Footer locale={locale} />
        </div>
    );
}
