// src/app/api/files/upload/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;
        const file = formData.get('file') as File;

        if (!token || !file) {
            return new Response(JSON.stringify({ error: 'Missing token or file' }), { status: 400 });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (payload as any).userId;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${uuidv4()}_${file.name}`;
        const uploadPath = path.join(process.cwd(), 'uploads', filename);

        await writeFile(uploadPath, buffer);

        const dbEntry = await prisma.file.create({
            data: {
                name: file.name,
                path: filename,
                size: buffer.length,
                userId,
            },
        });

        return new Response(JSON.stringify({ message: 'Uploaded', file: dbEntry }), { status: 200 });

    } catch (err) {
        console.error('❌ Upload error:', err);
        return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
    }
}
