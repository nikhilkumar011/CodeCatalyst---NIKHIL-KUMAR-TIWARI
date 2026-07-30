import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

    const textContext = body.text || "[No document text available]";
    const messages = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing chat messages array." }, { status: 400 });
    }

    const { text } = await generateText({
      model: google("gemini-3.5-flash"),
      system: `You are an intelligent research assistant. 
      Answer questions using the provided document text context.
      If the document does not posses the required info use General knowledge however clearly state that this info is not present in the document provided ${textContext}`,
      messages,
    });

    return NextResponse.json({ success: true, answer: text });

  } catch (error: any) {
    console.error("Query Route Error:", error);
    return NextResponse.json(
      { error: "Your query could not be answered", details: error.message || String(error) },
      { status: 500 }
    );
  }
}