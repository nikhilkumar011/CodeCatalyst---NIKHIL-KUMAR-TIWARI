import Image from "next/image";

export default function Home() {
  return (
    <div>
<div className="min-h-screen relative flex items-center justify-center bg-[#0A1A33] overflow-hidden px-4 sm:px-6 py-10 sm:py-16">
  {/* scalable grid + dot texture */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage:
        "radial-gradient(circle, #24487F 1px, transparent 1px), linear-gradient(#132A4D 1px, transparent 1px), linear-gradient(90deg, #132A4D 1px, transparent 1px)",
      backgroundSize: "22px 22px, 88px 88px, 88px 88px",
      opacity: 0.5,
    }}
  />

  <div
    className="absolute -top-[10vw] -left-[10vw] w-[55vw] h-[55vw] rounded-full pointer-events-none"
    style={{ background: "radial-gradient(circle, rgba(62,142,255,0.16) 0%, rgba(62,142,255,0) 70%)" }}
  />
  <div
    className="absolute -bottom-[15vw] -right-[10vw] w-[60vw] h-[60vw] rounded-full pointer-events-none"
    style={{ background: "radial-gradient(circle, rgba(47,125,225,0.16) 0%, rgba(47,125,225,0) 70%)" }}
  />
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full pointer-events-none"
    style={{ background: "radial-gradient(circle, rgba(47,125,225,0.14) 0%, rgba(47,125,225,0) 65%)" }}
  />

  <svg className="absolute top-[8%] right-[6%] w-8 h-8 sm:w-10 sm:h-10 opacity-50" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="#3E6FB3" strokeWidth="1" />
    <path d="M12,0 V6 M12,18 V24 M0,12 H6 M18,12 H24" stroke="#3E6FB3" strokeWidth="1" />
  </svg>
  <svg className="absolute bottom-[10%] left-[6%] w-6 h-6 sm:w-8 sm:h-8 opacity-40" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="none" stroke="#3E6FB3" strokeWidth="1" />
    <circle cx="12" cy="12" r="2" fill="#3E6FB3" />
  </svg>

  <div className="relative z-10 w-full max-w-md">
    {/* mobile-only connection strip */}
    <div className="flex md:hidden items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3E8EFF] opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3E8EFF]" />
        </span>
        <span className="text-[10px] font-mono tracking-widest text-[#6E86B3] uppercase">
          you're securely connected
        </span>
      </div>
      <div className="flex items-end gap-[3px]">
        <div className="w-[3px] h-[6px] bg-[#3E6FB3] rounded-sm" />
        <div className="w-[3px] h-[9px] bg-[#3E6FB3] rounded-sm" />
        <div className="w-[3px] h-[12px] bg-[#3E8EFF] rounded-sm" />
      </div>
    </div>

    {/* PANEL */}
    <div className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(10,26,51,0.4)] bg-white">
      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#C7D4EA] z-20" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C7D4EA] z-20" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#C7D4EA] z-20" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C7D4EA] z-20" />

      {/* header strip */}
      <div className="relative bg-[#0A1A33] px-5 py-3 flex items-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
          <defs>
            <pattern id="hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#3E6FB3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch)" />
        </svg>
        <div className="relative flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
          <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
          <span className="w-2 h-2 rounded-full bg-[#28C840]" />
        </div>
      </div>

      <div className="relative px-6 sm:px-8 py-8 sm:py-9">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#F1F5FC 1px, transparent 1px), linear-gradient(90deg, #F1F5FC 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-7 sm:mb-8">
            <div className="w-9 h-9 rounded-md bg-[#0A1A33] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="5" y="5" width="6" height="6" rx="1" fill="none" stroke="#3E8EFF" strokeWidth="1.2" />
                <path d="M8,0 V4 M8,12 V16 M0,8 H4 M12,8 H16" stroke="#3E8EFF" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F7DE1] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F7DE1]" />
              </span>
              <span className="text-[11px] font-mono tracking-widest text-[#7A8BAA] uppercase">
                you're all set
              </span>
            </div>
          </div>

          <h1
            className="text-2xl sm:text-[28px] font-semibold text-[#0A1A33] mb-1 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
          >
            Welcome back<span className="text-[#2F7DE1]">!</span>
          </h1>
          <p className="text-sm text-[#5A6B8C] mb-6">
            Good to see you again — let's get you signed in.
          </p>

          <div className="flex items-center gap-1.5 mb-7">
            <div className="w-6 h-[2px] bg-[#2F7DE1] rounded-full" />
            <div className="w-1.5 h-[2px] bg-[#B9CCE8] rounded-full" />
            <div className="w-1.5 h-[2px] bg-[#DCE6F5] rounded-full" />
          </div>

          {/* social auth */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <button
              type="button"
              suppressHydrationWarning
              className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2.5 rounded-lg border border-[#E1E8F5] hover:border-[#2F7DE1] hover:bg-[#F3F7FF] transition-colors text-sm font-medium text-[#0A1A33]"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="flex-shrink-0">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              suppressHydrationWarning
              className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2.5 rounded-lg border border-[#E1E8F5] hover:border-[#2F7DE1] hover:bg-[#F3F7FF] transition-colors text-sm font-medium text-[#0A1A33]"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="#0A1A33" aria-hidden="true" className="flex-shrink-0">
                <path d="M8 0C3.58 0 0 3.65 0 8.15c0 3.6 2.29 6.65 5.47 7.73.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.16-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.2-3.64-.91-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.04.08-2.17 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.13.16 1.97.08 2.17.51.57.82 1.29.82 2.19 0 3.12-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.14 8.14 0 0 0 16 8.15C16 3.65 12.42 0 8 0z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-dashed border-[#E1E8F5]" />
            <span className="text-[11px] font-mono tracking-widest text-[#9AA8C4] whitespace-nowrap">or use your email</span>
            <div className="flex-1 border-t border-dashed border-[#E1E8F5]" />
          </div>

          {/* email form */}
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0A1A33] mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  suppressHydrationWarning
                  placeholder="you@company.com"
                  className="w-full pl-3.5 pr-9 py-2.5 text-sm font-mono rounded-lg outline-none bg-[#F7FAFF] border border-[#E1E8F5] text-[#0A1A33] placeholder-[#A6B3CC] focus:border-[#2F7DE1] focus:ring-2 focus:ring-[#2F7DE1]/15 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C7D4EA] text-xs font-mono">@</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#0A1A33]">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-[#7A8BAA] hover:text-[#2F7DE1] transition-colors">
                  Forgot it?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                suppressHydrationWarning
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg outline-none bg-[#F7FAFF] border border-[#E1E8F5] text-[#0A1A33] placeholder-[#A6B3CC] focus:border-[#2F7DE1] focus:ring-2 focus:ring-[#2F7DE1]/15 transition-all"
              />
              <div className="flex items-center gap-1 mt-2">
                <div className="flex items-end gap-[3px]">
                  <div className="w-[3px] h-[5px] bg-[#2F7DE1] rounded-sm" />
                  <div className="w-[3px] h-[8px] bg-[#2F7DE1] rounded-sm" />
                  <div className="w-[3px] h-[11px] bg-[#DCE6F5] rounded-sm" />
                  <div className="w-[3px] h-[14px] bg-[#DCE6F5] rounded-sm" />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#5A6B8C] cursor-pointer select-none">
              <input type="checkbox" suppressHydrationWarning className="w-3.5 h-3.5 accent-[#2F7DE1] flex-shrink-0" />
              Keep me signed in
            </label>

            <button
              type="submit"
              suppressHydrationWarning
              className="w-full py-2.5 sm:py-3 rounded-lg font-mono text-sm font-semibold tracking-wide uppercase bg-[#2F7DE1] text-white hover:bg-[#2569C4] active:scale-[0.98] transition-all"
            >
              Sign in →
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5A6B8C]">
            New here?{" "}
            <a href="#" className="font-medium text-[#2F7DE1] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}
