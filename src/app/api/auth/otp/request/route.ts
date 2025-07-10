import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { Twilio } from 'twilio';

const prisma = new PrismaClient();
const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
    const { phone } = await req.json();

    if (!phone) return new Response(JSON.stringify({ error: 'Phone required' }), { status: 400 });

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.oTP.create({ data: { phone, code, expiresAt } });

    // ✅ For development, log instead of sending SMS
    console.log(`🔢 OTP for ${phone}: ${code}`);

    // ✅ To actually send:
    /*
    await twilio.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE!,
      body: `Your ZeroPass code: ${code}`,
    });
    */

    return new Response(JSON.stringify({ message: 'OTP sent' }), { status: 200 });
}
