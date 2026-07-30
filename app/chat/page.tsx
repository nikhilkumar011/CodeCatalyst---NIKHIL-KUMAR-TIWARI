// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Send, ArrowLeft, Bot, User, FileText, AlignLeft, PanelRightClose, PanelRight, UploadCloud } from "lucide-react";
// import { BeatLoader } from "react-spinners";
// import { useRouter } from "next/navigation";

// interface Message {
//     role: "user" | "assistant";
//     content: string;
// }

// export default function ChatboxPage() {
//     const router = useRouter();
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
    
//     // Document States
//     const [documentText, setDocumentText] = useState("");
//     const [showDocument, setShowDocument] = useState(true);
    
//     // Upload States (if no document exists)
//     const [file, setFile] = useState<File>();
//     const [isUploading, setIsUploading] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
    
//     // Replacement Input Ref for Canvas
//     const replaceInputRef = useRef<HTMLInputElement>(null);

//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const savedText = sessionStorage.getItem("documentText");
//         if (savedText) {
//             setDocumentText(savedText);
//             setShowDocument(true);
//         }
//     }, []);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setIsDragging(false);
//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             setFile(e.dataTransfer.files[0]);
//         }
//     };

//     const handleUploadSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!file) return;
//         setIsUploading(true);

//         try {
//             const formData = new FormData();
//             formData.set("file", file);

//             const uploadRes = await fetch("/api/upload", {
//                 method: "POST",
//                 body: formData,
//             });

//             const uploadData = await uploadRes.json();

//             if (uploadData.text) {
//                 setDocumentText(uploadData.text);
//                 sessionStorage.setItem("documentText", uploadData.text);
//                 setShowDocument(true);
//             } else {
//                 alert("Could not extract text from this PDF.");
//             }
//         } catch (error) {
//             console.error("Upload error:", error);
//             alert("An error occurred during upload.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     // Handler to replace PDF directly from the canvas header without resetting chat
//     const handleReplacePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newFile = e.target.files?.[0];
//         if (!newFile) return;

//         try {
//             const formData = new FormData();
//             formData.set("file", newFile);

//             const uploadRes = await fetch("/api/upload", {
//                 method: "POST",
//                 body: formData,
//             });

//             const uploadData = await uploadRes.json();

//             if (uploadData.text) {
//                 setDocumentText(uploadData.text);
//                 sessionStorage.setItem("documentText", uploadData.text);
//             } else {
//                 alert("Could not extract text from the new PDF.");
//             }
//         } catch (error) {
//             console.error("Replacement error:", error);
//             alert("An error occurred while replacing the PDF.");
//         }
//     };

//     const handleChatSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const userMessage: Message = { role: "user", content: input };
//         const updatedMessages = [...messages, userMessage];

//         setMessages(updatedMessages);
//         setInput("");
//         setIsLoading(true);

