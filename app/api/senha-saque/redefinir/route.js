import { NextResponse } from 'next/server';
import { verificarTokenRecuperacao } from '@/lib/auth';

export async function POST(req) {
  try {
    const { token, senha } = await req.json();

    if (!token || !senha)
      return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 });

    if (!/^\d{4,6}$/.test(senha))
      return NextResponse.json({ erro: 'A senha deve ter 4 a 6 dígitos' }, { status: 400 });

    const dados = verificarTokenRecuperacao(token);
    if (!dados)
      return NextResponse.json({ erro: 'Link inválido ou expirado' }, { status: 400 });

    // Sem banco: aqui só confirmamos. Com Vercel KV, você salvaria
    // o novo hash no lugar do antigo.
    return NextResponse.json({
      ok: true,
      mensagem: `Senha de saque redefinida para ${dados.email}!`
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
