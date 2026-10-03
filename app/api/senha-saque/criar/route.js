import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, senha } = await req.json();

  if (!email || !senha)
    return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 });

  if (!/^\d{4,6}$/.test(senha))
    return NextResponse.json(
      { erro: 'A senha de saque deve ter de 4 a 6 dígitos' },
      { status: 400 }
    );

  // Sem banco: aqui só validamos. Numa versão com armazenamento,
  // você salvaria o hash da senha aqui.
  return NextResponse.json({
    ok: true,
    mensagem: 'Senha de saque criada com sucesso!'
  });
}
