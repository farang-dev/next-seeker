import { Document } from '@contentful/rich-text-types';

export interface BlogPost {
    title: string;
    slug: string;
    description: string;
    content: Document;
    publishedDate: string;
    featuredImage?: {
        fields: {
            file: {
                url: string;
                details: {
                    size: number;
                    image: {
                        width: number;
                        height: number;
                    };
                };
                contentType: string;
                fileName: string;
            };
        };
    };
}
