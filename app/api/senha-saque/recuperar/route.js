import { NextResponse } from 'next/server';
import { gerarTokenRecuperacao } from '@/lib/auth';
import { enviarEmailRecuperacao } from '@/lib/mail';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ erro: 'Informe o e-mail' }, { status: 400 });

    const token = gerarTokenRecuperacao(email.toLowerCase());

    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const link = `${base}/redefinir-senha?token=${token}`;

    await enviarEmailRecuperacao({ para: email, link });

    return NextResponse.json({
      ok: true,
      mensagem: 'Enviamos um link de recuperação pro seu e-mail.'
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
