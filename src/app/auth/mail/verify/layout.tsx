// src/app/auth/mail/verify/layout.tsx
import { Suspense } from 'react';

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            {children}
        </Suspense>
    );
}
