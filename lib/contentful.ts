import { createClient } from 'contentful';
import { BlogPost } from '@/types/blog';

export const contentfulClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function getBlogPosts(locale: string = 'en') {
    const response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        locale: locale === 'ja' ? 'ja' : 'en-US',
        order: ['-fields.publishedDate'],
    });

    return response.items.map((item) => item.fields) as unknown as BlogPost[];
}

export async function getBlogPostBySlug(slug: string, locale: string = 'en') {
    const response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        'fields.slug': slug,
        locale: locale === 'ja' ? 'ja' : 'en-US',
        limit: 1,
    });

    if (response.items.length === 0) return null;
    return response.items[0].fields as unknown as BlogPost;
}

export const contentfulPreviewClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
    host: 'preview.contentful.com',
});
