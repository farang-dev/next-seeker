'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type AuthMode = 'login' | 'signup' | 'forgot-password';

export default function LoginPage() {
    const t = useTranslations('Common');
    const auth = useTranslations('Auth');
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'en';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<AuthMode>('login');
    const router = useRouter();
    const supabase = createClient();

    const validatePassword = (pass: string) => {
        const hasNumber = /\d/.test(pass);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 8 && hasNumber && hasSymbol;
    };
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'signup' && !validatePassword(password)) {
            toast.error(t('passwordError'));
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?locale=${currentLocale}`,
                        data: {
                            full_name: fullName,
                        }
                    },
                });
                if (error) throw error;
                toast.success(auth('signupSuccess'));
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Redirect to the correct dashboard path
                router.push(`/${currentLocale}/dashboard`);
                router.refresh();
            } else if (mode === 'forgot-password') {
                const query = new URLSearchParams({
                    next: `/${currentLocale}/reset-password`,
                    locale: currentLocale
                }).toString();

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?${query}`,
                });
                if (error) throw error;
                toast.success(t('passwordResetSent'));
                setMode('login');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-primary">
                        {mode === 'signup' ? t('signup') : mode === 'forgot-password' ? t('resetPassword') : t('login')}
                    </CardTitle>
                    <CardDescription>
                        {mode === 'signup'
                            ? auth('signupDesc')
                            : mode === 'forgot-password'
                                ? auth('forgotDesc')
                                : auth('loginDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t('fullName')}</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {mode !== 'forgot-password' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">{t('password')}</Label>
                                    <button
                                        type="button"
                                        onClick={() => setMode('forgot-password')}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        {t('forgotPassword')}
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('processing') : mode === 'signup' ? t('signup') : mode === 'forgot-password' ? t('sendResetLink') : t('login')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        {mode === 'forgot-password' ? (
                            <button
                                onClick={() => setMode('login')}
                                className="text-primary hover:underline font-medium"
                            >
                                {t('backToLogin')}
                            </button>
                        ) : (
                            <>
                                {mode === 'signup' ? auth('alreadyHaveAccount') : auth('dontHaveAccount')}{' '}
                                <button
                                    onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {mode === 'signup' ? t('login') : t('signup')}
                                </button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
