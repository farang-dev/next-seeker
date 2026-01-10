import { Target } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface HeaderProps {
    locale: string;
}

export default async function Header({ locale }: HeaderProps) {
    const common = await getTranslations("Common");

    return (
        <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <Link className="flex items-center justify-center gap-2" href={`/${locale}`}>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <Target className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight leading-none">Next Seeker</span>
                    <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
                        {common('subtitle')}
                    </span>
                </div>
            </Link>
            <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:text-primary transition-colors" href={`/${locale}/blog`}>
                    {common('blog')}
                </Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors" href={`/${locale}/login`}>
                    {common('login')}
                </Link>
            </nav>
        </header>
    );
}
