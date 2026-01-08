import { config, fields, collection } from '@keystatic/core';

export default config({
    storage:
        process.env.NODE_ENV === 'development'
            ? {
                kind: 'local',
            }
            : {
                kind: 'github',
                repo: (process.env.NEXT_PUBLIC_GITHUB_REPO as `${string}/${string}`) || 'farang-dev/next-seeker',
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
