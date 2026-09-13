import { NextResponse } from "next/server";
import { extractReceiptItems } from "@/lib/receipt-ocr";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const items = await extractReceiptItems(imageBase64);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to extract receipt" },
      { status: 500 }
    );
  }
}