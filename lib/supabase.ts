import { createClient } from "@supabase/supabase-js";

export type EmailType = "an" | "senat" | "europarl" | "ancien";

export function getSupabaseAnon() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function detectEmailType(email: string): EmailType | null {
  const lower = email.toLowerCase().trim();
  if (lower.endsWith("@clb-an.fr")) return "an";
  if (lower.endsWith("@clb-senat.fr")) return "senat";
  if (lower.endsWith("@europarl.europa.eu")) return "europarl";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(lower)) return "ancien";
  return null;
}

export function emailTypeLabel(type: EmailType): string {
  switch (type) {
    case "an": return "Collaborateur Assemblée nationale";
    case "senat": return "Collaborateur Sénat";
    case "europarl": return "Collaborateur Parlement européen";
    case "ancien": return "Ancien collaborateur";
  }
}
