'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function Form() {
  const token = useSearchParams().get('token');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  async function salvar(e) {
    e.preventDefault();
    const r = await fetch('/api/senha-saque/redefinir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, senha })
    });
    const d = await r.json();
    setMsg(d.mensagem || d.erro);
    setOk(!!d.ok);
  }

  if (!token) return <p>Link inválido.</p>;

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', fontFamily: 'Arial' }}>
      <h2>Nova senha de saque</h2>
      {ok ? (
        <p style={{ color: 'green' }}>{msg} ✅</p>
      ) : (
        <form onSubmit={salvar}>
          <input
            type="password" inputMode="numeric" pattern="\d{4,6}" required
            placeholder="4 a 6 dígitos" value={senha}
            onChange={e => setSenha(e.target.value.replace(/\D/g, ''))}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button style={{ width: '100%', padding: 12, background: '#198754', color: '#fff',
                           border: 'none', borderRadius: 8, fontWeight: 'bold' }}>
            Salvar nova senha
          </button>
        </form>
      )}
      {msg && !ok && <p style={{ color: 'red' }}>{msg}</p>}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<p>Carregando...</p>}><Form /></Suspense>;
}
