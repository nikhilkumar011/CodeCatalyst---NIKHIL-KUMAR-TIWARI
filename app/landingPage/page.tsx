"use client";

import Link from "next/link";
import { FileText, Play, Brain, Sparkles, MessageSquare, Target } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F7F8FA] text-[#12131A] dark:bg-[#05070d] dark:text-[#F2F4F8] font-sans flex items-center transition-colors duration-300">
            {/* Background glows */}
            <div
                className="pointer-events-none absolute inset-0 z-0 dark:opacity-100 opacity-60"
                style={{
                    background:
                        "radial-gradient(circle at 20% 50%, rgba(79,125,243,0.10), transparent 50%), radial-gradient(circle at 80% 50%, rgba(155,93,229,0.10), transparent 50%)",
                }}
            />

            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-100"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                    maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)",
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                    maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 80%)",
                }}
            />

            <main className="relative z-10 mx-auto max-w-[1200px] w-full px-6 py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column - Visual Representation */}
                <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-start perspective-[2000px]">
                    {/* Back "Phone/Card" Mockup */}
                    <div className="absolute left-[10%] top-[10%] h-[420px] w-[260px] transform rounded-3xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-[rgba(18,22,34,0.8)] shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-700 hover:rotate-y-0 rotate-y-[15deg] rotate-z-[-5deg] p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-black/[0.08] dark:border-white/10 pb-4">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] flex items-center justify-center">
                                <FileText size={16} className="text-white" />
                            </div>
                            <div className="h-2 w-20 rounded-full bg-black/10 dark:bg-white/20"></div>
                        </div>
                        <div className="space-y-3 mt-2">
                            <div className="h-2 w-full rounded-full bg-black/[0.06] dark:bg-white/10"></div>
                            <div className="h-2 w-[90%] rounded-full bg-black/[0.06] dark:bg-white/10"></div>
                            <div className="h-2 w-[80%] rounded-full bg-black/[0.06] dark:bg-white/10"></div>
                        </div>
                        <div className="mt-auto rounded-xl bg-black/[0.03] dark:bg-white/5 p-4 border border-black/[0.05] dark:border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-[#0EA5E9] dark:text-[#34D399]" />
                                <div className="h-1.5 w-16 rounded-full bg-black/10 dark:bg-white/20"></div>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-black/[0.06] dark:bg-white/10 mb-2"></div>
                            <div className="h-1.5 w-2/3 rounded-full bg-black/[0.06] dark:bg-white/10"></div>
                        </div>
                    </div>

                    {/* Front "Phone/Card" Mockup */}
                    <div className="absolute right-[15%] bottom-[5%] h-[440px] w-[280px] transform rounded-3xl border border-black/[0.1] dark:border-white/[0.15] bg-white dark:bg-[#121622] shadow-[0_30px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-transform duration-700 hover:rotate-y-0 rotate-y-[-10deg] rotate-z-[2deg] flex flex-col overflow-hidden">
                        <div className="bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] p-6">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                                <Target size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Key Contributions</h3>
                            <p className="text-xs text-white/80">Extracted from 24 pages</p>
                        </div>
                        <div className="flex-1 p-6 space-y-5 bg-[#FAFAFB] dark:bg-[rgba(18,22,34,0.6)]">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] border border-black/10 dark:border-white/20 flex items-center justify-center text-[8px] text-white">✓</div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/20"></div>
                                        <div className="h-2 w-4/5 rounded-full bg-black/[0.06] dark:bg-white/10"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-black/[0.08] dark:border-white/10 flex gap-2">
                            <div className="h-10 flex-1 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] flex items-center justify-center opacity-90 text-[11px] font-semibold tracking-wider text-white">CHAT WITH PDF</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Text & CTAs */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-20">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] shadow-[0_0_15px_rgba(93,138,245,0.4)]">
                            <Brain size={18} className="text-white" />
                        </div>
                        <span className="font-semibold tracking-wide text-[#12131A] dark:text-[#F2F4F8]">Research AI</span>
                    </div>

                    <h1 className="mb-6 font-[Space_Grotesk,sans-serif] text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-[64px] text-[#12131A] dark:text-[#F2F4F8]">
                        the app for decoding <br />
                        <span className="bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] bg-clip-text text-transparent">
                            complex research
                        </span>
                    </h1>

                    <p className="mb-10 max-w-lg text-[17px] leading-relaxed text-[#54586A] dark:text-[#A8AEBB]">
                        A new kind of AI assistant to help you tackle dense academic papers, extract key contributions, auto-generate flashcards, and chat directly with your documents.
                    </p>
                    <div className="flex gap-5 items-center justify-center">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link
                                href="/root"
                                className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#12131A] dark:bg-white px-8 font-semibold text-white dark:text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FileText size={20} />
                                Upload PDF Free
                            </Link>
                        </div>
                        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                            <Link
                                href="/about"
                                className="
      flex h-14 w-full sm:w-auto items-center justify-center
      rounded-xl px-8 font-semibold text-white
      bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500
      dark:from-violet-600 dark:via-fuchsia-600 dark:to-pink-600
      shadow-lg shadow-blue-500/20
      dark:shadow-violet-500/20
      transition-all duration-300
      hover:scale-[1.03]
      hover:shadow-xl
      active:scale-[0.98]
    "
                            >
                                About Briefly
                            </Link>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}