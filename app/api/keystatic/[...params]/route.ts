import { makeRouteHandler } from '@keystatic/next/route-handler';
import { config as keystaticConfig, fields, collection } from '@keystatic/core';

const config = keystaticConfig({
    storage: {
        kind: 'local',
    },
    ui: {
        brand: { name: 'Next Seeker Admin' },
        navigation: {
            'Content': ['posts'],
        },
    },
    collections: {
        posts: collection({
            label: 'Blog Posts',
            slugField: 'slug',
            path: 'content/posts/*',
            format: { contentField: 'content' },
            schema: {
                slug: fields.slug({ name: { label: 'Slug' } }),
                title: fields.text({ label: 'Title (English)' }),
                title_ja: fields.text({ label: 'Title (Japanese)' }),
                description: fields.text({ label: 'Description (English)', multiline: true }),
                description_ja: fields.text({ label: 'Description (Japanese)', multiline: true }),
                publishedDate: fields.date({ label: 'Published Date' }),
                isDraft: fields.checkbox({ label: 'Draft', defaultValue: false }),
                content: fields.document({
                    label: 'Content (English)',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: true,
                }),
                content_ja: fields.document({
                    label: 'Content (Japanese)',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: true,
                }),
            },
        }),
    },
});

export const { GET, POST } = makeRouteHandler({
    config,
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
