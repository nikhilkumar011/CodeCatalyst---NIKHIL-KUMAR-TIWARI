export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface DocumentData {
    summary?: string | null;
    contributions?: string[] | null;
    limitations?: string[] | null;
    flashcards?: any[] | null;
}