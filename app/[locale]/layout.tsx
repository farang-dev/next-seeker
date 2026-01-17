import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { locales } from '@/i18n/settings';
import { notFound } from 'next/navigation';
import { ThemeProvider } from "@/components/providers/theme-provider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Common' });

  return {
    metadataBase: new URL('https://www.seeknext.online'),
    title: {
      template: `%s | ${t('title')}`,
      default: t('metaTitle'),
    },
    description: t('metaDescription'),
    keywords: locale === 'ja'
      ? ['転職管理', '転職リスト', '応募管理', '転職活動', 'キャリア管理', '転職ツール', 'Job Tracker']
      : ['job search tracker', 'application tracking', 'career goals', 'job hunt', 'recruitment manager'],
    authors: [{ name: 'Masafumi Nozawa' }],
    creator: 'Masafumi Nozawa',
    publisher: 'Next Seeker',
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en': '/',
        'ja': '/ja',
      },
    },
    appleWebApp: {
      title: 'Next Seeker',
      statusBarStyle: 'default',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: 'https://www.seeknext.online',
      siteName: 'Next Seeker',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NDFTTHZFKL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NDFTTHZFKL');
          `}
        </Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Next Seeker",
            "url": "https://www.seeknext.online",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": locale === 'ja'
              ? "転職活動の応募案件をリストで一括管理する「転職管理ツール」。複数の求人サイトやエージェントの進捗を一つのダッシュボードで把握。"
              : "Professional job application tracker and career management tool. Centralize your job search and track your progress.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": locale === 'ja' ? "JPY" : "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Masafumi Nozawa"
            }
          })}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position="top-right" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
