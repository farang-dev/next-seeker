import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Document } from '@contentful/rich-text-types';

const options = {
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
            <p className="mb-4 leading-relaxed">{children}</p>
        ),
        [BLOCKS.HEADING_1]: (node: any, children: any) => (
            <h1 className="text-3xl font-bold mb-6">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: any) => (
            <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: any) => (
            <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: any) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: any) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
            <li className="leading-relaxed">{children}</li>
        ),
        [BLOCKS.QUOTE]: (node: any, children: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
                {children}
            </blockquote>
        ),
        [INLINES.HYPERLINK]: (node: any, children: any) => (
            <a
                href={node.data.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 transition-colors"
            >
                {children}
            </a>
        ),
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const { title, file } = node.data.target.fields;
            return (
                <div className="my-8">
                    <img
                        src={file.url}
                        alt={title}
                        className="rounded-lg w-full object-cover shadow-md"
                    />
                    {title && <p className="text-sm text-center text-muted-foreground mt-2">{title}</p>}
                </div>
            );
        },
    },
};

export default function RichTextResponse({ content }: { content: Document }) {
    if (!content) return null;
    return <div>{documentToReactComponents(content, options as any)}</div>;
}
