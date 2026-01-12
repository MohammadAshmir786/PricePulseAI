export function applySmartPrice(lowestPrice) {
  if (lowestPrice === undefined || lowestPrice === null || Number.isNaN(lowestPrice)) {
    return null;
  }
  const base = Number(lowestPrice) + 10;
  return Math.round(base * 100) / 100;
}
