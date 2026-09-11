export type OffProduct = {
  barcode: string;
  name: string;
  brand?: string;
  category: string;
  imageUrl?: string;
};

type OffApiResponse = {
  status: number;
  product?: {
    product_name?: string;
    product_name_es?: string;
    brands?: string;
    categories_tags?: string[];
    categories?: string;
    image_front_small_url?: string;
    image_url?: string;
  };
};

const CATEGORY_MAP: Record<string, string> = {
  dairy: "Lácteos",
  milks: "Lácteos",
  yogurts: "Lácteos",
  cheeses: "Lácteos",
  breads: "Panadería",
  fruits: "Frutas",
  vegetables: "Verduras",
  meats: "Carnes",
  beverages: "Bebidas",
  snacks: "Snacks",
  seafood: "Pescado",
};

function mapCategory(tags: string[] = [], fallback = ""): string {
  const joined = `${tags.join(" ")} ${fallback}`.toLowerCase();
  for (const [key, label] of Object.entries(CATEGORY_MAP)) {
    if (joined.includes(key)) return label;
  }
  if (fallback) {
    const first = fallback.split(",")[0]?.trim();
    if (first) return first;
  }
  return "Otros";
}

export async function fetchOpenFoodFacts(barcode: string): Promise<OffProduct> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
    {
      headers: {
        "User-Agent": "CaducaScan/0.1 (supermarket expiration tracker)",
      },
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo consultar Open Food Facts");
  }

  const data = (await response.json()) as OffApiResponse;
  if (data.status !== 1 || !data.product) {
    return {
      barcode,
      name: "",
      category: "Otros",
    };
  }

  const product = data.product;
  return {
    barcode,
    name: product.product_name_es || product.product_name || "",
    brand: product.brands?.split(",")[0]?.trim(),
    category: mapCategory(product.categories_tags, product.categories),
    imageUrl: product.image_front_small_url || product.image_url,
  };
}
