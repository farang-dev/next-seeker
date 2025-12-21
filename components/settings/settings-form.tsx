'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Moon, Sun, Laptop, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SettingsForm({ locale }: { locale: string }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Settings');

    const handleLanguageChange = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-primary" />
                        {t('appearance')}
                    </CardTitle>
                    <CardDescription>{t('appearanceDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('theme')}</Label>
                            <p className="text-sm text-muted-foreground">{t('themeDesc')}</p>
                        </div>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" /> {t('light')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" /> {t('dark')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                        <Laptop className="h-4 w-4" /> {t('system')}
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" />
                        {t('language')}
                    </CardTitle>
                    <CardDescription>{t('languageDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('interfaceLanguage')}</Label>
                            <p className="text-sm text-muted-foreground">{t('interfaceLanguageDesc')}</p>
                        </div>
                        <Select value={locale} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
                    <CardDescription>{t('dangerZoneDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">{t('deleteAccount')}</Button>
                </CardContent>
            </Card>
        </div>
    );
}
