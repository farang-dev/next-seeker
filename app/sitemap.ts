import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/contentful';
import { BlogPost } from '@/types/blog';

export const revalidate = 3600; // Update sitemap every hour
export const dynamic = 'force-dynamic'; // Ensure it's not cached forever at build time

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.seeknext.online';
    const locales = ['en', 'ja'];

    // Static pages
    const staticPages = [
        '',
        '/pricing',
        '/blog',
        '/terms-and-conditions',
        '/privacy-policy',
        '/refund-policy',
        '/specified-commercial-transactions',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate entries for static pages in all locales
    for (const locale of locales) {
        for (const page of staticPages) {
            const isDefaultLocale = locale === 'en';
            const path = isDefaultLocale ? page : `/${locale}${page}`;
            sitemapEntries.push({
                url: `${baseUrl}${path === '' ? '/' : path}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: page === '' ? 1 : 0.8,
            });
        }
    }

    // Generate entries for blog posts from Contentful
    try {
        const [enPosts, jaPosts] = await Promise.all([
            getBlogPosts('en'),
            getBlogPosts('ja'),
        ]);

        enPosts.forEach((post: BlogPost) => {
            sitemapEntries.push({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.publishedDate || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });

        jaPosts.forEach((post: BlogPost) => {
            sitemapEntries.push({
                url: `${baseUrl}/ja/blog/${post.slug}`,
                lastModified: new Date(post.publishedDate || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    } catch (error) {
        console.error('Sitemap Error (Contentful):', error);
    }

    return sitemapEntries;
}
