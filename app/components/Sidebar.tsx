"use client"
import { authClient } from "@/lib/auth-client";
import { Home, Upload, LayoutDashboard, History, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";



export default function Sidebar() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/login')
    }

   
    return (
        <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-shrink-0 flex-col border-r border-white/[0.08] bg-black px-4 py-6 backdrop-blur-[18px]">
            {/* Top: user info */}
            <div className="mb-8 flex items-center gap-3 border-b border-white/[0.08] pb-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-sm font-semibold text-white shadow-[0_0_16px_rgba(93,138,245,0.4)]">
                    {
                        session?.user?.name
                            ? session.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "JD"
                    }
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#F2F4F8]">
                        {session?.user?.name || "John Doe"}
                    </p>
                    <p className="truncate text-[12px] text-[#6B7180]">
                        {session?.user?.email}
                    </p>
                </div>
            </div>

            {/* Middle: navigation links */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
                <p className="mb-2 px-3 font-mono text-[10.5px] uppercase tracking-wider text-[#6B7180]">
                    Menu
                </p>

                <Link
                    href="/landingPage"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${pathname === "/landingPage"
                        ? "bg-white/[0.06] text-[#F2F4F8]"
                        : "text-[#A8AEBB] hover:bg-white/[0.05] hover:text-[#F2F4F8]"
                        }`}
                >
                    <Home size={17} className={pathname === "/root" ? "text-[#38E1F2]" : "text-[#6B7180]"} />
                    Home
                </Link>

                <Link
                    href="/root"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${pathname === "/root"
                            ? "bg-white/[0.06] text-[#F2F4F8]"
                            : "text-[#A8AEBB] hover:bg-white/[0.05] hover:text-[#F2F4F8]"
                        }`}
                >
                    <Upload
                        size={17}
                        className={pathname === "/root" ? "text-[#38E1F2]" : "text-[#6B7180]"}
                    />
                    Upload Paper
                </Link>
                <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#A8AEBB] transition-colors hover:bg-white/[0.05] hover:text-[#F2F4F8]"
                >
                    <LayoutDashboard size={17} className="text-[#6B7180]" />
                    Dashboard
                </a>

                <Link
                    href="/history"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${pathname === "/history"
                        ? "bg-white/[0.06] text-[#F2F4F8]"
                        : "text-[#A8AEBB] hover:bg-white/[0.05] hover:text-[#F2F4F8]"
                        }`}
                >
                    <History size={17} className={pathname === "/history" ? "text-[#38E1F2]" : "text-[#6B7180]"} />
                    History
                </Link>

                <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#A8AEBB] transition-colors hover:bg-white/[0.05] hover:text-[#F2F4F8]"
                >
                    <Settings size={17} className="text-[#6B7180]" />
                    Settings
                </a>
            </nav>

            {/* Bottom: logout */}
            <div className="border-t border-white/[0.08] pt-4">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-[#F87171] transition-colors hover:bg-[rgba(248,113,113,0.1)]">
                    <LogOut size={17} />
                    Logout
                </button>
            </div>
        </aside>
    );
}