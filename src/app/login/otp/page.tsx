'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPLoginPage() {
    const [step, setStep] = useState<'enter' | 'verify'>('enter');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const router = useRouter();

    async function sendOTP() {
        const res = await fetch('/api/auth/otp/request', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });

        if (res.ok) setStep('verify');
    }

    async function verifyOTP() {
        const res = await fetch('/api/auth/otp/verify', {
            method: 'POST',
            body: JSON.stringify({ phone, code }),
        });
        const data = await res.json();

        if (data.token) {
            localStorage.setItem('zeropass-token', data.token);
            router.push('/dashboard');
        } else {
            alert('❌ Invalid code');
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            {step === 'enter' ? (
                <>
                    <h1 className="text-xl font-bold mb-2">📱 Enter Phone Number</h1>
                    <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91..."
                        className="border p-2 w-full"
                    />
                    <button onClick={sendOTP} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                        Send OTP
                    </button>
                </>
            ) : (
                <>
                    <h1 className="text-xl font-bold mb-2">🔐 Enter OTP</h1>
                    <input
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="6-digit code"
                        className="border p-2 w-full"
                    />
                    <button onClick={verifyOTP} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
                        Verify
                    </button>
                </>
            )}
        </div>
    );
}
