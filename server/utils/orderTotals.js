export function calculateCartPricing(items = []) {
  const subtotal = items.reduce((sum, item) => {
    const price = item?.product?.finalPrice ?? 0;
    const qty = item?.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return { subtotal, shipping, tax, total };
}
