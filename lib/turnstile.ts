// lib/turnstile.ts
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  ip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY belum diatur.");
  if (!token) return false;

  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: params,
    cache: "no-store",
  });
  const result = (await res.json()) as { success?: boolean };
  return result.success === true;
}