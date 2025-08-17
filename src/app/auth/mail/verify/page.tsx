'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function MailVerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            return;
        }

        fetch(`/api/auth/mail/verify/verify-token?token=${token}`, {
            cache: 'no-cache',
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('zeropass-token', data.token);
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));
    }, [router, searchParams]);

    if (status === 'verifying') return <p> Verifying token...</p>;
    if (status === 'success') return <p> Login successful. Redirecting...</p>;
    return <p>❌ Invalid or expired token</p>;
}
