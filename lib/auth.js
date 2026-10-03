import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function gerarTokenRecuperacao(email) {
  return jwt.sign(
    { email, tipo: 'recuperar-senha-saque' },
    SECRET,
    { expiresIn: '30m' }
  );
}

export function verificarTokenRecuperacao(token) {
  try {
    const dados = jwt.verify(token, SECRET);
    if (dados.tipo !== 'recuperar-senha-saque') return null;
    return dados;
  } catch {
    return null; // expirado ou inválido
  }
}
