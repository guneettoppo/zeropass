import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
    userId: string;
    email: string;
}

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.userId;

        const files = await prisma.file.findMany({
            where: { userId },
            select: { size: true },
        });

        const used = files.reduce((acc, f) => acc + f.size, 0);
        const max = 500 * 1024 * 1024;

        return new Response(
            JSON.stringify({
                usedBytes: used,
                maxBytes: max,
                percentUsed: Math.round((used / max) * 100),
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error('❌ Usage error:', err);
        return new Response(JSON.stringify({ error: 'Could not fetch usage' }), { status: 500 });
    }
}