//         try {
//             const response = await fetch("/api/query", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     text: documentText,
//                     messages: updatedMessages,
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok && data.success) {
//                 setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
//             } else {
//                 setMessages((prev) => [
//                     ...prev,
//                     { role: "assistant", content: `Error: ${data.error || "Could not retrieve answer."}` },
//                 ]);
//             }
//         } catch (error) {
//             setMessages((prev) => [...prev, { role: "assistant", content: "Error: Something went wrong." }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex h-screen w-full flex-col bg-[#05070d] font-sans text-[#F2F4F8] selection:bg-[#4F7DF3] selection:text-white overflow-hidden">
//             {/* Background elements */}
//             <div
//                 className="pointer-events-none fixed inset-0 z-0"
//                 style={{
//                     background:
//                         "radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.07), transparent 60%), radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.05), transparent 60%)",
//                 }}
//             />

//             {/* Global Header */}
//             <header className="relative z-20 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#05070d]/80 px-4 sm:px-6 backdrop-blur-xl">
//                 <div className="flex items-center gap-3 sm:gap-4">
//                     <button 
//                         onClick={() => router.back()}
//                         className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A8AEBB] transition-colors hover:bg-white/10 hover:text-white"
//                     >
//                         <ArrowLeft size={18} />
//                     </button>
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F7DF3]/20 to-[#9B5DE5]/20 text-[#4F7DF3] border border-[#4F7DF3]/30">
//                             <FileText size={18} />
//                         </div>
//                         <div>
//                             <h1 className="text-[14px] sm:text-[15px] font-semibold tracking-wide text-[#F2F4F8]">Gemini-Style Canvas</h1>
//                             <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#34D399]">
//                                 <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
//                                 {documentText ? "Workspace Active" : "Waiting for Document"}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {documentText && (
//                     <button
//                         onClick={() => setShowDocument(!showDocument)}
//                         className={`hidden lg:flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-all ${
//                             showDocument 
//                                 ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
//                                 : "border-[#4F7DF3]/30 bg-[#4F7DF3]/10 text-[#4F7DF3] hover:bg-[#4F7DF3]/20"
//                         }`}
//                     >
//                         {showDocument ? (
//                             <>
//                                 <PanelRightClose size={16} /> Hide Canvas Pane
//                             </>
//                         ) : (
//                             <>
//                                 <PanelRight size={16} /> Show Canvas Pane
//                             </>
//                         )}
//                     </button>
//                 )}
//             </header>

//             {/* Main Content Area */}
//             <div className="relative z-10 flex flex-1 overflow-hidden h-[calc(100vh-72px)] p-3 sm:p-6 gap-4 sm:gap-6">
                
//                 {!documentText ? (
//                     <div className="flex w-full h-full items-center justify-center p-4">
//                         <div 
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                             className={`w-full max-w-xl rounded-2xl border border-dashed px-6 sm:px-10 pb-10 sm:pb-14 pt-12 sm:pt-16 text-center backdrop-blur-[18px] transition-colors ${
//                                 isDragging 
//                                     ? 'border-[#38E1F2] bg-[rgba(56,225,242,0.1)]' 
//                                     : 'border-white/[0.16] bg-[rgba(18,22,34,0.55)]'
//                             }`}
//                         >
//                             <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-white shadow-[0_0_28px_rgba(93,138,245,0.5)]">
//                                 <UploadCloud size={32} />
//                             </div>
//                             <h2 className="mb-2.5 font-[Space_Grotesk,sans-serif] text-[22px] sm:text-[24px] font-semibold">
//                                 Initialize Canvas Session
//                             </h2>
//                             <p className="mb-8 text-[14px] sm:text-[15px] text-[#A8AEBB]">
//                                 Upload a PDF below to load your document onto the side-by-side canvas workspace.
//                             </p>

//                             <form onSubmit={handleUploadSubmit}>
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept=".pdf"
//                                     className="hidden"
//                                     onChange={(e) => setFile(e.target.files?.[0] || undefined)}
//                                 />

//                                 <div className="flex flex-col sm:flex-row justify-center gap-3">
//                                     <button
//                                         type="button"
//                                         onClick={() => fileInputRef.current?.click()}
//                                         className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
//                                     >
//                                         {file ? file.name : "Select PDF File"}
//                                     </button>

//                                     <button
//                                         type="submit"
//                                         disabled={!file || isUploading}
//                                         className="rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(93,138,245,0.6)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
//                                     >
//                                         {isUploading ? <BeatLoader size={8} color="#ffffff" /> : "Open Workspace"}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {/* LEFT BOX: Chat Interface Canvas */}
//                         <div className={`flex flex-col h-full rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.4)] backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden min-w-0 ${showDocument ? "w-full lg:w-1/2" : "w-full"}`}>
//                             <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.05] bg-white/[0.02] px-6 py-4">
//                                 <Bot size={16} className="text-[#4F7DF3]" />
//                                 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A8AEBB]">
//                                     Chat Assistant
//                                 </h2>
//                             </div>

//                             {/* Scrollable Messages Area */}
//                             <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-w-0">
//                                 <div className="flex flex-col space-y-6 pb-4 w-full">
//                                     {messages.length === 0 ? (
//                                         <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
//                                             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
//                                                 <Bot size={28} className="text-[#4F7DF3]" />
//                                             </div>
//                                             <h3 className="text-lg font-semibold text-[#F2F4F8]">Ask anything about your file</h3>
//                                             <p className="max-w-xs text-[14px] text-[#8B92A5] mt-1">
//                                                 Your document is open on the right canvas pane.
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         messages.map((msg, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`flex w-full gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
//                                             >
//                                                 <div className="flex-shrink-0 mt-1">
//                                                     {msg.role === "user" ? (
//                                                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] shadow-md">
//                                                             <User size={15} className="text-white" />
//                                                         </div>
//                                                     ) : (
//                                                         <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10">
//                                                             <Bot size={15} className="text-[#A8AEBB]" />
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <div
//                                                     className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm break-words overflow-hidden ${
//                                                         msg.role === "user"
//                                                             ? "bg-[#1E293B] text-[#F2F4F8] border border-white/5 rounded-tr-sm"
//                                                             : "bg-[rgba(18,22,34,0.7)] text-[#D7DAE2] border border-white/[0.08] rounded-tl-sm backdrop-blur-md"
//                                                     }`}
//                                                 >
//                                                     <div className="whitespace-pre-wrap break-words">{msg.content}</div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
                                    
//                                     {isLoading && (
//                                         <div className="flex w-full gap-3">
//                                             <div className="flex-shrink-0 mt-1">
//                                                 <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10">
//                                                     <Bot size={15} className="text-[#A8AEBB]" />
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center rounded-2xl rounded-tl-sm border border-white/[0.08] bg-[rgba(18,22,34,0.7)] px-5 py-4">
//                                                 <BeatLoader size={5} color="#4F7DF3" speedMultiplier={0.7} />
//                                             </div>
//                                         </div>
//                                     )}
//                                     <div ref={messagesEndRef} className="h-px w-full" />
//                                 </div>
//                             </div>

//                             {/* Chat Input Dock (Inside Left Box) */}
//                             <div className="shrink-0 p-4 border-t border-white/[0.06] bg-[#05070d]/40">
//                                 <form 
//                                     onSubmit={handleChatSubmit} 
//                                     className="relative flex items-center rounded-xl border border-white/10 bg-[rgba(18,22,34,0.9)] backdrop-blur-xl transition-all focus-within:border-[#4F7DF3]/50 focus-within:ring-2 focus-within:ring-[#4F7DF3]/10"
//                                 >
//                                     <input
//                                         type="text"
//                                         value={input}
//                                         onChange={(e) => setInput(e.target.value)}
//                                         placeholder="Ask a question about the document..."
//                                         className="w-full bg-transparent py-3 pl-4 pr-14 text-[14.5px] text-[#F2F4F8] placeholder-[#6B7180] outline-none"
//                                         disabled={isLoading}
//                                     />
//                                     <button
//                                         type="submit"
//                                         disabled={!input.trim() || isLoading}
//                                         className="absolute right-2 flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#4F7DF3] text-white shadow transition-all hover:bg-[#3b66d6] active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#6B7180]"
//                                     >
//                                         <Send size={15} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>

//                         {/* RIGHT BOX: PDF/Document Viewer Canvas with Replace PDF Option */}
//                         {showDocument && (
//                             <div className="hidden lg:flex w-1/2 h-full flex-col rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.4)] backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden min-w-0">
//                                 <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-6 py-4">
//                                     <div className="flex items-center gap-2">
//                                         <AlignLeft size={16} className="text-[#38E1F2]" />
//                                         <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A8AEBB]">
//                                             Document Canvas
//                                         </h2>
//                                     </div>
                                    
//                                     <div className="flex items-center gap-3">
//                                         {/* Hidden input for replacing PDF */}
//                                         <input
//                                             ref={replaceInputRef}
//                                             type="file"
//                                             accept=".pdf"
//                                             className="hidden"
//                                             onChange={handleReplacePDF}
//                                         />
//                                         <button
//                                             onClick={() => replaceInputRef.current?.click()}
//                                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-[#A8AEBB] hover:bg-white/10 hover:text-white transition-all"
//                                         >
//                                             <UploadCloud size={13} />
//                                             Replace PDF
//                                         </button>
//                                         <span className="font-mono text-[11px] text-[#6B7180] uppercase">Read-Only</span>
//                                     </div>
//                                 </div>
                                
//                                 {/* Independent Scrollable Document Canvas with Centering & Safe Container Widths */}
//                                 <div className="flex-1 p-6 sm:p-8 flex justify-center items-center overflow-hidden min-h-0 w-full">
//                                     <div className="w-full max-w-2xl h-full flex flex-col rounded-xl border border-white/5 bg-[#121622] p-6 sm:p-8 md:p-10 shadow-inner overflow-y-auto custom-scrollbar min-h-0 box-border">
//                                         <div className="whitespace-pre-wrap break-words font-serif text-[15px] leading-relaxed text-[#D7DAE2] w-full">
//                                             {documentText}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             <style jsx global>{`
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 6px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-track {
//                     background: transparent;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background: rgba(255, 255, 255, 0.1);
//                     border-radius: 10px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//                     background: rgba(255, 255, 255, 0.2);
//                 }
//             `}</style>
//         </div>
//     );
// }  


"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Bot, User, FileText, AlignLeft, PanelRightClose, PanelRight, UploadCloud } from "lucide-react";
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
    
    // Document States
    const [documentText, setDocumentText] = useState("");
    const [showDocument, setShowDocument] = useState(true);
    
    // Upload & Processing States
    const [file, setFile] = useState<File>();
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedText = sessionStorage.getItem("documentText");
        if (savedText) {
            setDocumentText(savedText);
            setShowDocument(true);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.set("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadData.text) {
                setDocumentText(uploadData.text);
                sessionStorage.setItem("documentText", uploadData.text);
                setShowDocument(true);
            } else {
                alert("Could not extract text from this PDF.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleReplacePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (!newFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.set("file", newFile);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadData.text) {
                setDocumentText(uploadData.text);
                sessionStorage.setItem("documentText", uploadData.text);
            } else {
                alert("Could not extract text from the new PDF.");
            }
        } catch (error) {
            console.error("Replacement error:", error);
            alert("An error occurred while replacing the PDF.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
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
        <div className="flex h-screen w-full flex-col bg-[#05070d] font-sans text-[#F2F4F8] selection:bg-[#4F7DF3] selection:text-white overflow-hidden">
            {/* Background elements */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.07), transparent 60%), radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.05), transparent 60%)",
                }}
            />

            {/* Global Header */}
            <header className="relative z-20 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#05070d]/80 px-4 sm:px-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 sm:gap-4">
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
                            <h1 className="text-[14px] sm:text-[15px] font-semibold tracking-wide text-[#F2F4F8]">Gemini-Style Canvas</h1>
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#34D399]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                {documentText ? "Workspace Active" : "Waiting for Document"}
                            </div>
                        </div>
                    </div>
                </div>

                {documentText && (
                    <button
                        onClick={() => setShowDocument(!showDocument)}
                        className={`hidden lg:flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-all ${
                            showDocument 
                                ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                                : "border-[#4F7DF3]/30 bg-[#4F7DF3]/10 text-[#4F7DF3] hover:bg-[#4F7DF3]/20"
                        }`}
                    >
                        {showDocument ? (
                            <>
                                <PanelRightClose size={16} /> Hide Viewer
                            </>
                        ) : (
                            <>
                                <PanelRight size={16} /> Show Viewer
                            </>
                        )}
                    </button>
                )}
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-1 overflow-hidden h-[calc(100vh-72px)] p-3 sm:p-6 gap-4 sm:gap-6">
                
                {!documentText ? (
                    <div className="flex w-full h-full items-center justify-center p-4">
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`w-full max-w-xl rounded-2xl border border-dashed px-6 sm:px-10 pb-10 sm:pb-14 pt-12 sm:pt-16 text-center backdrop-blur-[18px] transition-colors relative overflow-hidden ${
                                isDragging 
                                    ? 'border-[#38E1F2] bg-[rgba(56,225,242,0.1)]' 
                                    : 'border-white/[0.16] bg-[rgba(18,22,34,0.55)]'
                            }`}
                        >
                            {/* Processing Overlay UI */}
                            {isUploading && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#05070d]/85 backdrop-blur-md transition-all">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-white shadow-[0_0_30px_rgba(93,138,245,0.6)] animate-pulse">
                                        <FileText size={28} />
                                    </div>
                                    <h3 className="mb-2 font-[Space_Grotesk,sans-serif] text-xl font-semibold text-white">
                                        Processing your document...
                                    </h3>
                                    <p className="mb-6 text-sm text-[#A8AEBB]">
                                        Extracting text and preparing your workspace Document Viewer.
                                    </p>
                                    <BeatLoader size={8} color="#4F7DF3" />
                                </div>
                            )}

                            <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-white shadow-[0_0_28px_rgba(93,138,245,0.5)]">
                                <UploadCloud size={32} />
                            </div>
                            <h2 className="mb-2.5 font-[Space_Grotesk,sans-serif] text-[22px] sm:text-[24px] font-semibold">
                                Initialize Document Viewer Session
                            </h2>
                            <p className="mb-8 text-[14px] sm:text-[15px] text-[#A8AEBB]">
                                Upload a PDF below to load your document onto the side-by-side Viewer workspace.
                            </p>

                            <form onSubmit={handleUploadSubmit}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                                />

                                <div className="flex flex-col sm:flex-row justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
                                    >
                                        {file ? file.name : "Select PDF File"}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={!file || isUploading}
                                        className="rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(93,138,245,0.6)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Open Workspace
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* LEFT BOX: Chat Interface Canvas */}
                        <div className={`flex flex-col h-full rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.4)] backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden min-w-0 ${showDocument ? "w-full lg:w-1/2" : "w-full"}`}>
                            <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.05] bg-white/[0.02] px-6 py-4">
                                <Bot size={16} className="text-[#4F7DF3]" />
                                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A8AEBB]">
                                    Chat Assistant
                                </h2>
                            </div>

                            {/* Scrollable Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-w-0">
                                <div className="flex flex-col space-y-6 pb-4 w-full">
                                    {messages.length === 0 ? (
                                        <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                                                <Bot size={28} className="text-[#4F7DF3]" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#F2F4F8]">Ask anything about your file</h3>
                                            <p className="max-w-xs text-[14px] text-[#8B92A5] mt-1">
                                                Your document is open on the right document viewing pane.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex w-full gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    {msg.role === "user" ? (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#4F7DF3] to-[#9B5DE5] shadow-md">
                                                            <User size={15} className="text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10">
                                                            <Bot size={15} className="text-[#A8AEBB]" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm break-words overflow-hidden ${
                                                        msg.role === "user"
                                                            ? "bg-[#1E293B] text-[#F2F4F8] border border-white/5 rounded-tr-sm"
                                                            : "bg-[rgba(18,22,34,0.7)] text-[#D7DAE2] border border-white/[0.08] rounded-tl-sm backdrop-blur-md"
                                                    }`}
                                                >
                                                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    
                                    {isLoading && (
                                        <div className="flex w-full gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] border border-white/10">
                                                    <Bot size={15} className="text-[#A8AEBB]" />
                                                </div>
                                            </div>
                                            <div className="flex items-center rounded-2xl rounded-tl-sm border border-white/[0.08] bg-[rgba(18,22,34,0.7)] px-5 py-4">
                                                <BeatLoader size={5} color="#4F7DF3" speedMultiplier={0.7} />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} className="h-px w-full" />
                                </div>
                            </div>

                            {/* Chat Input Dock (Inside Left Box) */}
                            <div className="shrink-0 p-4 border-t border-white/[0.06] bg-[#05070d]/40">
                                <form 
                                    onSubmit={handleChatSubmit} 
                                    className="relative flex items-center rounded-xl border border-white/10 bg-[rgba(18,22,34,0.9)] backdrop-blur-xl transition-all focus-within:border-[#4F7DF3]/50 focus-within:ring-2 focus-within:ring-[#4F7DF3]/10"
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask a question about the document..."
                                        className="w-full bg-transparent py-3 pl-4 pr-14 text-[14.5px] text-[#F2F4F8] placeholder-[#6B7180] outline-none"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#4F7DF3] text-white shadow transition-all hover:bg-[#3b66d6] active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#6B7180]"
                                    >
                                        <Send size={15} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT BOX: PDF/Document Viewer Canvas with Processing Overlay & Replace Option */}
                        {showDocument && (
                            <div className="hidden lg:flex w-1/2 h-full flex-col rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.4)] backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden min-w-0 relative">
                                {isUploading && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#05070d]/85 backdrop-blur-md transition-all">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-white shadow-[0_0_30px_rgba(93,138,245,0.6)] animate-pulse">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="mb-1 text-lg font-semibold text-white">
                                            Replacing Document...
                                        </h3>
                                        <p className="mb-4 text-xs text-[#A8AEBB]">
                                            Extracting new text for the canvas.
                                        </p>
                                        <BeatLoader size={6} color="#4F7DF3" />
                                    </div>
                                )}

                                <div className="flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <AlignLeft size={16} className="text-[#38E1F2]" />
                                        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A8AEBB]">
                                            Document Viewer
                                        </h2>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <input
                                            ref={replaceInputRef}
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={handleReplacePDF}
                                        />
                                        <button
                                            onClick={() => replaceInputRef.current?.click()}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-[#A8AEBB] hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            <UploadCloud size={13} />
                                            Replace PDF
                                        </button>
                                        <span className="font-mono text-[11px] text-[#6B7180] uppercase">Read-Only</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 p-6 sm:p-8 flex justify-center items-center overflow-hidden min-h-0 w-full">
                                    <div className="w-full max-w-2xl h-full flex flex-col rounded-xl border border-white/5 bg-[#121622] p-6 sm:p-8 md:p-10 shadow-inner overflow-y-auto custom-scrollbar min-h-0 box-border">
                                        <div className="whitespace-pre-wrap break-words font-serif text-[15px] leading-relaxed text-[#D7DAE2] w-full">
                                            {documentText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}