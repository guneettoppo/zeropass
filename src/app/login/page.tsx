// src/app/login/route.ts
'use client';

import { useState } from 'react';

export default function MailForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await fetch('/api/auth/mail/request', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        });
        setStatus(res.ok ? 'Email sent!' : 'Failed');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
            <button type="submit">Send Mail Link</button>
            <p>{status}</p>
        </form>
    );
}
