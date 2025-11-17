"use client";

/**
 * BackgroundAura Component
 * Premium background effects with gradient blobs and grid patterns
 * Used across all pages for consistent visual design
 */
export function BackgroundAura() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft radial gradient blobs */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-red-400/30 to-orange-400/20 blur-3xl dark:from-red-600/20 dark:to-orange-600/10" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-400/25 to-green-400/20 blur-3xl dark:from-amber-600/15 dark:to-green-600/10" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(55%_60%_at_50%_40%,black,transparent)] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(100,116,139,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          backgroundPosition: "-1px -1px",
        }}
      />

      {/* Top highlight line */}
      <div className="absolute inset-x-0 top-[64px] h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
    </div>
  );
}