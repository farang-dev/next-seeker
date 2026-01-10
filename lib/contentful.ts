import { createClient, ContentfulClientApi } from 'contentful';
import { BlogPost } from '@/types/blog';

let client: ContentfulClientApi<undefined>;

export function getClient() {
    if (client) return client;

    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
        throw new Error('Missing Contentful environment variables: CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN');
    }

    client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
    return client;
}

export async function getBlogPosts(locale: string = 'en') {
    try {
        const contentful = getClient();
        const response = await contentful.getEntries({
            content_type: 'blogPost',
            locale: locale === 'ja' ? 'ja' : 'en-US',
            order: ['-fields.publishedDate'],
        });

        return response.items.map((item) => item.fields) as unknown as BlogPost[];
    } catch (error) {
        console.error('Contentful Error (getBlogPosts):', error);
        return [];
    }
}

export async function getBlogPostBySlug(slug: string, locale: string = 'en') {
    try {
        const contentful = getClient();
        const response = await contentful.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            locale: locale === 'ja' ? 'ja' : 'en-US',
            limit: 1,
        });

        if (response.items.length === 0) return null;
        return response.items[0].fields as unknown as BlogPost;
    } catch (error) {
        console.error('Contentful Error (getBlogPostBySlug):', error);
        return null;
    }
}

let previewClient: ContentfulClientApi<undefined>;

export function getPreviewClient() {
    if (previewClient) return previewClient;

    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_PREVIEW_TOKEN) {
        throw new Error('Missing Contentful environment variables: CONTENTFUL_SPACE_ID or CONTENTFUL_PREVIEW_TOKEN');
    }

    previewClient = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN,
        host: 'preview.contentful.com',
    });
    return previewClient;
}
