'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function VerifyPayment() {
    const [verifying, setVerifying] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyStatus = async () => {
            try {
                const response = await fetch('/api/stripe/verify', {
                    method: 'POST',
                });
                const data = await response.json();

                if (data.hasPremium) {
                    if (data.recovered) {
                        toast.success('Premium status synced!');
                        router.refresh();
                    }
                }
            } catch (error) {
                console.error('Verification failed', error);
            } finally {
                setVerifying(false);
            }
        };

        verifyStatus();
    }, [router]);

    if (verifying) {
        return (
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground animate-pulse">
                    Verifying payment details...
                </p>
            </div>
        );
    }

    return null;
}
