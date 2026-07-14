import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is optional at runtime: when the env vars are absent (local demo,
 * preview deploys) the app falls back to the in-memory/localStorage demo
 * store so every surface stays explorable. Set these in .env.local:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (server-only, for event logging)
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!browserClient) browserClient = createClient(url!, anonKey!);
  return browserClient;
}

/** Server-side client with elevated permissions (event writes, HTML serving). */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
