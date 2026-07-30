"use client";

import { authClient } from "@/lib/auth-client";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState,useRef } from "react";
import {BeatLoader} from 'react-spinners';
export default function Home() {

    const [file, setFile] = useState<File>()
    const router = useRouter();
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!file) return
        setLoading(true);

        try {

            const data = new FormData()
            data.set('file', file)

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
                    text: uploadData.data.text,
                }),
            });
            setLoading(false);

            router.push(`/dashboard/${uploadData.uploadedFileId}`);
        } catch (e: any) {
            console.error(e)
        }
    }

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
    const fileInputRef = useRef(null);



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

            <main className="relative z-10 mx-auto max-w-[900px] px-5 pb-16 pt-6">
                {/* Eyebrow */}
                <div className="mb-3.5 flex items-center justify-center gap-2 font-mono text-[11.5px] uppercase tracking-wider text-[#6B7180]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] shadow-[0_0_0_0_rgba(52,211,153,0.6)]" />
                    parsing engine warmed up · avg. 11s per paper
                </div>

                {/* Upload card */}
                <div className="rounded-2xl border border-dashed border-white/[0.16] bg-[rgba(18,22,34,0.55)] px-10 pb-9 pt-12 text-center backdrop-blur-[18px] transition-colors sm:px-6 sm:pb-8 sm:pt-8">
                    <div className="mx-auto mb-4.5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-xl text-white shadow-[0_0_24px_rgba(93,138,245,0.45)]">
                        ⬆
                    </div>
                    <h2 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-[19px] font-semibold">
                        Drag a paper here, or choose a file
                    </h2>
                    <p className="mb-5.5 text-[13.5px] text-[#A8AEBB]">
                        PDF, arXiv, or a straight-up DOI —{' '}
                        <span className="text-[#38E1F2]">first one&apos;s free</span>, no sign-up.
                    </p>

                    {/* Paste row */}
                    <form onSubmit={handleSubmit}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />

                        <div className="mb-5.5 flex flex-wrap justify-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] px-[18px] py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(93,138,245,0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
                            >
                                {file ? file.name : "Choose File"}
                            </button>

                            <button
                                type="submit"
                                disabled={!file || loading}
                                className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-[18px] py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(16,185,129,0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? <BeatLoader size={8} color="#ffffff" /> : "Upload & Analyze"}
                            </button>
                        </div>
                    </form>


                    {/* Error text (hidden state, kept for visual reference) */}
                    {/* <div className="mx-auto mt-2.5 flex max-w-[480px] items-center justify-center gap-1.5 text-[12.5px] text-[#F87171]">
            ⚠ <span>Error message</span>
          </div> */}

                    {/* Staged file (example / static preview) */}

                </div>

                {/* Pipeline card */}
                <div className="mt-5.5 rounded-[14px] border border-white/[0.08] bg-[rgba(18,22,34,0.55)] px-[30px] pb-5.5 pt-6.5 backdrop-blur-[18px] sm:px-5">
                    <div className="relative flex items-center justify-between">
                        {/* track line */}
                        <div className="absolute left-[8%] right-[8%] top-[15px] z-0 h-0.5 bg-white/10" />
                        <div className="absolute left-[8%] top-[15px] z-0 h-0.5 w-[42%] bg-gradient-to-r from-[#4F7DF3] to-[#34D399] transition-all" />

                        {[
                            { n: 1, label: 'Extract', state: 'done' },
                            { n: 2, label: 'Chunk', state: 'done' },
                            { n: 3, label: 'Embed', state: 'active' },
                            { n: 4, label: 'Analyze', state: '' },
                            { n: 5, label: 'Generate', state: '' },
                        ].map((step) => (
                            <div key={step.n} className="z-10 flex flex-1 flex-col items-center gap-2">
                                <div
                                    className={
                                        'flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[13px] font-bold transition-colors ' +
                                        (step.state
                                            ? 'border-transparent bg-[#34D399] text-[#04140d]'
                                            : 'border-white/[0.12] bg-white/[0.08] text-[#6B7180]')
                                    }
                                >
                                    {step.n}
                                </div>
                                <div
                                    className={
                                        'font-mono text-[10.5px] uppercase tracking-wider ' +
                                        (step.state ? 'text-[#F2F4F8]' : 'text-[#6B7180]')
                                    }
                                >
                                    {step.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-h-[20px] items-center gap-2 text-[13.5px] text-[#A8AEBB]">
                            <span>Generating embeddings for each chunk…</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button className="border-none bg-transparent p-0 text-[12.5px] text-[#6B7180] underline hover:text-[#A8AEBB]">
                                Cancel
                            </button>
                            <button className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] px-3.5 py-2 text-[13px] font-semibold text-white">
                                Open brief →
                            </button>
                        </div>
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
