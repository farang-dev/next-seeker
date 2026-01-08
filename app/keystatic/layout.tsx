import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Keystatic Admin',
    description: 'Admin dashboard for Keystatic',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head />
            <body>{children}</body>
        </html>
    );
}
