"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductList } from "@/components/ProductList";
import { SummaryCards } from "@/components/SummaryCards";
import { ProductsProvider, useProducts } from "@/context/ProductsContext";

const ScannerModal = dynamic(
  () => import("@/components/ScannerModal").then((mod) => mod.ScannerModal),
  { ssr: false }
);

export function CaducaScanApp() {
  return (
    <ProductsProvider>
      <HomeScreen />
    </ProductsProvider>
  );
}

function HomeScreen() {
  const { products, counts, addProduct, applyDiscount } = useProducts();
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-lg flex-col gap-5 px-4 pb-28 pt-5">
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-fresh-600 px-4 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-fresh-700 active:scale-[0.99]"
        >
          <ScanIcon />
          Escanear Código
        </button>

        <SummaryCards counts={counts} />
        <ProductList products={products} onDiscount={applyDiscount} />
      </main>

      <ScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSave={addProduct}
      />
    </div>
  );
}

function ScanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 8V5h3M16 5h3v3M20 16v3h-3M8 19H5v-3" />
      <path strokeLinecap="round" d="M7 12h10" />
    </svg>
  );
}
