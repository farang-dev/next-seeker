import { Button } from "@/components/ui/button";
import { Target, Briefcase, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Next Seeker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href={`/${locale}/login`}>
            Sign In
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href={`/${locale}/login`}>
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Career, <span className="text-primary border-b-4 border-primary/20">Not Just Your Applications</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The professional dashboard for job seekers. Align every application with your 5-year goal and ace your interviews with proper preparation.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link href={`/${locale}/login`}>Get Started for Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Goal-Driven Application</h3>
                <p className="text-muted-foreground">
                  Map your 3, 5, and 10-year career goals and ensure every job application brings you closer to them.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Interview Workspace</h3>
                <p className="text-muted-foreground">
                  A dedicated space for each application to store research, personal pitches, and tailored questions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track Growth</h3>
                <p className="text-muted-foreground">
                  Monitor your progress across multiple statuses and companies with a clean, professional dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 Next Seeker. Proudly built for career seekers.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
