"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";
import { daysUntil, statusFromDays } from "@/lib/expiration";
import type { ExpirationStatus, Product, ProductDraft } from "@/lib/types";

type ProductsContextValue = {
  products: Product[];
  counts: Record<ExpirationStatus, number>;
  addProduct: (draft: ProductDraft) => void;
  applyDiscount: (id: string) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const counts = useMemo(() => {
    const next: Record<ExpirationStatus, number> = {
      urgente: 0,
      pronto: 0,
      ok: 0,
    };
    for (const product of products) {
      next[statusFromDays(daysUntil(product.expirationDate))] += 1;
    }
    return next;
  }, [products]);

  const addProduct = useCallback((draft: ProductDraft) => {
    const product: Product = {
      ...draft,
      id: crypto.randomUUID(),
      discounted: false,
    };
    setProducts((current) => [product, ...current]);
  }, []);

  const applyDiscount = useCallback((id: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, discounted: true } : product
      )
    );
  }, []);

  const value = useMemo(
    () => ({ products, counts, addProduct, applyDiscount }),
    [products, counts, addProduct, applyDiscount]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts debe usarse dentro de ProductsProvider");
  }
  return ctx;
}
