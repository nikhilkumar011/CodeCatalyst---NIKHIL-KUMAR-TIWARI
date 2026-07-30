"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Bot, User, FileText } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatboxPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [documentText, setDocumentText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedText = sessionStorage.getItem("documentText");
        if (savedText) {
            setDocumentText(savedText);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: documentText,
                    messages: updatedMessages,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: `Error: ${data.error || "Could not retrieve answer."}` },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Error: Something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-[#05070d] font-sans text-[#F2F4F8] selection:bg-[#4F7DF3] selection:text-white">
            {/* Background elements */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.07), transparent 60%), radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.05), transparent 60%)",
                }}
            />

            {/* Header */}
            <header className="relative z-20 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#05070d]/80 px-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A8AEBB] transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F7DF3]/20 to-[#9B5DE5]/20 text-[#4F7DF3] border border-[#4F7DF3]/30">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h1 className="text-[15px] font-semibold tracking-wide text-[#F2F4F8]">Document Assistant</h1>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#34D399]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                Ready
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="relative z-10 flex-1 overflow-y-auto scroll-smooth p-6 pb-32">
                <div className="mx-auto flex max-w-3xl flex-col space-y-8">
                    {messages.length === 0 ? (
                        <div className="mt-32 flex flex-col items-center justify-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/[0.08] shadow-2xl">
                                <Bot size={32} className="text-[#4F7DF3]" />
                            </div>
                            <h2 className="mb-2 text-xl font-semibold text-[#F2F4F8]">How can I help?</h2>
                            <p className="max-w-md text-[15px] leading-relaxed text-[#8B92A5]">
                                I have analyzed your document. Ask me for summaries, specific data points, or explanations of complex concepts within the text.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex w-full gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 mt-1">
                                    {msg.role === "user" ? (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] shadow-lg">
                                            <User size={18} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10 shadow-sm">
                                            <Bot size={18} className="text-[#A8AEBB]" />
                                        </div>
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={`relative max-w-[85%] rounded-2xl px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                                        msg.role === "user"
                                            ? "bg-[#1E293B] text-[#F2F4F8] border border-white/5 rounded-tr-sm"
                                            : "bg-[rgba(18,22,34,0.4)] text-[#D7DAE2] border border-white/[0.08] rounded-tl-sm backdrop-blur-md"
                                    }`}
                                >
                                    {/* whitespace-pre-wrap ensures paragraphs and spacing from the AI format correctly */}
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex w-full gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10 shadow-sm">
                                    <Bot size={18} className="text-[#A8AEBB]" />
                                </div>
                            </div>
                            <div className="flex max-w-[85%] items-center rounded-2xl rounded-tl-sm border border-white/[0.08] bg-[rgba(18,22,34,0.4)] px-6 py-5 backdrop-blur-md">
                                <BeatLoader size={6} color="#4F7DF3" speedMultiplier={0.7} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-px w-full" />
                </div>
            </main>

            {/* Input Dock */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#05070d] via-[#05070d]/90 to-transparent pb-8 pt-12 px-6">
                <div className="mx-auto max-w-3xl">
                    <form 
                        onSubmit={handleSubmit} 
                        className="relative flex items-center rounded-2xl border border-white/10 bg-[rgba(18,22,34,0.8)] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all focus-within:border-[#4F7DF3]/50 focus-within:bg-[rgba(18,22,34,0.95)] focus-within:ring-4 focus-within:ring-[#4F7DF3]/10"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message the assistant..."
                            className="w-full bg-transparent py-4 pl-6 pr-16 text-[15px] text-[#F2F4F8] placeholder-[#6B7180] outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2.5 flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#4F7DF3] text-white shadow-md transition-all hover:bg-[#3b66d6] active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#6B7180]"
                        >
                            <Send size={16} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
                        </button>
                    </form>
                    <div className="mt-3 text-center text-[11px] text-[#6B7180]">
                        AI can make mistakes. Consider verifying important information.
                    </div>
                </div>
            </div>
        </div>
    );
}