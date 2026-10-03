'use client';
import { useState } from 'react';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setLoading(true); setMsg('');
    const r = await fetch('/api/senha-saque/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const d = await r.json();
    setMsg(d.mensagem || d.erro);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 420, margin: '80px auto', fontFamily: 'Arial' }}>
      <h2>Recuperar senha de saque</h2>
      <p>Informe seu e-mail. Enviaremos um link para redefinir.</p>
      <form onSubmit={enviar}>
        <input
          type="email" required placeholder="seu@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button disabled={loading}
          style={{ width: '100%', padding: 12, background: '#0d6efd', color: '#fff',
                   border: 'none', borderRadius: 8, fontWeight: 'bold' }}>
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </main>
  );
}
