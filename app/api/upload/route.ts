
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pdfName = file?.name || "unknown.pdf";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const PDFParser = require("pdf2json");
    const pdfParser = new PDFParser(null, 1);

    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });

    const data = {
      name: pdfName,
      text: extractedText,
    };

    await prisma.uploadedFile.create({
      data: {
        name: pdfName,
        text: extractedText, 
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Upload Route Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF", details: error.message || String(error) },
      { status: 500 }
    );
  }
}