import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
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
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not set");
    return [];
  }

  const prompt = "Analiza esta imagen de un ticket de supermercado. Extrae TODOS los productos. Devuelve SOLO un array JSON valido con esta estructura: [{\"name\":\"nombre del producto\",\"quantity\":1,\"totalPrice\":1.20}]. Sin texto adicional antes o despues, solo el array JSON.";

  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "";
    console.error("Groq raw response:", content.substring(0, 500));

    if (!content) return [];

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Groq error:", error);
    return [];
  }
}