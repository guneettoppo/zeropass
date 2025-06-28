import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    console.log('🔐 Incoming token:', token);

    if (!token) {
        return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
    }

    try {
        // 🔄 Cleanup expired tokens before checking
        await prisma.mailToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        });

        // 🔍 Look for token
        const tokenEntry = await prisma.mailToken.findFirst({
            where: { token }
        });

        console.log('🧪 tokenEntry:', tokenEntry);

        if (!tokenEntry) {
            return new Response(JSON.stringify({ error: 'Token not found or expired' }), { status: 400 });
        }

        const { email, id, expiresAt } = tokenEntry;

        if (expiresAt < new Date()) {
            return new Response(JSON.stringify({ error: 'Token expired' }), { status: 400 });
        }

        // ✅ Create user if not exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: { email }
            });
            console.log('🆕 Created user:', user);
        }

        // 🧼 Delete used token
        await prisma.mailToken.delete({ where: { id } });

        // 🔐 Create JWT
        const jwtPayload = { userId: user.id, email: user.email };
        const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
            expiresIn: '15m'
        });

        console.log('✅ Issued JWT for:', email);
        return new Response(JSON.stringify({ token: jwtToken }), { status: 200 });

    } catch (err: any) {
        console.error('❌ VERIFY ERROR:', err.message || err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
