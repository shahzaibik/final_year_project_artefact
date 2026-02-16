export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative">
        {/* Spinner */}
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-tertiary)] border-t-[var(--color-primary)]"
          aria-hidden
        />
        {/* Logo/brand text below spinner */}
        <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">
          Dwella
        </p>
      </div>
    </div>
  );
}
