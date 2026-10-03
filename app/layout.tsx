// app/layout.tsx (Se estiver usando TypeScript)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Senha de Saque',
  description: 'Sistema de senha de saque e recuperação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
