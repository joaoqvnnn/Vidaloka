import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha)
      return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 });

    if (!/^\d{4,6}$/.test(senha))
      return NextResponse.json(
        { erro: 'A senha de saque deve ter de 4 a 6 dígitos' },
        { status: 400 }
      );

    const hash = await bcrypt.hash(senha, 10);

    const { rows } = await sql`
      INSERT INTO usuarios (email, senha_saque_hash)
      VALUES (${email.toLowerCase()}, ${hash})
      ON CONFLICT (email)
      DO UPDATE SET senha_saque_hash = EXCLUDED.senha_saque_hash
      RETURNING id, email
    `;

    return NextResponse.json({ ok: true, usuario: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
