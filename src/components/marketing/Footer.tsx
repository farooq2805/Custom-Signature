import Link from "next/link";
import { Linkedin, Mail, Youtube } from "lucide-react";
import { Logo } from "./Logo";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const LINKS: [string, string][] = [
  ["Features", "/#features"],
  ["Showcase", "/#showcase"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Privacy", "/legal/privacy"],
  ["Terms", "/legal/terms"],
  ["Security", "/legal/security"],
];

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <Link href="/" aria-label="SigCraft home">
          <Logo />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-ink-faint">
          {[
            { href: "https://x.com", label: "X (Twitter)", Icon: XIcon },
            { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
            { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
            { href: "mailto:hello@sigcraft.app", label: "Email us", Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-cream-dim hover:text-ink"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} SigCraft, Inc. · Built to land in the inbox, not the spam folder.
        </p>
      </div>
    </footer>
  );
}
