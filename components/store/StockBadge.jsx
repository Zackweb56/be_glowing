export function StockBadge({ stock }) {
  if (!stock) return null;
  const { quantity, alertThreshold } = stock;
  
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-semibold text-destructive ring-1 ring-inset ring-destructive/20">
        Out of Stock
      </span>
    );
  }
  
  if (quantity <= alertThreshold) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-500 ring-1 ring-inset ring-amber-500/20">
        Only {quantity} left!
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
      In Stock
    </span>
  );
}
