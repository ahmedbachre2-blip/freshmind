export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-fresh-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fresh-600 text-white shadow-sm">
          <LeafIcon />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-fresh-800">
            CaducaScan
          </h1>
          <p className="text-xs text-slate-500">Control de caducidades</p>
        </div>
      </div>
    </header>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 19c8 0 13-6 14-14-8 1-14 6-14 14Z"
      />
      <path strokeLinecap="round" d="M8 16c2.5-2 5-6 6.5-10" />
    </svg>
  );
}
