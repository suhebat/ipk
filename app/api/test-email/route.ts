import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function GET() {
  try {
    await sendMail({
      to: process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER!,
      subject: "[IPK] Tes SMTP berhasil",
      html: "<p>Email dari portal IPK berhasil terkirim.</p>",
      text: "Email dari portal IPK berhasil terkirim.",
    });
    return NextResponse.json({ ok: true, message: "Email terkirim" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("SMTP error:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}