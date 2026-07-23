"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Outer blocky ring */}
      <div
        className="absolute inset-0 border-2 border-[var(--neon-cyan)]/30"
        style={{ borderRadius: "0" }}
      />
      {/* Spinning neon segments */}
      <div
        className="absolute inset-0 border-t-2 border-[var(--neon-cyan)] border-r-2 border-[var(--neon-pink)] animate-spin"
        style={{ borderRadius: "0" }}
      />
    </div>
  );
}

// Full page loader (for global loading.tsx or manual overlays)
export function PageLoader({ message = "LOADING..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--dark-bg)]">
      <div className="fixed inset-0 crt-overlay opacity-20 pointer-events-none" />
      <div className="fixed inset-0 retro-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[var(--neon-cyan)] blur-2xl opacity-20 animate-pulse" />
          <div
            className="h-16 w-16 border-4 border-[var(--neon-cyan)] border-t-[var(--neon-pink)] animate-spin mx-auto"
            style={{ borderRadius: "0" }}
          />
        </div>

        <h2 className="font-pixel text-xl text-[var(--neon-yellow)] text-glow-yellow mb-6 animate-pulse">
          {message}
        </h2>

        {/* Retro Progress Bar */}
        <div
          className="w-64 h-4 border-4 border-[var(--neon-cyan)] bg-[#1a0b2e] p-1 mx-auto"
          style={{ borderRadius: "0" }}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-pink)] to-[var(--neon-yellow)] animate-[loading_2s_ease-in-out_infinite]"
            style={{ backgroundSize: "200% 100%", borderRadius: "0" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
