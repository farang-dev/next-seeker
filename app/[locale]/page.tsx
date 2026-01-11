import { Button } from "@/components/ui/button";
import { Target, Briefcase, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en': '/',
        'ja': '/ja',
      },
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const landing = await getTranslations("Landing");

  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={locale} />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-background pt-8 md:pt-12 lg:pt-16 pb-12">
          {/* ... existing section content ... */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-20 xl:gap-24">
              {/* Left Column: Text Content */}
              <div className="flex flex-col space-y-8 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-[1.15]">
                    {landing('hero.titlePart1')}{locale !== 'ja' && " "}
                    <span className="relative inline-block whitespace-nowrap">
                      <span className="relative z-10 text-primary">{landing('hero.titleHighlight')}</span>
                      <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-1" />
                    </span>
                  </h1>
                  <p className="max-w-[520px] text-muted-foreground text-base md:text-lg leading-relaxed">
                    {landing('hero.subtitle')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button asChild size="lg" className="px-10 h-14 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    <Link href={`/${locale}/login`}>{landing('hero.ctaFree')}</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-10 h-14 text-lg font-semibold rounded-full hover:bg-muted/50 transition-all">
                    {landing('hero.ctaDemo')}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-8 border-t border-muted">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">100+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{landing('features.goal.title')}</span>
                  </div>
                  <div className="w-px h-10 bg-muted" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">Free</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Start Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Image Content */}
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                <div className="relative z-10 rounded-2xl overflow-hidden border border-muted shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-background">
                  <img
                    src={`/images/dashboard-${locale}.png`}
                    alt="Next Seeker Dashboard Preview"
                    className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse delay-700" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{landing('features.goal.title')}</h3>
                <p className="text-muted-foreground">{landing('features.goal.desc')}</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{landing('features.workspace.title')}</h3>
                <p className="text-muted-foreground">{landing('features.workspace.desc')}</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{landing('features.growth.title')}</h3>
                <p className="text-muted-foreground">{landing('features.growth.desc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
