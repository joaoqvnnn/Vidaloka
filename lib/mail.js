import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // seuemail@gmail.com
    pass: process.env.EMAIL_APP_PASSWORD // senha de app (16 dígitos)
  }
});

export async function enviarEmailRecuperacao({ para, link }) {
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;
              border:1px solid #eee;border-radius:12px">
    <h2 style="color:#111">🔒 Recuperação de senha de saque</h2>
    <p>Olá!</p>
    <p>Recebemos uma solicitação para <b>alterar sua senha de saque</b>.</p>
    <p>Se foi você, clique no botão abaixo. O link é válido por <b>30 minutos</b>.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}"
         style="background:#0d6efd;color:#fff;padding:12px 24px;border-radius:8px;
                text-decoration:none;font-weight:bold">
        Redefinir senha de saque
      </a>
    </p>
    <p style="font-size:13px;color:#666">
      Se o botão não funcionar, copie e cole este link no navegador:<br>
      <span style="word-break:break-all">${link}</span>
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="font-size:12px;color:#888">
      Se você <b>não solicitou</b> essa alteração, ignore este e-mail.
      Sua senha permanecerá a mesma.
    </p>
  </div>`;

  await transporter.sendMail({
    from: `"Minha App" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: 'Recuperação de senha de saque',
    html
  });
}
