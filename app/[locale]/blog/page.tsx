import { getBlogPosts } from '@/lib/contentful';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, isValid } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { getTranslations } from 'next-intl/server';
import BlogCTA from '@/components/blog/blog-cta';
import { Metadata } from 'next';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('Blog');

    return {
        title: t('title'),
        description: t('subtitle'),
        alternates: {
            canonical: locale === 'en' ? '/blog' : `/${locale}/blog`,
            languages: {
                'en': '/blog',
                'ja': '/ja/blog',
            },
        },
    };
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Blog');
    const posts = await getBlogPosts(locale);

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
            </div>

            {(!posts || posts.length === 0) ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">{t('noPosts')}</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => {
                            const date = post.publishedDate ? new Date(post.publishedDate) : null;
                            const imageUrl = post.featuredImage?.fields?.file?.url;

                            return (
                                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        {imageUrl && (
                                            <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={`https:${imageUrl}`}
                                                    alt={post.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                                            <CardDescription>
                                                {date && isValid(date) ? format(date, 'PPP', {
                                                    locale: locale === 'ja' ? ja : enUS
                                                }) : ''}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">{post.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    <BlogCTA locale={locale} />
                </>
            )}
        </div>
    );
}
