"use client";

import { authClient } from "@/lib/auth-client";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { BeatLoader } from 'react-spinners';

export default function Home() {
    const [file, setFile] = useState<File>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) return;
        setLoading(true);

        try {
            const data = new FormData();
            data.set('file', file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            const uploadData = await uploadRes.json();

            await fetch("/api/insights", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uploadedFileId: uploadData.uploadedFileId,
                    text: uploadData.text,
                }),
            });
            
            setLoading(false);
            router.push(`/dashboard/${uploadData.uploadedFileId}`);
        } catch (e: any) {
            console.error(e);
            setLoading(false);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            // You can add validation here (e.g., droppedFile.type === "application/pdf")
            setFile(droppedFile);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await authClient.getSession();

            if (!data) {
                window.location.href = "/login";
            }
        };

        checkSession();
    }, []);

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/login";
                },
            },
        });
    };

    const features = [
        {
            icon: "📝",
            title: "Instant Summaries",
            description: "Get a clear, concise summary of any research paper in seconds — no more skimming 20 pages.",
        },
        {
            icon: "🎯",
            title: "Key Contributions",
            description: "We surface the paper's core contributions so you know exactly what's new and why it matters.",
        },
        {
            icon: "⚠️",
            title: "Limitations Called Out",
            description: "Every paper has caveats. We extract them so you don't have to dig through the discussion section.",
        },
        {
            icon: "🧠",
            title: "Auto-Generated Flashcards",
            description: "Turn dense papers into bite-sized Q&A flashcards, perfect for revision and quick recall.",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#05070d] text-[#F2F4F8] font-sans">
            {/* Background glows */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        'radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.14), transparent 60%), radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.10), transparent 60%)',
                }}
            />
            {/* Grid overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                    maskImage:
                        'radial-gradient(ellipse 60% 50% at 50% 20%, black 20%, transparent 80%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 60% 50% at 50% 20%, black 20%, transparent 80%)',
                }}
            />

            <main className="relative z-10 mx-auto max-w-[900px] px-5 pb-20 pt-10">
                {/* Eyebrow */}
                <div className="mb-5 flex items-center justify-center gap-2 font-mono text-[11.5px] uppercase tracking-wider text-[#6B7180]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] shadow-[0_0_0_0_rgba(52,211,153,0.6)]" />
                    parsing engine warmed up · avg. 11s per paper
                </div>

                {/* Upload card - Updated with Drag & Drop events and dynamic styling */}
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-2xl border border-dashed px-10 pb-14 pt-16 text-center backdrop-blur-[18px] transition-colors sm:px-6 sm:pb-10 sm:pt-10 ${
                        isDragging 
                            ? 'border-[#38E1F2] bg-[rgba(56,225,242,0.1)]' 
                            : 'border-white/[0.16] bg-[rgba(18,22,34,0.55)]'
                    }`}
                >
                    <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-2xl text-white shadow-[0_0_28px_rgba(93,138,245,0.5)]">
                        ⬆
                    </div>
                    <h2 className="mb-2.5 font-[Space_Grotesk,sans-serif] text-[26px] font-semibold sm:text-[22px]">
                        Drag a paper here, or choose a file
                    </h2>
                    <p className="mb-8 text-[15px] text-[#A8AEBB]">
                        Please upload your PDF below{' '}
                    </p>

                    {/* Paste row */}
                    <form onSubmit={handleSubmit}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                        />

                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(93,138,245,0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
                            >
                                {file ? file.name : "Choose File"}
                            </button>

                            <button
                                type="submit"
                                disabled={!file || loading}
                                className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(16,185,129,0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? <BeatLoader size={8} color="#ffffff" /> : "Upload & Analyze"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Feature cards */}
                <div className="mt-14">
                    <h3 className="mb-1 text-center text-[13px] font-semibold uppercase tracking-wider text-[#6B7180]">
                        What you get
                    </h3>
                    <p className="mb-8 text-center text-[15px] text-[#A8AEBB]">
                        Upload any research paper and let us do the reading for you.
                    </p>

                    <div className="flex justify-center gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="w-[220px] flex-1 min-w-[220px] max-w-[260px] rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.55)] p-6 text-left backdrop-blur-[18px] transition-transform hover:-translate-y-1 hover:border-white/[0.15]"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
                                    {feature.icon}
                                </div>
                                <h4 className="mb-1.5 text-[15px] font-semibold text-[#F2F4F8]">
                                    {feature.title}
                                </h4>
                                <p className="text-[13.5px] leading-relaxed text-[#A8AEBB]">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Toast (static, hidden by default) */}
            <div className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-[9px] border border-white/10 bg-[#151a26] px-[18px] py-2.5 text-[13px] text-white opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                Toast message
            </div>
        </div>
    );
}