import { useTranslations } from 'next-intl';
import { getBlogPosts } from '@/lib/contentful';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const posts = await getBlogPosts(locale);

    // Note: getTranslations/useTranslations logic in server components
    // In app router, we usually pass locale to getTranslations
    // But since this is a simple page, I'll use wait t = await getTranslations... later if needed.
    // For now let's keep it simple.

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Blog</h1>
                <p className="text-xl text-muted-foreground">Insights and tips for your professional journey.</p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No blog posts found.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                {post.featuredImage && (
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={`https:${post.featuredImage.fields.file.url}`}
                                            alt={post.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                    <CardDescription>
                                        {format(new Date(post.publishedDate), 'PPP', {
                                            locale: locale === 'ja' ? ja : enUS
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
