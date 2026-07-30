"use client";

import Image from "next/image";
import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { authClient } from "@/lib/auth-client";

/**
 * BRIEFLY — Sign up
 * ------------------------------------------------------------
 * Same design system as the login page: dark aurora backdrop,
 * "Access Constellation" node-orb hero, glassmorphism card with
 * a mouse-tracking gradient border. Recommended path in a Next.js
 * App Router project: app/signup/page.tsx.
 *
 * next/image is imported per your template but unused below since
 * every visual here is vector (SVG/CSS).
 */

// ---------- Small local UI atoms ----------------------------------------

const GoogleMark = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.66Z"
            fill="#4285F4"
        />
        <path
            d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
            fill="#34A853"
        />
        <path
            d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09Z"
            fill="#FBBC05"
        />
        <path
            d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
            fill="#EA4335"
        />
    </svg>
);

const GithubMark = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
);

const Checkbox = ({
    checked,
    onChange,
    id,
    label,
}: {
    checked: boolean;
    onChange: () => void;
    id: string;
    label: React.ReactNode;
}) => (
    <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer select-none group">
        <span className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0 mt-0.5">
            <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
            <span
                className="w-[18px] h-[18px] rounded-[5px] border transition-all duration-200
          border-white/20 bg-white/[0.03]
          peer-checked:border-transparent
          peer-checked:bg-gradient-to-br peer-checked:from-[#3B82F6] peer-checked:to-[#8B5CF6]
          peer-focus-visible:ring-2 peer-focus-visible:ring-[#22D3EE]/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#050816]
          group-hover:border-white/40"
            />
            <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
                viewBox="0 0 12 12"
                fill="none"
            >
                <path d="M2 6.2 4.8 9 10 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
        <span className="text-[13px] text-[#94A3B8] group-hover:text-white/80 transition-colors leading-relaxed">{label}</span>
    </label>
);

// ---------- Signature element: rotating node-orb ("Access Constellation") ----

const ACCESS_NODES: [number, number][] = [
    [50, 8], [83, 25], [92, 55], [72, 88], [40, 92],
    [12, 70], [10, 35], [30, 15], [63, 15], [78, 45],
    [65, 75], [30, 78], [22, 45], [50, 50],
];

const NODE_LINKS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
    [0, 8], [8, 1], [1, 9], [9, 2], [2, 10], [10, 3], [3, 11],
    [11, 4], [4, 12], [12, 5], [5, 6], [13, 0], [13, 2], [13, 4],
    [13, 6], [13, 8], [13, 10], [13, 12],
];

function AccessOrb() {
    return (
        <div className="relative w-[min(70vw,420px)] h-[min(70vw,420px)] mx-auto">
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40"
                style={{ background: "radial-gradient(circle, #3B82F6 0%, #8B5CF6 45%, transparent 70%)" }}
            />
            <motion.div
                className="absolute inset-[6%] rounded-full border border-[#22D3EE]/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ borderStyle: "dashed" }}
            />
            <motion.div
                className="absolute inset-[16%] rounded-full border border-[#8B5CF6]/25"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            />

            <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <defs>
                    <linearGradient id="edgeGradSignup" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.15" />
                    </linearGradient>
                    <radialGradient id="nodeGlowSignup">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {NODE_LINKS.map(([a, b], i) => (
                    <line
                        key={i}
                        x1={ACCESS_NODES[a][0]}
                        y1={ACCESS_NODES[a][1]}
                        x2={ACCESS_NODES[b][0]}
                        y2={ACCESS_NODES[b][1]}
                        stroke="url(#edgeGradSignup)"
                        strokeWidth="0.35"
                    />
                ))}

                {ACCESS_NODES.map(([x, y], i) => (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="url(#nodeGlowSignup)" opacity="0.6" />
                        <motion.circle
                            cx={x}
                            cy={y}
                            r={i === 13 ? 2.1 : 1.15}
                            fill={i === 13 ? "#FFFFFF" : "#22D3EE"}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        />
                    </g>
                ))}
            </motion.svg>

            <motion.div
                className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, #fff 0%, #3B82F6 60%, transparent 100%)" }}
                animate={{ scale: [1, 1.25, 1], boxShadow: ["0 0 20px #3B82F6", "0 0 40px #22D3EE", "0 0 20px #3B82F6"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

function Particles() {
    const dots = useMemo(
        () =>
            Array.from({ length: 22 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 2.5 + 1,
                dur: Math.random() * 10 + 10,
                delay: Math.random() * 6,
            })),
        []
    );
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {dots.map((d) => (
                <motion.span
                    key={d.id}
                    className="absolute rounded-full bg-[#22D3EE]"
                    style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
                    animate={{ y: [0, -18, 0], opacity: [0.15, 0.7, 0.15] }}
                    transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

// Simple password strength meter — purely visual, no library needed
function strengthOf(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
}
const STRENGTH_LABEL = ["Too short", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLOR = ["#f43f5e", "#f43f5e", "#f59e0b", "#22D3EE", "#10B981"];

// ---------- Sign-up page ---------------------------------------------------

export default function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        agreed?: string;
    }>({});
    const { signup } = useAuthStore();
    const cardRef = useRef<HTMLDivElement>(null);
    const [glow, setGlow] = useState({ x: 50, y: 50 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setGlow({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const strength = strengthOf(password);

    const validate = () => {
        const next: typeof errors = {};
        if (fullName.trim().length < 2) next.fullName = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
        if (password.length < 8) next.password = "Password must be at least 8 characters.";
        if (confirmPassword !== password) next.confirmPassword = "Passwords don't match.";
        if (!agreed) next.agreed = "You need to agree before continuing.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        signup({ email, password, fullName })
        setTimeout(() => setLoading(false), 1800);
    };

    const handleGoogleLogin = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/landingPage",
        })
    }

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 24,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                staggerChildren: 0.06,
                delayChildren: 0.15,
            },
        },
    };

    const fieldVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    return (
        <div>
            <div
                className="relative min-h-screen w-full overflow-hidden text-white antialiased"
                style={{ background: "#050816", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
            >
                {/* Aurora backdrop */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-[120px] opacity-30"
                        style={{ background: "#3B82F6" }}
                        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
                        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
                        style={{ background: "#8B5CF6" }}
                        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full blur-[110px] opacity-20"
                        style={{ background: "#22D3EE" }}
                        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />
                </div>

                <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
                    {/* LEFT — hero */}
                    <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 py-16 overflow-hidden">
                        <Particles />
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 flex items-center gap-2.5 self-start mb-4"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                                B
                            </div>
                            <span className="font-semibold tracking-tight text-lg">Briefly</span>
                        </motion.div>

                        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                            <AccessOrb />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative z-10 max-w-md text-center mt-6"
                        >
                            <h1 className="text-3xl xl:text-[2.4rem] font-semibold tracking-tight leading-[1.15]">
                                Stop skimming.
                                <br />
                                <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                                    Start understanding.
                                </span>
                            </h1>
                            <p className="mt-4 text-[#94A3B8] text-[15px] leading-relaxed">
                                Create your account and let Briefly turn any paper into
                                grounded claims, flashcards, and a brief you can trust.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT — sign-up card */}
                    <div className="flex w-full lg:w-1/2 items-center justify-center px-5 sm:px-8 py-10">
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="relative w-full max-w-[420px] rounded-[24px] p-[1px] overflow-hidden group"
                            style={{
                                background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, rgba(34,211,238,0.5), rgba(139,92,246,0.25) 40%, rgba(255,255,255,0.06) 70%)`,
                            }}
                        >
                            <div className="rounded-[23px] bg-[#0A0E1F]/80 backdrop-blur-2xl border border-white/[0.06] px-7 sm:px-9 py-9 sm:py-10 shadow-[0_8px_60px_-12px_rgba(59,130,246,0.25)]">
                                {/* mobile logo */}
                                <motion.div variants={fieldVariants} className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-bold text-sm">
                                        B
                                    </div>
                                    <span className="font-semibold tracking-tight text-lg">Briefly</span>
                                </motion.div>

                                <motion.div variants={fieldVariants}>
                                    <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
                                    <p className="mt-1.5 text-sm text-[#94A3B8]">Start briefing papers in under a minute.</p>
                                </motion.div>

                                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
                                    {/* Full name */}
                                    <motion.div variants={fieldVariants}>
                                        <label htmlFor="fullName" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                                            Full name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                id="fullName"
                                                type="text"
                                                autoComplete="name"
                                                placeholder="Ada Lovelace"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                aria-invalid={!!errors.fullName}
                                                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                                                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder:text-[#5b6478] outline-none transition-all duration-300
                          focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.fullName && (
                                                <motion.p
                                                    id="fullName-error"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1.5 text-xs text-rose-400"
                                                >
                                                    {errors.fullName}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Email */}
                                    <motion.div variants={fieldVariants}>
                                        <label htmlFor="email" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@university.edu"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                aria-invalid={!!errors.email}
                                                aria-describedby={errors.email ? "email-error" : undefined}
                                                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder:text-[#5b6478] outline-none transition-all duration-300
                          focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.p
                                                    id="email-error"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1.5 text-xs text-rose-400"
                                                >
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Password */}
                                    <motion.div variants={fieldVariants}>
                                        <label htmlFor="password" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                aria-invalid={!!errors.password}
                                                aria-describedby={errors.password ? "password-error" : "password-strength"}
                                                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-10 py-2.5 text-[14px] text-white placeholder:text-[#5b6478] outline-none transition-all duration-300
                          focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* strength meter */}
                                        {password.length > 0 && (
                                            <div id="password-strength" className="mt-2">
                                                <div className="flex gap-1.5">
                                                    {[0, 1, 2, 3].map((i) => (
                                                        <span
                                                            key={i}
                                                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                                                            style={{
                                                                background: i < strength ? STRENGTH_COLOR[strength] : "rgba(255,255,255,0.08)",
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="mt-1 text-[11px] text-[#5b6478]">{STRENGTH_LABEL[strength]}</p>
                                            </div>
                                        )}
                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.p
                                                    id="password-error"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1.5 text-xs text-rose-400"
                                                >
                                                    {errors.password}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Confirm password */}
                                    <motion.div variants={fieldVariants}>
                                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                                            Confirm password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                aria-invalid={!!errors.confirmPassword}
                                                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder:text-[#5b6478] outline-none transition-all duration-300
                          focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.confirmPassword && (
                                                <motion.p
                                                    id="confirmPassword-error"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1.5 text-xs text-rose-400"
                                                >
                                                    {errors.confirmPassword}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Terms agreement */}
                                    <motion.div variants={fieldVariants} className="pt-1">
                                        <Checkbox
                                            id="agreed"
                                            checked={agreed}
                                            onChange={() => setAgreed((a) => !a)}
                                            label={
                                                <>
                                                    I agree to Briefly&apos;s{" "}
                                                    <a href="#terms" className="text-[#22D3EE] hover:text-[#67e8f9] underline">
                                                        Terms
                                                    </a>{" "}
                                                    and{" "}
                                                    <a href="#privacy" className="text-[#22D3EE] hover:text-[#67e8f9] underline">
                                                        Privacy Policy
                                                    </a>
                                                    .
                                                </>
                                            }
                                        />
                                        <AnimatePresence>
                                            {errors.agreed && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-1.5 text-xs text-rose-400"
                                                >
                                                    {errors.agreed}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Submit */}
                                    <motion.button
                                        variants={fieldVariants}
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative w-full mt-2 rounded-xl py-2.75 font-medium text-[14px] text-white overflow-hidden
                      bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]
                      shadow-[0_8px_24px_-6px_rgba(59,130,246,0.55)]
                      transition-shadow duration-300 hover:shadow-[0_10px_32px_-6px_rgba(139,92,246,0.65)]
                      disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1F]"
                                        style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Creating account…
                                                </>
                                            ) : (
                                                <>
                                                    Create account <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                {/* Divider */}
                                <motion.div variants={fieldVariants} className="flex items-center gap-3 my-6">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <span className="text-[11px] uppercase tracking-wider text-[#5b6478]">Or continue with</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                </motion.div>

                                {/* Social */}
                                <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Google", icon: <GoogleMark className="w-4 h-4" /> },
                                        { label: "GitHub", icon: <GithubMark className="w-4 h-4" /> },
                                    ].map((s) => (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={s.label === "Google" ? handleGoogleLogin : undefined}
                                            aria-label={`Continue with ${s.label}`}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-white/80 text-[13px]
                        transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
                                        >
                                            {s.icon}
                                            {s.label}
                                        </button>
                                    ))}
                                </motion.div>

                                {/* Login link */}
                                <motion.p variants={fieldVariants} className="mt-7 text-center text-[13px] text-[#94A3B8]">
                                    Already have an account?{" "}
                                    <Link href={'/login'} className="text-white font-medium hover:text-[#22D3EE] transition-colors">
                                        Sign in
                                    </Link>
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}