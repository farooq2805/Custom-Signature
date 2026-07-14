import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["Features", "/#features"],
      ["Live Demo", "/#demo"],
      ["Pricing", "/pricing"],
      ["Templates", "/editor"],
      ["Analytics", "/dashboard"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["For Founders", "/signup?vertical=founders"],
      ["For Realtors", "/signup?vertical=real+estate"],
      ["For Sales Teams", "/signup?vertical=sales+teams"],
      ["For Agencies", "/signup?vertical=agencies"],
      ["For Consultants", "/signup?vertical=consultants"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Blog", "/about#blog"],
      ["Careers", "/about#careers"],
      ["Contact", "mailto:hello@sigcraft.app"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/legal/privacy"],
      ["Terms of Service", "/legal/terms"],
      ["Security", "/legal/security"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Animated, interactive email signatures — hosted, verified, and measured.
            </p>
            <div className="mt-5 flex gap-3 text-sm text-ink-faint">
              <a href="https://x.com" className="hover:text-ink" aria-label="X">𝕏</a>
              <a href="https://linkedin.com" className="hover:text-ink" aria-label="LinkedIn">in</a>
              <a href="https://youtube.com" className="hover:text-ink" aria-label="YouTube">▶</a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-ink-muted transition hover:text-ink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-faint">
          <span>© {new Date().getFullYear()} SigCraft, Inc. All rights reserved.</span>
          <span>Built to land in the inbox, not the spam folder.</span>
        </div>
      </div>
    </footer>
  );
}
