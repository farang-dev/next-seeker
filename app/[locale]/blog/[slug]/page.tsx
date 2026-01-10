import { getBlogPostBySlug, getBlogPosts } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import RichTextResponse from '@/components/blog/rich-text';
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
    // Generate static params for all posts in both languages
    try {
        const enPosts = await getBlogPosts('en');
        const jaPosts = await getBlogPosts('ja');

        const params = [
            ...enPosts.map((post) => ({ locale: 'en', slug: post.slug })),
            ...jaPosts.map((post) => ({ locale: 'ja', slug: post.slug })),
        ];

        return params;
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
    const post = await getBlogPostBySlug(slug, locale);

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto py-12 px-4 max-w-3xl">
            <Link href={`/${locale}/blog`}>
                <Button variant="ghost" className="mb-8 group">
                    <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Button>
            </Link>

            {post.featuredImage && (
                <div className="aspect-video relative overflow-hidden rounded-xl mb-8 shadow-lg">
                    <img
                        src={`https:${post.featuredImage.fields.file.url}`}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-muted-foreground">
                    {format(new Date(post.publishedDate), 'PPPP', {
                        locale: locale === 'ja' ? ja : enUS
                    })}
                </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <RichTextResponse content={post.content} />
            </div>
        </article>
    );
}
