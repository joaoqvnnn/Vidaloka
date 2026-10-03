import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';

export async function POST(req) {
  try {
    const { token, senha } = await req.json();

    if (!token || !senha)
      return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 });

    if (!/^\d{4,6}$/.test(senha))
      return NextResponse.json({ erro: 'A senha deve ter 4 a 6 dígitos' }, { status: 400 });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { rows } = await sql`
      SELECT id, usuario_id FROM tokens_recuperacao
      WHERE token_hash = ${tokenHash}
        AND usado = FALSE
        AND expira_em > NOW()
      LIMIT 1
    `;

    if (rows.length === 0)
      return NextResponse.json({ erro: 'Link inválido ou expirado' }, { status: 400 });

    const reg = rows[0];
    const hash = await bcrypt.hash(senha, 10);

    await sql`UPDATE usuarios SET senha_saque_hash = ${hash} WHERE id = ${reg.usuario_id}`;
    await sql`UPDATE tokens_recuperacao SET usado = TRUE WHERE id = ${reg.id}`;

    return NextResponse.json({ ok: true, mensagem: 'Senha de saque redefinida com sucesso!' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
