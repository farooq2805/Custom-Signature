"use client";

/**
 * Demo-mode auth shim. When Supabase env vars are present we use real
 * Supabase email auth; otherwise we keep a local session so the whole app
 * remains explorable (and testable) without credentials.
 */
import { getSupabase, supabaseEnabled } from "./supabase";
import type { PlanId } from "./types";

export interface LocalSession {
  email: string;
  name: string;
  plan: PlanId;
  trialEndsAt: string;
  createdAt: string;
}

const KEY = "sigcraft-session";

export function getSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
}

export async function signUp(email: string, password: string, name: string, plan: PlanId) {
  if (supabaseEnabled) {
    const supabase = getSupabase()!;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, plan } },
    });
    if (error) throw error;
  }
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  const session: LocalSession = {
    email,
    name,
    plan,
    trialEndsAt,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export async function signIn(email: string, password: string) {
  if (supabaseEnabled) {
    const supabase = getSupabase()!;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  const existing = getSession();
  const session: LocalSession = existing?.email === email
    ? existing
    : {
        email,
        name: email.split("@")[0],
        plan: "pro",
        trialEndsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export async function signOut() {
  if (supabaseEnabled) await getSupabase()!.auth.signOut();
  localStorage.removeItem(KEY);
}

export function updateSession(patch: Partial<LocalSession>) {
  const s = getSession();
  if (!s) return;
  localStorage.setItem(KEY, JSON.stringify({ ...s, ...patch }));
}
