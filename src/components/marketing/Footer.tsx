import Link from "next/link";
import { Logo } from "./Logo";

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

        <div className="flex items-center gap-6 text-sm text-ink-faint">
          <a href="https://x.com" className="transition hover:text-ink" aria-label="X">𝕏</a>
          <a href="https://linkedin.com" className="transition hover:text-ink" aria-label="LinkedIn">in</a>
          <a href="https://youtube.com" className="transition hover:text-ink" aria-label="YouTube">▶</a>
          <a href="mailto:hello@sigcraft.app" className="transition hover:text-ink">hello@sigcraft.app</a>
        </div>

        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} SigCraft, Inc. · Built to land in the inbox, not the spam folder.
        </p>
      </div>
    </footer>
  );
}
