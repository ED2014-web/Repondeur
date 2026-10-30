import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

export async function GET() {
  const { data } = await supabase.from('urgencies').select('*').order('id', { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  await supabase.from('urgencies').insert([
    { callerName: body.name, message: body.message, timestamp: new Date().toLocaleTimeString() }
  ]);

  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ia@votre-repondeur.com',
        to: 'VOTRE_MAIL_ICLOUD@icloud.com',
        subject: `🚨 URGENT : Appel de ${body.name}`,
        text: `Message laissé à l'IA : ${body.message}`
      })
    });
  }

  return NextResponse.json({ success: true });
}