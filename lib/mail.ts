import nodemailer from "nodemailer";

/**
 * Kirim email via SMTP resmi domain .go.id
 * Host: smtpauth.mail.go.id (port 587, STARTTLS)
 *
 * Isi di .env.local:
 *   SMTP_HOST=smtpauth.mail.go.id
 *   SMTP_PORT=587
 *   SMTP_USER=ipk@kemenbud.go.id
 *   SMTP_PASS=...
 *   SMTP_FROM="Portal IPK" <ipk@kemenbud.go.id>
 *   ADMIN_NOTIFY_EMAIL=ipk@kemenbud.go.id
 *   NEXT_PUBLIC_APP_URL=http://localhost:3001
 *
 * Jangan commit password.
 */
export function getMailer() {
  const host = process.env.SMTP_HOST || "smtpauth.mail.go.id";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP_USER / SMTP_PASS belum diisi. Lengkapi di file .env.local lalu restart server."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL langsung; 587 = STARTTLS
    requireTLS: port === 587,
    auth: {
      user,
      pass,
    },
    // Jika server memakai sertifikat bermasalah (dev saja), buka baris di bawah:
    // tls: { rejectUnauthorized: false },
  });
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const from =
    process.env.SMTP_FROM ||
    `"Portal IPK" <${process.env.SMTP_USER || "ipk@kemenbud.go.id"}>`;

  const transporter = getMailer();
  return transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}

/** Notifikasi ke admin saat ada permohonan data baru */
export async function notifyAdminNewPermohonan(payload: {
  nomor: string;
  nama: string;
  email: string;
}) {
  const adminTo = process.env.ADMIN_NOTIFY_EMAIL || "ipk@kemenbud.go.id";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  await sendMail({
    to: adminTo,
    subject: `[IPK] Permohonan data baru — ${payload.nomor}`,
    html: `
      <p>Ada permohonan data baru.</p>
      <ul>
        <li><b>Nomor:</b> ${payload.nomor}</li>
        <li><b>Pemohon:</b> ${payload.nama}</li>
        <li><b>Email:</b> ${payload.email}</li>
      </ul>
      <p>
        <a href="${appUrl}/admin/permohonan-data">Buka panel Admin Permohonan Data</a>
      </p>
    `,
    text: `Permohonan data baru ${payload.nomor} dari ${payload.nama} (${payload.email})`,
  });
}

/** Konfirmasi ke pemohon bahwa permohonan diterima */
export async function notifySenderPermohonanReceived(payload: {
  to: string;
  nama: string;
  nomor: string;
}) {
  await sendMail({
    to: payload.to,
    subject: `Permohonan data Anda diterima — ${payload.nomor}`,
    html: `
      <p>Yth. ${payload.nama},</p>
      <p>
        Permohonan data Anda dengan nomor <b>${payload.nomor}</b>
        telah kami terima dan akan diproses.
      </p>
      <p>Hormat kami,<br/>Pusdatin Kementerian Kebudayaan</p>
    `,
    text: `Yth. ${payload.nama}, permohonan data nomor ${payload.nomor} telah kami terima dan akan diproses. Hormat kami, Pusdatin Kementerian Kebudayaan`,
  });
}
