/**
 * Comma-separated list in NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL.
 * Example: demo@marketmate.app,admin@yourcompany.com
 */
function getDemoEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isDemoEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = getDemoEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

export function getDemoAccountLabel(): string {
  return "Presentation demo";
}
