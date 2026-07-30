
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pdfName = file?.name || "unknown.pdf";
    const session = await auth.api.getSession({
      headers:await headers()
    })

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

    const upfile = await prisma.uploadedFile.create({
      data: {
        name: pdfName,
        text: extractedText, 
        userId: session?.user?.id || null,
      },
    });

  return NextResponse.json({ 
  success: true,
  message: "File uploaded and parsed successfully", 
  uploadedFileId: upfile.id,
  text: extractedText,
  name: pdfName 
});

  } catch (error: any) {
    console.error("Upload Route Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF", details: error.message || String(error) },
      { status: 500 }
    );
  }
}