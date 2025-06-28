import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) throw new Error('No email provided');

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.mailToken.create({
            data: { email, token, expiresAt },
        });

        const link = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/mail/verify?token=${token}`;

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Your ZeroPass Login Link',
            html: `<p>Click to log in: <a href="${link}">${link}</a></p>`,
        });

        console.log('✅ Email sent to:', email);
        return new Response(JSON.stringify({ message: 'Link sent!' }), { status: 200 });

    } catch (err: any) {
        console.error('❌ MAIL REQUEST ERROR:', err.message || err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
