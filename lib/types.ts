export type ExpirationStatus = "urgente" | "pronto" | "ok";

export type FilterTab = "todos" | ExpirationStatus;

export type Product = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  brand?: string;
  imageUrl?: string;
  expirationDate: string;
  discounted: boolean;
};

export type ProductDraft = {
  barcode: string;
  name: string;
  category: string;
  brand?: string;
  imageUrl?: string;
  expirationDate: string;
};
