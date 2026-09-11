"use client";

import { daysUntil, formatDaysLabel, statusFromDays } from "@/lib/expiration";
import type { Product } from "@/lib/types";

const STATUS_STYLES = {
  urgente: "bg-red-50 text-red-700 ring-red-100",
  pronto: "bg-amber-50 text-amber-700 ring-amber-100",
  ok: "bg-fresh-50 text-fresh-700 ring-fresh-100",
};

export function ProductCard({
  product,
  onDiscount,
}: {
  product: Product;
  onDiscount: (id: string) => void;
}) {
  const days = daysUntil(product.expirationDate);
  const status = statusFromDays(days);

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">
            {product.name}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">{product.category}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[status]}`}
        >
          {formatDaysLabel(days)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDiscount(product.id)}
        disabled={product.discounted}
        className="mt-3 w-full rounded-xl bg-fresh-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-fresh-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {product.discounted ? "Descuento aplicado" : "Aplicar Descuento"}
      </button>
    </article>
  );
}
