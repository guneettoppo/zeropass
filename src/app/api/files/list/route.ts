import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

        type FileEntry = {
            id: string;
            name: string;
            path: string;
            size: number;
            userId: string;
            createdAt: Date;
        };

        const files: FileEntry[] = await prisma.file.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
        });


        return new Response(JSON.stringify(files), { status: 200 });
    } catch (err) {
        console.error('❌ FILE LIST ERROR:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch files' }), { status: 500 });
    }
}
