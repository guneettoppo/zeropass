'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('zeropass-token');
        if (!token) {
            router.push('/');
            return;
        }

        // Optionally decode token to show email or ID
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setEmail(payload.email);
        } catch (err) {
            console.error('Invalid token');
            router.push('/');
        }
    }, []);

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Welcome to ZeroPass Dashboard</h1>
            {email && <p className="mt-2 text-gray-600">Logged in as: {email}</p>}
        </main>
    );
}
