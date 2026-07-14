export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="bg-gradient-accent flex h-7 w-7 items-center justify-center rounded-lg font-display text-sm font-bold text-white">
        S
      </span>
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        SigCraft
      </span>
    </span>
  );
}
