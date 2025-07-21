import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;
        const file = formData.get('file') as File;

        if (!token || !file) {
            return new Response(
                JSON.stringify({ error: 'Missing token or file' }),
                { status: 400 }
            );
        }

        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.userId;

        // Convert to buffer to calculate size
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ Check 500MB limit
        const userFiles = await prisma.file.findMany({
            where: { userId },
            select: { size: true },
        });

        const usedBytes = userFiles.reduce((acc, file) => acc + file.size, 0);
        const maxBytes = 500 * 1024 * 1024; // 500MB

        if (usedBytes + buffer.length > maxBytes) {
            return new Response(
                JSON.stringify({ error: 'Storage limit exceeded (500MB)' }),
                { status: 403 }
            );
        }

        // ✅ Upload to Vercel Blob
        const filename = `${uuidv4()}_${file.name}`;
        const blob = await put(filename, file.stream(), {
            access: 'public',
        });

        // ✅ Save to DB
        const dbEntry = await prisma.file.create({
            data: {
                name: file.name,
                path: blob.url, // public URL
                size: buffer.length,
                userId,
            },
        });

        return new Response(
            JSON.stringify({ message: 'Uploaded', file: dbEntry }),
            { status: 200 }
        );
    } catch (err: any) {
        console.error('❌ Upload error:', err);
        return new Response(
            JSON.stringify({ error: 'Upload failed' }),
            { status: 500 }
        );
    }
}
