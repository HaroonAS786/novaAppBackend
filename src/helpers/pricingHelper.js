function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotals(items, deliveryMethod = "standard") {
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  let shipping = 0;
  if (items.length > 0) {
    if (deliveryMethod === "express") shipping = 18;
    else if (deliveryMethod === "scheduled") shipping = 12;
    else shipping = subtotal >= 180 ? 0 : 9;
  }

  const tax = roundMoney(subtotal * 0.08);
  const total = roundMoney(subtotal + shipping + tax);
  const savings = roundMoney(
    items.reduce((sum, item) => {
      const originalPrice = item.product.originalPrice ?? item.product.price;
      return sum + (originalPrice - item.product.price) * item.quantity;
    }, 0)
  );

  return { subtotal, shipping, tax, total, savings };
}

module.exports = { calculateTotals, roundMoney };
