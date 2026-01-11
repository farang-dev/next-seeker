import { getBlogPostBySlug, getBlogPosts } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import RichTextResponse from '@/components/blog/rich-text';
import { format, isValid } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import BlogCTA from '@/components/blog/blog-cta';
import { Metadata } from 'next';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug, locale);

    if (!post) return {};

    const imageUrl = post.featuredImage?.fields?.file?.url;

    return {
        title: post.title,
        description: post.description || post.title,
        alternates: {
            canonical: locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
            languages: {
                'en': `/blog/${slug}`,
                'ja': `/ja/blog/${slug}`,
            },
        },
        openGraph: {
            title: post.title,
            description: post.description || post.title,
            type: 'article',
            publishedTime: post.publishedDate,
            images: imageUrl ? [`https:${imageUrl}`] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description || post.title,
            images: imageUrl ? [`https:${imageUrl}`] : [],
        },
    };
}

export async function generateStaticParams() {
    try {
        const enPosts = await getBlogPosts('en');
        const jaPosts = await getBlogPosts('ja');

        return [
            ...enPosts.map((post: any) => ({ locale: 'en', slug: post.slug })),
            ...jaPosts.map((post: any) => ({ locale: 'ja', slug: post.slug })),
        ];
    } catch (error) {
        console.error('Failed to generate static params for blog:', error);
        return [];
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const t = await getTranslations('Blog');
    const post = await getBlogPostBySlug(slug, locale);

    if (!post) {
        notFound();
    }

    const date = post.publishedDate ? new Date(post.publishedDate) : null;
    const imageUrl = post.featuredImage?.fields?.file?.url;

    return (
        <article className="container mx-auto py-12 px-4 max-w-3xl">
            <Link href={`/${locale}/blog`}>
                <Button variant="ghost" className="mb-8 group">
                    <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    {t('back')}
                </Button>
            </Link>

            {imageUrl && (
                <div className="aspect-video relative overflow-hidden rounded-xl mb-8 shadow-lg">
                    <img
                        src={`https:${imageUrl}`}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-muted-foreground">
                    {date && isValid(date) ? format(date, 'PPPP', {
                        locale: locale === 'ja' ? ja : enUS
                    }) : ''}
                </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <RichTextResponse content={post.content} />
            </div>

            <hr className="my-16" />

            <BlogCTA locale={locale} />
        </article>
    );
}
