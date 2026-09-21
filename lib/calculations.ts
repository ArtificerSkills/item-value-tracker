export type ItemLike = {
  purchasePrice: number;
  additionalCosts: number;
  currentValue: number | null;
  purchaseDate: Date;
  depreciationModel: string;
  annualRate: number | null;
};

export function invested(item: ItemLike) {
  return item.purchasePrice + item.additionalCosts;
}

export function estimatedValue(item: ItemLike, now = new Date()) {
  const total = invested(item);
  if (item.currentValue !== null) return item.currentValue;

  const years = Math.max(
    0,
    (now.getTime() - item.purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  const rate = item.annualRate ?? 0;

  if (item.depreciationModel === "straight-line") {
    return Math.max(0, total * (1 - rate * years));
  }

  if (item.depreciationModel === "declining-balance") {
    return Math.max(0, total * Math.pow(Math.max(0, 1 - rate), years));
  }

  return total;
}

export function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(value);
}