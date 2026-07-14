"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SignatureData, SignatureElement } from "./types";
import { DEFAULT_SIGNATURE } from "./templates";

/**
 * Editor + demo-mode data store.
 * Persisted to localStorage so a visitor's work survives reloads even before
 * they connect an account. When Supabase auth is wired, this becomes the
 * optimistic local cache in front of the `signatures` table.
 */
interface SigState {
  signatures: SignatureData[];
  activeId: string;
  setActive: (id: string) => void;
  update: (patch: Partial<SignatureData>) => void;
  updateSocial: (platform: string, url: string) => void;
  reorder: (order: SignatureElement[]) => void;
  addSignature: () => string;
  removeSignature: (id: string) => void;
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useSigStore = create<SigState>()(
  persist(
    (set, get) => ({
      signatures: [{ ...DEFAULT_SIGNATURE, id: "sig-1", slug: "alex-rivera" }],
      activeId: "sig-1",
      setActive: (id) => set({ activeId: id }),
      update: (patch) =>
        set((s) => ({
          signatures: s.signatures.map((sig) =>
            sig.id === s.activeId
              ? { ...sig, ...patch, updatedAt: new Date().toISOString() }
              : sig
          ),
        })),
      updateSocial: (platform, url) =>
        set((s) => ({
          signatures: s.signatures.map((sig) =>
            sig.id === s.activeId
              ? { ...sig, socials: { ...sig.socials, [platform]: url } }
              : sig
          ),
        })),
      reorder: (order) => get().update({ elementOrder: order }),
      addSignature: () => {
        const id = `sig-${newId()}`;
        const base = get().signatures.find((s) => s.id === get().activeId);
        set((s) => ({
          signatures: [
            ...s.signatures,
            {
              ...(base ?? DEFAULT_SIGNATURE),
              id,
              slug: newId(),
              createdAt: new Date().toISOString(),
            },
          ],
          activeId: id,
        }));
        return id;
      },
      removeSignature: (id) =>
        set((s) => {
          const remaining = s.signatures.filter((sig) => sig.id !== id);
          return {
            signatures: remaining.length ? remaining : s.signatures,
            activeId:
              remaining.length && s.activeId === id ? remaining[0].id : s.activeId,
          };
        }),
    }),
    { name: "sigcraft-editor" }
  )
);

export function useActiveSignature(): SignatureData {
  const { signatures, activeId } = useSigStore();
  return signatures.find((s) => s.id === activeId) ?? signatures[0];
}
