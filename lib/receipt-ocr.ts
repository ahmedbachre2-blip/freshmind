import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://gateway.vlm.run/v1/openai",
  apiKey: "vlmrun",
});

export interface ReceiptItem {
  name: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export async function extractReceiptItems(
  imageBase64: string
): Promise<ReceiptItem[]> {
  const prompt = "Analiza esta imagen de un ticket de supermercado. Extrae TODOS los productos con esta informacion en formato JSON: name (nombre del producto en espanol), quantity (cantidad si esta visible), unitPrice (precio por unidad si esta visible), totalPrice (precio total si esta visible). Devuelve SOLO un array JSON valido, sin texto adicional.";

  const response = await client.chat.completions.create({
    model: "zai-org/glm-ocr",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: "data:image/jpeg;base64," + imageBase64,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "[]";
  const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : parsed.items || parsed.products || [];
  } catch {
    return [];
  }
}