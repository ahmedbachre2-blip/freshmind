import type { ExpirationStatus } from "@/lib/types";

const CARDS: {
  key: ExpirationStatus;
  label: string;
  hint: string;
  accent: string;
  bg: string;
}[] = [
  {
    key: "urgente",
    label: "Urgente",
    hint: "≤ 3 días",
    accent: "text-red-600",
    bg: "bg-red-50 ring-red-100",
  },
  {
    key: "pronto",
    label: "Pronto",
    hint: "4–7 días",
    accent: "text-amber-600",
    bg: "bg-amber-50 ring-amber-100",
  },
  {
    key: "ok",
    label: "OK",
    hint: "> 7 días",
    accent: "text-fresh-700",
    bg: "bg-fresh-50 ring-fresh-100",
  },
];

export function SummaryCards({
  counts,
}: {
  counts: Record<ExpirationStatus, number>;
}) {
  return (
    <section className="grid grid-cols-3 gap-2">
      {CARDS.map((card) => (
        <article
          key={card.key}
          className={`rounded-2xl p-3 ring-1 ${card.bg}`}
        >
          <p className={`text-2xl font-semibold leading-none ${card.accent}`}>
            {counts[card.key]}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{card.label}</p>
          <p className="text-[11px] text-slate-500">{card.hint}</p>
        </article>
      ))}
    </section>
  );
}
