// File: /app/api/auth/otp/verify/route.ts

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { phone, code } = await req.json();

    if (!phone || !code) {
        return new Response(JSON.stringify({ error: 'Missing phone or code' }), { status: 400 });
    }

    const otpEntry = await prisma.oTP.findUnique({ where: { phone } });

    if (!otpEntry || otpEntry.code !== code || otpEntry.expiresAt < new Date()) {
        return new Response(JSON.stringify({ error: 'Invalid or expired OTP' }), { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
        user = await prisma.user.create({ data: { phone } });
    }

    await prisma.oTP.delete({ where: { phone } });

    const token = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET!, { expiresIn: '15m' });

    return new Response(JSON.stringify({ token }), { status: 200 });
}
