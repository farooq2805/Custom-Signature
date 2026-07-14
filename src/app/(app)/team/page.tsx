"use client";

/**
 * Team / bulk management (Team plan): invite teammates, apply the brand
 * template across the roster, directory-sync placeholder. Demo mode keeps
 * the roster in localStorage; with Supabase this maps to `teams` +
 * `team_members`.
 */

import { useEffect, useState } from "react";
import { Check, Mail, Paintbrush, UserPlus, Users } from "lucide-react";
import { Button, Card, Field, TextInput } from "@/components/ui";
import { useActiveSignature } from "@/lib/store";

interface Member {
  email: string;
  role: "owner" | "member";
  status: "active" | "invited";
}

const KEY = "sigcraft-team";

export default function TeamPage() {
  const sig = useActiveSignature();
  const [members, setMembers] = useState<Member[]>([]);
  const [invite, setInvite] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setMembers(
        raw
          ? JSON.parse(raw)
          : [{ email: "you@company.com", role: "owner", status: "active" }]
      );
    } catch {
      setMembers([{ email: "you@company.com", role: "owner", status: "active" }]);
    }
  }, []);

  function save(next: Member[]) {
    setMembers(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!invite || members.some((m) => m.email === invite)) return;
    save([...members, { email: invite, role: "member", status: "invited" }]);
    setInvite("");
  }

  function applyBrand() {
    setApplied(true);
    setTimeout(() => setApplied(false), 2200);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Team</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Roll one brand out across every inbox on the roster.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Users className="h-5 w-5 text-accent" /> Roster
            </h2>
            <span className="text-xs text-ink-faint">{members.length} seat{members.length === 1 ? "" : "s"}</span>
          </div>
          <form onSubmit={sendInvite} className="mb-5 flex gap-2">
            <TextInput
              type="email"
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              placeholder="teammate@company.com"
            />
            <Button type="submit" size="sm">
              <UserPlus className="h-4 w-4" /> Invite
            </Button>
          </form>
          <ul className="flex flex-col divide-y divide-line">
            {members.map((m) => (
              <li key={m.email} className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-dim text-xs font-bold uppercase text-ink-muted">
                    {m.email[0]}
                  </span>
                  <span className="text-sm font-medium text-ink">{m.email}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    m.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-warn/10 text-warn"
                  }`}
                >
                  {m.role === "owner" ? "Owner" : m.status === "active" ? "Active" : "Invited"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Paintbrush className="h-5 w-5 text-accent" /> Brand template
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Apply your current signature&apos;s template, brand color, and CTA to every
              member. Personal fields (name, title, phone) stay individual.
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-cream p-4">
              <span className="h-8 w-8 rounded-lg" style={{ background: sig.brandColor }} />
              <span className="text-sm">
                <span className="block font-medium text-ink">{sig.templateId} template</span>
                <span className="block text-xs text-ink-faint">CTA: “{sig.ctaText}”</span>
              </span>
            </div>
            <Button onClick={applyBrand} className="mt-4 w-full">
              {applied ? <Check className="h-4 w-4" /> : null}
              {applied ? "Applied to roster" : `Apply to all ${members.length} seat${members.length === 1 ? "" : "s"}`}
            </Button>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Mail className="h-5 w-5 text-accent" /> Directory sync
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Connect Google Workspace to auto-provision signatures for new hires and
              deactivate leavers.
            </p>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => {}}>
              Connect Google Workspace (coming soon)
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
