"use client";
import React, { useEffect, useState } from 'react'
import { FileText, Upload, AlertCircle, Inbox } from 'lucide-react'
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface FileItem {
    id: string;
    name: string;
    size?: number;
    createdAt?: string;
}

function formatSize(bytes?: number) {
    if (!bytes) return null;
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }
    return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const Page = () => {
    const [data, setData] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('/api/upfiles');
                const ress = await res.json();

                if (!res.ok) {
                    setError(ress.message || 'Failed to load files');
                    return;
                }

                setData(ress);
            } catch (err) {
                console.error(err);
                setError('Something went wrong while fetching files');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0E14] px-8 py-10 text-[#1A1D24] dark:text-white">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1D24] dark:text-[#F2F4F8]">
                            Your files
                        </h1>
                        <p className="mt-1 text-[13px] text-[#6B7180] dark:text-[#6B7180]">
                            {loading ? 'Loading…' : `${data.length} file${data.length === 1 ? '' : 's'} uploaded`}
                        </p>
                    </div>

                    <Link href={'/root'}>
                    <button  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.55)] transition-shadow hover:shadow-[0_10px_32px_-6px_rgba(139,92,246,0.65)]">
                        <Upload size={16} />
                        Upload
                    </button>
                    </Link>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-[68px] animate-pulse rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03]"
                            />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-5 py-4 text-[13.5px] text-rose-600 dark:text-rose-300">
                        <AlertCircle size={18} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-6 py-16 text-center">
                        <Inbox size={32} className="mb-3 text-[#6B7180]" />
                        <p className="text-[14px] font-medium text-[#3F4451] dark:text-[#A8AEBB]">No files yet</p>
                        <p className="mt-1 text-[12.5px] text-[#6B7180] dark:text-[#6B7180]">
                            Upload a paper to see it show up here.
                        </p>
                    </div>
                )}

                {/* File list */}
                {!loading && !error && data.length > 0 && (
                    <div className="space-y-3">
                        {data.map((each) => (
                            <div
                                onClick={()=>redirect(`/dashboard/${each.id}`)}
                                key={each.id}
                                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] px-5 py-4 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.06]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 text-[#38E1F2]">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[14px] font-medium text-[#1A1D24] dark:text-[#F2F4F8]">
                                        {each.name}
                                    </p>
                                    <p className="mt-0.5 text-[12px] text-[#6B7180] dark:text-[#6B7180]">
                                        {[formatSize(each.size), formatDate(each.createdAt)]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;