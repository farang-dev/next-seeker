import { getRequestConfig } from 'next-intl/server';
import { locales } from './i18n/settings';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        locale = 'en';
    }

    const messages = (await import(`./messages/${locale}.json`)).default;

    return {
        locale: locale as any,
        messages
    };
});
