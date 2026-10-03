import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';
import { enviarEmailRecuperacao } from '@/lib/mail';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ erro: 'Informe o e-mail' }, { status: 400 });

    // resposta genérica (não revela se o e-mail existe)
    const resposta = {
      ok: true,
      mensagem: 'Se este e-mail estiver cadastrado, enviaremos um link de recuperação.'
    };

    const { rows } = await sql`
      SELECT id, email FROM usuarios WHERE email = ${email.toLowerCase()}
    `;
    if (rows.length === 0) return NextResponse.json(resposta);

    const usuario = rows[0];

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expira = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    // invalida tokens antigos
    await sql`
      UPDATE tokens_recuperacao SET usado = TRUE
      WHERE usuario_id = ${usuario.id} AND usado = FALSE
    `;

    await sql`
      INSERT INTO tokens_recuperacao (usuario_id, token_hash, expira_em)
      VALUES (${usuario.id}, ${tokenHash}, ${expira})
    `;

    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const link = `${base}/redefinir-senha?token=${token}`;

    await enviarEmailRecuperacao({ para: usuario.email, link });

    return NextResponse.json(resposta);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
