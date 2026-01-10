import { createClient, ContentfulClientApi } from 'contentful';
import { BlogPost } from '@/types/blog';

let client: ContentfulClientApi<undefined>;

export function getClient() {
    if (client) return client;

    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
        console.error('Contentful Error: Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN');
        return null;
    }

    try {
        client = createClient({
            space: spaceId,
            accessToken: accessToken,
        });
        return client;
    } catch (error) {
        console.error('Contentful Error: Failed to create client', error);
        return null;
    }
}

export async function getBlogPosts(locale: string = 'en') {
    try {
        const contentful = getClient();
        if (!contentful) return [];

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
        if (!contentful) return null;

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
