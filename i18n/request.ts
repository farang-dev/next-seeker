import { getRequestConfig } from 'next-intl/server';
import { locales } from './settings';

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) {
        return {
            locale: 'en' as const,
            messages: (await import(`../messages/en.json`)).default
        };
    }

    return {
        locale: locale as any,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
