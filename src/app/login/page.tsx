'use client';

import { useState } from 'react';

export default function MailForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.includes('@')) {
            setStatus('error');
            return;
        }

        setStatus('sending');

        try {
            const res = await fetch('/api/auth/mail/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            setStatus(res.ok ? 'success' : 'error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 max-w-sm mx-auto mt-12">
            <h1 className="text-2xl font-bold mb-2">🔐 Login to ZeroPass</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="border px-3 py-2 rounded"
            />
            <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {status === 'sending' ? 'Sending...' : 'Send Login Link'}
            </button>

            {status === 'success' && <p className="text-green-600">✅ Email sent! Check your inbox.</p>}
            {status === 'error' && <p className="text-red-600">❌ Failed to send email. Try again.</p>}
        </form>
    );
}
