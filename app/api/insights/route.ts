import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    
    console.log("DEBUG - Received body:", body);
    
    if (!body) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

    const textContext = body.text || "[No readable text found in this document]";
    
    const responseSchema : Schema = {
      type: SchemaType.OBJECT,
      properties: {
        summary: { type: SchemaType.STRING },
        contributions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        limitations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        flashcard: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: { question: { type: SchemaType.STRING }, answer: { type: SchemaType.STRING } },
            required: ["question", "answer"],
          },
        },
      },
      required: ["summary", "contributions", "limitations", "flashcard"],
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const prompt = `Analyze the following document text and extract the requested fields.
    Document Text: ${textContext.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    
    return NextResponse.json({ data: JSON.parse(result.response.text()) });
    
  } catch (error: any) {
    console.error("Insights Route Error:", error);
    return NextResponse.json({ error: "Insights generation failed", details: error.message }, { status: 500 });
  }
}