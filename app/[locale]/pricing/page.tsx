import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PricingPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Pricing");

    const plans = [
        {
            name: t("free.name"),
            price: t("free.price"),
            period: "",
            description: t("free.description"),
            features: [
                t("free.features.0"),
                t("free.features.1"),
                t("free.features.2"),
                t("free.features.3"),
            ],
            cta: t("cta"),
            variant: "outline" as const,
            href: `/${locale}/login`,
        },
        {
            name: t("premium.name"),
            price: t("premium.price"),
            period: `/${t("premium.period")}`,
            description: t("premium.description"),
            features: [
                t("premium.features.0"),
                t("premium.features.1"),
                t("premium.features.2"),
                t("premium.features.3"),
            ],
            cta: t("upgrade"),
            variant: "default" as const,
            href: `/${locale}/login`,
            highlighted: true,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 lg:px-12 h-20 flex items-center border-b">
                <Link className="flex items-center justify-center gap-2" href={`/${locale}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Next Seeker</span>
                </Link>
            </header>

            <main className="flex-1 py-12 md:py-24 bg-muted/30">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            {t("title")}
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`flex flex-col relative overflow-hidden transition-all hover:shadow-lg ${plan.highlighted ? 'border-primary shadow-md scale-105' : ''
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-primary" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full" variant={plan.variant}>
                                        <Link href={plan.href}>{plan.cta}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t">
                <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2025 Next Seeker. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="text-xs hover:underline" href={`/${locale}/pricing`}>Pricing</Link>
                        <Link className="text-xs hover:underline" href={`/${locale}/terms-and-conditions`}>Terms</Link>
                        <Link className="text-xs hover:underline" href={`/${locale}/privacy-policy`}>Privacy</Link>
                        <Link className="text-xs hover:underline" href={`/${locale}/refund-policy`}>Refund</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
